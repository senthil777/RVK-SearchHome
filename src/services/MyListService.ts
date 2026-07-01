// src/services/MyListService.ts
import axios, { AxiosError } from 'axios';
import {
  MyListResponse,
  ListingModel,
  CreateListingResponse,
  CreateListingPayload,
} from '../models/HomeModel';
import { ApiErrorResponse } from '../models/AuthModel';
import { TokenStorage } from '../storage/TokenStorage';
import ENV from '../config/env';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,   // ✅ slightly higher — image upload needs more time
});

// ✅ Filter out localhost/invalid image URLs
export const isValidImageUrl = (url: string): boolean =>
  Boolean(url) &&
  (url.startsWith('https://') ||
    url.startsWith('http://res.cloudinary'));

// ── GET /my-list ────────────────────────────────────────────
export const fetchMyListApi = async (): Promise<ListingModel[]> => {
  try {
    const token = await TokenStorage.getToken();

    const response = await apiClient.get<MyListResponse>('/my-list', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    });

    return response.data.listings;
  } catch (error) {
    throw handleListError(error, 'Failed to fetch listings.');
  }
};

// ── POST /my-list (multipart upload) ───────────────────────
export const createListingApi = async (
  payload: CreateListingPayload,
): Promise<ListingModel> => {
  try {
    const token = await TokenStorage.getToken();

    // ✅ Build multipart form-data exactly matching the curl request
    const formData = new FormData();

    // Extract filename + infer mime type from the URI
    const filename = payload.imageUri.split('/').pop() ?? `photo_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    formData.append('image', {
      uri: payload.imageUri,
      name: filename,
      type: mimeType,
    } as any);

    formData.append('latitude', String(payload.latitude));
    formData.append('longitude', String(payload.longitude));
    formData.append('description', payload.description);

    const response = await apiClient.post<CreateListingResponse>(
      '/my-list',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data.property;
  } catch (error) {
    throw handleListError(error, 'Failed to submit listing.');
  }
};

// ── Shared error handler ────────────────────────────────────
const handleListError = (error: unknown, fallbackMessage: string): ApiErrorResponse => {
  if (error instanceof AxiosError) {
    const errData = error.response?.data as ApiErrorResponse | undefined;
    return {
      status:  errData?.status  ?? 0,
      message: errData?.message ?? fallbackMessage,
    };
  }
  return {
    status:  0,
    message: fallbackMessage,
  };
};