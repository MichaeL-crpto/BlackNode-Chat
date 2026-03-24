package com.example.demo.dto;

import java.time.Instant;

public record UserResponse(
        Long id,
        String username,
        boolean publicKeyConfigured,
        Instant createdAt
) {
}
