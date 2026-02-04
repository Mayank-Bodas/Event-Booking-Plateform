package com.ebp.ticket.services;

import java.util.UUID;

public interface QrCodeService {
  byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
