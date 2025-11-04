/**
 * @fileoverview Error logging and notification utilities
 * @module utils/errorHandling/reporting
 * @category Utils
 *
 * Provides error logging to console/external services and creates
 * standardized UI notifications for error display.
 */

import {
  ProcessedError,
  ErrorNotification,
  ErrorType
} from './errorHandling.types';

/**
 * Logs errors with appropriate detail level based on environment
 *
 * @param error - Processed error object
 * @param context - Optional context string
 * @param additionalData - Optional additional data for logging
 *
 * @example
 * ```typescript
 * const processed = processError(error, 'StudentUpdate');
 * logError(processed, 'StudentUpdate', { studentId: '123' });
 * ```
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
 *
 * @param error - Processed error object
 * @param options - Configuration options for the notification
 * @returns ErrorNotification object ready for UI display
 *
 * @example
 * ```typescript
 * const notification = createErrorNotification(processed, {
 *   showRetryAction: true,
 *   onRetry: () => retryOperation()
 * });
 * showToast(notification);
 * ```
 */
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

/**
 * Maps error type to user-friendly title
 *
 * @param type - Error type
 * @returns User-friendly title string
 */
export function getErrorTitle(type: ErrorType): string {
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

/**
 * Maps error type to notification severity level
 *
 * @param type - Error type
 * @returns Notification type ('error', 'warning', or 'info')
 */
export function getNotificationType(type: ErrorType): 'error' | 'warning' | 'info' {
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
