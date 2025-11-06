import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="min-h-screen bg-pastel-cream flex flex-col">
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-pastel-lilac">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2">
            <span class="inline-block w-3 h-3 rounded-full bg-pastel-pink"></span>
            <span class="text-xl font-semibold text-pastel-pink">Rommie Match</span>
          </a>

          <nav class="flex items-center gap-4 text-sm">
            <a *ngIf="role() === 'STUDENT'" routerLink="/students" class="hover:underline">Estudiante</a>
            <a *ngIf="role() === 'LANDLORD'" routerLink="/landlords" class="hover:underline">Propietario</a>
            <a *ngIf="role() === 'ADMIN'" routerLink="/admin" class="hover:underline">Admin</a>
          </nav>

          <div class="flex items-center gap-3">
            <span class="text-gray-600" *ngIf="user() as u">
              {{ u.fullName }} · <span class="uppercase">{{ u.role }}</span>
            </span>
            <button (click)="logout()"
              class="bg-pastel-blue hover:bg-pastel-pink text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <!-- Contenido -->
      <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer simple -->
      <footer class="text-center text-xs text-gray-500 py-6">
        © {{ year }} Rommie Match
      </footer>
    </div>
  `,
})
export default class BaseLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.auth.currentUser());
  role = computed(() => this.auth.currentUser()?.role ?? 'STUDENT');
  year = new Date().getFullYear();

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
