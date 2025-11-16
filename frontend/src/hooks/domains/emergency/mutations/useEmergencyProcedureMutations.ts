import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateProceduresQueries,
  EmergencyProcedure,
} from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/server';
import { useApiError } from '@/hooks/shared/useApiError';
import {
  CreateProcedureInput,
  UpdateProcedureInput,
} from './types';

// Emergency Procedures Mutations
export const useCreateProcedure = (
  options?: UseMutationOptions<EmergencyProcedure, Error, CreateProcedureInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateProcedureInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-procedures
        const response = await serverPost('/api/v1/emergency-procedures', data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newProcedure) => {
      invalidateProceduresQueries(queryClient);
      toast.success(`Procedure "${newProcedure.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create procedure: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateProcedure = (
  options?: UseMutationOptions<EmergencyProcedure, Error, UpdateProcedureInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateProcedureInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-procedures/:id
        const response = await serverPut(`/api/v1/emergency-procedures/${data.id}`, data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (updatedProcedure) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.procedureDetails(updatedProcedure.id),
        updatedProcedure
      );
      invalidateProceduresQueries(queryClient);
      toast.success('Procedure updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update procedure: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteProcedure = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (procedureId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-procedures/:id
        await serverDelete(`/api/v1/emergency-procedures/${procedureId}`);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateProceduresQueries(queryClient);
      toast.success('Procedure deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete procedure: ${error.message}`);
    },
    ...options,
  });
};
