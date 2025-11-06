import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Bienvenido Administrador</h2>
    <p>Esta será la vista principal para administradores.</p>
  `,
})
export default class AdminHomePage {}
