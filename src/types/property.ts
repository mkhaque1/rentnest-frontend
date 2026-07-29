export type PropertyStatus = 'AVAILABLE' | 'UNAVAILABLE';

export interface Category {
  id: string;
  name: string;
}

export interface Landlord {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  amenities: string[];
  status: PropertyStatus;
  landlordId: string;
  categoryId: string;
  landlord?: Landlord;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}
