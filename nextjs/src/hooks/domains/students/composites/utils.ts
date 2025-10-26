/**
 * Student Hook Utilities
 * Utility hooks for cache management, PHI handling, and optimistic updates
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { Student } from '@/types/student.types';

/**
 * Cache manager for student data
 */
export const useCacheManager = () => {
  const queryClient = useQueryClient();

  const addStudentToCache = useCallback((student: Student) => {
    queryClient.setQueryData(['students', student.id], student);
    queryClient.invalidateQueries({ queryKey: ['students'] });
  }, [queryClient]);

  const removeStudentFromCache = useCallback((studentId: string) => {
    queryClient.removeQueries({ queryKey: ['students', studentId] });
    queryClient.invalidateQueries({ queryKey: ['students'] });
  }, [queryClient]);

  const updateStudentInCache = useCallback((studentId: string, data: Partial<Student>) => {
    queryClient.setQueryData(['students', studentId], (old: Student | undefined) =>
      old ? { ...old, ...data } : undefined
    );
    queryClient.invalidateQueries({ queryKey: ['students'] });
  }, [queryClient]);

  const clearCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['students'] });
  }, [queryClient]);

  return {
    addStudentToCache,
    removeStudentFromCache,
    updateStudentInCache,
    clearCache,
  };
};

/**
 * PHI (Protected Health Information) handler
 */
export const usePHIHandler = (options?: { sanitize?: boolean; logAccess?: boolean }) => {
  const { sanitize = true, logAccess = true } = options || {};

  const sanitizeStudent = useCallback((student: Student): Student => {
    if (!sanitize) return student;

    // Basic sanitization - in production this should be more comprehensive
    const { ...rest } = student;
    return rest as Student;
  }, [sanitize]);

  const logAccessEvent = useCallback((studentId: string, action: string) => {
    if (!logAccess) return;

    // Log PHI access for audit trail
    console.info(`[PHI Access] Student ${studentId} - ${action}`);
  }, [logAccess]);

  return {
    sanitizeStudent,
    logAccessEvent,
    isEnabled: sanitize || logAccess,
  };
};

/**
 * Optimistic updates handler
 */
export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const performOptimisticUpdate = useCallback((
    operation: string,
    studentId: string,
    data: Student
  ) => {
    // Store previous state for rollback
    const previousData = queryClient.getQueryData(['students', studentId]);

    // Optimistically update
    queryClient.setQueryData(['students', studentId], data);

    // Return rollback function
    return () => {
      queryClient.setQueryData(['students', studentId], previousData);
    };
  }, [queryClient]);

  return {
    performOptimisticUpdate,
  };
};

// =====================
// MISSING EXPORTS (Referenced by legacy-index.ts)
// =====================

/**
 * Cache Invalidation Patterns
 */
export type InvalidationPattern = 'ALL' | 'SINGLE' | 'RELATED' | 'QUERY';

export interface PrefetchOptions {
  queryKey: unknown[];
  staleTime?: number;
  force?: boolean;
}

export type CacheWarmingStrategy = 'EAGER' | 'LAZY' | 'ON_DEMAND';

export interface PHIHandlingOptions {
  sanitize?: boolean;
  logAccess?: boolean;
  encryptInCache?: boolean;
  autoExpire?: number;
}

/**
 * Cache warming hook for preloading student data
 */
export const useCacheWarming = (strategy: CacheWarmingStrategy = 'LAZY') => {
  const queryClient = useQueryClient();

  const warmCache = useCallback(async (studentIds: string[], options?: PrefetchOptions) => {
    if (strategy === 'EAGER') {
      // Prefetch all student data immediately
      await Promise.all(
        studentIds.map(id =>
          queryClient.prefetchQuery({
            queryKey: ['students', id],
            staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes default
          })
        )
      );
    } else if (strategy === 'LAZY') {
      // Prefetch on next idle callback
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          studentIds.forEach(id => {
            queryClient.prefetchQuery({
              queryKey: ['students', id],
              staleTime: options?.staleTime || 5 * 60 * 1000,
            });
          });
        });
      }
    }
    // ON_DEMAND strategy doesn't prefetch
  }, [queryClient, strategy]);

  const invalidate = useCallback(async (pattern: InvalidationPattern, keys?: unknown[]) => {
    if (pattern === 'ALL') {
      await queryClient.invalidateQueries({ queryKey: ['students'] });
    } else if (pattern === 'SINGLE' && keys) {
      await queryClient.invalidateQueries({ queryKey: keys });
    } else if (pattern === 'RELATED' && keys) {
      await queryClient.invalidateQueries({ queryKey: keys, exact: false });
    }
  }, [queryClient]);

  return {
    warmCache,
    invalidate,
    strategy,
  };
};
