import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface RegisterProps {
  /** When provided, used instead of Link for switching to login */
  onSwitchToLogin?: () => void
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer' as 'customer' | 'chef' | 'admin',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setIsLoading(true)
    try {
      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        role: form.role,
      })
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="text-2xl sm:text-3xl font-semibold text-eplate-charcoal mb-2">
        Create account
      </h1>
      <p className="text-eplate-brown/80 text-sm sm:text-base mb-6">
        Join AirPlate and start exploring
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="register-first"
              className="block text-sm font-medium text-eplate-charcoal mb-2"
            >
              First name
            </label>
            <input
              id="register-first"
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              required
              autoComplete="given-name"
              className="auth-input w-full"
            />
          </div>
          <div>
            <label
              htmlFor="register-last"
              className="block text-sm font-medium text-eplate-charcoal mb-2"
            >
              Last name
            </label>
            <input
              id="register-last"
              name="last_name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              required
              autoComplete="family-name"
              className="auth-input w-full"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-eplate-charcoal mb-2"
          >
            Email
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="auth-input w-full"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="register-role"
            className="block text-sm font-medium text-eplate-charcoal mb-2"
          >
            I am a
          </label>
          <select
            id="register-role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="auth-input w-full appearance-none bg-eplate-cream border-eplate-tan/40 focus:border-eplate-gold"
          >
            <option value="customer">Customer</option>
            <option value="chef">Chef</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-eplate-charcoal mb-2"
          >
            Password
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
            className="auth-input w-full"
            placeholder="Min 8 characters"
          />
        </div>

        <div>
          <label
            htmlFor="register-confirm"
            className="block text-sm font-medium text-eplate-charcoal mb-2"
          >
            Confirm password
          </label>
          <input
            id="register-confirm"
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="auth-input w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-btn w-full py-3 sm:py-3.5 text-base font-medium"
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-eplate-charcoal/80">
        Already have an account?{' '}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-eplate-gold hover:text-eplate-terracotta transition-colors"
          >
            Sign in
          </button>
        ) : (
          <a
            href="/login"
            className="font-medium text-eplate-gold hover:text-eplate-terracotta transition-colors"
          >
            Sign in
          </a>
        )}
      </p>
    </div>
  )
}
