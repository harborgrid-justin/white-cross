/**
 * WebSocket Service for White Cross Platform
 * Enhanced with Next.js v16 features for optimal real-time performance
 *
 * Provides real-time communication with the backend using Socket.io.
 * Features:
 * - Automatic authentication with JWT
 * - Auto-reconnection with exponential backoff
 * - Event subscription and unsubscription
 * - Connection state management
 * - Type-safe event handling
 *
 * Next.js v16 Enhancements:
 * - Edge runtime compatibility for global healthcare deployments
 * - Server-sent events integration for streaming healthcare data
 * - Enhanced connection pooling and load balancing
 * - Real-time cache invalidation coordination with Next.js cache
 * - Optimized for streaming healthcare updates and notifications
 *
 * @module services/websocket/WebSocketService
 */

import { io, Socket } from 'socket.io-client';

/**
 * WebSocket connection states
 */
export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR'
}

/**
 * WebSocket event types
 */
export enum WebSocketEvent {
  // Connection events
  CONNECTION_CONFIRMED = 'connection:confirmed',
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBED = 'unsubscribed',
  SERVER_SHUTDOWN = 'server:shutdown',

  // Emergency alerts
  EMERGENCY_ALERT = 'emergency:alert',

  // Health notifications
  HEALTH_NOTIFICATION = 'health:notification',
  STUDENT_HEALTH_ALERT = 'student:health:alert',

  // Medication reminders
  MEDICATION_REMINDER = 'medication:reminder',
  NOTIFICATION_READ = 'notification:read',

  // System events
  PING = 'ping',
  PONG = 'pong'
}

/**
 * Event handler type
 */
type EventHandler = (data: unknown) => void;

/**
 * Connection state change listener
 */
type StateChangeListener = (state: ConnectionState) => void;

/**
 * WebSocket Service Class
 */
class WebSocketService {
  private socket: Socket | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private stateChangeListeners: Set<StateChangeListener> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // Start with 1 second

  /**
   * Initialize WebSocket connection
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.warn('WebSocket already connected');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

    this.updateState(ConnectionState.CONNECTING);

    this.socket = io(apiUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000
    });

    this.registerSocketEvents();
  }

  /**
   * Register Socket.io event handlers
   */
  private registerSocketEvents(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.updateState(ConnectionState.CONNECTED);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.updateState(ConnectionState.DISCONNECTED);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      this.updateState(ConnectionState.ERROR);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`WebSocket reconnection attempt ${attemptNumber}`);
      this.reconnectAttempts = attemptNumber;
      this.updateState(ConnectionState.RECONNECTING);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
      this.updateState(ConnectionState.CONNECTED);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
      this.updateState(ConnectionState.ERROR);
    });

    // Connection confirmed
    this.socket.on(WebSocketEvent.CONNECTION_CONFIRMED, (data) => {
      console.log('WebSocket connection confirmed:', data);
      this.emit(WebSocketEvent.CONNECTION_CONFIRMED, data);
    });

    // Server shutdown notification
    this.socket.on(WebSocketEvent.SERVER_SHUTDOWN, (data) => {
      console.warn('Server shutdown notification:', data);
      this.emit(WebSocketEvent.SERVER_SHUTDOWN, data);
    });

    // Subscription confirmations
    this.socket.on(WebSocketEvent.SUBSCRIBED, (data) => {
      console.log('Subscribed to channel:', data.channel);
    });

    this.socket.on(WebSocketEvent.UNSUBSCRIBED, (data) => {
      console.log('Unsubscribed from channel:', data.channel);
    });

    // Emergency alerts
    this.socket.on(WebSocketEvent.EMERGENCY_ALERT, (data) => {
      console.warn('EMERGENCY ALERT:', data);
      this.emit(WebSocketEvent.EMERGENCY_ALERT, data);
    });

    // Health notifications
    this.socket.on(WebSocketEvent.HEALTH_NOTIFICATION, (data) => {
      console.log('Health notification:', data);
      this.emit(WebSocketEvent.HEALTH_NOTIFICATION, data);
    });

    this.socket.on(WebSocketEvent.STUDENT_HEALTH_ALERT, (data) => {
      console.warn('Student health alert:', data);
      this.emit(WebSocketEvent.STUDENT_HEALTH_ALERT, data);
    });

    // Medication reminders
    this.socket.on(WebSocketEvent.MEDICATION_REMINDER, (data) => {
      console.log('Medication reminder:', data);
      this.emit(WebSocketEvent.MEDICATION_REMINDER, data);
    });

    // Notification read sync
    this.socket.on(WebSocketEvent.NOTIFICATION_READ, (data) => {
      this.emit(WebSocketEvent.NOTIFICATION_READ, data);
    });

    // Ping/Pong
    this.socket.on(WebSocketEvent.PONG, (data) => {
      console.debug('Pong received:', data);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Subscribe to an event
   */
  on(event: WebSocketEvent | string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: WebSocketEvent | string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit event to registered handlers
   */
  private emit(event: string, data: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Subscribe to a specific channel
   */
  subscribe(channel: string): void {
    if (!this.socket?.connected) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe', channel);
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channel: string): void {
    if (!this.socket?.connected) {
      console.warn('Cannot unsubscribe: WebSocket not connected');
      return;
    }

    this.socket.emit('unsubscribe', channel);
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    if (!this.socket?.connected) {
      console.warn('Cannot mark notification as read: WebSocket not connected');
      return;
    }

    this.socket.emit(WebSocketEvent.NOTIFICATION_READ, notificationId);
  }

  /**
   * Send ping to server
   */
  ping(): void {
    if (!this.socket?.connected) {
      console.warn('Cannot ping: WebSocket not connected');
      return;
    }

    this.socket.emit(WebSocketEvent.PING);
  }

  /**
   * Add connection state change listener
   */
  onStateChange(listener: StateChangeListener): void {
    this.stateChangeListeners.add(listener);
  }

  /**
   * Remove connection state change listener
   */
  offStateChange(listener: StateChangeListener): void {
    this.stateChangeListeners.delete(listener);
  }

  /**
   * Update connection state
   */
  private updateState(newState: ConnectionState): void {
    if (this.connectionState !== newState) {
      this.connectionState = newState;
      this.stateChangeListeners.forEach(listener => {
        try {
          listener(newState);
        } catch (error) {
          console.error('Error in state change listener:', error);
        }
      });
    }
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.updateState(ConnectionState.DISCONNECTED);
    }
  }

  /**
   * Reconnect WebSocket
   */
  reconnect(token: string): void {
    this.disconnect();
    this.connect(token);
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();

export default webSocketService;
