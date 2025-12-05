package com.oquga.oquga.service.impl;

import com.oquga.oquga.dto.university.req.CreateUniversityRequest;
import com.oquga.oquga.dto.university.req.UpdateUniversityRequest;
import com.oquga.oquga.dto.university.res.UniversityDetailResponse;
import com.oquga.oquga.dto.university.res.UniversityListResponse;
import com.oquga.oquga.dto.university.res.UniversityResponse;
import com.oquga.oquga.entity.Language;
import com.oquga.oquga.entity.University;
import com.oquga.oquga.entity.User;
import com.oquga.oquga.entity.translation.UniversityTranslation;
import com.oquga.oquga.enums.RoleType;
import com.oquga.oquga.repository.LanguageRepository;
import com.oquga.oquga.repository.UniversityRepository;
import com.oquga.oquga.repository.UserRepository;
import com.oquga.oquga.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityServiceImpl implements UniversityService {

    private static final Set<String> REQUIRED_LANGUAGES = Set.of("ru", "kk", "en");

    private final UniversityRepository universityRepository;
    private final LanguageRepository languageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UniversityListResponse getUniversities(String search, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit);

        Page<Long> idPage;
        if (search == null || search.isBlank()) {
            idPage = universityRepository.findAllIds(pageRequest);
        } else {
            idPage = universityRepository.findIdsWithSearch(search.trim(), pageRequest);
        }

        List<UniversityResponse> data;
        if (idPage.getContent().isEmpty()) {
            data = List.of();
        } else {
            List<University> universities = universityRepository.findByIdsWithTranslations(idPage.getContent());

            Map<Long, University> universityMap = universities.stream()
                    .collect(Collectors.toMap(University::getId, Function.identity()));

            data = idPage.getContent().stream()
                    .map(universityMap::get)
                    .filter(Objects::nonNull)
                    .map(this::mapToResponse)
                    .toList();
        }

        return new UniversityListResponse(
                data,
                new UniversityListResponse.MetaDto(
                        idPage.getTotalElements(),
                        page,
                        limit,
                        idPage.getTotalPages()
                )
        );
    }

    @Override
    @Transactional(readOnly = true)
    public UniversityResponse getUniversityById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));
        return mapToResponse(university);
    }

    @Override
    @Transactional(readOnly = true)
    public UniversityDetailResponse getUniversityDetail(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));
        return mapToDetailResponse(university);
    }

    @Override
    @Transactional
    public UniversityResponse createUniversity(CreateUniversityRequest request) {
        validateTranslations(request.translations());

        if (request.photoUrl() == null || request.photoUrl().isBlank()) {
            throw new RuntimeException("Photo URL is required");
        }

        if (universityRepository.existsBySlug(request.slug())) {
            throw new RuntimeException("University with this slug already exists");
        }

        University university = new University();
        university.setSlug(request.slug());
        university.setPhotoUrl(request.photoUrl());
        university.setWebsiteUrl(request.websiteUrl());
        university.setFoundedYear(request.foundedYear());
        university.setContactPhone(request.contactPhone());
        university.setContactEmail(request.contactEmail());
        university.setViewCount(0L);
        university.setCreatedAt(LocalDateTime.now());
        university.setUpdatedAt(LocalDateTime.now());

        for (Map.Entry<String, CreateUniversityRequest.TranslationDto> entry : request.translations().entrySet()) {
            String langCode = entry.getKey();
            CreateUniversityRequest.TranslationDto translationDto = entry.getValue();

            Language language = languageRepository.findByCode(langCode)
                    .orElseThrow(() -> new RuntimeException("Language not found: " + langCode));

            UniversityTranslation translation = new UniversityTranslation();
            translation.setLanguage(language);
            translation.setName(translationDto.name());
            translation.setCity(translationDto.city());
            translation.setShortDescription(translationDto.shortDescription());
            translation.setDescription(translationDto.description());
            translation.setCreatedAt(LocalDateTime.now());
            translation.setUpdatedAt(LocalDateTime.now());

            university.addTranslation(translation);
        }

        University saved = universityRepository.save(university);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public UniversityDetailResponse updateUniversity(Long id, UpdateUniversityRequest request, String userEmail) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoleType userRole = user.getRole().getName();

        if (userRole == RoleType.UNIVERSITY_ADMIN) {
            if (user.getUniversity() == null || !user.getUniversity().getId().equals(id)) {
                throw new AccessDeniedException("You can only edit your own university");
            }
        } else if (userRole != RoleType.MAIN_ADMIN) {
            throw new AccessDeniedException("Access denied");
        }

        if (request.photoUrl() != null) {
            university.setPhotoUrl(request.photoUrl());
        }
        university.setWebsiteUrl(request.websiteUrl());
        university.setFoundedYear(request.foundedYear());
        university.setContactPhone(request.contactPhone());
        university.setContactEmail(request.contactEmail());
        university.setUpdatedAt(LocalDateTime.now());

        Map<String, UniversityTranslation> existingTranslations = university.getTranslations().stream()
                .collect(Collectors.toMap(t -> t.getLanguage().getCode(), Function.identity()));

        for (Map.Entry<String, UpdateUniversityRequest.TranslationDto> entry : request.translations().entrySet()) {
            String langCode = entry.getKey();
            UpdateUniversityRequest.TranslationDto dto = entry.getValue();

            UniversityTranslation translation = existingTranslations.get(langCode);
            if (translation == null) {
                Language language = languageRepository.findByCode(langCode)
                        .orElseThrow(() -> new RuntimeException("Language not found: " + langCode));
                translation = new UniversityTranslation();
                translation.setLanguage(language);
                translation.setCreatedAt(LocalDateTime.now());
                university.addTranslation(translation);
            }

            if (dto.name() != null) translation.setName(dto.name());
            if (dto.city() != null) translation.setCity(dto.city());
            if (dto.shortDescription() != null) translation.setShortDescription(dto.shortDescription());
            if (dto.description() != null) translation.setDescription(dto.description());
            if (dto.goal() != null) translation.setGoal(dto.goal());
            if (dto.address() != null) translation.setAddress(dto.address());
            if (dto.historyText() != null) translation.setHistoryText(dto.historyText());
            translation.setUpdatedAt(LocalDateTime.now());
        }

        University saved = universityRepository.save(university);
        return mapToDetailResponse(saved);
    }

    @Override
    @Transactional
    public void incrementViewCount(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));
        university.incrementViewCount();
        universityRepository.save(university);
    }

    private void validateTranslations(Map<String, CreateUniversityRequest.TranslationDto> translations) {
        if (translations == null || translations.size() != 3) {
            throw new RuntimeException("All three translations (ru, kk, en) are required");
        }

        for (String lang : REQUIRED_LANGUAGES) {
            if (!translations.containsKey(lang)) {
                throw new RuntimeException("Translation for language '" + lang + "' is required");
            }

            CreateUniversityRequest.TranslationDto dto = translations.get(lang);
            if (dto.name() == null || dto.name().isBlank()) {
                throw new RuntimeException("Name is required for language: " + lang);
            }
            if (dto.city() == null || dto.city().isBlank()) {
                throw new RuntimeException("City is required for language: " + lang);
            }
        }
    }

    private int calculateProgress(University university) {
        int progress = 0;
        int maxProgress = 100;

        if (university.getPhotoUrl() != null && !university.getPhotoUrl().isBlank()) progress += 5;
        if (university.getWebsiteUrl() != null && !university.getWebsiteUrl().isBlank()) progress += 5;
        if (university.getFoundedYear() != null) progress += 5;
        if (university.getContactPhone() != null && !university.getContactPhone().isBlank()) progress += 5;
        if (university.getContactEmail() != null && !university.getContactEmail().isBlank()) progress += 5;

        long completeTranslations = university.getTranslations().stream()
                .filter(t -> t.getName() != null && !t.getName().isBlank()
                        && t.getCity() != null && !t.getCity().isBlank()
                        && t.getDescription() != null && !t.getDescription().isBlank())
                .count();
        progress += (int) (completeTranslations * 5);

        if (!university.getLeadership().isEmpty()) progress += 10;
        if (!university.getAchievements().isEmpty()) progress += 10;
        if (!university.getFaculties().isEmpty()) progress += 15;
        if (university.getAdmissionRule() != null) progress += 10;
        if (!university.getTuitionDiscounts().isEmpty()) progress += 5;
        if (!university.getInternationalSections().isEmpty()) progress += 5;

        return Math.min(progress, maxProgress);
    }

    private UniversityDetailResponse.ProgressDto calculateDetailedProgress(University university) {
        int basicFilled = 0;
        int basicTotal = 8;
        if (university.getSlug() != null) basicFilled++;
        if (university.getPhotoUrl() != null && !university.getPhotoUrl().isBlank()) basicFilled++;
        if (university.getWebsiteUrl() != null && !university.getWebsiteUrl().isBlank()) basicFilled++;
        if (university.getFoundedYear() != null) basicFilled++;
        if (university.getContactPhone() != null && !university.getContactPhone().isBlank()) basicFilled++;
        if (university.getContactEmail() != null && !university.getContactEmail().isBlank()) basicFilled++;
        long namesCount = university.getTranslations().stream()
                .filter(t -> t.getName() != null && !t.getName().isBlank()).count();
        if (namesCount == 3) basicFilled++;
        long citiesCount = university.getTranslations().stream()
                .filter(t -> t.getCity() != null && !t.getCity().isBlank()).count();
        if (citiesCount == 3) basicFilled++;

        int descFilled = 0;
        int descTotal = 12;
        for (UniversityTranslation t : university.getTranslations()) {
            if (t.getShortDescription() != null && !t.getShortDescription().isBlank()) descFilled++;
            if (t.getDescription() != null && !t.getDescription().isBlank()) descFilled++;
            if (t.getGoal() != null && !t.getGoal().isBlank()) descFilled++;
            if (t.getHistoryText() != null && !t.getHistoryText().isBlank()) descFilled++;
        }

        int leaderFilled = university.getLeadership().size();
        int leaderTotal = Math.max(1, leaderFilled);

        int achieveFilled = university.getAchievements().size();
        int achieveTotal = Math.max(1, achieveFilled);

        int facultyFilled = university.getFaculties().size();
        int facultyTotal = Math.max(1, facultyFilled);

        int admissionFilled = 0;
        int admissionTotal = 5;
        if (university.getAdmissionRule() != null) {
            var ar = university.getAdmissionRule();
            if (ar.getStartDate() != null) admissionFilled++;
            if (ar.getEndDate() != null) admissionFilled++;
            if (ar.getDocumentsText() != null && !ar.getDocumentsText().isBlank()) admissionFilled++;
            if (ar.getStepsText() != null && !ar.getStepsText().isBlank()) admissionFilled++;
            if (ar.getDormitoryInfo() != null && !ar.getDormitoryInfo().isBlank()) admissionFilled++;
        }

        int tuitionFilled = university.getTuitionDiscounts().size();
        int tuitionTotal = Math.max(1, tuitionFilled);

        int intlFilled = university.getInternationalSections().size();
        int intlTotal = Math.max(1, intlFilled);

        int basicPercent = (basicFilled * 20) / basicTotal;
        int descPercent = (descFilled * 15) / descTotal;
        int leaderPercent = leaderFilled > 0 ? 10 : 0;
        int achievePercent = achieveFilled > 0 ? 10 : 0;
        int facultyPercent = facultyFilled > 0 ? 20 : 0;
        int admissionPercent = (admissionFilled * 10) / admissionTotal;
        int tuitionPercent = tuitionFilled > 0 ? 5 : 0;
        int intlPercent = intlFilled > 0 ? 10 : 0;

        int totalPercent = basicPercent + descPercent + leaderPercent + achievePercent +
                facultyPercent + admissionPercent + tuitionPercent + intlPercent;

        return new UniversityDetailResponse.ProgressDto(
                totalPercent,
                new UniversityDetailResponse.SectionProgress("basicInfo", basicPercent, 20, basicFilled, basicTotal),
                new UniversityDetailResponse.SectionProgress("description", descPercent, 15, descFilled, descTotal),
                new UniversityDetailResponse.SectionProgress("leadership", leaderPercent, 10, leaderFilled, leaderTotal),
                new UniversityDetailResponse.SectionProgress("achievements", achievePercent, 10, achieveFilled, achieveTotal),
                new UniversityDetailResponse.SectionProgress("faculties", facultyPercent, 20, facultyFilled, facultyTotal),
                new UniversityDetailResponse.SectionProgress("admissionRules", admissionPercent, 10, admissionFilled, admissionTotal),
                new UniversityDetailResponse.SectionProgress("tuition", tuitionPercent, 5, tuitionFilled, tuitionTotal),
                new UniversityDetailResponse.SectionProgress("international", intlPercent, 10, intlFilled, intlTotal)
        );
    }

    private boolean isTranslationComplete(UniversityTranslation t) {
        return t.getName() != null && !t.getName().isBlank()
                && t.getCity() != null && !t.getCity().isBlank()
                && t.getDescription() != null && !t.getDescription().isBlank();
    }

    private UniversityResponse mapToResponse(University university) {
        Map<String, UniversityResponse.TranslationDto> translations = new HashMap<>();

        for (UniversityTranslation t : university.getTranslations()) {
            translations.put(
                    t.getLanguage().getCode(),
                    new UniversityResponse.TranslationDto(
                            t.getName(),
                            t.getShortDescription(),
                            t.getDescription(),
                            t.getCity(),
                            isTranslationComplete(t)
                    )
            );
        }

        return new UniversityResponse(
                university.getId(),
                university.getSlug(),
                university.getPhotoUrl(),
                university.getWebsiteUrl(),
                university.getFoundedYear(),
                university.getContactPhone(),
                university.getContactEmail(),
                university.getViewCount(),
                translations,
                calculateProgress(university),
                university.getCreatedAt(),
                university.getUpdatedAt()
        );
    }

    private UniversityDetailResponse mapToDetailResponse(University university) {
        Map<String, UniversityDetailResponse.TranslationDto> translations = new HashMap<>();

        for (UniversityTranslation t : university.getTranslations()) {
            boolean complete = t.getName() != null && !t.getName().isBlank()
                    && t.getCity() != null && !t.getCity().isBlank()
                    && t.getDescription() != null && !t.getDescription().isBlank()
                    && t.getGoal() != null && !t.getGoal().isBlank();

            translations.put(
                    t.getLanguage().getCode(),
                    new UniversityDetailResponse.TranslationDto(
                            t.getName(),
                            t.getShortDescription(),
                            t.getDescription(),
                            t.getGoal(),
                            t.getAddress(),
                            t.getCity(),
                            t.getHistoryText(),
                            complete
                    )
            );
        }

        return new UniversityDetailResponse(
                university.getId(),
                university.getSlug(),
                university.getPhotoUrl(),
                university.getWebsiteUrl(),
                university.getFoundedYear(),
                university.getContactPhone(),
                university.getContactEmail(),
                university.getViewCount(),
                translations,
                calculateDetailedProgress(university),
                university.getCreatedAt(),
                university.getUpdatedAt()
        );
    }
}
