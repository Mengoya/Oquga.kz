package com.oquga.oquga.repository;

import com.oquga.oquga.entity.University;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UniversityRepository extends JpaRepository<University, Long> {

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.translations t " +
            "WHERE :search IS NULL " +
            "OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(t.city) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<University> findAllWithSearch(@Param("search") String search, Pageable pageable);

    boolean existsBySlug(String slug);
}
