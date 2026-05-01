package com.kiran.casemanagement.repository;

import com.kiran.casemanagement.entity.CaseNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CaseNoteRepository extends JpaRepository<CaseNote, Long> {
    List<CaseNote> findByRequestIdOrderByCreatedAtDesc(Long requestId);
    List<CaseNote> findByRequestIdAndInternalOnlyFalseOrderByCreatedAtDesc(Long requestId);
}
