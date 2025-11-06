import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { LandlordsService } from '../core/services/landlords.service';
import { Landlord } from '../core/models/landlord.model';

@Component({
  selector: 'app-landlord-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h3 class="text-2xl font-semibold text-pastel-blue mb-4">Mi perfil</h3>

    <form [formGroup]="form" (ngSubmit)="onSave()"
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
          <span class="text-gray-700">Nombre público</span>
          <input formControlName="displayName"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>

        <label class="flex flex-col">
          <span class="text-gray-700">Foto (URL)</span>
          <input formControlName="photoUrl"
                 class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue" />
        </label>
      </div>

      <div class="flex items-center gap-3 mt-4">
        <button type="submit"
                [disabled]="form.invalid || saving"
                class="bg-pastel-pink hover:bg-pastel-blue text-white font-semibold px-4 py-2 rounded-lg transition">
          Guardar
        </button>
        <span *ngIf="savedOk" class="text-green-600">✔ Guardado</span>
        <span *ngIf="error" class="text-red-600">{{ error }}</span>
      </div>
    </form>
  `,
})
export default class LandlordProfilePage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private landlords = inject(LandlordsService);

  isLandlord = false;
  meId: number | null = null;

  saving = false;
  savedOk = false;
  error?: string;

  // controles permiten null (para evitar TS2322); luego convertimos a undefined al guardar
  form = this.fb.group({
    fullName: ['' as string | null, Validators.required],
    email: ['' as string | null, [Validators.required, Validators.email]],
    displayName: ['' as string | null],
    photoUrl: ['' as string | null],
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    this.isLandlord = user?.role === 'LANDLORD';
    this.meId = user?.id ?? null;

    if (!this.isLandlord || !this.meId) return;

    this.landlords.getById(this.meId).subscribe({
      next: (l: Landlord) => {
        this.form.patchValue({
          fullName: l.fullName ?? '',
          email: l.email ?? '',
          displayName: l.displayName ?? '',
          photoUrl: l.photoUrl ?? '',
        });
      },
      error: () => this.error = 'No se pudo cargar tu perfil',
    });
  }

  onSave() {
    if (!this.isLandlord || !this.meId || this.form.invalid) return;

    const v = this.form.value;
    const payload: Partial<Landlord> = {
      fullName: v.fullName ?? undefined,
      email: v.email ?? undefined,
      displayName: v.displayName ?? undefined,
      photoUrl: v.photoUrl ?? undefined,
      // password no se edita aquí
    };

    this.saving = true; this.savedOk = false; this.error = undefined;

    this.landlords.update(this.meId, payload).subscribe({
      next: () => { this.saving = false; this.savedOk = true; },
      error: () => { this.saving = false; this.error = 'Error guardando cambios'; }
    });
  }
}
