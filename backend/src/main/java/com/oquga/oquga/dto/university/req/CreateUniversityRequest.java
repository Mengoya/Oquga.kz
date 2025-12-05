package com.oquga.oquga.dto.university.req;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

public record CreateUniversityRequest(
        @NotBlank(message = "Slug is required")
        String slug,

        String websiteUrl,

        Integer foundedYear,

        String contactPhone,

        String contactEmail,

        @NotEmpty(message = "At least one translation is required")
        @Valid
        Map<String, TranslationDto> translations
) {
    public record TranslationDto(
            @NotBlank(message = "Name is required")
            String name,

            String description,

            String city
    ) {}
}
