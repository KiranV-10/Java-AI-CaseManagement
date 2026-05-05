package com.kiran.casemanagement.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiSummaryResponseDto {
    private String aiStatus;
    private String provider;
    private String model;
    private String summary;
    private List<String> keyFacts;
    private List<String> missingInformation;
    private String suggestedNextAction;
    private String citizenFriendlyExplanation;
    private String errorMessage;
}
