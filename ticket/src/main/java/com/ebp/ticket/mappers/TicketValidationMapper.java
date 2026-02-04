package com.ebp.ticket.mappers;

import com.ebp.ticket.domain.dtos.TicketValidationResponseDto;
import com.ebp.ticket.domain.entities.TicketValidation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketValidationMapper {

  @Mapping(target = "ticketId", source = "ticket.id")
  TicketValidationResponseDto toTicketValidationResponseDto(TicketValidation ticketValidation);

  java.util.List<TicketValidationResponseDto> toTicketValidationResponseDtos(
      java.util.List<TicketValidation> ticketValidations);

}
