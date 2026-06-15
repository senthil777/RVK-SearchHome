export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  status: number;        // API returns 200, not boolean
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
  confirmPassword: string;
  profileImage: string | null;
}

export interface ForgotPasswordModel {
  email: string;
}

// Separate error shape from success shape
export interface ApiErrorResponse {
  status: number | boolean;
  message: string;
}