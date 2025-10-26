/**
 * Socket.io Client for Real-time Communications
 *
 * Singleton Socket.io client with automatic reconnection,
 * authentication, and typed event handlers
 */

import { io, Socket } from 'socket.io-client';
import type {
  Message,
  TypingIndicator,
  ReadReceipt
} from '@/lib/validations/message.schemas';
import type {
  Notification
} from '@/lib/validations/notification.schemas';

/**
 * Socket.io server events (server -> client)
 */
export interface ServerToClientEvents {
  // Message events
  'message:new': (message: Message) => void;
  'message:updated': (message: Message) => void;
  'message:deleted': (messageId: string) => void;
  'message:read': (data: { messageId: string; receipt: ReadReceipt }) => void;
  'message:typing': (indicator: TypingIndicator) => void;

  // Notification events
  'notification:new': (notification: Notification) => void;
  'notification:read': (notificationIds: string[]) => void;
  'notification:deleted': (notificationIds: string[]) => void;

  // Broadcast events
  'broadcast:new': (data: { id: string; title: string; priority: string }) => void;

  // Connection events
  'connect': () => void;
  'disconnect': (reason: string) => void;
  'reconnect': (attemptNumber: number) => void;
  'reconnect_error': (error: Error) => void;
  'error': (error: Error) => void;
}

/**
 * Socket.io client events (client -> server)
 */
export interface ClientToServerEvents {
  // Message events
  'message:send': (message: Partial<Message>, callback: (response: { success: boolean; data?: Message; error?: string }) => void) => void;
  'message:read': (messageId: string) => void;
  'message:typing:start': (data: { threadId?: string; recipientIds?: string[] }) => void;
  'message:typing:stop': (data: { threadId?: string; recipientIds?: string[] }) => void;

  // Notification events
  'notification:read': (notificationIds: string[]) => void;

  // Presence events
  'presence:online': () => void;
  'presence:away': () => void;
  'presence:offline': () => void;

  // Authentication
  'authenticate': (token: string, callback: (response: { success: boolean; error?: string }) => void) => void;
}

/**
 * Socket connection state
 */
export type SocketState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

/**
 * Socket client configuration
 */
export interface SocketClientConfig {
  url: string;
  token: string;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  timeout?: number;
  autoConnect?: boolean;
}

/**
 * Socket client class
 */
class SocketClient {
  private static instance: SocketClient | null = null;
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private config: SocketClientConfig | null = null;
  private connectionState: SocketState = 'disconnected';
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  /**
   * Initialize socket connection
   */
  public initialize(config: SocketClientConfig): void {
    if (this.socket?.connected) {
      console.warn('Socket already connected');
      return;
    }

    this.config = {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      ...config
    };

    this.socket = io(this.config.url, {
      auth: {
        token: this.config.token
      },
      reconnection: true,
      reconnectionAttempts: this.config.reconnectionAttempts,
      reconnectionDelay: this.config.reconnectionDelay,
      reconnectionDelayMax: this.config.reconnectionDelayMax,
      timeout: this.config.timeout,
      autoConnect: this.config.autoConnect,
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      upgrade: true
    });

    this.setupEventHandlers();
  }

  /**
   * Setup internal event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.connectionState = 'connected';
      this.emit('connection:state', this.connectionState);

      // Clear reconnect timer
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connectionState = 'disconnected';
      this.emit('connection:state', this.connectionState);

      // Handle disconnection reasons
      if (reason === 'io server disconnect') {
        // Server disconnected the socket, manual reconnection required
        console.log('Server disconnected socket, attempting reconnect...');
        setTimeout(() => this.socket?.connect(), 1000);
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.connectionState = 'connected';
      this.emit('connection:state', this.connectionState);
    });

    this.socket.io.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket reconnection attempt:', attemptNumber);
      this.connectionState = 'reconnecting';
      this.emit('connection:state', this.connectionState);
    });

    this.socket.io.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      this.connectionState = 'error';
      this.emit('connection:state', this.connectionState);
      this.emit('connection:error', error);
    });

    this.socket.io.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after maximum attempts');
      this.connectionState = 'error';
      this.emit('connection:state', this.connectionState);
      this.emit('connection:error', new Error('Reconnection failed'));
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.connectionState = 'error';
      this.emit('connection:state', this.connectionState);
      this.emit('connection:error', error);
    });
  }

  /**
   * Connect socket
   */
  public connect(): void {
    if (!this.socket) {
      throw new Error('Socket not initialized. Call initialize() first.');
    }

    if (!this.socket.connected) {
      this.connectionState = 'connecting';
      this.socket.connect();
    }
  }

  /**
   * Disconnect socket
   */
  public disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
    this.connectionState = 'disconnected';
  }

  /**
   * Update authentication token
   */
  public updateToken(token: string): void {
    if (this.socket) {
      this.socket.auth = { token };

      // Reconnect with new token if already connected
      if (this.socket.connected) {
        this.socket.disconnect();
        this.socket.connect();
      }
    }
  }

  /**
   * Get connection state
   */
  public getState(): SocketState {
    return this.connectionState;
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Register event listener
   */
  public on<K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K]
  ): void {
    if (!this.socket) {
      throw new Error('Socket not initialized. Call initialize() first.');
    }

    this.socket.on(event, handler as any);

    // Track listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(handler);
  }

  /**
   * Register one-time event listener
   */
  public once<K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K]
  ): void {
    if (!this.socket) {
      throw new Error('Socket not initialized. Call initialize() first.');
    }

    this.socket.once(event, handler as any);
  }

  /**
   * Remove event listener
   */
  public off<K extends keyof ServerToClientEvents>(
    event: K,
    handler?: ServerToClientEvents[K]
  ): void {
    if (!this.socket) return;

    if (handler) {
      this.socket.off(event, handler as any);
      this.listeners.get(event)?.delete(handler);
    } else {
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  /**
   * Emit client event
   */
  public send<K extends keyof ClientToServerEvents>(
    event: K,
    ...args: Parameters<ClientToServerEvents[K]>
  ): void {
    if (!this.socket) {
      throw new Error('Socket not initialized. Call initialize() first.');
    }

    if (!this.socket.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit(event, ...(args as any));
  }

  /**
   * Emit client event with promise-based callback
   */
  public async sendAsync<K extends keyof ClientToServerEvents>(
    event: K,
    ...args: any[]
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized. Call initialize() first.'));
        return;
      }

      if (!this.socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Socket request timeout'));
      }, this.config?.timeout ?? 20000);

      this.socket.emit(event, ...args, (response: any) => {
        clearTimeout(timeout);
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || 'Unknown error'));
        }
      });
    });
  }

  /**
   * Internal emit for connection events
   */
  private emit(event: string, data: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * Remove all listeners
   */
  public removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
    this.listeners.clear();
  }

  /**
   * Destroy socket instance
   */
  public destroy(): void {
    this.removeAllListeners();
    this.disconnect();
    this.socket = null;
    this.config = null;
    SocketClient.instance = null;
  }
}

/**
 * Export singleton instance getter
 */
export const getSocketClient = (): SocketClient => SocketClient.getInstance();

/**
 * Hook-friendly socket helpers
 */
export const socketHelpers = {
  /**
   * Send message via socket
   */
  sendMessage: async (message: Partial<Message>): Promise<Message> => {
    const client = getSocketClient();
    return client.sendAsync('message:send', message);
  },

  /**
   * Mark message as read
   */
  markMessageAsRead: (messageId: string): void => {
    const client = getSocketClient();
    if (client.isConnected()) {
      client.send('message:read', messageId);
    }
  },

  /**
   * Send typing indicator
   */
  sendTypingIndicator: (isTyping: boolean, data: { threadId?: string; recipientIds?: string[] }): void => {
    const client = getSocketClient();
    if (client.isConnected()) {
      if (isTyping) {
        client.send('message:typing:start', data);
      } else {
        client.send('message:typing:stop', data);
      }
    }
  },

  /**
   * Mark notifications as read
   */
  markNotificationsAsRead: (notificationIds: string[]): void => {
    const client = getSocketClient();
    if (client.isConnected()) {
      client.send('notification:read', notificationIds);
    }
  }
};
