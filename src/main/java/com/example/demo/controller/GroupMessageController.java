package com.example.demo.controller;

import com.example.demo.dto.GroupMessageResponse;
import com.example.demo.dto.SendGroupMessageRequest;
import com.example.demo.service.GroupMessageService;
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
@RequestMapping("/api/groups")
public class GroupMessageController {

    private final GroupMessageService groupMessageService;

    public GroupMessageController(GroupMessageService groupMessageService) {
        this.groupMessageService = groupMessageService;
    }

    @PostMapping("/{groupId}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public GroupMessageResponse sendMessage(
            @PathVariable Long groupId,
            @Valid @RequestBody SendGroupMessageRequest request,
            Principal principal
    ) {
        return groupMessageService.sendMessage(groupId, principal.getName(), request);
    }

    @GetMapping("/{groupId}/messages")
    public List<GroupMessageResponse> getMessages(@PathVariable Long groupId, Principal principal) {
        return groupMessageService.getMessages(groupId, principal.getName());
    }
}
