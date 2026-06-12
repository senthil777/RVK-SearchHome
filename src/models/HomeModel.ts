export type PropertyBadge =
  | 'For Sale'
  | 'For Rent'
  | 'Sold';

export interface PropertyModel {
  id: string;
  title: string;
  address: string;
  price: number;
  badge: PropertyBadge;
  emoji: string;
  isFavorite?: boolean;
}