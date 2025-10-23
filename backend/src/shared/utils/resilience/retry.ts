/**
 * @fileoverview Retry Utility - Exponential Backoff Retry Logic
 * @module shared/utils/resilience/retry
 * @description Retry failed operations with configurable backoff strategies
 *
 * Features:
 * - Exponential backoff with jitter
 * - Configurable retry predicates
 * - Maximum attempt limits
 * - Comprehensive logging
 *
 * Based on patterns from resilientMedicationService.ts
 *
 * @author White-Cross Platform Team
 * @version 1.0.0
 * @since 2025-10-23
 */

import { logger } from '../../logging';
import { isServiceError } from '../../errors';

/**
 * Retry configuration options
 */
export interface RetryOptions {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxAttempts?: number;

  /**
   * Initial delay in milliseconds before first retry
   * @default 1000
   */
  delayMs?: number;

  /**
   * Use exponential backoff for delays
   * @default true
   */
  exponentialBackoff?: boolean;

  /**
   * Maximum delay in milliseconds (prevents exponential delays from growing too large)
   * @default 30000 (30 seconds)
   */
  maxDelayMs?: number;

  /**
   * Add random jitter to delays to prevent thundering herd
   * @default true
   */
  jitter?: boolean;

  /**
   * Jitter factor (0-1). Higher values = more randomness
   * @default 0.3 (30% jitter)
   */
  jitterFactor?: number;

  /**
   * Predicate function to determine if error should be retried
   * If not provided, defaults to retrying ServiceErrors with isRetryable=true
   *
   * @param error - The error that occurred
   * @param attempt - Current attempt number (1-based)
   * @returns true if should retry, false otherwise
   */
  shouldRetry?: (error: any, attempt: number) => boolean;

  /**
   * Callback called before each retry attempt
   *
   * @param error - The error that occurred
   * @param attempt - Current attempt number (1-based)
   * @param delay - Delay in ms before next attempt
   */
  onRetry?: (error: any, attempt: number, delay: number) => void;

  /**
   * Operation name for logging
   */
  operationName?: string;
}

/**
 * Default shouldRetry function
 * Retries ServiceErrors with isRetryable=true, and common transient errors
 */
function defaultShouldRetry(error: any, attempt: number): boolean {
  // Always retry ServiceErrors marked as retryable
  if (isServiceError(error) && error.isRetryable) {
    return true;
  }

  // Retry common transient database errors
  const errorName = error?.name?.toLowerCase() || '';
  const errorMsg = error?.message?.toLowerCase() || '';

  // Sequelize connection errors
  if (errorName.includes('sequelizeconnectionerror')) {
    return true;
  }

  // Sequelize timeout errors
  if (errorName.includes('sequelizeti meouterror')) {
    return true;
  }

  // Generic timeout errors
  if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
    return true;
  }

  // Connection refused / network errors
  if (errorMsg.includes('econnrefused') || errorMsg.includes('enotfound')) {
    return true;
  }

  // Lock errors (but not on last attempt - these may need longer backoff)
  if (attempt < 3 && (errorMsg.includes('lock') || errorMsg.includes('deadlock'))) {
    return true;
  }

  // Don't retry by default
  return false;
}

/**
 * Calculate delay with exponential backoff and optional jitter
 */
function calculateDelay(
  attempt: number,
  baseDelay: number,
  exponential: boolean,
  maxDelay: number,
  jitter: boolean,
  jitterFactor: number
): number {
  let delay = baseDelay;

  // Apply exponential backoff
  if (exponential && attempt > 1) {
    delay = baseDelay * Math.pow(2, attempt - 1);
  }

  // Cap at max delay
  delay = Math.min(delay, maxDelay);

  // Apply jitter to prevent thundering herd
  if (jitter) {
    const jitterAmount = delay * jitterFactor;
    const randomJitter = Math.random() * jitterAmount * 2 - jitterAmount;
    delay = Math.max(0, delay + randomJitter);
  }

  return Math.floor(delay);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a failed operation with exponential backoff
 *
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the successful operation
 * @throws The last error if all retry attempts fail
 *
 * @example
 * ```typescript
 * // Simple retry with defaults
 * const result = await retry(async () => {
 *   return await fetchDataFromDatabase();
 * });
 *
 * // Custom retry configuration
 * const result = await retry(async () => {
 *   return await callExternalAPI();
 * }, {
 *   maxAttempts: 5,
 *   delayMs: 2000,
 *   exponentialBackoff: true,
 *   shouldRetry: (error, attempt) => {
 *     // Custom retry logic
 *     return error.code === 'RATE_LIMIT' && attempt < 3;
 *   }
 * });
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    exponentialBackoff = true,
    maxDelayMs = 30000,
    jitter = true,
    jitterFactor = 0.3,
    shouldRetry = defaultShouldRetry,
    onRetry,
    operationName = 'operation',
  } = options;

  let lastError: any;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;

    try {
      const result = await fn();

      // Success! Log if we had to retry
      if (attempt > 1) {
        logger.info(`${operationName} succeeded after ${attempt} attempts`, {
          operation: operationName,
          attempts: attempt,
        });
      }

      return result;

    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      const willRetry = attempt < maxAttempts && shouldRetry(error, attempt);

      if (!willRetry) {
        // No more retries - log and throw
        if (attempt >= maxAttempts) {
          logger.error(`${operationName} failed after ${maxAttempts} attempts`, {
            operation: operationName,
            attempts: maxAttempts,
            error: error.message,
            errorName: error.name,
          });
        } else {
          logger.error(`${operationName} failed (non-retryable error)`, {
            operation: operationName,
            attempt,
            error: error.message,
            errorName: error.name,
          });
        }
        throw error;
      }

      // Calculate delay for next attempt
      const delay = calculateDelay(
        attempt,
        delayMs,
        exponentialBackoff,
        maxDelayMs,
        jitter,
        jitterFactor
      );

      // Log retry attempt
      logger.warn(`${operationName} failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms`, {
        operation: operationName,
        attempt,
        maxAttempts,
        delayMs: delay,
        error: error.message,
        errorName: error.name,
      });

      // Call onRetry callback if provided
      if (onRetry) {
        try {
          onRetry(error, attempt, delay);
        } catch (callbackError) {
          logger.error('Error in onRetry callback', { error: callbackError });
        }
      }

      // Wait before retry
      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Retry with custom predicate for specific error types
 *
 * @example
 * ```typescript
 * // Retry only database connection errors
 * const result = await retryOnError(
 *   async () => await queryDatabase(),
 *   (error) => error.name === 'SequelizeConnectionError'
 * );
 * ```
 */
export async function retryOnError<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: any) => boolean,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  return retry(fn, {
    maxAttempts,
    delayMs,
    shouldRetry: (error) => shouldRetry(error),
  });
}

/**
 * Retry with specific error types
 *
 * @example
 * ```typescript
 * // Retry only timeout errors
 * const result = await retryOnErrorType(
 *   async () => await callAPI(),
 *   TimeoutError
 * );
 * ```
 */
export async function retryOnErrorType<T>(
  fn: () => Promise<T>,
  errorType: new (...args: any[]) => Error,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  return retry(fn, {
    maxAttempts,
    delayMs,
    shouldRetry: (error) => error instanceof errorType,
  });
}
