package com.example.demo.controller;

import com.example.demo.dto.CreateGroupRequest;
import com.example.demo.dto.GroupResponse;
import com.example.demo.dto.JoinRequestResponse;
import com.example.demo.service.GroupService;
import com.example.demo.service.JoinRequestService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;
    private final JoinRequestService joinRequestService;

    public GroupController(GroupService groupService, JoinRequestService joinRequestService) {
        this.groupService = groupService;
        this.joinRequestService = joinRequestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GroupResponse createGroup(@Valid @RequestBody CreateGroupRequest request, Principal principal) {
        return groupService.createGroup(principal.getName(), request);
    }

    @GetMapping
    public List<GroupResponse> getGroups(Principal principal) {
        return groupService.getAccessibleGroups(principal.getName());
    }

    @PostMapping("/{groupId}/join")
    public GroupResponse joinGroup(@PathVariable Long groupId, Principal principal) {
        return groupService.joinGroup(groupId, principal.getName());
    }

    @PostMapping("/{groupId}/leave")
    public GroupResponse leaveGroup(@PathVariable Long groupId, Principal principal) {
        return groupService.leaveGroup(groupId, principal.getName());
    }

    @PostMapping("/{groupId}/request-join")
    public JoinRequestResponse requestToJoin(@PathVariable Long groupId, Principal principal) {
        return joinRequestService.requestToJoin(groupId, principal.getName());
    }

    @GetMapping("/{groupId}/requests")
    public List<JoinRequestResponse> getPendingRequests(@PathVariable Long groupId, Principal principal) {
        return joinRequestService.getPendingRequestsForGroup(groupId, principal.getName());
    }

    @PutMapping("/requests/{requestId}/approve")
    public JoinRequestResponse approveRequest(@PathVariable Long requestId, Principal principal) {
        return joinRequestService.approveRequest(requestId, principal.getName());
    }

    @PutMapping("/requests/{requestId}/reject")
    public JoinRequestResponse rejectRequest(@PathVariable Long requestId, Principal principal) {
        return joinRequestService.rejectRequest(requestId, principal.getName());
    }

    @GetMapping("/my-requests")
    public List<JoinRequestResponse> getMyPendingRequests(Principal principal) {
        return joinRequestService.getMyPendingRequests(principal.getName());
    }
}
