package com.ebp.ticket.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketSalesDto {
    private String eventId;
    private String eventName;
    private String ticketTypeId;
    private String ticketTypeName;
    private BigDecimal price;
    private long totalAvailable;
    private long sold;
    private long available;
    private long revenue;
}
