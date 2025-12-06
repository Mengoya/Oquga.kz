package com.oquga.oquga.dto.university.res;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record UniversityDetailResponse(
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
        List<LeadershipDto> leadership,
        List<AchievementDto> achievements,
        List<HistoryEventDto> historyEvents,
        List<FacultyDto> faculties,
        AdmissionRuleDto admissionRule,
        List<TuitionDiscountDto> tuitionDiscounts,
        List<InternationalSectionDto> internationalSections,
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
