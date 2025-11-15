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

// ==========================================
// CORE SERVER EXPORTS (from server/ directory)
// ==========================================

// Re-export all server-side utilities from the server barrel modules
export {
  // Types
  NextApiClientError,
  type ApiClientOptions,
  type NextCacheConfig,
  type CacheLifeConfig,
  type NextFetchOptions,
  type ApiResponse,
  type ApiErrorResponse,
} from './server/types';

export {
  // Configuration
  getApiBaseUrl,
  getAuthToken,
  getCsrfToken,
  generateRequestId,
} from './server/config';

export {
  // Core functionality
  nextFetch,
  handleErrorResponse,
} from './server/core';

export {
  // HTTP Methods
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,
} from './server/methods';

export {
  // Utilities
  buildCacheTags,
  buildResourceTag,
} from './server/utils';

// Alias for backwards compatibility
export type { ApiResponse as NextApiResponse } from './server/types';

// ==========================================
// SERVER QUERIES (from client/ directory)
// ==========================================
// Note: Despite being in client/, these are Server Component queries
// The directory structure is being reorganized

export {
  // Query functions
  getStudent,
  getStudentsList,
  getMedication,
  getMedicationsList,
  getAppointment,
  getAppointmentsList,
  getDashboardStats,
  getUsersList,
  getCurrentUser,

  // Query Types
  type QueryParams,
  type PaginatedResponse,
  type Student,
  type Medication,
  type Appointment,
  type DashboardStats,
  type User,
} from './client/queries';

// ==========================================
// CACHE ACTIONS (from client/ directory)
// ==========================================
// Server Actions that can be called from client components

export {
  invalidateAppointmentsCacheAction,
  invalidateAppointmentCacheAction,
  invalidateStudentCacheAction,
  invalidatePageCacheAction,
  emergencyCacheClearAction,
} from './client/cache-actions';
