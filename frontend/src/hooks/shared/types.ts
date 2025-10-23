/**
 * Shared Hook Types
 * Common type definitions for hooks
 */

export interface HookOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}

export interface HookResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface MutationResult<T> {
  mutate: (data: any) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
}

// =====================
// AUDIT LOG TYPES
// =====================

export interface AuditLogParams {
  resourceType?: string;
  resourceId?: string;
  action?: AuditAction;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export type AuditAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT'
  | 'APPROVE'
  | 'REJECT';

export type AuditResourceType =
  | 'STUDENT'
  | 'MEDICATION'
  | 'APPOINTMENT'
  | 'HEALTH_RECORD'
  | 'INCIDENT'
  | 'USER'
  | 'SYSTEM';

export interface AuditChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export type AuditServiceStatus = 'ACTIVE' | 'DISABLED' | 'ERROR';

// =====================
// SYSTEM HEALTH TYPES
// =====================

export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  services: ServiceHealth[];
  lastChecked: string;
  uptime: number;
  version: string;
}

export interface ServiceHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  responseTime?: number;
  lastChecked: string;
  message?: string;
}
