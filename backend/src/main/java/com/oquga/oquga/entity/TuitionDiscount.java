package com.oquga.oquga.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tuition_discounts")
@Getter
@Setter
@NoArgsConstructor
public class TuitionDiscount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @Column(name = "category_name", nullable = false, length = 255)
    private String categoryName;

    @Column(name = "price_per_year")
    private Integer pricePerYear;

    @Column(name = "scholarship_info", columnDefinition = "TEXT")
    private String scholarshipInfo;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
