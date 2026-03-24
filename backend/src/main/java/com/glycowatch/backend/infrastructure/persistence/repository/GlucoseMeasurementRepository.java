package com.glycowatch.backend.infrastructure.persistence.repository;

import com.glycowatch.backend.domain.measurement.GlucoseMeasurementEntity;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlucoseMeasurementRepository extends JpaRepository<GlucoseMeasurementEntity, Long> {

    boolean existsByDeduplicationHash(String deduplicationHash);

    Page<GlucoseMeasurementEntity> findByUserIdAndIsValidTrue(Long userId, Pageable pageable);

    Page<GlucoseMeasurementEntity> findByUserIdAndIsValidTrueAndMeasuredAtGreaterThanEqual(
            Long userId,
            Instant from,
            Pageable pageable
    );

    Page<GlucoseMeasurementEntity> findByUserIdAndIsValidTrueAndMeasuredAtLessThanEqual(
            Long userId,
            Instant to,
            Pageable pageable
    );

    Page<GlucoseMeasurementEntity> findByUserIdAndIsValidTrueAndMeasuredAtBetween(
            Long userId,
            Instant from,
            Instant to,
            Pageable pageable
    );

    Optional<GlucoseMeasurementEntity> findFirstByUserIdAndIsValidTrueOrderByMeasuredAtDesc(Long userId);
}
