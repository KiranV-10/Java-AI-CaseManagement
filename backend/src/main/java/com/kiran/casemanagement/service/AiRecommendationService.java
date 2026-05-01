package com.kiran.casemanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kiran.casemanagement.ai.AiProvider;
import com.kiran.casemanagement.ai.AiProviderException;
import com.kiran.casemanagement.dto.*;
import com.kiran.casemanagement.entity.AiRecommendation;
import com.kiran.casemanagement.entity.CaseNote;
import com.kiran.casemanagement.entity.CaseStatusHistory;
import com.kiran.casemanagement.entity.ServiceRequest;
import com.kiran.casemanagement.enums.AiStatus;
import com.kiran.casemanagement.enums.AuditAction;
import com.kiran.casemanagement.repository.AiRecommendationRepository;
import com.kiran.casemanagement.repository.CaseNoteRepository;
import com.kiran.casemanagement.repository.StatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiRecommendationService {

    private static final Logger log = LoggerFactory.getLogger(AiRecommendationService.class);
    private final AiProvider aiProvider;
    private final AiRecommendationRepository aiRecommendationRepository;
    private final CaseNoteRepository caseNoteRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    @Transactional
    public AiRecommendation classifyRequest(ServiceRequest request) {
        AiClassificationRequest aiReq = AiClassificationRequest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .selectedCategory(request.getCategory().getName())
                .urgency(request.getPriority().name())
                .employerName(request.getEmployerName())
                .incidentDate(request.getIncidentDate() != null ? request.getIncidentDate().toString() : null)
                .build();

        try {
            AiClassificationResponse aiResp = aiProvider.classifyRequest(aiReq);
            AiRecommendation rec = AiRecommendation.builder()
                    .request(request)
                    .provider(aiProvider.getProviderName())
                    .model(aiProvider.getModelName())
                    .suggestedCategory(aiResp.getSuggestedCategory())
                    .suggestedPriority(aiResp.getSuggestedPriority())
                    .confidenceScore(aiResp.getConfidenceScore())
                    .reasoning(aiResp.getReasoning())
                    .citizenGuidance(aiResp.getCitizenGuidance())
                    .rawResponse(toJson(aiResp))
                    .status(AiStatus.SUCCESS)
                    .build();
            rec = aiRecommendationRepository.save(rec);
            auditLogService.log("ServiceRequest", request.getId(), AuditAction.AI_CLASSIFICATION_GENERATED,
                    null, null, aiResp.getSuggestedCategory());
            return rec;
        } catch (AiProviderException e) {
            log.error("AI classification failed for request {}: {}", request.getId(), e.getMessage());
            AiRecommendation rec = AiRecommendation.builder()
                    .request(request)
                    .provider(aiProvider.getProviderName())
                    .model(aiProvider.getModelName())
                    .status(AiStatus.FAILED)
                    .errorMessage(e.getMessage())
                    .build();
            rec = aiRecommendationRepository.save(rec);
            auditLogService.log("ServiceRequest", request.getId(), AuditAction.AI_CLASSIFICATION_FAILED,
                    null, null, e.getMessage());
            return rec;
        }
    }

    @Transactional
    public AiSummaryResponseDto generateSummary(ServiceRequest request) {
        List<CaseNote> notes = caseNoteRepository.findByRequestIdOrderByCreatedAtDesc(request.getId());
        List<CaseStatusHistory> history = statusHistoryRepository.findByRequestIdOrderByCreatedAtDesc(request.getId());

        String caseDetails = String.format(
                "Request: %s\nTitle: %s\nDescription: %s\nCategory: %s\nPriority: %s\nStatus: %s\nEmployer: %s\nIncident Date: %s",
                request.getRequestNumber(), request.getTitle(), request.getDescription(),
                request.getCategory().getName(), request.getPriority(), request.getStatus(),
                request.getEmployerName() != null ? request.getEmployerName() : "N/A",
                request.getIncidentDate() != null ? request.getIncidentDate() : "N/A");

        String notesText = notes.isEmpty() ? "No notes yet." :
                notes.stream().map(n -> n.getAuthor().getFullName() + ": " + n.getNoteText())
                        .collect(Collectors.joining("\n"));

        String historyText = history.isEmpty() ? "No status changes yet." :
                history.stream().map(h -> h.getOldStatus() + " -> " + h.getNewStatus() + " (" + h.getChangeReason() + ")")
                        .collect(Collectors.joining("\n"));

        AiSummaryRequest aiReq = AiSummaryRequest.builder()
                .caseDetails(caseDetails)
                .internalNotes(notesText)
                .statusHistory(historyText)
                .build();

        try {
            AiSummaryResponse aiResp = aiProvider.generateCaseSummary(aiReq);
            AiRecommendation rec = AiRecommendation.builder()
                    .request(request)
                    .provider(aiProvider.getProviderName())
                    .model(aiProvider.getModelName())
                    .summary(aiResp.getSummary())
                    .keyFacts(toJson(aiResp.getKeyFacts()))
                    .missingInformation(toJson(aiResp.getMissingInformation()))
                    .suggestedNextAction(aiResp.getSuggestedNextAction())
                    .citizenGuidance(aiResp.getCitizenFriendlyExplanation())
                    .rawResponse(toJson(aiResp))
                    .status(AiStatus.SUCCESS)
                    .build();
            aiRecommendationRepository.save(rec);
            auditLogService.log("ServiceRequest", request.getId(), AuditAction.AI_SUMMARY_GENERATED,
                    null, null, aiResp.getSummary());

            return AiSummaryResponseDto.builder()
                    .aiStatus("SUCCESS")
                    .provider(aiProvider.getProviderName())
                    .model(aiProvider.getModelName())
                    .summary(aiResp.getSummary())
                    .keyFacts(aiResp.getKeyFacts())
                    .missingInformation(aiResp.getMissingInformation())
                    .suggestedNextAction(aiResp.getSuggestedNextAction())
                    .citizenFriendlyExplanation(aiResp.getCitizenFriendlyExplanation())
                    .build();
        } catch (AiProviderException e) {
            log.error("AI summary failed for request {}: {}", request.getId(), e.getMessage());
            AiRecommendation rec = AiRecommendation.builder()
                    .request(request)
                    .provider(aiProvider.getProviderName())
                    .model(aiProvider.getModelName())
                    .status(AiStatus.FAILED)
                    .errorMessage(e.getMessage())
                    .build();
            aiRecommendationRepository.save(rec);
            auditLogService.log("ServiceRequest", request.getId(), AuditAction.AI_SUMMARY_FAILED,
                    null, null, e.getMessage());

            return AiSummaryResponseDto.builder()
                    .aiStatus("FAILED")
                    .provider(aiProvider.getProviderName())
                    .model(aiProvider.getModelName())
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    public AiRecommendationDto getLatestRecommendation(Long requestId) {
        return aiRecommendationRepository
                .findFirstByRequestIdAndStatusOrderByCreatedAtDesc(requestId, AiStatus.SUCCESS)
                .map(this::toDto)
                .orElse(null);
    }

    public AiRecommendationDto toDto(AiRecommendation rec) {
        return AiRecommendationDto.builder()
                .id(rec.getId())
                .provider(rec.getProvider())
                .model(rec.getModel())
                .suggestedCategory(rec.getSuggestedCategory())
                .suggestedPriority(rec.getSuggestedPriority())
                .confidenceScore(rec.getConfidenceScore())
                .reasoning(rec.getReasoning())
                .summary(rec.getSummary())
                .keyFacts(parseJsonList(rec.getKeyFacts()))
                .missingInformation(parseJsonList(rec.getMissingInformation()))
                .suggestedNextAction(rec.getSuggestedNextAction())
                .citizenGuidance(rec.getCitizenGuidance())
                .status(rec.getStatus().name())
                .errorMessage(rec.getErrorMessage())
                .createdAt(rec.getCreatedAt() != null ? rec.getCreatedAt().toString() : null)
                .build();
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return obj != null ? obj.toString() : null;
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }
}
