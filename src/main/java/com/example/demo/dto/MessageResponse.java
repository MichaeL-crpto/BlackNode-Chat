package com.example.demo.dto;

import java.time.Instant;

public record MessageResponse(
        Long id,
        String senderUsername,
        String recipientUsername,
        String cipherText,
        String initializationVector,
        String encryptedAesKey,
        String algorithm,
        Instant createdAt
) {
}
