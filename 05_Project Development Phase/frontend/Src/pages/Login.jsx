import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const getErrorMessage = (error) => {
    const detail = error?.response?.data?.detail

    if (Array.isArray(detail)) {
      return detail.map((item) => item?.msg || item?.loc?.slice(-1)[0]).join(' ')
    }

    if (typeof detail === 'string') {
      return detail
    }

    if (detail?.message) {
      return detail.message
    }

    return 'Unable to sign in right now. Please try again.'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await api.post('/login', {
        email: form.email.trim(),
        password: form.password,
      })

      const token = response?.data?.access_token

      if (!token) {
        throw new Error('No access token returned by the server.')
      }

      localStorage.setItem('access_token', token)
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <div className="auth-copy">
        <p className="eyebrow">Welcome back</p>
        <h2>Access your recovery dashboard</h2>
        <p>Track loans, financial health, and settlement guidance in one place.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>

        {errorMessage ? <p className="form-message error">{errorMessage}</p> : null}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? <span className="spinner" aria-hidden="true" /> : 'Sign In'}
        </button>
        <p className="switch-link">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  )
}

export default Login
