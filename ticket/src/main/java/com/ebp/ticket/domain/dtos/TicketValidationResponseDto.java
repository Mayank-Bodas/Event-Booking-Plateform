package com.ebp.ticket.domain.dtos;

import com.ebp.ticket.domain.entities.TicketValidationStatusEnum;
import com.ebp.ticket.domain.entities.TicketValidationMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketValidationResponseDto {
  private UUID ticketId;
  private TicketValidationStatusEnum status;
  private TicketValidationMethod validationMethod;
  private LocalDateTime createdAt;
}
