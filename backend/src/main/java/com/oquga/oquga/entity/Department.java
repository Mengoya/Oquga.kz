package com.oquga.oquga.entity;

import com.oquga.oquga.entity.translation.DepartmentTranslation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DepartmentTranslation> translations = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<EducationalProgramGroup> programGroups = new ArrayList<>();

    public void addTranslation(DepartmentTranslation translation) {
        translations.add(translation);
        translation.setDepartment(this);
    }

    public void removeTranslation(DepartmentTranslation translation) {
        translations.remove(translation);
        translation.setDepartment(null);
    }
}
