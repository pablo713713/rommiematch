import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div>
      <p class="mb-4 text-gray-800 text-lg">Bienvenido Estudiante</p>

      <nav class="flex gap-4 mb-6 text-sm">
        <a routerLink="browse" routerLinkActive="font-semibold underline" class="hover:underline">
          Otros estudiantes
        </a>
        <a routerLink="listings" routerLinkActive="font-semibold underline" class="hover:underline">
          Departamentos
        </a>
        <a routerLink="me" routerLinkActive="font-semibold underline" class="hover:underline">
          Mi perfil
        </a>
        <a routerLink="messages" routerLinkActive="font-semibold underline" class="hover:underline">
          Mensajes
        </a>
      </nav>

      <router-outlet></router-outlet>
    </div>
  `,
})
export default class StudentHomePage {}
