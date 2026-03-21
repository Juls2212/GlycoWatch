package com.glycowatch.backend.infrastructure.persistence.repository;

import com.glycowatch.backend.domain.user.UserProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfileEntity, Long> {
}

