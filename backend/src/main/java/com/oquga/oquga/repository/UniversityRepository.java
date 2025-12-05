package com.oquga.oquga.repository;

import com.oquga.oquga.entity.University;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UniversityRepository extends JpaRepository<University, Long> {

    @Query(value =
            "SELECT DISTINCT u.id FROM universities u " +
                    "LEFT JOIN university_translations t ON u.id = t.university_id " +
                    "WHERE LOWER(t.name) LIKE LOWER('%' || :search || '%') " +
                    "OR LOWER(t.city) LIKE LOWER('%' || :search || '%') " +
                    "ORDER BY u.created_at DESC",
            countQuery =
                    "SELECT COUNT(DISTINCT u.id) FROM universities u " +
                            "LEFT JOIN university_translations t ON u.id = t.university_id " +
                            "WHERE LOWER(t.name) LIKE LOWER('%' || :search || '%') " +
                            "OR LOWER(t.city) LIKE LOWER('%' || :search || '%')",
            nativeQuery = true)
    Page<Long> findIdsWithSearch(@Param("search") String search, Pageable pageable);

    @Query(value =
            "SELECT u.id FROM universities u ORDER BY u.created_at DESC",
            countQuery = "SELECT COUNT(u.id) FROM universities u",
            nativeQuery = true)
    Page<Long> findAllIds(Pageable pageable);

    @Query("SELECT DISTINCT u FROM University u LEFT JOIN FETCH u.translations WHERE u.id IN :ids")
    List<University> findByIdsWithTranslations(@Param("ids") List<Long> ids);

    boolean existsBySlug(String slug);
}
