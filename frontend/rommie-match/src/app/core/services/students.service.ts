// src/app/core/services/students.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private base = '/api/students'; // proxy.conf.json redirige al backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.base);
  }
  getById(id: number) {
    return this.http.get<Student>(`${this.base}/${id}`);
  }

  update(id: number, payload: Partial<Student>) {
    return this.http.put<Student>(`${this.base}/${id}`, payload);
  }
}
