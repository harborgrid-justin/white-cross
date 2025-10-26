/**
 * @fileoverview usePHIAudit Hook - HIPAA Compliance Audit Logging
 * @module hooks/usePHIAudit
 * @category Hooks
 *
 * Custom hook for HIPAA-compliant PHI access audit logging.
 * Automatically logs when components access or display PHI data.
 *
 * Features:
 * - Automatic PHI access logging
 * - User context tracking
 * - Timestamp recording
 * - Action type classification
 * - Integration with backend audit system
 *
 * HIPAA Compliance:
 * - Logs all PHI data access
 * - Records user, timestamp, action
 * - Sends to backend audit log
 * - No PHI in log messages (only entity IDs)
 *
 * @example
 * ```typescript
 * import { usePHIAudit } from '@/hooks/usePHIAudit';
 *
 * function StudentProfile({ studentId }: { studentId: string }) {
 *   const { logPHIAccess } = usePHIAudit();
 *
 *   useEffect(() => {
 *     // Log access when component mounts
 *     logPHIAccess('student', studentId, 'view');
 *   }, [studentId]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */

'use client';

import { useCallback } from 'react';
import { useAppSelector } from '@/stores/hooks';

/**
 * PHI entity types
 */
export type PHIEntityType =
  | 'student'
  | 'health_record'
  | 'medication'
  | 'appointment'
  | 'incident_report'
  | 'emergency_contact'
  | 'document';

/**
 * PHI action types
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
 * Audit log entry interface
 */
export interface AuditLogEntry {
  /**
   * Entity type accessed
   */
  entityType: PHIEntityType;

  /**
   * Entity ID accessed
   */
  entityId: string;

  /**
   * Action performed
   */
  action: PHIAction;

  /**
   * User who performed action
   */
  userId: string;

  /**
   * Timestamp of access
   */
  timestamp: string;

  /**
   * Optional additional context
   */
  context?: Record<string, any>;
}

/**
 * Hook for PHI access audit logging
 *
 * @returns Audit logging functions
 *
 * @example Log student profile view
 * ```typescript
 * const { logPHIAccess } = usePHIAudit();
 *
 * // Log when viewing student profile
 * logPHIAccess('student', studentId, 'view');
 * ```
 *
 * @example Log health record update
 * ```typescript
 * const { logPHIAccess } = usePHIAudit();
 *
 * const handleSave = async () => {
 *   await updateHealthRecord(data);
 *   logPHIAccess('health_record', recordId, 'update', {
 *     fields: ['diagnosis', 'notes']
 *   });
 * };
 * ```
 */
export function usePHIAudit() {
  // Get current user from Redux
  const currentUser = useAppSelector(state => state.auth.user);

  /**
   * Log PHI access event
   *
   * @param entityType - Type of PHI entity
   * @param entityId - ID of entity accessed
   * @param action - Action performed
   * @param context - Optional additional context
   */
  const logPHIAccess = useCallback(
    async (
      entityType: PHIEntityType,
      entityId: string,
      action: PHIAction,
      context?: Record<string, any>
    ): Promise<void> => {
      if (!currentUser) {
        console.warn('[PHI Audit] Cannot log - no authenticated user');
        return;
      }

      const logEntry: AuditLogEntry = {
        entityType,
        entityId,
        action,
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        context,
      };

      try {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log('[PHI Audit]', logEntry);
        }

        // Send to backend audit log
        await fetch('/api/v1/audit/phi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        });
      } catch (error) {
        // Log error but don't throw - audit failure shouldn't break app
        console.error('[PHI Audit] Failed to log audit entry:', error);
      }
    },
    [currentUser]
  );

  /**
   * Log bulk PHI access (e.g., list views)
   *
   * @param entityType - Type of PHI entities
   * @param entityIds - Array of entity IDs accessed
   * @param action - Action performed
   */
  const logBulkPHIAccess = useCallback(
    async (
      entityType: PHIEntityType,
      entityIds: string[],
      action: PHIAction
    ): Promise<void> => {
      if (!currentUser) return;

      try {
        await fetch('/api/v1/audit/phi/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entityType,
            entityIds,
            action,
            userId: currentUser.id,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('[PHI Audit] Failed to log bulk audit:', error);
      }
    },
    [currentUser]
  );

  /**
   * Log query/search that may expose PHI
   *
   * @param query - Search query (no PHI)
   * @param resultCount - Number of results returned
   */
  const logPHISearch = useCallback(
    async (query: string, resultCount: number): Promise<void> => {
      if (!currentUser) return;

      try {
        await fetch('/api/v1/audit/phi/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            resultCount,
            userId: currentUser.id,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('[PHI Audit] Failed to log search audit:', error);
      }
    },
    [currentUser]
  );

  return {
    logPHIAccess,
    logBulkPHIAccess,
    logPHISearch,
  };
}

export default usePHIAudit;
