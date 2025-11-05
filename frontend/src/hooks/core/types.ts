/**
 * @fileoverview Core Hooks Type Definitions
 * @module hooks/core/types
 *
 * Shared type definitions for core system hooks including connection monitoring,
 * cross-tab synchronization, offline queue management, PHI audit logging,
 * route state management, and WebSocket communication.
 *
 * @since 3.0.0
 */

// ==========================================
// CONNECTION MONITOR TYPES
// ==========================================

/**
 * Connection status information.
 *
 * Provides real-time information about the network connection including
 * online/offline status and connection quality metrics.
 *
 * @interface ConnectionStatus
 *
 * @property {boolean} isOnline - Whether the device is currently online
 * @property {string | null} effectiveType - Effective connection type (e.g., '4g', 'slow-2g') from Network Information API, null if not available
 * @property {number | null} rtt - Round-trip time in milliseconds, null if not available
 * @property {number | null} downlink - Effective bandwidth estimate in megabits per second, null if not available
 *
 * @example
 * ```typescript
 * const status: ConnectionStatus = {
 *   isOnline: true,
 *   effectiveType: '4g',
 *   rtt: 50,
 *   downlink: 10.5
 * };
 * ```
 *
 * @see {@link useConnectionMonitor} hook that provides this status
 */
export interface ConnectionStatus {
  isOnline: boolean;
  effectiveType: string | null;
  rtt: number | null;
  downlink: number | null;
}

// ==========================================
// CROSS TAB SYNC TYPES
// ==========================================

/**
 * Cross-tab synchronization state.
 *
 * Tracks the state of cross-browser-tab synchronization for coordinating
 * application state across multiple open tabs.
 *
 * @interface CrossTabSyncState
 *
 * @property {boolean} isLeader - Whether this tab is the elected leader tab for coordinating sync operations
 * @property {string} tabId - Unique identifier for this browser tab
 * @property {Date} lastSync - Timestamp of the last successful synchronization
 *
 * @example
 * ```typescript
 * const syncState: CrossTabSyncState = {
 *   isLeader: true,
 *   tabId: 'tab-1234567890-abc123',
 *   lastSync: new Date('2025-11-05T10:30:00Z')
 * };
 * ```
 *
 * @see {@link useCrossTabSync} hook that manages cross-tab synchronization
 */
export interface CrossTabSyncState {
  isLeader: boolean;
  tabId: string;
  lastSync: Date;
}

// ==========================================
// OFFLINE QUEUE TYPES
// ==========================================

/**
 * Offline queue item for deferred API requests.
 *
 * Represents a queued API request that will be sent when the device comes
 * back online. Used for offline-first functionality.
 *
 * @interface OfflineQueueItem
 *
 * @property {string} id - Unique identifier for the queued item
 * @property {string} url - API endpoint URL for the request
 * @property {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
 * @property {unknown} data - Request payload data to be sent with the request
 * @property {Date} timestamp - When the request was originally queued
 * @property {number} retries - Number of retry attempts made so far
 *
 * @example
 * ```typescript
 * const queueItem: OfflineQueueItem = {
 *   id: 'queue-item-123',
 *   url: '/api/medications',
 *   method: 'POST',
 *   data: { name: 'Aspirin', dose: '100mg' },
 *   timestamp: new Date(),
 *   retries: 0
 * };
 * ```
 *
 * @see {@link useOfflineQueue} hook that manages the offline queue
 */
export interface OfflineQueueItem {
  id: string;
  url: string;
  method: string;
  data: unknown;
  timestamp: Date;
  retries: number;
}

// ==========================================
// PHI AUDIT TYPES
// ==========================================

/**
 * Protected Health Information (PHI) entity types.
 *
 * Defines the types of entities that contain PHI and must be audited
 * for HIPAA compliance.
 *
 * @typedef {string} PHIEntityType
 *
 * @example
 * ```typescript
 * const entityType: PHIEntityType = 'health_record';
 * ```
 */
export type PHIEntityType =
  | 'student'
  | 'health_record'
  | 'medication'
  | 'incident'
  | 'appointment'
  | 'document';

/**
 * PHI access action types.
 *
 * Defines the types of actions that can be performed on PHI entities
 * and must be logged for HIPAA audit trails.
 *
 * @typedef {string} PHIAction
 *
 * @example
 * ```typescript
 * const action: PHIAction = 'view';
 * ```
 */
export type PHIAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'print'
  | 'share';

/**
 * PHI audit event for HIPAA compliance logging.
 *
 * Records an access or modification event on PHI data. All properties
 * are logged for compliance auditing purposes.
 *
 * @interface PHIAuditEvent
 *
 * @property {PHIEntityType} entityType - Type of PHI entity accessed
 * @property {string} entityId - Unique identifier of the entity accessed (no PHI in ID)
 * @property {PHIAction} action - Type of action performed on the entity
 * @property {string} userId - ID of the user who performed the action
 * @property {Date} timestamp - When the action occurred
 * @property {string} [ipAddress] - Optional IP address of the user
 * @property {string} [userAgent] - Optional browser user agent string
 *
 * @example
 * ```typescript
 * const auditEvent: PHIAuditEvent = {
 *   entityType: 'health_record',
 *   entityId: 'hr-12345',
 *   action: 'view',
 *   userId: 'user-789',
 *   timestamp: new Date(),
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * };
 * ```
 *
 * @see {@link usePHIAudit} hook for logging PHI access
 */
export interface PHIAuditEvent {
  entityType: PHIEntityType;
  entityId: string;
  action: PHIAction;
  userId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// ==========================================
// ROUTE STATE TYPES
// ==========================================

/**
 * Route state management options.
 *
 * Configuration options for controlling Next.js router behavior when
 * navigating between routes with state.
 *
 * @interface RouteStateOptions
 *
 * @property {boolean} [replace] - If true, replaces current history entry instead of pushing new one
 * @property {boolean} [scroll] - If true, scrolls to top of page after navigation
 * @property {boolean} [shallow] - If true, updates URL without running getStaticProps/getServerSideProps again
 *
 * @example
 * ```typescript
 * const options: RouteStateOptions = {
 *   replace: true,
 *   scroll: false,
 *   shallow: true
 * };
 * ```
 *
 * @see {@link useRouteState} hook for managing route state
 */
export interface RouteStateOptions {
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
}

// ==========================================
// WEBSOCKET TYPES
// ==========================================

/**
 * WebSocket event handler function type.
 *
 * Callback function that handles WebSocket events. Receives event data
 * of unknown type which should be validated before use.
 *
 * @callback WebSocketEventHandler
 * @param {unknown} data - Event data payload from WebSocket server
 * @returns {void}
 *
 * @example
 * ```typescript
 * const handler: WebSocketEventHandler = (data) => {
 *   console.log('Received:', data);
 * };
 *
 * webSocket.on('notification', handler);
 * ```
 *
 * @see {@link useWebSocket} hook for WebSocket communication
 */
export type WebSocketEventHandler = (data: unknown) => void;