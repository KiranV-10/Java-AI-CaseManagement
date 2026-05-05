package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiSummaryRequest {
    private String caseDetails;
    private String internalNotes;
    private String statusHistory;
}
