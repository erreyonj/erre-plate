import { Routes, Route } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to Erre Plate!!</h1>} />
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
