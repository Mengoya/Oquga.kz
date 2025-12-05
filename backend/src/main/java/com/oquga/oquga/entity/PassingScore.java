package com.oquga.oquga.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "passing_scores")
@Getter
@Setter
@NoArgsConstructor
public class PassingScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_group_id", nullable = false, unique = true)
    private EducationalProgramGroup programGroup;

    @Column(name = "min_score_grant")
    private Integer minScoreGrant;

    @Column(name = "min_score_paid")
    private Integer minScorePaid;

    @Column(name = "profile_subjects", length = 255)
    private String profileSubjects;

    @Column(name = "is_creative_exam")
    private Boolean isCreativeExam = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
