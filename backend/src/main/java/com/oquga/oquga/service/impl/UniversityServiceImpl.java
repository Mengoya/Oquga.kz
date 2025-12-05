package com.oquga.oquga.service.impl;

import com.oquga.oquga.dto.university.req.CreateUniversityRequest;
import com.oquga.oquga.dto.university.res.UniversityListResponse;
import com.oquga.oquga.dto.university.res.UniversityResponse;
import com.oquga.oquga.entity.Language;
import com.oquga.oquga.entity.University;
import com.oquga.oquga.entity.translation.UniversityTranslation;
import com.oquga.oquga.repository.LanguageRepository;
import com.oquga.oquga.repository.UniversityRepository;
import com.oquga.oquga.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UniversityServiceImpl implements UniversityService {

    private final UniversityRepository universityRepository;
    private final LanguageRepository languageRepository;

    @Override
    @Transactional(readOnly = true)
    public UniversityListResponse getUniversities(String search, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(
                page - 1,
                limit,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<University> universityPage = universityRepository.findAllWithSearch(
                search == null || search.isBlank() ? null : search,
                pageRequest
        );

        List<UniversityResponse> data = universityPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return new UniversityListResponse(
                data,
                new UniversityListResponse.MetaDto(
                        universityPage.getTotalElements(),
                        page,
                        limit,
                        universityPage.getTotalPages()
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
    @Transactional
    public UniversityResponse createUniversity(CreateUniversityRequest request) {
        if (universityRepository.existsBySlug(request.slug())) {
            throw new RuntimeException("University with this slug already exists");
        }

        University university = new University();
        university.setSlug(request.slug());
        university.setWebsiteUrl(request.websiteUrl());
        university.setFoundedYear(request.foundedYear());
        university.setContactPhone(request.contactPhone());
        university.setContactEmail(request.contactEmail());
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
            translation.setDescription(translationDto.description());
            translation.setCity(translationDto.city());
            translation.setCreatedAt(LocalDateTime.now());
            translation.setUpdatedAt(LocalDateTime.now());

            university.addTranslation(translation);
        }

        University saved = universityRepository.save(university);
        return mapToResponse(saved);
    }

    private UniversityResponse mapToResponse(University university) {
        Map<String, UniversityResponse.TranslationDto> translations = new HashMap<>();

        for (UniversityTranslation t : university.getTranslations()) {
            translations.put(
                    t.getLanguage().getCode(),
                    new UniversityResponse.TranslationDto(
                            t.getName(),
                            t.getDescription(),
                            t.getCity()
                    )
            );
        }

        return new UniversityResponse(
                university.getId(),
                university.getSlug(),
                university.getWebsiteUrl(),
                university.getFoundedYear(),
                university.getContactPhone(),
                university.getContactEmail(),
                translations,
                university.getCreatedAt(),
                university.getUpdatedAt()
        );
    }
}
