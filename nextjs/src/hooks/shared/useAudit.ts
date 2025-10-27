/**
 * useAudit - React Hook for Audit Logging
 *
 * Purpose: Convenient React hook for components to log audit events
 *
 * Features:
 * - Auto-capture user context from Redux store
 * - Simple API for logging audit events
 * - TypeScript support with full type safety
 * - Automatically handles errors
 *
 * Usage Example:
 * ```typescript
 * const audit = useAudit();
 *
 * // Log a simple event
 * await audit.log({
 *   action: AuditAction.VIEW_HEALTH_RECORD,
 *   resourceType: AuditResourceType.HEALTH_RECORD,
 *   resourceId: '123',
 *   studentId: 'student-456',
 * });
 *
 * // Log PHI access
 * await audit.logPHIAccess(
 *   AuditAction.VIEW_ALLERGIES,
 *   'student-123',
 *   AuditResourceType.ALLERGY
 * );
 *
 * // Log with change tracking
 * await audit.logPHIModification(
 *   AuditAction.UPDATE_ALLERGY,
 *   'student-123',
 *   AuditResourceType.ALLERGY,
 *   'allergy-456',
 *   [{ field: 'severity', oldValue: 'MILD', newValue: 'SEVERE' }]
 * );
 * ```
 *
 * Last Updated: 2025-10-21
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/reduxStore';
import { auditService, initializeAuditService, cleanupAuditService } from './AuditService';
import {
  AuditLogParams,
  AuditAction,
  AuditResourceType,
  AuditChange,
  AuditServiceStatus,
} from './types';

/**
 * Audit hook interface
 */
export interface UseAuditResult {
  // Core logging methods
  log: (params: AuditLogParams) => Promise<void>;
  logSuccess: (params: AuditLogParams) => Promise<void>;
  logFailure: (params: AuditLogParams, error: Error) => Promise<void>;

  // Convenience methods
  logPHIAccess: (
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId?: string
  ) => Promise<void>;

  logPHIModification: (
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId: string,
    changes: AuditChange[]
  ) => Promise<void>;

  logAccessDenied: (
    action: AuditAction,
    resourceType: AuditResourceType,
    resourceId?: string,
    reason?: string
  ) => Promise<void>;

  // Utility methods
  flush: () => Promise<void>;
  getStatus: () => AuditServiceStatus;
  getQueuedCount: () => number;
}

/**
 * React Hook for audit logging
 *
 * Automatically:
 * - Sets user context from Redux auth state
 * - Provides typed audit logging methods
 * - Handles initialization and cleanup
 */
export function useAudit(): UseAuditResult {
  // Get user from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Initialize audit service with user context when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeAuditService({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } else {
      // Clear user context on logout
      cleanupAuditService();
    }
  }, [user, isAuthenticated]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Flush any pending events when component unmounts
      auditService.flush().catch(error => {
        console.error('[useAudit] Failed to flush on unmount:', error);
      });
    };
  }, []);

  // Memoize audit methods to prevent unnecessary re-renders
  const log = useCallback(async (params: AuditLogParams): Promise<void> => {
    try {
      await auditService.log(params);
    } catch (error) {
      // Error already handled by service, just log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudit] Log failed:', error);
      }
    }
  }, []);

  const logSuccess = useCallback(async (params: AuditLogParams): Promise<void> => {
    try {
      await auditService.logSuccess(params);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudit] LogSuccess failed:', error);
      }
    }
  }, []);

  const logFailure = useCallback(async (params: AuditLogParams, error: Error): Promise<void> => {
    try {
      await auditService.logFailure(params, error);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudit] LogFailure failed:', err);
      }
    }
  }, []);

  const logPHIAccess = useCallback(async (
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId?: string
  ): Promise<void> => {
    try {
      await auditService.logPHIAccess(action, studentId, resourceType, resourceId);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudit] LogPHIAccess failed:', error);
      }
    }
  }, []);

  const logPHIModification = useCallback(async (
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId: string,
    changes: AuditChange[]
  ): Promise<void> => {
    try {
      await auditService.logPHIModification(action, studentId, resourceType, resourceId, changes);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudit] LogPHIModification failed:', error);
      }
    }
  }, []);

  const logAccessDenied = useCallback(async (
    action: AuditAction,
    resourceType: AuditResourceType,
    resourceId?: string,
    reason?: string
  ): Promise<void> => {
    try {
      await auditService.logAccessDenied(action, resourceType, resourceId, reason);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudit] LogAccessDenied failed:', error);
      }
    }
  }, []);

  const flush = useCallback(async (): Promise<void> => {
    try {
      await auditService.flush();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudit] Flush failed:', error);
      }
    }
  }, []);

  const getStatus = useCallback((): AuditServiceStatus => {
    return auditService.getStatus();
  }, []);

  const getQueuedCount = useCallback((): number => {
    return auditService.getQueuedCount();
  }, []);

  // Return memoized result object
  return useMemo(() => ({
    log,
    logSuccess,
    logFailure,
    logPHIAccess,
    logPHIModification,
    logAccessDenied,
    flush,
    getStatus,
    getQueuedCount,
  }), [
    log,
    logSuccess,
    logFailure,
    logPHIAccess,
    logPHIModification,
    logAccessDenied,
    flush,
    getStatus,
    getQueuedCount,
  ]);
}

export default useAudit;
