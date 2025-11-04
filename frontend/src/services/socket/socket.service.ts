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
  EventHandler,
  StateChangeListener,
  SendMessagePayload,
  ConnectionMetrics,
  SocketEventPayloadMap
} from './socket.types';
import { socketConfig, SocketConfig } from './socket.config';
import { SocketEventManager } from './socket-events';
import { SocketConnectionManager } from './socket-manager';
import { SocketMessageQueue } from './socket-queue';
import { SocketEventRegistry } from './socket-event-registry';
import { SocketMessageHandler } from './socket-message-handler';

/**
 * Socket.io messaging service singleton
 */
export class SocketService {
  private socket: Socket | null = null;
  private config: SocketConfig;
  private eventManager: SocketEventManager;
  private connectionManager: SocketConnectionManager;
  private messageQueue: SocketMessageQueue;
  private eventRegistry: SocketEventRegistry;
  private messageHandler: SocketMessageHandler;
  private currentToken: string | null = null;

  constructor(config: SocketConfig = socketConfig) {
    this.config = config;

    // Initialize managers
    this.eventManager = new SocketEventManager(config.deduplicationWindow);
    this.connectionManager = new SocketConnectionManager(config);
    this.messageQueue = new SocketMessageQueue(config);

    // Initialize handlers
    this.messageHandler = new SocketMessageHandler(
      config,
      this.connectionManager,
      this.messageQueue
    );

    // Initialize event registry with callbacks
    this.eventRegistry = new SocketEventRegistry(
      config,
      {
        debug: config.debug,
        onProcessQueue: () => this.processQueue(),
        onReconnect: () => this.reconnect()
      },
      this.eventManager,
      this.connectionManager,
      this.currentToken
    );
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
    this.eventRegistry.setCurrentToken(token);
    this.connectionManager.setState(ConnectionState.CONNECTING);

    // Create socket connection
    this.socket = io(this.config.url, {
      path: this.config.path,
      auth: { token },
      transports: this.config.transports,
      reconnection: false, // We handle reconnection manually
      timeout: this.config.timeout
    });

    // Register all event handlers
    this.eventRegistry.registerEvents(this.socket);

    // Provide socket to message handler
    this.messageHandler.setSocket(this.socket);

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
    this.messageHandler.setSocket(null);

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
      this.eventRegistry.setCurrentToken(token);
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
    return this.messageHandler.sendMessage(payload);
  }

  /**
   * Send typing indicator
   */
  sendTyping(conversationId: string, isTyping: boolean): void {
    this.messageHandler.sendTyping(conversationId, isTyping);
  }

  /**
   * Mark message as read
   */
  markAsRead(messageId: string, conversationId: string): void {
    this.messageHandler.markAsRead(messageId, conversationId);
  }

  // ==========================================
  // QUEUE MANAGEMENT
  // ==========================================

  /**
   * Process offline message queue
   */
  async processQueue(): Promise<void> {
    return this.messageHandler.processQueue();
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.messageHandler.getQueueSize();
  }

  /**
   * Clear message queue
   */
  clearQueue(): void {
    this.messageHandler.clearQueue();
  }

  // ==========================================
  // CLEANUP
  // ==========================================

  /**
   * Cleanup service
   */
  cleanup(): void {
    this.disconnect();
    this.eventManager.cleanup();
    this.connectionManager.cleanup();
    this.messageQueue.cleanup();
    this.eventRegistry.cleanup();
    this.messageHandler.cleanup();
  }
}

// Export singleton instance
export const socketService = new SocketService();

export default socketService;
