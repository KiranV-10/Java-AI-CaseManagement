package com.kiran.casemanagement.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RequestDetailDto {
    private Long id;
    private String requestNumber;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String categoryName;
    private Long categoryId;
    private String preferredContactMethod;
    private String phoneNumber;
    private String employerName;
    private String incidentDate;
    private String documentName;
    private String aiSuggestedCategory;
    private String aiSuggestedPriority;

    private String citizenName;
    private String citizenEmail;
    private Long citizenId;

    private String assignedToName;
    private Long assignedToId;

    private String createdAt;
    private String updatedAt;
    private String resolvedAt;
    private String closedAt;

    private AiRecommendationDto aiRecommendation;
    private List<CaseNoteDto> notes;
    private List<StatusHistoryDto> statusHistory;
    private List<AuditLogDto> auditLogs;
}
