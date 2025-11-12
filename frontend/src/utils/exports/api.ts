/**
 * @fileoverview API Adapter Utilities Barrel Export
 * @module utils/exports/api
 * @category Utils
 *
 * Type-safe utilities for transforming API responses to expected hook formats.
 * Handles wrapped/unwrapped responses, pagination, and domain-specific transformations.
 *
 * @example
 * ```typescript
 * import { unwrapData, adaptResponse, handleApiError } from '@/utils';
 *
 * // Unwrap API response
 * const data = unwrapData(apiResponse);
 *
 * // Adapt response for specific domain
 * const student = adaptStudentResponse(response);
 * ```
 */

// ============================================================================
// API RESPONSE ADAPTERS
// ============================================================================

/**
 * API Response Adapters
 * Type-safe utilities for transforming API responses to expected hook formats.
 */
export type {
  ApiResponse,
  PaginatedResponse,
  SuccessResponse,
  ErrorResponse,
} from '../adapters/apiAdapters.types';

export {
  // Core unwrapping
  unwrapData,
  extractData,
  extractDataOptional,
  unwrapPaginatedData,

  // Type guards
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse,

  // Error handling
  handleApiError,

  // Transformations
  adaptResponse,
  adaptResponseWrapper,
  adaptMedicationResponse,
  adaptStudentResponse,
  adaptHealthRecordResponse,
  extractApiData,
} from '../adapters/apiAdapters';
