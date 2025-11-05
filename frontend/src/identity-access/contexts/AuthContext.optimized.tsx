'use client';

/**
 * Optimized Authentication Context - HIPAA-Compliant Session Management
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Split into two contexts to prevent unnecessary re-renders
 * - AuthDataContext: Stable auth data (user, isAuthenticated) - rarely changes
 * - SessionActivityContext: Activity tracking - changes frequently
 * - Memoized context values and callbacks
 * - Throttled activity updates (max once per second)
 * - Stable interval references
 * - Lazy-loaded SessionWarningModal
 *
 * @module contexts/AuthContext
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  lazy,
  Suspense
} from 'react';
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
import { useThrottle } from '@/identity-access/hooks/performance';

// Lazy load SessionWarningModal for code splitting
const SessionWarningModal = lazy(() =>
  import('./SessionWarningModal').then(module => ({ default: module.SessionWarningModal }))
);

// ==========================================
// TYPES & INTERFACES
// ==========================================

// Stable auth data (rarely changes)
interface AuthDataContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiresAt: number | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Activity tracking (changes frequently)
interface SessionActivityContextValue {
  lastActivityAt: number;
  updateActivity: () => void;
  checkSession: () => boolean;
}

// ==========================================
// CONSTANTS
// ==========================================

const HIPAA_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const SESSION_WARNING_TIME = 2 * 60 * 1000; // 2 minutes before timeout
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // Refresh token every 50 minutes
const ACTIVITY_CHECK_INTERVAL = 30 * 1000; // Check activity every 30 seconds
const ACTIVITY_UPDATE_THROTTLE = 1000; // Throttle activity updates to max once per second
const BROADCAST_CHANNEL_NAME = 'auth_sync';

// ==========================================
// CONTEXT CREATION
// ==========================================

const AuthDataContext = createContext<AuthDataContextValue | undefined>(undefined);
const SessionActivityContext = createContext<SessionActivityContextValue | undefined>(undefined);

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

  useEffect(() => {
    setIsHydrated(true);
    setLastActivityAt(Date.now());
  }, []);

  // ==========================================
  // ACTIVITY TRACKING (OPTIMIZED)
  // ==========================================

  // Memoized activity update function (stable reference)
  const updateActivityInternal = useCallback(() => {
    if (!isHydrated) return;

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

  // Throttled activity update (max once per second)
  const updateActivity = useThrottle(updateActivityInternal, ACTIVITY_UPDATE_THROTTLE);

  // Track user activity events
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Use passive listeners for better scroll performance
    const options: AddEventListenerOptions = { passive: true };

    events.forEach(event => {
      window.addEventListener(event, updateActivity, options);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated, updateActivity]);

  // ==========================================
  // SESSION TIMEOUT CHECKING (OPTIMIZED)
  // ==========================================

  // Memoized session check with stable reference
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
  }, [
    isAuthenticated,
    isHydrated,
    lastActivityAt,
    sessionExpiresAt,
    showSessionWarning,
    dispatch,
    router
  ]);

  // Periodic session checking with stable reference
  useEffect(() => {
    if (!isAuthenticated) return;

    activityCheckInterval.current = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL);

    return () => {
      if (activityCheckInterval.current) {
        clearInterval(activityCheckInterval.current);
      }
    };
  }, [isAuthenticated, checkSession]);

  // ==========================================
  // TOKEN REFRESH (OPTIMIZED)
  // ==========================================

  // Memoized refresh token with stable reference
  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshAuthToken()).unwrap();
      updateActivityInternal(); // Reset activity on successful refresh
    } catch (error) {
      console.error('[Auth] Token refresh failed:', error);
      dispatch(logoutUser(undefined));
      router.push('/session-expired?reason=refresh_failed');
    }
  }, [dispatch, router, updateActivityInternal]);

  // Automatic token refresh with stable reference
  useEffect(() => {
    if (!isAuthenticated) return;

    tokenRefreshInterval.current = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);

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

    const BroadcastChannelConstructor = (typeof window !== 'undefined' && 'BroadcastChannel' in window)
      ? (window as typeof globalThis & { BroadcastChannel: typeof BroadcastChannel }).BroadcastChannel
      : undefined;

    if (!BroadcastChannelConstructor) {
      console.info('[Auth] BroadcastChannel not available - multi-tab sync disabled');
      isBroadcastChannelSupported.current = false;
      return;
    }

    try {
      broadcastChannel.current = new BroadcastChannelConstructor(BROADCAST_CHANNEL_NAME);
      isBroadcastChannelSupported.current = true;

      broadcastChannel.current.onmessage = (event: MessageEvent) => {
        const { type, timestamp } = event.data;

        switch (type) {
          case 'logout':
            dispatch(logoutUser(undefined));
            router.push('/login');
            break;

          case 'login':
            if (event.data.user) {
              dispatch(setUserFromSession(event.data.user));
            }
            break;

          case 'activity_update':
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
  // AUTH METHODS (MEMOIZED)
  // ==========================================

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();

      updateActivityInternal();

      // Broadcast login to other tabs
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

      console.log('[Auth] User logged in:', { userId: result.user.id, role: result.user.role });
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      throw error;
    }
  }, [dispatch, updateActivityInternal]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser(undefined)).unwrap();

      // Broadcast logout to other tabs
      if (isBroadcastChannelSupported.current && broadcastChannel.current) {
        try {
          broadcastChannel.current.postMessage({ type: 'logout' });
        } catch (error) {
          console.warn('[Auth] Failed to broadcast logout:', error);
        }
      }

      console.log('[Auth] User logged out');
      router.push('/login');
    } catch (error) {
      console.error('[Auth] Logout failed:', error);
      router.push('/login');
    }
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // ==========================================
  // AUTHORIZATION HELPERS (MEMOIZED)
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
  // MEMOIZED CONTEXT VALUES (CRITICAL)
  // ==========================================

  // Stable auth data context (only changes when user/auth state changes)
  const authDataValue: AuthDataContextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    error,
    sessionExpiresAt,
    login,
    logout,
    refreshToken,
    clearError,
    hasRole,
    hasPermission,
  }), [
    user,
    isAuthenticated,
    isLoading,
    error,
    sessionExpiresAt,
    login,
    logout,
    refreshToken,
    clearError,
    hasRole,
    hasPermission,
  ]);

  // Activity context (changes frequently, separated from auth data)
  const sessionActivityValue: SessionActivityContextValue = useMemo(() => ({
    lastActivityAt,
    updateActivity,
    checkSession,
  }), [lastActivityAt, updateActivity, checkSession]);

  return (
    <AuthDataContext.Provider value={authDataValue}>
      <SessionActivityContext.Provider value={sessionActivityValue}>
        {children}
        {showSessionWarning && (
          <Suspense fallback={null}>
            <SessionWarningModal
              onExtend={() => {
                updateActivity();
                setShowSessionWarning(false);
              }}
              onLogout={logout}
              lastActivityAt={lastActivityAt}
              isHydrated={isHydrated}
            />
          </Suspense>
        )}
      </SessionActivityContext.Provider>
    </AuthDataContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOKS
// ==========================================

/**
 * useAuth Hook - Access stable auth data
 * Components using this will only re-render when user/auth state changes
 */
export function useAuth(): AuthDataContextValue {
  const context = useContext(AuthDataContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * useSessionActivity Hook - Access activity tracking
 * Components using this will re-render on activity updates (throttled)
 */
export function useSessionActivity(): SessionActivityContextValue {
  const context = useContext(SessionActivityContext);

  if (context === undefined) {
    throw new Error('useSessionActivity must be used within an AuthProvider');
  }

  return context;
}

/**
 * Backward compatibility - combines both contexts
 * @deprecated Use useAuth for auth data or useSessionActivity for activity tracking
 */
export function useAuthContext() {
  const authData = useAuth();
  const sessionActivity = useSessionActivity();

  return {
    ...authData,
    ...sessionActivity,
  };
}
