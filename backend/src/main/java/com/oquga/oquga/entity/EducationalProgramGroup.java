package com.oquga.oquga.entity;

import com.oquga.oquga.entity.translation.EducationalProgramGroupTranslation;
import com.oquga.oquga.enums.DegreeLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "educational_program_groups")
@Getter
@Setter
@NoArgsConstructor
public class EducationalProgramGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(name = "degree_level", nullable = false, length = 20)
    private DegreeLevel degreeLevel;

    @Column(nullable = false, length = 20)
    private String code;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "programGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EducationalProgramGroupTranslation> translations = new ArrayList<>();

    @OneToMany(mappedBy = "programGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EducationalProgram> programs = new ArrayList<>();

    @OneToOne(mappedBy = "programGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private PassingScore passingScore;

    public void addTranslation(EducationalProgramGroupTranslation translation) {
        translations.add(translation);
        translation.setProgramGroup(this);
    }

    public void removeTranslation(EducationalProgramGroupTranslation translation) {
        translations.remove(translation);
        translation.setProgramGroup(null);
    }

    public void addProgram(EducationalProgram program) {
        programs.add(program);
        program.setProgramGroup(this);
    }

    public void removeProgram(EducationalProgram program) {
        programs.remove(program);
        program.setProgramGroup(null);
    }

    public void setPassingScore(PassingScore passingScore) {
        this.passingScore = passingScore;
        if (passingScore != null) {
            passingScore.setProgramGroup(this);
        }
    }
}
