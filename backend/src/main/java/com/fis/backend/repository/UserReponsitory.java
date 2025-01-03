package com.fis.backend.repository;

import com.fis.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserReponsitory extends JpaRepository<User, String> {
    User findByUsername(String username);

    Optional<User> findByProfileId(String profileId);
}
