package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RequestListDto {
    private Long id;
    private String requestNumber;
    private String title;
    private String status;
    private String priority;
    private String categoryName;
    private String citizenName;
    private String assignedToName;
    private String createdAt;
    private String updatedAt;
}
