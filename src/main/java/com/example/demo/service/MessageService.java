package com.example.demo.service;

import com.example.demo.dto.MessageResponse;
import com.example.demo.entity.Chat;
import com.example.demo.entity.ChatMessage;
import com.example.demo.entity.UserAccount;
import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.ChatMessageRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MessageService {

    private final ChatService chatService;
    private final UserService userService;
    private final CryptoService cryptoService;
    private final ChatMessageRepository chatMessageRepository;

    public MessageService(
            ChatService chatService,
            UserService userService,
            CryptoService cryptoService,
            ChatMessageRepository chatMessageRepository
    ) {
        this.chatService = chatService;
        this.userService = userService;
        this.cryptoService = cryptoService;
        this.chatMessageRepository = chatMessageRepository;
    }

    @Transactional
    public MessageResponse sendMessage(Long chatId, String senderUsername, String content) {
        Chat chat = chatService.requireChatForUser(chatId, senderUsername);
        UserAccount sender = userService.requireByUsername(senderUsername);
        UserAccount recipient = chat.getParticipantOne().getId().equals(sender.getId())
                ? chat.getParticipantTwo()
                : chat.getParticipantOne();

        if (sender.getPublicKey() == null || sender.getPublicKey().isBlank()) {
            throw new BadRequestException("Sender must upload an RSA public key before sending messages");
        }
        if (recipient.getPublicKey() == null || recipient.getPublicKey().isBlank()) {
            throw new BadRequestException("Recipient must upload an RSA public key before receiving encrypted messages");
        }

        CryptoService.EncryptedMessage encrypted = cryptoService.encryptForParticipants(
                content,
                sender.getPublicKey(),
                recipient.getPublicKey()
        );

        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setCipherText(encrypted.cipherText());
        message.setInitializationVector(encrypted.initializationVector());
        message.setSenderEncryptedAesKey(encrypted.senderEncryptedAesKey());
        message.setRecipientEncryptedAesKey(encrypted.recipientEncryptedAesKey());
        message.setAlgorithm(encrypted.algorithm());
        message.setCreatedAt(Instant.now());
        chatMessageRepository.save(message);

        return toResponse(message, senderUsername);
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessages(Long chatId, String username) {
        Chat chat = chatService.requireChatForUser(chatId, username);
        return chatMessageRepository.findByChatOrderByCreatedAtAsc(chat).stream()
                .map(message -> toResponse(message, username))
                .toList();
    }

    private MessageResponse toResponse(ChatMessage message, String requestingUsername) {
        boolean isSender = message.getSender().getUsername().equalsIgnoreCase(requestingUsername);
        String wrappedKey = isSender ? message.getSenderEncryptedAesKey() : message.getRecipientEncryptedAesKey();
        return new MessageResponse(
                message.getId(),
                message.getSender().getUsername(),
                message.getRecipient().getUsername(),
                message.getCipherText(),
                message.getInitializationVector(),
                wrappedKey,
                message.getAlgorithm(),
                message.getCreatedAt()
        );
    }
}
