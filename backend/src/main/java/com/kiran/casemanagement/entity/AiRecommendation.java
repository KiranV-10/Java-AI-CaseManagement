package com.kiran.casemanagement.entity;

import com.kiran.casemanagement.enums.AiStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_recommendations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    private String provider;

    private String model;

    private String suggestedCategory;

    private String suggestedPriority;

    private Double confidenceScore;

    @Column(columnDefinition = "TEXT")
    private String reasoning;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String keyFacts;

    @Column(columnDefinition = "TEXT")
    private String missingInformation;

    @Column(columnDefinition = "TEXT")
    private String suggestedNextAction;

    @Column(columnDefinition = "TEXT")
    private String citizenGuidance;

    @Column(columnDefinition = "TEXT")
    private String rawResponse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiStatus status;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
