export interface LoginModel {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
}