/**
 * Socket.io React Context
 *
 * Provides Socket.io client to React components via context
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { getSocketClient, SocketState } from './client';
import type {
  Message,
  TypingIndicator
} from '@/lib/validations/message.schemas';
import type {
  Notification
} from '@/lib/validations/notification.schemas';

/**
 * Socket context value
 */
interface SocketContextValue {
  isConnected: boolean;
  connectionState: SocketState;
  connect: () => void;
  disconnect: () => void;
  onMessage: (handler: (message: Message) => void) => () => void;
  onNotification: (handler: (notification: Notification) => void) => () => void;
  onTyping: (handler: (indicator: TypingIndicator) => void) => () => void;
  sendTypingIndicator: (isTyping: boolean, data: { threadId?: string; recipientIds?: string[] }) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

/**
 * Socket provider props
 */
interface SocketProviderProps {
  children: React.ReactNode;
  token: string;
  url?: string;
  autoConnect?: boolean;
}

/**
 * Socket provider component
 */
export function SocketProvider({
  children,
  token,
  url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
  autoConnect = true
}: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<SocketState>('disconnected');
  const socketClient = useRef(getSocketClient());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket on mount
  useEffect(() => {
    const client = socketClient.current;

    // Initialize socket client
    client.initialize({
      url,
      token,
      autoConnect
    });

    // Setup connection state listener
    client.on('connect' as any, () => {
      setIsConnected(true);
      setConnectionState('connected');
    });

    client.on('disconnect' as any, () => {
      setIsConnected(false);
      setConnectionState('disconnected');
    });

    // Custom connection state handler
    const handleConnectionState = (state: SocketState) => {
      setConnectionState(state);
      setIsConnected(state === 'connected');
    };

    client.on('connection:state' as any, handleConnectionState);

    // Auto-connect if enabled
    if (autoConnect) {
      client.connect();
    }

    // Cleanup on unmount
    return () => {
      client.off('connection:state' as any, handleConnectionState);
      client.disconnect();
    };
  }, [token, url, autoConnect]);

  // Update token when it changes
  useEffect(() => {
    if (token) {
      socketClient.current.updateToken(token);
    }
  }, [token]);

  /**
   * Connect socket
   */
  const connect = useCallback(() => {
    socketClient.current.connect();
  }, []);

  /**
   * Disconnect socket
   */
  const disconnect = useCallback(() => {
    socketClient.current.disconnect();
  }, []);

  /**
   * Register message handler
   */
  const onMessage = useCallback((handler: (message: Message) => void) => {
    socketClient.current.on('message:new', handler);
    return () => {
      socketClient.current.off('message:new', handler);
    };
  }, []);

  /**
   * Register notification handler
   */
  const onNotification = useCallback((handler: (notification: Notification) => void) => {
    socketClient.current.on('notification:new', handler);
    return () => {
      socketClient.current.off('notification:new', handler);
    };
  }, []);

  /**
   * Register typing indicator handler
   */
  const onTyping = useCallback((handler: (indicator: TypingIndicator) => void) => {
    socketClient.current.on('message:typing', handler);
    return () => {
      socketClient.current.off('message:typing', handler);
    };
  }, []);

  /**
   * Send typing indicator with debounce
   */
  const sendTypingIndicator = useCallback((
    isTyping: boolean,
    data: { threadId?: string; recipientIds?: string[] }
  ) => {
    if (!isConnected) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      // Send typing start
      socketClient.current.send('message:typing:start', data);

      // Auto-stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        socketClient.current.send('message:typing:stop', data);
      }, 3000);
    } else {
      // Send typing stop immediately
      socketClient.current.send('message:typing:stop', data);
    }
  }, [isConnected]);

  const value: SocketContextValue = {
    isConnected,
    connectionState,
    connect,
    disconnect,
    onMessage,
    onNotification,
    onTyping,
    sendTypingIndicator
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * useSocket hook
 */
export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

/**
 * useSocketEvent hook - Subscribe to socket events
 */
export function useSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void
): void {
  const socketClient = useRef(getSocketClient());

  useEffect(() => {
    const client = socketClient.current;
    client.on(event as any, handler);

    return () => {
      client.off(event as any, handler);
    };
  }, [event, handler]);
}

/**
 * useMessageListener hook - Listen for new messages
 */
export function useMessageListener(handler: (message: Message) => void): void {
  const { onMessage } = useSocket();

  useEffect(() => {
    const unsubscribe = onMessage(handler);
    return unsubscribe;
  }, [onMessage, handler]);
}

/**
 * useNotificationListener hook - Listen for new notifications
 */
export function useNotificationListener(handler: (notification: Notification) => void): void {
  const { onNotification } = useSocket();

  useEffect(() => {
    const unsubscribe = onNotification(handler);
    return unsubscribe;
  }, [onNotification, handler]);
}

/**
 * useTypingIndicator hook - Manage typing indicators
 */
export function useTypingIndicator(threadId?: string, recipientIds?: string[]) {
  const { sendTypingIndicator } = useSocket();
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    setIsTyping(true);
    sendTypingIndicator(true, { threadId, recipientIds });
  }, [sendTypingIndicator, threadId, recipientIds]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    sendTypingIndicator(false, { threadId, recipientIds });
  }, [sendTypingIndicator, threadId, recipientIds]);

  return {
    isTyping,
    startTyping,
    stopTyping
  };
}
