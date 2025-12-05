package com.oquga.oquga.controller;

import com.oquga.oquga.dto.admin.req.UniversityAdminCreateRequest;
import com.oquga.oquga.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthenticationService service;

    @PostMapping("/university-admins")
    @PreAuthorize("hasAuthority('ROLE_MAIN_ADMIN')")
    public ResponseEntity<String> createUniversityAdmin(
            @RequestBody @Valid UniversityAdminCreateRequest request
    ) {
        service.createUniversityAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("University Admin created successfully");
    }
}
