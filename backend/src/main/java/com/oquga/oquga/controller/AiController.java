package com.oquga.oquga.controller;

import com.oquga.oquga.dto.ai.req.ChatRequest;
import com.oquga.oquga.dto.ai.res.ChatResponse;
import com.oquga.oquga.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody @Valid ChatRequest request) {
        return ResponseEntity.ok(aiService.chat(request));
    }

    @PostMapping("/career-test/start")
    public ResponseEntity<ChatResponse> startCareerTest() {
        String sessionId = java.util.UUID.randomUUID().toString();
        return ResponseEntity.ok(aiService.startCareerTest(sessionId));
    }

    @GetMapping("/universities/profession/{professionId}")
    public ResponseEntity<List<ChatResponse.UniversityCard>> getUniversitiesForProfession(
            @PathVariable String professionId,
            @RequestParam(required = false) List<String> preferences
    ) {
        return ResponseEntity.ok(aiService.getUniversitiesForProfession(professionId, preferences));
    }
}
