package com.ebp.ticket.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketPurchasedEvent {
    private UUID ticketId;
    private UUID purchaserId;
}
