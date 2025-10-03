import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'
import { authApi, setSessionExpireHandler } from '../services/api'
import SessionExpiredModal from '../components/SessionExpiredModal'

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
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    setUser(null)
    setShowSessionExpiredModal(true)
  }

  useEffect(() => {
    // Set up session expire handler for API interceptor
    setSessionExpireHandler(expireSession)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (token) {
      // Check for expired token
      if (token === 'expired-token') {
        expireSession()
        setLoading(false)
        return
      }
      
      // Verify token validity
      authApi.verifyToken()
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('authToken')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    localStorage.setItem('token', response.token)
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
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