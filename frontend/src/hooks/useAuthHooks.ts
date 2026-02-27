import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setAccessToken, clearAccessToken } from '../services/api';
import { login, register, logout, fetchMe, refreshToken, restoreSession } from '../services/queries/authQueries';
import { queryKeys } from '../services/queryKeys';


// --- Auth Hooks ---

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