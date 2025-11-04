/**
 * @fileoverview Communications Utilities - Next.js v14+ Compatible
 *
 * Shared utility functions for communications module server actions.
 */

'use server';

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api/nextjs-client';

// ============================================================================
// HELPER FUNCTION - Wrapper for server fetch to match old API contract
// ============================================================================

/**
 * Server-side fetch wrapper that matches the old fetchApi signature.
 * This maintains backward compatibility while using server-side auth.
 *
 * @template T - The expected response type
 * @param endpoint - API endpoint to call
 * @param options - Request options including method, body, params, headers
 * @returns Promise with success/error structure
 *
 * @example
 * ```ts
 * const result = await fetchApi<User>('/users/123', { method: 'GET' });
 * if (result.success) {
 *   console.log(result.data);
 * }
 * ```
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: {
    method?: string;
    body?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
  }
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const method = options?.method || 'GET';

    let response: T;

    if (method === 'GET') {
      // Convert params to query string format
      const params = options?.params
        ? Object.entries(options.params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        : undefined;

      response = await serverGet<T>(endpoint, params);
    } else if (method === 'POST') {
      response = await serverPost<T>(endpoint, options?.body);
    } else if (method === 'PUT') {
      response = await serverPut<T>(endpoint, options?.body);
    } else if (method === 'DELETE') {
      response = await serverDelete<T>(endpoint);
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error(`[Server Action] fetchApi error for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Request failed'
    };
  }
}
