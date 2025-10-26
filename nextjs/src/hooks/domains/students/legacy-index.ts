/**
 * Student Hooks Main Index
 * 
 * Comprehensive export hub for all student-related hooks with organized
 * categorization and documentation for easy consumption across the application.
 * 
 * @module hooks/students
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 * 
 * @example
 * ```tsx
 * // Import specific hooks
 * import { useStudents, useStudentMutations } from '@/hooks/students';
 * 
 * // Import categories
 * import { searchHooks, statisticsHooks } from '@/hooks/students';
 * 
 * // Import composite hooks
 * import { useStudentManager, useStudentDashboard } from '@/hooks/students';
 * ```
 */

// =============================================================================
// CORE FUNCTIONALITY EXPORTS
// =============================================================================

/**
 * Query Key Management
 * Hierarchical cache key factory for student-related queries
 */
export { studentQueryKeys } from './queryKeys';
export type { StudentFilters } from './queryKeys';

/**
 * Cache Configuration
 * Environment-aware cache settings with healthcare compliance timing
 */
export { cacheConfig } from './cacheConfig';

// =============================================================================
// PRIMARY DATA HOOKS
// =============================================================================

/**
 * Core Query Hooks
 * Primary TanStack Query hooks for data fetching
 */
export {
  useStudents,
  useStudentDetail,
  useInfiniteStudents,
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
} from './coreQueries';

/**
 * Mutation Hooks
 * CRUD operations with healthcare audit trails
 */
export {
  useCreateStudent,
  useUpdateStudent,
  useDeactivateStudent,
  useReactivateStudent,
  useTransferStudent,
  useBulkUpdateStudents,
  usePermanentDeleteStudent,
  useStudentMutations,
} from './mutations';

// =============================================================================
// SEARCH AND FILTERING
// =============================================================================

/**
 * Search and Filter Hooks
 * Advanced search, filtering, and sorting functionality
 */
export {
  useStudentSearch,
  useAdvancedFilters,
  useStudentSorting,
  useSavedSearches,
  useStudentSearchAndFilter,
  SORT_OPTIONS,
} from './searchAndFilter';

export type {
  SearchSuggestion,
  AdvancedFilters,
  SortOption,
  SavedSearch,
} from './searchAndFilter';

// =============================================================================
// STATISTICS AND ANALYTICS
// =============================================================================

/**
 * Statistics and Analytics Hooks
 * Dashboard metrics and reporting capabilities
 */
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

// =============================================================================
// UTILITY AND CACHE MANAGEMENT
// =============================================================================

/**
 * Utility and Cache Management Hooks
 * Cache management, PHI handling, and optimization
 */
export {
  useCacheManager,
  usePHIHandler,
  useCacheWarming,
  useOptimisticUpdates,
} from './utils';

export type {
  InvalidationPattern,
  PrefetchOptions,
  CacheWarmingStrategy,
  PHIHandlingOptions,
} from './utils';

// =============================================================================
// REDUX INTEGRATION
// =============================================================================

/**
 * Redux Integration Hooks
 * Bridge between TanStack Query and Redux state
 */
export {
  useStudentsWithRedux,
  useStudentSelection,
  useReduxSync,
  useViewPreferences,
  useBulkOperations,
} from './redux';

export type {
  StudentUIState,
  StudentUIActions,
} from './redux';

// =============================================================================
// COMPOSITE HOOKS
// =============================================================================

/**
 * Composite Hooks
 * High-level hooks combining multiple concerns
 */
export {
  useStudentManager,
  useStudentDashboard,
  useStudentProfile,
  useBulkStudentOperations,
} from './composite';

// =============================================================================
// INTERNAL IMPORTS FOR CATEGORY EXPORTS
// =============================================================================

import {
  useStudents,
  useStudentDetail,
  useInfiniteStudents,
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
} from './coreQueries';

import {
  useCreateStudent,
  useUpdateStudent,
  useDeactivateStudent,
  useReactivateStudent,
  useTransferStudent,
  useBulkUpdateStudents,
  usePermanentDeleteStudent,
  useStudentMutations,
} from './mutations';

import {
  useStudentSearch,
  useAdvancedFilters,
  useStudentSorting,
  useSavedSearches,
  useStudentSearchAndFilter,
  SORT_OPTIONS,
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

import {
  useCacheManager,
  usePHIHandler,
  useCacheWarming,
  useOptimisticUpdates,
} from './utils';

import {
  useStudentsWithRedux,
  useStudentSelection,
  useReduxSync,
  useViewPreferences,
  useBulkOperations,
} from './redux';

import {
  useStudentManager,
  useStudentDashboard,
  useStudentProfile,
  useBulkStudentOperations,
} from './composite';

import { studentQueryKeys } from './queryKeys';
import { cacheConfig } from './cacheConfig';

// =============================================================================
// ORGANIZED CATEGORY EXPORTS
// =============================================================================

/**
 * Core hooks category - Essential data fetching and mutations
 */
export const coreHooks = {
  // Query hooks
  useStudents,
  useStudentDetail,
  useStudentProfile,
  useInfiniteStudents,
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
  
  // Mutation hooks
  useCreateStudent,
  useUpdateStudent,
  useDeactivateStudent,
  useReactivateStudent,
  useTransferStudent,
  useBulkUpdateStudents,
  usePermanentDeleteStudent,
  useStudentMutations,
} as const;

/**
 * Search hooks category - Search, filter, and sort functionality
 */
export const searchHooks = {
  useStudentSearch,
  useAdvancedFilters,
  useStudentSorting,
  useSavedSearches,
  useStudentSearchAndFilter,
} as const;

/**
 * Statistics hooks category - Analytics and reporting
 */
export const statisticsHooks = {
  useEnrollmentStats,
  useHealthStats,
  useActivityStats,
  useRiskStats,
  useComplianceStats,
  useDashboardMetrics,
  useTrendAnalysis,
  useComparativeStats,
} as const;

/**
 * Utility hooks category - Cache management and optimization
 */
export const utilityHooks = {
  useCacheManager,
  usePHIHandler,
  useCacheWarming,
  useOptimisticUpdates,
} as const;

/**
 * Redux hooks category - State management integration
 */
export const reduxHooks = {
  useStudentsWithRedux,
  useStudentSelection,
  useReduxSync,
  useViewPreferences,
  useBulkOperations,
} as const;

/**
 * Composite hooks category - High-level combined functionality
 */
export const compositeHooks = {
  useStudentManager,
  useStudentDashboard,
  useStudentProfile,
  useBulkStudentOperations,
} as const;

// =============================================================================
// CONVENIENCE IMPORTS
// =============================================================================

/**
 * All hooks export for bulk importing
 */
export const allHooks = {
  ...coreHooks,
  ...searchHooks,
  ...statisticsHooks,
  ...utilityHooks,
  ...reduxHooks,
  ...compositeHooks,
} as const;

// =============================================================================
// CONFIGURATION AND UTILITIES
// =============================================================================

/**
 * Configuration exports
 */
export const config = {
  queryKeys: studentQueryKeys,
  cache: cacheConfig,
  sortOptions: SORT_OPTIONS,
} as const;

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

/**
 * Default export with most commonly used hooks
 */
export default {
  // Most common hooks
  useStudents,
  useStudentDetail,
  useStudentMutations,
  useStudentSearch,
  useStudentManager,
  useStudentDashboard,
  
  // Configuration
  config,
  
  // Categories
  core: coreHooks,
  search: searchHooks,
  statistics: statisticsHooks,
  utils: utilityHooks,
  redux: reduxHooks,
  composite: compositeHooks,
} as const;

// =============================================================================
// DOCUMENTATION
// =============================================================================

/**
 * Hook Categories and Usage Guide
 * 
 * @category Core Hooks
 * Essential hooks for basic student data operations:
 * - useStudents: Fetch student lists with filters
 * - useStudentDetail: Fetch individual student details
 * - useStudentMutations: CRUD operations with audit trails
 * 
 * @category Search Hooks
 * Advanced search and filtering capabilities:
 * - useStudentSearch: Real-time search with debouncing
 * - useAdvancedFilters: Complex filtering with multiple criteria
 * - useStudentSorting: Flexible sorting options
 * 
 * @category Statistics Hooks
 * Analytics and reporting functionality:
 * - useDashboardMetrics: Complete dashboard data
 * - useEnrollmentStats: Student enrollment analytics
 * - useHealthStats: Health-related statistics
 * 
 * @category Utility Hooks
 * Cache management and optimization:
 * - useCacheManager: Advanced cache control
 * - usePHIHandler: Healthcare data protection
 * - useOptimisticUpdates: Performance optimization
 * 
 * @category Redux Hooks
 * State management integration:
 * - useStudentsWithRedux: TanStack Query + Redux bridge
 * - useStudentSelection: Selection state management
 * - useBulkOperations: Bulk operation workflows
 * 
 * @category Composite Hooks
 * High-level combined functionality:
 * - useStudentManager: Complete student management interface
 * - useStudentDashboard: Full dashboard functionality
 * - useStudentProfile: Complete student profile data
 * 
 * @example Basic Usage
 * ```tsx
 * // Simple student list
 * const { students, isLoading } = useStudents();
 * 
 * // Student detail page
 * const profile = useStudentProfile(studentId);
 * 
 * // Complete management interface
 * const manager = useStudentManager({
 *   enableRedux: true,
 *   enablePHI: true
 * });
 * ```
 * 
 * @example Advanced Usage
 * ```tsx
 * // Dashboard with all metrics
 * const dashboard = useStudentDashboard('month');
 * 
 * // Search and filter interface
 * const searchInterface = useStudentSearchAndFilter({
 *   initialFilters: { grade: '5' },
 *   enableSuggestions: true
 * });
 * 
 * // Bulk operations
 * const bulk = useBulkStudentOperations({
 *   enableRedux: true,
 *   maxBatchSize: 50
 * });
 * ```
 * 
 * @performance Healthcare Compliance
 * All hooks include healthcare-specific features:
 * - PHI data sanitization and access logging
 * - HIPAA-compliant cache timing
 * - Audit trail generation
 * - Role-based access control integration
 * 
 * @performance Performance Features
 * - Optimistic updates for better UX
 * - Intelligent cache warming
 * - Background prefetching
 * - Stale-while-revalidate patterns
 */