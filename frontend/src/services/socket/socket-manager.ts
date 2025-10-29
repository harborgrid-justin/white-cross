/**
 * Socket Connection Manager
 *
 * Manages Socket.io connection lifecycle with exponential backoff,
 * heartbeat monitoring, and state management
 *
 * @module services/socket/socket-manager
 */

import { Socket } from 'socket.io-client';
import {
  ConnectionState,
  StateChangeListener,
  ConnectionMetrics,
  SocketError
} from './socket.types';
import { SocketConfig } from './socket.config';

/**
 * Connection manager for Socket.io messaging
 */
export class SocketConnectionManager {
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private stateListeners: Set<StateChangeListener> = new Set();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private heartbeatTimeoutTimer: NodeJS.Timeout | null = null;
  private metrics: ConnectionMetrics;
  private config: SocketConfig;
  private lastPingTime: number = 0;

  constructor(config: SocketConfig) {
    this.config = config;
    this.metrics = {
      reconnectAttempts: 0,
      messagesReceived: 0,
      messagesSent: 0
    };
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Update connection state and notify listeners
   */
  setState(newState: ConnectionState): void {
    if (this.connectionState !== newState) {
      const oldState = this.connectionState;
      this.connectionState = newState;

      if (this.config.debug) {
        console.log(`[SocketManager] State change: ${oldState} → ${newState}`);
      }

      // Update metrics
      if (newState === ConnectionState.CONNECTED) {
        this.metrics.connectedAt = new Date().toISOString();
        this.reconnectAttempts = 0;
        this.metrics.reconnectAttempts = 0;
      } else if (newState === ConnectionState.DISCONNECTED) {
        this.metrics.disconnectedAt = new Date().toISOString();
      }

      // Notify listeners
      this.stateListeners.forEach(listener => {
        try {
          listener(newState);
        } catch (error) {
          console.error('[SocketManager] Error in state listener:', error);
        }
      });
    }
  }

  /**
   * Add state change listener
   */
  onStateChange(listener: StateChangeListener): void {
    this.stateListeners.add(listener);
  }

  /**
   * Remove state change listener
   */
  offStateChange(listener: StateChangeListener): void {
    this.stateListeners.delete(listener);
  }

  /**
   * Calculate exponential backoff delay
   */
  private getReconnectDelay(): number {
    const { delay, delayMax } = this.config.reconnection;
    const exponentialDelay = delay * Math.pow(2, this.reconnectAttempts);
    return Math.min(exponentialDelay, delayMax);
  }

  /**
   * Handle reconnection with exponential backoff
   */
  scheduleReconnect(socket: Socket, token: string, reconnectFn: () => void): void {
    if (!this.config.reconnection.enabled) {
      console.log('[SocketManager] Reconnection disabled');
      return;
    }

    if (this.reconnectAttempts >= this.config.reconnection.attempts) {
      console.error('[SocketManager] Max reconnection attempts reached');
      this.setState(ConnectionState.ERROR);
      return;
    }

    this.reconnectAttempts++;
    this.metrics.reconnectAttempts = this.reconnectAttempts;

    const delay = this.getReconnectDelay();
    console.log(`[SocketManager] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.setState(ConnectionState.RECONNECTING);

    this.reconnectTimer = setTimeout(() => {
      reconnectFn();
    }, delay);
  }

  /**
   * Clear reconnection timer
   */
  clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Reset reconnection attempts
   */
  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
    this.metrics.reconnectAttempts = 0;
  }

  /**
   * Start heartbeat monitoring
   */
  startHeartbeat(socket: Socket, pingFn: () => void): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (socket.connected) {
        this.lastPingTime = Date.now();
        pingFn();

        // Set timeout for pong response
        this.heartbeatTimeoutTimer = setTimeout(() => {
          console.warn('[SocketManager] Heartbeat timeout - no pong received');
          // Socket might be dead, trigger reconnection
          socket.disconnect();
        }, this.config.heartbeatTimeout);
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Handle pong received
   */
  handlePong(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }

    // Calculate latency
    if (this.lastPingTime > 0) {
      this.metrics.latency = Date.now() - this.lastPingTime;
      if (this.config.debug) {
        console.debug(`[SocketManager] Latency: ${this.metrics.latency}ms`);
      }
    }
  }

  /**
   * Stop heartbeat monitoring
   */
  stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  /**
   * Increment messages received counter
   */
  incrementMessagesReceived(): void {
    this.metrics.messagesReceived++;
  }

  /**
   * Increment messages sent counter
   */
  incrementMessagesSent(): void {
    this.metrics.messagesSent++;
  }

  /**
   * Get connection metrics
   */
  getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      reconnectAttempts: 0,
      messagesReceived: 0,
      messagesSent: 0
    };
  }

  /**
   * Cleanup all timers and listeners
   */
  cleanup(): void {
    this.clearReconnectTimer();
    this.stopHeartbeat();
    this.stateListeners.clear();
  }
}

export default SocketConnectionManager;
