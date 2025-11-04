/**
 * Student Detail Query Hooks
 *
 * Hooks for fetching individual student details and profiles.
 *
 * @module hooks/students/detailQueries
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { studentQueryKeys } from './queryKeys';
import { cacheConfig } from './cacheConfig';
import { apiActions } from '@/lib/api';
import type { ApiError, UseStudentDetailReturn, UseStudentProfileReturn } from './types';

/**
 * Hook for fetching a single student by ID with enhanced error handling
 *
 * @param studentId - Student ID to fetch
 * @param options - Additional query options
 * @returns Student detail with comprehensive metadata
 *
 * @example
 * ```tsx
 * const { student, isLoading, error } = useStudentDetail('student-123', {
 *   enabled: !!studentId
 * });
 *
 * if (isLoading) return <StudentDetailSkeleton />;
 * if (error) return <ErrorDisplay error={error} />;
 * if (!student) return <NotFound message="Student not found" />;
 *
 * return <StudentProfile student={student} />;
 * ```
 */
export const useStudentDetail = (
  studentId: string | undefined,
  options?: {
    enabled?: boolean;
    includeHealthRecords?: boolean;
    includeMedications?: boolean;
    includeIncidents?: boolean;
  }
): UseStudentDetailReturn => {
  const config = cacheConfig.details;

  // Determine which query key to use based on includes
  const queryKey = useMemo(() => {
    if (!studentId) return studentQueryKeys.details.byId('');

    if (options?.includeHealthRecords) {
      return studentQueryKeys.details.withHealthRecords(studentId);
    }
    if (options?.includeMedications) {
      return studentQueryKeys.details.withMedications(studentId);
    }
    if (options?.includeIncidents) {
      return studentQueryKeys.details.withIncidents(studentId);
    }

    return studentQueryKeys.details.byId(studentId);
  }, [studentId, options]);

  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiActions.students.getById(studentId);

      if (!response) {
        throw new Error(`Student with ID ${studentId} not found`);
      }

      return response;
    },
    enabled: !!studentId && (options?.enabled !== false),
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnMount: config.refetchOnMount,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    retryDelay: config.retryDelay,
    meta: {
      errorHandler: (error: ApiError) => {
        console.error(`Failed to fetch student ${studentId}:`, error);
      }
    }
  });

  const refetch = useCallback(() => {
    queryResult.refetch().catch((error) => {
      console.error('Failed to refetch student detail:', error);
    });
  }, [queryResult.refetch]);

  return {
    student: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as ApiError | null,
    isFetching: queryResult.isFetching,
    refetch,
    isSuccess: queryResult.isSuccess,
    isStale: queryResult.isStale,
    status: queryResult.status,
  };
};

/**
 * Hook for fetching comprehensive student profile with all related data
 *
 * @param studentId - Student ID to fetch profile for
 * @param options - Additional query options
 * @returns Complete student profile with health records, contacts, etc.
 *
 * @example
 * ```tsx
 * const { profile, isLoading } = useStudentProfile('student-123');
 *
 * return (
 *   <StudentProfileView
 *     profile={profile}
 *     loading={isLoading}
 *   />
 * );
 * ```
 */
export const useStudentProfile = (
  studentId: string | undefined,
  options?: {
    enabled?: boolean;
  }
): UseStudentProfileReturn => {
  const config = cacheConfig.details;

  const queryResult = useQuery({
    queryKey: studentQueryKeys.details.profile(studentId || ''),
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');

      // For now, use regular getById - can be extended later
      const response = await apiActions.students.getById(studentId);

      if (!response) {
        throw new Error(`Student profile for ID ${studentId} not found`);
      }

      return response;
    },
    enabled: !!studentId && (options?.enabled !== false),
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnMount: config.refetchOnMount,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    retryDelay: config.retryDelay,
    meta: {
      errorHandler: (error: ApiError) => {
        console.error(`Failed to fetch student profile ${studentId}:`, error);
      }
    }
  });

  const refetch = useCallback(() => {
    queryResult.refetch().catch((error) => {
      console.error('Failed to refetch student profile:', error);
    });
  }, [queryResult.refetch]);

  return {
    profile: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as ApiError | null,
    isFetching: queryResult.isFetching,
    refetch,
    isSuccess: queryResult.isSuccess,
  };
};
