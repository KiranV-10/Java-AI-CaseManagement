package com.kiran.casemanagement.config;

import com.kiran.casemanagement.entity.*;
import com.kiran.casemanagement.enums.*;
import com.kiran.casemanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceRequestRepository requestRepository;
    private final StatusHistoryRepository statusHistoryRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }

        log.info("Seeding database with demo data...");

        AppUser citizen = userRepository.save(AppUser.builder()
                .fullName("Demo Citizen").email("citizen@example.com")
                .passwordHash("password123").role(RoleName.CITIZEN).active(true).build());

        AppUser worker = userRepository.save(AppUser.builder()
                .fullName("Jordan Caseworker").email("worker@example.com")
                .passwordHash("password123").role(RoleName.CASE_WORKER).active(true).build());

        AppUser admin = userRepository.save(AppUser.builder()
                .fullName("Taylor Admin").email("admin@example.com")
                .passwordHash("password123").role(RoleName.ADMIN).active(true).build());

        RequestCategory unemployment = categoryRepository.save(RequestCategory.builder()
                .name("Unemployment Benefits").description("Questions about unemployment insurance and benefits")
                .defaultPriority(Priority.MEDIUM).slaDays(7).active(true).build());
        RequestCategory wageHour = categoryRepository.save(RequestCategory.builder()
                .name("Wage and Hour Concern").description("Issues related to wages, overtime, and working hours")
                .defaultPriority(Priority.HIGH).slaDays(5).active(true).build());
        RequestCategory workersComp = categoryRepository.save(RequestCategory.builder()
                .name("Workers' Compensation").description("Workplace injury and compensation claims")
                .defaultPriority(Priority.HIGH).slaDays(5).active(true).build());
        RequestCategory youth = categoryRepository.save(RequestCategory.builder()
                .name("Youth Employment").description("Youth work permits and employment regulations")
                .defaultPriority(Priority.MEDIUM).slaDays(7).active(true).build());
        RequestCategory laborStandards = categoryRepository.save(RequestCategory.builder()
                .name("Labor Standards").description("General labor law and workplace standards")
                .defaultPriority(Priority.MEDIUM).slaDays(10).active(true).build());
        RequestCategory general = categoryRepository.save(RequestCategory.builder()
                .name("General Inquiry").description("General questions about labor services")
                .defaultPriority(Priority.LOW).slaDays(14).active(true).build());

        List<ServiceRequest> requests = List.of(
                createRequest("REQ-2026-0001", citizen, wageHour, "Unpaid wages for two weeks",
                        "My employer has not paid me for the last two weeks. I worked 45 hours each week including overtime.",
                        "ABC Manufacturing", LocalDate.of(2026, 4, 15), RequestStatus.NEW, Priority.HIGH, null),
                createRequest("REQ-2026-0002", citizen, unemployment, "Unemployment claim status question",
                        "I filed for unemployment benefits three weeks ago and have not received any updates on my claim status.",
                        null, LocalDate.of(2026, 4, 1), RequestStatus.IN_REVIEW, Priority.MEDIUM, worker),
                createRequest("REQ-2026-0003", citizen, workersComp, "Workers' compensation injury question",
                        "I was injured at work last week and need to file a workers compensation claim. I hurt my back lifting heavy boxes.",
                        "XYZ Warehouse Inc", LocalDate.of(2026, 4, 20), RequestStatus.NEW, Priority.HIGH, null),
                createRequest("REQ-2026-0004", citizen, youth, "Youth employment hours question",
                        "My 16-year-old child is being scheduled to work past 10pm on school nights. Is this legal?",
                        "FastFood Chain", null, RequestStatus.WAITING_FOR_CITIZEN, Priority.MEDIUM, worker),
                createRequest("REQ-2026-0005", citizen, laborStandards, "General labor standards question",
                        "My employer is requiring me to attend unpaid training sessions on weekends. Is this a violation of labor standards?",
                        "Tech Solutions Corp", null, RequestStatus.IN_REVIEW, Priority.MEDIUM, worker),
                createRequest("REQ-2026-0006", citizen, wageHour, "Overtime pay concern",
                        "I have been working 50+ hours per week but my employer only pays me regular rate for all hours. No overtime pay.",
                        "Construction Co", LocalDate.of(2026, 4, 10), RequestStatus.NEW, Priority.HIGH, null)
        );

        for (ServiceRequest req : requests) {
            ServiceRequest saved = requestRepository.save(req);
            statusHistoryRepository.save(CaseStatusHistory.builder()
                    .request(saved).oldStatus(null).newStatus(RequestStatus.NEW)
                    .changedBy(citizen).changeReason("Request submitted by citizen").build());

            if (saved.getStatus() == RequestStatus.IN_REVIEW) {
                statusHistoryRepository.save(CaseStatusHistory.builder()
                        .request(saved).oldStatus(RequestStatus.NEW).newStatus(RequestStatus.IN_REVIEW)
                        .changedBy(worker).changeReason("Case accepted for review").build());
            }
            if (saved.getStatus() == RequestStatus.WAITING_FOR_CITIZEN) {
                statusHistoryRepository.save(CaseStatusHistory.builder()
                        .request(saved).oldStatus(RequestStatus.NEW).newStatus(RequestStatus.IN_REVIEW)
                        .changedBy(worker).changeReason("Case accepted for review").build());
                statusHistoryRepository.save(CaseStatusHistory.builder()
                        .request(saved).oldStatus(RequestStatus.IN_REVIEW).newStatus(RequestStatus.WAITING_FOR_CITIZEN)
                        .changedBy(worker).changeReason("Requested additional information from citizen").build());
            }
        }

        log.info("Database seeded with {} users, {} categories, {} requests.",
                userRepository.count(), categoryRepository.count(), requestRepository.count());
    }

    private ServiceRequest createRequest(String number, AppUser citizen, RequestCategory category,
                                          String title, String description, String employer,
                                          LocalDate incidentDate, RequestStatus status,
                                          Priority priority, AppUser assignedTo) {
        return ServiceRequest.builder()
                .requestNumber(number).citizen(citizen).category(category)
                .title(title).description(description)
                .preferredContactMethod(ContactMethod.EMAIL)
                .employerName(employer).incidentDate(incidentDate)
                .status(status).priority(priority).assignedTo(assignedTo)
                .build();
    }
}
