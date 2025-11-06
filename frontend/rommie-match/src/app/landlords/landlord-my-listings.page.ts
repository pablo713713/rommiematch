import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListingsService } from '../core/services/listings.service';
import { AuthService } from '../core/services/auth.service';
import { Listing } from '../core/models/listing.model';

@Component({
  selector: 'app-landlord-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink], // 👈 necesario
  template: `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-2xl font-semibold text-pastel-blue">Mis departamentos</h3>
      <a routerLink="/landlords/new"
         class="bg-pastel-pink hover:bg-pastel-blue text-white font-semibold px-4 py-2 rounded-lg transition">
        + Nuevo
      </a>
    </div>

    <div *ngIf="!isLandlord" class="text-red-600">
      Debes iniciar sesión como LANDLORD para ver esta sección.
    </div>

    <div *ngIf="loading" class="text-gray-600">Cargando...</div>
    <div *ngIf="error" class="text-red-600">{{ error }}</div>

    <div *ngIf="!loading && !error && myListings.length === 0" class="text-gray-600">
      Aún no tienes departamentos publicados.
    </div>

    <div *ngIf="!loading && !error" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div *ngFor="let l of myListings"
           class="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border border-pastel-lilac">
        <div class="h-40 bg-pastel-cream flex items-center justify-center text-gray-400 text-sm">
          <span *ngIf="!l.photoUrl">Sin foto</span>
          <img *ngIf="l.photoUrl" [src]="l.photoUrl" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between">
            <h4 class="text-lg font-semibold text-gray-800">{{ l.title }}</h4>
            <span class="bg-pastel-pink text-white px-2 py-1 rounded-md text-sm">
              &#36;{{ l.pricePerMonth }}/mes
            </span>
          </div>
          <div class="text-sm text-gray-600 mt-1">{{ l.location || 'Ubicación no especificada' }}</div>
          <div class="flex gap-2 mt-3">
            <a [routerLink]="['/landlords/edit', l.id]"
               class="bg-pastel-blue text-white px-3 py-1.5 rounded-lg text-sm hover:bg-pastel-pink transition">
              Editar
            </a>
            <button (click)="deleteListing(l.id)"
                    class="bg-white border border-pastel-lilac text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-pastel-cream">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class LandlordMyListingsPage {
  private api = inject(ListingsService);
  private auth = inject(AuthService);

  loading = false;
  error?: string;
  myListings: Listing[] = [];

  isLandlord = false;
  meId: number | null = null;

  ngOnInit() {
    const user = this.auth.currentUser();
    this.isLandlord = user?.role === 'LANDLORD';
    this.meId = user?.id ?? null;

    if (!this.isLandlord || !this.meId) return;

    this.load();
  }

  load() {
    this.loading = true;
    this.api.getAll().subscribe({
      next: (all) => {
        this.myListings = (all || []).filter((l) => l.landlord?.id === this.meId);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar';
        this.loading = false;
      },
    });
  }

  deleteListing(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este departamento?')) return;
    this.api.delete(id).subscribe({
      next: () => {
        this.myListings = this.myListings.filter((l) => l.id !== id);
      },
      error: () => alert('No se pudo eliminar'),
    });
  }
}
