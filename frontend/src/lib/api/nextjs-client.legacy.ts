/**
 * @fileoverview Legacy Client Support for Next.js API Client
 * @module lib/api/nextjs-client.legacy
 * @category API Client
 *
 * This module provides backward compatibility with the simple API client
 * that was previously available. New code should use the Next.js-specific
 * methods (serverGet, serverPost, etc.) instead.
 *
 * @deprecated This module is for legacy support only. For new development:
 * - Use serverGet() for GET requests
 * - Use serverPost() for POST requests
 * - Use serverPut() for PUT requests
 * - Use serverPatch() for PATCH requests
 * - Use serverDelete() for DELETE requests
 *
 * @version 1.0.0
 * @since 2025-11-12
 */

import { ApiClientOptions } from './server/types';

/**
 * Get API base URL for client-side usage (safe for client components)
 * 
 * Only uses public environment variables that are available on the client.
 * For server-side usage with server-only environment variables,
 * use getApiBaseUrl from './server/config' instead.
 * 
 * @returns The API base URL for client-side requests
 */
function getClientApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'
  );
}

// ==========================================
// LEGACY CLIENT SUPPORT
// ==========================================

/**
 * Simple API client for basic HTTP requests (legacy support)
 *
 * This is a legacy client merged from client.ts. For new development,
 * prefer the Next.js-specific methods which provide better caching,
 * authentication, and error handling.
 *
 * @deprecated Use serverGet/serverPost/serverPut/serverPatch/serverDelete instead
 *
 * @param endpoint - API endpoint (relative or absolute URL)
 * @param options - Basic request options
 * @returns Promise resolving to parsed JSON response
 *
 * @throws {Error} On request failure
 *
 * @example
 * ```typescript
 * // Legacy usage (consider migrating to serverGet/serverPost)
 * const data = await apiClient('/api/users', {
 *   method: 'POST',
 *   body: { name: 'John' }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Preferred modern approach:
 * import { serverPost } from '@/lib/api/nextjs-client';
 *
 * const data = await serverPost<User>('/api/users',
 *   { name: 'John' },
 *   {
 *     cache: 'no-store',
 *     next: { tags: ['users'] }
 *   }
 * );
 * ```
 */
export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<unknown> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${getClientApiBaseUrl()}${endpoint}`;

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Alias for apiClient (legacy support)
 *
 * @deprecated Use apiClient directly or migrate to Next.js-specific methods
 *
 * @param endpoint - API endpoint
 * @param options - Basic request options
 * @returns Promise resolving to parsed JSON response
 */
export const fetchApi = apiClient;
