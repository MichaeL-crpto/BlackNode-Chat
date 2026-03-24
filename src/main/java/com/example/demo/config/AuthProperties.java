package com.example.demo.config;

import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app.security.auth")
public class AuthProperties {

    @Min(value = 1, message = "Max failed attempts must be at least 1")
    private int maxFailedAttempts = 5;

    @Min(value = 1, message = "Lock duration must be at least 1 minute")
    private long lockDurationMinutes = 15;

    public int getMaxFailedAttempts() {
        return maxFailedAttempts;
    }

    public void setMaxFailedAttempts(int maxFailedAttempts) {
        this.maxFailedAttempts = maxFailedAttempts;
    }

    public long getLockDurationMinutes() {
        return lockDurationMinutes;
    }

    public void setLockDurationMinutes(long lockDurationMinutes) {
        this.lockDurationMinutes = lockDurationMinutes;
    }
}
