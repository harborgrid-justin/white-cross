/**
 * @fileoverview Timeout Utility - Operation Timeout Protection
 * @module shared/utils/resilience/timeout
 * @description Wrap operations with timeout protection to prevent hung operations
 *
 * Features:
 * - Promise.race-based timeout
 * - Custom timeout errors
 * - Operation context tracking
 * - Integration with retry logic
 *
 * Based on patterns from resilientMedicationService.ts
 *
 * @author White-Cross Platform Team
 * @version 1.0.0
 * @since 2025-10-23
 */

import { TimeoutError } from '../../errors';

/**
 * Timeout configuration options
 */
export interface TimeoutOptions {
  /**
   * Timeout duration in milliseconds
   */
  timeoutMs: number;

  /**
   * Operation name for error messages and logging
   */
  operationName?: string;

  /**
   * Additional context to include in timeout error
   */
  context?: Record<string, any>;

  /**
   * Whether to log timeout warnings
   * @default true
   */
  logTimeout?: boolean;

  /**
   * Custom timeout error message
   */
  errorMessage?: string;
}

/**
 * Wrap a promise with timeout protection
 *
 * Uses Promise.race to race the operation against a timeout promise.
 * If the timeout promise resolves first, throws a TimeoutError.
 *
 * @param promise - The promise to wrap with timeout
 * @param options - Timeout configuration
 * @returns The result of the promise if it completes before timeout
 * @throws TimeoutError if operation exceeds timeout
 *
 * @example
 * ```typescript
 * // Simple timeout
 * const result = await withTimeout(
 *   fetchDataFromDatabase(),
 *   { timeoutMs: 5000, operationName: 'fetchData' }
 * );
 *
 * // With context
 * const result = await withTimeout(
 *   updateRecord(id, data),
 *   {
 *     timeoutMs: 10000,
 *     operationName: 'updateRecord',
 *     context: { id, data }
 *   }
 * );
 * ```
 */
export async function withTimeout<T>(promise: Promise<T>, options: TimeoutOptions): Promise<T> {
  const {
    timeoutMs,
    operationName = 'operation',
    context = {},
    logTimeout = true,
    errorMessage,
  } = options;

  // Create timeout promise
  const timeoutPromise = new Promise<T>((_, reject) => {
    const timeoutId = setTimeout(() => {
      const message = errorMessage || `Operation '${operationName}' timed out after ${timeoutMs}ms`;

      reject(new TimeoutError(operationName, timeoutMs, context));
    }, timeoutMs);

    // Store timeout ID for potential cleanup
    // Note: In practice, either promise or timeout will resolve first
    // The other will be garbage collected
  });

  // Race the operation against the timeout
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Wrap a function with timeout protection
 *
 * Convenience wrapper for functions that need timeout protection
 *
 * @param fn - The async function to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param operationName - Operation name for error messages
 * @param context - Additional context for error
 * @returns The result of the function if it completes before timeout
 * @throws TimeoutError if function execution exceeds timeout
 *
 * @example
 * ```typescript
 * const result = await withTimeoutFn(
 *   async () => await Student.findByPk(id),
 *   5000,
 *   'findStudent',
 *   { studentId: id }
 * );
 * ```
 */
export async function withTimeoutFn<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  operationName?: string,
  context?: Record<string, any>,
): Promise<T> {
  return withTimeout(fn(), {
    timeoutMs,
    operationName,
    context,
  });
}

/**
 * Create a timeout wrapper function that can be reused
 *
 * Useful when you need to apply the same timeout to multiple operations
 *
 * @param timeoutMs - Default timeout in milliseconds
 * @param operationName - Default operation name
 * @returns A wrapper function that applies the timeout
 *
 * @example
 * ```typescript
 * // Create a 5-second timeout wrapper
 * const withDatabaseTimeout = createTimeoutWrapper(5000, 'databaseOperation');
 *
 * // Use it for multiple operations
 * const user = await withDatabaseTimeout(() => User.findByPk(id));
 * const posts = await withDatabaseTimeout(() => Post.findAll());
 * ```
 */
export function createTimeoutWrapper(
  timeoutMs: number,
  operationName?: string,
): <T>(fn: () => Promise<T>, context?: Record<string, any>) => Promise<T> {
  return async <T>(fn: () => Promise<T>, context?: Record<string, any>): Promise<T> => {
    return withTimeoutFn(fn, timeoutMs, operationName, context);
  };
}

/**
 * Apply different timeouts based on operation type
 *
 * Useful for categorizing operations by expected duration
 *
 * @example
 * ```typescript
 * const timeouts = {
 *   fast: 1000,    // Quick operations
 *   normal: 5000,  // Normal operations
 *   slow: 15000,   // Slow operations
 * };
 *
 * const result = await timedOperation(
 *   async () => await complexQuery(),
 *   'slow',
 *   timeouts,
 *   'complexQuery'
 * );
 * ```
 */
export async function timedOperation<T>(
  fn: () => Promise<T>,
  level: 'fast' | 'normal' | 'slow',
  timeouts: { fast: number; normal: number; slow: number },
  operationName?: string,
  context?: Record<string, any>,
): Promise<T> {
  const timeoutMs = timeouts[level];
  return withTimeoutFn(fn, timeoutMs, operationName || level, context);
}

/**
 * Preset timeout wrappers for common operation types
 */
export const TimeoutPresets = {
  /**
   * Fast operations: 1 second timeout
   * For simple queries, cache lookups, etc.
   */
  fast: createTimeoutWrapper(1000, 'fast-operation'),

  /**
   * Normal operations: 5 seconds timeout
   * For standard database operations
   */
  normal: createTimeoutWrapper(5000, 'normal-operation'),

  /**
   * Slow operations: 15 seconds timeout
   * For complex queries, bulk operations, etc.
   */
  slow: createTimeoutWrapper(15000, 'slow-operation'),

  /**
   * API calls: 30 seconds timeout
   * For external API calls
   */
  api: createTimeoutWrapper(30000, 'api-call'),

  /**
   * Long-running: 60 seconds timeout
   * For reports, exports, etc.
   */
  longRunning: createTimeoutWrapper(60000, 'long-running-operation'),
};
