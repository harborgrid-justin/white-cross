/**
 * Domain-Specific Redux Hooks
 *
 * Specialized hooks for authentication and incident reports domain logic.
 * These hooks provide convenient access to domain-specific state and actions.
 *
 * @module domainHooks
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../reduxStore';
import { loginUser, registerUser, logoutUser, refreshUser, clearError, setUser } from '../slices/authSlice';
import {
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
  setFilters,
  setSearchQuery,
  setSelectedIncidentReport,
  clearSelectedIncident,
  setSortOrder,
  setViewMode,
  clearErrors,
  clearError as clearIncidentError,
  resetState,
  invalidateCache,
  optimisticUpdateReport,
} from '../slices/incidentReportsSlice';
import type {
  IncidentReportFilters,
  IncidentSearchParams,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  CreateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  IncidentReport,
} from '../../types/incidents';

// Core hooks - these are also exported from index.ts for convenience
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// =====================
// AUTH-SPECIFIC HOOKS
// =====================

/**
 * Hook to get current authenticated user
 */
export const useCurrentUser = () => useAppSelector((state) => state.auth.user);

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);

/**
 * Hook to get auth loading state
 */
export const useAuthLoading = () => useAppSelector((state) => state.auth.isLoading);

/**
 * Hook to get auth error state
 */
export const useAuthError = () => useAppSelector((state) => state.auth.error);

/**
 * Hook that provides all auth actions
 * Returns bound action creators for authentication operations
 *
 * @example
 * const { login, logout } = useAuthActions();
 * await login({ email: 'user@example.com', password: 'password' });
 */
export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  return {
    login: (credentials: { email: string; password: string }) =>
      dispatch(loginUser(credentials)),
    register: (userData: any) =>
      dispatch(registerUser(userData)),
    logout: () => dispatch(logoutUser()),
    refreshUser: () => dispatch(refreshUser()),
    clearError: () => dispatch(clearError()),
    setUser: (user: any) => dispatch(setUser(user)),
  };
};

// =====================
// INCIDENT REPORTS HOOKS
// =====================

/**
 * Hook to get all incident reports
 */
export const useIncidentReports = () => useAppSelector((state) => state.incidentReports.reports);

/**
 * Hook to get currently selected incident report
 */
export const useCurrentIncident = () => useAppSelector((state) => state.incidentReports.selectedReport);

/**
 * Hook to get witness statements for current incident
 */
export const useWitnessStatements = () => useAppSelector((state) => state.incidentReports.witnessStatements);

/**
 * Hook to get follow-up actions for current incident
 */
export const useFollowUpActions = () => useAppSelector((state) => state.incidentReports.followUpActions);

/**
 * Hook to get search results
 */
export const useIncidentSearchResults = () => useAppSelector((state) => state.incidentReports.searchResults);

/**
 * Hook to get pagination metadata
 */
export const useIncidentPagination = () => useAppSelector((state) => state.incidentReports.pagination);

/**
 * Hook to get current filters
 */
export const useIncidentFilters = () => useAppSelector((state) => state.incidentReports.filters);

/**
 * Hook to get search query
 */
export const useIncidentSearchQuery = () => useAppSelector((state) => state.incidentReports.searchQuery);

/**
 * Hook to get sort configuration
 */
export const useIncidentSortConfig = () => useAppSelector((state) => state.incidentReports.sortConfig);

/**
 * Hook to get view mode
 */
export const useIncidentViewMode = () => useAppSelector((state) => state.incidentReports.viewMode);

/**
 * Hook to get all loading states for incidents
 */
export const useIncidentLoadingStates = () => useAppSelector((state) => state.incidentReports.loading);

/**
 * Hook to get all error states for incidents
 */
export const useIncidentErrorStates = () => useAppSelector((state) => state.incidentReports.errors);

/**
 * Hook to check if incident reports list is loading
 */
export const useIncidentListLoading = () => useAppSelector((state) => state.incidentReports.loading.list);

/**
 * Hook to check if incident detail is loading
 */
export const useIncidentDetailLoading = () => useAppSelector((state) => state.incidentReports.loading.detail);

/**
 * Hook to check if creating incident report
 */
export const useIncidentCreating = () => useAppSelector((state) => state.incidentReports.loading.creating);

/**
 * Hook to check if updating incident report
 */
export const useIncidentUpdating = () => useAppSelector((state) => state.incidentReports.loading.updating);

/**
 * Hook to check if deleting incident report
 */
export const useIncidentDeleting = () => useAppSelector((state) => state.incidentReports.loading.deleting);

/**
 * Hook that provides all incident report actions
 * Returns bound action creators for incident operations
 *
 * @example
 * const { fetchReports, createReport, updateReport } = useIncidentActions();
 * await fetchReports({ page: 1, limit: 20 });
 * await createReport(incidentData);
 */
export const useIncidentActions = () => {
  const dispatch = useAppDispatch();

  return {
    // Data fetching
    fetchReports: (filters?: IncidentReportFilters) =>
      dispatch(fetchIncidentReports(filters)),
    fetchReportById: (id: string) =>
      dispatch(fetchIncidentReportById(id)),
    searchReports: (params: IncidentSearchParams) =>
      dispatch(searchIncidentReports(params)),

    // CRUD operations
    createReport: (data: CreateIncidentReportRequest) =>
      dispatch(createIncidentReport(data)),
    updateReport: (id: string, data: UpdateIncidentReportRequest) =>
      dispatch(updateIncidentReport({ id, data })),
    deleteReport: (id: string) =>
      dispatch(deleteIncidentReport(id)),

    // Witness statements
    fetchWitnesses: (incidentReportId: string) =>
      dispatch(fetchWitnessStatements(incidentReportId)),
    createWitness: (data: CreateWitnessStatementRequest) =>
      dispatch(createWitnessStatement(data)),

    // Follow-up actions
    fetchActions: (incidentReportId: string) =>
      dispatch(fetchFollowUpActions(incidentReportId)),
    createAction: (data: CreateFollowUpActionRequest) =>
      dispatch(createFollowUpAction(data)),

    // UI state management
    setFilters: (filters: Partial<IncidentReportFilters>) =>
      dispatch(setFilters(filters)),
    setSearchQuery: (query: string) =>
      dispatch(setSearchQuery(query)),
    setSelectedReport: (report: IncidentReport) =>
      dispatch(setSelectedIncidentReport(report)),
    clearSelected: () =>
      dispatch(clearSelectedIncident()),
    setSortOrder: (config: { column: 'occurredAt' | 'severity' | 'type' | 'status' | 'reportedAt'; order: 'asc' | 'desc' }) =>
      dispatch(setSortOrder(config)),
    setViewMode: (mode: 'list' | 'grid' | 'detail') =>
      dispatch(setViewMode(mode)),

    // Error handling
    clearErrors: () =>
      dispatch(clearErrors()),
    clearError: (errorKey: string) =>
      dispatch(clearIncidentError(errorKey as any)),

    // Cache management
    resetState: () =>
      dispatch(resetState()),
    invalidateCache: () =>
      dispatch(invalidateCache()),
    optimisticUpdate: (id: string, data: Partial<IncidentReport>) =>
      dispatch(optimisticUpdateReport({ id, data })),
  };
};
