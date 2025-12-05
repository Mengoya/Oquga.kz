package com.oquga.oquga.controller;

import com.oquga.oquga.dto.auth.req.AuthenticationRequest;
import com.oquga.oquga.dto.auth.req.StudentRegisterRequest;
import com.oquga.oquga.dto.auth.res.AuthenticationResponse;
import com.oquga.oquga.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid StudentRegisterRequest request
    ) {
        return service.registerStudent(request);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid AuthenticationRequest request
    ) {
        return service.authenticate(request);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(HttpServletRequest request) {
        return service.refreshToken(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return service.logout();
    }
}
