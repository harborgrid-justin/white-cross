// Re-export all compliance queries from modular files
export {
  useAudits,
  useAuditDetails,
  useAuditReports,
} from './useAuditQueries';

export {
  usePolicies,
  usePolicyDetails,
  usePolicyVersions,
} from './usePolicyQueries';

export {
  useTraining,
  useTrainingDetails,
  useUserTraining,
} from './useTrainingQueries';

export {
  useIncidents,
  useIncidentDetails,
} from './useIncidentQueries';

export {
  useRiskAssessments,
  useRiskAssessmentDetails,
} from './useRiskQueries';

export {
  useComplianceDashboard,
  useComplianceStats,
  useComplianceReports,
} from './useDashboardQueries';
