import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../../components/auth/Login'
import { Register } from '../../components/auth/Register'

/**
 * Auth page: layout structure, route logic, section composition.
 * - Mobile: full video background with overlay form
 * - Tablet/Desktop (md+): 70% visual / 30% form split
 */
export function Auth() {
  return (
    <div className="auth-layout min-h-screen w-full flex flex-col md:flex-row">
      {/* Video background - full screen on mobile (behind form), 70% on md+ */}
      <section
        className="auth-visual inset-0 md:relative md:flex-7 md:min-h-screen overflow-hidden"
        aria-hidden="true"
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/airplate-bg-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
        <div className="absolute inset-0 bg-eplate-charcoal/70 md:bg-eplate-charcoal/40" />
      </section>

      {/* Form section - overlay on mobile, 30% panel on md+ */}
      <section className="auth-form fixed flex-1 md:flex-3 w-full flex flex-col justify-center min-h-screen md:min-h-screen md:bg-eplate-cream backdrop-blur-xs md:backdrop-blur-none">
        <div className="w-full flex justify-center fixed top-10">
          <h1>
            airplate
          </h1>
        </div>
          {/* <Routes>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes> */}
          <div className="w-full flex justify-center">
            <Login />
          </div>
      </section>
    </div>
  )
}
