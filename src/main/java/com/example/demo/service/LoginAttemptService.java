package com.example.demo.service;

import com.example.demo.config.AuthProperties;
import com.example.demo.exception.BadRequestException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class LoginAttemptService {

    private final AuthProperties authProperties;
    private final Map<String, AttemptState> attemptsByUsername = new ConcurrentHashMap<>();

    public LoginAttemptService(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    public void ensureNotLocked(String username) {
        String key = normalize(username);
        AttemptState state = attemptsByUsername.get(key);
        if (state == null) {
            return;
        }

        if (state.lockedUntil != null && state.lockedUntil.isAfter(Instant.now())) {
            long minutesRemaining = Math.max(1, Duration.between(Instant.now(), state.lockedUntil).toMinutes());
            throw new BadRequestException("Account temporarily locked due to repeated failed logins. Try again in " + minutesRemaining + " minute(s)");
        }

        if (state.lockedUntil != null && !state.lockedUntil.isAfter(Instant.now())) {
            attemptsByUsername.remove(key);
        }
    }

    public void recordFailure(String username) {
        String key = normalize(username);
        attemptsByUsername.compute(key, (ignored, current) -> {
            AttemptState state = current == null ? new AttemptState() : current;
            state.failedAttempts++;
            if (state.failedAttempts >= authProperties.getMaxFailedAttempts()) {
                state.lockedUntil = Instant.now().plus(Duration.ofMinutes(authProperties.getLockDurationMinutes()));
            }
            return state;
        });
    }

    public void recordSuccess(String username) {
        attemptsByUsername.remove(normalize(username));
    }

    private String normalize(String username) {
        return username == null ? "" : username.trim().toLowerCase();
    }

    private static final class AttemptState {
        private int failedAttempts;
        private Instant lockedUntil;
    }
}
