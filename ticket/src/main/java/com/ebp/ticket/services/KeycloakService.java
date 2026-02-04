package com.ebp.ticket.services;

import com.ebp.ticket.domain.dtos.UserRegistrationDto;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class KeycloakService {

    @Value("${keycloak.auth-server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.admin.client-id}")
    private String clientId;

    @Value("${keycloak.admin.client-secret}")
    private String clientSecret;

    @Value("${keycloak.admin.username}")
    private String adminUsername;

    @Value("${keycloak.admin.password}")
    private String adminPassword;

    private Keycloak getInstance() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master") // Admin operations usually on master or the specific realm if service account
                .grantType("password")
                .username(adminUsername)
                .password(adminPassword)
                .clientId("admin-cli")
                .build();
    }

    public void createUser(UserRegistrationDto dto) {
        Keycloak keycloak = getInstance();
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        // 1. Create User
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(dto.getEmail()); // Use email as username
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getName());
        user.setEmailVerified(true);

        Response response = usersResource.create(user);

        if (response.getStatus() != 201) {
            log.error("Failed to create user. Status: {}", response.getStatus());
            throw new RuntimeException("Failed to create user in Keycloak");
        }

        String userId = CreatedResponseUtil.getCreatedId(response);

        // 2. Set Password
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(dto.getPassword());
        credential.setTemporary(false);

        usersResource.get(userId).resetPassword(credential);

        // 3. Assign Role
        String roleName = dto.getRole().toUpperCase();
        // Mapping cleanup just in case
        if (roleName.equals("STAFF"))
            roleName = "STAFF";
        if (roleName.equals("ORGANIZER"))
            roleName = "ORGANIZER";
        if (roleName.equals("ATTENDEE"))
            roleName = "ATTENDEE";

        try {
            RoleRepresentation role = realmResource.roles().get(roleName).toRepresentation();
            usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(role));
        } catch (Exception e) {
            log.error("Role not found: {}", roleName);
            // Non-blocking for now, but should handle
        }
    }

    // Helper to extract ID from Location header
    private static class CreatedResponseUtil {
        public static String getCreatedId(Response response) {
            java.net.URI location = response.getLocation();
            if (location == null) {
                return null;
            }
            String path = location.getPath();
            return path.substring(path.lastIndexOf('/') + 1);
        }
    }
}
