package com.example.demo.service;

import com.example.demo.dto.GroupMessageResponse;
import com.example.demo.dto.SendGroupMessageRequest;
import com.example.demo.entity.Group;
import com.example.demo.entity.GroupMessage;
import com.example.demo.entity.UserAccount;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.GroupMessageRepository;
import com.example.demo.repository.GroupRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GroupMessageService {

    private final GroupMessageRepository groupMessageRepository;
    private final GroupRepository groupRepository;
    private final UserService userService;
    private final CryptoService cryptoService;

    public GroupMessageService(
            GroupMessageRepository groupMessageRepository,
            GroupRepository groupRepository,
            UserService userService,
            CryptoService cryptoService
    ) {
        this.groupMessageRepository = groupMessageRepository;
        this.groupRepository = groupRepository;
        this.userService = userService;
        this.cryptoService = cryptoService;
    }

    @Transactional
    public GroupMessageResponse sendMessage(Long groupId, String senderUsername, SendGroupMessageRequest request) {
        UserAccount sender = userService.requireByUsername(senderUsername);
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException("Group not found"));

        if (!isMember(group, sender)) {
            throw new BadRequestException("You must be a member of this group to send messages");
        }

        String cipherText;
        String initializationVector;
        String senderEncryptedAesKey;
        String algorithm;

        if (sender.getPublicKey() != null && !sender.getPublicKey().isBlank()) {
            CryptoService.EncryptedMessage encrypted = cryptoService.encryptForGroup(
                    request.content(),
                    sender.getPublicKey()
            );
            cipherText = encrypted.cipherText();
            initializationVector = encrypted.initializationVector();
            senderEncryptedAesKey = encrypted.senderEncryptedAesKey();
            algorithm = encrypted.algorithm();
        } else {
            cipherText = request.content();
            initializationVector = "";
            senderEncryptedAesKey = "";
            algorithm = "PLAINTEXT";
        }

        GroupMessage message = new GroupMessage();
        message.setGroup(group);
        message.setSender(sender);
        message.setCipherText(cipherText);
        message.setInitializationVector(initializationVector);
        message.setSenderEncryptedAesKey(senderEncryptedAesKey);
        message.setAlgorithm(algorithm);
        message.setCreatedAt(Instant.now());

        return toResponse(groupMessageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public List<GroupMessageResponse> getMessages(Long groupId, String username) {
        UserAccount user = userService.requireByUsername(username);
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException("Group not found"));

        if (!isMember(group, user)) {
            throw new BadRequestException("You must be a member of this group to view messages");
        }

        return groupMessageRepository.findByGroupOrderByCreatedAtAsc(group)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private boolean isMember(Group group, UserAccount user) {
        return group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
    }

    private GroupMessageResponse toResponse(GroupMessage message) {
        return new GroupMessageResponse(
                message.getId(),
                message.getGroup().getId(),
                message.getSender().getUsername(),
                message.getCipherText(),
                message.getInitializationVector(),
                message.getSenderEncryptedAesKey(),
                message.getAlgorithm(),
                message.getCreatedAt()
        );
    }
}
