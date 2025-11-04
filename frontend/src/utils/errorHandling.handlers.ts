/**
 * @fileoverview Error processing and classification handlers
 * @module utils/errorHandling/handlers
 * @category Utils
 *
 * Provides core error processing logic including classification,
 * status code mapping, retry determination, and user-friendly message generation.
 */

import { ApiError } from '@/types';
import {
  ErrorType,
  ProcessedError,
  isApiError,
  isValidationError
} from './errorHandling.types';

/**
 * Processes any error and returns a standardized error object
 *
 * @param error - The error to process (can be any type)
 * @param context - Optional context string for debugging
 * @returns Standardized ProcessedError object
 *
 * @example
 * ```typescript
 * try {
 *   await api.updateStudent(data);
 * } catch (error) {
 *   const processed = processError(error, 'StudentUpdate');
 *   showErrorToast(processed.userMessage);
 *   if (processed.canRetry) {
 *     setTimeout(() => retryOperation(), 2000);
 *   }
 * }
 * ```
 */
export function processError(error: unknown, context?: string): ProcessedError {
  const timestamp = new Date().toISOString();

  // Handle API errors
  if (isApiError(error)) {
    return {
      type: mapStatusCodeToErrorType(error.statusCode),
      message: error.message,
      userMessage: getUserFriendlyMessage(error),
      details: error.details,
      statusCode: error.statusCode,
      timestamp,
      canRetry: isRetryableError(error.statusCode)
    };
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network connection failed',
      userMessage: 'Unable to connect to the server. Please check your internet connection.',
      timestamp,
      canRetry: true
    };
  }

  // Handle timeout errors
  if (error instanceof DOMException && error.name === 'AbortError') {
    return {
      type: 'TIMEOUT_ERROR',
      message: 'Request timed out',
      userMessage: 'The request took too long to complete. Please try again.',
      timestamp,
      canRetry: true
    };
  }

  // Handle validation errors
  if (isValidationError(error)) {
    return {
      type: 'VALIDATION_ERROR',
      message: `Validation failed: ${error.message}`,
      userMessage: 'Please check your input and try again.',
      details: error,
      timestamp,
      canRetry: false
    };
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : String(error);
  const contextMessage = context ? `${context}: ${message}` : message;

  return {
    type: 'UNKNOWN_ERROR',
    message: contextMessage,
    userMessage: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    details: error,
    timestamp,
    canRetry: true
  };
}

/**
 * Maps HTTP status codes to error types
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorType
 */
export function mapStatusCodeToErrorType(statusCode?: number): ErrorType {
  if (!statusCode) return 'UNKNOWN_ERROR';

  if (statusCode === 401) return 'AUTHENTICATION_ERROR';
  if (statusCode === 403) return 'AUTHORIZATION_ERROR';
  if (statusCode === 408 || statusCode === 504) return 'TIMEOUT_ERROR';
  if (statusCode >= 400 && statusCode < 500) return 'CLIENT_ERROR';
  if (statusCode >= 500) return 'SERVER_ERROR';

  return 'UNKNOWN_ERROR';
}

/**
 * Determines if an error is retryable based on status code
 *
 * @param statusCode - HTTP status code
 * @returns true if the error can be retried
 *
 * Retry Strategy:
 * - Network errors: Retry (user may have intermittent connection)
 * - Server errors (5xx): Retry (temporary server issues)
 * - Auth errors (401): Don't retry (need new credentials)
 * - Validation errors (400): Don't retry (need different input)
 * - Forbidden (403): Don't retry (permissions required)
 */
export function isRetryableError(statusCode?: number): boolean {
  if (!statusCode) return true;

  // Don't retry client errors (except timeout)
  if (statusCode >= 400 && statusCode < 500 && statusCode !== 408) {
    return false;
  }

  // Retry server errors and network issues
  return true;
}

/**
 * Generates user-friendly error messages for healthcare context
 *
 * @param error - API error object
 * @returns User-friendly error message
 *
 * HIPAA Compliance:
 * - No PHI (Protected Health Information) in error messages
 * - Generic messages for sensitive operations
 * - Clear guidance for user action
 */
export function getUserFriendlyMessage(error: ApiError): string {
  const statusCode = error.statusCode;

  // Healthcare-specific error messages
  if (statusCode === 401) {
    return 'Your session has expired. Please log in again to continue.';
  }

  if (statusCode === 403) {
    return 'You do not have permission to access this patient information.';
  }

  if (statusCode === 404) {
    return 'The requested patient record or data was not found.';
  }

  if (statusCode === 409) {
    return 'This action conflicts with existing data. Please refresh and try again.';
  }

  if (statusCode === 422) {
    if (error.validation?.length) {
      return `Please correct the following: ${error.validation.map(v => v.message).join(', ')}`;
    }
    return 'The provided information is invalid. Please check your input.';
  }

  if (statusCode === 429) {
    return 'Too many requests. Please wait a moment before trying again.';
  }

  if (statusCode && statusCode >= 500) {
    return 'The server is temporarily unavailable. Please try again in a few moments.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}
