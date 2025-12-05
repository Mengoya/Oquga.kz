package com.oquga.oquga.init;

import com.oquga.oquga.entity.Role;
import com.oquga.oquga.entity.User;
import com.oquga.oquga.enums.RoleType;
import com.oquga.oquga.repository.RoleRepository;
import com.oquga.oquga.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.security.admin.email}")
    private String adminEmail;

    @Value("${application.security.admin.password}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        createMainAdminAccount();
    }

    private void createMainAdminAccount() {
        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            log.warn("Admin email or password not configured. Skipping admin initialization.");
            return;
        }

        if (userRepository.findByEmail(adminEmail).isPresent()) {
            log.info("Main Admin account ({}) already exists. Skipping.", adminEmail);
            return;
        }

        log.info("Initializing Main Admin account...");

        Role adminRole = roleRepository.findByName(RoleType.MAIN_ADMIN)
                .orElseThrow(() -> new IllegalStateException("Role MAIN_ADMIN not found. Check Flyway migrations."));

        User adminUser = User.builder()
                .firstName("Main")
                .lastName("Admin")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(adminRole)
                .isActive(true)
                .university(null)
                .build();

        userRepository.save(adminUser);
        log.info("Main Admin account created successfully: {}", adminEmail);
    }
}