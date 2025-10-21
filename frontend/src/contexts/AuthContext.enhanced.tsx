/**
 * WF-COMP-AUTH-ENHANCED-001 | AuthContext.enhanced.tsx - Enhanced Authentication Context
 * Purpose: Authentication context with full integration of new security services
 *
 * Features:
 * - Integrates with SecureTokenManager
 * - Audit logging for all auth events
 * - CSRF token management
 * - Session timeout handling
 * - PHI cache clearing on logout
 *
 * Last Updated: 2025-10-21 | File Type: .tsx
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../services/modules/authApi';
import { User } from '../types';
import SessionExpiredModal from '../components/SessionExpiredModal';
import { secureTokenManager } from '../services/security/SecureTokenManager';
import { csrfProtection } from '../services/security/CsrfProtection';
import { auditService, initializeAuditService, cleanupAuditService } from '../services/audit/AuditService';
import { clearPHICache } from '../config/queryClient';
import toast from 'react-hot-toast';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  expireSession: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==========================================
// HOOK
// ==========================================

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// ==========================================
// PROVIDER COMPONENT
// ==========================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  /**
   * Expire session - called on token expiration or logout
   */
  const expireSession = useCallback(() => {
    const wasAuthenticated = !!user;

    // Clear user state
    setUser(null);

    // Clear all tokens
    secureTokenManager.clearTokens();

    // Clear CSRF token
    csrfProtection.clearToken();

    // Clear PHI data from cache
    clearPHICache();

    // Cleanup audit service
    cleanupAuditService();

    // Log session expiration
    if (wasAuthenticated) {
      auditService.log({
        action: 'SESSION_EXPIRED',
        resourceType: 'AUTHENTICATION',
        status: 'SUCCESS',
      });
    }

    // Show session expired modal if user was logged in
    if (wasAuthenticated) {
      setShowSessionExpiredModal(true);
    }
  }, [user]);

  /**
   * Check session timeout periodically
   */
  useEffect(() => {
    // Check every minute for session timeout
    const interval = setInterval(() => {
      if (user && !secureTokenManager.isTokenValid()) {
        console.warn('[AuthContext] Session timeout detected');
        expireSession();
      }
    }, 60 * 1000); // 60 seconds

    return () => clearInterval(interval);
  }, [user, expireSession]);

  /**
   * Initialize authentication on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Check if we have a valid token
        const token = secureTokenManager.getToken();

        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token with backend
        try {
          const userData = await authApi.verifyToken();

          // Set user state
          setUser(userData);

          // Initialize audit service with user context
          initializeAuditService(userData);

          // Refresh CSRF token
          csrfProtection.refreshToken();

          // Log successful session restoration
          await auditService.log({
            action: 'SESSION_RESTORED',
            resourceType: 'AUTHENTICATION',
            status: 'SUCCESS',
            context: {
              userId: userData.id,
              userEmail: userData.email,
            },
          });
        } catch (error: any) {
          console.error('[AuthContext] Token verification failed:', error);

          // Clear invalid token
          secureTokenManager.clearTokens();

          // Only show error for auth failures (not network errors)
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            expireSession();
          }
        }
      } catch (error) {
        console.error('[AuthContext] Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [expireSession]);

  /**
   * Login user
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      // Call login API
      const response = await authApi.login({ email, password });

      // Store token using SecureTokenManager
      secureTokenManager.setToken(
        response.token,
        response.refreshToken,
        response.expiresIn
      );

      // Refresh CSRF token
      csrfProtection.refreshToken();

      // Set user state
      setUser(response.user);

      // Initialize audit service with user context
      initializeAuditService(response.user);

      // Log successful login
      await auditService.log({
        action: 'LOGIN',
        resourceType: 'AUTHENTICATION',
        status: 'SUCCESS',
        context: {
          userId: response.user.id,
          userEmail: response.user.email,
          userRole: response.user.role,
        },
      });

      // Show success message
      toast.success(`Welcome back, ${response.user.firstName}!`);
    } catch (error: any) {
      // Log failed login attempt
      await auditService.log({
        action: 'LOGIN',
        resourceType: 'AUTHENTICATION',
        status: 'FAILURE',
        context: {
          attemptedEmail: email,
          errorMessage: error.message,
        },
      });

      // Re-throw error for component to handle
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Log logout event
      await auditService.log({
        action: 'LOGOUT',
        resourceType: 'AUTHENTICATION',
        status: 'SUCCESS',
      });

      // Flush pending audit events
      await auditService.flush();

      // Call backend logout endpoint
      try {
        await authApi.logout();
      } catch (error) {
        // Continue with local logout even if backend fails
        console.warn('[AuthContext] Backend logout failed, continuing with local logout');
      }

      // Clear user state
      setUser(null);

      // Clear all tokens
      secureTokenManager.clearTokens();

      // Clear CSRF token
      csrfProtection.clearToken();

      // Clear PHI data from cache
      clearPHICache();

      // Cleanup audit service
      cleanupAuditService();

      // Close session expired modal if open
      setShowSessionExpiredModal(false);

      // Show logout message
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('[AuthContext] Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  }, []);

  /**
   * Handle login again from session expired modal
   */
  const handleLoginAgain = useCallback(() => {
    setShowSessionExpiredModal(false);
    window.location.href = '/login';
  }, []);

  // Provider value
  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    expireSession,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiredModal
        isOpen={showSessionExpiredModal}
        onLoginAgain={handleLoginAgain}
      />
    </AuthContext.Provider>
  );
}

// ==========================================
// EXPORTS
// ==========================================

export default AuthProvider;
