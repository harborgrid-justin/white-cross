/**
 * Integration Redux Slice
 * Manages integration state with comprehensive service adapter integration
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { integrationApi } from '../../../services/modules/integrationApi';
import type {
  IntegrationType,
  IntegrationStatus,
  IntegrationConfig,
  IntegrationLog,
  IntegrationSettings,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  ConnectionTestResult,
  SyncResult,
  IntegrationStatistics,
  LogFilters,
  IntegrationListResponse,
  IntegrationResponse,
  IntegrationLogsResponse,
  IntegrationStatisticsResponse,
  BatchOperationResult,
  IntegrationHealthStatusResponse,
  SyncStatus,
} from '../../../types/integrations';

// Service Adapter Class
export class IntegrationApiService {
  // Core integration management
  async getIntegrations(type?: IntegrationType) {
    return await integrationApi.getAll(type);
  }

  async getIntegrationById(id: string) {
    return await integrationApi.getById(id);
  }

  async createIntegration(data: CreateIntegrationRequest) {
    return await integrationApi.create(data);
  }

  async updateIntegration(id: string, data: UpdateIntegrationRequest) {
    return await integrationApi.update(id, data);
  }

  async deleteIntegration(id: string) {
    return await integrationApi.delete(id);
  }

  // Connection and sync operations
  async testConnection(id: string) {
    return await integrationApi.testConnection(id);
  }

  async syncIntegration(id: string) {
    return await integrationApi.sync(id);
  }

  // Logging and monitoring
  async getIntegrationLogs(id: string, filters: LogFilters = {}) {
    return await integrationApi.getLogs(id, filters);
  }

  async getAllLogs(filters: LogFilters = {}) {
    return await integrationApi.getAllLogs(filters);
  }

  async getStatistics() {
    return await integrationApi.getStatistics();
  }

  async getHealthStatus() {
    return await integrationApi.getHealthStatus();
  }

  // Batch operations
  async batchEnableIntegrations(ids: string[]) {
    return await integrationApi.batchEnable(ids);
  }

  async batchDisableIntegrations(ids: string[]) {
    return await integrationApi.batchDisable(ids);
  }
}

// Create service instance
const integrationService = new IntegrationApiService();

// State interface
interface IntegrationState {
  integrations: IntegrationConfig[];
  currentIntegration: IntegrationConfig | null;
  logs: IntegrationLog[];
  statistics: IntegrationStatistics | null;
  healthStatus: any | null;
  connectionTests: Record<string, ConnectionTestResult>;
  syncResults: Record<string, SyncResult>;
  selectedIntegrationIds: string[];
  filters: {
    type: IntegrationType | null;
    status: IntegrationStatus | null;
    searchTerm: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  logPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: {
    integrations: boolean;
    currentIntegration: boolean;
    logs: boolean;
    statistics: boolean;
    healthStatus: boolean;
    connectionTest: boolean;
    sync: boolean;
    batchOperations: boolean;
  };
  error: {
    integrations: string | null;
    currentIntegration: string | null;
    logs: string | null;
    statistics: string | null;
    healthStatus: string | null;
    connectionTest: string | null;
    sync: string | null;
    batchOperations: string | null;
  };
}

// Initial state
const initialState: IntegrationState = {
  integrations: [],
  currentIntegration: null,
  logs: [],
  statistics: null,
  healthStatus: null,
  connectionTests: {},
  syncResults: {},
  selectedIntegrationIds: [],
  filters: {
    type: null,
    status: null,
    searchTerm: '',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  logPagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },
  loading: {
    integrations: false,
    currentIntegration: false,
    logs: false,
    statistics: false,
    healthStatus: false,
    connectionTest: false,
    sync: false,
    batchOperations: false,
  },
  error: {
    integrations: null,
    currentIntegration: null,
    logs: null,
    statistics: null,
    healthStatus: null,
    connectionTest: null,
    sync: null,
    batchOperations: null,
  },
};

// Async thunks
export const fetchIntegrations = createAsyncThunk(
  'integration/fetchIntegrations',
  async (type?: IntegrationType) => {
    const response = await integrationService.getIntegrations(type);
    return response;
  }
);

export const fetchIntegrationById = createAsyncThunk(
  'integration/fetchIntegrationById',
  async (id: string) => {
    const response = await integrationService.getIntegrationById(id);
    return response;
  }
);

export const createIntegration = createAsyncThunk(
  'integration/createIntegration',
  async (data: CreateIntegrationRequest) => {
    const response = await integrationService.createIntegration(data);
    return response;
  }
);

export const updateIntegration = createAsyncThunk(
  'integration/updateIntegration',
  async ({ id, data }: { id: string; data: UpdateIntegrationRequest }) => {
    const response = await integrationService.updateIntegration(id, data);
    return response;
  }
);

export const deleteIntegration = createAsyncThunk(
  'integration/deleteIntegration',
  async (id: string) => {
    await integrationService.deleteIntegration(id);
    return id;
  }
);

export const testConnection = createAsyncThunk(
  'integration/testConnection',
  async (id: string) => {
    const response = await integrationService.testConnection(id);
    return { id, result: response.result };
  }
);

export const syncIntegration = createAsyncThunk(
  'integration/syncIntegration',
  async (id: string) => {
    const response = await integrationService.syncIntegration(id);
    return { id, result: response.result };
  }
);

export const fetchIntegrationLogs = createAsyncThunk(
  'integration/fetchIntegrationLogs',
  async ({ id, filters }: { id: string; filters?: LogFilters }) => {
    const response = await integrationService.getIntegrationLogs(id, filters);
    return response;
  }
);

export const fetchAllLogs = createAsyncThunk(
  'integration/fetchAllLogs',
  async (filters?: LogFilters) => {
    const response = await integrationService.getAllLogs(filters);
    return response;
  }
);

export const fetchStatistics = createAsyncThunk(
  'integration/fetchStatistics',
  async () => {
    const response = await integrationService.getStatistics();
    return response;
  }
);

export const fetchHealthStatus = createAsyncThunk(
  'integration/fetchHealthStatus',
  async () => {
    const response = await integrationService.getHealthStatus();
    return response;
  }
);

export const batchEnableIntegrations = createAsyncThunk(
  'integration/batchEnableIntegrations',
  async (ids: string[]) => {
    const response = await integrationService.batchEnableIntegrations(ids);
    return response;
  }
);

export const batchDisableIntegrations = createAsyncThunk(
  'integration/batchDisableIntegrations',
  async (ids: string[]) => {
    const response = await integrationService.batchDisableIntegrations(ids);
    return response;
  }
);

// Slice
const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    clearCurrentIntegration: (state) => {
      state.currentIntegration = null;
      state.error.currentIntegration = null;
    },
    setFilters: (state, action: PayloadAction<Partial<IntegrationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset pagination when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<IntegrationState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLogPagination: (state, action: PayloadAction<Partial<IntegrationState['logPagination']>>) => {
      state.logPagination = { ...state.logPagination, ...action.payload };
    },
    toggleIntegrationSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIntegrationIds.indexOf(id);
      if (index > -1) {
        state.selectedIntegrationIds.splice(index, 1);
      } else {
        state.selectedIntegrationIds.push(id);
      }
    },
    selectAllIntegrations: (state) => {
      state.selectedIntegrationIds = state.integrations.map(i => i.id);
    },
    clearSelection: (state) => {
      state.selectedIntegrationIds = [];
    },
    clearErrors: (state) => {
      state.error = {
        integrations: null,
        currentIntegration: null,
        logs: null,
        statistics: null,
        healthStatus: null,
        connectionTest: null,
        sync: null,
        batchOperations: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch integrations
    builder
      .addCase(fetchIntegrations.pending, (state) => {
        state.loading.integrations = true;
        state.error.integrations = null;
      })
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.loading.integrations = false;
        state.integrations = action.payload.integrations;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = Math.ceil(action.payload.total / state.pagination.limit);
      })
      .addCase(fetchIntegrations.rejected, (state, action) => {
        state.loading.integrations = false;
        state.error.integrations = action.error.message || 'Failed to fetch integrations';
      });

    // Fetch integration by ID
    builder
      .addCase(fetchIntegrationById.pending, (state) => {
        state.loading.currentIntegration = true;
        state.error.currentIntegration = null;
      })
      .addCase(fetchIntegrationById.fulfilled, (state, action) => {
        state.loading.currentIntegration = false;
        state.currentIntegration = action.payload.integration;
      })
      .addCase(fetchIntegrationById.rejected, (state, action) => {
        state.loading.currentIntegration = false;
        state.error.currentIntegration = action.error.message || 'Failed to fetch integration';
      });

    // Create integration
    builder
      .addCase(createIntegration.fulfilled, (state, action) => {
        state.integrations.push(action.payload.integration);
        state.pagination.total += 1;
      });

    // Update integration
    builder
      .addCase(updateIntegration.fulfilled, (state, action) => {
        const index = state.integrations.findIndex(i => i.id === action.payload.integration.id);
        if (index > -1) {
          state.integrations[index] = action.payload.integration;
        }
        if (state.currentIntegration?.id === action.payload.integration.id) {
          state.currentIntegration = action.payload.integration;
        }
      });

    // Delete integration
    builder
      .addCase(deleteIntegration.fulfilled, (state, action) => {
        state.integrations = state.integrations.filter(i => i.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentIntegration?.id === action.payload) {
          state.currentIntegration = null;
        }
      });

    // Test connection
    builder
      .addCase(testConnection.pending, (state) => {
        state.loading.connectionTest = true;
        state.error.connectionTest = null;
      })
      .addCase(testConnection.fulfilled, (state, action) => {
        state.loading.connectionTest = false;
        state.connectionTests[action.payload.id] = action.payload.result;
      })
      .addCase(testConnection.rejected, (state, action) => {
        state.loading.connectionTest = false;
        state.error.connectionTest = action.error.message || 'Connection test failed';
      });

    // Sync integration
    builder
      .addCase(syncIntegration.pending, (state) => {
        state.loading.sync = true;
        state.error.sync = null;
      })
      .addCase(syncIntegration.fulfilled, (state, action) => {
        state.loading.sync = false;
        state.syncResults[action.payload.id] = action.payload.result;
      })
      .addCase(syncIntegration.rejected, (state, action) => {
        state.loading.sync = false;
        state.error.sync = action.error.message || 'Sync failed';
      });

    // Fetch logs
    builder
      .addCase(fetchAllLogs.pending, (state) => {
        state.loading.logs = true;
        state.error.logs = null;
      })
      .addCase(fetchAllLogs.fulfilled, (state, action) => {
        state.loading.logs = false;
        state.logs = action.payload.logs;
        state.logPagination.total = action.payload.pagination.total;
        state.logPagination.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchAllLogs.rejected, (state, action) => {
        state.loading.logs = false;
        state.error.logs = action.error.message || 'Failed to fetch logs';
      });

    // Fetch statistics
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading.statistics = true;
        state.error.statistics = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading.statistics = false;
        state.statistics = action.payload.statistics;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading.statistics = false;
        state.error.statistics = action.error.message || 'Failed to fetch statistics';
      });

    // Fetch health status
    builder
      .addCase(fetchHealthStatus.pending, (state) => {
        state.loading.healthStatus = true;
        state.error.healthStatus = null;
      })
      .addCase(fetchHealthStatus.fulfilled, (state, action) => {
        state.loading.healthStatus = false;
        state.healthStatus = action.payload;
      })
      .addCase(fetchHealthStatus.rejected, (state, action) => {
        state.loading.healthStatus = false;
        state.error.healthStatus = action.error.message || 'Failed to fetch health status';
      });

    // Batch operations
    builder
      .addCase(batchEnableIntegrations.pending, (state) => {
        state.loading.batchOperations = true;
        state.error.batchOperations = null;
      })
      .addCase(batchEnableIntegrations.fulfilled, (state, action) => {
        state.loading.batchOperations = false;
        // Update integration statuses based on successful operations
        state.selectedIntegrationIds.forEach(id => {
          const integration = state.integrations.find(i => i.id === id);
          if (integration) {
            integration.isActive = true;
          }
        });
      })
      .addCase(batchEnableIntegrations.rejected, (state, action) => {
        state.loading.batchOperations = false;
        state.error.batchOperations = action.error.message || 'Batch enable failed';
      })
      .addCase(batchDisableIntegrations.fulfilled, (state, action) => {
        state.loading.batchOperations = false;
        // Update integration statuses based on successful operations
        state.selectedIntegrationIds.forEach(id => {
          const integration = state.integrations.find(i => i.id === id);
          if (integration) {
            integration.isActive = false;
          }
        });
      })
      .addCase(batchDisableIntegrations.rejected, (state, action) => {
        state.loading.batchOperations = false;
        state.error.batchOperations = action.error.message || 'Batch disable failed';
      });
  },
});

// Export actions
export const {
  clearCurrentIntegration,
  setFilters,
  setPagination,
  setLogPagination,
  toggleIntegrationSelection,
  selectAllIntegrations,
  clearSelection,
  clearErrors,
} = integrationSlice.actions;

// Selectors
export const selectIntegrations = (state: { integration: IntegrationState }) => state.integration.integrations;
export const selectCurrentIntegration = (state: { integration: IntegrationState }) => state.integration.currentIntegration;
export const selectLogs = (state: { integration: IntegrationState }) => state.integration.logs;
export const selectStatistics = (state: { integration: IntegrationState }) => state.integration.statistics;
export const selectHealthStatus = (state: { integration: IntegrationState }) => state.integration.healthStatus;
export const selectConnectionTests = (state: { integration: IntegrationState }) => state.integration.connectionTests;
export const selectSyncResults = (state: { integration: IntegrationState }) => state.integration.syncResults;
export const selectSelectedIntegrationIds = (state: { integration: IntegrationState }) => state.integration.selectedIntegrationIds;
export const selectFilters = (state: { integration: IntegrationState }) => state.integration.filters;
export const selectPagination = (state: { integration: IntegrationState }) => state.integration.pagination;
export const selectLogPagination = (state: { integration: IntegrationState }) => state.integration.logPagination;
export const selectLoading = (state: { integration: IntegrationState }) => state.integration.loading;
export const selectErrors = (state: { integration: IntegrationState }) => state.integration.error;

// Advanced selectors
export const selectFilteredIntegrations = createSelector(
  [selectIntegrations, selectFilters],
  (integrations, filters) => {
    return integrations.filter(integration => {
      if (filters.type && integration.type !== filters.type) return false;
      if (filters.status && integration.status !== filters.status) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return integration.name.toLowerCase().includes(term) ||
               integration.type.toLowerCase().includes(term);
      }
      return true;
    });
  }
);

export const selectActiveIntegrations = createSelector(
  [selectIntegrations],
  (integrations) => integrations.filter(i => i.isActive)
);

export const selectIntegrationsByType = createSelector(
  [selectIntegrations],
  (integrations) => {
    const grouped: Record<IntegrationType, IntegrationConfig[]> = {} as any;
    integrations.forEach(integration => {
      if (!grouped[integration.type]) {
        grouped[integration.type] = [];
      }
      grouped[integration.type].push(integration);
    });
    return grouped;
  }
);

export const selectIntegrationMetrics = createSelector(
  [selectIntegrations, selectConnectionTests, selectSyncResults],
  (integrations, connectionTests, syncResults) => {
    const total = integrations.length;
    const active = integrations.filter(i => i.isActive).length;
    const healthy = integrations.filter(i => 
      i.isActive && i.status === 'ACTIVE' && i.lastSyncStatus === 'success'
    ).length;
    const errors = integrations.filter(i => 
      i.status === 'ERROR' || i.lastSyncStatus === 'failed'
    ).length;

    return {
      total,
      active,
      healthy,
      errors,
      healthRate: total > 0 ? (healthy / total) * 100 : 0,
    };
  }
);

export const selectRecentLogs = createSelector(
  [selectLogs],
  (logs) => logs.slice(0, 10) // Recent 10 logs
);

export const selectCriticalLogs = createSelector(
  [selectLogs],
  (logs) => logs.filter(log => log.status === 'failed' || log.errorMessage)
);

export default integrationSlice.reducer;
