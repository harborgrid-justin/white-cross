import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '../contexts/AuthContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    mode: 'onSubmit'
  })

  const redirectPath = searchParams.get('redirect')

  useEffect(() => {
    if (redirectPath === '/health-records') {
      setAuthError('Please log in to access health records')
    }
  }, [redirectPath])

  // Update error message when form validation errors change
  useEffect(() => {
    if (errors.email) {
      setAuthError(errors.email.message || 'Invalid email format')
    } else if (errors.password) {
      setAuthError(errors.password.message || 'Invalid password')
    }
  }, [errors.email, errors.password])

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setAuthError('')
    try {
      await login(data.email, data.password)
      toast.success('Login successful!')
      
      // Redirect to the intended page after successful login
      // Default to dashboard if no redirect path is specified
      navigate(redirectPath || '/dashboard', { replace: true })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Invalid credentials'
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const onError = () => {
    // This is called by react-hook-form when validation fails
    if (errors.email) {
      setAuthError(errors.email.message || 'Invalid email format')
    } else if (errors.password) {
      setAuthError(errors.password.message || 'Invalid password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-primary-600 mb-2">White Cross</h1>
          <h2 className="text-center text-xl font-semibold text-gray-900">
            School Nurse Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)} data-cy="login-form">
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3" data-cy="error-message">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="Enter your email"
                  data-cy="email-input"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type="password"
                  className="input-field"
                  placeholder="Enter your password"
                  data-cy="password-input"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                data-cy="login-button"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Enterprise healthcare platform for school nurses</p>
          <p className="mt-1">Secure • Compliant • Comprehensive</p>
        </div>
      </div>
    </div>
  )
}
