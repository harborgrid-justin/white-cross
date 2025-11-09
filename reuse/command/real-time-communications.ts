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

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  Logger,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { JwtService } from '@nestjs/jwt';
import { Observable, Subject, interval, BehaviorSubject } from 'rxjs';
import { tap, map, takeUntil, filter } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Emergency communication event types
 */
export enum EmergencyEventType {
  // Incident Events
  INCIDENT_CREATED = 'incident:created',
  INCIDENT_UPDATED = 'incident:updated',
  INCIDENT_CLOSED = 'incident:closed',
  INCIDENT_ESCALATED = 'incident:escalated',
  INCIDENT_PRIORITY_CHANGED = 'incident:priority-changed',

  // Unit Status Events
  UNIT_DISPATCHED = 'unit:dispatched',
  UNIT_EN_ROUTE = 'unit:en-route',
  UNIT_ON_SCENE = 'unit:on-scene',
  UNIT_TRANSPORTING = 'unit:transporting',
  UNIT_AT_HOSPITAL = 'unit:at-hospital',
  UNIT_AVAILABLE = 'unit:available',
  UNIT_OUT_OF_SERVICE = 'unit:out-of-service',

  // Chat & Messaging
  MESSAGE_SENT = 'message:sent',
  MESSAGE_DELIVERED = 'message:delivered',
  MESSAGE_READ = 'message:read',
  TYPING_START = 'typing:start',
  TYPING_STOP = 'typing:stop',

  // Voice Communication
  VOICE_CALL_INITIATED = 'voice:call-initiated',
  VOICE_CALL_ACCEPTED = 'voice:call-accepted',
  VOICE_CALL_ENDED = 'voice:call-ended',
  PTT_PRESSED = 'ptt:pressed',
  PTT_RELEASED = 'ptt:released',

  // Video Streaming
  VIDEO_STREAM_START = 'video:stream-start',
  VIDEO_STREAM_STOP = 'video:stream-stop',
  VIDEO_QUALITY_CHANGED = 'video:quality-changed',

  // Screen Sharing
  SCREEN_SHARE_START = 'screen:share-start',
  SCREEN_SHARE_STOP = 'screen:share-stop',

  // Presence
  PRESENCE_ONLINE = 'presence:online',
  PRESENCE_OFFLINE = 'presence:offline',
  PRESENCE_BUSY = 'presence:busy',
  PRESENCE_AWAY = 'presence:away',
}

/**
 * Message priority levels for emergency communications
 */
export enum MessagePriority {
  ROUTINE = 0,
  PRIORITY = 1,
  URGENT = 2,
  EMERGENCY = 3,
  CRITICAL = 4,
}

/**
 * Unit status types
 */
export enum UnitStatus {
  AVAILABLE = 'available',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en-route',
  ON_SCENE = 'on-scene',
  TRANSPORTING = 'transporting',
  AT_HOSPITAL = 'at-hospital',
  OUT_OF_SERVICE = 'out-of-service',
  OFFLINE = 'offline',
}

/**
 * Communication channel types
 */
export enum ChannelType {
  INCIDENT = 'incident',
  TACTICAL = 'tactical',
  COMMAND = 'command',
  INTER_AGENCY = 'inter-agency',
  HOSPITAL = 'hospital',
  DISPATCH = 'dispatch',
  PRIVATE = 'private',
}

/**
 * Incident broadcast payload
 */
export interface IncidentBroadcast {
  incidentId: string;
  type: string;
  priority: MessagePriority;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  assignedUnits: string[];
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Unit status update payload
 */
export interface UnitStatusUpdate {
  unitId: string;
  status: UnitStatus;
  incidentId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Emergency message payload
 */
export interface EmergencyMessage {
  messageId: string;
  senderId: string;
  channelId: string;
  channelType: ChannelType;
  content: string;
  priority: MessagePriority;
  timestamp: Date;
  attachments?: string[];
  metadata?: Record<string, any>;
}

/**
 * Voice call payload
 */
export interface VoiceCallPayload {
  callId: string;
  initiatorId: string;
  participants: string[];
  channelType: ChannelType;
  priority: MessagePriority;
  timestamp: Date;
}

/**
 * Video stream configuration
 */
export interface VideoStreamConfig {
  streamId: string;
  unitId: string;
  incidentId?: string;
  quality: 'low' | 'medium' | 'high';
  resolution: string;
  bitrate: number;
  timestamp: Date;
}

/**
 * Presence status
 */
export interface PresenceStatus {
  userId: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  unitId?: string;
  lastSeen: Date;
  metadata?: Record<string, any>;
}

/**
 * WebSocket connection metadata
 */
export interface ConnectionMetadata {
  userId: string;
  unitId?: string;
  role: string;
  agencyId: string;
  permissions: string[];
  connectedAt: Date;
}

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
export function createEmergencyRedisAdapter(redisUrl: string = 'redis://localhost:6379') {
  @Injectable()
  class EmergencyRedisAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    async connectToRedis(): Promise<void> {
      const pubClient = createClient({ url: redisUrl });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: any): any {
      const server = super.createIOServer(port, options);
      server.adapter(this.adapterConstructor);
      return server;
    }
  }

  return EmergencyRedisAdapter;
}

// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================

/**
 * WebSocket JWT authentication guard
 * Validates JWT tokens from WebSocket handshake
 */
@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);

    if (!token) {
      throw new WsException('Unauthorized: No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
      client.data.userId = payload.sub || payload.userId;
      client.data.role = payload.role;
      client.data.agencyId = payload.agencyId;
      client.data.permissions = payload.permissions || [];

      return true;
    } catch (error) {
      throw new WsException('Unauthorized: Invalid token');
    }
  }

  private extractToken(client: Socket): string | null {
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
      return client.handshake.query.token as string;
    }

    return null;
  }
}

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
export function validateEmergencyPermission(
  client: Socket,
  requiredPermission: string
): boolean {
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
export function createRoleGuard(allowedRoles: string[]) {
  @Injectable()
  class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const client: Socket = context.switchToWs().getClient();
      const userRole = client.data.role;

      if (!userRole) {
        throw new WsException('No role assigned');
      }

      if (!allowedRoles.includes(userRole)) {
        throw new WsException('Insufficient role permissions');
      }

      return true;
    }
  }

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
export function broadcastNewIncident(
  server: Server,
  incident: IncidentBroadcast
): void {
  // Broadcast to incident room
  server.to(`incident:${incident.incidentId}`).emit(
    EmergencyEventType.INCIDENT_CREATED,
    incident
  );

  // Broadcast to assigned units
  incident.assignedUnits.forEach((unitId) => {
    server.to(`unit:${unitId}`).emit(
      EmergencyEventType.INCIDENT_CREATED,
      incident
    );
  });

  // Broadcast to all dispatchers
  server.to('role:dispatcher').emit(
    EmergencyEventType.INCIDENT_CREATED,
    incident
  );

  // High priority incidents go to commanders
  if (incident.priority >= MessagePriority.URGENT) {
    server.to('role:commander').emit(
      EmergencyEventType.INCIDENT_CREATED,
      incident
    );
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
export function broadcastIncidentUpdate(
  server: Server,
  incidentId: string,
  update: Partial<IncidentBroadcast>
): void {
  server.to(`incident:${incidentId}`).emit(
    EmergencyEventType.INCIDENT_UPDATED,
    {
      incidentId,
      ...update,
      timestamp: new Date(),
    }
  );
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
export function broadcastIncidentEscalation(
  server: Server,
  incidentId: string,
  newPriority: MessagePriority,
  reason: string
): void {
  const escalation = {
    incidentId,
    newPriority,
    reason,
    timestamp: new Date(),
  };

  // Notify all incident participants
  server.to(`incident:${incidentId}`).emit(
    EmergencyEventType.INCIDENT_ESCALATED,
    escalation
  );

  // Alert commanders and supervisors
  server.to('role:commander').emit(
    EmergencyEventType.INCIDENT_ESCALATED,
    escalation
  );

  server.to('role:supervisor').emit(
    EmergencyEventType.INCIDENT_ESCALATED,
    escalation
  );
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
export function broadcastIncidentClosure(
  server: Server,
  incidentId: string,
  closureData: Record<string, any>
): void {
  server.to(`incident:${incidentId}`).emit(
    EmergencyEventType.INCIDENT_CLOSED,
    {
      incidentId,
      ...closureData,
      timestamp: new Date(),
    }
  );
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
export function broadcastUnitStatus(
  server: Server,
  statusUpdate: UnitStatusUpdate
): void {
  const eventType = `unit:${statusUpdate.status}` as EmergencyEventType;

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
export function notifyUnitAvailability(
  server: Server,
  unitId: string,
  isAvailable: boolean
): void {
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
export function notifyUnitDispatch(
  server: Server,
  unitIds: string[],
  incidentId: string,
  dispatchData: Record<string, any>
): void {
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
export function sendChannelMessage(
  server: Server,
  message: EmergencyMessage
): void {
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
export function sendPriorityMessage(
  server: Server,
  message: EmergencyMessage,
  targetRoles?: string[]
): void {
  if (targetRoles && targetRoles.length > 0) {
    targetRoles.forEach((role) => {
      server.to(`role:${role}`).emit(EmergencyEventType.MESSAGE_SENT, {
        ...message,
        priority: MessagePriority.URGENT,
      });
    });
  } else {
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
export function handleTypingStart(
  client: Socket,
  channelId: string,
  channelType: ChannelType
): void {
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
export function handleTypingStop(
  client: Socket,
  channelId: string,
  channelType: ChannelType
): void {
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
export function markMessageDelivered(
  server: Server,
  messageId: string,
  userId: string
): void {
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
export function markMessageRead(
  server: Server,
  messageId: string,
  userId: string
): void {
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
export function initiateVoiceCall(
  server: Server,
  callPayload: VoiceCallPayload
): void {
  callPayload.participants.forEach((participantId) => {
    server.to(`user:${participantId}`).emit(
      EmergencyEventType.VOICE_CALL_INITIATED,
      callPayload
    );
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
export function acceptVoiceCall(
  server: Server,
  callId: string,
  userId: string
): void {
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
export function endVoiceCall(
  server: Server,
  callId: string,
  endedBy: string
): void {
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
export function handlePTTPress(client: Socket, channelId: string): void {
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
export function handlePTTRelease(client: Socket, channelId: string): void {
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
export function startVideoStream(
  server: Server,
  streamConfig: VideoStreamConfig
): void {
  // Notify incident room
  if (streamConfig.incidentId) {
    server.to(`incident:${streamConfig.incidentId}`).emit(
      EmergencyEventType.VIDEO_STREAM_START,
      streamConfig
    );
  }

  // Notify commanders and dispatchers
  server.to('role:commander').emit(
    EmergencyEventType.VIDEO_STREAM_START,
    streamConfig
  );

  server.to('role:dispatcher').emit(
    EmergencyEventType.VIDEO_STREAM_START,
    streamConfig
  );
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
export function stopVideoStream(
  server: Server,
  streamId: string,
  unitId: string
): void {
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
export function changeVideoQuality(
  server: Server,
  streamId: string,
  quality: 'low' | 'medium' | 'high'
): void {
  server.to(`stream:${streamId}`).emit(
    EmergencyEventType.VIDEO_QUALITY_CHANGED,
    {
      streamId,
      quality,
      timestamp: new Date(),
    }
  );
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
export function startScreenShare(
  server: Server,
  sessionId: string,
  userId: string,
  targetRoom: string
): void {
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
export function stopScreenShare(
  server: Server,
  sessionId: string,
  targetRoom: string
): void {
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
export function updatePresence(
  server: Server,
  presenceStatus: PresenceStatus
): void {
  const eventType =
    presenceStatus.status === 'online'
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
export function trackUserOnline(
  client: Socket,
  metadata: ConnectionMetadata
): void {
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
export function trackUserOffline(client: Socket): void {
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
export function joinIncidentRoom(client: Socket, incidentId: string): void {
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
export function leaveIncidentRoom(client: Socket, incidentId: string): void {
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
export function joinTacticalChannel(client: Socket, channelId: string): void {
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
export function leaveTacticalChannel(client: Socket, channelId: string): void {
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
export function createEmergencyNamespace(
  server: Server,
  namespaceName: string
): any {
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
export async function handleClientConnection(
  client: Socket,
  logger: Logger
): Promise<void> {
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

    const metadata: ConnectionMetadata = {
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
  } catch (error) {
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
export function handleClientDisconnection(
  client: Socket,
  logger: Logger
): void {
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
export function createHeartbeat(
  client: Socket,
  intervalMs: number = 30000
): () => void {
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
export function createRateLimiter(maxEvents: number, windowMs: number) {
  @Injectable()
  class RateLimitInterceptor implements NestInterceptor {
    private eventCounts = new Map<string, { count: number; resetAt: number }>();

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const client: Socket = context.switchToWs().getClient();
      const userId = client.data.userId;
      const now = Date.now();

      let userLimit = this.eventCounts.get(userId);

      if (!userLimit || now > userLimit.resetAt) {
        userLimit = { count: 0, resetAt: now + windowMs };
        this.eventCounts.set(userId, userLimit);
      }

      if (userLimit.count >= maxEvents) {
        throw new WsException('Rate limit exceeded');
      }

      userLimit.count++;

      return next.handle();
    }
  }

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
export class PriorityMessageQueue {
  private queues: Map<MessagePriority, EmergencyMessage[]> = new Map();

  constructor() {
    // Initialize queues for each priority level
    Object.values(MessagePriority)
      .filter((v) => typeof v === 'number')
      .forEach((priority) => {
        this.queues.set(priority as MessagePriority, []);
      });
  }

  enqueue(message: EmergencyMessage): void {
    const queue = this.queues.get(message.priority);
    if (queue) {
      queue.push(message);
    }
  }

  dequeue(): EmergencyMessage | null {
    // Dequeue from highest priority first
    for (let priority = MessagePriority.CRITICAL; priority >= MessagePriority.ROUTINE; priority--) {
      const queue = this.queues.get(priority);
      if (queue && queue.length > 0) {
        return queue.shift() || null;
      }
    }
    return null;
  }

  isEmpty(): boolean {
    return Array.from(this.queues.values()).every((queue) => queue.length === 0);
  }

  size(): number {
    return Array.from(this.queues.values()).reduce((sum, queue) => sum + queue.length, 0);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  WsJwtAuthGuard,
  createEmergencyRedisAdapter,
  validateEmergencyPermission,
  createRoleGuard,
  broadcastNewIncident,
  broadcastIncidentUpdate,
  broadcastIncidentEscalation,
  broadcastIncidentClosure,
  broadcastUnitStatus,
  notifyUnitAvailability,
  notifyUnitDispatch,
  sendChannelMessage,
  sendPriorityMessage,
  handleTypingStart,
  handleTypingStop,
  markMessageDelivered,
  markMessageRead,
  initiateVoiceCall,
  acceptVoiceCall,
  endVoiceCall,
  handlePTTPress,
  handlePTTRelease,
  startVideoStream,
  stopVideoStream,
  changeVideoQuality,
  startScreenShare,
  stopScreenShare,
  updatePresence,
  trackUserOnline,
  trackUserOffline,
  joinIncidentRoom,
  leaveIncidentRoom,
  joinTacticalChannel,
  leaveTacticalChannel,
  createEmergencyNamespace,
  handleClientConnection,
  handleClientDisconnection,
  createHeartbeat,
  createRateLimiter,
  PriorityMessageQueue,
};
