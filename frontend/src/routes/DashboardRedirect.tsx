import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

function getDashboardPath(role: string): string {
  switch (role) {
    case 'customer':
      return '/customer/dashboard'
    case 'chef':
      return '/chef/dashboard'
    case 'admin':
      return '/admin/dashboard'
    default:
      return '/login'
  }
}

export const DashboardRedirect = () => {
    const { user } = useAuth()

    if (!user) return <Navigate to="/login" replace />
  
    return <Navigate to={getDashboardPath(user.role)} replace />
}
