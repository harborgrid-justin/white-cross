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
} from '../services/websocket/WebSocketService';
import { secureTokenManager } from '../services/security/SecureTokenManager';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type WebSocketEventHandler = (data: unknown) => void;

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

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnTokenRefresh?: boolean;
}

// ==========================================
// HOOK IMPLEMENTATION
// ==========================================

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
