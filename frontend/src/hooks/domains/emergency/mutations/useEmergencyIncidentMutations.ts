import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateIncidentsQueries,
  invalidateAllEmergencyQueries,
  EmergencyIncident,
  IncidentTimelineEntry,
} from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/server';
import { useApiError } from '@/hooks/shared/useApiError';
import {
  CreateIncidentInput,
  UpdateIncidentInput,
  AddTimelineEntryInput,
} from './types';

// Emergency Incidents Mutations
export const useCreateIncident = (
  options?: UseMutationOptions<EmergencyIncident, Error, CreateIncidentInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateIncidentInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-incidents
        const response = await serverPost('/api/v1/emergency-incidents', data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newIncident) => {
      invalidateIncidentsQueries(queryClient);
      invalidateAllEmergencyQueries(queryClient);
      toast.success(`Incident "${newIncident.title}" reported successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create incident: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateIncident = (
  options?: UseMutationOptions<EmergencyIncident, Error, UpdateIncidentInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateIncidentInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-incidents/:id
        const response = await serverPut(`/api/v1/emergency-incidents/${data.id}`, data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (updatedIncident) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.incidentDetails(updatedIncident.id),
        updatedIncident
      );
      invalidateIncidentsQueries(queryClient);
      toast.success('Incident updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update incident: ${error.message}`);
    },
    ...options,
  });
};

export const useCloseIncident = (
  options?: UseMutationOptions<void, Error, { id: string; summary: string }>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async ({ id, summary }) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-incidents/:id/close
        await serverPost(`/api/v1/emergency-incidents/${id}/close`, { summary });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(id) });
      invalidateIncidentsQueries(queryClient);
      toast.success('Incident closed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to close incident: ${error.message}`);
    },
    ...options,
  });
};

export const useAddTimelineEntry = (
  options?: UseMutationOptions<IncidentTimelineEntry, Error, AddTimelineEntryInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: AddTimelineEntryInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented - /api/v1/emergency-incidents/:incidentId/timeline
        const response = await serverPost(`/api/v1/emergency-incidents/${data.incidentId}/timeline`, data);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, { incidentId }) => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidentTimeline(incidentId) });
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(incidentId) });
      toast.success('Timeline entry added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add timeline entry: ${error.message}`);
    },
    ...options,
  });
};
