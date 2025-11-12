/**
 * Configuration Store - Main Slice
 * 
 * Redux slice for configuration state management
 * 
 * @module stores/slices/configuration/slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './types';
import type { ConfigurationState } from './types';
import {
  fetchConfigurations,
  fetchPublicConfigurations,
  fetchConfigurationByKey,
  updateConfiguration,
  createConfiguration,
  deleteConfiguration,
  bulkUpdateConfigurations,
} from './thunks/configurationThunks';
import {
  fetchConfigurationHistory,
  fetchRecentChanges,
} from './thunks/historyThunks';
import {
  exportConfigurations,
  importConfigurations,
} from './thunks/importExportThunks';

/**
 * Configuration slice with reducers and async thunk handlers
 */
const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    /**
     * Clear the current configuration detail
     */
    clearCurrentConfiguration: (state) => {
      state.currentConfiguration = null;
      state.error.currentConfiguration = null;
    },
    
    /**
     * Set filter criteria for configurations list
     */
    setFilters: (state, action: PayloadAction<Partial<ConfigurationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset pagination when filters change
    },
    
    /**
     * Update pagination settings
     */
    setPagination: (state, action: PayloadAction<Partial<ConfigurationState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    /**
     * Update history pagination settings
     */
    setHistoryPagination: (state, action: PayloadAction<Partial<ConfigurationState['historyPagination']>>) => {
      state.historyPagination = { ...state.historyPagination, ...action.payload };
    },
    
    /**
     * Toggle selection of a configuration (for bulk operations)
     */
    toggleConfigurationSelection: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      const index = state.selectedConfigurations.indexOf(key);
      if (index > -1) {
        state.selectedConfigurations.splice(index, 1);
      } else {
        state.selectedConfigurations.push(key);
      }
    },
    
    /**
     * Select all configurations
     */
    selectAllConfigurations: (state) => {
      state.selectedConfigurations = state.configurations.map(c => c.key);
    },
    
    /**
     * Clear all selections
     */
    clearSelection: (state) => {
      state.selectedConfigurations = [];
    },
    
    /**
     * Clear all error messages
     */
    clearErrors: (state) => {
      state.error = {
        configurations: null,
        publicConfigurations: null,
        currentConfiguration: null,
        history: null,
        recentChanges: null,
        update: null,
        bulkUpdate: null,
        create: null,
        delete: null,
        reset: null,
        export: null,
        import: null,
      };
    },
  },
  extraReducers: (builder) => {
    // ========================================================================
    // Fetch configurations
    // ========================================================================
    builder
      .addCase(fetchConfigurations.pending, (state) => {
        state.loading.configurations = true;
        state.error.configurations = null;
      })
      .addCase(fetchConfigurations.fulfilled, (state, action) => {
        state.loading.configurations = false;
        state.configurations = action.payload.data || [];
        state.categories = [...new Set(state.configurations.map(c => c.category))].sort();
        state.pagination.total = action.payload.total || state.configurations.length;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      .addCase(fetchConfigurations.rejected, (state, action) => {
        state.loading.configurations = false;
        state.error.configurations = action.error.message || 'Failed to fetch configurations';
      });

    // ========================================================================
    // Fetch public configurations
    // ========================================================================
    builder
      .addCase(fetchPublicConfigurations.pending, (state) => {
        state.loading.publicConfigurations = true;
        state.error.publicConfigurations = null;
      })
      .addCase(fetchPublicConfigurations.fulfilled, (state, action) => {
        state.loading.publicConfigurations = false;
        state.publicConfigurations = action.payload.data || [];
      })
      .addCase(fetchPublicConfigurations.rejected, (state, action) => {
        state.loading.publicConfigurations = false;
        state.error.publicConfigurations = action.error.message || 'Failed to fetch public configurations';
      });

    // ========================================================================
    // Fetch configuration by key
    // ========================================================================
    builder
      .addCase(fetchConfigurationByKey.pending, (state) => {
        state.loading.currentConfiguration = true;
        state.error.currentConfiguration = null;
      })
      .addCase(fetchConfigurationByKey.fulfilled, (state, action) => {
        state.loading.currentConfiguration = false;
        state.currentConfiguration = action.payload.data;
      })
      .addCase(fetchConfigurationByKey.rejected, (state, action) => {
        state.loading.currentConfiguration = false;
        state.error.currentConfiguration = action.error.message || 'Failed to fetch configuration';
      });

    // ========================================================================
    // Update configuration
    // ========================================================================
    builder
      .addCase(updateConfiguration.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateConfiguration.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.configurations.findIndex(c => c.key === action.payload.key);
        if (index > -1 && action.payload.data) {
          state.configurations[index] = action.payload.data;
        }
        if (state.currentConfiguration?.key === action.payload.key && action.payload.data) {
          state.currentConfiguration = action.payload.data;
        }
      })
      .addCase(updateConfiguration.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error.message || 'Failed to update configuration';
      });

    // ========================================================================
    // Create configuration
    // ========================================================================
    builder
      .addCase(createConfiguration.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createConfiguration.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload.data) {
          state.configurations.push(action.payload.data);
          state.pagination.total += 1;
        }
      })
      .addCase(createConfiguration.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error.message || 'Failed to create configuration';
      });

    // ========================================================================
    // Delete configuration
    // ========================================================================
    builder
      .addCase(deleteConfiguration.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteConfiguration.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.configurations = state.configurations.filter(c => c.key !== action.payload.key);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentConfiguration?.key === action.payload.key) {
          state.currentConfiguration = null;
        }
      })
      .addCase(deleteConfiguration.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.error.message || 'Failed to delete configuration';
      });

    // ========================================================================
    // Fetch configuration history
    // ========================================================================
    builder
      .addCase(fetchConfigurationHistory.pending, (state) => {
        state.loading.history = true;
        state.error.history = null;
      })
      .addCase(fetchConfigurationHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.history = action.payload.data || [];
        state.historyPagination.total = action.payload.total || state.history.length;
        state.historyPagination.totalPages = Math.ceil(state.historyPagination.total / state.historyPagination.limit);
      })
      .addCase(fetchConfigurationHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error.history = action.error.message || 'Failed to fetch configuration history';
      });

    // ========================================================================
    // Fetch recent changes
    // ========================================================================
    builder
      .addCase(fetchRecentChanges.pending, (state) => {
        state.loading.recentChanges = true;
        state.error.recentChanges = null;
      })
      .addCase(fetchRecentChanges.fulfilled, (state, action) => {
        state.loading.recentChanges = false;
        state.recentChanges = action.payload.data || [];
      })
      .addCase(fetchRecentChanges.rejected, (state, action) => {
        state.loading.recentChanges = false;
        state.error.recentChanges = action.error.message || 'Failed to fetch recent changes';
      });

    // ========================================================================
    // Bulk update
    // ========================================================================
    builder
      .addCase(bulkUpdateConfigurations.pending, (state) => {
        state.loading.bulkUpdate = true;
        state.error.bulkUpdate = null;
      })
      .addCase(bulkUpdateConfigurations.fulfilled, (state, action) => {
        state.loading.bulkUpdate = false;
        // Refresh configurations after bulk update
        state.selectedConfigurations = [];
      })
      .addCase(bulkUpdateConfigurations.rejected, (state, action) => {
        state.loading.bulkUpdate = false;
        state.error.bulkUpdate = action.error.message || 'Failed to bulk update configurations';
      });

    // ========================================================================
    // Export configurations
    // ========================================================================
    builder
      .addCase(exportConfigurations.pending, (state) => {
        state.loading.export = true;
        state.error.export = null;
      })
      .addCase(exportConfigurations.fulfilled, (state, action) => {
        state.loading.export = false;
      })
      .addCase(exportConfigurations.rejected, (state, action) => {
        state.loading.export = false;
        state.error.export = action.error.message || 'Failed to export configurations';
      });

    // ========================================================================
    // Import configurations
    // ========================================================================
    builder
      .addCase(importConfigurations.pending, (state) => {
        state.loading.import = true;
        state.error.import = null;
      })
      .addCase(importConfigurations.fulfilled, (state, action) => {
        state.loading.import = false;
      })
      .addCase(importConfigurations.rejected, (state, action) => {
        state.loading.import = false;
        state.error.import = action.error.message || 'Failed to import configurations';
      });
  },
});

// Export actions
export const {
  clearCurrentConfiguration,
  setFilters,
  setPagination,
  setHistoryPagination,
  toggleConfigurationSelection,
  selectAllConfigurations,
  clearSelection,
  clearErrors,
} = configurationSlice.actions;

// Export reducer
export default configurationSlice.reducer;
