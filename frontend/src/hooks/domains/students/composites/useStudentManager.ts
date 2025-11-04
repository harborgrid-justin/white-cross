/**
 * Student Manager Composite Hook
 *
 * Complete student management interface for full CRUD operations with
 * optional Redux integration, PHI handling, and optimistic updates.
 *
 * @module hooks/students/composites/useStudentManager
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useStudentSearchAndFilter } from '../searchAndFilter';
import { useStudentMutations } from '../mutations';
import { useCacheManager, usePHIHandler, useOptimisticUpdates } from '../utils';
import { useStudentsWithRedux } from '../redux';
import type { Student, StudentFilters } from '@/types/student.types';

/**
 * Enhanced API error type
 */
interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Configuration options for useStudentManager
 */
export interface UseStudentManagerOptions {
  enableRedux?: boolean;
  enablePHI?: boolean;
  autoSave?: boolean;
  initialFilters?: Partial<StudentFilters>;
}

/**
 * Complete student management interface for full CRUD operations
 *
 * @param options - Configuration options
 * @returns Complete student management interface
 *
 * @example
 * ```tsx
 * const studentManager = useStudentManager({
 *   enableRedux: true,
 *   enablePHI: true,
 *   autoSave: true
 * });
 *
 * return (
 *   <StudentManagementInterface
 *     {...studentManager}
 *   />
 * );
 * ```
 */
export const useStudentManager = (options?: UseStudentManagerOptions) => {
  const {
    enableRedux = false,
    enablePHI = true,
    autoSave = false,
    initialFilters = {},
  } = options || {};

  // Core data hooks
  const searchAndFilter = useStudentSearchAndFilter({
    initialFilters,
    autoApply: true,
    enableSuggestions: true,
  });

  const mutations = useStudentMutations();
  const cacheManager = useCacheManager();
  const phiHandler = usePHIHandler({
    sanitize: enablePHI,
    logAccess: enablePHI,
  });
  const optimisticUpdates = useOptimisticUpdates();

  // Adapt cache manager interface
  const adaptedCacheManager = {
    addStudentToCache: cacheManager.addStudentToCache,
    removeStudentFromCache: cacheManager.removeStudentFromCache,
    invalidatePattern: async (pattern: string) => {
      // Legacy API compatibility
      await cacheManager.clearCache();
    },
    prefetchData: async () => {
      // No-op for now, can be implemented with cache warming
    },
    getCacheStats: () => ({
      size: 0,
      hits: 0,
      misses: 0,
    }),
  };

  // Optional Redux integration
  const reduxIntegration = useStudentsWithRedux(
    enableRedux ? searchAndFilter.appliedFilters : undefined
  );

  // Determine which data source to use
  const students = enableRedux ? reduxIntegration.students : searchAndFilter.results;
  const isLoading = enableRedux ? reduxIntegration.isLoading : searchAndFilter.isLoading;
  const error = enableRedux ? reduxIntegration.error : searchAndFilter.error;

  // Enhanced CRUD operations with optimistic updates
  const enhancedOperations = useMemo(() => ({
    createStudent: async (data: any) => {
      const rollback = optimisticUpdates.performOptimisticUpdate(
        'create-student',
        'temp-id',
        data as Student
      );

      try {
        const result = await mutations.createStudent.mutateAsync(data);
        adaptedCacheManager.addStudentToCache(result);

        if (enablePHI) {
          phiHandler.logAccessEvent(result.id, 'student-create');
        }

        return result;
      } catch (error) {
        rollback();
        throw error;
      }
    },

    updateStudent: async (id: string, data: Partial<Student>) => {
      const rollback = optimisticUpdates.performOptimisticUpdate(
        `update-student-${id}`,
        id,
        data as Student
      );

      try {
        const result = await mutations.updateStudent.mutateAsync({ id, data });

        if (enablePHI) {
          phiHandler.logAccessEvent(id, `student-update: ${Object.keys(data).join(', ')}`);
        }

        return result;
      } catch (error) {
        rollback();
        throw error;
      }
    },

    deleteStudent: async (id: string) => {
      const result = await mutations.deactivateStudent.mutateAsync(id);
      adaptedCacheManager.removeStudentFromCache(id);

      if (enablePHI) {
        phiHandler.logAccessEvent(id, 'student-delete');
      }

      return result;
    },

    bulkUpdate: async (ids: string[], data: Partial<Student>) => {
      const rollbacks = ids.map(id =>
        optimisticUpdates.performOptimisticUpdate(`bulk-update-${id}`, id, data as Student)
      );

      try {
        const result = await mutations.bulkUpdateStudents.mutateAsync({ studentIds: ids, updates: data });

        if (enablePHI) {
          ids.forEach(id => phiHandler.logAccessEvent(id, `bulk-update: ${Object.keys(data).join(', ')}`));
        }

        return result;
      } catch (error) {
        rollbacks.forEach(rollback => rollback());
        throw error;
      }
    },
  }), [mutations, optimisticUpdates, adaptedCacheManager, phiHandler, enablePHI]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      // Auto-save logic would go here
      // This might save draft changes, cache state, etc.
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoSave]);

  return {
    // Data
    students: enablePHI ? students.map(phiHandler.sanitizeStudent) : students,
    selectedStudents: enableRedux ? reduxIntegration.selectedStudents : [],

    // State
    isLoading,
    error: error as ApiError | null,
    hasData: students.length > 0,

    // Search and filtering
    search: {
      query: searchAndFilter.query,
      setQuery: searchAndFilter.setQuery,
      suggestions: searchAndFilter.suggestions,
      clearSearch: searchAndFilter.clearSearch,
    },

    filter: {
      filters: searchAndFilter.filters,
      updateFilter: searchAndFilter.updateFilter,
      clearFilters: searchAndFilter.clearFilters,
      activeCount: searchAndFilter.activeFilterCount,
    },

    sort: {
      sortBy: searchAndFilter.sortBy,
      updateSort: searchAndFilter.updateSort,
      options: searchAndFilter.sortOptions,
    },

    // Enhanced operations
    operations: enhancedOperations,

    // Selection (if Redux enabled)
    selection: enableRedux ? {
      selectedIds: reduxIntegration.selectedStudents.map(s => s.id),
      hasSelection: reduxIntegration.hasSelection,
      selectStudent: reduxIntegration.actions.selectStudent,
      clearSelection: reduxIntegration.actions.clearSelection,
    } : undefined,

    // Cache management
    cache: {
      invalidate: adaptedCacheManager.invalidatePattern,
      warm: adaptedCacheManager.prefetchData,
      stats: adaptedCacheManager.getCacheStats,
    },

    // Utility functions
    utils: {
      refetch: searchAndFilter.refetch,
      clearAll: searchAndFilter.clearAll,
      saveSearch: searchAndFilter.saveCurrentSearch,
    },
  };
};
