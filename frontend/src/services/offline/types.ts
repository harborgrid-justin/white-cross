/**
 * Offline Service Types
 *
 * Type definitions for offline functionality
 */

export enum ConnectionState {
  ONLINE = 'online',
  OFFLINE = 'offline',
  SLOW = 'slow',
  UNKNOWN = 'unknown'
}

export enum ConnectionQuality {
  EXCELLENT = 'excellent', // < 100ms latency
  GOOD = 'good',           // 100-300ms latency
  FAIR = 'fair',           // 300-1000ms latency
  POOR = 'poor',           // > 1000ms latency
  OFFLINE = 'offline',
  UNKNOWN = 'unknown'      // Unable to determine quality
}

export type RequestPriority = 'emergency' | 'high' | 'normal' | 'low';
export type RequestStatus = 'pending' | 'syncing' | 'completed' | 'failed' | 'cancelled';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ConnectionInfo {
  state: ConnectionState;
  quality: ConnectionQuality;
  effectiveType?: string; // 4g, 3g, 2g, slow-2g
  downlink?: number;      // Mbps
  rtt?: number;           // Round trip time in ms
  saveData?: boolean;     // User has data saver enabled
  timestamp: number;
}

export interface ConnectionEvent {
  previousState: ConnectionState;
  currentState: ConnectionState;
  timestamp: number;
}

export interface QueuedRequest {
  id: string;
  method: HttpMethod;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  priority: RequestPriority;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  status: RequestStatus;
  error?: string;
  response?: unknown;
  metadata?: {
    userId?: string;
    studentId?: string;
    resourceType?: string;
    action?: string;
  };
}

export interface SyncProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: boolean;
}

export interface SyncResult {
  successful: QueuedRequest[];
  failed: QueuedRequest[];
  conflicts: QueuedRequest[];
}

export interface OfflineConfig {
  connection: {
    enabled: boolean;
    checkInterval: number;
    pingUrl: string;
  };
  queue: {
    enabled: boolean;
    maxRetries: number;
    clearCompletedAfter: number; // hours
  };
  features: {
    enabled: boolean;
  };
}

export type StateChangeListener = (state: ConnectionState, info: ConnectionInfo) => void;
export type QueueEventType = 'enqueue' | 'sync-start' | 'sync-progress' | 'sync-complete' | 'sync-error' | 'request-completed' | 'request-failed';
export type QueueEventHandler = (data?: unknown) => void;