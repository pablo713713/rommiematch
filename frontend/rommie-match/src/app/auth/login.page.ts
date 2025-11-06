import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // 👈 necesario para routerLink
  template: `
    <div class="min-h-screen flex items-center justify-center bg-pastel-cream">
      <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 class="text-3xl font-semibold text-pastel-pink text-center mb-6">
          Inicia sesión
        </h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <label class="flex flex-col">
            <span class="text-gray-700">Email</span>
            <input
              formControlName="email"
              type="email"
              placeholder="tu@correo.com"
              class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue"
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

          <button
            type="submit"
            [disabled]="form.invalid"
            class="bg-pastel-pink hover:bg-pastel-blue text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Entrar
          </button>

          <p class="text-center text-gray-600 text-sm mt-4">
            ¿No tienes cuenta?
            <a routerLink="/register" class="text-pastel-blue font-medium hover:underline">
              Regístrate
            </a>
          </p>

          <p *ngIf="error" class="text-center text-red-600 text-sm mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  `,
})
export default class LoginPage {
  // Inyección estilo standalone
  private auth = inject(AuthService);
  private router = inject(Router);

  // Form reactivo
  form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  error?: string;

  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: (user) => {
        if (user.role === 'STUDENT') this.router.navigate(['/students']);
        else if (user.role === 'LANDLORD') this.router.navigate(['/landlords']);
        else this.router.navigate(['/admin']);
      },
      error: () => (this.error = 'Credenciales inválidas'),
    });
  }
}
