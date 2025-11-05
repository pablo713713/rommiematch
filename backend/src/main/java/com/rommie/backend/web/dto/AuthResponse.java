package com.rommie.backend.web.dto;

public class AuthResponse {
    private Long id;
    private String role;
    private String fullName;
    private String email;

    public AuthResponse(Long id, String role, String fullName, String email) {
        this.id = id; this.role = role; this.fullName = fullName; this.email = email;
    }

    public Long getId() { return id; }
    public String getRole() { return role; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
}
