package com.example.demo.service;

import com.example.demo.dto.ChatResponse;
import com.example.demo.entity.Chat;
import com.example.demo.entity.UserAccount;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ChatRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserService userService;

    public ChatService(ChatRepository chatRepository, UserService userService) {
        this.chatRepository = chatRepository;
        this.userService = userService;
    }

    @Transactional
    public ChatResponse createChat(String currentUsername, String partnerUsername) {
        UserAccount currentUser = userService.requireByUsername(currentUsername);
        UserAccount partner = userService.requireByUsername(partnerUsername.trim());

        if (currentUser.getId().equals(partner.getId())) {
            throw new BadRequestException("You cannot create a chat with yourself");
        }

        Chat chat = chatRepository.findBetweenUsers(currentUser, partner).orElseGet(() -> {
            Chat newChat = new Chat();
            newChat.setParticipantOne(currentUser);
            newChat.setParticipantTwo(partner);
            newChat.setCreatedAt(Instant.now());
            return chatRepository.save(newChat);
        });

        return toResponse(chat);
    }

    @Transactional(readOnly = true)
    public List<ChatResponse> getChatsForUser(String username) {
        UserAccount user = userService.requireByUsername(username);
        return chatRepository.findAllForUser(user).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Chat requireChatForUser(Long chatId, String username) {
        UserAccount user = userService.requireByUsername(username);
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new NotFoundException("Chat not found"));

        if (!chat.getParticipantOne().getId().equals(user.getId()) && !chat.getParticipantTwo().getId().equals(user.getId())) {
            throw new BadRequestException("You are not a participant of this chat");
        }

        return chat;
    }

    private ChatResponse toResponse(Chat chat) {
        return new ChatResponse(
                chat.getId(),
                chat.getParticipantOne().getUsername(),
                chat.getParticipantTwo().getUsername(),
                chat.getCreatedAt()
        );
    }
}
