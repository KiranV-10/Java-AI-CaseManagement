package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private String token;
}
