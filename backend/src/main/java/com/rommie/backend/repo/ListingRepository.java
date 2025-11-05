package com.rommie.backend.repo;

import com.rommie.backend.domain.listing.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByLocationContainingIgnoreCase(String location);
    List<Listing> findByPricePerMonthLessThanEqual(BigDecimal max);
}
