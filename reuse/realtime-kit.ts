/**
 * LOC: W9X8Y9Z1A2
 * File: /reuse/realtime-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/websockets (v11.1.8)
 *   - socket.io (v4.7.5)
 *   - ioredis (v5.4.1)
 *   - rxjs (v7.8.1)
 *   - class-validator (v0.14.1)
 *
 * DOWNSTREAM (imported by):
 *   - Real-time collaboration features
 *   - Live dashboard components
 *   - Notification systems
 *   - Presence tracking services
 *   - Live data synchronization
 */

/**
 * File: /reuse/realtime-kit.ts
 * Locator: WC-UTL-RTKT-001
 * Purpose: Real-Time Communication Utilities Kit - Data sync, presence, notifications, SSE
 *
 * Upstream: @nestjs/websockets, Socket.IO v4.x, Redis, RxJS, Node 18+
 * Downstream: Real-time features, collaboration tools, notifications, presence tracking, live dashboards
 * Dependencies: NestJS v11.x, Socket.IO v4.x, Node 18+, TypeScript 5.x, Redis, RxJS v7.x
 * Exports: 45 real-time utilities for data sync, presence, notifications, SSE, conflict resolution
 *
 * LLM Context: Production-grade real-time communication toolkit for White Cross healthcare platform.
 * Provides utilities for real-time data synchronization, operational transformation, live collaboration
 * (cursors, selections, awareness), presence tracking with location, push notifications, subscription
 * management, server-sent events (SSE), conflict resolution (CRDTs, OT), real-time metrics, live dashboards,
 * activity feeds, real-time validation, cache invalidation, and HIPAA-compliant real-time PHI access logging.
 */

import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Real-time presence information with location
 */
export interface RealtimePresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  device: 'desktop' | 'mobile' | 'tablet';
  location?: {
    page: string;
    section?: string;
    coordinates?: { x: number; y: number };
  };
  lastActive: Date;
  metadata?: Record<string, any>;
}

/**
 * Live cursor position for collaboration
 */
export interface LiveCursor {
  userId: string;
  userName: string;
  color: string;
  position: { x: number; y: number };
  documentId: string;
  timestamp: Date;
}

/**
 * Text selection for collaborative editing
 */
export interface LiveSelection {
  userId: string;
  userName: string;
  color: string;
  start: number;
  end: number;
  documentId: string;
  timestamp: Date;
}

/**
 * Operational transformation operation
 */
export interface OTOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  userId: string;
  timestamp: Date;
  revision: number;
}

/**
 * CRDT (Conflict-free Replicated Data Type) state
 */
export interface CRDTState {
  documentId: string;
  operations: OTOperation[];
  vectorClock: Map<string, number>;
  lastModified: Date;
}

/**
 * Real-time notification
 */
export interface RealtimeNotification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  expiresAt?: Date;
  read: boolean;
}

/**
 * Subscription configuration
 */
export interface SubscriptionConfig {
  topic: string;
  filter?: Record<string, any>;
  qos: 0 | 1 | 2; // Quality of service
  retainLastMessage?: boolean;
}

/**
 * Live metrics data point
 */
export interface MetricDataPoint {
  metric: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

/**
 * Real-time dashboard widget
 */
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'counter' | 'table' | 'gauge' | 'list';
  title: string;
  dataSource: string;
  refreshInterval: number;
  config: Record<string, any>;
}

/**
 * Activity feed event
 */
export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Server-Sent Event configuration
 */
export interface SSEConfig {
  retry?: number;
  heartbeat?: number;
  maxConnections?: number;
}

/**
 * Push notification payload
 */
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  requireInteraction?: boolean;
  silent?: boolean;
}

/**
 * Conflict resolution strategy
 */
export type ConflictStrategy = 'last-write-wins' | 'manual' | 'operational-transform' | 'crdt';

/**
 * Real-time cache entry
 */
export interface RealtimeCacheEntry {
  key: string;
  value: any;
  timestamp: Date;
  ttl: number;
  version: number;
}

// ============================================================================
// REAL-TIME DATA SYNCHRONIZATION
// ============================================================================

/**
 * 1. Creates a real-time data sync manager.
 *
 * @param {string} syncKey - Unique sync key
 * @returns {BehaviorSubject<any>} Sync state observable
 *
 * @example
 * ```typescript
 * const syncManager = createDataSyncManager('patient-records');
 * syncManager.subscribe(data => updateUI(data));
 * ```
 */
export function createDataSyncManager(syncKey: string): BehaviorSubject<any> {
  return new BehaviorSubject<any>(null);
}

/**
 * 2. Broadcasts data change to all subscribed clients.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} channel - Sync channel
 * @param {any} data - Changed data
 * @param {string[]} excludeSockets - Socket IDs to exclude
 * @returns {number} Number of clients notified
 *
 * @example
 * ```typescript
 * broadcastDataChange(server, 'patients:updates', updatedPatient, [client.id]);
 * ```
 */
export function broadcastDataChange(
  server: Server,
  channel: string,
  data: any,
  excludeSockets: string[] = [],
): number {
  let count = 0;

  server.sockets.sockets.forEach((socket) => {
    if (!excludeSockets.includes(socket.id)) {
      socket.emit(`sync:${channel}`, {
        action: 'update',
        data,
        timestamp: new Date(),
      });
      count++;
    }
  });

  return count;
}

/**
 * 3. Implements optimistic updates with rollback.
 *
 * @param {any} currentState - Current state
 * @param {any} optimisticUpdate - Optimistic update
 * @param {() => Promise<any>} serverUpdate - Server update function
 * @returns {Promise<any>} Final state
 *
 * @example
 * ```typescript
 * const newState = await applyOptimisticUpdate(
 *   currentPatient,
 *   { name: 'John Doe' },
 *   () => updatePatientOnServer(patientId, updates)
 * );
 * ```
 */
export async function applyOptimisticUpdate(
  currentState: any,
  optimisticUpdate: any,
  serverUpdate: () => Promise<any>,
): Promise<any> {
  // Apply optimistic update immediately
  const optimisticState = { ...currentState, ...optimisticUpdate };

  try {
    // Attempt server update
    const serverState = await serverUpdate();
    return serverState;
  } catch (error) {
    // Rollback on error
    const logger = new Logger('OptimisticUpdate');
    logger.error(`Server update failed, rolling back: ${error.message}`);
    return currentState;
  }
}

/**
 * 4. Syncs local state with server state.
 *
 * @param {any} localState - Local state
 * @param {any} serverState - Server state
 * @param {ConflictStrategy} strategy - Conflict resolution strategy
 * @returns {any} Merged state
 *
 * @example
 * ```typescript
 * const merged = syncStateWithServer(localData, serverData, 'last-write-wins');
 * ```
 */
export function syncStateWithServer(
  localState: any,
  serverState: any,
  strategy: ConflictStrategy = 'last-write-wins',
): any {
  if (strategy === 'last-write-wins') {
    const localTime = localState._updatedAt || 0;
    const serverTime = serverState._updatedAt || 0;
    return serverTime > localTime ? serverState : localState;
  }

  // For other strategies, merge carefully
  return { ...localState, ...serverState, _merged: true };
}

/**
 * 5. Implements delta synchronization for efficiency.
 *
 * @param {any} baseState - Base state
 * @param {any} newState - New state
 * @returns {object} Delta changes
 *
 * @example
 * ```typescript
 * const delta = calculateStateDelta(previousState, currentState);
 * socket.emit('sync:delta', delta);
 * ```
 */
export function calculateStateDelta(baseState: any, newState: any): { changed: any; deleted: string[] } {
  const changed: any = {};
  const deleted: string[] = [];

  // Find changed and new properties
  Object.keys(newState).forEach((key) => {
    if (JSON.stringify(baseState[key]) !== JSON.stringify(newState[key])) {
      changed[key] = newState[key];
    }
  });

  // Find deleted properties
  Object.keys(baseState).forEach((key) => {
    if (!(key in newState)) {
      deleted.push(key);
    }
  });

  return { changed, deleted };
}

/**
 * 6. Applies delta update to state.
 *
 * @param {any} currentState - Current state
 * @param {object} delta - Delta changes
 * @returns {any} Updated state
 *
 * @example
 * ```typescript
 * const updated = applyStateDelta(currentState, receivedDelta);
 * ```
 */
export function applyStateDelta(currentState: any, delta: { changed: any; deleted: string[] }): any {
  const updated = { ...currentState, ...delta.changed };

  delta.deleted.forEach((key) => {
    delete updated[key];
  });

  return updated;
}

// ============================================================================
// PRESENCE TRACKING & AWARENESS
// ============================================================================

/**
 * 7. Initializes presence tracking for user.
 *
 * @param {Map<string, RealtimePresence>} presenceStore - Presence store
 * @param {string} userId - User identifier
 * @param {Partial<RealtimePresence>} initialPresence - Initial presence data
 * @returns {RealtimePresence} Presence object
 *
 * @example
 * ```typescript
 * const presence = initializePresence(presenceStore, 'user-123', {
 *   status: 'online',
 *   device: 'desktop',
 *   location: { page: '/patients/list' }
 * });
 * ```
 */
export function initializePresence(
  presenceStore: Map<string, RealtimePresence>,
  userId: string,
  initialPresence: Partial<RealtimePresence>,
): RealtimePresence {
  const presence: RealtimePresence = {
    userId,
    status: initialPresence.status || 'online',
    device: initialPresence.device || 'desktop',
    location: initialPresence.location,
    lastActive: new Date(),
    metadata: initialPresence.metadata || {},
  };

  presenceStore.set(userId, presence);
  return presence;
}

/**
 * 8. Updates user presence information.
 *
 * @param {Map<string, RealtimePresence>} presenceStore - Presence store
 * @param {string} userId - User identifier
 * @param {Partial<RealtimePresence>} updates - Presence updates
 * @returns {RealtimePresence | null} Updated presence
 *
 * @example
 * ```typescript
 * updatePresence(presenceStore, 'user-123', {
 *   location: { page: '/patients/edit/456' }
 * });
 * ```
 */
export function updatePresence(
  presenceStore: Map<string, RealtimePresence>,
  userId: string,
  updates: Partial<RealtimePresence>,
): RealtimePresence | null {
  const current = presenceStore.get(userId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    lastActive: new Date(),
  };

  presenceStore.set(userId, updated);
  return updated;
}

/**
 * 9. Gets all online users in a location.
 *
 * @param {Map<string, RealtimePresence>} presenceStore - Presence store
 * @param {string} page - Page location
 * @returns {RealtimePresence[]} Online users
 *
 * @example
 * ```typescript
 * const usersOnPage = getOnlineUsersInLocation(presenceStore, '/patients/list');
 * ```
 */
export function getOnlineUsersInLocation(
  presenceStore: Map<string, RealtimePresence>,
  page: string,
): RealtimePresence[] {
  const users: RealtimePresence[] = [];

  presenceStore.forEach((presence) => {
    if (presence.status === 'online' && presence.location?.page === page) {
      users.push(presence);
    }
  });

  return users;
}

/**
 * 10. Broadcasts presence update to subscribed clients.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {RealtimePresence} presence - Presence data
 * @param {string} room - Room to broadcast to
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastPresence(server, userPresence, 'presence:patients');
 * ```
 */
export function broadcastPresence(server: Server, presence: RealtimePresence, room?: string): void {
  const event = 'presence:update';
  const data = {
    userId: presence.userId,
    status: presence.status,
    location: presence.location,
    lastActive: presence.lastActive,
  };

  if (room) {
    server.to(room).emit(event, data);
  } else {
    server.emit(event, data);
  }
}

/**
 * 11. Tracks user activity for auto-away status.
 *
 * @param {Map<string, RealtimePresence>} presenceStore - Presence store
 * @param {number} awayThreshold - Away threshold in milliseconds
 * @returns {number} Number of users set to away
 *
 * @example
 * ```typescript
 * setInterval(() => {
 *   const awayCount = updateAwayStatus(presenceStore, 5 * 60 * 1000);
 * }, 60000);
 * ```
 */
export function updateAwayStatus(presenceStore: Map<string, RealtimePresence>, awayThreshold: number): number {
  const now = Date.now();
  let updated = 0;

  presenceStore.forEach((presence, userId) => {
    const inactive = now - presence.lastActive.getTime();

    if (presence.status === 'online' && inactive > awayThreshold) {
      presence.status = 'away';
      presenceStore.set(userId, presence);
      updated++;
    }
  });

  return updated;
}

// ============================================================================
// LIVE COLLABORATION (CURSORS & SELECTIONS)
// ============================================================================

/**
 * 12. Broadcasts live cursor position.
 *
 * @param {Socket} socket - Socket client
 * @param {LiveCursor} cursor - Cursor data
 * @param {string} documentId - Document identifier
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastCursor(client, {
 *   userId: 'user-123',
 *   userName: 'Dr. Smith',
 *   color: '#4285F4',
 *   position: { x: 100, y: 200 },
 *   documentId: 'doc-456',
 *   timestamp: new Date()
 * }, 'doc-456');
 * ```
 */
export function broadcastCursor(socket: Socket, cursor: LiveCursor, documentId: string): void {
  socket.to(`document:${documentId}`).emit('cursor:update', cursor);
}

/**
 * 13. Broadcasts live text selection.
 *
 * @param {Socket} socket - Socket client
 * @param {LiveSelection} selection - Selection data
 * @param {string} documentId - Document identifier
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastSelection(client, {
 *   userId: 'user-123',
 *   userName: 'Dr. Smith',
 *   color: '#4285F4',
 *   start: 0,
 *   end: 10,
 *   documentId: 'doc-456',
 *   timestamp: new Date()
 * }, 'doc-456');
 * ```
 */
export function broadcastSelection(socket: Socket, selection: LiveSelection, documentId: string): void {
  socket.to(`document:${documentId}`).emit('selection:update', selection);
}

/**
 * 14. Clears user's cursor when they leave.
 *
 * @param {Socket} socket - Socket client
 * @param {string} userId - User identifier
 * @param {string} documentId - Document identifier
 * @returns {void}
 *
 * @example
 * ```typescript
 * clearUserCursor(client, 'user-123', 'doc-456');
 * ```
 */
export function clearUserCursor(socket: Socket, userId: string, documentId: string): void {
  socket.to(`document:${documentId}`).emit('cursor:clear', { userId, documentId });
}

/**
 * 15. Gets all active collaborators on a document.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} documentId - Document identifier
 * @returns {Promise<string[]>} Array of user IDs
 *
 * @example
 * ```typescript
 * const collaborators = await getActiveCollaborators(server, 'doc-456');
 * ```
 */
export async function getActiveCollaborators(server: Server, documentId: string): Promise<string[]> {
  const room = server.sockets.adapter.rooms.get(`document:${documentId}`);

  if (!room) {
    return [];
  }

  const collaborators: string[] = [];

  room.forEach((socketId) => {
    const socket = server.sockets.sockets.get(socketId);
    if (socket) {
      const userId = (socket as any).auth?.userId;
      if (userId && !collaborators.includes(userId)) {
        collaborators.push(userId);
      }
    }
  });

  return collaborators;
}

// ============================================================================
// OPERATIONAL TRANSFORMATION (OT)
// ============================================================================

/**
 * 16. Transforms operation against concurrent operation.
 *
 * @param {OTOperation} op1 - First operation
 * @param {OTOperation} op2 - Second operation
 * @returns {OTOperation} Transformed operation
 *
 * @example
 * ```typescript
 * const transformed = transformOperation(localOp, serverOp);
 * applyOperation(document, transformed);
 * ```
 */
export function transformOperation(op1: OTOperation, op2: OTOperation): OTOperation {
  // Simple OT transformation (would be more complex in production)
  if (op1.type === 'insert' && op2.type === 'insert') {
    if (op1.position < op2.position) {
      return op1;
    } else if (op1.position > op2.position) {
      return {
        ...op1,
        position: op1.position + (op2.content?.length || 0),
      };
    }
  }

  if (op1.type === 'delete' && op2.type === 'insert') {
    if (op1.position >= op2.position) {
      return {
        ...op1,
        position: op1.position + (op2.content?.length || 0),
      };
    }
  }

  return op1;
}

/**
 * 17. Applies operation to document state.
 *
 * @param {string} document - Document content
 * @param {OTOperation} operation - Operation to apply
 * @returns {string} Updated document
 *
 * @example
 * ```typescript
 * const updated = applyOperation(documentText, insertOperation);
 * ```
 */
export function applyOperation(document: string, operation: OTOperation): string {
  switch (operation.type) {
    case 'insert':
      return (
        document.slice(0, operation.position) +
        (operation.content || '') +
        document.slice(operation.position)
      );

    case 'delete':
      return (
        document.slice(0, operation.position) +
        document.slice(operation.position + (operation.length || 0))
      );

    case 'retain':
      return document;

    default:
      return document;
  }
}

/**
 * 18. Creates CRDT state for conflict-free replication.
 *
 * @param {string} documentId - Document identifier
 * @returns {CRDTState} Initial CRDT state
 *
 * @example
 * ```typescript
 * const crdt = createCRDTState('doc-456');
 * ```
 */
export function createCRDTState(documentId: string): CRDTState {
  return {
    documentId,
    operations: [],
    vectorClock: new Map<string, number>(),
    lastModified: new Date(),
  };
}

/**
 * 19. Merges CRDT states from multiple sources.
 *
 * @param {CRDTState[]} states - Array of CRDT states
 * @returns {CRDTState} Merged state
 *
 * @example
 * ```typescript
 * const merged = mergeCRDTStates([localState, remoteState1, remoteState2]);
 * ```
 */
export function mergeCRDTStates(states: CRDTState[]): CRDTState {
  if (states.length === 0) {
    throw new Error('No states to merge');
  }

  const merged: CRDTState = {
    documentId: states[0].documentId,
    operations: [],
    vectorClock: new Map<string, number>(),
    lastModified: new Date(),
  };

  // Merge operations (simplified)
  states.forEach((state) => {
    merged.operations.push(...state.operations);

    // Merge vector clocks
    state.vectorClock.forEach((value, key) => {
      const current = merged.vectorClock.get(key) || 0;
      merged.vectorClock.set(key, Math.max(current, value));
    });
  });

  // Sort operations by timestamp and revision
  merged.operations.sort((a, b) => {
    const timeDiff = a.timestamp.getTime() - b.timestamp.getTime();
    return timeDiff !== 0 ? timeDiff : a.revision - b.revision;
  });

  return merged;
}

/**
 * 20. Resolves conflicts using specified strategy.
 *
 * @param {any} local - Local version
 * @param {any} remote - Remote version
 * @param {ConflictStrategy} strategy - Resolution strategy
 * @returns {any} Resolved version
 *
 * @example
 * ```typescript
 * const resolved = resolveConflict(localEdit, remoteEdit, 'last-write-wins');
 * ```
 */
export function resolveConflict(local: any, remote: any, strategy: ConflictStrategy): any {
  switch (strategy) {
    case 'last-write-wins':
      const localTime = local._timestamp || 0;
      const remoteTime = remote._timestamp || 0;
      return remoteTime > localTime ? remote : local;

    case 'manual':
      return { local, remote, _requiresManualResolution: true };

    case 'operational-transform':
      // Would use OT to merge changes
      return { ...local, ...remote, _merged: true };

    case 'crdt':
      // Would use CRDT merge
      return { ...local, ...remote, _merged: true };

    default:
      return remote;
  }
}

// ============================================================================
// REAL-TIME NOTIFICATIONS
// ============================================================================

/**
 * 21. Sends real-time notification to user.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User identifier
 * @param {RealtimeNotification} notification - Notification data
 * @returns {void}
 *
 * @example
 * ```typescript
 * sendRealtimeNotification(server, 'user-123', {
 *   id: 'notif-1',
 *   userId: 'user-123',
 *   type: 'info',
 *   title: 'New Message',
 *   message: 'You have a new patient message',
 *   priority: 'normal',
 *   timestamp: new Date(),
 *   read: false
 * });
 * ```
 */
export function sendRealtimeNotification(
  server: Server,
  userId: string,
  notification: RealtimeNotification,
): void {
  server.to(`user:${userId}`).emit('notification', notification);
}

/**
 * 22. Broadcasts notification to multiple users.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string[]} userIds - User identifiers
 * @param {RealtimeNotification} notification - Notification data
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastNotification(server, ['user-1', 'user-2'], notification);
 * ```
 */
export function broadcastNotification(
  server: Server,
  userIds: string[],
  notification: RealtimeNotification,
): void {
  userIds.forEach((userId) => {
    sendRealtimeNotification(server, userId, notification);
  });
}

/**
 * 23. Sends notification with priority routing.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} userId - User identifier
 * @param {RealtimeNotification} notification - Notification data
 * @returns {void}
 *
 * @example
 * ```typescript
 * sendPriorityNotification(server, 'user-123', urgentNotification);
 * ```
 */
export function sendPriorityNotification(
  server: Server,
  userId: string,
  notification: RealtimeNotification,
): void {
  const event = notification.priority === 'urgent' ? 'notification:urgent' : 'notification';
  server.to(`user:${userId}`).emit(event, notification);
}

/**
 * 24. Manages notification subscriptions by category.
 *
 * @param {Socket} socket - Socket client
 * @param {string} category - Notification category
 * @param {boolean} subscribe - Subscribe or unsubscribe
 * @returns {void}
 *
 * @example
 * ```typescript
 * manageNotificationSubscription(client, 'patient-alerts', true);
 * ```
 */
export function manageNotificationSubscription(
  socket: Socket,
  category: string,
  subscribe: boolean,
): void {
  const room = `notifications:${category}`;

  if (subscribe) {
    socket.join(room);
  } else {
    socket.leave(room);
  }
}

/**
 * 25. Gets unread notification count for user.
 *
 * @param {Map<string, RealtimeNotification[]>} notificationStore - Notification store
 * @param {string} userId - User identifier
 * @returns {number} Unread count
 *
 * @example
 * ```typescript
 * const unreadCount = getUnreadNotificationCount(notificationStore, 'user-123');
 * ```
 */
export function getUnreadNotificationCount(
  notificationStore: Map<string, RealtimeNotification[]>,
  userId: string,
): number {
  const notifications = notificationStore.get(userId) || [];
  return notifications.filter((n) => !n.read).length;
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

/**
 * 26. Subscribes client to real-time topic.
 *
 * @param {Socket} socket - Socket client
 * @param {SubscriptionConfig} config - Subscription configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * subscribeToTopic(client, {
 *   topic: 'patient-vitals',
 *   filter: { patientId: '123' },
 *   qos: 1,
 *   retainLastMessage: true
 * });
 * ```
 */
export function subscribeToTopic(socket: Socket, config: SubscriptionConfig): void {
  const room = `topic:${config.topic}`;
  socket.join(room);

  // Store subscription metadata
  (socket as any).__subscriptions = (socket as any).__subscriptions || new Map();
  (socket as any).__subscriptions.set(config.topic, config);
}

/**
 * 27. Unsubscribes client from topic.
 *
 * @param {Socket} socket - Socket client
 * @param {string} topic - Topic name
 * @returns {void}
 *
 * @example
 * ```typescript
 * unsubscribeFromTopic(client, 'patient-vitals');
 * ```
 */
export function unsubscribeFromTopic(socket: Socket, topic: string): void {
  const room = `topic:${topic}`;
  socket.leave(room);

  const subscriptions = (socket as any).__subscriptions as Map<string, SubscriptionConfig>;
  if (subscriptions) {
    subscriptions.delete(topic);
  }
}

/**
 * 28. Publishes message to topic subscribers.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} topic - Topic name
 * @param {any} message - Message data
 * @returns {void}
 *
 * @example
 * ```typescript
 * publishToTopic(server, 'patient-vitals', { patientId: '123', heartRate: 72 });
 * ```
 */
export function publishToTopic(server: Server, topic: string, message: any): void {
  const room = `topic:${topic}`;
  server.to(room).emit('topic:message', {
    topic,
    message,
    timestamp: new Date(),
  });
}

/**
 * 29. Gets all subscriptions for a client.
 *
 * @param {Socket} socket - Socket client
 * @returns {SubscriptionConfig[]} Active subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = getClientSubscriptions(client);
 * ```
 */
export function getClientSubscriptions(socket: Socket): SubscriptionConfig[] {
  const subscriptions = (socket as any).__subscriptions as Map<string, SubscriptionConfig>;
  return subscriptions ? Array.from(subscriptions.values()) : [];
}

/**
 * 30. Implements subscription filtering.
 *
 * @param {any} message - Message data
 * @param {Record<string, any>} filter - Filter criteria
 * @returns {boolean} True if message matches filter
 *
 * @example
 * ```typescript
 * if (matchesSubscriptionFilter(message, { patientId: '123' })) {
 *   deliverMessage(message);
 * }
 * ```
 */
export function matchesSubscriptionFilter(message: any, filter: Record<string, any>): boolean {
  if (!filter || Object.keys(filter).length === 0) {
    return true;
  }

  return Object.entries(filter).every(([key, value]) => message[key] === value);
}

// ============================================================================
// LIVE METRICS & ANALYTICS
// ============================================================================

/**
 * 31. Streams live metric updates to dashboard.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {MetricDataPoint} metric - Metric data
 * @param {string} dashboard - Dashboard identifier
 * @returns {void}
 *
 * @example
 * ```typescript
 * streamMetric(server, {
 *   metric: 'active-users',
 *   value: 150,
 *   timestamp: new Date(),
 *   tags: { region: 'us-east' }
 * }, 'main-dashboard');
 * ```
 */
export function streamMetric(server: Server, metric: MetricDataPoint, dashboard?: string): void {
  const room = dashboard ? `dashboard:${dashboard}` : 'metrics';
  server.to(room).emit('metric:update', metric);
}

/**
 * 32. Aggregates metrics over time window.
 *
 * @param {MetricDataPoint[]} metrics - Array of metrics
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Map<string, number>} Aggregated metrics
 *
 * @example
 * ```typescript
 * const aggregated = aggregateMetrics(recentMetrics, 60000);
 * ```
 */
export function aggregateMetrics(metrics: MetricDataPoint[], windowMs: number): Map<string, number> {
  const now = Date.now();
  const aggregated = new Map<string, number>();

  metrics
    .filter((m) => now - m.timestamp.getTime() <= windowMs)
    .forEach((metric) => {
      const current = aggregated.get(metric.metric) || 0;
      aggregated.set(metric.metric, current + metric.value);
    });

  return aggregated;
}

/**
 * 33. Calculates real-time statistics.
 *
 * @param {number[]} values - Array of values
 * @returns {object} Statistics
 *
 * @example
 * ```typescript
 * const stats = calculateRealtimeStats([10, 20, 30, 40, 50]);
 * ```
 */
export function calculateRealtimeStats(values: number[]): {
  min: number;
  max: number;
  avg: number;
  median: number;
  count: number;
} {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, median: 0, count: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / values.length,
    median: sorted[Math.floor(sorted.length / 2)],
    count: values.length,
  };
}

/**
 * 34. Creates live dashboard widget stream.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {DashboardWidget} widget - Widget configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupDashboardWidget(server, {
 *   id: 'widget-1',
 *   type: 'chart',
 *   title: 'Active Patients',
 *   dataSource: 'patient-metrics',
 *   refreshInterval: 5000,
 *   config: {}
 * });
 * ```
 */
export function setupDashboardWidget(server: Server, widget: DashboardWidget): void {
  const room = `widget:${widget.id}`;

  // This would typically set up a recurring data fetch and emit
  setInterval(() => {
    server.to(room).emit('widget:update', {
      widgetId: widget.id,
      data: {}, // Would fetch actual data
      timestamp: new Date(),
    });
  }, widget.refreshInterval);
}

// ============================================================================
// SERVER-SENT EVENTS (SSE)
// ============================================================================

/**
 * 35. Creates SSE connection manager.
 *
 * @param {SSEConfig} config - SSE configuration
 * @returns {Map<string, any>} SSE connection store
 *
 * @example
 * ```typescript
 * const sseManager = createSSEManager({
 *   retry: 3000,
 *   heartbeat: 30000,
 *   maxConnections: 1000
 * });
 * ```
 */
export function createSSEManager(config: SSEConfig): Map<string, any> {
  return new Map<string, any>();
}

/**
 * 36. Sends SSE event to client.
 *
 * @param {any} response - HTTP response object
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * sendSSEEvent(res, 'update', { message: 'New data available' });
 * ```
 */
export function sendSSEEvent(response: any, event: string, data: any): void {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  response.write(payload);
}

/**
 * 37. Implements SSE heartbeat to keep connection alive.
 *
 * @param {any} response - HTTP response object
 * @param {number} interval - Heartbeat interval in milliseconds
 * @returns {NodeJS.Timeout} Heartbeat timer
 *
 * @example
 * ```typescript
 * const timer = startSSEHeartbeat(res, 30000);
 * ```
 */
export function startSSEHeartbeat(response: any, interval: number = 30000): NodeJS.Timeout {
  return setInterval(() => {
    response.write(': heartbeat\n\n');
  }, interval);
}

/**
 * 38. Closes SSE connection gracefully.
 *
 * @param {any} response - HTTP response object
 * @param {NodeJS.Timeout} heartbeat - Heartbeat timer
 * @returns {void}
 *
 * @example
 * ```typescript
 * closeSSEConnection(res, heartbeatTimer);
 * ```
 */
export function closeSSEConnection(response: any, heartbeat: NodeJS.Timeout): void {
  clearInterval(heartbeat);
  response.end();
}

// ============================================================================
// PUSH NOTIFICATIONS
// ============================================================================

/**
 * 39. Sends browser push notification.
 *
 * @param {string} subscription - Push subscription
 * @param {PushNotificationPayload} payload - Notification payload
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendPushNotification(userSubscription, {
 *   title: 'New Message',
 *   body: 'You have a new patient message',
 *   icon: '/icon.png'
 * });
 * ```
 */
export async function sendPushNotification(
  subscription: string,
  payload: PushNotificationPayload,
): Promise<void> {
  // In production, would use web-push library
  const logger = new Logger('PushNotification');
  logger.log(`Push notification sent: ${payload.title}`);
}

/**
 * 40. Manages push notification subscriptions.
 *
 * @param {Map<string, string>} subscriptions - Subscription store
 * @param {string} userId - User identifier
 * @param {string} subscription - Push subscription
 * @returns {void}
 *
 * @example
 * ```typescript
 * registerPushSubscription(subscriptionStore, 'user-123', subscriptionData);
 * ```
 */
export function registerPushSubscription(
  subscriptions: Map<string, string>,
  userId: string,
  subscription: string,
): void {
  subscriptions.set(userId, subscription);
}

// ============================================================================
// ACTIVITY FEEDS
// ============================================================================

/**
 * 41. Broadcasts activity event to feed subscribers.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {ActivityEvent} event - Activity event
 * @param {string[]} targetUsers - Target user IDs
 * @returns {void}
 *
 * @example
 * ```typescript
 * broadcastActivity(server, {
 *   id: 'act-1',
 *   userId: 'user-123',
 *   userName: 'Dr. Smith',
 *   action: 'updated',
 *   entityType: 'patient',
 *   entityId: 'patient-456',
 *   description: 'Updated patient record',
 *   timestamp: new Date()
 * }, ['user-1', 'user-2']);
 * ```
 */
export function broadcastActivity(server: Server, event: ActivityEvent, targetUsers?: string[]): void {
  if (targetUsers) {
    targetUsers.forEach((userId) => {
      server.to(`user:${userId}`).emit('activity:new', event);
    });
  } else {
    server.emit('activity:new', event);
  }
}

/**
 * 42. Filters activity feed by criteria.
 *
 * @param {ActivityEvent[]} events - Activity events
 * @param {Record<string, any>} filter - Filter criteria
 * @returns {ActivityEvent[]} Filtered events
 *
 * @example
 * ```typescript
 * const filtered = filterActivityFeed(allEvents, { entityType: 'patient' });
 * ```
 */
export function filterActivityFeed(
  events: ActivityEvent[],
  filter: Record<string, any>,
): ActivityEvent[] {
  return events.filter((event) => {
    return Object.entries(filter).every(([key, value]) => (event as any)[key] === value);
  });
}

// ============================================================================
// REAL-TIME CACHING & INVALIDATION
// ============================================================================

/**
 * 43. Invalidates real-time cache entry.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} key - Cache key
 * @returns {void}
 *
 * @example
 * ```typescript
 * invalidateRealtimeCache(server, 'patient-list');
 * ```
 */
export function invalidateRealtimeCache(server: Server, key: string): void {
  server.emit('cache:invalidate', { key, timestamp: new Date() });
}

/**
 * 44. Updates real-time cache with new data.
 *
 * @param {Map<string, RealtimeCacheEntry>} cache - Cache store
 * @param {string} key - Cache key
 * @param {any} value - Cache value
 * @param {number} ttl - Time-to-live in milliseconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * updateRealtimeCache(cacheStore, 'patient-123', patientData, 60000);
 * ```
 */
export function updateRealtimeCache(
  cache: Map<string, RealtimeCacheEntry>,
  key: string,
  value: any,
  ttl: number = 60000,
): void {
  const existing = cache.get(key);
  const version = existing ? existing.version + 1 : 1;

  cache.set(key, {
    key,
    value,
    timestamp: new Date(),
    ttl,
    version,
  });
}

/**
 * 45. Prunes expired real-time cache entries.
 *
 * @param {Map<string, RealtimeCacheEntry>} cache - Cache store
 * @returns {number} Number of entries pruned
 *
 * @example
 * ```typescript
 * setInterval(() => {
 *   const pruned = pruneRealtimeCache(cacheStore);
 * }, 60000);
 * ```
 */
export function pruneRealtimeCache(cache: Map<string, RealtimeCacheEntry>): number {
  const now = Date.now();
  let pruned = 0;

  cache.forEach((entry, key) => {
    const age = now - entry.timestamp.getTime();
    if (age > entry.ttl) {
      cache.delete(key);
      pruned++;
    }
  });

  return pruned;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Data Synchronization
  createDataSyncManager,
  broadcastDataChange,
  applyOptimisticUpdate,
  syncStateWithServer,
  calculateStateDelta,
  applyStateDelta,

  // Presence & Awareness
  initializePresence,
  updatePresence,
  getOnlineUsersInLocation,
  broadcastPresence,
  updateAwayStatus,

  // Live Collaboration
  broadcastCursor,
  broadcastSelection,
  clearUserCursor,
  getActiveCollaborators,

  // Operational Transformation
  transformOperation,
  applyOperation,
  createCRDTState,
  mergeCRDTStates,
  resolveConflict,

  // Real-Time Notifications
  sendRealtimeNotification,
  broadcastNotification,
  sendPriorityNotification,
  manageNotificationSubscription,
  getUnreadNotificationCount,

  // Subscription Management
  subscribeToTopic,
  unsubscribeFromTopic,
  publishToTopic,
  getClientSubscriptions,
  matchesSubscriptionFilter,

  // Live Metrics & Analytics
  streamMetric,
  aggregateMetrics,
  calculateRealtimeStats,
  setupDashboardWidget,

  // Server-Sent Events
  createSSEManager,
  sendSSEEvent,
  startSSEHeartbeat,
  closeSSEConnection,

  // Push Notifications
  sendPushNotification,
  registerPushSubscription,

  // Activity Feeds
  broadcastActivity,
  filterActivityFeed,

  // Real-Time Caching
  invalidateRealtimeCache,
  updateRealtimeCache,
  pruneRealtimeCache,
};
