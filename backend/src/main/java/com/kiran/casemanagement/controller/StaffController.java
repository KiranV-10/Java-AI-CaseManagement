package com.kiran.casemanagement.controller;

import com.kiran.casemanagement.dto.*;
import com.kiran.casemanagement.service.CaseNoteService;
import com.kiran.casemanagement.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff/requests")
@RequiredArgsConstructor
@Tag(name = "Staff Operations")
public class StaffController {

    private final ServiceRequestService requestService;
    private final CaseNoteService caseNoteService;

    @GetMapping
    @Operation(summary = "Get all requests with filters")
    public ResponseEntity<Page<RequestListDto>> getAllRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(requestService.getStaffRequests(
                status, categoryId, priority, assignedTo, keyword, fromDate, toDate, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get request details (staff view)")
    public ResponseEntity<RequestDetailDto> getRequestDetail(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestDetail(id, true));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assign a request to a case worker")
    public ResponseEntity<RequestDetailDto> assignRequest(
            @PathVariable Long id, @Valid @RequestBody AssignRequestDto dto) {
        return ResponseEntity.ok(requestService.assignRequest(id, dto));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update request status")
    public ResponseEntity<RequestDetailDto> updateStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateStatusDto dto) {
        return ResponseEntity.ok(requestService.updateStatus(id, dto));
    }

    @PostMapping("/{id}/notes")
    @Operation(summary = "Add an internal note")
    public ResponseEntity<CaseNoteDto> addNote(
            @PathVariable Long id, @Valid @RequestBody AddNoteDto dto) {
        return ResponseEntity.ok(caseNoteService.addNote(id, dto));
    }

    @PutMapping("/{id}/priority")
    @Operation(summary = "Override request priority")
    public ResponseEntity<RequestDetailDto> overridePriority(
            @PathVariable Long id, @Valid @RequestBody OverridePriorityDto dto) {
        return ResponseEntity.ok(requestService.overridePriority(id, dto));
    }

    @PostMapping("/{id}/ai-summary")
    @Operation(summary = "Generate AI case summary")
    public ResponseEntity<AiSummaryResponseDto> generateAiSummary(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.generateAiSummary(id));
    }
}
