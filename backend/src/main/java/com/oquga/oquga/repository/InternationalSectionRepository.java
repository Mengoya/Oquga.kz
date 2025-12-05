package com.oquga.oquga.repository;

import com.oquga.oquga.entity.InternationalSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InternationalSectionRepository extends JpaRepository<InternationalSection, Long> {

    @Query("SELECT DISTINCT s FROM InternationalSection s " +
            "LEFT JOIN FETCH s.items i " +
            "WHERE s.university.id = :universityId")
    List<InternationalSection> findByUniversityIdWithItems(@Param("universityId") Long universityId);
}
