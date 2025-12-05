package com.oquga.oquga.service;

import com.oquga.oquga.dto.admin.req.UniversityAdminCreateRequest;
import com.oquga.oquga.dto.auth.req.AuthenticationRequest;
import com.oquga.oquga.dto.auth.req.StudentRegisterRequest;
import com.oquga.oquga.dto.auth.res.AuthenticationResponse;
import com.oquga.oquga.dto.auth.res.UserInfoResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface AuthenticationService {

    ResponseEntity<AuthenticationResponse> registerStudent(StudentRegisterRequest request);

    void createUniversityAdmin(UniversityAdminCreateRequest request);

    ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request);

    ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request);

    ResponseEntity<Void> logout();

    UserInfoResponse getCurrentUser(String email);
}
