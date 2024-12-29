package com.fis.backend.repository;

import com.fis.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReponsitory extends JpaRepository<User, String> {
}
