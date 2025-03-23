package com.fis.backend.repository;


import com.fis.backend.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, String> {
    Optional<Otp> findByEmail(String userId);

    Optional<Otp> findByEmailAndExpiresAtAfter(String email, Instant expiresAtAfter);
    void deleteByEmail(String userId);
}
