package com.oquga.oquga.dto.university.res;

import java.time.LocalDateTime;
import java.util.Map;

public record UniversityDetailResponse(
        Long id,
        String slug,
        String photoUrl,
        String websiteUrl,
        Integer foundedYear,
        String contactPhone,
        String contactEmail,
        Long viewCount,
        Map<String, TranslationDto> translations,
        ProgressDto progress,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record TranslationDto(
            String name,
            String shortDescription,
            String description,
            String goal,
            String address,
            String city,
            String historyText,
            boolean isComplete
    ) {}

    public record ProgressDto(
            int totalPercent,
            SectionProgress basicInfo,
            SectionProgress description,
            SectionProgress leadership,
            SectionProgress achievements,
            SectionProgress faculties,
            SectionProgress admissionRules,
            SectionProgress tuition,
            SectionProgress international
    ) {}

    public record SectionProgress(
            String name,
            int percent,
            int maxPercent,
            int filledFields,
            int totalFields
    ) {}
}
