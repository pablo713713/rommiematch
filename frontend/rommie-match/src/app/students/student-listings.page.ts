import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingsService } from '../core/services/listings.service';
import { StudentsService } from '../core/services/students.service';
import { AuthService } from '../core/services/auth.service';
import { Listing } from '../core/models/listing.model';
import { Student } from '../core/models/student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4">
      <h3 class="text-2xl font-semibold text-pastel-blue">Departamentos</h3>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input [(ngModel)]="q" placeholder="Buscar por ubicación..."
               class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        <button (click)="doSearch()"
                class="bg-pastel-blue hover:bg-pastel-pink text-white px-3 py-2 rounded-lg transition">
          Buscar
        </button>

        <input type="number" [(ngModel)]="maxPrice" placeholder="Precio máx."
               class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue w-40 ml-2" />
        <button (click)="doFilterPrice()"
                class="bg-pastel-pink hover:bg-pastel-blue text-white px-3 py-2 rounded-lg transition">
          Filtrar
        </button>

        <button (click)="applyMyPreferences()"
                class="ml-2 bg-white border border-pastel-lilac px-3 py-2 rounded-lg hover:bg-pastel-cream text-sm">
          Usar mis preferencias
        </button>

        <button (click)="resetFilters()"
                class="ml-auto bg-white border border-pastel-lilac px-3 py-2 rounded-lg hover:bg-pastel-cream">
          Limpiar
        </button>
      </div>

      <p *ngIf="studentInfo" class="mt-2 text-xs text-gray-500">
        Mis preferencias:
        <span *ngIf="studentInfo.preferredLocation">
          zona {{ studentInfo.preferredLocation }};
        </span>
        <span *ngIf="studentInfo.budgetMin || studentInfo.budgetMax">
          presupuesto &#36;{{ studentInfo.budgetMin || '—' }} – &#36;{{ studentInfo.budgetMax || '—' }}/mes
        </span>
      </p>
    </div>

    <p *ngIf="loading" class="text-gray-600">Cargando...</p>
    <p *ngIf="error" class="text-red-600">{{ error }}</p>
    <p *ngIf="!loading && !error && filteredListings.length === 0" class="text-gray-600">No hay resultados</p>

    <div *ngIf="!loading && !error" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div *ngFor="let l of filteredListings"
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
          <div class="text-xs text-gray-500 mt-1" *ngIf="l.landlord">
            Propietario: {{ l.landlord.displayName || l.landlord.fullName || ('ID ' + l.landlord.id) }}
          </div>
          <div class="text-xs text-gray-500 mt-1" *ngIf="l.availableFrom">
            Disponible desde: {{ l.availableFrom }}
          </div>

          <div class="mt-3 flex justify-end" *ngIf="l.landlord">
            <button
              (click)="contactarLandlord(l)"
              class="bg-pastel-pink hover:bg-pastel-blue text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
              Contactar propietario
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class StudentListingsPage {
  private api = inject(ListingsService);
  private studentsSvc = inject(StudentsService);
  private auth = inject(AuthService);
  private router = inject(Router);

  listings: Listing[] = [];
  filteredListings: Listing[] = [];

  loading = false;
  error?: string;

  q = '';
  maxPrice?: number;

  studentInfo?: Student | null;

  ngOnInit() {
    this.loadAll();
    this.loadStudentInfo();
  }

  loadAll() {
    this.loading = true;
    this.api.getAll().subscribe({
      next: (data) => {
        this.listings = data;
        this.filteredListings = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar';
        this.loading = false;
      },
    });
  }

  loadStudentInfo() {
    const user = this.auth.currentUser();
    if (!user || user.role !== 'STUDENT') {
      this.studentInfo = null;
      return;
    }
    this.studentsSvc.getById(user.id).subscribe({
      next: (s) => (this.studentInfo = s),
      error: () => (this.studentInfo = null),
    });
  }

  doSearch() {
    if (!this.q?.trim()) {
      this.applyFilters();
      return;
    }
    this.q = this.q.trim().toLowerCase();
    this.applyFilters();
  }

  doFilterPrice() {
    this.applyFilters();
  }

  applyMyPreferences() {
    if (!this.studentInfo) return;
    if (this.studentInfo.preferredLocation) {
      this.q = this.studentInfo.preferredLocation;
    }
    if (this.studentInfo.budgetMax != null) {
      this.maxPrice = this.studentInfo.budgetMax;
    }
    this.applyFilters();
  }

  resetFilters() {
    this.q = '';
    this.maxPrice = undefined;
    this.filteredListings = this.listings.slice();
  }

  private applyFilters() {
    let result = this.listings.slice();

    if (this.q?.trim()) {
      const qLower = this.q.trim().toLowerCase();
      result = result.filter((l) =>
        (l.location || '').toLowerCase().includes(qLower) ||
        (l.title || '').toLowerCase().includes(qLower)
      );
    }

    if (this.maxPrice != null) {
      result = result.filter((l) =>
        (l.pricePerMonth ?? Infinity) <= this.maxPrice!
      );
    }

    this.filteredListings = result;
  }

  contactarLandlord(l: Listing) {
    if (!l.landlord || !l.landlord.id) return;
    this.router.navigate(
      ['/students/messages/compose', l.landlord.id],
      {
        queryParams: {
          name: l.landlord.displayName
            || l.landlord.fullName
            || ('Propietario #' + l.landlord.id),
          listingId: l.id,
          listingTitle: l.title ?? '',
          fromListing: 'true'
        }
      }
    );
  }

}
