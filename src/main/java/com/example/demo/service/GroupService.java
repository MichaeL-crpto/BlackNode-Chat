package com.example.demo.service;

import com.example.demo.dto.CreateGroupRequest;
import com.example.demo.dto.GroupResponse;
import com.example.demo.entity.Group;
import com.example.demo.entity.GroupType;
import com.example.demo.entity.UserAccount;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.GroupRepository;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserService userService;

    public GroupService(GroupRepository groupRepository, UserService userService) {
        this.groupRepository = groupRepository;
        this.userService = userService;
    }

    @Transactional
    public GroupResponse createGroup(String username, CreateGroupRequest request) {
        UserAccount currentUser = userService.requireByUsername(username);
        String normalizedName = normalizeWhitespace(request.name());
        String normalizedTopic = normalizeWhitespace(request.topic());

        validateSafeText(normalizedName, "Group name");
        validateSafeText(normalizedTopic, "Topic");

        if (groupRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new BadRequestException("A group with this name already exists");
        }

        Group group = new Group();
        group.setName(normalizedName);
        group.setTopic(normalizedTopic);
        group.setType(request.type());
        group.setOwner(currentUser);
        group.setCreatedAt(Instant.now());

        Set<UserAccount> members = new LinkedHashSet<>();
        members.add(currentUser);
        group.setMembers(members);

        return toResponse(groupRepository.save(group), currentUser);
    }

    @Transactional(readOnly = true)
    public List<GroupResponse> getAccessibleGroups(String username) {
        UserAccount currentUser = userService.requireByUsername(username);
        return groupRepository.findAccessibleGroups(currentUser, GroupType.PUBLIC)
                .stream()
                .map(group -> toResponse(group, currentUser))
                .toList();
    }

    @Transactional
    public GroupResponse joinGroup(Long groupId, String username) {
        UserAccount currentUser = userService.requireByUsername(username);
        Group group = requireGroup(groupId);

        if (group.getMembers().stream().anyMatch(member -> member.getId().equals(currentUser.getId()))) {
            return toResponse(group, currentUser);
        }

        if (group.getType() == GroupType.PRIVATE) {
            throw new BadRequestException("Private groups require a join request. Use POST /api/groups/" + groupId + "/request-join");
        }

        group.getMembers().add(currentUser);
        return toResponse(groupRepository.save(group), currentUser);
    }

    @Transactional
    public GroupResponse leaveGroup(Long groupId, String username) {
        UserAccount currentUser = userService.requireByUsername(username);
        Group group = requireGroup(groupId);

        if (group.getOwner().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Group owners cannot leave their own group");
        }

        boolean removed = group.getMembers().removeIf(member -> member.getId().equals(currentUser.getId()));
        if (!removed) {
            throw new BadRequestException("You are not a member of this group");
        }

        return toResponse(groupRepository.save(group), currentUser);
    }

    private Group requireGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException("Group not found"));
    }

    private GroupResponse toResponse(Group group, UserAccount currentUser) {
        boolean joined = group.getMembers().stream().anyMatch(member -> member.getId().equals(currentUser.getId()));
        boolean admin = group.getOwner().getId().equals(currentUser.getId());

        return new GroupResponse(
                group.getId(),
                group.getName(),
                group.getTopic(),
                group.getType().name(),
                group.getOwner().getUsername(),
                group.getMembers().size(),
                joined,
                admin ? "Admin" : "User",
                group.getCreatedAt()
        );
    }

    private String normalizeWhitespace(String input) {
        return input == null ? "" : input.trim().replaceAll("\\s+", " ");
    }

    private void validateSafeText(String input, String fieldName) {
        if (input.contains("<") || input.contains(">")) {
            throw new BadRequestException(fieldName + " contains invalid characters");
        }
    }
}
