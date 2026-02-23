import { Routes, Route } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Auth } from './pages/auth/Auth'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <h1>Dashboard (authenticated)</h1>
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
