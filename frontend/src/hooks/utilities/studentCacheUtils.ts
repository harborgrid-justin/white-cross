/**
 * Student Cache Management Utilities
 *
 * Combined cache management hook that provides both invalidation and
 * manipulation operations for student data using TanStack Query.
 *
 * @module hooks/utilities/studentCacheUtils
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useCacheInvalidation } from './studentCacheInvalidation';
import { useCacheManipulation } from './studentCacheManipulation';

/**
 * Hook for comprehensive cache management
 *
 * Combines invalidation and manipulation operations into a single hook
 * for backward compatibility and convenience.
 *
 * @returns Cache management utilities
 *
 * @example
 * ```tsx
 * const {
 *   invalidatePattern,
 *   clearStudentCache,
 *   updateStudentInCache,
 *   addStudentToCache
 * } = useCacheManager();
 *
 * // Invalidate all student lists after creating a new student
 * await invalidatePattern('student-lists');
 *
 * // Update a student's data in cache
 * updateStudentInCache(studentId, { firstName: 'John' });
 *
 * // Add a new student to cache
 * addStudentToCache(newStudent);
 * ```
 */
export const useCacheManager = () => {
  const { invalidatePattern, clearStudentCache } = useCacheInvalidation();
  const {
    removeStudentFromCache,
    updateStudentInCache,
    addStudentToCache,
    getCacheStats,
  } = useCacheManipulation();

  return {
    // Invalidation
    invalidatePattern,
    clearStudentCache,

    // Direct cache manipulation
    removeStudentFromCache,
    updateStudentInCache,
    addStudentToCache,

    // Monitoring
    getCacheStats,
  };
};
