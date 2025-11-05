package com.rommie.backend.repo;

import com.rommie.backend.domain.user.Landlord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LandlordRepository extends JpaRepository<Landlord, Long> { }
