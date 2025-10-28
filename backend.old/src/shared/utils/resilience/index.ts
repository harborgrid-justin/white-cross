/**
 * @fileoverview Resilience Utilities - Retry, Timeout, and Error Recovery
 * @module shared/utils/resilience
 * @description Exports all resilience utilities for service error handling
 *
 * Provides:
 * - Retry logic with exponential backoff
 * - Timeout protection for long-running operations
 * - Integration with ServiceError hierarchy
 *
 * @author White-Cross Platform Team
 * @version 1.0.0
 * @since 2025-10-23
 */

// Retry utilities
export {
  retry,
  retryOnError,
  retryOnErrorType,
  RetryOptions,
} from './retry';

// Timeout utilities
export {
  withTimeout,
  withTimeoutFn,
  createTimeoutWrapper,
  timedOperation,
  TimeoutPresets,
  TimeoutOptions,
} from './timeout';
