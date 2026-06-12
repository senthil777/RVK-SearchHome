import { PropertyModel } from '../models/HomeModel';
import { ApiResponse } from '../models/AuthModel';

const MOCK_PROPERTIES: PropertyModel[] = [
  {
    id: '1',
    title: 'Green Valley Villa',
    address: '12 Park Avenue, Chennai',
    price: 4500000,
    badge: 'For Sale',
    emoji: '🏡',
  },
  {
    id: '2',
    title: 'Sunrise Apartments',
    address: '45 MG Road, Bangalore',
    price: 2800000,
    badge: 'For Rent',
    emoji: '🏢',
  },
  {
    id: '3',
    title: 'Lake View Bungalow',
    address: '7 Beach Road, Coimbatore',
    price: 7200000,
    badge: 'For Sale',
    emoji: '🏠',
  },
];

export const fetchPropertiesApi = (): Promise<PropertyModel[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_PROPERTIES);
    }, 1000);
  });
};