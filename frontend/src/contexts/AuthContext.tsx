import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  hasAccessToken,
  clearAccessToken,
  setRefreshHandler,
} from '../services/api';
import {
  useMeQuery,
  useRestoreSessionQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
} from '../services/queries/authQueries';
import type { User } from '../types/user';

interface AuthContextValue {
  user: User | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'customer' | 'chef' | 'admin';
  phone?: string;
  address?: Record<string, unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading: isRestoring } = useRestoreSessionQuery();
  const hasToken = hasAccessToken();
  const { data: user, isLoading: isMeLoading, isError } = useMeQuery(hasToken);
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const refreshMutation = useRefreshMutation();
  const isRefreshing = useRef(false);

  const performRefresh = useCallback(async (): Promise<string | null> => {
    if (isRefreshing.current) return null;
    isRefreshing.current = true;
    try {
      const token = await refreshMutation.mutateAsync();
      return token;
    } catch {
      clearAccessToken();
      return null;
    } finally {
      isRefreshing.current = false;
    }
  }, [refreshMutation]);

  useEffect(() => {
    setRefreshHandler(performRefresh);
    return () => setRefreshHandler(() => Promise.resolve(null));
  }, [performRefresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
    },
    [loginMutation]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerMutation.mutateAsync(payload);
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      clearAccessToken();
    }
  }, [logoutMutation]);

  const isAuthenticated = !!user && !isError;
  const isLoading = isRestoring || (hasToken && isMeLoading);

  const value: AuthContextValue = {
    user: isError ? null : user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
