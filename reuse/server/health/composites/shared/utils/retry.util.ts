/**
 * Retry Utility
 *
 * Provides exponential backoff retry logic for network operations to handle
 * transient failures in healthcare integrations.
 *
 * @module RetryUtil
 */

import { Logger } from '@nestjs/common';

/**
 * Retry configuration options
 */
export interface RetryOptions {
  /**
   * Maximum number of retry attempts (default: 3)
   */
  maxRetries?: number;

  /**
   * Base delay in milliseconds before first retry (default: 1000ms)
   */
  baseDelay?: number;

  /**
   * Maximum delay in milliseconds between retries (default: 4000ms)
   */
  maxDelay?: number;

  /**
   * Exponential backoff factor (default: 2)
   */
  factor?: number;

  /**
   * Function to determine if error should be retried
   */
  shouldRetry?: (error: any) => boolean;

  /**
   * Operation name for logging
   */
  operationName?: string;

  /**
   * Custom logger instance
   */
  logger?: Logger;
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, 'logger' | 'operationName'>> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 4000,
  factor: 2,
  shouldRetry: defaultShouldRetry
};

/**
 * Custom retry exhausted error
 */
export class RetryExhaustedError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastError: any
  ) {
    super(message);
    this.name = 'RetryExhaustedError';
  }
}

/**
 * Default function to determine if an error should be retried
 *
 * Retries on:
 * - Network errors (ECONNREFUSED, ETIMEDOUT, ENOTFOUND)
 * - HTTP 5xx server errors
 * - HTTP 408 Request Timeout
 * - HTTP 429 Too Many Requests
 * - HTTP 502 Bad Gateway
 * - HTTP 503 Service Unavailable
 * - HTTP 504 Gateway Timeout
 *
 * @param error - The error to check
 * @returns true if the error should be retried
 */
function defaultShouldRetry(error: any): boolean {
  // Network errors
  if (error.code) {
    const retryableCodes = [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNRESET',
      'EPIPE',
      'EHOSTUNREACH',
      'EAI_AGAIN'
    ];
    if (retryableCodes.includes(error.code)) {
      return true;
    }
  }

  // HTTP status codes
  if (error.response?.status) {
    const status = error.response.status;
    // Retry on 5xx server errors
    if (status >= 500 && status < 600) {
      return true;
    }
    // Retry on specific 4xx errors
    if (status === 408 || status === 429) {
      return true;
    }
  }

  // Axios-specific timeout errors
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    return true;
  }

  return false;
}

/**
 * Calculates delay before next retry using exponential backoff
 *
 * @param attempt - Current attempt number (0-indexed)
 * @param baseDelay - Base delay in milliseconds
 * @param maxDelay - Maximum delay in milliseconds
 * @param factor - Exponential backoff factor
 * @returns Delay in milliseconds
 */
function calculateDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  factor: number
): number {
  const delay = baseDelay * Math.pow(factor, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Delays execution for specified milliseconds
 *
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wraps an async operation with retry logic and exponential backoff
 *
 * @param operation - The async function to execute
 * @param options - Retry configuration options
 * @returns Promise that resolves with operation result or rejects after all retries exhausted
 *
 * @example
 * ```typescript
 * // Basic usage with defaults (3 retries, exponential backoff)
 * const result = await withRetry(
 *   () => this.externalAPI.call(),
 *   { operationName: 'External API call' }
 * );
 *
 * // Custom retry configuration
 * const result = await withRetry(
 *   async () => {
 *     const response = await this.hl7Client.send(message);
 *     if (!response.success) {
 *       throw new Error('HL7 send failed');
 *     }
 *     return response;
 *   },
 *   {
 *     maxRetries: 5,
 *     baseDelay: 2000,
 *     maxDelay: 10000,
 *     operationName: 'HL7 message send',
 *     logger: this.logger
 *   }
 * );
 *
 * // Custom retry condition
 * const result = await withRetry(
 *   () => this.database.query(sql),
 *   {
 *     maxRetries: 3,
 *     shouldRetry: (error) => error.code === 'ECONNRESET',
 *     operationName: 'Database query'
 *   }
 * );
 * ```
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options
  };

  const logger = options.logger || new Logger('RetryUtil');
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      // Execute operation
      const result = await operation();

      // Log success if this was a retry
      if (attempt > 0 && config.operationName) {
        logger.log(`Operation "${config.operationName}" succeeded after ${attempt} retries`);
      }

      return result;
    } catch (error) {
      lastError = error;

      // Check if we should retry
      const shouldRetry = config.shouldRetry(error);
      const hasRetriesLeft = attempt < config.maxRetries;

      if (!shouldRetry || !hasRetriesLeft) {
        // Don't retry, throw error
        if (!shouldRetry) {
          if (config.operationName) {
            logger.debug(`Operation "${config.operationName}" failed with non-retryable error`, {
              error: error.message,
              attempt: attempt + 1
            });
          }
          throw error;
        }

        // Retries exhausted
        const message = config.operationName
          ? `Operation "${config.operationName}" failed after ${attempt + 1} attempts`
          : `Operation failed after ${attempt + 1} attempts`;

        if (config.operationName) {
          logger.error(`Retry exhausted for "${config.operationName}"`, {
            attempts: attempt + 1,
            lastError: error.message
          });
        }

        throw new RetryExhaustedError(message, attempt + 1, error);
      }

      // Calculate delay before retry
      const delayMs = calculateDelay(attempt, config.baseDelay, config.maxDelay, config.factor);

      if (config.operationName) {
        logger.warn(`Operation "${config.operationName}" failed, retrying in ${delayMs}ms`, {
          attempt: attempt + 1,
          maxRetries: config.maxRetries,
          error: error.message
        });
      }

      // Wait before retrying
      await delay(delayMs);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new RetryExhaustedError(
    'Retry exhausted',
    config.maxRetries + 1,
    lastError
  );
}

/**
 * Checks if an error is a RetryExhaustedError
 *
 * @param error - The error to check
 * @returns true if the error is a RetryExhaustedError
 */
export function isRetryExhaustedError(error: any): error is RetryExhaustedError {
  return error instanceof RetryExhaustedError || error?.name === 'RetryExhaustedError';
}

/**
 * Standard retry configurations for healthcare operations
 */
export const RETRY_CONFIGS = {
  /** Default retry configuration (3 retries, 1s-4s backoff) */
  DEFAULT: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 4000,
    factor: 2
  },

  /** Fast retry for quick operations (2 retries, 500ms-2s backoff) */
  FAST: {
    maxRetries: 2,
    baseDelay: 500,
    maxDelay: 2000,
    factor: 2
  },

  /** Aggressive retry for critical operations (5 retries, 1s-10s backoff) */
  AGGRESSIVE: {
    maxRetries: 5,
    baseDelay: 1000,
    maxDelay: 10000,
    factor: 2
  },

  /** Conservative retry for expensive operations (2 retries, 2s-8s backoff) */
  CONSERVATIVE: {
    maxRetries: 2,
    baseDelay: 2000,
    maxDelay: 8000,
    factor: 2
  },

  /** Network operation retry (3 retries, 1s-4s backoff) */
  NETWORK: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 4000,
    factor: 2
  },

  /** Database operation retry (3 retries, 500ms-2s backoff) */
  DATABASE: {
    maxRetries: 3,
    baseDelay: 500,
    maxDelay: 2000,
    factor: 2
  }
};
