/**
 * Consolidated Socket Service
 *
 * Single entry point for all real-time communication functionality with Socket.io.
 * Combines connection management, event handling, React integration, and healthcare-specific features.
 */

import { io, Socket } from 'socket.io-client';
import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import React from 'react';

// Import modular managers
import { EventManager } from './EventManager';
import { ConnectionManager } from './ConnectionManager';
import { MessageQueue } from './MessageQueue';

// Import types and enums
import {
  ConnectionState,
  WebSocketEvent,
  type SocketConfig,
  type ConnectionMetrics,
  type SendMessagePayload,
  type TypingIndicator,
  type Message,
  type Notification,
  type ReadReceipt,
  type EventHandler,
  type StateChangeListener,
  type SocketContextValue,
  type SocketProviderProps
} from './types';

// ==========================================
// REACT CONTEXT (from lib/socket/SocketContext.tsx)
// ==========================================

const SocketContext = createContext<SocketContextValue | null>(null);

const SocketContext = createContext<SocketContextValue | null>(null);

// ==========================================
// SOCKET SERVICE ORCHESTRATOR
// ==========================================

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private config: SocketConfig;
  private currentToken: string | null = null;

  // Modular managers
  private eventManager: EventManager;
  private connectionManager: ConnectionManager;
  private messageQueue: MessageQueue;

  // React integration
  private typingTimeoutRef: NodeJS.Timeout | null = null;

  private constructor(config: Partial<SocketConfig> = {}) {
    this.config = {
      url: config.url || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      path: config.path || '/socket.io',
      token: config.token,
      transports: config.transports || ['websocket', 'polling'],
      timeout: config.timeout || 20000,
      reconnectionAttempts: config.reconnectionAttempts || 10,
      reconnectionDelay: config.reconnectionDelay || 1000,
      reconnectionDelayMax: config.reconnectionDelayMax || 30000,
      autoConnect: config.autoConnect ?? true,
      debug: config.debug ?? false,
      deduplicationWindow: config.deduplicationWindow ?? 1000,
    };

    this.eventManager = new EventManager(this.config.deduplicationWindow);
    this.connectionManager = new ConnectionManager(this.config);
    this.messageQueue = new MessageQueue();

    this.initializeEventHandlers();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<SocketConfig>): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(config);
    }
    return SocketService.instance;
  }

  /**
   * Initialize event handlers
   */
  private initializeEventHandlers(): void {
    // Set up connection manager state change handling
    this.connectionManager.setStateChangeCallback((state) => {
      this.eventManager.emit('connection:state', state);
    });
  }

  // ==========================================
  // CONNECTION MANAGEMENT
  // ==========================================

  /**
   * Connect to Socket.io server
   */
  public connect(token?: string): void {
    if (this.socket?.connected) {
      if (this.config.debug) {
        console.warn('[SocketService] Already connected');
      }
      return;
    }

    const authToken = token || this.currentToken;
    if (!authToken) {
      throw new Error('No authentication token provided');
    }

    this.currentToken = authToken;
    this.connectionManager.connect();

    // Create socket connection
    this.socket = io(this.config.url, {
      path: this.config.path,
      auth: { token: authToken },
      transports: this.config.transports,
      reconnection: false, // We handle reconnection manually
      timeout: this.config.timeout
    });

    // Register all event handlers
    this.registerSocketEvents();

    if (this.config.debug) {
      console.log('[SocketService] Connecting to', this.config.url);
    }
  }

  /**
   * Register Socket.io event handlers
   */
  private registerSocketEvents(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('[SocketService] Connected:', this.socket?.id);
      this.connectionManager.updateState(ConnectionState.CONNECTED);

      // Process queued messages
      this.processQueue();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] Disconnected:', reason);
      this.connectionManager.updateState(ConnectionState.DISCONNECTED);

      // Schedule reconnect if not intentional disconnect
      if (reason !== 'io client disconnect') {
        this.connectionManager.scheduleReconnect(() => this.connect());
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SocketService] Connection error:', error.message);
      this.connectionManager.updateState(ConnectionState.ERROR);
      this.connectionManager.scheduleReconnect(() => this.connect());
    });

    // Healthcare-specific events
    this.socket.on(WebSocketEvent.CONNECTION_CONFIRMED, (data) => {
      this.eventManager.emit(WebSocketEvent.CONNECTION_CONFIRMED, data);
    });

    this.socket.on(WebSocketEvent.EMERGENCY_ALERT, (data) => {
      console.warn('[SocketService] Emergency alert:', data);
      this.eventManager.emit(WebSocketEvent.EMERGENCY_ALERT, data);
    });

    this.socket.on(WebSocketEvent.HEALTH_NOTIFICATION, (data) => {
      this.eventManager.emit(WebSocketEvent.HEALTH_NOTIFICATION, data);
    });

    this.socket.on(WebSocketEvent.STUDENT_HEALTH_ALERT, (data) => {
      console.warn('[SocketService] Student health alert:', data);
      this.eventManager.emit(WebSocketEvent.STUDENT_HEALTH_ALERT, data);
    });

    this.socket.on(WebSocketEvent.MEDICATION_REMINDER, (data) => {
      this.eventManager.emit(WebSocketEvent.MEDICATION_REMINDER, data);
    });

    // Message events
    this.socket.on(WebSocketEvent.MESSAGE_NEW, (message: Message) => {
      this.eventManager.emit(WebSocketEvent.MESSAGE_NEW, message);
    });

    this.socket.on(WebSocketEvent.MESSAGE_UPDATED, (message: Message) => {
      this.eventManager.emit(WebSocketEvent.MESSAGE_UPDATED, message);
    });

    this.socket.on(WebSocketEvent.MESSAGE_DELETED, (messageId: string) => {
      this.eventManager.emit(WebSocketEvent.MESSAGE_DELETED, messageId);
    });

    this.socket.on(WebSocketEvent.MESSAGE_READ, (data: { messageId: string; receipt: ReadReceipt }) => {
      this.eventManager.emit(WebSocketEvent.MESSAGE_READ, data);
    });

    this.socket.on(WebSocketEvent.MESSAGE_TYPING, (indicator: TypingIndicator) => {
      this.eventManager.emit(WebSocketEvent.MESSAGE_TYPING, indicator);
    });

    // Notification events
    this.socket.on(WebSocketEvent.NOTIFICATION_NEW, (notification: Notification) => {
      this.eventManager.emit(WebSocketEvent.NOTIFICATION_NEW, notification);
    });

    this.socket.on(WebSocketEvent.NOTIFICATION_READ_RECEIPT, (data) => {
      this.eventManager.emit(WebSocketEvent.NOTIFICATION_READ_RECEIPT, data);
    });

    // Broadcast events
    this.socket.on(WebSocketEvent.BROADCAST_NEW, (data) => {
      this.eventManager.emit(WebSocketEvent.BROADCAST_NEW, data);
    });

    // System events
    this.socket.on(WebSocketEvent.PONG, (data) => {
      if (this.config.debug) {
        console.debug('[SocketService] Pong received:', data);
      }
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('[SocketService] Socket error:', error);
    });
  }

  /**
   * Disconnect from Socket.io server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.connectionManager.disconnect();

    if (this.config.debug) {
      console.log('[SocketService] Disconnected');
    }
  }

  /**
   * Reconnect to Socket.io server
   */
  public reconnect(token?: string): void {
    this.disconnect();

    if (token) {
      this.currentToken = token;
    }

    if (this.currentToken) {
      this.connect(this.currentToken);
    } else {
      console.error('[SocketService] Cannot reconnect: no token available');
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.connectionManager.isConnected();
  }

  /**
   * Get socket ID
   */
  public getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Get connection state
   */
  public getState(): ConnectionState {
    return this.connectionManager.getState();
  }

  /**
   * Get connection metrics
   */
  public getMetrics(): ConnectionMetrics {
    return this.connectionManager.getConnectionInfo() as ConnectionMetrics;
  }

  // ==========================================
  // EVENT SUBSCRIPTION
  // ==========================================

  /**
   * Subscribe to event
   */
  public on(event: string, handler: EventHandler): void {
    this.eventManager.on(event, handler);
  }

  /**
   * Unsubscribe from event
   */
  public off(event: string, handler: EventHandler): void {
    this.eventManager.off(event, handler);
  }

  /**
   * Subscribe to state changes
   */
  public onStateChange(listener: StateChangeListener): void {
    this.connectionManager.setStateChangeCallback(listener);
  }

  /**
   * Unsubscribe from state changes
   */
  public offStateChange(listener: StateChangeListener): void {
    // Note: ConnectionManager doesn't have offStateChange, this is a limitation
  }

  // ==========================================
  // MESSAGE OPERATIONS
  // ==========================================

  /**
   * Send message
   */
  public async sendMessage(payload: SendMessagePayload): Promise<void> {
    if (!this.socket?.connected) {
      // Queue message for later
      this.messageQueue.enqueue(payload);
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        this.socket!.emit('message:send', payload, (response: { success: boolean; data?: Message; error?: string }) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.error || 'Unknown error'));
          }
        });
      });
    } catch (error) {
      console.error('[SocketService] Failed to send message:', error);
      // Queue message for retry
      this.messageQueue.enqueue(payload);
      throw error;
    }
  }

  /**
   * Send typing indicator
   */
  public sendTyping(conversationId: string, isTyping: boolean): void {
    if (!this.socket?.connected) return;

    const event = isTyping ? 'message:typing:start' : 'message:typing:stop';
    this.socket.emit(event, { conversationId });
  }

  /**
   * Mark message as read
   */
  public markAsRead(messageId: string, conversationId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit('message:read', messageId);
  }

  /**
   * Mark notification as read
   */
  public markNotificationAsRead(notificationIds: string[]): void {
    if (!this.socket?.connected) return;

    this.socket.emit('notification:read', notificationIds);
  }

  // ==========================================
  // CHANNEL SUBSCRIPTION
  // ==========================================

  /**
   * Subscribe to a channel
   */
  public subscribe(channel: string): void {
    if (!this.socket?.connected) {
      console.warn('[SocketService] Cannot subscribe: not connected');
      return;
    }

    this.socket.emit('subscribe', channel);
  }

  /**
   * Unsubscribe from a channel
   */
  public unsubscribe(channel: string): void {
    if (!this.socket?.connected) {
      console.warn('[SocketService] Cannot unsubscribe: not connected');
      return;
    }

    this.socket.emit('unsubscribe', channel);
  }

  // ==========================================
  // QUEUE MANAGEMENT
  // ==========================================

  /**
   * Process offline message queue
   */
  public async processQueue(): Promise<void> {
    await this.messageQueue.process(async (message) => {
      await this.sendMessage(message);
    });
  }

  /**
   * Get queue size
   */
  public getQueueSize(): number {
    return this.messageQueue.getSize();
  }

  /**
   * Clear message queue
   */
  public clearQueue(): void {
    this.messageQueue.clear();
  }

  // ==========================================
  // REACT INTEGRATION HELPERS
  // ==========================================

  /**
   * Send typing indicator with debounce (React helper)
   */
  public sendTypingIndicator(
    isTyping: boolean,
    data: { threadId?: string; recipientIds?: string[] }
  ): void {
    // Clear existing timeout
    if (this.typingTimeoutRef) {
      clearTimeout(this.typingTimeoutRef);
    }

    if (isTyping) {
      // Send typing start
      this.sendTyping(data.threadId || '', true);

      // Auto-stop typing after 3 seconds
      this.typingTimeoutRef = setTimeout(() => {
        this.sendTyping(data.threadId || '', false);
      }, 3000);
    } else {
      // Send typing stop immediately
      this.sendTyping(data.threadId || '', false);
    }
  }

  // ==========================================
  // CLEANUP
  // ==========================================

  /**
   * Cleanup service
   */
  public cleanup(): void {
    this.disconnect();
    this.eventManager.cleanup();
    this.connectionManager.cleanup();
    this.messageQueue.cleanup();

    if (this.typingTimeoutRef) {
      clearTimeout(this.typingTimeoutRef);
    }
  }
}

/**
 * React Provider Component
 */
export function SocketProvider({
  children,
  token,
  url,
  autoConnect = true
}: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
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
   */
  const onMessage = useCallback((handler: (message: Message) => void) => {
    socketService.on(WebSocketEvent.MESSAGE_NEW, handler);
    return () => {
      socketService.off(WebSocketEvent.MESSAGE_NEW, handler);
    };
  }, []);

  /**
   * Register notification handler
   */
  const onNotification = useCallback((handler: (notification: Notification) => void) => {
    socketService.on(WebSocketEvent.NOTIFICATION_NEW, handler);
    return () => {
      socketService.off(WebSocketEvent.NOTIFICATION_NEW, handler);
    };
  }, []);

  /**
   * Register typing indicator handler
   */
  const onTyping = useCallback((handler: (indicator: TypingIndicator) => void) => {
    socketService.on(WebSocketEvent.MESSAGE_TYPING, handler);
    return () => {
      socketService.off(WebSocketEvent.MESSAGE_TYPING, handler);
    };
  }, []);

  /**
   * Send message via socket
   */
  const sendMessage = useCallback(async (message: Partial<Message>): Promise<Message> => {
    return new Promise((resolve, reject) => {
      socketService.on('message:sent', (response: any) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
        socketService.off('message:sent', () => {});
      });

      socketService.sendMessage(message as SendMessagePayload).catch(reject);
    });
  }, []);

  /**
   * Mark message as read
   */
  const markMessageAsRead = useCallback((messageId: string) => {
    socketService.markAsRead(messageId, '');
  }, []);

  /**
   * Mark notifications as read
   */
  const markNotificationAsRead = useCallback((notificationIds: string[]) => {
    socketService.markNotificationAsRead(notificationIds);
  }, []);

  /**
   * Subscribe to channel
   */
  const subscribe = useCallback((channel: string) => {
    socketService.subscribe(channel);
  }, []);

  /**
   * Unsubscribe from channel
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
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void
): void {
  useEffect(() => {
    socketService.on(event, handler as EventHandler);

    return () => {
      socketService.off(event, handler as EventHandler);
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

/**
 * useEmergencyAlerts hook - Listen for emergency alerts
 */
export function useEmergencyAlerts(handler: (alert: unknown) => void) {
  useSocketEvent(WebSocketEvent.EMERGENCY_ALERT, handler);
}

/**
 * useHealthNotifications hook - Listen for health notifications
 */
export function useHealthNotifications(handler: (notification: unknown) => void) {
  useSocketEvent(WebSocketEvent.HEALTH_NOTIFICATION, handler);
}

/**
 * useStudentHealthAlerts hook - Listen for student health alerts
 */
export function useStudentHealthAlerts(handler: (alert: unknown) => void) {
  useSocketEvent(WebSocketEvent.STUDENT_HEALTH_ALERT, handler);
}

/**
 * useMedicationReminders hook - Listen for medication reminders
 */
export function useMedicationReminders(handler: (reminder: unknown) => void) {
  useSocketEvent(WebSocketEvent.MEDICATION_REMINDER, handler);
}

// ==========================================
// BACKWARD COMPATIBILITY EXPORTS
// ==========================================

// Re-export individual services for advanced usage
export { ConnectionManager, connectionManager } from './socket-manager';
export { MessageQueue, messageQueue } from './socket-queue';
export { EventManager, eventManager } from './socket-events';

// Re-export WebSocket service for compatibility
export { WebSocketService, webSocketService } from '../websocket/WebSocketService';

// Re-export types
export type {
  ConnectionState as SocketConnectionState,
  ConnectionMetrics as SocketConnectionMetrics,
  SendMessagePayload as SocketSendMessagePayload,
  TypingIndicator as SocketTypingIndicator,
  Message as SocketMessage,
  Notification as SocketNotification,
  ReadReceipt as SocketReadReceipt,
} from './socket.types';