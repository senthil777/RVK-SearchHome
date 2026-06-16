import axios, { AxiosError } from 'axios';
import {
  LoginModel,
  SignUpModel,
  ForgotPasswordModel,
  ApiResponse,
  ApiErrorResponse,
} from '../models/AuthModel';
import ENV from '../config/env';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Centralised error handler ────────────────────────────────
const handleAxiosError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const errData = error.response?.data as ApiErrorResponse | undefined;
    throw {
      status: errData?.status ?? 0,
      message: errData?.message ?? 'Request failed. Please try again.',
    } satisfies ApiErrorResponse;
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred.',
  } satisfies ApiErrorResponse;
};

// ── Login ────────────────────────────────────────────────────
export const loginApi = async (
  credentials: LoginModel,
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

// ── Sign Up ──────────────────────────────────────────────────
export const signUpApi = async (
  data: SignUpModel,
): Promise<ApiResponse> => {
  try {
    // ✅ confirmPassword and profileImage are NOT sent to the API
    const response = await apiClient.post<ApiResponse>('/auth/register', {
      firstName: data.firstName,
      lastName:  data.lastName,
      email:     data.email,
      address:   data.address,
      password:  data.password,
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

// ── Forgot Password ──────────────────────────────────────────
export const forgotPasswordApi = (
  data: ForgotPasswordModel,
): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === ENV.MOCK_EMAIL) {
        reject({
          status: 404,
          message: 'No account found with this email address.',
        } satisfies ApiErrorResponse);
      } else {
        resolve({
          status: 200,
          message: 'Password reset email sent.',
          accessToken: '',
          user: {} as any,
        });
      }
    }, 1500);
  });
};