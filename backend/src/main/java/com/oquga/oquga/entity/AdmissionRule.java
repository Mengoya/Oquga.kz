package com.oquga.oquga.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_rules")
@Getter
@Setter
@NoArgsConstructor
public class AdmissionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false, unique = true)
    private University university;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "documents_text", columnDefinition = "TEXT")
    private String documentsText;

    @Column(name = "steps_text", columnDefinition = "TEXT")
    private String stepsText;

    @Column(name = "military_department_info", columnDefinition = "TEXT")
    private String militaryDepartmentInfo;

    @Column(name = "dormitory_info", columnDefinition = "TEXT")
    private String dormitoryInfo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
