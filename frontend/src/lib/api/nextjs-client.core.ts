/**
 * @fileoverview Core Fetch Functionality for Next.js API Client
 * @module lib/api/nextjs-client.core
 * @category API Client
 *
 * This module contains the core fetch function with Next.js caching,
 * authentication, error handling, and retry logic.
 *
 * @version 1.0.0
 * @since 2025-11-12
 */

import { redirect } from 'next/navigation';
import {
  NextFetchOptions,
  NextApiClientError,
  ApiErrorResponse,
} from './nextjs-client.types';
import {
  getApiBaseUrl,
  getAuthToken,
  getCsrfToken,
  generateRequestId,
} from './nextjs-client.config';

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
    requiresAuth = true, // Enable authentication by default
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
    const isAuthEndpoint =
      endpoint.includes('/auth/') ||
      endpoint.includes('/login') ||
      endpoint.includes('/register') ||
      endpoint.includes('/forgot-password') ||
      endpoint.includes('/reset-password');

    console.log('[Next API Client] Auth check:', {
      endpoint,
      hasToken: !!token,
      tokenStart: token?.substring(0, 20),
      isAuthEndpoint,
      requiresAuth,
    });

    if (!token && !isAuthEndpoint) {
      // Redirect to login if no token (but not during auth operations)
      console.error(
        '[Next API Client] No auth token found for protected endpoint:',
        endpoint
      );
      // Note: redirect() in server components/actions can cause issues
      // Consider using middleware for auth protection instead
      redirect('/login');
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[Next API Client] Added Authorization header:', {
        authHeaderStart: headers['Authorization'].substring(0, 30),
        fullAuthHeaderLength: headers['Authorization'].length,
      });
    }
  }

  // Add CSRF token for mutations
  if (
    fetchOptions.method &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(fetchOptions.method)
  ) {
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
        // Log 401 errors for debugging before consuming the response
        if (response.status === 401) {
          console.error('[Next API Client] 401 Unauthorized:', {
            endpoint,
            status: response.status,
            statusText: response.statusText,
            hasAuthHeader: !!headers['Authorization'],
            authHeaderStart: headers['Authorization']?.substring(0, 30),
          });
        }

        const error = await handleErrorResponse(response);

        // Handle specific errors with redirects
        // Don't redirect on login/auth endpoints to avoid redirect loops
        const isAuthEndpoint =
          endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

        // Note: Redirects in Server Components/Actions can be tricky
        // These will throw NEXT_REDIRECT which Next.js catches
        // Consider using middleware for auth protection instead
        if (response.status === 401 && !isAuthEndpoint) {
          console.error('[Next API Client] 401 error - authentication required');
          redirect('/login');
        } else if (response.status === 403) {
          console.error('[Next API Client] 403 error - access denied');
          redirect('/access-denied');
        }

        throw error;
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      // Re-throw Next.js redirect errors immediately - they should not be caught
      if (error && typeof error === 'object' && 'digest' in error) {
        const errorWithDigest = error as { digest: unknown };
        if (
          typeof errorWithDigest.digest === 'string' &&
          errorWithDigest.digest.startsWith('NEXT_REDIRECT')
        ) {
          throw error;
        }
      }

      lastError = error as Error;

      // Don't retry on client errors (except 408, 429)
      if (error instanceof NextApiClientError) {
        const status = error.status;
        if (
          status &&
          status >= 400 &&
          status < 500 &&
          status !== 408 &&
          status !== 429
        ) {
          break;
        }
      }

      // Wait before retry (exponential backoff)
      if (attempt < retry.attempts - 1) {
        await new Promise((resolve) =>
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
 *
 * Extracts error details from the response and creates a NextApiClientError
 * with proper classification and metadata.
 *
 * @param response - The failed HTTP response
 * @returns Promise resolving to a NextApiClientError
 */
export async function handleErrorResponse(
  response: Response
): Promise<NextApiClientError> {
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

  // Ensure we have a valid error object with safe defaults
  const errorMessage =
    (typeof details === 'object' && details !== null && 'message' in details)
      ? String((details as { message: string }).message || 'Unknown error')
      : String(response.statusText || `Request failed with status ${response.status || 'unknown'}`);

  const error: ApiErrorResponse = {
    message: errorMessage || 'Request failed',
    status: response.status || 500,
    code:
      typeof details === 'object' && details !== null && 'code' in details
        ? (details as { code: string }).code
        : undefined,
    details: details || null,
    traceId: response.headers?.get('x-trace-id') || undefined,
  };

  // Create and return the error with safety checks
  try {
    return new NextApiClientError(error);
  } catch (constructorError) {
    // If error construction fails, create a fallback error
    console.error('[Next API Client] Error constructing NextApiClientError:', constructorError);
    return new NextApiClientError({
      message: 'An unexpected error occurred while processing the response',
      status: response.status,
      details: null,
      traceId: response.headers.get('x-trace-id') || undefined,
    });
  }
}
