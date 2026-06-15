import axios, { AxiosError } from 'axios';
import { LoginModel, SignUpModel, ForgotPasswordModel, ApiResponse, ApiErrorResponse } from '../models/AuthModel';
import ENV from '../config/env';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

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
    console.error('Login API error:', error);
    return handleAxiosError(error);
  }
};

export const signUpApi = (data: SignUpModel): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === ENV.MOCK_EMAIL) {
        reject({ status: 400, message: 'Email already registered.' } satisfies ApiErrorResponse);
      } else {
        resolve({
          status: 200,
          message: 'Account created successfully.',
          accessToken: '',
          user: {
            id: '',
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            address: data.address,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }
    }, 1500);
  });
};

export const forgotPasswordApi = (
  data: ForgotPasswordModel,
): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === ENV.MOCK_EMAIL) {
        reject({ status: 404, message: 'No account found with this email address.' } satisfies ApiErrorResponse);
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