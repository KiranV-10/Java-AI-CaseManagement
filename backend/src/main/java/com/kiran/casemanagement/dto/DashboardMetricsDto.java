package com.kiran.casemanagement.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardMetricsDto {
    private long totalRequests;
    private long newRequests;
    private long highPriorityRequests;
    private long urgentRequests;
    private long waitingForCitizen;
    private long resolvedThisWeek;
    private double averageResolutionDays;
    private long agingRequests;
}
