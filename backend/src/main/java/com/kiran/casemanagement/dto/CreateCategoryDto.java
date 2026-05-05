package com.kiran.casemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateCategoryDto {
    @NotBlank
    private String name;
    private String description;
    @NotBlank
    private String defaultPriority;
    @NotNull
    private Integer slaDays;
}
