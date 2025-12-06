package com.oquga.oquga.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oquga.oquga.config.AiConfig;
import com.oquga.oquga.dto.ai.req.ChatRequest;
import com.oquga.oquga.dto.ai.res.ChatResponse;
import com.oquga.oquga.entity.University;
import com.oquga.oquga.entity.translation.UniversityTranslation;
import com.oquga.oquga.repository.EducationalProgramGroupRepository;
import com.oquga.oquga.repository.UniversityRepository;
import com.oquga.oquga.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

    private final AiConfig aiConfig;
    private final UniversityRepository universityRepository;
    private final EducationalProgramGroupRepository programGroupRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .build();

    private final Map<String, TestSession> activeSessions = new ConcurrentHashMap<>();

    private static final int TOTAL_QUESTIONS = 10;

    private static class TestSession {
        String sessionId;
        int currentQuestionIndex;
        List<String> accumulatedProfile;
        Set<String> usedQuestionTypes;
        long createdAt;

        TestSession(String sessionId) {
            this.sessionId = sessionId;
            this.currentQuestionIndex = 0;
            this.accumulatedProfile = new ArrayList<>();
            this.usedQuestionTypes = new HashSet<>();
            this.createdAt = System.currentTimeMillis();
        }
    }

    private static final String SYSTEM_PROMPT_CHAT = """
            Ты - AI-помощник платформы Oquga.kz (образование в Казахстане).
            Твоя цель: помогать абитуриентам выбирать профессию и университет.
            
            Если пользователь не знает, кем стать, или просит совета по выбору -> ПРЕДЛОЖИ ПРОЙТИ ИНТЕРАКТИВНЫЙ ТЕСТ.
            Если пользователь спрашивает конкретную информацию об университете -> ответь, используя свои знания (или скажи, что поищешь).
            
            Твой тон: дружелюбный, молодежный, но экспертный. Используй эмодзи.
            """;

    private static final String SYSTEM_PROMPT_GENERATOR = """
            Ты - генератор интерактивного квеста профориентации.
            Твоя задача: на основе профиля пользователя сгенерировать СЛЕДУЮЩИЙ уникальный вопрос в формате JSON.
            
            Всего 10 шагов. Каждый шаг должен раскрывать новую грань личности (soft skills, hard skills, ценности, интересы, стиль работы).
            
            Доступные типы вопросов (Interactive Types):
            1. 'image_choice' - выбор из картинок (суперсила, мечта, рабочее место).
            2. 'scenario_choice' - текстовый выбор сценария.
            3. 'drag_rank' - ранжирование предметов или ценностей.
            4. 'skill_bars' - распределение 100 очков (бюджет, навыки).
            5. 'versus_choice' - выбор из двух противоположностей (батл).
            6. 'swipe_cards' - свайп (да/нет) сфер деятельности.
            7. 'multiple_choice' - выбор нескольких вариантов.
            
            ВАЖНО:
            - Не повторяй вопросы и типы, которые уже были (history).
            - Генерируй структуру JSON строго по схеме InteractiveElement.
            - Options должны иметь уникальные ID.
            - Вопросы должны быть интересными, не скучными.
            - Язык: Русский.
            
            Формат JSON ответа (только JSON, без Markdown):
            {
               "type": "тип_вопроса",
               "questionId": "уникальный_id",
               "question": "Текст вопроса",
               "description": "Подсказка",
               "stage": "Название этапа (например, 'Исследование')",
               "options": [
                  {"id": "opt1", "label": "Вариант 1", "description": "Описание", "emoji": "🔥"}
               ]
            }
            """;

    private static final String SYSTEM_PROMPT_ANALYZER = """
            Ты - аналитик профориентации.
            Твоя задача: проанализировать ответы пользователя и сгенерировать поисковые запросы для базы данных университетов Казахстана.
            
            Входные данные: список ответов и фактов о пользователе.
            
            Ты должен вернуть JSON с двумя полями:
            1. 'searchKeywords': массив строк для поиска по базе (названия программ, сферы, ключевые слова). Используй ILIKE формат для SQL (например, '%IT%', '%Медицина%').
            2. 'analysisText': краткий текст (2-3 предложения) с описанием профиля пользователя.
            3. 'recommendedProfessions': массив объектов {id, name, description, matchPercent} (топ 3 профессии).
            
            Пример ключевых слов: ['%Информацион%', '%Программ%', '%Дизайн%', '%Архитектур%'].
            """;

    @Override
    @Transactional // Добавили транзакцию для работы с Lazy-сущностями
    public ChatResponse chat(ChatRequest request) {
        if (aiConfig.getApiKey() == null || aiConfig.getApiKey().isBlank()) {
            throw new RuntimeException("AI API key is not configured");
        }

        String lastMessage = request.messages().isEmpty() ? "" :
                request.messages().get(request.messages().size() - 1).content().toLowerCase();

        if (request.interactiveAnswer() != null && request.sessionContext() != null) {
            return processTestAnswer(
                    request.sessionContext().sessionId(),
                    request.interactiveAnswer(),
                    request.sessionContext()
            );
        }

        if (shouldStartTest(lastMessage)) {
            String sessionId = UUID.randomUUID().toString();
            return startCareerTest(sessionId);
        }

        return callAiForChat(request);
    }

    private boolean shouldStartTest(String message) {
        return message.contains("тест") ||
                message.contains("профориентац") ||
                message.contains("подобрать") ||
                message.contains("выбрать вуз") ||
                message.contains("старт") ||
                message.contains("начать");
    }

    @Override
    public ChatResponse startCareerTest(String sessionId) {
        TestSession session = new TestSession(sessionId);
        activeSessions.put(sessionId, session);
        cleanOldSessions();
        return generateNextQuestion(session, "Начало пути. Узнаем базовые интересы.");
    }

    @Override
    @Transactional
    public ChatResponse processTestAnswer(String sessionId, ChatRequest.InteractiveAnswerDto answer, ChatRequest.SessionContextDto context) {
        TestSession session = activeSessions.get(sessionId);

        if (session == null) {
            session = new TestSession(sessionId);
            if (context != null) {
                session.currentQuestionIndex = context.questionNumber();
            }
            activeSessions.put(sessionId, session);
        }

        updateUserProfile(session, answer);
        session.currentQuestionIndex++;

        if (session.currentQuestionIndex >= TOTAL_QUESTIONS) {
            return generateFinalResults(session);
        }

        return generateNextQuestion(session, null);
    }

    private void updateUserProfile(TestSession session, ChatRequest.InteractiveAnswerDto answer) {
        if (answer.selectedOptionIds() != null) {
            session.accumulatedProfile.addAll(answer.selectedOptionIds());
        }
        if (answer.scaleValues() != null) {
            answer.scaleValues().forEach((k, v) -> {
                if (v > 5) session.accumulatedProfile.add(k + "_high");
            });
        }
    }

    private ChatResponse generateNextQuestion(TestSession session, String contextOverride) {
        try {
            String userProfileStr = String.join(", ", session.accumulatedProfile);
            String usedTypesStr = String.join(", ", session.usedQuestionTypes);

            String prompt = String.format(
                    "Шаг %d/%d. Профиль пользователя (теги): [%s]. Использованные типы вопросов: [%s]. %s",
                    session.currentQuestionIndex + 1,
                    TOTAL_QUESTIONS,
                    userProfileStr,
                    usedTypesStr,
                    contextOverride != null ? contextOverride : "Сгенерируй следующий логичный вопрос."
            );

            String jsonResponse = callLlm(SYSTEM_PROMPT_GENERATOR, prompt, true);
            JsonNode questionNode = objectMapper.readTree(jsonResponse);

            String type = questionNode.get("type").asText();
            session.usedQuestionTypes.add(type);

            List<ChatResponse.Option> options = new ArrayList<>();
            if (questionNode.has("options")) {
                for (JsonNode opt : questionNode.get("options")) {
                    options.add(new ChatResponse.Option(
                            opt.has("id") ? opt.get("id").asText() : UUID.randomUUID().toString(),
                            opt.get("label").asText(),
                            opt.has("description") ? opt.get("description").asText() : "",
                            opt.has("emoji") ? opt.get("emoji").asText() : "🔹",
                            null
                    ));
                }
            }

            ChatResponse.ScaleConfig scaleConfig = null;
            List<ChatResponse.ScaleItem> scaleItems = null;
            if (type.equals("skill_bars") || type.equals("budget_allocation")) {
                scaleConfig = new ChatResponse.ScaleConfig(0, 100, "0", "100");
                scaleItems = options.stream()
                        .map(o -> new ChatResponse.ScaleItem(o.id(), o.label(), o.emoji(), 0))
                        .collect(Collectors.toList());
            }

            int percentage = (session.currentQuestionIndex * 100) / TOTAL_QUESTIONS;

            ChatResponse.InteractiveElement interactive = new ChatResponse.InteractiveElement(
                    type,
                    questionNode.get("questionId").asText(),
                    questionNode.get("question").asText(),
                    questionNode.has("description") ? questionNode.get("description").asText() : "",
                    options,
                    new ChatResponse.ProgressInfo(session.currentQuestionIndex + 1, TOTAL_QUESTIONS, questionNode.has("stage") ? questionNode.get("stage").asText() : "Этап " + (session.currentQuestionIndex + 1), percentage),
                    null, null, scaleConfig, scaleItems, null
            );

            return new ChatResponse(
                    getEncouragement(session.currentQuestionIndex),
                    "assistant",
                    interactive,
                    new ChatResponse.SessionContextDto(session.sessionId, "test", session.currentQuestionIndex, TOTAL_QUESTIONS, false, null)
            );

        } catch (Exception e) {
            log.error("Error generating question", e);
            return new ChatResponse("Что-то пошло не так с генерацией теста. Давай просто пообщаемся! Расскажи о своих интересах?", "assistant", null, null);
        }
    }

    private ChatResponse generateFinalResults(TestSession session) {
        try {
            String userProfileStr = String.join(", ", session.accumulatedProfile);
            String prompt = "Пользователь завершил тест. Его профиль (теги ответов): [" + userProfileStr + "]. Проанализируй и дай рекомендации.";

            String jsonResponse = callLlm(SYSTEM_PROMPT_ANALYZER, prompt, true);
            JsonNode analysisNode = objectMapper.readTree(jsonResponse);

            String analysisText = analysisNode.get("analysisText").asText();
            List<String> keywords = new ArrayList<>();
            if (analysisNode.has("searchKeywords")) {
                for (JsonNode kw : analysisNode.get("searchKeywords")) {
                    keywords.add("%" + kw.asText().replace("%", "") + "%");
                }
            }

            List<ChatResponse.UniversityCard> universityCards = new ArrayList<>();

            if (!keywords.isEmpty()) {
                String[] keywordsArray = keywords.toArray(new String[0]);

                List<Long> programUniIds = programGroupRepository.findUniversityIdsByProgramKeywords(keywordsArray);
                List<Long> directUniIds = universityRepository.findIdsByKeywords(keywordsArray);

                Set<Long> uniqueIds = new LinkedHashSet<>(programUniIds);
                uniqueIds.addAll(directUniIds);

                List<Long> targetIds = uniqueIds.stream().limit(6).collect(Collectors.toList());

                if (!targetIds.isEmpty()) {
                    List<University> universities = universityRepository.findByIdsWithTranslations(targetIds);

                    universityCards = universities.stream()
                            .map(u -> mapToUniversityCard(u, keywords))
                            .collect(Collectors.toList());
                }
            }

            if (universityCards.isEmpty()) {
                List<Long> ids = universityRepository.findAllIds(org.springframework.data.domain.PageRequest.of(0, 5)).getContent();
                List<University> popular = universityRepository.findByIdsWithTranslations(ids);
                universityCards = popular.stream().map(u -> mapToUniversityCard(u, List.of())).collect(Collectors.toList());
                analysisText += "\n\n(К сожалению, по точным критериям ничего не найдено, но вот популярные ВУЗы):";
            }

            List<ChatResponse.ProfessionResult> professions = new ArrayList<>();
            if (analysisNode.has("recommendedProfessions")) {
                for (JsonNode prof : analysisNode.get("recommendedProfessions")) {
                    professions.add(new ChatResponse.ProfessionResult(
                            prof.has("id") ? prof.get("id").asText() : UUID.randomUUID().toString(),
                            prof.get("name").asText(),
                            prof.get("description").asText(),
                            prof.get("matchPercent").asInt(),
                            "💼",
                            List.of(), List.of(), "По запросу", "Высокий"
                    ));
                }
            }

            ChatResponse.InteractiveElement resultsInteractive = new ChatResponse.InteractiveElement(
                    "university_cards",
                    "final_results",
                    "Твои рекомендации",
                    "На основе анализа твоих ответов",
                    null,
                    new ChatResponse.ProgressInfo(TOTAL_QUESTIONS, TOTAL_QUESTIONS, "Финиш", 100),
                    universityCards,
                    professions,
                    null, null,
                    List.of(
                            new ChatResponse.QuickAction("restart", "🔄 Пройти заново", "🔄", "restart_test"),
                            new ChatResponse.QuickAction("chat", "💬 Обсудить результаты", "💬", "open_chat")
                    )
            );

            activeSessions.remove(session.sessionId);

            return new ChatResponse(
                    "🎉 **Тест завершен!**\n\n" + analysisText,
                    "assistant",
                    resultsInteractive,
                    new ChatResponse.SessionContextDto(session.sessionId, "complete", TOTAL_QUESTIONS, TOTAL_QUESTIONS, true, null)
            );

        } catch (Exception e) {
            log.error("Error generating final results", e);
            return new ChatResponse("Произошла ошибка при анализе результатов. Попробуй позже.", "assistant", null, null);
        }
    }

    private ChatResponse.UniversityCard mapToUniversityCard(University uni, List<String> matchingKeywords) {
        String lang = "ru";

        String name = uni.getTranslations().stream()
                .filter(t -> lang.equals(t.getLanguage().getCode()))
                .findFirst()
                .map(UniversityTranslation::getName)
                .orElse(uni.getSlug());

        String city = uni.getTranslations().stream()
                .filter(t -> lang.equals(t.getLanguage().getCode()))
                .findFirst()
                .map(UniversityTranslation::getCity)
                .orElse("Казахстан");

        String shortDesc = uni.getTranslations().stream()
                .filter(t -> lang.equals(t.getLanguage().getCode()))
                .findFirst()
                .map(UniversityTranslation::getShortDescription)
                .orElse("");

        int score = 80 + (int)(Math.random() * 15);

        List<String> cleanKeywords = matchingKeywords.stream()
                .map(k -> k.replace("%", ""))
                .limit(3)
                .collect(Collectors.toList());

        return new ChatResponse.UniversityCard(
                uni.getId(),
                name,
                city,
                uni.getPhotoUrl(),
                shortDesc,
                uni.getFoundedYear(),
                cleanKeywords.isEmpty() ? List.of("Общий профиль") : cleanKeywords,
                score
        );
    }

    private ChatResponse callAiForChat(ChatRequest request) {
        try {
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT_CHAT));

            for (ChatRequest.MessageDto msg : request.messages()) {
                messages.add(Map.of("role", msg.role(), "content", msg.content()));
            }

            String responseContent = callLlmRaw(messages, false);

            List<ChatResponse.QuickAction> actions = new ArrayList<>();
            if (shouldStartTest(responseContent.toLowerCase())) {
                actions.add(new ChatResponse.QuickAction("start_test", "🚀 Начать тест", "🚀", "start_test"));
            }

            ChatResponse.InteractiveElement interactive = null;
            if (!actions.isEmpty()) {
                interactive = new ChatResponse.InteractiveElement("quick_actions", null, null, null, null, null, null, null, null, null, actions);
            }

            return new ChatResponse(responseContent, "assistant", interactive, null);
        } catch (Exception e) {
            log.error("Chat error", e);
            return new ChatResponse("Извини, я сейчас немного перегружен. Попробуй позже.", "assistant", null, null);
        }
    }

    private String callLlm(String systemPrompt, String userPrompt, boolean jsonMode) throws IOException {
        List<Map<String, String>> messages = List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        );
        return callLlmRaw(messages, jsonMode);
    }

    private String callLlmRaw(List<Map<String, String>> messages, boolean jsonMode) throws IOException {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", aiConfig.getModel());
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 1000);
        requestBody.put("temperature", 0.7);

        if (jsonMode && aiConfig.isOpenAiCompatible()) {
            requestBody.put("response_format", Map.of("type", "json_object"));
        }

        String json = objectMapper.writeValueAsString(requestBody);

        Request httpRequest = new Request.Builder()
                .url(aiConfig.getBaseUrl() + "/chat/completions")
                .addHeader("Authorization", "Bearer " + aiConfig.getApiKey())
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(json, MediaType.parse("application/json")))
                .build();

        try (Response response = httpClient.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            String body = response.body().string();
            JsonNode root = objectMapper.readTree(body);
            return root.path("choices").path(0).path("message").path("content").asText();
        }
    }

    private void cleanOldSessions() {
        long now = System.currentTimeMillis();
        long maxAge = TimeUnit.HOURS.toMillis(1);
        activeSessions.entrySet().removeIf(e -> (now - e.getValue().createdAt) > maxAge);
    }

    private String getEncouragement(int index) {
        String[] phrases = {
                "Отличное начало! 🚀",
                "Интересный выбор! 🤔",
                "Продолжаем исследовать... 🔍",
                "Ты отлично справляешься! 💪",
                "Почти половина пути! ⛰️",
                "Твой профиль становится четче! 🧬",
                "Еще немного... ⏳",
                "Уже скоро финал! 🏁",
                "Последний рывок! 🔥",
                "Анализирую результаты... 🤖"
        };
        if (index >= 0 && index < phrases.length) return phrases[index];
        return "Дальше!";
    }

    @Override
    public List<ChatResponse.UniversityCard> getUniversitiesForProfession(String professionId, List<String> preferences) {
        return List.of();
    }

    @Override
    public Map<String, Object> analyzeTestResults(List<ChatRequest.AnswerDto> answers) {
        return Map.of();
    }
}