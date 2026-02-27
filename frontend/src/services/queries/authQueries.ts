import { api, setAccessToken, clearAccessToken } from '../api';
import type { LoginResponse, RegisterResponse, MeResponse, RefreshResponse } from '../../types/auth'
import type { User } from '../../types/user';


// --- API calls ---

export async function login(credentials: { email: string; password: string }) {
  const { data } = await api.post<LoginResponse>('/login', credentials);
  return data;
  //
}

export async function register(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'customer' | 'chef' | 'admin';
  phone?: string;
  address?: Record<string, unknown>;
}) {
  const { data } = await api.post<RegisterResponse>('/register', payload);
  return data;
}

export async function logout() {
  await api.post('/logout');
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<MeResponse>('/me');
  return data.user;
}

export async function refreshToken(): Promise<string> {
  const { data } = await api.post<RefreshResponse>('/refresh');
  return data.token;
}

/** Try to restore session from refresh cookie. Returns user if successful. */
export async function restoreSession(): Promise<User | null> {
  try {
    const token = await refreshToken();
    setAccessToken(token);
    const user = await fetchMe();
    return user;
  } catch {
    clearAccessToken();
    return null;
  }
}


