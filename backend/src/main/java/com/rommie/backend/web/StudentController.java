package com.rommie.backend.web;

import com.rommie.backend.domain.user.Student;
import com.rommie.backend.repo.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    private final StudentRepository repo;

    public StudentController(StudentRepository repo) {
        this.repo = repo;
    }

    // Listar todos
    @GetMapping
    public List<Student> all() {
        return repo.findAll();
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public Student one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    // Crear nuevo
    @PostMapping
    public Student create(@Valid @RequestBody Student s) {
        return repo.save(s);
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student s) {
        Student current = repo.findById(id).orElseThrow();

        current.setFullName(s.getFullName());
        current.setEmail(s.getEmail());
        // current.setPassword(s.getPassword());

        current.setPhotoUrl(s.getPhotoUrl());
        current.setMajor(s.getMajor());
        current.setAge(s.getAge());
        current.setBio(s.getBio());
        current.setHobbies(s.getHobbies());
        current.setPreferredLocation(s.getPreferredLocation());
        current.setBudgetMin(s.getBudgetMin());
        current.setBudgetMax(s.getBudgetMax());

        return repo.save(current);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
