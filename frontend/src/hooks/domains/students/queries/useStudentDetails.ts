/**
 * Student Details Query Hook
 * 
 * Enterprise-grade hook for fetching individual student details with
 * proper PHI handling, caching, and compliance logging.
 * 
 * @module hooks/domains/students/queries/useStudentDetails
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { studentsApi } from '@/services/modules/studentsApi';
import { useApiError } from '@/hooks/shared/useApiError';
import { useCacheManager } from '@/hooks/shared/useCacheManager';
import { useHealthcareCompliance } from '@/hooks/shared/useHealthcareCompliance';
import { 
  studentQueryKeys, 
  STUDENT_OPERATIONS,
  STUDENT_ERROR_CODES 
} from '../config';
import type { Student } from '@/types/student.types';

/**
 * Student details query options
 */
export interface UseStudentDetailsOptions {
  studentId: string;
  includeHealth?: boolean;
  includeAcademics?: boolean;
  includeFull?: boolean;
  enabled?: boolean;
  enableRealtime?: boolean;
}

/**
 * Student details query result
 */
export interface StudentDetailsResult {
  // Query state
  data: Student | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  isFetching: boolean;
  refetch: () => void;
  
  // Computed properties
  student: Student | undefined;
  hasHealthData: boolean;
  hasAcademicData: boolean;
  refreshStudent: () => void;
  invalidateStudent: () => Promise<void>;
}

/**
 * Student Details Query Hook
 */
export function useStudentDetails(options: UseStudentDetailsOptions): StudentDetailsResult {
  const {
    studentId,
    includeHealth = false,
    includeAcademics = false,
    includeFull = false,
    enabled = true,
    enableRealtime = false,
  } = options;

  // Enterprise hooks
  const { handleError } = useApiError({ context: 'student_details' });
  const { getCacheStrategy, invalidateCache: invalidateCacheManager } = useCacheManager();
  const { logCompliantAccess } = useHealthcareCompliance();

  // Determine data sensitivity based on what's being requested
  const dataSensitivity = useMemo(() => {
    if (includeHealth || includeFull) return 'phi';
    if (includeAcademics) return 'confidential';
    return 'internal';
  }, [includeHealth, includeAcademics, includeFull]);

  // Cache configuration
  const cacheConfig = useMemo(() => {
    const strategy = getCacheStrategy(dataSensitivity);
    return {
      staleTime: enableRealtime ? 0 : strategy.staleTime,
      gcTime: strategy.cacheTime,
    };
  }, [dataSensitivity, enableRealtime, getCacheStrategy]);

  // Query key based on inclusion options
  const queryKey = useMemo(() => {
    if (includeFull) {
      return studentQueryKeys.details.full(studentId);
    } else if (includeHealth) {
      return studentQueryKeys.details.withHealth(studentId);
    } else if (includeAcademics) {
      return studentQueryKeys.details.withAcademics(studentId);
    }
    return studentQueryKeys.details.byId(studentId);
  }, [studentId, includeHealth, includeAcademics, includeFull]);

  // Query function with compliance and error handling
  const queryFn = useCallback(async (): Promise<Student> => {
    try {
      // Log compliant access
      await logCompliantAccess(
        'student_details',
        'view',
        { 
          studentId, 
          includeHealth, 
          includeAcademics, 
          includeFull 
        },
        studentId
      );

      // Fetch student data using getById method
      const student: Student = await studentsApi.getById(studentId);

      // Validate student exists
      if (!student) {
        throw new Error(STUDENT_ERROR_CODES.NOT_FOUND);
      }

      return student;
    } catch (error) {
      // Handle specific student errors
      if (error instanceof Error && error.message === STUDENT_ERROR_CODES.NOT_FOUND) {
        const notFoundError = new Error(`Student with ID ${studentId} not found`);
        (notFoundError as any).status = 404;
        (notFoundError as any).code = STUDENT_ERROR_CODES.NOT_FOUND;
        throw handleError(notFoundError, STUDENT_OPERATIONS.VIEW_DETAILS);
      }

      throw handleError(error, STUDENT_OPERATIONS.VIEW_DETAILS);
    }
  }, [
    studentId,
    includeHealth,
    includeAcademics,
    includeFull,
    logCompliantAccess,
    handleError,
  ]);

  // Main query
  const queryResult = useQuery({
    queryKey,
    queryFn,
    enabled: enabled && !!studentId,
    ...cacheConfig,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 or authorization errors
      if (error?.status === 404 || error?.status === 401) {
        return false;
      }
      // Don't retry on student-specific errors
      if (error?.code && Object.values(STUDENT_ERROR_CODES).includes(error.code)) {
        return false;
      }
      return failureCount < 2; // Limit retries for individual student requests
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Cache invalidation for this student
  const invalidateStudent = useCallback(async () => {
    await invalidateCacheManager([...studentQueryKeys.details.byId(studentId)], 'prefix');
  }, [invalidateCacheManager, studentId]);

  // Manual refetch wrapper
  const refreshStudent = useCallback(() => {
    queryResult.refetch();
  }, [queryResult]);

  // Computed values
  const student = queryResult.data;
  const hasHealthData = !!(student && (includeHealth || includeFull) && student.healthRecords);
  const hasAcademicData = !!(student && (includeAcademics || includeFull) && student.grade);

  return {
    ...queryResult,
    student,
    hasHealthData,
    hasAcademicData,
    refreshStudent,
    invalidateStudent,
  };
}

/**
 * Hook for getting basic student info (no sensitive data)
 */
export function useStudentBasicInfo(studentId: string) {
  return useStudentDetails({
    studentId,
    includeHealth: false,
    includeAcademics: false,
    enabled: !!studentId,
  });
}

/**
 * Hook for getting student with health data (PHI)
 */
export function useStudentWithHealth(studentId: string, enabled = true) {
  return useStudentDetails({
    studentId,
    includeHealth: true,
    enabled: enabled && !!studentId,
    enableRealtime: true, // Health data should be real-time
  });
}

/**
 * Hook for getting complete student profile
 */
export function useStudentFullProfile(studentId: string, enabled = true) {
  return useStudentDetails({
    studentId,
    includeFull: true,
    enabled: enabled && !!studentId,
    enableRealtime: true, // Full profile includes sensitive data
  });
}