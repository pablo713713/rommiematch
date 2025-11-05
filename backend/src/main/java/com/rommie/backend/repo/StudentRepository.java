package com.rommie.backend.repo;

import com.rommie.backend.domain.user.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByMajorIgnoreCase(String major);
    List<Student> findByFullNameContainingIgnoreCase(String name);
}
