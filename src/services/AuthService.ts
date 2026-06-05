import { LoginModel, LoginResponse } from '../models/LoginModel';

// In a real app, move these to environment variables or a backend
const MOCK_EMAIL = 'admin@gmail.com';
const MOCK_PASSWORD = '123456';

export const loginApi = (credentials: LoginModel): Promise<LoginResponse> => {
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