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

import { ApiError, ValidationError } from '../types/common';
import {
  ERROR_CODES
} from '../constants/errors';

// Error types for classification
export type ErrorType =
  | 'NETWORK_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'CLIENT_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNKNOWN_ERROR';

export interface ProcessedError {
  type: ErrorType;
  message: string;
  userMessage: string;
  details?: unknown;
  statusCode?: number;
  timestamp: string;
  canRetry: boolean;
}

/**
 * Processes any error and returns a standardized error object
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
 */
function mapStatusCodeToErrorType(statusCode?: number): ErrorType {
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
 */
function isRetryableError(statusCode?: number): boolean {
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
 */
function getUserFriendlyMessage(error: ApiError): string {
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

/**
 * Type guards for error identification
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'field' in error &&
    'message' in error
  );
}

/**
 * Logs errors with appropriate detail level based on environment
 */
export function logError(
  error: ProcessedError,
  context?: string,
  additionalData?: Record<string, unknown>
): void {
  const logData = {
    ...error,
    context,
    additionalData,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // In development, log full error details
  if (process.env.NODE_ENV === 'development') {
    console.error('Error occurred:', logData);
    return;
  }

  // In production, log to external service (implement as needed)
  try {
    // Replace with your logging service (e.g., Sentry, LogRocket, etc.)
    console.error('Production error:', {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      context,
      canRetry: error.canRetry
    });
  } catch (loggingError) {
    console.error('Failed to log error:', loggingError);
  }
}

/**
 * Creates standardized error notifications for the UI
 */
export interface ErrorNotification {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: {
    label: string;
    handler: () => void;
  };
}

export function createErrorNotification(
  error: ProcessedError,
  options: {
    showRetryAction?: boolean;
    onRetry?: () => void;
    customTitle?: string;
  } = {}
): ErrorNotification {
  const { showRetryAction = false, onRetry, customTitle } = options;

  const notification: ErrorNotification = {
    title: customTitle || getErrorTitle(error.type),
    message: error.userMessage,
    type: getNotificationType(error.type)
  };

  // Add retry action if appropriate
  if (showRetryAction && error.canRetry && onRetry) {
    notification.action = {
      label: 'Try Again',
      handler: onRetry
    };
  }

  return notification;
}

function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case 'NETWORK_ERROR':
      return 'Connection Error';
    case 'AUTHENTICATION_ERROR':
      return 'Authentication Required';
    case 'AUTHORIZATION_ERROR':
      return 'Access Denied';
    case 'VALIDATION_ERROR':
      return 'Invalid Input';
    case 'SERVER_ERROR':
      return 'Server Error';
    case 'TIMEOUT_ERROR':
      return 'Request Timeout';
    default:
      return 'Error';
  }
}

function getNotificationType(type: ErrorType): 'error' | 'warning' | 'info' {
  switch (type) {
    case 'VALIDATION_ERROR':
    case 'AUTHORIZATION_ERROR':
      return 'warning';
    case 'NETWORK_ERROR':
    case 'TIMEOUT_ERROR':
      return 'info';
    default:
      return 'error';
  }
}

/**
 * Higher-order function for wrapping async operations with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string,
  options: {
    logErrors?: boolean;
    showNotifications?: boolean;
    onError?: (error: ProcessedError) => void;
  } = {}
): T {
  const { logErrors = true, showNotifications = false, onError } = options;

  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const processedError = processError(error, context);

      if (logErrors) {
        logError(processedError, context);
      }

      if (onError) {
        onError(processedError);
      }

      if (showNotifications) {
        // This would integrate with your notification system
        console.warn('Notification would be shown:', createErrorNotification(processedError));
      }

      throw processedError;
    }
  }) as T;
}

/**
 * React hook for error handling in components
 */
export interface UseErrorHandlerResult {
  handleError: (error: unknown, context?: string) => void;
  clearError: () => void;
  error: ProcessedError | null;
  hasError: boolean;
}

// Note: This would typically be implemented as a React hook
// but we're keeping it as a utility function for now
export function createErrorHandler(): UseErrorHandlerResult {
  let currentError: ProcessedError | null = null;

  return {
    handleError: (error: unknown, context?: string) => {
      currentError = processError(error, context);
      logError(currentError, context);
    },
    clearError: () => {
      currentError = null;
    },
    error: currentError,
    hasError: currentError !== null
  };
}

/**
 * Utility for creating retry mechanisms
 */
export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: ProcessedError) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxAttempts, delayMs, backoffMultiplier = 1.5, shouldRetry } = options;

  let lastError: ProcessedError;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = processError(error, `Retry attempt ${attempt}/${maxAttempts}`);

      // Don't retry if this is the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Don't retry if the error is not retryable
      if (!lastError.canRetry || (shouldRetry && !shouldRetry(lastError))) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError!;
}
