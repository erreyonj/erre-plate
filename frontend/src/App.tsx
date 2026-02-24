import { Routes, Route } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Auth } from './pages/auth/Auth'
import { useAuth } from './contexts/AuthContext'
import  Browse from './pages/customer/Browse'
import MenuBuilder from './pages/chef/MenuBuilder'




function App() {
  const { user } = useAuth();
  
  console.log(user);
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route
        path="/dashboard"
        element={ 
          <ProtectedRoute>
            {user?.role === "customer" && <Browse /> }
            {user?.role === "chef" &&  <MenuBuilder /> }
            {user?.role === "admin" && <h1>Admin Page</h1>}
          </ProtectedRoute>
        }
      />
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
