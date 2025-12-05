package com.oquga.oquga.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oquga.oquga.config.AiConfig;
import com.oquga.oquga.dto.ai.req.ChatRequest;
import com.oquga.oquga.dto.ai.res.ChatResponse;
import com.oquga.oquga.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

    private final AiConfig aiConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .build();

    private static final String SYSTEM_PROMPT = """
            Ты - AI помощник платформы Oquga.kz для абитуриентов Казахстана. Твоя главная задача - помогать с профориентацией и выбором университета.
            
            Твои возможности:
            1. Проводить тест на профориентацию через диалог
            2. Анализировать интересы и способности пользователя
            3. Рекомендовать подходящие профессии
            4. Подбирать университеты Казахстана по выбранной профессии
            5. Давать информацию о профессиях и образовательных программах
            6. Рассказывать о требованиях к поступлению, ЕНТ, грантах
            
            Правила:
            - Отвечай на русском языке, если пользователь не просит иначе
            - Будь дружелюбным и поддерживающим
            - Задавай уточняющие вопросы для лучшего понимания
            - При проведении теста задавай вопросы по одному, не все сразу
            - Давай конкретные рекомендации с объяснениями
            - Используй эмодзи для более живого общения
            
            Когда пользователь хочет пройти тест на профориентацию:
            1. Объясни, что тест поможет определить подходящие направления
            2. Задавай вопросы последовательно: об интересах, любимых предметах, хобби, сильных сторонах, предпочтениях в работе
            3. Минимум 5-7 вопросов для качественного анализа
            4. После сбора информации дай развернутый анализ и рекомендации по профессиям (топ-3)
            5. Для каждой профессии предложи конкретные университеты Казахстана
            
            Известные университеты Казахстана для рекомендаций:
            - Назарбаев Университет (Астана) - престижный, международные программы
            - КазНУ им. Аль-Фараби (Алматы) - крупнейший, широкий выбор специальностей
            - ЕНУ им. Гумилева (Астана) - сильные технические направления
            - Satbayev University (Алматы) - инженерия, IT
            - КИМЭП (Алматы) - бизнес, экономика, право
            - КБТУ (Алматы) - нефтегазовое дело, IT
            - SDU (Алматы/Каскелен) - международные программы
            - МУИТ (Алматы) - IT, программирование
            """;

    @Override
    public ChatResponse chat(ChatRequest request) {
        if (aiConfig.getApiKey() == null || aiConfig.getApiKey().isBlank()) {
            log.error("AI API key is not configured");
            throw new RuntimeException("AI service is not configured");
        }

        try {
            if (aiConfig.isAnthropic()) {
                return callAnthropicApi(request);
            } else {
                return callOpenAiCompatibleApi(request);
            }
        } catch (IOException e) {
            log.error("Failed to call AI service", e);
            throw new RuntimeException("Failed to communicate with AI service: " + e.getMessage());
        }
    }

    private ChatResponse callOpenAiCompatibleApi(ChatRequest request) throws IOException {
        List<Map<String, String>> messages = new ArrayList<>();

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", SYSTEM_PROMPT);
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

            return new ChatResponse(content, "assistant");
        }
    }

    private ChatResponse callAnthropicApi(ChatRequest request) throws IOException {
        List<Map<String, String>> messages = new ArrayList<>();

        for (ChatRequest.MessageDto msg : request.messages()) {
            Map<String, String> message = new HashMap<>();
            message.put("role", msg.role());
            message.put("content", msg.content());
            messages.add(message);
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", aiConfig.getModel());
        requestBody.put("max_tokens", aiConfig.getMaxTokens());
        requestBody.put("system", SYSTEM_PROMPT);
        requestBody.put("messages", messages);

        String json = objectMapper.writeValueAsString(requestBody);

        Request httpRequest = new Request.Builder()
                .url(aiConfig.getBaseUrl() + "/messages")
                .addHeader("x-api-key", aiConfig.getApiKey())
                .addHeader("anthropic-version", "2023-06-01")
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(json, MediaType.parse("application/json")))
                .build();

        try (Response response = httpClient.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                log.error("Anthropic API error: {} - {}", response.code(), errorBody);
                throw new RuntimeException("AI service error: " + response.code());
            }

            String responseBody = response.body().string();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            String content = jsonNode
                    .path("content")
                    .path(0)
                    .path("text")
                    .asText();

            return new ChatResponse(content, "assistant");
        }
    }
}
