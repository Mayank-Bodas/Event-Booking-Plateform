package com.ebp.ticket.services.Impl;

import com.ebp.ticket.domain.entities.*;
import com.ebp.ticket.exceptions.QrCodeNotFoundException;
import com.ebp.ticket.exceptions.TicketNotFoundException;
import com.ebp.ticket.repository.QrCodeRepository;
import com.ebp.ticket.repository.TicketRepository;
import com.ebp.ticket.repository.TicketValidationRepository;
import com.ebp.ticket.services.TicketValidationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

  private final QrCodeRepository qrCodeRepository;
  private final TicketValidationRepository ticketValidationRepository;
  private final TicketRepository ticketRepository;
  private final com.ebp.ticket.repository.UserRepository userRepository;

  @Override
  public TicketValidation validateTicketByQrCode(UUID qrCodeId, UUID validatorId) {
    QrCode qrCode = qrCodeRepository.findByIdAndStatus(qrCodeId, QrCodeStatusEnum.ACTIVE)
        .orElseThrow(() -> new QrCodeNotFoundException(
            String.format(
                "QR Code with ID %s was not found", qrCodeId)));

    Ticket ticket = qrCode.getTicket();

    return validateTicket(ticket, TicketValidationMethod.QR_SCAN, validatorId);
  }

  private TicketValidation validateTicket(Ticket ticket,
      TicketValidationMethod ticketValidationMethod, UUID validatorId) {
    User validator = userRepository.findById(validatorId)
        .orElseThrow(() -> new RuntimeException("Validator not found"));

    TicketValidation ticketValidation = new TicketValidation();
    ticketValidation.setTicket(ticket);
    ticketValidation.setValidationMethod(ticketValidationMethod);
    ticketValidation.setValidator(validator);

    TicketValidationStatusEnum ticketValidationStatus = ticket.getValidations().stream()
        .filter(v -> TicketValidationStatusEnum.VALID.equals(v.getStatus()))
        .findFirst()
        .map(v -> TicketValidationStatusEnum.INVALID)
        .orElse(TicketValidationStatusEnum.VALID);

    if (!TicketStatusEnum.PURCHASED.equals(ticket.getStatus())) {
      ticketValidationStatus = TicketValidationStatusEnum.INVALID;
    }

    ticketValidation.setStatus(ticketValidationStatus);

    return ticketValidationRepository.save(ticketValidation);
  }

  @Override
  public TicketValidation validateTicketManually(UUID ticketId, UUID validatorId) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(TicketNotFoundException::new);
    return validateTicket(ticket, TicketValidationMethod.MANUAL, validatorId);
  }

  @Override
  public java.util.List<TicketValidation> getHistory(UUID validatorId) {
    return ticketValidationRepository.findByValidator_IdOrderByCreatedAtDesc(validatorId);
  }
}
