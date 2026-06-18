export type PropertyBadge = 'For Sale' | 'For Rent' | 'Sold';
export type ListingType   = 'SALE' | 'RENT';

export interface PropertyModel {
  id: string;
  title: string;
  address: string;
  price: number;
  badge: PropertyBadge;
  emoji?: string;
  imageUrl?: string;
  isPremium?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

// ✅ Real API listing model
export interface ListingModel {
  id: string;
  title: string;
  address: string;
  price: number;
  type: ListingType;
  imageUrl: string;
  latitude: number;
  longitude: number;
  description: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface MyListResponse {
  status: number;
  message: string;
  listings: ListingModel[];
}