package com.oquga.oquga.repository;

import com.oquga.oquga.entity.University;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

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

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.translations t " +
            "LEFT JOIN FETCH t.language " +
            "LEFT JOIN FETCH u.admissionRule " +
            "WHERE u.id = :id")
    Optional<University> findByIdWithTranslationsAndAdmission(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.leadership " +
            "WHERE u.id = :id")
    Optional<University> findByIdWithLeadership(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.achievements " +
            "WHERE u.id = :id")
    Optional<University> findByIdWithAchievements(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.historyEvents " +
            "WHERE u.id = :id")
    Optional<University> findByIdWithHistoryEvents(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.tuitionDiscounts " +
            "WHERE u.id = :id")
    Optional<University> findByIdWithTuitionDiscounts(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.faculties f " +
            "WHERE u.id = :id")
    Optional<University> findByIdWithFaculties(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM University u " +
            "LEFT JOIN FETCH u.internationalSections s " +
            "WHERE u.id = :id")
    Optional<University> findByIdWithInternationalSections(@Param("id") Long id);

    boolean existsBySlug(String slug);
}
