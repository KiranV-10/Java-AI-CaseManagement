package com.kiran.casemanagement.service;

import com.kiran.casemanagement.dto.CategoryDto;
import com.kiran.casemanagement.dto.CreateCategoryDto;
import com.kiran.casemanagement.entity.RequestCategory;
import com.kiran.casemanagement.enums.Priority;
import com.kiran.casemanagement.exception.ResourceNotFoundException;
import com.kiran.casemanagement.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private AuditLogService auditLogService;
    @InjectMocks private CategoryService categoryService;

    @Test
    void getActiveCategories() {
        RequestCategory cat = buildCategory(1L, "Test", true);
        when(categoryRepository.findByActiveTrue()).thenReturn(List.of(cat));

        List<CategoryDto> result = categoryService.getActiveCategories();
        assertEquals(1, result.size());
        assertEquals("Test", result.get(0).getName());
    }

    @Test
    void createCategory_duplicate() {
        when(categoryRepository.existsByName("Test")).thenReturn(true);
        CreateCategoryDto dto = new CreateCategoryDto("Test", "desc", "MEDIUM", 7);
        assertThrows(IllegalArgumentException.class, () -> categoryService.createCategory(dto));
    }

    @Test
    void deactivateCategory_notFound() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.deactivateCategory(99L));
    }

    @Test
    void deactivateCategory_setsInactive() {
        RequestCategory cat = buildCategory(1L, "Test", true);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(cat));
        when(categoryRepository.save(any())).thenReturn(cat);

        categoryService.deactivateCategory(1L);
        assertFalse(cat.isActive());
    }

    private RequestCategory buildCategory(Long id, String name, boolean active) {
        RequestCategory cat = new RequestCategory();
        cat.setId(id);
        cat.setName(name);
        cat.setDefaultPriority(Priority.MEDIUM);
        cat.setSlaDays(7);
        cat.setActive(active);
        cat.setCreatedAt(LocalDateTime.now());
        cat.setUpdatedAt(LocalDateTime.now());
        return cat;
    }
}
