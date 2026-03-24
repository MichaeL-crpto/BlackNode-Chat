package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateChatRequest(
        @NotBlank(message = "Partner username is required")
        String partnerUsername
) {
}
