/**
 * Advanced Hooks and Selectors
 *
 * This file now re-exports all advanced hooks from modular files.
 * See individual modules for implementations:
 * - analyticsHooks.ts - Analytics and reporting hooks
 * - bulkOperationsHooks.ts - Bulk operations management
 * - workflowHooks.ts - Workflow orchestration hooks
 * - auditHooks.ts - Audit trail and compliance hooks
 * - syncHooks.ts - Data synchronization hooks
 * - monitoringHooks.ts - Performance monitoring hooks and selectors
 *
 * @module advancedHooks
 */

// Re-export all hooks from modular files
export {
  useHealthMetrics,
  useTrendAnalysis,
  useStudentRiskAssessment,
  useComplianceReporting,
} from './analyticsHooks';

export {
  useBulkOperations,
  useBulkOperationProgress,
} from './bulkOperationsHooks';

export {
  useWorkflowOrchestration,
  useWorkflowProgress,
} from './workflowHooks';

export {
  useAuditTrail,
  useAuditQuery,
} from './auditHooks';

export {
  useDataSync,
} from './syncHooks';

export {
  useSystemMonitoring,
  useEnterpriseDashboard,
  usePerformanceTrends,
} from './monitoringHooks';

// Default export for backwards compatibility
export default {
  // Analytics hooks
  useHealthMetrics,
  useTrendAnalysis,
  useStudentRiskAssessment,
  useComplianceReporting,

  // Bulk operations hooks
  useBulkOperations,
  useBulkOperationProgress,

  // Workflow hooks
  useWorkflowOrchestration,
  useWorkflowProgress,

  // Audit trail hooks
  useAuditTrail,
  useAuditQuery,

  // Data sync hooks
  useDataSync,

  // Performance monitoring hooks
  useSystemMonitoring,

  // Advanced selectors
  useEnterpriseDashboard,
  usePerformanceTrends,
};
