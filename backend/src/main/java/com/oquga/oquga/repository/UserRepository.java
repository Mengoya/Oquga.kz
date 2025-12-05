package com.oquga.oquga.repository;

import com.oquga.oquga.entity.User;
import com.oquga.oquga.enums.RoleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u.id FROM User u WHERE u.role.name = :roleName")
    Page<Long> findIdsByRoleName(@Param("roleName") RoleType roleName, Pageable pageable);

    @Query("SELECT u.id FROM User u WHERE u.role.name = :roleName " +
            "AND (LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Long> findIdsByRoleNameAndSearch(
            @Param("roleName") RoleType roleName,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT DISTINCT u FROM User u " +
            "LEFT JOIN FETCH u.university univ " +
            "LEFT JOIN FETCH univ.translations t " +
            "LEFT JOIN FETCH t.language " +
            "WHERE u.id IN :ids")
    List<User> findByIdsWithUniversityAndTranslations(@Param("ids") List<Long> ids);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName AND u.university.id = :universityId")
    Page<User> findByRoleNameAndUniversityId(
            @Param("roleName") RoleType roleName,
            @Param("universityId") Long universityId,
            Pageable pageable
    );
}
