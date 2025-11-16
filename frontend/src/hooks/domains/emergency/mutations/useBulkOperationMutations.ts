import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  invalidateIncidentsQueries,
  invalidateResourcesQueries,
} from '../config';
import { serverPost } from '@/lib/api/server';
import { useApiError } from '@/hooks/shared/useApiError';

// Bulk Operations
export const useBulkUpdateIncidents = (
  options?: UseMutationOptions<void, Error, { incidentIds: string[]; updates: any }>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async ({ incidentIds, updates }) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-incidents/bulk-update
        await serverPost('/api/v1/emergency-incidents/bulk-update', { incidentIds, updates });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, { incidentIds }) => {
      invalidateIncidentsQueries(queryClient);
      toast.success(`${incidentIds.length} incidents updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update incidents: ${error.message}`);
    },
    ...options,
  });
};

export const useBulkActivateResources = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (resourceIds: string[]) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-resources/bulk-activate
        await serverPost('/api/v1/emergency-resources/bulk-activate', { resourceIds });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, resourceIds) => {
      invalidateResourcesQueries(queryClient);
      toast.success(`${resourceIds.length} resources activated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to activate resources: ${error.message}`);
    },
    ...options,
  });
};
