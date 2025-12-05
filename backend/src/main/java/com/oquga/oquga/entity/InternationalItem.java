package com.oquga.oquga.entity;

import com.oquga.oquga.entity.translation.InternationalItemTranslation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "international_items")
@Getter
@Setter
@NoArgsConstructor
public class InternationalItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private InternationalSection section;

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

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InternationalItemTranslation> translations = new ArrayList<>();

    public void addTranslation(InternationalItemTranslation translation) {
        translations.add(translation);
        translation.setItem(this);
    }

    public void removeTranslation(InternationalItemTranslation translation) {
        translations.remove(translation);
        translation.setItem(null);
    }
}
