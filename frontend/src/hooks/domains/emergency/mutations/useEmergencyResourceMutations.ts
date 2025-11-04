import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateResourcesQueries,
  EmergencyResource,
} from '../config';
import { mockEmergencyMutationAPI } from './api';
import {
  CreateResourceInput,
  UpdateResourceInput,
} from './types';

// Emergency Resources Mutations
export const useCreateResource = (
  options?: UseMutationOptions<EmergencyResource, Error, CreateResourceInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createResource,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateResource,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteResource,
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
