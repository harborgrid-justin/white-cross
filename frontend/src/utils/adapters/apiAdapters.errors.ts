/**
 * @fileoverview API Error Handling Utilities
 * @module utils/adapters/apiAdapters.errors
 * @category Utilities
 *
 * Utilities for handling and transforming API errors into standard formats.
 * Provides consistent error handling across the application.
 *
 * @example
 * ```typescript
 * try {
 *   await client.post('/endpoint', data);
 * } catch (err) {
 *   throw handleApiError(err);
 * }
 * ```
 */

import type { ApiResponse } from './apiAdapters.types';

// ==========================================
// ERROR HANDLING UTILITIES
// ==========================================

/**
 * Handle API errors consistently
 *
 * Transform any API error into a standard Error object with message.
 *
 * @param error - The error to handle
 * @returns Standardized Error object
 *
 * @example
 * ```typescript
 * try {
 *   await client.post('/endpoint', data);
 * } catch (err) {
 *   throw handleApiError(err);
 * }
 * ```
 */
export function handleApiError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as Partial<ApiResponse<unknown>>;
    if (apiError.message) {
      return new Error(apiError.message);
    }
    if (apiError.errors && Array.isArray(apiError.errors)) {
      const errorMessages = apiError.errors
        .map((e: any) => e.message || JSON.stringify(e))
        .join(', ');
      return new Error(errorMessages);
    }
  }

  return new Error('An unexpected error occurred');
}
