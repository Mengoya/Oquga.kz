package com.oquga.oquga.dto.university.res;

import java.time.LocalDateTime;
import java.util.Map;

public record UniversityResponse(
        Long id,
        String slug,
        String photoUrl,
        String websiteUrl,
        String virtualTourUrl,
        Integer foundedYear,
        String contactPhone,
        String contactEmail,
        Long viewCount,
        Map<String, TranslationDto> translations,
        int progressPercent,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record TranslationDto(
            String name,
            String shortDescription,
            String description,
            String city,
            boolean isComplete
    ) {}
}
