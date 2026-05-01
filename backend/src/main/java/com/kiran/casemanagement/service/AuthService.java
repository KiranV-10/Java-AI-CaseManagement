package com.kiran.casemanagement.service;

import com.kiran.casemanagement.dto.LoginRequest;
import com.kiran.casemanagement.dto.LoginResponse;
import com.kiran.casemanagement.entity.AppUser;
import com.kiran.casemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new IllegalArgumentException("Account is disabled");
        }

        return LoginResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token("mock-token-" + user.getRole().name().toLowerCase())
                .build();
    }
}
