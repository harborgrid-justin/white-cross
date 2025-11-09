"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketReadReceipt = exports.SocketOfflineQueue = exports.SocketNotification = exports.SocketPresence = exports.SocketMessage = exports.SocketRoom = exports.SocketConnection = void 0;
exports.createWsGatewayConfig = createWsGatewayConfig;
exports.initializeWsGateway = initializeWsGateway;
exports.handleWsConnection = handleWsConnection;
exports.handleWsDisconnection = handleWsDisconnection;
exports.persistWsConnection = persistWsConnection;
exports.removePersistedWsConnection = removePersistedWsConnection;
exports.extractWsAuthToken = extractWsAuthToken;
exports.validateWsJwtAuth = validateWsJwtAuth;
exports.checkWsRole = checkWsRole;
exports.checkWsPermission = checkWsPermission;
exports.validateWsTenantAccess = validateWsTenantAccess;
exports.joinWsRoom = joinWsRoom;
exports.leaveWsRoom = leaveWsRoom;
exports.getWsRoomMembers = getWsRoomMembers;
exports.getWsClientRooms = getWsClientRooms;
exports.createWsRoom = createWsRoom;
exports.closeWsRoom = closeWsRoom;
exports.broadcastToWsRoom = broadcastToWsRoom;
exports.broadcastToAllWs = broadcastToAllWs;
exports.sendToWsUser = sendToWsUser;
exports.sendWsWithAck = sendWsWithAck;
exports.persistWsMessage = persistWsMessage;
exports.setWsUserOnline = setWsUserOnline;
exports.setWsUserOffline = setWsUserOffline;
exports.getWsUserPresence = getWsUserPresence;
exports.getWsOnlineUsers = getWsOnlineUsers;
exports.broadcastWsPresenceUpdate = broadcastWsPresenceUpdate;
exports.startWsTypingIndicator = startWsTypingIndicator;
exports.stopWsTypingIndicator = stopWsTypingIndicator;
exports.createWsRateLimiter = createWsRateLimiter;
exports.setupWsHeartbeat = setupWsHeartbeat;
exports.handleWsReconnection = handleWsReconnection;
exports.getWsConnectionQuality = getWsConnectionQuality;
exports.trackWsConnectionState = trackWsConnectionState;
exports.calculateWsReconnectionDelay = calculateWsReconnectionDelay;
exports.queueWsOfflineMessage = queueWsOfflineMessage;
exports.getWsQueuedMessages = getWsQueuedMessages;
exports.markWsQueuedMessageDelivered = markWsQueuedMessageDelivered;
exports.cleanupWsExpiredQueue = cleanupWsExpiredQueue;
exports.createWsReadReceipt = createWsReadReceipt;
exports.getWsMessageReadReceipts = getWsMessageReadReceipts;
exports.broadcastWsReadReceipt = broadcastWsReadReceipt;
exports.initiateWsFileTransfer = initiateWsFileTransfer;
exports.handleWsFileChunk = handleWsFileChunk;
exports.cancelWsFileTransfer = cancelWsFileTransfer;
exports.createWsNotification = createWsNotification;
exports.deliverWsNotification = deliverWsNotification;
exports.markWsNotificationRead = markWsNotificationRead;
exports.getWsUnreadNotifications = getWsUnreadNotifications;
exports.createWsEventRouter = createWsEventRouter;
exports.createWsMiddleware = createWsMiddleware;
exports.createWsRedisAdapterConfig = createWsRedisAdapterConfig;
exports.performWsHealthCheck = performWsHealthCheck;
exports.checkWsSocketHealth = checkWsSocketHealth;
exports.getWsGatewayStats = getWsGatewayStats;
exports.disconnectWsClient = disconnectWsClient;
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
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Socket connection model for tracking active WebSocket connections
 */
let SocketConnection = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _socketId_decorators;
    let _socketId_initializers = [];
    let _socketId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _namespace_decorators;
    let _namespace_initializers = [];
    let _namespace_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _transport_decorators;
    let _transport_initializers = [];
    let _transport_extraInitializers = [];
    let _connectedAt_decorators;
    let _connectedAt_initializers = [];
    let _connectedAt_extraInitializers = [];
    let _lastActivity_decorators;
    let _lastActivity_initializers = [];
    let _lastActivity_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var SocketConnection = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.socketId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _socketId_initializers, void 0));
            this.userId = (__runInitializers(this, _socketId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.tenantId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.namespace = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _namespace_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _namespace_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.transport = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _transport_initializers, void 0));
            this.connectedAt = (__runInitializers(this, _transport_extraInitializers), __runInitializers(this, _connectedAt_initializers, void 0));
            this.lastActivity = (__runInitializers(this, _connectedAt_extraInitializers), __runInitializers(this, _lastActivity_initializers, void 0));
            this.metadata = (__runInitializers(this, _lastActivity_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SocketConnection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _socketId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                comment: 'Socket.IO connection ID',
            })];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                comment: 'User ID associated with this connection',
            })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                comment: 'Tenant ID for multi-tenancy',
            })];
        _namespace_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                defaultValue: '/',
                comment: 'Socket.IO namespace',
            })];
        _ipAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true,
                comment: 'Client IP address',
            })];
        _userAgent_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                comment: 'User agent string',
            })];
        _transport_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                defaultValue: 'websocket',
                comment: 'Transport type (websocket, polling)',
            })];
        _connectedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                comment: 'Connection timestamp',
            })];
        _lastActivity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                comment: 'Last activity timestamp',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                defaultValue: {},
                comment: 'Additional connection metadata',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _socketId_decorators, { kind: "field", name: "socketId", static: false, private: false, access: { has: obj => "socketId" in obj, get: obj => obj.socketId, set: (obj, value) => { obj.socketId = value; } }, metadata: _metadata }, _socketId_initializers, _socketId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _namespace_decorators, { kind: "field", name: "namespace", static: false, private: false, access: { has: obj => "namespace" in obj, get: obj => obj.namespace, set: (obj, value) => { obj.namespace = value; } }, metadata: _metadata }, _namespace_initializers, _namespace_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _transport_decorators, { kind: "field", name: "transport", static: false, private: false, access: { has: obj => "transport" in obj, get: obj => obj.transport, set: (obj, value) => { obj.transport = value; } }, metadata: _metadata }, _transport_initializers, _transport_extraInitializers);
        __esDecorate(null, null, _connectedAt_decorators, { kind: "field", name: "connectedAt", static: false, private: false, access: { has: obj => "connectedAt" in obj, get: obj => obj.connectedAt, set: (obj, value) => { obj.connectedAt = value; } }, metadata: _metadata }, _connectedAt_initializers, _connectedAt_extraInitializers);
        __esDecorate(null, null, _lastActivity_decorators, { kind: "field", name: "lastActivity", static: false, private: false, access: { has: obj => "lastActivity" in obj, get: obj => obj.lastActivity, set: (obj, value) => { obj.lastActivity = value; } }, metadata: _metadata }, _lastActivity_initializers, _lastActivity_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SocketConnection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SocketConnection = _classThis;
})();
exports.SocketConnection = SocketConnection;
/**
 * WebSocket room model for managing chat rooms and channels
 */
let SocketRoom = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'socket_rooms',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['roomId'], unique: true },
                { fields: ['ownerId'] },
                { fields: ['tenantId'] },
                { fields: ['type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _roomId_decorators;
    let _roomId_initializers = [];
    let _roomId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _maxMembers_decorators;
    let _maxMembers_initializers = [];
    let _maxMembers_extraInitializers = [];
    let _memberCount_decorators;
    let _memberCount_initializers = [];
    let _memberCount_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _messages_decorators;
    let _messages_initializers = [];
    let _messages_extraInitializers = [];
    var SocketRoom = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.roomId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _roomId_initializers, void 0));
            this.name = (__runInitializers(this, _roomId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.ownerId = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            this.tenantId = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.maxMembers = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _maxMembers_initializers, void 0));
            this.memberCount = (__runInitializers(this, _maxMembers_extraInitializers), __runInitializers(this, _memberCount_initializers, void 0));
            this.description = (__runInitializers(this, _memberCount_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.metadata = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.messages = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _messages_initializers, void 0));
            __runInitializers(this, _messages_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SocketRoom");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _roomId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                unique: true,
                comment: 'Unique room identifier',
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                comment: 'Room display name',
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('public', 'private', 'direct'),
                allowNull: false,
                defaultValue: 'public',
                comment: 'Room visibility type',
            })];
        _ownerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                comment: 'Room owner user ID',
            })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                comment: 'Tenant ID for multi-tenancy',
            })];
        _maxMembers_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                comment: 'Maximum number of members allowed',
            })];
        _memberCount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Current number of members',
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                comment: 'Room description',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                defaultValue: {},
                comment: 'Room metadata and settings',
            })];
        _expiresAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                comment: 'Room expiration timestamp',
            })];
        _messages_decorators = [(0, sequelize_typescript_1.HasMany)(() => SocketMessage)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _roomId_decorators, { kind: "field", name: "roomId", static: false, private: false, access: { has: obj => "roomId" in obj, get: obj => obj.roomId, set: (obj, value) => { obj.roomId = value; } }, metadata: _metadata }, _roomId_initializers, _roomId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _maxMembers_decorators, { kind: "field", name: "maxMembers", static: false, private: false, access: { has: obj => "maxMembers" in obj, get: obj => obj.maxMembers, set: (obj, value) => { obj.maxMembers = value; } }, metadata: _metadata }, _maxMembers_initializers, _maxMembers_extraInitializers);
        __esDecorate(null, null, _memberCount_decorators, { kind: "field", name: "memberCount", static: false, private: false, access: { has: obj => "memberCount" in obj, get: obj => obj.memberCount, set: (obj, value) => { obj.memberCount = value; } }, metadata: _metadata }, _memberCount_initializers, _memberCount_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _messages_decorators, { kind: "field", name: "messages", static: false, private: false, access: { has: obj => "messages" in obj, get: obj => obj.messages, set: (obj, value) => { obj.messages = value; } }, metadata: _metadata }, _messages_initializers, _messages_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SocketRoom = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SocketRoom = _classThis;
})();
exports.SocketRoom = SocketRoom;
/**
 * WebSocket message model for storing chat messages
 */
let SocketMessage = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'socket_messages',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['roomId'] },
                { fields: ['senderId'] },
                { fields: ['tenantId'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _roomId_decorators;
    let _roomId_initializers = [];
    let _roomId_extraInitializers = [];
    let _room_decorators;
    let _room_initializers = [];
    let _room_extraInitializers = [];
    let _senderId_decorators;
    let _senderId_initializers = [];
    let _senderId_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _replyToId_decorators;
    let _replyToId_initializers = [];
    let _replyToId_extraInitializers = [];
    let _isEdited_decorators;
    let _isEdited_initializers = [];
    let _isEdited_extraInitializers = [];
    let _isDeleted_decorators;
    let _isDeleted_initializers = [];
    let _isDeleted_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var SocketMessage = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.roomId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _roomId_initializers, void 0));
            this.room = (__runInitializers(this, _roomId_extraInitializers), __runInitializers(this, _room_initializers, void 0));
            this.senderId = (__runInitializers(this, _room_extraInitializers), __runInitializers(this, _senderId_initializers, void 0));
            this.tenantId = (__runInitializers(this, _senderId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.type = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.content = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.attachments = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.replyToId = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _replyToId_initializers, void 0));
            this.isEdited = (__runInitializers(this, _replyToId_extraInitializers), __runInitializers(this, _isEdited_initializers, void 0));
            this.isDeleted = (__runInitializers(this, _isEdited_extraInitializers), __runInitializers(this, _isDeleted_initializers, void 0));
            this.metadata = (__runInitializers(this, _isDeleted_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SocketMessage");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _roomId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SocketRoom), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                comment: 'Reference to socket room',
            })];
        _room_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SocketRoom)];
        _senderId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                comment: 'Sender user ID',
            })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                comment: 'Tenant ID for multi-tenancy',
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('text', 'image', 'file', 'video', 'audio', 'system'),
                allowNull: false,
                defaultValue: 'text',
                comment: 'Message content type',
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                comment: 'Message content',
            })];
        _attachments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Attached files or media metadata',
            })];
        _replyToId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                comment: 'Reply to message ID',
            })];
        _isEdited_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Message edited flag',
            })];
        _isDeleted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Message deleted flag',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                defaultValue: {},
                comment: 'Additional message metadata',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _roomId_decorators, { kind: "field", name: "roomId", static: false, private: false, access: { has: obj => "roomId" in obj, get: obj => obj.roomId, set: (obj, value) => { obj.roomId = value; } }, metadata: _metadata }, _roomId_initializers, _roomId_extraInitializers);
        __esDecorate(null, null, _room_decorators, { kind: "field", name: "room", static: false, private: false, access: { has: obj => "room" in obj, get: obj => obj.room, set: (obj, value) => { obj.room = value; } }, metadata: _metadata }, _room_initializers, _room_extraInitializers);
        __esDecorate(null, null, _senderId_decorators, { kind: "field", name: "senderId", static: false, private: false, access: { has: obj => "senderId" in obj, get: obj => obj.senderId, set: (obj, value) => { obj.senderId = value; } }, metadata: _metadata }, _senderId_initializers, _senderId_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _replyToId_decorators, { kind: "field", name: "replyToId", static: false, private: false, access: { has: obj => "replyToId" in obj, get: obj => obj.replyToId, set: (obj, value) => { obj.replyToId = value; } }, metadata: _metadata }, _replyToId_initializers, _replyToId_extraInitializers);
        __esDecorate(null, null, _isEdited_decorators, { kind: "field", name: "isEdited", static: false, private: false, access: { has: obj => "isEdited" in obj, get: obj => obj.isEdited, set: (obj, value) => { obj.isEdited = value; } }, metadata: _metadata }, _isEdited_initializers, _isEdited_extraInitializers);
        __esDecorate(null, null, _isDeleted_decorators, { kind: "field", name: "isDeleted", static: false, private: false, access: { has: obj => "isDeleted" in obj, get: obj => obj.isDeleted, set: (obj, value) => { obj.isDeleted = value; } }, metadata: _metadata }, _isDeleted_initializers, _isDeleted_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SocketMessage = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SocketMessage = _classThis;
})();
exports.SocketMessage = SocketMessage;
/**
 * User presence model for tracking online/offline status
 */
let SocketPresence = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'socket_presence',
            timestamps: true,
            indexes: [
                { fields: ['userId'], unique: true },
                { fields: ['tenantId'] },
                { fields: ['status'] },
                { fields: ['lastSeen'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _customStatus_decorators;
    let _customStatus_initializers = [];
    let _customStatus_extraInitializers = [];
    let _socketIds_decorators;
    let _socketIds_initializers = [];
    let _socketIds_extraInitializers = [];
    let _lastSeen_decorators;
    let _lastSeen_initializers = [];
    let _lastSeen_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var SocketPresence = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.tenantId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.status = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.customStatus = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _customStatus_initializers, void 0));
            this.socketIds = (__runInitializers(this, _customStatus_extraInitializers), __runInitializers(this, _socketIds_initializers, void 0));
            this.lastSeen = (__runInitializers(this, _socketIds_extraInitializers), __runInitializers(this, _lastSeen_initializers, void 0));
            this.metadata = (__runInitializers(this, _lastSeen_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SocketPresence");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                unique: true,
                comment: 'User ID',
            })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                comment: 'Tenant ID for multi-tenancy',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('online', 'away', 'busy', 'offline', 'dnd'),
                allowNull: false,
                defaultValue: 'offline',
                comment: 'User presence status',
            })];
        _customStatus_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true,
                comment: 'Custom status message',
            })];
        _socketIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
                comment: 'Active socket connection IDs',
            })];
        _lastSeen_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                comment: 'Last seen timestamp',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                defaultValue: {},
                comment: 'Additional presence metadata',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _customStatus_decorators, { kind: "field", name: "customStatus", static: false, private: false, access: { has: obj => "customStatus" in obj, get: obj => obj.customStatus, set: (obj, value) => { obj.customStatus = value; } }, metadata: _metadata }, _customStatus_initializers, _customStatus_extraInitializers);
        __esDecorate(null, null, _socketIds_decorators, { kind: "field", name: "socketIds", static: false, private: false, access: { has: obj => "socketIds" in obj, get: obj => obj.socketIds, set: (obj, value) => { obj.socketIds = value; } }, metadata: _metadata }, _socketIds_initializers, _socketIds_extraInitializers);
        __esDecorate(null, null, _lastSeen_decorators, { kind: "field", name: "lastSeen", static: false, private: false, access: { has: obj => "lastSeen" in obj, get: obj => obj.lastSeen, set: (obj, value) => { obj.lastSeen = value; } }, metadata: _metadata }, _lastSeen_initializers, _lastSeen_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SocketPresence = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SocketPresence = _classThis;
})();
exports.SocketPresence = SocketPresence;
/**
 * Notification model for storing real-time notifications
 */
let SocketNotification = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _isRead_decorators;
    let _isRead_initializers = [];
    let _isRead_extraInitializers = [];
    let _readAt_decorators;
    let _readAt_initializers = [];
    let _readAt_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _actionUrl_decorators;
    let _actionUrl_initializers = [];
    let _actionUrl_extraInitializers = [];
    var SocketNotification = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.tenantId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.type = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.title = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.message = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.data = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _data_initializers, void 0));
            this.priority = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.isRead = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _isRead_initializers, void 0));
            this.readAt = (__runInitializers(this, _isRead_extraInitializers), __runInitializers(this, _readAt_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _readAt_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.actionUrl = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _actionUrl_initializers, void 0));
            __runInitializers(this, _actionUrl_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SocketNotification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                comment: 'Target user ID',
            })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                comment: 'Tenant ID for multi-tenancy',
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                comment: 'Notification type',
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                comment: 'Notification title',
            })];
        _message_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                comment: 'Notification message',
            })];
        _data_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Additional notification data',
            })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('low', 'normal', 'high', 'urgent'),
                allowNull: false,
                defaultValue: 'normal',
                comment: 'Notification priority',
            })];
        _isRead_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Read status',
            })];
        _readAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                comment: 'Read timestamp',
            })];
        _expiresAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                comment: 'Notification expiration',
            })];
        _actionUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true,
                comment: 'Action URL or route',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _isRead_decorators, { kind: "field", name: "isRead", static: false, private: false, access: { has: obj => "isRead" in obj, get: obj => obj.isRead, set: (obj, value) => { obj.isRead = value; } }, metadata: _metadata }, _isRead_initializers, _isRead_extraInitializers);
        __esDecorate(null, null, _readAt_decorators, { kind: "field", name: "readAt", static: false, private: false, access: { has: obj => "readAt" in obj, get: obj => obj.readAt, set: (obj, value) => { obj.readAt = value; } }, metadata: _metadata }, _readAt_initializers, _readAt_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _actionUrl_decorators, { kind: "field", name: "actionUrl", static: false, private: false, access: { has: obj => "actionUrl" in obj, get: obj => obj.actionUrl, set: (obj, value) => { obj.actionUrl = value; } }, metadata: _metadata }, _actionUrl_initializers, _actionUrl_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SocketNotification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SocketNotification = _classThis;
})();
exports.SocketNotification = SocketNotification;
/**
 * Offline message queue model for storing messages for offline users
 */
let SocketOfflineQueue = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'socket_offline_queue',
            timestamps: true,
            indexes: [
                { fields: ['userId'] },
                { fields: ['priority'] },
                { fields: ['queuedAt'] },
                { fields: ['delivered'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _event_decorators;
    let _event_initializers = [];
    let _event_extraInitializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _queuedAt_decorators;
    let _queuedAt_initializers = [];
    let _queuedAt_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _attempts_decorators;
    let _attempts_initializers = [];
    let _attempts_extraInitializers = [];
    let _maxAttempts_decorators;
    let _maxAttempts_initializers = [];
    let _maxAttempts_extraInitializers = [];
    let _delivered_decorators;
    let _delivered_initializers = [];
    let _delivered_extraInitializers = [];
    let _deliveredAt_decorators;
    let _deliveredAt_initializers = [];
    let _deliveredAt_extraInitializers = [];
    var SocketOfflineQueue = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.event = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _event_initializers, void 0));
            this.data = (__runInitializers(this, _event_extraInitializers), __runInitializers(this, _data_initializers, void 0));
            this.priority = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.queuedAt = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _queuedAt_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _queuedAt_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.attempts = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _attempts_initializers, void 0));
            this.maxAttempts = (__runInitializers(this, _attempts_extraInitializers), __runInitializers(this, _maxAttempts_initializers, void 0));
            this.delivered = (__runInitializers(this, _maxAttempts_extraInitializers), __runInitializers(this, _delivered_initializers, void 0));
            this.deliveredAt = (__runInitializers(this, _delivered_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
            __runInitializers(this, _deliveredAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SocketOfflineQueue");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                comment: 'Target user ID',
            })];
        _event_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                comment: 'Event name',
            })];
        _data_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                comment: 'Event data payload',
            })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Message priority (higher = more urgent)',
            })];
        _queuedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                comment: 'Queued timestamp',
            })];
        _expiresAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                comment: 'Expiration timestamp',
            })];
        _attempts_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Delivery attempts',
            })];
        _maxAttempts_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 3,
                comment: 'Maximum delivery attempts',
            })];
        _delivered_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Delivery status',
            })];
        _deliveredAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                comment: 'Delivered timestamp',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _event_decorators, { kind: "field", name: "event", static: false, private: false, access: { has: obj => "event" in obj, get: obj => obj.event, set: (obj, value) => { obj.event = value; } }, metadata: _metadata }, _event_initializers, _event_extraInitializers);
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _queuedAt_decorators, { kind: "field", name: "queuedAt", static: false, private: false, access: { has: obj => "queuedAt" in obj, get: obj => obj.queuedAt, set: (obj, value) => { obj.queuedAt = value; } }, metadata: _metadata }, _queuedAt_initializers, _queuedAt_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _attempts_decorators, { kind: "field", name: "attempts", static: false, private: false, access: { has: obj => "attempts" in obj, get: obj => obj.attempts, set: (obj, value) => { obj.attempts = value; } }, metadata: _metadata }, _attempts_initializers, _attempts_extraInitializers);
        __esDecorate(null, null, _maxAttempts_decorators, { kind: "field", name: "maxAttempts", static: false, private: false, access: { has: obj => "maxAttempts" in obj, get: obj => obj.maxAttempts, set: (obj, value) => { obj.maxAttempts = value; } }, metadata: _metadata }, _maxAttempts_initializers, _maxAttempts_extraInitializers);
        __esDecorate(null, null, _delivered_decorators, { kind: "field", name: "delivered", static: false, private: false, access: { has: obj => "delivered" in obj, get: obj => obj.delivered, set: (obj, value) => { obj.delivered = value; } }, metadata: _metadata }, _delivered_initializers, _delivered_extraInitializers);
        __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: obj => "deliveredAt" in obj, get: obj => obj.deliveredAt, set: (obj, value) => { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SocketOfflineQueue = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SocketOfflineQueue = _classThis;
})();
exports.SocketOfflineQueue = SocketOfflineQueue;
/**
 * Read receipts model for tracking message read status
 */
let SocketReadReceipt = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'socket_read_receipts',
            timestamps: true,
            indexes: [
                { fields: ['messageId'] },
                { fields: ['userId'] },
                { fields: ['readAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _messageId_decorators;
    let _messageId_initializers = [];
    let _messageId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _socketId_decorators;
    let _socketId_initializers = [];
    let _socketId_extraInitializers = [];
    let _readAt_decorators;
    let _readAt_initializers = [];
    let _readAt_extraInitializers = [];
    var SocketReadReceipt = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.messageId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _messageId_initializers, void 0));
            this.userId = (__runInitializers(this, _messageId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.socketId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _socketId_initializers, void 0));
            this.readAt = (__runInitializers(this, _socketId_extraInitializers), __runInitializers(this, _readAt_initializers, void 0));
            __runInitializers(this, _readAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SocketReadReceipt");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _messageId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                comment: 'Message ID',
            })];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                comment: 'User who read the message',
            })];
        _socketId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
                comment: 'Socket ID when message was read',
            })];
        _readAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                comment: 'Read timestamp',
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _messageId_decorators, { kind: "field", name: "messageId", static: false, private: false, access: { has: obj => "messageId" in obj, get: obj => obj.messageId, set: (obj, value) => { obj.messageId = value; } }, metadata: _metadata }, _messageId_initializers, _messageId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _socketId_decorators, { kind: "field", name: "socketId", static: false, private: false, access: { has: obj => "socketId" in obj, get: obj => obj.socketId, set: (obj, value) => { obj.socketId = value; } }, metadata: _metadata }, _socketId_initializers, _socketId_extraInitializers);
        __esDecorate(null, null, _readAt_decorators, { kind: "field", name: "readAt", static: false, private: false, access: { has: obj => "readAt" in obj, get: obj => obj.readAt, set: (obj, value) => { obj.readAt = value; } }, metadata: _metadata }, _readAt_initializers, _readAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SocketReadReceipt = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SocketReadReceipt = _classThis;
})();
exports.SocketReadReceipt = SocketReadReceipt;
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
function createWsGatewayConfig(namespace = '/', options = {}) {
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
function initializeWsGateway(server, gatewayName, connectionsStore) {
    const logger = new common_1.Logger(gatewayName);
    logger.log(`✓ Gateway initialized: ${gatewayName}`);
    logger.log(`  Namespace: ${server.name}`);
    logger.log(`  Transports: ${server.opts.transports?.join(', ')}`);
    logger.log(`  Max buffer size: ${server.opts.maxHttpBufferSize} bytes`);
    // Set up global error handler
    server.on('error', (error) => {
        logger.error(`Gateway error: ${error.message}`, error.stack);
    });
    // Set up connection monitoring
    server.on('connection', (socket) => {
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
function handleWsConnection(client, connectionsStore) {
    const metadata = {
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
async function handleWsDisconnection(client, connectionsStore, cleanupCallback) {
    const metadata = connectionsStore.get(client.id);
    const logger = new common_1.Logger('WebSocketDisconnection');
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
        }
        catch (error) {
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
async function persistWsConnection(client, metadata) {
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
async function removePersistedWsConnection(socketId) {
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
function extractWsAuthToken(client) {
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
async function validateWsJwtAuth(client, verifyFn) {
    const token = extractWsAuthToken(client);
    if (!token) {
        throw new websockets_1.WsException('Authentication required');
    }
    try {
        const payload = await verifyFn(token);
        // Attach auth data to socket
        client.auth = payload;
        client.userId = payload.userId;
        client.tenantId = payload.tenantId;
        return payload;
    }
    catch (error) {
        throw new websockets_1.WsException(`Authentication failed: ${error.message}`);
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
function checkWsRole(client, requiredRoles) {
    const auth = client.auth;
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
function checkWsPermission(client, requiredPermissions) {
    const auth = client.auth;
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
function validateWsTenantAccess(client, requiredTenantId) {
    const auth = client.auth;
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
async function joinWsRoom(client, roomId, config) {
    const logger = new common_1.Logger('WsRoomManager');
    try {
        // Validate max members if configured
        if (config?.maxMembers) {
            const sockets = await client.nsp.in(roomId).fetchSockets();
            if (sockets.length >= config.maxMembers) {
                throw new websockets_1.WsException('Room is full');
            }
        }
        await client.join(roomId);
        // Update connection metadata
        const metadata = client.__metadata;
        if (metadata && !metadata.rooms.includes(roomId)) {
            metadata.rooms.push(roomId);
        }
        logger.debug(`Client ${client.id} joined room: ${roomId}`);
        return true;
    }
    catch (error) {
        logger.error(`Failed to join room ${roomId}: ${error.message}`);
        throw new websockets_1.WsException(`Failed to join room: ${error.message}`);
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
async function leaveWsRoom(client, roomId) {
    await client.leave(roomId);
    // Update connection metadata
    const metadata = client.__metadata;
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
async function getWsRoomMembers(serverOrNamespace, roomId) {
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
function getWsClientRooms(client) {
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
async function createWsRoom(config) {
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
async function closeWsRoom(server, roomId) {
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
function broadcastToWsRoom(client, roomId, event, data, options) {
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
function broadcastToAllWs(server, event, data, options) {
    let emitter = server;
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
function sendToWsUser(server, userId, event, data) {
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
function sendWsWithAck(client, event, data, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new websockets_1.WsException('Acknowledgement timeout'));
        }, timeout);
        client.emit(event, data, (response) => {
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
async function persistWsMessage(roomId, senderId, content, options) {
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
async function setWsUserOnline(userId, socketId, status = 'online', metadata) {
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
async function setWsUserOffline(userId, socketId) {
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
async function getWsUserPresence(userId) {
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
async function getWsOnlineUsers(userIds) {
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
function broadcastWsPresenceUpdate(server, userId, presence, targetRooms) {
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
function startWsTypingIndicator(client, roomId, userId, timeout = 3000) {
    const key = `typing:${client.id}:${roomId}`;
    // Clear existing timer if any
    const existingTimer = client[key];
    if (existingTimer) {
        clearTimeout(existingTimer);
    }
    // Broadcast typing start
    client.to(roomId).emit('typing:start', { userId, roomId });
    // Auto-clear typing indicator after timeout
    const timer = setTimeout(() => {
        client.to(roomId).emit('typing:stop', { userId, roomId });
        delete client[key];
    }, timeout);
    client[key] = timer;
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
function stopWsTypingIndicator(client, roomId, userId) {
    const key = `typing:${client.id}:${roomId}`;
    // Clear timer
    const existingTimer = client[key];
    if (existingTimer) {
        clearTimeout(existingTimer);
        delete client[key];
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
function createWsRateLimiter(config) {
    const eventCounts = new Map();
    return (client, event) => {
        // Bypass rate limiting for specific roles
        if (config.bypassRoles && checkWsRole(client, config.bypassRoles)) {
            return true;
        }
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
            if (config.blockDurationMs) {
                record.blockedUntil = now + config.blockDurationMs;
            }
            throw new websockets_1.WsException('Rate limit exceeded');
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
function setupWsHeartbeat(client, config, onTimeout) {
    let missedHeartbeats = 0;
    const interval = setInterval(() => {
        const startTime = Date.now();
        client.emit('heartbeat:ping', { timestamp: startTime }, (response) => {
            if (response && response.timestamp) {
                missedHeartbeats = 0;
                const rtt = Date.now() - startTime;
                client.__latency = rtt;
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
function handleWsReconnection(client, sessionStore) {
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
async function getWsConnectionQuality(client) {
    const measurements = [];
    const pings = 5;
    for (let i = 0; i < pings; i++) {
        const start = Date.now();
        try {
            await sendWsWithAck(client, 'ping', { seq: i }, 2000);
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
function trackWsConnectionState(socketId, userId, stateStore) {
    const existing = stateStore.get(socketId);
    if (existing) {
        existing.state = 'connected';
        existing.reconnectAttempts = 0;
        existing.lastConnected = new Date();
        return existing;
    }
    const state = {
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
function calculateWsReconnectionDelay(attempt, config) {
    const exponentialDelay = Math.min(config.delay * Math.pow(config.delayMultiplier, attempt - 1), config.maxDelay);
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
async function queueWsOfflineMessage(userId, event, data, options) {
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
async function getWsQueuedMessages(userId, limit = 50) {
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
async function markWsQueuedMessageDelivered(messageId) {
    const [updated] = await SocketOfflineQueue.update({ delivered: true, deliveredAt: new Date() }, { where: { id: messageId } });
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
async function cleanupWsExpiredQueue() {
    const now = new Date();
    return await SocketOfflineQueue.destroy({
        where: {
            expiresAt: {
                [sequelize_1.Sequelize.Op.lt]: now,
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
async function createWsReadReceipt(messageId, userId, socketId) {
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
async function getWsMessageReadReceipts(messageId) {
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
function broadcastWsReadReceipt(server, roomId, receipt) {
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
function initiateWsFileTransfer(options) {
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
function handleWsFileChunk(transfer, chunkIndex, chunkData) {
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
function cancelWsFileTransfer(transfer) {
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
async function createWsNotification(userId, type, title, message, options) {
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
function deliverWsNotification(server, notification) {
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
async function markWsNotificationRead(notificationId) {
    const [updated] = await SocketNotification.update({ isRead: true, readAt: new Date() }, { where: { id: notificationId } });
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
async function getWsUnreadNotifications(userId, limit = 50) {
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
function createWsEventRouter(rules) {
    return (client, event, data) => {
        for (const rule of rules) {
            // Check event pattern match
            const patternMatch = typeof rule.eventPattern === 'string'
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
function createWsMiddleware(validator, logger) {
    return async (client, packet, next) => {
        const [event, data] = packet;
        try {
            logger?.debug(`[${client.id}] Event: ${event}`);
            const isValid = await validator(client, data);
            if (isValid) {
                next();
            }
            else {
                const error = new websockets_1.WsException('Validation failed');
                logger?.warn(`[${client.id}] Validation failed for event: ${event}`);
                next(error);
            }
        }
        catch (error) {
            logger?.error(`[${client.id}] Middleware error: ${error.message}`);
            next(new websockets_1.WsException(error.message));
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
function createWsRedisAdapterConfig(options = {}) {
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
async function performWsHealthCheck(server, connectionsStore) {
    const issues = [];
    const metrics = {
        connectedClients: server.sockets.sockets.size,
        totalRooms: server.sockets.adapter.rooms.size,
        averageLatency: 0,
        memoryUsage: process.memoryUsage().heapUsed,
        uptime: process.uptime(),
    };
    // Calculate average latency
    const latencies = [];
    for (const [socketId] of server.sockets.sockets) {
        const socket = server.sockets.sockets.get(socketId);
        if (socket && socket.__latency) {
            latencies.push(socket.__latency);
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
async function checkWsSocketHealth(client) {
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
    }
    catch (error) {
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
function generateEventId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates a unique transfer ID for file transfers
 */
function generateTransferId() {
    return `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Gets WebSocket gateway statistics
 */
function getWsGatewayStats(server, connectionsStore) {
    const now = Date.now();
    const connectionDurations = Array.from(connectionsStore.values()).map((conn) => now - conn.connectedAt.getTime());
    return {
        connectedClients: server.sockets.sockets.size,
        totalRooms: server.sockets.adapter.rooms.size,
        avgConnectionDuration: connectionDurations.length > 0
            ? connectionDurations.reduce((a, b) => a + b, 0) / connectionDurations.length
            : 0,
        namespaces: Array.from(server._nsps.keys()),
    };
}
/**
 * Disconnects a specific client with reason
 */
function disconnectWsClient(client, reason) {
    client.emit('disconnect:reason', { reason, timestamp: new Date() });
    client.disconnect(true);
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
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
//# sourceMappingURL=websocket-realtime-kit.js.map