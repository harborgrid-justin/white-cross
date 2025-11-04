import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateProceduresQueries,
  EmergencyProcedure,
} from '../config';
import { mockEmergencyMutationAPI } from './api';
import {
  CreateProcedureInput,
  UpdateProcedureInput,
} from './types';

// Emergency Procedures Mutations
export const useCreateProcedure = (
  options?: UseMutationOptions<EmergencyProcedure, Error, CreateProcedureInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createProcedure,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateProcedure,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteProcedure,
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
