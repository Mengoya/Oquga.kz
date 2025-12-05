package com.oquga.oquga.entity;

import com.oquga.oquga.entity.translation.InternationalSectionTranslation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "international_sections")
@Getter
@Setter
@NoArgsConstructor
public class InternationalSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @Column(name = "external_url", length = 500)
    private String externalUrl;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InternationalSectionTranslation> translations = new ArrayList<>();

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InternationalItem> items = new ArrayList<>();

    public void addTranslation(InternationalSectionTranslation translation) {
        translations.add(translation);
        translation.setSection(this);
    }

    public void removeTranslation(InternationalSectionTranslation translation) {
        translations.remove(translation);
        translation.setSection(null);
    }

    public void addItem(InternationalItem item) {
        items.add(item);
        item.setSection(this);
    }

    public void removeItem(InternationalItem item) {
        items.remove(item);
        item.setSection(null);
    }
}
