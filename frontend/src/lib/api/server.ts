/**
 * @fileoverview Server-Side API Exports
 * @module lib/api/server
 * @category API Client
 *
 * Server-side API functions for use in Server Components and Server Actions only.
 * This module uses 'next/headers' and other server-only APIs that cannot be
 * imported in Client Components.
 *
 * **IMPORTANT**: Only import this in Server Components or Server Actions.
 * For Client Components, use '@/lib/api' (client.ts) instead.
 *
 * @example Server Component Usage
 * ```typescript
 * // In a Server Component (.tsx without 'use client')
 * import { serverGet } from '@/lib/api/server';
 *
 * export default async function StudentsPage() {
 *   const students = await serverGet<Student[]>('/api/students', {
 *     next: { revalidate: 60, tags: ['students'] }
 *   });
 *   return <StudentList students={students} />;
 * }
 * ```
 *
 * @example Server Action Usage
 * ```typescript
 * // In a Server Action
 * 'use server';
 * import { serverPost, serverDelete } from '@/lib/api/server';
 *
 * export async function createStudent(data: FormData) {
 *   return await serverPost('/api/students', data);
 * }
 * ```
 *
 * @version 1.0.0
 * @since 2025-11-04
 */

// Re-export Next.js server functions from nextjs-client
export {
  nextFetch,
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,
  buildCacheTags,
  buildResourceTag,
  NextApiClientError
} from './nextjs-client';

// Export Next.js server types
export type {
  NextFetchOptions,
  NextCacheConfig,
  CacheLifeConfig,
  ApiResponse as NextApiResponse
} from './nextjs-client';
