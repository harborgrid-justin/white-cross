/**
 * Advanced API Integration - Re-export from canonical location
 * 
 * This file re-exports all members from the canonical advancedApiIntegration
 * located in stores/shared/api/advancedApiIntegration.ts
 */

export {
  // Types
  type AnalyticsApiRequest,
  type AnalyticsApiResponse,
  type BulkOperationRequest,
  type BulkOperationResponse,
  type WorkflowExecutionRequest,
  type WorkflowExecutionResponse,
  type AuditQueryRequest,
  type AuditQueryResponse,
  
  // API
  phase3Api,
  
  // Hooks - Analytics
  useGenerateHealthMetricsQuery,
  useGenerateTrendAnalysisQuery,
  useAssessStudentRisksQuery,
  useGenerateComplianceReportQuery,
  
  // Hooks - Bulk Operations
  useExecuteBulkOperationMutation,
  useGetBulkOperationStatusQuery,
  useRollbackBulkOperationMutation,
  useListBulkOperationsQuery,
  
  // Hooks - Workflow
  useExecuteWorkflowMutation,
  useGetWorkflowStatusQuery,
  useCancelWorkflowExecutionMutation,
  useGetWorkflowDefinitionsQuery,
  
  // Hooks - Audit
  useQueryAuditTrailQuery,
  useExportAuditTrailMutation,
  useGetAuditStatisticsQuery,
  
  // Hooks - Sync
  useGetSyncStatusQuery,
  useForceSyncEntityMutation,
  useResolveSyncConflictsMutation,
  
  // Hooks - Performance
  useGetPerformanceMetricsQuery,
  useGetSystemHealthQuery,
  
  // Utilities
  handlePhase3ApiError,
  invalidatePhase3Cache,
  preloadPhase3Data,
} from '../../stores/shared/api/advancedApiIntegration';
