/**
 * @fileoverview Unified error handling utilities with user-friendly messaging
 * @module utils/errorHandling
 * @category Utils
 *
 * Provides consistent error processing, classification, and user-facing
 * messages across the entire healthcare platform.
 *
 * Key Features:
 * - **Error classification**: Network, auth, validation, server errors
 * - **User-friendly messages**: Technical errors → readable messages
 * - **Retry logic**: Automatic determination of retryable errors
 * - **Error logging**: Structured error data for monitoring
 * - **HIPAA compliance**: No PHI in error messages
 * - **Status code mapping**: HTTP status → error type
 * - **Context preservation**: Additional context for debugging
 *
 * Error Types:
 * - NETWORK_ERROR: Connection failed, DNS issues, offline
 * - AUTHENTICATION_ERROR: 401 - Invalid credentials, expired token
 * - AUTHORIZATION_ERROR: 403 - Insufficient permissions
 * - VALIDATION_ERROR: 400 - Invalid input data
 * - SERVER_ERROR: 500-599 - Server-side failures
 * - CLIENT_ERROR: 400-499 - Client-side issues
 * - TIMEOUT_ERROR: Request exceeded timeout
 * - UNKNOWN_ERROR: Unclassified errors
 *
 * Retry Strategy:
 * - Network errors: Retry (user may have intermittent connection)
 * - Server errors (5xx): Retry (temporary server issues)
 * - Auth errors (401): Don't retry (need new credentials)
 * - Validation errors (400): Don't retry (need different input)
 * - Forbidden (403): Don't retry (permissions required)
 *
 * @example
 * ```typescript
 * // Process any error type
 * try {
 *   await api.updateStudent(data);
 * } catch (error) {
 *   const processed = processError(error, 'StudentUpdate');
 *
 *   // Show user-friendly message
 *   showErrorToast(processed.userMessage);
 *
 *   // Log technical details
 *   logger.error(processed.message, processed.details);
 *
 *   // Retry if applicable
 *   if (processed.canRetry) {
 *     setTimeout(() => retryOperation(), 2000);
 *   }
 * }
 *
 * // Get user-friendly message
 * const message = getUserFriendlyMessage(apiError);
 * // "Unable to save changes. Please try again."
 *
 * // Check if retryable
 * if (isRetryableError(statusCode)) {
 *   // Implement retry logic
 * }
 * ```
 */

// Export all types and interfaces
export type {
  ErrorType,
  ProcessedError,
  ErrorNotification,
  UseErrorHandlerResult,
  RetryOptions
} from './errorHandling.types';

// Export type guards
export {
  isApiError,
  isValidationError
} from './errorHandling.types';

// Export error handlers
export {
  processError,
  mapStatusCodeToErrorType,
  isRetryableError,
  getUserFriendlyMessage
} from './errorHandling.handlers';

// Export reporting utilities
export {
  logError,
  createErrorNotification,
  getErrorTitle,
  getNotificationType
} from './errorHandling.reporting';

// Export recovery utilities
export {
  withErrorHandling,
  createErrorHandler,
  withRetry
} from './errorHandling.recovery';
