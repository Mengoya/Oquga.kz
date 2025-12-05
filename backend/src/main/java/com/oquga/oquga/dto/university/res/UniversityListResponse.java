package com.oquga.oquga.dto.university.res;

import java.util.List;

public record UniversityListResponse(
        List<UniversityResponse> data,
        MetaDto meta
) {
    public record MetaDto(
            long total,
            int page,
            int limit,
            int totalPages
    ) {}
}
