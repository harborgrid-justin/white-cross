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
 * Error handler context options
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
 * Global API error handler with automatic user notification
 */
export class ErrorHandler {
  /**
   * Handle API errors with automatic user feedback
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
   * Handle validation errors with field-level feedback
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
   * Handle unexpected errors
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
   * Log error to external service (Sentry, LogRocket, etc.)
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
