import { Routes, Route } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Auth } from './pages/auth/Auth'
import Browse from './pages/customer/Browse'
import MenuBuilder from './pages/chef/MenuBuilder'
import Orders from './pages/customer/Orders'
import Tickets from './pages/chef/Tickets'
import CustomerProfile from './pages/customer/Profile'
import ChefProfile from './pages/chef/Profile'
import CustomerLayout from './pages/layouts/CustomerLayout'
import ChefLayout from './pages/layouts/ChefLayout'
import { DashboardRedirect } from './routes/DashboardRedirect'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Authenticated routes */}
      <Route element={<ProtectedRoute />}>
        {/* Customer routes with responsive layout */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Browse />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

        {/* Chef routes with responsive layout */}
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <ChefLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<MenuBuilder />} />
          <Route path="orders" element={<Tickets />} />
          <Route path="profile" element={<ChefProfile />} />
        </Route>
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <h1>Admin only</h1>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
