package com.ebp.ticket.controllers;

import com.ebp.ticket.domain.dtos.TicketValidationRequestDto;
import com.ebp.ticket.domain.dtos.TicketValidationResponseDto;
import com.ebp.ticket.domain.entities.TicketValidation;
import com.ebp.ticket.domain.entities.TicketValidationMethod;
import com.ebp.ticket.mappers.TicketValidationMapper;
import com.ebp.ticket.services.TicketValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/ticket-validations")
@RequiredArgsConstructor
public class TicketValidationController {

  private final TicketValidationService ticketValidationService;
  private final TicketValidationMapper ticketValidationMapper;

  @PostMapping
  public ResponseEntity<TicketValidationResponseDto> validateTicket(
      @RequestBody TicketValidationRequestDto ticketValidationRequestDto,
      @AuthenticationPrincipal Jwt jwt) {
    UUID validatorId = UUID.fromString(jwt.getSubject());
    TicketValidationMethod method = ticketValidationRequestDto.getMethod();
    TicketValidation ticketValidation;
    if (TicketValidationMethod.MANUAL.equals(method)) {
      ticketValidation = ticketValidationService.validateTicketManually(
          ticketValidationRequestDto.getId(), validatorId);
    } else {
      ticketValidation = ticketValidationService.validateTicketByQrCode(
          ticketValidationRequestDto.getId(), validatorId);
    }
    return ResponseEntity.ok(
        ticketValidationMapper.toTicketValidationResponseDto(ticketValidation));
  }

  @GetMapping("/history")
  public ResponseEntity<java.util.List<TicketValidationResponseDto>> getHistory(
      @AuthenticationPrincipal Jwt jwt) {
    UUID validatorId = UUID.fromString(jwt.getSubject());
    return ResponseEntity.ok(
        ticketValidationMapper.toTicketValidationResponseDtos(
            ticketValidationService.getHistory(validatorId)));
  }

}
