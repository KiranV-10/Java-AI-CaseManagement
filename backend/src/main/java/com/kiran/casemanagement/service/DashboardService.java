package com.kiran.casemanagement.service;

import com.kiran.casemanagement.dto.DashboardMetricsDto;
import com.kiran.casemanagement.enums.Priority;
import com.kiran.casemanagement.enums.RequestStatus;
import com.kiran.casemanagement.repository.ServiceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ServiceRequestRepository requestRepository;

    public DashboardMetricsDto getMetrics() {
        LocalDateTime startOfWeek = LocalDateTime.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .withHour(0).withMinute(0).withSecond(0);
        LocalDateTime agingCutoff = LocalDateTime.now().minusDays(7);

        Double avgDays = requestRepository.averageResolutionDays();

        return DashboardMetricsDto.builder()
                .totalRequests(requestRepository.count())
                .newRequests(requestRepository.countByStatus(RequestStatus.NEW))
                .highPriorityRequests(requestRepository.countByPriority(Priority.HIGH))
                .urgentRequests(requestRepository.countByPriority(Priority.URGENT))
                .waitingForCitizen(requestRepository.countByStatus(RequestStatus.WAITING_FOR_CITIZEN))
                .resolvedThisWeek(requestRepository.countResolvedSince(startOfWeek))
                .averageResolutionDays(avgDays != null ? Math.round(avgDays * 10.0) / 10.0 : 0.0)
                .agingRequests(requestRepository.countAgingRequests(agingCutoff))
                .build();
    }
}
