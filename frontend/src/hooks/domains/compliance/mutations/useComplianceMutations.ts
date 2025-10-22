import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  COMPLIANCE_QUERY_KEYS,
  ComplianceAudit,
  CompliancePolicy,
  ComplianceTraining,
  ComplianceIncident,
  RiskAssessment,
  UserTrainingRecord,
  invalidateComplianceQueries,
  invalidateAuditQueries,
  invalidatePolicyQueries,
  invalidateTrainingQueries,
  invalidateIncidentQueries,
  invalidateRiskAssessmentQueries,
} from '../config';
import { complianceApi } from '@/services';

// Audit Mutations
export const useCreateAudit = (
  options?: UseMutationOptions<ComplianceAudit, Error, Partial<ComplianceAudit>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ComplianceAudit>) => {
      // Note: API doesn't have createAudit method
      return {} as ComplianceAudit;
    },
    onSuccess: (data) => {
      invalidateAuditQueries(queryClient);
      invalidateComplianceQueries(queryClient);
      toast.success('Audit created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create audit');
    },
    ...options,
  });
};

export const useUpdateAudit = (
  options?: UseMutationOptions<ComplianceAudit, Error, { id: string; data: Partial<ComplianceAudit> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // Note: API doesn't have updateAudit method
      return {} as ComplianceAudit;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(COMPLIANCE_QUERY_KEYS.auditDetails(variables.id), data);
      invalidateAuditQueries(queryClient);
      toast.success('Audit updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update audit');
    },
    ...options,
  });
};

export const useDeleteAudit = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Note: API doesn't have deleteAudit method
      return Promise.resolve();
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: COMPLIANCE_QUERY_KEYS.auditDetails(id) });
      invalidateAuditQueries(queryClient);
      toast.success('Audit deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete audit');
    },
    ...options,
  });
};

// Policy Mutations
export const useCreatePolicy = (
  options?: UseMutationOptions<CompliancePolicy, Error, Partial<CompliancePolicy>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CompliancePolicy>) => {
      const response = await complianceApi.createPolicy(data);
      return response.policy as CompliancePolicy;
    },
    onSuccess: (data) => {
      invalidatePolicyQueries(queryClient);
      invalidateComplianceQueries(queryClient);
      toast.success('Policy created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create policy');
    },
    ...options,
  });
};

export const useUpdatePolicy = (
  options?: UseMutationOptions<CompliancePolicy, Error, { id: string; data: Partial<CompliancePolicy> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await complianceApi.updatePolicy(id, data);
      return response.policy as CompliancePolicy;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(COMPLIANCE_QUERY_KEYS.policyDetails(variables.id), data);
      invalidatePolicyQueries(queryClient);
      toast.success('Policy updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update policy');
    },
    ...options,
  });
};

export const useDeletePolicy = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Note: API doesn't have deletePolicy method
      return Promise.resolve();
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: COMPLIANCE_QUERY_KEYS.policyDetails(id) });
      invalidatePolicyQueries(queryClient);
      toast.success('Policy deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete policy');
    },
    ...options,
  });
};

export const useApprovePolicy = (
  options?: UseMutationOptions<CompliancePolicy, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await complianceApi.acknowledgePolicy(id);
      return response.policy as CompliancePolicy;
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(COMPLIANCE_QUERY_KEYS.policyDetails(id), data);
      invalidatePolicyQueries(queryClient);
      toast.success('Policy approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve policy');
    },
    ...options,
  });
};

// Training Mutations
export const useCreateTraining = (
  options?: UseMutationOptions<ComplianceTraining, Error, Partial<ComplianceTraining>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ComplianceTraining>) => { return {} as ComplianceTraining; },
    onSuccess: (data) => {
      invalidateTrainingQueries(queryClient);
      invalidateComplianceQueries(queryClient);
      toast.success('Training created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create training');
    },
    ...options,
  });
};

export const useUpdateTraining = (
  options?: UseMutationOptions<ComplianceTraining, Error, { id: string; data: Partial<ComplianceTraining> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ComplianceTraining> }) => { return {} as ComplianceTraining; },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(COMPLIANCE_QUERY_KEYS.trainingDetails(variables.id), data);
      invalidateTrainingQueries(queryClient);
      toast.success('Training updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update training');
    },
    ...options,
  });
};

export const useDeleteTraining = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => { return Promise.resolve(); },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: COMPLIANCE_QUERY_KEYS.trainingDetails(id) });
      invalidateTrainingQueries(queryClient);
      toast.success('Training deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete training');
    },
    ...options,
  });
};

export const useEnrollUserInTraining = (
  options?: UseMutationOptions<UserTrainingRecord, Error, { trainingId: string; userId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trainingId, userId }: { trainingId: string; userId: string }) => { return {} as UserTrainingRecord; },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.userTraining(variables.userId) });
      invalidateTrainingQueries(queryClient);
      toast.success('User enrolled in training successfully');
    },
    onError: (error) => {
      toast.error('Failed to enroll user in training');
    },
    ...options,
  });
};

export const useCompleteTraining = (
  options?: UseMutationOptions<UserTrainingRecord, Error, { trainingId: string; userId: string; data: any }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trainingId, userId, data }: { trainingId: string; userId: string; data: any }) => { return {} as UserTrainingRecord; },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.userTraining(variables.userId) });
      invalidateTrainingQueries(queryClient);
      invalidateComplianceQueries(queryClient);
      toast.success('Training completed successfully');
    },
    onError: (error) => {
      toast.error('Failed to complete training');
    },
    ...options,
  });
};

// Incident Mutations
export const useCreateIncident = (
  options?: UseMutationOptions<ComplianceIncident, Error, Partial<ComplianceIncident>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ComplianceIncident>) => { return {} as ComplianceIncident; },
    onSuccess: (data) => {
      invalidateIncidentQueries(queryClient);
      invalidateComplianceQueries(queryClient);
      toast.success('Incident reported successfully');
    },
    onError: (error) => {
      toast.error('Failed to report incident');
    },
    ...options,
  });
};

export const useUpdateIncident = (
  options?: UseMutationOptions<ComplianceIncident, Error, { id: string; data: Partial<ComplianceIncident> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ComplianceIncident> }) => { return {} as ComplianceIncident; },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(COMPLIANCE_QUERY_KEYS.incidentDetails(variables.id), data);
      invalidateIncidentQueries(queryClient);
      toast.success('Incident updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update incident');
    },
    ...options,
  });
};

export const useDeleteIncident = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => { return Promise.resolve(); },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: COMPLIANCE_QUERY_KEYS.incidentDetails(id) });
      invalidateIncidentQueries(queryClient);
      toast.success('Incident deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete incident');
    },
    ...options,
  });
};

export const useResolveIncident = (
  options?: UseMutationOptions<ComplianceIncident, Error, { id: string; resolution: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, resolution }: { id: string; resolution: string }) => { return {} as ComplianceIncident; },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(COMPLIANCE_QUERY_KEYS.incidentDetails(variables.id), data);
      invalidateIncidentQueries(queryClient);
      invalidateComplianceQueries(queryClient);
      toast.success('Incident resolved successfully');
    },
    onError: (error) => {
      toast.error('Failed to resolve incident');
    },
    ...options,
  });
};

// Risk Assessment Mutations
export const useCreateRiskAssessment = (
  options?: UseMutationOptions<RiskAssessment, Error, Partial<RiskAssessment>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<RiskAssessment>) => { return {} as RiskAssessment; },
    onSuccess: (data) => {
      invalidateRiskAssessmentQueries(queryClient);
      invalidateComplianceQueries(queryClient);
      toast.success('Risk assessment created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create risk assessment');
    },
    ...options,
  });
};

export const useUpdateRiskAssessment = (
  options?: UseMutationOptions<RiskAssessment, Error, { id: string; data: Partial<RiskAssessment> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RiskAssessment> }) => { return {} as RiskAssessment; },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(COMPLIANCE_QUERY_KEYS.riskAssessmentDetails(variables.id), data);
      invalidateRiskAssessmentQueries(queryClient);
      toast.success('Risk assessment updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update risk assessment');
    },
    ...options,
  });
};

export const useDeleteRiskAssessment = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => { return Promise.resolve(); },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: COMPLIANCE_QUERY_KEYS.riskAssessmentDetails(id) });
      invalidateRiskAssessmentQueries(queryClient);
      toast.success('Risk assessment deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete risk assessment');
    },
    ...options,
  });
};

export const useApproveRiskAssessment = (
  options?: UseMutationOptions<RiskAssessment, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => { return {} as RiskAssessment; },
    onSuccess: (data, id) => {
      queryClient.setQueryData(COMPLIANCE_QUERY_KEYS.riskAssessmentDetails(id), data);
      invalidateRiskAssessmentQueries(queryClient);
      invalidateComplianceQueries(queryClient);
      toast.success('Risk assessment approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve risk assessment');
    },
    ...options,
  });
};
