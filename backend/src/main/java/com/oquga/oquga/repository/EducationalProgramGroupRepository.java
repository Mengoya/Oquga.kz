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

    @Query(value = """
        SELECT u.id FROM educational_program_groups epg
        JOIN educational_program_group_translations epgt ON epgt.program_group_id = epg.id
        JOIN faculties f ON epg.faculty_id = f.id
        JOIN universities u ON f.university_id = u.id
        WHERE epgt.name ILIKE ANY(:keywords)
        OR epgt.description ILIKE ANY(:keywords)
        GROUP BY u.id, u.view_count
        ORDER BY u.view_count DESC
        LIMIT 20
        """, nativeQuery = true)
    List<Long> findUniversityIdsByProgramKeywords(@Param("keywords") String[] keywords);
}
