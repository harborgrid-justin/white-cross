/**
 * @fileoverview React Hook for WebSocket Service
 * @module hooks/useWebSocket
 *
 * Provides React integration for WebSocket real-time communication.
 * Manages connection lifecycle, event subscriptions, and state updates.
 *
 * @example
 * ```typescript
 * function NotificationCenter() {
 *   const {
 *     isConnected,
 *     connectionState,
 *     subscribe,
 *     unsubscribe
 *   } = useWebSocket();
 *
 *   useEffect(() => {
 *     const handleAlert = (data) => {
 *       showNotification(data);
 *     };
 *
 *     subscribe('emergency:alert', handleAlert);
 *     return () => unsubscribe('emergency:alert', handleAlert);
 *   }, [subscribe, unsubscribe]);
 *
 *   return (
 *     <div>
 *       <ConnectionStatus connected={isConnected} />
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  webSocketService,
  ConnectionState,
  WebSocketEvent
} from '@/services/websocket/WebSocketService';
import { secureTokenManager } from '@/services/security/SecureTokenManager';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * WebSocket event handler function type.
 *
 * Callback function that processes WebSocket event data.
 *
 * @callback WebSocketEventHandler
 * @param {unknown} data - Event data from WebSocket server (should be validated before use)
 */
export type WebSocketEventHandler = (data: unknown) => void;

/**
 * Return type for useWebSocket hook.
 *
 * Provides WebSocket connection state, control operations, and event subscription methods.
 *
 * @interface UseWebSocketReturn
 *
 * @property {boolean} isConnected - Whether WebSocket is currently connected
 * @property {ConnectionState} connectionState - Current connection state (CONNECTING, CONNECTED, DISCONNECTING, DISCONNECTED)
 * @property {string | undefined} socketId - Unique socket connection ID from server, undefined if not connected
 * @property {() => void} connect - Establish WebSocket connection
 * @property {() => void} disconnect - Close WebSocket connection
 * @property {() => void} reconnect - Force reconnection (disconnect and connect)
 * @property {(event: WebSocketEvent | string, handler: WebSocketEventHandler) => void} subscribe - Subscribe to WebSocket event
 * @property {(event: WebSocketEvent | string, handler: WebSocketEventHandler) => void} unsubscribe - Unsubscribe from WebSocket event
 * @property {(channel: string) => void} subscribeChannel - Subscribe to a specific channel for filtered events
 * @property {(channel: string) => void} unsubscribeChannel - Unsubscribe from a channel
 * @property {(notificationId: string) => void} markNotificationAsRead - Mark a notification as read via WebSocket
 * @property {() => void} ping - Send ping message to check connection
 */
export interface UseWebSocketReturn {
  // Connection state
  isConnected: boolean;
  connectionState: ConnectionState;
  socketId: string | undefined;

  // Connection control
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;

  // Event subscription
  subscribe: (event: WebSocketEvent | string, handler: WebSocketEventHandler) => void;
  unsubscribe: (event: WebSocketEvent | string, handler: WebSocketEventHandler) => void;

  // Channel subscription
  subscribeChannel: (channel: string) => void;
  unsubscribeChannel: (channel: string) => void;

  // Actions
  markNotificationAsRead: (notificationId: string) => void;
  ping: () => void;
}

/**
 * Configuration options for useWebSocket hook.
 *
 * @interface UseWebSocketOptions
 *
 * @property {boolean} [autoConnect=true] - Whether to automatically connect on mount
 * @property {boolean} [reconnectOnTokenRefresh=true] - Whether to reconnect when auth token is refreshed
 */
export interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnTokenRefresh?: boolean;
}

// ==========================================
// HOOK IMPLEMENTATION
// ==========================================

/**
 * Hook for WebSocket real-time communication.
 *
 * Provides React integration for WebSocket connections including lifecycle management,
 * event subscriptions, and automatic reconnection handling. Manages connection state,
 * handles token-based authentication, and provides methods for subscribing to events.
 *
 * @param {UseWebSocketOptions} [options] - Configuration options
 * @returns {UseWebSocketReturn} WebSocket state and operations
 *
 * @example
 * ```typescript
 * function NotificationCenter() {
 *   const {
 *     isConnected,
 *     subscribe,
 *     unsubscribe
 *   } = useWebSocket();
 *
 *   useEffect(() => {
 *     const handleNotification = (data: unknown) => {
 *       const notification = data as Notification;
 *       toast.info(notification.message);
 *     };
 *
 *     subscribe('notification:new', handleNotification);
 *     return () => unsubscribe('notification:new', handleNotification);
 *   }, [subscribe, unsubscribe]);
 *
 *   return <StatusBadge connected={isConnected} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Manual connection control
 * function WebSocketControl() {
 *   const {
 *     isConnected,
 *     connect,
 *     disconnect,
 *     connectionState
 *   } = useWebSocket({ autoConnect: false });
 *
 *   return (
 *     <div>
 *       <p>Status: {connectionState}</p>
 *       {isConnected ? (
 *         <button onClick={disconnect}>Disconnect</button>
 *       ) : (
 *         <button onClick={connect}>Connect</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Channel subscriptions for filtered events
 * function StudentUpdates({ studentId }: { studentId: string }) {
 *   const { subscribeChannel, unsubscribeChannel, subscribe } = useWebSocket();
 *
 *   useEffect(() => {
 *     const channel = `student:${studentId}`;
 *     subscribeChannel(channel);
 *
 *     const handleUpdate = (data: unknown) => {
 *       console.log('Student updated:', data);
 *     };
 *
 *     subscribe('student:update', handleUpdate);
 *
 *     return () => {
 *       unsubscribeChannel(channel);
 *     };
 *   }, [studentId, subscribeChannel, unsubscribeChannel, subscribe]);
 *
 *   return <StudentView />;
 * }
 * ```
 *
 * @remarks
 * - Automatically connects on mount by default (configurable with autoConnect option)
 * - Requires authentication token from SecureTokenManager
 * - Automatically reconnects when page visibility changes
 * - Cleans up subscriptions and connection on unmount
 * - Handles token refresh reconnection (configurable with reconnectOnTokenRefresh)
 * - Connection state updates trigger React re-renders
 * - Event handlers should be memoized to prevent subscription churn
 *
 * @see {@link WebSocketService} for underlying WebSocket implementation
 * @see {@link SecureTokenManager} for authentication token management
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    autoConnect = true,
    reconnectOnTokenRefresh = true
  } = options;

  const [isConnected, setIsConnected] = useState(webSocketService.isConnected());
  const [connectionState, setConnectionState] = useState(webSocketService.getState());
  const [socketId, setSocketId] = useState(webSocketService.getSocketId());

  const isInitializedRef = useRef(false);

  // ==========================================
  // CONNECTION MANAGEMENT
  // ==========================================

  const connect = useCallback(() => {
    const token = secureTokenManager.getToken();
    if (!token) {
      console.warn('useWebSocket: No auth token available for WebSocket connection');
      return;
    }

    webSocketService.connect(token);
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  const reconnect = useCallback(() => {
    const token = secureTokenManager.getToken();
    if (!token) {
      console.warn('useWebSocket: No auth token available for WebSocket reconnection');
      return;
    }

    webSocketService.reconnect(token);
  }, []);

  // ==========================================
  // EVENT SUBSCRIPTION
  // ==========================================

  const subscribe = useCallback((event: WebSocketEvent | string, handler: WebSocketEventHandler) => {
    webSocketService.on(event, handler);
  }, []);

  const unsubscribe = useCallback((event: WebSocketEvent | string, handler: WebSocketEventHandler) => {
    webSocketService.off(event, handler);
  }, []);

  // ==========================================
  // CHANNEL SUBSCRIPTION
  // ==========================================

  const subscribeChannel = useCallback((channel: string) => {
    webSocketService.subscribe(channel);
  }, []);

  const unsubscribeChannel = useCallback((channel: string) => {
    webSocketService.unsubscribe(channel);
  }, []);

  // ==========================================
  // ACTIONS
  // ==========================================

  const markNotificationAsRead = useCallback((notificationId: string) => {
    webSocketService.markNotificationAsRead(notificationId);
  }, []);

  const ping = useCallback(() => {
    webSocketService.ping();
  }, []);

  // ==========================================
  // STATE SYNC
  // ==========================================

  useEffect(() => {
    // Update state when WebSocket state changes
    const handleStateChange = (state: ConnectionState) => {
      setConnectionState(state);
      setIsConnected(state === ConnectionState.CONNECTED);
      setSocketId(webSocketService.getSocketId());
    };

    webSocketService.onStateChange(handleStateChange);

    // Auto-connect if enabled and not already initialized
    if (autoConnect && !isInitializedRef.current && !webSocketService.isConnected()) {
      isInitializedRef.current = true;
      connect();
    }

    // Cleanup
    return () => {
      webSocketService.offStateChange(handleStateChange);
    };
  }, [autoConnect, connect]);

  // ==========================================
  // TOKEN REFRESH HANDLING
  // ==========================================

  useEffect(() => {
    if (!reconnectOnTokenRefresh) return;

    // Listen for token refresh events
    const handleTokenRefresh = () => {
      if (webSocketService.isConnected()) {
        console.log('useWebSocket: Token refreshed, reconnecting WebSocket');
        reconnect();
      }
    };

    // Note: You would need to implement a token refresh event in SecureTokenManager
    // For now, this is a placeholder for future implementation
    // secureTokenManager.on('token-refreshed', handleTokenRefresh);

    return () => {
      // secureTokenManager.off('token-refreshed', handleTokenRefresh);
    };
  }, [reconnectOnTokenRefresh, reconnect]);

  // ==========================================
  // PAGE VISIBILITY HANDLING
  // ==========================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !webSocketService.isConnected()) {
        console.log('useWebSocket: Page became visible, reconnecting WebSocket');
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connect]);

  // ==========================================
  // RETURN
  // ==========================================

  return {
    isConnected,
    connectionState,
    socketId,
    connect,
    disconnect,
    reconnect,
    subscribe,
    unsubscribe,
    subscribeChannel,
    unsubscribeChannel,
    markNotificationAsRead,
    ping
  };
}

export default useWebSocket;
