package com.kiran.casemanagement.repository;

import com.kiran.casemanagement.entity.AiRecommendation;
import com.kiran.casemanagement.enums.AiStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AiRecommendationRepository extends JpaRepository<AiRecommendation, Long> {
    List<AiRecommendation> findByRequestIdOrderByCreatedAtDesc(Long requestId);
    Optional<AiRecommendation> findFirstByRequestIdAndStatusOrderByCreatedAtDesc(Long requestId, AiStatus status);
}
