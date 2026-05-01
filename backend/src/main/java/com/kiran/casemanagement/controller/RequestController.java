package com.kiran.casemanagement.controller;

import com.kiran.casemanagement.dto.*;
import com.kiran.casemanagement.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@Tag(name = "Citizen Requests")
public class RequestController {

    private final ServiceRequestService requestService;

    @PostMapping
    @Operation(summary = "Submit a new service request")
    public ResponseEntity<RequestResponseDto> createRequest(@Valid @RequestBody CreateRequestDto dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }

    @GetMapping("/my")
    @Operation(summary = "Get citizen's own requests")
    public ResponseEntity<List<RequestListDto>> getMyRequests(@RequestParam Long citizenId) {
        return ResponseEntity.ok(requestService.getMyRequests(citizenId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get request details (citizen view)")
    public ResponseEntity<RequestDetailDto> getRequestDetail(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestDetail(id, false));
    }
}
