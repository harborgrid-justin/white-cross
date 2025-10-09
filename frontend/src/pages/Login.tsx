import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '../contexts/AuthContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginForm>({
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

  // Clear error when user starts typing
  const watchedEmail = watch('email')
  const watchedPassword = watch('password')
  useEffect(() => {
    if (watchedEmail || watchedPassword) {
      setAuthError('')
    }
  }, [watchedEmail, watchedPassword])

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
          <div className="flex justify-center mb-6">
            <img
              src="/white-cross-logo.svg"
              alt="White Cross Logo"
              className="h-16 w-16"
              onError={(e) => {
                // Fallback to text if image fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
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
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  data-cy="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  data-cy="password-toggle"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  data-cy="remember-me-checkbox"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                  data-cy="forgot-password-link"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                data-cy="login-button"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      data-cy="loading-spinner"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Enterprise healthcare platform for school nurses</p>
          <p className="mt-1">Secure • HIPAA Compliant • Comprehensive</p>
          <p className="mt-2 text-xs text-gray-500">
            Protected health information (PHI) is encrypted and secured in compliance with HIPAA regulations
          </p>
        </div>
      </div>
    </div>
  )
}
