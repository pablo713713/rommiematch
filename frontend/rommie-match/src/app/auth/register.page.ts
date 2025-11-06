import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-pastel-cream">
      <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 class="text-3xl font-semibold text-pastel-blue text-center mb-6">
          Crear cuenta ✨
        </h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <label class="flex flex-col">
            <span class="text-gray-700">Nombre completo</span>
            <input
              formControlName="fullName"
              placeholder="Tu nombre"
              class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue"
            />
          </label>

          <label class="flex flex-col">
            <span class="text-gray-700">Email</span>
            <input
              formControlName="email"
              type="email"
              placeholder="tu@correo.com"
              class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            />
          </label>

          <label class="flex flex-col">
            <span class="text-gray-700">Contraseña</span>
            <input
              formControlName="password"
              type="password"
              placeholder="••••••••"
              class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            />
          </label>

          <label class="flex flex-col">
            <span class="text-gray-700">Rol</span>
            <select
              formControlName="role"
              class="border border-pastel-blue rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-pastel-blue"
            >
              <option value="STUDENT">Estudiante</option>
              <option value="LANDLORD">Propietario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <!-- Campos opcionales rápidos -->
          <div *ngIf="role() === 'LANDLORD'" class="flex flex-col gap-2">
            <label class="flex flex-col">
              <span class="text-gray-700">Nombre público (displayName)</span>
              <input
                formControlName="displayName"
                placeholder="Ej: Don Carlos"
                class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue"
              />
            </label>
          </div>

          <div *ngIf="role() === 'STUDENT'" class="grid grid-cols-1 gap-2">
            <label class="flex flex-col">
              <span class="text-gray-700">Carrera (major)</span>
              <input
                formControlName="major"
                placeholder="Ingeniería de Sistemas"
                class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue"
              />
            </label>
          </div>

          <button type="submit" class="bg-pastel-pink hover:bg-pastel-blue text-white font-semibold py-2 rounded-lg transition-colors mt-2">
            Registrarme
          </button>

          <p class="text-center text-gray-600 text-sm mt-4">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="text-pastel-blue font-medium hover:underline">
              Inicia sesión
            </a>
          </p>

          <p *ngIf="error" class="text-center text-red-600 text-sm">{{ error }}</p>
        </form>
      </div>
    </div>
  `,
})
export default class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error?: string;

  form = this.fb.group({
    fullName: ['' as string | null, Validators.required],
    email: ['' as string | null, [Validators.required, Validators.email]],
    password: ['' as string | null, Validators.required],
    role: ['STUDENT' as 'STUDENT' | 'LANDLORD' | 'ADMIN', Validators.required],
    // opcionales
    displayName: ['' as string | null],
    major: ['' as string | null],
  });

  role() {
    return this.form.value.role ?? 'STUDENT';
  }

  onSubmit() {
    console.log('onSubmit called', this.form.valid, this.form.value);
    if (this.form.invalid) { console.warn('form invalid'); return; }

    const v = this.form.value;
    const payload: any = {
      fullName: v.fullName ?? undefined,
      email: v.email ?? undefined,
      password: v.password ?? undefined,
      role: v.role ?? 'STUDENT',
    };
    if (v.role === 'LANDLORD') payload.displayName = v.displayName ?? undefined;
    if (v.role === 'STUDENT') payload.major = v.major ?? undefined;

    console.log('POST /api/auth/register payload:', payload);

    this.auth.register(payload).subscribe({
      next: (user) => {
        console.log('REGISTER OK ->', user);
        if (user.role === 'STUDENT') this.router.navigate(['/students']);
        else if (user.role === 'LANDLORD') this.router.navigate(['/landlords']);
        else this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('REGISTER ERROR', err);
        this.error = 'No se pudo registrar. Intenta de nuevo.';
      },
    });
  }

}
