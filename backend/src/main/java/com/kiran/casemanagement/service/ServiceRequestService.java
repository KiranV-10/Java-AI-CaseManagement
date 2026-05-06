package com.kiran.casemanagement.service;

import com.kiran.casemanagement.dto.*;
import com.kiran.casemanagement.entity.*;
import com.kiran.casemanagement.enums.*;
import com.kiran.casemanagement.exception.ResourceNotFoundException;
import com.kiran.casemanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AiRecommendationService aiRecommendationService;
    private final CaseNoteService caseNoteService;
    private final AuditLogService auditLogService;
    private final StatusTransitionService statusTransitionService;

    @Transactional
    public RequestResponseDto createRequest(CreateRequestDto dto) {
        AppUser citizen = userRepository.findById(dto.getCitizenId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getCitizenId()));
        RequestCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));

        String requestNumber = generateRequestNumber();

        ServiceRequest request = ServiceRequest.builder()
                .requestNumber(requestNumber)
                .citizen(citizen)
                .category(category)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .preferredContactMethod(dto.getPreferredContactMethod() != null ?
                        ContactMethod.valueOf(dto.getPreferredContactMethod()) : ContactMethod.EMAIL)
                .phoneNumber(dto.getPhoneNumber())
                .employerName(dto.getEmployerName())
                .incidentDate(dto.getIncidentDate() != null ? LocalDate.parse(dto.getIncidentDate()) : null)
                .documentName(dto.getDocumentName())
                .status(RequestStatus.NEW)
                .priority(category.getDefaultPriority())
                .build();
        request = requestRepository.save(request);

        CaseStatusHistory initialStatus = CaseStatusHistory.builder()
                .request(request)
                .oldStatus(null)
                .newStatus(RequestStatus.NEW)
                .changedBy(citizen)
                .changeReason("Request submitted by citizen")
                .build();
        statusHistoryRepository.save(initialStatus);

        auditLogService.log("ServiceRequest", request.getId(), AuditAction.REQUEST_CREATED,
                citizen, null, request.getRequestNumber());

        AiRecommendation aiRec = aiRecommendationService.classifyRequest(request);

        RequestResponseDto.RequestResponseDtoBuilder responseBuilder = RequestResponseDto.builder()
                .id(request.getId())
                .requestNumber(request.getRequestNumber())
                .status(request.getStatus().name())
                .priority(request.getPriority().name())
                .message("Request submitted successfully.");

        if (aiRec.getStatus() == AiStatus.SUCCESS) {
            request.setAiSuggestedCategory(aiRec.getSuggestedCategory());
            request.setAiSuggestedPriority(aiRec.getSuggestedPriority());
            requestRepository.save(request);

            responseBuilder
                    .aiSuggestedCategory(aiRec.getSuggestedCategory())
                    .aiSuggestedPriority(aiRec.getSuggestedPriority())
                    .aiStatus("SUCCESS")
                    .citizenGuidance(aiRec.getCitizenGuidance());
        } else {
            responseBuilder
                    .aiStatus("FAILED")
                    .message("Request submitted successfully. AI recommendation is currently unavailable.");
        }

        return responseBuilder.build();
    }

    public List<RequestListDto> getMyRequests(Long citizenId) {
        return requestRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
                .stream().map(this::toListDto).toList();
    }

    public RequestDetailDto getRequestDetail(Long id, boolean isStaff) {
        ServiceRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + id));

        List<CaseNoteDto> notes = caseNoteService.getNotes(id, isStaff);
        List<StatusHistoryDto> history = statusHistoryRepository.findByRequestIdOrderByCreatedAtDesc(id)
                .stream().map(this::toHistoryDto).toList();

        AiRecommendationDto aiRec = aiRecommendationService.getLatestRecommendation(id);

        List<AuditLogDto> auditLogs = isStaff ?
                auditLogService.getLogsForEntity("ServiceRequest", id) : List.of();

        return RequestDetailDto.builder()
                .id(req.getId())
                .requestNumber(req.getRequestNumber())
                .title(req.getTitle())
                .description(req.getDescription())
                .status(req.getStatus().name())
                .priority(req.getPriority().name())
                .categoryName(req.getCategory().getName())
                .categoryId(req.getCategory().getId())
                .preferredContactMethod(req.getPreferredContactMethod() != null ? req.getPreferredContactMethod().name() : null)
                .phoneNumber(req.getPhoneNumber())
                .employerName(req.getEmployerName())
                .incidentDate(req.getIncidentDate() != null ? req.getIncidentDate().toString() : null)
                .documentName(req.getDocumentName())
                .aiSuggestedCategory(req.getAiSuggestedCategory())
                .aiSuggestedPriority(req.getAiSuggestedPriority())
                .citizenName(req.getCitizen().getFullName())
                .citizenEmail(req.getCitizen().getEmail())
                .citizenId(req.getCitizen().getId())
                .assignedToName(req.getAssignedTo() != null ? req.getAssignedTo().getFullName() : null)
                .assignedToId(req.getAssignedTo() != null ? req.getAssignedTo().getId() : null)
                .createdAt(req.getCreatedAt().toString())
                .updatedAt(req.getUpdatedAt() != null ? req.getUpdatedAt().toString() : null)
                .resolvedAt(req.getResolvedAt() != null ? req.getResolvedAt().toString() : null)
                .closedAt(req.getClosedAt() != null ? req.getClosedAt().toString() : null)
                .aiRecommendation(aiRec)
                .notes(notes)
                .statusHistory(history)
                .auditLogs(auditLogs)
                .build();
    }

    public Page<RequestListDto> getStaffRequests(String status, Long categoryId, String priority,
                                                  Long assignedTo, String keyword,
                                                  String fromDate, String toDate,
                                                  int page, int size) {
        RequestStatus statusEnum = status != null ? RequestStatus.valueOf(status) : null;
        Priority priorityEnum = priority != null ? Priority.valueOf(priority) : null;
        LocalDateTime from = fromDate != null ? LocalDate.parse(fromDate).atStartOfDay() : null;
        LocalDateTime to = toDate != null ? LocalDate.parse(toDate).atTime(23, 59, 59) : null;
        String keywordPattern = keyword == null || keyword.isBlank()
                ? null
                : "%" + keyword.toLowerCase(Locale.ROOT) + "%";

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return requestRepository.findWithFilters(statusEnum, categoryId, priorityEnum, assignedTo,
                keywordPattern, from, to, pageable).map(this::toListDto);
    }

    @Transactional
    public RequestDetailDto assignRequest(Long requestId, AssignRequestDto dto) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));
        AppUser assignee = userRepository.findById(dto.getAssignedToUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getAssignedToUserId()));

        String oldAssignee = req.getAssignedTo() != null ? req.getAssignedTo().getFullName() : "Unassigned";
        req.setAssignedTo(assignee);
        requestRepository.save(req);

        auditLogService.log("ServiceRequest", requestId, AuditAction.CASE_ASSIGNED,
                assignee, oldAssignee, assignee.getFullName());

        return getRequestDetail(requestId, true);
    }

    @Transactional
    public RequestDetailDto updateStatus(Long requestId, UpdateStatusDto dto) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));
        AppUser changedBy = userRepository.findById(dto.getChangedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getChangedByUserId()));

        RequestStatus newStatus = RequestStatus.valueOf(dto.getNewStatus());
        statusTransitionService.validate(req.getStatus(), newStatus);

        RequestStatus oldStatus = req.getStatus();
        req.setStatus(newStatus);

        if (newStatus == RequestStatus.RESOLVED) req.setResolvedAt(LocalDateTime.now());
        if (newStatus == RequestStatus.CLOSED) req.setClosedAt(LocalDateTime.now());
        if (newStatus == RequestStatus.IN_REVIEW && oldStatus == RequestStatus.RESOLVED) {
            req.setResolvedAt(null);
            auditLogService.log("ServiceRequest", requestId, AuditAction.CASE_REOPENED,
                    changedBy, oldStatus.name(), newStatus.name());
        }

        requestRepository.save(req);

        CaseStatusHistory history = CaseStatusHistory.builder()
                .request(req)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(changedBy)
                .changeReason(dto.getReason())
                .build();
        statusHistoryRepository.save(history);

        auditLogService.log("ServiceRequest", requestId, AuditAction.STATUS_CHANGED,
                changedBy, oldStatus.name(), newStatus.name());

        return getRequestDetail(requestId, true);
    }

    @Transactional
    public RequestDetailDto overridePriority(Long requestId, OverridePriorityDto dto) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));
        AppUser changedBy = userRepository.findById(dto.getChangedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getChangedByUserId()));

        String oldPriority = req.getPriority().name();
        req.setPriority(Priority.valueOf(dto.getPriority()));
        requestRepository.save(req);

        auditLogService.log("ServiceRequest", requestId, AuditAction.PRIORITY_CHANGED,
                changedBy, oldPriority, dto.getPriority());

        return getRequestDetail(requestId, true);
    }

    @Transactional
    public AiSummaryResponseDto generateAiSummary(Long requestId) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));
        return aiRecommendationService.generateSummary(req);
    }

    private String generateRequestNumber() {
        String prefix = "REQ-" + Year.now().getValue() + "-";
        int maxNum = requestRepository.findMaxRequestNumberForPrefix(prefix + "%");
        return prefix + String.format("%04d", maxNum + 1);
    }

    private RequestListDto toListDto(ServiceRequest req) {
        return RequestListDto.builder()
                .id(req.getId())
                .requestNumber(req.getRequestNumber())
                .title(req.getTitle())
                .status(req.getStatus().name())
                .priority(req.getPriority().name())
                .categoryName(req.getCategory().getName())
                .citizenName(req.getCitizen().getFullName())
                .assignedToName(req.getAssignedTo() != null ? req.getAssignedTo().getFullName() : null)
                .createdAt(req.getCreatedAt().toString())
                .updatedAt(req.getUpdatedAt() != null ? req.getUpdatedAt().toString() : null)
                .build();
    }

    private StatusHistoryDto toHistoryDto(CaseStatusHistory h) {
        return StatusHistoryDto.builder()
                .id(h.getId())
                .oldStatus(h.getOldStatus() != null ? h.getOldStatus().name() : null)
                .newStatus(h.getNewStatus().name())
                .changedByName(h.getChangedBy().getFullName())
                .changeReason(h.getChangeReason())
                .createdAt(h.getCreatedAt().toString())
                .build();
    }
}
