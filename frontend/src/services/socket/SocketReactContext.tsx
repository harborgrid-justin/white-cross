/**
 * Socket React Context
 *
 * React Context and Provider for Socket.io integration.
 * Provides socket connection state and methods to React components.
 *
 * @module services/socket/SocketReactContext
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SocketService, socketService } from './SocketService';
import {
  ConnectionState,
  WebSocketEvent,
  type Message,
  type Notification,
  type TypingIndicator,
  type SocketContextValue,
  type SocketProviderProps,
} from './types';

/**
 * Socket Context
 */
const SocketContext = createContext<SocketContextValue | null>(null);

/**
 * Socket Provider Component
 * Wraps application to provide socket functionality to all child components
 *
 * @example
 * ```tsx
 * <SocketProvider token={userToken} autoConnect={true}>
 *   <App />
 * </SocketProvider>
 * ```
 */
export function SocketProvider({
  children,
  token,
  url,
  autoConnect = true
}: SocketProviderProps): React.ReactElement {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    socketService.getState()
  );

  // Initialize socket on mount
  useEffect(() => {
    const config = url ? { url } : {};
    const service = SocketService.getInstance(config);

    // Setup connection state listener
    service.onStateChange(setConnectionState);

    // Auto-connect if enabled
    if (autoConnect && token) {
      service.connect(token);
    }

    // Cleanup on unmount
    return () => {
      service.disconnect();
    };
  }, [token, url, autoConnect]);

  // Update token when it changes
  useEffect(() => {
    if (token && socketService.isConnected()) {
      socketService.reconnect(token);
    }
  }, [token]);

  /**
   * Connect socket
   */
  const connect = useCallback(() => {
    if (token) {
      socketService.connect(token);
    }
  }, [token]);

  /**
   * Disconnect socket
   */
  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  /**
   * Reconnect socket
   */
  const reconnect = useCallback(() => {
    if (token) {
      socketService.reconnect(token);
    }
  }, [token]);

  /**
   * Register message handler
   * @param handler - Message handler function
   * @returns Cleanup function to unsubscribe
   */
  const onMessage = useCallback((handler: (message: Message) => void) => {
    socketService.on(WebSocketEvent.MESSAGE_NEW, handler);
    return () => {
      socketService.off(WebSocketEvent.MESSAGE_NEW, handler);
    };
  }, []);

  /**
   * Register notification handler
   * @param handler - Notification handler function
   * @returns Cleanup function to unsubscribe
   */
  const onNotification = useCallback((handler: (notification: Notification) => void) => {
    socketService.on(WebSocketEvent.NOTIFICATION_NEW, handler);
    return () => {
      socketService.off(WebSocketEvent.NOTIFICATION_NEW, handler);
    };
  }, []);

  /**
   * Register typing indicator handler
   * @param handler - Typing indicator handler function
   * @returns Cleanup function to unsubscribe
   */
  const onTyping = useCallback((handler: (indicator: TypingIndicator) => void) => {
    socketService.on(WebSocketEvent.MESSAGE_TYPING, handler);
    return () => {
      socketService.off(WebSocketEvent.MESSAGE_TYPING, handler);
    };
  }, []);

  /**
   * Send message via socket
   * @param message - Partial message object
   * @returns Promise resolving to the sent message
   */
  const sendMessage = useCallback(async (message: Partial<Message>): Promise<Message> => {
    return new Promise((resolve, reject) => {
      const handleResponse = (response: { success: boolean; data?: Message; error?: string }) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || 'Unknown error'));
        }
        socketService.off('message:sent', handleResponse);
      };

      socketService.on('message:sent', handleResponse);

      socketService.sendMessage({
        content: message.content || '',
        conversationId: message.conversationId || '',
        recipientIds: message.recipientIds,
        metadata: message.metadata,
      }).catch(reject);
    });
  }, []);

  /**
   * Mark message as read
   * @param messageId - Message ID
   */
  const markMessageAsRead = useCallback((messageId: string) => {
    socketService.markAsRead(messageId, '');
  }, []);

  /**
   * Mark notifications as read
   * @param notificationIds - Array of notification IDs
   */
  const markNotificationAsRead = useCallback((notificationIds: string[]) => {
    socketService.markNotificationAsRead(notificationIds);
  }, []);

  /**
   * Subscribe to channel
   * @param channel - Channel name
   */
  const subscribe = useCallback((channel: string) => {
    socketService.subscribe(channel);
  }, []);

  /**
   * Unsubscribe from channel
   * @param channel - Channel name
   */
  const unsubscribe = useCallback((channel: string) => {
    socketService.unsubscribe(channel);
  }, []);

  const value: SocketContextValue = {
    isConnected: connectionState === ConnectionState.CONNECTED,
    connectionState,
    connect,
    disconnect,
    reconnect,
    onMessage,
    onNotification,
    onTyping,
    sendTypingIndicator: (isTyping, data) => socketService.sendTypingIndicator(isTyping, data),
    sendMessage,
    markMessageAsRead,
    markNotificationAsRead,
    subscribe,
    unsubscribe
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * useSocket hook
 * Access socket context value
 *
 * @throws Error if used outside SocketProvider
 * @returns Socket context value
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isConnected, sendMessage } = useSocket();
 *
 *   return (
 *     <div>
 *       {isConnected ? 'Connected' : 'Disconnected'}
 *       <button onClick={() => sendMessage({ content: 'Hello' })}>
 *         Send
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
