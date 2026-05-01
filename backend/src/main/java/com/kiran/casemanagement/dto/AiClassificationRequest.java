package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiClassificationRequest {
    private String title;
    private String description;
    private String selectedCategory;
    private String urgency;
    private String employerName;
    private String incidentDate;
}
