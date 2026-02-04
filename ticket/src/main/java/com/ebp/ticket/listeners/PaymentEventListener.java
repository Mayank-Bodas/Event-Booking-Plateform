package com.ebp.ticket.listeners;

import com.ebp.ticket.config.RabbitMqConfig;
import com.ebp.ticket.events.PaymentVerifiedEvent;
import com.ebp.ticket.services.TicketTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class PaymentEventListener {

    private final TicketTypeService ticketTypeService;

    @RabbitListener(queues = RabbitMqConfig.PAYMENT_QUEUE)
    public void handlePaymentVerifiedEvent(PaymentVerifiedEvent event) {
        log.info("Received PaymentVerifiedEvent for Order ID: {}", event.getOrderId());

        try {
            ticketTypeService.purchaseTicket(event.getUserId(), event.getTicketTypeId());
            log.info("Successfully processed ticket purchase for Payment ID: {}", event.getPaymentId());
        } catch (Exception e) {
            log.error("Error processing payment event", e);
        }
    }
}
