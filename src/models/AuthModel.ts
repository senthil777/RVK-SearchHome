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

export interface ApiResponse {
  status: boolean;
  message: string;
}

export interface ForgotPasswordModel {
  email: string;
}