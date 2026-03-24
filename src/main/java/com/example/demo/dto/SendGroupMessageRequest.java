package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record SendGroupMessageRequest(
        @NotBlank(message = "Message content is required")
        String content
) {
}
