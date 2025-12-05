package com.oquga.oquga.dto.admin.res;

import java.time.LocalDateTime;
import java.util.List;

public record UniversityAdminListResponse(
        List<UniversityAdminDto> data,
        MetaDto meta
) {
    public record UniversityAdminDto(
            Long id,
            String email,
            String firstName,
            String lastName,
            Boolean isActive,
            Long universityId,
            String universityName,
            LocalDateTime createdAt
    ) {}

    public record MetaDto(
            long total,
            int page,
            int limit,
            int totalPages
    ) {}
}
