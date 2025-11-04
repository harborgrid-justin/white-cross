import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateEmergencyPlansQueries,
  invalidateAllEmergencyQueries,
  EmergencyPlan,
} from '../config';
import { mockEmergencyMutationAPI } from './api';
import {
  CreateEmergencyPlanInput,
  UpdateEmergencyPlanInput,
  ActivatePlanInput,
} from './types';

// Emergency Plans Mutations
export const useCreateEmergencyPlan = (
  options?: UseMutationOptions<EmergencyPlan, Error, CreateEmergencyPlanInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createEmergencyPlan,
    onSuccess: (newPlan) => {
      invalidateEmergencyPlansQueries(queryClient);
      toast.success(`Emergency plan "${newPlan.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create emergency plan: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateEmergencyPlan = (
  options?: UseMutationOptions<EmergencyPlan, Error, UpdateEmergencyPlanInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateEmergencyPlan,
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.emergencyPlanDetails(updatedPlan.id),
        updatedPlan
      );
      invalidateEmergencyPlansQueries(queryClient);
      toast.success('Emergency plan updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update emergency plan: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteEmergencyPlan = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteEmergencyPlan,
    onSuccess: () => {
      invalidateEmergencyPlansQueries(queryClient);
      toast.success('Emergency plan deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete emergency plan: ${error.message}`);
    },
    ...options,
  });
};

export const useActivatePlan = (
  options?: UseMutationOptions<void, Error, ActivatePlanInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.activatePlan,
    onSuccess: (_, { planId }) => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlanDetails(planId) });
      invalidateAllEmergencyQueries(queryClient);
      toast.success('Emergency plan activated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to activate emergency plan: ${error.message}`);
    },
    ...options,
  });
};
