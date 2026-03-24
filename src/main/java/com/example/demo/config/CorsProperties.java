package com.example.demo.config;

import jakarta.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app.security.cors")
public class CorsProperties {

    @NotEmpty(message = "At least one CORS origin must be configured")
    private List<String> allowedOrigins = new ArrayList<>(List.of(
            "http://localhost:3000",
            "http://localhost:5173"
    ));

    public CorsProperties() {
    }

    public CorsProperties(String allowedOrigins) {
        if (allowedOrigins != null && !allowedOrigins.isEmpty()) {
            this.allowedOrigins = Arrays.asList(allowedOrigins.split(","));
        }
    }

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }
}
