/**
 * @fileoverview API Response Adapters
 * @module utils/adapters/apiAdapters
 * @category Utilities
 *
 * Type-safe adapter utilities for transforming API responses to expected hook formats.
 * Provides generic unwrapping functions and domain-specific transformations.
 *
 * This module serves as a barrel export, re-exporting all adapter utilities from
 * focused sub-modules for backward compatibility and convenient imports.
 *
 * Module Structure:
 * - apiAdapters.types.ts - Type definitions and re-exports
 * - apiAdapters.core.ts - Core unwrapping utilities
 * - apiAdapters.guards.ts - Type guard functions
 * - apiAdapters.errors.ts - Error handling utilities
 * - apiAdapters.transform.ts - Response transformation and domain adapters
 *
 * Design Principles:
 * - Maintain type safety throughout transformations
 * - Handle both wrapped and unwrapped response formats
 * - Provide runtime safety with proper error handling
 * - Support backward compatibility with existing response shapes
 *
 * @example
 * ```typescript
 * // Unwrap API response data
 * const response = await apiClient.get<User>('/users/123');
 * const user = unwrapData(response); // Type: User
 *
 * // Extract data safely
 * const data = extractData(response, { id: '123', name: 'Default' });
 *
 * // Use type guards
 * if (isSuccessResponse(response)) {
 *   console.log(response.data);
 * }
 * ```
 */

// Re-export type definitions
export type {
  ApiResponse,
  PaginatedResponse,
  SuccessResponse,
  ErrorResponse,
} from './apiAdapters.types';

// Re-export core unwrapping utilities
export {
  unwrapData,
  extractData,
  extractDataOptional,
  unwrapPaginatedData,
} from './apiAdapters.core';

// Re-export type guards
export {
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse,
} from './apiAdapters.guards';

// Re-export error handling utilities
export { handleApiError } from './apiAdapters.errors';

// Re-export transformation and domain-specific adapters
export {
  adaptResponse,
  adaptResponseWrapper,
  adaptMedicationResponse,
  adaptStudentResponse,
  adaptHealthRecordResponse,
  extractApiData,
} from './apiAdapters.transform';
