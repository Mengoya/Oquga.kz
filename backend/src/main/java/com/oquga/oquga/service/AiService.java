package com.oquga.oquga.service;

import com.oquga.oquga.dto.ai.req.ChatRequest;
import com.oquga.oquga.dto.ai.res.ChatResponse;

import java.util.List;
import java.util.Map;

public interface AiService {
    ChatResponse chat(ChatRequest request);

    ChatResponse startCareerTest(String sessionId);

    ChatResponse processTestAnswer(String sessionId, ChatRequest.InteractiveAnswerDto answer,
                                   ChatRequest.SessionContextDto context);

    List<ChatResponse.UniversityCard> getUniversitiesForProfession(String professionId,
                                                                   List<String> preferences);

    Map<String, Object> analyzeTestResults(List<ChatRequest.AnswerDto> answers);
}
