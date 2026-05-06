package com.kiran.casemanagement.repository;

import com.kiran.casemanagement.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    void deleteByEntityTypeAndEntityId(String entityType, Long entityId);
}
