package com.ebp.ticket.services.Impl;

import com.ebp.ticket.domain.entities.QrCode;
import com.ebp.ticket.exceptions.QrCodeNotFoundException;
import com.ebp.ticket.repository.QrCodeRepository;
import com.ebp.ticket.services.QrCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrCodeServiceImpl implements QrCodeService {

  private final QrCodeRepository qrCodeRepository;

  @Override
  public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
    QrCode qrCode = qrCodeRepository.findByTicketIdAndTicketPurchaserId(ticketId, userId)
        .orElseThrow(QrCodeNotFoundException::new);

    try {
      return Base64.getDecoder().decode(qrCode.getValue());
    } catch (IllegalArgumentException ex) {
      log.error("Invalid base64 QR Code for ticket ID: {}", ticketId, ex);
      throw new QrCodeNotFoundException();
    }
  }

}
