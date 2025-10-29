/**
 * useSocket Hook
 *
 * Main React hook for accessing Socket.io messaging service
 *
 * @module hooks/socket/useSocket
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { socketService } from '@/services/socket/socket.service';
import {
  ConnectionState,
  SendMessagePayload,
  ConnectionMetrics
} from '@/services/socket/socket.types';

/**
 * Options for useSocket hook
 */
export interface UseSocketOptions {
  /** Auto-connect on mount */
  autoConnect?: boolean;
  /** Authentication token */
  token?: string;
  /** Auto-process queue on connect */
  autoProcessQueue?: boolean;
}

/**
 * Return type for useSocket hook
 */
export interface UseSocketReturn {
  /** Is socket connected */
  isConnected: boolean;
  /** Current connection state */
  connectionState: ConnectionState;
  /** Socket ID */
  socketId: string | undefined;
  /** Connection metrics */
  metrics: ConnectionMetrics;
  /** Send a message */
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  /** Send typing indicator */
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  /** Mark message as read */
  markAsRead: (messageId: string, conversationId: string) => void;
  /** Manually connect */
  connect: () => void;
  /** Manually disconnect */
  disconnect: () => void;
  /** Manually reconnect */
  reconnect: () => void;
  /** Get queue size */
  queueSize: number;
  /** Process offline queue */
  processQueue: () => Promise<void>;
  /** Clear message queue */
  clearQueue: () => void;
}

/**
 * Hook to access Socket.io messaging service
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { isConnected, sendMessage, connectionState } = useSocket({
 *     autoConnect: true,
 *     token: authToken
 *   });
 *
 *   const handleSend = async () => {
 *     await sendMessage({
 *       conversationId: '123',
 *       content: 'Hello!',
 *       type: 'text'
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <ConnectionStatus state={connectionState} />
 *       <button onClick={handleSend} disabled={!isConnected}>
 *         Send
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const {
    autoConnect = false,
    token,
    autoProcessQueue = true
  } = options;

  const [isConnected, setIsConnected] = useState(socketService.isConnected());
  const [connectionState, setConnectionState] = useState(socketService.getState());
  const [socketId, setSocketId] = useState(socketService.getSocketId());
  const [queueSize, setQueueSize] = useState(socketService.getQueueSize());
  const [metrics, setMetrics] = useState<ConnectionMetrics>(socketService.getMetrics());

  // Update state when connection changes
  useEffect(() => {
    const handleStateChange = (state: ConnectionState) => {
      setConnectionState(state);
      setIsConnected(state === ConnectionState.CONNECTED);
      setSocketId(socketService.getSocketId());
      setMetrics(socketService.getMetrics());
      setQueueSize(socketService.getQueueSize());

      // Auto-process queue when connected
      if (state === ConnectionState.CONNECTED && autoProcessQueue) {
        socketService.processQueue().catch(error => {
          console.error('[useSocket] Failed to auto-process queue:', error);
        });
      }
    };

    socketService.onStateChange(handleStateChange);

    return () => {
      socketService.offStateChange(handleStateChange);
    };
  }, [autoProcessQueue]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && token && !socketService.isConnected()) {
      socketService.connect(token);
    }
  }, [autoConnect, token]);

  // Connect
  const connect = useCallback(() => {
    if (token) {
      socketService.connect(token);
    } else {
      console.error('[useSocket] Cannot connect: no token provided');
    }
  }, [token]);

  // Disconnect
  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  // Reconnect
  const reconnect = useCallback(() => {
    if (token) {
      socketService.reconnect(token);
    } else {
      socketService.reconnect();
    }
  }, [token]);

  // Send message
  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    await socketService.sendMessage(payload);
    setQueueSize(socketService.getQueueSize());
  }, []);

  // Send typing
  const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
    socketService.sendTyping(conversationId, isTyping);
  }, []);

  // Mark as read
  const markAsRead = useCallback((messageId: string, conversationId: string) => {
    socketService.markAsRead(messageId, conversationId);
  }, []);

  // Process queue
  const processQueue = useCallback(async () => {
    await socketService.processQueue();
    setQueueSize(socketService.getQueueSize());
  }, []);

  // Clear queue
  const clearQueue = useCallback(() => {
    socketService.clearQueue();
    setQueueSize(socketService.getQueueSize());
  }, []);

  return {
    isConnected,
    connectionState,
    socketId,
    metrics,
    sendMessage,
    sendTyping,
    markAsRead,
    connect,
    disconnect,
    reconnect,
    queueSize,
    processQueue,
    clearQueue
  };
}

export default useSocket;
