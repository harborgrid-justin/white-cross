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
import { Logger } from '@nestjs/common';
import { Server, Socket, Namespace } from 'socket.io';
import { Model } from 'sequelize-typescript';
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
    except?: string[];
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
/**
 * Socket connection model for tracking active WebSocket connections
 */
export declare class SocketConnection extends Model {
    id: string;
    socketId: string;
    userId: string | null;
    tenantId: string | null;
    namespace: string;
    ipAddress: string | null;
    userAgent: string | null;
    transport: string;
    connectedAt: Date;
    lastActivity: Date;
    metadata: Record<string, any>;
}
/**
 * WebSocket room model for managing chat rooms and channels
 */
export declare class SocketRoom extends Model {
    id: string;
    roomId: string;
    name: string;
    type: 'public' | 'private' | 'direct';
    ownerId: string | null;
    tenantId: string | null;
    maxMembers: number | null;
    memberCount: number;
    description: string | null;
    metadata: Record<string, any>;
    expiresAt: Date | null;
    messages: SocketMessage[];
}
/**
 * WebSocket message model for storing chat messages
 */
export declare class SocketMessage extends Model {
    id: string;
    roomId: string;
    room: SocketRoom;
    senderId: string;
    tenantId: string | null;
    type: 'text' | 'image' | 'file' | 'video' | 'audio' | 'system';
    content: string;
    attachments: Record<string, any> | null;
    replyToId: string | null;
    isEdited: boolean;
    isDeleted: boolean;
    metadata: Record<string, any>;
}
/**
 * User presence model for tracking online/offline status
 */
export declare class SocketPresence extends Model {
    id: string;
    userId: string;
    tenantId: string | null;
    status: PresenceStatus;
    customStatus: string | null;
    socketIds: string[];
    lastSeen: Date;
    metadata: Record<string, any>;
}
/**
 * Notification model for storing real-time notifications
 */
export declare class SocketNotification extends Model {
    id: string;
    userId: string;
    tenantId: string | null;
    type: string;
    title: string;
    message: string;
    data: Record<string, any> | null;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    isRead: boolean;
    readAt: Date | null;
    expiresAt: Date | null;
    actionUrl: string | null;
}
/**
 * Offline message queue model for storing messages for offline users
 */
export declare class SocketOfflineQueue extends Model {
    id: string;
    userId: string;
    event: string;
    data: Record<string, any>;
    priority: number;
    queuedAt: Date;
    expiresAt: Date | null;
    attempts: number;
    maxAttempts: number;
    delivered: boolean;
    deliveredAt: Date | null;
}
/**
 * Read receipts model for tracking message read status
 */
export declare class SocketReadReceipt extends Model {
    id: string;
    messageId: string;
    userId: string;
    socketId: string;
    readAt: Date;
}
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
export declare function createWsGatewayConfig(namespace?: string, options?: Partial<any>): any;
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
export declare function initializeWsGateway(server: Server, gatewayName: string, connectionsStore: Map<string, WsConnectionMetadata>): void;
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
export declare function handleWsConnection(client: Socket, connectionsStore: Map<string, WsConnectionMetadata>): WsConnectionMetadata;
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
export declare function handleWsDisconnection(client: Socket, connectionsStore: Map<string, WsConnectionMetadata>, cleanupCallback?: () => Promise<void>): Promise<void>;
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
export declare function persistWsConnection(client: Socket, metadata: WsConnectionMetadata): Promise<SocketConnection>;
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
export declare function removePersistedWsConnection(socketId: string): Promise<number>;
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
export declare function extractWsAuthToken(client: Socket): string | null;
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
export declare function validateWsJwtAuth(client: Socket, verifyFn: (token: string) => Promise<WsAuthPayload>): Promise<WsAuthPayload>;
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
export declare function checkWsRole(client: Socket, requiredRoles: string[]): boolean;
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
export declare function checkWsPermission(client: Socket, requiredPermissions: string[]): boolean;
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
export declare function validateWsTenantAccess(client: Socket, requiredTenantId: string): boolean;
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
export declare function joinWsRoom(client: Socket, roomId: string, config?: WsRoomConfig): Promise<boolean>;
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
export declare function leaveWsRoom(client: Socket, roomId: string): Promise<void>;
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
export declare function getWsRoomMembers(serverOrNamespace: Server | Namespace, roomId: string): Promise<string[]>;
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
export declare function getWsClientRooms(client: Socket): string[];
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
export declare function createWsRoom(config: WsRoomConfig): Promise<SocketRoom>;
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
export declare function closeWsRoom(server: Server, roomId: string): Promise<number>;
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
export declare function broadcastToWsRoom(client: Socket, roomId: string, event: string, data: any, options?: WsBroadcastOptions): void;
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
export declare function broadcastToAllWs(server: Server, event: string, data: any, options?: WsBroadcastOptions): void;
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
export declare function sendToWsUser(server: Server, userId: string, event: string, data: any): void;
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
export declare function sendWsWithAck(client: Socket, event: string, data: any, timeout?: number): Promise<any>;
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
export declare function persistWsMessage(roomId: string, senderId: string, content: string, options?: Partial<SocketMessage>): Promise<SocketMessage>;
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
export declare function setWsUserOnline(userId: string, socketId: string, status?: PresenceStatus, metadata?: Record<string, any>): Promise<SocketPresence>;
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
export declare function setWsUserOffline(userId: string, socketId: string): Promise<boolean>;
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
export declare function getWsUserPresence(userId: string): Promise<WsPresenceInfo | null>;
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
export declare function getWsOnlineUsers(userIds: string[]): Promise<WsPresenceInfo[]>;
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
export declare function broadcastWsPresenceUpdate(server: Server, userId: string, presence: WsPresenceInfo, targetRooms: string[]): void;
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
export declare function startWsTypingIndicator(client: Socket, roomId: string, userId: string, timeout?: number): NodeJS.Timeout;
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
export declare function stopWsTypingIndicator(client: Socket, roomId: string, userId: string): void;
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
export declare function createWsRateLimiter(config: WsRateLimitConfig): (client: Socket, event: string) => boolean;
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
export declare function setupWsHeartbeat(client: Socket, config: WsHeartbeatConfig, onTimeout: () => void): NodeJS.Timeout;
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
export declare function handleWsReconnection(client: Socket, sessionStore: Map<string, any>): any | null;
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
export declare function getWsConnectionQuality(client: Socket): Promise<{
    latency: number;
    jitter: number;
    packetLoss: number;
}>;
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
export declare function trackWsConnectionState(socketId: string, userId: string, stateStore: Map<string, WsConnectionState>): WsConnectionState;
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
export declare function calculateWsReconnectionDelay(attempt: number, config: WsReconnectionConfig): number;
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
export declare function queueWsOfflineMessage(userId: string, event: string, data: any, options?: Partial<WsOfflineMessage>): Promise<SocketOfflineQueue>;
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
export declare function getWsQueuedMessages(userId: string, limit?: number): Promise<SocketOfflineQueue[]>;
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
export declare function markWsQueuedMessageDelivered(messageId: string): Promise<boolean>;
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
export declare function cleanupWsExpiredQueue(): Promise<number>;
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
export declare function createWsReadReceipt(messageId: string, userId: string, socketId: string): Promise<SocketReadReceipt>;
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
export declare function getWsMessageReadReceipts(messageId: string): Promise<WsReadReceipt[]>;
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
export declare function broadcastWsReadReceipt(server: Server, roomId: string, receipt: WsReadReceipt): void;
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
export declare function initiateWsFileTransfer(options: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    senderId: string;
    recipientId?: string;
    roomId?: string;
    chunkSize?: number;
}): WsFileTransfer;
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
export declare function handleWsFileChunk(transfer: WsFileTransfer, chunkIndex: number, chunkData: Buffer): WsFileTransfer;
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
export declare function cancelWsFileTransfer(transfer: WsFileTransfer): WsFileTransfer;
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
export declare function createWsNotification(userId: string, type: string, title: string, message: string, options?: Partial<SocketNotification>): Promise<SocketNotification>;
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
export declare function deliverWsNotification(server: Server, notification: WsNotification): void;
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
export declare function markWsNotificationRead(notificationId: string): Promise<boolean>;
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
export declare function getWsUnreadNotifications(userId: string, limit?: number): Promise<SocketNotification[]>;
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
export declare function createWsEventRouter(rules: WsEventRoutingRule[]): (client: Socket, event: string, data: any) => void;
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
export declare function createWsMiddleware(validator: (client: Socket, data: any) => Promise<boolean>, logger?: Logger): (client: Socket, packet: any, next: (err?: any) => void) => void;
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
export declare function createWsRedisAdapterConfig(options?: Partial<WsRedisAdapterConfig>): WsRedisAdapterConfig;
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
export declare function performWsHealthCheck(server: Server, connectionsStore: Map<string, WsConnectionMetadata>): Promise<WsHealthCheckResult>;
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
export declare function checkWsSocketHealth(client: Socket): Promise<{
    healthy: boolean;
    latency: number;
    connected: boolean;
    transport: string;
}>;
/**
 * Gets WebSocket gateway statistics
 */
export declare function getWsGatewayStats(server: Server, connectionsStore: Map<string, WsConnectionMetadata>): {
    connectedClients: number;
    totalRooms: number;
    avgConnectionDuration: number;
    namespaces: string[];
};
/**
 * Disconnects a specific client with reason
 */
export declare function disconnectWsClient(client: Socket, reason: string): void;
declare const _default: {
    createWsGatewayConfig: typeof createWsGatewayConfig;
    initializeWsGateway: typeof initializeWsGateway;
    handleWsConnection: typeof handleWsConnection;
    handleWsDisconnection: typeof handleWsDisconnection;
    persistWsConnection: typeof persistWsConnection;
    removePersistedWsConnection: typeof removePersistedWsConnection;
    extractWsAuthToken: typeof extractWsAuthToken;
    validateWsJwtAuth: typeof validateWsJwtAuth;
    checkWsRole: typeof checkWsRole;
    checkWsPermission: typeof checkWsPermission;
    validateWsTenantAccess: typeof validateWsTenantAccess;
    joinWsRoom: typeof joinWsRoom;
    leaveWsRoom: typeof leaveWsRoom;
    getWsRoomMembers: typeof getWsRoomMembers;
    getWsClientRooms: typeof getWsClientRooms;
    createWsRoom: typeof createWsRoom;
    closeWsRoom: typeof closeWsRoom;
    broadcastToWsRoom: typeof broadcastToWsRoom;
    broadcastToAllWs: typeof broadcastToAllWs;
    sendToWsUser: typeof sendToWsUser;
    sendWsWithAck: typeof sendWsWithAck;
    persistWsMessage: typeof persistWsMessage;
    setWsUserOnline: typeof setWsUserOnline;
    setWsUserOffline: typeof setWsUserOffline;
    getWsUserPresence: typeof getWsUserPresence;
    getWsOnlineUsers: typeof getWsOnlineUsers;
    broadcastWsPresenceUpdate: typeof broadcastWsPresenceUpdate;
    startWsTypingIndicator: typeof startWsTypingIndicator;
    stopWsTypingIndicator: typeof stopWsTypingIndicator;
    createWsRateLimiter: typeof createWsRateLimiter;
    setupWsHeartbeat: typeof setupWsHeartbeat;
    handleWsReconnection: typeof handleWsReconnection;
    getWsConnectionQuality: typeof getWsConnectionQuality;
    trackWsConnectionState: typeof trackWsConnectionState;
    calculateWsReconnectionDelay: typeof calculateWsReconnectionDelay;
    queueWsOfflineMessage: typeof queueWsOfflineMessage;
    getWsQueuedMessages: typeof getWsQueuedMessages;
    markWsQueuedMessageDelivered: typeof markWsQueuedMessageDelivered;
    cleanupWsExpiredQueue: typeof cleanupWsExpiredQueue;
    createWsReadReceipt: typeof createWsReadReceipt;
    getWsMessageReadReceipts: typeof getWsMessageReadReceipts;
    broadcastWsReadReceipt: typeof broadcastWsReadReceipt;
    initiateWsFileTransfer: typeof initiateWsFileTransfer;
    handleWsFileChunk: typeof handleWsFileChunk;
    cancelWsFileTransfer: typeof cancelWsFileTransfer;
    createWsNotification: typeof createWsNotification;
    deliverWsNotification: typeof deliverWsNotification;
    markWsNotificationRead: typeof markWsNotificationRead;
    getWsUnreadNotifications: typeof getWsUnreadNotifications;
    createWsEventRouter: typeof createWsEventRouter;
    createWsMiddleware: typeof createWsMiddleware;
    createWsRedisAdapterConfig: typeof createWsRedisAdapterConfig;
    performWsHealthCheck: typeof performWsHealthCheck;
    checkWsSocketHealth: typeof checkWsSocketHealth;
    getWsGatewayStats: typeof getWsGatewayStats;
    disconnectWsClient: typeof disconnectWsClient;
    SocketConnection: typeof SocketConnection;
    SocketRoom: typeof SocketRoom;
    SocketMessage: typeof SocketMessage;
    SocketPresence: typeof SocketPresence;
    SocketNotification: typeof SocketNotification;
    SocketOfflineQueue: typeof SocketOfflineQueue;
    SocketReadReceipt: typeof SocketReadReceipt;
};
export default _default;
//# sourceMappingURL=websocket-realtime-kit.d.ts.map