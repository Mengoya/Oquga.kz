package com.oquga.oquga.service;

import com.oquga.oquga.dto.university.req.CreateUniversityRequest;
import com.oquga.oquga.dto.university.res.UniversityListResponse;
import com.oquga.oquga.dto.university.res.UniversityResponse;

public interface UniversityService {

    UniversityListResponse getUniversities(String search, int page, int limit);

    UniversityResponse getUniversityById(Long id);

    UniversityResponse createUniversity(CreateUniversityRequest request);
}
