package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CaseNoteDto {
    private Long id;
    private String authorName;
    private String noteText;
    private boolean internalOnly;
    private String createdAt;
}
