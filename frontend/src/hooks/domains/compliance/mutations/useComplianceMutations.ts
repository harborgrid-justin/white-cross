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

// Mock API functions (replace with actual API calls)
const mockComplianceAPI = {
  // Audit mutations
  createAudit: async (data: Partial<ComplianceAudit>): Promise<ComplianceAudit> => {
    return {} as ComplianceAudit;
  },
  updateAudit: async (id: string, data: Partial<ComplianceAudit>): Promise<ComplianceAudit> => {
    return {} as ComplianceAudit;
  },
  deleteAudit: async (id: string): Promise<void> => {},
  
  // Policy mutations
  createPolicy: async (data: Partial<CompliancePolicy>): Promise<CompliancePolicy> => {
    return {} as CompliancePolicy;
  },
  updatePolicy: async (id: string, data: Partial<CompliancePolicy>): Promise<CompliancePolicy> => {
    return {} as CompliancePolicy;
  },
  deletePolicy: async (id: string): Promise<void> => {},
  approvePolicy: async (id: string): Promise<CompliancePolicy> => {
    return {} as CompliancePolicy;
  },
  
  // Training mutations
  createTraining: async (data: Partial<ComplianceTraining>): Promise<ComplianceTraining> => {
    return {} as ComplianceTraining;
  },
  updateTraining: async (id: string, data: Partial<ComplianceTraining>): Promise<ComplianceTraining> => {
    return {} as ComplianceTraining;
  },
  deleteTraining: async (id: string): Promise<void> => {},
  enrollUserInTraining: async (trainingId: string, userId: string): Promise<UserTrainingRecord> => {
    return {} as UserTrainingRecord;
  },
  completeTraining: async (trainingId: string, userId: string, data: any): Promise<UserTrainingRecord> => {
    return {} as UserTrainingRecord;
  },
  
  // Incident mutations
  createIncident: async (data: Partial<ComplianceIncident>): Promise<ComplianceIncident> => {
    return {} as ComplianceIncident;
  },
  updateIncident: async (id: string, data: Partial<ComplianceIncident>): Promise<ComplianceIncident> => {
    return {} as ComplianceIncident;
  },
  deleteIncident: async (id: string): Promise<void> => {},
  resolveIncident: async (id: string, resolution: string): Promise<ComplianceIncident> => {
    return {} as ComplianceIncident;
  },
  
  // Risk Assessment mutations
  createRiskAssessment: async (data: Partial<RiskAssessment>): Promise<RiskAssessment> => {
    return {} as RiskAssessment;
  },
  updateRiskAssessment: async (id: string, data: Partial<RiskAssessment>): Promise<RiskAssessment> => {
    return {} as RiskAssessment;
  },
  deleteRiskAssessment: async (id: string): Promise<void> => {},
  approveRiskAssessment: async (id: string): Promise<RiskAssessment> => {
    return {} as RiskAssessment;
  },
};

// Audit Mutations
export const useCreateAudit = (
  options?: UseMutationOptions<ComplianceAudit, Error, Partial<ComplianceAudit>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockComplianceAPI.createAudit,
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
    mutationFn: ({ id, data }) => mockComplianceAPI.updateAudit(id, data),
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
    mutationFn: mockComplianceAPI.deleteAudit,
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
    mutationFn: mockComplianceAPI.createPolicy,
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
    mutationFn: ({ id, data }) => mockComplianceAPI.updatePolicy(id, data),
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
    mutationFn: mockComplianceAPI.deletePolicy,
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
    mutationFn: mockComplianceAPI.approvePolicy,
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
    mutationFn: mockComplianceAPI.createTraining,
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
    mutationFn: ({ id, data }) => mockComplianceAPI.updateTraining(id, data),
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
    mutationFn: mockComplianceAPI.deleteTraining,
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
    mutationFn: ({ trainingId, userId }) => mockComplianceAPI.enrollUserInTraining(trainingId, userId),
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
    mutationFn: ({ trainingId, userId, data }) => mockComplianceAPI.completeTraining(trainingId, userId, data),
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
    mutationFn: mockComplianceAPI.createIncident,
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
    mutationFn: ({ id, data }) => mockComplianceAPI.updateIncident(id, data),
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
    mutationFn: mockComplianceAPI.deleteIncident,
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
    mutationFn: ({ id, resolution }) => mockComplianceAPI.resolveIncident(id, resolution),
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
    mutationFn: mockComplianceAPI.createRiskAssessment,
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
    mutationFn: ({ id, data }) => mockComplianceAPI.updateRiskAssessment(id, data),
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
    mutationFn: mockComplianceAPI.deleteRiskAssessment,
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
    mutationFn: mockComplianceAPI.approveRiskAssessment,
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
