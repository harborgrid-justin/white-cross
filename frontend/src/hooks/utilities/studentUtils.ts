/**
 * Student Utility and Cache Management Hooks
 * 
 * Utility functions, cache management, prefetching strategies,
 * and healthcare-specific data handling patterns.
 * 
 * @module hooks/students/utils
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useQueryClient,
  type QueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { studentQueryKeys, type StudentFilters } from './queryKeys';
import { cacheConfig } from './cacheConfig';
import { studentsApi } from '@/services/modules/studentsApi';
import type { Student } from '@/types/student.types';

/**
 * Enhanced API error type
 */
interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Cache invalidation patterns
 */
export type InvalidationPattern = 
  | 'all-students'
  | 'student-lists'
  | 'student-details'
  | 'student-statistics'
  | 'student-searches'
  | 'student-relationships'
  | 'specific-student';

/**
 * Prefetch strategy options
 */
export interface PrefetchOptions {
  /** Grade levels to prefetch */
  grades?: string[];
  /** Maximum number of students to prefetch */
  limit?: number;
  /** Whether to prefetch relationships */
  includeRelationships?: boolean;
  /** Priority level for prefetching */
  priority?: 'low' | 'medium' | 'high';
  /** Custom filters for prefetching */
  filters?: Partial<StudentFilters>;
}

/**
 * Cache warming strategy
 */
export interface CacheWarmingStrategy {
  /** Enable automatic cache warming */
  enabled: boolean;
  /** Patterns to warm */
  patterns: ('lists' | 'popular-students' | 'statistics' | 'current-grade')[];
  /** Delay before warming starts (ms) */
  delay?: number;
  /** Interval for refreshing warm cache (ms) */
  refreshInterval?: number;
}

/**
 * PHI (Protected Health Information) handling utilities
 */
export interface PHIHandlingOptions {
  /** Enable PHI sanitization */
  sanitize?: boolean;
  /** Fields to exclude from cache */
  excludeFields?: string[];
  /** Custom sanitization function */
  sanitizer?: (data: any) => any;
  /** Log PHI access for audit trails */
  logAccess?: boolean;
}

/**
 * Hook for advanced cache management and invalidation
 * 
 * @returns Cache management utilities
 * 
 * @example
 * ```tsx
 * const {
 *   invalidatePattern,
 *   clearStudentCache,
 *   warmCache,
 *   getCacheStats
 * } = useCacheManager();
 * 
 * // Invalidate all student lists after creating a new student
 * await invalidatePattern('student-lists');
 * 
 * // Warm cache for current grade
 * await warmCache({ grades: ['5'], limit: 50 });
 * ```
 */
export const useCacheManager = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate cache patterns based on data changes
   */
  const invalidatePattern = useCallback(async (
    pattern: InvalidationPattern,
    studentId?: string
  ) => {
    const promises: Promise<void>[] = [];

    switch (pattern) {
      case 'all-students':
        promises.push(queryClient.invalidateQueries({
          queryKey: studentQueryKeys.base.all(),
        }));
        break;

      case 'student-lists':
        promises.push(queryClient.invalidateQueries({
          queryKey: studentQueryKeys.lists.all(),
        }));
        break;

      case 'student-details':
        if (studentId) {
          promises.push(queryClient.invalidateQueries({
            queryKey: studentQueryKeys.details.byId(studentId),
          }));
        } else {
          promises.push(queryClient.invalidateQueries({
            queryKey: studentQueryKeys.details.all(),
          }));
        }
        break;

      case 'student-statistics':
        promises.push(queryClient.invalidateQueries({
          queryKey: studentQueryKeys.statistics.all(),
        }));
        break;

      case 'student-searches':
        promises.push(queryClient.invalidateQueries({
          queryKey: studentQueryKeys.searches.all(),
        }));
        break;

      case 'student-relationships':
        if (studentId) {
          promises.push(queryClient.invalidateQueries({
            queryKey: studentQueryKeys.relationships.emergencyContacts(studentId),
          }));
        } else {
          promises.push(queryClient.invalidateQueries({
            queryKey: studentQueryKeys.relationships.all(),
          }));
        }
        break;

      case 'specific-student':
        if (studentId) {
          // Invalidate all queries related to a specific student
          promises.push(
            queryClient.invalidateQueries({
              queryKey: studentQueryKeys.details.byId(studentId),
            }),
            queryClient.invalidateQueries({
              queryKey: studentQueryKeys.details.profile(studentId),
            }),
            queryClient.invalidateQueries({
              queryKey: studentQueryKeys.relationships.emergencyContacts(studentId),
            })
          );
        }
        break;
    }

    await Promise.all(promises);
  }, [queryClient]);

  /**
   * Clear all student-related cache
   */
  const clearStudentCache = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: studentQueryKeys.base.all(),
    });
  }, [queryClient]);

  /**
   * Remove specific student data from cache
   */
  const removeStudentFromCache = useCallback((studentId: string) => {
    // Remove from all relevant query keys
    queryClient.removeQueries({
      queryKey: studentQueryKeys.details.byId(studentId),
    });
    
    queryClient.removeQueries({
      queryKey: studentQueryKeys.details.profile(studentId),
    });

    // Update lists to remove the student
    queryClient.setQueriesData(
      { queryKey: studentQueryKeys.lists.all() },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        if (Array.isArray(oldData)) {
          return oldData.filter((student: Student) => student.id !== studentId);
        }
        
        if (oldData.students) {
          return {
            ...oldData,
            students: oldData.students.filter((student: Student) => student.id !== studentId),
            pagination: oldData.pagination ? {
              ...oldData.pagination,
              total: Math.max(0, oldData.pagination.total - 1),
            } : undefined,
          };
        }
        
        return oldData;
      }
    );
  }, [queryClient]);

  /**
   * Update student data in cache
   */
  const updateStudentInCache = useCallback((studentId: string, updates: Partial<Student>) => {
    // Update detail queries
    queryClient.setQueryData(
      studentQueryKeys.details.byId(studentId),
      (oldData: Student | undefined) => 
        oldData ? { ...oldData, ...updates } : undefined
    );

    queryClient.setQueryData(
      studentQueryKeys.details.profile(studentId),
      (oldData: Student | undefined) => 
        oldData ? { ...oldData, ...updates } : undefined
    );

    // Update in lists
    queryClient.setQueriesData(
      { queryKey: studentQueryKeys.lists.all() },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        if (Array.isArray(oldData)) {
          return oldData.map((student: Student) => 
            student.id === studentId ? { ...student, ...updates } : student
          );
        }
        
        if (oldData.students) {
          return {
            ...oldData,
            students: oldData.students.map((student: Student) => 
              student.id === studentId ? { ...student, ...updates } : student
            ),
          };
        }
        
        return oldData;
      }
    );
  }, [queryClient]);

  /**
   * Add new student to cache
   */
  const addStudentToCache = useCallback((newStudent: Student) => {
    // Set detail data
    queryClient.setQueryData(
      studentQueryKeys.details.byId(newStudent.id),
      newStudent
    );

    // Add to lists (prepend to maintain chronological order)
    queryClient.setQueriesData(
      { queryKey: studentQueryKeys.lists.all() },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        if (Array.isArray(oldData)) {
          return [newStudent, ...oldData];
        }
        
        if (oldData.students) {
          return {
            ...oldData,
            students: [newStudent, ...oldData.students],
            pagination: oldData.pagination ? {
              ...oldData.pagination,
              total: oldData.pagination.total + 1,
            } : undefined,
          };
        }
        
        return oldData;
      }
    );

    // Invalidate statistics since counts have changed
    invalidatePattern('student-statistics');
  }, [queryClient, invalidatePattern]);

  /**
   * Prefetch data based on strategy
   */
  const prefetchData = useCallback(async (options: PrefetchOptions = {}) => {
    const {
      grades,
      limit = 50,
      includeRelationships = false,
      priority = 'medium',
      filters = {},
    } = options;

    const prefetchPromises: Promise<void>[] = [];

    // Prefetch by grades if specified
    if (grades?.length) {
      for (const grade of grades) {
        prefetchPromises.push(
          queryClient.prefetchQuery({
            queryKey: studentQueryKeys.lists.byGrade(grade),
            queryFn: () => studentsApi.getAll({ grade, limit }),
            staleTime: cacheConfig.lists.staleTime,
          })
        );
      }
    }

    // Prefetch general list
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: studentQueryKeys.lists.active(),
        queryFn: () => studentsApi.getAll({ isActive: true, limit }),
        staleTime: cacheConfig.lists.staleTime,
      })
    );

    // Prefetch statistics
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: studentQueryKeys.statistics.overview(),
        queryFn: () => studentsApi.getAll({}),
        staleTime: cacheConfig.statistics.staleTime,
      })
    );

    await Promise.allSettled(prefetchPromises);
  }, [queryClient]);

  /**
   * Warm cache with common data patterns
   */
  const warmCache = useCallback(async (strategy: CacheWarmingStrategy) => {
    if (!strategy.enabled) return;

    const { patterns, delay = 0 } = strategy;

    // Wait for delay if specified
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const warmingPromises: Promise<void>[] = [];

    for (const pattern of patterns) {
      switch (pattern) {
        case 'lists':
          warmingPromises.push(
            prefetchData({ limit: 50, priority: 'low' })
          );
          break;

        case 'statistics':
          warmingPromises.push(
            queryClient.prefetchQuery({
              queryKey: studentQueryKeys.statistics.overview(),
              queryFn: () => studentsApi.getAll({}),
              staleTime: cacheConfig.statistics.staleTime,
            })
          );
          break;

        case 'current-grade':
          // Prefetch current academic year grades
          const currentGrades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
          warmingPromises.push(
            prefetchData({ grades: currentGrades.slice(0, 5), limit: 30 })
          );
          break;
      }
    }

    await Promise.allSettled(warmingPromises);
  }, [queryClient, prefetchData]);

  /**
   * Get cache statistics and health
   */
  const getCacheStats = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const studentQueries = queries.filter(query => 
      query.queryKey[0] === 'students'
    );

    const stats = {
      totalQueries: queries.length,
      studentQueries: studentQueries.length,
      freshQueries: studentQueries.filter(q => q.state.dataUpdatedAt > Date.now() - 300000).length, // 5 min
      staleQueries: studentQueries.filter(q => q.isStale()).length,
      errorQueries: studentQueries.filter(q => q.state.error).length,
      loadingQueries: studentQueries.filter(q => q.state.isFetching).length,
      cacheSize: JSON.stringify(studentQueries.map(q => q.state.data)).length,
    };

    return stats;
  }, [queryClient]);

  return {
    // Invalidation
    invalidatePattern,
    clearStudentCache,
    
    // Direct cache manipulation
    removeStudentFromCache,
    updateStudentInCache,
    addStudentToCache,
    
    // Prefetching and warming
    prefetchData,
    warmCache,
    
    // Monitoring
    getCacheStats,
  };
};

/**
 * Hook for PHI (Protected Health Information) handling
 * 
 * @param options - PHI handling configuration
 * @returns PHI utilities and sanitization functions
 * 
 * @example
 * ```tsx
 * const { sanitizeData, logDataAccess } = usePHIHandler({
 *   sanitize: true,
 *   excludeFields: ['ssn', 'medicalRecordNum'],
 *   logAccess: true
 * });
 * 
 * const safeData = sanitizeData(studentData);
 * logDataAccess('student-view', studentId);
 * ```
 */
export const usePHIHandler = (options: PHIHandlingOptions = {}) => {
  const {
    sanitize = false,
    excludeFields = [],
    sanitizer,
    logAccess = false,
  } = options;

  /**
   * Default PHI sanitization function
   */
  const defaultSanitizer = useCallback((data: any): any => {
    if (!data || typeof data !== 'object') return data;

    const sanitized = { ...data };

    // Remove or mask sensitive fields
    const sensitiveFields = [
      'ssn',
      'socialSecurityNumber',
      'medicalRecordNum',
      'insuranceId',
      ...excludeFields,
    ];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        if (typeof sanitized[field] === 'string') {
          // Mask all but last 4 characters
          const value = sanitized[field];
          sanitized[field] = '*'.repeat(Math.max(0, value.length - 4)) + value.slice(-4);
        } else {
          delete sanitized[field];
        }
      }
    });

    // Recursively sanitize nested objects
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] && typeof sanitized[key] === 'object') {
        if (Array.isArray(sanitized[key])) {
          sanitized[key] = sanitized[key].map((item: any) => defaultSanitizer(item));
        } else {
          sanitized[key] = defaultSanitizer(sanitized[key]);
        }
      }
    });

    return sanitized;
  }, [excludeFields]);

  /**
   * Sanitize data according to PHI requirements
   */
  const sanitizeData = useCallback((data: any) => {
    if (!sanitize) return data;
    return sanitizer ? sanitizer(data) : defaultSanitizer(data);
  }, [sanitize, sanitizer, defaultSanitizer]);

  /**
   * Log data access for audit trails
   */
  const logDataAccess = useCallback((action: string, resourceId?: string, metadata?: any) => {
    if (!logAccess) return;

    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      resourceType: 'student',
      resourceId,
      userId: 'current-user', // Would get from auth context
      metadata: {
        userAgent: navigator.userAgent,
        ip: 'client-ip', // Would get from request context
        ...metadata,
      },
    };

    // In a real application, this would send to an audit logging service
    console.log('[PHI ACCESS LOG]', auditEntry);
    
    // Store in local storage for development (remove in production)
    try {
      const logs = JSON.parse(localStorage.getItem('phi-access-logs') || '[]');
      logs.push(auditEntry);
      // Keep only last 100 logs
      localStorage.setItem('phi-access-logs', JSON.stringify(logs.slice(-100)));
    } catch (error) {
      console.error('Failed to store PHI access log:', error);
    }
  }, [logAccess]);

  /**
   * Check if user has permission to access PHI data
   */
  const checkPHIPermission = useCallback((action: string, resourceId?: string): boolean => {
    // In a real application, this would check user permissions
    // For now, return true for all actions
    logDataAccess(`permission-check-${action}`, resourceId, { granted: true });
    return true;
  }, [logDataAccess]);

  return {
    sanitizeData,
    logDataAccess,
    checkPHIPermission,
  };
};

/**
 * Hook for automatic cache warming and maintenance
 * 
 * @param strategy - Cache warming strategy
 * @returns Cache warming utilities
 */
export const useCacheWarming = (strategy: CacheWarmingStrategy) => {
  const { warmCache } = useCacheManager();
  const warmingRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start automatic cache warming
   */
  const startWarming = useCallback(() => {
    if (!strategy.enabled || warmingRef.current) return;

    const runWarming = () => {
      warmCache(strategy).catch(error => {
        console.error('Cache warming failed:', error);
      });
    };

    // Initial warming
    setTimeout(runWarming, strategy.delay || 0);

    // Set up interval if specified
    if (strategy.refreshInterval) {
      warmingRef.current = setInterval(runWarming, strategy.refreshInterval);
    }
  }, [strategy, warmCache]);

  /**
   * Stop automatic cache warming
   */
  const stopWarming = useCallback(() => {
    if (warmingRef.current) {
      clearInterval(warmingRef.current);
      warmingRef.current = null;
    }
  }, []);

  // Auto-start on mount, auto-stop on unmount
  useEffect(() => {
    startWarming();
    return stopWarming;
  }, [startWarming, stopWarming]);

  return {
    startWarming,
    stopWarming,
    isWarming: warmingRef.current !== null,
  };
};

/**
 * Hook for optimistic updates with rollback capability
 * 
 * @returns Optimistic update utilities
 * 
 * @example
 * ```tsx
 * const { performOptimisticUpdate, rollbackUpdate } = useOptimisticUpdates();
 * 
 * const updateStudent = async (id: string, data: Partial<Student>) => {
 *   const rollback = performOptimisticUpdate('student-update', id, data);
 *   
 *   try {
 *     await studentsApi.update(id, data);
 *   } catch (error) {
 *     rollback();
 *     throw error;
 *   }
 * };
 * ```
 */
export const useOptimisticUpdates = () => {
  const { updateStudentInCache, invalidatePattern } = useCacheManager();
  const rollbacksRef = useRef<Map<string, () => void>>(new Map());

  /**
   * Perform optimistic update with rollback capability
   */
  const performOptimisticUpdate = useCallback((
    updateId: string,
    studentId: string,
    updates: Partial<Student>
  ): (() => void) => {
    const queryClient = useQueryClient();
    
    // Store original data for rollback
    const originalData = queryClient.getQueryData(studentQueryKeys.details.byId(studentId));
    
    // Perform optimistic update
    updateStudentInCache(studentId, updates);
    
    // Create rollback function
    const rollback = () => {
      if (originalData) {
        queryClient.setQueryData(studentQueryKeys.details.byId(studentId), originalData);
        invalidatePattern('student-lists');
      }
      rollbacksRef.current.delete(updateId);
    };
    
    // Store rollback function
    rollbacksRef.current.set(updateId, rollback);
    
    return rollback;
  }, [updateStudentInCache, invalidatePattern]);

  /**
   * Rollback specific update
   */
  const rollbackUpdate = useCallback((updateId: string) => {
    const rollback = rollbacksRef.current.get(updateId);
    if (rollback) {
      rollback();
    }
  }, []);

  /**
   * Clear all pending rollbacks
   */
  const clearRollbacks = useCallback(() => {
    rollbacksRef.current.clear();
  }, []);

  return {
    performOptimisticUpdate,
    rollbackUpdate,
    clearRollbacks,
    pendingUpdates: rollbacksRef.current.size,
  };
};

/**
 * Export all utility hooks
 */
export default {
  useCacheManager,
  usePHIHandler,
  useCacheWarming,
  useOptimisticUpdates,
};
