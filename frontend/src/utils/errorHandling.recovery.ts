/**
 * @fileoverview Error recovery and retry mechanisms
 * @module utils/errorHandling/recovery
 * @category Utils
 *
 * Provides utilities for automatic retry logic, error handling wrappers,
 * and error state management for React components.
 */

import {
  ProcessedError,
  RetryOptions,
  UseErrorHandlerResult
} from './errorHandling.types';
import { processError } from './errorHandling.handlers';
import { logError, createErrorNotification } from './errorHandling.reporting';

/**
 * Higher-order function for wrapping async operations with error handling
 *
 * @param fn - Async function to wrap
 * @param context - Optional context string
 * @param options - Configuration options
 * @returns Wrapped function with error handling
 *
 * @example
 * ```typescript
 * const saveStudent = withErrorHandling(
 *   async (data) => await api.updateStudent(data),
 *   'StudentUpdate',
 *   { logErrors: true, showNotifications: true }
 * );
 * ```
 */
export function withErrorHandling<TFunc extends (...args: readonly unknown[]) => Promise<unknown>>(
  fn: TFunc,
  context?: string,
  options: {
    logErrors?: boolean;
    showNotifications?: boolean;
    onError?: (error: ProcessedError) => void;
  } = {}
): TFunc {
  const { logErrors = true, showNotifications = false, onError } = options;

  return (async (...args: Parameters<TFunc>) => {
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
  }) as TFunc;
}

/**
 * Creates an error handler utility for managing error state
 *
 * Note: This is a basic implementation. In React applications,
 * this would typically be implemented as a React hook.
 *
 * @returns Error handler utility with methods and state
 *
 * @example
 * ```typescript
 * const errorHandler = createErrorHandler();
 *
 * try {
 *   await someOperation();
 * } catch (error) {
 *   errorHandler.handleError(error, 'OperationName');
 * }
 *
 * if (errorHandler.hasError) {
 *   showErrorMessage(errorHandler.error.userMessage);
 * }
 * ```
 */
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
 * Utility for creating retry mechanisms with exponential backoff
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Result of the function call
 * @throws ProcessedError if all retry attempts fail
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => api.updateStudent(data),
 *   {
 *     maxAttempts: 3,
 *     delayMs: 1000,
 *     backoffMultiplier: 2
 *   }
 * );
 * ```
 */
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
