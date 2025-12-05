package com.oquga.oquga.service.impl;

import com.oquga.oquga.dto.university.req.CreateUniversityRequest;
import com.oquga.oquga.dto.university.req.UpdateUniversityRequest;
import com.oquga.oquga.dto.university.res.UniversityDetailResponse;
import com.oquga.oquga.dto.university.res.UniversityListResponse;
import com.oquga.oquga.dto.university.res.UniversityResponse;
import com.oquga.oquga.entity.*;
import com.oquga.oquga.entity.translation.*;
import com.oquga.oquga.enums.DegreeLevel;
import com.oquga.oquga.enums.RoleType;
import com.oquga.oquga.repository.*;
import com.oquga.oquga.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityServiceImpl implements UniversityService {

    private static final Set<String> REQUIRED_LANGUAGES = Set.of("ru", "kk", "en");

    private final UniversityRepository universityRepository;
    private final LanguageRepository languageRepository;
    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final EducationalProgramGroupRepository programGroupRepository;
    private final InternationalSectionRepository internationalSectionRepository;

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
        University university = universityRepository.findByIdWithTranslationsAndAdmission(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));

        universityRepository.findByIdWithLeadership(id);
        universityRepository.findByIdWithAchievements(id);
        universityRepository.findByIdWithHistoryEvents(id);
        universityRepository.findByIdWithTuitionDiscounts(id);

        universityRepository.findByIdWithFaculties(id);
        universityRepository.findByIdWithInternationalSections(id);

        facultyRepository.findByUniversityIdWithDepartments(id);
        facultyRepository.findByUniversityIdWithProgramGroups(id);

        programGroupRepository.findByUniversityIdWithPrograms(id);

        internationalSectionRepository.findByUniversityIdWithItems(id);

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
        University university = universityRepository.findByIdWithTranslationsAndAdmission(id)
                .orElseThrow(() -> new RuntimeException("University not found"));

        universityRepository.findByIdWithLeadership(id);
        universityRepository.findByIdWithAchievements(id);
        universityRepository.findByIdWithHistoryEvents(id);
        universityRepository.findByIdWithTuitionDiscounts(id);
        universityRepository.findByIdWithFaculties(id);
        universityRepository.findByIdWithInternationalSections(id);

        facultyRepository.findByUniversityIdWithDepartments(id);
        facultyRepository.findByUniversityIdWithProgramGroups(id);
        programGroupRepository.findByUniversityIdWithPrograms(id);
        internationalSectionRepository.findByUniversityIdWithItems(id);

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

        updateBasicInfo(university, request);
        updateTranslations(university, request.translations());
        updateLeadership(university, request.leadership());
        updateAchievements(university, request.achievements());
        updateHistoryEvents(university, request.historyEvents());
        updateFaculties(university, request.faculties());
        updateAdmissionRule(university, request.admissionRule());
        updateTuitionDiscounts(university, request.tuitionDiscounts());
        updateInternationalSections(university, request.internationalSections());

        university.setUpdatedAt(LocalDateTime.now());
        University saved = universityRepository.save(university);

        return getUniversityDetail(saved.getId());
    }

    @Override
    @Transactional
    public void incrementViewCount(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));
        university.incrementViewCount();
        universityRepository.save(university);
    }

    private void updateBasicInfo(University university, UpdateUniversityRequest request) {
        if (request.photoUrl() != null) {
            university.setPhotoUrl(request.photoUrl());
        }
        university.setWebsiteUrl(request.websiteUrl());
        university.setFoundedYear(request.foundedYear());
        university.setContactPhone(request.contactPhone());
        university.setContactEmail(request.contactEmail());
    }

    private void updateTranslations(University university, Map<String, UpdateUniversityRequest.TranslationDto> translations) {
        if (translations == null) return;

        Map<String, UniversityTranslation> existingTranslations = university.getTranslations().stream()
                .collect(Collectors.toMap(t -> t.getLanguage().getCode(), Function.identity()));

        for (Map.Entry<String, UpdateUniversityRequest.TranslationDto> entry : translations.entrySet()) {
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
    }

    private void updateLeadership(University university, List<UpdateUniversityRequest.LeadershipDto> leadershipList) {
        if (leadershipList == null) return;

        Set<Long> incomingIds = leadershipList.stream()
                .map(UpdateUniversityRequest.LeadershipDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        university.getLeadership().removeIf(l -> l.getId() != null && !incomingIds.contains(l.getId()));

        Map<Long, Leadership> existingMap = university.getLeadership().stream()
                .filter(l -> l.getId() != null)
                .collect(Collectors.toMap(Leadership::getId, Function.identity()));

        for (UpdateUniversityRequest.LeadershipDto dto : leadershipList) {
            Leadership leader;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                leader = existingMap.get(dto.id());
            } else {
                leader = new Leadership();
                leader.setCreatedAt(LocalDateTime.now());
                university.addLeadership(leader);
            }
            leader.setFullName(dto.fullName());
            leader.setPosition(dto.position());
            leader.setBioSummary(dto.bioSummary());
            leader.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            leader.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updateAchievements(University university, List<UpdateUniversityRequest.AchievementDto> achievementList) {
        if (achievementList == null) return;

        Set<Long> incomingIds = achievementList.stream()
                .map(UpdateUniversityRequest.AchievementDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        university.getAchievements().removeIf(a -> a.getId() != null && !incomingIds.contains(a.getId()));

        Map<Long, Achievement> existingMap = university.getAchievements().stream()
                .filter(a -> a.getId() != null)
                .collect(Collectors.toMap(Achievement::getId, Function.identity()));

        for (UpdateUniversityRequest.AchievementDto dto : achievementList) {
            Achievement achievement;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                achievement = existingMap.get(dto.id());
            } else {
                achievement = new Achievement();
                achievement.setCreatedAt(LocalDateTime.now());
                university.addAchievement(achievement);
            }
            achievement.setTitle(dto.title());
            achievement.setYear(dto.year());
            achievement.setRankValue(dto.rankValue());
            achievement.setDetails(dto.details());
            achievement.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            achievement.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updateHistoryEvents(University university, List<UpdateUniversityRequest.HistoryEventDto> historyList) {
        if (historyList == null) return;

        Set<Long> incomingIds = historyList.stream()
                .map(UpdateUniversityRequest.HistoryEventDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        university.getHistoryEvents().removeIf(h -> h.getId() != null && !incomingIds.contains(h.getId()));

        Map<Long, HistoryEvent> existingMap = university.getHistoryEvents().stream()
                .filter(h -> h.getId() != null)
                .collect(Collectors.toMap(HistoryEvent::getId, Function.identity()));

        for (UpdateUniversityRequest.HistoryEventDto dto : historyList) {
            HistoryEvent event;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                event = existingMap.get(dto.id());
            } else {
                event = new HistoryEvent();
                event.setCreatedAt(LocalDateTime.now());
                university.addHistoryEvent(event);
            }
            event.setEventYear(dto.eventYear());
            event.setEventDescription(dto.eventDescription());
            event.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            event.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updateFaculties(University university, List<UpdateUniversityRequest.FacultyDto> facultyList) {
        if (facultyList == null) return;

        Set<Long> incomingIds = facultyList.stream()
                .map(UpdateUniversityRequest.FacultyDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        university.getFaculties().removeIf(f -> f.getId() != null && !incomingIds.contains(f.getId()));

        Map<Long, Faculty> existingMap = university.getFaculties().stream()
                .filter(f -> f.getId() != null)
                .collect(Collectors.toMap(Faculty::getId, Function.identity()));

        for (UpdateUniversityRequest.FacultyDto dto : facultyList) {
            Faculty faculty;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                faculty = existingMap.get(dto.id());
            } else {
                faculty = new Faculty();
                faculty.setCreatedAt(LocalDateTime.now());
                university.addFaculty(faculty);
            }
            faculty.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            faculty.setUpdatedAt(LocalDateTime.now());

            updateFacultyTranslations(faculty, dto.translations());
            updateDepartments(faculty, dto.departments());
            updateProgramGroups(faculty, dto.programGroups());
        }
    }

    private void updateFacultyTranslations(Faculty faculty, Map<String, UpdateUniversityRequest.FacultyTranslationDto> translations) {
        if (translations == null) return;

        Map<String, FacultyTranslation> existingMap = faculty.getTranslations().stream()
                .collect(Collectors.toMap(t -> t.getLanguage().getCode(), Function.identity()));

        for (Map.Entry<String, UpdateUniversityRequest.FacultyTranslationDto> entry : translations.entrySet()) {
            String langCode = entry.getKey();
            UpdateUniversityRequest.FacultyTranslationDto dto = entry.getValue();

            FacultyTranslation translation = existingMap.get(langCode);
            if (translation == null) {
                Language language = languageRepository.findByCode(langCode)
                        .orElseThrow(() -> new RuntimeException("Language not found: " + langCode));
                translation = new FacultyTranslation();
                translation.setLanguage(language);
                translation.setCreatedAt(LocalDateTime.now());
                faculty.addTranslation(translation);
            }
            translation.setName(dto.name());
            translation.setDescription(dto.description());
            translation.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updateDepartments(Faculty faculty, List<UpdateUniversityRequest.DepartmentDto> departmentList) {
        if (departmentList == null) return;

        Set<Long> incomingIds = departmentList.stream()
                .map(UpdateUniversityRequest.DepartmentDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        faculty.getDepartments().removeIf(d -> d.getId() != null && !incomingIds.contains(d.getId()));

        Map<Long, Department> existingMap = faculty.getDepartments().stream()
                .filter(d -> d.getId() != null)
                .collect(Collectors.toMap(Department::getId, Function.identity()));

        for (UpdateUniversityRequest.DepartmentDto dto : departmentList) {
            Department department;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                department = existingMap.get(dto.id());
            } else {
                department = new Department();
                department.setCreatedAt(LocalDateTime.now());
                faculty.addDepartment(department);
            }
            department.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            department.setUpdatedAt(LocalDateTime.now());

            updateDepartmentTranslations(department, dto.translations());
        }
    }

    private void updateDepartmentTranslations(Department department, Map<String, UpdateUniversityRequest.DepartmentTranslationDto> translations) {
        if (translations == null) return;

        Map<String, DepartmentTranslation> existingMap = department.getTranslations().stream()
                .collect(Collectors.toMap(t -> t.getLanguage().getCode(), Function.identity()));

        for (Map.Entry<String, UpdateUniversityRequest.DepartmentTranslationDto> entry : translations.entrySet()) {
            String langCode = entry.getKey();
            UpdateUniversityRequest.DepartmentTranslationDto dto = entry.getValue();

            DepartmentTranslation translation = existingMap.get(langCode);
            if (translation == null) {
                Language language = languageRepository.findByCode(langCode)
                        .orElseThrow(() -> new RuntimeException("Language not found: " + langCode));
                translation = new DepartmentTranslation();
                translation.setLanguage(language);
                translation.setCreatedAt(LocalDateTime.now());
                department.addTranslation(translation);
            }
            translation.setName(dto.name());
            translation.setGoal(dto.goal());
            translation.setMission(dto.mission());
            translation.setTasks(dto.tasks());
            translation.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updateProgramGroups(Faculty faculty, List<UpdateUniversityRequest.EducationalProgramGroupDto> groupList) {
        if (groupList == null) return;

        Set<Long> incomingIds = groupList.stream()
                .map(UpdateUniversityRequest.EducationalProgramGroupDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        faculty.getProgramGroups().removeIf(g -> g.getId() != null && !incomingIds.contains(g.getId()));

        Map<Long, EducationalProgramGroup> existingMap = faculty.getProgramGroups().stream()
                .filter(g -> g.getId() != null)
                .collect(Collectors.toMap(EducationalProgramGroup::getId, Function.identity()));

        Map<Long, Department> departmentMap = faculty.getDepartments().stream()
                .filter(d -> d.getId() != null)
                .collect(Collectors.toMap(Department::getId, Function.identity()));

        for (UpdateUniversityRequest.EducationalProgramGroupDto dto : groupList) {
            EducationalProgramGroup group;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                group = existingMap.get(dto.id());
            } else {
                group = new EducationalProgramGroup();
                group.setCreatedAt(LocalDateTime.now());
                faculty.addProgramGroup(group);
            }

            if (dto.departmentId() != null && departmentMap.containsKey(dto.departmentId())) {
                group.setDepartment(departmentMap.get(dto.departmentId()));
            } else {
                group.setDepartment(null);
            }

            group.setDegreeLevel(dto.degreeLevel() != null ? DegreeLevel.valueOf(dto.degreeLevel()) : DegreeLevel.BACHELOR);
            group.setCode(dto.code());
            group.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            group.setUpdatedAt(LocalDateTime.now());

            updateProgramGroupTranslations(group, dto.translations());
            updatePrograms(group, dto.programs());
            updatePassingScore(group, dto.passingScore());
        }
    }

    private void updateProgramGroupTranslations(EducationalProgramGroup group, Map<String, UpdateUniversityRequest.ProgramGroupTranslationDto> translations) {
        if (translations == null) return;

        Map<String, EducationalProgramGroupTranslation> existingMap = group.getTranslations().stream()
                .collect(Collectors.toMap(t -> t.getLanguage().getCode(), Function.identity()));

        for (Map.Entry<String, UpdateUniversityRequest.ProgramGroupTranslationDto> entry : translations.entrySet()) {
            String langCode = entry.getKey();
            UpdateUniversityRequest.ProgramGroupTranslationDto dto = entry.getValue();

            EducationalProgramGroupTranslation translation = existingMap.get(langCode);
            if (translation == null) {
                Language language = languageRepository.findByCode(langCode)
                        .orElseThrow(() -> new RuntimeException("Language not found: " + langCode));
                translation = new EducationalProgramGroupTranslation();
                translation.setLanguage(language);
                translation.setCreatedAt(LocalDateTime.now());
                group.addTranslation(translation);
            }
            translation.setName(dto.name());
            translation.setDescription(dto.description());
            translation.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updatePrograms(EducationalProgramGroup group, List<UpdateUniversityRequest.EducationalProgramDto> programList) {
        if (programList == null) return;

        Set<Long> incomingIds = programList.stream()
                .map(UpdateUniversityRequest.EducationalProgramDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        group.getPrograms().removeIf(p -> p.getId() != null && !incomingIds.contains(p.getId()));

        Map<Long, EducationalProgram> existingMap = group.getPrograms().stream()
                .filter(p -> p.getId() != null)
                .collect(Collectors.toMap(EducationalProgram::getId, Function.identity()));

        for (UpdateUniversityRequest.EducationalProgramDto dto : programList) {
            EducationalProgram program;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                program = existingMap.get(dto.id());
            } else {
                program = new EducationalProgram();
                program.setCreatedAt(LocalDateTime.now());
                group.addProgram(program);
            }
            program.setCode(dto.code());
            program.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            program.setUpdatedAt(LocalDateTime.now());

            updateProgramTranslations(program, dto.translations());
        }
    }

    private void updateProgramTranslations(EducationalProgram program, Map<String, UpdateUniversityRequest.ProgramTranslationDto> translations) {
        if (translations == null) return;

        Map<String, EducationalProgramTranslation> existingMap = program.getTranslations().stream()
                .collect(Collectors.toMap(t -> t.getLanguage().getCode(), Function.identity()));

        for (Map.Entry<String, UpdateUniversityRequest.ProgramTranslationDto> entry : translations.entrySet()) {
            String langCode = entry.getKey();
            UpdateUniversityRequest.ProgramTranslationDto dto = entry.getValue();

            EducationalProgramTranslation translation = existingMap.get(langCode);
            if (translation == null) {
                Language language = languageRepository.findByCode(langCode)
                        .orElseThrow(() -> new RuntimeException("Language not found: " + langCode));
                translation = new EducationalProgramTranslation();
                translation.setLanguage(language);
                translation.setCreatedAt(LocalDateTime.now());
                program.addTranslation(translation);
            }
            translation.setName(dto.name());
            translation.setDescription(dto.description());
            translation.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updatePassingScore(EducationalProgramGroup group, UpdateUniversityRequest.PassingScoreDto dto) {
        if (dto == null) {
            group.setPassingScore(null);
            return;
        }

        PassingScore score = group.getPassingScore();
        if (score == null) {
            score = new PassingScore();
            score.setCreatedAt(LocalDateTime.now());
            group.setPassingScore(score);
        }
        score.setMinScoreGrant(dto.minScoreGrant());
        score.setMinScorePaid(dto.minScorePaid());
        score.setProfileSubjects(dto.profileSubjects());
        score.setIsCreativeExam(dto.isCreativeExam() != null ? dto.isCreativeExam() : false);
        score.setUpdatedAt(LocalDateTime.now());
    }

    private void updateAdmissionRule(University university, UpdateUniversityRequest.AdmissionRuleDto dto) {
        if (dto == null) {
            university.setAdmissionRule(null);
            return;
        }

        AdmissionRule rule = university.getAdmissionRule();
        if (rule == null) {
            rule = new AdmissionRule();
            rule.setCreatedAt(LocalDateTime.now());
            university.setAdmissionRule(rule);
        }
        rule.setStartDate(dto.startDate());
        rule.setEndDate(dto.endDate());
        rule.setDocumentsText(dto.documentsText());
        rule.setStepsText(dto.stepsText());
        rule.setMilitaryDepartmentInfo(dto.militaryDepartmentInfo());
        rule.setDormitoryInfo(dto.dormitoryInfo());
        rule.setUpdatedAt(LocalDateTime.now());
    }

    private void updateTuitionDiscounts(University university, List<UpdateUniversityRequest.TuitionDiscountDto> discountList) {
        if (discountList == null) return;

        Set<Long> incomingIds = discountList.stream()
                .map(UpdateUniversityRequest.TuitionDiscountDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        university.getTuitionDiscounts().removeIf(d -> d.getId() != null && !incomingIds.contains(d.getId()));

        Map<Long, TuitionDiscount> existingMap = university.getTuitionDiscounts().stream()
                .filter(d -> d.getId() != null)
                .collect(Collectors.toMap(TuitionDiscount::getId, Function.identity()));

        for (UpdateUniversityRequest.TuitionDiscountDto dto : discountList) {
            TuitionDiscount discount;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                discount = existingMap.get(dto.id());
            } else {
                discount = new TuitionDiscount();
                discount.setCreatedAt(LocalDateTime.now());
                university.addTuitionDiscount(discount);
            }
            discount.setCategoryName(dto.categoryName());
            discount.setPricePerYear(dto.pricePerYear());
            discount.setScholarshipInfo(dto.scholarshipInfo());
            discount.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            discount.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updateInternationalSections(University university, List<UpdateUniversityRequest.InternationalSectionDto> sectionList) {
        if (sectionList == null) return;

        Set<Long> incomingIds = sectionList.stream()
                .map(UpdateUniversityRequest.InternationalSectionDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        university.getInternationalSections().removeIf(s -> s.getId() != null && !incomingIds.contains(s.getId()));

        Map<Long, InternationalSection> existingMap = university.getInternationalSections().stream()
                .filter(s -> s.getId() != null)
                .collect(Collectors.toMap(InternationalSection::getId, Function.identity()));

        for (UpdateUniversityRequest.InternationalSectionDto dto : sectionList) {
            InternationalSection section;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                section = existingMap.get(dto.id());
            } else {
                section = new InternationalSection();
                section.setCreatedAt(LocalDateTime.now());
                university.addInternationalSection(section);
            }
            section.setExternalUrl(dto.externalUrl());
            section.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            section.setIsActive(dto.isActive() != null ? dto.isActive() : true);
            section.setUpdatedAt(LocalDateTime.now());

            updateInternationalSectionTranslations(section, dto.translations());
            updateInternationalItems(section, dto.items());
        }
    }

    private void updateInternationalSectionTranslations(InternationalSection section, Map<String, UpdateUniversityRequest.InternationalSectionTranslationDto> translations) {
        if (translations == null) return;

        Map<String, InternationalSectionTranslation> existingMap = section.getTranslations().stream()
                .collect(Collectors.toMap(t -> t.getLanguage().getCode(), Function.identity()));

        for (Map.Entry<String, UpdateUniversityRequest.InternationalSectionTranslationDto> entry : translations.entrySet()) {
            String langCode = entry.getKey();
            UpdateUniversityRequest.InternationalSectionTranslationDto dto = entry.getValue();

            InternationalSectionTranslation translation = existingMap.get(langCode);
            if (translation == null) {
                Language language = languageRepository.findByCode(langCode)
                        .orElseThrow(() -> new RuntimeException("Language not found: " + langCode));
                translation = new InternationalSectionTranslation();
                translation.setLanguage(language);
                translation.setCreatedAt(LocalDateTime.now());
                section.addTranslation(translation);
            }
            translation.setTitle(dto.title());
            translation.setDescription(dto.description());
            translation.setUpdatedAt(LocalDateTime.now());
        }
    }

    private void updateInternationalItems(InternationalSection section, List<UpdateUniversityRequest.InternationalItemDto> itemList) {
        if (itemList == null) return;

        Set<Long> incomingIds = itemList.stream()
                .map(UpdateUniversityRequest.InternationalItemDto::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        section.getItems().removeIf(i -> i.getId() != null && !incomingIds.contains(i.getId()));

        Map<Long, InternationalItem> existingMap = section.getItems().stream()
                .filter(i -> i.getId() != null)
                .collect(Collectors.toMap(InternationalItem::getId, Function.identity()));

        for (UpdateUniversityRequest.InternationalItemDto dto : itemList) {
            InternationalItem item;
            if (dto.id() != null && existingMap.containsKey(dto.id())) {
                item = existingMap.get(dto.id());
            } else {
                item = new InternationalItem();
                item.setCreatedAt(LocalDateTime.now());
                section.addItem(item);
            }
            item.setExternalUrl(dto.externalUrl());
            item.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 0);
            item.setIsActive(dto.isActive() != null ? dto.isActive() : true);
            item.setUpdatedAt(LocalDateTime.now());

            updateInternationalItemTranslations(item, dto.translations());
        }
    }

    private void updateInternationalItemTranslations(InternationalItem item, Map<String, UpdateUniversityRequest.InternationalItemTranslationDto> translations) {
        if (translations == null) return;

        Map<String, InternationalItemTranslation> existingMap = item.getTranslations().stream()
                .collect(Collectors.toMap(t -> t.getLanguage().getCode(), Function.identity()));

        for (Map.Entry<String, UpdateUniversityRequest.InternationalItemTranslationDto> entry : translations.entrySet()) {
            String langCode = entry.getKey();
            UpdateUniversityRequest.InternationalItemTranslationDto dto = entry.getValue();

            InternationalItemTranslation translation = existingMap.get(langCode);
            if (translation == null) {
                Language language = languageRepository.findByCode(langCode)
                        .orElseThrow(() -> new RuntimeException("Language not found: " + langCode));
                translation = new InternationalItemTranslation();
                translation.setLanguage(language);
                translation.setCreatedAt(LocalDateTime.now());
                item.addTranslation(translation);
            }
            translation.setTitle(dto.title());
            translation.setDescription(dto.description());
            translation.setUpdatedAt(LocalDateTime.now());
        }
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

        List<UniversityDetailResponse.LeadershipDto> leadershipList = university.getLeadership().stream()
                .sorted(Comparator.comparingInt(l -> l.getSortOrder() != null ? l.getSortOrder() : 0))
                .map(l -> new UniversityDetailResponse.LeadershipDto(
                        l.getId(), l.getFullName(), l.getPosition(), l.getBioSummary(), l.getSortOrder()
                ))
                .toList();

        List<UniversityDetailResponse.AchievementDto> achievementList = university.getAchievements().stream()
                .sorted(Comparator.comparingInt(a -> a.getSortOrder() != null ? a.getSortOrder() : 0))
                .map(a -> new UniversityDetailResponse.AchievementDto(
                        a.getId(), a.getTitle(), a.getYear(), a.getRankValue(), a.getDetails(), a.getSortOrder()
                ))
                .toList();

        List<UniversityDetailResponse.HistoryEventDto> historyList = university.getHistoryEvents().stream()
                .sorted(Comparator.comparingInt(h -> h.getSortOrder() != null ? h.getSortOrder() : 0))
                .map(h -> new UniversityDetailResponse.HistoryEventDto(
                        h.getId(), h.getEventYear(), h.getEventDescription(), h.getSortOrder()
                ))
                .toList();

        List<UniversityDetailResponse.FacultyDto> facultyList = university.getFaculties().stream()
                .sorted(Comparator.comparingInt(f -> f.getSortOrder() != null ? f.getSortOrder() : 0))
                .map(this::mapFacultyToDto)
                .toList();

        UniversityDetailResponse.AdmissionRuleDto admissionRuleDto = null;
        if (university.getAdmissionRule() != null) {
            var ar = university.getAdmissionRule();
            admissionRuleDto = new UniversityDetailResponse.AdmissionRuleDto(
                    ar.getStartDate(), ar.getEndDate(), ar.getDocumentsText(),
                    ar.getStepsText(), ar.getMilitaryDepartmentInfo(), ar.getDormitoryInfo()
            );
        }

        List<UniversityDetailResponse.TuitionDiscountDto> tuitionList = university.getTuitionDiscounts().stream()
                .sorted(Comparator.comparingInt(t -> t.getSortOrder() != null ? t.getSortOrder() : 0))
                .map(t -> new UniversityDetailResponse.TuitionDiscountDto(
                        t.getId(), t.getCategoryName(), t.getPricePerYear(), t.getScholarshipInfo(), t.getSortOrder()
                ))
                .toList();

        List<UniversityDetailResponse.InternationalSectionDto> internationalList = university.getInternationalSections().stream()
                .sorted(Comparator.comparingInt(s -> s.getSortOrder() != null ? s.getSortOrder() : 0))
                .map(this::mapInternationalSectionToDto)
                .toList();

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
                leadershipList,
                achievementList,
                historyList,
                facultyList,
                admissionRuleDto,
                tuitionList,
                internationalList,
                calculateDetailedProgress(university),
                university.getCreatedAt(),
                university.getUpdatedAt()
        );
    }

    private UniversityDetailResponse.FacultyDto mapFacultyToDto(Faculty faculty) {
        Map<String, UniversityDetailResponse.FacultyTranslationDto> translations = new HashMap<>();
        for (FacultyTranslation t : faculty.getTranslations()) {
            translations.put(t.getLanguage().getCode(),
                    new UniversityDetailResponse.FacultyTranslationDto(t.getName(), t.getDescription()));
        }

        List<UniversityDetailResponse.DepartmentDto> departments = faculty.getDepartments().stream()
                .sorted(Comparator.comparingInt(d -> d.getSortOrder() != null ? d.getSortOrder() : 0))
                .map(this::mapDepartmentToDto)
                .toList();

        List<UniversityDetailResponse.EducationalProgramGroupDto> programGroups = faculty.getProgramGroups().stream()
                .sorted(Comparator.comparingInt(g -> g.getSortOrder() != null ? g.getSortOrder() : 0))
                .map(this::mapProgramGroupToDto)
                .toList();

        return new UniversityDetailResponse.FacultyDto(
                faculty.getId(), faculty.getSortOrder(), translations, departments, programGroups
        );
    }

    private UniversityDetailResponse.DepartmentDto mapDepartmentToDto(Department department) {
        Map<String, UniversityDetailResponse.DepartmentTranslationDto> translations = new HashMap<>();
        for (DepartmentTranslation t : department.getTranslations()) {
            translations.put(t.getLanguage().getCode(),
                    new UniversityDetailResponse.DepartmentTranslationDto(t.getName(), t.getGoal(), t.getMission(), t.getTasks()));
        }
        return new UniversityDetailResponse.DepartmentDto(department.getId(), department.getSortOrder(), translations);
    }

    private UniversityDetailResponse.EducationalProgramGroupDto mapProgramGroupToDto(EducationalProgramGroup group) {
        Map<String, UniversityDetailResponse.ProgramGroupTranslationDto> translations = new HashMap<>();
        for (EducationalProgramGroupTranslation t : group.getTranslations()) {
            translations.put(t.getLanguage().getCode(),
                    new UniversityDetailResponse.ProgramGroupTranslationDto(t.getName(), t.getDescription()));
        }

        List<UniversityDetailResponse.EducationalProgramDto> programs = group.getPrograms().stream()
                .sorted(Comparator.comparingInt(p -> p.getSortOrder() != null ? p.getSortOrder() : 0))
                .map(this::mapProgramToDto)
                .toList();

        UniversityDetailResponse.PassingScoreDto passingScoreDto = null;
        if (group.getPassingScore() != null) {
            var ps = group.getPassingScore();
            passingScoreDto = new UniversityDetailResponse.PassingScoreDto(
                    ps.getMinScoreGrant(), ps.getMinScorePaid(), ps.getProfileSubjects(), ps.getIsCreativeExam()
            );
        }

        return new UniversityDetailResponse.EducationalProgramGroupDto(
                group.getId(),
                group.getDepartment() != null ? group.getDepartment().getId() : null,
                group.getDegreeLevel().name(),
                group.getCode(),
                group.getSortOrder(),
                translations,
                programs,
                passingScoreDto
        );
    }

    private UniversityDetailResponse.EducationalProgramDto mapProgramToDto(EducationalProgram program) {
        Map<String, UniversityDetailResponse.ProgramTranslationDto> translations = new HashMap<>();
        for (EducationalProgramTranslation t : program.getTranslations()) {
            translations.put(t.getLanguage().getCode(),
                    new UniversityDetailResponse.ProgramTranslationDto(t.getName(), t.getDescription()));
        }
        return new UniversityDetailResponse.EducationalProgramDto(
                program.getId(), program.getCode(), program.getSortOrder(), translations
        );
    }

    private UniversityDetailResponse.InternationalSectionDto mapInternationalSectionToDto(InternationalSection section) {
        Map<String, UniversityDetailResponse.InternationalSectionTranslationDto> translations = new HashMap<>();
        for (InternationalSectionTranslation t : section.getTranslations()) {
            translations.put(t.getLanguage().getCode(),
                    new UniversityDetailResponse.InternationalSectionTranslationDto(t.getTitle(), t.getDescription()));
        }

        List<UniversityDetailResponse.InternationalItemDto> items = section.getItems().stream()
                .sorted(Comparator.comparingInt(i -> i.getSortOrder() != null ? i.getSortOrder() : 0))
                .map(this::mapInternationalItemToDto)
                .toList();

        return new UniversityDetailResponse.InternationalSectionDto(
                section.getId(), section.getExternalUrl(), section.getSortOrder(), section.getIsActive(),
                translations, items
        );
    }

    private UniversityDetailResponse.InternationalItemDto mapInternationalItemToDto(InternationalItem item) {
        Map<String, UniversityDetailResponse.InternationalItemTranslationDto> translations = new HashMap<>();
        for (InternationalItemTranslation t : item.getTranslations()) {
            translations.put(t.getLanguage().getCode(),
                    new UniversityDetailResponse.InternationalItemTranslationDto(t.getTitle(), t.getDescription()));
        }
        return new UniversityDetailResponse.InternationalItemDto(
                item.getId(), item.getExternalUrl(), item.getSortOrder(), item.getIsActive(), translations
        );
    }
}
