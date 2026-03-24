package com.example.demo.dto;

import java.time.Instant;

public record GroupMessageResponse(
        Long id,
        Long groupId,
        String senderUsername,
        String cipherText,
        String initializationVector,
        String senderEncryptedAesKey,
        String algorithm,
        Instant createdAt
) {
}
