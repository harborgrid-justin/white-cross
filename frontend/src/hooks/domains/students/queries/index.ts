/**
 * WF-COMP-147 | index.ts - Student query hooks barrel export
 * Purpose: Re-exports all student query hooks for backward compatibility
 * Upstream: Student query modules
 * Downstream: Components consuming student hooks
 * Exports: All student hooks, types, and utilities
 * Last Updated: 2025-11-04
 * File Type: .ts
 */

// =====================
// QUERY KEY FACTORY AND CACHE CONFIG
// =====================
export { studentKeys, CACHE_CONFIG } from './studentQueryKeys';

// =====================
// TYPE EXPORTS
// =====================
export type {
  UseStudentsReturn,
  UseStudentDetailReturn,
  UseStudentSearchReturn,
  UseAssignedStudentsReturn,
  UseStudentStatsReturn,
  StudentStats,
  UseStudentsReturn_Legacy,
} from './studentQueryTypes';

// =====================
// CORE QUERY HOOKS
// =====================
export {
  useStudents,
  useStudentDetail,
  useStudentSearch,
} from './useStudentCoreQueries';

// =====================
// SPECIALIZED QUERY HOOKS
// =====================
export {
  useAssignedStudents,
  useStudentStats,
} from './useStudentSpecializedQueries';

// =====================
// MUTATION HOOKS
// =====================
export {
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useBulkImportStudents,
  useExportStudents,
} from './useStudentMutations';

// =====================
// UTILITY HOOKS
// =====================
export {
  useStudentCacheInvalidation,
  useStudentPrefetch,
} from './useStudentUtilities';

// =====================
// BACKWARD COMPATIBILITY EXPORTS
// =====================

/**
 * @deprecated Use useStudentSearch instead
 * Maintained for backward compatibility
 */
export { useStudentSearch as useStudentSearch_Legacy } from './useStudentCoreQueries';
