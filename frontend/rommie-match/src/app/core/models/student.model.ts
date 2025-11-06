// src/app/core/models/student.model.ts
export interface Student {
  id: number;
  email: string;
  password: string;      // por ahora viaja así (sin seguridad)
  fullName: string;
  photoUrl?: string;
  major?: string;
  age?: number;
  bio?: string;
  hobbies?: string[];
  preferredLocation?: string;
  budgetMin?: number;
  budgetMax?: number;
  createdAt?: string;    // ISO
}
