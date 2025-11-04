// Re-export all compliance mutations from modular files

// Audit Mutations
export {
  useCreateAudit,
  useUpdateAudit,
  useDeleteAudit,
} from './useAuditMutations';

// Policy Mutations
export {
  useCreatePolicy,
  useUpdatePolicy,
  useDeletePolicy,
  useApprovePolicy,
} from './usePolicyMutations';

// Training Mutations
export {
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
  useEnrollUserInTraining,
  useCompleteTraining,
} from './useTrainingMutations';

// Incident Mutations
export {
  useCreateIncident,
  useUpdateIncident,
  useDeleteIncident,
  useResolveIncident,
} from './useIncidentMutations';

// Risk Assessment Mutations
export {
  useCreateRiskAssessment,
  useUpdateRiskAssessment,
  useDeleteRiskAssessment,
  useApproveRiskAssessment,
} from './useRiskAssessmentMutations';
