package com.kiran.casemanagement.service;

import com.kiran.casemanagement.dto.AuditLogDto;
import com.kiran.casemanagement.entity.AppUser;
import com.kiran.casemanagement.entity.AuditLog;
import com.kiran.casemanagement.enums.AuditAction;
import com.kiran.casemanagement.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String entityType, Long entityId, AuditAction action, AppUser performedBy,
                    String oldValue, String newValue) {
        AuditLog entry = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .performedBy(performedBy)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();
        auditLogRepository.save(entry);
    }

    public List<AuditLogDto> getLogsForEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId)
                .stream().map(this::toDto).toList();
    }

    public Page<AuditLogDto> getAllLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toDto);
    }

    private AuditLogDto toDto(AuditLog log) {
        return AuditLogDto.builder()
                .id(log.getId())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .action(log.getAction().name())
                .performedByName(log.getPerformedBy() != null ? log.getPerformedBy().getFullName() : "System")
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .createdAt(log.getCreatedAt().toString())
                .build();
    }
}
