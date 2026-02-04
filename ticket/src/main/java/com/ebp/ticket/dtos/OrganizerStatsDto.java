package com.ebp.ticket.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerStatsDto {
    private Long totalTicketsSold;
    private Long totalRevenue;
    private Long totalTicketsAvailable;
    private List<MonthlySalesDto> monthlySales;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlySalesDto {
        private String month;
        private Long ticketsSold;
        private Long revenue;
    }
}
