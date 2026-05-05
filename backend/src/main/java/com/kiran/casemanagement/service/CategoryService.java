package com.kiran.casemanagement.service;

import com.kiran.casemanagement.dto.CategoryDto;
import com.kiran.casemanagement.dto.CreateCategoryDto;
import com.kiran.casemanagement.entity.RequestCategory;
import com.kiran.casemanagement.enums.AuditAction;
import com.kiran.casemanagement.enums.Priority;
import com.kiran.casemanagement.exception.ResourceNotFoundException;
import com.kiran.casemanagement.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByActiveTrue().stream().map(this::toDto).toList();
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public CategoryDto createCategory(CreateCategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Category already exists: " + dto.getName());
        }
        RequestCategory cat = RequestCategory.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .defaultPriority(Priority.valueOf(dto.getDefaultPriority()))
                .slaDays(dto.getSlaDays())
                .active(true)
                .build();
        cat = categoryRepository.save(cat);
        auditLogService.log("RequestCategory", cat.getId(), AuditAction.CATEGORY_CREATED, null, null, cat.getName());
        return toDto(cat);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CreateCategoryDto dto) {
        RequestCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        String oldName = cat.getName();
        cat.setName(dto.getName());
        cat.setDescription(dto.getDescription());
        cat.setDefaultPriority(Priority.valueOf(dto.getDefaultPriority()));
        cat.setSlaDays(dto.getSlaDays());
        cat = categoryRepository.save(cat);
        auditLogService.log("RequestCategory", id, AuditAction.CATEGORY_UPDATED, null, oldName, cat.getName());
        return toDto(cat);
    }

    @Transactional
    public void deactivateCategory(Long id) {
        RequestCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        cat.setActive(false);
        categoryRepository.save(cat);
        auditLogService.log("RequestCategory", id, AuditAction.CATEGORY_DEACTIVATED, null, "active", "inactive");
    }

    private CategoryDto toDto(RequestCategory cat) {
        return CategoryDto.builder()
                .id(cat.getId())
                .name(cat.getName())
                .description(cat.getDescription())
                .defaultPriority(cat.getDefaultPriority().name())
                .slaDays(cat.getSlaDays())
                .active(cat.isActive())
                .createdAt(cat.getCreatedAt() != null ? cat.getCreatedAt().toString() : null)
                .updatedAt(cat.getUpdatedAt() != null ? cat.getUpdatedAt().toString() : null)
                .build();
    }
}
