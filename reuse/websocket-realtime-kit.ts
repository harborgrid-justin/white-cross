/**
 * LOC: WS-REALTIME-001
 * File: /reuse/websocket-realtime-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/websockets (v11.1.8)
 *   - @nestjs/platform-socket.io (v11.1.8)
 *   - socket.io (v4.7.5)
 *   - @socket.io/redis-adapter (v8.3.0)
 *   - ioredis (v5.4.1)
 *   - sequelize (v6.37.5)
 *   - sequelize-typescript (v2.1.6)
 *
 * DOWNSTREAM (imported by):
 *   - Real-time notification systems
 *   - Chat and messaging gateways
 *   - Patient monitoring dashboards
 *   - WebSocket authentication middleware
 *   - Presence tracking services
 */

/**
 * File: /reuse/websocket-realtime-kit.ts
 * Locator: WC-UTL-WSRT-001
 * Purpose: WebSocket Real-Time Communication Kit - Comprehensive utilities for Socket.IO, presence tracking, and real-time messaging
 *
 * Upstream: @nestjs/websockets, socket.io, Redis, ioredis, Sequelize, sequelize-typescript
 * Downstream: All WebSocket gateways, chat modules, notification services, real-time dashboards
 * Dependencies: NestJS v11.x, Socket.IO v4.x, Redis v5.x, Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 50+ WebSocket utility functions for gateways, rooms, presence, notifications, rate limiting, offline queues, file transfer, read receipts, Sequelize models
 *
 * LLM Context: Production-grade WebSocket real-time communication toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for WebSocket gateway setup, room/namespace management, Socket.IO authentication,
 * JWT validation, presence tracking (online/offline/away), typing indicators, message broadcasting, event routing,
 * rate limiting, Redis adapter configuration, connection state management, heartbeat/reconnection logic, offline message queues,
 * event acknowledgments, socket-based file transfer, read receipts tracking, WebSocket middleware, notification delivery,
 * health checks, and Sequelize models for socket connections, rooms, messages, presence, and offline queues.
 * HIPAA-compliant with secure real-time communication, audit logging, and encrypted message transmission.
 */

import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Sequelize } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * WebSocket connection metadata
 */
export interface WsConnectionMetadata {
  socketId: string;
  userId: string | null;
  tenantId: string | null;
  connectedAt: Date;
  lastActivity: Date;
  rooms: string[];
  ipAddress: string;
  userAgent: string;
  transport: string;
  namespace: string;
  metadata?: Record<string, any>;
}

/**
 * WebSocket authentication payload
 */
export interface WsAuthPayload {
  userId: string;
  tenantId?: string;
  roles?: string[];
  permissions?: string[];
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Room configuration
 */
export interface WsRoomConfig {
  roomId: string;
  name?: string;
  type?: 'public' | 'private' | 'direct';
  maxMembers?: number;
  ownerId?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

/**
 * User presence status
 */
export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline' | 'dnd';

/**
 * Presence information
 */
export interface WsPresenceInfo {
  userId: string;
  status: PresenceStatus;
  socketIds: string[];
  lastSeen: Date;
  customStatus?: string;
  metadata?: Record<string, any>;
}

/**
 * Typing indicator state
 */
export interface WsTypingIndicator {
  userId: string;
  roomId: string;
  isTyping: boolean;
  startedAt?: Date;
}

/**
 * Message broadcast options
 */
export interface WsBroadcastOptions {
  rooms?: string[];
  except?: string[]; // Socket IDs to exclude
  volatile?: boolean;
  compress?: boolean;
  timeout?: number;
  broadcast?: boolean;
}

/**
 * Rate limit configuration
 */
export interface WsRateLimitConfig {
  maxEvents: number;
  windowMs: number;
  blockDurationMs?: number;
  bypassRoles?: string[];
}

/**
 * Heartbeat configuration
 */
export interface WsHeartbeatConfig {
  interval: number;
  timeout: number;
  maxMissed: number;
}

/**
 * Reconnection configuration
 */
export interface WsReconnectionConfig {
  enabled: boolean;
  maxAttempts: number;
  delay: number;
  delayMultiplier: number;
  maxDelay: number;
}

/**
 * Notification payload
 */
export interface WsNotification {
  id: string;
  type: string;
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Event routing rule
 */
export interface WsEventRoutingRule {
  eventPattern: string | RegExp;
  targetRooms?: string[];
  targetUsers?: string[];
  condition?: (data: any, socket: Socket) => boolean;
  transform?: (data: any) => any;
}

/**
 * Redis adapter configuration
 */
export interface WsRedisAdapterConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  requestsTimeout?: number;
  tls?: boolean;
}

/**
 * Offline message queue entry
 */
export interface WsOfflineMessage {
  id: string;
  userId: string;
  event: string;
  data: any;
  priority: number;
  queuedAt: Date;
  expiresAt?: Date;
  attempts: number;
  maxAttempts: number;
}

/**
 * Read receipt information
 */
export interface WsReadReceipt {
  messageId: string;
  userId: string;
  readAt: Date;
  socketId: string;
}

/**
 * File transfer metadata
 */
export interface WsFileTransfer {
  transferId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  senderId: string;
  recipientId?: string;
  roomId?: string;
  chunkSize: number;
  totalChunks: number;
  receivedChunks: number;
  startedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'transferring' | 'completed' | 'failed' | 'cancelled';
}

/**
 * Health check result
 */
export interface WsHealthCheckResult {
  healthy: boolean;
  timestamp: Date;
  metrics: {
    connectedClients: number;
    totalRooms: number;
    averageLatency: number;
    memoryUsage: number;
    uptime: number;
  };
  issues?: string[];
}

/**
 * Connection state tracking
 */
export interface WsConnectionState {
  socketId: string;
  userId: string;
  state: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
  reconnectAttempts: number;
  lastConnected?: Date;
  lastDisconnected?: Date;
  disconnectReason?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Socket connection model for tracking active WebSocket connections
 */
@Table({
  tableName: 'socket_connections',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['socketId'], unique: true },
    { fields: ['tenantId'] },
    { fields: ['namespace'] },
    { fields: ['connectedAt'] },
  ],
})
export class SocketConnection extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Socket.IO connection ID',
  })
  socketId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'User ID associated with this connection',
  })
  userId!: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Tenant ID for multi-tenancy',
  })
  tenantId!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '/',
    comment: 'Socket.IO namespace',
  })
  namespace!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Client IP address',
  })
  ipAddress!: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'User agent string',
  })
  userAgent!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'websocket',
    comment: 'Transport type (websocket, polling)',
  })
  transport!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Connection timestamp',
  })
  connectedAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Last activity timestamp',
  })
  lastActivity!: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional connection metadata',
  })
  metadata!: Record<string, any>;
}

/**
 * WebSocket room model for managing chat rooms and channels
 */
@Table({
  tableName: 'socket_rooms',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['roomId'], unique: true },
    { fields: ['ownerId'] },
    { fields: ['tenantId'] },
    { fields: ['type'] },
  ],
})
export class SocketRoom extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique room identifier',
  })
  roomId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Room display name',
  })
  name!: string;

  @Column({
    type: DataType.ENUM('public', 'private', 'direct'),
    allowNull: false,
    defaultValue: 'public',
    comment: 'Room visibility type',
  })
  type!: 'public' | 'private' | 'direct';

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Room owner user ID',
  })
  ownerId!: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Tenant ID for multi-tenancy',
  })
  tenantId!: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Maximum number of members allowed',
  })
  maxMembers!: number | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Current number of members',
  })
  memberCount!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Room description',
  })
  description!: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Room metadata and settings',
  })
  metadata!: Record<string, any>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Room expiration timestamp',
  })
  expiresAt!: Date | null;

  @HasMany(() => SocketMessage)
  messages!: SocketMessage[];
}

/**
 * WebSocket message model for storing chat messages
 */
@Table({
  tableName: 'socket_messages',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['roomId'] },
    { fields: ['senderId'] },
    { fields: ['tenantId'] },
    { fields: ['createdAt'] },
  ],
})
export class SocketMessage extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => SocketRoom)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Reference to socket room',
  })
  roomId!: string;

  @BelongsTo(() => SocketRoom)
  room!: SocketRoom;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Sender user ID',
  })
  senderId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Tenant ID for multi-tenancy',
  })
  tenantId!: string | null;

  @Column({
    type: DataType.ENUM('text', 'image', 'file', 'video', 'audio', 'system'),
    allowNull: false,
    defaultValue: 'text',
    comment: 'Message content type',
  })
  type!: 'text' | 'image' | 'file' | 'video' | 'audio' | 'system';

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Message content',
  })
  content!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Attached files or media metadata',
  })
  attachments!: Record<string, any> | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Reply to message ID',
  })
  replyToId!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Message edited flag',
  })
  isEdited!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Message deleted flag',
  })
  isDeleted!: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional message metadata',
  })
  metadata!: Record<string, any>;
}

/**
 * User presence model for tracking online/offline status
 */
@Table({
  tableName: 'socket_presence',
  timestamps: true,
  indexes: [
    { fields: ['userId'], unique: true },
    { fields: ['tenantId'] },
    { fields: ['status'] },
    { fields: ['lastSeen'] },
  ],
})
export class SocketPresence extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    comment: 'User ID',
  })
  userId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Tenant ID for multi-tenancy',
  })
  tenantId!: string | null;

  @Column({
    type: DataType.ENUM('online', 'away', 'busy', 'offline', 'dnd'),
    allowNull: false,
    defaultValue: 'offline',
    comment: 'User presence status',
  })
  status!: PresenceStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Custom status message',
  })
  customStatus!: string | null;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    comment: 'Active socket connection IDs',
  })
  socketIds!: string[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Last seen timestamp',
  })
  lastSeen!: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional presence metadata',
  })
  metadata!: Record<string, any>;
}

/**
 * Notification model for storing real-time notifications
 */
@Table({
  tableName: 'socket_notifications',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['tenantId'] },
    { fields: ['type'] },
    { fields: ['isRead'] },
    { fields: ['priority'] },
    { fields: ['createdAt'] },
  ],
})
export class SocketNotification extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Target user ID',
  })
  userId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Tenant ID for multi-tenancy',
  })
  tenantId!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Notification type',
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Notification title',
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Notification message',
  })
  message!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Additional notification data',
  })
  data!: Record<string, any> | null;

  @Column({
    type: DataType.ENUM('low', 'normal', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'normal',
    comment: 'Notification priority',
  })
  priority!: 'low' | 'normal' | 'high' | 'urgent';

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Read status',
  })
  isRead!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Read timestamp',
  })
  readAt!: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Notification expiration',
  })
  expiresAt!: Date | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Action URL or route',
  })
  actionUrl!: string | null;
}

/**
 * Offline message queue model for storing messages for offline users
 */
@Table({
  tableName: 'socket_offline_queue',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['priority'] },
    { fields: ['queuedAt'] },
    { fields: ['delivered'] },
  ],
})
export class SocketOfflineQueue extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Target user ID',
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Event name',
  })
  event!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'Event data payload',
  })
  data!: Record<string, any>;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Message priority (higher = more urgent)',
  })
  priority!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Queued timestamp',
  })
  queuedAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Expiration timestamp',
  })
  expiresAt!: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Delivery attempts',
  })
  attempts!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 3,
    comment: 'Maximum delivery attempts',
  })
  maxAttempts!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Delivery status',
  })
  delivered!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Delivered timestamp',
  })
  deliveredAt!: Date | null;
}

/**
 * Read receipts model for tracking message read status
 */
@Table({
  tableName: 'socket_read_receipts',
  timestamps: true,
  indexes: [
    { fields: ['messageId'] },
    { fields: ['userId'] },
    { fields: ['readAt'] },
  ],
})
export class SocketReadReceipt extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Message ID',
  })
  messageId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who read the message',
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Socket ID when message was read',
  })
  socketId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Read timestamp',
  })
  readAt!: Date;
}

// ============================================================================
// GATEWAY CONFIGURATION & INITIALIZATION
// ============================================================================

/**
 * 1. Creates WebSocket gateway configuration with HIPAA-compliant defaults.
 *
 * @param {string} namespace - Gateway namespace (e.g., '/chat', '/notifications')
 * @param {Partial<any>} options - Additional gateway options
 * @returns {object} Complete gateway configuration
 *
 * @example
 * ```typescript
 * const gatewayConfig = createWsGatewayConfig('/chat', {
 *   cors: { origin: 'https://hospital.example.com', credentials: true }
 * });
 * ```
 */
export function createWsGatewayConfig(
  namespace: string = '/',
  options: Partial<any> = {},
): any {
  return {
    namespace,
    cors: options.cors || {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: options.transports || ['websocket', 'polling'],
    path: options.path || '/socket.io',
    pingTimeout: options.pingTimeout || 60000, // 1 minute
    pingInterval: options.pingInterval || 25000, // 25 seconds
    maxHttpBufferSize: options.maxHttpBufferSize || 1e6, // 1MB
    allowEIO3: options.allowEIO3 ?? false,
    serveClient: options.serveClient ?? false,
    cookie: options.cookie ?? false, // Disable cookies for security
    ...options,
  };
}

/**
 * 2. Initializes WebSocket gateway with lifecycle logging and setup.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} gatewayName - Gateway name for logging
 * @param {Map<string, WsConnectionMetadata>} connectionsStore - Connection metadata store
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterInit(server: Server) {
 *   initializeWsGateway(server, 'ChatGateway', this.connections);
 * }
 * ```
 */
export function initializeWsGateway(
  server: Server,
  gatewayName: string,
  connectionsStore: Map<string, WsConnectionMetadata>,
): void {
  const logger = new Logger(gatewayName);

  logger.log(`✓ Gateway initialized: ${gatewayName}`);
  logger.log(`  Namespace: ${server.name}`);
  logger.log(`  Transports: ${server.opts.transports?.join(', ')}`);
  logger.log(`  Max buffer size: ${server.opts.maxHttpBufferSize} bytes`);

  // Set up global error handler
  server.on('error', (error: Error) => {
    logger.error(`Gateway error: ${error.message}`, error.stack);
  });

  // Set up connection monitoring
  server.on('connection', (socket: Socket) => {
    logger.debug(`New connection: ${socket.id} from ${socket.handshake.address}`);
  });
}

/**
 * 3. Handles WebSocket connection with metadata tracking.
 *
 * @param {Socket} client - Connected socket client
 * @param {Map<string, WsConnectionMetadata>} connectionsStore - Connection metadata store
 * @returns {WsConnectionMetadata} Connection metadata
 *
 * @example
 * ```typescript
 * handleConnection(client: Socket) {
 *   const metadata = handleWsConnection(client, this.connections);
 *   this.logger.log(`User ${metadata.userId} connected`);
 * }
 * ```
 */
export function handleWsConnection(
  client: Socket,
  connectionsStore: Map<string, WsConnectionMetadata>,
): WsConnectionMetadata {
  const metadata: WsConnectionMetadata = {
    socketId: client.id,
    userId: client.handshake.auth?.userId || null,
    tenantId: client.handshake.auth?.tenantId || null,
    connectedAt: new Date(),
    lastActivity: new Date(),
    rooms: [],
    ipAddress: client.handshake.address,
    userAgent: client.handshake.headers['user-agent'] || 'unknown',
    transport: client.conn.transport.name,
    namespace: client.nsp.name,
    metadata: client.handshake.auth?.metadata || {},
  };

  connectionsStore.set(client.id, metadata);

  // Update last activity on any event
  client.onAny(() => {
    const conn = connectionsStore.get(client.id);
    if (conn) {
      conn.lastActivity = new Date();
    }
  });

  return metadata;
}

/**
 * 4. Handles WebSocket disconnection with cleanup.
 *
 * @param {Socket} client - Disconnecting socket client
 * @param {Map<string, WsConnectionMetadata>} connectionsStore - Connection metadata store
 * @param {() => Promise<void>} cleanupCallback - Optional cleanup callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * async handleDisconnect(client: Socket) {
 *   await handleWsDisconnection(client, this.connections, async () => {
 *     await this.presenceService.setOffline(client.handshake.auth.userId);
 *   });
 * }
 * ```
 */
export async function handleWsDisconnection(
  client: Socket,
  connectionsStore: Map<string, WsConnectionMetadata>,
  cleanupCallback?: () => Promise<void>,
): Promise<void> {
  const metadata = connectionsStore.get(client.id);
  const logger = new Logger('WebSocketDisconnection');

  if (metadata) {
    // Leave all rooms
    metadata.rooms.forEach((room) => {
      client.leave(room);
    });

    connectionsStore.delete(client.id);
    logger.debug(`Connection removed: ${client.id} (User: ${metadata.userId})`);
  }

  // Execute cleanup callback
  if (cleanupCallback) {
    try {
      await cleanupCallback();
    } catch (error) {
      logger.error(`Cleanup error: ${error.message}`, error.stack);
    }
  }
}

/**
 * 5. Persists WebSocket connection to database.
 *
 * @param {Socket} client - Socket client
 * @param {WsConnectionMetadata} metadata - Connection metadata
 * @returns {Promise<SocketConnection>} Created connection record
 *
 * @example
 * ```typescript
 * handleConnection(client: Socket) {
 *   const metadata = handleWsConnection(client, this.connections);
 *   await persistWsConnection(client, metadata);
 * }
 * ```
 */
export async function persistWsConnection(
  client: Socket,
  metadata: WsConnectionMetadata,
): Promise<SocketConnection> {
  return await SocketConnection.create({
    socketId: metadata.socketId,
    userId: metadata.userId,
    tenantId: metadata.tenantId,
    namespace: metadata.namespace,
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    transport: metadata.transport,
    connectedAt: metadata.connectedAt,
    lastActivity: metadata.lastActivity,
    metadata: metadata.metadata || {},
  });
}

/**
 * 6. Removes persisted WebSocket connection from database.
 *
 * @param {string} socketId - Socket connection ID
 * @returns {Promise<number>} Number of deleted records
 *
 * @example
 * ```typescript
 * async handleDisconnect(client: Socket) {
 *   await removePersistedWsConnection(client.id);
 * }
 * ```
 */
export async function removePersistedWsConnection(socketId: string): Promise<number> {
  return await SocketConnection.destroy({ where: { socketId } });
}

// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================

/**
 * 7. Extracts authentication token from WebSocket handshake.
 *
 * @param {Socket} client - Socket client
 * @returns {string | null} Extracted JWT token
 *
 * @example
 * ```typescript
 * const token = extractWsAuthToken(client);
 * if (!token) {
 *   throw new UnauthorizedException('No token provided');
 * }
 * ```
 */
export function extractWsAuthToken(client: Socket): string | null {
  // Try Authorization header (most secure)
  const authHeader = client.handshake.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try auth object
  if (client.handshake.auth?.token) {
    return client.handshake.auth.token;
  }

  // Try query parameter (fallback, less secure)
  if (client.handshake.query?.token && typeof client.handshake.query.token === 'string') {
    return client.handshake.query.token;
  }

  return null;
}

/**
 * 8. Validates WebSocket JWT authentication.
 *
 * @param {Socket} client - Socket client
 * @param {(token: string) => Promise<WsAuthPayload>} verifyFn - JWT verification function
 * @returns {Promise<WsAuthPayload>} Validated authentication payload
 *
 * @example
 * ```typescript
 * const auth = await validateWsJwtAuth(client, async (token) => {
 *   return await this.jwtService.verify(token);
 * });
 * ```
 */
export async function validateWsJwtAuth(
  client: Socket,
  verifyFn: (token: string) => Promise<WsAuthPayload>,
): Promise<WsAuthPayload> {
  const token = extractWsAuthToken(client);

  if (!token) {
    throw new WsException('Authentication required');
  }

  try {
    const payload = await verifyFn(token);

    // Attach auth data to socket
    (client as any).auth = payload;
    (client as any).userId = payload.userId;
    (client as any).tenantId = payload.tenantId;

    return payload;
  } catch (error) {
    throw new WsException(`Authentication failed: ${error.message}`);
  }
}

/**
 * 9. Checks if WebSocket client has required role.
 *
 * @param {Socket} client - Socket client
 * @param {string[]} requiredRoles - Required roles
 * @returns {boolean} True if authorized
 *
 * @example
 * ```typescript
 * if (!checkWsRole(client, ['admin', 'doctor'])) {
 *   throw new WsException('Insufficient permissions');
 * }
 * ```
 */
export function checkWsRole(client: Socket, requiredRoles: string[]): boolean {
  const auth = (client as any).auth as WsAuthPayload;

  if (!auth || !auth.roles) {
    return false;
  }

  return requiredRoles.some((role) => auth.roles?.includes(role));
}

/**
 * 10. Checks if WebSocket client has required permission.
 *
 * @param {Socket} client - Socket client
 * @param {string[]} requiredPermissions - Required permissions
 * @returns {boolean} True if authorized
 *
 * @example
 * ```typescript
 * if (!checkWsPermission(client, ['patients:read', 'patients:write'])) {
 *   throw new WsException('Missing required permissions');
 * }
 * ```
 */
export function checkWsPermission(client: Socket, requiredPermissions: string[]): boolean {
  const auth = (client as any).auth as WsAuthPayload;

  if (!auth || !auth.permissions) {
    return false;
  }

  return requiredPermissions.some((perm) => auth.permissions?.includes(perm));
}

/**
 * 11. Validates tenant access for WebSocket client.
 *
 * @param {Socket} client - Socket client
 * @param {string} requiredTenantId - Required tenant ID
 * @returns {boolean} True if tenant matches
 *
 * @example
 * ```typescript
 * if (!validateWsTenantAccess(client, roomTenantId)) {
 *   throw new WsException('Tenant access denied');
 * }
 * ```
 */
export function validateWsTenantAccess(client: Socket, requiredTenantId: string): boolean {
  const auth = (client as any).auth as WsAuthPayload;

  if (!auth) {
    return false;
  }

  return auth.tenantId === requiredTenantId;
}

// ============================================================================
// ROOM MANAGEMENT
// ============================================================================

/**
 * 12. Joins client to a WebSocket room with validation.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {WsRoomConfig} config - Room configuration
 * @returns {Promise<boolean>} True if joined successfully
 *
 * @example
 * ```typescript
 * const joined = await joinWsRoom(client, 'chat-room-123', {
 *   maxMembers: 100,
 *   type: 'private'
 * });
 * ```
 */
export async function joinWsRoom(
  client: Socket,
  roomId: string,
  config?: WsRoomConfig,
): Promise<boolean> {
  const logger = new Logger('WsRoomManager');

  try {
    // Validate max members if configured
    if (config?.maxMembers) {
      const sockets = await client.nsp.in(roomId).fetchSockets();
      if (sockets.length >= config.maxMembers) {
        throw new WsException('Room is full');
      }
    }

    await client.join(roomId);

    // Update connection metadata
    const metadata = (client as any).__metadata as WsConnectionMetadata;
    if (metadata && !metadata.rooms.includes(roomId)) {
      metadata.rooms.push(roomId);
    }

    logger.debug(`Client ${client.id} joined room: ${roomId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to join room ${roomId}: ${error.message}`);
    throw new WsException(`Failed to join room: ${error.message}`);
  }
}

/**
 * 13. Leaves a WebSocket room.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await leaveWsRoom(client, 'chat-room-123');
 * ```
 */
export async function leaveWsRoom(client: Socket, roomId: string): Promise<void> {
  await client.leave(roomId);

  // Update connection metadata
  const metadata = (client as any).__metadata as WsConnectionMetadata;
  if (metadata) {
    metadata.rooms = metadata.rooms.filter((r) => r !== roomId);
  }
}

/**
 * 14. Gets all socket IDs in a room.
 *
 * @param {Server | Namespace} serverOrNamespace - Socket.IO server or namespace
 * @param {string} roomId - Room identifier
 * @returns {Promise<string[]>} Array of socket IDs
 *
 * @example
 * ```typescript
 * const socketIds = await getWsRoomMembers(this.server, 'chat-room-123');
 * console.log(`Room has ${socketIds.length} members`);
 * ```
 */
export async function getWsRoomMembers(
  serverOrNamespace: Server | Namespace,
  roomId: string,
): Promise<string[]> {
  const sockets = await serverOrNamespace.in(roomId).fetchSockets();
  return sockets.map((s) => s.id);
}

/**
 * 15. Gets all rooms a client has joined.
 *
 * @param {Socket} client - Socket client
 * @returns {string[]} Array of room IDs
 *
 * @example
 * ```typescript
 * const rooms = getWsClientRooms(client);
 * console.log(`Client is in ${rooms.length} rooms`);
 * ```
 */
export function getWsClientRooms(client: Socket): string[] {
  return Array.from(client.rooms).filter((room) => room !== client.id);
}

/**
 * 16. Creates or updates a WebSocket room in database.
 *
 * @param {WsRoomConfig} config - Room configuration
 * @returns {Promise<SocketRoom>} Created or updated room
 *
 * @example
 * ```typescript
 * const room = await createWsRoom({
 *   roomId: 'chat-123',
 *   name: 'General Chat',
 *   type: 'public',
 *   maxMembers: 100
 * });
 * ```
 */
export async function createWsRoom(config: WsRoomConfig): Promise<SocketRoom> {
  const [room] = await SocketRoom.findOrCreate({
    where: { roomId: config.roomId },
    defaults: {
      roomId: config.roomId,
      name: config.name || config.roomId,
      type: config.type || 'public',
      ownerId: config.ownerId || null,
      maxMembers: config.maxMembers || null,
      metadata: config.metadata || {},
      expiresAt: config.expiresAt || null,
    },
  });

  return room;
}

/**
 * 17. Closes a WebSocket room and removes all members.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} roomId - Room identifier
 * @returns {Promise<number>} Number of clients removed
 *
 * @example
 * ```typescript
 * const removed = await closeWsRoom(this.server, 'chat-room-123');
 * console.log(`Removed ${removed} clients from room`);
 * ```
 */
export async function closeWsRoom(server: Server, roomId: string): Promise<number> {
  const sockets = await server.in(roomId).fetchSockets();

  for (const socket of sockets) {
    socket.leave(roomId);
  }

  // Optionally delete from database
  await SocketRoom.destroy({ where: { roomId } });

  return sockets.length;
}

// ============================================================================
// MESSAGE BROADCASTING
// ============================================================================

/**
 * 18. Broadcasts message to a specific room.
 *
 * @param {Socket} client - Socket client (sender)
 * @param {string} roomId - Room identifier
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {WsBroadcastOptions} options - Broadcast options
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToWsRoom(client, 'chat-room-123', 'message:new', {
 *   text: 'Hello everyone!',
 *   senderId: 'user-456'
 * });
 * ```
 */
export function broadcastToWsRoom(
  client: Socket,
  roomId: string,
  event: string,
  data: any,
  options?: WsBroadcastOptions,
): void {
  let emitter = client.to(roomId);

  if (options?.volatile) {
    emitter = emitter.volatile;
  }

  if (options?.compress !== false) {
    emitter = emitter.compress(true);
  }

  if (options?.timeout) {
    emitter = emitter.timeout(options.timeout);
  }

  emitter.emit(event, data);
}

/**
 * 19. Broadcasts to all connected clients.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {WsBroadcastOptions} options - Broadcast options
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToAllWs(this.server, 'system:announcement', {
 *   message: 'System maintenance in 10 minutes'
 * });
 * ```
 */
export function broadcastToAllWs(
  server: Server,
  event: string,
  data: any,
  options?: WsBroadcastOptions,
): void {
  let emitter: any = server;

  // Exclude specific sockets
  if (options?.except && options.except.length > 0) {
    options.except.forEach((socketId) => {
      emitter = emitter.except(socketId);
    });
  }

  if (options?.volatile) {
    emitter = emitter.volatile;
  }

  if (options?.compress !== false) {
    emitter = emitter.compress(true);
  }

  emitter.emit(event, data);
}

/**
 * 20. Sends message to specific user across all their connections.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User identifier
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * sendToWsUser(this.server, 'user-123', 'notification', {
 *   title: 'New Message',
 *   body: 'You have a new message from Dr. Smith'
 * });
 * ```
 */
export function sendToWsUser(
  server: Server,
  userId: string,
  event: string,
  data: any,
): void {
  server.to(`user:${userId}`).emit(event, data);
}

/**
 * 21. Sends message with acknowledgement callback.
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {number} timeout - Acknowledgement timeout in ms
 * @returns {Promise<any>} Acknowledgement response
 *
 * @example
 * ```typescript
 * const response = await sendWsWithAck(client, 'message:send', messageData, 5000);
 * if (response.success) {
 *   console.log('Message acknowledged');
 * }
 * ```
 */
export function sendWsWithAck(
  client: Socket,
  event: string,
  data: any,
  timeout: number = 5000,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new WsException('Acknowledgement timeout'));
    }, timeout);

    client.emit(event, data, (response: any) => {
      clearTimeout(timer);
      resolve(response);
    });
  });
}

/**
 * 22. Persists WebSocket message to database.
 *
 * @param {string} roomId - Room identifier
 * @param {string} senderId - Sender user ID
 * @param {string} content - Message content
 * @param {Partial<SocketMessage>} options - Additional message options
 * @returns {Promise<SocketMessage>} Created message record
 *
 * @example
 * ```typescript
 * const message = await persistWsMessage('room-123', 'user-456', 'Hello!', {
 *   type: 'text',
 *   tenantId: 'hospital-789'
 * });
 * ```
 */
export async function persistWsMessage(
  roomId: string,
  senderId: string,
  content: string,
  options?: Partial<SocketMessage>,
): Promise<SocketMessage> {
  return await SocketMessage.create({
    roomId,
    senderId,
    content,
    type: options?.type || 'text',
    tenantId: options?.tenantId || null,
    attachments: options?.attachments || null,
    replyToId: options?.replyToId || null,
    metadata: options?.metadata || {},
  });
}

// ============================================================================
// PRESENCE TRACKING
// ============================================================================

/**
 * 23. Sets user online status and presence.
 *
 * @param {string} userId - User identifier
 * @param {string} socketId - Socket connection ID
 * @param {PresenceStatus} status - Presence status
 * @param {Record<string, any>} metadata - Additional presence metadata
 * @returns {Promise<SocketPresence>} Updated presence record
 *
 * @example
 * ```typescript
 * const presence = await setWsUserOnline('user-123', client.id, 'online', {
 *   device: 'mobile'
 * });
 * ```
 */
export async function setWsUserOnline(
  userId: string,
  socketId: string,
  status: PresenceStatus = 'online',
  metadata?: Record<string, any>,
): Promise<SocketPresence> {
  const [presence] = await SocketPresence.findOrCreate({
    where: { userId },
    defaults: {
      userId,
      status,
      socketIds: [socketId],
      lastSeen: new Date(),
      metadata: metadata || {},
    },
  });

  // Update if already exists
  if (!presence.socketIds.includes(socketId)) {
    presence.socketIds = [...presence.socketIds, socketId];
  }
  presence.status = status;
  presence.lastSeen = new Date();
  if (metadata) {
    presence.metadata = { ...presence.metadata, ...metadata };
  }
  await presence.save();

  return presence;
}

/**
 * 24. Sets user offline status and removes socket connection.
 *
 * @param {string} userId - User identifier
 * @param {string} socketId - Socket connection ID
 * @returns {Promise<boolean>} True if user is fully offline (no other connections)
 *
 * @example
 * ```typescript
 * const isOffline = await setWsUserOffline('user-123', client.id);
 * if (isOffline) {
 *   // User has no more active connections
 * }
 * ```
 */
export async function setWsUserOffline(
  userId: string,
  socketId: string,
): Promise<boolean> {
  const presence = await SocketPresence.findOne({ where: { userId } });

  if (!presence) {
    return true;
  }

  // Remove this socket ID
  presence.socketIds = presence.socketIds.filter((id) => id !== socketId);
  presence.lastSeen = new Date();

  // If no more connections, set offline
  if (presence.socketIds.length === 0) {
    presence.status = 'offline';
  }

  await presence.save();

  return presence.socketIds.length === 0;
}

/**
 * 25. Gets user presence information.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<WsPresenceInfo | null>} Presence information
 *
 * @example
 * ```typescript
 * const presence = await getWsUserPresence('user-123');
 * if (presence?.status === 'online') {
 *   console.log('User is online');
 * }
 * ```
 */
export async function getWsUserPresence(userId: string): Promise<WsPresenceInfo | null> {
  const presence = await SocketPresence.findOne({ where: { userId } });

  if (!presence) {
    return null;
  }

  return {
    userId: presence.userId,
    status: presence.status,
    socketIds: presence.socketIds,
    lastSeen: presence.lastSeen,
    customStatus: presence.customStatus || undefined,
    metadata: presence.metadata,
  };
}

/**
 * 26. Gets online users from a list of user IDs.
 *
 * @param {string[]} userIds - Array of user identifiers
 * @returns {Promise<WsPresenceInfo[]>} Array of online users
 *
 * @example
 * ```typescript
 * const onlineUsers = await getWsOnlineUsers(['user-1', 'user-2', 'user-3']);
 * console.log(`${onlineUsers.length} users are online`);
 * ```
 */
export async function getWsOnlineUsers(userIds: string[]): Promise<WsPresenceInfo[]> {
  const presences = await SocketPresence.findAll({
    where: {
      userId: userIds,
      status: ['online', 'away', 'busy', 'dnd'],
    },
  });

  return presences.map((p) => ({
    userId: p.userId,
    status: p.status,
    socketIds: p.socketIds,
    lastSeen: p.lastSeen,
    customStatus: p.customStatus || undefined,
    metadata: p.metadata,
  }));
}

/**
 * 27. Broadcasts presence update to subscribers.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User identifier
 * @param {WsPresenceInfo} presence - Presence information
 * @param {string[]} targetRooms - Rooms to notify
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastWsPresenceUpdate(this.server, 'user-123', presence, [
 *   'room-1', 'room-2'
 * ]);
 * ```
 */
export function broadcastWsPresenceUpdate(
  server: Server,
  userId: string,
  presence: WsPresenceInfo,
  targetRooms: string[],
): void {
  const payload = {
    userId,
    status: presence.status,
    lastSeen: presence.lastSeen,
    customStatus: presence.customStatus,
  };

  targetRooms.forEach((room) => {
    server.to(room).emit('presence:update', payload);
  });
}

// ============================================================================
// TYPING INDICATORS
// ============================================================================

/**
 * 28. Starts typing indicator for user in room.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {string} userId - User identifier
 * @param {number} timeout - Auto-clear timeout in ms
 * @returns {NodeJS.Timeout} Clear timeout timer
 *
 * @example
 * ```typescript
 * const timer = startWsTypingIndicator(client, 'room-123', 'user-456', 3000);
 * ```
 */
export function startWsTypingIndicator(
  client: Socket,
  roomId: string,
  userId: string,
  timeout: number = 3000,
): NodeJS.Timeout {
  const key = `typing:${client.id}:${roomId}`;

  // Clear existing timer if any
  const existingTimer = (client as any)[key];
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Broadcast typing start
  client.to(roomId).emit('typing:start', { userId, roomId });

  // Auto-clear typing indicator after timeout
  const timer = setTimeout(() => {
    client.to(roomId).emit('typing:stop', { userId, roomId });
    delete (client as any)[key];
  }, timeout);

  (client as any)[key] = timer;
  return timer;
}

/**
 * 29. Stops typing indicator for user in room.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {string} userId - User identifier
 * @returns {void}
 *
 * @example
 * ```typescript
 * stopWsTypingIndicator(client, 'room-123', 'user-456');
 * ```
 */
export function stopWsTypingIndicator(
  client: Socket,
  roomId: string,
  userId: string,
): void {
  const key = `typing:${client.id}:${roomId}`;

  // Clear timer
  const existingTimer = (client as any)[key];
  if (existingTimer) {
    clearTimeout(existingTimer);
    delete (client as any)[key];
  }

  // Broadcast typing stop
  client.to(roomId).emit('typing:stop', { userId, roomId });
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * 30. Creates rate limiter for WebSocket events.
 *
 * @param {WsRateLimitConfig} config - Rate limit configuration
 * @returns {(client: Socket, event: string) => boolean} Rate limiter function
 *
 * @example
 * ```typescript
 * const rateLimiter = createWsRateLimiter({
 *   maxEvents: 10,
 *   windowMs: 60000,
 *   blockDurationMs: 300000,
 *   bypassRoles: ['admin']
 * });
 * ```
 */
export function createWsRateLimiter(
  config: WsRateLimitConfig,
): (client: Socket, event: string) => boolean {
  const eventCounts = new Map<
    string,
    { count: number; resetAt: number; blockedUntil?: number }
  >();

  return (client: Socket, event: string): boolean => {
    // Bypass rate limiting for specific roles
    if (config.bypassRoles && checkWsRole(client, config.bypassRoles)) {
      return true;
    }

    const key = `${client.id}:${event}`;
    const now = Date.now();

    let record = eventCounts.get(key);

    // Check if blocked
    if (record?.blockedUntil && now < record.blockedUntil) {
      throw new WsException('Rate limit exceeded. Please try again later.');
    }

    // Reset if window expired
    if (!record || now > record.resetAt) {
      record = {
        count: 0,
        resetAt: now + config.windowMs,
      };
      eventCounts.set(key, record);
    }

    // Increment count
    record.count++;

    // Check limit
    if (record.count > config.maxEvents) {
      if (config.blockDurationMs) {
        record.blockedUntil = now + config.blockDurationMs;
      }
      throw new WsException('Rate limit exceeded');
    }

    return true;
  };
}

// ============================================================================
// HEARTBEAT & RECONNECTION
// ============================================================================

/**
 * 31. Sets up heartbeat monitoring for connection health.
 *
 * @param {Socket} client - Socket client
 * @param {WsHeartbeatConfig} config - Heartbeat configuration
 * @param {() => void} onTimeout - Timeout callback
 * @returns {NodeJS.Timeout} Heartbeat interval timer
 *
 * @example
 * ```typescript
 * const timer = setupWsHeartbeat(client, {
 *   interval: 30000,
 *   timeout: 5000,
 *   maxMissed: 3
 * }, () => {
 *   client.disconnect();
 * });
 * ```
 */
export function setupWsHeartbeat(
  client: Socket,
  config: WsHeartbeatConfig,
  onTimeout: () => void,
): NodeJS.Timeout {
  let missedHeartbeats = 0;

  const interval = setInterval(() => {
    const startTime = Date.now();

    client.emit('heartbeat:ping', { timestamp: startTime }, (response: any) => {
      if (response && response.timestamp) {
        missedHeartbeats = 0;
        const rtt = Date.now() - startTime;
        (client as any).__latency = rtt;
      } else {
        missedHeartbeats++;

        if (missedHeartbeats >= config.maxMissed) {
          clearInterval(interval);
          onTimeout();
        }
      }
    });
  }, config.interval);

  // Clean up on disconnect
  client.on('disconnect', () => {
    clearInterval(interval);
  });

  return interval;
}

/**
 * 32. Handles client reconnection with session restoration.
 *
 * @param {Socket} client - Socket client
 * @param {Map<string, any>} sessionStore - Session data store
 * @returns {any | null} Restored session data
 *
 * @example
 * ```typescript
 * const session = handleWsReconnection(client, this.sessionStore);
 * if (session) {
 *   // Restore user rooms and state
 *   session.rooms.forEach(room => client.join(room));
 * }
 * ```
 */
export function handleWsReconnection(
  client: Socket,
  sessionStore: Map<string, any>,
): any | null {
  const sessionId = client.handshake.auth?.sessionId;

  if (sessionId && sessionStore.has(sessionId)) {
    const session = sessionStore.get(sessionId);

    // Update session with new socket ID
    session.socketId = client.id;
    session.reconnectedAt = new Date();
    session.reconnections = (session.reconnections || 0) + 1;

    sessionStore.set(sessionId, session);

    return session;
  }

  return null;
}

/**
 * 33. Gets connection quality metrics for a client.
 *
 * @param {Socket} client - Socket client
 * @returns {Promise<object>} Connection quality metrics
 *
 * @example
 * ```typescript
 * const quality = await getWsConnectionQuality(client);
 * console.log(`Latency: ${quality.latency}ms, Packet loss: ${quality.packetLoss}%`);
 * ```
 */
export async function getWsConnectionQuality(client: Socket): Promise<{
  latency: number;
  jitter: number;
  packetLoss: number;
}> {
  const measurements: number[] = [];
  const pings = 5;

  for (let i = 0; i < pings; i++) {
    const start = Date.now();

    try {
      await sendWsWithAck(client, 'ping', { seq: i }, 2000);
      measurements.push(Date.now() - start);
    } catch (error) {
      // Packet lost
    }

    // Wait between pings
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const validMeasurements = measurements.filter((m) => m > 0);
  const avgLatency =
    validMeasurements.length > 0
      ? validMeasurements.reduce((a, b) => a + b, 0) / validMeasurements.length
      : 0;

  // Calculate jitter (variance in latency)
  const jitter =
    validMeasurements.length > 1
      ? Math.sqrt(
          validMeasurements.reduce((sum, lat) => sum + Math.pow(lat - avgLatency, 2), 0) /
            validMeasurements.length,
        )
      : 0;

  const packetLoss = ((pings - validMeasurements.length) / pings) * 100;

  return {
    latency: Math.round(avgLatency),
    jitter: Math.round(jitter),
    packetLoss: Math.round(packetLoss),
  };
}

/**
 * 34. Tracks connection state transitions.
 *
 * @param {string} socketId - Socket ID
 * @param {string} userId - User ID
 * @param {Map<string, WsConnectionState>} stateStore - Connection state store
 * @returns {WsConnectionState} Connection state
 *
 * @example
 * ```typescript
 * const state = trackWsConnectionState(client.id, userId, this.stateStore);
 * ```
 */
export function trackWsConnectionState(
  socketId: string,
  userId: string,
  stateStore: Map<string, WsConnectionState>,
): WsConnectionState {
  const existing = stateStore.get(socketId);

  if (existing) {
    existing.state = 'connected';
    existing.reconnectAttempts = 0;
    existing.lastConnected = new Date();
    return existing;
  }

  const state: WsConnectionState = {
    socketId,
    userId,
    state: 'connected',
    reconnectAttempts: 0,
    lastConnected: new Date(),
  };

  stateStore.set(socketId, state);
  return state;
}

/**
 * 35. Calculates exponential backoff for reconnection.
 *
 * @param {number} attempt - Current attempt number
 * @param {WsReconnectionConfig} config - Reconnection configuration
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateWsReconnectionDelay(3, {
 *   enabled: true,
 *   maxAttempts: 5,
 *   delay: 1000,
 *   delayMultiplier: 2,
 *   maxDelay: 30000
 * });
 * ```
 */
export function calculateWsReconnectionDelay(
  attempt: number,
  config: WsReconnectionConfig,
): number {
  const exponentialDelay = Math.min(
    config.delay * Math.pow(config.delayMultiplier, attempt - 1),
    config.maxDelay,
  );

  // Add jitter ±25%
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.floor(exponentialDelay + jitter);
}

// ============================================================================
// OFFLINE MESSAGE QUEUE
// ============================================================================

/**
 * 36. Queues message for offline user.
 *
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {Partial<WsOfflineMessage>} options - Queue options
 * @returns {Promise<SocketOfflineQueue>} Queued message
 *
 * @example
 * ```typescript
 * const queued = await queueWsOfflineMessage('user-123', 'notification', data, {
 *   priority: 5,
 *   expiresAt: new Date(Date.now() + 86400000)
 * });
 * ```
 */
export async function queueWsOfflineMessage(
  userId: string,
  event: string,
  data: any,
  options?: Partial<WsOfflineMessage>,
): Promise<SocketOfflineQueue> {
  return await SocketOfflineQueue.create({
    userId,
    event,
    data,
    priority: options?.priority || 0,
    expiresAt: options?.expiresAt || null,
    maxAttempts: options?.maxAttempts || 3,
  });
}

/**
 * 37. Retrieves queued messages for user.
 *
 * @param {string} userId - User ID
 * @param {number} limit - Maximum messages to retrieve
 * @returns {Promise<SocketOfflineQueue[]>} Queued messages
 *
 * @example
 * ```typescript
 * const messages = await getWsQueuedMessages('user-123', 50);
 * for (const msg of messages) {
 *   socket.emit(msg.event, msg.data);
 * }
 * ```
 */
export async function getWsQueuedMessages(
  userId: string,
  limit: number = 50,
): Promise<SocketOfflineQueue[]> {
  return await SocketOfflineQueue.findAll({
    where: {
      userId,
      delivered: false,
    },
    order: [
      ['priority', 'DESC'],
      ['queuedAt', 'ASC'],
    ],
    limit,
  });
}

/**
 * 38. Marks queued message as delivered.
 *
 * @param {string} messageId - Message ID
 * @returns {Promise<boolean>} True if updated successfully
 *
 * @example
 * ```typescript
 * await markWsQueuedMessageDelivered(msg.id);
 * ```
 */
export async function markWsQueuedMessageDelivered(messageId: string): Promise<boolean> {
  const [updated] = await SocketOfflineQueue.update(
    { delivered: true, deliveredAt: new Date() },
    { where: { id: messageId } },
  );

  return updated > 0;
}

/**
 * 39. Cleans up expired queued messages.
 *
 * @returns {Promise<number>} Number of deleted messages
 *
 * @example
 * ```typescript
 * const deleted = await cleanupWsExpiredQueue();
 * console.log(`Cleaned up ${deleted} expired messages`);
 * ```
 */
export async function cleanupWsExpiredQueue(): Promise<number> {
  const now = new Date();
  return await SocketOfflineQueue.destroy({
    where: {
      expiresAt: {
        [Sequelize.Op.lt]: now,
      },
    },
  });
}

// ============================================================================
// READ RECEIPTS
// ============================================================================

/**
 * 40. Creates read receipt for message.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID
 * @param {string} socketId - Socket ID
 * @returns {Promise<SocketReadReceipt>} Created receipt
 *
 * @example
 * ```typescript
 * const receipt = await createWsReadReceipt('msg-123', 'user-456', client.id);
 * ```
 */
export async function createWsReadReceipt(
  messageId: string,
  userId: string,
  socketId: string,
): Promise<SocketReadReceipt> {
  return await SocketReadReceipt.create({
    messageId,
    userId,
    socketId,
  });
}

/**
 * 41. Gets all read receipts for a message.
 *
 * @param {string} messageId - Message ID
 * @returns {Promise<WsReadReceipt[]>} Read receipts
 *
 * @example
 * ```typescript
 * const receipts = await getWsMessageReadReceipts('msg-123');
 * console.log(`Message read by ${receipts.length} users`);
 * ```
 */
export async function getWsMessageReadReceipts(messageId: string): Promise<WsReadReceipt[]> {
  const receipts = await SocketReadReceipt.findAll({
    where: { messageId },
    order: [['readAt', 'ASC']],
  });

  return receipts.map((r) => ({
    messageId: r.messageId,
    userId: r.userId,
    socketId: r.socketId,
    readAt: r.readAt,
  }));
}

/**
 * 42. Broadcasts read receipt to room.
 *
 * @param {Server} server - Socket.IO server
 * @param {string} roomId - Room ID
 * @param {WsReadReceipt} receipt - Read receipt
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastWsReadReceipt(this.server, 'room-123', receipt);
 * ```
 */
export function broadcastWsReadReceipt(
  server: Server,
  roomId: string,
  receipt: WsReadReceipt,
): void {
  server.to(roomId).emit('message:read', receipt);
}

// ============================================================================
// FILE TRANSFER
// ============================================================================

/**
 * 43. Initiates file transfer session.
 *
 * @param {object} options - File transfer options
 * @returns {WsFileTransfer} File transfer metadata
 *
 * @example
 * ```typescript
 * const transfer = initiateWsFileTransfer({
 *   fileName: 'report.pdf',
 *   fileSize: 1024000,
 *   mimeType: 'application/pdf',
 *   senderId: 'user-123',
 *   recipientId: 'user-456',
 *   chunkSize: 64000
 * });
 * ```
 */
export function initiateWsFileTransfer(options: {
  fileName: string;
  fileSize: number;
  mimeType: string;
  senderId: string;
  recipientId?: string;
  roomId?: string;
  chunkSize?: number;
}): WsFileTransfer {
  const chunkSize = options.chunkSize || 64000; // 64KB
  const totalChunks = Math.ceil(options.fileSize / chunkSize);

  return {
    transferId: generateTransferId(),
    fileName: options.fileName,
    fileSize: options.fileSize,
    mimeType: options.mimeType,
    senderId: options.senderId,
    recipientId: options.recipientId,
    roomId: options.roomId,
    chunkSize,
    totalChunks,
    receivedChunks: 0,
    startedAt: new Date(),
    status: 'pending',
  };
}

/**
 * 44. Handles file chunk transfer.
 *
 * @param {WsFileTransfer} transfer - Transfer metadata
 * @param {number} chunkIndex - Chunk index
 * @param {Buffer} chunkData - Chunk data
 * @returns {WsFileTransfer} Updated transfer metadata
 *
 * @example
 * ```typescript
 * const updated = handleWsFileChunk(transfer, 5, chunkBuffer);
 * client.emit('file:progress', {
 *   transferId: updated.transferId,
 *   progress: (updated.receivedChunks / updated.totalChunks) * 100
 * });
 * ```
 */
export function handleWsFileChunk(
  transfer: WsFileTransfer,
  chunkIndex: number,
  chunkData: Buffer,
): WsFileTransfer {
  transfer.receivedChunks++;
  transfer.status = 'transferring';

  if (transfer.receivedChunks >= transfer.totalChunks) {
    transfer.status = 'completed';
    transfer.completedAt = new Date();
  }

  return transfer;
}

/**
 * 45. Cancels file transfer.
 *
 * @param {WsFileTransfer} transfer - Transfer metadata
 * @returns {WsFileTransfer} Updated transfer metadata
 *
 * @example
 * ```typescript
 * const cancelled = cancelWsFileTransfer(transfer);
 * client.emit('file:cancelled', { transferId: cancelled.transferId });
 * ```
 */
export function cancelWsFileTransfer(transfer: WsFileTransfer): WsFileTransfer {
  transfer.status = 'cancelled';
  transfer.completedAt = new Date();
  return transfer;
}

// ============================================================================
// NOTIFICATION DELIVERY
// ============================================================================

/**
 * 46. Creates and persists a WebSocket notification.
 *
 * @param {string} userId - Target user ID
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {Partial<SocketNotification>} options - Additional notification options
 * @returns {Promise<SocketNotification>} Created notification
 *
 * @example
 * ```typescript
 * const notification = await createWsNotification(
 *   'user-123',
 *   'appointment',
 *   'Appointment Reminder',
 *   'Your appointment is in 1 hour',
 *   { priority: 'high', data: { appointmentId: '456' } }
 * );
 * ```
 */
export async function createWsNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  options?: Partial<SocketNotification>,
): Promise<SocketNotification> {
  return await SocketNotification.create({
    userId,
    type,
    title,
    message,
    tenantId: options?.tenantId || null,
    data: options?.data || null,
    priority: options?.priority || 'normal',
    actionUrl: options?.actionUrl || null,
    expiresAt: options?.expiresAt || null,
  });
}

/**
 * 47. Delivers real-time notification to user.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {WsNotification} notification - Notification to deliver
 * @returns {void}
 *
 * @example
 * ```typescript
 * const notification = await createWsNotification(...);
 * deliverWsNotification(this.server, notification);
 * ```
 */
export function deliverWsNotification(server: Server, notification: WsNotification): void {
  server.to(`user:${notification.userId}`).emit('notification:new', notification);
}

/**
 * 48. Marks notification as read.
 *
 * @param {string} notificationId - Notification ID
 * @returns {Promise<boolean>} True if updated successfully
 *
 * @example
 * ```typescript
 * await markWsNotificationRead('notification-123');
 * ```
 */
export async function markWsNotificationRead(notificationId: string): Promise<boolean> {
  const [updated] = await SocketNotification.update(
    { isRead: true, readAt: new Date() },
    { where: { id: notificationId } },
  );

  return updated > 0;
}

/**
 * 49. Gets unread notifications for user.
 *
 * @param {string} userId - User identifier
 * @param {number} limit - Maximum number of notifications
 * @returns {Promise<SocketNotification[]>} Unread notifications
 *
 * @example
 * ```typescript
 * const unread = await getWsUnreadNotifications('user-123', 50);
 * ```
 */
export async function getWsUnreadNotifications(
  userId: string,
  limit: number = 50,
): Promise<SocketNotification[]> {
  return await SocketNotification.findAll({
    where: { userId, isRead: false },
    order: [['createdAt', 'DESC']],
    limit,
  });
}

// ============================================================================
// EVENT ROUTING & MIDDLEWARE
// ============================================================================

/**
 * 50. Creates event routing middleware for conditional message delivery.
 *
 * @param {WsEventRoutingRule[]} rules - Routing rules
 * @returns {(client: Socket, event: string, data: any) => void} Routing middleware
 *
 * @example
 * ```typescript
 * const router = createWsEventRouter([
 *   {
 *     eventPattern: /^patient\./,
 *     targetRooms: ['doctors-room'],
 *     condition: (data) => data.priority === 'urgent'
 *   }
 * ]);
 * ```
 */
export function createWsEventRouter(
  rules: WsEventRoutingRule[],
): (client: Socket, event: string, data: any) => void {
  return (client: Socket, event: string, data: any): void => {
    for (const rule of rules) {
      // Check event pattern match
      const patternMatch =
        typeof rule.eventPattern === 'string'
          ? event === rule.eventPattern
          : rule.eventPattern.test(event);

      if (!patternMatch) {
        continue;
      }

      // Check condition if provided
      if (rule.condition && !rule.condition(data, client)) {
        continue;
      }

      // Transform data if transformer provided
      const transformedData = rule.transform ? rule.transform(data) : data;

      // Route to target rooms
      if (rule.targetRooms && rule.targetRooms.length > 0) {
        rule.targetRooms.forEach((room) => {
          client.to(room).emit(event, transformedData);
        });
      }

      // Route to target users
      if (rule.targetUsers && rule.targetUsers.length > 0) {
        rule.targetUsers.forEach((userId) => {
          sendToWsUser(client.nsp.server, userId, event, transformedData);
        });
      }
    }
  };
}

/**
 * 51. Creates WebSocket middleware for request validation and logging.
 *
 * @param {(client: Socket, data: any) => Promise<boolean>} validator - Validation function
 * @param {Logger} logger - Logger instance
 * @returns {(client: Socket, packet: any, next: (err?: any) => void) => void} Middleware function
 *
 * @example
 * ```typescript
 * const middleware = createWsMiddleware(
 *   async (client, data) => {
 *     return await validatePayload(data);
 *   },
 *   new Logger('WsMiddleware')
 * );
 * ```
 */
export function createWsMiddleware(
  validator: (client: Socket, data: any) => Promise<boolean>,
  logger?: Logger,
): (client: Socket, packet: any, next: (err?: any) => void) => void {
  return async (client: Socket, packet: any, next: (err?: any) => void) => {
    const [event, data] = packet;

    try {
      logger?.debug(`[${client.id}] Event: ${event}`);

      const isValid = await validator(client, data);

      if (isValid) {
        next();
      } else {
        const error = new WsException('Validation failed');
        logger?.warn(`[${client.id}] Validation failed for event: ${event}`);
        next(error);
      }
    } catch (error) {
      logger?.error(`[${client.id}] Middleware error: ${error.message}`);
      next(new WsException(error.message));
    }
  };
}

// ============================================================================
// REDIS ADAPTER & SCALING
// ============================================================================

/**
 * 52. Creates Redis adapter configuration for horizontal scaling.
 *
 * @param {Partial<WsRedisAdapterConfig>} options - Redis adapter options
 * @returns {WsRedisAdapterConfig} Complete Redis adapter configuration
 *
 * @example
 * ```typescript
 * const redisConfig = createWsRedisAdapterConfig({
 *   host: process.env.REDIS_HOST || 'localhost',
 *   port: 6379,
 *   password: process.env.REDIS_PASSWORD,
 *   keyPrefix: 'ws:'
 * });
 * ```
 */
export function createWsRedisAdapterConfig(
  options: Partial<WsRedisAdapterConfig> = {},
): WsRedisAdapterConfig {
  return {
    host: options.host || process.env.REDIS_HOST || 'localhost',
    port: options.port || parseInt(process.env.REDIS_PORT || '6379', 10),
    password: options.password || process.env.REDIS_PASSWORD,
    db: options.db || 0,
    keyPrefix: options.keyPrefix || 'socket.io:',
    requestsTimeout: options.requestsTimeout || 5000,
    tls: options.tls ?? false,
  };
}

// ============================================================================
// HEALTH CHECKS
// ============================================================================

/**
 * 53. Performs comprehensive WebSocket health check.
 *
 * @param {Server} server - Socket.IO server
 * @param {Map<string, WsConnectionMetadata>} connectionsStore - Connections store
 * @returns {Promise<WsHealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const health = await performWsHealthCheck(this.server, this.connections);
 * if (!health.healthy) {
 *   logger.warn('WebSocket health issues:', health.issues);
 * }
 * ```
 */
export async function performWsHealthCheck(
  server: Server,
  connectionsStore: Map<string, WsConnectionMetadata>,
): Promise<WsHealthCheckResult> {
  const issues: string[] = [];
  const metrics = {
    connectedClients: server.sockets.sockets.size,
    totalRooms: server.sockets.adapter.rooms.size,
    averageLatency: 0,
    memoryUsage: process.memoryUsage().heapUsed,
    uptime: process.uptime(),
  };

  // Calculate average latency
  const latencies: number[] = [];
  for (const [socketId] of server.sockets.sockets) {
    const socket = server.sockets.sockets.get(socketId);
    if (socket && (socket as any).__latency) {
      latencies.push((socket as any).__latency);
    }
  }

  metrics.averageLatency =
    latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;

  // Check for issues
  if (metrics.connectedClients === 0) {
    issues.push('No active connections');
  }

  if (metrics.memoryUsage > 1073741824) {
    // 1GB
    issues.push('High memory usage detected');
  }

  if (metrics.averageLatency > 1000) {
    issues.push('High average latency');
  }

  return {
    healthy: issues.length === 0,
    timestamp: new Date(),
    metrics,
    issues: issues.length > 0 ? issues : undefined,
  };
}

/**
 * 54. Checks individual socket connection health.
 *
 * @param {Socket} client - Socket client
 * @returns {Promise<object>} Connection health metrics
 *
 * @example
 * ```typescript
 * const health = await checkWsSocketHealth(client);
 * if (health.latency > 500) {
 *   logger.warn('High latency detected');
 * }
 * ```
 */
export async function checkWsSocketHealth(client: Socket): Promise<{
  healthy: boolean;
  latency: number;
  connected: boolean;
  transport: string;
}> {
  try {
    const start = Date.now();
    await sendWsWithAck(client, 'health:ping', {}, 2000);
    const latency = Date.now() - start;

    return {
      healthy: latency < 1000,
      latency,
      connected: client.connected,
      transport: client.conn.transport.name,
    };
  } catch (error) {
    return {
      healthy: false,
      latency: -1,
      connected: client.connected,
      transport: client.conn.transport.name,
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a unique event/message ID
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a unique transfer ID for file transfers
 */
function generateTransferId(): string {
  return `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets WebSocket gateway statistics
 */
export function getWsGatewayStats(
  server: Server,
  connectionsStore: Map<string, WsConnectionMetadata>,
): {
  connectedClients: number;
  totalRooms: number;
  avgConnectionDuration: number;
  namespaces: string[];
} {
  const now = Date.now();
  const connectionDurations = Array.from(connectionsStore.values()).map(
    (conn) => now - conn.connectedAt.getTime(),
  );

  return {
    connectedClients: server.sockets.sockets.size,
    totalRooms: server.sockets.adapter.rooms.size,
    avgConnectionDuration:
      connectionDurations.length > 0
        ? connectionDurations.reduce((a, b) => a + b, 0) / connectionDurations.length
        : 0,
    namespaces: Array.from(server._nsps.keys()),
  };
}

/**
 * Disconnects a specific client with reason
 */
export function disconnectWsClient(client: Socket, reason: string): void {
  client.emit('disconnect:reason', { reason, timestamp: new Date() });
  client.disconnect(true);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Gateway Configuration & Initialization (6)
  createWsGatewayConfig,
  initializeWsGateway,
  handleWsConnection,
  handleWsDisconnection,
  persistWsConnection,
  removePersistedWsConnection,

  // Authentication & Authorization (5)
  extractWsAuthToken,
  validateWsJwtAuth,
  checkWsRole,
  checkWsPermission,
  validateWsTenantAccess,

  // Room Management (6)
  joinWsRoom,
  leaveWsRoom,
  getWsRoomMembers,
  getWsClientRooms,
  createWsRoom,
  closeWsRoom,

  // Message Broadcasting (5)
  broadcastToWsRoom,
  broadcastToAllWs,
  sendToWsUser,
  sendWsWithAck,
  persistWsMessage,

  // Presence Tracking (5)
  setWsUserOnline,
  setWsUserOffline,
  getWsUserPresence,
  getWsOnlineUsers,
  broadcastWsPresenceUpdate,

  // Typing Indicators (2)
  startWsTypingIndicator,
  stopWsTypingIndicator,

  // Rate Limiting (1)
  createWsRateLimiter,

  // Heartbeat & Reconnection (4)
  setupWsHeartbeat,
  handleWsReconnection,
  getWsConnectionQuality,
  trackWsConnectionState,
  calculateWsReconnectionDelay,

  // Offline Message Queue (4)
  queueWsOfflineMessage,
  getWsQueuedMessages,
  markWsQueuedMessageDelivered,
  cleanupWsExpiredQueue,

  // Read Receipts (3)
  createWsReadReceipt,
  getWsMessageReadReceipts,
  broadcastWsReadReceipt,

  // File Transfer (3)
  initiateWsFileTransfer,
  handleWsFileChunk,
  cancelWsFileTransfer,

  // Notification Delivery (4)
  createWsNotification,
  deliverWsNotification,
  markWsNotificationRead,
  getWsUnreadNotifications,

  // Event Routing & Middleware (2)
  createWsEventRouter,
  createWsMiddleware,

  // Redis Adapter & Scaling (1)
  createWsRedisAdapterConfig,

  // Health Checks (2)
  performWsHealthCheck,
  checkWsSocketHealth,

  // Utilities (2)
  getWsGatewayStats,
  disconnectWsClient,

  // Sequelize Models
  SocketConnection,
  SocketRoom,
  SocketMessage,
  SocketPresence,
  SocketNotification,
  SocketOfflineQueue,
  SocketReadReceipt,
};
