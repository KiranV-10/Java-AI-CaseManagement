package com.kiran.casemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AddNoteDto {
    @NotNull
    private Long authorUserId;
    @NotBlank
    private String noteText;
    private boolean internalOnly = true;
}
