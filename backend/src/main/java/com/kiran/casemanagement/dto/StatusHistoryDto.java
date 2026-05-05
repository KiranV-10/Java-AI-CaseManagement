package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StatusHistoryDto {
    private Long id;
    private String oldStatus;
    private String newStatus;
    private String changedByName;
    private String changeReason;
    private String createdAt;
}
