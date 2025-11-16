import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateEmergencyPlansQueries,
  invalidateAllEmergencyQueries,
  EmergencyPlan,
} from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/server';
import { useApiError } from '@/hooks/shared/useApiError';
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
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateEmergencyPlanInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-plans
        const response = await serverPost('/api/v1/emergency-plans', data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
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
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateEmergencyPlanInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-plans/:id
        const response = await serverPut(`/api/v1/emergency-plans/${data.id}`, data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
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
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (planId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-plans/:id
        await serverDelete(`/api/v1/emergency-plans/${planId}`);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
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
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: ActivatePlanInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-plans/:planId/activate
        await serverPost(`/api/v1/emergency-plans/${data.planId}/activate`, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
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
