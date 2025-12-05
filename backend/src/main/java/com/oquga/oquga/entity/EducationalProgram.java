package com.oquga.oquga.entity;

import com.oquga.oquga.entity.translation.EducationalProgramTranslation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "educational_programs")
@Getter
@Setter
@NoArgsConstructor
public class EducationalProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_group_id", nullable = false)
    private EducationalProgramGroup programGroup;

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

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EducationalProgramTranslation> translations = new ArrayList<>();

    public void addTranslation(EducationalProgramTranslation translation) {
        translations.add(translation);
        translation.setProgram(this);
    }

    public void removeTranslation(EducationalProgramTranslation translation) {
        translations.remove(translation);
        translation.setProgram(null);
    }
}
