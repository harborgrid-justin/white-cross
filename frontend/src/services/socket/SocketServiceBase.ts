/**
 * Socket Service Base Class
 *
 * Base class for Socket.io connection and event management.
 * Handles connection lifecycle, event subscription, and core socket operations.
 *
 * @module services/socket/SocketServiceBase
 */

import { io, Socket } from 'socket.io-client';
import { EventManager } from './EventManager';
import { ConnectionManager } from './ConnectionManager';
import { MessageQueue } from './MessageQueue';

import {
  ConnectionState,
  WebSocketEvent,
  type SocketConfig,
  type ConnectionMetrics,
  type Message,
  type EventHandler,
  type StateChangeListener,
} from './types';

/**
 * Base Socket Service
 * Provides core connection management and event handling
 */
export abstract class SocketServiceBase {
  protected socket: Socket | null = null;
  protected config: SocketConfig;
  protected currentToken: string | null = null;

  // Modular managers
  protected eventManager: EventManager;
  protected connectionManager: ConnectionManager;
  protected messageQueue: MessageQueue;

  protected constructor(config: Partial<SocketConfig> = {}) {
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
   * Initialize event handlers
   */
  protected initializeEventHandlers(): void {
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
   * @param token - Authentication token
   * @throws Error if no token is provided
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
  protected registerSocketEvents(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('[SocketService] Connected:', this.socket?.id);
      this.connectionManager.updateState(ConnectionState.CONNECTED);

      // Process queued messages (implemented in subclass)
      this.processQueue();
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('[SocketService] Disconnected:', reason);
      this.connectionManager.updateState(ConnectionState.DISCONNECTED);

      // Schedule reconnect if not intentional disconnect
      if (reason !== 'io client disconnect') {
        this.connectionManager.scheduleReconnect(() => this.connect());
      }
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('[SocketService] Connection error:', error.message);
      this.connectionManager.updateState(ConnectionState.ERROR);
      this.connectionManager.scheduleReconnect(() => this.connect());
    });

    // Healthcare-specific events
    this.socket.on(WebSocketEvent.CONNECTION_CONFIRMED, (data: unknown) => {
      this.eventManager.emit(WebSocketEvent.CONNECTION_CONFIRMED, data);
    });

    this.socket.on(WebSocketEvent.EMERGENCY_ALERT, (data: unknown) => {
      console.warn('[SocketService] Emergency alert:', data);
      this.eventManager.emit(WebSocketEvent.EMERGENCY_ALERT, data);
    });

    this.socket.on(WebSocketEvent.HEALTH_NOTIFICATION, (data: unknown) => {
      this.eventManager.emit(WebSocketEvent.HEALTH_NOTIFICATION, data);
    });

    this.socket.on(WebSocketEvent.STUDENT_HEALTH_ALERT, (data: unknown) => {
      console.warn('[SocketService] Student health alert:', data);
      this.eventManager.emit(WebSocketEvent.STUDENT_HEALTH_ALERT, data);
    });

    this.socket.on(WebSocketEvent.MEDICATION_REMINDER, (data: unknown) => {
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

    this.socket.on(WebSocketEvent.MESSAGE_READ, (data: { messageId: string; receipt: unknown }) => {
      this.eventManager.emit(WebSocketEvent.MESSAGE_READ, data);
    });

    this.socket.on(WebSocketEvent.MESSAGE_TYPING, (indicator: unknown) => {
      this.eventManager.emit(WebSocketEvent.MESSAGE_TYPING, indicator);
    });

    // Notification events
    this.socket.on(WebSocketEvent.NOTIFICATION_NEW, (notification: unknown) => {
      this.eventManager.emit(WebSocketEvent.NOTIFICATION_NEW, notification);
    });

    this.socket.on(WebSocketEvent.NOTIFICATION_READ_RECEIPT, (data: unknown) => {
      this.eventManager.emit(WebSocketEvent.NOTIFICATION_READ_RECEIPT, data);
    });

    // Broadcast events
    this.socket.on(WebSocketEvent.BROADCAST_NEW, (data: unknown) => {
      this.eventManager.emit(WebSocketEvent.BROADCAST_NEW, data);
    });

    // System events
    this.socket.on(WebSocketEvent.PONG, (data: unknown) => {
      if (this.config.debug) {
        console.debug('[SocketService] Pong received:', data);
      }
    });

    // Error handling
    this.socket.on('error', (error: Error) => {
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
   * @param token - Optional new authentication token
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
   * @param event - Event name
   * @param handler - Event handler function
   */
  public on(event: string, handler: EventHandler): void {
    this.eventManager.on(event, handler);
  }

  /**
   * Unsubscribe from event
   * @param event - Event name
   * @param handler - Event handler function
   */
  public off(event: string, handler: EventHandler): void {
    this.eventManager.off(event, handler);
  }

  /**
   * Subscribe to state changes
   * @param listener - State change listener function
   */
  public onStateChange(listener: StateChangeListener): void {
    this.connectionManager.setStateChangeCallback(listener);
  }

  /**
   * Unsubscribe from state changes
   * Note: ConnectionManager doesn't support multiple callbacks, this is a limitation
   * @param _listener - State change listener function (unused)
   */
  public offStateChange(_listener: StateChangeListener): void {
    // Note: ConnectionManager doesn't have offStateChange, this is a limitation
    // We keep this method for API consistency but it's currently a no-op
  }

  // ==========================================
  // ABSTRACT METHODS
  // ==========================================

  /**
   * Process offline message queue
   * Must be implemented by subclass
   */
  protected abstract processQueue(): Promise<void>;

  /**
   * Cleanup service
   * Must be implemented by subclass
   */
  public abstract cleanup(): void;
}
