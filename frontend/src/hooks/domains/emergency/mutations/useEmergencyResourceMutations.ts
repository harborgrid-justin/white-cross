import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateResourcesQueries,
  EmergencyResource,
} from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/server';
import { useApiError } from '@/hooks/shared/useApiError';
import {
  CreateResourceInput,
  UpdateResourceInput,
} from './types';

// Emergency Resources Mutations
export const useCreateResource = (
  options?: UseMutationOptions<EmergencyResource, Error, CreateResourceInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateResourceInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-resources
        return await serverPost('/api/v1/emergency-resources', data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newResource) => {
      invalidateResourcesQueries(queryClient);
      toast.success(`Resource "${newResource.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create resource: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateResource = (
  options?: UseMutationOptions<EmergencyResource, Error, UpdateResourceInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateResourceInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-resources/:id
        return await serverPut(`/api/v1/emergency-resources/${data.id}`, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (updatedResource) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.resourceDetails(updatedResource.id),
        updatedResource
      );
      invalidateResourcesQueries(queryClient);
      toast.success('Resource updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update resource: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteResource = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-resources/:id
        await serverDelete(`/api/v1/emergency-resources/${resourceId}`);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateResourcesQueries(queryClient);
      toast.success('Resource deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete resource: ${error.message}`);
    },
    ...options,
  });
};
