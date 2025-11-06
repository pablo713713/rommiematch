import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../core/services/messages.service';
import { AuthService } from '../core/services/auth.service';
import { ListingsService } from '../core/services/listings.service';
import { Listing } from '../core/models/listing.model';

@Component({
  selector: 'app-student-message-compose',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h3 class="text-2xl font-semibold text-pastel-blue mb-4">Enviar propuesta</h3>

    <div *ngIf="!isStudent" class="text-red-600">
      Solo los estudiantes pueden enviar mensajes desde aquí.
    </div>

    <form *ngIf="isStudent"
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="bg-white rounded-2xl shadow p-6 max-w-xl border border-pastel-lilac">

      <div class="mb-4">
        <p class="text-sm text-gray-600">
          Para:
          <span class="font-semibold text-gray-800">{{ recipientName || ('Usuario #' + recipientId) }}</span>
        </p>
        <p *ngIf="initialListingTitle" class="text-xs text-pastel-blue mt-1">
          Conversación sobre: {{ initialListingTitle }}
        </p>
      </div>

      <!-- Solo mostramos el combo si NO venimos directamente de un listing -->
      <label class="flex flex-col mb-3" *ngIf="!hideListingSelect">
        <span class="text-gray-700 mb-1">Departamento (opcional)</span>
        <select formControlName="listingId"
                class="border border-pastel-blue rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-pastel-blue">
          <option [ngValue]="null">Sin departamento específico</option>
          <option *ngFor="let l of listings" [ngValue]="l.id">
            {{ l.title }} — &#36;{{ l.pricePerMonth }}/mes
          </option>
        </select>
      </label>

      <label class="flex flex-col">
        <span class="text-gray-700 mb-1">Mensaje</span>
        <textarea formControlName="content" rows="4"
                  placeholder="Hola, me gustaría hablar contigo sobre compartir departamento..."
                  class="border border-pastel-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pastel-blue"></textarea>
      </label>

      <div class="flex items-center gap-3 mt-4">
        <button type="submit"
                [disabled]="form.invalid || sending"
                class="bg-pastel-pink hover:bg-pastel-blue text-white font-semibold px-4 py-2 rounded-lg transition">
          Enviar
        </button>
        <button type="button"
                (click)="volver()"
                class="text-sm text-gray-600 hover:underline">
          Cancelar
        </button>
        <span *ngIf="sentOk" class="text-green-600 text-sm">✔ Enviado</span>
        <span *ngIf="error" class="text-red-600 text-sm">{{ error }}</span>
      </div>
    </form>
  `,
})
export default class StudentMessageComposePage {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messages = inject(MessagesService);
  private auth = inject(AuthService);
  private listingsSvc = inject(ListingsService);

  isStudent = false;
  recipientId!: number;
  recipientName?: string | null;

  initialListingId?: number | null;
  initialListingTitle?: string | null;

  // si venimos desde un listing (Contactar propietario) ocultamos el select
  hideListingSelect = false;

  listings: Listing[] = [];

  sending = false;
  sentOk = false;
  error?: string;

  form = this.fb.group({
    content: ['', Validators.required],
    listingId: [null as number | null],
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    this.isStudent = user?.role === 'STUDENT';

    const idParam = this.route.snapshot.paramMap.get('recipientId');
    this.recipientId = idParam ? Number(idParam) : 0;
    this.recipientName = this.route.snapshot.queryParamMap.get('name');

    const listingIdParam = this.route.snapshot.queryParamMap.get('listingId');
    this.initialListingId = listingIdParam ? Number(listingIdParam) : null;
    this.initialListingTitle = this.route.snapshot.queryParamMap.get('listingTitle');

    // flag para saber si venimos directamente de un listing
    const fromListingParam = this.route.snapshot.queryParamMap.get('fromListing');
    this.hideListingSelect = fromListingParam === 'true';

    if (this.initialListingId) {
      this.form.patchValue({ listingId: this.initialListingId });
    }

    if (!this.isStudent || !user || !this.recipientId) {
      this.error = 'No se puede enviar mensaje en este contexto';
    }

    // Solo cargamos lista de departamentos si vamos a mostrar el select
    if (!this.hideListingSelect) {
      this.listingsSvc.getAll().subscribe({
        next: (ls) => { this.listings = ls; },
        error: () => { /* si falla, simplemente no mostramos opciones */ }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid || !this.isStudent) return;
    const user = this.auth.currentUser();
    if (!user) return;

    this.sending = true;
    this.sentOk = false;
    this.error = undefined;

    const listingId = this.form.value.listingId ?? null;

    this.messages.send({
      senderId: user.id,
      recipientId: this.recipientId,
      content: this.form.value.content || '',
      listingId: listingId || undefined,
    }).subscribe({
      next: () => {
        this.sending = false;
        this.sentOk = true;
        this.router.navigate(['/students/messages']);
      },
      error: () => {
        this.sending = false;
        this.error = 'No se pudo enviar el mensaje';
      }
    });
  }

  volver() {
    // si vienes de responder o de un listing, tiene sentido volver al inbox
    this.router.navigate(['/students/messages']);
  }
}
