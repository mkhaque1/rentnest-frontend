export type PropertyStatus = 'AVAILABLE' | 'RENTED' | 'UNAVAILABLE';

export interface PropertyCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyLandlord {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface PropertyReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  tenant: {
    id: string;
    name: string;
  };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  isPublished: boolean;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: PropertyCategory;
  landlord: PropertyLandlord;
  reviews: PropertyReview[];
}
