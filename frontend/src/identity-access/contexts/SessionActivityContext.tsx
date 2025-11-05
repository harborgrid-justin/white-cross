'use client';

/**
 * @fileoverview Session Activity Context - Isolated Activity Tracking
 * @module identity-access/contexts/SessionActivityContext
 *
 * PERFORMANCE OPTIMIZATION: This context is SEPARATE from auth data to prevent
 * widespread re-renders. lastActivityAt updates on every mouse movement, so only
 * components explicitly consuming this context will re-render.
 *
 * @example
 * ```tsx
 * import { useSessionActivity } from '@/identity-access/hooks/state/useSessionActivity';
 *
 * function SessionWarning() {
 *   const { lastActivityAt, isSessionWarningVisible } = useSessionActivity();
 *   // This component re-renders on activity, but auth data consumers don't
 * }
 * ```
 */

import React, { createContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/identity-access/stores/authSlice';
import { useAuthStatus } from '@/identity-access/hooks/state/useAuthStatus';
import type { AppDispatch } from '@/stores/store';

// ==========================================
// CONSTANTS
// ==========================================

const HIPAA_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const SESSION_WARNING_TIME = 2 * 60 * 1000; // 2 minutes before timeout
const ACTIVITY_CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds
const BROADCAST_CHANNEL_NAME = 'auth_activity_sync';

// ==========================================
// TYPES
// ==========================================

export interface SessionActivityContextValue {
  lastActivityAt: number;
  updateActivity: () => void;
  checkSession: () => boolean;
  isSessionWarningVisible: boolean;
}

export const SessionActivityContext = createContext<SessionActivityContextValue | undefined>(
  undefined
);

// ==========================================
// PROVIDER COMPONENT
// ==========================================

interface SessionActivityProviderProps {
  children: React.ReactNode;
}

export function SessionActivityProvider({ children }: SessionActivityProviderProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, sessionExpiresAt } = useAuthStatus();

  // Local state - initialize with 0 to avoid SSR hydration mismatch
  const [lastActivityAt, setLastActivityAt] = useState<number>(0);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Refs
  const activityCheckInterval = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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
  // ACTIVITY TRACKING
  // ==========================================

  const updateActivity = useCallback(() => {
    if (!isHydrated) return;

    const now = Date.now();
    setLastActivityAt(now);

    // Broadcast activity to other tabs
    if (isBroadcastChannelSupported.current && broadcastChannel.current) {
      try {
        broadcastChannel.current.postMessage({
          type: 'activity_update',
          timestamp: now,
        });
      } catch (error) {
        console.warn('[SessionActivity] Failed to broadcast activity:', error);
      }
    }
  }, [isHydrated]);

  // Track user activity events
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
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

    // Don't check until we have valid lastActivityAt
    if (lastActivityAt === 0) return true;

    // Check HIPAA idle timeout
    if (idleTime >= HIPAA_IDLE_TIMEOUT) {
      console.warn('[SessionActivity] Session timeout due to inactivity');
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

    // Check token expiration (from Redux auth state)
    if (sessionExpiresAt && now >= sessionExpiresAt) {
      console.warn('[SessionActivity] Session timeout due to token expiration');
      dispatch(logoutUser(undefined));
      router.push('/session-expired?reason=token');
      return false;
    }

    return true;
  }, [isAuthenticated, isHydrated, lastActivityAt, sessionExpiresAt, showSessionWarning, dispatch, router]);

  // Periodic session checking with STABLE checkSession dependency
  useEffect(() => {
    if (!isAuthenticated) return;

    // Clear any existing interval
    if (activityCheckInterval.current) {
      clearInterval(activityCheckInterval.current);
    }

    // Create new interval
    activityCheckInterval.current = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL);

    // Cleanup
    return () => {
      if (activityCheckInterval.current) {
        clearInterval(activityCheckInterval.current);
      }
    };
  }, [isAuthenticated, checkSession]); // checkSession is now stable due to useCallback

  // ==========================================
  // CROSS-TAB SYNC
  // ==========================================

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check BroadcastChannel availability
    const BroadcastChannelConstructor =
      typeof window !== 'undefined' && 'BroadcastChannel' in window
        ? (window as typeof globalThis & { BroadcastChannel: typeof BroadcastChannel })
            .BroadcastChannel
        : undefined;

    if (!BroadcastChannelConstructor) {
      console.info('[SessionActivity] BroadcastChannel not available');
      isBroadcastChannelSupported.current = false;
      return;
    }

    try {
      broadcastChannel.current = new BroadcastChannelConstructor(BROADCAST_CHANNEL_NAME);
      isBroadcastChannelSupported.current = true;

      broadcastChannel.current.onmessage = (event: MessageEvent) => {
        const { type, timestamp } = event.data;

        if (type === 'activity_update' && timestamp > lastActivityAt) {
          setLastActivityAt(timestamp);
        }
      };
    } catch (error) {
      console.warn('[SessionActivity] Failed to initialize BroadcastChannel:', error);
      isBroadcastChannelSupported.current = false;
    }

    return () => {
      if (broadcastChannel.current) {
        try {
          broadcastChannel.current.close();
        } catch (error) {
          console.warn('[SessionActivity] Error closing BroadcastChannel:', error);
        }
        broadcastChannel.current = null;
      }
    };
  }, [lastActivityAt]);

  // ==========================================
  // CONTEXT VALUE (memoized)
  // ==========================================

  const value = useMemo<SessionActivityContextValue>(
    () => ({
      lastActivityAt,
      updateActivity,
      checkSession,
      isSessionWarningVisible: showSessionWarning,
    }),
    [lastActivityAt, updateActivity, checkSession, showSessionWarning]
  );

  return (
    <SessionActivityContext.Provider value={value}>
      {children}
      {showSessionWarning && (
        <SessionWarningModal
          onExtend={() => {
            updateActivity();
            setShowSessionWarning(false);
          }}
          onLogout={() => {
            dispatch(logoutUser(undefined));
            router.push('/login');
          }}
          lastActivityAt={lastActivityAt}
          isHydrated={isHydrated}
        />
      )}
    </SessionActivityContext.Provider>
  );
}

// ==========================================
// SESSION WARNING MODAL
// ==========================================

interface SessionWarningModalProps {
  onExtend: () => void;
  onLogout: () => void;
  lastActivityAt: number;
  isHydrated: boolean;
}

function SessionWarningModal({
  onExtend,
  onLogout,
  lastActivityAt,
  isHydrated,
}: SessionWarningModalProps) {
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (isHydrated && lastActivityAt > 0) {
      const timeRemaining = HIPAA_IDLE_TIMEOUT - (Date.now() - lastActivityAt);
      setCountdown(Math.floor(Math.max(0, timeRemaining) / 1000));
    }
  }, [lastActivityAt, isHydrated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
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
          Your session will expire in{' '}
          <span className="font-bold text-red-600">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>{' '}
          due to inactivity. For security and HIPAA compliance, you will be automatically logged
          out.
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
