/**
 * Incident Reports Slice - Re-export from canonical location
 * 
 * This file re-exports all members from the canonical incidentReportsSlice
 * located in pages/incidents/store/incidentReportsSlice.ts
 */

// Re-export everything from the canonical location
export {
  // Types
  type SortConfig,
  type ViewMode,
  
  // Thunks
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
  
  // Actions
  setFilters,
  setSearchQuery,
  setSelectedIncidentReport,
  clearSelectedIncident,
  setSortOrder,
  setViewMode,
  clearErrors,
  clearError,
  resetState,
  invalidateCache,
  optimisticUpdateReport,
  
  // Selectors
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
} from '../../pages/incidents/store/incidentReportsSlice';

// Default export (the reducer)
export { default } from '../../pages/incidents/store/incidentReportsSlice';
