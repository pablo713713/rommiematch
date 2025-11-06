import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Landlord } from '../models/landlord.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LandlordsService {
  private base = '/api/landlords';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Landlord> {
    return this.http.get<Landlord>(`${this.base}/${id}`);
  }

  update(id: number, payload: Partial<Landlord>): Observable<Landlord> {
    return this.http.put<Landlord>(`${this.base}/${id}`, payload);
  }
}
