package com.ebp.ticket.controllers;

import com.ebp.ticket.dtos.OrganizerStatsDto;
import com.ebp.ticket.services.OrganizerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizers")
@RequiredArgsConstructor
public class OrganizerController {

    private final OrganizerService organizerService;

    @GetMapping("/stats")
    public OrganizerStatsDto getStats(@AuthenticationPrincipal Jwt jwt) {
        UUID organizerId = UUID.fromString(jwt.getSubject());
        return organizerService.getStats(organizerId);
    }

    @GetMapping("/ticket-sales")
    public List<com.ebp.ticket.dtos.TicketSalesDto> getTicketSales(@AuthenticationPrincipal Jwt jwt) {
        UUID organizerId = UUID.fromString(jwt.getSubject());
        return organizerService.getTicketSales(organizerId);
    }
}
