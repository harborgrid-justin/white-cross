import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateIncidentsQueries,
  invalidateAllEmergencyQueries,
  EmergencyIncident,
  IncidentTimelineEntry,
} from '../config';
import { mockEmergencyMutationAPI } from './api';
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createIncident,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateIncident,
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

  return useMutation({
    mutationFn: ({ id, summary }) => mockEmergencyMutationAPI.closeIncident(id, summary),
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.addTimelineEntry,
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
