package com.ebp.ticket.controllers;

import com.ebp.ticket.domain.entities.Ticket;
import com.ebp.ticket.services.TicketTypeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/mock-payment")
@RequiredArgsConstructor
public class MockPaymentController {

    private final TicketTypeService ticketTypeService;

    @PostMapping("/process")
    public ResponseEntity<MockPaymentResponse> processPayment(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody MockPaymentRequest request) {

        UUID userId = UUID.fromString(jwt.getSubject());

        // Direct purchase (skipping real payment verification)
        Ticket ticket = ticketTypeService.purchaseTicket(userId, request.getTicketTypeId());

        return ResponseEntity.ok(new MockPaymentResponse(
                "SUCCESS",
                "Transaction approved: " + UUID.randomUUID().toString(),
                ticket.getId()));
    }

    @Data
    public static class MockPaymentRequest {
        private UUID ticketTypeId;
    }

    @Data
    @RequiredArgsConstructor
    public static class MockPaymentResponse {
        private final String status;
        private final String message;
        private final UUID ticketId;
    }
}
