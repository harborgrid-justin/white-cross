/**
 * Socket.io Type Definitions
 *
 * TypeScript interfaces and types for messaging socket service
 *
 * @module services/socket/socket.types
 */

/**
 * Connection states for socket lifecycle
 */
export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR'
}

/**
 * Socket event names for messaging
 */
export enum SocketEvent {
  // Connection events
  CONNECTION_CONFIRMED = 'connection:confirmed',
  CONNECTION_ERROR = 'connection:error',

  // Message events
  MESSAGE_RECEIVED = 'message:received',
  MESSAGE_DELIVERED = 'message:delivered',
  MESSAGE_READ = 'message:read',
  MESSAGE_TYPING = 'message:typing',
  MESSAGE_EDITED = 'message:edited',
  MESSAGE_DELETED = 'message:deleted',
  MESSAGE_SEND = 'message:send',

  // Heartbeat events
  PING = 'ping',
  PONG = 'pong'
}

/**
 * Base message interface
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date | string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
}

/**
 * Message received event payload
 */
export interface MessageReceivedPayload {
  message: Message;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
}

/**
 * Message delivery confirmation payload
 */
export interface MessageDeliveredPayload {
  messageId: string;
  conversationId: string;
  deliveredAt: Date | string;
  userId: string;
}

/**
 * Message read receipt payload
 */
export interface MessageReadPayload {
  messageId: string;
  conversationId: string;
  readAt: Date | string;
  userId: string;
}

/**
 * Typing indicator payload
 */
export interface TypingPayload {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

/**
 * Message edited event payload
 */
export interface MessageEditedPayload {
  messageId: string;
  conversationId: string;
  newContent: string;
  editedAt: Date | string;
}

/**
 * Message deleted event payload
 */
export interface MessageDeletedPayload {
  messageId: string;
  conversationId: string;
  deletedAt: Date | string;
  deletedBy: string;
}

/**
 * Connection confirmed payload
 */
export interface ConnectionConfirmedPayload {
  socketId: string;
  userId: string;
  connectedAt: Date | string;
}

/**
 * Connection error payload
 */
export interface ConnectionErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Heartbeat ping payload
 */
export interface PingPayload {
  timestamp: Date | string;
}

/**
 * Heartbeat pong payload
 */
export interface PongPayload {
  timestamp: Date | string;
  latency?: number;
}

/**
 * Send message payload
 */
export interface SendMessagePayload {
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  metadata?: Record<string, unknown>;
  tempId?: string;
}

/**
 * Event handler type
 */
export type EventHandler<T = unknown> = (payload: T) => void;

/**
 * Connection state change listener
 */
export type StateChangeListener = (state: ConnectionState) => void;

/**
 * Queued message for offline sending
 */
export interface QueuedMessage {
  id: string;
  payload: SendMessagePayload;
  attempts: number;
  timestamp: Date | string;
  lastAttempt?: Date | string;
}

/**
 * Socket service error
 */
export interface SocketError {
  code: string;
  message: string;
  timestamp: Date | string;
  context?: Record<string, unknown>;
}

/**
 * Connection metrics
 */
export interface ConnectionMetrics {
  connectedAt?: Date | string;
  disconnectedAt?: Date | string;
  reconnectAttempts: number;
  messagesReceived: number;
  messagesSent: number;
  latency?: number;
}

/**
 * Event payload map for type safety
 */
export interface SocketEventPayloadMap {
  [SocketEvent.CONNECTION_CONFIRMED]: ConnectionConfirmedPayload;
  [SocketEvent.CONNECTION_ERROR]: ConnectionErrorPayload;
  [SocketEvent.MESSAGE_RECEIVED]: MessageReceivedPayload;
  [SocketEvent.MESSAGE_DELIVERED]: MessageDeliveredPayload;
  [SocketEvent.MESSAGE_READ]: MessageReadPayload;
  [SocketEvent.MESSAGE_TYPING]: TypingPayload;
  [SocketEvent.MESSAGE_EDITED]: MessageEditedPayload;
  [SocketEvent.MESSAGE_DELETED]: MessageDeletedPayload;
  [SocketEvent.PING]: PingPayload;
  [SocketEvent.PONG]: PongPayload;
}

/**
 * Type-safe event handler map
 */
export type SocketEventHandlers = {
  [K in keyof SocketEventPayloadMap]?: EventHandler<SocketEventPayloadMap[K]>[];
};
