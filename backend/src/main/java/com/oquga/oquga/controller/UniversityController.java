package com.oquga.oquga.controller;

import com.oquga.oquga.dto.university.req.CreateUniversityRequest;
import com.oquga.oquga.dto.university.req.UpdateUniversityRequest;
import com.oquga.oquga.dto.university.res.UniversityDetailResponse;
import com.oquga.oquga.dto.university.res.UniversityListResponse;
import com.oquga.oquga.dto.university.res.UniversityResponse;
import com.oquga.oquga.service.UniversityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    @GetMapping
    public ResponseEntity<UniversityListResponse> getUniversities(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(universityService.getUniversities(search, page, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityResponse> getUniversity(@PathVariable Long id) {
        return ResponseEntity.ok(universityService.getUniversityById(id));
    }

    @GetMapping("/{id}/detail")
    @PreAuthorize("hasAnyAuthority('ROLE_MAIN_ADMIN', 'ROLE_UNIVERSITY_ADMIN')")
    public ResponseEntity<UniversityDetailResponse> getUniversityDetail(@PathVariable Long id) {
        return ResponseEntity.ok(universityService.getUniversityDetail(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_MAIN_ADMIN')")
    public ResponseEntity<UniversityResponse> createUniversity(
            @RequestBody @Valid CreateUniversityRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(universityService.createUniversity(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_MAIN_ADMIN', 'ROLE_UNIVERSITY_ADMIN')")
    public ResponseEntity<UniversityDetailResponse> updateUniversity(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUniversityRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(universityService.updateUniversity(id, request, authentication.getName()));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long id) {
        universityService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }
}
