package com.example.demo.dto;

import java.time.Instant;

public record GroupResponse(
        Long id,
        String name,
        String topic,
        String type,
        String ownerUsername,
        int memberCount,
        boolean joined,
        String role,
        Instant createdAt
) {
}
