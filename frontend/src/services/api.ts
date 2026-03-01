import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE,
  // headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/** Access token stored in memory only (not persisted). Cleared on tab close. */
let accessToken: string | null = null;

/** Get access token from memory. */
export function getAccessToken(): string | null {
  return accessToken;
}

/** Set access token in memory (called after login/refresh). */
export function setAccessToken(token: string): void {
  accessToken = token;
}

/** Clear access token from memory (called on logout). */
export function clearAccessToken(): void {
  accessToken = null;
}

/** Whether we have an access token (for enabling initial /me or refresh attempt). */
export function hasAccessToken(): boolean {
  return !!accessToken;
}

/** Callback for token refresh - AuthContext will provide this. */
let onRefresh: (() => Promise<string | null>) | null = null;
export function setRefreshHandler(handler: () => Promise<string | null>) {
  onRefresh = handler;
}

/** Attach access token to outgoing requests. */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
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
        setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    return Promise.reject(err);
  }
);
