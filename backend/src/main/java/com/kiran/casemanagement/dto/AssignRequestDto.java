package com.kiran.casemanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AssignRequestDto {
    @NotNull
    private Long assignedToUserId;
}
