package com.example.demo.controller;

import com.example.demo.dto.PublicKeyRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me(Principal principal) {
        return userService.getCurrentUser(principal.getName());
    }

    @PutMapping("/me/public-key")
    public UserResponse uploadPublicKey(@Valid @RequestBody PublicKeyRequest request, Principal principal) {
        return userService.savePublicKey(principal.getName(), request.publicKey());
    }

    @GetMapping
    public List<UserResponse> listUsers(Principal principal) {
        return userService.listOtherUsers(principal.getName());
    }
}
