/**
 * @fileoverview WebSocket Real-Time Kit - Comprehensive NestJS WebSocket utilities
 * @module reuse/websocket-real-time-kit
 * @description Production-grade WebSocket toolkit for NestJS applications with Socket.IO.
 * Provides complete real-time communication utilities including gateway setup, room management,
 * namespace configuration, authentication, broadcasting, connection lifecycle, heartbeat monitoring,
 * message validation, middleware, error handling, reconnection logic, presence tracking, and
 * Redis adapter configuration for horizontal scaling.
 *
 * Key Features:
 * - Socket.IO gateway configuration and initialization
 * - Advanced room and namespace management
 * - WebSocket authentication and authorization
 * - Multi-pattern broadcasting utilities
 * - Connection lifecycle management
 * - Heartbeat and ping-pong monitoring
 * - Message validation and sanitization
 * - Custom WebSocket middleware
 * - Comprehensive error handling
 * - Automatic reconnection support
 * - Real-time presence tracking
 * - Redis adapter for multi-server scaling
 * - Event rate limiting and throttling
 * - Binary data transmission
 * - HIPAA-compliant secure communication
 *
 * @target NestJS v11.x, Socket.IO v4.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - WSS (WebSocket Secure) for encrypted communication
 * - JWT-based WebSocket authentication
 * - CORS configuration for origin validation
 * - Rate limiting to prevent abuse
 * - Message size limits
 * - XSS and injection protection
 * - Session validation and rotation
 * - Secure token extraction from multiple sources
 *
 * @example Basic WebSocket gateway
 * ```typescript
 * import { createWebSocketGateway, configureRooms } from './websocket-real-time-kit';
 *
 * @WebSocketGateway(createGatewayOptions('/chat'))
 * export class ChatGateway {
 *   @WebSocketServer() server: Server;
 *
 *   handleConnection(client: Socket) {
 *     initializeWebSocketConnection(client, this.server);
 *   }
 * }
 * ```
 *
 * @example Real-time presence tracking
 * ```typescript
 * import { trackUserPresence, broadcastPresence } from './websocket-real-time-kit';
 *
 * const presence = await trackUserPresence(client, 'user-123', 'online');
 * await broadcastPresence(server, presence, ['room-1', 'room-2']);
 * ```
 *
 * LOC: WC-WSRT-001
 * UPSTREAM: @nestjs/websockets, @nestjs/platform-socket.io, socket.io, ioredis, @socket.io/redis-adapter
 * DOWNSTREAM: Chat services, notification systems, real-time dashboards, collaboration tools
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { RedisClientType } from 'redis';
/**
 * WebSocket gateway options configuration
 */
export interface WebSocketGatewayOptions {
    namespace?: string;
    cors?: {
        origin: string | string[] | RegExp | boolean;
        credentials?: boolean;
        methods?: string[];
        allowedHeaders?: string[];
    };
    transports?: ('websocket' | 'polling')[];
    path?: string;
    pingTimeout?: number;
    pingInterval?: number;
    upgradeTimeout?: number;
    maxHttpBufferSize?: number;
    allowRequest?: (req: any, callback: (err: string | null, success: boolean) => void) => void;
    perMessageDeflate?: boolean | object;
    httpCompression?: boolean | object;
    wsEngine?: string;
    serveClient?: boolean;
    allowEIO3?: boolean;
    cookie?: boolean | object;
}
/**
 * Room configuration with metadata
 */
export interface RoomConfiguration {
    id: string;
    name: string;
    description?: string;
    maxUsers?: number;
    isPrivate?: boolean;
    password?: string;
    ownerId?: string;
    admins?: string[];
    metadata?: Record<string, any>;
    createdAt?: Date;
    expiresAt?: Date;
}
/**
 * User presence information
 */
export interface UserPresenceInfo {
    userId: string;
    socketId: string;
    status: 'online' | 'away' | 'busy' | 'invisible' | 'offline';
    customStatus?: string;
    device?: 'desktop' | 'mobile' | 'tablet' | 'api';
    location?: string;
    lastSeen: Date;
    connectedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Message envelope for structured communication
 */
export interface MessageEnvelope<T = any> {
    id: string;
    event: string;
    data: T;
    sender: {
        userId: string;
        socketId: string;
    };
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Broadcast configuration
 */
export interface BroadcastConfig {
    rooms?: string[];
    except?: string[];
    volatile?: boolean;
    compress?: boolean;
    timeout?: number;
    binary?: boolean;
}
/**
 * Connection state information
 */
export interface ConnectionState {
    socketId: string;
    userId?: string;
    authenticated: boolean;
    connectedAt: Date;
    lastActivity: Date;
    rooms: Set<string>;
    subscriptions: Set<string>;
    metadata: Map<string, any>;
    latency?: number;
    reconnectCount: number;
}
/**
 * Event subscription configuration
 */
export interface EventSubscription {
    event: string;
    handler: (data: any) => void | Promise<void>;
    filters?: Record<string, any>;
    priority?: number;
}
/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
    maxEvents: number;
    windowMs: number;
    blockDurationMs?: number;
    keyGenerator?: (client: Socket) => string;
}
/**
 * Heartbeat configuration
 */
export interface HeartbeatOptions {
    interval: number;
    timeout: number;
    maxMissed: number;
    onTimeout?: (client: Socket) => void;
}
/**
 * Reconnection configuration
 */
export interface ReconnectionConfig {
    enabled: boolean;
    maxAttempts: number;
    timeout: number;
    exponentialBackoff?: boolean;
    sessionStore?: Map<string, any>;
}
/**
 * Redis adapter options
 */
export interface RedisAdapterOptions {
    pubClient: RedisClientType;
    subClient: RedisClientType;
    keyPrefix?: string;
    requestsTimeout?: number;
}
/**
 * Message validation schema
 */
export interface MessageSchema {
    [field: string]: {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array';
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: RegExp;
        enum?: any[];
        custom?: (value: any) => boolean;
    };
}
/**
 * WebSocket middleware context
 */
export interface WsMiddlewareContext {
    client: Socket;
    data: any;
    event: string;
    namespace: Namespace;
}
/**
 * Authentication payload
 */
export interface WsAuthPayload {
    userId: string;
    sessionId?: string;
    token?: string;
    roles?: string[];
    permissions?: string[];
    tenantId?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * 1. Creates comprehensive WebSocket gateway options with security defaults.
 *
 * @param {string} namespace - Gateway namespace (e.g., '/chat', '/notifications')
 * @param {Partial<WebSocketGatewayOptions>} customOptions - Custom configuration options
 * @returns {WebSocketGatewayOptions} Complete gateway configuration
 *
 * @example
 * ```typescript
 * @WebSocketGateway(createGatewayOptions('/chat', {
 *   cors: { origin: 'https://app.example.com' },
 *   pingInterval: 30000
 * }))
 * export class ChatGateway {}
 * ```
 */
export declare function createGatewayOptions(namespace?: string, customOptions?: Partial<WebSocketGatewayOptions>): WebSocketGatewayOptions;
/**
 * 2. Initializes WebSocket gateway with lifecycle hooks and monitoring.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} gatewayName - Gateway identifier for logging
 * @param {object} options - Initialization options
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterInit(server: Server) {
 *   initializeWebSocketGateway(server, 'ChatGateway', {
 *     enableMetrics: true,
 *     logLevel: 'verbose'
 *   });
 * }
 * ```
 */
export declare function initializeWebSocketGateway(server: Server, gatewayName: string, options?: {
    enableMetrics?: boolean;
    logLevel?: 'minimal' | 'verbose';
}): void;
/**
 * 3. Initializes client connection with metadata tracking.
 *
 * @param {Socket} client - Connected socket client
 * @param {Server} server - Socket.IO server instance
 * @param {Map<string, ConnectionState>} stateStore - Connection state storage
 * @returns {ConnectionState} Created connection state
 *
 * @example
 * ```typescript
 * handleConnection(client: Socket) {
 *   const state = initializeWebSocketConnection(client, this.server, this.connections);
 *   this.logger.log(`Client connected: ${state.socketId}`);
 * }
 * ```
 */
export declare function initializeWebSocketConnection(client: Socket, server: Server, stateStore?: Map<string, ConnectionState>): ConnectionState;
/**
 * 4. Configures WebSocket middleware for authentication and validation.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {Array<(socket: Socket, next: (err?: Error) => void) => void>} middlewares - Middleware functions
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureWebSocketMiddleware(server, [
 *   async (socket, next) => {
 *     const token = socket.handshake.auth.token;
 *     if (await validateToken(token)) {
 *       next();
 *     } else {
 *       next(new Error('Unauthorized'));
 *     }
 *   }
 * ]);
 * ```
 */
export declare function configureWebSocketMiddleware(server: Server, middlewares: Array<(socket: Socket, next: (err?: Error) => void) => void>): void;
/**
 * 5. Creates authentication middleware for WebSocket connections.
 *
 * @param {(token: string) => Promise<WsAuthPayload>} validateFn - Token validation function
 * @returns {(socket: Socket, next: (err?: Error) => void) => void} Middleware function
 *
 * @example
 * ```typescript
 * const authMiddleware = createAuthMiddleware(async (token) => {
 *   return await jwtService.verify(token);
 * });
 *
 * server.use(authMiddleware);
 * ```
 */
export declare function createAuthMiddleware(validateFn: (token: string) => Promise<WsAuthPayload>): (socket: Socket, next: (err?: Error) => void) => void;
/**
 * 6. Extracts authentication token from WebSocket handshake.
 *
 * @param {Socket} client - Socket client
 * @returns {string | null} Extracted token or null
 *
 * @example
 * ```typescript
 * const token = extractAuthToken(client);
 * if (token) {
 *   const payload = await validateToken(token);
 * }
 * ```
 */
export declare function extractAuthToken(client: Socket): string | null;
/**
 * 7. Creates and configures a WebSocket room with validation.
 *
 * @param {RoomConfiguration} config - Room configuration
 * @param {Map<string, RoomConfiguration>} roomStore - Room storage
 * @returns {RoomConfiguration} Created room configuration
 *
 * @example
 * ```typescript
 * const room = createWebSocketRoom({
 *   id: 'chat-general',
 *   name: 'General Chat',
 *   maxUsers: 100,
 *   isPrivate: false
 * }, this.rooms);
 * ```
 */
export declare function createWebSocketRoom(config: RoomConfiguration, roomStore?: Map<string, RoomConfiguration>): RoomConfiguration;
/**
 * 8. Joins client to room with capacity and permission checks.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {RoomConfiguration} roomConfig - Room configuration
 * @param {(userId: string, roomId: string) => Promise<boolean>} accessCheck - Access validation function
 * @returns {Promise<{ success: boolean; error?: string }>} Join result
 *
 * @example
 * ```typescript
 * const result = await joinWebSocketRoom(client, 'chat-123', roomConfig, async (userId, roomId) => {
 *   return await this.permissionService.canJoinRoom(userId, roomId);
 * });
 * ```
 */
export declare function joinWebSocketRoom(client: Socket, roomId: string, roomConfig?: RoomConfiguration, accessCheck?: (userId: string, roomId: string) => Promise<boolean>): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * 9. Removes client from room with cleanup.
 *
 * @param {Socket} client - Socket client
 * @param {string} roomId - Room identifier
 * @param {boolean} notifyMembers - Whether to notify other room members
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await leaveWebSocketRoom(client, 'chat-123', true);
 * ```
 */
export declare function leaveWebSocketRoom(client: Socket, roomId: string, notifyMembers?: boolean): Promise<void>;
/**
 * 10. Gets count of members in a room.
 *
 * @param {Namespace} namespace - Socket.IO namespace
 * @param {string} roomId - Room identifier
 * @returns {Promise<number>} Member count
 *
 * @example
 * ```typescript
 * const count = await getRoomMemberCount(server.of('/chat'), 'room-123');
 * console.log(`Room has ${count} members`);
 * ```
 */
export declare function getRoomMemberCount(namespace: Namespace, roomId: string): Promise<number>;
/**
 * 11. Gets list of all room members with details.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} roomId - Room identifier
 * @returns {Promise<Array<{ socketId: string; userId?: string }>>} Room members
 *
 * @example
 * ```typescript
 * const members = await getRoomMembers(this.server, 'chat-123');
 * members.forEach(member => console.log(`User ${member.userId} in room`));
 * ```
 */
export declare function getRoomMembers(server: Server, roomId: string): Promise<Array<{
    socketId: string;
    userId?: string;
    connectedAt?: Date;
}>>;
/**
 * 12. Broadcasts message to all room members except sender.
 *
 * @param {Socket} client - Socket client (sender)
 * @param {string} roomId - Room identifier
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {BroadcastConfig} config - Broadcast configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToRoomMembers(client, 'chat-123', 'message:new', {
 *   text: 'Hello everyone!',
 *   sender: userId
 * }, { compress: true });
 * ```
 */
export declare function broadcastToRoomMembers(client: Socket, roomId: string, event: string, data: any, config?: BroadcastConfig): void;
/**
 * 13. Creates dynamic namespace with custom configuration.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} namespacePath - Namespace path (e.g., '/admin')
 * @param {Partial<WebSocketGatewayOptions>} options - Namespace options
 * @returns {Namespace} Created namespace
 *
 * @example
 * ```typescript
 * const adminNamespace = createDynamicNamespace(server, '/admin', {
 *   cors: { origin: 'https://admin.example.com' }
 * });
 *
 * adminNamespace.on('connection', (socket) => {
 *   // Handle admin connections
 * });
 * ```
 */
export declare function createDynamicNamespace(server: Server, namespacePath: string, options?: Partial<WebSocketGatewayOptions>): Namespace;
/**
 * 14. Gets all active namespaces with statistics.
 *
 * @param {Server} server - Socket.IO server instance
 * @returns {Array<{ name: string; sockets: number; rooms: number }>} Namespace information
 *
 * @example
 * ```typescript
 * const namespaces = getAllNamespaces(server);
 * namespaces.forEach(ns => {
 *   console.log(`${ns.name}: ${ns.sockets} sockets, ${ns.rooms} rooms`);
 * });
 * ```
 */
export declare function getAllNamespaces(server: Server): Array<{
    name: string;
    sockets: number;
    rooms: number;
}>;
/**
 * 15. Broadcasts event to all clients in namespace.
 *
 * @param {Namespace} namespace - Socket.IO namespace
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {BroadcastConfig} config - Broadcast configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToNamespace(server.of('/notifications'), 'alert', {
 *   message: 'System maintenance in 10 minutes',
 *   severity: 'warning'
 * });
 * ```
 */
export declare function broadcastToNamespace(namespace: Namespace, event: string, data: any, config?: BroadcastConfig): void;
/**
 * 16. Creates typed event emitter with validation.
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {MessageSchema} schema - Validation schema
 * @returns {boolean} True if emitted successfully
 *
 * @example
 * ```typescript
 * emitTypedEvent(client, 'message:send', { text: 'Hello' }, {
 *   text: { type: 'string', required: true, maxLength: 1000 }
 * });
 * ```
 */
export declare function emitTypedEvent(client: Socket, event: string, data: any, schema?: MessageSchema): boolean;
/**
 * 17. Emits event with acknowledgement and timeout.
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {number} timeoutMs - Acknowledgement timeout in milliseconds
 * @returns {Promise<any>} Acknowledgement response
 *
 * @example
 * ```typescript
 * try {
 *   const response = await emitWithAcknowledgement(client, 'request:data', { id: 123 }, 5000);
 *   console.log('Response:', response);
 * } catch (error) {
 *   console.error('Request timeout');
 * }
 * ```
 */
export declare function emitWithAcknowledgement(client: Socket, event: string, data: any, timeoutMs?: number): Promise<any>;
/**
 * 18. Registers event listener with automatic cleanup.
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {(data: any) => void | Promise<void>} handler - Event handler
 * @param {object} options - Listener options
 * @returns {() => void} Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = registerEventListener(client, 'message', async (data) => {
 *   await processMessage(data);
 * }, { once: false });
 *
 * // Later: cleanup();
 * ```
 */
export declare function registerEventListener(client: Socket, event: string, handler: (data: any) => void | Promise<void>, options?: {
    once?: boolean;
    errorHandler?: (error: Error) => void;
}): () => void;
/**
 * 19. Creates message envelope for structured communication.
 *
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {Socket} sender - Sender socket
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {MessageEnvelope} Message envelope
 *
 * @example
 * ```typescript
 * const envelope = createMessageEnvelope('chat:message', {
 *   text: 'Hello',
 *   roomId: 'general'
 * }, client, { priority: 'high' });
 *
 * client.to(roomId).emit('message', envelope);
 * ```
 */
export declare function createMessageEnvelope<T = any>(event: string, data: T, sender: Socket, metadata?: Record<string, any>): MessageEnvelope<T>;
/**
 * 20. Sends event to specific user across all their connections.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User identifier
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {Promise<number>} Number of sockets that received the event
 *
 * @example
 * ```typescript
 * const sent = await sendToUser(server, 'user-123', 'notification', {
 *   message: 'You have a new message',
 *   type: 'info'
 * });
 * ```
 */
export declare function sendToUser(server: Server, userId: string, event: string, data: any): Promise<number>;
/**
 * 21. Broadcasts to all connected clients globally.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {BroadcastConfig} config - Broadcast configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastGlobally(server, 'system:announcement', {
 *   message: 'Scheduled maintenance at midnight',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare function broadcastGlobally(server: Server, event: string, data: any, config?: BroadcastConfig): void;
/**
 * 22. Broadcasts to multiple rooms simultaneously.
 *
 * @param {Socket} client - Socket client
 * @param {string[]} roomIds - Array of room identifiers
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastToMultipleRooms(client, ['room-1', 'room-2', 'room-3'], 'update', {
 *   type: 'settings_changed',
 *   settings: newSettings
 * });
 * ```
 */
export declare function broadcastToMultipleRooms(client: Socket, roomIds: string[], event: string, data: any): void;
/**
 * 23. Sends volatile event (packet loss acceptable).
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * // For high-frequency events like cursor position
 * sendVolatileEvent(client, 'cursor:move', { x: 100, y: 200 });
 * ```
 */
export declare function sendVolatileEvent(client: Socket, event: string, data: any): void;
/**
 * 24. Sends binary data over WebSocket.
 *
 * @param {Socket} client - Socket client
 * @param {string} event - Event name
 * @param {Buffer | ArrayBuffer | Blob} binaryData - Binary data
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {void}
 *
 * @example
 * ```typescript
 * const imageBuffer = await fs.promises.readFile('avatar.png');
 * sendBinaryEvent(client, 'image:upload', imageBuffer, {
 *   filename: 'avatar.png',
 *   mimetype: 'image/png'
 * });
 * ```
 */
export declare function sendBinaryEvent(client: Socket, event: string, binaryData: Buffer | ArrayBuffer | Blob, metadata?: Record<string, any>): void;
/**
 * 25. Handles client disconnection with cleanup and notifications.
 *
 * @param {Socket} client - Disconnecting socket client
 * @param {Map<string, ConnectionState>} stateStore - Connection state storage
 * @param {() => Promise<void>} cleanupCallback - Cleanup callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * async handleDisconnect(client: Socket) {
 *   await handleClientDisconnection(client, this.connections, async () => {
 *     await this.presenceService.setOffline(client.handshake.auth.userId);
 *     await this.notifyRoomsOfDisconnection(client);
 *   });
 * }
 * ```
 */
export declare function handleClientDisconnection(client: Socket, stateStore?: Map<string, ConnectionState>, cleanupCallback?: () => Promise<void>): Promise<void>;
/**
 * 26. Forcibly disconnects a client with reason.
 *
 * @param {Socket} client - Socket client to disconnect
 * @param {string} reason - Disconnection reason
 * @param {boolean} notifyClient - Whether to notify client before disconnect
 * @returns {void}
 *
 * @example
 * ```typescript
 * forceDisconnect(client, 'Idle timeout exceeded', true);
 * ```
 */
export declare function forceDisconnect(client: Socket, reason: string, notifyClient?: boolean): void;
/**
 * 27. Gets detailed connection information.
 *
 * @param {Socket} client - Socket client
 * @returns {object} Connection information
 *
 * @example
 * ```typescript
 * const info = getConnectionDetails(client);
 * console.log(`Client from ${info.ip} using ${info.transport}`);
 * ```
 */
export declare function getConnectionDetails(client: Socket): {
    socketId: string;
    userId?: string;
    ip: string;
    userAgent: string;
    transport: string;
    connectedAt: Date;
    authenticated: boolean;
    rooms: string[];
};
/**
 * 28. Monitors and disconnects idle connections.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {Map<string, ConnectionState>} stateStore - Connection state storage
 * @param {number} idleTimeoutMs - Idle timeout in milliseconds
 * @returns {Promise<number>} Number of disconnected clients
 *
 * @example
 * ```typescript
 * // Run every 5 minutes
 * setInterval(async () => {
 *   const disconnected = await monitorIdleConnections(
 *     this.server,
 *     this.connections,
 *     30 * 60 * 1000 // 30 minutes
 *   );
 *   if (disconnected > 0) {
 *     this.logger.log(`Disconnected ${disconnected} idle clients`);
 *   }
 * }, 5 * 60 * 1000);
 * ```
 */
export declare function monitorIdleConnections(server: Server, stateStore: Map<string, ConnectionState>, idleTimeoutMs: number): Promise<number>;
/**
 * 29. Sets up heartbeat monitoring for connection health.
 *
 * @param {Socket} client - Socket client
 * @param {HeartbeatOptions} options - Heartbeat configuration
 * @returns {NodeJS.Timeout} Heartbeat interval timer
 *
 * @example
 * ```typescript
 * const heartbeat = setupHeartbeatMonitoring(client, {
 *   interval: 30000,
 *   timeout: 5000,
 *   maxMissed: 3,
 *   onTimeout: (client) => {
 *     forceDisconnect(client, 'Heartbeat timeout');
 *   }
 * });
 * ```
 */
export declare function setupHeartbeatMonitoring(client: Socket, options: HeartbeatOptions): NodeJS.Timeout;
/**
 * 30. Measures round-trip time (latency).
 *
 * @param {Socket} client - Socket client
 * @returns {Promise<number>} Latency in milliseconds
 *
 * @example
 * ```typescript
 * const latency = await measureLatency(client);
 * console.log(`Client latency: ${latency}ms`);
 * ```
 */
export declare function measureLatency(client: Socket): Promise<number>;
/**
 * 31. Performs connection quality assessment.
 *
 * @param {Socket} client - Socket client
 * @param {number} sampleSize - Number of ping samples
 * @returns {Promise<{ avgLatency: number; jitter: number; packetLoss: number }>} Quality metrics
 *
 * @example
 * ```typescript
 * const quality = await assessConnectionQuality(client, 10);
 * console.log(`Latency: ${quality.avgLatency}ms, Jitter: ${quality.jitter}ms, Loss: ${quality.packetLoss}%`);
 * ```
 */
export declare function assessConnectionQuality(client: Socket, sampleSize?: number): Promise<{
    avgLatency: number;
    jitter: number;
    packetLoss: number;
}>;
/**
 * 32. Validates message payload against schema.
 *
 * @param {any} payload - Message payload
 * @param {MessageSchema} schema - Validation schema
 * @returns {boolean} True if valid
 * @throws {WsException} If validation fails
 *
 * @example
 * ```typescript
 * validateMessagePayload(data, {
 *   roomId: { type: 'string', required: true },
 *   message: { type: 'string', required: true, maxLength: 1000 },
 *   priority: { type: 'string', enum: ['low', 'medium', 'high'] }
 * });
 * ```
 */
export declare function validateMessagePayload(payload: any, schema: MessageSchema): boolean;
/**
 * 33. Sanitizes message content to prevent XSS and injection.
 *
 * @param {string} content - Message content
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized content
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeMessageContent(userInput, {
 *   allowHtml: false,
 *   maxLength: 1000,
 *   trimWhitespace: true
 * });
 * ```
 */
export declare function sanitizeMessageContent(content: string, options?: {
    allowHtml?: boolean;
    maxLength?: number;
    trimWhitespace?: boolean;
    removeUrls?: boolean;
}): string;
/**
 * 34. Creates validation middleware for WebSocket events.
 *
 * @param {MessageSchema} schema - Validation schema
 * @returns {(client: Socket, data: any, next: (err?: Error) => void) => void} Middleware function
 *
 * @example
 * ```typescript
 * const messageValidator = createValidationMiddleware({
 *   text: { type: 'string', required: true, maxLength: 1000 },
 *   roomId: { type: 'string', required: true }
 * });
 *
 * server.use(messageValidator);
 * ```
 */
export declare function createValidationMiddleware(schema: MessageSchema): (client: Socket, data: any, next: (err?: Error) => void) => void;
/**
 * 35. Creates rate limiting middleware.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {(socket: Socket, next: (err?: Error) => void) => void} Middleware function
 *
 * @example
 * ```typescript
 * const rateLimiter = createRateLimitMiddleware({
 *   maxEvents: 100,
 *   windowMs: 60000, // 1 minute
 *   blockDurationMs: 300000 // 5 minutes
 * });
 *
 * server.use(rateLimiter);
 * ```
 */
export declare function createRateLimitMiddleware(config: RateLimitConfig): (socket: Socket, next: (err?: Error) => void) => void;
/**
 * 36. Creates logging middleware for debugging.
 *
 * @param {Logger} logger - Logger instance
 * @param {object} options - Logging options
 * @returns {(socket: Socket, next: (err?: Error) => void) => void} Middleware function
 *
 * @example
 * ```typescript
 * const loggingMiddleware = createLoggingMiddleware(logger, {
 *   logHandshake: true,
 *   logEvents: true
 * });
 *
 * server.use(loggingMiddleware);
 * ```
 */
export declare function createLoggingMiddleware(logger: Logger, options?: {
    logHandshake?: boolean;
    logEvents?: boolean;
}): (socket: Socket, next: (err?: Error) => void) => void;
/**
 * 37. Creates standardized WebSocket error.
 *
 * @param {string} message - Error message
 * @param {number} code - Error code
 * @param {any} details - Additional error details
 * @returns {WsException} WebSocket exception
 *
 * @example
 * ```typescript
 * throw createWebSocketError('Room not found', 404, { roomId: 'chat-123' });
 * ```
 */
export declare function createWebSocketError(message: string, code?: number, details?: any): WsException;
/**
 * 38. Handles and logs WebSocket errors.
 *
 * @param {Error} error - Error object
 * @param {Socket} client - Socket client
 * @param {string} context - Error context
 * @returns {void}
 *
 * @example
 * ```typescript
 * try {
 *   await processMessage(data);
 * } catch (error) {
 *   handleWebSocketError(error, client, 'message:send');
 * }
 * ```
 */
export declare function handleWebSocketError(error: Error, client: Socket, context: string): void;
/**
 * 39. Handles client reconnection with session restoration.
 *
 * @param {Socket} client - Reconnecting socket client
 * @param {Map<string, any>} sessionStore - Session storage
 * @returns {any | null} Restored session data
 *
 * @example
 * ```typescript
 * handleConnection(client: Socket) {
 *   const session = handleReconnection(client, this.sessions);
 *   if (session) {
 *     // Restore user state, rejoin rooms, etc.
 *     session.rooms.forEach(room => client.join(room));
 *   }
 * }
 * ```
 */
export declare function handleReconnection(client: Socket, sessionStore: Map<string, any>): any | null;
/**
 * 40. Creates session for reconnection support.
 *
 * @param {Socket} client - Socket client
 * @param {Map<string, any>} sessionStore - Session storage
 * @param {number} ttlMs - Session TTL in milliseconds
 * @returns {string} Session ID
 *
 * @example
 * ```typescript
 * const sessionId = createReconnectionSession(client, this.sessions, 5 * 60 * 1000);
 * client.emit('session:created', { sessionId });
 * ```
 */
export declare function createReconnectionSession(client: Socket, sessionStore: Map<string, any>, ttlMs?: number): string;
/**
 * 41. Tracks user presence and status.
 *
 * @param {Map<string, UserPresenceInfo>} presenceStore - Presence storage
 * @param {string} userId - User identifier
 * @param {string} socketId - Socket identifier
 * @param {UserPresenceInfo['status']} status - User status
 * @param {Partial<UserPresenceInfo>} metadata - Additional metadata
 * @returns {UserPresenceInfo} Presence information
 *
 * @example
 * ```typescript
 * const presence = trackUserPresence(
 *   this.presenceStore,
 *   'user-123',
 *   client.id,
 *   'online',
 *   { device: 'mobile', location: 'New York' }
 * );
 * ```
 */
export declare function trackUserPresence(presenceStore: Map<string, UserPresenceInfo>, userId: string, socketId: string, status: UserPresenceInfo['status'], metadata?: Partial<UserPresenceInfo>): UserPresenceInfo;
/**
 * 42. Gets user presence information.
 *
 * @param {Map<string, UserPresenceInfo>} presenceStore - Presence storage
 * @param {string} userId - User identifier
 * @returns {UserPresenceInfo | null} Presence information or null
 *
 * @example
 * ```typescript
 * const presence = getUserPresenceInfo(this.presenceStore, 'user-123');
 * if (presence?.status === 'online') {
 *   console.log('User is online');
 * }
 * ```
 */
export declare function getUserPresenceInfo(presenceStore: Map<string, UserPresenceInfo>, userId: string): UserPresenceInfo | null;
/**
 * 43. Broadcasts presence update to subscribers.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {UserPresenceInfo} presence - Presence information
 * @param {string[]} targetRooms - Rooms to notify
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastPresenceUpdate(this.server, {
 *   userId: 'user-123',
 *   socketId: client.id,
 *   status: 'away',
 *   lastSeen: new Date()
 * }, ['room-1', 'room-2']);
 * ```
 */
export declare function broadcastPresenceUpdate(server: Server, presence: UserPresenceInfo, targetRooms: string[]): void;
/**
 * 44. Creates Redis adapter for horizontal scaling.
 *
 * @param {RedisClientType} pubClient - Redis publisher client
 * @param {RedisClientType} subClient - Redis subscriber client
 * @param {object} options - Adapter options
 * @returns {ReturnType<typeof createAdapter>} Redis adapter
 *
 * @example
 * ```typescript
 * const pubClient = createClient({ url: 'redis://localhost:6379' });
 * const subClient = pubClient.duplicate();
 *
 * await Promise.all([pubClient.connect(), subClient.connect()]);
 *
 * const adapter = createRedisAdapter(pubClient, subClient, {
 *   keyPrefix: 'socket.io:',
 *   requestsTimeout: 5000
 * });
 *
 * server.adapter(adapter);
 * ```
 */
export declare function createRedisAdapter(pubClient: RedisClientType, subClient: RedisClientType, options?: {
    keyPrefix?: string;
    requestsTimeout?: number;
}): ReturnType<typeof createAdapter>;
/**
 * 45. Publishes event to Redis for cross-server communication.
 *
 * @param {RedisClientType} redisClient - Redis client
 * @param {string} channel - Redis channel
 * @param {any} message - Message to publish
 * @returns {Promise<number>} Number of subscribers that received the message
 *
 * @example
 * ```typescript
 * await publishToRedisChannel(redisClient, 'notifications', {
 *   type: 'user:status',
 *   userId: 'user-123',
 *   status: 'online',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare function publishToRedisChannel(redisClient: RedisClientType, channel: string, message: any): Promise<number>;
declare const _default: {
    createGatewayOptions: typeof createGatewayOptions;
    initializeWebSocketGateway: typeof initializeWebSocketGateway;
    initializeWebSocketConnection: typeof initializeWebSocketConnection;
    configureWebSocketMiddleware: typeof configureWebSocketMiddleware;
    createAuthMiddleware: typeof createAuthMiddleware;
    extractAuthToken: typeof extractAuthToken;
    createWebSocketRoom: typeof createWebSocketRoom;
    joinWebSocketRoom: typeof joinWebSocketRoom;
    leaveWebSocketRoom: typeof leaveWebSocketRoom;
    getRoomMemberCount: typeof getRoomMemberCount;
    getRoomMembers: typeof getRoomMembers;
    broadcastToRoomMembers: typeof broadcastToRoomMembers;
    createDynamicNamespace: typeof createDynamicNamespace;
    getAllNamespaces: typeof getAllNamespaces;
    broadcastToNamespace: typeof broadcastToNamespace;
    emitTypedEvent: typeof emitTypedEvent;
    emitWithAcknowledgement: typeof emitWithAcknowledgement;
    registerEventListener: typeof registerEventListener;
    createMessageEnvelope: typeof createMessageEnvelope;
    sendToUser: typeof sendToUser;
    broadcastGlobally: typeof broadcastGlobally;
    broadcastToMultipleRooms: typeof broadcastToMultipleRooms;
    sendVolatileEvent: typeof sendVolatileEvent;
    sendBinaryEvent: typeof sendBinaryEvent;
    handleClientDisconnection: typeof handleClientDisconnection;
    forceDisconnect: typeof forceDisconnect;
    getConnectionDetails: typeof getConnectionDetails;
    monitorIdleConnections: typeof monitorIdleConnections;
    setupHeartbeatMonitoring: typeof setupHeartbeatMonitoring;
    measureLatency: typeof measureLatency;
    assessConnectionQuality: typeof assessConnectionQuality;
    validateMessagePayload: typeof validateMessagePayload;
    sanitizeMessageContent: typeof sanitizeMessageContent;
    createValidationMiddleware: typeof createValidationMiddleware;
    createRateLimitMiddleware: typeof createRateLimitMiddleware;
    createLoggingMiddleware: typeof createLoggingMiddleware;
    createWebSocketError: typeof createWebSocketError;
    handleWebSocketError: typeof handleWebSocketError;
    handleReconnection: typeof handleReconnection;
    createReconnectionSession: typeof createReconnectionSession;
    trackUserPresence: typeof trackUserPresence;
    getUserPresenceInfo: typeof getUserPresenceInfo;
    broadcastPresenceUpdate: typeof broadcastPresenceUpdate;
    createRedisAdapter: typeof createRedisAdapter;
    publishToRedisChannel: typeof publishToRedisChannel;
};
export default _default;
//# sourceMappingURL=websocket-real-time-kit.d.ts.map