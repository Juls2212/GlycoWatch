package com.glycowatch.backend.infrastructure.persistence.repository;

import com.glycowatch.backend.domain.measurement.GlucoseMeasurementEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlucoseMeasurementRepository extends JpaRepository<GlucoseMeasurementEntity, Long> {

    boolean existsByDeduplicationHash(String deduplicationHash);
}

