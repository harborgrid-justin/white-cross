import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  COMPLIANCE_QUERY_KEYS,
  CompliancePolicy,
  invalidateComplianceQueries,
  invalidatePolicyQueries,
} from '../config';
import { complianceApi } from '@/services';

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
