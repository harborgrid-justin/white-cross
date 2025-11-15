/**
 * @fileoverview HTTP Convenience Methods for Next.js API Client
 * @module lib/api/nextjs-client.methods
 * @category API Client
 *
 * This module provides convenient HTTP method wrappers (GET, POST, PUT, PATCH, DELETE)
 * built on top of the core fetch function with proper type safety.
 *
 * @version 1.0.0
 * @since 2025-11-12
 */

import { NextFetchOptions } from './types';
import { nextFetch } from './core';

// ==========================================
// HTTP CONVENIENCE METHODS
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
    ? '?' +
      new URLSearchParams(
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
 *
 * @example
 * ```typescript
 * const updatedStudent = await serverPut<Student>('/api/students/123',
 *   { name: 'Jane Doe', grade: '6' },
 *   {
 *     cache: 'no-store',
 *     next: { tags: ['students', 'student-123'] }
 *   }
 * );
 * ```
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
 *
 * @example
 * ```typescript
 * const patchedStudent = await serverPatch<Student>('/api/students/123',
 *   { grade: '7' },
 *   {
 *     cache: 'no-store',
 *     next: { tags: ['students', 'student-123'] }
 *   }
 * );
 * ```
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
 *
 * @example
 * ```typescript
 * await serverDelete<void>('/api/students/123', {
 *   cache: 'no-store',
 *   next: { tags: ['students', 'student-123'] }
 * });
 * ```
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
