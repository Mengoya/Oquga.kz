package com.oquga.oquga.service;

import com.oquga.oquga.dto.university.req.CreateUniversityRequest;
import com.oquga.oquga.dto.university.req.UpdateUniversityRequest;
import com.oquga.oquga.dto.university.res.UniversityDetailResponse;
import com.oquga.oquga.dto.university.res.UniversityListResponse;
import com.oquga.oquga.dto.university.res.UniversityResponse;

public interface UniversityService {

    UniversityListResponse getUniversities(String search, int page, int limit);

    UniversityResponse getUniversityById(Long id);

    UniversityDetailResponse getUniversityDetail(Long id);

    UniversityResponse createUniversity(CreateUniversityRequest request);

    UniversityDetailResponse updateUniversity(Long id, UpdateUniversityRequest request, String userEmail);

    void incrementViewCount(Long id);
}
