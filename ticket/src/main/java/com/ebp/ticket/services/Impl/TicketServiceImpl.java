package com.ebp.ticket.services.Impl;

import com.ebp.ticket.domain.entities.Ticket;
import com.ebp.ticket.domain.entities.TicketStatusEnum;
import com.ebp.ticket.repository.TicketRepository;

import com.ebp.ticket.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

  private final TicketRepository ticketRepository;

  @Override
  public Page<Ticket> listTicketsForUser(UUID userId, Pageable pageable) {
    return ticketRepository.findByPurchaserId(userId, pageable);
  }

  @Override
  public Optional<Ticket> getTicketForUser(UUID userId, UUID ticketId) {
    return ticketRepository.findByIdAndPurchaserId(ticketId, userId);
  }

  @Override
  public void cancelTicket(UUID userId, UUID ticketId) {
    Ticket ticket = ticketRepository.findByIdAndPurchaserId(ticketId, userId)
        .orElseThrow(() -> new RuntimeException("Ticket not found or does not belong to user"));

    if (ticket.getStatus() != TicketStatusEnum.PURCHASED) {
      throw new RuntimeException("Only PURCHASED tickets can be cancelled");
    }

    ticket.setStatus(TicketStatusEnum.CANCELLED);
    ticketRepository.save(ticket);
  }
}
