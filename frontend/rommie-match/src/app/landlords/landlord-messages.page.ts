import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesService } from '../core/services/messages.service';
import { AuthService } from '../core/services/auth.service';
import { Message } from '../core/models/message.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landlord-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="text-2xl font-semibold text-pastel-blue mb-4">Mensajes recibidos</h3>

    <p *ngIf="!isLandlord" class="text-red-600">
      Solo los propietarios tienen bandeja de entrada aquí.
    </p>

    <div *ngIf="isLandlord">
      <p *ngIf="loading" class="text-gray-600">Cargando...</p>
      <p *ngIf="error" class="text-red-600">{{ error }}</p>

      <p *ngIf="!loading && !error && messages.length === 0" class="text-gray-600">
        Aún no tienes mensajes.
      </p>

      <div *ngIf="!loading && !error" class="space-y-3">
        <div *ngFor="let m of messages"
             class="bg-white rounded-2xl shadow p-4 border border-pastel-lilac">
          <div class="flex justify-between items-start mb-1">
            <div>
              <div class="text-sm text-gray-500">De:</div>
              <div class="font-semibold text-gray-800">
                {{ m.senderName }} <span class="text-xs text-gray-500">({{ m.senderRole }})</span>
              </div>
            </div>
            <div class="text-xs text-gray-500">
              {{ m.createdAt | date:'short' }}
            </div>
          </div>

          <div *ngIf="m.listingTitle" class="text-xs text-pastel-blue mb-1">
            Sobre: {{ m.listingTitle }}
          </div>

          <p class="text-sm text-gray-700 whitespace-pre-line mb-2">
            {{ m.content }}
          </p>

          <div class="flex justify-end">
            <button
              (click)="responder(m)"
              class="bg-pastel-pink hover:bg-pastel-blue text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
              Responder
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class LandlordMessagesPage {
  private messagesSvc = inject(MessagesService);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLandlord = false;
  messages: Message[] = [];
  loading = false;
  error?: string;

  ngOnInit() {
    const user = this.auth.currentUser();
    this.isLandlord = user?.role === 'LANDLORD';
    if (!user || !this.isLandlord) return;

    this.loading = true;
    this.messagesSvc.getInbox(user.id).subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los mensajes';
        this.loading = false;
      }
    });
  }

  responder(m: Message) {
    this.router.navigate(
      ['/landlords/messages/compose', m.senderId],
      {
        queryParams: {
          name: m.senderName,
          listingId: m.listingId ?? '',
          listingTitle: m.listingTitle ?? ''
        }
      }
    );
  }
}
