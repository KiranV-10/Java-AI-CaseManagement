package com.kiran.casemanagement.service;

import com.kiran.casemanagement.enums.RequestStatus;
import com.kiran.casemanagement.exception.InvalidStatusTransitionException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

class StatusTransitionServiceTest {

    private final StatusTransitionService service = new StatusTransitionService();

    @ParameterizedTest
    @CsvSource({
            "NEW, IN_REVIEW",
            "IN_REVIEW, WAITING_FOR_CITIZEN",
            "IN_REVIEW, RESOLVED",
            "WAITING_FOR_CITIZEN, IN_REVIEW",
            "RESOLVED, CLOSED",
            "RESOLVED, IN_REVIEW"
    })
    void validTransitions(String from, String to) {
        assertDoesNotThrow(() ->
                service.validate(RequestStatus.valueOf(from), RequestStatus.valueOf(to)));
    }

    @ParameterizedTest
    @CsvSource({
            "CLOSED, NEW",
            "CLOSED, WAITING_FOR_CITIZEN",
            "NEW, CLOSED",
            "NEW, RESOLVED",
            "NEW, WAITING_FOR_CITIZEN",
            "WAITING_FOR_CITIZEN, RESOLVED",
            "CLOSED, IN_REVIEW"
    })
    void invalidTransitions(String from, String to) {
        assertThrows(InvalidStatusTransitionException.class, () ->
                service.validate(RequestStatus.valueOf(from), RequestStatus.valueOf(to)));
    }

    @Test
    void sameStatusTransitionIsInvalid() {
        assertThrows(InvalidStatusTransitionException.class, () ->
                service.validate(RequestStatus.NEW, RequestStatus.NEW));
    }
}
