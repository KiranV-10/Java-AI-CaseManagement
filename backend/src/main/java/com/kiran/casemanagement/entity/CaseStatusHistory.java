package com.kiran.casemanagement.entity;

import com.kiran.casemanagement.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "case_status_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CaseStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    @Enumerated(EnumType.STRING)
    private RequestStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus newStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_id", nullable = false)
    private AppUser changedBy;

    private String changeReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
