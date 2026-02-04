package com.ebp.ticket.config;

import com.ebp.ticket.filters.UserProvisioningFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(
                        HttpSecurity http,
                        UserProvisioningFilter userProvisioningFilter,
                        com.ebp.ticket.config.JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
                http
                                .authorizeHttpRequests(authorize -> authorize
                                                .requestMatchers(HttpMethod.GET, "/api/v1/published-events/**")
                                                .permitAll()
                                                .requestMatchers("/api/v1/auth/register").permitAll()
                                                .requestMatchers("/api/v1/events").hasRole("ORGANIZER")
                                                .requestMatchers("/api/v1/ticket-validation").hasRole("STAFF")
                                                // Catch all rule
                                                .anyRequest().authenticated())
                                .csrf(AbstractHttpConfigurer::disable)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)))
                                .addFilterAfter(userProvisioningFilter, BearerTokenAuthenticationFilter.class)
                                .cors(cors -> cors.configurationSource(request -> {
                                        var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                                        corsConfiguration.addAllowedOrigin("http://localhost:5173");
                                        corsConfiguration.addAllowedOrigin("http://localhost:5174");
                                        corsConfiguration.addAllowedMethod("*");
                                        corsConfiguration.addAllowedHeader("*");
                                        corsConfiguration.setAllowCredentials(true);
                                        return corsConfiguration;
                                }));

                return http.build();
        }

}
