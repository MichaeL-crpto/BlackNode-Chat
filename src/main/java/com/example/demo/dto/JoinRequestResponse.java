package com.example.demo.dto;

import java.time.Instant;

public record JoinRequestResponse(
        Long id,
        Long groupId,
        String groupName,
        String username,
        String status,
        Instant createdAt
) {
}
