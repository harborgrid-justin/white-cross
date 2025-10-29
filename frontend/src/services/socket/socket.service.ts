/**
 * Socket.io Messaging Service
 *
 * Main Socket.io client service for real-time messaging
 *
 * Features:
 * - JWT authentication
 * - Auto-reconnection with exponential backoff
 * - Connection state management
 * - Heartbeat/ping-pong
 * - Event emitter
 * - Offline message queue
 * - Message deduplication
 * - Retry logic
 *
 * @module services/socket/socket.service
 */

import { io, Socket } from 'socket.io-client';
import {
  ConnectionState,
  SocketEvent,
  EventHandler,
  StateChangeListener,
  SendMessagePayload,
  MessageReceivedPayload,
  MessageDeliveredPayload,
  MessageReadPayload,
  TypingPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  ConnectionConfirmedPayload,
  ConnectionErrorPayload,
  PongPayload,
  ConnectionMetrics,
  SocketEventPayloadMap
} from './socket.types';
import { socketConfig, SocketConfig } from './socket.config';
import { SocketEventManager } from './socket-events';
import { SocketConnectionManager } from './socket-manager';
import { SocketMessageQueue } from './socket-queue';

/**
 * Socket.io messaging service singleton
 */
export class SocketService {
  private socket: Socket | null = null;
  private config: SocketConfig;
  private eventManager: SocketEventManager;
  private connectionManager: SocketConnectionManager;
  private messageQueue: SocketMessageQueue;
  private currentToken: string | null = null;

  constructor(config: SocketConfig = socketConfig) {
    this.config = config;
    this.eventManager = new SocketEventManager(config.deduplicationWindow);
    this.connectionManager = new SocketConnectionManager(config);
    this.messageQueue = new SocketMessageQueue(config);
  }

  // ==========================================
  // CONNECTION MANAGEMENT
  // ==========================================

  /**
   * Connect to Socket.io server
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      if (this.config.debug) {
        console.warn('[SocketService] Already connected');
      }
      return;
    }

    this.currentToken = token;
    this.connectionManager.setState(ConnectionState.CONNECTING);

    this.socket = io(this.config.url, {
      path: this.config.path,
      auth: { token },
      transports: this.config.transports,
      reconnection: false, // We handle reconnection manually
      timeout: this.config.timeout
    });

    this.registerSocketEvents();

    if (this.config.debug) {
      console.log('[SocketService] Connecting to', this.config.url);
    }
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionManager.stopHeartbeat();
    this.connectionManager.clearReconnectTimer();
    this.connectionManager.setState(ConnectionState.DISCONNECTED);

    if (this.config.debug) {
      console.log('[SocketService] Disconnected');
    }
  }

  /**
   * Reconnect to Socket.io server
   */
  reconnect(token?: string): void {
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
   * Get connection state
   */
  getState(): ConnectionState {
    return this.connectionManager.getState();
  }

  /**
   * Get connection metrics
   */
  getMetrics(): ConnectionMetrics {
    return this.connectionManager.getMetrics();
  }

  // ==========================================
  // EVENT SUBSCRIPTION
  // ==========================================

  /**
   * Subscribe to event
   */
  on<K extends keyof SocketEventPayloadMap>(
    event: K,
    handler: EventHandler<SocketEventPayloadMap[K]>
  ): void;
  on(event: string, handler: EventHandler): void;
  on(event: string, handler: EventHandler): void {
    this.eventManager.on(event, handler);
  }

  /**
   * Unsubscribe from event
   */
  off<K extends keyof SocketEventPayloadMap>(
    event: K,
    handler: EventHandler<SocketEventPayloadMap[K]>
  ): void;
  off(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void {
    this.eventManager.off(event, handler);
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(listener: StateChangeListener): void {
    this.connectionManager.onStateChange(listener);
  }

  /**
   * Unsubscribe from state changes
   */
  offStateChange(listener: StateChangeListener): void {
    this.connectionManager.offStateChange(listener);
  }

  // ==========================================
  // MESSAGE OPERATIONS
  // ==========================================

  /**
   * Send message
   */
  async sendMessage(payload: SendMessagePayload): Promise<void> {
    if (!this.isConnected()) {
      // Queue message for offline sending
      this.messageQueue.enqueue(payload);
      if (this.config.debug) {
        console.log('[SocketService] Message queued (offline):', payload);
      }
      return;
    }

    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.emit(
        SocketEvent.MESSAGE_SEND,
        payload,
        (response: { success: boolean; error?: string }) => {
          if (response.success) {
            this.connectionManager.incrementMessagesSent();
            resolve();
          } else {
            reject(new Error(response.error || 'Failed to send message'));
          }
        }
      );
    });
  }

  /**
   * Send typing indicator
   */
  sendTyping(conversationId: string, isTyping: boolean): void {
    if (!this.isConnected() || !this.socket) {
      if (this.config.debug) {
        console.warn('[SocketService] Cannot send typing: not connected');
      }
      return;
    }

    this.socket.emit(SocketEvent.MESSAGE_TYPING, {
      conversationId,
      isTyping
    });
  }

  /**
   * Mark message as read
   */
  markAsRead(messageId: string, conversationId: string): void {
    if (!this.isConnected() || !this.socket) {
      if (this.config.debug) {
        console.warn('[SocketService] Cannot mark as read: not connected');
      }
      return;
    }

    this.socket.emit(SocketEvent.MESSAGE_READ, {
      messageId,
      conversationId
    });
  }

  // ==========================================
  // QUEUE MANAGEMENT
  // ==========================================

  /**
   * Process offline message queue
   */
  async processQueue(): Promise<void> {
    if (!this.isConnected()) {
      console.warn('[SocketService] Cannot process queue: not connected');
      return;
    }

    await this.messageQueue.processQueue(
      async (payload) => {
        await this.sendMessage(payload);
      },
      (processed, total) => {
        if (this.config.debug) {
          console.log(`[SocketService] Queue progress: ${processed}/${total}`);
        }
      }
    );
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.messageQueue.size();
  }

  /**
   * Clear message queue
   */
  clearQueue(): void {
    this.messageQueue.clear();
  }

  // ==========================================
  // INTERNAL SOCKET EVENT HANDLERS
  // ==========================================

  /**
   * Register Socket.io event handlers
   */
  private registerSocketEvents(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      if (this.config.debug) {
        console.log('[SocketService] Connected:', this.socket?.id);
      }
      this.connectionManager.setState(ConnectionState.CONNECTED);
      this.connectionManager.resetReconnectAttempts();

      // Start heartbeat
      this.connectionManager.startHeartbeat(this.socket!, () => {
        this.socket?.emit(SocketEvent.PING, { timestamp: new Date().toISOString() });
      });

      // Process offline queue
      this.processQueue().catch(error => {
        console.error('[SocketService] Failed to process queue:', error);
      });
    });

    this.socket.on('disconnect', (reason) => {
      if (this.config.debug) {
        console.log('[SocketService] Disconnected:', reason);
      }
      this.connectionManager.stopHeartbeat();
      this.connectionManager.setState(ConnectionState.DISCONNECTED);

      // Schedule reconnection if not manual disconnect
      if (reason !== 'io client disconnect' && this.currentToken) {
        this.connectionManager.scheduleReconnect(
          this.socket!,
          this.currentToken,
          () => this.reconnect()
        );
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SocketService] Connection error:', error.message);
      this.connectionManager.setState(ConnectionState.ERROR);

      // Emit connection error event
      this.eventManager.emit(SocketEvent.CONNECTION_ERROR, {
        code: 'CONNECTION_ERROR',
        message: error.message
      });

      // Schedule reconnection
      if (this.currentToken) {
        this.connectionManager.scheduleReconnect(
          this.socket!,
          this.currentToken,
          () => this.reconnect()
        );
      }
    });

    // Connection confirmed
    this.socket.on(SocketEvent.CONNECTION_CONFIRMED, (data: ConnectionConfirmedPayload) => {
      if (this.config.debug) {
        console.log('[SocketService] Connection confirmed:', data);
      }
      this.eventManager.emit(SocketEvent.CONNECTION_CONFIRMED, data);
    });

    // Message events
    this.socket.on(SocketEvent.MESSAGE_RECEIVED, (data: MessageReceivedPayload) => {
      if (this.config.debug) {
        console.log('[SocketService] Message received:', data);
      }
      this.connectionManager.incrementMessagesReceived();
      this.eventManager.emit(SocketEvent.MESSAGE_RECEIVED, data, data.message.id);
    });

    this.socket.on(SocketEvent.MESSAGE_DELIVERED, (data: MessageDeliveredPayload) => {
      this.eventManager.emit(SocketEvent.MESSAGE_DELIVERED, data, data.messageId);
    });

    this.socket.on(SocketEvent.MESSAGE_READ, (data: MessageReadPayload) => {
      this.eventManager.emit(SocketEvent.MESSAGE_READ, data, data.messageId);
    });

    this.socket.on(SocketEvent.MESSAGE_TYPING, (data: TypingPayload) => {
      this.eventManager.emit(SocketEvent.MESSAGE_TYPING, data);
    });

    this.socket.on(SocketEvent.MESSAGE_EDITED, (data: MessageEditedPayload) => {
      this.eventManager.emit(SocketEvent.MESSAGE_EDITED, data, data.messageId);
    });

    this.socket.on(SocketEvent.MESSAGE_DELETED, (data: MessageDeletedPayload) => {
      this.eventManager.emit(SocketEvent.MESSAGE_DELETED, data, data.messageId);
    });

    // Heartbeat
    this.socket.on(SocketEvent.PONG, (data: PongPayload) => {
      this.connectionManager.handlePong();
      if (this.config.debug) {
        console.debug('[SocketService] Pong received:', data);
      }
    });

    // Error
    this.socket.on('error', (error) => {
      console.error('[SocketService] Socket error:', error);
    });
  }

  /**
   * Cleanup service
   */
  cleanup(): void {
    this.disconnect();
    this.eventManager.cleanup();
    this.connectionManager.cleanup();
    this.messageQueue.cleanup();
  }
}

// Export singleton instance
export const socketService = new SocketService();

export default socketService;
