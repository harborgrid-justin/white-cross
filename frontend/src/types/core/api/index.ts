/**
 * @fileoverview API Types Module Exports
 * @module types/api
 * @category Types
 *
 * Centralized exports for all API-related types.
 * Import from this module for consistent type usage across the application.
 *
 * @example
 * ```typescript
 * // Import response types
 * import {
 *   ApiResponse,
 *   PaginatedResponse,
 *   ErrorResponse,
 *   SuccessResponse
 * } from '@/types/api';
 *
 * // Import mutation types
 * import {
 *   CreateMutationResult,
 *   UpdateMutationResult,
 *   DeleteMutationResult
 * } from '@/types/api';
 *
 * // Import utilities
 * import {
 *   wrapSuccessResponse,
 *   unwrapApiResponse,
 *   isApiResponse,
 *   isErrorResponse
 * } from '@/types/api';
 * ```
 */

// ==========================================
// RESPONSE TYPES
// ==========================================

export type {
  // Core response interfaces
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  ErrorDetail,

  // Paginated responses
  PaginatedResponse,
  PaginationInfo,
  PaginationResponse,

  // Mutation responses
  MutationResponse,
  BulkOperationResponse,
  BulkOperationResult,

  // Specialized responses
  FileUploadResponse,
  FileUploadData,
  ExportDataResponse,
  ExportDataInfo,
  HealthCheckResponse,
  HealthCheckData,
} from './responses';

// Response utilities
export {
  wrapSuccessResponse,
  createErrorResponse,
  wrapPaginatedResponse,
  unwrapApiResponse,
  unwrapPaginatedResponse,
} from './responses';

// ==========================================
// MUTATION TYPES
// ==========================================

export type {
  // Base mutation types
  BaseMutationResult,
  MutationError,

  // CRUD mutation types
  CreateMutationResult,
  UpdateMutationResult,
  DeleteMutationResult,
  BulkMutationResult,
  ItemMutationResult,

  // Specialized mutation types
  TransferMutationResult,
  ActivationMutationResult,
  ImportMutationResult,
  ImportError,

  // GraphQL types
  GraphQLMutationResponse,
  GraphQLError,

  // Optimistic update types
  OptimisticUpdateContext,

  // Audit types
  AuditInfo,
  ChangeDetail,

  // Input types
  CreateInput,
  UpdateInput,
  BulkUpdateInput,
  DeleteInput,
} from './mutations';

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Type guard to check if response is an ApiResponse
 *
 * @param response - Object to check
 * @returns True if response is an ApiResponse
 *
 * @example
 * ```typescript
 * if (isApiResponse(response)) {
 *   console.log(response.data);
 * }
 * ```
 */
export function isApiResponse<T = unknown>(response: unknown): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'data' in response
  );
}

/**
 * Type guard to check if response is a SuccessResponse
 *
 * @param response - Object to check
 * @returns True if response indicates success
 *
 * @example
 * ```typescript
 * if (isSuccessResponse(response)) {
 *   // response.success is true
 *   const data = response.data;
 * }
 * ```
 */
export function isSuccessResponse<T = unknown>(response: unknown): response is SuccessResponse<T> {
  return (
    isApiResponse(response) &&
    response.success === true &&
    response.data !== undefined
  );
}

/**
 * Type guard to check if response is an ErrorResponse
 *
 * @param response - Object to check
 * @returns True if response indicates error
 *
 * @example
 * ```typescript
 * if (isErrorResponse(response)) {
 *   console.error(response.errors);
 * }
 * ```
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as Record<string, unknown>).success === false &&
    'errors' in response
  );
}

/**
 * Type guard to check if response is a PaginatedResponse
 *
 * @param response - Object to check
 * @returns True if response is paginated
 *
 * @example
 * ```typescript
 * if (isPaginatedResponse(response)) {
 *   console.log(response.pagination);
 * }
 * ```
 */
export function isPaginatedResponse<T = unknown>(response: unknown): response is PaginatedResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'pagination' in response &&
    Array.isArray((response as Record<string, unknown>).data)
  );
}

/**
 * Type guard to check if mutation result is successful
 *
 * @param result - Mutation result to check
 * @returns True if mutation was successful
 *
 * @example
 * ```typescript
 * if (isMutationSuccess(result)) {
 *   console.log('Mutation succeeded:', result.data);
 * }
 * ```
 */
export function isMutationSuccess<T = unknown>(
  result: unknown
): result is CreateMutationResult<T> | UpdateMutationResult<T> {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    (result as Record<string, unknown>).success === true &&
    'data' in result
  );
}

/**
 * Type guard to check if mutation result is an error
 *
 * @param result - Mutation result to check
 * @returns True if mutation failed
 *
 * @example
 * ```typescript
 * if (isMutationError(result)) {
 *   console.error('Mutation failed:', result.errors);
 * }
 * ```
 */
export function isMutationError(result: unknown): result is BaseMutationResult & { success: false } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    (result as Record<string, unknown>).success === false &&
    'errors' in result
  );
}

// Re-export for convenience
import type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse,
  MutationResponse,
} from './responses';

import type {
  BaseMutationResult,
  CreateMutationResult,
  UpdateMutationResult,
  DeleteMutationResult,
  BulkMutationResult,
} from './mutations';
