/**
 * WF-COMP-220 | LoginForm.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, react-hook-form, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import type { LoginForm as LoginFormData } from '../types'

interface LoginFormProps {
  register: UseFormRegister<LoginFormData>
  errors: FieldErrors<LoginFormData>
  loading: boolean
  showPassword: boolean
  onTogglePassword: () => void
  onSubmit: () => void
  authError: string
}

export const LoginFormFields: React.FC<LoginFormProps> = ({
  register,
  errors,
  loading,
  showPassword,
  onTogglePassword,
  onSubmit,
  authError
}) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit} data-cy="login-form" data-testid="login-form" role="form">
      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3" data-cy="error-message" data-testid="error-message" role="alert">
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
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="input-field"
            placeholder="Enter your email"
            data-cy="email-input"
            data-testid="email-input"
            aria-label="Email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" data-cy="email-error" data-testid="email-error" role="alert">{errors.email.message}</p>
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
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className="input-field pr-10"
            placeholder="Enter your password"
            data-cy="password-input"
            data-testid="password-input"
            aria-label="Password"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            data-cy="password-toggle"
            data-testid="password-toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600" data-cy="password-error" data-testid="password-error" role="alert">{errors.password.message}</p>
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
            data-testid="remember-me-checkbox"
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
            data-testid="forgot-password-link"
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
          data-testid="login-button"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                data-cy="loading-spinner"
                data-testid="loading-spinner"
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
  )
}
