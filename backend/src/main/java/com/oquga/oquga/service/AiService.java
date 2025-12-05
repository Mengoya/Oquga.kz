package com.oquga.oquga.service;

import com.oquga.oquga.dto.ai.req.ChatRequest;
import com.oquga.oquga.dto.ai.res.ChatResponse;

public interface AiService {
    ChatResponse chat(ChatRequest request);
}
