package com.kiran.casemanagement.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiRecommendationDto {
    private Long id;
    private String provider;
    private String model;
    private String suggestedCategory;
    private String suggestedPriority;
    private Double confidenceScore;
    private String reasoning;
    private String summary;
    private List<String> keyFacts;
    private List<String> missingInformation;
    private String suggestedNextAction;
    private String citizenGuidance;
    private String citizenFriendlyExplanation;
    private String status;
    private String errorMessage;
    private String createdAt;
}
