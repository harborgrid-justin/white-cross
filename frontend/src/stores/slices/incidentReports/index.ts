/**
 * Incident Reports Store - Module Index
 * 
 * Unified interface for incident reports state management
 * 
 * @module stores/slices/incidentReports
 */

// Export main reducer
export { default as incidentReportsReducer } from './slice';

// Export all actions
export {
  // UI state actions
  setSelectedReport,
  setFilters,
  clearFilters,
  setSearchQuery,
  clearSearch,
  setSortConfig,
  setViewMode,
  setPagination,
  
  // Error management
  clearError,
  clearAllErrors,
  
  // Cache management
  invalidateCache,
  refreshCache,
  
  // Data management
  addIncidentReport,
  updateIncidentReportInStore,
  removeIncidentReport,
  addWitnessStatement,
  updateWitnessStatementInStore,
  removeWitnessStatement,
  addFollowUpAction,
  updateFollowUpActionInStore,
  removeFollowUpAction
} from './slice';

// Export all async thunks
export {
  // List operations
  fetchIncidentReports,
  fetchIncidentReportById,
  searchIncidentReports,
  
  // CRUD operations
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport,
  
  // Witness statements
  fetchWitnessStatements,
  createWitnessStatement,
  
  // Follow-up actions
  fetchFollowUpActions,
  createFollowUpAction
} from './thunks';

// Export all selectors
export {
  // Basic selectors
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
  
  // Loading and error selectors
  selectLoadingStates,
  selectIsLoading,
  selectErrorStates,
  selectError,
  
  // Cache selectors
  selectIsCacheInvalidated,
  selectLastFetched,
  
  // Derived selectors
  selectFilteredAndSortedReports,
  selectIncidentsByType,
  selectIncidentsBySeverity,
  selectIncidentsByStatus,
  selectIncidentsRequiringFollowUp,
  selectIncidentsWithUnnotifiedParents,
  selectCriticalIncidents,
  selectReportStatistics
} from './selectors';

// Export type definitions
export type {
  IncidentReportsState,
  LoadingStates,
  ErrorStates,
  SortConfig,
  ViewMode,
  PaginationMeta,
  ReportStatistics
} from './types';

// Re-export domain types for convenience
export type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  IncidentReportFilters,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  CreateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  WitnessType,
  ActionPriority,
  ActionStatus
} from '@/types/domain/incidents';

/**
 * Pre-configured incident reports slice for Redux store integration
 * 
 * @example
 * ```typescript
 * import { configureStore } from '@reduxjs/toolkit';
 * import { incidentReportsReducer } from '@/stores/slices/incidentReports';
 * 
 * const store = configureStore({
 *   reducer: {
 *     incidentReports: incidentReportsReducer,
 *     // other reducers...
 *   },
 * });
 * ```
 */

/**
 * Usage examples for common operations
 * 
 * @example
 * ```typescript
 * import { useSelector, useDispatch } from 'react-redux';
 * import {
 *   fetchIncidentReports,
 *   selectIncidentReports,
 *   selectLoadingStates,
 *   setFilters,
 *   IncidentType,
 *   IncidentSeverity
 * } from '@/stores/slices/incidentReports';
 * 
 * function IncidentReportsList() {
 *   const dispatch = useDispatch();
 *   const reports = useSelector(selectIncidentReports);
 *   const loading = useSelector(selectLoadingStates);
 * 
 *   // Fetch reports on component mount
 *   useEffect(() => {
 *     dispatch(fetchIncidentReports());
 *   }, [dispatch]);
 * 
 *   // Filter by injury incidents
 *   const handleFilterByInjuries = () => {
 *     dispatch(setFilters({
 *       type: IncidentType.INJURY,
 *       severity: IncidentSeverity.HIGH
 *     }));
 *     dispatch(fetchIncidentReports());
 *   };
 * 
 *   if (loading.list) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   return (
 *     <div>
 *       <button onClick={handleFilterByInjuries}>
 *         Show High-Severity Injuries
 *       </button>
 *       {reports.map(report => (
 *         <IncidentCard key={report.id} incident={report} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Advanced selector usage examples
 * 
 * @example
 * ```typescript
 * import { useSelector } from 'react-redux';
 * import {
 *   selectCriticalIncidents,
 *   selectIncidentsRequiringFollowUp,
 *   selectReportStatistics,
 *   selectIncidentsByType,
 *   IncidentType
 * } from '@/stores/slices/incidentReports';
 * 
 * function IncidentDashboard() {
 *   // Get critical incidents requiring immediate attention
 *   const criticalIncidents = useSelector(selectCriticalIncidents);
 *   
 *   // Get incidents needing follow-up
 *   const followUpRequired = useSelector(selectIncidentsRequiringFollowUp);
 *   
 *   // Get injury incidents specifically
 *   const injuries = useSelector(selectIncidentsByType(IncidentType.INJURY));
 *   
 *   // Get statistics for analytics
 *   const stats = useSelector(selectReportStatistics);
 * 
 *   return (
 *     <div className="dashboard">
 *       <div className="stats-cards">
 *         <StatsCard
 *           title="Critical Incidents"
 *           count={criticalIncidents.length}
 *           urgent={criticalIncidents.length > 0}
 *         />
 *         <StatsCard
 *           title="Follow-up Required"
 *           count={followUpRequired.length}
 *         />
 *         <StatsCard
 *           title="Total Injuries"
 *           count={injuries.length}
 *         />
 *         <StatsCard
 *           title="Parent Notification Rate"
 *           count={`${stats.parentNotificationRate.toFixed(1)}%`}
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Error handling pattern
 * 
 * @example
 * ```typescript
 * import { useSelector, useDispatch } from 'react-redux';
 * import {
 *   createIncidentReport,
 *   selectError,
 *   clearError
 * } from '@/stores/slices/incidentReports';
 * 
 * function CreateIncidentForm() {
 *   const dispatch = useDispatch();
 *   const createError = useSelector(selectError('create'));
 * 
 *   // Handle form submission
 *   const handleSubmit = async (formData) => {
 *     try {
 *       // Clear any previous errors
 *       dispatch(clearError('create'));
 *       
 *       // Create incident report
 *       await dispatch(createIncidentReport(formData)).unwrap();
 *       
 *       // Success - navigate or show success message
 *       toast.success('Incident report created successfully');
 *     } catch (error) {
 *       // Error is automatically stored in state
 *       // UI will show error message via selector
 *     }
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {createError && (
 *         <div className="error-message">
 *           {createError}
 *         </div>
 *       )}
 *     </form>
 *   );
 * }
 * ```
 */
