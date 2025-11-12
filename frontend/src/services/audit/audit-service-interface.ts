/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Service Interface Definitions
 *
 * This module provides interface definitions for audit service implementation contracts
 * and service health monitoring in the HIPAA-compliant audit logging system.
 *
 * @module AuditServiceInterface
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The audit service interfaces define:
 * - **Service Contract**: Interface for dependency injection and testing
 * - **Service Health**: Status monitoring and diagnostics
 *
 * These types enable testable implementations and comprehensive health monitoring
 * for production systems.
 *
 * @example Service Implementation
 * ```typescript
 * import { IAuditService } from './audit-service-interface';
 *
 * class MyAuditService implements IAuditService {
 *   async log(params: AuditLogParams): Promise<void> {
 *     // Implementation
 *   }
 *   // ... other methods
 * }
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires TypeScript 4.5+
 * @requires HIPAA Compliance Review
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html|HIPAA Security Rule}
 */

import { AuditAction, AuditResourceType } from './action-types';
import { AuditChange, AuditLogParams } from './audit-events';
import { AuditConfig } from './audit-config';

// ==========================================
// AUDIT SERVICE INTERFACE
// ==========================================

/**
 * @interface IAuditService
 * @description Service interface for audit logging operations. Defines the contract
 * for audit service implementations, enabling dependency injection, testing,
 * and multiple implementation strategies.
 *
 * **Core Responsibilities:**
 * - Event logging with automatic enhancement
 * - Batch management and optimization
 * - Configuration management
 * - Health monitoring and status
 *
 * @example Service Usage
 * ```typescript
 * const auditService: IAuditService = new AuditService(config);
 *
 * // Basic logging
 * await auditService.log({
 *   action: AuditAction.VIEW_STUDENT,
 *   resourceType: AuditResourceType.STUDENT,
 *   resourceId: 'student_123'
 * });
 *
 * // Success logging with automatic status
 * await auditService.logSuccess({
 *   action: AuditAction.CREATE_ALLERGY,
 *   resourceType: AuditResourceType.ALLERGY,
 *   resourceId: 'allergy_456'
 * });
 *
 * // Failure logging with error details
 * try {
 *   await deleteHealthRecord(id);
 * } catch (error) {
 *   await auditService.logFailure({
 *     action: AuditAction.DELETE_HEALTH_RECORD,
 *     resourceType: AuditResourceType.HEALTH_RECORD,
 *     resourceId: id
 *   }, error);
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link AuditService} for concrete implementation
 */
export interface IAuditService {
  // ==========================================
  // CORE LOGGING METHODS
  // ==========================================

  /**
   * Log an audit event with provided parameters.
   * Automatically enhances with user context, timestamps, and default values.
   *
   * @param params - Audit event parameters
   * @returns Promise that resolves when event is queued (async mode) or sent (sync mode)
   * @throws Never throws - errors are logged internally
   */
  log(params: AuditLogParams): Promise<void>;

  /**
   * Log a successful operation with automatic SUCCESS status.
   * Convenience method that sets status to SUCCESS and appropriate severity.
   *
   * @param params - Audit event parameters
   * @returns Promise that resolves when event is queued/sent
   */
  logSuccess(params: AuditLogParams): Promise<void>;

  /**
   * Log a failed operation with error details.
   * Automatically sets FAILURE status and extracts error information.
   *
   * @param params - Audit event parameters
   * @param error - Error that caused the failure
   * @returns Promise that resolves when event is queued/sent
   */
  logFailure(params: AuditLogParams, error: Error): Promise<void>;

  // ==========================================
  // SPECIFIC OPERATION LOGGING
  // ==========================================

  /**
   * Log PHI access for HIPAA compliance.
   * Automatically flags as PHI and uses appropriate severity.
   *
   * @param action - PHI access action
   * @param studentId - ID of student whose PHI was accessed
   * @param resourceType - Type of PHI resource
   * @param resourceId - Optional specific resource ID
   * @returns Promise that resolves when event is logged
   */
  logPHIAccess(
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId?: string
  ): Promise<void>;

  /**
   * Log PHI modification with change tracking.
   * Captures before/after state for compliance and rollback.
   *
   * @param action - PHI modification action
   * @param studentId - ID of student whose PHI was modified
   * @param resourceType - Type of PHI resource
   * @param resourceId - ID of modified resource
   * @param changes - Array of field changes
   * @returns Promise that resolves when event is logged
   */
  logPHIModification(
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId: string,
    changes: AuditChange[]
  ): Promise<void>;

  /**
   * Log access denial for security monitoring.
   * Automatically uses CRITICAL severity and ACCESS_DENIED status.
   *
   * @param action - Attempted action that was denied
   * @param resourceType - Type of resource access was denied to
   * @param resourceId - Optional specific resource ID
   * @param reason - Reason for denial (e.g., "Insufficient permissions")
   * @returns Promise that resolves when event is logged
   */
  logAccessDenied(
    action: AuditAction,
    resourceType: AuditResourceType,
    resourceId?: string,
    reason?: string
  ): Promise<void>;

  // ==========================================
  // BATCH MANAGEMENT
  // ==========================================

  /**
   * Immediately flush all queued events to backend.
   * Forces batch submission regardless of size or interval.
   *
   * @returns Promise that resolves when flush is complete
   * @throws Error if flush fails after retries
   */
  flush(): Promise<void>;

  /**
   * Get count of events currently in queue.
   * Useful for monitoring and diagnostics.
   *
   * @returns Number of queued events
   */
  getQueuedCount(): number;

  /**
   * Clear all queued events without sending.
   * Use with caution - only for emergency situations.
   */
  clearQueue(): void;

  // ==========================================
  // CONFIGURATION MANAGEMENT
  // ==========================================

  /**
   * Get current service configuration.
   *
   * @returns Current configuration object
   */
  getConfig(): AuditConfig;

  /**
   * Update service configuration.
   * Partial updates supported - only provided fields are changed.
   *
   * @param config - Configuration updates to apply
   */
  updateConfig(config: Partial<AuditConfig>): void;

  // ==========================================
  // STATUS AND HEALTH
  // ==========================================

  /**
   * Check if audit service is healthy and operational.
   * Returns false if queue is full, sync failing, or other issues.
   *
   * @returns True if service is healthy
   */
  isHealthy(): boolean;

  /**
   * Get detailed service status for monitoring.
   *
   * @returns Current service status and metrics
   */
  getStatus(): AuditServiceStatus;
}

// ==========================================
// SERVICE STATUS
// ==========================================

/**
 * @interface AuditServiceStatus
 * @description Health and status information for the audit service,
 * enabling operational monitoring and diagnostics.
 *
 * **Status Information:**
 * - Health indicator
 * - Queue metrics
 * - Sync status
 * - Error tracking
 *
 * @example Health Check
 * ```typescript
 * const status = auditService.getStatus();
 *
 * if (!status.isHealthy) {
 *   console.error('Audit service unhealthy!');
 *   console.error(`Queued: ${status.queuedEvents}`);
 *   console.error(`Failed: ${status.failedEvents}`);
 *   console.error(`Last error: ${status.lastError}`);
 * }
 * ```
 *
 * @example Monitoring Dashboard
 * ```typescript
 * function renderAuditStatus(status: AuditServiceStatus) {
 *   return {
 *     health: status.isHealthy ? 'OK' : 'ERROR',
 *     queue: status.queuedEvents,
 *     failed: status.failedEvents,
 *     lastSync: status.lastSyncAt ? new Date(status.lastSyncAt) : 'Never',
 *     errors: status.syncErrors
 *   };
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link IAuditService.getStatus} for retrieval
 */
export interface AuditServiceStatus {
  /** Overall health indicator - false if queue full, sync failing, or errors */
  isHealthy: boolean;

  /** Number of events currently queued for submission */
  queuedEvents: number;

  /** Number of events that failed to send after max retries */
  failedEvents: number;

  /** Timestamp of last successful sync to backend (Unix milliseconds) */
  lastSyncAt?: number;

  /** Most recent error message, if any */
  lastError?: string;

  /** Count of sync errors since last successful sync */
  syncErrors: number;
}
