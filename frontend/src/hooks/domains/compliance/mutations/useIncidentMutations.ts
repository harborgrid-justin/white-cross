import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  COMPLIANCE_QUERY_KEYS,
  ComplianceIncident,
  invalidateComplianceQueries,
  invalidateIncidentQueries,
} from '../config';

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
