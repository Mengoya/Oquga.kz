package com.oquga.oquga.repository;

import com.oquga.oquga.entity.Role;
import com.oquga.oquga.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(RoleType name);
}