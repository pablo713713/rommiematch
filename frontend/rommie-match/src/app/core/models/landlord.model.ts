export interface Landlord {
  id: number;
  email: string;
  password?: string;
  fullName?: string;
  photoUrl?: string;
  displayName?: string;   // nombre público del propietario
  createdAt?: string;
}
