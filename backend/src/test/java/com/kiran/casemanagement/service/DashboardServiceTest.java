package com.kiran.casemanagement.service;

import com.kiran.casemanagement.dto.DashboardMetricsDto;
import com.kiran.casemanagement.enums.Priority;
import com.kiran.casemanagement.enums.RequestStatus;
import com.kiran.casemanagement.repository.ServiceRequestRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ServiceRequestRepository requestRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void getMetrics_returnsCorrectCounts() {
        when(requestRepository.count()).thenReturn(120L);
        when(requestRepository.countByStatus(RequestStatus.NEW)).thenReturn(18L);
        when(requestRepository.countByPriority(Priority.HIGH)).thenReturn(12L);
        when(requestRepository.countByPriority(Priority.URGENT)).thenReturn(3L);
        when(requestRepository.countByStatus(RequestStatus.WAITING_FOR_CITIZEN)).thenReturn(7L);
        when(requestRepository.countResolvedSince(any())).thenReturn(24L);
        when(requestRepository.averageResolutionDays()).thenReturn(4.2);
        when(requestRepository.countAgingRequests(any())).thenReturn(9L);

        DashboardMetricsDto metrics = dashboardService.getMetrics();

        assertEquals(120, metrics.getTotalRequests());
        assertEquals(18, metrics.getNewRequests());
        assertEquals(12, metrics.getHighPriorityRequests());
        assertEquals(3, metrics.getUrgentRequests());
        assertEquals(7, metrics.getWaitingForCitizen());
        assertEquals(24, metrics.getResolvedThisWeek());
        assertEquals(4.2, metrics.getAverageResolutionDays());
        assertEquals(9, metrics.getAgingRequests());
    }

    @Test
    void getMetrics_nullAverageResolution() {
        when(requestRepository.count()).thenReturn(0L);
        when(requestRepository.countByStatus(any())).thenReturn(0L);
        when(requestRepository.countByPriority(any())).thenReturn(0L);
        when(requestRepository.countResolvedSince(any())).thenReturn(0L);
        when(requestRepository.averageResolutionDays()).thenReturn(null);
        when(requestRepository.countAgingRequests(any())).thenReturn(0L);

        DashboardMetricsDto metrics = dashboardService.getMetrics();
        assertEquals(0.0, metrics.getAverageResolutionDays());
    }
}
