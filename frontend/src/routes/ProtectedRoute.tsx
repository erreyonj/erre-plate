import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  /** If provided, user must have one of these roles. */
  allowedRoles?: Array<'customer' | 'chef' | 'admin'>;
  /** Where to redirect when unauthenticated. */
  loginPath?: string;
  /** Where to redirect when authenticated but lacking required role. */
  forbiddenPath?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  loginPath = '/login',
  forbiddenPath = '/customer/dashboard',
}: ProtectedRouteProps) {
  const { pathname } = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={loginPath} state={{ from: pathname }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={forbiddenPath} replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
}
