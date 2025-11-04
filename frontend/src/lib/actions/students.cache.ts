/**
 * @fileoverview Student Cache Operations - Cached Read Actions
 * @module lib/actions/students.cache
 *
 * HIPAA-compliant cached read operations for student data with Next.js cache integration.
 *
 * Features:
 * - React cache() integration for automatic memoization
 * - Next.js cache tags and revalidation
 * - Paginated and filtered queries
 * - Search functionality
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type {
  Student,
  StudentFilters,
  PaginatedStudentsResponse,
} from '@/types/domain/student.types';
import type { ApiResponse } from '@/types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get student by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getStudent = cache(async (id: string): Promise<Student | null> => {
  try {
    // Backend wraps response in ApiResponse format
    const wrappedResponse = await serverGet<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${id}`, CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
        }
      }
    );

    // Extract the student from wrappedResponse.data
    return wrappedResponse?.data || null;
  } catch (error) {
    console.error('Failed to get student:', error);
    return null;
  }
});

/**
 * Get all students with caching
 * Uses shorter TTL for frequently updated data
 */
export const getStudents = cache(async (filters?: StudentFilters): Promise<Student[]> => {
  try {
    // Backend wraps response in ApiResponse format: { success, statusCode, message, data, meta }
    const wrappedResponse = await serverGet<ApiResponse<{ data: Student[] }>>(
      API_ENDPOINTS.STUDENTS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.STUDENTS, 'student-list', CACHE_TAGS.PHI]
        }
      }
    );

    // Extract the students array from wrappedResponse.data.data
    // Backend returns: { data: { data: Student[] } }
    const students = wrappedResponse?.data?.data || wrappedResponse?.data || [];
    return Array.isArray(students) ? students : [];
  } catch (error) {
    console.error('Failed to get students:', error);
    return [];
  }
});

/**
 * Search students with caching
 * Shorter TTL for search results
 */
export const searchStudents = cache(async (query: string, filters?: StudentFilters): Promise<Student[]> => {
  try {
    const searchParams = {
      q: query,
      ...filters
    };

    // Backend wraps response in ApiResponse format
    const wrappedResponse = await serverGet<ApiResponse<{ data: Student[] }>>(
      API_ENDPOINTS.STUDENTS.SEARCH,
      searchParams as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Shorter for search
          tags: ['student-search', CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
        }
      }
    );

    // Extract the students array from wrappedResponse.data.data
    const students = wrappedResponse?.data?.data || wrappedResponse?.data || [];
    return Array.isArray(students) ? students : [];
  } catch (error) {
    console.error('Failed to search students:', error);
    return [];
  }
});

/**
 * Get paginated students
 */
export const getPaginatedStudents = cache(async (
  page: number = 1,
  limit: number = 20,
  filters?: StudentFilters
): Promise<PaginatedStudentsResponse | null> => {
  try {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };

    // Backend wraps response in ApiResponse format
    const wrappedResponse = await serverGet<ApiResponse<PaginatedStudentsResponse>>(
      API_ENDPOINTS.STUDENTS.BASE,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.STUDENTS, 'student-list', CACHE_TAGS.PHI]
        }
      }
    );

    // Extract the pagination response from wrappedResponse.data
    return wrappedResponse?.data || null;
  } catch (error) {
    console.error('Failed to get paginated students:', error);
    return null;
  }
});

/**
 * Get student count
 */
export const getStudentCount = cache(async (filters?: StudentFilters): Promise<number> => {
  try {
    const students = await getStudents(filters);
    return students.length;
  } catch {
    return 0;
  }
});

/**
 * Get student statistics
 */
export const getStudentStatistics = cache(async (studentId: string) => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      API_ENDPOINTS.STUDENTS.BY_ID(studentId) + '/statistics',
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${studentId}`, CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get student statistics:', error);
    return null;
  }
});

/**
 * Export student data
 */
export const exportStudentData = cache(async (studentId: string) => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      API_ENDPOINTS.STUDENTS.EXPORT(studentId),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${studentId}`, CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to export student data:', error);
    return null;
  }
});
