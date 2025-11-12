/**
 * @fileoverview HIPAA-Compliant Audit Logging System - API Type Definitions
 *
 * This module provides interface definitions for backend API communication,
 * including request/response structures for audit event submission and querying.
 *
 * @module AuditApiTypes
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The audit API interfaces define:
 * - **Submission Responses**: Results of audit event batch submissions
 * - **Query Responses**: Paginated audit event retrieval results
 * - **Error Structures**: Standardized error reporting
 *
 * These types ensure type-safe communication with the backend audit API
 * and consistent error handling across the system.
 *
 * @example Submission Response Handling
 * ```typescript
 * import { AuditApiResponse } from './api-types';
 *
 * async function submitBatch(batch: AuditBatch): Promise<AuditApiResponse> {
 *   const response = await fetch('/api/audit/batch', {
 *     method: 'POST',
 *     body: JSON.stringify(batch)
 *   });
 *   return response.json();
 * }
 *
 * const result = await submitBatch(batch);
 * if (result.success) {
 *   console.log(`Processed ${result.data?.processed} events`);
 * } else {
 *   console.error(`Error: ${result.error?.message}`);
 * }
 * ```
 *
 * @example Query Response Handling
 * ```typescript
 * import { AuditQueryResponse } from './api-types';
 *
 * async function queryEvents(filter: AuditEventFilter): Promise<AuditQueryResponse> {
 *   const params = new URLSearchParams(filter as any);
 *   const response = await fetch(`/api/audit/events?${params}`);
 *   return response.json();
 * }
 *
 * const result = await queryEvents({ studentId: 'student_123' });
 * if (result.success && result.data) {
 *   console.log(`Found ${result.data.total} events`);
 *   result.data.events.forEach(event => {
 *     console.log(`${event.action} at ${event.timestamp}`);
 *   });
 * }
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires TypeScript 4.5+
 * @requires Backend API v1.0+
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html|HIPAA Security Rule}
 */

import { AuditEvent } from './audit-events';

// ==========================================
// BACKEND API TYPES
// ==========================================

/**
 * @interface AuditApiResponse
 * @description Backend API response for audit event batch submissions.
 * Provides detailed feedback on batch processing results, including
 * success metrics, failed events, and error information.
 *
 * **Response Structure:**
 * - **success**: Overall operation success indicator
 * - **data**: Processing metrics and error details
 * - **error**: Top-level error information if submission failed
 *
 * @example Successful Submission
 * ```typescript
 * const response: AuditApiResponse = {
 *   success: true,
 *   data: {
 *     received: 10,
 *     processed: 10,
 *     failed: 0
 *   }
 * };
 * ```
 *
 * @example Partial Failure
 * ```typescript
 * const response: AuditApiResponse = {
 *   success: true, // Overall request succeeded
 *   data: {
 *     received: 10,
 *     processed: 8,
 *     failed: 2,
 *     errors: [
 *       { eventId: 'event_123', error: 'Invalid timestamp format' },
 *       { eventId: 'event_456', error: 'Missing required field: userId' }
 *     ]
 *   }
 * };
 * ```
 *
 * @example Complete Failure
 * ```typescript
 * const response: AuditApiResponse = {
 *   success: false,
 *   error: {
 *     message: 'Authentication required',
 *     code: 'AUTH_REQUIRED'
 *   }
 * };
 * ```
 *
 * @example Error Handling
 * ```typescript
 * async function handleBatchResponse(response: AuditApiResponse) {
 *   if (!response.success) {
 *     console.error(`Batch submission failed: ${response.error?.message}`);
 *     return;
 *   }
 *
 *   const { data } = response;
 *   if (data?.failed && data.failed > 0) {
 *     console.warn(`${data.failed} events failed processing`);
 *     data.errors?.forEach(err => {
 *       console.error(`Event ${err.eventId}: ${err.error}`);
 *     });
 *   }
 *
 *   console.log(`Successfully processed ${data?.processed} events`);
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link AuditBatch} for batch submission structure
 */
export interface AuditApiResponse {
  /**
   * Indicates if the batch submission succeeded.
   * - true: Batch was received and processed (some events may have failed)
   * - false: Batch submission failed entirely (network, auth, validation)
   */
  success: boolean;

  /**
   * Processing results and metrics.
   * Present when success is true.
   */
  data?: {
    /** Number of events received in the batch */
    received: number;

    /** Number of events successfully processed and stored */
    processed: number;

    /** Number of events that failed validation or processing */
    failed: number;

    /**
     * Detailed error information for failed events.
     * Present when failed > 0.
     */
    errors?: Array<{
      /** ID of the event that failed */
      eventId: string;

      /** Error message describing the failure */
      error: string;
    }>;
  };

  /**
   * Error information for complete submission failures.
   * Present when success is false.
   */
  error?: {
    /** Human-readable error message */
    message: string;

    /** Machine-readable error code for programmatic handling */
    code?: string;
  };
}

/**
 * @interface AuditQueryResponse
 * @description Backend API response for audit event queries.
 * Provides paginated access to historical audit events with
 * filtering and search capabilities.
 *
 * **Response Structure:**
 * - **success**: Query execution success indicator
 * - **data**: Paginated event results and metadata
 * - **error**: Error information if query failed
 *
 * @example Successful Query
 * ```typescript
 * const response: AuditQueryResponse = {
 *   success: true,
 *   data: {
 *     events: [
 *       { userId: 'user1', action: 'VIEW_STUDENT', ... },
 *       { userId: 'user1', action: 'VIEW_HEALTH_RECORD', ... },
 *       // ... more events
 *     ],
 *     total: 150,
 *     page: 1,
 *     limit: 50
 *   }
 * };
 * ```
 *
 * @example Empty Result
 * ```typescript
 * const response: AuditQueryResponse = {
 *   success: true,
 *   data: {
 *     events: [],
 *     total: 0,
 *     page: 1,
 *     limit: 50
 *   }
 * };
 * ```
 *
 * @example Query Error
 * ```typescript
 * const response: AuditQueryResponse = {
 *   success: false,
 *   error: {
 *     message: 'Invalid date range: startDate must be before endDate'
 *   }
 * };
 * ```
 *
 * @example Pagination Handling
 * ```typescript
 * async function loadAllEvents(filter: AuditEventFilter): Promise<AuditEvent[]> {
 *   const allEvents: AuditEvent[] = [];
 *   let page = 1;
 *   let hasMore = true;
 *
 *   while (hasMore) {
 *     const response = await queryEvents({ ...filter, page, limit: 100 });
 *
 *     if (!response.success || !response.data) {
 *       throw new Error(response.error?.message || 'Query failed');
 *     }
 *
 *     allEvents.push(...response.data.events);
 *     hasMore = allEvents.length < response.data.total;
 *     page++;
 *   }
 *
 *   return allEvents;
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link AuditEventFilter} for query filter structure
 * @see {@link AuditEvent} for event structure
 */
export interface AuditQueryResponse {
  /**
   * Indicates if the query succeeded.
   * - true: Query executed successfully, results in data
   * - false: Query failed, error information in error
   */
  success: boolean;

  /**
   * Query results and pagination metadata.
   * Present when success is true.
   */
  data?: {
    /** Array of audit events matching the query filter */
    events: AuditEvent[];

    /** Total number of events matching the filter (across all pages) */
    total: number;

    /** Current page number (1-indexed) */
    page: number;

    /** Number of events per page */
    limit: number;
  };

  /**
   * Error information if query failed.
   * Present when success is false.
   */
  error?: {
    /** Human-readable error message */
    message: string;
  };
}
