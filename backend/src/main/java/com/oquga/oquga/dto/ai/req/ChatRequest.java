package com.oquga.oquga.dto.ai.req;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.Map;

public record ChatRequest(
        @NotEmpty(message = "Messages are required")
        @Valid
        List<MessageDto> messages,

        InteractiveAnswerDto interactiveAnswer,

        SessionContextDto sessionContext
) {
    public record MessageDto(
            @NotBlank(message = "Role is required")
            String role,
            @NotBlank(message = "Content is required")
            String content
    ) {}

    public record InteractiveAnswerDto(
            String questionId,
            String type,
            List<String> selectedOptionIds,
            Integer scaleValue,
            Map<String, Integer> scaleValues
    ) {}

    public record SessionContextDto(
            String sessionId,
            String currentStage,
            int questionNumber,
            List<AnswerDto> collectedAnswers
    ) {}

    public record AnswerDto(
            String questionId,
            String questionType,
            String questionText,
            List<String> answers,
            Map<String, Integer> scaleAnswers
    ) {}
}
