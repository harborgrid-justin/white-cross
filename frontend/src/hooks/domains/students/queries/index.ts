/**
 * Student Query Hooks - Barrel Export
 *
 * Central export point for all student query hooks, providing comprehensive
 * access to student data fetching, search, filtering, statistics, and utilities.
 *
 * This index re-exports from modular files while maintaining backward compatibility
 * with the original monolithic structure.
 *
 * @module hooks/students/queries
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// =====================
// CONFIGURATION EXPORTS
// =====================
export { studentQueryKeys } from './queryKeys';
export { cacheConfig } from './cacheConfig';

// =====================
// TYPE EXPORTS
// =====================

// Core query types
export type {
  ApiError,
  PaginatedResponse,
  StudentProfile,
  UseStudentsReturn,
  UseStudentDetailReturn,
  UseStudentProfileReturn,
  UseInfiniteStudentsReturn,
} from './types';

// Legacy types (for backward compatibility with old structure)
export type {
  UseStudentsReturn as UseStudentsReturn_Legacy,
  UseStudentDetailReturn as UseStudentDetailReturn_Legacy,
  UseStudentSearchReturn,
  UseAssignedStudentsReturn,
  UseStudentStatsReturn,
  StudentStats,
} from './studentQueryTypes';

// Search and filter types
export type {
  SearchSuggestion,
  AdvancedFilters,
  SortOption,
  SavedSearch,
  SearchOptions,
  FilterOptions,
  SearchAndFilterOptions,
} from './searchAndFilter';

// Statistics types
export type {
  EnrollmentStats,
  HealthStats,
  ActivityStats,
  RiskStats,
  ComplianceStats,
  DashboardMetrics,
  TimeRange,
  CustomTimeRange,
} from './statistics';

// =====================
// CORE QUERY HOOKS
// =====================

// List queries
export { useStudents, useInfiniteStudents } from './listQueries';

// Detail queries
export { useStudentDetail, useStudentProfile } from './detailQueries';

// Specialized queries
export {
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
} from './specializedQueries';

// =====================
// SEARCH AND FILTER HOOKS
// =====================
export {
  SORT_OPTIONS,
  useStudentSearch,
  useAdvancedFilters,
  useStudentSorting,
  useSavedSearches,
  useStudentSearchAndFilter,
} from './searchAndFilter';

// =====================
// STATISTICS AND ANALYTICS HOOKS
// =====================
export {
  useEnrollmentStats,
  useHealthStats,
  useActivityStats,
  useRiskStats,
  useComplianceStats,
  useDashboardMetrics,
  useTrendAnalysis,
  useComparativeStats,
} from './statistics';

// =====================
// LEGACY HOOKS (for backward compatibility with old structure)
// =====================

// Re-export from legacy files that still exist
export {
  useStudents as useStudents_Core,
  useStudentDetail as useStudentDetail_Core,
  useStudentSearch as useStudentSearch_Core,
} from './useStudentCoreQueries';

export {
  useAssignedStudents as useAssignedStudents_Specialized,
  useStudentStats,
} from './useStudentSpecializedQueries';

// =====================
// MUTATION HOOKS (in queries for backward compatibility)
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
// COMPOSITE RE-EXPORT
// =====================

/**
 * Re-export everything from useStudents for maximum backward compatibility
 * This allows imports like: import { useStudents } from '@/hooks/domains/students/queries'
 */
export * from './useStudents';
