/**
 * Core Hooks Types
 *
 * Type definitions for core system hooks
 *
 * @module hooks/core/types
 * @since 3.0.0
 */

// Connection Monitor Types
export interface ConnectionStatus {
  isOnline: boolean;
  effectiveType: string | null;
  rtt: number | null;
  downlink: number | null;
}

// Cross Tab Sync Types
export interface CrossTabSyncState {
  isLeader: boolean;
  tabId: string;
  lastSync: Date;
}

// Offline Queue Types
export interface OfflineQueueItem {
  id: string;
  url: string;
  method: string;
  data: unknown;
  timestamp: Date;
  retries: number;
}

// PHI Audit Types
export type PHIEntityType =
  | 'student'
  | 'health_record'
  | 'medication'
  | 'incident'
  | 'appointment'
  | 'document';

export type PHIAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'print'
  | 'share';

export interface PHIAuditEvent {
  entityType: PHIEntityType;
  entityId: string;
  action: PHIAction;
  userId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Route State Types
export interface RouteStateOptions {
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
}

// WebSocket Types
export type WebSocketEventHandler = (data: unknown) => void;