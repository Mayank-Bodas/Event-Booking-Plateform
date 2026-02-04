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
public class PaymentVerifiedEvent {
    private String orderId;
    private String paymentId;
    private UUID userId;
    private UUID ticketTypeId;
    private String status;
}
