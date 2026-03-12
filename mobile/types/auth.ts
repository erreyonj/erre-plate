import type { User } from './user';

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'customer' | 'chef' | 'admin';
  phone?: string;
  dietary_preferences?: string,
  allergies?: string
  address: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
    lat?: number
    lng?: number
  }
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  refreshToken: string;
  token_type: string;
}

export interface RegisterResponse extends LoginResponse {}

export interface MeResponse {
  user: User;
}

export interface RefreshResponse {
  token: string;
  token_type: string;
}
