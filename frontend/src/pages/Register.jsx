import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (errorMessage) {
      setErrorMessage('')
    }
    if (successMessage) {
      setSuccessMessage('')
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

    return 'Unable to create your account right now. Please try again.'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await api.post('/register', {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })

      setSuccessMessage('Account created successfully. Redirecting to sign in...')
      setForm({ full_name: '', email: '', phone: '', password: '' })

      setTimeout(() => {
        navigate('/')
      }, 1200)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <div className="auth-copy">
        <p className="eyebrow">Start fresh</p>
        <h2>Create your FinRelief AI account</h2>
        <p>Set up your profile and start your financial recovery plan.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Jane Doe"
            autoComplete="name"
            required
          />
        </label>
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
          Phone
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            autoComplete="tel"
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
              placeholder="Create a strong password"
              autoComplete="new-password"
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
        {successMessage ? <p className="form-message success">{successMessage}</p> : null}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? <span className="spinner" aria-hidden="true" /> : 'Create Account'}
        </button>
        <p className="switch-link">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </form>
    </section>
  )
}

export default Register
