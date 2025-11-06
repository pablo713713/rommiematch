import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../core/services/messages.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-landlord-message-compose',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h3 class="text-2xl font-semibold text-pastel-blue mb-4">Responder mensaje</h3>

    <div *ngIf="!isLandlord" class="text-red-600">
      Solo los propietarios pueden responder desde aquí.
    </div>

    <form *ngIf="isLandlord"
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="bg-white rounded-2xl shadow p-6 max-w-xl border border-pastel-lilac">

      <div class="mb-4">
        <p class="text-sm text-gray-600">
          Para:
          <span class="font-semibold text-gray-800">{{ recipientName || ('Usuario #' + recipientId) }}</span>
        </p>
        <p *ngIf="listingTitle" class="text-xs text-pastel-blue mt-1">
          Sobre: {{ listingTitle }}
        </p>
      </div>

      <label class="flex flex-col">
        <span class="text-gray-700 mb-1">Mensaje</span>
        <textarea formControlName="content" rows="4"
                  placeholder="Hola, gracias por tu interés..."
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
export default class LandlordMessageComposePage {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messages = inject(MessagesService);
  private auth = inject(AuthService);

  isLandlord = false;
  recipientId!: number;
  recipientName?: string | null;
  listingId?: number | null;
  listingTitle?: string | null;

  sending = false;
  sentOk = false;
  error?: string;

  form = this.fb.group({
    content: ['', Validators.required],
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    this.isLandlord = user?.role === 'LANDLORD';

    const idParam = this.route.snapshot.paramMap.get('recipientId');
    this.recipientId = idParam ? Number(idParam) : 0;
    this.recipientName = this.route.snapshot.queryParamMap.get('name');

    const listingIdParam = this.route.snapshot.queryParamMap.get('listingId');
    this.listingId = listingIdParam ? Number(listingIdParam) : null;
    this.listingTitle = this.route.snapshot.queryParamMap.get('listingTitle');

    if (!this.isLandlord || !user || !this.recipientId) {
      this.error = 'No se puede enviar mensaje en este contexto';
    }
  }

  onSubmit() {
    if (this.form.invalid || !this.isLandlord) return;
    const user = this.auth.currentUser();
    if (!user) return;

    this.sending = true;
    this.sentOk = false;
    this.error = undefined;

    this.messages.send({
      senderId: user.id,
      recipientId: this.recipientId,
      content: this.form.value.content || '',
      listingId: this.listingId || undefined,
    }).subscribe({
      next: () => {
        this.sending = false;
        this.sentOk = true;
        this.router.navigate(['/landlords/messages']);
      },
      error: () => {
        this.sending = false;
        this.error = 'No se pudo enviar el mensaje';
      }
    });
  }

  volver() {
    this.router.navigate(['/landlords/messages']);
  }
}
