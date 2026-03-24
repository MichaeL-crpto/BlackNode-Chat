package com.example.demo.service;

import com.example.demo.dto.UserResponse;
import com.example.demo.entity.UserAccount;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.UserAccountRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserAccountRepository userAccountRepository;
    private final CryptoService cryptoService;

    public UserService(UserAccountRepository userAccountRepository, CryptoService cryptoService) {
        this.userAccountRepository = userAccountRepository;
        this.cryptoService = cryptoService;
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        return toResponse(requireByUsername(username));
    }

    @Transactional
    public UserResponse savePublicKey(String username, String publicKey) {
        UserAccount user = requireByUsername(username);
        String normalizedKey = publicKey.trim();
        cryptoService.validateRsaPublicKey(normalizedKey);
        user.setPublicKey(normalizedKey);
        return toResponse(userAccountRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listOtherUsers(String currentUsername) {
        return userAccountRepository.findByUsernameNotIgnoreCaseOrderByUsernameAsc(currentUsername)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserAccount requireByUsername(String username) {
        return userAccountRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new NotFoundException("User not found: " + username));
    }

    private UserResponse toResponse(UserAccount user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getPublicKey() != null && !user.getPublicKey().isBlank(),
                user.getCreatedAt()
        );
    }
}
