package com.ebp.ticket.services;

import com.ebp.ticket.domain.entities.TicketValidation;

import java.util.UUID;

public interface TicketValidationService {
  TicketValidation validateTicketByQrCode(UUID qrCodeId, UUID validatorId);

  TicketValidation validateTicketManually(UUID ticketId, UUID validatorId);

  java.util.List<TicketValidation> getHistory(UUID validatorId);
}
