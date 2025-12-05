package com.oquga.oquga.dto.auth;

import com.oquga.oquga.enums.RoleType;

public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        RoleType role
) {}