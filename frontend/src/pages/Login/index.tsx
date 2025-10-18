/**
 * WF-IDX-221 | index.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../contexts/AuthContext, ./components/LoginForm | Dependencies: react-hook-form, ../../contexts/AuthContext, react-router-dom
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, useEffect, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Login Page - Refactored
 * Secure authentication with HIPAA compliance
 */

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '../../contexts/AuthContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LoginFormFields } from './components/LoginForm'
import type { LoginForm } from './types'

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
    document.title = 'Login - White Cross - School Nurse Platform'
  }, [])

  useEffect(() => {
    if (redirectPath === '/health-records') {
      setAuthError('Please log in to access health records')
    }
  }, [redirectPath])

  useEffect(() => {
    if (errors.email) {
      setAuthError(errors.email.message || 'Invalid email format')
    } else if (errors.password) {
      setAuthError(errors.password.message || 'Invalid password')
    }
  }, [errors.email, errors.password])

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
      navigate(redirectPath || '/dashboard', { replace: true })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Invalid credentials'
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const onError = () => {
    if (errors.email) {
      setAuthError(errors.email.message || 'Invalid email format')
    } else if (errors.password) {
      setAuthError(errors.password.message || 'Invalid password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <a
        href="#main"
        data-cy="skip-to-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <img
              src="/white-cross-logo.svg"
              alt="White Cross Logo"
              data-cy="logo"
              className="h-16 w-16"
              onError={(e) => {
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

        <div className="card p-8" id="main">
          <LoginFormFields
            register={register}
            errors={errors}
            loading={loading}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleSubmit(onSubmit, onError)}
            authError={authError}
          />
        </div>

        <div className="text-center text-sm text-gray-600" data-cy="hipaa-notice">
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
