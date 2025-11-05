package com.rommie.backend.web;

import com.rommie.backend.domain.listing.Listing;
import com.rommie.backend.repo.LandlordRepository;
import com.rommie.backend.repo.ListingRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "http://localhost:4200")
public class ListingController {

    private final ListingRepository repo;
    private final LandlordRepository landlordRepo;

    public ListingController(ListingRepository repo, LandlordRepository landlordRepo) {
        this.repo = repo;
        this.landlordRepo = landlordRepo;
    }

    @GetMapping
    public List<Listing> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Listing one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @PostMapping
    public Listing create(@Valid @RequestBody Listing l) {
        // aseguramos que el landlord exista
        Long landlordId = l.getLandlord().getId();
        l.setLandlord(landlordRepo.findById(landlordId).orElseThrow());
        return repo.save(l);
    }

    @PutMapping("/{id}")
    public Listing update(@PathVariable Long id, @Valid @RequestBody Listing l) {
        Listing current = repo.findById(id).orElseThrow();
        current.setTitle(l.getTitle());
        current.setLocation(l.getLocation());
        current.setPricePerMonth(l.getPricePerMonth());
        current.setAvailableFrom(l.getAvailableFrom());
        current.setAmenities(l.getAmenities());
        current.setRules(l.getRules());
        current.setPhotoUrl(l.getPhotoUrl());
        if (l.getLandlord() != null && l.getLandlord().getId() != null) {
            current.setLandlord(landlordRepo.findById(l.getLandlord().getId()).orElseThrow());
        }
        return repo.save(current);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // Búsquedas simples
    @GetMapping("/search/by-location")
    public List<Listing> byLocation(@RequestParam String q) {
        return repo.findByLocationContainingIgnoreCase(q);
    }

    @GetMapping("/search/by-price")
    public List<Listing> byPrice(@RequestParam BigDecimal max) {
        return repo.findByPricePerMonthLessThanEqual(max);
    }
}
