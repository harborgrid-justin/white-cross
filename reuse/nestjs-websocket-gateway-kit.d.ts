/**
 * LOC: W9X2Y3Z4A5
 * File: /reuse/nestjs-websocket-gateway-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/websockets (v11.1.8)
 *   - @nestjs/platform-socket.io (v11.1.8)
 *   - socket.io (v4.7.5)
 *   - @socket.io/redis-adapter (v8.3.0)
 *   - ioredis (v5.4.1)
 *
 * DOWNSTREAM (imported by):
 *   - WebSocket gateway implementations
 *   - Real-time communication modules
 *   - Chat and messaging services
 *   - Notification systems
 */
import { WsException } from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
/**
 * WebSocket gateway configuration options
 */
export interface GatewayConfig {
    namespace?: string;
    cors?: {
        origin: string | string[] | RegExp;
        credentials?: boolean;
        methods?: string[];
    };
    transports?: ('websocket' | 'polling')[];
    path?: string;
    pingTimeout?: number;
    pingInterval?: number;
    maxHttpBufferSize?: number;
    allowEIO3?: boolean;
    serveClient?: boolean;
}
/**
 * Room configuration and metadata
 */
export interface RoomConfig {
    roomId: string;
    name?: string;
    maxUsers?: number;
    isPrivate?: boolean;
    metadata?: Record<string, any>;
    createdAt?: Date;
    expiresAt?: Date;
}
/**
 * User presence information
 */
export interface UserPresence {
    userId: string;
    socketId: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    lastSeen?: Date;
    metadata?: Record<string, any>;
}
/**
 * Typing indicator state
 */
export interface TypingState {
    userId: string;
    roomId: string;
    isTyping: boolean;
    timestamp: Date;
}
/**
 * WebSocket authentication payload
 */
export interface WsAuthPayload {
    userId: string;
    token?: string;
    roles?: string[];
    tenantId?: string;
    metadata?: Record<string, any>;
}
/**
 * Connection metadata
 */
export interface ConnectionMetadata {
    socketId: string;
    userId?: string;
    connectedAt: Date;
    lastActivity: Date;
    rooms: string[];
    metadata?: Record<string, any>;
}
/**
 * Broadcast options
 */
export interface BroadcastOptions {
    except?: string[];
    volatile?: boolean;
    compress?: boolean;
    timeout?: number;
}
/**
 * Message acknowledgement callback
 */
export type AckCallback = (response?: any) => void;
/**
 * Redis adapter configuration
 */
export interface RedisAdapterConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    requestsTimeout?: number;
}
/**
 * Heartbeat configuration
 */
export interface HeartbeatConfig {
    interval: number;
    timeout: number;
    maxMissed: number;
}
/**
 * Event rate limit configuration
 */
export interface EventRateLimitConfig {
    maxEvents: number;
    windowMs: number;
    blockDuration?: number;
}
/**
 * 1. Creates gateway configuration with HIPAA-compliant defaults.
 *
 * @param {Partial<GatewayConfig>} options - Gateway configuration options
 * @returns {GatewayConfig} Complete gateway configuration
 *
 * @example
 * ```typescript
 * const config = createGatewayConfig({
 *   namespace: '/chat',
 *   cors: { origin: 'https://app.example.com', credentials: true }
 * });
 * ```
 */
export declare function createGatewayConfig(options?: Partial<GatewayConfig>): GatewayConfig;
/**
 * 2. Initializes gateway with lifecycle logging.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} gatewayName - Name of the gateway for logging
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterInit(server: Server) {
 *   initializeGateway(server, 'ChatGateway');
 * }
 * ```
 */
export declare function initializeGateway(server: Server, gatewayName: string): void;
/**
 * 3. Handles connection lifecycle with metadata tracking.
 *
 * @param {Socket} client - Connected socket client
 * @param {Map<string, ConnectionMetadata>} connections - Connection metadata store
 * @returns {ConnectionMetadata} Connection metadata
 *
 * @example
 * ```typescript
 * handleConnection(client: Socket) {
 *   const metadata = handleConnectionLifecycle(client, this.connections);
 *   this.logger.log(`Client connected: ${metadata.socketId}`);
 * }
 * ```
 */
export declare function handleConnectionLifecycle(client: Socket, connections: Map<string, ConnectionMetadata>): ConnectionMetadata;
/**
 * 4. Handles disconnection with cleanup.
 *
 * @param {Socket} client - Disconnecting socket client
 * @param {Map<string, ConnectionMetadata>} connections - Connection metadata store
 * @param {() => Promise<void>} cleanupCallback - Optional cleanup callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * async handleDisconnect(client: Socket) {
 *   await handleDisconnectionCleanup(client, this.connections, async () => {
 *     await this.presenceService.setOffline(client.handshake.auth.userId);
 *   });
 * }
 * ```
 */
export declare function handleDisconnectionCleanup(client: Socket, connections: Map<string, ConnectionMetadata>, cleanupCallback?: () => Promise<void>): Promise<void>;
/**
 * 5. Creates middleware for gateway event handling.
 *
 * @param {(client: Socket, data: any) => Promise<boolean>} validator - Validation function
 * @returns {(client: Socket, data: any, next: (err?: any) => void) => void} Middleware function
 *
 * @example
 * ```typescript
 * const authMiddleware = createGatewayMiddleware(async (client, data) => {
 *   return await validateToken(client.handshake.auth.token);
 * });
 * ```
 */
export declare function createGatewayMiddleware(validator: (client: Socket, data: any) => Promise<boolean>): (client: Socket, data: any, next: (err?: any) => void) => void;
/**
 * 6. Gets gateway statistics and health metrics.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {Map<string, ConnectionMetadata>} connections - Connection metadata store
 * @returns {object} Gateway statistics
 *
 * @example
 * ```typescript
 * @SubscribeMessage('gateway:stats')
 * getStats() {
 *   return getGatewayStats(this.server, this.connections);
 * }
 * ```
 */
export declare function getGatewayStats(server: Server, connections: Map<string, ConnectionMetadata>): {
    connectedClients: number;
    totalRooms: number;
    namespaces: number;
    uptime: number;
    avgConnectionDuration: number;
};
/**
 * 7. Joins a client to a room with validation.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {RoomConfig} config - Room configuration
 * @returns {Promise<boolean>} True if joined successfully
 *
 * @example
 * ```typescript
 * @SubscribeMessage('room:join')
 * async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
 *   const joined = await joinRoom(client, data.roomId, { maxUsers: 100 });
 *   return { success: joined };
 * }
 * ```
 */
export declare function joinRoom(client: Socket, roomId: string, config?: RoomConfig): Promise<boolean>;
/**
 * 8. Removes a client from a room.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * @SubscribeMessage('room:leave')
 * async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
 *   await leaveRoom(client, data.roomId);
 *   return { success: true };
 * }
 * ```
 */
export declare function leaveRoom(client: Socket, roomId: string): Promise<void>;
/**
 * 9. Gets all clients in a room.
 *
 * @param {Namespace} namespace - Socket.IO namespace
 * @param {string} roomId - Room identifier
 * @returns {Promise<string[]>} Array of socket IDs
 *
 * @example
 * ```typescript
 * const clients = await getRoomClients(this.server.of('/chat'), 'room-123');
 * console.log(`Room has ${clients.length} clients`);
 * ```
 */
export declare function getRoomClients(namespace: Namespace, roomId: string): Promise<string[]>;
/**
 * 10. Gets all rooms a client has joined.
 *
 * @param {Socket} client - Socket client
 * @returns {string[]} Array of room IDs
 *
 * @example
 * ```typescript
 * const rooms = getClientRooms(client);
 * console.log(`Client is in ${rooms.length} rooms`);
 * ```
 */
export declare function getClientRooms(client: Socket): string[];
/**
 * 11. Broadcasts to all clients in a room except sender.
 *
 * @param {Socket} client - Socket client (sender)
 * @param {string} roomId - Room identifier
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {BroadcastOptions} options - Broadcast options
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToRoom(client, 'chat-room-1', 'message:new', { text: 'Hello' });
 * ```
 */
export declare function broadcastToRoom(client: Socket, roomId: string, event: string, data: any, options?: BroadcastOptions): void;
/**
 * 12. Removes all clients from a room and deletes it.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} roomId - Room identifier
 * @returns {Promise<number>} Number of clients removed
 *
 * @example
 * ```typescript
 * const removed = await closeRoom(this.server, 'room-123');
 * console.log(`Removed ${removed} clients from room`);
 * ```
 */
export declare function closeRoom(server: Server, roomId: string): Promise<number>;
/**
 * 13. Creates a dynamic namespace with configuration.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} namespaceName - Namespace path
 * @param {GatewayConfig} config - Namespace configuration
 * @returns {Namespace} Created namespace
 *
 * @example
 * ```typescript
 * const chatNamespace = createNamespace(server, '/chat', {
 *   cors: { origin: 'https://example.com' }
 * });
 * ```
 */
export declare function createNamespace(server: Server, namespaceName: string, config?: GatewayConfig): Namespace;
/**
 * 14. Gets all active namespaces.
 *
 * @param {Server} server - Socket.IO server instance
 * @returns {string[]} Array of namespace names
 *
 * @example
 * ```typescript
 * const namespaces = getActiveNamespaces(server);
 * console.log(`Active namespaces: ${namespaces.join(', ')}`);
 * ```
 */
export declare function getActiveNamespaces(server: Server): string[];
/**
 * 15. Broadcasts to all clients in a namespace.
 *
 * @param {Namespace} namespace - Socket.IO namespace
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToNamespace(server.of('/notifications'), 'alert', {
 *   message: 'System maintenance in 10 minutes'
 * });
 * ```
 */
export declare function broadcastToNamespace(namespace: Namespace, event: string, data: any): void;
/**
 * 16. Gets namespace statistics.
 *
 * @param {Namespace} namespace - Socket.IO namespace
 * @returns {object} Namespace statistics
 *
 * @example
 * ```typescript
 * const stats = getNamespaceStats(server.of('/chat'));
 * console.log(`Connected clients: ${stats.connectedClients}`);
 * ```
 */
export declare function getNamespaceStats(namespace: Namespace): {
    name: string;
    connectedClients: number;
    rooms: number;
};
/**
 * 17. Disconnects all clients from a namespace.
 *
 * @param {Namespace} namespace - Socket.IO namespace
 * @param {boolean} close - Whether to close the namespace
 * @returns {Promise<number>} Number of disconnected clients
 *
 * @example
 * ```typescript
 * const disconnected = await disconnectNamespace(server.of('/temp'), true);
 * console.log(`Disconnected ${disconnected} clients`);
 * ```
 */
export declare function disconnectNamespace(namespace: Namespace, close?: boolean): Promise<number>;
/**
 * 18. Validates WebSocket authentication token.
 *
 * @param {Socket} client - Socket client
 * @param {(token: string) => Promise<WsAuthPayload>} validator - Token validation function
 * @returns {Promise<WsAuthPayload>} Authentication payload
 *
 * @example
 * ```typescript
 * async handleConnection(client: Socket) {
 *   const auth = await validateWsAuth(client, async (token) => {
 *     return await this.jwtService.verify(token);
 *   });
 * }
 * ```
 */
export declare function validateWsAuth(client: Socket, validator: (token: string) => Promise<WsAuthPayload>): Promise<WsAuthPayload>;
/**
 * 19. Extracts authentication token from WebSocket handshake.
 *
 * @param {Socket} client - Socket client
 * @returns {string | null} Extracted token
 *
 * @example
 * ```typescript
 * const token = extractWsToken(client);
 * if (token) {
 *   // Validate token
 * }
 * ```
 */
export declare function extractWsToken(client: Socket): string | null;
/**
 * 20. Checks if user has required role for WebSocket event.
 *
 * @param {Socket} client - Socket client
 * @param {string[]} requiredRoles - Required roles
 * @returns {boolean} True if authorized
 *
 * @example
 * ```typescript
 * @SubscribeMessage('admin:broadcast')
 * handleAdminBroadcast(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
 *   if (!checkWsRole(client, ['admin', 'superadmin'])) {
 *     throw new WsException('Insufficient permissions');
 *   }
 * }
 * ```
 */
export declare function checkWsRole(client: Socket, requiredRoles: string[]): boolean;
/**
 * 21. Creates JWT authentication guard for WebSocket events.
 *
 * @param {(token: string) => Promise<any>} verifyFn - JWT verification function
 * @returns {(client: Socket) => Promise<boolean>} Guard function
 *
 * @example
 * ```typescript
 * const wsJwtGuard = createWsJwtGuard(async (token) => {
 *   return await jwtService.verify(token);
 * });
 * ```
 */
export declare function createWsJwtGuard(verifyFn: (token: string) => Promise<any>): (client: Socket) => Promise<boolean>;
/**
 * 22. Validates room access permissions.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {(userId: string, roomId: string) => Promise<boolean>} validator - Access validator
 * @returns {Promise<boolean>} True if access granted
 *
 * @example
 * ```typescript
 * const hasAccess = await validateRoomAccess(client, 'room-123', async (userId, roomId) => {
 *   return await this.roomService.canAccess(userId, roomId);
 * });
 * ```
 */
export declare function validateRoomAccess(client: Socket, roomId: string, validator: (userId: string, roomId: string) => Promise<boolean>): Promise<boolean>;
/**
 * 23. Creates rate limiter for WebSocket events.
 *
 * @param {EventRateLimitConfig} config - Rate limit configuration
 * @returns {(client: Socket, event: string) => boolean} Rate limiter function
 *
 * @example
 * ```typescript
 * const rateLimiter = createEventRateLimiter({
 *   maxEvents: 10,
 *   windowMs: 60000, // 1 minute
 *   blockDuration: 300000 // 5 minutes
 * });
 * ```
 */
export declare function createEventRateLimiter(config: EventRateLimitConfig): (client: Socket, event: string) => boolean;
/**
 * 24. Sends event to specific user across all connections.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User identifier
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * sendToUser(this.server, 'user-123', 'notification', {
 *   message: 'You have a new message'
 * });
 * ```
 */
export declare function sendToUser(server: Server, userId: string, event: string, data: any): void;
/**
 * 25. Broadcasts to all connected clients.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {BroadcastOptions} options - Broadcast options
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToAll(this.server, 'system:announcement', {
 *   message: 'Server maintenance scheduled'
 * });
 * ```
 */
export declare function broadcastToAll(server: Server, event: string, data: any, options?: BroadcastOptions): void;
/**
 * 26. Sends event with acknowledgement callback.
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {number} timeout - Acknowledgement timeout in ms
 * @returns {Promise<any>} Acknowledgement response
 *
 * @example
 * ```typescript
 * const response = await sendWithAck(client, 'message:send', { text: 'Hello' }, 5000);
 * console.log('Message acknowledged:', response);
 * ```
 */
export declare function sendWithAck(client: Socket, event: string, data: any, timeout?: number): Promise<any>;
/**
 * 27. Broadcasts to multiple rooms simultaneously.
 *
 * @param {Socket} client - Socket client
 * @param {string[]} roomIds - Array of room identifiers
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToMultipleRooms(client, ['room-1', 'room-2', 'room-3'], 'update', data);
 * ```
 */
export declare function broadcastToMultipleRooms(client: Socket, roomIds: string[], event: string, data: any): void;
/**
 * 28. Emits volatile event (allows packet loss for performance).
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * emitVolatile(client, 'cursor:move', { x: 100, y: 200 });
 * ```
 */
export declare function emitVolatile(client: Socket, event: string, data: any): void;
/**
 * 29. Sends binary data efficiently.
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {Buffer} buffer - Binary data
 * @returns {void}
 *
 * @example
 * ```typescript
 * const imageBuffer = fs.readFileSync('image.png');
 * sendBinaryData(client, 'image:upload', imageBuffer);
 * ```
 */
export declare function sendBinaryData(client: Socket, event: string, buffer: Buffer): void;
/**
 * 30. Broadcasts with compression enabled.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastCompressed(client, 'room-123', 'large:data', largeObject);
 * ```
 */
export declare function broadcastCompressed(client: Socket, roomId: string, event: string, data: any): void;
/**
 * 31. Disconnects a specific client with reason.
 *
 * @param {Socket} client - Socket client
 * @param {string} reason - Disconnection reason
 * @returns {void}
 *
 * @example
 * ```typescript
 * disconnectClient(client, 'Unauthorized access');
 * ```
 */
export declare function disconnectClient(client: Socket, reason: string): void;
/**
 * 32. Gets connection information for a client.
 *
 * @param {Socket} client - Socket client
 * @returns {object} Connection information
 *
 * @example
 * ```typescript
 * const info = getConnectionInfo(client);
 * console.log(`Client IP: ${info.ip}`);
 * ```
 */
export declare function getConnectionInfo(client: Socket): {
    id: string;
    ip: string;
    userAgent: string;
    transport: string;
    connectedAt: Date;
};
/**
 * 33. Handles client reconnection logic.
 *
 * @param {Socket} client - Socket client
 * @param {Map<string, any>} sessionStore - Session data store
 * @returns {any | null} Restored session data
 *
 * @example
 * ```typescript
 * async handleConnection(client: Socket) {
 *   const session = handleReconnection(client, this.sessionStore);
 *   if (session) {
 *     // Restore user state
 *   }
 * }
 * ```
 */
export declare function handleReconnection(client: Socket, sessionStore: Map<string, any>): any | null;
/**
 * 34. Monitors idle connections and disconnects them.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {Map<string, ConnectionMetadata>} connections - Connection metadata store
 * @param {number} idleTimeout - Idle timeout in milliseconds
 * @returns {number} Number of disconnected clients
 *
 * @example
 * ```typescript
 * // Run periodically
 * setInterval(() => {
 *   const disconnected = monitorIdleConnections(
 *     this.server,
 *     this.connections,
 *     30 * 60 * 1000 // 30 minutes
 *   );
 * }, 60000);
 * ```
 */
export declare function monitorIdleConnections(server: Server, connections: Map<string, ConnectionMetadata>, idleTimeout: number): number;
/**
 * 35. Sets up heartbeat monitoring for connection health.
 *
 * @param {Socket} client - Socket client
 * @param {HeartbeatConfig} config - Heartbeat configuration
 * @param {() => void} onTimeout - Timeout callback
 * @returns {NodeJS.Timeout} Heartbeat interval timer
 *
 * @example
 * ```typescript
 * const timer = setupHeartbeat(client, {
 *   interval: 30000,
 *   timeout: 5000,
 *   maxMissed: 3
 * }, () => {
 *   disconnectClient(client, 'Heartbeat timeout');
 * });
 * ```
 */
export declare function setupHeartbeat(client: Socket, config: HeartbeatConfig, onTimeout: () => void): NodeJS.Timeout;
/**
 * 36. Handles pong response from client.
 *
 * @param {Socket} client - Socket client
 * @param {number} sentTimestamp - Timestamp when ping was sent
 * @returns {number} Round-trip time in milliseconds
 *
 * @example
 * ```typescript
 * @SubscribeMessage('pong')
 * handlePong(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
 *   const rtt = handlePong(client, data.timestamp);
 *   console.log(`Latency: ${rtt}ms`);
 * }
 * ```
 */
export declare function handlePong(client: Socket, sentTimestamp: number): number;
/**
 * 37. Gets average latency for a client.
 *
 * @param {Socket} client - Socket client
 * @returns {number} Average latency in milliseconds
 *
 * @example
 * ```typescript
 * const latency = getClientLatency(client);
 * console.log(`Average latency: ${latency}ms`);
 * ```
 */
export declare function getClientLatency(client: Socket): number;
/**
 * 38. Measures WebSocket connection quality.
 *
 * @param {Socket} client - Socket client
 * @returns {Promise<object>} Connection quality metrics
 *
 * @example
 * ```typescript
 * const quality = await measureConnectionQuality(client);
 * console.log(`Packet loss: ${quality.packetLoss}%`);
 * ```
 */
export declare function measureConnectionQuality(client: Socket): Promise<{
    latency: number;
    jitter: number;
    packetLoss: number;
}>;
/**
 * 39. Sets user online status.
 *
 * @param {Map<string, UserPresence>} presenceStore - Presence data store
 * @param {string} userId - User identifier
 * @param {string} socketId - Socket identifier
 * @param {Partial<UserPresence>} metadata - Additional presence metadata
 * @returns {void}
 *
 * @example
 * ```typescript
 * setUserPresence(this.presenceStore, 'user-123', client.id, {
 *   status: 'online',
 *   metadata: { device: 'mobile' }
 * });
 * ```
 */
export declare function setUserPresence(presenceStore: Map<string, UserPresence>, userId: string, socketId: string, metadata?: Partial<UserPresence>): void;
/**
 * 40. Gets user presence information.
 *
 * @param {Map<string, UserPresence>} presenceStore - Presence data store
 * @param {string} userId - User identifier
 * @returns {UserPresence | null} Presence information
 *
 * @example
 * ```typescript
 * const presence = getUserPresence(this.presenceStore, 'user-123');
 * if (presence?.status === 'online') {
 *   // User is online
 * }
 * ```
 */
export declare function getUserPresence(presenceStore: Map<string, UserPresence>, userId: string): UserPresence | null;
/**
 * 41. Tracks typing indicator state.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {boolean} isTyping - Typing state
 * @param {number} timeout - Auto-clear timeout in ms
 * @returns {NodeJS.Timeout | null} Clear timeout timer
 *
 * @example
 * ```typescript
 * @SubscribeMessage('typing:start')
 * handleTypingStart(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
 *   trackTypingIndicator(client, data.roomId, true, 3000);
 *   client.to(data.roomId).emit('user:typing', { userId: client.handshake.auth.userId });
 * }
 * ```
 */
export declare function trackTypingIndicator(client: Socket, roomId: string, isTyping: boolean, timeout?: number): NodeJS.Timeout | null;
/**
 * 42. Gets online users in a room.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} roomId - Room identifier
 * @param {Map<string, UserPresence>} presenceStore - Presence data store
 * @returns {Promise<UserPresence[]>} Array of online users
 *
 * @example
 * ```typescript
 * const onlineUsers = await getOnlineUsersInRoom(this.server, 'room-123', this.presenceStore);
 * console.log(`${onlineUsers.length} users online`);
 * ```
 */
export declare function getOnlineUsersInRoom(server: Server, roomId: string, presenceStore: Map<string, UserPresence>): Promise<UserPresence[]>;
/**
 * 43. Broadcasts presence updates to subscribers.
 *
 * @param {Socket} client - Socket client
 * @param {string} userId - User identifier
 * @param {UserPresence} presence - Presence information
 * @param {string[]} subscriberRooms - Rooms to notify
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastPresenceUpdate(client, 'user-123', {
 *   userId: 'user-123',
 *   socketId: client.id,
 *   status: 'away',
 *   lastSeen: new Date()
 * }, ['room-1', 'room-2']);
 * ```
 */
export declare function broadcastPresenceUpdate(client: Socket, userId: string, presence: UserPresence, subscriberRooms: string[]): void;
/**
 * 44. Creates Redis adapter configuration for horizontal scaling.
 *
 * @param {Partial<RedisAdapterConfig>} options - Redis configuration options
 * @returns {RedisAdapterConfig} Complete Redis adapter configuration
 *
 * @example
 * ```typescript
 * const redisConfig = createRedisAdapterConfig({
 *   host: process.env.REDIS_HOST || 'localhost',
 *   port: 6379,
 *   password: process.env.REDIS_PASSWORD
 * });
 * ```
 */
export declare function createRedisAdapterConfig(options?: Partial<RedisAdapterConfig>): RedisAdapterConfig;
/**
 * 45. Publishes message to Redis for cross-server communication.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} channel - Redis channel
 * @param {any} message - Message to publish
 * @returns {Promise<number>} Number of subscribers that received the message
 *
 * @example
 * ```typescript
 * await publishToRedis(redisClient, 'notifications', {
 *   type: 'user:online',
 *   userId: 'user-123'
 * });
 * ```
 */
export declare function publishToRedis(redisClient: any, channel: string, message: any): Promise<number>;
/**
 * 46. Creates WebSocket exception with proper formatting.
 *
 * @param {string} message - Error message
 * @param {number} code - Error code
 * @param {any} details - Additional error details
 * @returns {WsException} WebSocket exception
 *
 * @example
 * ```typescript
 * throw createWsException('Room not found', 404, { roomId: 'room-123' });
 * ```
 */
export declare function createWsException(message: string, code?: number, details?: any): WsException;
/**
 * 47. Handles WebSocket errors with logging.
 *
 * @param {Error} error - Error object
 * @param {Socket} client - Socket client
 * @param {string} event - Event that caused the error
 * @returns {void}
 *
 * @example
 * ```typescript
 * @SubscribeMessage('message:send')
 * async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
 *   try {
 *     // Handle message
 *   } catch (error) {
 *     handleWsError(error, client, 'message:send');
 *   }
 * }
 * ```
 */
export declare function handleWsError(error: Error, client: Socket, event: string): void;
/**
 * 48. Validates WebSocket event payload.
 *
 * @param {any} payload - Event payload
 * @param {object} schema - Validation schema
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * @SubscribeMessage('message:send')
 * handleMessage(@MessageBody() data: any) {
 *   if (!validateWsPayload(data, { roomId: 'string', content: 'string' })) {
 *     throw new WsException('Invalid payload');
 *   }
 * }
 * ```
 */
export declare function validateWsPayload(payload: any, schema: Record<string, string>): boolean;
declare const _default: {
    createGatewayConfig: typeof createGatewayConfig;
    initializeGateway: typeof initializeGateway;
    handleConnectionLifecycle: typeof handleConnectionLifecycle;
    handleDisconnectionCleanup: typeof handleDisconnectionCleanup;
    createGatewayMiddleware: typeof createGatewayMiddleware;
    getGatewayStats: typeof getGatewayStats;
    joinRoom: typeof joinRoom;
    leaveRoom: typeof leaveRoom;
    getRoomClients: typeof getRoomClients;
    getClientRooms: typeof getClientRooms;
    broadcastToRoom: typeof broadcastToRoom;
    closeRoom: typeof closeRoom;
    createNamespace: typeof createNamespace;
    getActiveNamespaces: typeof getActiveNamespaces;
    broadcastToNamespace: typeof broadcastToNamespace;
    getNamespaceStats: typeof getNamespaceStats;
    disconnectNamespace: typeof disconnectNamespace;
    validateWsAuth: typeof validateWsAuth;
    extractWsToken: typeof extractWsToken;
    checkWsRole: typeof checkWsRole;
    createWsJwtGuard: typeof createWsJwtGuard;
    validateRoomAccess: typeof validateRoomAccess;
    createEventRateLimiter: typeof createEventRateLimiter;
    sendToUser: typeof sendToUser;
    broadcastToAll: typeof broadcastToAll;
    sendWithAck: typeof sendWithAck;
    broadcastToMultipleRooms: typeof broadcastToMultipleRooms;
    emitVolatile: typeof emitVolatile;
    sendBinaryData: typeof sendBinaryData;
    broadcastCompressed: typeof broadcastCompressed;
    disconnectClient: typeof disconnectClient;
    getConnectionInfo: typeof getConnectionInfo;
    handleReconnection: typeof handleReconnection;
    monitorIdleConnections: typeof monitorIdleConnections;
    setupHeartbeat: typeof setupHeartbeat;
    handlePong: typeof handlePong;
    getClientLatency: typeof getClientLatency;
    measureConnectionQuality: typeof measureConnectionQuality;
    setUserPresence: typeof setUserPresence;
    getUserPresence: typeof getUserPresence;
    trackTypingIndicator: typeof trackTypingIndicator;
    getOnlineUsersInRoom: typeof getOnlineUsersInRoom;
    broadcastPresenceUpdate: typeof broadcastPresenceUpdate;
    createRedisAdapterConfig: typeof createRedisAdapterConfig;
    publishToRedis: typeof publishToRedis;
    createWsException: typeof createWsException;
    handleWsError: typeof handleWsError;
    validateWsPayload: typeof validateWsPayload;
};
export default _default;
//# sourceMappingURL=nestjs-websocket-gateway-kit.d.ts.map