// src/services/MyListService.ts
import axios, { AxiosError } from 'axios';
import { MyListResponse, ListingModel } from '../models/HomeModel';
import { ApiErrorResponse } from '../models/AuthModel';
import { TokenStorage } from '../storage/TokenStorage';
import ENV from '../config/env';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Filter out localhost/invalid image URLs
export const isValidImageUrl = (url: string): boolean =>
  Boolean(url) &&
  (url.startsWith('https://') ||
    url.startsWith('http://res.cloudinary'));

export const fetchMyListApi = async (): Promise<ListingModel[]> => {
  try {
    const token = await TokenStorage.getToken();
    console.log('MyListService.fetchMyListApi - token:', token);
    const response = await apiClient.get<MyListResponse>('/my-list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.listings;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errData = error.response?.data as ApiErrorResponse | undefined;
      throw {
        status:  errData?.status  ?? 0,
        message: errData?.message ?? 'Failed to fetch listings.',
      } satisfies ApiErrorResponse;
    }
    throw {
      status:  0,
      message: 'An unexpected error occurred.',
    } satisfies ApiErrorResponse;
  }
};