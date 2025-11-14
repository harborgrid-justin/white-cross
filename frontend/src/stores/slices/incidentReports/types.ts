/**
 * Incident Reports Store - Type Definitions
 * 
 * Type definitions for incident reports Redux state management
 * 
 * @module stores/slices/incidentReports/types
 */

import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  IncidentReportFilters,
  IncidentType,
  IncidentSeverity,
  IncidentStatus
} from '@/types/domain/incidents';

/**
 * Sort configuration for incident reports list.
 *
 * Defines the sorting column and order for incident report displays.
 * Supports sorting by occurrence time, severity, type, status, and report time.
 *
 * @interface SortConfig
 *
 * @property {('occurredAt'|'severity'|'type'|'status'|'reportedAt')} column - Column to sort by
 * @property {('asc'|'desc')} order - Sort direction (ascending or descending)
 *
 * @example
 * ```typescript
 * const sortConfig: SortConfig = {
 *   column: 'occurredAt',
 *   order: 'desc'  // Most recent first
 * };
 * ```
 */
export interface SortConfig {
  column: 'occurredAt' | 'severity' | 'type' | 'status' | 'reportedAt';
  order: 'asc' | 'desc';
}

/**
 * View mode for incident reports display.
 *
 * Determines how incidents are rendered in the UI:
 * - **list**: Compact list view with essential information
 * - **grid**: Card-based grid layout with thumbnails
 * - **detail**: Full detail view for single incident
 *
 * @typedef {('list'|'grid'|'detail')} ViewMode
 */
export type ViewMode = 'list' | 'grid' | 'detail';

/**
 * Pagination metadata for incident reports.
 *
 * Tracks pagination state for list views with page number, items per page,
 * total item count, and total page count.
 *
 * @interface PaginationMeta
 *
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Number of items per page
 * @property {number} total - Total number of items across all pages
 * @property {number} pages - Total number of pages
 *
 * @example
 * ```typescript
 * const pagination: PaginationMeta = {
 *   page: 1,
 *   limit: 20,
 *   total: 156,
 *   pages: 8
 * };
 * ```
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Loading states for different incident report operations.
 *
 * Provides granular loading flags for each async operation type,
 * enabling precise UI loading state management.
 *
 * @interface LoadingStates
 *
 * @property {boolean} list - Loading incident reports list
 * @property {boolean} detail - Loading single incident detail
 * @property {boolean} witnesses - Loading witness statements
 * @property {boolean} actions - Loading follow-up actions
 * @property {boolean} creating - Creating new incident report
 * @property {boolean} updating - Updating existing incident
 * @property {boolean} deleting - Deleting incident report
 * @property {boolean} searching - Searching incident reports
 *
 * @example
 * ```typescript
 * // Check if any operation is in progress
 * const isAnyLoading = Object.values(loading).some(v => v);
 * ```
 */
export interface LoadingStates {
  list: boolean;
  detail: boolean;
  witnesses: boolean;
  actions: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  searching: boolean;
}

/**
 * Error states for different incident report operations.
 *
 * Stores operation-specific error messages for granular error handling
 * and user-friendly error display.
 *
 * @interface ErrorStates
 *
 * @property {string|null} list - Error fetching incident list
 * @property {string|null} detail - Error fetching incident detail
 * @property {string|null} witnesses - Error fetching witness statements
 * @property {string|null} actions - Error fetching follow-up actions
 * @property {string|null} create - Error creating incident
 * @property {string|null} update - Error updating incident
 * @property {string|null} delete - Error deleting incident
 * @property {string|null} search - Error searching incidents
 *
 * @example
 * ```typescript
 * // Display error for specific operation
 * if (errors.create) {
 *   toast.error(errors.create);
 * }
 * ```
 */
export interface ErrorStates {
  list: string | null;
  detail: string | null;
  witnesses: string | null;
  actions: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
  search: string | null;
}

/**
 * Main state interface for incident reports Redux slice.
 *
 * Comprehensive state structure managing all aspects of incident reporting
 * including data, pagination, filters, UI state, loading/error states,
 * and cache management.
 *
 * @interface IncidentReportsState
 *
 * @property {IncidentReport[]} reports - Array of incident report entities
 * @property {IncidentReport|null} selectedReport - Currently viewed incident (detail view)
 * @property {WitnessStatement[]} witnessStatements - Statements for selected incident
 * @property {FollowUpAction[]} followUpActions - Actions for selected incident
 * @property {IncidentReport[]} searchResults - Search query results
 * @property {PaginationMeta} pagination - Page metadata for list views
 * @property {IncidentReportFilters} filters - Active filter criteria
 * @property {string} searchQuery - Current search query text
 * @property {SortConfig} sortConfig - Current sort configuration
 * @property {ViewMode} viewMode - Current view mode (list/grid/detail)
 * @property {LoadingStates} loading - Operation-specific loading flags
 * @property {ErrorStates} errors - Operation-specific error messages
 * @property {number|null} lastFetched - Timestamp of last successful fetch
 * @property {boolean} cacheInvalidated - Flag indicating cache needs refresh
 *
 * @see {@link LoadingStates} for loading state structure
 * @see {@link ErrorStates} for error state structure
 * @see {@link PaginationMeta} for pagination structure
 * @see {@link SortConfig} for sort configuration
 */
export interface IncidentReportsState {
  // Data
  reports: IncidentReport[];
  selectedReport: IncidentReport | null;
  witnessStatements: WitnessStatement[];
  followUpActions: FollowUpAction[];
  searchResults: IncidentReport[];

  // Pagination
  pagination: PaginationMeta;

  // Filters
  filters: IncidentReportFilters;
  searchQuery: string;

  // UI State
  sortConfig: SortConfig;
  viewMode: ViewMode;

  // Loading States
  loading: LoadingStates;

  // Error States
  errors: ErrorStates;

  // Cache Management
  lastFetched: number | null;
  cacheInvalidated: boolean;
}

/**
 * Initial state for incident reports slice.
 *
 * Provides sensible defaults for all state properties with empty data arrays,
 * default pagination (20 items per page), descending sort by occurrence time,
 * and list view mode.
 *
 * @const {IncidentReportsState} initialState
 */
export const initialState: IncidentReportsState = {
  // Data
  reports: [],
  selectedReport: null,
  witnessStatements: [],
  followUpActions: [],
  searchResults: [],

  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Filters
  filters: {
    page: 1,
    limit: 20,
  },
  searchQuery: '',

  // UI State
  sortConfig: {
    column: 'occurredAt',
    order: 'desc',
  },
  viewMode: 'list',

  // Loading States
  loading: {
    list: false,
    detail: false,
    witnesses: false,
    actions: false,
    creating: false,
    updating: false,
    deleting: false,
    searching: false,
  },

  // Error States
  errors: {
    list: null,
    detail: null,
    witnesses: null,
    actions: null,
    create: null,
    update: null,
    delete: null,
    search: null,
  },

  // Cache Management
  lastFetched: null,
  cacheInvalidated: false,
};

/**
 * Report statistics interface
 */
export interface ReportStatistics {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  parentNotificationRate: number;
  followUpRate: number;
}
