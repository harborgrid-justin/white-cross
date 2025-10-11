/**
 * Redux Store - Central Export Module
 *
 * This module provides a clean, centralized export interface for the Redux store,
 * making it easy to import store-related utilities throughout the application.
 *
 * Usage:
 * ```typescript
 * // Import hooks
 * import { useAppDispatch, useAppSelector, useAuthActions, useIncidentActions } from '@/stores';
 *
 * // Import types
 * import type { RootState, AppDispatch } from '@/stores';
 *
 * // Import store instance (rarely needed in components)
 * import { store } from '@/stores';
 * ```
 *
 * @module stores
 */

// =====================
// STORE INSTANCE
// =====================

export { store, default as reduxStore } from './reduxStore';

// =====================
// TYPE EXPORTS
// =====================

export type { RootState, AppDispatch } from './reduxStore';

// =====================
// HOOKS - BASE
// =====================

export {
  useAppDispatch,
  useAppSelector,
} from './hooks/reduxHooks';

// =====================
// HOOKS - AUTH
// =====================

export {
  useCurrentUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useAuthActions,
} from './hooks/reduxHooks';

// =====================
// HOOKS - INCIDENT REPORTS
// =====================

export {
  useIncidentReports,
  useCurrentIncident,
  useWitnessStatements,
  useFollowUpActions,
  useIncidentSearchResults,
  useIncidentPagination,
  useIncidentFilters,
  useIncidentSearchQuery,
  useIncidentSortConfig,
  useIncidentViewMode,
  useIncidentLoadingStates,
  useIncidentErrorStates,
  useIncidentListLoading,
  useIncidentDetailLoading,
  useIncidentCreating,
  useIncidentUpdating,
  useIncidentDeleting,
  useIncidentActions,
} from './hooks/reduxHooks';

// =====================
// AUTH SLICE EXPORTS
// =====================

export {
  loginUser,
  registerUser,
  logoutUser,
  refreshUser,
  clearError as clearAuthError,
  setUser,
} from './slices/authSlice';

// =====================
// INCIDENT REPORTS SLICE EXPORTS
// =====================

// Async Thunks
export {
  fetchIncidentReports,
  fetchIncidentReportById,
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport,
  searchIncidentReports,
  fetchWitnessStatements,
  createWitnessStatement,
  fetchFollowUpActions,
  createFollowUpAction,
} from './slices/incidentReportsSlice';

// Synchronous Actions
export {
  setFilters,
  setSearchQuery,
  setSelectedIncidentReport,
  clearSelectedIncident,
  setSortOrder,
  setViewMode,
  clearErrors as clearIncidentErrors,
  clearError as clearIncidentError,
  resetState as resetIncidentState,
  invalidateCache as invalidateIncidentCache,
  optimisticUpdateReport,
} from './slices/incidentReportsSlice';

// Selectors
export {
  selectIncidentReports,
  selectCurrentIncident,
  selectWitnessStatements,
  selectFollowUpActions,
  selectSearchResults,
  selectPagination,
  selectFilters,
  selectSearchQuery,
  selectSortConfig,
  selectViewMode,
  selectLoadingStates,
  selectIsLoading,
  selectErrorStates,
  selectError,
  selectIsCacheInvalidated,
  selectLastFetched,
  selectFilteredAndSortedReports,
  selectIncidentsByType,
  selectIncidentsBySeverity,
  selectIncidentsByStatus,
  selectIncidentsRequiringFollowUp,
  selectIncidentsWithUnnotifiedParents,
  selectCriticalIncidents,
  selectReportStatistics,
} from './slices/incidentReportsSlice';
