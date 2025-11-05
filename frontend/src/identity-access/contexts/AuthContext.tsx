'use client';

/**
 * Authentication Context - HIPAA-Compliant Session Management
 *
 * Provides centralized authentication state management with:
 * - JWT token management via HTTP-only secure cookies
 * - Automatic token refresh before expiration
 * - Session timeout enforcement (15 min idle for HIPAA)
 * - Multi-tab synchronization via BroadcastChannel (when available)
 * - Audit logging for authentication events
 * - Secure storage practices (no PHI in localStorage)
 * - Edge Runtime compatible (graceful fallback when BroadcastChannel unavailable)
 *
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  logoutUser,
  refreshAuthToken,
  setUserFromSession,
  clearAuthError,
} from '@/identity-access/stores/authSlice';
import { AppDispatch, RootState } from '@/stores/store';
import type { User } from '@/types';
import { SessionWarningModal } from '@/identity-access/components/session';

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

  // Local state for activity tracking - initialize with 0 to avoid SSR hydration mismatch
  const [lastActivityAt, setLastActivityAt] = useState<number>(0);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Refs for intervals and broadcast channel
  const activityCheckInterval = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tokenRefreshInterval = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const isBroadcastChannelSupported = useRef<boolean>(false);

  // ==========================================
  // HYDRATION HANDLING
  // ==========================================

  // Handle client-side hydration to avoid SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
    setLastActivityAt(Date.now());
  }, []);

  // ==========================================
  // ACTIVITY TRACKING
  // ==========================================

  const updateActivity = useCallback(() => {
    if (!isHydrated) return; // Don't update activity until hydrated
    
    const now = Date.now();
    setLastActivityAt(now);

    // Broadcast activity to other tabs (only if supported)
    if (isBroadcastChannelSupported.current && broadcastChannel.current) {
      try {
        broadcastChannel.current.postMessage({
          type: 'activity_update',
          timestamp: now,
        });
      } catch (error) {
        console.warn('[Auth] Failed to broadcast activity:', error);
      }
    }
  }, [isHydrated]);

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
    if (!isAuthenticated || !isHydrated) return false;

    const now = Date.now();
    const idleTime = now - lastActivityAt;

    // Don't check session until we have a valid lastActivityAt
    if (lastActivityAt === 0) return true;

    // Check HIPAA idle timeout
    if (idleTime >= HIPAA_IDLE_TIMEOUT) {
      console.warn('[Auth] Session timeout due to inactivity');
      dispatch(logoutUser(undefined));
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
      dispatch(logoutUser(undefined));
      router.push('/session-expired?reason=token');
      return false;
    }

    return true;
  }, [isAuthenticated, isHydrated, lastActivityAt, sessionExpiresAt, showSessionWarning, dispatch, router]);

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
      dispatch(logoutUser(undefined));
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
    // Only initialize BroadcastChannel in browser environment where it's supported
    if (typeof window === 'undefined') return;

    // Check if BroadcastChannel is available via window (not available in Edge Runtime)
    // Using window/globalThis reference prevents static analysis issues
    const BroadcastChannelConstructor = (typeof window !== 'undefined' && 'BroadcastChannel' in window)
      ? (window as typeof globalThis & { BroadcastChannel: typeof BroadcastChannel }).BroadcastChannel
      : undefined;

    if (!BroadcastChannelConstructor) {
      console.info('[Auth] BroadcastChannel not available - multi-tab sync disabled');
      isBroadcastChannelSupported.current = false;
      return;
    }

    try {
      // Create broadcast channel for cross-tab communication using dynamic constructor
      broadcastChannel.current = new BroadcastChannelConstructor(BROADCAST_CHANNEL_NAME);
      isBroadcastChannelSupported.current = true;

      // Handle messages from other tabs
      broadcastChannel.current.onmessage = (event: MessageEvent) => {
        const { type, timestamp } = event.data;

        switch (type) {
          case 'logout':
            // Sync logout across tabs
            dispatch(logoutUser(undefined));
            router.push('/login');
            break;

          case 'login':
            // Sync login across tabs
            if (event.data.user) {
              dispatch(setUserFromSession(event.data.user));
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
    } catch (error) {
      console.warn('[Auth] Failed to initialize BroadcastChannel:', error);
      isBroadcastChannelSupported.current = false;
      broadcastChannel.current = null;
    }

    return () => {
      if (broadcastChannel.current) {
        try {
          broadcastChannel.current.close();
        } catch (error) {
          console.warn('[Auth] Error closing BroadcastChannel:', error);
        }
        broadcastChannel.current = null;
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

      // Broadcast login to other tabs (only if supported)
      if (isBroadcastChannelSupported.current && broadcastChannel.current) {
        try {
          broadcastChannel.current.postMessage({
            type: 'login',
            user: result.user,
          });
        } catch (error) {
          console.warn('[Auth] Failed to broadcast login:', error);
        }
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
      await dispatch(logoutUser(undefined)).unwrap();

      // Broadcast logout to other tabs (only if supported)
      if (isBroadcastChannelSupported.current && broadcastChannel.current) {
        try {
          broadcastChannel.current.postMessage({ type: 'logout' });
        } catch (error) {
          console.warn('[Auth] Failed to broadcast logout:', error);
        }
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

  const value: AuthContextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  // Calculate time remaining for SessionWarningModal
  const timeRemainingSeconds = useMemo(() => {
    if (!isHydrated || lastActivityAt === 0) return 120; // Default 2 minutes
    const timeRemaining = HIPAA_IDLE_TIMEOUT - (Date.now() - lastActivityAt);
    return Math.floor(Math.max(0, timeRemaining) / 1000);
  }, [lastActivityAt, isHydrated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showSessionWarning && (
        <SessionWarningModal
          isOpen={showSessionWarning}
          timeRemainingSeconds={timeRemainingSeconds}
          onExtendSession={() => {
            updateActivity();
            setShowSessionWarning(false);
          }}
          onLogout={logout}
        />
      )}
    </AuthContext.Provider>
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
