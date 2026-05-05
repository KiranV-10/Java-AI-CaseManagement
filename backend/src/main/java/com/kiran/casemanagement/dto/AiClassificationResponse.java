package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiClassificationResponse {
    private String suggestedCategory;
    private String suggestedPriority;
    private double confidenceScore;
    private String reasoning;
    private String citizenGuidance;
}
