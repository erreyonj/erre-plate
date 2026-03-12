import { api, setAccessToken, clearAccessToken } from '../api';
import { saveRefreshToken, loadRefreshToken, clearRefreshToken } from '../secureStore';
import type { LoginResponse, RegisterResponse, MeResponse, RefreshResponse, RegisterPayload } from '../../types/auth';
import type { User } from '../../types/user';

export async function login(credentials: { email: string; password: string }) {
  const { data } = await api.post<LoginResponse>('/login', credentials);
  await saveRefreshToken(data.refreshToken);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<RegisterResponse>('/register', payload);
  await saveRefreshToken(data.refreshToken);
  return data;
}

export async function logout() {
  await api.post('/logout');
  await clearRefreshToken();
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<MeResponse>('/me');
  return data.user;
}

export async function refreshToken(): Promise<string> {
  const storedToken = await loadRefreshToken();
  if (!storedToken) throw new Error('No refresh token');
  const { data } = await api.post<RefreshResponse>('/refresh', { refreshToken: storedToken });
  return data.token;
}

export async function restoreSession(): Promise<User | null> {
  try {
    const token = await refreshToken();
    setAccessToken(token);
    const user = await fetchMe();
    return user;
  } catch {
    clearAccessToken();
    await clearRefreshToken();
    return null;
  }
}
