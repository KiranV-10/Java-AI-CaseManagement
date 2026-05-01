package com.kiran.casemanagement.service;

import com.kiran.casemanagement.enums.RequestStatus;
import com.kiran.casemanagement.exception.InvalidStatusTransitionException;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Set;

@Service
public class StatusTransitionService {

    private static final Map<RequestStatus, Set<RequestStatus>> ALLOWED = Map.of(
            RequestStatus.NEW, Set.of(RequestStatus.IN_REVIEW),
            RequestStatus.IN_REVIEW, Set.of(RequestStatus.WAITING_FOR_CITIZEN, RequestStatus.RESOLVED),
            RequestStatus.WAITING_FOR_CITIZEN, Set.of(RequestStatus.IN_REVIEW),
            RequestStatus.RESOLVED, Set.of(RequestStatus.CLOSED, RequestStatus.IN_REVIEW)
    );

    public void validate(RequestStatus from, RequestStatus to) {
        Set<RequestStatus> allowed = ALLOWED.getOrDefault(from, Set.of());
        if (!allowed.contains(to)) {
            throw new InvalidStatusTransitionException(
                    "Cannot transition from " + from + " to " + to);
        }
    }
}
