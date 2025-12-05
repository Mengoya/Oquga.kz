package com.oquga.oquga.entity;

import com.oquga.oquga.entity.translation.FacultyTranslation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "faculties")
@Getter
@Setter
@NoArgsConstructor
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FacultyTranslation> translations = new ArrayList<>();

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Department> departments = new ArrayList<>();

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EducationalProgramGroup> programGroups = new ArrayList<>();

    public void addTranslation(FacultyTranslation translation) {
        translations.add(translation);
        translation.setFaculty(this);
    }

    public void removeTranslation(FacultyTranslation translation) {
        translations.remove(translation);
        translation.setFaculty(null);
    }

    public void addDepartment(Department department) {
        departments.add(department);
        department.setFaculty(this);
    }

    public void removeDepartment(Department department) {
        departments.remove(department);
        department.setFaculty(null);
    }

    public void addProgramGroup(EducationalProgramGroup programGroup) {
        programGroups.add(programGroup);
        programGroup.setFaculty(this);
    }

    public void removeProgramGroup(EducationalProgramGroup programGroup) {
        programGroups.remove(programGroup);
        programGroup.setFaculty(null);
    }
}
