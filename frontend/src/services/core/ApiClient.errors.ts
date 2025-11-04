/**
 * @fileoverview Error handling for API Client
 * @module services/core/ApiClient.errors
 * @category Services
 *
 * Provides comprehensive error classification and normalization for API operations:
 * - Custom error class with automatic classification
 * - Network error detection
 * - Server error identification (5xx)
 * - Validation error handling (400)
 * - Error normalization from various sources
 */

import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from './ApiClient.types';

// ==========================================
// ERROR CLASS
// ==========================================

/**
 * Custom error class for API client errors with error classification
 *
 * @class
 * @extends Error
 * @classdesc Wraps API errors with additional metadata and automatic classification
 * for easier error handling in application code.
 *
 * Error Types:
 * - isNetworkError: No response from server (connection failed, timeout, etc.)
 * - isServerError: Server returned 5xx status code
 * - isValidationError: Client error with validation details (400 status)
 *
 * @example
 * ```typescript
 * try {
 *   await apiClient.post('/endpoint', data);
 * } catch (error) {
 *   if (error instanceof ApiClientError) {
 *     if (error.isNetworkError) {
 *       showToast('Network error. Please check your connection.');
 *     } else if (error.isValidationError) {
 *       displayValidationErrors(error.details);
 *     } else if (error.isServerError) {
 *       showToast('Server error. Please try again later.');
 *       logToMonitoring(error.traceId);
 *     }
 *   }
 * }
 * ```
 */
export class ApiClientError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;
  public readonly traceId?: string;
  public readonly isNetworkError: boolean;
  public readonly isServerError: boolean;
  public readonly isValidationError: boolean;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.traceId = error.traceId;

    // Classify error types
    this.isNetworkError = error.code === 'NETWORK_ERROR';
    this.isServerError = (error.status ?? 0) >= 500;
    this.isValidationError = error.status === 400;

    // Maintain proper stack trace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ApiClientError);
    }
  }
}

// ==========================================
// ERROR NORMALIZATION
// ==========================================

/**
 * Normalize errors from various sources into ApiClientError
 *
 * Handles:
 * - Axios errors (with response, without response)
 * - Network errors
 * - Unknown errors
 * - Already normalized ApiClientError
 *
 * @param error - Error from any source
 * @returns Normalized ApiClientError with classification
 *
 * @example
 * ```typescript
 * try {
 *   await axios.get('/api/data');
 * } catch (error) {
 *   const normalizedError = normalizeError(error);
 *   if (normalizedError.isNetworkError) {
 *     // Handle network error
 *   }
 * }
 * ```
 */
export function normalizeError(error: unknown): ApiClientError {
  // Already normalized
  if (error instanceof ApiClientError) {
    return error;
  }

  // Axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; code?: string; errors?: unknown }>;

    if (axiosError.response) {
      // Server responded with error
      return new ApiClientError({
        message: axiosError.response.data?.message || `Request failed with status ${axiosError.response.status}`,
        code: axiosError.response.data?.code,
        status: axiosError.response.status,
        details: axiosError.response.data?.errors,
      });
    } else if (axiosError.request) {
      // Network error - no response received
      return new ApiClientError({
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR',
      });
    }
  }

  // Unknown error
  return new ApiClientError({
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  });
}
