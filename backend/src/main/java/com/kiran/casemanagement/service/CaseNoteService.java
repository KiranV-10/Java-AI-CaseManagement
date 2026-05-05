package com.kiran.casemanagement.service;

import com.kiran.casemanagement.dto.AddNoteDto;
import com.kiran.casemanagement.dto.CaseNoteDto;
import com.kiran.casemanagement.entity.AppUser;
import com.kiran.casemanagement.entity.CaseNote;
import com.kiran.casemanagement.entity.ServiceRequest;
import com.kiran.casemanagement.enums.AuditAction;
import com.kiran.casemanagement.exception.ResourceNotFoundException;
import com.kiran.casemanagement.repository.CaseNoteRepository;
import com.kiran.casemanagement.repository.ServiceRequestRepository;
import com.kiran.casemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseNoteService {

    private final CaseNoteRepository caseNoteRepository;
    private final ServiceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public CaseNoteDto addNote(Long requestId, AddNoteDto dto) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));
        AppUser author = userRepository.findById(dto.getAuthorUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getAuthorUserId()));

        CaseNote note = CaseNote.builder()
                .request(request)
                .author(author)
                .noteText(dto.getNoteText())
                .internalOnly(dto.isInternalOnly())
                .build();
        note = caseNoteRepository.save(note);

        auditLogService.log("ServiceRequest", requestId, AuditAction.NOTE_ADDED, author, null, dto.getNoteText());

        return toDto(note);
    }

    public List<CaseNoteDto> getNotes(Long requestId, boolean includeInternal) {
        List<CaseNote> notes = includeInternal
                ? caseNoteRepository.findByRequestIdOrderByCreatedAtDesc(requestId)
                : caseNoteRepository.findByRequestIdAndInternalOnlyFalseOrderByCreatedAtDesc(requestId);
        return notes.stream().map(this::toDto).toList();
    }

    private CaseNoteDto toDto(CaseNote note) {
        return CaseNoteDto.builder()
                .id(note.getId())
                .authorName(note.getAuthor().getFullName())
                .noteText(note.getNoteText())
                .internalOnly(note.isInternalOnly())
                .createdAt(note.getCreatedAt().toString())
                .build();
    }
}
