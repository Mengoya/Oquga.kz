package com.oquga.oquga.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oquga.oquga.config.AiConfig;
import com.oquga.oquga.dto.ai.req.ChatRequest;
import com.oquga.oquga.dto.ai.res.ChatResponse;
import com.oquga.oquga.entity.EducationalProgramGroup;
import com.oquga.oquga.entity.Faculty;
import com.oquga.oquga.entity.University;
import com.oquga.oquga.entity.translation.EducationalProgramGroupTranslation;
import com.oquga.oquga.entity.translation.FacultyTranslation;
import com.oquga.oquga.entity.translation.UniversityTranslation;
import com.oquga.oquga.repository.EducationalProgramGroupRepository;
import com.oquga.oquga.repository.FacultyRepository;
import com.oquga.oquga.repository.UniversityRepository;
import com.oquga.oquga.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

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
    private final FacultyRepository facultyRepository;
    private final EducationalProgramGroupRepository programGroupRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .build();

    private final Map<String, TestSession> activeSessions = new ConcurrentHashMap<>();

    private static final int TOTAL_QUESTIONS = 8;

    private static class TestSession {
        String sessionId;
        int currentQuestionIndex;
        List<AnswerData> answers;
        Map<String, Integer> scores;
        long createdAt;
        String currentStage;

        TestSession(String sessionId) {
            this.sessionId = sessionId;
            this.currentQuestionIndex = 0;
            this.answers = new ArrayList<>();
            this.scores = new HashMap<>();
            this.createdAt = System.currentTimeMillis();
            this.currentStage = "intro";
        }
    }

    private static class AnswerData {
        String questionId;
        String questionType;
        List<String> selectedOptions;
        Map<String, Integer> scaleValues;

        AnswerData(String questionId, String questionType, List<String> selectedOptions, Map<String, Integer> scaleValues) {
            this.questionId = questionId;
            this.questionType = questionType;
            this.selectedOptions = selectedOptions;
            this.scaleValues = scaleValues;
        }
    }

    private static final List<TestQuestion> TEST_QUESTIONS = List.of(
            new TestQuestion(
                    "q1_superpower",
                    "image_choice",
                    "🦸 Если бы у тебя была суперсила, какую бы выбрал?",
                    "Выбери одну способность - это расскажет о твоих скрытых талантах!",
                    "Суперсилы",
                    List.of(
                            new QuestionOption("mind_reading", "Читать мысли", "Понимать людей без слов", "🧠", "/images/mind.png"),
                            new QuestionOption("time_control", "Управлять временем", "Планировать идеально", "⏰", "/images/time.png"),
                            new QuestionOption("creation", "Создавать из ничего", "Воплощать идеи в реальность", "✨", "/images/create.png"),
                            new QuestionOption("analysis", "Видеть скрытые связи", "Находить закономерности везде", "🔍", "/images/analyze.png"),
                            new QuestionOption("healing", "Исцелять", "Помогать другим", "💚", "/images/heal.png"),
                            new QuestionOption("persuasion", "Убеждать любого", "Вести за собой", "🎯", "/images/lead.png")
                    )
            ),
            new TestQuestion(
                    "q2_weekend",
                    "scenario_choice",
                    "🌟 Идеальные выходные - это...",
                    "Представь: у тебя 2 свободных дня и неограниченные возможности",
                    "Интересы",
                    List.of(
                            new QuestionOption("hackathon", "Хакатон или мастер-класс", "Создать что-то новое за 48 часов", "💻", null),
                            new QuestionOption("volunteer", "Волонтёрство", "Помочь тем, кто нуждается", "🤝", null),
                            new QuestionOption("art", "Творческий проект", "Рисовать, музицировать, творить", "🎨", null),
                            new QuestionOption("research", "Исследование", "Разобраться в сложной теме", "📚", null),
                            new QuestionOption("business", "Запустить мини-проект", "Попробовать заработать", "💰", null),
                            new QuestionOption("adventure", "Приключение", "Поход, путешествие, экстрим", "🏔️", null)
                    )
            ),
            new TestQuestion(
                    "q3_school_subjects",
                    "drag_rank",
                    "📚 Расставь предметы по интересности",
                    "Перетащи в порядке от любимого к нелюбимому (топ-4)",
                    "Предметы",
                    List.of(
                            new QuestionOption("math", "Математика", "Логика и числа", "🔢", null),
                            new QuestionOption("physics", "Физика", "Законы природы", "⚡", null),
                            new QuestionOption("chemistry", "Химия", "Реакции и элементы", "🧪", null),
                            new QuestionOption("biology", "Биология", "Живые организмы", "🧬", null),
                            new QuestionOption("literature", "Литература", "Тексты и смыслы", "📖", null),
                            new QuestionOption("history", "История", "События прошлого", "🏛️", null),
                            new QuestionOption("languages", "Языки", "Общение с миром", "🌍", null),
                            new QuestionOption("informatics", "Информатика", "Код и алгоритмы", "💾", null),
                            new QuestionOption("economics", "Экономика", "Деньги и бизнес", "📊", null),
                            new QuestionOption("art_subject", "Искусство", "Творчество", "🎭", null)
                    )
            ),
            new TestQuestion(
                    "q4_skills_game",
                    "skill_bars",
                    "🎮 Прокачай своего персонажа!",
                    "У тебя 30 очков. Распредели их между навыками (макс 10 на навык)",
                    "Навыки",
                    List.of(
                            new QuestionOption("logic", "Логика", "Решение задач", "🧩", null),
                            new QuestionOption("creativity", "Креативность", "Генерация идей", "💡", null),
                            new QuestionOption("communication", "Общение", "Работа с людьми", "🗣️", null),
                            new QuestionOption("attention", "Внимательность", "Работа с деталями", "🎯", null),
                            new QuestionOption("leadership", "Лидерство", "Управление командой", "👑", null),
                            new QuestionOption("persistence", "Упорство", "Доведение до конца", "💪", null)
                    )
            ),
            new TestQuestion(
                    "q5_work_style",
                    "versus_choice",
                    "⚔️ Битва стилей работы!",
                    "Выбери победителя в каждой паре",
                    "Стиль",
                    List.of(
                            new QuestionOption("team_vs_solo", "Команда vs Одиночка", "team:В команде|solo:Самостоятельно", "👥", null),
                            new QuestionOption("office_vs_remote", "Офис vs Удалёнка", "office:В офисе|remote:Из дома", "🏢", null),
                            new QuestionOption("stable_vs_dynamic", "Стабильность vs Динамика", "stable:Стабильный график|dynamic:Каждый день новое", "📅", null),
                            new QuestionOption("deep_vs_wide", "Глубина vs Широта", "deep:Эксперт в одном|wide:Знать обо всём", "🎓", null)
                    )
            ),
            new TestQuestion(
                    "q6_values",
                    "budget_allocation",
                    "💎 Распредели бюджет ценностей",
                    "У тебя 100% энергии. На что потратишь в карьере?",
                    "Ценности",
                    List.of(
                            new QuestionOption("money", "Доход", "Финансовая свобода", "💵", null),
                            new QuestionOption("impact", "Влияние", "Польза миру", "🌱", null),
                            new QuestionOption("growth", "Рост", "Постоянное развитие", "📈", null),
                            new QuestionOption("freedom", "Свобода", "Гибкость и автономия", "🦅", null),
                            new QuestionOption("recognition", "Признание", "Статус и уважение", "🏆", null),
                            new QuestionOption("balance", "Баланс", "Время на жизнь", "⚖️", null)
                    )
            ),
            new TestQuestion(
                    "q7_industries",
                    "swipe_cards",
                    "👆 Свайпни интересные сферы!",
                    "Свайп вправо = интересно, влево = не моё",
                    "Сферы",
                    List.of(
                            new QuestionOption("it_tech", "IT и технологии", "Разработка, AI, кибербезопасность", "💻", null),
                            new QuestionOption("medicine", "Медицина", "Здоровье и фармацевтика", "⚕️", null),
                            new QuestionOption("business", "Бизнес", "Предпринимательство, финансы", "📊", null),
                            new QuestionOption("engineering", "Инженерия", "Строительство, производство", "⚙️", null),
                            new QuestionOption("education", "Образование", "Преподавание, наука", "📖", null),
                            new QuestionOption("arts", "Искусство", "Дизайн, медиа, развлечения", "🎨", null),
                            new QuestionOption("law", "Право", "Юриспруденция, госслужба", "⚖️", null),
                            new QuestionOption("nature", "Экология", "Природа, сельское хозяйство", "🌿", null),
                            new QuestionOption("social", "Социальная сфера", "Психология, HR", "🤝", null)
                    )
            ),
            new TestQuestion(
                    "q8_final_choice",
                    "final_scenario",
                    "🚀 Машина времени: ты через 10 лет",
                    "Какая картинка ближе к твоей мечте?",
                    "Будущее",
                    List.of(
                            new QuestionOption("tech_leader", "Tech-лидер", "Руководишь IT-командой, создаёшь продукты", "👨‍💻", "/images/tech_leader.png"),
                            new QuestionOption("entrepreneur", "Предприниматель", "Свой бизнес, свобода решений", "🚀", "/images/entrepreneur.png"),
                            new QuestionOption("scientist", "Учёный", "Исследования, открытия, публикации", "🔬", "/images/scientist.png"),
                            new QuestionOption("creative_pro", "Креативщик", "Дизайн, медиа, творческие проекты", "🎬", "/images/creative.png"),
                            new QuestionOption("helper", "Помощник людям", "Врач, психолог, учитель", "💚", "/images/helper.png"),
                            new QuestionOption("analyst", "Аналитик", "Данные, стратегии, консалтинг", "📈", "/images/analyst.png")
                    )
            )
    );

    private static final Map<String, ProfessionTemplate> PROFESSIONS = Map.ofEntries(
            Map.entry("software_developer", new ProfessionTemplate(
                    "software_developer", "Разработчик ПО", "💻",
                    "Создание программ, приложений и веб-сервисов. Одна из самых востребованных профессий современности.",
                    List.of("Программирование", "Алгоритмы", "Работа в команде", "Английский язык", "Системное мышление"),
                    List.of("IT-компании", "Стартапы", "Банки", "Фриланс", "GameDev"),
                    "500 000 - 2 500 000 ₸", "🔥 Очень высокий",
                    Set.of("time_control", "analysis", "hackathon", "research", "informatics", "math", "logic", "it_tech", "tech_leader"),
                    List.of("Информационные системы", "Программная инженерия", "Computer Science", "Вычислительная техника")
            )),
            Map.entry("data_scientist", new ProfessionTemplate(
                    "data_scientist", "Data Scientist", "📊",
                    "Анализ больших данных и машинное обучение. Профессия на стыке математики, программирования и бизнеса.",
                    List.of("Python/R", "Машинное обучение", "Статистика", "SQL", "Визуализация данных"),
                    List.of("Технологии", "Финансы", "Ритейл", "Наука", "Консалтинг"),
                    "600 000 - 3 000 000 ₸", "🔥 Очень высокий",
                    Set.of("analysis", "time_control", "research", "math", "informatics", "logic", "attention", "it_tech", "analyst"),
                    List.of("Data Science", "Прикладная математика", "Бизнес-аналитика", "Искусственный интеллект")
            )),
            Map.entry("doctor", new ProfessionTemplate(
                    "doctor", "Врач", "⚕️",
                    "Диагностика и лечение заболеваний. Профессия для тех, кто хочет помогать людям напрямую.",
                    List.of("Медицинские знания", "Эмпатия", "Стрессоустойчивость", "Внимательность", "Постоянное обучение"),
                    List.of("Больницы", "Частные клиники", "Научные центры", "Телемедицина"),
                    "400 000 - 1 800 000 ₸", "📈 Высокий",
                    Set.of("healing", "volunteer", "biology", "chemistry", "communication", "attention", "medicine", "helper", "impact"),
                    List.of("Общая медицина", "Педиатрия", "Хирургия", "Стоматология", "Фармация")
            )),
            Map.entry("ui_ux_designer", new ProfessionTemplate(
                    "ui_ux_designer", "UI/UX Дизайнер", "🎨",
                    "Проектирование удобных и красивых интерфейсов. Сочетание творчества и аналитики.",
                    List.of("Figma/Sketch", "Исследование пользователей", "Прототипирование", "Визуальный дизайн", "Анимация"),
                    List.of("IT-компании", "Дизайн-агентства", "Стартапы", "Фриланс", "Продуктовые команды"),
                    "400 000 - 1 500 000 ₸", "📈 Высокий",
                    Set.of("creation", "art", "creativity", "art_subject", "it_tech", "arts", "creative_pro"),
                    List.of("Дизайн", "Графический дизайн", "Медиа и коммуникации", "Информационные технологии")
            )),
            Map.entry("marketing_manager", new ProfessionTemplate(
                    "marketing_manager", "Маркетолог", "📈",
                    "Продвижение продуктов и услуг. Креатив + аналитика для достижения бизнес-целей.",
                    List.of("Digital-маркетинг", "Аналитика", "Креативность", "Копирайтинг", "SMM"),
                    List.of("Корпорации", "Агентства", "Стартапы", "E-commerce", "Медиа"),
                    "350 000 - 1 200 000 ₸", "📈 Высокий",
                    Set.of("persuasion", "business", "creativity", "communication", "economics", "recognition", "entrepreneur"),
                    List.of("Маркетинг", "Реклама и PR", "Менеджмент", "Бизнес-администрирование")
            )),
            Map.entry("financial_analyst", new ProfessionTemplate(
                    "financial_analyst", "Финансовый аналитик", "💰",
                    "Анализ финансовых данных и инвестиций. Для тех, кто любит цифры и хочет работать с деньгами.",
                    List.of("Финансовый анализ", "Excel/Python", "Моделирование", "Отчетность", "Инвестиции"),
                    List.of("Банки", "Инвестфонды", "Big 4", "Корпорации", "Трейдинг"),
                    "500 000 - 2 000 000 ₸", "📈 Высокий",
                    Set.of("analysis", "math", "economics", "logic", "attention", "money", "business", "analyst"),
                    List.of("Финансы", "Экономика", "Бухгалтерский учет", "Банковское дело")
            )),
            Map.entry("psychologist", new ProfessionTemplate(
                    "psychologist", "Психолог", "🧠",
                    "Помощь людям в решении психологических проблем. Растущая востребованность в современном мире.",
                    List.of("Эмпатия", "Активное слушание", "Терапевтические техники", "Этика", "Саморефлексия"),
                    List.of("Клиники", "Школы", "HR-отделы", "Частная практика", "Онлайн-консультации"),
                    "300 000 - 1 000 000 ₸", "📈 Растущий",
                    Set.of("mind_reading", "healing", "volunteer", "biology", "communication", "social", "helper", "impact"),
                    List.of("Психология", "Социальная работа", "Педагогика и психология", "Конфликтология")
            )),
            Map.entry("civil_engineer", new ProfessionTemplate(
                    "civil_engineer", "Инженер-строитель", "🏗️",
                    "Проектирование и строительство зданий и инфраструктуры. Создание того, что простоит века.",
                    List.of("AutoCAD/Revit", "Расчеты конструкций", "Управление проектами", "Знание материалов", "Нормативы"),
                    List.of("Строительные компании", "Проектные бюро", "Госсектор", "Девелопмент"),
                    "400 000 - 1 500 000 ₸", "📈 Стабильный",
                    Set.of("creation", "physics", "math", "attention", "persistence", "engineering", "stable"),
                    List.of("Строительство", "Архитектура", "Промышленное и гражданское строительство")
            )),
            Map.entry("lawyer", new ProfessionTemplate(
                    "lawyer", "Юрист", "⚖️",
                    "Правовое консультирование и защита интересов. Престижная профессия с высоким потолком.",
                    List.of("Знание законов", "Аналитика", "Переговоры", "Ораторское искусство", "Документооборот"),
                    List.of("Юрфирмы", "Корпорации", "Госорганы", "Суды", "Частная практика"),
                    "400 000 - 2 000 000 ₸", "📊 Стабильный",
                    Set.of("analysis", "persuasion", "history", "literature", "communication", "attention", "law", "recognition"),
                    List.of("Юриспруденция", "Международное право", "Государственное управление")
            )),
            Map.entry("teacher", new ProfessionTemplate(
                    "teacher", "Преподаватель", "📚",
                    "Обучение и развитие следующего поколения. Одна из самых важных профессий для общества.",
                    List.of("Педагогика", "Коммуникация", "Терпение", "Креативность", "Организация"),
                    List.of("Школы", "Университеты", "Онлайн-платформы", "Корпоративное обучение"),
                    "250 000 - 700 000 ₸", "📊 Стабильный",
                    Set.of("mind_reading", "volunteer", "communication", "creativity", "education", "helper", "impact", "balance"),
                    List.of("Педагогика", "Филология", "Математика", "История", "Иностранные языки")
            )),
            Map.entry("project_manager", new ProfessionTemplate(
                    "project_manager", "Проджект-менеджер", "📋",
                    "Управление проектами и командами. Связующее звено между идеей и реализацией.",
                    List.of("Agile/Scrum", "Планирование", "Коммуникация", "Лидерство", "Управление рисками"),
                    List.of("IT", "Строительство", "Маркетинг", "Консалтинг", "Любая отрасль"),
                    "500 000 - 1 800 000 ₸", "🔥 Очень высокий",
                    Set.of("time_control", "persuasion", "leadership", "communication", "business", "growth", "entrepreneur", "team"),
                    List.of("Менеджмент", "MBA", "Бизнес-администрирование", "Управление проектами")
            )),
            Map.entry("architect", new ProfessionTemplate(
                    "architect", "Архитектор", "🏛️",
                    "Проектирование зданий и пространств. Синтез искусства, технологий и функциональности.",
                    List.of("ArchiCAD/Revit", "3D-моделирование", "Креативность", "Знание материалов", "История архитектуры"),
                    List.of("Архитектурные бюро", "Девелоперы", "Госсектор", "Фриланс"),
                    "400 000 - 1 300 000 ₸", "📊 Средний",
                    Set.of("creation", "art", "physics", "creativity", "art_subject", "engineering", "arts", "creative_pro"),
                    List.of("Архитектура", "Дизайн среды", "Градостроительство", "Ландшафтный дизайн")
            ))
    );

    private static final String SYSTEM_PROMPT = """
            Ты - AI-помощник платформы Oquga.kz для профориентации абитуриентов Казахстана.
            Ты дружелюбный, современный и говоришь на языке молодёжи (но без перебора).
            
            Твои задачи:
            - Помогать с выбором профессии через интерактивный тест
            - Рекомендовать университеты Казахстана на основе результатов
            - Отвечать на вопросы об образовании
            
            Правила:
            - Отвечай на русском языке
            - Используй эмодзи умеренно
            - Будь конкретным и полезным
            - Давай персонализированные советы
            
            Когда пользователь хочет пройти тест - начинай интерактивную профориентацию.
            Когда показываешь результаты - объясняй почему эти профессии подходят на основе ответов.
            """;

    @Override
    public ChatResponse chat(ChatRequest request) {
        if (aiConfig.getApiKey() == null || aiConfig.getApiKey().isBlank()) {
            log.error("AI API key is not configured");
            throw new RuntimeException("AI service is not configured");
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

        try {
            return callAiForChat(request);
        } catch (IOException e) {
            log.error("Failed to call AI service", e);
            throw new RuntimeException("Failed to communicate with AI service: " + e.getMessage());
        }
    }

    private boolean shouldStartTest(String message) {
        return message.contains("тест") ||
                message.contains("профориентац") ||
                message.contains("пройти") ||
                message.contains("определить профессию") ||
                message.contains("выбрать профессию") ||
                message.contains("кем стать") ||
                message.contains("какую профессию");
    }

    @Override
    public ChatResponse startCareerTest(String sessionId) {
        TestSession session = new TestSession(sessionId);
        activeSessions.put(sessionId, session);

        cleanOldSessions();

        TestQuestion firstQuestion = TEST_QUESTIONS.get(0);

        String welcomeMessage = """
                🎮 **Квест по выбору профессии начинается!**
                
                Это не скучный тест, а интерактивное приключение из 8 этапов.
                
                Каждый ответ приближает тебя к идеальной профессии.
                В конце ты получишь:
                • 🎯 Топ-3 профессии с % совместимости
                • 🏛️ Подходящие университеты Казахстана
                • 📚 Рекомендованные образовательные программы
                
                **Готов? Погнали!** 🚀""";

        return new ChatResponse(
                welcomeMessage,
                "assistant",
                buildInteractiveElement(firstQuestion, 0, session),
                buildSessionContext(session)
        );
    }

    @Override
    public ChatResponse processTestAnswer(String sessionId, ChatRequest.InteractiveAnswerDto answer,
                                          ChatRequest.SessionContextDto context) {
        TestSession session = activeSessions.get(sessionId);
        if (session == null) {
            session = new TestSession(sessionId);
            activeSessions.put(sessionId, session);
        }

        if (answer != null && answer.questionId() != null) {
            processAnswer(session, answer);
            session.currentQuestionIndex++;
        }

        if (session.currentQuestionIndex >= TOTAL_QUESTIONS) {
            return generateTestResults(session);
        }

        TestQuestion nextQuestion = TEST_QUESTIONS.get(session.currentQuestionIndex);
        session.currentStage = nextQuestion.stage();

        String encouragement = getEncouragement(session.currentQuestionIndex);

        return new ChatResponse(
                encouragement,
                "assistant",
                buildInteractiveElement(nextQuestion, session.currentQuestionIndex, session),
                buildSessionContext(session)
        );
    }

    private void processAnswer(TestSession session, ChatRequest.InteractiveAnswerDto answer) {
        AnswerData answerData = new AnswerData(
                answer.questionId(),
                answer.type(),
                answer.selectedOptionIds(),
                answer.scaleValues()
        );
        session.answers.add(answerData);

        if (answer.selectedOptionIds() != null) {
            for (int i = 0; i < answer.selectedOptionIds().size(); i++) {
                String optionId = answer.selectedOptionIds().get(i);
                int weight = answer.type().equals("drag_rank") ? (10 - i * 2) : 10;
                session.scores.merge(optionId, weight, Integer::sum);
            }
        }

        if (answer.scaleValues() != null) {
            for (Map.Entry<String, Integer> entry : answer.scaleValues().entrySet()) {
                session.scores.merge(entry.getKey(), entry.getValue(), Integer::sum);
            }
        }
    }

    private String getEncouragement(int questionIndex) {
        return switch (questionIndex) {
            case 1 -> "🔥 Отличный выбор! Продолжаем...";
            case 2 -> "💪 Так держать! Следующий уровень...";
            case 3 -> "🎯 Половина пути! Ты крут!";
            case 4 -> "⚡ Интересные результаты формируются...";
            case 5 -> "🌟 Почти у цели!";
            case 6 -> "🏁 Финишная прямая!";
            case 7 -> "🎊 Последний вопрос!";
            default -> "👉 Следующий вопрос:";
        };
    }

    private ChatResponse generateTestResults(TestSession session) {
        List<ProfessionMatch> matches = calculateProfessionMatches(session);
        List<ChatResponse.ProfessionResult> topProfessions = matches.stream()
                .limit(3)
                .map(this::mapToProfessionResult)
                .toList();

        List<String> traits = analyzeTraits(session);

        StringBuilder message = new StringBuilder();
        message.append("🎉 **Квест завершён! Твои результаты готовы!**\n\n");
        message.append("На основе твоих ответов я составил профиль и подобрал лучшие варианты.\n\n");
        message.append("**🧬 Твой профиль:**\n");
        for (String trait : traits) {
            message.append("• ").append(trait).append("\n");
        }
        message.append("\n**👇 Нажми на профессию, чтобы увидеть подходящие университеты!**");

        activeSessions.remove(session.sessionId);

        return new ChatResponse(
                message.toString(),
                "assistant",
                new ChatResponse.InteractiveElement(
                        "profession_results",
                        "results",
                        "Твой TOP-3 профессий",
                        "Выбери профессию для просмотра университетов",
                        null,
                        new ChatResponse.ProgressInfo(TOTAL_QUESTIONS, TOTAL_QUESTIONS, "Результаты", 100),
                        null,
                        topProfessions,
                        null,
                        null,
                        List.of(
                                new ChatResponse.QuickAction("restart", "🔄 Пройти заново", "🔄", "restart_test"),
                                new ChatResponse.QuickAction("chat", "💬 Задать вопрос AI", "💬", "open_chat")
                        )
                ),
                new ChatResponse.SessionContextDto(
                        session.sessionId,
                        "results",
                        TOTAL_QUESTIONS,
                        TOTAL_QUESTIONS,
                        true,
                        Map.of("topProfessions", topProfessions.stream().map(ChatResponse.ProfessionResult::id).toList())
                )
        );
    }

    private List<ProfessionMatch> calculateProfessionMatches(TestSession session) {
        List<ProfessionMatch> matches = new ArrayList<>();

        for (ProfessionTemplate prof : PROFESSIONS.values()) {
            int score = 0;
            int maxPossible = prof.keywords().size() * 10;

            for (String keyword : prof.keywords()) {
                score += session.scores.getOrDefault(keyword, 0);
            }

            int percentage = maxPossible > 0 ? Math.min(98, (score * 100) / maxPossible) : 50;
            percentage = Math.max(percentage, 45);

            matches.add(new ProfessionMatch(prof, percentage, score));
        }

        matches.sort((a, b) -> {
            int scoreCompare = Integer.compare(b.rawScore, a.rawScore);
            if (scoreCompare != 0) return scoreCompare;
            return Integer.compare(b.percentage, a.percentage);
        });

        if (!matches.isEmpty()) {
            matches.get(0).percentage = Math.max(matches.get(0).percentage, 85);
            if (matches.size() > 1) {
                matches.get(1).percentage = Math.min(matches.get(1).percentage, matches.get(0).percentage - 5);
                matches.get(1).percentage = Math.max(matches.get(1).percentage, 70);
            }
            if (matches.size() > 2) {
                matches.get(2).percentage = Math.min(matches.get(2).percentage, matches.get(1).percentage - 5);
                matches.get(2).percentage = Math.max(matches.get(2).percentage, 60);
            }
        }

        return matches;
    }

    private List<String> analyzeTraits(TestSession session) {
        List<String> traits = new ArrayList<>();
        Map<String, Integer> scores = session.scores;

        if (scores.getOrDefault("logic", 0) + scores.getOrDefault("analysis", 0) > 15) {
            traits.add("🧠 Аналитический склад ума");
        }
        if (scores.getOrDefault("creativity", 0) + scores.getOrDefault("creation", 0) > 15) {
            traits.add("🎨 Творческое мышление");
        }
        if (scores.getOrDefault("communication", 0) + scores.getOrDefault("persuasion", 0) > 15) {
            traits.add("🗣️ Сильные коммуникативные навыки");
        }
        if (scores.getOrDefault("leadership", 0) > 7) {
            traits.add("👑 Лидерские качества");
        }
        if (scores.getOrDefault("attention", 0) + scores.getOrDefault("persistence", 0) > 12) {
            traits.add("🎯 Внимательность к деталям");
        }
        if (scores.getOrDefault("healing", 0) + scores.getOrDefault("volunteer", 0) + scores.getOrDefault("impact", 0) > 15) {
            traits.add("💚 Желание помогать людям");
        }
        if (scores.getOrDefault("money", 0) + scores.getOrDefault("business", 0) > 12) {
            traits.add("💰 Предпринимательская жилка");
        }

        if (traits.isEmpty()) {
            traits.add("🌟 Разносторонняя личность");
            traits.add("🔄 Гибкость в выборе направления");
        }

        return traits.stream().limit(4).toList();
    }

    private ChatResponse.ProfessionResult mapToProfessionResult(ProfessionMatch match) {
        return new ChatResponse.ProfessionResult(
                match.profession.id(),
                match.profession.name(),
                match.profession.description(),
                match.percentage,
                match.profession.emoji(),
                match.profession.skills(),
                match.profession.industries(),
                match.profession.salaryRange(),
                match.profession.demandLevel()
        );
    }

    @Override
    public List<ChatResponse.UniversityCard> getUniversitiesForProfession(String professionId, List<String> preferences) {
        ProfessionTemplate profession = PROFESSIONS.get(professionId);
        if (profession == null) {
            return List.of();
        }

        List<Long> universityIds = universityRepository.findAllIds(PageRequest.of(0, 50)).getContent();
        List<University> universities = universityRepository.findByIdsWithTranslations(universityIds);

        List<UniversityWithScore> scoredUniversities = new ArrayList<>();

        for (University uni : universities) {
            int score = calculateUniversityMatchScore(uni, profession, preferences);
            List<String> matchingPrograms = findMatchingPrograms(uni.getId(), profession);

            scoredUniversities.add(new UniversityWithScore(uni, score, matchingPrograms));
        }

        scoredUniversities.sort((a, b) -> Integer.compare(b.score, a.score));

        return scoredUniversities.stream()
                .limit(6)
                .map(this::mapToUniversityCard)
                .toList();
    }

    private int calculateUniversityMatchScore(University uni, ProfessionTemplate profession, List<String> preferences) {
        int score = 50;

        String uniName = uni.getTranslations().stream()
                .filter(t -> "ru".equals(t.getLanguage().getCode()))
                .findFirst()
                .map(t -> t.getName().toLowerCase())
                .orElse("");

        String uniDesc = uni.getTranslations().stream()
                .filter(t -> "ru".equals(t.getLanguage().getCode()))
                .findFirst()
                .map(t -> t.getDescription() != null ? t.getDescription().toLowerCase() : "")
                .orElse("");

        Set<String> keywords = profession.keywords();

        if (keywords.contains("it_tech") || keywords.contains("informatics")) {
            if (uniName.contains("назарбаев") || uniName.contains("satbayev") ||
                    uniName.contains("муит") || uniName.contains("кбту") ||
                    uniName.contains("iitu") || uniName.contains("айту")) {
                score += 35;
            }
        }

        if (keywords.contains("business") || keywords.contains("economics") || keywords.contains("money")) {
            if (uniName.contains("кимэп") || uniName.contains("kimep") ||
                    uniName.contains("нархоз") || uniName.contains("narxoz") ||
                    uniName.contains("казэу") || uniName.contains("turan")) {
                score += 35;
            }
        }

        if (keywords.contains("medicine") || keywords.contains("healing")) {
            if (uniName.contains("медицин") || uniName.contains("казнму") ||
                    uniName.contains("асфендияров") || uniName.contains("фармац")) {
                score += 40;
            }
        }

        if (keywords.contains("engineering") || keywords.contains("physics")) {
            if (uniName.contains("satbayev") || uniName.contains("сатпаев") ||
                    uniName.contains("политех") || uniName.contains("кбту")) {
                score += 30;
            }
        }

        if (keywords.contains("law")) {
            if (uniName.contains("казгюу") || uniName.contains("юридич") ||
                    uniName.contains("право") || uniName.contains("кимэп")) {
                score += 35;
            }
        }

        if (keywords.contains("arts") || keywords.contains("art") || keywords.contains("creation")) {
            if (uniName.contains("искусств") || uniName.contains("театр") ||
                    uniName.contains("культур") || uniName.contains("дизайн")) {
                score += 30;
            }
        }

        if (keywords.contains("education")) {
            if (uniName.contains("педагог") || uniName.contains("абай") ||
                    uniName.contains("учитель")) {
                score += 35;
            }
        }

        if (uniName.contains("назарбаев") || uniName.contains("казну") ||
                uniName.contains("аль-фараби") || uniName.contains("ену")) {
            score += 10;
        }

        score += (int) (Math.random() * 10);

        return Math.min(98, Math.max(45, score));
    }

    private List<String> findMatchingPrograms(Long universityId, ProfessionTemplate profession) {
        List<String> programs = new ArrayList<>();

        try {
            List<Faculty> faculties = facultyRepository.findByUniversityIdWithProgramGroups(universityId);

            Set<String> professionPrograms = new HashSet<>(profession.relatedPrograms());

            for (Faculty faculty : faculties) {
                for (EducationalProgramGroup group : faculty.getProgramGroups()) {
                    String programName = group.getTranslations().stream()
                            .filter(t -> "ru".equals(t.getLanguage().getCode()))
                            .findFirst()
                            .map(EducationalProgramGroupTranslation::getName)
                            .orElse("");

                    for (String profProgram : professionPrograms) {
                        if (programName.toLowerCase().contains(profProgram.toLowerCase()) ||
                                profProgram.toLowerCase().contains(programName.toLowerCase())) {
                            programs.add(programName);
                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error finding matching programs for university {}: {}", universityId, e.getMessage());
        }

        if (programs.isEmpty()) {
            programs.addAll(profession.relatedPrograms().stream().limit(3).toList());
        }

        return programs.stream().distinct().limit(4).toList();
    }

    private ChatResponse.UniversityCard mapToUniversityCard(UniversityWithScore uws) {
        University uni = uws.university;

        String name = uni.getTranslations().stream()
                .filter(t -> "ru".equals(t.getLanguage().getCode()))
                .findFirst()
                .map(UniversityTranslation::getName)
                .orElse(uni.getSlug());

        String city = uni.getTranslations().stream()
                .filter(t -> "ru".equals(t.getLanguage().getCode()))
                .findFirst()
                .map(UniversityTranslation::getCity)
                .orElse("Казахстан");

        String shortDesc = uni.getTranslations().stream()
                .filter(t -> "ru".equals(t.getLanguage().getCode()))
                .findFirst()
                .map(UniversityTranslation::getShortDescription)
                .orElse("");

        return new ChatResponse.UniversityCard(
                uni.getId(),
                name,
                city,
                uni.getPhotoUrl(),
                shortDesc,
                uni.getFoundedYear(),
                uws.matchingPrograms,
                uws.score
        );
    }

    @Override
    public Map<String, Object> analyzeTestResults(List<ChatRequest.AnswerDto> answers) {
        Map<String, Integer> scores = new HashMap<>();

        for (ChatRequest.AnswerDto answer : answers) {
            if (answer.answers() != null) {
                for (String selected : answer.answers()) {
                    scores.merge(selected, 10, Integer::sum);
                }
            }
            if (answer.scaleAnswers() != null) {
                scores.putAll(answer.scaleAnswers());
            }
        }

        return Map.of("scores", scores);
    }

    private ChatResponse.InteractiveElement buildInteractiveElement(TestQuestion question, int index, TestSession session) {
        List<ChatResponse.Option> options = question.options().stream()
                .map(opt -> new ChatResponse.Option(
                        opt.id(),
                        opt.label(),
                        opt.description(),
                        opt.emoji(),
                        opt.imageUrl()
                ))
                .toList();

        ChatResponse.ScaleConfig scaleConfig = null;
        List<ChatResponse.ScaleItem> scaleItems = null;

        String questionType = question.type();

        if (questionType.equals("skill_bars") || questionType.equals("budget_allocation")) {
            int maxPoints = questionType.equals("skill_bars") ? 30 : 100;
            int maxPerItem = questionType.equals("skill_bars") ? 10 : 50;
            scaleConfig = new ChatResponse.ScaleConfig(0, maxPerItem, "0", String.valueOf(maxPerItem));
            scaleItems = question.options().stream()
                    .map(opt -> new ChatResponse.ScaleItem(opt.id(), opt.label(), opt.emoji(), 0))
                    .toList();
        }

        int percentage = (index * 100) / TOTAL_QUESTIONS;

        return new ChatResponse.InteractiveElement(
                questionType,
                question.id(),
                question.question(),
                question.description(),
                options,
                new ChatResponse.ProgressInfo(index + 1, TOTAL_QUESTIONS, question.stage(), percentage),
                null,
                null,
                scaleConfig,
                scaleItems,
                null
        );
    }

    private ChatResponse.SessionContextDto buildSessionContext(TestSession session) {
        return new ChatResponse.SessionContextDto(
                session.sessionId,
                session.currentStage,
                session.currentQuestionIndex + 1,
                TOTAL_QUESTIONS,
                false,
                null
        );
    }

    private void cleanOldSessions() {
        long now = System.currentTimeMillis();
        long maxAge = TimeUnit.HOURS.toMillis(2);
        activeSessions.entrySet().removeIf(entry ->
                now - entry.getValue().createdAt > maxAge
        );
    }

    private ChatResponse callAiForChat(ChatRequest request) throws IOException {
        List<Map<String, String>> messages = new ArrayList<>();

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", SYSTEM_PROMPT + "\n\nДоступные университеты: " + getUniversitySummary());
        messages.add(systemMessage);

        for (ChatRequest.MessageDto msg : request.messages()) {
            Map<String, String> message = new HashMap<>();
            message.put("role", msg.role());
            message.put("content", msg.content());
            messages.add(message);
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", aiConfig.getModel());
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", aiConfig.getMaxTokens());
        requestBody.put("temperature", aiConfig.getTemperature());

        String json = objectMapper.writeValueAsString(requestBody);

        Request httpRequest = new Request.Builder()
                .url(aiConfig.getBaseUrl() + "/chat/completions")
                .addHeader("Authorization", "Bearer " + aiConfig.getApiKey())
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(json, MediaType.parse("application/json")))
                .build();

        try (Response response = httpClient.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                log.error("AI API error: {} - {}", response.code(), errorBody);
                throw new RuntimeException("AI service error: " + response.code());
            }

            String responseBody = response.body().string();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            String content = jsonNode
                    .path("choices")
                    .path(0)
                    .path("message")
                    .path("content")
                    .asText();

            return new ChatResponse(
                    content,
                    "assistant",
                    new ChatResponse.InteractiveElement(
                            "quick_actions",
                            null, null, null, null, null, null, null, null, null,
                            List.of(
                                    new ChatResponse.QuickAction("test", "🎯 Пройти тест профориентации", "🎯", "start_test"),
                                    new ChatResponse.QuickAction("universities", "🏛️ Посмотреть университеты", "🏛️", "show_universities")
                            )
                    ),
                    null
            );
        }
    }

    private String getUniversitySummary() {
        try {
            List<Long> ids = universityRepository.findAllIds(PageRequest.of(0, 20)).getContent();
            List<University> universities = universityRepository.findByIdsWithTranslations(ids);

            return universities.stream()
                    .map(u -> u.getTranslations().stream()
                            .filter(t -> "ru".equals(t.getLanguage().getCode()))
                            .findFirst()
                            .map(t -> t.getName() + " (" + t.getCity() + ")")
                            .orElse(u.getSlug()))
                    .collect(Collectors.joining(", "));
        } catch (Exception e) {
            return "Назарбаев Университет, КазНУ, ЕНУ, Satbayev University, КИМЭП, КБТУ, SDU, МУИТ";
        }
    }

    private record TestQuestion(
            String id,
            String type,
            String question,
            String description,
            String stage,
            List<QuestionOption> options
    ) {}

    private record QuestionOption(
            String id,
            String label,
            String description,
            String emoji,
            String imageUrl
    ) {}

    private record ProfessionTemplate(
            String id,
            String name,
            String emoji,
            String description,
            List<String> skills,
            List<String> industries,
            String salaryRange,
            String demandLevel,
            Set<String> keywords,
            List<String> relatedPrograms
    ) {}

    private static class ProfessionMatch {
        ProfessionTemplate profession;
        int percentage;
        int rawScore;

        ProfessionMatch(ProfessionTemplate profession, int percentage, int rawScore) {
            this.profession = profession;
            this.percentage = percentage;
            this.rawScore = rawScore;
        }
    }

    private static class UniversityWithScore {
        University university;
        int score;
        List<String> matchingPrograms;

        UniversityWithScore(University university, int score, List<String> matchingPrograms) {
            this.university = university;
            this.score = score;
            this.matchingPrograms = matchingPrograms;
        }
    }
}
