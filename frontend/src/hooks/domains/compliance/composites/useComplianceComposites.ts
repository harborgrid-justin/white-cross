// Re-export all composite hooks from modular files
export { useAuditWorkflow } from './useAuditWorkflows';
export { usePolicyWorkflow } from './usePolicyWorkflows';
export { useTrainingEnrollment } from './useTrainingWorkflows';
export { useIncidentWorkflow } from './useIncidentWorkflows';
export {
  useComplianceDashboardComposite,
  useComplianceReporting,
  useUserComplianceStatus,
} from './useComplianceDashboards';
