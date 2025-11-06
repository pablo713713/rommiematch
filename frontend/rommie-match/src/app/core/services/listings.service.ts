import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Listing } from '../models/listing.model';

@Injectable({ providedIn: 'root' })
export class ListingsService {
  private base = '/api/listings';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.base);
  }

  searchByLocation(q: string): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.base}/search/by-location`, { params: { q } });
  }

  searchByMaxPrice(max: number): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.base}/search/by-price`, { params: { max } as any });
  }
  create(data: Partial<Listing>) {
    return this.http.post<Listing>(this.base, data);
  }

  update(id: number, data: Partial<Listing>) {
    return this.http.put<Listing>(`${this.base}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getById(id: number) {
    return this.http.get<Listing>(`${this.base}/${id}`);
  }
}
