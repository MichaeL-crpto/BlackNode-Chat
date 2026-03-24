package com.example.demo.controller;

import com.example.demo.dto.ChatResponse;
import com.example.demo.dto.CreateChatRequest;
import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.SendMessageRequest;
import com.example.demo.service.ChatService;
import com.example.demo.service.MessageService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;
    private final MessageService messageService;

    public ChatController(ChatService chatService, MessageService messageService) {
        this.chatService = chatService;
        this.messageService = messageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChatResponse createChat(@Valid @RequestBody CreateChatRequest request, Principal principal) {
        return chatService.createChat(principal.getName(), request.partnerUsername());
    }

    @GetMapping
    public List<ChatResponse> getChats(Principal principal) {
        return chatService.getChatsForUser(principal.getName());
    }

    @PostMapping("/{chatId}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse sendMessage(
            @PathVariable Long chatId,
            @Valid @RequestBody SendMessageRequest request,
            Principal principal
    ) {
        return messageService.sendMessage(chatId, principal.getName(), request.content());
    }

    @GetMapping("/{chatId}/messages")
    public List<MessageResponse> getMessages(@PathVariable Long chatId, Principal principal) {
        return messageService.getMessages(chatId, principal.getName());
    }
}
