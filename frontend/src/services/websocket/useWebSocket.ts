/**
 * React Hook for WebSocket Integration
 *
 * Provides easy-to-use React hooks for WebSocket functionality
 *
 * @module services/websocket/useWebSocket
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { webSocketService, ConnectionState, WebSocketEvent } from './WebSocketService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/store';

/**
 * Hook to manage WebSocket connection
 */
export function useWebSocket() {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    webSocketService.getState()
  );
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Connect when user is authenticated
    if (isAuthenticated && user && !webSocketService.isConnected()) {
      // For now, use user ID as connection identifier until proper token management is implemented
      webSocketService.connect(user.id);
    }

    // Listen for state changes
    const handleStateChange = (state: ConnectionState) => {
      setConnectionState(state);
    };

    webSocketService.onStateChange(handleStateChange);

    return () => {
      webSocketService.offStateChange(handleStateChange);
    };
  }, [isAuthenticated, user]);

  const reconnect = useCallback(() => {
    if (isAuthenticated && user) {
      webSocketService.reconnect(user.id);
    }
  }, [isAuthenticated, user]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  return {
    connectionState,
    isConnected: connectionState === ConnectionState.CONNECTED,
    reconnect,
    disconnect,
    socketId: webSocketService.getSocketId()
  };
}

/**
 * Hook to subscribe to WebSocket events
 */
export function useWebSocketEvent<T = unknown>(
  event: WebSocketEvent | string,
  handler: (data: T) => void,
  deps: React.DependencyList = []
) {
  const handlerRef = useRef(handler);

  // Update handler ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const wrappedHandler = (data: unknown) => {
      handlerRef.current(data as T);
    };

    webSocketService.on(event, wrappedHandler);

    return () => {
      webSocketService.off(event, wrappedHandler);
    };
  }, [event, ...deps]);
}

/**
 * Hook to subscribe to emergency alerts
 */
export function useEmergencyAlerts(handler: (alert: unknown) => void) {
  useWebSocketEvent(WebSocketEvent.EMERGENCY_ALERT, handler);
}

/**
 * Hook to subscribe to health notifications
 */
export function useHealthNotifications(handler: (notification: unknown) => void) {
  useWebSocketEvent(WebSocketEvent.HEALTH_NOTIFICATION, handler);
}

/**
 * Hook to subscribe to student health alerts
 */
export function useStudentHealthAlerts(handler: (alert: unknown) => void) {
  useWebSocketEvent(WebSocketEvent.STUDENT_HEALTH_ALERT, handler);
}

/**
 * Hook to subscribe to medication reminders
 */
export function useMedicationReminders(handler: (reminder: unknown) => void) {
  useWebSocketEvent(WebSocketEvent.MEDICATION_REMINDER, handler);
}

/**
 * Hook to manage channel subscriptions
 */
export function useWebSocketChannel(channel: string, enabled = true) {
  useEffect(() => {
    if (enabled && webSocketService.isConnected()) {
      webSocketService.subscribe(channel);

      return () => {
        webSocketService.unsubscribe(channel);
      };
    }
  }, [channel, enabled]);
}
