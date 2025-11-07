/**
 * WebSocket Type Definitions
 *
 * Type definitions for WebSocket connections, events, and real-time communication.
 *
 * @module types/api/websocket
 */

/**
 * WebSocket connection state
 */
export type WebSocketState =
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

/**
 * WebSocket event types
 */
export enum WebSocketEventType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  RECONNECT = 'reconnect',
  RECONNECT_ATTEMPT = 'reconnect_attempt',
  RECONNECT_ERROR = 'reconnect_error',
  RECONNECT_FAILED = 'reconnect_failed',
  MESSAGE = 'message',
}

/**
 * WebSocket message envelope
 */
export interface WebSocketMessage<T = unknown> {
  /**
   * Message type/event name
   */
  type: string;

  /**
   * Message payload
   */
  data: T;

  /**
   * Message ID for tracking
   */
  id?: string;

  /**
   * Timestamp
   */
  timestamp?: string;

  /**
   * Message metadata
   */
  meta?: Record<string, unknown>;
}

/**
 * WebSocket subscription options
 */
export interface WebSocketSubscriptionOptions {
  /**
   * Channel or topic to subscribe to
   */
  channel: string;

  /**
   * Subscription filters
   */
  filters?: Record<string, unknown>;

  /**
   * Authentication token for private channels
   */
  auth?: string;
}

/**
 * WebSocket subscription
 */
export interface WebSocketSubscription {
  /**
   * Subscription ID
   */
  id: string;

  /**
   * Channel name
   */
  channel: string;

  /**
   * Unsubscribe function
   */
  unsubscribe: () => void;

  /**
   * Whether subscription is active
   */
  active: boolean;
}

/**
 * WebSocket event handler
 */
export type WebSocketEventHandler<T = unknown> = (
  message: WebSocketMessage<T>,
) => void;

/**
 * WebSocket error event
 */
export interface WebSocketErrorEvent {
  /**
   * Error code
   */
  code: string;

  /**
   * Error message
   */
  message: string;

  /**
   * Additional error details
   */
  details?: unknown;

  /**
   * Error timestamp
   */
  timestamp: string;
}

/**
 * WebSocket connection configuration
 */
export interface WebSocketConfig {
  /**
   * WebSocket server URL
   */
  url: string;

  /**
   * Connection options
   */
  options?: {
    /**
     * Enable automatic reconnection
     */
    reconnection?: boolean;

    /**
     * Number of reconnection attempts before giving up
     */
    reconnectionAttempts?: number;

    /**
     * Delay between reconnection attempts in milliseconds
     */
    reconnectionDelay?: number;

    /**
     * Maximum delay between reconnection attempts
     */
    reconnectionDelayMax?: number;

    /**
     * Connection timeout in milliseconds
     */
    timeout?: number;

    /**
     * Transport methods
     */
    transports?: string[];

    /**
     * Authentication data
     */
    auth?: Record<string, unknown>;

    /**
     * Additional query parameters
     */
    query?: Record<string, string>;
  };
}

/**
 * Real-time notification event
 */
export interface RealtimeNotification {
  /**
   * Notification ID
   */
  id: string;

  /**
   * Notification type
   */
  type: string;

  /**
   * Notification title
   */
  title: string;

  /**
   * Notification message
   */
  message: string;

  /**
   * Notification severity
   */
  severity: 'info' | 'success' | 'warning' | 'error';

  /**
   * Notification data
   */
  data?: Record<string, unknown>;

  /**
   * Notification timestamp
   */
  timestamp: string;

  /**
   * Whether notification has been read
   */
  read: boolean;

  /**
   * Action links
   */
  actions?: Array<{
    label: string;
    url: string;
  }>;
}

/**
 * Real-time update event
 */
export interface RealtimeUpdate<T = unknown> {
  /**
   * Entity type being updated
   */
  entity: string;

  /**
   * Entity ID
   */
  entityId: string;

  /**
   * Update type
   */
  action: 'created' | 'updated' | 'deleted';

  /**
   * Updated data
   */
  data: T;

  /**
   * Update timestamp
   */
  timestamp: string;

  /**
   * User who made the update
   */
  updatedBy?: {
    id: string;
    name: string;
  };
}

/**
 * Presence event for user status
 */
export interface PresenceEvent {
  /**
   * User ID
   */
  userId: string;

  /**
   * User name
   */
  userName: string;

  /**
   * Online status
   */
  status: 'online' | 'offline' | 'away' | 'busy';

  /**
   * Last seen timestamp
   */
  lastSeen: string;

  /**
   * Additional presence data
   */
  metadata?: Record<string, unknown>;
}

/**
 * WebSocket client interface
 */
export interface WebSocketClient {
  /**
   * Current connection state
   */
  state: WebSocketState;

  /**
   * Connect to WebSocket server
   */
  connect: () => Promise<void>;

  /**
   * Disconnect from WebSocket server
   */
  disconnect: () => void;

  /**
   * Send message through WebSocket
   */
  send: <T = unknown>(type: string, data: T) => void;

  /**
   * Subscribe to a channel
   */
  subscribe: (
    options: WebSocketSubscriptionOptions,
    handler: WebSocketEventHandler,
  ) => WebSocketSubscription;

  /**
   * Unsubscribe from a channel
   */
  unsubscribe: (subscriptionId: string) => void;

  /**
   * Add event listener
   */
  on: <T = unknown>(event: string, handler: WebSocketEventHandler<T>) => void;

  /**
   * Remove event listener
   */
  off: (event: string, handler: WebSocketEventHandler) => void;

  /**
   * Check if connected
   */
  isConnected: () => boolean;
}
