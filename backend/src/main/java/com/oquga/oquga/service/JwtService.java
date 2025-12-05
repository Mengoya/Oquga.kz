package com.oquga.oquga.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

    ResponseCookie generateRefreshCookie(String refreshToken);

    ResponseCookie getCleanRefreshCookie();

    String getRefreshTokenFromCookie(HttpServletRequest request);

    String extractUsername(String token);

    String generateAccessToken(UserDetails userDetails);

    String generateRefreshToken(UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);
}
