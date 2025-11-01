/**
 * Core System Hooks
 *
 * Essential system-level hooks for authentication, connectivity, hydration,
 * and other foundational functionality required across the healthcare platform.
 *
 * @module hooks/core
 * @category Core
 * @since 3.0.0
 */

// Authentication & Authorization
export * from './useAuth';
export { default as usePHIAudit } from './usePHIAudit';

// System State & Connectivity
export { default as useConnectionMonitor } from './useConnectionMonitor';
export { default as useCrossTabSync } from './useCrossTabSync';
export { default as useHydration } from './useHydration';
export { default as useWebSocket } from './useWebSocket';

// Data Management
export { default as useOfflineQueue } from './useOfflineQueue';

// Navigation & Routing
export * from './useRouteState';

// Re-export types
export type {
  ConnectionStatus,
  CrossTabSyncState,
  OfflineQueueItem,
  PHIAuditEvent,
  RouteStateOptions
} from './types';