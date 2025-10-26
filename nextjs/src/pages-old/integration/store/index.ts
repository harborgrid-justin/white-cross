/**
 * Integration Store Module Exports
 *
 * Centralized exports for integration-related Redux state management. Provides
 * a clean public API for accessing integration actions, selectors, and types.
 *
 * @module integration/store
 *
 * @remarks
 * Architecture: Barrel export pattern for clean imports in components
 * State Management: Redux Toolkit with service adapter pattern
 * Integration Types: Supports EHR, SIS, LMS, Finance, HR, Health, Insurance, Laboratory, Pharmacy
 *
 * @example
 * ```typescript
 * // Import actions and selectors
 * import {
 *   fetchIntegrations,
 *   selectIntegrations,
 *   selectIntegrationMetrics
 * } from '@/pages/integration/store';
 *
 * // Use in component
 * const integrations = useSelector(selectIntegrations);
 * dispatch(fetchIntegrations('EHR'));
 * ```
 */

/**
 * Integration reducer (default export)
 *
 * @exports {Reducer} default - Integration slice reducer for Redux store
 */
export { default } from './integrationSlice';

/**
 * Async thunks for integration operations
 *
 * @exports {AsyncThunk} fetchIntegrations - Fetch all integrations with optional type filter
 * @exports {AsyncThunk} fetchIntegrationById - Fetch single integration by ID
 * @exports {AsyncThunk} createIntegration - Create new integration configuration
 * @exports {AsyncThunk} updateIntegration - Update existing integration
 * @exports {AsyncThunk} deleteIntegration - Delete integration
 * @exports {AsyncThunk} testConnection - Test connection to external system
 * @exports {AsyncThunk} syncIntegration - Initiate data synchronization
 * @exports {AsyncThunk} fetchIntegrationLogs - Fetch logs for specific integration
 * @exports {AsyncThunk} fetchAllLogs - Fetch all integration logs
 * @exports {AsyncThunk} fetchStatistics - Fetch integration statistics
 * @exports {AsyncThunk} fetchHealthStatus - Fetch health status for all integrations
 * @exports {AsyncThunk} batchEnableIntegrations - Enable multiple integrations
 * @exports {AsyncThunk} batchDisableIntegrations - Disable multiple integrations
 */
export {
  // Async thunks
  fetchIntegrations,
  fetchIntegrationById,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  testConnection,
  syncIntegration,
  fetchIntegrationLogs,
  fetchAllLogs,
  fetchStatistics,
  fetchHealthStatus,
  batchEnableIntegrations,
  batchDisableIntegrations,

  // Sync actions
  clearCurrentIntegration,
  setFilters,
  setPagination,
  setLogPagination,
  toggleIntegrationSelection,
  selectAllIntegrations,
  clearSelection,
  clearErrors,

  // Service class
  IntegrationApiService,
} from './integrationSlice';

/**
 * Selectors for accessing integration state
 *
 * @exports {Function} selectIntegrations - Select all integrations
 * @exports {Function} selectCurrentIntegration - Select currently selected integration
 * @exports {Function} selectLogs - Select integration logs
 * @exports {Function} selectStatistics - Select integration statistics
 * @exports {Function} selectHealthStatus - Select health status
 * @exports {Function} selectConnectionTests - Select connection test results
 * @exports {Function} selectSyncResults - Select sync results
 * @exports {Function} selectSelectedIntegrationIds - Select IDs for batch operations
 * @exports {Function} selectFilters - Select active filters
 * @exports {Function} selectPagination - Select pagination state
 * @exports {Function} selectLogPagination - Select log pagination state
 * @exports {Function} selectLoading - Select loading states
 * @exports {Function} selectErrors - Select error messages
 * @exports {Function} selectFilteredIntegrations - Memoized selector for filtered integrations
 * @exports {Function} selectActiveIntegrations - Memoized selector for active integrations
 * @exports {Function} selectIntegrationsByType - Memoized selector for grouped integrations
 * @exports {Function} selectIntegrationMetrics - Memoized selector for health metrics
 * @exports {Function} selectRecentLogs - Memoized selector for recent logs
 * @exports {Function} selectCriticalLogs - Memoized selector for critical logs
 */
export {
  // Basic selectors
  selectIntegrations,
  selectCurrentIntegration,
  selectLogs,
  selectStatistics,
  selectHealthStatus,
  selectConnectionTests,
  selectSyncResults,
  selectSelectedIntegrationIds,
  selectFilters,
  selectPagination,
  selectLogPagination,
  selectLoading,
  selectErrors,

  // Advanced selectors
  selectFilteredIntegrations,
  selectActiveIntegrations,
  selectIntegrationsByType,
  selectIntegrationMetrics,
  selectRecentLogs,
  selectCriticalLogs,
} from './integrationSlice';

/**
 * Integration types for external system connections
 *
 * @exports {Type} IntegrationType - Integration type enum (EHR, SIS, LMS, etc.)
 * @exports {Type} IntegrationStatus - Integration status enum
 * @exports {Type} IntegrationConfig - Integration configuration interface
 * @exports {Type} IntegrationLog - Integration log entry interface
 * @exports {Type} IntegrationSettings - Integration settings interface
 * @exports {Type} CreateIntegrationRequest - Request type for creating integration
 * @exports {Type} UpdateIntegrationRequest - Request type for updating integration
 * @exports {Type} ConnectionTestResult - Connection test result interface
 * @exports {Type} SyncResult - Synchronization result interface
 * @exports {Type} IntegrationStatistics - Statistics interface
 * @exports {Type} LogFilters - Log filter options interface
 * @exports {Type} IntegrationListResponse - List response interface
 * @exports {Type} IntegrationResponse - Single integration response interface
 * @exports {Type} IntegrationLogsResponse - Logs response interface
 * @exports {Type} IntegrationStatisticsResponse - Statistics response interface
 * @exports {Type} BatchOperationResult - Batch operation result interface
 * @exports {Type} IntegrationHealthStatusResponse - Health status response interface
 * @exports {Type} SyncStatus - Sync status enum
 */
export type {
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
