/**
 * WF-COMP-342 | healthRecordsCleanup.types.ts - Type definitions for health records cleanup
 * Purpose: Type definitions and constants for HIPAA-compliant data cleanup
 * Related: healthRecordsCleanup.ts, healthRecordsCleanup.utils.ts
 * Exports: types, interfaces, constants
 * Last Updated: 2025-11-04 | File Type: .ts
 */

// ============================================================================
// Constants
// ============================================================================

export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
export const INACTIVITY_WARNING_MS = 13 * 60 * 1000; // 13 minutes (2 min warning)
export const CLEANUP_DELAY_MS = 5000; // 5 seconds delay for graceful cleanup

// ============================================================================
// Types
// ============================================================================

export interface CleanupOptions {
  clearCache?: boolean;
  clearLocalStorage?: boolean;
  clearSessionStorage?: boolean;
  logAudit?: boolean;
  onComplete?: () => void;
}

export interface SessionMonitorOptions {
  timeoutMs?: number;
  warningMs?: number;
  onWarning?: (remainingTime: number) => void;
  onTimeout?: () => void;
  onActivity?: () => void;
}

export interface AuditLogEntry {
  timestamp: string;
  event: string;
  userId?: string;
  details?: any;
}
