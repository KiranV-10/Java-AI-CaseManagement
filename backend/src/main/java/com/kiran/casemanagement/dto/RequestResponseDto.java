package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RequestResponseDto {
    private Long id;
    private String requestNumber;
    private String status;
    private String priority;
    private String aiSuggestedCategory;
    private String aiSuggestedPriority;
    private String aiStatus;
    private String citizenGuidance;
    private String message;
}
