package com.ebp.qrcode.listener;

import com.ebp.qrcode.config.RabbitMqConfig;
import com.ebp.qrcode.domain.entities.Ticket;
import com.ebp.qrcode.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class TicketEventListener {

    private final QrCodeService qrCodeService;

    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void handleTicketPurchasedEvent(TicketPurchasedEvent event) {
        log.info("Received TicketPurchasedEvent for Ticket ID: {}", event.getTicketId());

        try {
            // Create a Ticket object with reference ID
            Ticket ticket = new Ticket();
            ticket.setId(event.getTicketId());

            qrCodeService.generateQrCode(ticket);
            log.info("Successfully processed QR Code generation for Ticket ID: {}", event.getTicketId());

        } catch (Exception e) {
            log.error("Error processing ticket event", e);
            // In production, we might want to reject/requeue or send to DLQ
        }
    }
}
