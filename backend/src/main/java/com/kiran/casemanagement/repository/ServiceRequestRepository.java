package com.kiran.casemanagement.repository;

import com.kiran.casemanagement.entity.ServiceRequest;
import com.kiran.casemanagement.enums.Priority;
import com.kiran.casemanagement.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    @Query("SELECT sr FROM ServiceRequest sr WHERE " +
           "(:status IS NULL OR sr.status = :status) AND " +
           "(:categoryId IS NULL OR sr.category.id = :categoryId) AND " +
           "(:priority IS NULL OR sr.priority = :priority) AND " +
           "(:assignedToId IS NULL OR sr.assignedTo.id = :assignedToId) AND " +
           "(:keywordPattern IS NULL OR LOWER(sr.title) LIKE :keywordPattern " +
           "OR LOWER(sr.description) LIKE :keywordPattern) AND " +
           "(:fromDate IS NULL OR sr.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR sr.createdAt <= :toDate)")
    Page<ServiceRequest> findWithFilters(
            @Param("status") RequestStatus status,
            @Param("categoryId") Long categoryId,
            @Param("priority") Priority priority,
            @Param("assignedToId") Long assignedToId,
            @Param("keywordPattern") String keywordPattern,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    long countByStatus(RequestStatus status);

    long countByPriority(Priority priority);

    long countByStatusAndPriority(RequestStatus status, Priority priority);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.resolvedAt >= :since")
    long countResolvedSince(@Param("since") LocalDateTime since);

    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 86400) " +
                   "FROM service_requests WHERE resolved_at IS NOT NULL", nativeQuery = true)
    Double averageResolutionDays();

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.status NOT IN " +
           "(com.kiran.casemanagement.enums.RequestStatus.RESOLVED, com.kiran.casemanagement.enums.RequestStatus.CLOSED) " +
           "AND sr.createdAt < :cutoff")
    long countAgingRequests(@Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(sr.requestNumber, 10) AS int)), 0) FROM ServiceRequest sr " +
           "WHERE sr.requestNumber LIKE :prefix")
    int findMaxRequestNumberForPrefix(@Param("prefix") String prefix);
}
