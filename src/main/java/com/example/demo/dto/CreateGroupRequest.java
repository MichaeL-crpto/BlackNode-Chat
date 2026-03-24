package com.example.demo.dto;

import com.example.demo.entity.GroupType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateGroupRequest(
        @NotBlank(message = "Group name is required")
        @Size(min = 3, max = 50, message = "Group name must be between 3 and 50 characters")
        String name,
        @NotBlank(message = "Topic is required")
        @Size(min = 3, max = 200, message = "Topic must be between 3 and 200 characters")
        String topic,
        @NotNull(message = "Group type is required")
        GroupType type
) {
}
