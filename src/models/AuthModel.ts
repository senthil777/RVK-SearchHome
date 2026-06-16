export interface UserPreferences {
  notificationsEnabled: boolean;
  language: string;
  darkMode: boolean;
}

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;   // ✅ Added from API response
}

export interface ApiResponse {
  status: number;          // 200 for login, 201 for signup
  message: string;
  accessToken: string;
  user: UserModel;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface SignUpModel {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;   // only used for validation, NOT sent to API
  profileImage: string | null;
}

export interface ForgotPasswordModel {
  email: string;
}

export interface ApiErrorResponse {
  status: number | boolean;
  message: string;
}