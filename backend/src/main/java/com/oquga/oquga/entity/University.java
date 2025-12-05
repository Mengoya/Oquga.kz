package com.oquga.oquga.entity;

import com.oquga.oquga.entity.translation.UniversityTranslation;
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

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UniversityTranslation> translations = new ArrayList<>();

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoryEvent> historyEvents = new ArrayList<>();

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Achievement> achievements = new ArrayList<>();

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Leadership> leadership = new ArrayList<>();

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Faculty> faculties = new ArrayList<>();

    public void addTranslation(UniversityTranslation translation) {
        translations.add(translation);
        translation.setUniversity(this);
    }

    public void removeTranslation(UniversityTranslation translation) {
        translations.remove(translation);
        translation.setUniversity(null);
    }

    public void addHistoryEvent(HistoryEvent historyEvent) {
        historyEvents.add(historyEvent);
        historyEvent.setUniversity(this);
    }

    public void removeHistoryEvent(HistoryEvent historyEvent) {
        historyEvents.remove(historyEvent);
        historyEvent.setUniversity(null);
    }

    public void addAchievement(Achievement achievement) {
        achievements.add(achievement);
        achievement.setUniversity(this);
    }

    public void removeAchievement(Achievement achievement) {
        achievements.remove(achievement);
        achievement.setUniversity(null);
    }

    public void addLeadership(Leadership leader) {
        leadership.add(leader);
        leader.setUniversity(this);
    }

    public void removeLeadership(Leadership leader) {
        leadership.remove(leader);
        leader.setUniversity(null);
    }

    public void addFaculty(Faculty faculty) {
        faculties.add(faculty);
        faculty.setUniversity(this);
    }

    public void removeFaculty(Faculty faculty) {
        faculties.remove(faculty);
        faculty.setUniversity(null);
    }
}
