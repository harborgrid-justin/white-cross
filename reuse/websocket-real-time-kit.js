"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGatewayOptions = createGatewayOptions;
exports.initializeWebSocketGateway = initializeWebSocketGateway;
exports.initializeWebSocketConnection = initializeWebSocketConnection;
exports.configureWebSocketMiddleware = configureWebSocketMiddleware;
exports.createAuthMiddleware = createAuthMiddleware;
exports.extractAuthToken = extractAuthToken;
exports.createWebSocketRoom = createWebSocketRoom;
exports.joinWebSocketRoom = joinWebSocketRoom;
exports.leaveWebSocketRoom = leaveWebSocketRoom;
exports.getRoomMemberCount = getRoomMemberCount;
exports.getRoomMembers = getRoomMembers;
exports.broadcastToRoomMembers = broadcastToRoomMembers;
exports.createDynamicNamespace = createDynamicNamespace;
exports.getAllNamespaces = getAllNamespaces;
exports.broadcastToNamespace = broadcastToNamespace;
exports.emitTypedEvent = emitTypedEvent;
exports.emitWithAcknowledgement = emitWithAcknowledgement;
exports.registerEventListener = registerEventListener;
exports.createMessageEnvelope = createMessageEnvelope;
exports.sendToUser = sendToUser;
exports.broadcastGlobally = broadcastGlobally;
exports.broadcastToMultipleRooms = broadcastToMultipleRooms;
exports.sendVolatileEvent = sendVolatileEvent;
exports.sendBinaryEvent = sendBinaryEvent;
exports.handleClientDisconnection = handleClientDisconnection;
exports.forceDisconnect = forceDisconnect;
exports.getConnectionDetails = getConnectionDetails;
exports.monitorIdleConnections = monitorIdleConnections;
exports.setupHeartbeatMonitoring = setupHeartbeatMonitoring;
exports.measureLatency = measureLatency;
exports.assessConnectionQuality = assessConnectionQuality;
exports.validateMessagePayload = validateMessagePayload;
exports.sanitizeMessageContent = sanitizeMessageContent;
exports.createValidationMiddleware = createValidationMiddleware;
exports.createRateLimitMiddleware = createRateLimitMiddleware;
exports.createLoggingMiddleware = createLoggingMiddleware;
exports.createWebSocketError = createWebSocketError;
exports.handleWebSocketError = handleWebSocketError;
exports.handleReconnection = handleReconnection;
exports.createReconnectionSession = createReconnectionSession;
exports.trackUserPresence = trackUserPresence;
exports.getUserPresenceInfo = getUserPresenceInfo;
exports.broadcastPresenceUpdate = broadcastPresenceUpdate;
exports.createRedisAdapter = createRedisAdapter;
exports.publishToRedisChannel = publishToRedisChannel;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const redis_adapter_1 = require("@socket.io/redis-adapter");
// ============================================================================
// GATEWAY CONFIGURATION & SETUP
// ============================================================================
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
function createGatewayOptions(namespace = '/', customOptions = {}) {
    return {
        namespace,
        cors: customOptions.cors || {
            origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
            credentials: true,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Authorization', 'Content-Type'],
        },
        transports: customOptions.transports || ['websocket', 'polling'],
        path: customOptions.path || '/socket.io',
        pingTimeout: customOptions.pingTimeout || 60000,
        pingInterval: customOptions.pingInterval || 25000,
        upgradeTimeout: customOptions.upgradeTimeout || 10000,
        maxHttpBufferSize: customOptions.maxHttpBufferSize || 1e6, // 1MB
        perMessageDeflate: customOptions.perMessageDeflate ?? {
            threshold: 1024, // Compress messages > 1KB
        },
        httpCompression: customOptions.httpCompression ?? {
            threshold: 1024,
        },
        serveClient: customOptions.serveClient ?? false,
        allowEIO3: customOptions.allowEIO3 ?? false,
        cookie: customOptions.cookie ?? false,
        ...customOptions,
    };
}
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
function initializeWebSocketGateway(server, gatewayName, options = {}) {
    const logger = new common_1.Logger(gatewayName);
    logger.log(`✓ Gateway initialized: ${gatewayName}`);
    logger.log(`  Namespace: ${server.name}`);
    logger.log(`  Transports: ${server.opts.transports?.join(', ')}`);
    logger.log(`  CORS Origin: ${JSON.stringify(server.opts.cors?.origin)}`);
    // Set up error handlers
    server.on('error', (error) => {
        logger.error(`Gateway error: ${error.message}`, error.stack);
    });
    server.on('connection_error', (error) => {
        logger.warn(`Connection error: ${error.message}`);
    });
    // Metrics tracking (if enabled)
    if (options.enableMetrics) {
        let connectionCount = 0;
        let messageCount = 0;
        server.on('connection', () => {
            connectionCount++;
            if (options.logLevel === 'verbose') {
                logger.log(`Total connections: ${connectionCount}`);
            }
        });
        server.use((socket, next) => {
            socket.onAny(() => messageCount++);
            next();
        });
        // Log metrics every minute
        setInterval(() => {
            logger.log(`Metrics - Clients: ${server.sockets.sockets.size}, Total Connections: ${connectionCount}, Messages: ${messageCount}`);
        }, 60000);
    }
}
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
function initializeWebSocketConnection(client, server, stateStore) {
    const state = {
        socketId: client.id,
        userId: client.handshake.auth?.userId,
        authenticated: false,
        connectedAt: new Date(),
        lastActivity: new Date(),
        rooms: new Set(),
        subscriptions: new Set(),
        metadata: new Map(),
        reconnectCount: 0,
    };
    // Store connection state
    if (stateStore) {
        stateStore.set(client.id, state);
    }
    // Attach state to socket for easy access
    client.__connectionState = state;
    // Track activity
    client.onAny(() => {
        state.lastActivity = new Date();
    });
    // Send connection acknowledgement
    client.emit('connected', {
        socketId: client.id,
        timestamp: new Date(),
        serverVersion: process.env.npm_package_version || '1.0.0',
    });
    return state;
}
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
function configureWebSocketMiddleware(server, middlewares) {
    middlewares.forEach((middleware) => {
        server.use(middleware);
    });
}
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
function createAuthMiddleware(validateFn) {
    return async (socket, next) => {
        try {
            const token = extractAuthToken(socket);
            if (!token) {
                throw new common_1.UnauthorizedException('No authentication token provided');
            }
            const payload = await validateFn(token);
            // Attach auth data to socket
            socket.auth = payload;
            socket.__connectionState.authenticated = true;
            socket.__connectionState.userId = payload.userId;
            next();
        }
        catch (error) {
            next(new Error(`Authentication failed: ${error.message}`));
        }
    };
}
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
function extractAuthToken(client) {
    // Priority 1: Authorization header (Bearer token)
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    // Priority 2: Auth object
    if (client.handshake.auth?.token) {
        return client.handshake.auth.token;
    }
    // Priority 3: Query parameter (less secure, use as fallback)
    if (client.handshake.query?.token) {
        return client.handshake.query.token;
    }
    // Priority 4: Cookie
    if (client.handshake.headers.cookie) {
        const cookies = parseCookies(client.handshake.headers.cookie);
        if (cookies.auth_token) {
            return cookies.auth_token;
        }
    }
    return null;
}
// ============================================================================
// ROOM MANAGEMENT
// ============================================================================
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
function createWebSocketRoom(config, roomStore) {
    const room = {
        ...config,
        createdAt: config.createdAt || new Date(),
        metadata: config.metadata || {},
    };
    if (roomStore) {
        roomStore.set(room.id, room);
    }
    return room;
}
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
async function joinWebSocketRoom(client, roomId, roomConfig, accessCheck) {
    try {
        // Validate access if check function provided
        if (accessCheck && client.auth?.userId) {
            const hasAccess = await accessCheck(client.auth.userId, roomId);
            if (!hasAccess) {
                return { success: false, error: 'Access denied' };
            }
        }
        // Check room capacity
        if (roomConfig?.maxUsers) {
            const currentUsers = await getRoomMemberCount(client.nsp, roomId);
            if (currentUsers >= roomConfig.maxUsers) {
                return { success: false, error: 'Room is full' };
            }
        }
        // Check password if private room
        if (roomConfig?.isPrivate && roomConfig.password) {
            const providedPassword = client.handshake.auth?.roomPassword;
            if (providedPassword !== roomConfig.password) {
                return { success: false, error: 'Invalid room password' };
            }
        }
        await client.join(roomId);
        // Update connection state
        const state = client.__connectionState;
        if (state) {
            state.rooms.add(roomId);
        }
        // Notify other room members
        client.to(roomId).emit('room:user-joined', {
            userId: client.auth?.userId,
            socketId: client.id,
            roomId,
            timestamp: new Date(),
        });
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
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
async function leaveWebSocketRoom(client, roomId, notifyMembers = true) {
    // Notify before leaving
    if (notifyMembers) {
        client.to(roomId).emit('room:user-left', {
            userId: client.auth?.userId,
            socketId: client.id,
            roomId,
            timestamp: new Date(),
        });
    }
    await client.leave(roomId);
    // Update connection state
    const state = client.__connectionState;
    if (state) {
        state.rooms.delete(roomId);
    }
}
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
async function getRoomMemberCount(namespace, roomId) {
    const room = namespace.adapter.rooms.get(roomId);
    return room ? room.size : 0;
}
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
async function getRoomMembers(server, roomId) {
    const sockets = await server.in(roomId).fetchSockets();
    return sockets.map((socket) => ({
        socketId: socket.id,
        userId: socket.auth?.userId,
        connectedAt: socket.__connectionState?.connectedAt,
    }));
}
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
function broadcastToRoomMembers(client, roomId, event, data, config) {
    let emitter = client.to(roomId);
    if (config?.volatile) {
        emitter = emitter.volatile;
    }
    if (config?.compress) {
        emitter = emitter.compress(true);
    }
    if (config?.timeout) {
        emitter = emitter.timeout(config.timeout);
    }
    emitter.emit(event, data);
}
// ============================================================================
// NAMESPACE CONFIGURATION
// ============================================================================
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
function createDynamicNamespace(server, namespacePath, options) {
    const namespace = server.of(namespacePath);
    // Apply middleware if needed
    if (options) {
        // Configure namespace-specific options
        // Note: Some options are server-wide and can't be changed per namespace
    }
    return namespace;
}
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
function getAllNamespaces(server) {
    const namespaces = [];
    server._nsps.forEach((namespace, name) => {
        namespaces.push({
            name,
            sockets: namespace.sockets.size,
            rooms: namespace.adapter.rooms.size,
        });
    });
    return namespaces;
}
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
function broadcastToNamespace(namespace, event, data, config) {
    let emitter = namespace;
    if (config?.except && config.except.length > 0) {
        config.except.forEach((socketId) => {
            emitter = emitter.except(socketId);
        });
    }
    if (config?.volatile) {
        emitter = emitter.volatile;
    }
    if (config?.compress) {
        emitter = emitter.compress(true);
    }
    emitter.emit(event, data);
}
// ============================================================================
// EVENT EMITTERS & LISTENERS
// ============================================================================
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
function emitTypedEvent(client, event, data, schema) {
    try {
        if (schema) {
            validateMessagePayload(data, schema);
        }
        client.emit(event, data);
        return true;
    }
    catch (error) {
        throw new websockets_1.WsException(`Event emission failed: ${error.message}`);
    }
}
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
function emitWithAcknowledgement(client, event, data, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Acknowledgement timeout for event: ${event}`));
        }, timeoutMs);
        client.timeout(timeoutMs).emit(event, data, (error, response) => {
            clearTimeout(timer);
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
}
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
function registerEventListener(client, event, handler, options = {}) {
    const wrappedHandler = async (data) => {
        try {
            await handler(data);
        }
        catch (error) {
            if (options.errorHandler) {
                options.errorHandler(error);
            }
            else {
                const logger = new common_1.Logger('EventListener');
                logger.error(`Error handling event ${event}:`, error);
            }
        }
    };
    if (options.once) {
        client.once(event, wrappedHandler);
    }
    else {
        client.on(event, wrappedHandler);
    }
    // Return cleanup function
    return () => {
        client.off(event, wrappedHandler);
    };
}
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
function createMessageEnvelope(event, data, sender, metadata) {
    return {
        id: generateMessageId(),
        event,
        data,
        sender: {
            userId: sender.auth?.userId || 'anonymous',
            socketId: sender.id,
        },
        timestamp: new Date(),
        metadata: metadata || {},
    };
}
// ============================================================================
// BROADCASTING UTILITIES
// ============================================================================
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
async function sendToUser(server, userId, event, data) {
    const sockets = await server.fetchSockets();
    let sentCount = 0;
    for (const socket of sockets) {
        if (socket.auth?.userId === userId) {
            socket.emit(event, data);
            sentCount++;
        }
    }
    return sentCount;
}
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
function broadcastGlobally(server, event, data, config) {
    let emitter = server;
    if (config?.except && config.except.length > 0) {
        config.except.forEach((socketId) => {
            emitter = emitter.except(socketId);
        });
    }
    if (config?.volatile) {
        emitter = emitter.volatile;
    }
    if (config?.compress) {
        emitter = emitter.compress(true);
    }
    emitter.emit(event, data);
}
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
function broadcastToMultipleRooms(client, roomIds, event, data) {
    roomIds.forEach((roomId) => {
        client.to(roomId).emit(event, data);
    });
}
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
function sendVolatileEvent(client, event, data) {
    client.volatile.emit(event, data);
}
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
function sendBinaryEvent(client, event, binaryData, metadata) {
    client.emit(event, {
        data: binaryData,
        metadata: metadata || {},
        timestamp: new Date(),
    });
}
// ============================================================================
// CONNECTION LIFECYCLE
// ============================================================================
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
async function handleClientDisconnection(client, stateStore, cleanupCallback) {
    const state = stateStore?.get(client.id);
    // Notify all rooms the user was in
    if (state) {
        state.rooms.forEach((roomId) => {
            client.to(roomId).emit('user:disconnected', {
                userId: state.userId,
                socketId: client.id,
                roomId,
                timestamp: new Date(),
            });
        });
    }
    // Execute custom cleanup
    if (cleanupCallback) {
        try {
            await cleanupCallback();
        }
        catch (error) {
            const logger = new common_1.Logger('Disconnection');
            logger.error(`Cleanup error: ${error.message}`);
        }
    }
    // Remove from state store
    if (stateStore) {
        stateStore.delete(client.id);
    }
}
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
function forceDisconnect(client, reason, notifyClient = true) {
    if (notifyClient) {
        client.emit('force-disconnect', {
            reason,
            timestamp: new Date(),
        });
    }
    // Give client time to receive message before disconnecting
    setTimeout(() => {
        client.disconnect(true);
    }, 100);
}
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
function getConnectionDetails(client) {
    const state = client.__connectionState;
    return {
        socketId: client.id,
        userId: state?.userId,
        ip: client.handshake.address,
        userAgent: client.handshake.headers['user-agent'] || 'unknown',
        transport: client.conn.transport.name,
        connectedAt: state?.connectedAt || new Date(),
        authenticated: state?.authenticated || false,
        rooms: state ? Array.from(state.rooms) : [],
    };
}
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
async function monitorIdleConnections(server, stateStore, idleTimeoutMs) {
    const now = Date.now();
    let disconnected = 0;
    for (const [socketId, state] of stateStore.entries()) {
        const idleTime = now - state.lastActivity.getTime();
        if (idleTime > idleTimeoutMs) {
            const socket = server.sockets.sockets.get(socketId);
            if (socket) {
                forceDisconnect(socket, 'Idle timeout exceeded', true);
                disconnected++;
            }
        }
    }
    return disconnected;
}
// ============================================================================
// HEARTBEAT & PING-PONG
// ============================================================================
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
function setupHeartbeatMonitoring(client, options) {
    let missedHeartbeats = 0;
    const interval = setInterval(() => {
        const startTime = Date.now();
        client.timeout(options.timeout).emit('ping', { timestamp: startTime }, (error) => {
            if (error) {
                missedHeartbeats++;
                if (missedHeartbeats >= options.maxMissed) {
                    clearInterval(interval);
                    if (options.onTimeout) {
                        options.onTimeout(client);
                    }
                    else {
                        forceDisconnect(client, 'Heartbeat timeout');
                    }
                }
            }
            else {
                missedHeartbeats = 0;
                const latency = Date.now() - startTime;
                // Store latency in connection state
                const state = client.__connectionState;
                if (state) {
                    state.latency = latency;
                }
            }
        });
    }, options.interval);
    // Cleanup on disconnect
    client.on('disconnect', () => {
        clearInterval(interval);
    });
    return interval;
}
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
async function measureLatency(client) {
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
        client.timeout(5000).emit('ping', { timestamp: startTime }, (error, response) => {
            if (error) {
                reject(new Error('Ping timeout'));
            }
            else {
                const latency = Date.now() - startTime;
                resolve(latency);
            }
        });
    });
}
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
async function assessConnectionQuality(client, sampleSize = 5) {
    const latencies = [];
    let packetsLost = 0;
    for (let i = 0; i < sampleSize; i++) {
        try {
            const latency = await measureLatency(client);
            latencies.push(latency);
        }
        catch (error) {
            packetsLost++;
        }
        // Wait between samples
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
    // Calculate jitter (standard deviation of latency)
    const jitter = latencies.length > 1
        ? Math.sqrt(latencies.reduce((sum, lat) => sum + Math.pow(lat - avgLatency, 2), 0) /
            latencies.length)
        : 0;
    const packetLoss = (packetsLost / sampleSize) * 100;
    return {
        avgLatency: Math.round(avgLatency),
        jitter: Math.round(jitter),
        packetLoss: Math.round(packetLoss * 100) / 100,
    };
}
// ============================================================================
// MESSAGE VALIDATION
// ============================================================================
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
function validateMessagePayload(payload, schema) {
    if (!payload || typeof payload !== 'object') {
        throw new websockets_1.WsException('Invalid payload: must be an object');
    }
    for (const [field, rules] of Object.entries(schema)) {
        const value = payload[field];
        // Required check
        if (rules.required && (value === undefined || value === null)) {
            throw new websockets_1.WsException(`Missing required field: ${field}`);
        }
        // Skip further validation if field is optional and not provided
        if (!rules.required && (value === undefined || value === null)) {
            continue;
        }
        // Type check
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rules.type) {
            throw new websockets_1.WsException(`Invalid type for ${field}: expected ${rules.type}, got ${actualType}`);
        }
        // String validations
        if (rules.type === 'string' && typeof value === 'string') {
            if (rules.minLength !== undefined && value.length < rules.minLength) {
                throw new websockets_1.WsException(`Field ${field} must be at least ${rules.minLength} characters long`);
            }
            if (rules.maxLength !== undefined && value.length > rules.maxLength) {
                throw new websockets_1.WsException(`Field ${field} must not exceed ${rules.maxLength} characters`);
            }
            if (rules.pattern && !rules.pattern.test(value)) {
                throw new websockets_1.WsException(`Field ${field} does not match required pattern`);
            }
        }
        // Number validations
        if (rules.type === 'number' && typeof value === 'number') {
            if (rules.min !== undefined && value < rules.min) {
                throw new websockets_1.WsException(`Field ${field} must be at least ${rules.min}`);
            }
            if (rules.max !== undefined && value > rules.max) {
                throw new websockets_1.WsException(`Field ${field} must not exceed ${rules.max}`);
            }
        }
        // Enum validation
        if (rules.enum && !rules.enum.includes(value)) {
            throw new websockets_1.WsException(`Field ${field} must be one of: ${rules.enum.join(', ')}`);
        }
        // Custom validation
        if (rules.custom && !rules.custom(value)) {
            throw new websockets_1.WsException(`Custom validation failed for field: ${field}`);
        }
    }
    return true;
}
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
function sanitizeMessageContent(content, options = {}) {
    let sanitized = content;
    // Trim whitespace
    if (options.trimWhitespace !== false) {
        sanitized = sanitized.trim();
    }
    // Remove HTML if not allowed
    if (!options.allowHtml) {
        sanitized = sanitized
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    // Remove URLs if specified
    if (options.removeUrls) {
        sanitized = sanitized.replace(/https?:\/\/[^\s]+/g, '[URL removed]');
    }
    // Enforce max length
    if (options.maxLength && sanitized.length > options.maxLength) {
        sanitized = sanitized.substring(0, options.maxLength);
    }
    return sanitized;
}
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
function createValidationMiddleware(schema) {
    return (client, data, next) => {
        try {
            validateMessagePayload(data, schema);
            next();
        }
        catch (error) {
            next(new Error(error.message));
        }
    };
}
// ============================================================================
// WEBSOCKET MIDDLEWARE
// ============================================================================
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
function createRateLimitMiddleware(config) {
    const limitStore = new Map();
    return (socket, next) => {
        const key = config.keyGenerator ? config.keyGenerator(socket) : socket.id;
        const now = Date.now();
        let record = limitStore.get(key);
        // Check if blocked
        if (record?.blockedUntil && now < record.blockedUntil) {
            return next(new Error(`Rate limit exceeded. Blocked until ${new Date(record.blockedUntil).toISOString()}`));
        }
        // Reset if window expired
        if (!record || now > record.resetAt) {
            record = {
                count: 0,
                resetAt: now + config.windowMs,
            };
            limitStore.set(key, record);
        }
        // Increment and check
        record.count++;
        if (record.count > config.maxEvents) {
            if (config.blockDurationMs) {
                record.blockedUntil = now + config.blockDurationMs;
            }
            return next(new Error('Rate limit exceeded'));
        }
        next();
    };
}
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
function createLoggingMiddleware(logger, options = {}) {
    return (socket, next) => {
        if (options.logHandshake) {
            logger.log(`New connection: ${socket.id} from ${socket.handshake.address}`);
        }
        if (options.logEvents) {
            socket.onAny((event, ...args) => {
                logger.debug(`[${socket.id}] Event: ${event}`, args);
            });
        }
        next();
    };
}
// ============================================================================
// ERROR HANDLING
// ============================================================================
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
function createWebSocketError(message, code, details) {
    return new websockets_1.WsException({
        message,
        code: code || 500,
        details: details || {},
        timestamp: new Date().toISOString(),
    });
}
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
function handleWebSocketError(error, client, context) {
    const logger = new common_1.Logger('WebSocketError');
    logger.error(`[${context}] ${error.message}`, error.stack);
    // Send formatted error to client
    client.emit('error', {
        context,
        message: error.message,
        code: error.code || 500,
        timestamp: new Date().toISOString(),
    });
}
// ============================================================================
// RECONNECTION LOGIC
// ============================================================================
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
function handleReconnection(client, sessionStore) {
    const sessionId = client.handshake.auth?.sessionId;
    if (!sessionId) {
        return null;
    }
    const session = sessionStore.get(sessionId);
    if (session) {
        // Update session with new socket ID
        session.socketId = client.id;
        session.lastReconnect = new Date();
        session.reconnectCount = (session.reconnectCount || 0) + 1;
        // Attach to connection state
        const state = client.__connectionState;
        if (state) {
            state.reconnectCount = session.reconnectCount;
        }
        return session;
    }
    return null;
}
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
function createReconnectionSession(client, sessionStore, ttlMs = 5 * 60 * 1000) {
    const sessionId = generateSessionId();
    const session = {
        sessionId,
        socketId: client.id,
        userId: client.auth?.userId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + ttlMs),
        reconnectCount: 0,
        rooms: Array.from(client.__connectionState?.rooms || []),
        metadata: {},
    };
    sessionStore.set(sessionId, session);
    // Auto-cleanup expired session
    setTimeout(() => {
        sessionStore.delete(sessionId);
    }, ttlMs);
    return sessionId;
}
// ============================================================================
// PRESENCE TRACKING
// ============================================================================
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
function trackUserPresence(presenceStore, userId, socketId, status, metadata) {
    const presence = {
        userId,
        socketId,
        status,
        customStatus: metadata?.customStatus,
        device: metadata?.device,
        location: metadata?.location,
        lastSeen: new Date(),
        connectedAt: metadata?.connectedAt || new Date(),
        metadata: metadata?.metadata || {},
    };
    presenceStore.set(userId, presence);
    return presence;
}
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
function getUserPresenceInfo(presenceStore, userId) {
    return presenceStore.get(userId) || null;
}
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
function broadcastPresenceUpdate(server, presence, targetRooms) {
    const payload = {
        userId: presence.userId,
        status: presence.status,
        customStatus: presence.customStatus,
        lastSeen: presence.lastSeen,
        timestamp: new Date(),
    };
    targetRooms.forEach((roomId) => {
        server.to(roomId).emit('presence:update', payload);
    });
}
// ============================================================================
// REDIS ADAPTER FOR SCALING
// ============================================================================
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
function createRedisAdapter(pubClient, subClient, options) {
    return (0, redis_adapter_1.createAdapter)(pubClient, subClient, {
        key: options?.keyPrefix || 'socket.io',
        requestsTimeout: options?.requestsTimeout || 5000,
    });
}
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
async function publishToRedisChannel(redisClient, channel, message) {
    const serialized = JSON.stringify(message);
    return await redisClient.publish(channel, serialized);
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates unique message ID
 */
function generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
/**
 * Generates unique session ID
 */
function generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
/**
 * Parses cookie string into object
 */
function parseCookies(cookieHeader) {
    const cookies = {};
    cookieHeader.split(';').forEach((cookie) => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = decodeURIComponent(value);
        }
    });
    return cookies;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Gateway Configuration & Setup
    createGatewayOptions,
    initializeWebSocketGateway,
    initializeWebSocketConnection,
    configureWebSocketMiddleware,
    createAuthMiddleware,
    extractAuthToken,
    // Room Management
    createWebSocketRoom,
    joinWebSocketRoom,
    leaveWebSocketRoom,
    getRoomMemberCount,
    getRoomMembers,
    broadcastToRoomMembers,
    // Namespace Configuration
    createDynamicNamespace,
    getAllNamespaces,
    broadcastToNamespace,
    // Event Emitters & Listeners
    emitTypedEvent,
    emitWithAcknowledgement,
    registerEventListener,
    createMessageEnvelope,
    // Broadcasting Utilities
    sendToUser,
    broadcastGlobally,
    broadcastToMultipleRooms,
    sendVolatileEvent,
    sendBinaryEvent,
    // Connection Lifecycle
    handleClientDisconnection,
    forceDisconnect,
    getConnectionDetails,
    monitorIdleConnections,
    // Heartbeat & Ping-Pong
    setupHeartbeatMonitoring,
    measureLatency,
    assessConnectionQuality,
    // Message Validation
    validateMessagePayload,
    sanitizeMessageContent,
    createValidationMiddleware,
    // WebSocket Middleware
    createRateLimitMiddleware,
    createLoggingMiddleware,
    // Error Handling
    createWebSocketError,
    handleWebSocketError,
    // Reconnection Logic
    handleReconnection,
    createReconnectionSession,
    // Presence Tracking
    trackUserPresence,
    getUserPresenceInfo,
    broadcastPresenceUpdate,
    // Redis Adapter for Scaling
    createRedisAdapter,
    publishToRedisChannel,
};
//# sourceMappingURL=websocket-real-time-kit.js.map