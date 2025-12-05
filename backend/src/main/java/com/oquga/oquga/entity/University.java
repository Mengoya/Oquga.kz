package com.oquga.oquga.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String slug;

    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UniversityTranslation> translations = new ArrayList<>();

    public void addTranslation(UniversityTranslation translation) {
        translations.add(translation);
        translation.setUniversity(this);
    }

    public void removeTranslation(UniversityTranslation translation) {
        translations.remove(translation);
        translation.setUniversity(null);
    }
}