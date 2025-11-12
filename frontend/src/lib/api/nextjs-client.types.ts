/**
 * @fileoverview Type Definitions for Next.js API Client
 * @module lib/api/nextjs-client.types
 * @category API Client
 *
 * This module contains all type definitions, interfaces, and error classes
 * used by the Next.js fetch-based API client.
 *
 * @version 1.0.0
 * @since 2025-11-12
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Simple API client options for basic HTTP requests
 * @deprecated Consider using NextFetchOptions for new code
 */
export interface ApiClientOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Next.js cache configuration options
 */
export interface NextCacheConfig {
  /**
   * Cache behavior
   * - 'force-cache': Cache the response (default for GET)
   * - 'no-store': Never cache the response (default for mutations)
   * - 'reload': Bypass cache and revalidate
   * - 'no-cache': Cache but always revalidate
   * - 'force-cache': Use cache if available, fetch if not
   * - 'only-if-cached': Use cache only, fail if not cached
   */
  cache?: RequestCache;

  /**
   * Next.js-specific cache options
   */
  next?: {
    /**
     * Time in seconds to revalidate cache
     * - number: Revalidate after N seconds
     * - false: Never revalidate (cache indefinitely)
     * - 0: Revalidate immediately (effectively no-store)
     */
    revalidate?: number | false;

    /**
     * Cache tags for granular invalidation via revalidateTag()
     * @example ['students', 'phi-data']
     */
    tags?: string[];
  };
}

/**
 * cacheLife profiles for Next.js 15+ advanced caching
 * @see https://nextjs.org/docs/app/api-reference/next-config-js/cacheLife
 */
export interface CacheLifeConfig {
  /**
   * Time to live in seconds
   */
  ttl: number;

  /**
   * Stale-while-revalidate window in seconds
   */
  stale?: number;

  /**
   * Maximum age in cache regardless of revalidation
   */
  max?: number;
}

/**
 * Extended fetch options with Next.js caching and authentication
 */
export interface NextFetchOptions extends RequestInit {
  /**
   * Whether to include authentication token
   * @default true
   */
  requiresAuth?: boolean;

  /**
   * Cache behavior configuration
   */
  cache?: RequestCache;

  /**
   * Next.js-specific cache options
   */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };

  /**
   * cacheLife profile (Next.js 15+)
   */
  cacheLife?: string | CacheLifeConfig;

  /**
   * Retry configuration
   */
  retry?: {
    attempts: number;
    delay: number;
  };

  /**
   * Custom error handler
   */
  onError?: (error: Error) => void;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
}

/**
 * Standardized API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  field?: string;
  traceId?: string;
  timestamp?: string;
}

/**
 * Custom error class for Next.js API client errors
 *
 * @class
 * @extends Error
 * @classdesc Wraps API errors with metadata and automatic classification
 */
export class NextApiClientError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;
  public readonly traceId?: string;
  public readonly isNetworkError: boolean;
  public readonly isServerError: boolean;
  public readonly isValidationError: boolean;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = 'NextApiClientError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.traceId = error.traceId;

    // Classify error types
    this.isNetworkError = error.code === 'NETWORK_ERROR';
    this.isServerError = (error.status ?? 0) >= 500;
    this.isValidationError = error.status === 400;

    // Maintain proper stack trace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, NextApiClientError);
    }
  }
}
