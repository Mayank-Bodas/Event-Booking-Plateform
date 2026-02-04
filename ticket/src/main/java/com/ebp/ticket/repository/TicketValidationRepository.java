package com.ebp.ticket.repository;

import com.ebp.ticket.domain.entities.TicketValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TicketValidationRepository extends JpaRepository<TicketValidation, UUID> {
    java.util.List<TicketValidation> findByValidator_IdOrderByCreatedAtDesc(UUID validatorId);
}
