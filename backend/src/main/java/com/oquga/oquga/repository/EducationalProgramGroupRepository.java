package com.oquga.oquga.repository;

import com.oquga.oquga.entity.EducationalProgramGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EducationalProgramGroupRepository extends JpaRepository<EducationalProgramGroup, Long> {

    @Query("SELECT DISTINCT pg FROM EducationalProgramGroup pg " +
            "LEFT JOIN FETCH pg.programs p " +
            "WHERE pg.faculty.university.id = :universityId")
    List<EducationalProgramGroup> findByUniversityIdWithPrograms(@Param("universityId") Long universityId);
}
