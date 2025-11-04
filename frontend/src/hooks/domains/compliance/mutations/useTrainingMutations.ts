import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  COMPLIANCE_QUERY_KEYS,
  ComplianceTraining,
  UserTrainingRecord,
  invalidateComplianceQueries,
  invalidateTrainingQueries,
} from '../config';

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
