package com.kiran.casemanagement.config;

import com.kiran.casemanagement.entity.*;
import com.kiran.casemanagement.enums.*;
import com.kiran.casemanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String DEMO_PASSWORD = "password123";

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceRequestRepository requestRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final CaseNoteRepository caseNoteRepository;
    private final AuditLogRepository auditLogRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        repairLegacyTextColumns();

        AppUser citizen = ensureUser("citizen@example.com", "Demo Citizen", RoleName.CITIZEN);
        AppUser maria = ensureUser("maria.lopez@example.com", "Maria Lopez", RoleName.CITIZEN);
        AppUser sam = ensureUser("sam.patel@example.com", "Sam Patel", RoleName.CITIZEN);
        AppUser priya = ensureUser("priya.chen@example.com", "Priya Chen", RoleName.CITIZEN);
        AppUser omar = ensureUser("omar.johnson@example.com", "Omar Johnson", RoleName.CITIZEN);
        AppUser worker = ensureUser("worker@example.com", "Jordan Caseworker", RoleName.CASE_WORKER);
        AppUser seniorWorker = ensureUser("caseworker2@example.com", "Avery Senior Caseworker", RoleName.CASE_WORKER);
        ensureUser("admin@example.com", "Taylor Admin", RoleName.ADMIN);

        RequestCategory unemployment = ensureCategory("Unemployment Benefits",
                "Questions about unemployment insurance and benefits", Priority.MEDIUM, 7);
        RequestCategory wageHour = ensureCategory("Wage and Hour Concern",
                "Issues related to wages, overtime, and working hours", Priority.HIGH, 5);
        RequestCategory workersComp = ensureCategory("Workers' Compensation",
                "Workplace injury and compensation claims", Priority.HIGH, 5);
        RequestCategory youth = ensureCategory("Youth Employment",
                "Youth work permits and employment regulations", Priority.MEDIUM, 7);
        RequestCategory laborStandards = ensureCategory("Labor Standards",
                "General labor law and workplace standards", Priority.MEDIUM, 10);
        RequestCategory general = ensureCategory("General Inquiry",
                "General questions about labor services", Priority.LOW, 14);

        log.info("Seeding demo requests...");

        seedRequest("REQ-2026-0001", maria, wageHour, "Unpaid overtime and missed final paycheck",
                "I worked 52 to 56 hours per week for the last month at Harbor Cafe, but my paycheck only shows regular hourly pay. My final paycheck after resigning is also missing two weekend shifts.",
                "Harbor Cafe Group", LocalDate.of(2026, 4, 15), RequestStatus.NEW, Priority.HIGH, null,
                ContactMethod.EMAIL, null, "timesheets-april.pdf",
                List.of(),
                List.of(),
                "New wage complaint ready for triage.");

        seedRequest("REQ-2026-0002", sam, unemployment, "Unemployment claim pending after layoff",
                "I was laid off from Lakeside Logistics after the warehouse contract ended. I submitted my unemployment claim three weeks ago and need help understanding why it is still pending.",
                "Lakeside Logistics", LocalDate.of(2026, 4, 1), RequestStatus.IN_REVIEW, Priority.MEDIUM, worker,
                ContactMethod.EMAIL, null, "separation-letter.pdf",
                List.of("Verified claimant identity and employer separation letter is attached.",
                        "Next step: confirm employer response deadline before sending status update."),
                List.of(history(RequestStatus.NEW, RequestStatus.IN_REVIEW, worker, "Case accepted for unemployment review.")),
                "Assigned for eligibility follow-up.");

        seedRequest("REQ-2026-0003", priya, workersComp, "Back injury after warehouse lift",
                "I injured my lower back while lifting inventory at work. My supervisor completed an incident report, but I have not received information about workers' compensation next steps.",
                "Northstar Warehouse", LocalDate.of(2026, 4, 20), RequestStatus.NEW, Priority.HIGH, null,
                ContactMethod.PHONE, "555-0142", "incident-report.pdf",
                List.of(),
                List.of(),
                "New workers' compensation intake with injury details.");

        seedRequest("REQ-2026-0004", citizen, youth, "Teen scheduled past permitted school-night hours",
                "My 16-year-old child is regularly scheduled until 10:45pm on school nights. I want to understand whether these hours are permitted and what information the employer should provide.",
                "QuickServe Burgers", LocalDate.of(2026, 4, 28), RequestStatus.WAITING_FOR_CITIZEN, Priority.MEDIUM, worker,
                ContactMethod.EMAIL, null, "school-schedule.png",
                List.of("Asked citizen to upload a copy of the weekly schedule and school calendar.",
                        "Employer name and store location are confirmed."),
                List.of(history(RequestStatus.NEW, RequestStatus.IN_REVIEW, worker, "Case accepted for youth employment review."),
                        history(RequestStatus.IN_REVIEW, RequestStatus.WAITING_FOR_CITIZEN, worker, "Requested schedule documentation from citizen.")),
                "Awaiting schedule documentation.");

        seedRequest("REQ-2026-0005", omar, laborStandards, "Mandatory unpaid weekend training",
                "My employer requires new supervisors to attend Saturday training sessions without pay. Attendance is required to stay in the role.",
                "Metro Tech Solutions", LocalDate.of(2026, 3, 29), RequestStatus.IN_REVIEW, Priority.MEDIUM, seniorWorker,
                ContactMethod.PHONE, "555-0177", "training-email.pdf",
                List.of("Reviewed training email. It states attendance is required for all supervisors.",
                        "Need employer policy document before final recommendation."),
                List.of(history(RequestStatus.NEW, RequestStatus.IN_REVIEW, seniorWorker, "Accepted for labor standards review.")),
                "Assigned to senior caseworker for policy review.");

        seedRequest("REQ-2026-0006", maria, wageHour, "Overtime rate paid incorrectly",
                "My paystub shows 10 overtime hours, but the overtime rate appears to be the same as my regular rate. This happened for two consecutive pay periods.",
                "Riverbend Construction", LocalDate.of(2026, 4, 10), RequestStatus.RESOLVED, Priority.HIGH, seniorWorker,
                ContactMethod.EMAIL, null, "paystub-comparison.pdf",
                List.of("Citizen provided paystubs for both pay periods.",
                        "Employer issued corrected payment and citizen confirmed receipt."),
                List.of(history(RequestStatus.NEW, RequestStatus.IN_REVIEW, seniorWorker, "Accepted and requested paystub documentation."),
                        history(RequestStatus.IN_REVIEW, RequestStatus.RESOLVED, seniorWorker, "Employer corrected overtime payment.")),
                "Resolved after corrected payment.");

        seedRequest("REQ-2026-0007", sam, general, "Question about which labor office handles my issue",
                "I am not sure whether my concern belongs with unemployment, wage and hour, or another labor office. I need help identifying the right next step.",
                null, null, RequestStatus.CLOSED, Priority.LOW, worker,
                ContactMethod.EMAIL, null, null,
                List.of("Provided citizen with routing guidance and links to the correct intake forms."),
                List.of(history(RequestStatus.NEW, RequestStatus.IN_REVIEW, worker, "Reviewed general inquiry for routing."),
                        history(RequestStatus.IN_REVIEW, RequestStatus.RESOLVED, worker, "Provided routing guidance."),
                        history(RequestStatus.RESOLVED, RequestStatus.CLOSED, worker, "Closed after citizen acknowledged guidance.")),
                "Closed general routing inquiry.");

        seedRequest("REQ-2026-0008", priya, laborStandards, "Retaliation concern after raising safety issue",
                "After I reported blocked emergency exits, my schedule was cut from five shifts to two shifts per week. I need to know what information to document.",
                "Northstar Warehouse", LocalDate.of(2026, 4, 24), RequestStatus.NEW, Priority.URGENT, null,
                ContactMethod.PHONE, "555-0142", "schedule-before-after.pdf",
                List.of(),
                List.of(),
                "Urgent intake flagged for retaliation concern.");

        seedRequest("REQ-2026-0009", omar, unemployment, "Employer reported incorrect separation reason",
                "My unemployment notice says I quit voluntarily, but I was laid off when the department closed. I have an email announcing the layoff.",
                "Metro Tech Solutions", LocalDate.of(2026, 4, 5), RequestStatus.WAITING_FOR_CITIZEN, Priority.MEDIUM, worker,
                ContactMethod.EMAIL, null, "layoff-announcement.pdf",
                List.of("Asked citizen for final day worked and any severance paperwork."),
                List.of(history(RequestStatus.NEW, RequestStatus.IN_REVIEW, worker, "Accepted for claim discrepancy review."),
                        history(RequestStatus.IN_REVIEW, RequestStatus.WAITING_FOR_CITIZEN, worker, "Requested final work date and severance documentation.")),
                "Waiting for supporting unemployment documentation.");

        seedRequest("REQ-2026-0010", citizen, workersComp, "Follow-up on medical documentation",
                "My clinic sent medical documentation last week, but I do not see it reflected in my workers' compensation file.",
                "City Parks Department", LocalDate.of(2026, 3, 18), RequestStatus.IN_REVIEW, Priority.HIGH, seniorWorker,
                ContactMethod.MAIL, null, "clinic-release-form.pdf",
                List.of("Clinic release form received. Staff should verify document transmission date.",
                        "Citizen prefers mailed follow-up due to limited email access."),
                List.of(history(RequestStatus.NEW, RequestStatus.IN_REVIEW, seniorWorker, "Accepted for document follow-up.")),
                "In review for medical documentation follow-up.");

        log.info("Database seeded with {} users, {} categories, {} requests.",
                userRepository.count(), categoryRepository.count(), requestRepository.count());
    }

    private void repairLegacyTextColumns() {
        repairLegacyByteaColumn("service_requests", "title");
        repairLegacyByteaColumn("service_requests", "description");
    }

    private void repairLegacyByteaColumn(String tableName, String columnName) {
        String dataType = jdbcTemplate.queryForObject("""
                SELECT data_type
                FROM information_schema.columns
                WHERE table_schema = current_schema()
                  AND table_name = ?
                  AND column_name = ?
                """, String.class, tableName, columnName);

        if ("bytea".equalsIgnoreCase(dataType)) {
            log.warn("Repairing legacy bytea column {}.{} to text.", tableName, columnName);
            jdbcTemplate.execute("ALTER TABLE " + tableName + " ALTER COLUMN " + columnName
                    + " TYPE text USING convert_from(" + columnName + ", 'UTF8')");
        }
    }

    private DemoHistory history(RequestStatus oldStatus, RequestStatus newStatus, AppUser changedBy, String reason) {
        return new DemoHistory(oldStatus, newStatus, changedBy, reason);
    }

    private ServiceRequest seedRequest(String number, AppUser citizen, RequestCategory category,
                                       String title, String description, String employer,
                                       LocalDate incidentDate, RequestStatus status,
                                       Priority priority, AppUser assignedTo,
                                       ContactMethod contactMethod, String phoneNumber, String documentName,
                                       List<String> notes, List<DemoHistory> histories, String auditMessage) {
        Optional<ServiceRequest> existing = requestRepository.findByRequestNumber(number);
        ServiceRequest saved = existing.orElseGet(() -> ServiceRequest.builder()
                .requestNumber(number)
                .build());

        saved.setCitizen(citizen);
        saved.setCategory(category);
        saved.setTitle(title);
        saved.setDescription(description);
        saved.setPreferredContactMethod(contactMethod);
        saved.setPhoneNumber(phoneNumber);
        saved.setEmployerName(employer);
        saved.setIncidentDate(incidentDate);
        saved.setDocumentName(documentName);
        saved.setStatus(status);
        saved.setPriority(priority);
        saved.setAssignedTo(assignedTo);
        saved.setAiSuggestedCategory(category.getName());
        saved.setAiSuggestedPriority(priority.name());
        saved = requestRepository.save(saved);

        statusHistoryRepository.deleteByRequestId(saved.getId());
        caseNoteRepository.deleteByRequestId(saved.getId());
        auditLogRepository.deleteByEntityTypeAndEntityId("ServiceRequest", saved.getId());

        seedHistory(saved, null, RequestStatus.NEW, citizen, "Request submitted by citizen.");
        for (DemoHistory history : histories) {
            seedHistory(saved, history.oldStatus(), history.newStatus(), history.changedBy(), history.reason());
        }
        for (String note : notes) {
            seedNote(saved, assignedTo != null ? assignedTo : citizen, note);
        }
        seedAudit(saved, citizen, auditMessage);

        return saved;
    }

    private void seedHistory(ServiceRequest request, RequestStatus oldStatus, RequestStatus newStatus,
                             AppUser changedBy, String reason) {
        statusHistoryRepository.save(CaseStatusHistory.builder()
                .request(request)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(changedBy)
                .changeReason(reason)
                .build());
    }

    private void seedNote(ServiceRequest request, AppUser author, String noteText) {
        caseNoteRepository.save(CaseNote.builder()
                .request(request)
                .author(author)
                .noteText(noteText)
                .internalOnly(true)
                .build());
    }

    private void seedAudit(ServiceRequest request, AppUser performedBy, String message) {
        auditLogRepository.save(AuditLog.builder()
                .entityType("ServiceRequest")
                .entityId(request.getId())
                .action(AuditAction.REQUEST_CREATED)
                .performedBy(performedBy)
                .oldValue(null)
                .newValue(message)
                .build());
    }

    private AppUser ensureUser(String email, String fullName, RoleName role) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(AppUser.builder()
                        .fullName(fullName)
                        .email(email)
                        .passwordHash(DEMO_PASSWORD)
                        .role(role)
                        .active(true)
                        .build()));
    }

    private RequestCategory ensureCategory(String name, String description, Priority priority, int slaDays) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(RequestCategory.builder()
                        .name(name)
                        .description(description)
                        .defaultPriority(priority)
                        .slaDays(slaDays)
                        .active(true)
                        .build()));
    }

    private record DemoHistory(RequestStatus oldStatus, RequestStatus newStatus, AppUser changedBy, String reason) {}
}
