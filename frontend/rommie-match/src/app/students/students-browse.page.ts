import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../core/services/students.service';
import { AuthService } from '../core/services/auth.service';
import { Student } from '../core/models/student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students-browse',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-2xl font-semibold text-pastel-blue">Otros estudiantes</h3>
    </div>

    <div *ngIf="loading" class="text-gray-600">Cargando...</div>
    <div *ngIf="error" class="text-red-600">{{ error }}</div>

    <div *ngIf="!loading && !error && others.length === 0" class="text-gray-600">
      No hay otros estudiantes.
    </div>

    <div *ngIf="!loading && !error" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div *ngFor="let s of others"
           class="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 border border-pastel-lilac">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-pastel-pink/30 flex items-center justify-center text-pastel-pink font-semibold">
            {{ (s.fullName || s.email).slice(0,1).toUpperCase() }}
          </div>
          <div>
            <div class="font-medium text-gray-800">{{ s.fullName || 'Sin nombre' }}</div>
            <div class="text-sm text-gray-500">{{ s.email }}</div>
          </div>
        </div>
        <div class="mt-3 text-sm text-gray-700">
          <div *ngIf="s.major"><span class="font-medium">Carrera:</span> {{ s.major }}</div>
          <div *ngIf="s.preferredLocation"><span class="font-medium">Zona:</span> {{ s.preferredLocation }}</div>
          <div *ngIf="s.budgetMin || s.budgetMax">
            <span class="font-medium">Presupuesto:</span>
            &#36;{{ s.budgetMin || '—' }} – &#36;{{ s.budgetMax || '—' }}/mes
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            (click)="enviarPropuesta(s)"
            class="bg-pastel-pink hover:bg-pastel-blue text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition">
            Enviar propuesta
          </button>
        </div>
      </div>
    </div>
  `,
})
export default class StudentsBrowsePage {
  private api = inject(StudentsService);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error?: string;
  others: Student[] = [];

  ngOnInit() {
    const me = this.auth.currentUser();
    const myId = me?.id ?? null;

    this.loading = true;
    this.api.getAll().subscribe({
      next: (students) => {
        this.others = (students || []).filter(s => s.id !== myId);
        this.loading = false;
      },
      error: () => { this.error = 'No se pudo cargar'; this.loading = false; }
    });
  }

  enviarPropuesta(s: Student) {
    this.router.navigate(
      ['/students/messages/compose', s.id],
      {
        queryParams: {
          name: s.fullName || s.email
        }
      }
    );
  }
}
