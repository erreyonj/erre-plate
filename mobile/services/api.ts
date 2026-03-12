import axios, { type InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

const API_BASE = Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
});

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}

export function hasAccessToken(): boolean {
  return !!accessToken;
}

let onRefresh: (() => Promise<string | null>) | null = null;
export function setRefreshHandler(handler: () => Promise<string | null>) {
  onRefresh = handler;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const isRefreshRequest = original?.url?.includes('/refresh');

    if (
      err.response?.status === 401 &&
      !original._retry &&
      !isRefreshRequest &&
      onRefresh
    ) {
      original._retry = true;
      const newToken = await onRefresh();
      if (newToken) {
        setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    return Promise.reject(err);
  }
);
