/**
 * Login Page - White Cross Healthcare Platform
 * Secure authentication with HIPAA compliance
 * 
 * @fileoverview Login page component with enhanced security features
 * @module pages/auth/Login
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { LoginForm } from './components/LoginForm'
import toast from 'react-hot-toast'

/**
 * Login Page Component
 * 
 * Features:
 * - Secure authentication
 * - Remember me functionality
 * - Password reset integration
 * - Session management
 * - HIPAA compliant logging
 */
const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, user } = useAuthContext()
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await login(loginData.email, loginData.password, loginData.rememberMe)
      
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
      
      toast.success('Welcome back!')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed. Please check your credentials.')
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            White Cross Healthcare
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <LoginForm
          loginData={loginData}
          loading={loading}
          onSubmit={handleLogin}
          onInputChange={handleInputChange}
        />

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>HIPAA Compliant • Secure • Confidential</p>
        </div>
      </div>
    </div>
  )
}

export default Login
