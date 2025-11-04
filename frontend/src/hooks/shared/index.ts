/**
 * Shared Hooks Index
 *
 * Central export point for all shared utility hooks used across
 * the White Cross Healthcare Platform frontend application.
 *
 * @module hooks/shared
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// =============================================================================
// ENTERPRISE FOUNDATION HOOKS
// =============================================================================
export { useApiError, type EnterpriseApiError, type ApiErrorType } from './useApiError';
export { useAuditLog, type AuditEvent, type AuditEventType, type AuditSeverity } from './useAuditLog';
export { useCacheManager, type DataSensitivity, type CacheStrategy, CACHE_TIMES } from './useCacheManager';
export { useHealthcareCompliance } from './useHealthcareCompliance';

// =============================================================================
// REDUX INTEGRATION
// =============================================================================
// Core typed hooks and selectors
export * from './reduxHooks';

// Advanced entity selection and utility hooks
export {
  useAppDispatch,
  useAppSelector,
  useEntityState,
  useEntitiesById,
  useEntityById,
  useFilteredEntities,
  useLoadingState,
  useIsLoading,
  useOperationLoading,
  useMemoizedSelector,
  useMultipleSelectors,
  useDebouncedSelector,
} from './store-hooks-index';

// =============================================================================
// DOMAIN-SPECIFIC HOOKS
// =============================================================================
// Comprehensive domain hooks (users, health, communication, operations, organization)
export * from './allDomainHooks';

// Auth and Incidents domain hooks (already exported via reduxHooks, but explicit for clarity)
export {
  useCurrentUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useAuthActions,
  useIncidentReports,
  useCurrentIncident,
  useWitnessStatements,
  useFollowUpActions,
  useIncidentSearchResults,
  useIncidentPagination,
  useIncidentFilters,
  useIncidentSearchQuery,
  useIncidentSortConfig,
  useIncidentViewMode,
  useIncidentLoadingStates,
  useIncidentErrorStates,
  useIncidentListLoading,
  useIncidentDetailLoading,
  useIncidentCreating,
  useIncidentUpdating,
  useIncidentDeleting,
  useIncidentActions,
} from './domainHooks';

// =============================================================================
// AUDIT INTEGRATION
// =============================================================================
export { useAudit, type UseAuditResult } from './useAudit';
export { AuditService, auditService, initializeAuditService, cleanupAuditService } from '@/services/audit';

// =============================================================================
// ADVANCED FEATURE HOOKS
// =============================================================================
// Analytics hooks
export {
  useHealthMetrics,
  useTrendAnalysis,
  useStudentRiskAssessment,
  useComplianceReporting,
  type HealthMetricsHook,
  type TrendAnalysisHook,
  type StudentRiskAssessmentHook,
  type ComplianceReportingHook,
  type TrendPeriod,
} from './analyticsHooks';

// Bulk operations
export {
  useBulkOperations,
  useBulkOperationProgress,
} from './bulkOperationsHooks';

// Workflow orchestration
export {
  useWorkflowOrchestration,
  useWorkflowProgress,
} from './workflowHooks';

// Audit trail
export {
  useAuditTrail,
  useAuditQuery,
} from './auditHooks';

// Data synchronization
export {
  useDataSync,
} from './syncHooks';

// System monitoring
export {
  useSystemMonitoring,
  useEnterpriseDashboard,
  usePerformanceTrends,
} from './monitoringHooks';

// =============================================================================
// PREFETCH HOOKS
// =============================================================================
// Legacy export (kept for backward compatibility)
export { usePrefetch } from './usePrefetch';

// New modular prefetch exports
export {
  useNetworkIdle,
  usePrefetch as usePrefetchCore,
  usePrefetchListItem,
  usePrefetchNextPage,
  usePredictivePrefetch,
  useSmartPrefetchManager,
  type UsePrefetchOptions,
} from './prefetch';

// =============================================================================
// OPTIMISTIC UPDATES
// =============================================================================
export {
  createOptimisticUpdate,
  createOptimisticListAdd,
  createOptimisticListUpdate,
  createOptimisticListRemove,
  createOptimisticPaginatedUpdate,
  createMultiQueryOptimisticUpdate,
  createMedicationAdministrationOptimistic,
  createStudentCreationOptimistic,
  createHealthRecordOptimistic,
  createAppointmentSchedulingOptimistic,
  handleOptimisticError,
  handleOptimisticSettled,
  type OptimisticContext,
} from './optimisticUpdates';

// =============================================================================
// CACHE MANAGEMENT UTILITIES
// =============================================================================
export { useCacheStrategies } from './cache-strategies';
export { useCacheOperations } from './cache-operations';
export { useCacheUtils } from './cache-utils';

// Additional cache type exports (main types already exported via useCacheManager above)
export type {
  CacheManagerOptions as CacheOptions,
} from './cache-types';

// =============================================================================
// COMPLIANCE UTILITIES
// =============================================================================
export {
  detectPHI,
  getComplianceLevel,
  sanitizeForLogging,
} from './complianceRules';

export {
  getRetentionPolicy,
  validateCompliance,
  getAllRetentionPolicies,
} from './complianceValidation';

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// API Error types
export type {
  UseApiErrorOptions,
  ErrorHandlingResult,
} from './useApiError';

// Audit types
export type {
  UseAuditLogOptions,
} from './useAuditLog';

// Cache types (consolidated - avoiding duplicates)
export type {
  CacheStats,
  InvalidationScope,
} from './cache-types';

// Compliance types
export type {
  PHIType,
  ComplianceLevel,
  RetentionPolicy,
  ComplianceValidation,
  UseHealthcareComplianceOptions,
  ComplianceConfig,
} from './complianceTypes';

// Common hook types
export type {
  HookOptions,
  HookResult,
  MutationResult,
  AuditLogParams,
  AuditAction,
  AuditResourceType,
  AuditChange,
  AuditServiceStatus,
  SystemHealth,
  ServiceHealth,
} from './types';
