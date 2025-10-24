/**
 * WF-COMP-220 | LoginForm.tsx - Login Form Component
 * Purpose: Login form component for authentication
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Login page | Called by: Login component
 * Related: AuthContext, Login page
 * Exports: LoginForm component | Key Features: State-based form, password toggle, validation
 * Last Updated: 2025-10-24 | File Type: .tsx
 * Critical Path: User input → State update → Form submission → Authentication
 * LLM Context: Login form component with simple state management, part of auth system
 */

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { LoginForm as LoginFormData } from '../types'

/**
 * Props for LoginForm component
 */
interface LoginFormProps {
  /** Current login form data */
  loginData: LoginFormData
  /** Loading state during authentication */
  loading: boolean
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void
  /** Input change handler */
  onInputChange: (field: string, value: string | boolean) => void
}

/**
 * LoginForm Component
 *
 * Provides a secure login form with:
 * - Email and password validation
 * - Password visibility toggle
 * - Remember me functionality
 * - Loading states during authentication
 * - Accessibility support (ARIA labels, keyboard navigation)
 * - Responsive design
 *
 * @param props - LoginForm props
 * @returns React component
 *
 * @example
 * ```tsx
 * <LoginForm
 *   loginData={{ email: '', password: '', rememberMe: false }}
 *   loading={false}
 *   onSubmit={handleSubmit}
 *   onInputChange={handleChange}
 * />
 * ```
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  loginData,
  loading,
  onSubmit,
  onInputChange
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={onSubmit}
      data-testid="login-form"
      role="form"
      aria-label="Login form"
    >
      <div className="space-y-4 rounded-md shadow-sm">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={loginData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter your email"
            data-testid="email-input"
            aria-label="Email address"
            aria-required="true"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={loginData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your password"
              data-testid="password-input"
              aria-label="Password"
              aria-required="true"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="toggle-password-visibility"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={loginData.rememberMe || false}
            onChange={(e) => onInputChange('rememberMe', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            data-testid="remember-me-checkbox"
            aria-label="Remember me"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900 cursor-pointer"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            data-testid="forgot-password-link"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="login-button"
          aria-busy={loading}
          aria-label={loading ? 'Signing in...' : 'Sign in'}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                data-testid="loading-spinner"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </div>
    </form>
  )
}

export default LoginForm

