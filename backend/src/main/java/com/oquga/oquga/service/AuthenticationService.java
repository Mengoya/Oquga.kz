package com.oquga.oquga.service;

import com.oquga.oquga.dto.admin.UniversityAdminCreateRequest;
import com.oquga.oquga.dto.auth.AuthenticationRequest;
import com.oquga.oquga.dto.auth.AuthenticationResponse;
import com.oquga.oquga.dto.auth.StudentRegisterRequest;
import com.oquga.oquga.entity.Role;
import com.oquga.oquga.entity.University;
import com.oquga.oquga.entity.User;
import com.oquga.oquga.enums.RoleType;
import com.oquga.oquga.repository.RoleRepository;
import com.oquga.oquga.repository.UniversityRepository;
import com.oquga.oquga.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UniversityRepository universityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public ResponseEntity<AuthenticationResponse> registerStudent(StudentRegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        Role role = roleRepository.findByName(RoleType.STUDENT)
                .orElseThrow(() -> new RuntimeException("Role STUDENT not found"));

        var user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .isActive(true)
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        ResponseCookie refreshCookie = jwtService.generateRefreshCookie(refreshToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .build());
    }

    @Transactional
    public void createUniversityAdmin(UniversityAdminCreateRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        University university = universityRepository.findById(request.universityId())
                .orElseThrow(() -> new RuntimeException("University not found"));

        Role role = roleRepository.findByName(RoleType.UNIVERSITY_ADMIN)
                .orElseThrow(() -> new RuntimeException("Role UNIVERSITY_ADMIN not found"));

        var user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .university(university)
                .isActive(true)
                .build();

        userRepository.save(user);
    }

    public ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        ResponseCookie refreshCookie = jwtService.generateRefreshCookie(refreshToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .build());
    }

    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request) {
        String refreshToken = jwtService.getRefreshTokenFromCookie(request);

        if (refreshToken != null) {
            String userEmail = jwtService.extractUsername(refreshToken);

            var user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (jwtService.isTokenValid(refreshToken, user)) {
                String newAccessToken = jwtService.generateAccessToken(user);

                return ResponseEntity.ok()
                        .body(AuthenticationResponse.builder()
                                .accessToken(newAccessToken)
                                .build());
            }
        }
        return ResponseEntity.status(403).build();
    }

    public ResponseEntity<Void> logout() {
        ResponseCookie cleanCookie = jwtService.getCleanRefreshCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .build();
    }
}