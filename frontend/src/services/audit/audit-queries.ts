/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Query and Batch Type Definitions
 *
 * This module provides interface definitions for querying, filtering, batching,
 * and aggregating audit events in the HIPAA-compliant audit logging system.
 *
 * @module AuditQueries
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The audit query interfaces define:
 * - **Batch Operations**: Efficient bulk submission of audit events
 * - **Event Filtering**: Comprehensive query parameters for audit retrieval
 * - **Statistics**: Aggregated metrics for compliance reporting
 *
 * These types enable efficient audit data management, compliance reporting,
 * and operational monitoring of the audit system.
 *
 * @example Batch Submission
 * ```typescript
 * import { AuditBatch } from './audit-queries';
 *
 * const batch: AuditBatch = {
 *   events: [event1, event2, event3],
 *   batchId: 'batch_1698765432_abc123',
 *   timestamp: new Date().toISOString(),
 *   checksum: 'batch_checksum_here'
 * };
 * ```
 *
 * @example Filtering Events
 * ```typescript
 * import { AuditEventFilter } from './audit-queries';
 *
 * const filter: AuditEventFilter = {
 *   studentId: 'student_123',
 *   startDate: '2025-10-01',
 *   endDate: '2025-10-31',
 *   isPHI: true,
 *   page: 1,
 *   limit: 50
 * };
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

import { AuditAction, AuditResourceType, AuditSeverity, AuditStatus } from './action-types';
import { AuditEvent } from './audit-events';

// ==========================================
// BATCH AND QUERY INTERFACES
// ==========================================

/**
 * @interface AuditBatch
 * @description Batch audit event submission structure for efficient bulk processing.
 * Batching reduces network overhead and improves performance by grouping multiple
 * audit events into a single backend request.
 *
 * **Features:**
 * - Multiple events in single transmission
 * - Batch-level checksum for integrity verification
 * - Unique batch identification for tracking
 * - Timestamp for batch creation time
 *
 * @example Creating a Batch
 * ```typescript
 * const batch: AuditBatch = {
 *   events: [
 *     { userId: 'user1', action: AuditAction.VIEW_STUDENT, ... },
 *     { userId: 'user1', action: AuditAction.VIEW_HEALTH_RECORD, ... },
 *     { userId: 'user2', action: AuditAction.CREATE_ALLERGY, ... }
 *   ],
 *   batchId: `batch_${Date.now()}_${generateRandomId()}`,
 *   timestamp: new Date().toISOString(),
 *   checksum: calculateBatchChecksum(events)
 * };
 * ```
 *
 * @since 1.0.0
 * @see {@link AuditEvent} for event structure
 */
export interface AuditBatch {
  /** Array of audit events to submit in batch */
  events: AuditEvent[];

  /** Unique identifier for this batch */
  batchId: string;

  /** Timestamp when batch was created (ISO 8601 format) */
  timestamp: string;

  /** Optional checksum for batch integrity verification */
  checksum?: string;
}

/**
 * @interface AuditEventFilter
 * @description Filter parameters for querying audit events from the backend.
 * Supports comprehensive filtering, pagination, and date range queries for
 * compliance reporting and operational monitoring.
 *
 * **Filter Categories:**
 * - **Entity Filters**: userId, studentId, resourceId
 * - **Type Filters**: action, resourceType, status, severity
 * - **Date Range**: startDate, endDate
 * - **Classification**: isPHI
 * - **Pagination**: page, limit
 *
 * @example Basic Query
 * ```typescript
 * const filter: AuditEventFilter = {
 *   userId: 'nurse_123',
 *   startDate: '2025-10-01',
 *   endDate: '2025-10-31',
 *   page: 1,
 *   limit: 100
 * };
 * ```
 *
 * @example Specific Resource Query
 * ```typescript
 * const filter: AuditEventFilter = {
 *   studentId: 'student_456',
 *   action: AuditAction.UPDATE_HEALTH_RECORD,
 *   resourceType: AuditResourceType.HEALTH_RECORD,
 *   isPHI: true
 * };
 * ```
 *
 * @example High Severity Events
 * ```typescript
 * const filter: AuditEventFilter = {
 *   severity: AuditSeverity.CRITICAL,
 *   status: AuditStatus.FAILURE,
 *   startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24h
 * };
 * ```
 *
 * @since 1.0.0
 * @see {@link AuditQueryResponse} for query response structure
 */
export interface AuditEventFilter {
  /** Filter by user ID who performed the action */
  userId?: string;

  /** Filter by student ID (for student-related operations) */
  studentId?: string;

  /** Filter by specific audit action type */
  action?: AuditAction;

  /** Filter by resource type */
  resourceType?: AuditResourceType;

  /** Filter by specific resource ID */
  resourceId?: string;

  /** Filter by start date (ISO 8601 format) */
  startDate?: string;

  /** Filter by end date (ISO 8601 format) */
  endDate?: string;

  /** Filter by PHI classification */
  isPHI?: boolean;

  /** Filter by operation status */
  status?: AuditStatus;

  /** Filter by severity level */
  severity?: AuditSeverity;

  /** Page number for pagination (1-indexed) */
  page?: number;

  /** Number of results per page */
  limit?: number;
}

/**
 * @interface AuditStatistics
 * @description Aggregated audit statistics and metrics for compliance reporting,
 * operational monitoring, and system health tracking.
 *
 * **Statistics Include:**
 * - **Volume Metrics**: Total events, PHI access counts
 * - **Security Metrics**: Failed attempts, critical events
 * - **Distribution**: Events by action, resource type, severity
 * - **Recent Activity**: Latest and most critical events
 *
 * @example Statistics Display
 * ```typescript
 * const stats: AuditStatistics = {
 *   totalEvents: 15432,
 *   phiAccess: 8765,
 *   failedAttempts: 23,
 *   byAction: {
 *     'VIEW_STUDENT': 5000,
 *     'VIEW_HEALTH_RECORD': 3000,
 *     'UPDATE_MEDICATION': 500
 *   },
 *   byResourceType: {
 *     'STUDENT': 5000,
 *     'HEALTH_RECORD': 3500,
 *     'MEDICATION': 1200
 *   },
 *   bySeverity: {
 *     'LOW': 10000,
 *     'MEDIUM': 4000,
 *     'HIGH': 1200,
 *     'CRITICAL': 232
 *   },
 *   recentEvents: [...], // Last 10 events
 *   criticalEvents: [...] // Last 10 critical events
 * };
 * ```
 *
 * @example Compliance Dashboard
 * ```typescript
 * function renderComplianceDashboard(stats: AuditStatistics) {
 *   console.log(`Total Audit Events: ${stats.totalEvents}`);
 *   console.log(`PHI Access Events: ${stats.phiAccess}`);
 *   console.log(`Failed Access Attempts: ${stats.failedAttempts}`);
 *   console.log(`Critical Events: ${stats.bySeverity['CRITICAL']}`);
 *
 *   // Display recent critical events
 *   stats.criticalEvents.forEach(event => {
 *     console.log(`[CRITICAL] ${event.action} by ${event.userId} at ${event.timestamp}`);
 *   });
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link AuditEvent} for event structure
 */
export interface AuditStatistics {
  /** Total number of audit events */
  totalEvents: number;

  /** Number of PHI access events */
  phiAccess: number;

  /** Number of failed operation attempts */
  failedAttempts: number;

  /** Event counts grouped by action type */
  byAction: Record<string, number>;

  /** Event counts grouped by resource type */
  byResourceType: Record<string, number>;

  /** Event counts grouped by severity level */
  bySeverity: Record<string, number>;

  /** Most recent audit events (typically last 10-50) */
  recentEvents: AuditEvent[];

  /** Most recent critical severity events */
  criticalEvents: AuditEvent[];
}
