import type { User } from './user';

// --- Response types ---

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
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
