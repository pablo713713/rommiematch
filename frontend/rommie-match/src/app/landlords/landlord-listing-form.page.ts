
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ListingsService } from '../core/services/listings.service';
import { AuthService } from '../core/services/auth.service';
import { Listing } from '../core/models/listing.model';

@Component({
  selector: 'app-landlord-listing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // 👈 necesario para routerLink
  template: `
    <h3 class="text-2xl font-semibold text-pastel-blue mb-4">
      {{ editing ? 'Editar departamento' : 'Nuevo departamento' }}
    </h3>

    <form [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="bg-white rounded-2xl shadow p-6 max-w-2xl border border-pastel-lilac">

      <div class="grid sm:grid-cols-2 gap-4">
        <label class="flex flex-col">
          <span class="text-gray-700">Título</span>
          <input formControlName="title"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Ubicación</span>
          <input formControlName="location"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Precio (USD)</span>
          <input type="number" formControlName="pricePerMonth"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Foto (URL)</span>
          <input formControlName="photoUrl"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col sm:col-span-2">
          <span class="text-gray-700">Comodidades (amenities)</span>
          <textarea formControlName="amenities" rows="2"
                    class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue"></textarea>
        </label>

        <label class="flex flex-col sm:col-span-2">
          <span class="text-gray-700">Reglas</span>
          <textarea formControlName="rules" rows="2"
                    class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue"></textarea>
        </label>

        <label class="flex flex-col sm:col-span-2">
          <span class="text-gray-700">Disponible desde</span>
          <input type="date" formControlName="availableFrom"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>
      </div>

      <div class="flex items-center gap-3 mt-4">
        <button type="submit"
                [disabled]="form.invalid || saving"
                class="bg-pastel-pink hover:bg-pastel-blue text-white font-semibold px-4 py-2 rounded-lg transition">
          {{ editing ? 'Guardar cambios' : 'Publicar' }}
        </button>
        <a routerLink="/landlords/my-listings"
           class="text-sm text-gray-600 hover:underline">Cancelar</a>
      </div>

      <p *ngIf="error" class="text-red-600 mt-2">{{ error }}</p>
      <p *ngIf="savedOk" class="text-green-600 mt-2">✔ Guardado correctamente</p>
    </form>
  `,
})
export default class LandlordListingFormPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private listings = inject(ListingsService);
  private auth = inject(AuthService);

  form = this.fb.group({
    title: ['' as string | null, Validators.required],
    location: ['' as string | null],
    pricePerMonth: [null as number | null, Validators.required],
    photoUrl: ['' as string | null],
    amenities: ['' as string | null],
    rules: ['' as string | null],
    availableFrom: ['' as string | null],
  });

  editing = false;
  idToEdit?: number;
  saving = false;
  savedOk = false;
  error?: string;

  ngOnInit() {
    this.idToEdit = Number(this.route.snapshot.paramMap.get('id'));
    this.editing = !!this.idToEdit;

    if (this.editing) {
      this.listings.getById(this.idToEdit).subscribe({
        next: (l: Listing) =>
          this.form.patchValue({
            title: l.title ?? '',
            location: l.location ?? '',
            pricePerMonth: l.pricePerMonth ?? null,
            photoUrl: l.photoUrl ?? '',
            amenities: l.amenities ?? '',
            rules: l.rules ?? '',
            availableFrom: l.availableFrom ? l.availableFrom.substring(0, 10) : '',
          }),
        error: () => (this.error = 'No se pudo cargar el registro'),
      });
    }
  }

  // wrapper para el (ngSubmit)
  onSubmit() {
    this.onSave();
  }

  onSave() {
    if (this.form.invalid) return;

    const user = this.auth.currentUser();
    if (!user || user.role !== 'LANDLORD') {
      this.error = 'Solo los propietarios pueden publicar';
      return;
    }

    const v = this.form.value;
    const data: Partial<Listing> = {
      title: v.title ?? undefined,
      location: v.location ?? undefined,
      pricePerMonth: v.pricePerMonth ?? undefined,
      photoUrl: v.photoUrl ?? undefined,
      amenities: v.amenities ?? undefined,
      rules: v.rules ?? undefined,
      availableFrom: v.availableFrom ?? undefined,
      landlord: { id: user.id },
    };

    this.saving = true;
    this.savedOk = false;
    this.error = undefined;

    const obs =
      this.editing && this.idToEdit
        ? this.listings.update(this.idToEdit, data)
        : this.listings.create(data);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.savedOk = true;
        this.router.navigate(['/landlords/my-listings']);
      },
      error: () => {
        this.saving = false;
        this.error = 'Error guardando';
      },
    });
  }

  cancel() {
    this.router.navigate(['/landlords/my-listings']);
  }
}
