"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGatewayConfig = createGatewayConfig;
exports.initializeGateway = initializeGateway;
exports.handleConnectionLifecycle = handleConnectionLifecycle;
exports.handleDisconnectionCleanup = handleDisconnectionCleanup;
exports.createGatewayMiddleware = createGatewayMiddleware;
exports.getGatewayStats = getGatewayStats;
exports.joinRoom = joinRoom;
exports.leaveRoom = leaveRoom;
exports.getRoomClients = getRoomClients;
exports.getClientRooms = getClientRooms;
exports.broadcastToRoom = broadcastToRoom;
exports.closeRoom = closeRoom;
exports.createNamespace = createNamespace;
exports.getActiveNamespaces = getActiveNamespaces;
exports.broadcastToNamespace = broadcastToNamespace;
exports.getNamespaceStats = getNamespaceStats;
exports.disconnectNamespace = disconnectNamespace;
exports.validateWsAuth = validateWsAuth;
exports.extractWsToken = extractWsToken;
exports.checkWsRole = checkWsRole;
exports.createWsJwtGuard = createWsJwtGuard;
exports.validateRoomAccess = validateRoomAccess;
exports.createEventRateLimiter = createEventRateLimiter;
exports.sendToUser = sendToUser;
exports.broadcastToAll = broadcastToAll;
exports.sendWithAck = sendWithAck;
exports.broadcastToMultipleRooms = broadcastToMultipleRooms;
exports.emitVolatile = emitVolatile;
exports.sendBinaryData = sendBinaryData;
exports.broadcastCompressed = broadcastCompressed;
exports.disconnectClient = disconnectClient;
exports.getConnectionInfo = getConnectionInfo;
exports.handleReconnection = handleReconnection;
exports.monitorIdleConnections = monitorIdleConnections;
exports.setupHeartbeat = setupHeartbeat;
exports.handlePong = handlePong;
exports.getClientLatency = getClientLatency;
exports.measureConnectionQuality = measureConnectionQuality;
exports.setUserPresence = setUserPresence;
exports.getUserPresence = getUserPresence;
exports.trackTypingIndicator = trackTypingIndicator;
exports.getOnlineUsersInRoom = getOnlineUsersInRoom;
exports.broadcastPresenceUpdate = broadcastPresenceUpdate;
exports.createRedisAdapterConfig = createRedisAdapterConfig;
exports.publishToRedis = publishToRedis;
exports.createWsException = createWsException;
exports.handleWsError = handleWsError;
exports.validateWsPayload = validateWsPayload;
/**
 * File: /reuse/nestjs-websocket-gateway-kit.ts
 * Locator: WC-UTL-WSGT-001
 * Purpose: NestJS WebSocket Gateway Kit - Comprehensive real-time communication utilities
 *
 * Upstream: @nestjs/websockets, @nestjs/platform-socket.io, socket.io, Redis, ioredis
 * Downstream: All NestJS WebSocket gateways, real-time features, chat systems, notifications
 * Dependencies: NestJS v11.x, Socket.IO v4.x, Node 18+, TypeScript 5.x, Redis (optional)
 * Exports: 45 WebSocket utility functions for gateways, rooms, namespaces, authentication, broadcasting
 *
 * LLM Context: Production-grade NestJS WebSocket toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for WebSocket gateway lifecycle, room management, namespace handling,
 * authentication middleware, broadcasting helpers, event emitters, connection handling, heartbeat/ping-pong,
 * Redis adapter configuration, scaling patterns, presence tracking, typing indicators, reconnection logic,
 * binary data handling, and error management. HIPAA-compliant with secure real-time communication.
 */
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
// ============================================================================
// GATEWAY CONFIGURATION & LIFECYCLE
// ============================================================================
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
function createGatewayConfig(options = {}) {
    return {
        namespace: options.namespace || '/',
        cors: options.cors || {
            origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST'],
        },
        transports: options.transports || ['websocket', 'polling'],
        path: options.path || '/socket.io',
        pingTimeout: options.pingTimeout || 60000,
        pingInterval: options.pingInterval || 25000,
        maxHttpBufferSize: options.maxHttpBufferSize || 1e6, // 1MB
        allowEIO3: options.allowEIO3 ?? false,
        serveClient: options.serveClient ?? false,
    };
}
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
function initializeGateway(server, gatewayName) {
    const logger = new common_1.Logger(gatewayName);
    logger.log(`Gateway initialized: ${gatewayName}`);
    logger.log(`Namespace: ${server.name}`);
    logger.log(`Transport modes: ${server.opts.transports?.join(', ')}`);
    // Set up global error handler
    server.on('error', (error) => {
        logger.error(`Gateway error: ${error.message}`, error.stack);
    });
}
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
function handleConnectionLifecycle(client, connections) {
    const metadata = {
        socketId: client.id,
        userId: client.handshake.auth?.userId,
        connectedAt: new Date(),
        lastActivity: new Date(),
        rooms: [],
        metadata: client.handshake.auth?.metadata || {},
    };
    connections.set(client.id, metadata);
    // Update last activity on any event
    client.onAny(() => {
        const conn = connections.get(client.id);
        if (conn) {
            conn.lastActivity = new Date();
        }
    });
    return metadata;
}
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
async function handleDisconnectionCleanup(client, connections, cleanupCallback) {
    const metadata = connections.get(client.id);
    if (metadata) {
        // Clean up rooms
        metadata.rooms.forEach((room) => {
            client.leave(room);
        });
        connections.delete(client.id);
    }
    // Execute cleanup callback
    if (cleanupCallback) {
        try {
            await cleanupCallback();
        }
        catch (error) {
            const logger = new common_1.Logger('WebSocketCleanup');
            logger.error(`Cleanup error: ${error.message}`);
        }
    }
}
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
function createGatewayMiddleware(validator) {
    return async (client, data, next) => {
        try {
            const isValid = await validator(client, data);
            if (isValid) {
                next();
            }
            else {
                next(new websockets_1.WsException('Validation failed'));
            }
        }
        catch (error) {
            next(new websockets_1.WsException(error.message));
        }
    };
}
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
function getGatewayStats(server, connections) {
    const now = Date.now();
    const connectionDurations = Array.from(connections.values()).map((conn) => now - conn.connectedAt.getTime());
    return {
        connectedClients: server.sockets.sockets.size,
        totalRooms: server.sockets.adapter.rooms.size,
        namespaces: server.of('/').adapter.rooms.size,
        uptime: process.uptime(),
        avgConnectionDuration: connectionDurations.length > 0
            ? connectionDurations.reduce((a, b) => a + b, 0) / connectionDurations.length
            : 0,
    };
}
// ============================================================================
// ROOM MANAGEMENT
// ============================================================================
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
async function joinRoom(client, roomId, config) {
    try {
        // Validate max users if configured
        if (config?.maxUsers) {
            const room = await getRoomClients(client.nsp, roomId);
            if (room.length >= config.maxUsers) {
                throw new websockets_1.WsException('Room is full');
            }
        }
        await client.join(roomId);
        // Update connection metadata
        const metadata = client.__metadata;
        if (metadata && !metadata.rooms.includes(roomId)) {
            metadata.rooms.push(roomId);
        }
        return true;
    }
    catch (error) {
        throw new websockets_1.WsException(`Failed to join room: ${error.message}`);
    }
}
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
async function leaveRoom(client, roomId) {
    await client.leave(roomId);
    // Update connection metadata
    const metadata = client.__metadata;
    if (metadata) {
        metadata.rooms = metadata.rooms.filter((r) => r !== roomId);
    }
}
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
async function getRoomClients(namespace, roomId) {
    const room = namespace.adapter.rooms.get(roomId);
    return room ? Array.from(room) : [];
}
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
function getClientRooms(client) {
    return Array.from(client.rooms).filter((room) => room !== client.id);
}
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
function broadcastToRoom(client, roomId, event, data, options) {
    let broadcast = client.to(roomId);
    if (options?.volatile) {
        broadcast = broadcast.volatile;
    }
    if (options?.compress !== false) {
        broadcast = broadcast.compress(true);
    }
    if (options?.timeout) {
        broadcast = broadcast.timeout(options.timeout);
    }
    broadcast.emit(event, data);
}
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
async function closeRoom(server, roomId) {
    const clients = await getRoomClients(server, roomId);
    clients.forEach((socketId) => {
        const socket = server.sockets.sockets.get(socketId);
        if (socket) {
            socket.leave(roomId);
        }
    });
    return clients.length;
}
// ============================================================================
// NAMESPACE HANDLING
// ============================================================================
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
function createNamespace(server, namespaceName, config) {
    const namespace = server.of(namespaceName);
    if (config?.cors) {
        // Apply CORS configuration to namespace
        namespace.adapter.opts = {
            ...namespace.adapter.opts,
            cors: config.cors,
        };
    }
    return namespace;
}
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
function getActiveNamespaces(server) {
    return Array.from(server._nsps.keys());
}
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
function broadcastToNamespace(namespace, event, data) {
    namespace.emit(event, data);
}
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
function getNamespaceStats(namespace) {
    return {
        name: namespace.name,
        connectedClients: namespace.sockets.size,
        rooms: namespace.adapter.rooms.size,
    };
}
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
async function disconnectNamespace(namespace, close = false) {
    const sockets = await namespace.fetchSockets();
    sockets.forEach((socket) => {
        socket.disconnect(true);
    });
    if (close) {
        namespace.removeAllListeners();
    }
    return sockets.length;
}
// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================
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
async function validateWsAuth(client, validator) {
    const token = extractWsToken(client);
    if (!token) {
        throw new common_1.UnauthorizedException('No token provided');
    }
    try {
        const payload = await validator(token);
        // Attach auth data to socket
        client.auth = payload;
        return payload;
    }
    catch (error) {
        throw new common_1.UnauthorizedException('Invalid token');
    }
}
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
function extractWsToken(client) {
    // Try Authorization header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    // Try auth object
    if (client.handshake.auth?.token) {
        return client.handshake.auth.token;
    }
    // Try query parameter (fallback, less secure)
    if (client.handshake.query?.token) {
        return client.handshake.query.token;
    }
    return null;
}
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
function checkWsRole(client, requiredRoles) {
    const auth = client.auth;
    if (!auth || !auth.roles) {
        return false;
    }
    return requiredRoles.some((role) => auth.roles?.includes(role));
}
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
function createWsJwtGuard(verifyFn) {
    return async (client) => {
        const token = extractWsToken(client);
        if (!token) {
            throw new websockets_1.WsException('Unauthorized');
        }
        try {
            const payload = await verifyFn(token);
            client.user = payload;
            return true;
        }
        catch (error) {
            throw new websockets_1.WsException('Invalid token');
        }
    };
}
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
async function validateRoomAccess(client, roomId, validator) {
    const auth = client.auth;
    if (!auth?.userId) {
        throw new websockets_1.WsException('User not authenticated');
    }
    try {
        const hasAccess = await validator(auth.userId, roomId);
        if (!hasAccess) {
            throw new websockets_1.WsException('Access denied');
        }
        return true;
    }
    catch (error) {
        throw new websockets_1.WsException(`Access validation failed: ${error.message}`);
    }
}
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
function createEventRateLimiter(config) {
    const eventCounts = new Map();
    return (client, event) => {
        const key = `${client.id}:${event}`;
        const now = Date.now();
        let record = eventCounts.get(key);
        // Check if blocked
        if (record?.blockedUntil && now < record.blockedUntil) {
            throw new websockets_1.WsException('Rate limit exceeded. Please try again later.');
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
            if (config.blockDuration) {
                record.blockedUntil = now + config.blockDuration;
            }
            throw new websockets_1.WsException('Rate limit exceeded');
        }
        return true;
    };
}
// ============================================================================
// BROADCASTING & EVENT EMISSION
// ============================================================================
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
function sendToUser(server, userId, event, data) {
    server.to(`user:${userId}`).emit(event, data);
}
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
function broadcastToAll(server, event, data, options) {
    let broadcast = server;
    if (options?.volatile) {
        broadcast = broadcast.volatile;
    }
    if (options?.compress !== false) {
        broadcast = broadcast.compress(true);
    }
    // Exclude specific sockets
    if (options?.except && options.except.length > 0) {
        options.except.forEach((socketId) => {
            broadcast = broadcast.except(socketId);
        });
    }
    broadcast.emit(event, data);
}
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
function sendWithAck(client, event, data, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Acknowledgement timeout'));
        }, timeout);
        client.emit(event, data, (response) => {
            clearTimeout(timer);
            resolve(response);
        });
    });
}
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
function broadcastToMultipleRooms(client, roomIds, event, data) {
    roomIds.forEach((roomId) => {
        client.to(roomId).emit(event, data);
    });
}
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
function emitVolatile(client, event, data) {
    client.volatile.emit(event, data);
}
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
function sendBinaryData(client, event, buffer) {
    client.emit(event, buffer);
}
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
function broadcastCompressed(client, roomId, event, data) {
    client.to(roomId).compress(true).emit(event, data);
}
// ============================================================================
// CONNECTION HANDLING
// ============================================================================
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
function disconnectClient(client, reason) {
    client.emit('disconnect:reason', { reason });
    client.disconnect(true);
}
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
function getConnectionInfo(client) {
    return {
        id: client.id,
        ip: client.handshake.address,
        userAgent: client.handshake.headers['user-agent'] || 'unknown',
        transport: client.conn.transport.name,
        connectedAt: new Date(client.handshake.time),
    };
}
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
function handleReconnection(client, sessionStore) {
    const sessionId = client.handshake.auth?.sessionId;
    if (sessionId && sessionStore.has(sessionId)) {
        const session = sessionStore.get(sessionId);
        // Update session with new socket ID
        session.socketId = client.id;
        session.reconnectedAt = new Date();
        return session;
    }
    return null;
}
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
function monitorIdleConnections(server, connections, idleTimeout) {
    const now = Date.now();
    let disconnected = 0;
    connections.forEach((metadata, socketId) => {
        const idleTime = now - metadata.lastActivity.getTime();
        if (idleTime > idleTimeout) {
            const socket = server.sockets.sockets.get(socketId);
            if (socket) {
                disconnectClient(socket, 'Idle timeout');
                disconnected++;
            }
        }
    });
    return disconnected;
}
// ============================================================================
// HEARTBEAT & PING-PONG
// ============================================================================
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
function setupHeartbeat(client, config, onTimeout) {
    let missedHeartbeats = 0;
    const interval = setInterval(() => {
        client.emit('ping', { timestamp: Date.now() }, (response) => {
            if (response) {
                missedHeartbeats = 0;
            }
            else {
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
function handlePong(client, sentTimestamp) {
    const rtt = Date.now() - sentTimestamp;
    // Store latency in client metadata
    client.__latency = rtt;
    return rtt;
}
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
function getClientLatency(client) {
    return client.__latency || 0;
}
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
async function measureConnectionQuality(client) {
    const measurements = [];
    const pings = 5;
    for (let i = 0; i < pings; i++) {
        const start = Date.now();
        try {
            await sendWithAck(client, 'ping', { seq: i }, 2000);
            measurements.push(Date.now() - start);
        }
        catch (error) {
            // Packet lost
        }
        // Wait between pings
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const validMeasurements = measurements.filter((m) => m > 0);
    const avgLatency = validMeasurements.length > 0
        ? validMeasurements.reduce((a, b) => a + b, 0) / validMeasurements.length
        : 0;
    // Calculate jitter (variance in latency)
    const jitter = validMeasurements.length > 1
        ? Math.sqrt(validMeasurements.reduce((sum, lat) => sum + Math.pow(lat - avgLatency, 2), 0) /
            validMeasurements.length)
        : 0;
    const packetLoss = ((pings - validMeasurements.length) / pings) * 100;
    return {
        latency: Math.round(avgLatency),
        jitter: Math.round(jitter),
        packetLoss: Math.round(packetLoss),
    };
}
// ============================================================================
// PRESENCE TRACKING
// ============================================================================
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
function setUserPresence(presenceStore, userId, socketId, metadata) {
    presenceStore.set(userId, {
        userId,
        socketId,
        status: metadata?.status || 'online',
        lastSeen: new Date(),
        metadata: metadata?.metadata || {},
    });
}
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
function getUserPresence(presenceStore, userId) {
    return presenceStore.get(userId) || null;
}
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
function trackTypingIndicator(client, roomId, isTyping, timeout = 3000) {
    const key = `typing:${client.id}:${roomId}`;
    if (isTyping) {
        // Auto-clear typing indicator after timeout
        const timer = setTimeout(() => {
            const auth = client.auth;
            client.to(roomId).emit('user:stopped-typing', { userId: auth?.userId, roomId });
        }, timeout);
        client[key] = timer;
        return timer;
    }
    else {
        // Clear existing timer
        const existingTimer = client[key];
        if (existingTimer) {
            clearTimeout(existingTimer);
            delete client[key];
        }
        return null;
    }
}
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
async function getOnlineUsersInRoom(server, roomId, presenceStore) {
    const socketIds = await getRoomClients(server, roomId);
    const onlineUsers = [];
    socketIds.forEach((socketId) => {
        const socket = server.sockets.sockets.get(socketId);
        if (socket) {
            const userId = socket.auth?.userId;
            if (userId) {
                const presence = presenceStore.get(userId);
                if (presence && presence.status !== 'offline') {
                    onlineUsers.push(presence);
                }
            }
        }
    });
    return onlineUsers;
}
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
function broadcastPresenceUpdate(client, userId, presence, subscriberRooms) {
    subscriberRooms.forEach((room) => {
        client.to(room).emit('presence:update', {
            userId,
            status: presence.status,
            lastSeen: presence.lastSeen,
        });
    });
}
// ============================================================================
// REDIS ADAPTER HELPERS
// ============================================================================
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
function createRedisAdapterConfig(options = {}) {
    return {
        host: options.host || process.env.REDIS_HOST || 'localhost',
        port: options.port || parseInt(process.env.REDIS_PORT || '6379', 10),
        password: options.password || process.env.REDIS_PASSWORD,
        db: options.db || 0,
        keyPrefix: options.keyPrefix || 'socket.io:',
        requestsTimeout: options.requestsTimeout || 5000,
    };
}
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
async function publishToRedis(redisClient, channel, message) {
    const serialized = JSON.stringify(message);
    return await redisClient.publish(channel, serialized);
}
// ============================================================================
// ERROR HANDLING
// ============================================================================
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
function createWsException(message, code, details) {
    return new websockets_1.WsException({
        message,
        code: code || 500,
        details,
        timestamp: new Date().toISOString(),
    });
}
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
function handleWsError(error, client, event) {
    const logger = new common_1.Logger('WebSocketError');
    logger.error(`Error in ${event}: ${error.message}`, error.stack);
    // Send error to client
    client.emit('error', {
        event,
        message: error.message,
        timestamp: new Date().toISOString(),
    });
}
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
function validateWsPayload(payload, schema) {
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    for (const [key, type] of Object.entries(schema)) {
        if (!(key in payload)) {
            return false;
        }
        const actualType = typeof payload[key];
        if (actualType !== type) {
            return false;
        }
    }
    return true;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Gateway Configuration & Lifecycle
    createGatewayConfig,
    initializeGateway,
    handleConnectionLifecycle,
    handleDisconnectionCleanup,
    createGatewayMiddleware,
    getGatewayStats,
    // Room Management
    joinRoom,
    leaveRoom,
    getRoomClients,
    getClientRooms,
    broadcastToRoom,
    closeRoom,
    // Namespace Handling
    createNamespace,
    getActiveNamespaces,
    broadcastToNamespace,
    getNamespaceStats,
    disconnectNamespace,
    // Authentication & Authorization
    validateWsAuth,
    extractWsToken,
    checkWsRole,
    createWsJwtGuard,
    validateRoomAccess,
    createEventRateLimiter,
    // Broadcasting & Event Emission
    sendToUser,
    broadcastToAll,
    sendWithAck,
    broadcastToMultipleRooms,
    emitVolatile,
    sendBinaryData,
    broadcastCompressed,
    // Connection Handling
    disconnectClient,
    getConnectionInfo,
    handleReconnection,
    monitorIdleConnections,
    // Heartbeat & Ping-Pong
    setupHeartbeat,
    handlePong,
    getClientLatency,
    measureConnectionQuality,
    // Presence Tracking
    setUserPresence,
    getUserPresence,
    trackTypingIndicator,
    getOnlineUsersInRoom,
    broadcastPresenceUpdate,
    // Redis Adapter Helpers
    createRedisAdapterConfig,
    publishToRedis,
    // Error Handling
    createWsException,
    handleWsError,
    validateWsPayload,
};
//# sourceMappingURL=nestjs-websocket-gateway-kit.js.map