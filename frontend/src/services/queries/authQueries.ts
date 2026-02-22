import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, setStoredToken, clearStoredToken } from '../api';
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

// --- Hooks ---

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      setStoredToken(res.token);
      queryClient.setQueryData(queryKeys.auth.me(), res.user);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      setStoredToken(res.token);
      queryClient.setQueryData(queryKeys.auth.me(), res.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearStoredToken();
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

export function useRefreshMutation() {
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (token) => {
      setStoredToken(token);
    },
  });
}
