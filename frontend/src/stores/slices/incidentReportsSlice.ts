/**
 * WF-COMP-311 | incidentReportsSlice.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../services/modules/incidentReportsApi | Dependencies: @reduxjs/toolkit, ../../services/modules/incidentReportsApi, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Incident Reports Redux Slice
 * Production-grade state management for incident reporting system
 *
 * Features:
 * - Complete CRUD operations for incident reports
 * - Witness statements management
 * - Follow-up actions tracking
 * - Advanced filtering and search
 * - Optimistic updates
 * - Normalized state structure
 * - Comprehensive error handling
 * - Multiple loading states
 *
 * @module incidentReportsSlice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { incidentReportsApi } from '../../services/modules/incidentReportsApi';
import {
  IncidentSeverity,
} from '../../types/incidents';
import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentReportFilters,
  IncidentSearchParams,
  IncidentType,
  IncidentStatus,
  CreateWitnessStatementRequest,
  CreateFollowUpActionRequest,
} from '../../types/incidents';
import toast from 'react-hot-toast';
import debug from 'debug';

const log = debug('whitecross:incident-reports-slice');

// =====================
// STATE INTERFACE
// =====================

/**
 * Sort configuration for incident reports list
 */
export interface SortConfig {
  column: 'occurredAt' | 'severity' | 'type' | 'status' | 'reportedAt';
  order: 'asc' | 'desc';
}

/**
 * View mode for incident reports display
 */
export type ViewMode = 'list' | 'grid' | 'detail';

/**
 * Pagination metadata
 */
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Loading states for different operations
 */
interface LoadingStates {
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
 * Error states for different operations
 */
interface ErrorStates {
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
 * Main state interface for incident reports
 */
interface IncidentReportsState {
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

// =====================
// INITIAL STATE
// =====================

const initialState: IncidentReportsState = {
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

// =====================
// ASYNC THUNKS
// =====================

/**
 * Fetch incident reports with pagination and filters
 * Supports comprehensive filtering by student, type, severity, status, and date range
 */
export const fetchIncidentReports = createAsyncThunk(
  'incidentReports/fetchIncidentReports',
  async (filters: IncidentReportFilters | undefined, { rejectWithValue }) => {
    try {
      log('Fetching incident reports with filters:', filters);
      const response = await incidentReportsApi.getAll(filters);
      return response;
    } catch (error: any) {
      log('Error fetching incident reports:', error);
      return rejectWithValue(error.message || 'Failed to fetch incident reports');
    }
  }
);

/**
 * Fetch single incident report by ID
 * Includes full associations: student, reporter, witness statements, follow-up actions
 */
export const fetchIncidentReportById = createAsyncThunk(
  'incidentReports/fetchIncidentReportById',
  async (id: string, { rejectWithValue }) => {
    try {
      log('Fetching incident report by ID:', id);
      const response = await incidentReportsApi.getById(id);
      return response.report;
    } catch (error: any) {
      log('Error fetching incident report:', error);
      return rejectWithValue(error.message || 'Failed to fetch incident report');
    }
  }
);

/**
 * Create new incident report
 * Implements optimistic updates for immediate UI feedback
 * Automatically notifies parents for high/critical severity incidents
 */
export const createIncidentReport = createAsyncThunk(
  'incidentReports/createIncidentReport',
  async (data: CreateIncidentReportRequest, { rejectWithValue }) => {
    try {
      log('Creating incident report:', data);
      const response = await incidentReportsApi.create(data);
      toast.success('Incident report created successfully');
      return response.report;
    } catch (error: any) {
      log('Error creating incident report:', error);
      toast.error(error.message || 'Failed to create incident report');
      return rejectWithValue(error.message || 'Failed to create incident report');
    }
  }
);

/**
 * Update existing incident report
 * Supports partial updates with optimistic UI updates
 */
export const updateIncidentReport = createAsyncThunk(
  'incidentReports/updateIncidentReport',
  async (
    { id, data }: { id: string; data: UpdateIncidentReportRequest },
    { rejectWithValue }
  ) => {
    try {
      log('Updating incident report:', id, data);
      const response = await incidentReportsApi.update(id, data);
      toast.success('Incident report updated successfully');
      return response.report;
    } catch (error: any) {
      log('Error updating incident report:', error);
      toast.error(error.message || 'Failed to update incident report');
      return rejectWithValue(error.message || 'Failed to update incident report');
    }
  }
);

/**
 * Delete incident report
 * Note: Use with caution - consider archiving instead for HIPAA compliance
 */
export const deleteIncidentReport = createAsyncThunk(
  'incidentReports/deleteIncidentReport',
  async (id: string, { rejectWithValue }) => {
    try {
      log('Deleting incident report:', id);
      await incidentReportsApi.delete(id);
      toast.success('Incident report deleted successfully');
      return id;
    } catch (error: any) {
      log('Error deleting incident report:', error);
      toast.error(error.message || 'Failed to delete incident report');
      return rejectWithValue(error.message || 'Failed to delete incident report');
    }
  }
);

/**
 * Search incident reports
 * Searches across description, location, actions taken, and student names
 */
export const searchIncidentReports = createAsyncThunk(
  'incidentReports/searchIncidentReports',
  async (params: IncidentSearchParams, { rejectWithValue }) => {
    try {
      log('Searching incident reports:', params);
      const response = await incidentReportsApi.search(params);
      return response;
    } catch (error: any) {
      log('Error searching incident reports:', error);
      return rejectWithValue(error.message || 'Failed to search incident reports');
    }
  }
);

/**
 * Fetch witness statements for current incident
 * Loads all witness statements associated with the selected incident
 */
export const fetchWitnessStatements = createAsyncThunk(
  'incidentReports/fetchWitnessStatements',
  async (incidentReportId: string, { rejectWithValue }) => {
    try {
      log('Fetching witness statements for incident:', incidentReportId);
      const response = await incidentReportsApi.getWitnessStatements(incidentReportId);
      return response.statements;
    } catch (error: any) {
      log('Error fetching witness statements:', error);
      return rejectWithValue(error.message || 'Failed to fetch witness statements');
    }
  }
);

/**
 * Create witness statement
 * Records statement from student, staff, parent, or other witness
 */
export const createWitnessStatement = createAsyncThunk(
  'incidentReports/createWitnessStatement',
  async (data: CreateWitnessStatementRequest, { rejectWithValue }) => {
    try {
      log('Creating witness statement:', data);
      const response = await incidentReportsApi.addWitnessStatement(data);
      toast.success('Witness statement added successfully');
      return response.statement;
    } catch (error: any) {
      log('Error creating witness statement:', error);
      toast.error(error.message || 'Failed to add witness statement');
      return rejectWithValue(error.message || 'Failed to add witness statement');
    }
  }
);

/**
 * Fetch follow-up actions for current incident
 * Loads all follow-up actions with assignment and completion tracking
 */
export const fetchFollowUpActions = createAsyncThunk(
  'incidentReports/fetchFollowUpActions',
  async (incidentReportId: string, { rejectWithValue }) => {
    try {
      log('Fetching follow-up actions for incident:', incidentReportId);
      const response = await incidentReportsApi.getFollowUpActions(incidentReportId);
      return response.actions;
    } catch (error: any) {
      log('Error fetching follow-up actions:', error);
      return rejectWithValue(error.message || 'Failed to fetch follow-up actions');
    }
  }
);

/**
 * Create follow-up action
 * Creates trackable action item with assignment and due date
 */
export const createFollowUpAction = createAsyncThunk(
  'incidentReports/createFollowUpAction',
  async (data: CreateFollowUpActionRequest, { rejectWithValue }) => {
    try {
      log('Creating follow-up action:', data);
      const response = await incidentReportsApi.addFollowUpAction(data);
      toast.success('Follow-up action created successfully');
      return response.action;
    } catch (error: any) {
      log('Error creating follow-up action:', error);
      toast.error(error.message || 'Failed to create follow-up action');
      return rejectWithValue(error.message || 'Failed to create follow-up action');
    }
  }
);

// =====================
// SLICE DEFINITION
// =====================

const incidentReportsSlice = createSlice({
  name: 'incidentReports',
  initialState,
  reducers: {
    /**
     * Set filters for incident reports list
     * Triggers cache invalidation to refetch data
     */
    setFilters: (state, action: PayloadAction<Partial<IncidentReportFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.cacheInvalidated = true;
      log('Filters updated:', state.filters);
    },

    /**
     * Set search query
     * Used for text-based search across incident reports
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      log('Search query set:', action.payload);
    },

    /**
     * Set selected incident report for detail view
     */
    setSelectedIncidentReport: (state, action: PayloadAction<IncidentReport>) => {
      state.selectedReport = action.payload;
      log('Selected incident report set:', action.payload.id);
    },

    /**
     * Clear selected incident report
     * Used when navigating away from detail view
     */
    clearSelectedIncident: (state) => {
      state.selectedReport = null;
      state.witnessStatements = [];
      state.followUpActions = [];
      state.errors.detail = null;
      log('Selected incident cleared');
    },

    /**
     * Set sort configuration
     * Updates sort column and order for list view
     */
    setSortOrder: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
      log('Sort order updated:', action.payload);
    },

    /**
     * Set view mode
     * Switches between list, grid, and detail views
     */
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
      log('View mode changed:', action.payload);
    },

    /**
     * Clear all errors
     * Used for dismissing error messages
     */
    clearErrors: (state) => {
      state.errors = initialState.errors;
      log('All errors cleared');
    },

    /**
     * Clear specific error
     * Used for dismissing individual error messages
     */
    clearError: (state, action: PayloadAction<keyof ErrorStates>) => {
      state.errors[action.payload] = null;
      log('Error cleared:', action.payload);
    },

    /**
     * Reset state to initial values
     * Used when logging out or changing context
     */
    resetState: (state) => {
      Object.assign(state, initialState);
      log('State reset to initial values');
    },

    /**
     * Invalidate cache
     * Forces refetch of data on next request
     */
    invalidateCache: (state) => {
      state.cacheInvalidated = true;
      state.lastFetched = null;
      log('Cache invalidated');
    },

    /**
     * Optimistic update for incident report
     * Updates local state immediately before API confirmation
     */
    optimisticUpdateReport: (
      state,
      action: PayloadAction<{ id: string; data: Partial<IncidentReport> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.reports.findIndex((report) => report.id === id);
      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...data };
      }
      if (state.selectedReport?.id === id) {
        state.selectedReport = { ...state.selectedReport, ...data };
      }
      log('Optimistic update applied:', id);
    },
  },

  extraReducers: (builder) => {
    builder
      // =====================
      // FETCH INCIDENT REPORTS
      // =====================
      .addCase(fetchIncidentReports.pending, (state) => {
        state.loading.list = true;
        state.errors.list = null;
      })
      .addCase(fetchIncidentReports.fulfilled, (state, action) => {
        state.reports = action.payload.reports;
        state.pagination = action.payload.pagination;
        state.loading.list = false;
        state.errors.list = null;
        state.lastFetched = Date.now();
        state.cacheInvalidated = false;
        log('Incident reports fetched successfully:', action.payload.reports.length);
      })
      .addCase(fetchIncidentReports.rejected, (state, action) => {
        state.loading.list = false;
        state.errors.list = action.payload as string;
        log('Error fetching incident reports:', action.payload);
      })

      // =====================
      // FETCH INCIDENT REPORT BY ID
      // =====================
      .addCase(fetchIncidentReportById.pending, (state) => {
        state.loading.detail = true;
        state.errors.detail = null;
      })
      .addCase(fetchIncidentReportById.fulfilled, (state, action) => {
        state.selectedReport = action.payload;
        state.loading.detail = false;
        state.errors.detail = null;
        log('Incident report fetched by ID:', action.payload.id);
      })
      .addCase(fetchIncidentReportById.rejected, (state, action) => {
        state.loading.detail = false;
        state.errors.detail = action.payload as string;
        log('Error fetching incident report by ID:', action.payload);
      })

      // =====================
      // CREATE INCIDENT REPORT
      // =====================
      .addCase(createIncidentReport.pending, (state) => {
        state.loading.creating = true;
        state.errors.create = null;
      })
      .addCase(createIncidentReport.fulfilled, (state, action) => {
        // Add new report to the beginning of the list
        state.reports.unshift(action.payload);
        state.pagination.total += 1;
        state.loading.creating = false;
        state.errors.create = null;
        state.cacheInvalidated = true;
        log('Incident report created:', action.payload.id);
      })
      .addCase(createIncidentReport.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.create = action.payload as string;
        log('Error creating incident report:', action.payload);
      })

      // =====================
      // UPDATE INCIDENT REPORT
      // =====================
      .addCase(updateIncidentReport.pending, (state) => {
        state.loading.updating = true;
        state.errors.update = null;
      })
      .addCase(updateIncidentReport.fulfilled, (state, action) => {
        // Update report in list
        const index = state.reports.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        // Update selected report if it's the same one
        if (state.selectedReport?.id === action.payload.id) {
          state.selectedReport = action.payload;
        }
        state.loading.updating = false;
        state.errors.update = null;
        state.cacheInvalidated = true;
        log('Incident report updated:', action.payload.id);
      })
      .addCase(updateIncidentReport.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.update = action.payload as string;
        log('Error updating incident report:', action.payload);
      })

      // =====================
      // DELETE INCIDENT REPORT
      // =====================
      .addCase(deleteIncidentReport.pending, (state) => {
        state.loading.deleting = true;
        state.errors.delete = null;
      })
      .addCase(deleteIncidentReport.fulfilled, (state, action) => {
        // Remove report from list
        state.reports = state.reports.filter((r) => r.id !== action.payload);
        state.pagination.total -= 1;
        // Clear selected report if it was deleted
        if (state.selectedReport?.id === action.payload) {
          state.selectedReport = null;
        }
        state.loading.deleting = false;
        state.errors.delete = null;
        state.cacheInvalidated = true;
        log('Incident report deleted:', action.payload);
      })
      .addCase(deleteIncidentReport.rejected, (state, action) => {
        state.loading.deleting = false;
        state.errors.delete = action.payload as string;
        log('Error deleting incident report:', action.payload);
      })

      // =====================
      // SEARCH INCIDENT REPORTS
      // =====================
      .addCase(searchIncidentReports.pending, (state) => {
        state.loading.searching = true;
        state.errors.search = null;
      })
      .addCase(searchIncidentReports.fulfilled, (state, action) => {
        state.searchResults = action.payload.reports;
        state.loading.searching = false;
        state.errors.search = null;
        log('Search completed:', action.payload.reports.length, 'results');
      })
      .addCase(searchIncidentReports.rejected, (state, action) => {
        state.loading.searching = false;
        state.errors.search = action.payload as string;
        log('Error searching incident reports:', action.payload);
      })

      // =====================
      // FETCH WITNESS STATEMENTS
      // =====================
      .addCase(fetchWitnessStatements.pending, (state) => {
        state.loading.witnesses = true;
        state.errors.witnesses = null;
      })
      .addCase(fetchWitnessStatements.fulfilled, (state, action) => {
        state.witnessStatements = action.payload;
        state.loading.witnesses = false;
        state.errors.witnesses = null;
        log('Witness statements fetched:', action.payload.length);
      })
      .addCase(fetchWitnessStatements.rejected, (state, action) => {
        state.loading.witnesses = false;
        state.errors.witnesses = action.payload as string;
        log('Error fetching witness statements:', action.payload);
      })

      // =====================
      // CREATE WITNESS STATEMENT
      // =====================
      .addCase(createWitnessStatement.fulfilled, (state, action) => {
        state.witnessStatements.push(action.payload);
        log('Witness statement created:', action.payload.id);
      })

      // =====================
      // FETCH FOLLOW-UP ACTIONS
      // =====================
      .addCase(fetchFollowUpActions.pending, (state) => {
        state.loading.actions = true;
        state.errors.actions = null;
      })
      .addCase(fetchFollowUpActions.fulfilled, (state, action) => {
        state.followUpActions = action.payload;
        state.loading.actions = false;
        state.errors.actions = null;
        log('Follow-up actions fetched:', action.payload.length);
      })
      .addCase(fetchFollowUpActions.rejected, (state, action) => {
        state.loading.actions = false;
        state.errors.actions = action.payload as string;
        log('Error fetching follow-up actions:', action.payload);
      })

      // =====================
      // CREATE FOLLOW-UP ACTION
      // =====================
      .addCase(createFollowUpAction.fulfilled, (state, action) => {
        state.followUpActions.push(action.payload);
        log('Follow-up action created:', action.payload.id);
      });
  },
});

// =====================
// EXPORTS
// =====================

export const {
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
} = incidentReportsSlice.actions;

export default incidentReportsSlice.reducer;

// =====================
// SELECTORS
// =====================

import type { RootState } from '../reduxStore';

/**
 * Select all incident reports
 */
export const selectIncidentReports = (state: RootState) =>
  state.incidentReports.reports;

/**
 * Select currently selected/active incident report
 */
export const selectCurrentIncident = (state: RootState) =>
  state.incidentReports.selectedReport;

/**
 * Select witness statements for current incident
 */
export const selectWitnessStatements = (state: RootState) =>
  state.incidentReports.witnessStatements;

/**
 * Select follow-up actions for current incident
 */
export const selectFollowUpActions = (state: RootState) =>
  state.incidentReports.followUpActions;

/**
 * Select search results
 */
export const selectSearchResults = (state: RootState) =>
  state.incidentReports.searchResults;

/**
 * Select pagination metadata
 */
export const selectPagination = (state: RootState) =>
  state.incidentReports.pagination;

/**
 * Select current filters
 */
export const selectFilters = (state: RootState) => state.incidentReports.filters;

/**
 * Select search query
 */
export const selectSearchQuery = (state: RootState) =>
  state.incidentReports.searchQuery;

/**
 * Select sort configuration
 */
export const selectSortConfig = (state: RootState) =>
  state.incidentReports.sortConfig;

/**
 * Select view mode
 */
export const selectViewMode = (state: RootState) => state.incidentReports.viewMode;

/**
 * Select all loading states
 */
export const selectLoadingStates = (state: RootState) =>
  state.incidentReports.loading;

/**
 * Select specific loading state
 */
export const selectIsLoading = (key: keyof LoadingStates) => (state: RootState) =>
  state.incidentReports.loading[key];

/**
 * Select all error states
 */
export const selectErrorStates = (state: RootState) => state.incidentReports.errors;

/**
 * Select specific error state
 */
export const selectError = (key: keyof ErrorStates) => (state: RootState) =>
  state.incidentReports.errors[key];

/**
 * Select whether cache is invalidated
 */
export const selectIsCacheInvalidated = (state: RootState) =>
  state.incidentReports.cacheInvalidated;

/**
 * Select last fetched timestamp
 */
export const selectLastFetched = (state: RootState) =>
  state.incidentReports.lastFetched;

/**
 * Select filtered and sorted incident reports
 * Applies client-side sorting based on current sort configuration
 */
export const selectFilteredAndSortedReports = (state: RootState) => {
  const { reports, sortConfig } = state.incidentReports;

  const sortedReports = [...reports].sort((a, b) => {
    const { column, order } = sortConfig;

    let aValue: any;
    let bValue: any;

    switch (column) {
      case 'occurredAt':
      case 'reportedAt':
        aValue = new Date(a[column] || 0).getTime();
        bValue = new Date(b[column] || 0).getTime();
        break;
      case 'severity':
        const severityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        aValue = severityOrder[a.severity] || 0;
        bValue = severityOrder[b.severity] || 0;
        break;
      default:
        aValue = a[column];
        bValue = b[column];
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedReports;
};

/**
 * Select incident reports by type
 */
export const selectIncidentsByType = (type: IncidentType) => (state: RootState) =>
  state.incidentReports.reports.filter((report) => report.type === type);

/**
 * Select incident reports by severity
 */
export const selectIncidentsBySeverity = (severity: IncidentSeverity) => (
  state: RootState
) => state.incidentReports.reports.filter((report) => report.severity === severity);

/**
 * Select incident reports by status
 */
export const selectIncidentsByStatus = (status: IncidentStatus) => (state: RootState) =>
  state.incidentReports.reports.filter((report) => report.status === status);

/**
 * Select incident reports requiring follow-up
 */
export const selectIncidentsRequiringFollowUp = (state: RootState) =>
  state.incidentReports.reports.filter((report) => report.followUpRequired);

/**
 * Select incident reports with unnotified parents
 */
export const selectIncidentsWithUnnotifiedParents = (state: RootState) =>
  state.incidentReports.reports.filter((report) => !report.parentNotified);

/**
 * Select critical incidents (HIGH or CRITICAL severity)
 */
export const selectCriticalIncidents = (state: RootState) =>
  state.incidentReports.reports.filter(
    (report) =>
      report.severity === IncidentSeverity.HIGH ||
      report.severity === IncidentSeverity.CRITICAL
  );

/**
 * Select statistics for current reports
 * Provides quick analytics on loaded incident reports
 */
export const selectReportStatistics = (state: RootState) => {
  const { reports } = state.incidentReports;

  return {
    total: reports.length,
    byType: reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    bySeverity: reports.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byStatus: reports.reduce((acc, report) => {
      acc[report.status || 'OPEN'] = (acc[report.status || 'OPEN'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    parentNotificationRate:
      reports.length > 0
        ? (reports.filter((r) => r.parentNotified).length / reports.length) * 100
        : 0,
    followUpRate:
      reports.length > 0
        ? (reports.filter((r) => r.followUpRequired).length / reports.length) * 100
        : 0,
  };
};
