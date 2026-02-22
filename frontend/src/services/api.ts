import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'auth_token';

/** Get stored token (for AuthContext and interceptors). */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Set token in storage (called after login/refresh). */
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Remove token from storage (called on logout). */
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Callback for token refresh - AuthContext will provide this. */
let onRefresh: (() => Promise<string | null>) | null = null;
export function setRefreshHandler(handler: () => Promise<string | null>) {
  onRefresh = handler;
}

/** Attach token to outgoing requests. */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Handle 401: try refresh, retry, or clear auth. Don't retry on refresh endpoint. */
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
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    return Promise.reject(err);
  }
);
