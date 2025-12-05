package com.oquga.oquga.dto.university.req;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record UpdateUniversityRequest(
        String photoUrl,
        String websiteUrl,
        Integer foundedYear,
        String contactPhone,
        String contactEmail,
        @NotNull(message = "Translations are required")
        @Valid
        Map<String, TranslationDto> translations
) {
    public record TranslationDto(
            String name,
            String city,
            String shortDescription,
            String description,
            String goal,
            String address,
            String historyText
    ) {}
}
