import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Typography } from '@mui/material'

interface LoginProps {
  /** When provided, used instead of Link for switching to register */
  onSwitchToRegister?: () => void
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const user = await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Login failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <Typography variant='h3' className="text-2xl sm:text-3xl font-semibold text-eplate-charcoal mb-10 font-">
        Welcome back
      </Typography>
      <p className="text-eplate-brown/80 text-sm sm:text-base mb-6">
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {error && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-eplate-error/10 text-eplate-error text-sm"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-eplate-charcoal mb-2"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="auth-input w-full"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-eplate-charcoal mb-2"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="auth-input w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-btn w-full py-3 sm:py-3.5 text-base font-medium"
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-eplate-charcoal/80">
        Don&apos;t have an account?{' '}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-eplate-gold hover:text-eplate-terracotta transition-colors"
          >
            Create one
          </button>
        ) : (
          <a
            href="/register"
            className="font-medium text-eplate-gold hover:text-eplate-terracotta transition-colors"
          >
            Create one
          </a>
        )}
      </p>
    </div>
  )
}
