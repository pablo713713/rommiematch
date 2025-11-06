import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from './core/services/students.service';
import { Student } from './core/models/student.model';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export default class App implements OnInit {
  title = 'Rommie Match';
  students: Student[] = [];
  loading = false;
  error?: string;

  constructor(private studentsSvc: StudentsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.studentsSvc.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
        console.log('Students:', data);
      },
      error: (err) => {
        this.error = 'Error cargando estudiantes';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
