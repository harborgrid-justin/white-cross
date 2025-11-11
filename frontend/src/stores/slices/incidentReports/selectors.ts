/**
 * Incident Reports Store - Selectors
 * 
 * Redux selectors for incident reports state
 * 
 * @module stores/slices/incidentReports/selectors
 */

import type { RootState } from '@/stores/store';
import type { 
  IncidentType,
  IncidentStatus,
  IncidentReport
} from '@/types/domain/incidents';
import { IncidentSeverity } from '@/types/domain/incidents';
import type {
  LoadingStates,
  ErrorStates,
  ReportStatistics
} from './types';

/**
 * Select all incident reports.
 *
 * @function selectIncidentReports
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Array of all loaded incident reports
 *
 * @example
 * ```typescript
 * const reports = useSelector(selectIncidentReports);
 * ```
 */
export const selectIncidentReports = (state: RootState) =>
  state.incidentReports.reports;

/**
 * Select currently selected/active incident report.
 *
 * @function selectCurrentIncident
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport|null} Selected incident or null if none selected
 *
 * @example
 * ```typescript
 * const currentIncident = useSelector(selectCurrentIncident);
 * ```
 */
export const selectCurrentIncident = (state: RootState) =>
  state.incidentReports.selectedReport;

/**
 * Select witness statements for current incident.
 *
 * @function selectWitnessStatements
 * @param {RootState} state - Redux root state
 * @returns {WitnessStatement[]} Array of witness statements
 *
 * @example
 * ```typescript
 * const statements = useSelector(selectWitnessStatements);
 * ```
 */
export const selectWitnessStatements = (state: RootState) =>
  state.incidentReports.witnessStatements;

/**
 * Select follow-up actions for current incident.
 *
 * @function selectFollowUpActions
 * @param {RootState} state - Redux root state
 * @returns {FollowUpAction[]} Array of follow-up actions
 *
 * @example
 * ```typescript
 * const actions = useSelector(selectFollowUpActions);
 * ```
 */
export const selectFollowUpActions = (state: RootState) =>
  state.incidentReports.followUpActions;

/**
 * Select search results.
 *
 * @function selectSearchResults
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Array of search results
 *
 * @example
 * ```typescript
 * const searchResults = useSelector(selectSearchResults);
 * ```
 */
export const selectSearchResults = (state: RootState) =>
  state.incidentReports.searchResults;

/**
 * Select pagination metadata.
 *
 * @function selectPagination
 * @param {RootState} state - Redux root state
 * @returns {PaginationMeta} Pagination metadata (page, limit, total, pages)
 *
 * @example
 * ```typescript
 * const { page, total, pages } = useSelector(selectPagination);
 * ```
 */
export const selectPagination = (state: RootState) =>
  state.incidentReports.pagination;

/**
 * Select current filters.
 *
 * @function selectFilters
 * @param {RootState} state - Redux root state
 * @returns {IncidentReportFilters} Active filter criteria
 *
 * @example
 * ```typescript
 * const filters = useSelector(selectFilters);
 * ```
 */
export const selectFilters = (state: RootState) => state.incidentReports.filters;

/**
 * Select search query.
 *
 * @function selectSearchQuery
 * @param {RootState} state - Redux root state
 * @returns {string} Current search query text
 *
 * @example
 * ```typescript
 * const query = useSelector(selectSearchQuery);
 * ```
 */
export const selectSearchQuery = (state: RootState) =>
  state.incidentReports.searchQuery;

/**
 * Select sort configuration.
 *
 * @function selectSortConfig
 * @param {RootState} state - Redux root state
 * @returns {SortConfig} Current sort configuration (column, order)
 *
 * @example
 * ```typescript
 * const { column, order } = useSelector(selectSortConfig);
 * ```
 */
export const selectSortConfig = (state: RootState) =>
  state.incidentReports.sortConfig;

/**
 * Select view mode.
 *
 * @function selectViewMode
 * @param {RootState} state - Redux root state
 * @returns {ViewMode} Current view mode (list/grid/detail)
 *
 * @example
 * ```typescript
 * const viewMode = useSelector(selectViewMode);
 * ```
 */
export const selectViewMode = (state: RootState) => state.incidentReports.viewMode;

/**
 * Select all loading states.
 *
 * @function selectLoadingStates
 * @param {RootState} state - Redux root state
 * @returns {LoadingStates} Object with all loading flags
 *
 * @example
 * ```typescript
 * const loading = useSelector(selectLoadingStates);
 * const isAnyLoading = Object.values(loading).some(v => v);
 * ```
 */
export const selectLoadingStates = (state: RootState) =>
  state.incidentReports.loading;

/**
 * Select specific loading state.
 *
 * Higher-order selector that returns a selector for a specific loading flag.
 *
 * @function selectIsLoading
 * @param {keyof LoadingStates} key - Loading state key
 * @returns {(state: RootState) => boolean} Selector for specific loading flag
 *
 * @example
 * ```typescript
 * const isListLoading = useSelector(selectIsLoading('list'));
 * const isCreating = useSelector(selectIsLoading('creating'));
 * ```
 */
export const selectIsLoading = (key: keyof LoadingStates) => (state: RootState) =>
  state.incidentReports.loading[key];

/**
 * Select all error states.
 *
 * @function selectErrorStates
 * @param {RootState} state - Redux root state
 * @returns {ErrorStates} Object with all error messages
 *
 * @example
 * ```typescript
 * const errors = useSelector(selectErrorStates);
 * ```
 */
export const selectErrorStates = (state: RootState) => state.incidentReports.errors;

/**
 * Select specific error state.
 *
 * Higher-order selector that returns a selector for a specific error message.
 *
 * @function selectError
 * @param {keyof ErrorStates} key - Error state key
 * @returns {(state: RootState) => string|null} Selector for specific error message
 *
 * @example
 * ```typescript
 * const createError = useSelector(selectError('create'));
 * if (createError) toast.error(createError);
 * ```
 */
export const selectError = (key: keyof ErrorStates) => (state: RootState) =>
  state.incidentReports.errors[key];

/**
 * Select whether cache is invalidated.
 *
 * @function selectIsCacheInvalidated
 * @param {RootState} state - Redux root state
 * @returns {boolean} True if cache needs refresh
 *
 * @example
 * ```typescript
 * const needsRefresh = useSelector(selectIsCacheInvalidated);
 * ```
 */
export const selectIsCacheInvalidated = (state: RootState) =>
  state.incidentReports.cacheInvalidated;

/**
 * Select last fetched timestamp.
 *
 * @function selectLastFetched
 * @param {RootState} state - Redux root state
 * @returns {number|null} Timestamp of last fetch or null if never fetched
 *
 * @example
 * ```typescript
 * const lastFetched = useSelector(selectLastFetched);
 * const isStale = lastFetched && Date.now() - lastFetched > 300000; // 5 minutes
 * ```
 */
export const selectLastFetched = (state: RootState) =>
  state.incidentReports.lastFetched;

/**
 * Select filtered and sorted incident reports.
 *
 * Derived selector that applies client-side sorting based on current sort configuration.
 * Creates a new sorted array without mutating the original.
 *
 * @function selectFilteredAndSortedReports
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Sorted array of incident reports
 *
 * @remarks
 * This selector performs client-side sorting on already-loaded data.
 * For large datasets, consider using server-side sorting via filter parameters.
 *
 * Severity sorting uses ordinal values: LOW=1, MEDIUM=2, HIGH=3, CRITICAL=4
 *
 * @example
 * ```typescript
 * const sortedReports = useSelector(selectFilteredAndSortedReports);
 * ```
 */
export const selectFilteredAndSortedReports = (state: RootState) => {
  const { reports, sortConfig } = state.incidentReports;

  const sortedReports = [...reports].sort((a, b) => {
    const { column, order } = sortConfig;

    let aValue: string | number;
    let bValue: string | number;

    switch (column) {
      case 'occurredAt':
      case 'reportedAt':
        aValue = new Date((a as IncidentReport)[column] || 0).getTime();
        bValue = new Date((b as IncidentReport)[column] || 0).getTime();
        break;
      case 'severity':
        const severityOrder: Record<string, number> = {
          [IncidentSeverity.LOW]: 1,
          [IncidentSeverity.MEDIUM]: 2,
          [IncidentSeverity.HIGH]: 3,
          [IncidentSeverity.CRITICAL]: 4
        };
        aValue = severityOrder[(a as IncidentReport).severity] || 0;
        bValue = severityOrder[(b as IncidentReport).severity] || 0;
        break;
      default:
        aValue = (a as IncidentReport)[column as keyof IncidentReport] as string | number;
        bValue = (b as IncidentReport)[column as keyof IncidentReport] as string | number;
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedReports;
};

/**
 * Select incident reports by type.
 *
 * Higher-order selector that filters incidents by specific type.
 *
 * @function selectIncidentsByType
 * @param {IncidentType} type - Incident type to filter by
 * @returns {(state: RootState) => IncidentReport[]} Selector for incidents of specified type
 *
 * @example
 * ```typescript
 * const injuries = useSelector(selectIncidentsByType(IncidentType.INJURY));
 * const behavioral = useSelector(selectIncidentsByType(IncidentType.BEHAVIORAL));
 * ```
 */
export const selectIncidentsByType = (type: IncidentType) => (state: RootState) =>
  state.incidentReports.reports.filter((report: IncidentReport) => report.type === type);

/**
 * Select incident reports by severity.
 *
 * Higher-order selector that filters incidents by specific severity level.
 *
 * @function selectIncidentsBySeverity
 * @param {IncidentSeverity} severity - Severity level to filter by
 * @returns {(state: RootState) => IncidentReport[]} Selector for incidents of specified severity
 *
 * @example
 * ```typescript
 * const criticalIncidents = useSelector(selectIncidentsBySeverity(IncidentSeverity.CRITICAL));
 * ```
 */
export const selectIncidentsBySeverity = (severity: IncidentSeverity) => (
  state: RootState
) => state.incidentReports.reports.filter((report: IncidentReport) => report.severity === severity);

/**
 * Select incident reports by status.
 *
 * Higher-order selector that filters incidents by specific status.
 *
 * @function selectIncidentsByStatus
 * @param {IncidentStatus} status - Status to filter by
 * @returns {(state: RootState) => IncidentReport[]} Selector for incidents with specified status
 *
 * @example
 * ```typescript
 * const openIncidents = useSelector(selectIncidentsByStatus(IncidentStatus.OPEN));
 * const resolved = useSelector(selectIncidentsByStatus(IncidentStatus.RESOLVED));
 * ```
 */
export const selectIncidentsByStatus = (status: IncidentStatus) => (state: RootState) =>
  state.incidentReports.reports.filter((report: IncidentReport) => report.status === status);

/**
 * Select incident reports requiring follow-up.
 *
 * Filters incidents where followUpRequired flag is true.
 *
 * @function selectIncidentsRequiringFollowUp
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Incidents requiring follow-up actions
 *
 * @example
 * ```typescript
 * const needsFollowUp = useSelector(selectIncidentsRequiringFollowUp);
 * ```
 */
export const selectIncidentsRequiringFollowUp = (state: RootState) =>
  state.incidentReports.reports.filter((report: IncidentReport) => report.followUpRequired);

/**
 * Select incident reports with unnotified parents.
 *
 * Filters incidents where parent notification has not been completed.
 * Useful for generating notification task lists.
 *
 * @function selectIncidentsWithUnnotifiedParents
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} Incidents with unnotified parents
 *
 * @example
 * ```typescript
 * const needsNotification = useSelector(selectIncidentsWithUnnotifiedParents);
 * ```
 */
export const selectIncidentsWithUnnotifiedParents = (state: RootState) =>
  state.incidentReports.reports.filter((report: IncidentReport) => !report.parentNotified);

/**
 * Select critical incidents (HIGH or CRITICAL severity).
 *
 * Filters incidents requiring immediate attention due to high severity.
 * These incidents typically trigger automatic parent notifications.
 *
 * @function selectCriticalIncidents
 * @param {RootState} state - Redux root state
 * @returns {IncidentReport[]} High and critical severity incidents
 *
 * @example
 * ```typescript
 * const criticalIncidents = useSelector(selectCriticalIncidents);
 * // Display urgent notification badge if any critical incidents exist
 * if (criticalIncidents.length > 0) {
 *   showUrgentBadge(criticalIncidents.length);
 * }
 * ```
 */
export const selectCriticalIncidents = (state: RootState) =>
  state.incidentReports.reports.filter(
    (report: IncidentReport) =>
      report.severity === IncidentSeverity.HIGH ||
      report.severity === IncidentSeverity.CRITICAL
  );

/**
 * Select statistics for current reports.
 *
 * Derived selector that calculates analytics on loaded incident reports including
 * counts by type, severity, status, and notification/follow-up rates.
 *
 * @function selectReportStatistics
 * @param {RootState} state - Redux root state
 * @returns {ReportStatistics} Statistics object
 * @returns {number} return.total - Total number of loaded reports
 * @returns {Record<string, number>} return.byType - Count of incidents by type
 * @returns {Record<string, number>} return.bySeverity - Count of incidents by severity
 * @returns {Record<string, number>} return.byStatus - Count of incidents by status
 * @returns {number} return.parentNotificationRate - Percentage of incidents with parent notification
 * @returns {number} return.followUpRate - Percentage of incidents requiring follow-up
 *
 * @remarks
 * This selector performs calculations on client-side data. For comprehensive
 * analytics across all incidents (not just loaded ones), use a dedicated
 * analytics API endpoint.
 *
 * @example
 * ```typescript
 * const stats = useSelector(selectReportStatistics);
 * console.log(`Critical incidents: ${stats.bySeverity.CRITICAL || 0}`);
 * console.log(`Parent notification rate: ${stats.parentNotificationRate.toFixed(1)}%`);
 * ```
 */
export const selectReportStatistics = (state: RootState): ReportStatistics => {
  const { reports } = state.incidentReports;

  return {
    total: reports.length,
    byType: reports.reduce((acc: Record<string, number>, report: IncidentReport) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    bySeverity: reports.reduce((acc: Record<string, number>, report: IncidentReport) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byStatus: reports.reduce((acc: Record<string, number>, report: IncidentReport) => {
      acc[report.status || 'OPEN'] = (acc[report.status || 'OPEN'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    parentNotificationRate:
      reports.length > 0
        ? (reports.filter((r: IncidentReport) => r.parentNotified).length / reports.length) * 100
        : 0,
    followUpRate:
      reports.length > 0
        ? (reports.filter((r: IncidentReport) => r.followUpRequired).length / reports.length) * 100
        : 0,
  };
};
