/**
 * Centralized Error Handler
 *
 * Provides consistent error handling and user feedback across the application.
 * Integrates with toast notifications and error tracking.
 *
 * @module lib/errorHandler
 * @category Core
 */

import { toast } from 'react-hot-toast';
import { ApiError, isApiError, getErrorMessage, isAuthError } from '@/types/errors';
import { ERROR_MESSAGES, getApiErrorMessage } from '@/constants/errorMessages';

/**
 * Error handler context configuration.
 *
 * Provides context and configuration options for error handling behavior,
 * including operation identification, retry functionality, and notification control.
 *
 * @property {string} operation - Operation identifier for logging (e.g., 'fetch_students', 'update_profile')
 * @property {string} [resource] - Resource being operated on for user-friendly messages (e.g., 'students', 'profile')
 * @property {boolean} [silent] - If true, suppresses toast notifications (default: false)
 * @property {Function} [retry] - Retry function to offer user for failed operations
 * @property {string} [redirectPath] - Path to redirect to on authentication errors
 */
export interface ErrorHandlerContext {
  /** Operation identifier (e.g., 'fetch_students') */
  operation: string;
  /** Resource being operated on (e.g., 'students') */
  resource?: string;
  /** Don't show toast notification */
  silent?: boolean;
  /** Retry function to offer user */
  retry?: () => void;
  /** Redirect path for auth errors */
  redirectPath?: string;
}

/**
 * Global error handler for consistent error handling and user feedback.
 *
 * Provides centralized error handling with automatic user notifications,
 * error logging, authentication error handling, and integration points
 * for error tracking services like Sentry.
 *
 * @example
 * ```typescript
 * try {
 *   await fetchStudents();
 * } catch (error) {
 *   ErrorHandler.handleApiError(error, {
 *     operation: 'fetch_students',
 *     resource: 'students',
 *     retry: () => fetchStudents()
 *   });
 * }
 * ```
 */
export class ErrorHandler {
  /**
   * Handles API errors with automatic user feedback and logging.
   *
   * Performs comprehensive error handling:
   * 1. Converts unknown errors to ApiError format
   * 2. Logs error details for debugging/tracking
   * 3. Handles authentication errors with optional redirect
   * 4. Shows user-friendly toast notifications
   * 5. Returns normalized ApiError
   *
   * @param {unknown} error - Error to handle (any type)
   * @param {ErrorHandlerContext} context - Error handling context and options
   * @returns {ApiError} Normalized API error object
   *
   * @example
   * ```typescript
   * try {
   *   await api.updateStudent(id, data);
   * } catch (error) {
   *   const apiError = ErrorHandler.handleApiError(error, {
   *     operation: 'update_student',
   *     resource: 'student',
   *     redirectPath: '/students'
   *   });
   *   // apiError contains normalized error information
   * }
   * ```
   *
   * @see {@link handleValidationError} for validation-specific errors
   * @see {@link handleUnexpectedError} for unexpected errors
   */
  static handleApiError(
    error: unknown,
    context: ErrorHandlerContext
  ): ApiError {
    const { operation, resource, silent = false, retry } = context;

    // Convert to ApiError if needed
    let apiError: ApiError;
    if (isApiError(error)) {
      apiError = error;
    } else {
      apiError = new ApiError(
        getErrorMessage(error),
        operation,
        'UNKNOWN_ERROR',
        500,
        error
      );
    }

    // Log error (integrate with error tracking service like Sentry)
    console.error(`[${operation}] Error:`, {
      message: apiError.message,
      code: apiError.code,
      statusCode: apiError.statusCode,
      endpoint: apiError.endpoint,
      details: apiError.details,
      timestamp: new Date().toISOString(),
    });

    // Handle authentication errors
    if (isAuthError(error)) {
      if (context.redirectPath) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(context.redirectPath)}`;
      }
    }

    // Show user notification unless silent
    if (!silent) {
      const userMessage = resource
        ? getApiErrorMessage(apiError.statusCode || 500, resource)
        : apiError.message;

      toast.error(userMessage, {
        duration: 5000,
        ...(retry && {
          // Note: react-hot-toast doesn't support action buttons by default
          // Consider using sonner or react-toastify for action buttons
        }),
      });
    }

    return apiError;
  }

  /**
   * Handles validation errors with field-level feedback.
   *
   * Processes validation errors from API responses and:
   * 1. Extracts field-level validation errors
   * 2. Calls setFieldErrors callback to update form state
   * 3. Shows user-friendly validation error toast
   *
   * Expects validation errors in format:
   * ```
   * { validation: [{ field: 'email', message: 'Invalid email' }] }
   * ```
   *
   * @param {unknown} error - Error object potentially containing validation errors
   * @param {Function} [setFieldErrors] - Optional callback to set field-level errors in form state
   *
   * @example
   * ```typescript
   * try {
   *   await submitForm(formData);
   * } catch (error) {
   *   ErrorHandler.handleValidationError(error, (errors) => {
   *     // errors = { email: 'Invalid email', password: 'Too short' }
   *     setFormErrors(errors);
   *   });
   * }
   * ```
   *
   * @see {@link handleApiError} for general API errors
   */
  static handleValidationError(
    error: unknown,
    setFieldErrors?: (errors: Record<string, string>) => void
  ): void {
    if (error && typeof error === 'object' && 'validation' in error) {
      const validationErrors = (error as any).validation;

      if (Array.isArray(validationErrors) && setFieldErrors) {
        const fieldErrors: Record<string, string> = {};
        validationErrors.forEach((err: any) => {
          if (err.field && err.message) {
            fieldErrors[err.field] = err.message;
          }
        });
        setFieldErrors(fieldErrors);
      }

      toast.error(ERROR_MESSAGES.VALIDATION_FAILED, {
        duration: 4000,
      });
    }
  }

  /**
   * Handles unexpected errors with fallback error messaging.
   *
   * Use this for errors that don't fit the API error pattern,
   * such as client-side JavaScript errors, network failures,
   * or other unexpected exceptions.
   *
   * Logs the error and shows a generic error message to the user.
   *
   * @param {unknown} error - Unexpected error to handle
   * @param {string} [context] - Optional context description (e.g., 'form submission', 'data loading')
   *
   * @example
   * ```typescript
   * try {
   *   // Complex client-side operation
   *   processData(data);
   * } catch (error) {
   *   ErrorHandler.handleUnexpectedError(error, 'data processing');
   * }
   * ```
   *
   * @see {@link handleApiError} for API-specific errors
   */
  static handleUnexpectedError(error: unknown, context?: string): void {
    const message = getErrorMessage(error);
    const contextMsg = context ? ` during ${context}` : '';

    console.error(`Unexpected error${contextMsg}:`, error);

    toast.error(ERROR_MESSAGES.UNKNOWN_ERROR, {
      duration: 5000,
    });
  }

  /**
   * Logs error to external error tracking service.
   *
   * Integration point for external error tracking services like
   * Sentry, LogRocket, or custom logging solutions.
   *
   * Currently logs to console with structured data. Replace with
   * actual service integration in production.
   *
   * @param {unknown} error - Error to log
   * @param {Record<string, any>} [context] - Additional context data to log with error
   *
   * @example
   * ```typescript
   * try {
   *   await criticalOperation();
   * } catch (error) {
   *   ErrorHandler.logToService(error, {
   *     userId: user.id,
   *     operation: 'critical_operation',
   *     environment: 'production'
   *   });
   * }
   * ```
   *
   * @remarks
   * Production implementation should integrate with services like:
   * - Sentry: `Sentry.captureException(error, { extra: context })`
   * - LogRocket: `LogRocket.captureException(error, context)`
   * - Custom logging: Send to your error tracking endpoint
   */
  static logToService(error: unknown, context?: Record<string, any>): void {
    // Integrate with your error tracking service
    // Example with Sentry:
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.captureException(error, { extra: context });

    console.error('[Error Tracking]', {
      error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    });
  }
}
