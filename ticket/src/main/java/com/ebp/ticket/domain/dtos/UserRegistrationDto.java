package com.ebp.ticket.domain.dtos;

import lombok.Data;

@Data
public class UserRegistrationDto {
    private String name;
    private String email;
    private String password;
    private String role; // ATTENDEE, ORGANIZER, STAFF
}
