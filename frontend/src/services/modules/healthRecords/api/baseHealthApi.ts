/**
 * Base Health API Class
 *
 * Provides shared functionality for all health records API modules:
 * - PHI access logging for HIPAA compliance
 * - Error sanitization to prevent PHI exposure
 * - Common utility methods
 *
 * @module services/modules/healthRecords/api/baseHealthApi
 */

import type { ApiClient } from '../../../core/ApiClient';
import { auditService, AuditAction, AuditResourceType } from '../../../audit';
import { createApiError } from '../../../core/errors';

/**
 * Base class for all health records API modules
 * Provides shared utilities and HIPAA-compliant logging
 */
export abstract class BaseHealthApi {
  constructor(protected readonly client: ApiClient) {}

  /**
   * Log PHI access for HIPAA compliance
   *
   * @param action - The audit action being performed
   * @param studentId - The student whose PHI is being accessed
   * @param resourceType - The type of resource being accessed
   * @param resourceId - Optional resource ID for specific records
   */
  protected async logPHIAccess(
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId?: string
  ): Promise<void> {
    try {
      await auditService.logPHIAccess(action, studentId, resourceType, resourceId);
    } catch (error) {
      // Never fail main operation due to audit logging
      console.error('Failed to log PHI access:', error);
    }
  }

  /**
   * Sanitize error messages to prevent PHI exposure
   *
   * @param error - The error to sanitize
   * @returns Sanitized error that is safe to display
   */
  protected sanitizeError(error: unknown): Error {
    return createApiError(error, 'An error occurred');
  }
}
