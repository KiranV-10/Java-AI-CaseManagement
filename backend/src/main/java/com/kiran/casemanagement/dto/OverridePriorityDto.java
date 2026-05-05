package com.kiran.casemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OverridePriorityDto {
    @NotBlank
    private String priority;
    @NotNull
    private Long changedByUserId;
    private String reason;
}
