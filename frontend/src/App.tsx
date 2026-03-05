import { Routes, Route } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Auth } from './pages/auth/Auth'
import Browse from './pages/customer/Browse'
import Menus from './pages/chef/Menus'
import Orders from './pages/customer/Orders'
import Tickets from './pages/chef/Tickets'
import CustomerProfile from './pages/customer/CustomerProfile'
import ProfileEdit from './pages/profile/ProfileEdit'
import ChefProfile from './pages/chef/ChefProfile'
import CustomerLayout from './pages/layouts/CustomerLayout'
import ChefLayout from './pages/layouts/ChefLayout'
import MenuBuilder from './pages/chef/MenuBuilder'
import AllMenus from './pages/chef/AllMenus'
import { DashboardRedirect } from './routes/DashboardRedirect'
import OnboardingLayout from './pages/layouts/OnboardingLayout'
import OnboardingV1 from './pages/onboarding/Onboardingv1'
import PublicChefProfile from './pages/chef/PublicChefProfile'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />

      <Route path="/onboarding" element={<OnboardingLayout />}>
        <Route path="new-user" element={<OnboardingV1 />} />
      </Route>

      {/* Authenticated routes */}
      <Route element={<ProtectedRoute />}>
        {/* Customer routes with responsive layout */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={['customer']} forbiddenPath="/customer/browse">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="browse" element={<Browse />} />
          {/* <Route path="browse?neighborhood=:neighborhoodId" element={<Browse />} /> */}
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
        </Route>

        {/* Chef routes with responsive layout */}
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={['chef']} forbiddenPath="/chef/dashboard">
              <ChefLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Menus />} />
          <Route path="menus/all" element={<AllMenus />} />
          <Route path="menus/:menuId/edit" element={<MenuBuilder />} />
          <Route path="orders" element={<Tickets />} />
          <Route path="profile" element={<ChefProfile />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
        </Route>
      </Route>

      <Route
        path="/chef"
        element={
          <ProtectedRoute forbiddenPath="/customer/browse">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path=":slug" element={<PublicChefProfile />} />
      </Route >

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
