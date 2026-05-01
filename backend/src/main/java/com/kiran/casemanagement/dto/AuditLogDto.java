package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLogDto {
    private Long id;
    private String entityType;
    private Long entityId;
    private String action;
    private String performedByName;
    private String oldValue;
    private String newValue;
    private String createdAt;
}
