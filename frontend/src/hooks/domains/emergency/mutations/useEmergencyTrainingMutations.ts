import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateTrainingQueries,
  EmergencyTraining,
} from '../config';
import { mockEmergencyMutationAPI } from './api';
import {
  CreateTrainingInput,
  UpdateTrainingInput,
} from './types';

// Emergency Training Mutations
export const useCreateTraining = (
  options?: UseMutationOptions<EmergencyTraining, Error, CreateTrainingInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createTraining,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateTraining,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteTraining,
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
