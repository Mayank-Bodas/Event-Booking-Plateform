package com.ebp.ticket.services;



import com.ebp.ticket.domain.entities.Ticket;

import java.util.UUID;

public interface TicketTypeService {
  Ticket purchaseTicket(UUID userId, UUID ticketTypeId);
}
