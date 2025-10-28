/**
 * Rate Limiter Interfaces
 *
 * Type definitions for rate limiting implementation.
 * Rate limiting prevents overwhelming external APIs by controlling
 * the number of requests sent within a time window.
 *
 * @module integrations/interfaces/rate-limiter
 */

/**
 * Rate limiter configuration options
 */
export interface RateLimiterConfig {
  /**
   * Maximum number of requests allowed within the time window
   * @default 100
   */
  maxRequests: number;

  /**
   * Time window in milliseconds for rate limiting
   * @default 60000 (1 minute)
   */
  windowMs: number;
}

/**
 * Rate limiter status information
 */
export interface RateLimiterStatus {
  /**
   * Current number of requests in the time window
   */
  current: number;

  /**
   * Maximum allowed requests
   */
  max: number;

  /**
   * Time window in milliseconds
   */
  window: number;
}
