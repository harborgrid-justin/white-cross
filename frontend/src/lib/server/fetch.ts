/**
 * Server-Side Data Fetching Utilities for Next.js
 *
 * Provides utilities for fetching data on the server with:
 * - Cookie-based authentication
 * - Error handling
 * - Type safety
 * - Retry logic
 * - Request deduplication
 *
 * @module lib/server/fetch
 * @version 1.0.0
 *
 * @deprecated This module provides legacy fetch utilities.
 * For new code, prefer using @/lib/api/nextjs-client which provides
 * the same functionality with better Next.js integration.
 */

import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

// ==========================================
// TYPES
// ==========================================

/**
 * Legacy fetch options for server-side requests
 * @deprecated Use NextFetchOptions from @/lib/api/nextjs-client instead
 */
export interface LegacyServerFetchOptions extends RequestInit {
  /**
   * Whether to include authentication token
   * @default true
   */
  requiresAuth?: boolean;

  /**
   * Custom error handling
   */
  onError?: (error: Error) => void;

  /**
   * Retry configuration
   */
  retry?: {
    attempts: number;
    delay: number;
  };

  /**
   * Cache behavior
   */
  cache?: RequestCache;

  /**
   * Next.js revalidation time in seconds
   */
  revalidate?: number | false;

  /**
   * Next.js cache tags for granular invalidation
   */
  tags?: string[];
}

/**
 * Legacy API error type
 * @deprecated Use NextApiClientError from @/lib/api/nextjs-client instead
 */
export interface LegacyServerApiError {
  message: string;
  status: number;
  statusText: string;
  details?: unknown;
}

// ==========================================
// CONFIGURATION
// ==========================================

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
  } catch (error) {
    console.error('[Server Fetch] Failed to get auth token:', error);
    return null;
  }
}

// ==========================================
// CORE FETCH UTILITIES
// ==========================================

/**
 * Server-side fetch with authentication and error handling
 *
 * @deprecated Use nextFetch from @/lib/api/nextjs-client for better Next.js integration
 */
export async function serverFetch<T>(
  endpoint: string,
  options: LegacyServerFetchOptions = {}
): Promise<T> {
  const {
    requiresAuth = true,
    onError,
    retry = { attempts: 3, delay: 1000 },
    cache = 'force-cache',
    revalidate,
    tags = [],
    ...fetchOptions
  } = options;

  // Build full URL
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authentication if required
  if (requiresAuth) {
    const token = await getAuthToken();

    if (!token) {
      // Redirect to login if no token
      redirect('/login');
    }

    headers['Authorization'] = `Bearer ${token}`;
  }

  // Configure Next.js caching
  const nextConfig: NextFetchRequestConfig = {};

  if (revalidate !== undefined) {
    nextConfig.revalidate = revalidate;
  }

  if (tags.length > 0) {
    nextConfig.tags = tags;
  }

  // Execute fetch with retry logic
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retry.attempts; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        cache,
        next: Object.keys(nextConfig).length > 0 ? nextConfig : undefined,
      });

      // Handle different response status codes
      if (!response.ok) {
        const error = await handleErrorResponse(response);

        // Handle specific errors
        if (response.status === 401) {
          redirect('/login');
        } else if (response.status === 403) {
          redirect('/access-denied');
        } else if (response.status === 404) {
          notFound();
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
      if (error instanceof Error && 'status' in error) {
        const status = (error as LegacyServerApiError).status;
        if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
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
 * Handle error responses
 */
async function handleErrorResponse(response: Response): Promise<LegacyServerApiError> {
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

  const error: LegacyServerApiError = {
    message: typeof details === 'object' && details !== null && 'message' in details
      ? (details as any).message
      : response.statusText || 'Request failed',
    status: response.status,
    statusText: response.statusText,
    details,
  };

  return error;
}

// ==========================================
// CONVENIENCE METHODS
// ==========================================

/**
 * GET request
 *
 * @deprecated Use serverGet from @/lib/api/nextjs-client for better Next.js integration
 */
export async function serverGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options: LegacyServerFetchOptions = {}
): Promise<T> {
  const queryString = params
    ? '?' + new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : '';

  return serverFetch<T>(`${endpoint}${queryString}`, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request
 *
 * @deprecated Use serverPost from @/lib/api/nextjs-client for better Next.js integration
 */
export async function serverPost<T>(
  endpoint: string,
  data?: unknown,
  options: LegacyServerFetchOptions = {}
): Promise<T> {
  return serverFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 *
 * @deprecated Use serverPut from @/lib/api/nextjs-client for better Next.js integration
 */
export async function serverPut<T>(
  endpoint: string,
  data?: unknown,
  options: LegacyServerFetchOptions = {}
): Promise<T> {
  return serverFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 *
 * @deprecated Use serverPatch from @/lib/api/nextjs-client for better Next.js integration
 */
export async function serverPatch<T>(
  endpoint: string,
  data?: unknown,
  options: LegacyServerFetchOptions = {}
): Promise<T> {
  return serverFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 *
 * @deprecated Use serverDelete from @/lib/api/nextjs-client for better Next.js integration
 */
export async function serverDelete<T>(
  endpoint: string,
  options: LegacyServerFetchOptions = {}
): Promise<T> {
  return serverFetch<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

// ==========================================
// BACKWARD COMPATIBILITY ALIASES
// ==========================================

// Alias for backward compatibility
export const fetchWithAuth = serverFetch;

// ==========================================
// TYPES FOR NEXT.JS
// ==========================================

interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}
