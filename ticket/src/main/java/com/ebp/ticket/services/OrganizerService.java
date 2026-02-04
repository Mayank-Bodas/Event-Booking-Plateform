package com.ebp.ticket.services;

import com.ebp.ticket.domain.entities.Event;
import com.ebp.ticket.domain.entities.Ticket;
import com.ebp.ticket.domain.entities.TicketStatusEnum;
import com.ebp.ticket.domain.entities.TicketType;
import com.ebp.ticket.domain.entities.User;
import com.ebp.ticket.repository.EventRepository;
import com.ebp.ticket.repository.UserRepository;
import com.ebp.ticket.dtos.OrganizerStatsDto;
import com.ebp.ticket.dtos.TicketSalesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizerService {

        private final EventRepository eventRepository;
        private final UserRepository userRepository;

        @Transactional(readOnly = true)
        public OrganizerStatsDto getStats(UUID organizerId) {
                User organizer = userRepository.findById(organizerId)
                                .orElseThrow(() -> new RuntimeException("Organizer not found"));

                List<Event> events = eventRepository.findAllByOrganizer(organizer);

                long totalTicketsSold = 0;
                long totalRevenue = 0;
                long totalTicketsAvailable = 0;

                // Calculate totals
                for (Event event : events) {
                        for (TicketType ticketType : event.getTicketTypes()) {
                                List<Ticket> soldTickets = ticketType.getTickets().stream()
                                                .filter(t -> t.getStatus() == TicketStatusEnum.PURCHASED)
                                                .toList();

                                long sold = soldTickets.size();
                                long available = ticketType.getTotalAvailable() - sold;

                                totalTicketsAvailable += available;
                                totalTicketsSold += sold;
                                totalRevenue += (long) (sold * ticketType.getPrice());
                        }
                }

                // Calculate monthly sales
                Map<String, List<Ticket>> ticketsByMonth = events.stream()
                                .flatMap(e -> e.getTicketTypes().stream())
                                .flatMap(tt -> tt.getTickets().stream())
                                .filter(t -> t.getStatus() == TicketStatusEnum.PURCHASED)
                                .collect(Collectors
                                                .groupingBy(t -> t.getCreatedAt().getMonth()
                                                                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH)));

                List<OrganizerStatsDto.MonthlySalesDto> monthlySales = ticketsByMonth.entrySet().stream()
                                .map(entry -> {
                                        String month = entry.getKey();
                                        long sold = entry.getValue().size();
                                        long revenue = entry.getValue().stream()
                                                        .mapToLong(t -> (long) t.getTicketType().getPrice()
                                                                        .doubleValue())
                                                        .sum();
                                        return new OrganizerStatsDto.MonthlySalesDto(month, sold, revenue);
                                })
                                .toList();

                return OrganizerStatsDto.builder()
                                .totalTicketsSold(totalTicketsSold)
                                .totalRevenue(totalRevenue)
                                .totalTicketsAvailable(totalTicketsAvailable)
                                .monthlySales(monthlySales)
                                .build();
        }

        @Transactional(readOnly = true)
        public List<TicketSalesDto> getTicketSales(UUID organizerId) {
                User organizer = userRepository.findById(organizerId)
                                .orElseThrow(() -> new RuntimeException("Organizer not found"));

                List<Event> events = eventRepository.findAllByOrganizer(organizer);

                return events.stream()
                                .<TicketSalesDto>flatMap(event -> event.getTicketTypes().stream()
                                                .map(ticketType -> {
                                                        long sold = ticketType.getTickets().stream()
                                                                        .filter(t -> t.getStatus() == TicketStatusEnum.PURCHASED)
                                                                        .count();
                                                        long available = ticketType.getTotalAvailable() - sold;
                                                        long revenue = (long) (sold * ticketType.getPrice());

                                                        return TicketSalesDto.builder()
                                                                        .eventId(event.getId().toString())
                                                                        .eventName(event.getName())
                                                                        .ticketTypeId(ticketType.getId().toString())
                                                                        .ticketTypeName(ticketType.getName())
                                                                        .price(java.math.BigDecimal
                                                                                        .valueOf(ticketType.getPrice()))
                                                                        .totalAvailable(ticketType.getTotalAvailable())
                                                                        .sold(sold)
                                                                        .available(available)
                                                                        .revenue(revenue)
                                                                        .build();
                                                }))
                                .collect(Collectors.toList());
        }
}
