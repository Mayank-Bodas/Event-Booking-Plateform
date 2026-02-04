package com.ebp.ticket.services.Impl;

import com.ebp.ticket.domain.entities.Ticket;
import com.ebp.ticket.domain.entities.TicketStatusEnum;
import com.ebp.ticket.domain.entities.TicketType;
import com.ebp.ticket.domain.entities.User;
import com.ebp.ticket.exceptions.TicketTypeNotFoundException;
import com.ebp.ticket.exceptions.TicketsSoldOutException;
import com.ebp.ticket.exceptions.UserNotFoundException;
import com.ebp.ticket.repository.TicketRepository;
import com.ebp.ticket.repository.TicketTypeRepository;
import com.ebp.ticket.repository.UserRepository;
import com.ebp.ticket.services.QrCodeService;
import com.ebp.ticket.services.TicketTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

import com.ebp.ticket.config.RabbitMqConfig;
import com.ebp.ticket.events.TicketPurchasedEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

  private final UserRepository userRepository;
  private final TicketTypeRepository ticketTypeRepository;
  private final TicketRepository ticketRepository;
  private final RabbitTemplate rabbitTemplate;

  @Override
  @Transactional
  public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(
        String.format("User with ID %s was not found", userId)));

    TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId)
        .orElseThrow(() -> new TicketTypeNotFoundException(
            String.format("Ticket type with ID %s was not found", ticketTypeId)));

    int purchasedTickets = ticketRepository.countByTicketTypeId(ticketType.getId());
    Integer totalAvailable = ticketType.getTotalAvailable();

    if (purchasedTickets + 1 > totalAvailable) {
      throw new TicketsSoldOutException();
    }

    Ticket ticket = new Ticket();
    ticket.setStatus(TicketStatusEnum.PURCHASED);
    ticket.setTicketType(ticketType);
    ticket.setPurchaser(user);

    Ticket savedTicket = ticketRepository.save(ticket);

    // Publish event to RabbitMQ for async processing
    TicketPurchasedEvent event = TicketPurchasedEvent.builder()
        .ticketId(savedTicket.getId())
        .purchaserId(userId)
        .build();

    rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE_NAME, RabbitMqConfig.ROUTING_KEY, event);

    return savedTicket;
  }
}
