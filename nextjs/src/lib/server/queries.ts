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
 * - Request deduplication
 * - Cache header management
 * - HIPAA-compliant (server-side only)
 *
 * @example
 * ```typescript
 * // In Server Component
 * import { fetchStudentsList, prefetchStudentsList } from '@/lib/server/queries';
 *
 * export default async function StudentsPage() {
 *   // Option 1: Direct fetch
 *   const students = await fetchStudentsList({ page: 1 });
 *
 *   // Option 2: Prefetch for TanStack Query
 *   await prefetchStudentsList({ page: 1 });
 *
 *   return <StudentsTable />;
 * }
 * ```
 */

import { prefetchQuery } from '@/lib/react-query/serverQuery';

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
 * Base fetch utility with Next.js cache configuration
 *
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise resolving to response data
 */
async function baseFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const fullUrl = `${baseUrl}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Next.js cache configuration
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        tags: [url.split('?')[0]], // Cache tag for invalidation
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
 */
export async function fetchStudentsList(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(`/api/v1/students?${searchParams.toString()}`);
}

/**
 * Prefetch students list for TanStack Query
 */
export async function prefetchStudentsList(params?: QueryParams): Promise<void> {
  await prefetchQuery(
    ['students', 'list', params],
    () => fetchStudentsList(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      meta: { containsPHI: false }, // List view safe for SSR
    }
  );
}

/**
 * Fetch single student (server-side)
 */
export async function fetchStudent(id: string): Promise<any> {
  return baseFetch(`/api/v1/students/${id}`);
}

/**
 * Prefetch single student for TanStack Query
 */
export async function prefetchStudent(id: string): Promise<void> {
  await prefetchQuery(
    ['students', id],
    () => fetchStudent(id),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      meta: { containsPHI: true }, // Single student has PHI
    }
  );
}

// ==========================================
// MEDICATIONS QUERIES
// ==========================================

/**
 * Fetch medications list (server-side)
 */
export async function fetchMedicationsList(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(`/api/v1/medications?${searchParams.toString()}`);
}

/**
 * Prefetch medications list for TanStack Query
 */
export async function prefetchMedicationsList(params?: QueryParams): Promise<void> {
  await prefetchQuery(
    ['medications', 'list', params],
    () => fetchMedicationsList(params),
    {
      staleTime: 5 * 60 * 1000,
      meta: { containsPHI: true }, // Medication data is PHI
    }
  );
}

/**
 * Fetch single medication (server-side)
 */
export async function fetchMedication(id: string): Promise<any> {
  return baseFetch(`/api/v1/medications/${id}`);
}

/**
 * Prefetch single medication for TanStack Query
 */
export async function prefetchMedication(id: string): Promise<void> {
  await prefetchQuery(
    ['medications', id],
    () => fetchMedication(id),
    {
      staleTime: 2 * 60 * 1000,
      meta: { containsPHI: true },
    }
  );
}

// ==========================================
// APPOINTMENTS QUERIES
// ==========================================

/**
 * Fetch appointments list (server-side)
 */
export async function fetchAppointmentsList(params?: QueryParams & { date?: string; nurseId?: string }): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(`/api/v1/appointments?${searchParams.toString()}`);
}

/**
 * Prefetch appointments list for TanStack Query
 */
export async function prefetchAppointmentsList(params?: QueryParams & { date?: string; nurseId?: string }): Promise<void> {
  await prefetchQuery(
    ['appointments', 'list', params],
    () => fetchAppointmentsList(params),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes (appointments change frequently)
      meta: { containsPHI: false }, // List view safe
    }
  );
}

/**
 * Fetch single appointment (server-side)
 */
export async function fetchAppointment(id: string): Promise<any> {
  return baseFetch(`/api/v1/appointments/${id}`);
}

/**
 * Prefetch single appointment for TanStack Query
 */
export async function prefetchAppointment(id: string): Promise<void> {
  await prefetchQuery(
    ['appointments', id],
    () => fetchAppointment(id),
    {
      staleTime: 2 * 60 * 1000,
      meta: { containsPHI: true },
    }
  );
}

// ==========================================
// INCIDENTS QUERIES
// ==========================================

/**
 * Fetch incident reports list (server-side)
 */
export async function fetchIncidentsList(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(`/api/v1/incidents?${searchParams.toString()}`);
}

/**
 * Prefetch incidents list for TanStack Query
 */
export async function prefetchIncidentsList(params?: QueryParams): Promise<void> {
  await prefetchQuery(
    ['incidents', 'list', params],
    () => fetchIncidentsList(params),
    {
      staleTime: 5 * 60 * 1000,
      meta: { containsPHI: true }, // Incident data may contain PHI
    }
  );
}

// ==========================================
// DASHBOARD QUERIES
// ==========================================

/**
 * Fetch dashboard statistics (server-side)
 */
export async function fetchDashboardStats(): Promise<any> {
  return baseFetch('/api/v1/dashboard/stats');
}

/**
 * Prefetch dashboard statistics for TanStack Query
 */
export async function prefetchDashboardStats(): Promise<void> {
  await prefetchQuery(
    ['dashboard', 'stats'],
    fetchDashboardStats,
    {
      staleTime: 1 * 60 * 1000, // 1 minute
      meta: { containsPHI: false }, // Aggregated stats safe
    }
  );
}

// ==========================================
// USERS QUERIES
// ==========================================

/**
 * Fetch users list (server-side)
 */
export async function fetchUsersList(params?: QueryParams): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams(params as any);
  return baseFetch(`/api/v1/users?${searchParams.toString()}`);
}

/**
 * Prefetch users list for TanStack Query
 */
export async function prefetchUsersList(params?: QueryParams): Promise<void> {
  await prefetchQuery(
    ['users', 'list', params],
    () => fetchUsersList(params),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes (users change infrequently)
      meta: { containsPHI: false },
    }
  );
}

/**
 * Fetch current user (server-side)
 */
export async function fetchCurrentUser(): Promise<any> {
  return baseFetch('/api/v1/auth/me');
}

/**
 * Prefetch current user for TanStack Query
 */
export async function prefetchCurrentUser(): Promise<void> {
  await prefetchQuery(
    ['users', 'me'],
    fetchCurrentUser,
    {
      staleTime: 5 * 60 * 1000,
      meta: { containsPHI: false },
    }
  );
}

// ==========================================
// COMPOSITE PREFETCH UTILITIES
// ==========================================

/**
 * Prefetch all data for dashboard page
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

export default {
  // Students
  fetchStudentsList,
  prefetchStudentsList,
  fetchStudent,
  prefetchStudent,

  // Medications
  fetchMedicationsList,
  prefetchMedicationsList,
  fetchMedication,
  prefetchMedication,

  // Appointments
  fetchAppointmentsList,
  prefetchAppointmentsList,
  fetchAppointment,
  prefetchAppointment,

  // Incidents
  fetchIncidentsList,
  prefetchIncidentsList,

  // Dashboard
  fetchDashboardStats,
  prefetchDashboardStats,

  // Users
  fetchUsersList,
  prefetchUsersList,
  fetchCurrentUser,
  prefetchCurrentUser,

  // Composite
  prefetchDashboardPage,
  prefetchStudentsPage,
  prefetchMedicationsPage,
  prefetchAppointmentsPage,
};
