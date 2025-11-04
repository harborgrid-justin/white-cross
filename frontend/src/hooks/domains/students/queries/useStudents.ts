/**
 * Student Query Hooks - Unified Re-export
 *
 * This file provides backward compatibility by re-exporting all student query hooks
 * from their modular breakdown. It maintains the exact same API as the original
 * useStudents.ts file while delegating to the new modular structure.
 *
 * @module hooks/students/queries/useStudents
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 *
 * @remarks
 * **Migration from Monolithic to Modular Structure**:
 * The original useStudents.ts has been broken down into:
 * - coreQueries.ts - Re-exports list and detail query hooks
 * - listQueries.ts - useStudents, useInfiniteStudents
 * - detailQueries.ts - useStudentDetail, useStudentProfile
 * - specializedQueries.ts - useAssignedStudents, useRecentStudents, useStudentsByGrade
 * - searchAndFilter/* - Search and filter functionality
 * - statistics/* - Statistics and analytics hooks
 *
 * This file serves as a compatibility layer, ensuring that existing imports
 * like `import { useStudents } from '@/hooks/domains/students/queries/useStudents'`
 * continue to work without modification.
 */

// =====================
// TYPE EXPORTS
// =====================
export type {
  ApiError,
  PaginatedResponse,
  StudentProfile,
  UseStudentsReturn,
  UseStudentDetailReturn,
  UseStudentProfileReturn,
  UseInfiniteStudentsReturn,
} from './types';

// =====================
// CORE QUERY HOOKS
// =====================

/**
 * List Query Hooks
 * - useStudents: Paginated student list
 * - useInfiniteStudents: Infinite scroll support
 */
export { useStudents, useInfiniteStudents } from './listQueries';

/**
 * Detail Query Hooks
 * - useStudentDetail: Single student by ID
 * - useStudentProfile: Complete profile with related data
 */
export { useStudentDetail, useStudentProfile } from './detailQueries';

/**
 * Specialized Query Hooks
 * - useAssignedStudents: Students assigned to current nurse
 * - useRecentStudents: Recently enrolled students
 * - useStudentsByGrade: Filter by grade level
 */
export {
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
} from './specializedQueries';

// =====================
// SEARCH AND FILTER HOOKS
// =====================

/**
 * Search and Filter Functionality
 * Re-exports from the searchAndFilter module
 */
export type {
  SearchSuggestion,
  AdvancedFilters,
  SortOption,
  SavedSearch,
  SearchOptions,
  FilterOptions,
  SearchAndFilterOptions,
} from './searchAndFilter';

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

/**
 * Statistics and Analytics
 * Re-exports from the statistics module
 */
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
// DEFAULT EXPORT
// =====================

/**
 * Default export for backward compatibility
 * Provides all hooks in a single object
 */
import { useStudents, useInfiniteStudents } from './listQueries';
import { useStudentDetail, useStudentProfile } from './detailQueries';
import {
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
} from './specializedQueries';
import {
  useStudentSearch,
  useAdvancedFilters,
  useStudentSorting,
  useSavedSearches,
  useStudentSearchAndFilter,
} from './searchAndFilter';
import {
  useEnrollmentStats,
  useHealthStats,
  useActivityStats,
  useRiskStats,
  useComplianceStats,
  useDashboardMetrics,
  useTrendAnalysis,
  useComparativeStats,
} from './statistics';

export default {
  // Core queries
  useStudents,
  useStudentDetail,
  useStudentProfile,
  useInfiniteStudents,

  // Specialized queries
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,

  // Search and filter
  useStudentSearch,
  useAdvancedFilters,
  useStudentSorting,
  useSavedSearches,
  useStudentSearchAndFilter,

  // Statistics
  useEnrollmentStats,
  useHealthStats,
  useActivityStats,
  useRiskStats,
  useComplianceStats,
  useDashboardMetrics,
  useTrendAnalysis,
  useComparativeStats,
};
