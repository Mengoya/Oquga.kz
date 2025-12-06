package com.oquga.oquga.dto.university.req;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.util.Map;

public record CreateUniversityRequest(
        @NotBlank(message = "Slug is required")
        String slug,

        @URL(message = "Invalid website URL format")
        String websiteUrl,

        @URL(message = "Invalid virtual tour URL format")
        String virtualTourUrl,

        Integer foundedYear,

        String contactPhone,

        String contactEmail,

        @NotNull(message = "Translations are required")
        @Size(min = 3, max = 3, message = "All three translations (ru, kk, en) are required")
        @Valid
        Map<String, TranslationDto> translations
) {
    public record TranslationDto(
            @NotBlank(message = "Name is required")
            String name,

            @NotBlank(message = "City is required")
            String city,

            String shortDescription,

            String description
    ) {}
}