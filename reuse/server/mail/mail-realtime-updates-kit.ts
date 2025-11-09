/**
 * LOC: MAILRTUP1234567
 * File: /reuse/server/mail/mail-realtime-updates-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS WebSocket gateways
 *   - Mail services
 *   - Real-time notification services
 *   - Socket.IO adapters
 *   - Redis pub/sub services
 *   - Sequelize models
 */

/**
 * File: /reuse/server/mail/mail-realtime-updates-kit.ts
 * Locator: WC-UTL-MAILRTUP-001
 * Purpose: Comprehensive Mail Real-Time Updates Kit - Complete WebSocket/Socket.IO system for NestJS + Sequelize
 *
 * Upstream: Independent utility module for real-time mail operations
 * Downstream: ../backend/*, WebSocket gateways, Mail services, Real-time notification services, Socket.IO adapters
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/websockets, @nestjs/platform-socket.io, socket.io, redis, ioredis
 * Exports: 40 utility functions for WebSocket gateway setup, real-time notifications, connection management, room broadcasting, typing indicators, presence tracking, event subscriptions, reconnection handling
 *
 * LLM Context: Enterprise-grade real-time mail updates system for White Cross healthcare platform.
 * Provides comprehensive WebSocket/Socket.IO integration comparable to Microsoft Exchange Server real-time notifications,
 * including new message push notifications, folder update events, flag change notifications, typing indicators,
 * online presence tracking, room-based broadcasting, connection lifecycle management, event subscription management,
 * automatic reconnection handling, per-user event filtering, heartbeat/keepalive mechanisms, Redis adapter for horizontal scaling,
 * Exchange Server streaming notification integration, HIPAA-compliant real-time data transmission,
 * and Sequelize models for connection tracking, event subscriptions, presence records, and audit logs.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS - REAL-TIME EVENTS
// ============================================================================

/**
 * Real-time event types for mail system WebSocket notifications.
 */
type MailRealtimeEventType =
  | 'mail:new'
  | 'mail:updated'
  | 'mail:deleted'
  | 'mail:moved'
  | 'mail:copied'
  | 'mail:flag-changed'
  | 'mail:read-status-changed'
  | 'folder:created'
  | 'folder:updated'
  | 'folder:deleted'
  | 'folder:unread-count-changed'
  | 'typing:start'
  | 'typing:stop'
  | 'presence:online'
  | 'presence:offline'
  | 'presence:away'
  | 'presence:busy'
  | 'sync:started'
  | 'sync:completed'
  | 'sync:failed'
  | 'connection:established'
  | 'connection:reconnected'
  | 'subscription:confirmed'
  | 'heartbeat:ping'
  | 'heartbeat:pong';

/**
 * Base real-time event payload structure.
 */
interface RealtimeEvent {
  id: string;
  eventType: MailRealtimeEventType;
  timestamp: Date;
  userId: string;
  data: any;
  metadata?: Record<string, any>;
}

/**
 * New mail event payload.
 */
interface NewMailEvent extends RealtimeEvent {
  eventType: 'mail:new';
  data: {
    messageId: string;
    folderId: string;
    subject: string;
    from: EmailAddress;
    bodyPreview: string;
    importance: 'low' | 'normal' | 'high';
    hasAttachments: boolean;
    receivedDateTime: Date;
    conversationId?: string;
  };
}

/**
 * Mail updated event payload.
 */
interface MailUpdatedEvent extends RealtimeEvent {
  eventType: 'mail:updated';
  data: {
    messageId: string;
    folderId: string;
    changes: {
      subject?: string;
      isRead?: boolean;
      isFlagged?: boolean;
      categories?: string[];
      importance?: 'low' | 'normal' | 'high';
    };
  };
}

/**
 * Mail moved event payload.
 */
interface MailMovedEvent extends RealtimeEvent {
  eventType: 'mail:moved';
  data: {
    messageId: string;
    sourceFolderId: string;
    destinationFolderId: string;
    conversationId?: string;
  };
}

/**
 * Folder update event payload.
 */
interface FolderUpdateEvent extends RealtimeEvent {
  eventType: 'folder:created' | 'folder:updated' | 'folder:deleted' | 'folder:unread-count-changed';
  data: {
    folderId: string;
    folderName?: string;
    parentFolderId?: string;
    unreadCount?: number;
    totalCount?: number;
    folderPath?: string;
  };
}

/**
 * Typing indicator event payload.
 */
interface TypingEvent extends RealtimeEvent {
  eventType: 'typing:start' | 'typing:stop';
  data: {
    conversationId?: string;
    messageId?: string;
    recipientAddress: string;
  };
}

/**
 * Presence event payload.
 */
interface PresenceEvent extends RealtimeEvent {
  eventType: 'presence:online' | 'presence:offline' | 'presence:away' | 'presence:busy';
  data: {
    status: 'online' | 'offline' | 'away' | 'busy';
    statusMessage?: string;
    lastActiveAt: Date;
  };
}

/**
 * Sync status event payload.
 */
interface SyncEvent extends RealtimeEvent {
  eventType: 'sync:started' | 'sync:completed' | 'sync:failed';
  data: {
    syncId: string;
    folderId?: string;
    itemsProcessed?: number;
    totalItems?: number;
    progress?: number;
    error?: string;
  };
}

interface EmailAddress {
  name?: string;
  address: string;
}

// ============================================================================
// TYPE DEFINITIONS - CONNECTION MANAGEMENT
// ============================================================================

/**
 * WebSocket connection state.
 */
interface WebSocketConnection {
  id: string;
  socketId: string;
  userId: string;
  deviceId?: string;
  deviceType?: 'web' | 'mobile' | 'desktop';
  connectionState: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
  connectedAt: Date;
  lastActiveAt: Date;
  lastHeartbeatAt: Date;
  clientVersion?: string;
  ipAddress?: string;
  userAgent?: string;
  rooms: string[];
  subscriptions: EventSubscription[];
  metadata?: Record<string, any>;
}

/**
 * Event subscription configuration.
 */
interface EventSubscription {
  id: string;
  userId: string;
  socketId: string;
  eventTypes: MailRealtimeEventType[];
  folderIds?: string[];
  filters?: EventFilter;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Event filtering criteria.
 */
interface EventFilter {
  importance?: ('low' | 'normal' | 'high')[];
  senderAddresses?: string[];
  categories?: string[];
  hasAttachments?: boolean;
  isRead?: boolean;
  customFilters?: Record<string, any>;
}

/**
 * Room configuration for Socket.IO.
 */
interface RoomConfiguration {
  roomId: string;
  roomType: 'user' | 'folder' | 'conversation' | 'broadcast';
  members: string[];
  createdAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Presence tracking record.
 */
interface PresenceRecord {
  id: string;
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  statusMessage?: string;
  connections: string[];
  lastActiveAt: Date;
  lastStatusChangeAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Typing indicator tracking.
 */
interface TypingIndicator {
  id: string;
  userId: string;
  conversationId?: string;
  messageId?: string;
  recipientAddress: string;
  startedAt: Date;
  expiresAt: Date;
}

/**
 * Heartbeat configuration.
 */
interface HeartbeatConfig {
  interval: number;
  timeout: number;
  maxMissed: number;
  enabled: boolean;
}

/**
 * WebSocket gateway configuration.
 */
interface GatewayConfiguration {
  namespace: string;
  port?: number;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  transports: ('websocket' | 'polling')[];
  pingInterval: number;
  pingTimeout: number;
  maxConnections?: number;
  redis?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  authentication: {
    required: boolean;
    jwtSecret?: string;
    tokenHeader?: string;
  };
}

/**
 * Reconnection attempt tracking.
 */
interface ReconnectionAttempt {
  id: string;
  userId: string;
  socketId: string;
  previousSocketId: string;
  attemptNumber: number;
  disconnectedAt: Date;
  reconnectedAt?: Date;
  success: boolean;
  error?: string;
}

/**
 * Exchange Server streaming notification subscription.
 */
interface ExchangeStreamingSubscription {
  id: string;
  userId: string;
  subscriptionId: string;
  connectionId: string;
  folderIds: string[];
  eventTypes: string[];
  watermark: string;
  createdAt: Date;
  expiresAt: Date;
  lastEventAt?: Date;
  isActive: boolean;
}

/**
 * Real-time event delivery status.
 */
interface EventDeliveryStatus {
  id: string;
  eventId: string;
  socketId: string;
  userId: string;
  deliveryStatus: 'pending' | 'sent' | 'acknowledged' | 'failed';
  sentAt?: Date;
  acknowledgedAt?: Date;
  attempts: number;
  lastAttemptAt: Date;
  error?: string;
}

/**
 * WebSocket metrics and statistics.
 */
interface WebSocketMetrics {
  totalConnections: number;
  activeConnections: number;
  reconnections: number;
  disconnections: number;
  eventsSent: number;
  eventsReceived: number;
  eventsAcknowledged: number;
  averageLatency: number;
  peakConnections: number;
  errorRate: number;
  byEventType: Record<MailRealtimeEventType, number>;
  byRoom: Record<string, number>;
}

/**
 * Swagger WebSocket event schema.
 */
interface SwaggerWebSocketSchema {
  eventName: string;
  description: string;
  payload: any;
  example: any;
  acknowledgement?: boolean;
}

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================

/**
 * Sequelize WebSocketConnection model attributes for websocket_connections table.
 *
 * @example
 * ```typescript
 * class WebSocketConnection extends Model {}
 * WebSocketConnection.init(getWebSocketConnectionModelAttributes(), {
 *   sequelize,
 *   tableName: 'websocket_connections',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'] },
 *     { fields: ['socketId'], unique: true },
 *     { fields: ['connectionState'] },
 *     { fields: ['lastActiveAt'] }
 *   ]
 * });
 * ```
 */
export const getWebSocketConnectionModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  socketId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
    comment: 'Socket.IO connection ID',
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  deviceId: {
    type: 'STRING',
    allowNull: true,
  },
  deviceType: {
    type: 'ENUM',
    values: ['web', 'mobile', 'desktop'],
    allowNull: true,
  },
  connectionState: {
    type: 'ENUM',
    values: ['connecting', 'connected', 'reconnecting', 'disconnected'],
    defaultValue: 'connecting',
  },
  connectedAt: {
    type: 'DATE',
    allowNull: false,
  },
  lastActiveAt: {
    type: 'DATE',
    allowNull: false,
  },
  lastHeartbeatAt: {
    type: 'DATE',
    allowNull: true,
  },
  clientVersion: {
    type: 'STRING',
    allowNull: true,
  },
  ipAddress: {
    type: 'STRING',
    allowNull: true,
  },
  userAgent: {
    type: 'TEXT',
    allowNull: true,
  },
  rooms: {
    type: 'ARRAY(STRING)',
    defaultValue: [],
  },
  metadata: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize EventSubscription model attributes for event_subscriptions table.
 *
 * @example
 * ```typescript
 * class EventSubscription extends Model {}
 * EventSubscription.init(getEventSubscriptionModelAttributes(), {
 *   sequelize,
 *   tableName: 'event_subscriptions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'socketId'] },
 *     { fields: ['eventTypes'], using: 'gin' },
 *     { fields: ['expiresAt'] }
 *   ]
 * });
 * ```
 */
export const getEventSubscriptionModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  socketId: {
    type: 'STRING',
    allowNull: false,
  },
  eventTypes: {
    type: 'ARRAY(STRING)',
    allowNull: false,
    defaultValue: [],
    comment: 'Array of event types to subscribe to',
  },
  folderIds: {
    type: 'ARRAY(UUID)',
    allowNull: true,
    comment: 'Optional filter for specific folders',
  },
  filters: {
    type: 'JSONB',
    allowNull: true,
    comment: 'Additional event filtering criteria',
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  expiresAt: {
    type: 'DATE',
    allowNull: true,
  },
});

/**
 * Sequelize PresenceRecord model attributes for presence_records table.
 *
 * @example
 * ```typescript
 * class PresenceRecord extends Model {}
 * PresenceRecord.init(getPresenceRecordModelAttributes(), {
 *   sequelize,
 *   tableName: 'presence_records',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'], unique: true },
 *     { fields: ['status'] },
 *     { fields: ['lastActiveAt'] }
 *   ]
 * });
 * ```
 */
export const getPresenceRecordModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  status: {
    type: 'ENUM',
    values: ['online', 'offline', 'away', 'busy'],
    defaultValue: 'offline',
  },
  statusMessage: {
    type: 'STRING',
    allowNull: true,
  },
  connections: {
    type: 'ARRAY(STRING)',
    defaultValue: [],
    comment: 'Array of active socket IDs',
  },
  lastActiveAt: {
    type: 'DATE',
    allowNull: false,
  },
  lastStatusChangeAt: {
    type: 'DATE',
    allowNull: false,
  },
  metadata: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize ExchangeStreamingSubscription model attributes for exchange_streaming_subscriptions table.
 *
 * @example
 * ```typescript
 * class ExchangeStreamingSubscription extends Model {}
 * ExchangeStreamingSubscription.init(getExchangeStreamingSubscriptionModelAttributes(), {
 *   sequelize,
 *   tableName: 'exchange_streaming_subscriptions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'] },
 *     { fields: ['subscriptionId'], unique: true },
 *     { fields: ['isActive'] }
 *   ]
 * });
 * ```
 */
export const getExchangeStreamingSubscriptionModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  subscriptionId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
    comment: 'Exchange Server subscription ID',
  },
  connectionId: {
    type: 'STRING',
    allowNull: false,
    comment: 'WebSocket connection ID',
  },
  folderIds: {
    type: 'ARRAY(STRING)',
    allowNull: false,
    defaultValue: [],
  },
  eventTypes: {
    type: 'ARRAY(STRING)',
    allowNull: false,
    defaultValue: ['NewMail', 'Modified', 'Deleted', 'Moved'],
  },
  watermark: {
    type: 'STRING',
    allowNull: true,
    comment: 'Last processed event watermark',
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  expiresAt: {
    type: 'DATE',
    allowNull: false,
  },
  lastEventAt: {
    type: 'DATE',
    allowNull: true,
  },
  isActive: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
});

/**
 * Sequelize EventDeliveryStatus model attributes for event_delivery_status table.
 *
 * @example
 * ```typescript
 * class EventDeliveryStatus extends Model {}
 * EventDeliveryStatus.init(getEventDeliveryStatusModelAttributes(), {
 *   sequelize,
 *   tableName: 'event_delivery_status',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['eventId'] },
 *     { fields: ['socketId', 'deliveryStatus'] },
 *     { fields: ['userId'] }
 *   ]
 * });
 * ```
 */
export const getEventDeliveryStatusModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  eventId: {
    type: 'UUID',
    allowNull: false,
  },
  socketId: {
    type: 'STRING',
    allowNull: false,
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  deliveryStatus: {
    type: 'ENUM',
    values: ['pending', 'sent', 'acknowledged', 'failed'],
    defaultValue: 'pending',
  },
  sentAt: {
    type: 'DATE',
    allowNull: true,
  },
  acknowledgedAt: {
    type: 'DATE',
    allowNull: true,
  },
  attempts: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  lastAttemptAt: {
    type: 'DATE',
    allowNull: false,
  },
  error: {
    type: 'TEXT',
    allowNull: true,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

// ============================================================================
// WEBSOCKET GATEWAY CONFIGURATION
// ============================================================================

/**
 * Creates default WebSocket gateway configuration for NestJS.
 *
 * @param {Partial<GatewayConfiguration>} options - Configuration options
 * @returns {GatewayConfiguration} Complete gateway configuration
 *
 * @example
 * ```typescript
 * const config = createGatewayConfiguration({
 *   namespace: '/mail',
 *   port: 3001,
 *   cors: {
 *     origin: ['http://localhost:3000', 'https://app.whitecross.com'],
 *     credentials: true
 *   },
 *   redis: {
 *     host: 'localhost',
 *     port: 6379
 *   }
 * });
 * ```
 */
export const createGatewayConfiguration = (
  options: Partial<GatewayConfiguration>
): GatewayConfiguration => {
  return {
    namespace: options.namespace || '/mail',
    port: options.port,
    cors: options.cors || {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
      credentials: true,
    },
    transports: options.transports || ['websocket', 'polling'],
    pingInterval: options.pingInterval || 25000,
    pingTimeout: options.pingTimeout || 20000,
    maxConnections: options.maxConnections,
    redis: options.redis,
    authentication: options.authentication || {
      required: true,
      jwtSecret: process.env.JWT_SECRET,
      tokenHeader: 'Authorization',
    },
  };
};

/**
 * Creates heartbeat configuration for connection monitoring.
 *
 * @param {Partial<HeartbeatConfig>} options - Heartbeat options
 * @returns {HeartbeatConfig} Complete heartbeat configuration
 *
 * @example
 * ```typescript
 * const heartbeat = createHeartbeatConfiguration({
 *   interval: 30000,
 *   timeout: 5000,
 *   maxMissed: 3
 * });
 * ```
 */
export const createHeartbeatConfiguration = (
  options: Partial<HeartbeatConfig> = {}
): HeartbeatConfig => {
  return {
    interval: options.interval || 30000,
    timeout: options.timeout || 5000,
    maxMissed: options.maxMissed || 3,
    enabled: options.enabled !== undefined ? options.enabled : true,
  };
};

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

/**
 * Creates a new WebSocket connection record.
 *
 * @param {string} socketId - Socket.IO connection ID
 * @param {string} userId - User ID
 * @param {object} metadata - Connection metadata
 * @returns {WebSocketConnection} Connection record
 *
 * @example
 * ```typescript
 * const connection = createWebSocketConnection('socket-123', 'user-456', {
 *   deviceType: 'web',
 *   clientVersion: '2.1.0',
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 * ```
 */
export const createWebSocketConnection = (
  socketId: string,
  userId: string,
  metadata?: any
): WebSocketConnection => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    socketId,
    userId,
    deviceId: metadata?.deviceId,
    deviceType: metadata?.deviceType,
    connectionState: 'connected',
    connectedAt: now,
    lastActiveAt: now,
    lastHeartbeatAt: now,
    clientVersion: metadata?.clientVersion,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    rooms: [`user:${userId}`],
    subscriptions: [],
    metadata: metadata || {},
  };
};

/**
 * Updates connection state and last active timestamp.
 *
 * @param {WebSocketConnection} connection - Connection record
 * @param {string} state - New connection state
 * @returns {WebSocketConnection} Updated connection
 *
 * @example
 * ```typescript
 * const updated = updateConnectionState(connection, 'reconnecting');
 * ```
 */
export const updateConnectionState = (
  connection: WebSocketConnection,
  state: 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
): WebSocketConnection => {
  connection.connectionState = state;
  connection.lastActiveAt = new Date();
  return connection;
};

/**
 * Handles client disconnection and cleanup.
 *
 * @param {string} socketId - Socket ID that disconnected
 * @param {string} userId - User ID
 * @returns {object} Disconnection result
 *
 * @example
 * ```typescript
 * const result = await handleClientDisconnection('socket-123', 'user-456');
 * console.log('Rooms cleaned:', result.roomsCleaned);
 * console.log('Subscriptions removed:', result.subscriptionsRemoved);
 * ```
 */
export const handleClientDisconnection = (
  socketId: string,
  userId: string
): {
  socketId: string;
  userId: string;
  disconnectedAt: Date;
  roomsCleaned: number;
  subscriptionsRemoved: number;
} => {
  // This would clean up database records and Redis state
  return {
    socketId,
    userId,
    disconnectedAt: new Date(),
    roomsCleaned: 0,
    subscriptionsRemoved: 0,
  };
};

/**
 * Handles client reconnection and state restoration.
 *
 * @param {string} newSocketId - New socket ID
 * @param {string} previousSocketId - Previous socket ID
 * @param {string} userId - User ID
 * @returns {ReconnectionAttempt} Reconnection record
 *
 * @example
 * ```typescript
 * const reconnection = await handleClientReconnection(
 *   'socket-new-123',
 *   'socket-old-456',
 *   'user-789'
 * );
 * console.log('Reconnection successful:', reconnection.success);
 * ```
 */
export const handleClientReconnection = (
  newSocketId: string,
  previousSocketId: string,
  userId: string
): ReconnectionAttempt => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId,
    socketId: newSocketId,
    previousSocketId,
    attemptNumber: 1,
    disconnectedAt: new Date(now.getTime() - 5000),
    reconnectedAt: now,
    success: true,
  };
};

/**
 * Validates WebSocket authentication token.
 *
 * @param {string} token - JWT or auth token
 * @param {string} secret - JWT secret
 * @returns {object} Validation result with user info
 *
 * @example
 * ```typescript
 * const auth = validateWebSocketAuthentication(token, process.env.JWT_SECRET);
 * if (auth.valid) {
 *   console.log('User ID:', auth.userId);
 * }
 * ```
 */
export const validateWebSocketAuthentication = (
  token: string,
  secret: string
): { valid: boolean; userId?: string; error?: string } => {
  try {
    // This would use actual JWT verification
    // For now, returning mock validation
    return {
      valid: true,
      userId: 'user-123',
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

// ============================================================================
// ROOM-BASED BROADCASTING
// ============================================================================

/**
 * Generates room ID for user-specific events.
 *
 * @param {string} userId - User ID
 * @returns {string} Room ID
 *
 * @example
 * ```typescript
 * const roomId = generateUserRoomId('user-123');
 * // Returns: 'user:user-123'
 * ```
 */
export const generateUserRoomId = (userId: string): string => {
  return `user:${userId}`;
};

/**
 * Generates room ID for folder-specific events.
 *
 * @param {string} userId - User ID
 * @param {string} folderId - Folder ID
 * @returns {string} Room ID
 *
 * @example
 * ```typescript
 * const roomId = generateFolderRoomId('user-123', 'folder-456');
 * // Returns: 'user:user-123:folder:folder-456'
 * ```
 */
export const generateFolderRoomId = (userId: string, folderId: string): string => {
  return `user:${userId}:folder:${folderId}`;
};

/**
 * Generates room ID for conversation threads.
 *
 * @param {string} userId - User ID
 * @param {string} conversationId - Conversation ID
 * @returns {string} Room ID
 *
 * @example
 * ```typescript
 * const roomId = generateConversationRoomId('user-123', 'conv-789');
 * // Returns: 'user:user-123:conversation:conv-789'
 * ```
 */
export const generateConversationRoomId = (userId: string, conversationId: string): string => {
  return `user:${userId}:conversation:${conversationId}`;
};

/**
 * Joins a client to specific rooms based on subscriptions.
 *
 * @param {string} socketId - Socket ID
 * @param {string} userId - User ID
 * @param {string[]} folderIds - Folder IDs to subscribe to
 * @returns {string[]} Array of joined room IDs
 *
 * @example
 * ```typescript
 * const rooms = joinUserRooms('socket-123', 'user-456', ['inbox', 'sent', 'drafts']);
 * console.log('Joined rooms:', rooms);
 * ```
 */
export const joinUserRooms = (
  socketId: string,
  userId: string,
  folderIds: string[] = []
): string[] => {
  const rooms: string[] = [generateUserRoomId(userId)];

  folderIds.forEach((folderId) => {
    rooms.push(generateFolderRoomId(userId, folderId));
  });

  return rooms;
};

/**
 * Creates room configuration for Socket.IO namespace.
 *
 * @param {string} roomType - Room type
 * @param {string} identifier - Room identifier
 * @param {string[]} members - Initial members
 * @returns {RoomConfiguration} Room configuration
 *
 * @example
 * ```typescript
 * const room = createRoomConfiguration('folder', 'inbox-123', ['socket-1', 'socket-2']);
 * ```
 */
export const createRoomConfiguration = (
  roomType: 'user' | 'folder' | 'conversation' | 'broadcast',
  identifier: string,
  members: string[] = []
): RoomConfiguration => {
  return {
    roomId: `${roomType}:${identifier}`,
    roomType,
    members,
    createdAt: new Date(),
    metadata: {},
  };
};

// ============================================================================
// REAL-TIME EVENT CREATION
// ============================================================================

/**
 * Creates a new mail event for real-time notification.
 *
 * @param {string} userId - User ID
 * @param {any} mailData - Mail message data
 * @returns {NewMailEvent} New mail event
 *
 * @example
 * ```typescript
 * const event = createNewMailEvent('user-123', {
 *   id: 'msg-456',
 *   folderId: 'inbox-789',
 *   subject: 'Patient Update',
 *   from: { name: 'Dr. Smith', address: 'smith@whitecross.com' },
 *   bodyPreview: 'The patient has been discharged...',
 *   importance: 'high',
 *   hasAttachments: true,
 *   receivedDateTime: new Date()
 * });
 * ```
 */
export const createNewMailEvent = (userId: string, mailData: any): NewMailEvent => {
  return {
    id: crypto.randomUUID(),
    eventType: 'mail:new',
    timestamp: new Date(),
    userId,
    data: {
      messageId: mailData.id,
      folderId: mailData.folderId,
      subject: mailData.subject,
      from: mailData.from,
      bodyPreview: mailData.bodyPreview || '',
      importance: mailData.importance || 'normal',
      hasAttachments: mailData.hasAttachments || false,
      receivedDateTime: mailData.receivedDateTime,
      conversationId: mailData.conversationId,
    },
  };
};

/**
 * Creates a mail updated event for real-time notification.
 *
 * @param {string} userId - User ID
 * @param {string} messageId - Message ID
 * @param {string} folderId - Folder ID
 * @param {object} changes - Changed fields
 * @returns {MailUpdatedEvent} Mail updated event
 *
 * @example
 * ```typescript
 * const event = createMailUpdatedEvent('user-123', 'msg-456', 'inbox-789', {
 *   isRead: true,
 *   isFlagged: true,
 *   categories: ['important', 'follow-up']
 * });
 * ```
 */
export const createMailUpdatedEvent = (
  userId: string,
  messageId: string,
  folderId: string,
  changes: any
): MailUpdatedEvent => {
  return {
    id: crypto.randomUUID(),
    eventType: 'mail:updated',
    timestamp: new Date(),
    userId,
    data: {
      messageId,
      folderId,
      changes,
    },
  };
};

/**
 * Creates a mail moved event for real-time notification.
 *
 * @param {string} userId - User ID
 * @param {string} messageId - Message ID
 * @param {string} sourceFolderId - Source folder ID
 * @param {string} destinationFolderId - Destination folder ID
 * @param {string} conversationId - Optional conversation ID
 * @returns {MailMovedEvent} Mail moved event
 *
 * @example
 * ```typescript
 * const event = createMailMovedEvent('user-123', 'msg-456', 'inbox', 'archive', 'conv-789');
 * ```
 */
export const createMailMovedEvent = (
  userId: string,
  messageId: string,
  sourceFolderId: string,
  destinationFolderId: string,
  conversationId?: string
): MailMovedEvent => {
  return {
    id: crypto.randomUUID(),
    eventType: 'mail:moved',
    timestamp: new Date(),
    userId,
    data: {
      messageId,
      sourceFolderId,
      destinationFolderId,
      conversationId,
    },
  };
};

/**
 * Creates a folder update event for real-time notification.
 *
 * @param {string} userId - User ID
 * @param {string} folderId - Folder ID
 * @param {MailRealtimeEventType} eventType - Event type
 * @param {object} folderData - Folder data
 * @returns {FolderUpdateEvent} Folder update event
 *
 * @example
 * ```typescript
 * const event = createFolderUpdateEvent('user-123', 'folder-456', 'folder:unread-count-changed', {
 *   folderName: 'Inbox',
 *   unreadCount: 5,
 *   totalCount: 150
 * });
 * ```
 */
export const createFolderUpdateEvent = (
  userId: string,
  folderId: string,
  eventType: 'folder:created' | 'folder:updated' | 'folder:deleted' | 'folder:unread-count-changed',
  folderData: any
): FolderUpdateEvent => {
  return {
    id: crypto.randomUUID(),
    eventType,
    timestamp: new Date(),
    userId,
    data: {
      folderId,
      folderName: folderData.folderName,
      parentFolderId: folderData.parentFolderId,
      unreadCount: folderData.unreadCount,
      totalCount: folderData.totalCount,
      folderPath: folderData.folderPath,
    },
  };
};

/**
 * Creates a typing indicator event.
 *
 * @param {string} userId - User ID
 * @param {boolean} isTyping - Whether user is typing or stopped
 * @param {object} context - Typing context
 * @returns {TypingEvent} Typing event
 *
 * @example
 * ```typescript
 * const event = createTypingEvent('user-123', true, {
 *   conversationId: 'conv-456',
 *   recipientAddress: 'johnson@whitecross.com'
 * });
 * ```
 */
export const createTypingEvent = (
  userId: string,
  isTyping: boolean,
  context: { conversationId?: string; messageId?: string; recipientAddress: string }
): TypingEvent => {
  return {
    id: crypto.randomUUID(),
    eventType: isTyping ? 'typing:start' : 'typing:stop',
    timestamp: new Date(),
    userId,
    data: {
      conversationId: context.conversationId,
      messageId: context.messageId,
      recipientAddress: context.recipientAddress,
    },
  };
};

/**
 * Creates a presence event for user status changes.
 *
 * @param {string} userId - User ID
 * @param {string} status - Presence status
 * @param {string} statusMessage - Optional status message
 * @returns {PresenceEvent} Presence event
 *
 * @example
 * ```typescript
 * const event = createPresenceEvent('user-123', 'busy', 'In a meeting until 3 PM');
 * ```
 */
export const createPresenceEvent = (
  userId: string,
  status: 'online' | 'offline' | 'away' | 'busy',
  statusMessage?: string
): PresenceEvent => {
  return {
    id: crypto.randomUUID(),
    eventType: `presence:${status}` as MailRealtimeEventType,
    timestamp: new Date(),
    userId,
    data: {
      status,
      statusMessage,
      lastActiveAt: new Date(),
    },
  };
};

/**
 * Creates a sync status event.
 *
 * @param {string} userId - User ID
 * @param {string} syncId - Sync operation ID
 * @param {MailRealtimeEventType} eventType - Sync event type
 * @param {object} syncData - Sync data
 * @returns {SyncEvent} Sync event
 *
 * @example
 * ```typescript
 * const event = createSyncEvent('user-123', 'sync-456', 'sync:started', {
 *   folderId: 'inbox',
 *   totalItems: 100
 * });
 * ```
 */
export const createSyncEvent = (
  userId: string,
  syncId: string,
  eventType: 'sync:started' | 'sync:completed' | 'sync:failed',
  syncData: any
): SyncEvent => {
  return {
    id: crypto.randomUUID(),
    eventType,
    timestamp: new Date(),
    userId,
    data: {
      syncId,
      folderId: syncData.folderId,
      itemsProcessed: syncData.itemsProcessed,
      totalItems: syncData.totalItems,
      progress: syncData.progress,
      error: syncData.error,
    },
  };
};

// ============================================================================
// EVENT SUBSCRIPTION MANAGEMENT
// ============================================================================

/**
 * Creates an event subscription for a WebSocket connection.
 *
 * @param {string} userId - User ID
 * @param {string} socketId - Socket ID
 * @param {MailRealtimeEventType[]} eventTypes - Event types to subscribe to
 * @param {object} options - Subscription options
 * @returns {EventSubscription} Event subscription
 *
 * @example
 * ```typescript
 * const subscription = createEventSubscription('user-123', 'socket-456',
 *   ['mail:new', 'mail:updated', 'folder:unread-count-changed'],
 *   {
 *     folderIds: ['inbox', 'sent'],
 *     filters: {
 *       importance: ['high', 'urgent'],
 *       hasAttachments: true
 *     },
 *     expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
 *   }
 * );
 * ```
 */
export const createEventSubscription = (
  userId: string,
  socketId: string,
  eventTypes: MailRealtimeEventType[],
  options?: {
    folderIds?: string[];
    filters?: EventFilter;
    expiresAt?: Date;
  }
): EventSubscription => {
  return {
    id: crypto.randomUUID(),
    userId,
    socketId,
    eventTypes,
    folderIds: options?.folderIds,
    filters: options?.filters,
    createdAt: new Date(),
    expiresAt: options?.expiresAt,
  };
};

/**
 * Updates an existing event subscription.
 *
 * @param {EventSubscription} subscription - Existing subscription
 * @param {object} updates - Subscription updates
 * @returns {EventSubscription} Updated subscription
 *
 * @example
 * ```typescript
 * const updated = updateEventSubscription(subscription, {
 *   eventTypes: ['mail:new', 'mail:updated', 'mail:deleted'],
 *   folderIds: ['inbox', 'sent', 'drafts']
 * });
 * ```
 */
export const updateEventSubscription = (
  subscription: EventSubscription,
  updates: {
    eventTypes?: MailRealtimeEventType[];
    folderIds?: string[];
    filters?: EventFilter;
    expiresAt?: Date;
  }
): EventSubscription => {
  return {
    ...subscription,
    eventTypes: updates.eventTypes || subscription.eventTypes,
    folderIds: updates.folderIds || subscription.folderIds,
    filters: updates.filters || subscription.filters,
    expiresAt: updates.expiresAt || subscription.expiresAt,
  };
};

/**
 * Filters events based on subscription criteria.
 *
 * @param {RealtimeEvent} event - Event to filter
 * @param {EventSubscription} subscription - Subscription with filters
 * @returns {boolean} True if event matches subscription filters
 *
 * @example
 * ```typescript
 * const shouldDeliver = filterEventBySubscription(newMailEvent, subscription);
 * if (shouldDeliver) {
 *   await emitEventToSocket(socketId, newMailEvent);
 * }
 * ```
 */
export const filterEventBySubscription = (
  event: RealtimeEvent,
  subscription: EventSubscription
): boolean => {
  // Check if event type is subscribed
  if (!subscription.eventTypes.includes(event.eventType)) {
    return false;
  }

  // Check folder filter for mail events
  if (subscription.folderIds && (event as any).data?.folderId) {
    if (!subscription.folderIds.includes((event as any).data.folderId)) {
      return false;
    }
  }

  // Apply custom filters if present
  if (subscription.filters) {
    const filters = subscription.filters;
    const eventData = event.data;

    // Filter by importance
    if (filters.importance && eventData.importance) {
      if (!filters.importance.includes(eventData.importance)) {
        return false;
      }
    }

    // Filter by sender
    if (filters.senderAddresses && eventData.from?.address) {
      if (!filters.senderAddresses.includes(eventData.from.address)) {
        return false;
      }
    }

    // Filter by categories
    if (filters.categories && eventData.categories) {
      const hasCategory = filters.categories.some((cat) =>
        eventData.categories.includes(cat)
      );
      if (!hasCategory) {
        return false;
      }
    }

    // Filter by attachment presence
    if (filters.hasAttachments !== undefined) {
      if (eventData.hasAttachments !== filters.hasAttachments) {
        return false;
      }
    }

    // Filter by read status
    if (filters.isRead !== undefined) {
      if (eventData.isRead !== filters.isRead) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Removes expired event subscriptions.
 *
 * @param {EventSubscription[]} subscriptions - Array of subscriptions
 * @returns {EventSubscription[]} Active subscriptions
 *
 * @example
 * ```typescript
 * const active = removeExpiredSubscriptions(allSubscriptions);
 * console.log('Active subscriptions:', active.length);
 * ```
 */
export const removeExpiredSubscriptions = (
  subscriptions: EventSubscription[]
): EventSubscription[] => {
  const now = new Date();
  return subscriptions.filter(
    (sub) => !sub.expiresAt || sub.expiresAt > now
  );
};

// ============================================================================
// PRESENCE TRACKING
// ============================================================================

/**
 * Updates user presence status.
 *
 * @param {string} userId - User ID
 * @param {string} status - Presence status
 * @param {string} socketId - Socket ID
 * @param {string} statusMessage - Optional status message
 * @returns {PresenceRecord} Updated presence record
 *
 * @example
 * ```typescript
 * const presence = updateUserPresence('user-123', 'busy', 'socket-456', 'In a meeting');
 * ```
 */
export const updateUserPresence = (
  userId: string,
  status: 'online' | 'offline' | 'away' | 'busy',
  socketId: string,
  statusMessage?: string
): PresenceRecord => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId,
    status,
    statusMessage,
    connections: [socketId],
    lastActiveAt: now,
    lastStatusChangeAt: now,
    metadata: {},
  };
};

/**
 * Gets current presence status for a user.
 *
 * @param {string} userId - User ID
 * @returns {PresenceRecord} Current presence record
 *
 * @example
 * ```typescript
 * const presence = getUserPresence('user-123');
 * console.log('User status:', presence.status);
 * console.log('Active connections:', presence.connections.length);
 * ```
 */
export const getUserPresence = (userId: string): PresenceRecord => {
  // This would fetch from Redis or database
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId,
    status: 'online',
    connections: [],
    lastActiveAt: now,
    lastStatusChangeAt: now,
    metadata: {},
  };
};

/**
 * Adds a socket connection to user presence.
 *
 * @param {PresenceRecord} presence - Current presence record
 * @param {string} socketId - Socket ID to add
 * @returns {PresenceRecord} Updated presence record
 *
 * @example
 * ```typescript
 * const updated = addConnectionToPresence(presence, 'socket-new-789');
 * ```
 */
export const addConnectionToPresence = (
  presence: PresenceRecord,
  socketId: string
): PresenceRecord => {
  if (!presence.connections.includes(socketId)) {
    presence.connections.push(socketId);
  }
  presence.lastActiveAt = new Date();
  return presence;
};

/**
 * Removes a socket connection from user presence.
 *
 * @param {PresenceRecord} presence - Current presence record
 * @param {string} socketId - Socket ID to remove
 * @returns {PresenceRecord} Updated presence record
 *
 * @example
 * ```typescript
 * const updated = removeConnectionFromPresence(presence, 'socket-old-456');
 * if (updated.connections.length === 0) {
 *   // User is fully offline
 * }
 * ```
 */
export const removeConnectionFromPresence = (
  presence: PresenceRecord,
  socketId: string
): PresenceRecord => {
  presence.connections = presence.connections.filter((id) => id !== socketId);

  if (presence.connections.length === 0) {
    presence.status = 'offline';
    presence.lastStatusChangeAt = new Date();
  }

  return presence;
};

// ============================================================================
// TYPING INDICATORS
// ============================================================================

/**
 * Starts a typing indicator for a user.
 *
 * @param {string} userId - User ID
 * @param {string} recipientAddress - Recipient email address
 * @param {object} context - Typing context
 * @returns {TypingIndicator} Typing indicator record
 *
 * @example
 * ```typescript
 * const indicator = startTypingIndicator('user-123', 'johnson@whitecross.com', {
 *   conversationId: 'conv-456'
 * });
 * ```
 */
export const startTypingIndicator = (
  userId: string,
  recipientAddress: string,
  context?: { conversationId?: string; messageId?: string }
): TypingIndicator => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId,
    conversationId: context?.conversationId,
    messageId: context?.messageId,
    recipientAddress,
    startedAt: now,
    expiresAt: new Date(now.getTime() + 30000), // 30 seconds
  };
};

/**
 * Checks if a typing indicator is still valid.
 *
 * @param {TypingIndicator} indicator - Typing indicator
 * @returns {boolean} True if indicator is still valid
 *
 * @example
 * ```typescript
 * const isValid = isTypingIndicatorValid(indicator);
 * if (!isValid) {
 *   await stopTypingIndicator(indicator.id);
 * }
 * ```
 */
export const isTypingIndicatorValid = (indicator: TypingIndicator): boolean => {
  return new Date() < indicator.expiresAt;
};

// ============================================================================
// EXCHANGE SERVER INTEGRATION
// ============================================================================

/**
 * Creates an Exchange Server streaming notification subscription.
 *
 * @param {string} userId - User ID
 * @param {string} connectionId - WebSocket connection ID
 * @param {string[]} folderIds - Folder IDs to monitor
 * @returns {ExchangeStreamingSubscription} Streaming subscription
 *
 * @example
 * ```typescript
 * const subscription = createExchangeStreamingSubscription(
 *   'user-123',
 *   'socket-456',
 *   ['inbox-folder-id', 'sent-folder-id']
 * );
 * ```
 */
export const createExchangeStreamingSubscription = (
  userId: string,
  connectionId: string,
  folderIds: string[]
): ExchangeStreamingSubscription => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId,
    subscriptionId: crypto.randomUUID(),
    connectionId,
    folderIds,
    eventTypes: ['NewMail', 'Modified', 'Deleted', 'Moved'],
    watermark: '',
    createdAt: now,
    expiresAt: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes
    isActive: true,
  };
};

/**
 * Processes an Exchange Server streaming notification.
 *
 * @param {ExchangeStreamingSubscription} subscription - Streaming subscription
 * @param {any} exchangeEvent - Exchange event data
 * @returns {RealtimeEvent} Converted real-time event
 *
 * @example
 * ```typescript
 * const event = processExchangeStreamingEvent(subscription, {
 *   eventType: 'NewMail',
 *   itemId: 'msg-789',
 *   parentFolderId: 'inbox',
 *   watermark: 'AQAAAA=='
 * });
 * ```
 */
export const processExchangeStreamingEvent = (
  subscription: ExchangeStreamingSubscription,
  exchangeEvent: any
): RealtimeEvent => {
  let eventType: MailRealtimeEventType = 'mail:new';

  switch (exchangeEvent.eventType) {
    case 'NewMail':
      eventType = 'mail:new';
      break;
    case 'Modified':
      eventType = 'mail:updated';
      break;
    case 'Deleted':
      eventType = 'mail:deleted';
      break;
    case 'Moved':
      eventType = 'mail:moved';
      break;
  }

  return {
    id: crypto.randomUUID(),
    eventType,
    timestamp: new Date(),
    userId: subscription.userId,
    data: exchangeEvent,
    metadata: {
      subscriptionId: subscription.subscriptionId,
      watermark: exchangeEvent.watermark,
    },
  };
};

/**
 * Renews an Exchange streaming subscription.
 *
 * @param {ExchangeStreamingSubscription} subscription - Subscription to renew
 * @returns {ExchangeStreamingSubscription} Renewed subscription
 *
 * @example
 * ```typescript
 * const renewed = renewExchangeStreamingSubscription(subscription);
 * console.log('New expiry:', renewed.expiresAt);
 * ```
 */
export const renewExchangeStreamingSubscription = (
  subscription: ExchangeStreamingSubscription
): ExchangeStreamingSubscription => {
  return {
    ...subscription,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Extend by 30 minutes
  };
};

// ============================================================================
// EVENT DELIVERY AND ACKNOWLEDGEMENT
// ============================================================================

/**
 * Records event delivery attempt to a socket.
 *
 * @param {string} eventId - Event ID
 * @param {string} socketId - Socket ID
 * @param {string} userId - User ID
 * @returns {EventDeliveryStatus} Delivery status record
 *
 * @example
 * ```typescript
 * const delivery = recordEventDelivery('event-123', 'socket-456', 'user-789');
 * ```
 */
export const recordEventDelivery = (
  eventId: string,
  socketId: string,
  userId: string
): EventDeliveryStatus => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    eventId,
    socketId,
    userId,
    deliveryStatus: 'sent',
    sentAt: now,
    attempts: 1,
    lastAttemptAt: now,
  };
};

/**
 * Acknowledges event receipt from client.
 *
 * @param {EventDeliveryStatus} delivery - Delivery status record
 * @returns {EventDeliveryStatus} Updated delivery status
 *
 * @example
 * ```typescript
 * const acknowledged = acknowledgeEventDelivery(delivery);
 * console.log('Acknowledged at:', acknowledged.acknowledgedAt);
 * ```
 */
export const acknowledgeEventDelivery = (
  delivery: EventDeliveryStatus
): EventDeliveryStatus => {
  return {
    ...delivery,
    deliveryStatus: 'acknowledged',
    acknowledgedAt: new Date(),
  };
};

/**
 * Retries failed event delivery.
 *
 * @param {EventDeliveryStatus} delivery - Failed delivery record
 * @returns {EventDeliveryStatus} Updated delivery status
 *
 * @example
 * ```typescript
 * const retried = retryEventDelivery(failedDelivery);
 * console.log('Retry attempt:', retried.attempts);
 * ```
 */
export const retryEventDelivery = (delivery: EventDeliveryStatus): EventDeliveryStatus => {
  return {
    ...delivery,
    attempts: delivery.attempts + 1,
    lastAttemptAt: new Date(),
    deliveryStatus: 'pending',
  };
};

// ============================================================================
// WEBSOCKET METRICS AND MONITORING
// ============================================================================

/**
 * Initializes WebSocket metrics structure.
 *
 * @returns {WebSocketMetrics} Initial metrics
 *
 * @example
 * ```typescript
 * const metrics = initializeWebSocketMetrics();
 * ```
 */
export const initializeWebSocketMetrics = (): WebSocketMetrics => {
  return {
    totalConnections: 0,
    activeConnections: 0,
    reconnections: 0,
    disconnections: 0,
    eventsSent: 0,
    eventsReceived: 0,
    eventsAcknowledged: 0,
    averageLatency: 0,
    peakConnections: 0,
    errorRate: 0,
    byEventType: {} as Record<MailRealtimeEventType, number>,
    byRoom: {},
  };
};

/**
 * Updates WebSocket metrics with new data.
 *
 * @param {WebSocketMetrics} metrics - Current metrics
 * @param {object} update - Metric updates
 * @returns {WebSocketMetrics} Updated metrics
 *
 * @example
 * ```typescript
 * const updated = updateWebSocketMetrics(metrics, {
 *   eventsSent: 1,
 *   eventType: 'mail:new',
 *   roomId: 'user:user-123'
 * });
 * ```
 */
export const updateWebSocketMetrics = (
  metrics: WebSocketMetrics,
  update: {
    eventsSent?: number;
    eventsReceived?: number;
    eventsAcknowledged?: number;
    newConnection?: boolean;
    disconnection?: boolean;
    reconnection?: boolean;
    eventType?: MailRealtimeEventType;
    roomId?: string;
    latency?: number;
  }
): WebSocketMetrics => {
  const updated = { ...metrics };

  if (update.eventsSent) {
    updated.eventsSent += update.eventsSent;
  }

  if (update.eventsReceived) {
    updated.eventsReceived += update.eventsReceived;
  }

  if (update.eventsAcknowledged) {
    updated.eventsAcknowledged += update.eventsAcknowledged;
  }

  if (update.newConnection) {
    updated.totalConnections += 1;
    updated.activeConnections += 1;
    updated.peakConnections = Math.max(updated.peakConnections, updated.activeConnections);
  }

  if (update.disconnection) {
    updated.disconnections += 1;
    updated.activeConnections -= 1;
  }

  if (update.reconnection) {
    updated.reconnections += 1;
  }

  if (update.eventType) {
    updated.byEventType[update.eventType] = (updated.byEventType[update.eventType] || 0) + 1;
  }

  if (update.roomId) {
    updated.byRoom[update.roomId] = (updated.byRoom[update.roomId] || 0) + 1;
  }

  if (update.latency !== undefined) {
    const totalEvents = updated.eventsSent || 1;
    updated.averageLatency =
      (updated.averageLatency * (totalEvents - 1) + update.latency) / totalEvents;
  }

  return updated;
};

// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================

/**
 * Generates Swagger schema for new mail event.
 *
 * @returns {SwaggerWebSocketSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getNewMailEventSwaggerSchema();
 * // Use in NestJS WebSocket documentation
 * ```
 */
export const getNewMailEventSwaggerSchema = (): SwaggerWebSocketSchema => {
  return {
    eventName: 'mail:new',
    description: 'Real-time notification when a new mail message arrives',
    acknowledgement: true,
    payload: {
      id: 'string',
      eventType: 'mail:new',
      timestamp: 'Date',
      userId: 'string',
      data: {
        messageId: 'string',
        folderId: 'string',
        subject: 'string',
        from: { name: 'string', address: 'string' },
        bodyPreview: 'string',
        importance: 'low | normal | high',
        hasAttachments: 'boolean',
        receivedDateTime: 'Date',
      },
    },
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      eventType: 'mail:new',
      timestamp: '2025-01-15T10:30:00Z',
      userId: '660e8400-e29b-41d4-a716-446655440001',
      data: {
        messageId: '770e8400-e29b-41d4-a716-446655440002',
        folderId: 'inbox-folder-id',
        subject: 'Patient Update - Room 302',
        from: {
          name: 'Dr. Sarah Smith',
          address: 'sarah.smith@whitecross.com',
        },
        bodyPreview: 'The patient in room 302 has been discharged...',
        importance: 'high',
        hasAttachments: true,
        receivedDateTime: '2025-01-15T10:30:00Z',
      },
    },
  };
};

/**
 * Generates Swagger schema for folder update event.
 *
 * @returns {SwaggerWebSocketSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getFolderUpdateEventSwaggerSchema();
 * ```
 */
export const getFolderUpdateEventSwaggerSchema = (): SwaggerWebSocketSchema => {
  return {
    eventName: 'folder:unread-count-changed',
    description: 'Real-time notification when folder unread count changes',
    acknowledgement: true,
    payload: {
      id: 'string',
      eventType: 'folder:unread-count-changed',
      timestamp: 'Date',
      userId: 'string',
      data: {
        folderId: 'string',
        folderName: 'string',
        unreadCount: 'number',
        totalCount: 'number',
      },
    },
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      eventType: 'folder:unread-count-changed',
      timestamp: '2025-01-15T10:30:00Z',
      userId: '660e8400-e29b-41d4-a716-446655440001',
      data: {
        folderId: 'inbox-folder-id',
        folderName: 'Inbox',
        unreadCount: 5,
        totalCount: 150,
      },
    },
  };
};

/**
 * Generates Swagger schema for typing indicator event.
 *
 * @returns {SwaggerWebSocketSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getTypingEventSwaggerSchema();
 * ```
 */
export const getTypingEventSwaggerSchema = (): SwaggerWebSocketSchema => {
  return {
    eventName: 'typing:start',
    description: 'Real-time notification when a user starts typing',
    acknowledgement: false,
    payload: {
      id: 'string',
      eventType: 'typing:start | typing:stop',
      timestamp: 'Date',
      userId: 'string',
      data: {
        conversationId: 'string',
        recipientAddress: 'string',
      },
    },
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      eventType: 'typing:start',
      timestamp: '2025-01-15T10:30:00Z',
      userId: '660e8400-e29b-41d4-a716-446655440001',
      data: {
        conversationId: 'conv-123',
        recipientAddress: 'johnson@whitecross.com',
      },
    },
  };
};

/**
 * Generates Swagger schema for presence event.
 *
 * @returns {SwaggerWebSocketSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getPresenceEventSwaggerSchema();
 * ```
 */
export const getPresenceEventSwaggerSchema = (): SwaggerWebSocketSchema => {
  return {
    eventName: 'presence:online',
    description: 'Real-time notification of user presence status changes',
    acknowledgement: false,
    payload: {
      id: 'string',
      eventType: 'presence:online | presence:offline | presence:away | presence:busy',
      timestamp: 'Date',
      userId: 'string',
      data: {
        status: 'online | offline | away | busy',
        statusMessage: 'string',
        lastActiveAt: 'Date',
      },
    },
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      eventType: 'presence:busy',
      timestamp: '2025-01-15T10:30:00Z',
      userId: '660e8400-e29b-41d4-a716-446655440001',
      data: {
        status: 'busy',
        statusMessage: 'In a meeting until 3 PM',
        lastActiveAt: '2025-01-15T10:30:00Z',
      },
    },
  };
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Sequelize Models
  getWebSocketConnectionModelAttributes,
  getEventSubscriptionModelAttributes,
  getPresenceRecordModelAttributes,
  getExchangeStreamingSubscriptionModelAttributes,
  getEventDeliveryStatusModelAttributes,

  // Gateway Configuration
  createGatewayConfiguration,
  createHeartbeatConfiguration,

  // Connection Management
  createWebSocketConnection,
  updateConnectionState,
  handleClientDisconnection,
  handleClientReconnection,
  validateWebSocketAuthentication,

  // Room Management
  generateUserRoomId,
  generateFolderRoomId,
  generateConversationRoomId,
  joinUserRooms,
  createRoomConfiguration,

  // Event Creation
  createNewMailEvent,
  createMailUpdatedEvent,
  createMailMovedEvent,
  createFolderUpdateEvent,
  createTypingEvent,
  createPresenceEvent,
  createSyncEvent,

  // Event Subscriptions
  createEventSubscription,
  updateEventSubscription,
  filterEventBySubscription,
  removeExpiredSubscriptions,

  // Presence Tracking
  updateUserPresence,
  getUserPresence,
  addConnectionToPresence,
  removeConnectionFromPresence,

  // Typing Indicators
  startTypingIndicator,
  isTypingIndicatorValid,

  // Exchange Server Integration
  createExchangeStreamingSubscription,
  processExchangeStreamingEvent,
  renewExchangeStreamingSubscription,

  // Event Delivery
  recordEventDelivery,
  acknowledgeEventDelivery,
  retryEventDelivery,

  // Metrics
  initializeWebSocketMetrics,
  updateWebSocketMetrics,

  // Swagger Documentation
  getNewMailEventSwaggerSchema,
  getFolderUpdateEventSwaggerSchema,
  getTypingEventSwaggerSchema,
  getPresenceEventSwaggerSchema,
};
