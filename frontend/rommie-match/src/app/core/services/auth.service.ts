import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  id: number;
  role: 'STUDENT' | 'LANDLORD' | 'ADMIN';
  fullName: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';

  // signal para el usuario actual
  currentUser = signal<AuthResponse | null>(null);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, { email, password })
      .pipe(tap(user => this.currentUser.set(user)));
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, data)
      .pipe(tap(user => this.currentUser.set(user)));
  }

  logout() {
    this.currentUser.set(null);
  }
}
