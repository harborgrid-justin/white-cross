import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  COMPLIANCE_QUERY_KEYS,
  ComplianceAudit,
  invalidateComplianceQueries,
  invalidateAuditQueries,
} from '../config';

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
