import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StudentsService } from '../core/services/students.service';
import { AuthService } from '../core/services/auth.service';
import { Student } from '../core/models/student.model';

@Component({
  selector: 'app-student-me',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h3 class="text-2xl font-semibold text-pastel-blue mb-4">Mi perfil</h3>

    <p *ngIf="!isStudent" class="text-red-600">
      Tu rol no es STUDENT. Inicia sesión como estudiante para ver esta sección.
    </p>

    <form *ngIf="isStudent"
          [formGroup]="form"
          (ngSubmit)="onSave()"
          class="bg-white rounded-2xl shadow p-6 max-w-2xl border border-pastel-lilac">
      <div class="grid sm:grid-cols-2 gap-4">
        <label class="flex flex-col">
          <span class="text-gray-700">Nombre completo</span>
          <input formControlName="fullName"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Email</span>
          <input type="email" formControlName="email"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-pink" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Foto (URL)</span>
          <input formControlName="photoUrl"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Carrera (major)</span>
          <input formControlName="major"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Edad</span>
          <input type="number" formControlName="age"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Zona preferida</span>
          <input formControlName="preferredLocation"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="sm:col-span-2 flex flex-col">
          <span class="text-gray-700">Bio</span>
          <textarea rows="3" formControlName="bio"
                    class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue"></textarea>
        </label>

        <label class="sm:col-span-2 flex flex-col">
          <span class="text-gray-700">Hobbies (comas)</span>
          <input formControlName="hobbiesCsv"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>
      </div>

      <div class="flex items-center gap-3 mt-4">
        <button type="submit"
                [disabled]="form.invalid || saving"
                class="bg-pastel-pink hover:bg-pastel-blue text-white font-semibold px-4 py-2 rounded-lg transition">
          Guardar
        </button>
        <span *ngIf="saving">Guardando...</span>
        <span *ngIf="savedOk" class="text-green-600">✔ Guardado</span>
        <span *ngIf="error" class="text-red-600">{{ error }}</span>
      </div>
    </form>
  `,
})
export default class StudentMePage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private students = inject(StudentsService);

  isStudent = false;
  meId: number | null = null;

  saving = false;
  savedOk = false;
  error?: string;

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    photoUrl: [''],
    major: [''],
    age: [null as number | null],
    bio: [''],
    budgetMin: [null as number | null],
    budgetMax: [null as number | null],
    preferredLocation: [''],
    hobbiesCsv: [''], // binding CSV -> array y viceversa
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    this.isStudent = user?.role === 'STUDENT';
    this.meId = user?.id ?? null;

    if (!this.isStudent || !this.meId) return;

    this.students.getById(this.meId).subscribe({
      next: (s: Student) => {
        // Pre-carga del formulario (CSV hobbies)
        this.form.patchValue({
          fullName: s.fullName ?? '',
          email: s.email ?? '',
          photoUrl: s.photoUrl ?? '',
          major: s.major ?? '',
          age: s.age ?? null,
          bio: s.bio ?? '',
          budgetMin: s.budgetMin ?? null,
          budgetMax: s.budgetMax ?? null,
          preferredLocation: s.preferredLocation ?? '',
          hobbiesCsv: (s.hobbies ?? []).join(', '),
        });
      },
      error: () => this.error = 'No se pudo cargar tu perfil',
    });
  }

  onSave() {
    if (!this.isStudent || !this.meId || this.form.invalid) return;

    const v = this.form.value;
    const payload: Partial<Student> = {
      fullName: v.fullName ?? '',
      email: v.email ?? '',
      photoUrl: v.photoUrl ?? '',
      major: v.major ?? '',
      age: v.age ?? undefined,
      bio: v.bio ?? '',
      budgetMin: v.budgetMin ?? undefined,
      budgetMax: v.budgetMax ?? undefined,
      preferredLocation: v.preferredLocation ?? '',
      hobbies: (v.hobbiesCsv ?? '')
        .split(',')
        .map(x => x.trim())
        .filter(x => !!x),
      // password no se edita aquí (si quieres, hacemos otro flujo)
    };

    this.saving = true;
    this.savedOk = false;
    this.error = undefined;

    this.students.update(this.meId, payload).subscribe({
      next: () => { this.saving = false; this.savedOk = true; },
      error: () => { this.saving = false; this.error = 'Error guardando cambios'; }
    });
  }
}
