package com.oquga.oquga.dto.ai.res;

import java.util.List;
import java.util.Map;

public record ChatResponse(
        String message,
        String role,
        InteractiveElement interactive,
        SessionContextDto sessionContext
) {
    public record InteractiveElement(
            String type,
            String questionId,
            String question,
            String description,
            List<Option> options,
            ProgressInfo progress,
            List<UniversityCard> universities,
            List<ProfessionResult> professions,
            ScaleConfig scale,
            List<ScaleItem> scaleItems,
            List<QuickAction> quickActions
    ) {}

    public record Option(
            String id,
            String label,
            String description,
            String emoji,
            String imageUrl
    ) {}

    public record ProgressInfo(
            int current,
            int total,
            String stage,
            int percentage
    ) {}

    public record UniversityCard(
            Long id,
            String name,
            String city,
            String photoUrl,
            String shortDescription,
            Integer foundedYear,
            List<String> matchingPrograms,
            Integer matchScore
    ) {}

    public record ProfessionResult(
            String id,
            String name,
            String description,
            int matchPercent,
            String emoji,
            List<String> skills,
            List<String> industries,
            String salaryRange,
            String demandLevel
    ) {}

    public record ScaleConfig(
            int min,
            int max,
            String minLabel,
            String maxLabel
    ) {}

    public record ScaleItem(
            String id,
            String label,
            String emoji,
            int value
    ) {}

    public record QuickAction(
            String id,
            String label,
            String emoji,
            String action
    ) {}

    public record SessionContextDto(
            String sessionId,
            String currentStage,
            int questionNumber,
            int totalQuestions,
            boolean isComplete,
            Map<String, Object> analysisData
    ) {}
}
