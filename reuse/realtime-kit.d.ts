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
import { Server, Socket } from 'socket.io';
import { BehaviorSubject } from 'rxjs';
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
        coordinates?: {
            x: number;
            y: number;
        };
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
    position: {
        x: number;
        y: number;
    };
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
    qos: 0 | 1 | 2;
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
export declare function createDataSyncManager(syncKey: string): BehaviorSubject<any>;
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
export declare function broadcastDataChange(server: Server, channel: string, data: any, excludeSockets?: string[]): number;
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
export declare function applyOptimisticUpdate(currentState: any, optimisticUpdate: any, serverUpdate: () => Promise<any>): Promise<any>;
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
export declare function syncStateWithServer(localState: any, serverState: any, strategy?: ConflictStrategy): any;
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
export declare function calculateStateDelta(baseState: any, newState: any): {
    changed: any;
    deleted: string[];
};
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
export declare function applyStateDelta(currentState: any, delta: {
    changed: any;
    deleted: string[];
}): any;
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
export declare function initializePresence(presenceStore: Map<string, RealtimePresence>, userId: string, initialPresence: Partial<RealtimePresence>): RealtimePresence;
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
export declare function updatePresence(presenceStore: Map<string, RealtimePresence>, userId: string, updates: Partial<RealtimePresence>): RealtimePresence | null;
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
export declare function getOnlineUsersInLocation(presenceStore: Map<string, RealtimePresence>, page: string): RealtimePresence[];
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
export declare function broadcastPresence(server: Server, presence: RealtimePresence, room?: string): void;
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
export declare function updateAwayStatus(presenceStore: Map<string, RealtimePresence>, awayThreshold: number): number;
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
export declare function broadcastCursor(socket: Socket, cursor: LiveCursor, documentId: string): void;
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
export declare function broadcastSelection(socket: Socket, selection: LiveSelection, documentId: string): void;
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
export declare function clearUserCursor(socket: Socket, userId: string, documentId: string): void;
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
export declare function getActiveCollaborators(server: Server, documentId: string): Promise<string[]>;
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
export declare function transformOperation(op1: OTOperation, op2: OTOperation): OTOperation;
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
export declare function applyOperation(document: string, operation: OTOperation): string;
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
export declare function createCRDTState(documentId: string): CRDTState;
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
export declare function mergeCRDTStates(states: CRDTState[]): CRDTState;
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
export declare function resolveConflict(local: any, remote: any, strategy: ConflictStrategy): any;
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
export declare function sendRealtimeNotification(server: Server, userId: string, notification: RealtimeNotification): void;
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
export declare function broadcastNotification(server: Server, userIds: string[], notification: RealtimeNotification): void;
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
export declare function sendPriorityNotification(server: Server, userId: string, notification: RealtimeNotification): void;
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
export declare function manageNotificationSubscription(socket: Socket, category: string, subscribe: boolean): void;
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
export declare function getUnreadNotificationCount(notificationStore: Map<string, RealtimeNotification[]>, userId: string): number;
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
export declare function subscribeToTopic(socket: Socket, config: SubscriptionConfig): void;
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
export declare function unsubscribeFromTopic(socket: Socket, topic: string): void;
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
export declare function publishToTopic(server: Server, topic: string, message: any): void;
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
export declare function getClientSubscriptions(socket: Socket): SubscriptionConfig[];
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
export declare function matchesSubscriptionFilter(message: any, filter: Record<string, any>): boolean;
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
export declare function streamMetric(server: Server, metric: MetricDataPoint, dashboard?: string): void;
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
export declare function aggregateMetrics(metrics: MetricDataPoint[], windowMs: number): Map<string, number>;
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
export declare function calculateRealtimeStats(values: number[]): {
    min: number;
    max: number;
    avg: number;
    median: number;
    count: number;
};
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
export declare function setupDashboardWidget(server: Server, widget: DashboardWidget): void;
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
export declare function createSSEManager(config: SSEConfig): Map<string, any>;
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
export declare function sendSSEEvent(response: any, event: string, data: any): void;
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
export declare function startSSEHeartbeat(response: any, interval?: number): NodeJS.Timeout;
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
export declare function closeSSEConnection(response: any, heartbeat: NodeJS.Timeout): void;
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
export declare function sendPushNotification(subscription: string, payload: PushNotificationPayload): Promise<void>;
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
export declare function registerPushSubscription(subscriptions: Map<string, string>, userId: string, subscription: string): void;
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
export declare function broadcastActivity(server: Server, event: ActivityEvent, targetUsers?: string[]): void;
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
export declare function filterActivityFeed(events: ActivityEvent[], filter: Record<string, any>): ActivityEvent[];
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
export declare function invalidateRealtimeCache(server: Server, key: string): void;
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
export declare function updateRealtimeCache(cache: Map<string, RealtimeCacheEntry>, key: string, value: any, ttl?: number): void;
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
export declare function pruneRealtimeCache(cache: Map<string, RealtimeCacheEntry>): number;
declare const _default: {
    createDataSyncManager: typeof createDataSyncManager;
    broadcastDataChange: typeof broadcastDataChange;
    applyOptimisticUpdate: typeof applyOptimisticUpdate;
    syncStateWithServer: typeof syncStateWithServer;
    calculateStateDelta: typeof calculateStateDelta;
    applyStateDelta: typeof applyStateDelta;
    initializePresence: typeof initializePresence;
    updatePresence: typeof updatePresence;
    getOnlineUsersInLocation: typeof getOnlineUsersInLocation;
    broadcastPresence: typeof broadcastPresence;
    updateAwayStatus: typeof updateAwayStatus;
    broadcastCursor: typeof broadcastCursor;
    broadcastSelection: typeof broadcastSelection;
    clearUserCursor: typeof clearUserCursor;
    getActiveCollaborators: typeof getActiveCollaborators;
    transformOperation: typeof transformOperation;
    applyOperation: typeof applyOperation;
    createCRDTState: typeof createCRDTState;
    mergeCRDTStates: typeof mergeCRDTStates;
    resolveConflict: typeof resolveConflict;
    sendRealtimeNotification: typeof sendRealtimeNotification;
    broadcastNotification: typeof broadcastNotification;
    sendPriorityNotification: typeof sendPriorityNotification;
    manageNotificationSubscription: typeof manageNotificationSubscription;
    getUnreadNotificationCount: typeof getUnreadNotificationCount;
    subscribeToTopic: typeof subscribeToTopic;
    unsubscribeFromTopic: typeof unsubscribeFromTopic;
    publishToTopic: typeof publishToTopic;
    getClientSubscriptions: typeof getClientSubscriptions;
    matchesSubscriptionFilter: typeof matchesSubscriptionFilter;
    streamMetric: typeof streamMetric;
    aggregateMetrics: typeof aggregateMetrics;
    calculateRealtimeStats: typeof calculateRealtimeStats;
    setupDashboardWidget: typeof setupDashboardWidget;
    createSSEManager: typeof createSSEManager;
    sendSSEEvent: typeof sendSSEEvent;
    startSSEHeartbeat: typeof startSSEHeartbeat;
    closeSSEConnection: typeof closeSSEConnection;
    sendPushNotification: typeof sendPushNotification;
    registerPushSubscription: typeof registerPushSubscription;
    broadcastActivity: typeof broadcastActivity;
    filterActivityFeed: typeof filterActivityFeed;
    invalidateRealtimeCache: typeof invalidateRealtimeCache;
    updateRealtimeCache: typeof updateRealtimeCache;
    pruneRealtimeCache: typeof pruneRealtimeCache;
};
export default _default;
//# sourceMappingURL=realtime-kit.d.ts.map