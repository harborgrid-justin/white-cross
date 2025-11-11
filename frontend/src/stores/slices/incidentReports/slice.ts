/**
 * Incident Reports Store - Main Slice
 * 
 * Redux slice for incident reports state management
 * 
 * @module stores/slices/incidentReports/slice
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  IncidentReportsState,
  SortConfig,
  ViewMode,
  PaginationMeta
} from './types';
import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  IncidentReportFilters
} from '@/types/domain/incidents';
import {
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

/**
 * Initial state for incident reports slice
 */
const initialState: IncidentReportsState = {
  // Data arrays
  reports: [],
  witnessStatements: [],
  followUpActions: [],
  searchResults: [],
  
  // Current selections
  selectedReport: null,
  
  // UI state
  filters: {
    page: 1,
    limit: 20
  },
  searchQuery: '',
  sortConfig: {
    column: 'occurredAt',
    order: 'desc'
  },
  viewMode: 'list',
  
  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  
  // Loading states
  loading: {
    list: false,
    detail: false,
    witnesses: false,
    actions: false,
    creating: false,
    updating: false,
    deleting: false,
    searching: false
  },
  
  // Error states
  errors: {
    list: null,
    detail: null,
    witnesses: null,
    actions: null,
    create: null,
    update: null,
    delete: null,
    search: null
  },
  
  // Cache management
  cacheInvalidated: false,
  lastFetched: null
};

/**
 * Incident Reports Redux slice
 * 
 * Handles all state mutations for incident reporting functionality
 */
const incidentReportsSlice = createSlice({
  name: 'incidentReports',
  initialState,
  reducers: {
    // =====================
    // UI STATE ACTIONS
    // =====================

    /**
     * Set active incident report
     */
    setSelectedReport: (state, action: PayloadAction<IncidentReport | null>) => {
      state.selectedReport = action.payload;
    },

    /**
     * Update filter criteria
     */
    setFilters: (state, action: PayloadAction<Partial<IncidentReportFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filters change
      if (action.payload.page === undefined) {
        state.filters.page = 1;
      }
    },

    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: state.filters.limit || 20
      };
    },

    /**
     * Set search query
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    /**
     * Clear search query and results
     */
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },

    /**
     * Update sort configuration
     */
    setSortConfig: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
    },

    /**
     * Set view mode
     */
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },

    /**
     * Set pagination metadata
     */
    setPagination: (state, action: PayloadAction<PaginationMeta>) => {
      state.pagination = action.payload;
    },

    // =====================
    // ERROR MANAGEMENT
    // =====================

    /**
     * Clear specific error
     */
    clearError: (state, action: PayloadAction<keyof typeof state.errors>) => {
      state.errors[action.payload] = null;
    },

    /**
     * Clear all errors
     */
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach((key) => {
        state.errors[key as keyof typeof state.errors] = null;
      });
    },

    // =====================
    // CACHE MANAGEMENT
    // =====================

    /**
     * Mark cache as invalidated
     */
    invalidateCache: (state) => {
      state.cacheInvalidated = true;
    },

    /**
     * Mark cache as fresh
     */
    refreshCache: (state) => {
      state.cacheInvalidated = false;
      state.lastFetched = Date.now();
    },

    // =====================
    // DATA MANAGEMENT
    // =====================

    /**
     * Add incident report to store
     */
    addIncidentReport: (state, action: PayloadAction<IncidentReport>) => {
      state.reports.unshift(action.payload);
    },

    /**
     * Update incident report in store
     */
    updateIncidentReportInStore: (state, action: PayloadAction<IncidentReport>) => {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
      
      // Update selected report if it's the same one
      if (state.selectedReport?.id === action.payload.id) {
        state.selectedReport = action.payload;
      }
    },

    /**
     * Remove incident report from store
     */
    removeIncidentReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(report => report.id !== action.payload);
      
      // Clear selection if deleted report was selected
      if (state.selectedReport?.id === action.payload) {
        state.selectedReport = null;
      }
    },

    /**
     * Add witness statement to store
     */
    addWitnessStatement: (state, action: PayloadAction<WitnessStatement>) => {
      state.witnessStatements.push(action.payload);
    },

    /**
     * Update witness statement in store
     */
    updateWitnessStatementInStore: (state, action: PayloadAction<WitnessStatement>) => {
      const index = state.witnessStatements.findIndex(
        statement => statement.id === action.payload.id
      );
      if (index !== -1) {
        state.witnessStatements[index] = action.payload;
      }
    },

    /**
     * Remove witness statement from store
     */
    removeWitnessStatement: (state, action: PayloadAction<string>) => {
      state.witnessStatements = state.witnessStatements.filter(
        statement => statement.id !== action.payload
      );
    },

    /**
     * Add follow-up action to store
     */
    addFollowUpAction: (state, action: PayloadAction<FollowUpAction>) => {
      state.followUpActions.push(action.payload);
    },

    /**
     * Update follow-up action in store
     */
    updateFollowUpActionInStore: (state, action: PayloadAction<FollowUpAction>) => {
      const index = state.followUpActions.findIndex(
        followUpAction => followUpAction.id === action.payload.id
      );
      if (index !== -1) {
        state.followUpActions[index] = action.payload;
      }
    },

    /**
     * Remove follow-up action from store
     */
    removeFollowUpAction: (state, action: PayloadAction<string>) => {
      state.followUpActions = state.followUpActions.filter(
        followUpAction => followUpAction.id !== action.payload
      );
    }
  },

  extraReducers: (builder) => {
    // =====================
    // FETCH INCIDENT REPORTS
    // =====================

    builder
      .addCase(fetchIncidentReports.pending, (state) => {
        state.loading.list = true;
        state.errors.list = null;
      })
      .addCase(fetchIncidentReports.fulfilled, (state, action) => {
        state.loading.list = false;
        state.reports = action.payload.reports;
        state.pagination = action.payload.pagination;
        state.lastFetched = Date.now();
        state.cacheInvalidated = false;
      })
      .addCase(fetchIncidentReports.rejected, (state, action) => {
        state.loading.list = false;
        state.errors.list = action.payload as string;
      });

    // =====================
    // FETCH INCIDENT REPORT BY ID
    // =====================

    builder
      .addCase(fetchIncidentReportById.pending, (state) => {
        state.loading.detail = true;
        state.errors.detail = null;
      })
      .addCase(fetchIncidentReportById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchIncidentReportById.rejected, (state, action) => {
        state.loading.detail = false;
        state.errors.detail = action.payload as string;
      });

    // =====================
    // SEARCH INCIDENT REPORTS
    // =====================

    builder
      .addCase(searchIncidentReports.pending, (state) => {
        state.loading.searching = true;
        state.errors.search = null;
      })
      .addCase(searchIncidentReports.fulfilled, (state, action) => {
        state.loading.searching = false;
        state.searchResults = action.payload.reports;
      })
      .addCase(searchIncidentReports.rejected, (state, action) => {
        state.loading.searching = false;
        state.errors.search = action.payload as string;
      });

    // =====================
    // CREATE INCIDENT REPORT
    // =====================

    builder
      .addCase(createIncidentReport.pending, (state) => {
        state.loading.creating = true;
        state.errors.create = null;
      })
      .addCase(createIncidentReport.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.reports.unshift(action.payload.report);
        state.selectedReport = action.payload.report;
        state.cacheInvalidated = true;
      })
      .addCase(createIncidentReport.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.create = action.payload as string;
      });

    // =====================
    // UPDATE INCIDENT REPORT
    // =====================

    builder
      .addCase(updateIncidentReport.pending, (state) => {
        state.loading.updating = true;
        state.errors.update = null;
      })
      .addCase(updateIncidentReport.fulfilled, (state, action) => {
        state.loading.updating = false;
        
        const index = state.reports.findIndex(
          report => report.id === action.payload.report.id
        );
        if (index !== -1) {
          state.reports[index] = action.payload.report;
        }
        
        if (state.selectedReport?.id === action.payload.report.id) {
          state.selectedReport = action.payload.report;
        }
        
        state.cacheInvalidated = true;
      })
      .addCase(updateIncidentReport.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.update = action.payload as string;
      });

    // =====================
    // DELETE INCIDENT REPORT
    // =====================

    builder
      .addCase(deleteIncidentReport.pending, (state) => {
        state.loading.deleting = true;
        state.errors.delete = null;
      })
      .addCase(deleteIncidentReport.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.reports = state.reports.filter(
          report => report.id !== action.meta.arg
        );
        
        if (state.selectedReport?.id === action.meta.arg) {
          state.selectedReport = null;
        }
        
        state.cacheInvalidated = true;
      })
      .addCase(deleteIncidentReport.rejected, (state, action) => {
        state.loading.deleting = false;
        state.errors.delete = action.payload as string;
      });

    // =====================
    // FETCH WITNESS STATEMENTS
    // =====================

    builder
      .addCase(fetchWitnessStatements.pending, (state) => {
        state.loading.witnesses = true;
        state.errors.witnesses = null;
      })
      .addCase(fetchWitnessStatements.fulfilled, (state, action) => {
        state.loading.witnesses = false;
        state.witnessStatements = action.payload;
      })
      .addCase(fetchWitnessStatements.rejected, (state, action) => {
        state.loading.witnesses = false;
        state.errors.witnesses = action.payload as string;
      });

    // =====================
    // CREATE WITNESS STATEMENT
    // =====================

    builder
      .addCase(createWitnessStatement.pending, (state) => {
        state.loading.witnesses = true;
        state.errors.witnesses = null;
      })
      .addCase(createWitnessStatement.fulfilled, (state, action) => {
        state.loading.witnesses = false;
        state.witnessStatements.push(action.payload);
      })
      .addCase(createWitnessStatement.rejected, (state, action) => {
        state.loading.witnesses = false;
        state.errors.witnesses = action.payload as string;
      });

    // =====================
    // FETCH FOLLOW-UP ACTIONS
    // =====================

    builder
      .addCase(fetchFollowUpActions.pending, (state) => {
        state.loading.actions = true;
        state.errors.actions = null;
      })
      .addCase(fetchFollowUpActions.fulfilled, (state, action) => {
        state.loading.actions = false;
        state.followUpActions = action.payload;
      })
      .addCase(fetchFollowUpActions.rejected, (state, action) => {
        state.loading.actions = false;
        state.errors.actions = action.payload as string;
      });

    // =====================
    // CREATE FOLLOW-UP ACTION
    // =====================

    builder
      .addCase(createFollowUpAction.pending, (state) => {
        state.loading.actions = true;
        state.errors.actions = null;
      })
      .addCase(createFollowUpAction.fulfilled, (state, action) => {
        state.loading.actions = false;
        state.followUpActions.push(action.payload);
      })
      .addCase(createFollowUpAction.rejected, (state, action) => {
        state.loading.actions = false;
        state.errors.actions = action.payload as string;
      });
  }
});

// Export actions
export const {
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
} = incidentReportsSlice.actions;

// Export reducer
export default incidentReportsSlice.reducer;
