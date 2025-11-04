import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  invalidateIncidentsQueries,
  invalidateResourcesQueries,
} from '../config';
import { mockEmergencyMutationAPI } from './api';

// Bulk Operations
export const useBulkUpdateIncidents = (
  options?: UseMutationOptions<void, Error, { incidentIds: string[]; updates: any }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ incidentIds, updates }) => mockEmergencyMutationAPI.bulkUpdateIncidents(incidentIds, updates),
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.bulkActivateResources,
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
