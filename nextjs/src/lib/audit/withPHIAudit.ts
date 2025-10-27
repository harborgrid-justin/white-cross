/**
 * @fileoverview PHI Audit Logging Decorator for Server Actions
 * @module lib/audit/withPHIAudit
 *
 * Provides a higher-order function (decorator) to automatically log PHI access
 * for Next.js Server Actions. Ensures HIPAA compliance by creating comprehensive
 * audit trails for all Protected Health Information operations.
 *
 * **HIPAA Compliance:**
 * - Logs all PHI access, modifications, and deletions
 * - Captures user context (WHO accessed WHAT and WHEN)
 * - Never logs PHI values in audit logs (logs IDs only)
 * - Non-blocking: Audit logging failures don't break primary operations
 *
 * @example Basic Usage
 * ```typescript
 * import { withPHIAudit } from '@/lib/audit/withPHIAudit';
 * import { AuditAction, AuditResourceType } from '@/services/audit/types';
 *
 * export const createStudent = withPHIAudit(
 *   AuditAction.CREATE_STUDENT,
 *   AuditResourceType.STUDENT
 * )(async (data: CreateStudentData): Promise<ActionResult<Student>> => {
 *   const response = await apiClient.post('/api/v1/students', data);
 *   return { success: true, data: response.data };
 * });
 * ```
 *
 * @example With Change Tracking
 * ```typescript
 * export const updateStudent = withPHIAudit(
 *   AuditAction.UPDATE_STUDENT,
 *   AuditResourceType.STUDENT,
 *   { trackChanges: true }
 * )(async (id: string, data: UpdateStudentData, beforeState?: Student): Promise<ActionResult<Student>> => {
 *   const response = await apiClient.put(`/api/v1/students/${id}`, data);
 *
 *   return {
 *     success: true,
 *     data: response.data,
 *     metadata: { beforeState, afterState: response.data }
 *   };
 * });
 * ```
 *
 * @version 1.0.0
 * @since 2025-10-27
 */

import { cookies } from 'next/headers';
import { auditService } from '@/services/audit/AuditService';
import {
  AuditAction,
  AuditResourceType,
  AuditStatus,
  AuditChange,
} from '@/services/audit/types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Standard Server Action result type
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    beforeState?: unknown;
    afterState?: unknown;
    changes?: AuditChange[];
  };
}

/**
 * PHI Audit configuration options
 */
export interface PHIAuditOptions {
  /**
   * Track changes between before and after states
   * @default false
   */
  trackChanges?: boolean;

  /**
   * Extract resource ID from different result structures
   * @default (result) => result.data?.id
   */
  getResourceId?: (result: ActionResult) => string | undefined;

  /**
   * Extract student ID from different result structures
   * @default (result) => result.data?.studentId
   */
  getStudentId?: (result: ActionResult) => string | undefined;

  /**
   * Additional context to include in audit log
   */
  additionalContext?: Record<string, unknown>;

  /**
   * Whether to log on error (default: true for failed operations)
   * @default true
   */
  logOnError?: boolean;
}

/**
 * User context extracted from session
 */
interface UserContext {
  userId: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get current user context from session cookies
 */
async function getUserContext(): Promise<UserContext | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_context');

    if (!userCookie?.value) {
      return null;
    }

    // Parse user context from cookie
    const user = JSON.parse(userCookie.value);

    return {
      userId: user.id || 'unknown',
      userEmail: user.email,
      userName: user.name || `${user.firstName} ${user.lastName}`,
      userRole: user.role,
    };
  } catch (error) {
    console.error('[PHI Audit] Failed to get user context:', error);
    return null;
  }
}

/**
 * Generate audit changes from before/after states
 */
function generateChanges(
  beforeState: unknown,
  afterState: unknown
): AuditChange[] {
  const changes: AuditChange[] = [];

  if (!beforeState || !afterState) {
    return changes;
  }

  // Simple field-by-field comparison
  const before = beforeState as Record<string, unknown>;
  const after = afterState as Record<string, unknown>;

  for (const field in after) {
    if (before[field] !== after[field]) {
      changes.push({
        field,
        oldValue: String(before[field] || ''),
        newValue: String(after[field] || ''),
        type: 'UPDATE',
      });
    }
  }

  return changes;
}

// ==========================================
// DECORATOR IMPLEMENTATION
// ==========================================

/**
 * Higher-order function to add PHI audit logging to Server Actions
 *
 * **How It Works:**
 * 1. Wraps the original Server Action
 * 2. Executes the action
 * 3. If successful, logs PHI access to audit service
 * 4. If failed, logs the failure (if logOnError is true)
 * 5. Never throws - audit logging failures don't break the action
 *
 * **HIPAA Compliance:**
 * - Logs action type, resource type, resource ID, and user context
 * - Never logs PHI values (only IDs and metadata)
 * - Asynchronous logging (non-blocking)
 * - Errors in logging are caught and logged separately
 *
 * @param action - Audit action type (e.g., AuditAction.VIEW_STUDENT)
 * @param resourceType - Resource type (e.g., AuditResourceType.STUDENT)
 * @param options - Additional audit configuration options
 * @returns Function that wraps a Server Action with audit logging
 *
 * @example
 * ```typescript
 * export const viewStudent = withPHIAudit(
 *   AuditAction.VIEW_STUDENT,
 *   AuditResourceType.STUDENT
 * )(async (id: string): Promise<ActionResult<Student>> => {
 *   const student = await apiClient.get(`/api/v1/students/${id}`);
 *   return { success: true, data: student };
 * });
 * ```
 */
export function withPHIAudit<TArgs extends unknown[], TResult extends ActionResult>(
  action: AuditAction,
  resourceType: AuditResourceType,
  options: PHIAuditOptions = {}
) {
  return function (
    serverAction: (...args: TArgs) => Promise<TResult>
  ): (...args: TArgs) => Promise<TResult> {
    return async function (...args: TArgs): Promise<TResult> {
      const startTime = Date.now();

      try {
        // Execute the original Server Action
        const result = await serverAction(...args);

        // Log PHI access on success
        if (result.success) {
          // Don't await - let logging happen asynchronously
          logPHIAccess(action, resourceType, result, options).catch(error => {
            console.error('[PHI Audit] Failed to log PHI access:', error);
          });
        }
        // Log failure if configured
        else if (options.logOnError !== false) {
          logPHIFailure(action, resourceType, result, options).catch(error => {
            console.error('[PHI Audit] Failed to log PHI failure:', error);
          });
        }

        return result;
      } catch (error) {
        // Log error
        const errorResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        } as TResult;

        if (options.logOnError !== false) {
          logPHIFailure(action, resourceType, errorResult, options).catch(err => {
            console.error('[PHI Audit] Failed to log PHI error:', err);
          });
        }

        // Re-throw the original error
        throw error;
      } finally {
        // Log performance metrics
        const duration = Date.now() - startTime;
        if (duration > 1000) {
          console.warn(`[PHI Audit] Slow Server Action: ${action} took ${duration}ms`);
        }
      }
    };
  };
}

/**
 * Log successful PHI access
 */
async function logPHIAccess<T extends ActionResult>(
  action: AuditAction,
  resourceType: AuditResourceType,
  result: T,
  options: PHIAuditOptions
): Promise<void> {
  try {
    // Get user context
    const userContext = await getUserContext();

    if (!userContext) {
      console.warn('[PHI Audit] No user context available for audit logging');
      return;
    }

    // Set user context in audit service
    auditService.setUserContext({
      id: userContext.userId,
      email: userContext.userEmail,
      firstName: userContext.userName?.split(' ')[0],
      lastName: userContext.userName?.split(' ')[1],
      role: userContext.userRole,
    });

    // Extract IDs
    const getResourceId = options.getResourceId || ((r: ActionResult) => r.data?.id);
    const getStudentId = options.getStudentId || ((r: ActionResult) => r.data?.studentId);

    const resourceId = getResourceId(result);
    const studentId = getStudentId(result);

    // Generate changes if tracking enabled
    let changes: AuditChange[] | undefined;
    if (options.trackChanges && result.metadata?.beforeState && result.metadata?.afterState) {
      changes = result.metadata.changes || generateChanges(
        result.metadata.beforeState,
        result.metadata.afterState
      );
    }

    // Log to audit service
    await auditService.log({
      action,
      resourceType,
      resourceId,
      studentId,
      status: AuditStatus.SUCCESS,
      isPHI: true,
      changes,
      context: {
        ...options.additionalContext,
        source: 'server-action',
      },
    });
  } catch (error) {
    console.error('[PHI Audit] Error in logPHIAccess:', error);
    // Never throw - audit logging must not break primary operations
  }
}

/**
 * Log failed PHI operation
 */
async function logPHIFailure<T extends ActionResult>(
  action: AuditAction,
  resourceType: AuditResourceType,
  result: T,
  options: PHIAuditOptions
): Promise<void> {
  try {
    // Get user context
    const userContext = await getUserContext();

    if (!userContext) {
      console.warn('[PHI Audit] No user context available for failure logging');
      return;
    }

    // Set user context in audit service
    auditService.setUserContext({
      id: userContext.userId,
      email: userContext.userEmail,
      firstName: userContext.userName?.split(' ')[0],
      lastName: userContext.userName?.split(' ')[1],
      role: userContext.userRole,
    });

    // Log failure
    await auditService.log({
      action,
      resourceType,
      status: AuditStatus.FAILURE,
      isPHI: true,
      context: {
        ...options.additionalContext,
        errorMessage: result.error,
        source: 'server-action',
      },
    });
  } catch (error) {
    console.error('[PHI Audit] Error in logPHIFailure:', error);
    // Never throw
  }
}

// ==========================================
// CONVENIENCE WRAPPERS
// ==========================================

/**
 * Convenience wrapper for VIEW actions
 */
export function withPHIView(resourceType: AuditResourceType, options?: PHIAuditOptions) {
  const action = `VIEW_${resourceType}`.toUpperCase() as AuditAction;
  return withPHIAudit(action, resourceType, options);
}

/**
 * Convenience wrapper for CREATE actions
 */
export function withPHICreate(resourceType: AuditResourceType, options?: PHIAuditOptions) {
  const action = `CREATE_${resourceType}`.toUpperCase() as AuditAction;
  return withPHIAudit(action, resourceType, options);
}

/**
 * Convenience wrapper for UPDATE actions
 */
export function withPHIUpdate(resourceType: AuditResourceType, options?: PHIAuditOptions) {
  const action = `UPDATE_${resourceType}`.toUpperCase() as AuditAction;
  return withPHIAudit(action, resourceType, {
    ...options,
    trackChanges: true, // Always track changes for updates
  });
}

/**
 * Convenience wrapper for DELETE actions
 */
export function withPHIDelete(resourceType: AuditResourceType, options?: PHIAuditOptions) {
  const action = `DELETE_${resourceType}`.toUpperCase() as AuditAction;
  return withPHIAudit(action, resourceType, options);
}

// ==========================================
// EXPORTS
// ==========================================

export default withPHIAudit;
