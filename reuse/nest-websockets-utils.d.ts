/**
 * LOC: WS-UTIL-001
 * File: /reuse/nest-websockets-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/websockets
 *   - @nestjs/common
 *   - socket.io
 *   - ioredis
 *
 * DOWNSTREAM (imported by):
 *   - WebSocket gateways
 *   - Real-time communication services
 *   - Socket.IO adapters
 *   - WebSocket guards and interceptors
 */
/**
 * File: /reuse/nest-websockets-utils.ts
 * Locator: WC-UTL-WS-001
 * Purpose: NestJS WebSocket Utilities - Real-time communication helpers for healthcare platform
 *
 * Upstream: @nestjs/websockets, socket.io, ioredis, @nestjs/common
 * Downstream: Chat gateways, notification systems, real-time health monitoring
 * Dependencies: NestJS v11.x, Socket.IO, Redis, TypeScript 5.x, Node 18+
 * Exports: 45 WebSocket utility functions for gateways, rooms, auth, broadcasting, rate limiting
 *
 * LLM Context: Comprehensive WebSocket utilities for White Cross healthcare platform.
 * Provides HIPAA-compliant real-time communication, secure room management, connection tracking,
 * message validation, rate limiting, and testing helpers. Critical for nurse stations, emergency
 * alerts, appointment notifications, and real-time patient monitoring.
 */
import { WsException } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
/**
 * WebSocket user data attached to socket
 */
export interface WsUser {
    userId: string;
    role: string;
    email?: string;
    permissions?: string[];
}
/**
 * Room metadata for tracking room information
 */
export interface RoomMetadata {
    roomId: string;
    name: string;
    type: 'chat' | 'notification' | 'emergency' | 'monitoring';
    createdAt: Date;
    maxClients?: number;
    metadata?: Record<string, any>;
}
/**
 * Message validation result
 */
export interface MessageValidationResult {
    isValid: boolean;
    errors?: string[];
    sanitizedData?: any;
}
/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
    maxMessages: number;
    windowMs: number;
    blockDurationMs?: number;
}
/**
 * Connection metadata
 */
export interface ConnectionMetadata {
    socketId: string;
    userId?: string;
    connectedAt: Date;
    lastActivity: Date;
    userAgent?: string;
    ipAddress?: string;
}
/**
 * Heartbeat configuration
 */
export interface HeartbeatConfig {
    intervalMs: number;
    timeoutMs: number;
    maxMissed: number;
}
/**
 * Message queue item
 */
export interface QueuedMessage {
    id: string;
    event: string;
    data: any;
    timestamp: Date;
    retryCount: number;
    userId?: string;
}
/**
 * Creates a WebSocket exception with proper error formatting.
 * Provides consistent error structure across all WebSocket communications.
 *
 * @param {string} message - Error message to send to client
 * @param {string} [code] - Optional error code for client-side handling
 * @param {any} [metadata] - Optional additional error metadata
 * @returns {WsException} Formatted WebSocket exception
 *
 * @example
 * ```typescript
 * throw createWsException('Invalid message format', 'VALIDATION_ERROR', { field: 'content' });
 * // Client receives: { message: 'Invalid message format', code: 'VALIDATION_ERROR', metadata: {...} }
 * ```
 */
export declare function createWsException(message: string, code?: string, metadata?: any): WsException;
/**
 * Extracts JWT token from WebSocket client connection.
 * Checks multiple locations: Authorization header, auth object, and query parameters.
 *
 * @param {Socket} client - Socket.IO client instance
 * @returns {string | null} JWT token if found, null otherwise
 *
 * @example
 * ```typescript
 * const token = extractToken(client);
 * if (!token) {
 *   throw createWsException('Missing authentication token', 'UNAUTHORIZED');
 * }
 * ```
 *
 * @remarks
 * Checks in order: Authorization header, handshake.auth.token, handshake.query.token
 * Query parameter method is less secure and should be avoided when possible.
 */
export declare function extractToken(client: Socket): string | null;
/**
 * Verifies and decodes JWT token for WebSocket authentication.
 * Attaches user data to socket for subsequent requests.
 *
 * @param {Socket} client - Socket.IO client instance
 * @param {JwtService} jwtService - NestJS JWT service instance
 * @returns {Promise<WsUser>} Decoded user data from token
 * @throws {WsException} If token is invalid or expired
 *
 * @example
 * ```typescript
 * async handleConnection(client: Socket) {
 *   try {
 *     const user = await authenticateSocket(client, this.jwtService);
 *     client.data.user = user;
 *     console.log(`User ${user.userId} connected`);
 *   } catch (error) {
 *     client.disconnect();
 *   }
 * }
 * ```
 */
export declare function authenticateSocket(client: Socket, jwtService: JwtService): Promise<WsUser>;
/**
 * Gets user data attached to socket from authentication.
 * Type-safe helper to retrieve authenticated user information.
 *
 * @param {Socket} client - Socket.IO client instance
 * @returns {WsUser | null} User data if authenticated, null otherwise
 *
 * @example
 * ```typescript
 * @SubscribeMessage('send-message')
 * handleMessage(client: Socket, payload: any) {
 *   const user = getSocketUser(client);
 *   if (!user) {
 *     throw createWsException('Not authenticated', 'UNAUTHORIZED');
 *   }
 *   console.log(`Message from ${user.userId}`);
 * }
 * ```
 */
export declare function getSocketUser(client: Socket): WsUser | null;
/**
 * Checks if socket client has required role(s) for authorization.
 * Supports single role or array of allowed roles.
 *
 * @param {Socket} client - Socket.IO client instance
 * @param {string | string[]} allowedRoles - Role(s) that are authorized
 * @returns {boolean} True if user has required role, false otherwise
 *
 * @example
 * ```typescript
 * @SubscribeMessage('admin-action')
 * handleAdminAction(client: Socket, payload: any) {
 *   if (!hasRole(client, ['admin', 'super_admin'])) {
 *     throw createWsException('Insufficient permissions', 'FORBIDDEN');
 *   }
 *   // Proceed with admin action
 * }
 * ```
 */
export declare function hasRole(client: Socket, allowedRoles: string | string[]): boolean;
/**
 * Gets all connected socket IDs from a server instance.
 * Useful for monitoring and debugging connection counts.
 *
 * @param {Server} server - Socket.IO server instance
 * @returns {Promise<string[]>} Array of connected socket IDs
 *
 * @example
 * ```typescript
 * const socketIds = await getAllConnectedSockets(this.server);
 * console.log(`Total connections: ${socketIds.length}`);
 * ```
 */
export declare function getAllConnectedSockets(server: Server): Promise<string[]>;
/**
 * Gets socket instance by ID from server.
 * Returns null if socket not found or disconnected.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} socketId - Socket ID to retrieve
 * @returns {Promise<Socket | null>} Socket instance or null
 *
 * @example
 * ```typescript
 * const socket = await getSocketById(this.server, 'abc123');
 * if (socket) {
 *   socket.emit('direct-message', { text: 'Hello!' });
 * }
 * ```
 */
export declare function getSocketById(server: Server, socketId: string): Promise<Socket | null>;
/**
 * Gets all sockets associated with a specific user ID.
 * Handles multiple concurrent connections from same user.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User ID to search for
 * @returns {Promise<Socket[]>} Array of user's socket connections
 *
 * @example
 * ```typescript
 * // Send notification to all user's devices
 * const userSockets = await getSocketsByUserId(this.server, 'user123');
 * userSockets.forEach(socket => {
 *   socket.emit('notification', { message: 'New appointment scheduled' });
 * });
 * ```
 */
export declare function getSocketsByUserId(server: Server, userId: string): Promise<Socket[]>;
/**
 * Disconnects all sockets for a specific user.
 * Useful for force logout or session invalidation.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User ID whose connections to disconnect
 * @param {string} [reason] - Optional disconnect reason
 * @returns {Promise<number>} Number of connections disconnected
 *
 * @example
 * ```typescript
 * // Force logout user from all devices
 * const count = await disconnectUserSockets(
 *   this.server,
 *   'user123',
 *   'Account security update'
 * );
 * console.log(`Disconnected ${count} sessions`);
 * ```
 */
export declare function disconnectUserSockets(server: Server, userId: string, reason?: string): Promise<number>;
/**
 * Gets total count of connected clients on server.
 * Efficient way to get connection count without fetching all sockets.
 *
 * @param {Server} server - Socket.IO server instance
 * @returns {Promise<number>} Number of connected clients
 *
 * @example
 * ```typescript
 * const count = await getConnectionCount(this.server);
 * if (count > 10000) {
 *   console.warn('High connection count, consider scaling');
 * }
 * ```
 */
export declare function getConnectionCount(server: Server): Promise<number>;
/**
 * Joins client to a room with validation and metadata tracking.
 * Provides type-safe room joining with optional capacity limits.
 *
 * @param {Socket} client - Socket.IO client to join room
 * @param {string} roomId - Room identifier to join
 * @param {RoomMetadata} [metadata] - Optional room metadata
 * @returns {Promise<void>}
 * @throws {WsException} If room is full or join fails
 *
 * @example
 * ```typescript
 * await joinRoom(client, 'emergency-room-1', {
 *   roomId: 'emergency-room-1',
 *   name: 'Emergency Department',
 *   type: 'emergency',
 *   createdAt: new Date(),
 *   maxClients: 50
 * });
 * ```
 */
export declare function joinRoom(client: Socket, roomId: string, metadata?: RoomMetadata): Promise<void>;
/**
 * Removes client from a room with cleanup.
 * Safely leaves room and optionally notifies other room members.
 *
 * @param {Socket} client - Socket.IO client to leave room
 * @param {string} roomId - Room identifier to leave
 * @param {boolean} [notify] - Whether to notify other room members
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await leaveRoom(client, 'chat-room-5', true);
 * // Other room members receive 'user-left' event
 * ```
 */
export declare function leaveRoom(client: Socket, roomId: string, notify?: boolean): Promise<void>;
/**
 * Gets number of clients currently in a room.
 * Useful for capacity checking and room monitoring.
 *
 * @param {Socket} client - Any socket instance (for accessing server)
 * @param {string} roomId - Room identifier to check
 * @returns {Promise<number>} Number of clients in room
 *
 * @example
 * ```typescript
 * const size = await getRoomSize(client, 'waiting-room');
 * if (size > 100) {
 *   console.warn(`Waiting room has ${size} clients`);
 * }
 * ```
 */
export declare function getRoomSize(client: Socket, roomId: string): Promise<number>;
/**
 * Gets all socket IDs in a specific room.
 * Returns array of socket IDs for room members.
 *
 * @param {Socket} client - Any socket instance (for accessing server)
 * @param {string} roomId - Room identifier
 * @returns {Promise<string[]>} Array of socket IDs in room
 *
 * @example
 * ```typescript
 * const members = await getRoomMembers(client, 'nurse-station-1');
 * console.log(`Room members: ${members.join(', ')}`);
 * ```
 */
export declare function getRoomMembers(client: Socket, roomId: string): Promise<string[]>;
/**
 * Broadcasts event to all room members except sender.
 * Type-safe room broadcasting with optional data validation.
 *
 * @param {Socket} client - Socket client sending the broadcast
 * @param {string} roomId - Room to broadcast to
 * @param {string} event - Event name to emit
 * @param {any} data - Data payload to send
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToRoom(client, 'chat-room-1', 'new-message', {
 *   senderId: user.userId,
 *   content: 'Hello everyone!',
 *   timestamp: new Date()
 * });
 * // All room members except sender receive the message
 * ```
 */
export declare function broadcastToRoom(client: Socket, roomId: string, event: string, data: any): void;
/**
 * Gets namespace instance from server by name.
 * Safely retrieves or creates namespace for organization.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} namespacePath - Namespace path (e.g., '/admin', '/notifications')
 * @returns {Namespace} Namespace instance
 *
 * @example
 * ```typescript
 * const adminNamespace = getNamespace(this.server, '/admin');
 * adminNamespace.emit('system-alert', { message: 'Server maintenance in 10 minutes' });
 * ```
 */
export declare function getNamespace(server: Server, namespacePath: string): Namespace;
/**
 * Broadcasts event to all clients in a namespace.
 * Sends message to every connected client in the namespace.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} namespacePath - Namespace path
 * @param {string} event - Event name to emit
 * @param {any} data - Data payload
 * @returns {void}
 *
 * @example
 * ```typescript
 * // Send emergency alert to all users in emergency namespace
 * broadcastToNamespace(
 *   this.server,
 *   '/emergency',
 *   'emergency-alert',
 *   { type: 'fire', location: 'Building A' }
 * );
 * ```
 */
export declare function broadcastToNamespace(server: Server, namespacePath: string, event: string, data: any): void;
/**
 * Gets count of connected clients in a namespace.
 * Useful for monitoring namespace usage.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} namespacePath - Namespace path
 * @returns {Promise<number>} Number of connected clients
 *
 * @example
 * ```typescript
 * const adminCount = await getNamespaceConnectionCount(this.server, '/admin');
 * console.log(`${adminCount} admins currently connected`);
 * ```
 */
export declare function getNamespaceConnectionCount(server: Server, namespacePath: string): Promise<number>;
/**
 * Validates user has specific permission for WebSocket action.
 * Checks user permissions array for required permission string.
 *
 * @param {Socket} client - Socket.IO client instance
 * @param {string} requiredPermission - Permission string required
 * @returns {boolean} True if user has permission
 *
 * @example
 * ```typescript
 * @SubscribeMessage('delete-record')
 * handleDelete(client: Socket, payload: any) {
 *   if (!hasPermission(client, 'records.delete')) {
 *     throw createWsException('Permission denied', 'FORBIDDEN');
 *   }
 *   // Proceed with deletion
 * }
 * ```
 */
export declare function hasPermission(client: Socket, requiredPermission: string): boolean;
/**
 * Validates user has at least one of the specified permissions.
 * OR-based permission checking for flexible authorization.
 *
 * @param {Socket} client - Socket.IO client instance
 * @param {string[]} requiredPermissions - Array of acceptable permissions
 * @returns {boolean} True if user has any of the permissions
 *
 * @example
 * ```typescript
 * if (!hasAnyPermission(client, ['records.read', 'records.admin'])) {
 *   throw createWsException('Insufficient permissions', 'FORBIDDEN');
 * }
 * ```
 */
export declare function hasAnyPermission(client: Socket, requiredPermissions: string[]): boolean;
/**
 * Validates user has all specified permissions.
 * AND-based permission checking for strict authorization.
 *
 * @param {Socket} client - Socket.IO client instance
 * @param {string[]} requiredPermissions - Array of required permissions
 * @returns {boolean} True if user has all permissions
 *
 * @example
 * ```typescript
 * if (!hasAllPermissions(client, ['phi.read', 'phi.export'])) {
 *   throw createWsException('Missing required permissions', 'FORBIDDEN');
 * }
 * ```
 */
export declare function hasAllPermissions(client: Socket, requiredPermissions: string[]): boolean;
/**
 * Stores authentication metadata for connection in Redis.
 * Enables distributed session tracking across multiple servers.
 *
 * @param {Redis} redis - Redis client instance
 * @param {string} socketId - Socket ID
 * @param {WsUser} user - User data to store
 * @param {number} [ttlSeconds] - Time to live in seconds (default: 3600)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * async handleConnection(client: Socket) {
 *   const user = await authenticateSocket(client, this.jwtService);
 *   await storeAuthMetadata(this.redis, client.id, user, 7200);
 * }
 * ```
 */
export declare function storeAuthMetadata(redis: Redis, socketId: string, user: WsUser, ttlSeconds?: number): Promise<void>;
/**
 * Retrieves authentication metadata from Redis.
 * Fetches stored user data for socket validation.
 *
 * @param {Redis} redis - Redis client instance
 * @param {string} socketId - Socket ID to lookup
 * @returns {Promise<WsUser | null>} User data or null if not found
 *
 * @example
 * ```typescript
 * const user = await getAuthMetadata(this.redis, client.id);
 * if (!user) {
 *   client.disconnect();
 * }
 * ```
 */
export declare function getAuthMetadata(redis: Redis, socketId: string): Promise<WsUser | null>;
/**
 * Validates WebSocket message payload against schema.
 * Performs basic validation for required fields and types.
 *
 * @param {any} payload - Message payload to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {MessageValidationResult} Validation result with errors if any
 *
 * @example
 * ```typescript
 * @SubscribeMessage('send-message')
 * handleMessage(client: Socket, payload: any) {
 *   const validation = validateMessagePayload(payload, ['roomId', 'content']);
 *   if (!validation.isValid) {
 *     throw createWsException('Invalid message', 'VALIDATION_ERROR', {
 *       errors: validation.errors
 *     });
 *   }
 * }
 * ```
 */
export declare function validateMessagePayload(payload: any, requiredFields: string[]): MessageValidationResult;
/**
 * Sanitizes message content to prevent XSS and injection attacks.
 * Removes potentially dangerous HTML/script content.
 *
 * @param {string} content - Message content to sanitize
 * @param {number} [maxLength] - Maximum allowed length (default: 5000)
 * @returns {string} Sanitized content
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeMessageContent(payload.content, 1000);
 * const message = {
 *   content: sanitized,
 *   senderId: user.userId,
 *   timestamp: new Date()
 * };
 * ```
 *
 * @remarks
 * This is a basic sanitizer. For production, use a library like DOMPurify or validator.js
 */
export declare function sanitizeMessageContent(content: string, maxLength?: number): string;
/**
 * Validates and transforms incoming WebSocket event data.
 * Combines validation and sanitization in one step.
 *
 * @param {any} data - Raw event data
 * @param {string[]} requiredFields - Required field names
 * @param {Record<string, (value: any) => any>} [transformers] - Field transformers
 * @returns {MessageValidationResult} Validation result with transformed data
 *
 * @example
 * ```typescript
 * const result = validateAndTransformEvent(payload, ['content', 'roomId'], {
 *   content: (val) => sanitizeMessageContent(val, 2000),
 *   timestamp: (val) => new Date(val)
 * });
 * if (!result.isValid) {
 *   throw createWsException('Validation failed', 'VALIDATION_ERROR');
 * }
 * ```
 */
export declare function validateAndTransformEvent(data: any, requiredFields: string[], transformers?: Record<string, (value: any) => any>): MessageValidationResult;
/**
 * Validates message size to prevent DoS attacks.
 * Checks payload size against configured limits.
 *
 * @param {any} payload - Message payload to check
 * @param {number} maxSizeBytes - Maximum allowed size in bytes (default: 10KB)
 * @returns {boolean} True if payload size is acceptable
 *
 * @example
 * ```typescript
 * if (!validateMessageSize(payload, 5120)) { // 5KB limit
 *   throw createWsException('Message too large', 'PAYLOAD_TOO_LARGE');
 * }
 * ```
 */
export declare function validateMessageSize(payload: any, maxSizeBytes?: number): boolean;
/**
 * Emits event to specific user across all their connections.
 * Ensures user receives event on all devices they're connected from.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User ID to send event to
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {Promise<number>} Number of sockets message was sent to
 *
 * @example
 * ```typescript
 * // Send appointment reminder to user on all devices
 * await emitToUser(this.server, 'user123', 'appointment-reminder', {
 *   appointmentId: 'apt456',
 *   time: '2024-01-15T10:00:00Z',
 *   message: 'Appointment in 15 minutes'
 * });
 * ```
 */
export declare function emitToUser(server: Server, userId: string, event: string, data: any): Promise<number>;
/**
 * Emits event to all sockets in multiple rooms.
 * Batch room broadcasting for efficiency.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string[]} roomIds - Array of room IDs
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * // Broadcast to multiple nurse stations
 * emitToRooms(
 *   this.server,
 *   ['nurse-station-1', 'nurse-station-2'],
 *   'emergency-alert',
 *   { patient: 'John Doe', room: '203', urgency: 'high' }
 * );
 * ```
 */
export declare function emitToRooms(server: Server, roomIds: string[], event: string, data: any): void;
/**
 * Emits event with acknowledgement callback support.
 * Waits for client acknowledgement with timeout.
 *
 * @param {Socket} client - Socket.IO client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {number} [timeoutMs] - Acknowledgement timeout in milliseconds (default: 5000)
 * @returns {Promise<any>} Acknowledgement response from client
 * @throws {Error} If acknowledgement times out
 *
 * @example
 * ```typescript
 * try {
 *   const ack = await emitWithAck(client, 'request-data', { type: 'profile' }, 3000);
 *   console.log('Client acknowledged:', ack);
 * } catch (error) {
 *   console.error('Client did not acknowledge in time');
 * }
 * ```
 */
export declare function emitWithAck(client: Socket, event: string, data: any, timeoutMs?: number): Promise<any>;
/**
 * Broadcasts event to all connected clients globally.
 * Use sparingly for critical system-wide notifications.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * // System maintenance notification to all users
 * broadcastGlobally(this.server, 'system-notification', {
 *   type: 'maintenance',
 *   message: 'System will be down for maintenance in 5 minutes',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare function broadcastGlobally(server: Server, event: string, data: any): void;
/**
 * Broadcasts to room with optional exclusions.
 * Sends event to room members while excluding specific socket IDs.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} roomId - Room ID to broadcast to
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {string[]} [excludeSocketIds] - Socket IDs to exclude from broadcast
 * @returns {void}
 *
 * @example
 * ```typescript
 * // Broadcast to room but exclude the sender and another socket
 * broadcastToRoomExcept(
 *   this.server,
 *   'chat-room-1',
 *   'typing-indicator',
 *   { userId: user.userId, isTyping: true },
 *   [client.id, 'another-socket-id']
 * );
 * ```
 */
export declare function broadcastToRoomExcept(server: Server, roomId: string, event: string, data: any, excludeSocketIds?: string[]): void;
/**
 * Broadcasts to users with specific roles.
 * Role-based broadcasting for targeted notifications.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string | string[]} roles - Role(s) to broadcast to
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {Promise<number>} Number of users message was sent to
 *
 * @example
 * ```typescript
 * // Send alert to all nurses
 * await broadcastToRole(
 *   this.server,
 *   'nurse',
 *   'patient-alert',
 *   { patientId: 'p123', status: 'critical', room: '405' }
 * );
 * ```
 */
export declare function broadcastToRole(server: Server, roles: string | string[], event: string, data: any): Promise<number>;
/**
 * Broadcasts with priority levels (immediate vs. queued).
 * High priority messages bypass queue for critical alerts.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} target - Room ID or 'global'
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {'high' | 'normal' | 'low'} [priority] - Message priority (default: 'normal')
 * @returns {void}
 *
 * @example
 * ```typescript
 * // Send critical emergency alert immediately
 * broadcastWithPriority(
 *   this.server,
 *   'emergency-channel',
 *   'code-blue',
 *   { location: 'ICU-3', patient: 'Anonymous' },
 *   'high'
 * );
 * ```
 *
 * @remarks
 * High priority messages are sent immediately. Normal/low priority can be queued
 * for batch processing in high-traffic scenarios.
 */
export declare function broadcastWithPriority(server: Server, target: string, event: string, data: any, priority?: 'high' | 'normal' | 'low'): void;
/**
 * Broadcasts to specific namespace with compression.
 * Optimizes bandwidth for large payloads in namespace.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} namespacePath - Namespace path
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {boolean} [compress] - Enable compression (default: true)
 * @returns {void}
 *
 * @example
 * ```typescript
 * // Send large report data with compression
 * broadcastToNamespaceCompressed(
 *   this.server,
 *   '/reports',
 *   'monthly-report',
 *   largeReportData,
 *   true
 * );
 * ```
 */
export declare function broadcastToNamespaceCompressed(server: Server, namespacePath: string, event: string, data: any, compress?: boolean): void;
/**
 * Tracks client connection metadata in Redis.
 * Stores connection information for monitoring and analytics.
 *
 * @param {Redis} redis - Redis client instance
 * @param {string} socketId - Socket ID
 * @param {ConnectionMetadata} metadata - Connection metadata
 * @param {number} [ttlSeconds] - Time to live in seconds (default: 86400 - 24 hours)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackConnection(this.redis, client.id, {
 *   socketId: client.id,
 *   userId: user.userId,
 *   connectedAt: new Date(),
 *   lastActivity: new Date(),
 *   userAgent: client.handshake.headers['user-agent'],
 *   ipAddress: client.handshake.address
 * });
 * ```
 */
export declare function trackConnection(redis: Redis, socketId: string, metadata: ConnectionMetadata, ttlSeconds?: number): Promise<void>;
/**
 * Updates last activity timestamp for connection.
 * Tracks user activity for timeout and monitoring.
 *
 * @param {Redis} redis - Redis client instance
 * @param {string} socketId - Socket ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * @SubscribeMessage('*')
 * async handleAnyMessage(client: Socket, payload: any) {
 *   await updateLastActivity(this.redis, client.id);
 *   // Process message...
 * }
 * ```
 */
export declare function updateLastActivity(redis: Redis, socketId: string): Promise<void>;
/**
 * Gets all active connections for a user from Redis.
 * Retrieves connection metadata across distributed system.
 *
 * @param {Redis} redis - Redis client instance
 * @param {string} userId - User ID
 * @returns {Promise<ConnectionMetadata[]>} Array of connection metadata
 *
 * @example
 * ```typescript
 * const connections = await getUserConnections(this.redis, 'user123');
 * console.log(`User has ${connections.length} active connections`);
 * connections.forEach(conn => {
 *   console.log(`Device: ${conn.userAgent}, Last active: ${conn.lastActivity}`);
 * });
 * ```
 */
export declare function getUserConnections(redis: Redis, userId: string): Promise<ConnectionMetadata[]>;
/**
 * Creates standardized error response for WebSocket events.
 * Provides consistent error format across all WebSocket communications.
 *
 * @param {Error | WsException | string} error - Error to format
 * @param {string} [context] - Optional context for debugging
 * @returns {object} Formatted error object
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation
 * } catch (error) {
 *   client.emit('error', formatWsError(error, 'send-message'));
 * }
 * ```
 */
export declare function formatWsError(error: Error | WsException | string, context?: string): object;
/**
 * Handles and logs WebSocket errors with audit trail.
 * Logs errors and optionally sends to monitoring service.
 *
 * @param {Error} error - Error to handle
 * @param {Socket} client - Socket client
 * @param {string} event - Event name where error occurred
 * @param {any} [payload] - Optional payload that caused error
 * @returns {void}
 *
 * @example
 * ```typescript
 * @SubscribeMessage('send-message')
 * handleMessage(client: Socket, payload: any) {
 *   try {
 *     // Process message
 *   } catch (error) {
 *     handleWsError(error, client, 'send-message', payload);
 *     throw createWsException('Message processing failed');
 *   }
 * }
 * ```
 *
 * @remarks
 * In production, integrate with your logging service (e.g., Winston, Sentry)
 */
export declare function handleWsError(error: Error, client: Socket, event: string, payload?: any): void;
/**
 * Creates success response with standardized format.
 * Consistent success responses for WebSocket events.
 *
 * @param {any} data - Response data
 * @param {string} [message] - Optional success message
 * @returns {object} Formatted success response
 *
 * @example
 * ```typescript
 * @SubscribeMessage('create-record')
 * async handleCreate(client: Socket, payload: any) {
 *   const record = await this.service.create(payload);
 *   return formatWsSuccess(record, 'Record created successfully');
 * }
 * ```
 */
export declare function formatWsSuccess(data: any, message?: string): object;
/**
 * Implements heartbeat mechanism for connection health monitoring.
 * Automatically disconnects clients that fail to respond to heartbeats.
 *
 * @param {Socket} client - Socket.IO client
 * @param {HeartbeatConfig} config - Heartbeat configuration
 * @returns {NodeJS.Timer} Interval timer (store to clear on disconnect)
 *
 * @example
 * ```typescript
 * handleConnection(client: Socket) {
 *   const heartbeatTimer = setupHeartbeat(client, {
 *     intervalMs: 30000,  // Send ping every 30 seconds
 *     timeoutMs: 5000,    // Wait 5 seconds for pong
 *     maxMissed: 3        // Disconnect after 3 missed pongs
 *   });
 *
 *   client.on('disconnect', () => clearInterval(heartbeatTimer));
 * }
 * ```
 */
export declare function setupHeartbeat(client: Socket, config: HeartbeatConfig): NodeJS.Timer;
/**
 * Calculates round-trip time (RTT) for WebSocket connection.
 * Measures latency between server and client.
 *
 * @param {Socket} client - Socket.IO client
 * @returns {Promise<number>} Round-trip time in milliseconds
 *
 * @example
 * ```typescript
 * @SubscribeMessage('check-latency')
 * async handleLatencyCheck(client: Socket) {
 *   const rtt = await measureRTT(client);
 *   return { rtt, quality: rtt < 100 ? 'excellent' : rtt < 300 ? 'good' : 'poor' };
 * }
 * ```
 */
export declare function measureRTT(client: Socket): Promise<number>;
/**
 * Handles client reconnection with session restoration.
 * Restores user's previous state when reconnecting.
 *
 * @param {Redis} redis - Redis client for session storage
 * @param {Socket} client - Socket.IO client
 * @param {string} previousSocketId - Previous socket ID before disconnect
 * @returns {Promise<boolean>} True if session restored successfully
 *
 * @example
 * ```typescript
 * handleConnection(client: Socket) {
 *   const prevSocketId = client.handshake.auth.previousSocketId;
 *
 *   if (prevSocketId) {
 *     const restored = await handleReconnection(this.redis, client, prevSocketId);
 *     if (restored) {
 *       client.emit('session-restored', { message: 'Welcome back!' });
 *     }
 *   }
 * }
 * ```
 */
export declare function handleReconnection(redis: Redis, client: Socket, previousSocketId: string): Promise<boolean>;
/**
 * Stores client session data for reconnection recovery.
 * Persists session state to enable seamless reconnection.
 *
 * @param {Redis} redis - Redis client
 * @param {Socket} client - Socket.IO client
 * @param {number} [ttlSeconds] - Time to live for session (default: 3600)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * @SubscribeMessage('room:join')
 * async handleJoinRoom(client: Socket, roomId: string) {
 *   await client.join(roomId);
 *
 *   // Store updated session
 *   await storeClientSession(this.redis, client);
 * }
 * ```
 */
export declare function storeClientSession(redis: Redis, client: Socket, ttlSeconds?: number): Promise<void>;
/**
 * Queues message for offline user delivery.
 * Stores messages in Redis for delivery when user reconnects.
 *
 * @param {Redis} redis - Redis client
 * @param {string} userId - User ID to queue message for
 * @param {QueuedMessage} message - Message to queue
 * @param {number} [ttlSeconds] - Queue retention time (default: 604800 - 7 days)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * async sendNotification(userId: string, notification: any) {
 *   const userSockets = await getSocketsByUserId(this.server, userId);
 *
 *   if (userSockets.length === 0) {
 *     // User offline, queue message
 *     await queueMessageForUser(this.redis, userId, {
 *       id: generateId(),
 *       event: 'notification',
 *       data: notification,
 *       timestamp: new Date(),
 *       retryCount: 0,
 *       userId
 *     });
 *   } else {
 *     // User online, send immediately
 *     userSockets.forEach(socket => socket.emit('notification', notification));
 *   }
 * }
 * ```
 */
export declare function queueMessageForUser(redis: Redis, userId: string, message: QueuedMessage, ttlSeconds?: number): Promise<void>;
/**
 * Retrieves and delivers queued messages to reconnected user.
 * Sends all pending messages when user comes online.
 *
 * @param {Redis} redis - Redis client
 * @param {Socket} client - Socket.IO client
 * @param {string} userId - User ID
 * @param {boolean} [removeAfterDelivery] - Remove messages after delivery (default: true)
 * @returns {Promise<number>} Number of messages delivered
 *
 * @example
 * ```typescript
 * async handleConnection(client: Socket) {
 *   const user = await authenticateSocket(client, this.jwtService);
 *   client.data.user = user;
 *
 *   // Deliver queued messages
 *   const deliveredCount = await deliverQueuedMessages(this.redis, client, user.userId);
 *   if (deliveredCount > 0) {
 *     console.log(`Delivered ${deliveredCount} queued messages to ${user.userId}`);
 *   }
 * }
 * ```
 */
export declare function deliverQueuedMessages(redis: Redis, client: Socket, userId: string, removeAfterDelivery?: boolean): Promise<number>;
/**
 * Implements rate limiting for WebSocket events.
 * Prevents spam and DoS attacks by limiting message frequency.
 *
 * @param {Redis} redis - Redis client
 * @param {string} identifier - Client identifier (socketId or userId)
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Promise<boolean>} True if request is allowed, false if rate limited
 *
 * @example
 * ```typescript
 * @SubscribeMessage('send-message')
 * async handleMessage(client: Socket, payload: any) {
 *   const allowed = await checkRateLimit(this.redis, client.id, {
 *     maxMessages: 10,
 *     windowMs: 60000,  // 10 messages per minute
 *     blockDurationMs: 300000  // Block for 5 minutes if exceeded
 *   });
 *
 *   if (!allowed) {
 *     throw createWsException('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED');
 *   }
 *
 *   // Process message...
 * }
 * ```
 */
export declare function checkRateLimit(redis: Redis, identifier: string, config: RateLimitConfig): Promise<boolean>;
/**
 * Gets current rate limit status for identifier.
 * Returns remaining requests and reset time.
 *
 * @param {Redis} redis - Redis client
 * @param {string} identifier - Client identifier
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Promise<{ remaining: number; resetAt: Date; isBlocked: boolean }>} Rate limit status
 *
 * @example
 * ```typescript
 * @SubscribeMessage('check-rate-limit')
 * async handleCheckRateLimit(client: Socket) {
 *   const status = await getRateLimitStatus(this.redis, client.id, {
 *     maxMessages: 10,
 *     windowMs: 60000
 *   });
 *
 *   return {
 *     remaining: status.remaining,
 *     resetAt: status.resetAt,
 *     blocked: status.isBlocked
 *   };
 * }
 * ```
 */
export declare function getRateLimitStatus(redis: Redis, identifier: string, config: RateLimitConfig): Promise<{
    remaining: number;
    resetAt: Date;
    isBlocked: boolean;
}>;
/**
 * Creates mock Socket.IO client for testing.
 * Generates test socket with configurable properties.
 *
 * @param {Partial<Socket>} [overrides] - Optional socket property overrides
 * @returns {Partial<Socket>} Mock socket instance for testing
 *
 * @example
 * ```typescript
 * describe('ChatGateway', () => {
 *   it('should handle message event', async () => {
 *     const mockClient = createMockSocket({
 *       id: 'test-socket-123',
 *       data: {
 *         user: { userId: 'user123', role: 'nurse' }
 *       }
 *     });
 *
 *     const result = await gateway.handleMessage(
 *       mockClient as Socket,
 *       { content: 'Test message' }
 *     );
 *
 *     expect(result.success).toBe(true);
 *   });
 * });
 * ```
 *
 * @remarks
 * For full integration testing, use actual Socket.IO client library.
 * This is primarily for unit testing gateway methods.
 */
export declare function createMockSocket(overrides?: Partial<Socket>): Partial<Socket>;
declare const _default: {
    createWsException: typeof createWsException;
    extractToken: typeof extractToken;
    authenticateSocket: typeof authenticateSocket;
    getSocketUser: typeof getSocketUser;
    hasRole: typeof hasRole;
    getAllConnectedSockets: typeof getAllConnectedSockets;
    getSocketById: typeof getSocketById;
    getSocketsByUserId: typeof getSocketsByUserId;
    disconnectUserSockets: typeof disconnectUserSockets;
    getConnectionCount: typeof getConnectionCount;
    joinRoom: typeof joinRoom;
    leaveRoom: typeof leaveRoom;
    getRoomSize: typeof getRoomSize;
    getRoomMembers: typeof getRoomMembers;
    broadcastToRoom: typeof broadcastToRoom;
    getNamespace: typeof getNamespace;
    broadcastToNamespace: typeof broadcastToNamespace;
    getNamespaceConnectionCount: typeof getNamespaceConnectionCount;
    hasPermission: typeof hasPermission;
    hasAnyPermission: typeof hasAnyPermission;
    hasAllPermissions: typeof hasAllPermissions;
    storeAuthMetadata: typeof storeAuthMetadata;
    getAuthMetadata: typeof getAuthMetadata;
    validateMessagePayload: typeof validateMessagePayload;
    sanitizeMessageContent: typeof sanitizeMessageContent;
    validateAndTransformEvent: typeof validateAndTransformEvent;
    validateMessageSize: typeof validateMessageSize;
    emitToUser: typeof emitToUser;
    emitToRooms: typeof emitToRooms;
    emitWithAck: typeof emitWithAck;
    broadcastGlobally: typeof broadcastGlobally;
    broadcastToRoomExcept: typeof broadcastToRoomExcept;
    broadcastToRole: typeof broadcastToRole;
    broadcastWithPriority: typeof broadcastWithPriority;
    broadcastToNamespaceCompressed: typeof broadcastToNamespaceCompressed;
    trackConnection: typeof trackConnection;
    updateLastActivity: typeof updateLastActivity;
    getUserConnections: typeof getUserConnections;
    formatWsError: typeof formatWsError;
    handleWsError: typeof handleWsError;
    formatWsSuccess: typeof formatWsSuccess;
    setupHeartbeat: typeof setupHeartbeat;
    measureRTT: typeof measureRTT;
    handleReconnection: typeof handleReconnection;
    storeClientSession: typeof storeClientSession;
    queueMessageForUser: typeof queueMessageForUser;
    deliverQueuedMessages: typeof deliverQueuedMessages;
    checkRateLimit: typeof checkRateLimit;
    getRateLimitStatus: typeof getRateLimitStatus;
    createMockSocket: typeof createMockSocket;
};
export default _default;
//# sourceMappingURL=nest-websockets-utils.d.ts.map