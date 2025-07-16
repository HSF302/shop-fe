export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER' | 'GUEST';
  address?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: User;
}
