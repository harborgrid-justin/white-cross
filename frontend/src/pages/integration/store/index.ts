/**
 * Integration Store Module Exports
 * Centralized exports for integration-related Redux state management
 */

// Export reducer as default
export { default } from './integrationSlice';

// Export all actions
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

// Export all selectors
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

// Re-export types for convenience
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
