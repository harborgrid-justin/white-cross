/**
 * Core Student Query Types
 *
 * Type definitions for student query hooks including return types and error handling.
 *
 * @module hooks/students/types
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import type { UseInfiniteQueryResult } from '@tanstack/react-query';
import type { Student, PaginatedStudentsResponse } from '@/types/student.types';

/**
 * Define basic API error type
 */
export interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  response?: any;
}

/**
 * Define basic paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Define student profile type
 */
export interface StudentProfile extends Student {
  healthRecords?: any[];
  medications?: any[];
  incidents?: any[];
  emergencyContacts?: any[];
}

/**
 * Types for hook return values
 */
export interface UseStudentsReturn {
  /** Paginated student data */
  data: PaginatedStudentsResponse | undefined;
  /** Array of students for convenience */
  students: Student[];
  /** Pagination metadata */
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ApiError | null;
  /** Is fetching (including background refetch) */
  isFetching: boolean;
  /** Is initial load */
  isInitialLoading: boolean;
  /** Is stale (needs refetch) */
  isStale: boolean;
  /** Manual refetch function */
  refetch: () => void;
  /** Has data been fetched at least once */
  isSuccess: boolean;
  /** Query status */
  status: 'pending' | 'error' | 'success';
}

export interface UseStudentDetailReturn {
  /** Student data */
  student: Student | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ApiError | null;
  /** Is fetching */
  isFetching: boolean;
  /** Manual refetch function */
  refetch: () => void;
  /** Has data been fetched */
  isSuccess: boolean;
  /** Is stale */
  isStale: boolean;
  /** Query status */
  status: 'pending' | 'error' | 'success';
}

export interface UseStudentProfileReturn {
  /** Student profile with extended data */
  profile: StudentProfile | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ApiError | null;
  /** Is fetching */
  isFetching: boolean;
  /** Manual refetch function */
  refetch: () => void;
  /** Has data been fetched */
  isSuccess: boolean;
}

export interface UseInfiniteStudentsReturn {
  /** Infinite query data */
  data: UseInfiniteQueryResult<PaginatedStudentsResponse, ApiError>['data'];
  /** Flattened array of all students */
  students: Student[];
  /** Loading states */
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  /** Error state */
  error: ApiError | null;
  /** Pagination functions */
  fetchNextPage: () => void;
  hasNextPage: boolean;
  /** Manual refetch */
  refetch: () => void;
}
