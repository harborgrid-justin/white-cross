/**
 * Configuration Redux Slice
 * Manages system configuration state with comprehensive service adapter integration
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { configurationApi } from '../../../services/configurationApi';
import type {
  SystemConfiguration,
  ConfigurationHistory,
  ConfigurationFilter,
  ConfigurationUpdate,
  CreateConfigurationPayload,
  BulkUpdatePayload,
  ImportConfigurationsPayload,
} from '../../../services/configurationApi';

// Service Adapter Class
export class ConfigurationApiService {
  // Configuration management
  async getConfigurations(filter?: ConfigurationFilter) {
    return await configurationApi.getAll(filter);
  }

  async getPublicConfigurations() {
    return await configurationApi.getPublic();
  }

  async getConfigurationByKey(key: string, scopeId?: string) {
    return await configurationApi.getByKey(key, scopeId);
  }

  async getConfigurationsByCategory(category: string, scopeId?: string) {
    return await configurationApi.getByCategory(category, scopeId);
  }

  async updateConfiguration(key: string, data: ConfigurationUpdate) {
    return await configurationApi.update(key, data);
  }

  async bulkUpdateConfigurations(data: BulkUpdatePayload) {
    return await configurationApi.bulkUpdate(data);
  }

  async createConfiguration(data: CreateConfigurationPayload) {
    return await configurationApi.create(data);
  }

  async deleteConfiguration(key: string, scopeId?: string) {
    return await configurationApi.delete(key, scopeId);
  }

  async resetConfigurationToDefault(key: string, scopeId?: string) {
    return await configurationApi.resetToDefault(key, scopeId);
  }

  // History and audit
  async getConfigurationHistory(key: string, limit?: number) {
    return await configurationApi.getHistory(key, limit);
  }

  async getRecentChanges(limit?: number) {
    return await configurationApi.getRecentChanges(limit);
  }

  async getChangesByUser(userId: string, limit?: number) {
    return await configurationApi.getChangesByUser(userId, limit);
  }

  // Import/Export
  async exportConfigurations(filter?: { category?: string; scope?: string }) {
    return await configurationApi.export(filter);
  }

  async importConfigurations(data: ImportConfigurationsPayload) {
    return await configurationApi.import(data);
  }
}

// Create service instance
const configurationService = new ConfigurationApiService();

// State interface
interface ConfigurationState {
  configurations: SystemConfiguration[];
  publicConfigurations: SystemConfiguration[];
  currentConfiguration: SystemConfiguration | null;
  history: ConfigurationHistory[];
  recentChanges: ConfigurationHistory[];
  categories: string[];
  selectedConfigurations: string[];
  filters: {
    category: string | null;
    subCategory: string | null;
    scope: string | null;
    scopeId: string | null;
    tags: string[];
    isPublic: boolean | null;
    isEditable: boolean | null;
    searchTerm: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  historyPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: {
    configurations: boolean;
    publicConfigurations: boolean;
    currentConfiguration: boolean;
    history: boolean;
    recentChanges: boolean;
    update: boolean;
    bulkUpdate: boolean;
    create: boolean;
    delete: boolean;
    reset: boolean;
    export: boolean;
    import: boolean;
  };
  error: {
    configurations: string | null;
    publicConfigurations: string | null;
    currentConfiguration: string | null;
    history: string | null;
    recentChanges: string | null;
    update: string | null;
    bulkUpdate: string | null;
    create: string | null;
    delete: string | null;
    reset: string | null;
    export: string | null;
    import: string | null;
  };
}

// Initial state
const initialState: ConfigurationState = {
  configurations: [],
  publicConfigurations: [],
  currentConfiguration: null,
  history: [],
  recentChanges: [],
  categories: [],
  selectedConfigurations: [],
  filters: {
    category: null,
    subCategory: null,
    scope: null,
    scopeId: null,
    tags: [],
    isPublic: null,
    isEditable: null,
    searchTerm: '',
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },
  historyPagination: {
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  },
  loading: {
    configurations: false,
    publicConfigurations: false,
    currentConfiguration: false,
    history: false,
    recentChanges: false,
    update: false,
    bulkUpdate: false,
    create: false,
    delete: false,
    reset: false,
    export: false,
    import: false,
  },
  error: {
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
  },
};

// Async thunks
export const fetchConfigurations = createAsyncThunk(
  'configuration/fetchConfigurations',
  async (filter?: ConfigurationFilter) => {
    const response = await configurationService.getConfigurations(filter);
    return response;
  }
);

export const fetchPublicConfigurations = createAsyncThunk(
  'configuration/fetchPublicConfigurations',
  async () => {
    const response = await configurationService.getPublicConfigurations();
    return response;
  }
);

export const fetchConfigurationByKey = createAsyncThunk(
  'configuration/fetchConfigurationByKey',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    const response = await configurationService.getConfigurationByKey(key, scopeId);
    return response;
  }
);

export const fetchConfigurationsByCategory = createAsyncThunk(
  'configuration/fetchConfigurationsByCategory',
  async ({ category, scopeId }: { category: string; scopeId?: string }) => {
    const response = await configurationService.getConfigurationsByCategory(category, scopeId);
    return response;
  }
);

export const updateConfiguration = createAsyncThunk(
  'configuration/updateConfiguration',
  async ({ key, data }: { key: string; data: ConfigurationUpdate }) => {
    const response = await configurationService.updateConfiguration(key, data);
    return { key, ...response };
  }
);

export const bulkUpdateConfigurations = createAsyncThunk(
  'configuration/bulkUpdateConfigurations',
  async (data: BulkUpdatePayload) => {
    const response = await configurationService.bulkUpdateConfigurations(data);
    return response;
  }
);

export const createConfiguration = createAsyncThunk(
  'configuration/createConfiguration',
  async (data: CreateConfigurationPayload) => {
    const response = await configurationService.createConfiguration(data);
    return response;
  }
);

export const deleteConfiguration = createAsyncThunk(
  'configuration/deleteConfiguration',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    await configurationService.deleteConfiguration(key, scopeId);
    return { key, scopeId };
  }
);

export const resetConfigurationToDefault = createAsyncThunk(
  'configuration/resetConfigurationToDefault',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    const response = await configurationService.resetConfigurationToDefault(key, scopeId);
    return { key, ...response };
  }
);

export const fetchConfigurationHistory = createAsyncThunk(
  'configuration/fetchConfigurationHistory',
  async ({ key, limit }: { key: string; limit?: number }) => {
    const response = await configurationService.getConfigurationHistory(key, limit);
    return response;
  }
);

export const fetchRecentChanges = createAsyncThunk(
  'configuration/fetchRecentChanges',
  async (limit?: number) => {
    const response = await configurationService.getRecentChanges(limit);
    return response;
  }
);

export const fetchChangesByUser = createAsyncThunk(
  'configuration/fetchChangesByUser',
  async ({ userId, limit }: { userId: string; limit?: number }) => {
    const response = await configurationService.getChangesByUser(userId, limit);
    return response;
  }
);

export const exportConfigurations = createAsyncThunk(
  'configuration/exportConfigurations',
  async (filter?: { category?: string; scope?: string }) => {
    const response = await configurationService.exportConfigurations(filter);
    return response;
  }
);

export const importConfigurations = createAsyncThunk(
  'configuration/importConfigurations',
  async (data: ImportConfigurationsPayload) => {
    const response = await configurationService.importConfigurations(data);
    return response;
  }
);

// Slice
const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    clearCurrentConfiguration: (state) => {
      state.currentConfiguration = null;
      state.error.currentConfiguration = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ConfigurationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset pagination when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<ConfigurationState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setHistoryPagination: (state, action: PayloadAction<Partial<ConfigurationState['historyPagination']>>) => {
      state.historyPagination = { ...state.historyPagination, ...action.payload };
    },
    toggleConfigurationSelection: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      const index = state.selectedConfigurations.indexOf(key);
      if (index > -1) {
        state.selectedConfigurations.splice(index, 1);
      } else {
        state.selectedConfigurations.push(key);
      }
    },
    selectAllConfigurations: (state) => {
      state.selectedConfigurations = state.configurations.map(c => c.key);
    },
    clearSelection: (state) => {
      state.selectedConfigurations = [];
    },
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
    // Fetch configurations
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

    // Fetch public configurations
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

    // Fetch configuration by key
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

    // Update configuration
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

    // Create configuration
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

    // Delete configuration
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

    // Fetch configuration history
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

    // Fetch recent changes
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

    // Bulk update
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

    // Export configurations
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

    // Import configurations
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

// Selectors
export const selectConfigurations = (state: { configuration: ConfigurationState }) => state.configuration.configurations;
export const selectPublicConfigurations = (state: { configuration: ConfigurationState }) => state.configuration.publicConfigurations;
export const selectCurrentConfiguration = (state: { configuration: ConfigurationState }) => state.configuration.currentConfiguration;
export const selectHistory = (state: { configuration: ConfigurationState }) => state.configuration.history;
export const selectRecentChanges = (state: { configuration: ConfigurationState }) => state.configuration.recentChanges;
export const selectCategories = (state: { configuration: ConfigurationState }) => state.configuration.categories;
export const selectSelectedConfigurations = (state: { configuration: ConfigurationState }) => state.configuration.selectedConfigurations;
export const selectFilters = (state: { configuration: ConfigurationState }) => state.configuration.filters;
export const selectPagination = (state: { configuration: ConfigurationState }) => state.configuration.pagination;
export const selectHistoryPagination = (state: { configuration: ConfigurationState }) => state.configuration.historyPagination;
export const selectLoading = (state: { configuration: ConfigurationState }) => state.configuration.loading;
export const selectErrors = (state: { configuration: ConfigurationState }) => state.configuration.error;

// Advanced selectors
export const selectFilteredConfigurations = createSelector(
  [selectConfigurations, selectFilters],
  (configurations, filters) => {
    return configurations.filter(config => {
      if (filters.category && config.category !== filters.category) return false;
      if (filters.subCategory && config.subCategory !== filters.subCategory) return false;
      if (filters.scope && config.scope !== filters.scope) return false;
      if (filters.scopeId && config.scopeId !== filters.scopeId) return false;
      if (filters.isPublic !== null && config.isPublic !== filters.isPublic) return false;
      if (filters.isEditable !== null && config.isEditable !== filters.isEditable) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => config.tags.includes(tag))) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return config.key.toLowerCase().includes(term) ||
               config.description?.toLowerCase().includes(term) ||
               config.category.toLowerCase().includes(term);
      }
      return true;
    });
  }
);

export const selectConfigurationsByCategory = createSelector(
  [selectConfigurations],
  (configurations) => {
    const grouped: Record<string, SystemConfiguration[]> = {};
    configurations.forEach(config => {
      if (!grouped[config.category]) {
        grouped[config.category] = [];
      }
      grouped[config.category].push(config);
    });
    return grouped;
  }
);

export const selectEditableConfigurations = createSelector(
  [selectConfigurations],
  (configurations) => configurations.filter(c => c.isEditable)
);

export const selectConfigurationsRequiringRestart = createSelector(
  [selectConfigurations],
  (configurations) => configurations.filter(c => c.requiresRestart)
);

export const selectConfigurationMetrics = createSelector(
  [selectConfigurations],
  (configurations) => {
    const total = configurations.length;
    const editable = configurations.filter(c => c.isEditable).length;
    const publicCount = configurations.filter(c => c.isPublic).length;
    const requiresRestart = configurations.filter(c => c.requiresRestart).length;
    const categories = new Set(configurations.map(c => c.category)).size;

    return {
      total,
      editable,
      public: publicCount,
      requiresRestart,
      categories,
    };
  }
);

export default configurationSlice.reducer;
