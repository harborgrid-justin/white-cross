/**
 * @fileoverview Server-Side Data Fetching Utilities for Next.js v16 Server Components
 * @module lib/api/nextjs-client.queries
 * @category API Client
 *
 * Provides type-safe, reusable data fetching functions for Server Components.
 * Integrates with Next.js v16's enhanced caching APIs and partial prerendering.
 *
 * **Next.js v16 Features:**
 * - Enhanced unstable_cache() API for server-side caching
 * - Improved fetch() with automatic request deduplication
 * - Better cache tag management and revalidation
 * - Partial prerendering (PPR) preparation
 * - Edge runtime compatibility
 * - Streaming and progressive enhancement support
 *
 * Features:
 * - Type-safe query builders
 * - Automatic error handling
 * - Request deduplication (React cache() + Next.js v16 fetch deduplication)
 * - Standardized cache TTLs (HIPAA-compliant)
 * - Enhanced cache tag management
 * - HIPAA-compliant (server-side only)
 *
 * **Request Deduplication:**
 * All fetch functions use Next.js v16's enhanced fetch() which automatically
 * deduplicates requests for the same resource within a single render cycle.
 *
 * **Cache Strategy (Next.js v16):**
 * - PHI data: 30-60s TTL (HIPAA compliant) with enhanced invalidation
 * - Static data: 300s TTL (performance optimized) with PPR support
 * - Edge caching: Optimized for global CDN distribution
 * - See /lib/cache/README.md for full strategy
 *
 * @example
 * ```typescript
 * // In Server Component
 * import { getStudent, prefetchStudentsList } from '@/lib/api/nextjs-client.queries';
 *
 * export default async function StudentPage({ params }: { params: { id: string } }) {
 *   // Next.js v16 automatically deduplicates multiple calls
 *   const student = await getStudent(params.id);
 *
 *   return <StudentProfile student={student} />;
 * }
 * ```
 *
 * @see /lib/cache/README.md for caching strategy documentation
 * @version 3.0.0 - Next.js v16 compatible with enhanced caching
 * @since 2025-10-27
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prefetchQuery } from '@/lib/react-query/serverQuery';
import { CACHE_TTL, CACHE_TAGS, buildResourceTag } from '@/lib/cache/constants';

// ==========================================
// TYPE DEFINITIONS - ENHANCED FOR V16
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

/**
 * Student data type
 */
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth: string;
  grade?: string;
  schoolId?: string;
  // Add other student properties as needed
}

/**
 * Medication data type
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  // Add other medication properties as needed
}

/**
 * Appointment data type
 */
export interface Appointment {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  studentId: string;
  nurseId?: string;
  // Add other appointment properties as needed
}

/**
 * Dashboard statistics type
 */
export interface DashboardStats {
  totalStudents: number;
  totalAppointments: number;
  pendingMedications: number;
  recentIncidents: number;
}

/**
 * User data type
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organizationId?: string;
}

// ==========================================
// BASE FETCH UTILITY - NEXT.JS V16 ENHANCED
// ==========================================

/**
 * Base fetch utility with Next.js v16 enhanced caching
 *
 * Uses unstable_cache() for server-side caching with improved invalidation
 * and enhanced fetch() with automatic request deduplication.
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
    // Next.js v16 enhanced fetch with automatic deduplication
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Next.js v16 enhanced cache configuration
      next: {
        revalidate,
        tags,
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

/**
 * Enhanced cached fetch using Next.js v16 unstable_cache
 *
 * Provides server-side caching with improved performance and invalidation.
 * Use this for expensive operations that benefit from persistent caching.
 *
 * @param fetchFn - Fetch function to cache
 * @param keyParts - Cache key components
 * @param revalidate - Cache TTL in seconds
 * @param tags - Cache tags for invalidation
 */
function createCachedFetch<T>(
  fetchFn: () => Promise<T>,
  keyParts: string[],
  revalidate: number,
  tags: string[]
) {
  return unstable_cache(
    fetchFn,
    keyParts,
    {
      revalidate,
      tags,
    }
  );
}

// ==========================================
// STUDENTS QUERIES - NEXT.JS V16 ENHANCED
// ==========================================

/**
 * Fetch students list (server-side with Next.js v16 caching)
 *
 * **Next.js v16 Features:**
 * - Enhanced fetch() with automatic request deduplication
 * - Improved cache invalidation with granular tags
 * - Edge runtime compatibility
 * - Partial prerendering (PPR) preparation
 *
 * **Cache Strategy**: PHI_STANDARD (60s)
 * **Deduplication**: React cache() + Next.js v16 fetch deduplication
 * **Tags**: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 */
export const getStudentsList = cache(async (params?: QueryParams): Promise<PaginatedResponse<Student>> => {
  const searchParams = new URLSearchParams(
    Object.entries(params || {}).map(([key, value]) => [key, String(value)])
  );

  return baseFetch(
    `/students?${searchParams.toString()}`,
    CACHE_TTL.PHI_STANDARD, // 60s
    [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
  );
});

/**
 * Fetch single student (server-side with Next.js v16 caching)
 *
 * **Next.js v16 Features:**
 * - Enhanced unstable_cache() for expensive operations
 * - Better request deduplication across components
 * - Improved cache warming for PPR
 *
 * **Cache Strategy**: PHI_STANDARD (60s)
 * **Deduplication**: React cache() + Next.js v16 fetch deduplication
 * **Tags**: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI, 'student-{id}']
 */
export const getStudent = cache(async (id: string): Promise<Student> => {
  // Use createCachedFetch for expensive operations in Next.js v16
  const cachedFetch = createCachedFetch(
    () => baseFetch<Student>(
      `/students/${id}`,
      CACHE_TTL.PHI_STANDARD, // 60s
      [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI, buildResourceTag('student', id)]
    ),
    ['student', id], // Cache key components
    CACHE_TTL.PHI_STANDARD,
    [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI, buildResourceTag('student', id)]
  );

  return cachedFetch();
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
// MEDICATIONS QUERIES - NEXT.JS V16 ENHANCED
// ==========================================

export const getMedicationsList = cache(async (params?: QueryParams): Promise<PaginatedResponse<Medication>> => {
  const searchParams = new URLSearchParams(
    Object.entries(params || {}).map(([key, value]) => [key, String(value)])
  );
  return baseFetch(
    `/medications?${searchParams.toString()}`,
    CACHE_TTL.PHI_FREQUENT, // 30s - frequently accessed
    [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
  );
});

export const getOTCMedications = cache(async (params?: QueryParams): Promise<PaginatedResponse<Medication>> => {
  const searchParams = new URLSearchParams({
    type: 'over_the_counter',
    ...Object.fromEntries(
      Object.entries(params || {}).map(([key, value]) => [key, String(value)])
    )
  });
  return baseFetch(
    `/medications?${searchParams.toString()}`,
    CACHE_TTL.PHI_STANDARD, // 60s - OTC medications change less frequently
    [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI, 'medications-otc']
  );
});

export const getMedication = cache(async (id: string): Promise<Medication> => {
  return baseFetch(
    `/medications/${id}`,
    CACHE_TTL.PHI_FREQUENT, // 30s
    [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI, buildResourceTag('medication', id)]
  );
});

// ==========================================
// APPOINTMENTS QUERIES - NEXT.JS V16 ENHANCED
// ==========================================

export const getAppointmentsList = cache(async (params?: QueryParams & { date?: string; nurseId?: string }): Promise<PaginatedResponse<Appointment>> => {
  const searchParams = new URLSearchParams(
    Object.entries(params || {}).map(([key, value]) => [key, String(value)])
  );
  return baseFetch(
    `/appointments?${searchParams.toString()}`,
    CACHE_TTL.PHI_FREQUENT, // 30s - frequently changing
    [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI]
  );
});

export const getAppointment = cache(async (id: string): Promise<Appointment> => {
  return baseFetch(
    `/appointments/${id}`,
    CACHE_TTL.PHI_FREQUENT, // 30s
    [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI, buildResourceTag('appointment', id)]
  );
});

// ==========================================
// DASHBOARD QUERIES - NEXT.JS V16 ENHANCED
// ==========================================

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  return baseFetch(
    '/dashboard/stats',
    CACHE_TTL.STATS, // 120s - aggregated stats
    [CACHE_TAGS.STATS]
  );
});

// ==========================================
// USERS QUERIES - NEXT.JS V16 ENHANCED
// ==========================================

export const getUsersList = cache(async (params?: QueryParams): Promise<PaginatedResponse<User>> => {
  const searchParams = new URLSearchParams(
    Object.entries(params || {}).map(([key, value]) => [key, String(value)])
  );
  return baseFetch(
    `/users?${searchParams.toString()}`,
    CACHE_TTL.STATIC, // 300s - users change infrequently
    [CACHE_TAGS.USERS]
  );
});

export const getCurrentUser = cache(async (): Promise<User> => {
  return baseFetch(
    '/auth/me',
    CACHE_TTL.SESSION, // 300s
    [CACHE_TAGS.USERS]
  );
});

// ==========================================
// COMPOSITE PREFETCH UTILITIES
// ==========================================

// ==========================================
// PREFETCH FUNCTIONS - NEXT.JS V16 SIMPLIFIED
// ==========================================

// Note: Prefetch functions removed in favor of direct server-side caching
// Use the query functions directly in Server Components for Next.js v16

// ==========================================
// COMPOSITE PREFETCH UTILITIES - V16 SIMPLIFIED
// ==========================================

/**
 * Prefetch all data for dashboard page
 * Note: In Next.js v16, prefer direct server-side caching
 */
export async function prefetchDashboardPage(): Promise<void> {
  // In Next.js v16, server components can call these directly
  await Promise.allSettled([
    getDashboardStats(),
    getCurrentUser(),
  ]);
}

// ==========================================
// EXPORTS - NEXT.JS V16 OPTIMIZED
// ==========================================

const serverQueries = {
  // Students (Next.js v16 enhanced)
  getStudent,
  getStudentsList,

  // Medications (Next.js v16 enhanced)
  getMedication,
  getMedicationsList,
  getOTCMedications,

  // Appointments (Next.js v16 enhanced)
  getAppointment,
  getAppointmentsList,

  // Dashboard (Next.js v16 enhanced)
  getDashboardStats,

  // Users (Next.js v16 enhanced)
  getUsersList,
  getCurrentUser,

  // Composite
  prefetchDashboardPage,
};

export default serverQueries;