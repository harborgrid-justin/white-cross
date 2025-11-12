/**
 * Connection Manager
 *
 * Handles socket connection lifecycle, reconnection, and state management
 */

import type { Socket } from 'socket.io-client';
import { ConnectionState, type SocketConfig, type ConnectionEvent } from './types';

export class ConnectionManager {
  private socket: Socket | null = null;
  private config: SocketConfig;
  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private connectionTimeout: number;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectionTimer: NodeJS.Timeout | null = null;
  private onStateChange?: (state: ConnectionState) => void;
  private onConnectionEvent?: (event: ConnectionEvent) => void;

  constructor(config: SocketConfig) {
    this.config = config;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 5;
    this.reconnectDelay = config.reconnectDelay || 1000;
    this.connectionTimeout = config.connectionTimeout || 10000;
  }

  /**
   * Set state change callback
   */
  setStateChangeCallback(callback: (state: ConnectionState) => void): void {
    this.onStateChange = callback;
  }

  /**
   * Set connection event callback
   */
  setConnectionEventCallback(callback: (event: ConnectionEvent) => void): void {
    this.onConnectionEvent = callback;
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Update connection state
   */
  private updateState(newState: ConnectionState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.onStateChange?.(newState);
    }
  }

  /**
   * Emit connection event
   */
  private emitConnectionEvent(event: ConnectionEvent): void {
    this.onConnectionEvent?.(event);
  }

  /**
   * Connect to socket server
   */
  async connect(): Promise<void> {
    if (this.state === 'connecting' || this.state === 'connected') {
      return;
    }

    this.updateState(ConnectionState.CONNECTING);
    this.emitConnectionEvent({ type: 'connecting' });

    try {
      // Create socket connection
      const { io } = await import('socket.io-client');

      this.socket = io(this.config.url, {
        transports: this.config.transports,
        timeout: this.connectionTimeout,
        forceNew: true,
        autoConnect: false,
        auth: this.config.auth,
        query: this.config.query,
      });

      // Set up event listeners
      this.setupSocketListeners();

      // Start connection with timeout
      await this.connectWithTimeout();

    } catch (error) {
      console.error('Socket connection failed:', error);
      this.updateState(ConnectionState.DISCONNECTED);
      this.emitConnectionEvent({
        type: 'error',
        error: error instanceof Error ? error.message : 'Connection failed'
      });
      throw error;
    }
  }

  /**
   * Connect with timeout
   */
  private async connectWithTimeout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      const cleanup = () => {
        if (this.connectionTimer) {
          clearTimeout(this.connectionTimer);
          this.connectionTimer = null;
        }
      };

      this.connectionTimer = setTimeout(() => {
        cleanup();
        this.socket?.disconnect();
        reject(new Error('Connection timeout'));
      }, this.connectionTimeout);

      this.socket.connect();

      this.socket.once('connect', () => {
        cleanup();
        resolve();
      });

      this.socket.once('connect_error', (error) => {
        cleanup();
        reject(error);
      });
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.updateState(ConnectionState.DISCONNECTED);
    this.emitConnectionEvent({ type: 'disconnected' });
    this.reconnectAttempts = 0;
  }

  /**
   * Attempt to reconnect
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.updateState(ConnectionState.DISCONNECTED);
      this.emitConnectionEvent({
        type: 'error',
        error: 'Max reconnection attempts reached'
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    this.reconnectTimer = setTimeout(async () => {
      this.emitConnectionEvent({
        type: 'reconnecting',
        attempt: this.reconnectAttempts
      });

      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnection attempt failed:', error);
        // Reconnection failed, schedule next attempt
        this.scheduleReconnect();
      }
    }, delay);
  }

  /**
   * Set up socket event listeners
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.updateState(ConnectionState.CONNECTED);
      this.emitConnectionEvent({ type: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      this.updateState(ConnectionState.DISCONNECTED);
      this.emitConnectionEvent({ type: 'disconnected', reason });

      // Auto-reconnect unless manually disconnected
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        // Don't auto-reconnect for manual disconnects
        return;
      }

      this.scheduleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emitConnectionEvent({
        type: 'error',
        error: error.message
      });
    });

    this.socket.on('reconnect', (attempt) => {
      this.reconnectAttempts = 0;
      this.updateState(ConnectionState.CONNECTED);
      this.emitConnectionEvent({ type: 'reconnected', attempt });
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      this.emitConnectionEvent({
        type: 'error',
        error: error.message
      });
    });

    this.socket.on('reconnect_failed', () => {
      this.updateState(ConnectionState.DISCONNECTED);
      this.emitConnectionEvent({
        type: 'error',
        error: 'Reconnection failed'
      });
    });
  }

  /**
   * Get the underlying socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.state === 'connected' && this.socket?.connected === true;
  }

  /**
   * Update connection state (public method for SocketService)
   */
  updateState(newState: ConnectionState): void {
    this.updateState(newState);
  }

  /**
   * Schedule reconnect (public method for SocketService)
   */
  scheduleReconnect(callback?: () => void): void {
    this.scheduleReconnect();
    // Note: callback parameter not used in current implementation
  }

  /**
   * Get connection state (public method for SocketService)
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Get connection metrics (public method for SocketService)
   */
  getMetrics(): ConnectionMetrics {
    return {
      connectTime: this.metrics.connectTime,
      disconnectTime: this.metrics.disconnectTime,
      reconnectCount: this.metrics.reconnectCount,
      messageCount: this.metrics.messageCount,
      errorCount: this.metrics.errorCount,
      lastPing: this.metrics.lastPing,
      averageLatency: this.metrics.averageLatency
    };
  }

  /**
   * Reset reconnect attempts (public method for SocketService)
   */
  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
  }

  /**
   * Set state change callback (public method for SocketService)
   */
  onStateChange(callback: (state: ConnectionState) => void): void {
    this.onStateChange = callback;
  }

  /**
   * Remove state change callback (public method for SocketService)
   */
  offStateChange(callback: (state: ConnectionState) => void): void {
    if (this.onStateChange === callback) {
      this.onStateChange = undefined;
    }
  }
}