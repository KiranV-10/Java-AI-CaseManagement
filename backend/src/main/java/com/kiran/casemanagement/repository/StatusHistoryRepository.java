package com.kiran.casemanagement.repository;

import com.kiran.casemanagement.entity.CaseStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatusHistoryRepository extends JpaRepository<CaseStatusHistory, Long> {
    List<CaseStatusHistory> findByRequestIdOrderByCreatedAtDesc(Long requestId);
}
