package com.example.demo.dto;

public record AuthResponse(
        String token,
        String username,
        boolean publicKeyConfigured
) {
}
