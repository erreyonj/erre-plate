import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, setAccessToken, clearAccessToken } from '../api';
import { queryKeys } from '../queryKeys';
import type { User } from '../../types/user';

// --- Response types ---

interface LoginResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

interface RegisterResponse extends LoginResponse {}

interface MeResponse {
  user: User;
}

interface RefreshResponse {
  token: string;
  token_type: string;
}

// --- API calls ---

async function login(credentials: { email: string; password: string }) {
  const { data } = await api.post<LoginResponse>('/login', credentials);
  return data;
  //
}

async function register(payload: {
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

async function logout() {
  await api.post('/logout');
}

async function fetchMe(): Promise<User> {
  const { data } = await api.get<MeResponse>('/me');
  return data.user;
}

async function refreshToken(): Promise<string> {
  const { data } = await api.post<RefreshResponse>('/refresh');
  return data.token;
}

/** Try to restore session from refresh cookie. Returns user if successful. */
async function restoreSession(): Promise<User | null> {
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

// --- Hooks ---

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      setAccessToken(res.token);
      queryClient.setQueryData(queryKeys.auth.me(), res.user);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      setAccessToken(res.token);
      queryClient.setQueryData(queryKeys.auth.me(), res.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAccessToken();
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

export function useMeQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: fetchMe,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useRestoreSessionQuery() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [...queryKeys.auth.all, 'restore'] as const,
    queryFn: async () => {
      const user = await restoreSession();
      if (user) {
        queryClient.setQueryData(queryKeys.auth.me(), user);
      }
      return user;
    },
    staleTime: Infinity,
    retry: false,
  });
}

export function useRefreshMutation() {
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (token) => {
      setAccessToken(token);
    },
  });
}
