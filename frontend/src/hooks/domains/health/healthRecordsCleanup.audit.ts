/**
 * WF-COMP-342 | healthRecordsCleanup.audit.ts - Audit logging for health records cleanup
 * Purpose: Audit trail and logging for HIPAA-compliant data cleanup operations
 * Related: healthRecordsCleanup.ts, healthRecordsCleanup.types.ts
 * Exports: audit logging functions
 * Last Updated: 2025-11-04 | File Type: .ts
 */

import type { AuditLogEntry } from './healthRecordsCleanup.types';

// ============================================================================
// Audit Log Storage
// ============================================================================

const auditLog: AuditLogEntry[] = [];
const MAX_AUDIT_LOG_SIZE = 100;

// ============================================================================
// Audit Logging Functions
// ============================================================================

/**
 * Log cleanup event for audit trail
 */
export function logCleanupEvent(event: string, details?: any): void {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    event,
    userId: getCurrentUserId(),
    details,
  };

  auditLog.push(entry);

  // Keep log size manageable
  if (auditLog.length > MAX_AUDIT_LOG_SIZE) {
    auditLog.shift();
  }

  // In production, send to backend audit service
  if (process.env.NODE_ENV === 'production') {
    sendAuditLogToBackend(entry).catch((err) => {
      console.error('[Audit Log] Failed to send audit log:', err);
    });
  }

  console.log('[Audit Log]', entry);
}

/**
 * Get current user ID from auth storage
 */
function getCurrentUserId(): string | undefined {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.user?.id;
    }
  } catch (error) {
    console.error('[Audit Log] Error getting user ID:', error);
  }
  return undefined;
}

/**
 * Send audit log to backend (placeholder)
 */
async function sendAuditLogToBackend(entry: AuditLogEntry): Promise<void> {
  // Implementation would send to backend audit service
  // Example: await apiInstance.post('/audit/client-events', entry);
  console.log('[Audit Log] Would send to backend:', entry);
}

/**
 * Get audit log (for debugging)
 */
export function getAuditLog(): AuditLogEntry[] {
  return [...auditLog];
}
