package com.kiran.casemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateRequestDto {
    @NotNull
    private Long citizenId;
    @NotNull
    private Long categoryId;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private String preferredContactMethod;
    private String phoneNumber;
    private String employerName;
    private String incidentDate;
    private String documentName;
}
