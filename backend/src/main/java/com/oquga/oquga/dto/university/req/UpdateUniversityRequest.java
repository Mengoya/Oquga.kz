package com.oquga.oquga.dto.university.req;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record UpdateUniversityRequest(
        String photoUrl,
        String websiteUrl,
        Integer foundedYear,
        String contactPhone,
        String contactEmail,
        @NotNull(message = "Translations are required")
        @Valid
        Map<String, TranslationDto> translations,
        @Valid
        List<LeadershipDto> leadership,
        @Valid
        List<AchievementDto> achievements,
        @Valid
        List<HistoryEventDto> historyEvents,
        @Valid
        List<FacultyDto> faculties,
        @Valid
        AdmissionRuleDto admissionRule,
        @Valid
        List<TuitionDiscountDto> tuitionDiscounts,
        @Valid
        List<InternationalSectionDto> internationalSections
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

    public record LeadershipDto(
            Long id,
            String fullName,
            String position,
            String bioSummary,
            Integer sortOrder
    ) {}

    public record AchievementDto(
            Long id,
            String title,
            Integer year,
            String rankValue,
            String details,
            Integer sortOrder
    ) {}

    public record HistoryEventDto(
            Long id,
            Integer eventYear,
            String eventDescription,
            Integer sortOrder
    ) {}

    public record FacultyDto(
            Long id,
            Integer sortOrder,
            Map<String, FacultyTranslationDto> translations,
            List<DepartmentDto> departments,
            List<EducationalProgramGroupDto> programGroups
    ) {}

    public record FacultyTranslationDto(
            String name,
            String description
    ) {}

    public record DepartmentDto(
            Long id,
            Integer sortOrder,
            Map<String, DepartmentTranslationDto> translations
    ) {}

    public record DepartmentTranslationDto(
            String name,
            String goal,
            String mission,
            String tasks
    ) {}

    public record EducationalProgramGroupDto(
            Long id,
            Long departmentId,
            String degreeLevel,
            String code,
            Integer sortOrder,
            Map<String, ProgramGroupTranslationDto> translations,
            List<EducationalProgramDto> programs,
            PassingScoreDto passingScore
    ) {}

    public record ProgramGroupTranslationDto(
            String name,
            String description
    ) {}

    public record EducationalProgramDto(
            Long id,
            String code,
            Integer sortOrder,
            Map<String, ProgramTranslationDto> translations
    ) {}

    public record ProgramTranslationDto(
            String name,
            String description
    ) {}

    public record PassingScoreDto(
            Integer minScoreGrant,
            Integer minScorePaid,
            String profileSubjects,
            Boolean isCreativeExam
    ) {}

    public record AdmissionRuleDto(
            LocalDate startDate,
            LocalDate endDate,
            String documentsText,
            String stepsText,
            String militaryDepartmentInfo,
            String dormitoryInfo
    ) {}

    public record TuitionDiscountDto(
            Long id,
            String categoryName,
            Integer pricePerYear,
            String scholarshipInfo,
            Integer sortOrder
    ) {}

    public record InternationalSectionDto(
            Long id,
            String externalUrl,
            Integer sortOrder,
            Boolean isActive,
            Map<String, InternationalSectionTranslationDto> translations,
            List<InternationalItemDto> items
    ) {}

    public record InternationalSectionTranslationDto(
            String title,
            String description
    ) {}

    public record InternationalItemDto(
            Long id,
            String externalUrl,
            Integer sortOrder,
            Boolean isActive,
            Map<String, InternationalItemTranslationDto> translations
    ) {}

    public record InternationalItemTranslationDto(
            String title,
            String description
    ) {}
}
