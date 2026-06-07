import {
  LoginModel,
  SignUpModel,
  ForgotPasswordModel,
  ApiResponse,
} from '../models/AuthModel';

const MOCK_EMAIL = 'admin@gmail.com';
const MOCK_PASSWORD = '123456';

export const loginApi = (
  credentials: LoginModel,
): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.email === MOCK_EMAIL &&
        credentials.password === MOCK_PASSWORD
      ) {
        resolve({ status: true, message: 'Login successful' });
      } else {
        reject({ status: false, message: 'Invalid credentials' });
      }
    }, 1500);
  });
};

export const signUpApi = (
  data: SignUpModel,
): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === MOCK_EMAIL) {
        reject({
          status: false,
          message: 'An account with this email already exists.',
        });
      } else {
        resolve({
          status: true,
          message: 'Account created successfully!',
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
      if (data.email === MOCK_EMAIL) {
        resolve({
          status: true,
          message: 'Password reset link sent to your email.',
        });
      } else {
        reject({
          status: false,
          message: 'No account found with this email address.',
        });
      }
    }, 1500);
  });
};