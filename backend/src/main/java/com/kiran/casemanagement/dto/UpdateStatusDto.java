package com.kiran.casemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateStatusDto {
    @NotBlank
    private String newStatus;
    private String reason;
    @NotNull
    private Long changedByUserId;
}
