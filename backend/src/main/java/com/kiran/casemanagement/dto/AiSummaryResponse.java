package com.kiran.casemanagement.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiSummaryResponse {
    private String summary;
    private List<String> keyFacts;
    private List<String> missingInformation;
    private String suggestedNextAction;
    private String citizenFriendlyExplanation;
}
