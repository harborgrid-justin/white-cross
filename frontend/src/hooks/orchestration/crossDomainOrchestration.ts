/**
 * Cross-Domain Orchestration - Re-export from canonical location
 * 
 * This file re-exports all members from the canonical crossDomainOrchestration
 * located in stores/shared/orchestration/crossDomainOrchestration.ts
 */

export {
  // Types
  type OrchestrationWorkflow,
  type OrchestrationStage,
  type DomainOperation,
  type RetryPolicy,
  type SuccessCriteria,
  type StageNotification,
  type OperationCondition,
  type DataTransformation,
  type ValidationRule,
  type WorkflowConfiguration,
  type CronSchedule,
  type NotificationSettings,
  type WorkflowMetrics,
  type PerformanceMetric,
  type WorkflowExecution,
  type StageResult,
  type OperationResult,
  type ExecutionError,
  type ExecutionMetrics,
  type ResourceUsage,
  
  // Functions
  executeStudentEnrollmentWorkflow,
  executeMedicationManagementWorkflow,
} from '../../stores/shared/orchestration/crossDomainOrchestration';
