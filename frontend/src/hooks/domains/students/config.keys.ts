/**
 * Students Domain Query Keys Factory
 *
 * Structured query key generation for React Query cache management.
 * Provides hierarchical keys for efficient cache invalidation.
 *
 * @module hooks/domains/students/config.keys
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @example
 * ```typescript
 * // Using query keys for cache invalidation
 * import { studentQueryKeys } from '@/hooks/domains/students/config.keys';
 * import { useQueryClient } from '@tanstack/react-query';
 *
 * const queryClient = useQueryClient();
 *
 * // Invalidate all student lists after enrollment
 * queryClient.invalidateQueries({
 *   queryKey: studentQueryKeys.lists.all()
 * });
 *
 * // Invalidate specific student's health records
 * queryClient.invalidateQueries({
 *   queryKey: studentQueryKeys.health.records('student-123')
 * });
 * ```
 */

import type { StudentListFilters, PaginationParams } from './config.types';

/**
 * Student domain query keys factory
 */
export const studentQueryKeys = {
  // Root domain key
  domain: ['students'] as const,

  // Base query types
  base: {
    lists: () => [...studentQueryKeys.domain, 'list'] as const,
    details: () => [...studentQueryKeys.domain, 'detail'] as const,
    search: () => [...studentQueryKeys.domain, 'search'] as const,
    directory: () => [...studentQueryKeys.domain, 'directory'] as const,
    health: () => [...studentQueryKeys.domain, 'health'] as const,
    academics: () => [...studentQueryKeys.domain, 'academics'] as const,
    statistics: () => [...studentQueryKeys.domain, 'statistics'] as const,
  },

  // List queries
  lists: {
    all: () => studentQueryKeys.base.lists(),
    filtered: (filters: StudentListFilters) =>
      [...studentQueryKeys.base.lists(), 'filtered', filters] as const,
    paginated: (pagination: PaginationParams) =>
      [...studentQueryKeys.base.lists(), 'paginated', pagination] as const,
    byGrade: (grade: string) =>
      [...studentQueryKeys.base.lists(), 'grade', grade] as const,
    bySchool: (schoolId: string) =>
      [...studentQueryKeys.base.lists(), 'school', schoolId] as const,
    active: () => [...studentQueryKeys.base.lists(), 'active'] as const,
    inactive: () => [...studentQueryKeys.base.lists(), 'inactive'] as const,
  },

  // Detail queries
  details: {
    byId: (id: string) =>
      [...studentQueryKeys.base.details(), id] as const,
    withHealth: (id: string) =>
      [...studentQueryKeys.base.details(), id, 'health'] as const,
    withAcademics: (id: string) =>
      [...studentQueryKeys.base.details(), id, 'academics'] as const,
    full: (id: string) =>
      [...studentQueryKeys.base.details(), id, 'full'] as const,
  },

  // Search queries
  search: {
    global: (query: string) =>
      [...studentQueryKeys.base.search(), 'global', query] as const,
    byName: (name: string) =>
      [...studentQueryKeys.base.search(), 'name', name] as const,
    byGrade: (grade: string, query: string) =>
      [...studentQueryKeys.base.search(), 'grade', grade, query] as const,
  },

  // Health-related queries (high sensitivity)
  health: {
    records: (studentId: string) =>
      [...studentQueryKeys.base.health(), studentId, 'records'] as const,
    allergies: (studentId: string) =>
      [...studentQueryKeys.base.health(), studentId, 'allergies'] as const,
    medications: (studentId: string) =>
      [...studentQueryKeys.base.health(), studentId, 'medications'] as const,
    emergencyInfo: (studentId: string) =>
      [...studentQueryKeys.base.health(), studentId, 'emergency'] as const,
  },

  // Statistics and reporting
  statistics: {
    enrollment: () => [...studentQueryKeys.base.statistics(), 'enrollment'] as const,
    byGrade: () => [...studentQueryKeys.base.statistics(), 'grade'] as const,
    attendance: () => [...studentQueryKeys.base.statistics(), 'attendance'] as const,
    health: () => [...studentQueryKeys.base.statistics(), 'health'] as const,
  },
} as const;
