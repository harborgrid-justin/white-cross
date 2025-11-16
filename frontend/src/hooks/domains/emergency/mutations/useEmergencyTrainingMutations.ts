import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateTrainingQueries,
  EmergencyTraining,
} from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/server';
import { useApiError } from '@/hooks/shared/useApiError';
import {
  CreateTrainingInput,
  UpdateTrainingInput,
} from './types';

// Emergency Training Mutations
export const useCreateTraining = (
  options?: UseMutationOptions<EmergencyTraining, Error, CreateTrainingInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateTrainingInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-training
        const response = await serverPost('/api/v1/emergency-training', data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newTraining) => {
      invalidateTrainingQueries(queryClient);
      toast.success(`Training "${newTraining.title}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create training: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateTraining = (
  options?: UseMutationOptions<EmergencyTraining, Error, UpdateTrainingInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateTrainingInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-training/:id
        const response = await serverPut(`/api/v1/emergency-training/${data.id}`, data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (updatedTraining) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.trainingDetails(updatedTraining.id),
        updatedTraining
      );
      invalidateTrainingQueries(queryClient);
      toast.success('Training updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update training: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteTraining = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (trainingId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-training/:id
        await serverDelete(`/api/v1/emergency-training/${trainingId}`);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateTrainingQueries(queryClient);
      toast.success('Training deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete training: ${error.message}`);
    },
    ...options,
  });
};
