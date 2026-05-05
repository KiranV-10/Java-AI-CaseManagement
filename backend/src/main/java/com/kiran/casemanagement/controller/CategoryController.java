package com.kiran.casemanagement.controller;

import com.kiran.casemanagement.dto.CategoryDto;
import com.kiran.casemanagement.dto.CreateCategoryDto;
import com.kiran.casemanagement.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/api/categories/active")
    @Operation(summary = "Get active categories")
    public ResponseEntity<List<CategoryDto>> getActiveCategories() {
        return ResponseEntity.ok(categoryService.getActiveCategories());
    }

    @GetMapping("/api/admin/categories")
    @Operation(summary = "Get all categories (admin)")
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/api/admin/categories")
    @Operation(summary = "Create a new category")
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CreateCategoryDto dto) {
        return ResponseEntity.ok(categoryService.createCategory(dto));
    }

    @PutMapping("/api/admin/categories/{id}")
    @Operation(summary = "Update a category")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id, @Valid @RequestBody CreateCategoryDto dto) {
        return ResponseEntity.ok(categoryService.updateCategory(id, dto));
    }

    @DeleteMapping("/api/admin/categories/{id}")
    @Operation(summary = "Deactivate a category")
    public ResponseEntity<Void> deactivateCategory(@PathVariable Long id) {
        categoryService.deactivateCategory(id);
        return ResponseEntity.noContent().build();
    }
}
