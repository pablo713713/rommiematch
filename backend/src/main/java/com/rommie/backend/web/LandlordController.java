package com.rommie.backend.web;

import com.rommie.backend.domain.user.Landlord;
import com.rommie.backend.repo.LandlordRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/landlords")
@CrossOrigin(origins = "http://localhost:4200")
public class LandlordController {

    private final LandlordRepository repo;

    public LandlordController(LandlordRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Landlord> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Landlord one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @PostMapping
    public Landlord create(@Valid @RequestBody Landlord l) {
        return repo.save(l);
    }

    @PutMapping("/{id}")
    public Landlord update(@PathVariable Long id, @RequestBody Landlord l) {
        Landlord current = repo.findById(id).orElseThrow();

        current.setFullName(l.getFullName());
        current.setEmail(l.getEmail());
        // NO tocamos la password aquí:
        // current.setPassword(l.getPassword());
        current.setPhotoUrl(l.getPhotoUrl());
        current.setDisplayName(l.getDisplayName());

        return repo.save(current);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
