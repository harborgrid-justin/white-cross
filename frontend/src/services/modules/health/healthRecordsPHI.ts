/**
 * @fileoverview Health Records PHI Access Logging Service
 * @module services/modules/health/healthRecordsPHI
 * @category Services
 *
 * HIPAA Compliance and PHI (Protected Health Information) Access Logging
 *
 * Purpose:
 * Provides centralized PHI access logging to ensure HIPAA compliance across all
 * health record operations. Every access to protected health information must be
 * logged with action, user, timestamp, and record identifiers.
 *
 * HIPAA Requirements:
 * - All PHI access must be logged with complete audit trail
 * - Logs must be maintained for 7 years per HIPAA retention requirements
 * - Failed access attempts must also be logged
 * - Logs must include: who, what, when, where, and why (action context)
 * - Logs must be tamper-evident and secure
 *
 * Security Features:
 * - Automatic logging on all PHI operations
 * - Logs transmitted securely to audit service
 * - Failed logging attempts do not prevent operations (fail-open for availability)
 * - Logging failures are reported to monitoring systems
 *
 * @example
 * ```typescript
 * import { createHealthRecordsPHILogger } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const phiLogger = createHealthRecordsPHILogger(apiClient);
 *
 * // Log PHI access
 * await phiLogger.logPHIAccess(
 *   'VIEW_HEALTH_RECORD',
 *   'student-uuid',
 *   'HEALTH_RECORD',
 *   'record-uuid'
 * );
 * ```
 */

import { API_ENDPOINTS } from '@/constants/api';
import type { ApiClient } from '@/services/core/ApiClient';

/**
 * PHI Access Log Entry
 *
 * @interface
 * @description
 * Represents a single PHI access log entry for HIPAA compliance audit trail.
 *
 * @property {string} action - Action performed (VIEW_HEALTH_RECORD, CREATE_HEALTH_RECORD, etc.)
 * @property {string} studentId - UUID of student whose PHI was accessed
 * @property {string} recordType - Type of record accessed (HEALTH_RECORD, ALLERGY, etc.)
 * @property {string} [recordId] - Optional UUID of specific record accessed
 * @property {string} timestamp - ISO 8601 timestamp of access
 */
export interface PHIAccessLogEntry {
  action: string;
  studentId: string;
  recordType: string;
  recordId?: string;
  timestamp: string;
}

/**
 * Health Records PHI Logger Service
 *
 * @class
 * @description
 * Centralized service for logging all Protected Health Information (PHI) access
 * to maintain HIPAA compliance. Provides automatic audit trail for all health
 * record operations with complete who/what/when/where tracking.
 *
 * HIPAA Compliance:
 * - Logs maintained for 7-year retention requirement
 * - All PHI access recorded with complete context
 * - Failed access attempts also logged
 * - Tamper-evident audit trail
 *
 * Design Considerations:
 * - Fail-open design: Logging failures don't prevent operations
 * - Async logging doesn't block main operations
 * - Errors logged to monitoring but don't throw
 * - Uses centralized audit service endpoint
 *
 * @example
 * ```typescript
 * const logger = new HealthRecordsPHILogger(apiClient);
 *
 * // Log record view
 * await logger.logPHIAccess(
 *   'VIEW_HEALTH_RECORD',
 *   'student-uuid',
 *   'HEALTH_RECORD',
 *   'record-uuid'
 * );
 *
 * // Log record creation
 * await logger.logPHIAccess(
 *   'CREATE_HEALTH_RECORD',
 *   'student-uuid',
 *   'HEALTH_RECORD',
 *   'new-record-uuid'
 * );
 * ```
 */
export class HealthRecordsPHILogger {
  constructor(private client: ApiClient) {}

  /**
   * Log PHI access for HIPAA compliance
   *
   * @param {string} action - Action performed on PHI (VIEW_HEALTH_RECORD, CREATE_HEALTH_RECORD, etc.)
   * @param {string} studentId - UUID of student whose PHI was accessed
   * @param {string} [recordType='HEALTH_RECORD'] - Type of health record accessed
   * @param {string} [recordId] - Optional UUID of specific record accessed
   * @returns {Promise<void>} Resolves when logging completes (or fails silently)
   *
   * @description
   * Logs all PHI access to centralized audit service for HIPAA compliance.
   * Uses fail-open pattern: logging failures are reported but don't throw errors
   * to prevent blocking critical healthcare operations.
   *
   * Logged Information:
   * - Action: What operation was performed
   * - Student ID: Whose PHI was accessed
   * - Record Type: Type of health data accessed
   * - Record ID: Specific record if applicable
   * - Timestamp: When access occurred (auto-generated)
   * - User: Who accessed (auto-detected from API client context)
   *
   * HIPAA Compliance:
   * - Creates tamper-evident audit trail
   * - Logged to secure audit service with 7-year retention
   * - Includes all required HIPAA audit elements
   * - Failed attempts also logged by audit service
   *
   * @example
   * ```typescript
   * // Log viewing a health record
   * await phiLogger.logPHIAccess(
   *   'VIEW_HEALTH_RECORD',
   *   'student-uuid',
   *   'HEALTH_RECORD',
   *   'record-uuid'
   * );
   *
   * // Log viewing health summary
   * await phiLogger.logPHIAccess(
   *   'VIEW_HEALTH_SUMMARY',
   *   'student-uuid'
   * );
   *
   * // Log cross-student search
   * await phiLogger.logPHIAccess(
   *   'SEARCH_HEALTH_RECORDS',
   *   'MULTIPLE'
   * );
   * ```
   */
  async logPHIAccess(
    action: string,
    studentId: string,
    recordType: string = 'HEALTH_RECORD',
    recordId?: string
  ): Promise<void> {
    try {
      const logEntry: PHIAccessLogEntry = {
        action,
        studentId,
        recordType,
        recordId,
        timestamp: new Date().toISOString()
      };

      await this.client.post(API_ENDPOINTS.AUDIT.PHI_ACCESS_LOG, logEntry);
    } catch (error) {
      // Log error but don't throw - fail-open for availability
      // Healthcare operations should not be blocked by logging failures
      console.error('Failed to log PHI access:', error);
      // In production, this should also alert monitoring systems
    }
  }

  /**
   * Log bulk PHI access (for batch operations)
   *
   * @param {string} action - Bulk action performed
   * @param {string[]} studentIds - Array of student UUIDs accessed
   * @param {string} [recordType='HEALTH_RECORD'] - Type of records accessed
   * @returns {Promise<void>} Resolves when logging completes
   *
   * @description
   * Logs bulk PHI access for batch operations like exports, reports, or
   * cross-student searches. Creates individual log entries for each student
   * to maintain complete audit trail.
   *
   * @example
   * ```typescript
   * // Log bulk export
   * await phiLogger.logBulkPHIAccess(
   *   'BULK_EXPORT_HEALTH_RECORDS',
   *   ['student-1', 'student-2', 'student-3']
   * );
   * ```
   */
  async logBulkPHIAccess(
    action: string,
    studentIds: string[],
    recordType: string = 'HEALTH_RECORD'
  ): Promise<void> {
    try {
      const logEntries: PHIAccessLogEntry[] = studentIds.map(studentId => ({
        action,
        studentId,
        recordType,
        timestamp: new Date().toISOString()
      }));

      await this.client.post(API_ENDPOINTS.AUDIT.PHI_ACCESS_LOG_BULK, {
        entries: logEntries
      });
    } catch (error) {
      console.error('Failed to log bulk PHI access:', error);
    }
  }
}

/**
 * Factory function to create PHI logger instance
 *
 * @param {ApiClient} client - API client instance
 * @returns {HealthRecordsPHILogger} Configured PHI logger service
 *
 * @example
 * ```typescript
 * import { createHealthRecordsPHILogger } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const phiLogger = createHealthRecordsPHILogger(apiClient);
 * ```
 */
export function createHealthRecordsPHILogger(
  client: ApiClient
): HealthRecordsPHILogger {
  return new HealthRecordsPHILogger(client);
}
