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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// 1. WEBSOCKET GATEWAY DECORATORS & HELPERS (5 functions)
// ============================================================================

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
export function createWsException(
  message: string,
  code?: string,
  metadata?: any,
): WsException {
  const error = {
    message,
    code: code || 'WS_ERROR',
    timestamp: new Date().toISOString(),
    ...(metadata && { metadata }),
  };
  return new WsException(error);
}

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
export function extractToken(client: Socket): string | null {
  // Try Authorization header
  const authHeader = client.handshake.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try auth object (recommended)
  if (client.handshake.auth?.token) {
    return client.handshake.auth.token as string;
  }

  // Try query parameter (fallback, less secure)
  if (client.handshake.query?.token) {
    return client.handshake.query.token as string;
  }

  return null;
}

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
export async function authenticateSocket(
  client: Socket,
  jwtService: JwtService,
): Promise<WsUser> {
  const token = extractToken(client);

  if (!token) {
    throw createWsException('Missing authentication token', 'UNAUTHORIZED');
  }

  try {
    const payload = await jwtService.verifyAsync(token);
    return {
      userId: payload.sub || payload.userId,
      role: payload.role,
      email: payload.email,
      permissions: payload.permissions,
    };
  } catch (error) {
    throw createWsException('Invalid or expired token', 'UNAUTHORIZED');
  }
}

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
export function getSocketUser(client: Socket): WsUser | null {
  return client.data?.user || null;
}

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
export function hasRole(
  client: Socket,
  allowedRoles: string | string[],
): boolean {
  const user = getSocketUser(client);
  if (!user) return false;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
}

// ============================================================================
// 2. SOCKET.IO CONNECTION HELPERS (5 functions)
// ============================================================================

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
export async function getAllConnectedSockets(
  server: Server,
): Promise<string[]> {
  const sockets = await server.fetchSockets();
  return sockets.map((socket) => socket.id);
}

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
export async function getSocketById(
  server: Server,
  socketId: string,
): Promise<Socket | null> {
  const sockets = await server.fetchSockets();
  return sockets.find((socket) => socket.id === socketId) || null;
}

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
export async function getSocketsByUserId(
  server: Server,
  userId: string,
): Promise<Socket[]> {
  const sockets = await server.fetchSockets();
  return sockets.filter((socket) => socket.data?.user?.userId === userId);
}

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
export async function disconnectUserSockets(
  server: Server,
  userId: string,
  reason?: string,
): Promise<number> {
  const userSockets = await getSocketsByUserId(server, userId);
  userSockets.forEach((socket) => {
    socket.disconnect(true);
    if (reason) {
      socket.emit('disconnect-reason', { reason });
    }
  });
  return userSockets.length;
}

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
export async function getConnectionCount(server: Server): Promise<number> {
  const sockets = await server.fetchSockets();
  return sockets.length;
}

// ============================================================================
// 3. ROOM MANAGEMENT UTILITIES (5 functions)
// ============================================================================

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
export async function joinRoom(
  client: Socket,
  roomId: string,
  metadata?: RoomMetadata,
): Promise<void> {
  // Check room capacity if metadata provided
  if (metadata?.maxClients) {
    const roomSize = await getRoomSize(client, roomId);
    if (roomSize >= metadata.maxClients) {
      throw createWsException('Room is full', 'ROOM_FULL', { roomId });
    }
  }

  await client.join(roomId);
}

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
export async function leaveRoom(
  client: Socket,
  roomId: string,
  notify = false,
): Promise<void> {
  if (notify) {
    const user = getSocketUser(client);
    client.to(roomId).emit('user-left', {
      userId: user?.userId,
      roomId,
      timestamp: new Date(),
    });
  }

  await client.leave(roomId);
}

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
export async function getRoomSize(
  client: Socket,
  roomId: string,
): Promise<number> {
  const sockets = await client.to(roomId).fetchSockets();
  return sockets.length;
}

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
export async function getRoomMembers(
  client: Socket,
  roomId: string,
): Promise<string[]> {
  const sockets = await client.to(roomId).fetchSockets();
  return sockets.map((socket) => socket.id);
}

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
export function broadcastToRoom(
  client: Socket,
  roomId: string,
  event: string,
  data: any,
): void {
  client.to(roomId).emit(event, data);
}

// ============================================================================
// 4. NAMESPACE UTILITIES (3 functions)
// ============================================================================

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
export function getNamespace(server: Server, namespacePath: string): Namespace {
  return server.of(namespacePath);
}

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
export function broadcastToNamespace(
  server: Server,
  namespacePath: string,
  event: string,
  data: any,
): void {
  const namespace = getNamespace(server, namespacePath);
  namespace.emit(event, data);
}

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
export async function getNamespaceConnectionCount(
  server: Server,
  namespacePath: string,
): Promise<number> {
  const namespace = getNamespace(server, namespacePath);
  const sockets = await namespace.fetchSockets();
  return sockets.length;
}

// ============================================================================
// 5. AUTHENTICATION & AUTHORIZATION (5 functions)
// ============================================================================

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
export function hasPermission(
  client: Socket,
  requiredPermission: string,
): boolean {
  const user = getSocketUser(client);
  if (!user?.permissions) return false;
  return user.permissions.includes(requiredPermission);
}

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
export function hasAnyPermission(
  client: Socket,
  requiredPermissions: string[],
): boolean {
  const user = getSocketUser(client);
  if (!user?.permissions) return false;
  return requiredPermissions.some((perm) => user.permissions?.includes(perm));
}

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
export function hasAllPermissions(
  client: Socket,
  requiredPermissions: string[],
): boolean {
  const user = getSocketUser(client);
  if (!user?.permissions) return false;
  return requiredPermissions.every((perm) => user.permissions?.includes(perm));
}

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
export async function storeAuthMetadata(
  redis: Redis,
  socketId: string,
  user: WsUser,
  ttlSeconds = 3600,
): Promise<void> {
  const key = `ws:auth:${socketId}`;
  await redis.setex(key, ttlSeconds, JSON.stringify(user));
}

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
export async function getAuthMetadata(
  redis: Redis,
  socketId: string,
): Promise<WsUser | null> {
  const key = `ws:auth:${socketId}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

// ============================================================================
// 6. MESSAGE VALIDATION & TRANSFORMATION (4 functions)
// ============================================================================

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
export function validateMessagePayload(
  payload: any,
  requiredFields: string[],
): MessageValidationResult {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return { isValid: false, errors: ['Payload must be an object'] };
  }

  for (const field of requiredFields) {
    if (!(field in payload) || payload[field] === null || payload[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    sanitizedData: payload,
  };
}

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
export function sanitizeMessageContent(
  content: string,
  maxLength = 5000,
): string {
  if (typeof content !== 'string') return '';

  // Remove HTML tags
  let sanitized = content.replace(/<[^>]*>/g, '');

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Trim whitespace
  return sanitized.trim();
}

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
export function validateAndTransformEvent(
  data: any,
  requiredFields: string[],
  transformers?: Record<string, (value: any) => any>,
): MessageValidationResult {
  const validation = validateMessagePayload(data, requiredFields);

  if (!validation.isValid) {
    return validation;
  }

  const transformed = { ...data };

  if (transformers) {
    for (const [field, transformer] of Object.entries(transformers)) {
      if (field in transformed) {
        try {
          transformed[field] = transformer(transformed[field]);
        } catch (error) {
          return {
            isValid: false,
            errors: [`Failed to transform field: ${field}`],
          };
        }
      }
    }
  }

  return {
    isValid: true,
    sanitizedData: transformed,
  };
}

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
export function validateMessageSize(
  payload: any,
  maxSizeBytes = 10240,
): boolean {
  const size = JSON.stringify(payload).length;
  return size <= maxSizeBytes;
}

// ============================================================================
// 7. EVENT EMITTER UTILITIES (4 functions)
// ============================================================================

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
export async function emitToUser(
  server: Server,
  userId: string,
  event: string,
  data: any,
): Promise<number> {
  const userSockets = await getSocketsByUserId(server, userId);
  userSockets.forEach((socket) => {
    socket.emit(event, data);
  });
  return userSockets.length;
}

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
export function emitToRooms(
  server: Server,
  roomIds: string[],
  event: string,
  data: any,
): void {
  roomIds.forEach((roomId) => {
    server.to(roomId).emit(event, data);
  });
}

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
export async function emitWithAck(
  client: Socket,
  event: string,
  data: any,
  timeoutMs = 5000,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Acknowledgement timeout'));
    }, timeoutMs);

    client.emit(event, data, (response: any) => {
      clearTimeout(timeout);
      resolve(response);
    });
  });
}

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
export function broadcastGlobally(
  server: Server,
  event: string,
  data: any,
): void {
  server.emit(event, data);
}

// ============================================================================
// 8. BROADCASTING HELPERS (4 functions)
// ============================================================================

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
export function broadcastToRoomExcept(
  server: Server,
  roomId: string,
  event: string,
  data: any,
  excludeSocketIds?: string[],
): void {
  if (!excludeSocketIds || excludeSocketIds.length === 0) {
    server.to(roomId).emit(event, data);
    return;
  }

  server.to(roomId).except(excludeSocketIds).emit(event, data);
}

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
export async function broadcastToRole(
  server: Server,
  roles: string | string[],
  event: string,
  data: any,
): Promise<number> {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  const sockets = await server.fetchSockets();
  let count = 0;

  sockets.forEach((socket) => {
    const user = socket.data?.user as WsUser | undefined;
    if (user && roleArray.includes(user.role)) {
      socket.emit(event, data);
      count++;
    }
  });

  return count;
}

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
export function broadcastWithPriority(
  server: Server,
  target: string,
  event: string,
  data: any,
  priority: 'high' | 'normal' | 'low' = 'normal',
): void {
  const payload = {
    ...data,
    priority,
    timestamp: new Date(),
  };

  if (target === 'global') {
    server.emit(event, payload);
  } else {
    server.to(target).emit(event, payload);
  }
}

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
export function broadcastToNamespaceCompressed(
  server: Server,
  namespacePath: string,
  event: string,
  data: any,
  compress = true,
): void {
  const namespace = getNamespace(server, namespacePath);

  if (compress) {
    namespace.compress(true).emit(event, data);
  } else {
    namespace.emit(event, data);
  }
}

// ============================================================================
// 9. CLIENT TRACKING UTILITIES (3 functions)
// ============================================================================

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
export async function trackConnection(
  redis: Redis,
  socketId: string,
  metadata: ConnectionMetadata,
  ttlSeconds = 86400,
): Promise<void> {
  const key = `ws:connection:${socketId}`;
  await redis.setex(key, ttlSeconds, JSON.stringify(metadata));

  // Also add to user's active connections set
  if (metadata.userId) {
    const userConnectionsKey = `ws:user-connections:${metadata.userId}`;
    await redis.sadd(userConnectionsKey, socketId);
    await redis.expire(userConnectionsKey, ttlSeconds);
  }
}

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
export async function updateLastActivity(
  redis: Redis,
  socketId: string,
): Promise<void> {
  const key = `ws:connection:${socketId}`;
  const data = await redis.get(key);

  if (data) {
    const metadata = JSON.parse(data) as ConnectionMetadata;
    metadata.lastActivity = new Date();
    await redis.set(key, JSON.stringify(metadata));
  }
}

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
export async function getUserConnections(
  redis: Redis,
  userId: string,
): Promise<ConnectionMetadata[]> {
  const userConnectionsKey = `ws:user-connections:${userId}`;
  const socketIds = await redis.smembers(userConnectionsKey);

  const connections: ConnectionMetadata[] = [];

  for (const socketId of socketIds) {
    const key = `ws:connection:${socketId}`;
    const data = await redis.get(key);
    if (data) {
      connections.push(JSON.parse(data));
    }
  }

  return connections;
}

// ============================================================================
// 10. ERROR HANDLING (3 functions)
// ============================================================================

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
export function formatWsError(
  error: Error | WsException | string,
  context?: string,
): object {
  if (typeof error === 'string') {
    return {
      success: false,
      error: {
        message: error,
        code: 'ERROR',
        context,
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (error instanceof WsException) {
    const wsError = error.getError();
    return {
      success: false,
      error: {
        ...(typeof wsError === 'string' ? { message: wsError } : wsError),
        context,
        timestamp: new Date().toISOString(),
      },
    };
  }

  return {
    success: false,
    error: {
      message: error.message || 'An error occurred',
      code: 'INTERNAL_ERROR',
      context,
      timestamp: new Date().toISOString(),
    },
  };
}

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
export function handleWsError(
  error: Error,
  client: Socket,
  event: string,
  payload?: any,
): void {
  const user = getSocketUser(client);

  console.error('WebSocket Error:', {
    event,
    socketId: client.id,
    userId: user?.userId,
    error: error.message,
    stack: error.stack,
    payload: payload ? JSON.stringify(payload).substring(0, 200) : undefined,
    timestamp: new Date().toISOString(),
  });

  // In production, send to monitoring service
  // monitoringService.captureException(error, { socketId, userId, event });
}

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
export function formatWsSuccess(data: any, message?: string): object {
  return {
    success: true,
    data,
    ...(message && { message }),
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// 11. HEARTBEAT/PING UTILITIES (2 functions)
// ============================================================================

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
export function setupHeartbeat(
  client: Socket,
  config: HeartbeatConfig,
): NodeJS.Timer {
  let missedHeartbeats = 0;

  const interval = setInterval(() => {
    if (missedHeartbeats >= config.maxMissed) {
      console.warn(`Client ${client.id} missed ${missedHeartbeats} heartbeats, disconnecting`);
      client.disconnect(true);
      clearInterval(interval);
      return;
    }

    // Send ping
    client.emit('ping', { timestamp: Date.now() });

    // Set timeout for pong
    const pongTimeout = setTimeout(() => {
      missedHeartbeats++;
    }, config.timeoutMs);

    // Listen for pong
    const pongHandler = () => {
      missedHeartbeats = 0;
      clearTimeout(pongTimeout);
      client.off('pong', pongHandler);
    };

    client.once('pong', pongHandler);
  }, config.intervalMs);

  return interval;
}

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
export async function measureRTT(client: Socket): Promise<number> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('RTT measurement timeout'));
    }, 5000);

    client.emit('ping', { timestamp: startTime }, () => {
      clearTimeout(timeout);
      const rtt = Date.now() - startTime;
      resolve(rtt);
    });
  });
}

// ============================================================================
// 12. RECONNECTION LOGIC (2 functions)
// ============================================================================

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
export async function handleReconnection(
  redis: Redis,
  client: Socket,
  previousSocketId: string,
): Promise<boolean> {
  try {
    // Retrieve previous session data
    const sessionKey = `ws:session:${previousSocketId}`;
    const sessionData = await redis.get(sessionKey);

    if (!sessionData) {
      return false;
    }

    const session = JSON.parse(sessionData);

    // Restore user data
    client.data.user = session.user;

    // Rejoin previous rooms
    if (session.rooms && Array.isArray(session.rooms)) {
      for (const roomId of session.rooms) {
        await client.join(roomId);
      }
    }

    // Transfer session to new socket ID
    const newSessionKey = `ws:session:${client.id}`;
    await redis.setex(newSessionKey, 3600, sessionData);
    await redis.del(sessionKey);

    return true;
  } catch (error) {
    console.error('Reconnection handling failed:', error);
    return false;
  }
}

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
export async function storeClientSession(
  redis: Redis,
  client: Socket,
  ttlSeconds = 3600,
): Promise<void> {
  const sessionKey = `ws:session:${client.id}`;

  const sessionData = {
    socketId: client.id,
    user: client.data.user,
    rooms: Array.from(client.rooms).filter(room => room !== client.id),
    timestamp: new Date().toISOString(),
  };

  await redis.setex(sessionKey, ttlSeconds, JSON.stringify(sessionData));
}

// ============================================================================
// 13. MESSAGE QUEUING (2 functions)
// ============================================================================

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
export async function queueMessageForUser(
  redis: Redis,
  userId: string,
  message: QueuedMessage,
  ttlSeconds = 604800,
): Promise<void> {
  const queueKey = `ws:queue:${userId}`;

  // Add message to user's queue
  await redis.rpush(queueKey, JSON.stringify(message));

  // Set expiration on queue
  await redis.expire(queueKey, ttlSeconds);
}

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
export async function deliverQueuedMessages(
  redis: Redis,
  client: Socket,
  userId: string,
  removeAfterDelivery = true,
): Promise<number> {
  const queueKey = `ws:queue:${userId}`;

  // Get all queued messages
  const messages = await redis.lrange(queueKey, 0, -1);

  if (messages.length === 0) {
    return 0;
  }

  // Deliver each message
  for (const messageStr of messages) {
    try {
      const message: QueuedMessage = JSON.parse(messageStr);
      client.emit(message.event, message.data);
    } catch (error) {
      console.error('Failed to deliver queued message:', error);
    }
  }

  // Remove delivered messages
  if (removeAfterDelivery) {
    await redis.del(queueKey);
  }

  return messages.length;
}

// ============================================================================
// 14. RATE LIMITING (2 functions)
// ============================================================================

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
export async function checkRateLimit(
  redis: Redis,
  identifier: string,
  config: RateLimitConfig,
): Promise<boolean> {
  const key = `ws:ratelimit:${identifier}`;
  const blockKey = `ws:ratelimit:blocked:${identifier}`;

  // Check if currently blocked
  const isBlocked = await redis.exists(blockKey);
  if (isBlocked) {
    return false;
  }

  // Increment counter
  const current = await redis.incr(key);

  // Set expiration on first request
  if (current === 1) {
    await redis.pexpire(key, config.windowMs);
  }

  // Check if limit exceeded
  if (current > config.maxMessages) {
    // Block user if configured
    if (config.blockDurationMs) {
      await redis.setex(
        blockKey,
        Math.floor(config.blockDurationMs / 1000),
        '1',
      );
    }
    return false;
  }

  return true;
}

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
export async function getRateLimitStatus(
  redis: Redis,
  identifier: string,
  config: RateLimitConfig,
): Promise<{ remaining: number; resetAt: Date; isBlocked: boolean }> {
  const key = `ws:ratelimit:${identifier}`;
  const blockKey = `ws:ratelimit:blocked:${identifier}`;

  // Check if blocked
  const isBlocked = (await redis.exists(blockKey)) === 1;

  // Get current count
  const current = await redis.get(key);
  const count = current ? parseInt(current, 10) : 0;

  // Get TTL
  const ttl = await redis.pttl(key);
  const resetAt = new Date(Date.now() + (ttl > 0 ? ttl : config.windowMs));

  return {
    remaining: Math.max(0, config.maxMessages - count),
    resetAt,
    isBlocked,
  };
}

// ============================================================================
// 15. WEBSOCKET TESTING HELPERS (1 function)
// ============================================================================

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
export function createMockSocket(
  overrides?: Partial<Socket>,
): Partial<Socket> {
  const rooms = new Set<string>();
  const mockSocket: Partial<Socket> = {
    id: 'mock-socket-id',
    data: {},
    rooms,
    handshake: {
      auth: {},
      headers: {},
      query: {},
      address: '127.0.0.1',
    } as any,
    emit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    off: jest.fn(),
    join: jest.fn((room: string) => {
      rooms.add(room);
      return Promise.resolve();
    }),
    leave: jest.fn((room: string) => {
      rooms.delete(room);
      return Promise.resolve();
    }),
    to: jest.fn(() => mockSocket as any),
    disconnect: jest.fn(),
    ...overrides,
  };

  return mockSocket;
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Gateway helpers
  createWsException,
  extractToken,
  authenticateSocket,
  getSocketUser,
  hasRole,

  // Connection helpers
  getAllConnectedSockets,
  getSocketById,
  getSocketsByUserId,
  disconnectUserSockets,
  getConnectionCount,

  // Room management
  joinRoom,
  leaveRoom,
  getRoomSize,
  getRoomMembers,
  broadcastToRoom,

  // Namespace utilities
  getNamespace,
  broadcastToNamespace,
  getNamespaceConnectionCount,

  // Authentication & authorization
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  storeAuthMetadata,
  getAuthMetadata,

  // Message validation
  validateMessagePayload,
  sanitizeMessageContent,
  validateAndTransformEvent,
  validateMessageSize,

  // Event emitters
  emitToUser,
  emitToRooms,
  emitWithAck,
  broadcastGlobally,

  // Broadcasting
  broadcastToRoomExcept,
  broadcastToRole,
  broadcastWithPriority,
  broadcastToNamespaceCompressed,

  // Client tracking
  trackConnection,
  updateLastActivity,
  getUserConnections,

  // Error handling
  formatWsError,
  handleWsError,
  formatWsSuccess,

  // Heartbeat
  setupHeartbeat,
  measureRTT,

  // Reconnection
  handleReconnection,
  storeClientSession,

  // Message queuing
  queueMessageForUser,
  deliverQueuedMessages,

  // Rate limiting
  checkRateLimit,
  getRateLimitStatus,

  // Testing
  createMockSocket,
};
