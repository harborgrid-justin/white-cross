/**
 * @fileoverview Mutation API Response Type Definitions
 * @module types/core/api/mutation-responses
 * @category Types
 *
 * Type definitions for create, update, delete, and bulk operation responses.
 *
 * Key Features:
 * - `MutationResponse<T>` for standard mutation operations
 * - `BulkOperationResponse` for bulk operations with success/failure tracking
 * - `BulkOperationResult` with detailed operation counts
 * - Support for tracking affected record counts
 *
 * Design Principles:
 * - Clear distinction between single and bulk operations
 * - Detailed success/failure tracking for bulk operations
 * - Optional affected record counts for auditing
 * - Consistent error reporting across all mutation types
 *
 * @example
 * ```typescript
 * // Create operation
 * const createResponse: MutationResponse<Student> = {
 *   success: true,
 *   data: { id: '123', firstName: 'John', lastName: 'Doe' },
 *   message: 'Student created successfully',
 *   operation: 'create'
 * };
 *
 * // Bulk operation
 * const bulkResponse: BulkOperationResponse = {
 *   success: true,
 *   data: {
 *     successful: 45,
 *     failed: 5,
 *     total: 50
 *   },
 *   message: 'Bulk update completed with 5 failures'
 * };
 * ```
 */

import type { ApiResponse, ErrorDetail } from './base-responses';

// ==========================================
// MUTATION RESPONSE TYPES
// ==========================================

/**
 * Mutation Response
 *
 * Generic response for create, update, delete operations.
 * Includes the affected resource and operation metadata.
 *
 * @template T - The type of the affected resource
 *
 * @example
 * ```typescript
 * // Create operation
 * const createResponse: MutationResponse<Student> = {
 *   success: true,
 *   data: { id: '123', firstName: 'John', lastName: 'Doe' },
 *   message: 'Student created successfully',
 *   operation: 'create'
 * };
 *
 * // Update operation
 * const updateResponse: MutationResponse<Student> = {
 *   success: true,
 *   data: { id: '123', firstName: 'Jane', lastName: 'Doe' },
 *   message: 'Student updated successfully',
 *   operation: 'update',
 *   affected: 1
 * };
 *
 * // Delete operation
 * const deleteResponse: MutationResponse<void> = {
 *   success: true,
 *   data: undefined,
 *   message: 'Student deleted successfully',
 *   operation: 'delete',
 *   affected: 1
 * };
 * ```
 */
export interface MutationResponse<T = unknown> extends ApiResponse<T> {
  /** Type of mutation operation */
  operation?: 'create' | 'update' | 'delete' | 'bulk';

  /** Number of affected records (for bulk operations) */
  affected?: number;
}

/**
 * Bulk Operation Response
 *
 * Response for bulk operations that affect multiple records.
 * Includes counts of successful and failed operations.
 *
 * @example
 * ```typescript
 * const bulkResponse: BulkOperationResponse = {
 *   success: true,
 *   data: {
 *     successful: 45,
 *     failed: 5,
 *     total: 50
 *   },
 *   message: 'Bulk update completed with 5 failures',
 *   errors: [
 *     { field: 'studentIds[3]', message: 'Student not found', code: 'NOT_FOUND' },
 *     { field: 'studentIds[7]', message: 'Permission denied', code: 'FORBIDDEN' }
 *   ]
 * };
 * ```
 */
export interface BulkOperationResponse extends ApiResponse<BulkOperationResult> {
  /** Detailed error information for failed operations */
  errors?: ErrorDetail[];
}

/**
 * Bulk Operation Result
 *
 * Detailed result information for bulk operations, including
 * success/failure counts and affected record IDs.
 *
 * @example
 * ```typescript
 * const bulkResult: BulkOperationResult = {
 *   successful: 45,
 *   failed: 5,
 *   total: 50,
 *   successfulIds: ['id1', 'id2', 'id3', ...],
 *   failedIds: ['id4', 'id5']
 * };
 * ```
 */
export interface BulkOperationResult {
  /** Number of successfully processed records */
  successful: number;

  /** Number of failed records */
  failed: number;

  /** Total number of records processed */
  total: number;

  /** IDs of successfully processed records */
  successfulIds?: string[];

  /** IDs of failed records */
  failedIds?: string[];
}
