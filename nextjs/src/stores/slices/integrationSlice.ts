/**
 * Integration Redux Slice
 *
 * Manages integration state for external system connections including EHR, SIS, LMS,
 * Finance, HR, Health, Insurance, Laboratory, and Pharmacy systems. Provides comprehensive
 * state management for integration configuration, synchronization, monitoring, and logging.
 *
 * @module IntegrationSlice
 *
 * @remarks
 * Security: Integration credentials are not stored in Redux state - use secure backend storage
 * Admin: Integration management requires 'admin.integrations' or 'integrations.manage' permission
 * Architecture: Uses service adapter pattern to decouple Redux from API implementation
 *
 * @example
 * ```typescript
 * // Fetch all integrations
 * dispatch(fetchIntegrations());
 *
 * // Filter by type
 * dispatch(fetchIntegrations('EHR'));
 *
 * // Create new integration
 * dispatch(createIntegration({
 *   name: 'Hospital EHR',
 *   type: 'EHR',
 *   config: { endpoint: 'https://ehr.hospital.com', apiKey: 'xxx' }
 * }));
 *
 * // Test connection
 * dispatch(testConnection(integrationId));
 *
 * // Sync data
 * dispatch(syncIntegration(integrationId));
 * ```
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { integrationApi } from '../../services/modules/integrationApi';
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
} from '../../types/integrations';

/**
 * Integration API Service Adapter
 *
 * Provides a clean interface between Redux thunks and the integration API service.
 * Decouples state management from API implementation details.
 *
 * @class
 *
 * @remarks
 * Pattern: Service Adapter - wraps integrationApi for testability and abstraction
 * Error Handling: All methods may throw errors that should be caught by async thunks
 */
export class IntegrationApiService {
  /**
   * Retrieves all integrations, optionally filtered by type.
   *
   * @param {IntegrationType} [type] - Integration type filter (EHR, SIS, LMS, etc.)
   * @returns {Promise<IntegrationListResponse>} List of integrations with pagination
   * @throws {Error} If API request fails
   */
  async getIntegrations(type?: IntegrationType) {
    return await integrationApi.getAll(type);
  }

  /**
   * Retrieves a single integration by ID.
   *
   * @param {string} id - Integration ID
   * @returns {Promise<IntegrationResponse>} Integration details
   * @throws {Error} If integration not found or API request fails
   */
  async getIntegrationById(id: string) {
    return await integrationApi.getById(id);
  }

  /**
   * Creates a new integration configuration.
   *
   * @param {CreateIntegrationRequest} data - Integration configuration data
   * @returns {Promise<IntegrationResponse>} Created integration
   * @throws {Error} If validation fails or API request fails
   *
   * @example
   * ```typescript
   * const integration = await service.createIntegration({
   *   name: 'District EHR',
   *   type: 'EHR',
   *   config: {
   *     endpoint: 'https://ehr.example.com',
   *     authType: 'oauth',
   *     credentials: { clientId: 'xxx', clientSecret: 'yyy' }
   *   }
   * });
   * ```
   */
  async createIntegration(data: CreateIntegrationRequest) {
    return await integrationApi.create(data);
  }

  /**
   * Updates an existing integration configuration.
   *
   * @param {string} id - Integration ID
   * @param {UpdateIntegrationRequest} data - Updated configuration data
   * @returns {Promise<IntegrationResponse>} Updated integration
   * @throws {Error} If integration not found or validation fails
   */
  async updateIntegration(id: string, data: UpdateIntegrationRequest) {
    return await integrationApi.update(id, data);
  }

  /**
   * Deletes an integration configuration.
   *
   * @param {string} id - Integration ID
   * @returns {Promise<void>}
   * @throws {Error} If integration not found or deletion fails
   *
   * @remarks
   * Warning: This permanently deletes the integration. Sync history may be retained for audit.
   */
  async deleteIntegration(id: string) {
    return await integrationApi.delete(id);
  }

  /**
   * Tests connection to an external system.
   *
   * @param {string} id - Integration ID
   * @returns {Promise<{result: ConnectionTestResult}>} Connection test result
   * @throws {Error} If test fails or integration not found
   *
   * @remarks
   * Network: May take several seconds depending on external system response time
   * Timeout: Typically 30 seconds before timing out
   */
  async testConnection(id: string) {
    return await integrationApi.testConnection(id);
  }

  /**
   * Initiates data synchronization with an external system.
   *
   * @param {string} id - Integration ID
   * @returns {Promise<{result: SyncResult}>} Synchronization result
   * @throws {Error} If sync fails or integration not active
   *
   * @remarks
   * Async Operation: Sync may complete in background for large datasets
   * Rate Limiting: Respects external system rate limits
   * Conflict Resolution: Uses last-write-wins strategy by default
   */
  async syncIntegration(id: string) {
    return await integrationApi.sync(id);
  }

  /**
   * Retrieves logs for a specific integration.
   *
   * @param {string} id - Integration ID
   * @param {LogFilters} [filters={}] - Optional log filters (level, dateRange, etc.)
   * @returns {Promise<IntegrationLogsResponse>} Filtered integration logs
   * @throws {Error} If integration not found
   */
  async getIntegrationLogs(id: string, filters: LogFilters = {}) {
    return await integrationApi.getLogs(id, filters);
  }

  /**
   * Retrieves logs for all integrations.
   *
   * @param {LogFilters} [filters={}] - Optional log filters
   * @returns {Promise<IntegrationLogsResponse>} All integration logs
   */
  async getAllLogs(filters: LogFilters = {}) {
    return await integrationApi.getAllLogs(filters);
  }

  /**
   * Retrieves integration statistics and metrics.
   *
   * @returns {Promise<IntegrationStatisticsResponse>} Integration statistics
   *
   * @remarks
   * Metrics include: sync success rates, error counts, data volumes, response times
   */
  async getStatistics() {
    return await integrationApi.getStatistics();
  }

  /**
   * Retrieves health status for all integrations.
   *
   * @returns {Promise<IntegrationHealthStatusResponse>} Health status of all integrations
   *
   * @remarks
   * Health Check: Includes connectivity, recent errors, and sync status
   */
  async getHealthStatus() {
    return await integrationApi.getHealthStatus();
  }

  /**
   * Enables multiple integrations in a single batch operation.
   *
   * @param {string[]} ids - Array of integration IDs
   * @returns {Promise<BatchOperationResult>} Batch operation results
   *
   * @remarks
   * Atomicity: Partial failures are reported individually
   * Performance: More efficient than individual enable operations
   */
  async batchEnableIntegrations(ids: string[]) {
    return await integrationApi.batchEnable(ids);
  }

  /**
   * Disables multiple integrations in a single batch operation.
   *
   * @param {string[]} ids - Array of integration IDs
   * @returns {Promise<BatchOperationResult>} Batch operation results
   *
   * @remarks
   * Side Effects: Disabling stops all scheduled syncs for the integration
   */
  async batchDisableIntegrations(ids: string[]) {
    return await integrationApi.batchDisable(ids);
  }
}

/**
 * Integration service singleton instance
 *
 * @constant
 * @type {IntegrationApiService}
 */
const integrationService = new IntegrationApiService();

/**
 * Integration Redux state interface
 *
 * @interface IntegrationState
 * @property {IntegrationConfig[]} integrations - List of all integration configurations
 * @property {IntegrationConfig | null} currentIntegration - Currently selected integration
 * @property {IntegrationLog[]} logs - Integration operation logs
 * @property {IntegrationStatistics | null} statistics - Integration metrics and statistics
 * @property {any | null} healthStatus - Overall integration health status
 * @property {Record<string, ConnectionTestResult>} connectionTests - Connection test results by integration ID
 * @property {Record<string, SyncResult>} syncResults - Sync results by integration ID
 * @property {string[]} selectedIntegrationIds - IDs of integrations selected for batch operations
 * @property {Object} filters - Active filters for integration list
 * @property {Object} pagination - Pagination state for integrations
 * @property {Object} logPagination - Pagination state for logs
 * @property {Object} loading - Loading states for different operations
 * @property {Object} error - Error messages for different operations
 */
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

/**
 * Async thunk to fetch all integrations
 *
 * @async
 * @function fetchIntegrations
 * @param {IntegrationType} [type] - Optional integration type filter
 * @returns {Promise<IntegrationListResponse>} Integration list response
 * @throws {Error} If API request fails
 */
export const fetchIntegrations = createAsyncThunk(
  'integration/fetchIntegrations',
  async (type?: IntegrationType) => {
    const response = await integrationService.getIntegrations(type);
    return response;
  }
);

/**
 * Async thunk to fetch a single integration by ID
 *
 * @async
 * @function fetchIntegrationById
 * @param {string} id - Integration ID
 * @returns {Promise<IntegrationResponse>} Integration details
 * @throws {Error} If integration not found
 */
export const fetchIntegrationById = createAsyncThunk(
  'integration/fetchIntegrationById',
  async (id: string) => {
    const response = await integrationService.getIntegrationById(id);
    return response;
  }
);

/**
 * Async thunk to create a new integration
 *
 * @async
 * @function createIntegration
 * @param {CreateIntegrationRequest} data - Integration configuration
 * @returns {Promise<IntegrationResponse>} Created integration
 * @throws {Error} If validation fails or creation fails
 *
 * @remarks
 * Security: Requires 'integrations.create' permission
 * Validation: Endpoint URL and credentials are validated before saving
 */
export const createIntegration = createAsyncThunk(
  'integration/createIntegration',
  async (data: CreateIntegrationRequest) => {
    const response = await integrationService.createIntegration(data);
    return response;
  }
);

/**
 * Async thunk to update an existing integration
 *
 * @async
 * @function updateIntegration
 * @param {Object} params - Update parameters
 * @param {string} params.id - Integration ID
 * @param {UpdateIntegrationRequest} params.data - Updated configuration
 * @returns {Promise<IntegrationResponse>} Updated integration
 * @throws {Error} If integration not found or update fails
 *
 * @remarks
 * Security: Requires 'integrations.update' permission
 */
export const updateIntegration = createAsyncThunk(
  'integration/updateIntegration',
  async ({ id, data }: { id: string; data: UpdateIntegrationRequest }) => {
    const response = await integrationService.updateIntegration(id, data);
    return response;
  }
);

/**
 * Async thunk to delete an integration
 *
 * @async
 * @function deleteIntegration
 * @param {string} id - Integration ID
 * @returns {Promise<string>} Deleted integration ID
 * @throws {Error} If integration not found or deletion fails
 *
 * @remarks
 * Security: Requires 'integrations.delete' permission
 * Warning: Permanently deletes integration configuration
 */
export const deleteIntegration = createAsyncThunk(
  'integration/deleteIntegration',
  async (id: string) => {
    await integrationService.deleteIntegration(id);
    return id;
  }
);

/**
 * Async thunk to test connection to an external system
 *
 * @async
 * @function testConnection
 * @param {string} id - Integration ID
 * @returns {Promise<{id: string, result: ConnectionTestResult}>} Test result
 * @throws {Error} If connection test fails
 *
 * @remarks
 * Network: May timeout after 30 seconds
 * Security: Does not store credentials in Redux state
 */
export const testConnection = createAsyncThunk(
  'integration/testConnection',
  async (id: string) => {
    const response = await integrationService.testConnection(id);
    return { id, result: response.result };
  }
);

/**
 * Async thunk to initiate data synchronization
 *
 * @async
 * @function syncIntegration
 * @param {string} id - Integration ID
 * @returns {Promise<{id: string, result: SyncResult}>} Sync result
 * @throws {Error} If sync fails or integration is inactive
 *
 * @remarks
 * Performance: Large syncs may take several minutes
 * Rate Limiting: Respects external system quotas
 * Conflict Resolution: Last-write-wins by default
 */
export const syncIntegration = createAsyncThunk(
  'integration/syncIntegration',
  async (id: string) => {
    const response = await integrationService.syncIntegration(id);
    return { id, result: response.result };
  }
);

/**
 * Async thunk to fetch logs for a specific integration
 *
 * @async
 * @function fetchIntegrationLogs
 * @param {Object} params - Fetch parameters
 * @param {string} params.id - Integration ID
 * @param {LogFilters} [params.filters] - Optional log filters
 * @returns {Promise<IntegrationLogsResponse>} Integration logs
 */
export const fetchIntegrationLogs = createAsyncThunk(
  'integration/fetchIntegrationLogs',
  async ({ id, filters }: { id: string; filters?: LogFilters }) => {
    const response = await integrationService.getIntegrationLogs(id, filters);
    return response;
  }
);

/**
 * Async thunk to fetch all integration logs
 *
 * @async
 * @function fetchAllLogs
 * @param {LogFilters} [filters] - Optional log filters (severity, dateRange, etc.)
 * @returns {Promise<IntegrationLogsResponse>} All integration logs
 */
export const fetchAllLogs = createAsyncThunk(
  'integration/fetchAllLogs',
  async (filters?: LogFilters) => {
    const response = await integrationService.getAllLogs(filters);
    return response;
  }
);

/**
 * Async thunk to fetch integration statistics
 *
 * @async
 * @function fetchStatistics
 * @returns {Promise<IntegrationStatisticsResponse>} Integration statistics
 *
 * @remarks
 * Metrics: Includes success rates, error counts, data volumes, response times
 */
export const fetchStatistics = createAsyncThunk(
  'integration/fetchStatistics',
  async () => {
    const response = await integrationService.getStatistics();
    return response;
  }
);

/**
 * Async thunk to fetch health status for all integrations
 *
 * @async
 * @function fetchHealthStatus
 * @returns {Promise<IntegrationHealthStatusResponse>} Health status
 */
export const fetchHealthStatus = createAsyncThunk(
  'integration/fetchHealthStatus',
  async () => {
    const response = await integrationService.getHealthStatus();
    return response;
  }
);

/**
 * Async thunk to enable multiple integrations
 *
 * @async
 * @function batchEnableIntegrations
 * @param {string[]} ids - Array of integration IDs to enable
 * @returns {Promise<BatchOperationResult>} Batch operation results
 *
 * @remarks
 * Security: Requires 'integrations.update' permission
 * Atomicity: Partial failures are reported individually
 */
export const batchEnableIntegrations = createAsyncThunk(
  'integration/batchEnableIntegrations',
  async (ids: string[]) => {
    const response = await integrationService.batchEnableIntegrations(ids);
    return response;
  }
);

/**
 * Async thunk to disable multiple integrations
 *
 * @async
 * @function batchDisableIntegrations
 * @param {string[]} ids - Array of integration IDs to disable
 * @returns {Promise<BatchOperationResult>} Batch operation results
 *
 * @remarks
 * Security: Requires 'integrations.update' permission
 * Side Effects: Stops all scheduled syncs for disabled integrations
 */
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

/**
 * Integration slice actions
 *
 * @exports clearCurrentIntegration - Clear currently selected integration
 * @exports setFilters - Update integration filters
 * @exports setPagination - Update pagination state
 * @exports setLogPagination - Update log pagination state
 * @exports toggleIntegrationSelection - Toggle integration selection for batch ops
 * @exports selectAllIntegrations - Select all integrations for batch operations
 * @exports clearSelection - Clear all selected integrations
 * @exports clearErrors - Clear all error messages
 */
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

// Basic Selectors

/** Selects all integrations from state */
export const selectIntegrations = (state: { integration: IntegrationState }) => state.integration.integrations;

/** Selects currently selected integration */
export const selectCurrentIntegration = (state: { integration: IntegrationState }) => state.integration.currentIntegration;

/** Selects integration logs */
export const selectLogs = (state: { integration: IntegrationState }) => state.integration.logs;

/** Selects integration statistics */
export const selectStatistics = (state: { integration: IntegrationState }) => state.integration.statistics;

/** Selects integration health status */
export const selectHealthStatus = (state: { integration: IntegrationState }) => state.integration.healthStatus;

/** Selects connection test results */
export const selectConnectionTests = (state: { integration: IntegrationState }) => state.integration.connectionTests;

/** Selects sync results */
export const selectSyncResults = (state: { integration: IntegrationState }) => state.integration.syncResults;

/** Selects IDs of integrations selected for batch operations */
export const selectSelectedIntegrationIds = (state: { integration: IntegrationState }) => state.integration.selectedIntegrationIds;

/** Selects active filters */
export const selectFilters = (state: { integration: IntegrationState }) => state.integration.filters;

/** Selects pagination state */
export const selectPagination = (state: { integration: IntegrationState }) => state.integration.pagination;

/** Selects log pagination state */
export const selectLogPagination = (state: { integration: IntegrationState }) => state.integration.logPagination;

/** Selects loading states */
export const selectLoading = (state: { integration: IntegrationState }) => state.integration.loading;

/** Selects error messages */
export const selectErrors = (state: { integration: IntegrationState }) => state.integration.error;

// Derived Selectors

/**
 * Memoized selector for filtered integrations
 *
 * @function selectFilteredIntegrations
 * @returns {IntegrationConfig[]} Integrations filtered by type, status, and search term
 */
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

/**
 * Memoized selector for active integrations only
 *
 * @function selectActiveIntegrations
 * @returns {IntegrationConfig[]} Only active integrations
 */
export const selectActiveIntegrations = createSelector(
  [selectIntegrations],
  (integrations) => integrations.filter(i => i.isActive)
);

/**
 * Memoized selector for integrations grouped by type
 *
 * @function selectIntegrationsByType
 * @returns {Record<IntegrationType, IntegrationConfig[]>} Integrations grouped by type
 */
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

/**
 * Memoized selector for integration health metrics
 *
 * @function selectIntegrationMetrics
 * @returns {Object} Metrics including total, active, healthy, errors, and health rate
 */
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

/**
 * Memoized selector for recent logs (last 10)
 *
 * @function selectRecentLogs
 * @returns {IntegrationLog[]} Most recent 10 logs
 */
export const selectRecentLogs = createSelector(
  [selectLogs],
  (logs) => logs.slice(0, 10)
);

/**
 * Memoized selector for critical logs (failed or with errors)
 *
 * @function selectCriticalLogs
 * @returns {IntegrationLog[]} Logs with failed status or error messages
 */
export const selectCriticalLogs = createSelector(
  [selectLogs],
  (logs) => logs.filter(log => log.status === 'failed' || log.errorMessage)
);

export default integrationSlice.reducer;
