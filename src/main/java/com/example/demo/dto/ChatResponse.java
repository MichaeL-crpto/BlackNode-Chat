package com.example.demo.dto;

import java.time.Instant;

public record ChatResponse(
        Long id,
        String participantOne,
        String participantTwo,
        Instant createdAt
) {
}
