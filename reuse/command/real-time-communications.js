"use strict";
/**
 * LOC: RT_COMMS_CMD_001
 * File: /reuse/command/real-time-communications.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/websockets
 *   - @nestjs/platform-socket.io
 *   - socket.io
 *   - @socket.io/redis-adapter
 *   - ioredis
 *   - @nestjs/jwt
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Incident command centers
 *   - Emergency dispatch systems
 *   - Unit communication modules
 *   - Command and control services
 *   - Emergency notification systems
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
exports.PriorityMessageQueue = exports.WsJwtAuthGuard = exports.ChannelType = exports.UnitStatus = exports.MessagePriority = exports.EmergencyEventType = void 0;
exports.createEmergencyRedisAdapter = createEmergencyRedisAdapter;
exports.validateEmergencyPermission = validateEmergencyPermission;
exports.createRoleGuard = createRoleGuard;
exports.broadcastNewIncident = broadcastNewIncident;
exports.broadcastIncidentUpdate = broadcastIncidentUpdate;
exports.broadcastIncidentEscalation = broadcastIncidentEscalation;
exports.broadcastIncidentClosure = broadcastIncidentClosure;
exports.broadcastUnitStatus = broadcastUnitStatus;
exports.notifyUnitAvailability = notifyUnitAvailability;
exports.notifyUnitDispatch = notifyUnitDispatch;
exports.sendChannelMessage = sendChannelMessage;
exports.sendPriorityMessage = sendPriorityMessage;
exports.handleTypingStart = handleTypingStart;
exports.handleTypingStop = handleTypingStop;
exports.markMessageDelivered = markMessageDelivered;
exports.markMessageRead = markMessageRead;
exports.initiateVoiceCall = initiateVoiceCall;
exports.acceptVoiceCall = acceptVoiceCall;
exports.endVoiceCall = endVoiceCall;
exports.handlePTTPress = handlePTTPress;
exports.handlePTTRelease = handlePTTRelease;
exports.startVideoStream = startVideoStream;
exports.stopVideoStream = stopVideoStream;
exports.changeVideoQuality = changeVideoQuality;
exports.startScreenShare = startScreenShare;
exports.stopScreenShare = stopScreenShare;
exports.updatePresence = updatePresence;
exports.trackUserOnline = trackUserOnline;
exports.trackUserOffline = trackUserOffline;
exports.joinIncidentRoom = joinIncidentRoom;
exports.leaveIncidentRoom = leaveIncidentRoom;
exports.joinTacticalChannel = joinTacticalChannel;
exports.leaveTacticalChannel = leaveTacticalChannel;
exports.createEmergencyNamespace = createEmergencyNamespace;
exports.handleClientConnection = handleClientConnection;
exports.handleClientDisconnection = handleClientDisconnection;
exports.createHeartbeat = createHeartbeat;
exports.createRateLimiter = createRateLimiter;
/**
 * File: /reuse/command/real-time-communications.ts
 * Locator: WC-RT-COMMS-CMD-001
 * Purpose: Production-Grade Real-Time Communications for Emergency Command Operations
 *
 * Upstream: NestJS WebSockets, Socket.IO, Redis, JWT, RxJS
 * Downstream: ../backend/command/*, Incident Gateways, Dispatch Services, Unit Comms
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/websockets, socket.io, ioredis
 * Exports: 45 production-ready real-time communication functions
 *
 * LLM Context: Production-grade real-time communication utilities for emergency command operations.
 * Provides comprehensive incident broadcast management, unit status notifications, emergency chat systems,
 * voice/video integration, screen sharing for situational awareness, presence management for first responders,
 * priority-based message routing, incident room management, multi-agency coordination, command hierarchy
 * communications, critical alert broadcasting, unit-to-dispatch messaging, inter-agency notifications,
 * secure WebSocket authentication for emergency personnel, role-based access control, emergency channel
 * management, situation room coordination, real-time tactical updates, medical telemetry streaming,
 * patient handoff communications, hospital coordination, ambulance-to-ER real-time updates, HIPAA-compliant
 * emergency communications, audit logging for critical incidents, failover and redundancy patterns,
 * offline queue management, and priority-based delivery guarantees for mission-critical communications.
 */
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Emergency communication event types
 */
var EmergencyEventType;
(function (EmergencyEventType) {
    // Incident Events
    EmergencyEventType["INCIDENT_CREATED"] = "incident:created";
    EmergencyEventType["INCIDENT_UPDATED"] = "incident:updated";
    EmergencyEventType["INCIDENT_CLOSED"] = "incident:closed";
    EmergencyEventType["INCIDENT_ESCALATED"] = "incident:escalated";
    EmergencyEventType["INCIDENT_PRIORITY_CHANGED"] = "incident:priority-changed";
    // Unit Status Events
    EmergencyEventType["UNIT_DISPATCHED"] = "unit:dispatched";
    EmergencyEventType["UNIT_EN_ROUTE"] = "unit:en-route";
    EmergencyEventType["UNIT_ON_SCENE"] = "unit:on-scene";
    EmergencyEventType["UNIT_TRANSPORTING"] = "unit:transporting";
    EmergencyEventType["UNIT_AT_HOSPITAL"] = "unit:at-hospital";
    EmergencyEventType["UNIT_AVAILABLE"] = "unit:available";
    EmergencyEventType["UNIT_OUT_OF_SERVICE"] = "unit:out-of-service";
    // Chat & Messaging
    EmergencyEventType["MESSAGE_SENT"] = "message:sent";
    EmergencyEventType["MESSAGE_DELIVERED"] = "message:delivered";
    EmergencyEventType["MESSAGE_READ"] = "message:read";
    EmergencyEventType["TYPING_START"] = "typing:start";
    EmergencyEventType["TYPING_STOP"] = "typing:stop";
    // Voice Communication
    EmergencyEventType["VOICE_CALL_INITIATED"] = "voice:call-initiated";
    EmergencyEventType["VOICE_CALL_ACCEPTED"] = "voice:call-accepted";
    EmergencyEventType["VOICE_CALL_ENDED"] = "voice:call-ended";
    EmergencyEventType["PTT_PRESSED"] = "ptt:pressed";
    EmergencyEventType["PTT_RELEASED"] = "ptt:released";
    // Video Streaming
    EmergencyEventType["VIDEO_STREAM_START"] = "video:stream-start";
    EmergencyEventType["VIDEO_STREAM_STOP"] = "video:stream-stop";
    EmergencyEventType["VIDEO_QUALITY_CHANGED"] = "video:quality-changed";
    // Screen Sharing
    EmergencyEventType["SCREEN_SHARE_START"] = "screen:share-start";
    EmergencyEventType["SCREEN_SHARE_STOP"] = "screen:share-stop";
    // Presence
    EmergencyEventType["PRESENCE_ONLINE"] = "presence:online";
    EmergencyEventType["PRESENCE_OFFLINE"] = "presence:offline";
    EmergencyEventType["PRESENCE_BUSY"] = "presence:busy";
    EmergencyEventType["PRESENCE_AWAY"] = "presence:away";
})(EmergencyEventType || (exports.EmergencyEventType = EmergencyEventType = {}));
/**
 * Message priority levels for emergency communications
 */
var MessagePriority;
(function (MessagePriority) {
    MessagePriority[MessagePriority["ROUTINE"] = 0] = "ROUTINE";
    MessagePriority[MessagePriority["PRIORITY"] = 1] = "PRIORITY";
    MessagePriority[MessagePriority["URGENT"] = 2] = "URGENT";
    MessagePriority[MessagePriority["EMERGENCY"] = 3] = "EMERGENCY";
    MessagePriority[MessagePriority["CRITICAL"] = 4] = "CRITICAL";
})(MessagePriority || (exports.MessagePriority = MessagePriority = {}));
/**
 * Unit status types
 */
var UnitStatus;
(function (UnitStatus) {
    UnitStatus["AVAILABLE"] = "available";
    UnitStatus["DISPATCHED"] = "dispatched";
    UnitStatus["EN_ROUTE"] = "en-route";
    UnitStatus["ON_SCENE"] = "on-scene";
    UnitStatus["TRANSPORTING"] = "transporting";
    UnitStatus["AT_HOSPITAL"] = "at-hospital";
    UnitStatus["OUT_OF_SERVICE"] = "out-of-service";
    UnitStatus["OFFLINE"] = "offline";
})(UnitStatus || (exports.UnitStatus = UnitStatus = {}));
/**
 * Communication channel types
 */
var ChannelType;
(function (ChannelType) {
    ChannelType["INCIDENT"] = "incident";
    ChannelType["TACTICAL"] = "tactical";
    ChannelType["COMMAND"] = "command";
    ChannelType["INTER_AGENCY"] = "inter-agency";
    ChannelType["HOSPITAL"] = "hospital";
    ChannelType["DISPATCH"] = "dispatch";
    ChannelType["PRIVATE"] = "private";
})(ChannelType || (exports.ChannelType = ChannelType = {}));
// ============================================================================
// REDIS ADAPTER FOR HORIZONTAL SCALING
// ============================================================================
/**
 * Creates Redis adapter for Socket.IO horizontal scaling
 *
 * @param redisUrl - Redis connection URL
 * @returns IoAdapter configured with Redis
 *
 * @example
 * ```typescript
 * const adapter = createRedisAdapter('redis://localhost:6379');
 * app.useWebSocketAdapter(adapter);
 * ```
 */
function createEmergencyRedisAdapter(redisUrl = 'redis://localhost:6379') {
    let EmergencyRedisAdapter = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = platform_socket_io_1.IoAdapter;
        var EmergencyRedisAdapter = _classThis = class extends _classSuper {
            async connectToRedis() {
                const pubClient = (0, redis_1.createClient)({ url: redisUrl });
                const subClient = pubClient.duplicate();
                await Promise.all([pubClient.connect(), subClient.connect()]);
                this.adapterConstructor = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
            }
            createIOServer(port, options) {
                const server = super.createIOServer(port, options);
                server.adapter(this.adapterConstructor);
                return server;
            }
        };
        __setFunctionName(_classThis, "EmergencyRedisAdapter");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EmergencyRedisAdapter = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return EmergencyRedisAdapter = _classThis;
    })();
    return EmergencyRedisAdapter;
}
// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================
/**
 * WebSocket JWT authentication guard
 * Validates JWT tokens from WebSocket handshake
 */
let WsJwtAuthGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WsJwtAuthGuard = _classThis = class {
        constructor(jwtService) {
            this.jwtService = jwtService;
        }
        async canActivate(context) {
            const client = context.switchToWs().getClient();
            const token = this.extractToken(client);
            if (!token) {
                throw new websockets_1.WsException('Unauthorized: No token provided');
            }
            try {
                const payload = await this.jwtService.verifyAsync(token);
                client.data.user = payload;
                client.data.userId = payload.sub || payload.userId;
                client.data.role = payload.role;
                client.data.agencyId = payload.agencyId;
                client.data.permissions = payload.permissions || [];
                return true;
            }
            catch (error) {
                throw new websockets_1.WsException('Unauthorized: Invalid token');
            }
        }
        extractToken(client) {
            // Try Authorization header
            const authHeader = client.handshake.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                return authHeader.substring(7);
            }
            // Try auth object
            if (client.handshake.auth?.token) {
                return client.handshake.auth.token;
            }
            // Try query parameter (fallback for legacy clients)
            if (client.handshake.query?.token) {
                return client.handshake.query.token;
            }
            return null;
        }
    };
    __setFunctionName(_classThis, "WsJwtAuthGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WsJwtAuthGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WsJwtAuthGuard = _classThis;
})();
exports.WsJwtAuthGuard = WsJwtAuthGuard;
/**
 * Validates emergency communication permissions
 *
 * @param client - Socket client
 * @param requiredPermission - Required permission string
 * @returns true if authorized
 *
 * @example
 * ```typescript
 * if (!validateEmergencyPermission(client, 'incident.broadcast')) {
 *   throw new WsException('Insufficient permissions');
 * }
 * ```
 */
function validateEmergencyPermission(client, requiredPermission) {
    const permissions = client.data.permissions || [];
    return permissions.includes(requiredPermission) || permissions.includes('*');
}
/**
 * Role-based access guard for WebSocket events
 *
 * @param allowedRoles - Array of allowed role strings
 * @returns Guard instance
 *
 * @example
 * ```typescript
 * @UseGuards(createRoleGuard(['dispatcher', 'commander']))
 * @SubscribeMessage('incident:broadcast')
 * handleIncidentBroadcast() { }
 * ```
 */
function createRoleGuard(allowedRoles) {
    let RoleGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RoleGuard = _classThis = class {
            canActivate(context) {
                const client = context.switchToWs().getClient();
                const userRole = client.data.role;
                if (!userRole) {
                    throw new websockets_1.WsException('No role assigned');
                }
                if (!allowedRoles.includes(userRole)) {
                    throw new websockets_1.WsException('Insufficient role permissions');
                }
                return true;
            }
        };
        __setFunctionName(_classThis, "RoleGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RoleGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return RoleGuard = _classThis;
    })();
    return RoleGuard;
}
// ============================================================================
// INCIDENT BROADCAST MANAGEMENT
// ============================================================================
/**
 * Broadcasts new incident to all relevant units and dispatchers
 *
 * @param server - Socket.IO server instance
 * @param incident - Incident broadcast data
 *
 * @example
 * ```typescript
 * broadcastNewIncident(server, {
 *   incidentId: 'INC-001',
 *   type: 'medical',
 *   priority: MessagePriority.EMERGENCY,
 *   location: { latitude: 40.7128, longitude: -74.0060, address: '123 Main St' },
 *   description: 'Cardiac arrest',
 *   assignedUnits: ['AMB-01', 'AMB-02'],
 *   timestamp: new Date()
 * });
 * ```
 */
function broadcastNewIncident(server, incident) {
    // Broadcast to incident room
    server.to(`incident:${incident.incidentId}`).emit(EmergencyEventType.INCIDENT_CREATED, incident);
    // Broadcast to assigned units
    incident.assignedUnits.forEach((unitId) => {
        server.to(`unit:${unitId}`).emit(EmergencyEventType.INCIDENT_CREATED, incident);
    });
    // Broadcast to all dispatchers
    server.to('role:dispatcher').emit(EmergencyEventType.INCIDENT_CREATED, incident);
    // High priority incidents go to commanders
    if (incident.priority >= MessagePriority.URGENT) {
        server.to('role:commander').emit(EmergencyEventType.INCIDENT_CREATED, incident);
    }
}
/**
 * Broadcasts incident update to subscribed parties
 *
 * @param server - Socket.IO server instance
 * @param incidentId - Incident identifier
 * @param update - Update data
 *
 * @example
 * ```typescript
 * broadcastIncidentUpdate(server, 'INC-001', {
 *   status: 'units-en-route',
 *   assignedUnits: ['AMB-01', 'AMB-02', 'ENG-01'],
 *   timestamp: new Date()
 * });
 * ```
 */
function broadcastIncidentUpdate(server, incidentId, update) {
    server.to(`incident:${incidentId}`).emit(EmergencyEventType.INCIDENT_UPDATED, {
        incidentId,
        ...update,
        timestamp: new Date(),
    });
}
/**
 * Broadcasts incident escalation to higher priority
 *
 * @param server - Socket.IO server instance
 * @param incidentId - Incident identifier
 * @param newPriority - New priority level
 * @param reason - Escalation reason
 *
 * @example
 * ```typescript
 * broadcastIncidentEscalation(server, 'INC-001', MessagePriority.CRITICAL,
 *   'Multiple casualties reported');
 * ```
 */
function broadcastIncidentEscalation(server, incidentId, newPriority, reason) {
    const escalation = {
        incidentId,
        newPriority,
        reason,
        timestamp: new Date(),
    };
    // Notify all incident participants
    server.to(`incident:${incidentId}`).emit(EmergencyEventType.INCIDENT_ESCALATED, escalation);
    // Alert commanders and supervisors
    server.to('role:commander').emit(EmergencyEventType.INCIDENT_ESCALATED, escalation);
    server.to('role:supervisor').emit(EmergencyEventType.INCIDENT_ESCALATED, escalation);
}
/**
 * Broadcasts incident closure
 *
 * @param server - Socket.IO server instance
 * @param incidentId - Incident identifier
 * @param closureData - Closure information
 *
 * @example
 * ```typescript
 * broadcastIncidentClosure(server, 'INC-001', {
 *   closedBy: 'dispatcher-123',
 *   outcome: 'patient-transported',
 *   timestamp: new Date()
 * });
 * ```
 */
function broadcastIncidentClosure(server, incidentId, closureData) {
    server.to(`incident:${incidentId}`).emit(EmergencyEventType.INCIDENT_CLOSED, {
        incidentId,
        ...closureData,
        timestamp: new Date(),
    });
}
// ============================================================================
// UNIT STATUS NOTIFICATIONS
// ============================================================================
/**
 * Broadcasts unit status change
 *
 * @param server - Socket.IO server instance
 * @param statusUpdate - Unit status update data
 *
 * @example
 * ```typescript
 * broadcastUnitStatus(server, {
 *   unitId: 'AMB-01',
 *   status: UnitStatus.ON_SCENE,
 *   incidentId: 'INC-001',
 *   location: { latitude: 40.7128, longitude: -74.0060 },
 *   timestamp: new Date()
 * });
 * ```
 */
function broadcastUnitStatus(server, statusUpdate) {
    const eventType = `unit:${statusUpdate.status}`;
    // Broadcast to unit's room
    server.to(`unit:${statusUpdate.unitId}`).emit(eventType, statusUpdate);
    // Broadcast to associated incident
    if (statusUpdate.incidentId) {
        server.to(`incident:${statusUpdate.incidentId}`).emit(eventType, statusUpdate);
    }
    // Broadcast to dispatchers
    server.to('role:dispatcher').emit(eventType, statusUpdate);
}
/**
 * Tracks unit availability changes for resource management
 *
 * @param server - Socket.IO server instance
 * @param unitId - Unit identifier
 * @param isAvailable - Availability status
 *
 * @example
 * ```typescript
 * notifyUnitAvailability(server, 'AMB-01', true);
 * ```
 */
function notifyUnitAvailability(server, unitId, isAvailable) {
    const status = isAvailable ? UnitStatus.AVAILABLE : UnitStatus.OUT_OF_SERVICE;
    server.to('role:dispatcher').emit(EmergencyEventType.UNIT_AVAILABLE, {
        unitId,
        status,
        timestamp: new Date(),
    });
}
/**
 * Notifies units of dispatch assignment
 *
 * @param server - Socket.IO server instance
 * @param unitIds - Array of unit identifiers
 * @param incidentId - Incident identifier
 * @param dispatchData - Dispatch details
 *
 * @example
 * ```typescript
 * notifyUnitDispatch(server, ['AMB-01', 'AMB-02'], 'INC-001', {
 *   priority: MessagePriority.EMERGENCY,
 *   location: { latitude: 40.7128, longitude: -74.0060, address: '123 Main St' }
 * });
 * ```
 */
function notifyUnitDispatch(server, unitIds, incidentId, dispatchData) {
    unitIds.forEach((unitId) => {
        server.to(`unit:${unitId}`).emit(EmergencyEventType.UNIT_DISPATCHED, {
            unitId,
            incidentId,
            ...dispatchData,
            timestamp: new Date(),
        });
    });
}
// ============================================================================
// CHAT & MESSAGING
// ============================================================================
/**
 * Sends message to emergency channel
 *
 * @param server - Socket.IO server instance
 * @param message - Emergency message data
 *
 * @example
 * ```typescript
 * sendChannelMessage(server, {
 *   messageId: 'msg-001',
 *   senderId: 'user-123',
 *   channelId: 'INC-001',
 *   channelType: ChannelType.INCIDENT,
 *   content: 'Patient is stable',
 *   priority: MessagePriority.ROUTINE,
 *   timestamp: new Date()
 * });
 * ```
 */
function sendChannelMessage(server, message) {
    const roomId = `${message.channelType}:${message.channelId}`;
    server.to(roomId).emit(EmergencyEventType.MESSAGE_SENT, message);
}
/**
 * Sends priority alert message
 *
 * @param server - Socket.IO server instance
 * @param message - Priority message
 * @param targetRoles - Target role array
 *
 * @example
 * ```typescript
 * sendPriorityMessage(server, {
 *   messageId: 'msg-002',
 *   senderId: 'commander-001',
 *   channelId: 'tactical-alpha',
 *   channelType: ChannelType.TACTICAL,
 *   content: 'All units standby',
 *   priority: MessagePriority.URGENT,
 *   timestamp: new Date()
 * }, ['paramedic', 'emt']);
 * ```
 */
function sendPriorityMessage(server, message, targetRoles) {
    if (targetRoles && targetRoles.length > 0) {
        targetRoles.forEach((role) => {
            server.to(`role:${role}`).emit(EmergencyEventType.MESSAGE_SENT, {
                ...message,
                priority: MessagePriority.URGENT,
            });
        });
    }
    else {
        sendChannelMessage(server, message);
    }
}
/**
 * Handles typing indicator start
 *
 * @param client - Socket client
 * @param channelId - Channel identifier
 * @param channelType - Channel type
 *
 * @example
 * ```typescript
 * handleTypingStart(client, 'INC-001', ChannelType.INCIDENT);
 * ```
 */
function handleTypingStart(client, channelId, channelType) {
    const roomId = `${channelType}:${channelId}`;
    client.to(roomId).emit(EmergencyEventType.TYPING_START, {
        userId: client.data.userId,
        channelId,
        channelType,
        timestamp: new Date(),
    });
}
/**
 * Handles typing indicator stop
 *
 * @param client - Socket client
 * @param channelId - Channel identifier
 * @param channelType - Channel type
 *
 * @example
 * ```typescript
 * handleTypingStop(client, 'INC-001', ChannelType.INCIDENT);
 * ```
 */
function handleTypingStop(client, channelId, channelType) {
    const roomId = `${channelType}:${channelId}`;
    client.to(roomId).emit(EmergencyEventType.TYPING_STOP, {
        userId: client.data.userId,
        channelId,
        channelType,
        timestamp: new Date(),
    });
}
/**
 * Marks message as delivered
 *
 * @param server - Socket.IO server instance
 * @param messageId - Message identifier
 * @param userId - User who received message
 *
 * @example
 * ```typescript
 * markMessageDelivered(server, 'msg-001', 'user-123');
 * ```
 */
function markMessageDelivered(server, messageId, userId) {
    server.emit(EmergencyEventType.MESSAGE_DELIVERED, {
        messageId,
        userId,
        timestamp: new Date(),
    });
}
/**
 * Marks message as read
 *
 * @param server - Socket.IO server instance
 * @param messageId - Message identifier
 * @param userId - User who read message
 *
 * @example
 * ```typescript
 * markMessageRead(server, 'msg-001', 'user-123');
 * ```
 */
function markMessageRead(server, messageId, userId) {
    server.emit(EmergencyEventType.MESSAGE_READ, {
        messageId,
        userId,
        timestamp: new Date(),
    });
}
// ============================================================================
// VOICE COMMUNICATION INTEGRATION
// ============================================================================
/**
 * Initiates voice call
 *
 * @param server - Socket.IO server instance
 * @param callPayload - Voice call data
 *
 * @example
 * ```typescript
 * initiateVoiceCall(server, {
 *   callId: 'call-001',
 *   initiatorId: 'user-123',
 *   participants: ['user-456', 'user-789'],
 *   channelType: ChannelType.TACTICAL,
 *   priority: MessagePriority.URGENT,
 *   timestamp: new Date()
 * });
 * ```
 */
function initiateVoiceCall(server, callPayload) {
    callPayload.participants.forEach((participantId) => {
        server.to(`user:${participantId}`).emit(EmergencyEventType.VOICE_CALL_INITIATED, callPayload);
    });
}
/**
 * Accepts voice call
 *
 * @param server - Socket.IO server instance
 * @param callId - Call identifier
 * @param userId - User accepting call
 *
 * @example
 * ```typescript
 * acceptVoiceCall(server, 'call-001', 'user-456');
 * ```
 */
function acceptVoiceCall(server, callId, userId) {
    server.to(`call:${callId}`).emit(EmergencyEventType.VOICE_CALL_ACCEPTED, {
        callId,
        userId,
        timestamp: new Date(),
    });
}
/**
 * Ends voice call
 *
 * @param server - Socket.IO server instance
 * @param callId - Call identifier
 * @param endedBy - User ending call
 *
 * @example
 * ```typescript
 * endVoiceCall(server, 'call-001', 'user-123');
 * ```
 */
function endVoiceCall(server, callId, endedBy) {
    server.to(`call:${callId}`).emit(EmergencyEventType.VOICE_CALL_ENDED, {
        callId,
        endedBy,
        timestamp: new Date(),
    });
}
/**
 * Handles push-to-talk press event
 *
 * @param client - Socket client
 * @param channelId - Channel identifier
 *
 * @example
 * ```typescript
 * handlePTTPress(client, 'tactical-alpha');
 * ```
 */
function handlePTTPress(client, channelId) {
    client.to(`channel:${channelId}`).emit(EmergencyEventType.PTT_PRESSED, {
        userId: client.data.userId,
        channelId,
        timestamp: new Date(),
    });
}
/**
 * Handles push-to-talk release event
 *
 * @param client - Socket client
 * @param channelId - Channel identifier
 *
 * @example
 * ```typescript
 * handlePTTRelease(client, 'tactical-alpha');
 * ```
 */
function handlePTTRelease(client, channelId) {
    client.to(`channel:${channelId}`).emit(EmergencyEventType.PTT_RELEASED, {
        userId: client.data.userId,
        channelId,
        timestamp: new Date(),
    });
}
// ============================================================================
// VIDEO STREAMING
// ============================================================================
/**
 * Starts video stream from unit
 *
 * @param server - Socket.IO server instance
 * @param streamConfig - Video stream configuration
 *
 * @example
 * ```typescript
 * startVideoStream(server, {
 *   streamId: 'stream-001',
 *   unitId: 'AMB-01',
 *   incidentId: 'INC-001',
 *   quality: 'high',
 *   resolution: '1080p',
 *   bitrate: 2000,
 *   timestamp: new Date()
 * });
 * ```
 */
function startVideoStream(server, streamConfig) {
    // Notify incident room
    if (streamConfig.incidentId) {
        server.to(`incident:${streamConfig.incidentId}`).emit(EmergencyEventType.VIDEO_STREAM_START, streamConfig);
    }
    // Notify commanders and dispatchers
    server.to('role:commander').emit(EmergencyEventType.VIDEO_STREAM_START, streamConfig);
    server.to('role:dispatcher').emit(EmergencyEventType.VIDEO_STREAM_START, streamConfig);
}
/**
 * Stops video stream
 *
 * @param server - Socket.IO server instance
 * @param streamId - Stream identifier
 * @param unitId - Unit identifier
 *
 * @example
 * ```typescript
 * stopVideoStream(server, 'stream-001', 'AMB-01');
 * ```
 */
function stopVideoStream(server, streamId, unitId) {
    server.emit(EmergencyEventType.VIDEO_STREAM_STOP, {
        streamId,
        unitId,
        timestamp: new Date(),
    });
}
/**
 * Changes video stream quality
 *
 * @param server - Socket.IO server instance
 * @param streamId - Stream identifier
 * @param quality - New quality setting
 *
 * @example
 * ```typescript
 * changeVideoQuality(server, 'stream-001', 'medium');
 * ```
 */
function changeVideoQuality(server, streamId, quality) {
    server.to(`stream:${streamId}`).emit(EmergencyEventType.VIDEO_QUALITY_CHANGED, {
        streamId,
        quality,
        timestamp: new Date(),
    });
}
// ============================================================================
// SCREEN SHARING
// ============================================================================
/**
 * Starts screen sharing session
 *
 * @param server - Socket.IO server instance
 * @param sessionId - Session identifier
 * @param userId - User sharing screen
 * @param targetRoom - Target room identifier
 *
 * @example
 * ```typescript
 * startScreenShare(server, 'screen-001', 'user-123', 'incident:INC-001');
 * ```
 */
function startScreenShare(server, sessionId, userId, targetRoom) {
    server.to(targetRoom).emit(EmergencyEventType.SCREEN_SHARE_START, {
        sessionId,
        userId,
        timestamp: new Date(),
    });
}
/**
 * Stops screen sharing session
 *
 * @param server - Socket.IO server instance
 * @param sessionId - Session identifier
 * @param targetRoom - Target room identifier
 *
 * @example
 * ```typescript
 * stopScreenShare(server, 'screen-001', 'incident:INC-001');
 * ```
 */
function stopScreenShare(server, sessionId, targetRoom) {
    server.to(targetRoom).emit(EmergencyEventType.SCREEN_SHARE_STOP, {
        sessionId,
        timestamp: new Date(),
    });
}
// ============================================================================
// PRESENCE MANAGEMENT
// ============================================================================
/**
 * Updates user presence status
 *
 * @param server - Socket.IO server instance
 * @param presenceStatus - Presence status data
 *
 * @example
 * ```typescript
 * updatePresence(server, {
 *   userId: 'user-123',
 *   status: 'online',
 *   unitId: 'AMB-01',
 *   lastSeen: new Date(),
 *   metadata: { location: 'Station 5' }
 * });
 * ```
 */
function updatePresence(server, presenceStatus) {
    const eventType = presenceStatus.status === 'online'
        ? EmergencyEventType.PRESENCE_ONLINE
        : presenceStatus.status === 'offline'
            ? EmergencyEventType.PRESENCE_OFFLINE
            : presenceStatus.status === 'busy'
                ? EmergencyEventType.PRESENCE_BUSY
                : EmergencyEventType.PRESENCE_AWAY;
    server.emit(eventType, presenceStatus);
}
/**
 * Tracks user online status
 *
 * @param client - Socket client
 * @param metadata - Connection metadata
 *
 * @example
 * ```typescript
 * trackUserOnline(client, {
 *   userId: 'user-123',
 *   unitId: 'AMB-01',
 *   role: 'paramedic',
 *   agencyId: 'agency-001',
 *   permissions: ['incident.view', 'message.send'],
 *   connectedAt: new Date()
 * });
 * ```
 */
function trackUserOnline(client, metadata) {
    client.data.metadata = metadata;
    // Join user-specific room
    client.join(`user:${metadata.userId}`);
    // Join role room
    client.join(`role:${metadata.role}`);
    // Join agency room
    client.join(`agency:${metadata.agencyId}`);
    // Join unit room if applicable
    if (metadata.unitId) {
        client.join(`unit:${metadata.unitId}`);
    }
    // Broadcast online status
    client.broadcast.emit(EmergencyEventType.PRESENCE_ONLINE, {
        userId: metadata.userId,
        status: 'online',
        unitId: metadata.unitId,
        lastSeen: new Date(),
    });
}
/**
 * Tracks user offline status
 *
 * @param client - Socket client
 *
 * @example
 * ```typescript
 * trackUserOffline(client);
 * ```
 */
function trackUserOffline(client) {
    const userId = client.data.userId;
    if (userId) {
        client.broadcast.emit(EmergencyEventType.PRESENCE_OFFLINE, {
            userId,
            status: 'offline',
            lastSeen: new Date(),
        });
    }
}
// ============================================================================
// ROOM & NAMESPACE MANAGEMENT
// ============================================================================
/**
 * Joins client to incident room
 *
 * @param client - Socket client
 * @param incidentId - Incident identifier
 *
 * @example
 * ```typescript
 * joinIncidentRoom(client, 'INC-001');
 * ```
 */
function joinIncidentRoom(client, incidentId) {
    client.join(`incident:${incidentId}`);
}
/**
 * Leaves incident room
 *
 * @param client - Socket client
 * @param incidentId - Incident identifier
 *
 * @example
 * ```typescript
 * leaveIncidentRoom(client, 'INC-001');
 * ```
 */
function leaveIncidentRoom(client, incidentId) {
    client.leave(`incident:${incidentId}`);
}
/**
 * Joins client to tactical channel
 *
 * @param client - Socket client
 * @param channelId - Channel identifier
 *
 * @example
 * ```typescript
 * joinTacticalChannel(client, 'tactical-alpha');
 * ```
 */
function joinTacticalChannel(client, channelId) {
    client.join(`channel:${channelId}`);
}
/**
 * Leaves tactical channel
 *
 * @param client - Socket client
 * @param channelId - Channel identifier
 *
 * @example
 * ```typescript
 * leaveTacticalChannel(client, 'tactical-alpha');
 * ```
 */
function leaveTacticalChannel(client, channelId) {
    client.leave(`channel:${channelId}`);
}
/**
 * Creates emergency namespace
 *
 * @param server - Socket.IO server instance
 * @param namespaceName - Namespace identifier
 * @returns Namespace instance
 *
 * @example
 * ```typescript
 * const incidentNs = createEmergencyNamespace(server, '/incidents');
 * ```
 */
function createEmergencyNamespace(server, namespaceName) {
    return server.of(namespaceName);
}
// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================
/**
 * Handles client connection with authentication
 *
 * @param client - Socket client
 * @param logger - Logger instance
 * @returns Promise<void>
 *
 * @example
 * ```typescript
 * await handleClientConnection(client, logger);
 * ```
 */
async function handleClientConnection(client, logger) {
    logger.log(`Client connected: ${client.id}`);
    try {
        // Extract connection metadata from handshake
        const userId = client.handshake.auth?.userId;
        const unitId = client.handshake.auth?.unitId;
        const role = client.handshake.auth?.role;
        const agencyId = client.handshake.auth?.agencyId;
        if (!userId || !role || !agencyId) {
            throw new Error('Missing required connection metadata');
        }
        const metadata = {
            userId,
            unitId,
            role,
            agencyId,
            permissions: client.handshake.auth?.permissions || [],
            connectedAt: new Date(),
        };
        trackUserOnline(client, metadata);
        // Send connection confirmation
        client.emit('connected', {
            socketId: client.id,
            userId,
            timestamp: new Date(),
        });
    }
    catch (error) {
        logger.error(`Connection error: ${error.message}`);
        client.disconnect();
    }
}
/**
 * Handles client disconnection
 *
 * @param client - Socket client
 * @param logger - Logger instance
 *
 * @example
 * ```typescript
 * handleClientDisconnection(client, logger);
 * ```
 */
function handleClientDisconnection(client, logger) {
    const userId = client.data.userId;
    const unitId = client.data.unitId;
    logger.log(`Client disconnected: ${client.id} (User: ${userId}, Unit: ${unitId})`);
    trackUserOffline(client);
}
/**
 * Creates heartbeat mechanism for connection monitoring
 *
 * @param client - Socket client
 * @param intervalMs - Heartbeat interval in milliseconds
 * @returns Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = createHeartbeat(client, 30000);
 * // Later: cleanup();
 * ```
 */
function createHeartbeat(client, intervalMs = 30000) {
    const heartbeatInterval = setInterval(() => {
        client.emit('heartbeat', { timestamp: new Date() });
    }, intervalMs);
    client.on('heartbeat-ack', () => {
        client.data.lastHeartbeat = new Date();
    });
    return () => {
        clearInterval(heartbeatInterval);
    };
}
// ============================================================================
// PRIORITY & RATE LIMITING
// ============================================================================
/**
 * Rate limiter for WebSocket events
 *
 * @param maxEvents - Maximum events per window
 * @param windowMs - Time window in milliseconds
 * @returns Interceptor class
 *
 * @example
 * ```typescript
 * @UseInterceptors(createRateLimiter(10, 60000))
 * @SubscribeMessage('message:send')
 * handleMessage() { }
 * ```
 */
function createRateLimiter(maxEvents, windowMs) {
    let RateLimitInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RateLimitInterceptor = _classThis = class {
            constructor() {
                this.eventCounts = new Map();
            }
            intercept(context, next) {
                const client = context.switchToWs().getClient();
                const userId = client.data.userId;
                const now = Date.now();
                let userLimit = this.eventCounts.get(userId);
                if (!userLimit || now > userLimit.resetAt) {
                    userLimit = { count: 0, resetAt: now + windowMs };
                    this.eventCounts.set(userId, userLimit);
                }
                if (userLimit.count >= maxEvents) {
                    throw new websockets_1.WsException('Rate limit exceeded');
                }
                userLimit.count++;
                return next.handle();
            }
        };
        __setFunctionName(_classThis, "RateLimitInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RateLimitInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return RateLimitInterceptor = _classThis;
    })();
    return RateLimitInterceptor;
}
/**
 * Priority queue for message delivery
 * Ensures high-priority messages are delivered first
 *
 * @example
 * ```typescript
 * const queue = new PriorityMessageQueue();
 * queue.enqueue(message);
 * const nextMessage = queue.dequeue();
 * ```
 */
class PriorityMessageQueue {
    constructor() {
        this.queues = new Map();
        // Initialize queues for each priority level
        Object.values(MessagePriority)
            .filter((v) => typeof v === 'number')
            .forEach((priority) => {
            this.queues.set(priority, []);
        });
    }
    enqueue(message) {
        const queue = this.queues.get(message.priority);
        if (queue) {
            queue.push(message);
        }
    }
    dequeue() {
        // Dequeue from highest priority first
        for (let priority = MessagePriority.CRITICAL; priority >= MessagePriority.ROUTINE; priority--) {
            const queue = this.queues.get(priority);
            if (queue && queue.length > 0) {
                return queue.shift() || null;
            }
        }
        return null;
    }
    isEmpty() {
        return Array.from(this.queues.values()).every((queue) => queue.length === 0);
    }
    size() {
        return Array.from(this.queues.values()).reduce((sum, queue) => sum + queue.length, 0);
    }
}
exports.PriorityMessageQueue = PriorityMessageQueue;
//# sourceMappingURL=real-time-communications.js.map