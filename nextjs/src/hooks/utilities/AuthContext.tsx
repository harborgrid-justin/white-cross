/**
 * WF-COMP-113 | AuthContext.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/api, ../types, ../components/SessionExpiredModal | Dependencies: ../services/api, ../types, ../components/SessionExpiredModal
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions | Key Features: useState, useEffect, useContext
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../../services/api'
import { User } from '../../types'
import { SessionExpiredModal } from '@/components/shared/security/SessionExpiredModal'
import { tokenSecurityManager, legacyTokenUtils, validateTokenFormat, isTokenExpired } from '../../utils/tokenSecurity'

// Extend Window interface for Cypress
declare global {
  interface Window {
    Cypress?: {
      env: (key: string) => string | undefined
      config: (key: string) => unknown
    }
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  expireSession: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false)

  const expireSession = () => {
    const token = legacyTokenUtils.getToken()

    // Clear all token storage (both secure and legacy)
    tokenSecurityManager.clearToken()
    setUser(null)

    // Only show session expired modal for real tokens, not mock tokens
    if (!token || (!token.startsWith('mock-') || window.Cypress)) {
      setShowSessionExpiredModal(true)
    } else {
      // For mock tokens in non-test environment, just redirect to login
      window.location.href = '/login'
    }
  }

  useEffect(() => {
    // Set up session expire handler for API interceptor
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize secure token manager
        await tokenSecurityManager.init()

        // Check for secure token first
        const secureTokenData = await tokenSecurityManager.getValidToken()
        if (secureTokenData) {
          setUser(secureTokenData.user)
          setLoading(false)
          return
        }

        // Fallback to legacy token storage
        const legacyToken = legacyTokenUtils.getToken()
        if (legacyToken) {
          // Validate token format
          if (!validateTokenFormat(legacyToken) && !legacyToken.startsWith('mock-')) {
            console.warn('Invalid token format detected')
            expireSession()
            setLoading(false)
            return
          }

          // Check for explicitly expired token
          if (legacyToken === 'expired-token') {
            expireSession()
            setLoading(false)
            return
          }

          // Check if JWT token is expired
          if (!legacyToken.startsWith('mock-') && isTokenExpired(legacyToken)) {
            console.warn('Token has expired')
            expireSession()
            setLoading(false)
            return
          }

          // Handle mock tokens for testing
          if (legacyToken.startsWith('mock-') && window.Cypress) {
            const storedUser = legacyTokenUtils.getUser()
            if (storedUser) {
              setUser(storedUser)
              // Migrate to secure storage
              await tokenSecurityManager.storeToken(legacyToken, storedUser)
            }
            setLoading(false)
            return
          }

          // Clear mock tokens when not in test environment
          if (legacyToken.startsWith('mock-') && !window.Cypress) {
            tokenSecurityManager.clearToken()
            setLoading(false)
            return
          }

          // Verify token validity for real tokens
          try {
            const userData = await authApi.verifyToken()
            setUser(userData)
            // Migrate to secure storage
            await tokenSecurityManager.storeToken(legacyToken, userData)
            // Clean up legacy storage
            legacyTokenUtils.removeToken()
            legacyTokenUtils.removeUser()
          } catch (error: any) {
            console.error('Token verification failed:', error)
            // Only expire session if it's an auth error (401, 403)
            // For network errors, just clear loading state and let the user retry
            const isAuthError = error?.response?.status === 401 || error?.response?.status === 403
            if (isAuthError) {
              expireSession()
            } else {
              // Network error - clear token and let user retry login
              tokenSecurityManager.clearToken()
            }
          }
        } else {
          // No token found, user is not authenticated
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // Don't call expireSession on initialization failure, just set loading to false
        setLoading(false)
      }
    }

    initializeAuth()
     
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })

    // Store token securely
    await tokenSecurityManager.storeToken(response.token, response.user)
    setUser(response.user)
  }

  const logout = () => {
    // Clear all token storage
    tokenSecurityManager.clearToken()
    setUser(null)
    setShowSessionExpiredModal(false)
  }

  const handleLoginAgain = () => {
    setShowSessionExpiredModal(false)
    window.location.href = '/login'
  }

  const value = {
    user,
    loading,
    login,
    logout,
    expireSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiredModal 
        isOpen={showSessionExpiredModal}
        onLoginAgain={handleLoginAgain}
      />
    </AuthContext.Provider>
  )
}