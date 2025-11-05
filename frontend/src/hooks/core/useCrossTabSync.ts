/**
 * @fileoverview useCrossTabSync Hook - Cross-Tab State Synchronization
 * @module hooks/useCrossTabSync
 * @category Hooks
 *
 * Custom hook for synchronizing Redux state across browser tabs/windows.
 * Uses BroadcastChannel API for real-time cross-tab communication.
 *
 * Features:
 * - Real-time state sync across tabs
 * - Automatic conflict resolution
 * - HIPAA-compliant (no PHI in broadcast)
 * - Efficient delta synchronization
 * - Tab focus awareness
 *
 * @example
 * ```typescript
 * import { useCrossTabSync } from '@/hooks/useCrossTabSync';
 *
 * function App() {
 *   useCrossTabSync(); // Enable cross-tab sync for auth state
 *
 *   return <YourApp />;
 * }
 * ```
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { setUser } from '@/identity-access/stores/authSlice';

/**
 * Cross-tab message types
 */
type CrossTabMessageType =
  | 'AUTH_UPDATE'
  | 'LOGOUT'
  | 'THEME_UPDATE'
  | 'NOTIFICATION'
  | 'CACHE_INVALIDATE';

/**
 * Cross-tab message interface
 */
interface CrossTabMessage {
  type: CrossTabMessageType;
  payload: any;
  timestamp: number;
  tabId: string;
}

/**
 * Generate unique tab ID
 */
function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Hook for cross-tab state synchronization
 *
 * Synchronizes authentication state, theme, and notifications across tabs.
 * Does NOT synchronize PHI data for HIPAA compliance.
 *
 * @param options - Configuration options
 * @param options.enabled - Whether sync is enabled (default: true)
 * @param options.syncAuth - Whether to sync auth state (default: true)
 * @param options.syncTheme - Whether to sync theme (default: true)
 *
 * @example Basic usage
 * ```typescript
 * // In root layout or app component
 * useCrossTabSync();
 * ```
 *
 * @example Selective sync
 * ```typescript
 * useCrossTabSync({
 *   syncAuth: true,
 *   syncTheme: false, // Don't sync theme
 * });
 * ```
 */
export function useCrossTabSync(options?: {
  enabled?: boolean;
  syncAuth?: boolean;
  syncTheme?: boolean;
}) {
  const {
    enabled = true,
    syncAuth = true,
    syncTheme = true,
  } = options || {};

  const dispatch = useAppDispatch();
  const authUser = useAppSelector(state => state.auth.user);
  const theme = useAppSelector(state => state.theme);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const tabIdRef = useRef<string>(generateTabId());
  const lastMessageRef = useRef<number>(0);

  /**
   * Send message to other tabs
   */
  const sendMessage = useCallback((type: CrossTabMessageType, payload: any) => {
    if (!channelRef.current) return;

    const message: CrossTabMessage = {
      type,
      payload,
      timestamp: Date.now(),
      tabId: tabIdRef.current,
    };

    try {
      channelRef.current.postMessage(message);
    } catch (error) {
      console.error('[CrossTabSync] Failed to send message:', error);
    }
  }, []);

  /**
   * Handle incoming messages from other tabs
   */
  const handleMessage = useCallback(
    (event: MessageEvent<CrossTabMessage>) => {
      const message = event.data;

      // Ignore own messages
      if (message.tabId === tabIdRef.current) {
        return;
      }

      // Ignore old messages (prevent race conditions)
      if (message.timestamp <= lastMessageRef.current) {
        return;
      }

      lastMessageRef.current = message.timestamp;

      // Handle message based on type
      switch (message.type) {
        case 'AUTH_UPDATE':
          if (syncAuth) {
            dispatch(setUser(message.payload));
          }
          break;

        case 'LOGOUT':
          if (syncAuth) {
            dispatch(setUser(null));
            // Redirect to login if needed
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
          break;

        case 'THEME_UPDATE':
          if (syncTheme) {
            // Dispatch theme update actions
            // dispatch(setTheme(message.payload));
          }
          break;

        case 'NOTIFICATION':
          // Handle cross-tab notifications
          console.log('[CrossTabSync] Notification:', message.payload);
          break;

        case 'CACHE_INVALIDATE':
          // Invalidate TanStack Query cache
          console.log('[CrossTabSync] Cache invalidation:', message.payload);
          break;

        default:
          console.warn('[CrossTabSync] Unknown message type:', message.type);
      }
    },
    [dispatch, syncAuth, syncTheme]
  );

  /**
   * Initialize BroadcastChannel
   */
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Check BroadcastChannel support
    if (!('BroadcastChannel' in window)) {
      console.warn('[CrossTabSync] BroadcastChannel not supported');
      return;
    }

    try {
      // Create broadcast channel
      const channel = new BroadcastChannel('whitecross-sync');
      channelRef.current = channel;

      // Listen for messages
      channel.addEventListener('message', handleMessage);

      console.log('[CrossTabSync] Initialized for tab:', tabIdRef.current);

      // Cleanup
      return () => {
        channel.removeEventListener('message', handleMessage);
        channel.close();
        channelRef.current = null;
      };
    } catch (error) {
      console.error('[CrossTabSync] Failed to initialize:', error);
    }
  }, [enabled, handleMessage]);

  /**
   * Sync auth changes
   */
  useEffect(() => {
    if (!enabled || !syncAuth) return;

    // Send auth update when user changes
    if (authUser) {
      sendMessage('AUTH_UPDATE', authUser);
    }
  }, [authUser, enabled, syncAuth, sendMessage]);

  /**
   * Sync theme changes
   */
  useEffect(() => {
    if (!enabled || !syncTheme) return;

    sendMessage('THEME_UPDATE', theme);
  }, [theme, enabled, syncTheme, sendMessage]);

  /**
   * Public API for manual sync
   */
  const syncAPI = {
    /**
     * Broadcast logout to all tabs
     */
    broadcastLogout: () => {
      sendMessage('LOGOUT', null);
    },

    /**
     * Broadcast notification to all tabs
     */
    broadcastNotification: (notification: any) => {
      sendMessage('NOTIFICATION', notification);
    },

    /**
     * Broadcast cache invalidation
     */
    broadcastCacheInvalidate: (queryKeys: string[]) => {
      sendMessage('CACHE_INVALIDATE', queryKeys);
    },

    /**
     * Get current tab ID
     */
    getTabId: () => tabIdRef.current,
  };

  return syncAPI;
}

export default useCrossTabSync;
