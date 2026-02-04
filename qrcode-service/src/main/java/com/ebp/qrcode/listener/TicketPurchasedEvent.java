package com.ebp.qrcode.listener;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketPurchasedEvent {
    private UUID ticketId;
    private UUID purchaserId;
}
