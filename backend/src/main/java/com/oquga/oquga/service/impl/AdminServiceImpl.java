package com.oquga.oquga.service.impl;

import com.oquga.oquga.dto.admin.res.UniversityAdminListResponse;
import com.oquga.oquga.entity.User;
import com.oquga.oquga.enums.RoleType;
import com.oquga.oquga.repository.UserRepository;
import com.oquga.oquga.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UniversityAdminListResponse getUniversityAdmins(String search, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Long> idPage;
        if (search == null || search.isBlank()) {
            idPage = userRepository.findIdsByRoleName(RoleType.UNIVERSITY_ADMIN, pageRequest);
        } else {
            idPage = userRepository.findIdsByRoleNameAndSearch(RoleType.UNIVERSITY_ADMIN, search.trim(), pageRequest);
        }

        List<UniversityAdminListResponse.UniversityAdminDto> data;
        if (idPage.getContent().isEmpty()) {
            data = List.of();
        } else {
            List<User> users = userRepository.findByIdsWithUniversityAndTranslations(idPage.getContent());

            Map<Long, User> userMap = users.stream()
                    .collect(Collectors.toMap(User::getId, Function.identity()));

            data = idPage.getContent().stream()
                    .map(userMap::get)
                    .filter(Objects::nonNull)
                    .map(this::mapToDto)
                    .toList();
        }

        return new UniversityAdminListResponse(
                data,
                new UniversityAdminListResponse.MetaDto(
                        idPage.getTotalElements(),
                        page,
                        limit,
                        idPage.getTotalPages()
                )
        );
    }

    private UniversityAdminListResponse.UniversityAdminDto mapToDto(User user) {
        return new UniversityAdminListResponse.UniversityAdminDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getIsActive(),
                user.getUniversity() != null ? user.getUniversity().getId() : null,
                user.getUniversity() != null ? getUniversityName(user) : null,
                user.getCreatedAt()
        );
    }

    private String getUniversityName(User user) {
        if (user.getUniversity() == null) return null;
        var translations = user.getUniversity().getTranslations();
        if (translations.isEmpty()) return user.getUniversity().getSlug();
        return translations.stream()
                .filter(t -> "ru".equals(t.getLanguage().getCode()))
                .findFirst()
                .map(t -> t.getName())
                .orElse(translations.get(0).getName());
    }
}
