import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

export interface SendMessagePayload {
  senderId: number;
  recipientId: number;
  content: string;
  listingId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private base = '/api/messages'; // pasa por proxy a localhost:8080

  constructor(private http: HttpClient) {}

  send(payload: SendMessagePayload): Observable<Message> {
    return this.http.post<Message>(this.base, payload);
  }

  getInbox(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.base}/inbox/${userId}`);
  }

  getSent(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.base}/sent/${userId}`);
  }
}

