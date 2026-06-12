import {
  LoginModel,
  SignUpModel,
  ForgotPasswordModel,
  ApiResponse,
} from '../models/AuthModel';
import axios from 'axios';


const MOCK_EMAIL = 'admin@gmail.com';
const MOCK_PASSWORD = '123456';

const BASE_URL =
  'https://super-goldfish-77v7p57gj6rx275v-3000.app.github.dev';

  export const loginApi = async (
  credentials: LoginModel,
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error);
    throw (
      error?.response?.data || {
        status: false,
        message: 'Login failed',
      }
        
    );
  }
}

export const signUpApi = (
  data: SignUpModel,
): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === MOCK_EMAIL) {
        
      } else {
        
      }
    }, 1500);
  });
};

export const forgotPasswordApi = (
  data: ForgotPasswordModel,
): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === MOCK_EMAIL) {
        
      } else {
        reject({
          status: false,
          message: 'No account found with this email address.',
        });
      }
    }, 1500);
  });
};