/**
 * Socket Service Types
 *
 * Centralized type definitions for socket functionality
 */

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

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
  PONG = 'pong',

  // Message events (from lib/socket)
  MESSAGE_NEW = 'message:new',
  MESSAGE_UPDATED = 'message:updated',
  MESSAGE_DELETED = 'message:deleted',
  MESSAGE_READ = 'message:read',
  MESSAGE_TYPING = 'message:typing',

  // Notification events
  NOTIFICATION_NEW = 'notification:new',
  NOTIFICATION_READ_RECEIPT = 'notification:read:receipt',

  // Broadcast events
  BROADCAST_NEW = 'broadcast:new',
}

export interface SocketConfig {
  url?: string;
  path?: string;
  token?: string;
  transports?: string[];
  timeout?: number;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  autoConnect?: boolean;
  debug?: boolean;
  deduplicationWindow?: number;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  connectionTimeout?: number;
  auth?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export interface ConnectionMetrics {
  connectTime: number;
  disconnectTime: number;
  reconnectCount: number;
  messageCount: number;
  errorCount: number;
  lastPing: number;
  averageLatency: number;
}

export interface SendMessagePayload {
  content: string;
  conversationId: string;
  recipientIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: number;
}

export interface Message {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  recipientIds: string[];
  timestamp: number;
  metadata?: Record<string, unknown>;
  readBy?: string[];
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  recipientId: string;
  timestamp: number;
  read: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReadReceipt {
  messageId: string;
  userId: string;
  timestamp: number;
}

export type EventHandler = (data: unknown) => void;
export type StateChangeListener = (state: ConnectionState) => void;

export interface ConnectionEvent {
  type: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'reconnected' | 'error';
  error?: string;
  reason?: string;
  attempt?: number;
}

export interface SocketContextValue {
  isConnected: boolean;
  connectionState: ConnectionState;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  onMessage: (handler: (message: Message) => void) => () => void;
  onNotification: (handler: (notification: Notification) => void) => () => void;
  onTyping: (handler: (indicator: TypingIndicator) => void) => () => void;
  sendTypingIndicator: (isTyping: boolean, data: { threadId?: string; recipientIds?: string[] }) => void;
  sendMessage: (message: Partial<Message>) => Promise<Message>;
  markMessageAsRead: (messageId: string) => void;
  markNotificationAsRead: (notificationIds: string[]) => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
}

export interface SocketProviderProps {
  children: React.ReactNode;
  token?: string;
  url?: string;
  autoConnect?: boolean;
}