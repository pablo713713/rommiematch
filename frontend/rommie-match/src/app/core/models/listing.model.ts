export interface Listing {
  id: number;
  title: string;
  location?: string;
  pricePerMonth?: number;
  photoUrl?: string;
  amenities?: string; // CSV por ahora
  rules?: string;     // CSV por ahora
  availableFrom?: string; // ISO
  landlord?: { id: number; fullName?: string; displayName?: string };
}
