package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String defaultPriority;
    private int slaDays;
    private boolean active;
    private String createdAt;
    private String updatedAt;
}
