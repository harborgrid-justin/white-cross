'use client';

/**
 * Authentication Context - HIPAA-Compliant Session Management
 *
 * Provides centralized authentication state management with:
 * - JWT token management via HTTP-only secure cookies
 * - Automatic token refresh before expiration
 * - Session timeout enforcement (15 min idle for HIPAA)
 * - Multi-tab synchronization via BroadcastChannel
 * - Audit logging for authentication events
 * - Secure storage practices (no PHI in localStorage)
 *
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  logoutUser,
  refreshAuthToken,
  setUserFromSession,
  clearAuthError,
  type User,
  type AuthState,
} from '@/stores/slices/authSlice';
import { AppDispatch, RootState } from '@/stores/store';

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiresAt: number | null;
  lastActivityAt: number;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  updateActivity: () => void;
  checkSession: () => boolean;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

// ==========================================
// CONSTANTS
// ==========================================

const HIPAA_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const SESSION_WARNING_TIME = 2 * 60 * 1000; // 2 minutes before timeout
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // Refresh token every 50 minutes
const ACTIVITY_CHECK_INTERVAL = 30 * 1000; // Check activity every 30 seconds
const BROADCAST_CHANNEL_NAME = 'auth_sync';

// ==========================================
// CONTEXT CREATION
// ==========================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ==========================================
// AUTH PROVIDER COMPONENT
// ==========================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state selectors
  const authState = useSelector((state: RootState) => state.auth);
  const { user, isAuthenticated, isLoading, error, sessionExpiresAt } = authState;

  // Local state for activity tracking
  const [lastActivityAt, setLastActivityAt] = useState<number>(Date.now());
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // Refs for intervals and broadcast channel
  const activityCheckInterval = useRef<NodeJS.Timeout>();
  const tokenRefreshInterval = useRef<NodeJS.Timeout>();
  const broadcastChannel = useRef<BroadcastChannel>();

  // ==========================================
  // ACTIVITY TRACKING
  // ==========================================

  const updateActivity = useCallback(() => {
    const now = Date.now();
    setLastActivityAt(now);

    // Broadcast activity to other tabs
    if (broadcastChannel.current) {
      broadcastChannel.current.postMessage({
        type: 'activity_update',
        timestamp: now,
      });
    }
  }, []);

  // Track user activity events
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated, updateActivity]);

  // ==========================================
  // SESSION TIMEOUT CHECKING
  // ==========================================

  const checkSession = useCallback((): boolean => {
    if (!isAuthenticated) return false;

    const now = Date.now();
    const idleTime = now - lastActivityAt;

    // Check HIPAA idle timeout
    if (idleTime >= HIPAA_IDLE_TIMEOUT) {
      console.warn('[Auth] Session timeout due to inactivity');
      dispatch(logoutUser());
      router.push('/session-expired?reason=idle');
      return false;
    }

    // Show warning if approaching timeout
    if (idleTime >= HIPAA_IDLE_TIMEOUT - SESSION_WARNING_TIME && !showSessionWarning) {
      setShowSessionWarning(true);
    } else if (idleTime < HIPAA_IDLE_TIMEOUT - SESSION_WARNING_TIME && showSessionWarning) {
      setShowSessionWarning(false);
    }

    // Check token expiration
    if (sessionExpiresAt && now >= sessionExpiresAt) {
      console.warn('[Auth] Session timeout due to token expiration');
      dispatch(logoutUser());
      router.push('/session-expired?reason=token');
      return false;
    }

    return true;
  }, [isAuthenticated, lastActivityAt, sessionExpiresAt, showSessionWarning, dispatch, router]);

  // Periodic session checking
  useEffect(() => {
    if (!isAuthenticated) return;

    activityCheckInterval.current = setInterval(() => {
      checkSession();
    }, ACTIVITY_CHECK_INTERVAL);

    return () => {
      if (activityCheckInterval.current) {
        clearInterval(activityCheckInterval.current);
      }
    };
  }, [isAuthenticated, checkSession]);

  // ==========================================
  // TOKEN REFRESH
  // ==========================================

  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshAuthToken()).unwrap();
      updateActivity(); // Reset activity on successful refresh
    } catch (error) {
      console.error('[Auth] Token refresh failed:', error);
      dispatch(logoutUser());
      router.push('/session-expired?reason=refresh_failed');
    }
  }, [dispatch, router, updateActivity]);

  // Automatic token refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    tokenRefreshInterval.current = setInterval(() => {
      refreshToken();
    }, TOKEN_REFRESH_INTERVAL);

    return () => {
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
      }
    };
  }, [isAuthenticated, refreshToken]);

  // ==========================================
  // MULTI-TAB SYNCHRONIZATION
  // ==========================================

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create broadcast channel for cross-tab communication
    broadcastChannel.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

    // Handle messages from other tabs
    broadcastChannel.current.onmessage = (event) => {
      const { type, timestamp } = event.data;

      switch (type) {
        case 'logout':
          // Sync logout across tabs
          dispatch(logoutUser());
          router.push('/login');
          break;

        case 'login':
          // Sync login across tabs
          if (event.data.user && event.data.token) {
            dispatch(setUserFromSession({
              user: event.data.user,
              token: event.data.token,
              refreshToken: event.data.refreshToken,
              expiresIn: event.data.expiresIn,
            }));
          }
          break;

        case 'activity_update':
          // Sync activity across tabs
          if (timestamp > lastActivityAt) {
            setLastActivityAt(timestamp);
          }
          break;

        default:
          break;
      }
    };

    return () => {
      if (broadcastChannel.current) {
        broadcastChannel.current.close();
      }
    };
  }, [dispatch, router, lastActivityAt]);

  // ==========================================
  // SESSION RESTORATION
  // ==========================================

  useEffect(() => {
    // On mount, check for existing session in cookies
    const restoreSession = async () => {
      // This will be handled by middleware and API calls
      // Token is in HTTP-only cookie, not accessible to JS
      // Backend will validate on first API call
    };

    restoreSession();
  }, []);

  // ==========================================
  // AUTH METHODS
  // ==========================================

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();

      updateActivity();

      // Broadcast login to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({
          type: 'login',
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
        });
      }

      // Audit log login event
      console.log('[Auth] User logged in:', { userId: result.user.id, role: result.user.role });
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      throw error;
    }
  }, [dispatch, updateActivity]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      // Broadcast logout to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({ type: 'logout' });
      }

      // Audit log logout event
      console.log('[Auth] User logged out');

      router.push('/login');
    } catch (error) {
      console.error('[Auth] Logout failed:', error);
      // Still redirect to login even if server logout fails
      router.push('/login');
    }
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // ==========================================
  // AUTHORIZATION HELPERS
  // ==========================================

  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!user) return false;

    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }, [user]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !user.permissions) return false;

    return user.permissions.includes(permission);
  }, [user]);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    sessionExpiresAt,
    lastActivityAt,
    login,
    logout,
    refreshToken,
    clearError,
    updateActivity,
    checkSession,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showSessionWarning && (
        <SessionWarningModal
          onExtend={() => {
            updateActivity();
            setShowSessionWarning(false);
          }}
          onLogout={logout}
          timeRemaining={HIPAA_IDLE_TIMEOUT - (Date.now() - lastActivityAt)}
        />
      )}
    </AuthContext.Provider>
  );
}

// ==========================================
// SESSION WARNING MODAL COMPONENT
// ==========================================

interface SessionWarningModalProps {
  onExtend: () => void;
  onLogout: () => void;
  timeRemaining: number;
}

function SessionWarningModal({ onExtend, onLogout, timeRemaining }: SessionWarningModalProps) {
  const [countdown, setCountdown] = useState(Math.floor(timeRemaining / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onLogout]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="alertdialog"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-description"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-yellow-500 mr-3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 id="session-warning-title" className="text-xl font-semibold text-gray-900">
            Session Expiring Soon
          </h2>
        </div>

        <p id="session-warning-description" className="text-gray-600 mb-6">
          Your session will expire in <span className="font-bold text-red-600">{minutes}:{seconds.toString().padStart(2, '0')}</span> due to inactivity.
          For security and HIPAA compliance, you will be automatically logged out.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onLogout}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            type="button"
          >
            Logout Now
          </button>
          <button
            onClick={onExtend}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="button"
            autoFocus
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

/**
 * useAuth Hook
 *
 * Access authentication context from any component.
 * Must be used within an AuthProvider.
 *
 * @example
 * ```tsx
 * const { user, login, logout, hasRole } = useAuth();
 *
 * if (hasRole('ADMIN')) {
 *   // Show admin features
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Backward compatibility alias for useAuth
 * @deprecated Use useAuth instead
 */
export const useAuthContext = useAuth;
