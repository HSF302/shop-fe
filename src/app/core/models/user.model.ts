export interface User {
  id: number;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  role: UserRole;
  isActive?: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  GUEST = 'GUEST'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  address?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
