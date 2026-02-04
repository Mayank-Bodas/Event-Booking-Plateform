package com.ebp.ticket.controllers;

import com.ebp.ticket.domain.dtos.UserRegistrationDto;
import com.ebp.ticket.services.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakService keycloakService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody UserRegistrationDto dto) {
        keycloakService.createUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
