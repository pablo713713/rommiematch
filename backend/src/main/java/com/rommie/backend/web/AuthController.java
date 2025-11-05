package com.rommie.backend.web;

import com.rommie.backend.domain.user.*;
import com.rommie.backend.repo.AppUserRepository;
import com.rommie.backend.web.dto.AuthResponse;
import com.rommie.backend.web.dto.LoginRequest;
import com.rommie.backend.web.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AppUserRepository users;

    public AuthController(AppUserRepository users) { this.users = users; }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        if (users.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        String role = req.getRole() == null ? "" : req.getRole().trim().toUpperCase();
        AppUser saved;

        switch (role) {
            case "STUDENT" -> {
                Student s = new Student();
                s.setEmail(req.getEmail());
                s.setPassword(req.getPassword()); // sin hash (proyecto académico)
                s.setFullName(req.getFullName());
                s.setPhotoUrl(req.getPhotoUrl());
                s.setMajor(req.getMajor());
                s.setAge(req.getAge());
                s.setBio(req.getBio());
                s.setHobbies(req.getHobbies());
                s.setPreferredLocation(req.getPreferredLocation());
                s.setBudgetMin(req.getBudgetMin());
                s.setBudgetMax(req.getBudgetMax());
                saved = users.save(s);
                return new AuthResponse(saved.getId(), "STUDENT", saved.getFullName(), saved.getEmail());
            }
            case "LANDLORD" -> {
                Landlord l = new Landlord();
                l.setEmail(req.getEmail());
                l.setPassword(req.getPassword());
                l.setFullName(req.getFullName());
                l.setPhotoUrl(req.getPhotoUrl());
                l.setDisplayName(req.getDisplayName());
                saved = users.save(l);
                return new AuthResponse(saved.getId(), "LANDLORD", saved.getFullName(), saved.getEmail());
            }
            case "ADMIN" -> {
                Admin a = new Admin();
                a.setEmail(req.getEmail());
                a.setPassword(req.getPassword());
                a.setFullName(req.getFullName());
                a.setPhotoUrl(req.getPhotoUrl());
                saved = users.save(a);
                return new AuthResponse(saved.getId(), "ADMIN", saved.getFullName(), saved.getEmail());
            }
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        AppUser u = users.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!u.getPassword().equals(req.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        // El rol es el valor de la columna discriminadora
        String role;
        if (u instanceof Student) role = "STUDENT";
        else if (u instanceof Landlord) role = "LANDLORD";
        else role = "ADMIN";

        return new AuthResponse(u.getId(), role, u.getFullName(), u.getEmail());
    }
}
