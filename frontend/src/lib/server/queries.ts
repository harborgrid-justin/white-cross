/**
 * @fileoverview Server-Side Data Fetching Utilities for Next.js Server Components
 * @module lib/server/queries
 * @category Server
 *
 * Provides type-safe, reusable data fetching functions for Server Components.
 * Integrates with TanStack Query prefetching for optimal SSR performance.
 *
 * Features:
 * - Type-safe query builders
 * - Automatic error handling
 * - Request deduplication (React cache() API)
 * - Standardized cache TTLs (HIPAA-compliant)
 * - Cache tag management
 * - HIPAA-compliant (server-side only)
 *
 * **Request Deduplication:**
 * All fetch functions are wrapped with React's cache() API, which automatically
 * deduplicates requests for the same resource within a single render cycle.
 *
 * **Cache Strategy:**
 * - PHI data: 30-60s TTL (HIPAA compliant)
 * - Static data: 300s TTL (performance optimized)
 * - See /lib/cache/README.md for full strategy
 *
 * @example
 * ```typescript
 * // In Server Component
 * import { getStudent, prefetchStudentsList } from '@/lib/server/queries';
 *
 * export default async function StudentPage({ params }: { params: { id: string } }) {
 *   // Multiple components can call getStudent() with same ID
 *   // Only 1 HTTP request will be made (React cache deduplication)
 *   const student = await getStudent(params.id);
 *
 *   return <StudentProfile student={student} />;
 * }
 * ```
 *
 * @see /lib/cache/README.md for caching strategy documentation
 * @version 2.0.0 - Added React cache() and standardized TTLs
 * @since 2025-10-27
 */

import { cache } from 'react';
import { prefetchQuery } from '@/lib/react-query/serverQuery';
import { CACHE_TTL, CACHE_TAGS, buildResourceTag } from '@/lib/cache/constants';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Common query parameters
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================
// BASE FETCH UTILITY
// ==========================================

/**
 * Base fetch utility with standardized Next.js cache configuration
 *
 * @param url - API endpoint URL
 * @param revalidate - Cache TTL in seconds (from CACHE_TTL constants)
 * @param tags - Cache tags for granular invalidation
 * @param options - Additional fetch options
 * @returns Promise resolving to response data
 */
async function baseFetch<T>(
  url: string,
  revalidate: number,
  tags: string[],
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const fullUrl = `${baseUrl}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Next.js cache configuration with standardized TTL
      next: {
        revalidate, // Standardized cache TTL
        tags,       // Granular cache tags
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('[Server Query] Fetch failed:', url, error);
    throw error;
  }
}

// ==========================================
// STUDENTS QUERIES
// ==========================================

/**
 * Fetch students list (server-side)
 *
 * **Cache Strategy**: PHI_STANDARD (60s)
 * **Deduplication**: React cache() - multiple calls in same render return cached result
 * **Tags**: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 */
export const getStudentsList = cache(async (params?: QueryParams): Promise<PaginatedResponse<any>> => {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(
    `/students?${searchParams.toString()}`,
    CACHE_TTL.PHI_STANDARD, // 60s
    [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
  );
});

/**
 * Fetch single student (server-side)
 *
 * **Cache Strategy**: PHI_STANDARD (60s)
 * **Deduplication**: React cache() - multiple components requesting same student get deduplicated
 * **Tags**: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI, 'student-{id}']
 */
export const getStudent = cache(async (id: string): Promise<any> => {
  return baseFetch(
    `/students/${id}`,
    CACHE_TTL.PHI_STANDARD, // 60s
    [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI, buildResourceTag('student', id)]
  );
});

/**
 * Prefetch students list for TanStack Query
 */
export async function prefetchStudentsList(params?: QueryParams): Promise<void> {
  await prefetchQuery(
    ['students', 'list', params],
    () => getStudentsList(params),
    {
      staleTime: CACHE_TTL.PHI_STANDARD * 1000, // Align with server cache
      meta: { containsPHI: true }, // Student data is PHI
    }
  );
}

/**
 * Prefetch single student for TanStack Query
 */
export async function prefetchStudent(id: string): Promise<void> {
  await prefetchQuery(
    ['students', id],
    () => getStudent(id),
    {
      staleTime: CACHE_TTL.PHI_STANDARD * 1000, // Align with server cache
      meta: { containsPHI: true }, // Single student has PHI
    }
  );
}

// Backward compatibility aliases
export const fetchStudentsList = getStudentsList;
export const fetchStudent = getStudent;

// ==========================================
// MEDICATIONS QUERIES
// ==========================================

/**
 * Fetch medications list (server-side)
 *
 * **Cache Strategy**: PHI_FREQUENT (30s) - frequently accessed, time-sensitive
 * **Deduplication**: React cache()
 * **Tags**: [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
 */
export const getMedicationsList = cache(async (params?: QueryParams): Promise<PaginatedResponse<any>> => {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(
    `/medications?${searchParams.toString()}`,
    CACHE_TTL.PHI_FREQUENT, // 30s - frequently accessed
    [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
  );
});

/**
 * Fetch single medication (server-side)
 *
 * **Cache Strategy**: PHI_FREQUENT (30s)
 * **Deduplication**: React cache()
 * **Tags**: [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI, 'medication-{id}']
 */
export const getMedication = cache(async (id: string): Promise<any> => {
  return baseFetch(
    `/medications/${id}`,
    CACHE_TTL.PHI_FREQUENT, // 30s
    [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI, buildResourceTag('medication', id)]
  );
});

/**
 * Prefetch medications list for TanStack Query
 */
export async function prefetchMedicationsList(params?: QueryParams): Promise<void> {
  await prefetchQuery(
    ['medications', 'list', params],
    () => getMedicationsList(params),
    {
      staleTime: CACHE_TTL.PHI_FREQUENT * 1000, // Align with server cache
      meta: { containsPHI: true }, // Medication data is PHI
    }
  );
}

/**
 * Prefetch single medication for TanStack Query
 */
export async function prefetchMedication(id: string): Promise<void> {
  await prefetchQuery(
    ['medications', id],
    () => getMedication(id),
    {
      staleTime: CACHE_TTL.PHI_FREQUENT * 1000, // Align with server cache
      meta: { containsPHI: true },
    }
  );
}

// Backward compatibility aliases
export const fetchMedicationsList = getMedicationsList;
export const fetchMedication = getMedication;

// ==========================================
// APPOINTMENTS QUERIES
// ==========================================

/**
 * Fetch appointments list (server-side)
 *
 * **Cache Strategy**: PHI_FREQUENT (30s) - appointments change frequently
 * **Deduplication**: React cache()
 * **Tags**: [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI]
 */
export const getAppointmentsList = cache(async (params?: QueryParams & { date?: string; nurseId?: string }): Promise<PaginatedResponse<any>> => {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(
    `/appointments?${searchParams.toString()}`,
    CACHE_TTL.PHI_FREQUENT, // 30s - frequently changing
    [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI]
  );
});

/**
 * Fetch single appointment (server-side)
 *
 * **Cache Strategy**: PHI_FREQUENT (30s)
 * **Deduplication**: React cache()
 * **Tags**: [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI, 'appointment-{id}']
 */
export const getAppointment = cache(async (id: string): Promise<any> => {
  return baseFetch(
    `/appointments/${id}`,
    CACHE_TTL.PHI_FREQUENT, // 30s
    [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI, buildResourceTag('appointment', id)]
  );
});

/**
 * Prefetch appointments list for TanStack Query
 */
export async function prefetchAppointmentsList(params?: QueryParams & { date?: string; nurseId?: string }): Promise<void> {
  await prefetchQuery(
    ['appointments', 'list', params],
    () => getAppointmentsList(params),
    {
      staleTime: CACHE_TTL.PHI_FREQUENT * 1000, // Align with server cache
      meta: { containsPHI: true }, // Appointments contain PHI
    }
  );
}

/**
 * Prefetch single appointment for TanStack Query
 */
export async function prefetchAppointment(id: string): Promise<void> {
  await prefetchQuery(
    ['appointments', id],
    () => getAppointment(id),
    {
      staleTime: CACHE_TTL.PHI_FREQUENT * 1000, // Align with server cache
      meta: { containsPHI: true },
    }
  );
}

// Backward compatibility aliases
export const fetchAppointmentsList = getAppointmentsList;
export const fetchAppointment = getAppointment;

// ==========================================
// INCIDENTS QUERIES
// ==========================================

/**
 * Fetch incident reports list (server-side)
 *
 * **Cache Strategy**: PHI_STANDARD (60s)
 * **Deduplication**: React cache()
 * **Tags**: [CACHE_TAGS.INCIDENTS, CACHE_TAGS.PHI]
 */
export const getIncidentsList = cache(async (params?: QueryParams): Promise<PaginatedResponse<any>> => {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(
    `/incidents?${searchParams.toString()}`,
    CACHE_TTL.PHI_STANDARD, // 60s
    [CACHE_TAGS.INCIDENTS, CACHE_TAGS.PHI]
  );
});

/**
 * Prefetch incidents list for TanStack Query
 */
export async function prefetchIncidentsList(params?: QueryParams): Promise<void> {
  await prefetchQuery(
    ['incidents', 'list', params],
    () => getIncidentsList(params),
    {
      staleTime: CACHE_TTL.PHI_STANDARD * 1000, // Align with server cache
      meta: { containsPHI: true }, // Incident data may contain PHI
    }
  );
}

// Backward compatibility alias
export const fetchIncidentsList = getIncidentsList;

// ==========================================
// DASHBOARD QUERIES
// ==========================================

/**
 * Fetch dashboard statistics (server-side)
 *
 * **Cache Strategy**: STATS (120s) - aggregated, non-PHI data
 * **Deduplication**: React cache()
 * **Tags**: [CACHE_TAGS.STATS]
 */
export const getDashboardStats = cache(async (): Promise<any> => {
  return baseFetch(
    '/dashboard/stats',
    CACHE_TTL.STATS, // 120s - aggregated stats
    [CACHE_TAGS.STATS]
  );
});

/**
 * Prefetch dashboard statistics for TanStack Query
 */
export async function prefetchDashboardStats(): Promise<void> {
  await prefetchQuery(
    ['dashboard', 'stats'],
    getDashboardStats,
    {
      staleTime: CACHE_TTL.STATS * 1000, // Align with server cache
      meta: { containsPHI: false }, // Aggregated stats safe
    }
  );
}

// Backward compatibility alias
export const fetchDashboardStats = getDashboardStats;

// ==========================================
// USERS QUERIES
// ==========================================

/**
 * Fetch users list (server-side)
 *
 * **Cache Strategy**: STATIC (300s) - users change infrequently
 * **Deduplication**: React cache()
 * **Tags**: [CACHE_TAGS.USERS]
 */
export const getUsersList = cache(async (params?: QueryParams): Promise<PaginatedResponse<any>> => {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(
    `/users?${searchParams.toString()}`,
    CACHE_TTL.STATIC, // 300s - users change infrequently
    [CACHE_TAGS.USERS]
  );
});

/**
 * Fetch current user (server-side)
 *
 * **Cache Strategy**: SESSION (300s) - user profile stable during session
 * **Deduplication**: React cache()
 * **Tags**: [CACHE_TAGS.USERS]
 */
export const getCurrentUser = cache(async (): Promise<any> => {
  return baseFetch(
    '/auth/me',
    CACHE_TTL.SESSION, // 300s
    [CACHE_TAGS.USERS]
  );
});

/**
 * Prefetch users list for TanStack Query
 */
export async function prefetchUsersList(params?: QueryParams): Promise<void> {
  await prefetchQuery(
    ['users', 'list', params],
    () => getUsersList(params),
    {
      staleTime: CACHE_TTL.STATIC * 1000, // Align with server cache
      meta: { containsPHI: false },
    }
  );
}

/**
 * Prefetch current user for TanStack Query
 */
export async function prefetchCurrentUser(): Promise<void> {
  await prefetchQuery(
    ['users', 'me'],
    getCurrentUser,
    {
      staleTime: CACHE_TTL.SESSION * 1000, // Align with server cache
      meta: { containsPHI: false },
    }
  );
}

// Backward compatibility aliases
export const fetchUsersList = getUsersList;
export const fetchCurrentUser = getCurrentUser;

// ==========================================
// COMPOSITE PREFETCH UTILITIES
// ==========================================

/**
 * Prefetch all data for dashboard page
 *
 * Parallel prefetch for optimal performance.
 * Each function uses React cache() for automatic deduplication.
 */
export async function prefetchDashboardPage(): Promise<void> {
  await Promise.all([
    prefetchDashboardStats(),
    prefetchCurrentUser(),
  ]);
}

/**
 * Prefetch all data for students page
 */
export async function prefetchStudentsPage(params?: QueryParams): Promise<void> {
  await Promise.all([
    prefetchStudentsList(params),
    prefetchCurrentUser(),
  ]);
}

/**
 * Prefetch all data for medications page
 */
export async function prefetchMedicationsPage(params?: QueryParams): Promise<void> {
  await Promise.all([
    prefetchMedicationsList(params),
    prefetchCurrentUser(),
  ]);
}

/**
 * Prefetch all data for appointments page
 */
export async function prefetchAppointmentsPage(params?: QueryParams & { date?: string }): Promise<void> {
  await Promise.all([
    prefetchAppointmentsList(params),
    prefetchCurrentUser(),
  ]);
}

// ==========================================
// EXPORTS
// ==========================================

export default {
  // Students (new cache() API)
  getStudent,
  getStudentsList,
  prefetchStudent,
  prefetchStudentsList,

  // Medications (new cache() API)
  getMedication,
  getMedicationsList,
  prefetchMedication,
  prefetchMedicationsList,

  // Appointments (new cache() API)
  getAppointment,
  getAppointmentsList,
  prefetchAppointment,
  prefetchAppointmentsList,

  // Incidents (new cache() API)
  getIncidentsList,
  prefetchIncidentsList,

  // Dashboard (new cache() API)
  getDashboardStats,
  prefetchDashboardStats,

  // Users (new cache() API)
  getUsersList,
  getCurrentUser,
  prefetchUsersList,
  prefetchCurrentUser,

  // Backward compatibility aliases
  fetchStudent,
  fetchStudentsList,
  fetchMedication,
  fetchMedicationsList,
  fetchAppointment,
  fetchAppointmentsList,
  fetchIncidentsList,
  fetchDashboardStats,
  fetchUsersList,
  fetchCurrentUser,

  // Composite
  prefetchDashboardPage,
  prefetchStudentsPage,
  prefetchMedicationsPage,
  prefetchAppointmentsPage,
};
