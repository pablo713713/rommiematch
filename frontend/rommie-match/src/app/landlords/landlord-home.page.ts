import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landlord-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <h2>Área Propietario</h2>

    <nav style="display:flex; gap:12px; margin:12px 0;">
      <a routerLink="my-listings" routerLinkActive="active">Mis departamentos</a>
      <a routerLink="new" routerLinkActive="active">Publicar</a>
      <a routerLink="profile" routerLinkActive="active">Mi perfil</a>
      <a routerLink="messages" routerLinkActive="font-semibold underline">Mensajes</a>
    </nav>

    <router-outlet></router-outlet>
  `,
  styles: [`.active { font-weight: 700; text-decoration: underline; }`]
})
export default class LandlordHomePage {}
