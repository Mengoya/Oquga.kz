package com.oquga.oquga.repository;

import com.oquga.oquga.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    @Query("SELECT DISTINCT f FROM Faculty f " +
            "LEFT JOIN FETCH f.departments d " +
            "WHERE f.university.id = :universityId")
    List<Faculty> findByUniversityIdWithDepartments(@Param("universityId") Long universityId);

    @Query("SELECT DISTINCT f FROM Faculty f " +
            "LEFT JOIN FETCH f.programGroups pg " +
            "LEFT JOIN FETCH pg.passingScore " +
            "WHERE f.university.id = :universityId")
    List<Faculty> findByUniversityIdWithProgramGroups(@Param("universityId") Long universityId);
}
