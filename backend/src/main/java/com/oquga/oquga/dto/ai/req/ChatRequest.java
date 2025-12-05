package com.oquga.oquga.dto.ai.req;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ChatRequest(
        @NotEmpty(message = "Messages are required")
        @Valid
        List<MessageDto> messages
) {
    public record MessageDto(
            @NotBlank(message = "Role is required")
            String role,
            @NotBlank(message = "Content is required")
            String content
    ) {}
}
