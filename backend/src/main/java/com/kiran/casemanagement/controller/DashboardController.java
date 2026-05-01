package com.kiran.casemanagement.controller;

import com.kiran.casemanagement.dto.AuditLogDto;
import com.kiran.casemanagement.dto.DashboardMetricsDto;
import com.kiran.casemanagement.service.AuditLogService;
import com.kiran.casemanagement.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Dashboard & Admin")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuditLogService auditLogService;

    @GetMapping("/api/dashboard/metrics")
    @Operation(summary = "Get dashboard metrics")
    public ResponseEntity<DashboardMetricsDto> getMetrics() {
        return ResponseEntity.ok(dashboardService.getMetrics());
    }

    @GetMapping("/api/admin/audit-logs")
    @Operation(summary = "Get all audit logs")
    public ResponseEntity<Page<AuditLogDto>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(auditLogService.getAllLogs(PageRequest.of(page, size)));
    }
}
