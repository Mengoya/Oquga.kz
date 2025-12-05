package com.oquga.oquga.dto.auth.res;

public record UserInfoResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String role,
        Long universityId
) {}
