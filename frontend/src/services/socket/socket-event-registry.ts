/**
 * Socket Event Registry
 *
 * Manages registration of Socket.io client events (connect, disconnect, error, etc.)
 * and application-level message events
 *
 * @module services/socket/socket-event-registry
 */

import { Socket } from 'socket.io-client';
import {
  ConnectionState,
  SocketEvent,
  MessageReceivedPayload,
  MessageDeliveredPayload,
  MessageReadPayload,
  TypingPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  ConnectionConfirmedPayload,
  PongPayload
} from './socket.types';
import { SocketConfig } from './socket.config';
import { SocketEventManager } from './socket-events';
import { SocketConnectionManager } from './socket-manager';

/**
 * Configuration for event registry
 */
export interface EventRegistryConfig {
  debug: boolean;
  onProcessQueue: () => Promise<void>;
  onReconnect: () => void;
}

/**
 * Socket event registry for managing all Socket.io event handlers
 */
export class SocketEventRegistry {
  private socket: Socket | null = null;
  private config: SocketConfig;
  private registryConfig: EventRegistryConfig;
  private eventManager: SocketEventManager;
  private connectionManager: SocketConnectionManager;
  private currentToken: string | null = null;

  constructor(
    config: SocketConfig,
    registryConfig: EventRegistryConfig,
    eventManager: SocketEventManager,
    connectionManager: SocketConnectionManager,
    currentToken: string | null = null
  ) {
    this.config = config;
    this.registryConfig = registryConfig;
    this.eventManager = eventManager;
    this.connectionManager = connectionManager;
    this.currentToken = currentToken;
  }

  /**
   * Update current authentication token
   */
  setCurrentToken(token: string | null): void {
    this.currentToken = token;
  }

  /**
   * Register all Socket.io event handlers
   */
  registerEvents(socket: Socket): void {
    this.socket = socket;

    // Register core connection events
    this.registerConnectionEvents();

    // Register application message events
    this.registerMessageEvents();

    // Register heartbeat events
    this.registerHeartbeatEvents();

    // Register error events
    this.registerErrorEvents();
  }

  /**
   * Register connection lifecycle events
   */
  private registerConnectionEvents(): void {
    if (!this.socket) return;

    // Connection established
    this.socket.on('connect', () => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Connected:', this.socket?.id);
      }
      this.connectionManager.setState(ConnectionState.CONNECTED);
      this.connectionManager.resetReconnectAttempts();

      // Start heartbeat monitoring
      this.connectionManager.startHeartbeat(this.socket!, () => {
        this.socket?.emit(SocketEvent.PING, { timestamp: new Date().toISOString() });
      });

      // Process offline message queue
      this.registryConfig.onProcessQueue().catch(error => {
        console.error('[SocketEventRegistry] Failed to process queue:', error);
      });
    });

    // Connection lost
    this.socket.on('disconnect', (reason) => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Disconnected:', reason);
      }
      this.connectionManager.stopHeartbeat();
      this.connectionManager.setState(ConnectionState.DISCONNECTED);

      // Schedule auto-reconnection if not manual disconnect
      if (reason !== 'io client disconnect' && this.currentToken) {
        this.connectionManager.scheduleReconnect(this.registryConfig.onReconnect);
      }
    });

    // Connection error
    this.socket.on('connect_error', (error) => {
      console.error('[SocketEventRegistry] Connection error:', error.message);
      this.connectionManager.setState(ConnectionState.ERROR);

      // Emit connection error event to application
      this.eventManager.emit(SocketEvent.CONNECTION_ERROR, {
        code: 'CONNECTION_ERROR',
        message: error.message
      });

      // Schedule reconnection
      if (this.currentToken) {
        this.connectionManager.scheduleReconnect(this.registryConfig.onReconnect);
      }
    });

    // Connection confirmed by server
    this.socket.on(SocketEvent.CONNECTION_CONFIRMED, (data: ConnectionConfirmedPayload) => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Connection confirmed:', data);
      }
      this.eventManager.emit(SocketEvent.CONNECTION_CONFIRMED, data);
    });
  }

  /**
   * Register message-related events
   */
  private registerMessageEvents(): void {
    if (!this.socket) return;

    // New message received
    this.socket.on(SocketEvent.MESSAGE_RECEIVED, (data: MessageReceivedPayload) => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Message received:', data);
      }
      this.connectionManager.incrementMessagesReceived();
      this.eventManager.emit(SocketEvent.MESSAGE_RECEIVED, data, data.message.id);
    });

    // Message delivered confirmation
    this.socket.on(SocketEvent.MESSAGE_DELIVERED, (data: MessageDeliveredPayload) => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Message delivered:', data.messageId);
      }
      this.eventManager.emit(SocketEvent.MESSAGE_DELIVERED, data, data.messageId);
    });

    // Message read confirmation
    this.socket.on(SocketEvent.MESSAGE_READ, (data: MessageReadPayload) => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Message read:', data.messageId);
      }
      this.eventManager.emit(SocketEvent.MESSAGE_READ, data, data.messageId);
    });

    // Typing indicator
    this.socket.on(SocketEvent.MESSAGE_TYPING, (data: TypingPayload) => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Typing status:', data);
      }
      this.eventManager.emit(SocketEvent.MESSAGE_TYPING, data);
    });

    // Message edited
    this.socket.on(SocketEvent.MESSAGE_EDITED, (data: MessageEditedPayload) => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Message edited:', data.messageId);
      }
      this.eventManager.emit(SocketEvent.MESSAGE_EDITED, data, data.messageId);
    });

    // Message deleted
    this.socket.on(SocketEvent.MESSAGE_DELETED, (data: MessageDeletedPayload) => {
      if (this.registryConfig.debug) {
        console.log('[SocketEventRegistry] Message deleted:', data.messageId);
      }
      this.eventManager.emit(SocketEvent.MESSAGE_DELETED, data, data.messageId);
    });
  }

  /**
   * Register heartbeat/ping-pong events
   */
  private registerHeartbeatEvents(): void {
    if (!this.socket) return;

    // Pong response from server
    this.socket.on(SocketEvent.PONG, (data: PongPayload) => {
      this.connectionManager.handlePong();
      if (this.registryConfig.debug) {
        console.debug('[SocketEventRegistry] Pong received:', data);
      }
    });
  }

  /**
   * Register error events
   */
  private registerErrorEvents(): void {
    if (!this.socket) return;

    // Generic socket error
    this.socket.on('error', (error) => {
      console.error('[SocketEventRegistry] Socket error:', error);
    });
  }

  /**
   * Unregister all event handlers
   */
  unregisterEvents(): void {
    if (!this.socket) return;

    // Remove all listeners from socket
    this.socket.removeAllListeners('connect');
    this.socket.removeAllListeners('disconnect');
    this.socket.removeAllListeners('connect_error');
    this.socket.removeAllListeners('error');
    this.socket.removeAllListeners(SocketEvent.CONNECTION_CONFIRMED);
    this.socket.removeAllListeners(SocketEvent.MESSAGE_RECEIVED);
    this.socket.removeAllListeners(SocketEvent.MESSAGE_DELIVERED);
    this.socket.removeAllListeners(SocketEvent.MESSAGE_READ);
    this.socket.removeAllListeners(SocketEvent.MESSAGE_TYPING);
    this.socket.removeAllListeners(SocketEvent.MESSAGE_EDITED);
    this.socket.removeAllListeners(SocketEvent.MESSAGE_DELETED);
    this.socket.removeAllListeners(SocketEvent.PONG);

    this.socket = null;
  }

  /**
   * Cleanup registry
   */
  cleanup(): void {
    this.unregisterEvents();
  }
}

export default SocketEventRegistry;
