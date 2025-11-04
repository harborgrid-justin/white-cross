import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  COMPLIANCE_QUERY_KEYS,
  RiskAssessment,
  invalidateComplianceQueries,
  invalidateRiskAssessmentQueries,
} from '../config';

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
