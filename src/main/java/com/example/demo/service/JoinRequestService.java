package com.example.demo.service;

import com.example.demo.dto.JoinRequestResponse;
import com.example.demo.entity.Group;
import com.example.demo.entity.JoinRequest;
import com.example.demo.entity.UserAccount;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.GroupRepository;
import com.example.demo.repository.JoinRequestRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JoinRequestService {

    private final JoinRequestRepository joinRequestRepository;
    private final GroupRepository groupRepository;
    private final UserService userService;

    public JoinRequestService(
            JoinRequestRepository joinRequestRepository,
            GroupRepository groupRepository,
            UserService userService
    ) {
        this.joinRequestRepository = joinRequestRepository;
        this.groupRepository = groupRepository;
        this.userService = userService;
    }

    @Transactional
    public JoinRequestResponse requestToJoin(Long groupId, String username) {
        UserAccount user = userService.requireByUsername(username);
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException("Group not found"));

        if (group.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()))) {
            throw new BadRequestException("You are already a member of this group");
        }

        if (joinRequestRepository.findPendingRequest(group, user).isPresent()) {
            throw new BadRequestException("You already have a pending request to join this group");
        }

        JoinRequest request = new JoinRequest();
        request.setGroup(group);
        request.setUser(user);
        request.setStatus(JoinRequest.RequestStatus.PENDING);
        request.setCreatedAt(Instant.now());

        return toResponse(joinRequestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<JoinRequestResponse> getPendingRequestsForGroup(Long groupId, String username) {
        UserAccount user = userService.requireByUsername(username);
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException("Group not found"));

        if (!group.getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("Only group owner can view pending requests");
        }

        return joinRequestRepository.findPendingByGroup(group)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JoinRequestResponse> getMyPendingRequests(String username) {
        UserAccount user = userService.requireByUsername(username);
        return joinRequestRepository.findPendingByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public JoinRequestResponse approveRequest(Long requestId, String username) {
        return processRequest(requestId, username, JoinRequest.RequestStatus.APPROVED);
    }

    @Transactional
    public JoinRequestResponse rejectRequest(Long requestId, String username) {
        return processRequest(requestId, username, JoinRequest.RequestStatus.REJECTED);
    }

    private JoinRequestResponse processRequest(Long requestId, String username, JoinRequest.RequestStatus newStatus) {
        UserAccount user = userService.requireByUsername(username);
        JoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Request not found"));

        Group group = request.getGroup();

        if (!group.getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("Only group owner can process join requests");
        }

        if (request.getStatus() != JoinRequest.RequestStatus.PENDING) {
            throw new BadRequestException("This request has already been processed");
        }

        request.setStatus(newStatus);
        request = joinRequestRepository.save(request);

        if (newStatus == JoinRequest.RequestStatus.APPROVED) {
            group.getMembers().add(request.getUser());
            groupRepository.save(group);
        }

        return toResponse(request);
    }

    private JoinRequestResponse toResponse(JoinRequest request) {
        return new JoinRequestResponse(
                request.getId(),
                request.getGroup().getId(),
                request.getGroup().getName(),
                request.getUser().getUsername(),
                request.getStatus().name(),
                request.getCreatedAt()
        );
    }
}
