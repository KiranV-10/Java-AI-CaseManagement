package com.kiran.casemanagement.repository;

import com.kiran.casemanagement.entity.RequestCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<RequestCategory, Long> {
    List<RequestCategory> findByActiveTrue();
    Optional<RequestCategory> findByName(String name);
    boolean existsByName(String name);
}
