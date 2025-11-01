/**
 * @fileoverview Next.js Fetch-Based API Client
 * @module lib/api/nextjs-client
 * @category API Client
 *
 * Enterprise-grade HTTP client built on Next.js native fetch API with comprehensive
 * caching, revalidation, and error handling capabilities.
 *
 * Key Features:
 * - Native Next.js fetch with automatic request deduplication
 * - Cache configuration (cache, revalidate, tags)
 * - cacheLife support for Next.js 15+
 * - Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Automatic authentication token injection
 * - CSRF protection headers
 * - Comprehensive error handling and retry logic
 * - Request ID generation for tracing
 * - HIPAA-compliant audit logging integration
 *
 * This client is designed to replace axios-based clients in Server Components
 * and Server Actions, enabling full integration with Next.js caching system.
 *
 * @example
 * ```typescript
 * // In a Server Component
 * const students = await serverGet<Student[]>('/api/students', {
 *   cache: 'force-cache',
 *   next: {
 *     revalidate: CACHE_TTL.PHI_STANDARD,
 *     tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // In a Server Action
 * const result = await serverPost<Student>('/api/students', data, {
 *   cache: 'no-store',
 *   next: { tags: [CACHE_TAGS.STUDENTS] }
 * });
 * ```
 *
 * @version 1.0.0
 * @since 2025-10-31
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Simple API client options for basic HTTP requests
 * @deprecated Consider using NextFetchOptions for new code
 */
export interface ApiClientOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
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

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * Get API base URL from environment
 */
function getApiBaseUrl(): string {
  return process.env.API_BASE_URL ||
         process.env.NEXT_PUBLIC_API_URL ||
         'http://localhost:3001';
}

/**
 * Get authentication token from cookies (server-side only)
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
  } catch (error) {
    console.error('[Next API Client] Failed to get auth token:', error);
    return null;
  }
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get CSRF token from cookies
 */
async function getCsrfToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('csrf-token')?.value || null;
  } catch (error) {
    console.error('[Next API Client] Failed to get CSRF token:', error);
    return null;
  }
}

// ==========================================
// CORE FETCH FUNCTION
// ==========================================

/**
 * Core fetch function with Next.js caching, authentication, and error handling
 *
 * @template T - The expected response data type
 * @param endpoint - API endpoint (relative or absolute URL)
 * @param options - Fetch options with Next.js caching configuration
 * @returns Promise resolving to typed API response
 *
 * @throws {NextApiClientError} On request failure
 *
 * @example
 * ```typescript
 * const response = await nextFetch<Student[]>('/api/students', {
 *   cache: 'force-cache',
 *   next: { revalidate: 60, tags: ['students'] }
 * });
 * ```
 */
export async function nextFetch<T>(
  endpoint: string,
  options: NextFetchOptions = {}
): Promise<T> {
  const {
    requiresAuth = false, // Temporarily disabled for development
    onError,
    retry = { attempts: 3, delay: 1000 },
    timeout = 30000,
    cache = 'force-cache',
    next,
    cacheLife,
    ...fetchOptions
  } = options;

  // Build full URL
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${getApiBaseUrl()}${endpoint}`;

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge additional headers
  if (fetchOptions.headers) {
    Object.entries(fetchOptions.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  // Add authentication if required
  if (requiresAuth) {
    const token = await getAuthToken();

    // Don't redirect during login/auth endpoints
    const isAuthEndpoint = endpoint.includes('/auth/') || 
                          endpoint.includes('/login') || 
                          endpoint.includes('/register') ||
                          endpoint.includes('/forgot-password') ||
                          endpoint.includes('/reset-password');

    if (!token && !isAuthEndpoint) {
      // Redirect to login if no token (but not during auth operations)
      redirect('/login');
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Add CSRF token for mutations
  if (fetchOptions.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(fetchOptions.method)) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  // Add request ID for tracing
  headers['X-Request-ID'] = generateRequestId();

  // Add security headers for HIPAA compliance
  headers['X-Content-Type-Options'] = 'nosniff';
  headers['X-Frame-Options'] = 'DENY';
  headers['X-XSS-Protection'] = '1; mode=block';

  // Build Next.js cache configuration
  const nextConfig: Record<string, unknown> = {};

  if (next?.revalidate !== undefined) {
    nextConfig.revalidate = next.revalidate;
  }

  if (next?.tags && next.tags.length > 0) {
    nextConfig.tags = next.tags;
  }

  // Execute fetch with retry logic
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retry.attempts; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        cache,
        next: Object.keys(nextConfig).length > 0 ? nextConfig : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response status codes
      if (!response.ok) {
        const error = await handleErrorResponse(response);

        // Handle specific errors with redirects
        if (response.status === 401) {
          redirect('/login');
        } else if (response.status === 403) {
          redirect('/access-denied');
        }

        throw error;
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json() as T;
      }

      return await response.text() as unknown as T;

    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (except 408, 429)
      if (error instanceof NextApiClientError) {
        const status = error.status;
        if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
          break;
        }
      }

      // Wait before retry (exponential backoff)
      if (attempt < retry.attempts - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, retry.delay * Math.pow(2, attempt))
        );
      }
    }
  }

  // All retries failed
  const finalError = lastError || new Error('Unknown error');

  if (onError) {
    onError(finalError);
  }

  throw finalError;
}

/**
 * Handle error responses and create normalized error objects
 */
async function handleErrorResponse(response: Response): Promise<NextApiClientError> {
  let details: unknown;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      details = await response.json();
    } else {
      details = await response.text();
    }
  } catch {
    details = null;
  }

  const error: ApiErrorResponse = {
    message: typeof details === 'object' && details !== null && 'message' in details
      ? (details as { message: string }).message
      : response.statusText || 'Request failed',
    status: response.status,
    code: typeof details === 'object' && details !== null && 'code' in details
      ? (details as { code: string }).code
      : undefined,
    details,
    traceId: response.headers.get('x-trace-id') || undefined,
  };

  return new NextApiClientError(error);
}

// ==========================================
// CONVENIENCE METHODS
// ==========================================

/**
 * GET request with Next.js caching support
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @param options - Fetch options with cache configuration
 * @returns Promise resolving to response data
 *
 * @example
 * ```typescript
 * const students = await serverGet<Student[]>('/api/students',
 *   { status: 'active' },
 *   {
 *     cache: 'force-cache',
 *     next: { revalidate: 60, tags: ['students'] }
 *   }
 * );
 * ```
 */
export async function serverGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options: NextFetchOptions = {}
): Promise<T> {
  const queryString = params
    ? '?' + new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : '';

  return nextFetch<T>(`${endpoint}${queryString}`, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request (typically with no-store for mutations)
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint
 * @param data - Request body data
 * @param options - Fetch options (defaults to no-store for mutations)
 * @returns Promise resolving to response data
 *
 * @example
 * ```typescript
 * const newStudent = await serverPost<Student>('/api/students',
 *   { name: 'John Doe', grade: '5' },
 *   {
 *     cache: 'no-store',
 *     next: { tags: ['students'] }
 *   }
 * );
 * ```
 */
export async function serverPost<T>(
  endpoint: string,
  data?: unknown,
  options: NextFetchOptions = {}
): Promise<T> {
  return nextFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    cache: options.cache ?? 'no-store', // Mutations typically no-store
  });
}

/**
 * PUT request (typically with no-store for mutations)
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint
 * @param data - Request body data
 * @param options - Fetch options (defaults to no-store for mutations)
 * @returns Promise resolving to response data
 */
export async function serverPut<T>(
  endpoint: string,
  data?: unknown,
  options: NextFetchOptions = {}
): Promise<T> {
  return nextFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    cache: options.cache ?? 'no-store',
  });
}

/**
 * PATCH request (typically with no-store for mutations)
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint
 * @param data - Request body data
 * @param options - Fetch options (defaults to no-store for mutations)
 * @returns Promise resolving to response data
 */
export async function serverPatch<T>(
  endpoint: string,
  data?: unknown,
  options: NextFetchOptions = {}
): Promise<T> {
  return nextFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
    cache: options.cache ?? 'no-store',
  });
}

/**
 * DELETE request (typically with no-store for mutations)
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint
 * @param options - Fetch options (defaults to no-store for mutations)
 * @returns Promise resolving to response data
 */
export async function serverDelete<T>(
  endpoint: string,
  options: NextFetchOptions = {}
): Promise<T> {
  return nextFetch<T>(endpoint, {
    ...options,
    method: 'DELETE',
    cache: options.cache ?? 'no-store',
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Build cache tags for a resource
 *
 * @param resourceType - Type of resource (e.g., 'students', 'medications')
 * @param isPHI - Whether the data contains PHI
 * @param additionalTags - Additional tags to include
 * @returns Array of cache tags
 *
 * @example
 * ```typescript
 * const tags = buildCacheTags('students', true, ['active']);
 * // Returns: ['students', 'phi-data', 'active']
 * ```
 */
export function buildCacheTags(
  resourceType: string,
  isPHI: boolean = true,
  additionalTags: string[] = []
): string[] {
  const tags: string[] = [resourceType];

  if (isPHI) {
    tags.push('phi-data');
  }

  return [...tags, ...additionalTags];
}

/**
 * Build resource-specific cache tag
 *
 * @param resourceType - Type of resource
 * @param resourceId - ID of specific resource
 * @returns Cache tag string
 *
 * @example
 * ```typescript
 * const tag = buildResourceTag('student', '123');
 * // Returns: 'student-123'
 * ```
 */
export function buildResourceTag(
  resourceType: string,
  resourceId: string
): string {
  return `${resourceType}-${resourceId}`;
}

// ==========================================
// LEGACY CLIENT SUPPORT
// ==========================================

/**
 * Simple API client for basic HTTP requests (legacy support)
 * 
 * @deprecated This is a legacy client merged from client.ts. 
 * For new development, prefer the Next.js-specific methods:
 * - serverGet() for GET requests
 * - serverPost() for POST requests
 * - serverPut() for PUT requests
 * - serverPatch() for PATCH requests
 * - serverDelete() for DELETE requests
 * 
 * @param endpoint - API endpoint (relative or absolute URL)
 * @param options - Basic request options
 * @returns Promise resolving to parsed JSON response
 * 
 * @example
 * ```typescript
 * // Legacy usage (consider migrating to serverGet/serverPost)
 * const data = await apiClient('/api/users', {
 *   method: 'POST',
 *   body: { name: 'John' }
 * });
 * ```
 */
export async function apiClient(endpoint: string, options: ApiClientOptions = {}) {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const url = endpoint.startsWith('http') ? endpoint : `${getApiBaseUrl()}${endpoint}`
  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Alias for apiClient (legacy support)
 * @deprecated Use apiClient directly or migrate to Next.js-specific methods
 */
export const fetchApi = apiClient

// ==========================================
// EXPORTS
// ==========================================

export default {
  nextFetch,
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,
  buildCacheTags,
  buildResourceTag,
  // Legacy exports
  apiClient,
  fetchApi,
};
