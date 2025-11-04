/**
 * Appointment CRUD Mutation Hooks
 *
 * Handles create and update operations for appointments with
 * proper PHI handling, optimistic updates, and compliance logging.
 *
 * @module hooks/domains/appointments/mutations/useAppointmentCrudMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/services/api';
import { useApiError } from '../../../shared/useApiError';
import { useHealthcareCompliance } from '../../../shared/useHealthcareCompliance';
import {
  appointmentQueryKeys,
  APPOINTMENT_OPERATIONS,
  APPOINTMENT_ERROR_CODES,
  APPOINTMENT_CACHE_CONFIG
} from '../config';
import type {
  Appointment,
  AppointmentFormData,
} from '@/types';
import toast from 'react-hot-toast';

/**
 * Appointment mutation options interface
 */
export interface AppointmentMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enableOptimisticUpdates?: boolean;
}

/**
 * Create appointment mutation hook
 */
export function useCreateAppointmentMutation(options: AppointmentMutationOptions = {}) {
  const queryClient = useQueryClient();
  const { handleError: handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useMutation({
    mutationKey: [APPOINTMENT_OPERATIONS.CREATE],
    mutationFn: async (data: AppointmentFormData) => {
      try {
        await logCompliantAccess(
          'create_appointment',
          'appointment',
          'high',
          { operation: 'create_appointment' }
        );

        // Convert AppointmentFormData to CreateAppointmentData
        const createData = {
          studentId: data.studentId,
          nurseId: data.nurseId,
          type: data.type,
          scheduledAt: data.scheduledAt.toISOString(),
          duration: data.duration,
          reason: data.reason,
          notes: data.notes,
        };

        const result = await appointmentsApi.create(createData);

        if (!result.appointment) {
          throw new Error(APPOINTMENT_ERROR_CODES.CREATE_FAILED);
        }

        return result;
      } catch (error: any) {
        throw handleApiError(error, APPOINTMENT_OPERATIONS.CREATE);
      }
    },
    onMutate: async (_newAppointment) => {
      if (!options.enableOptimisticUpdates) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: appointmentQueryKeys.base.lists() });

      // Snapshot previous values
      const previousAppointments = queryClient.getQueriesData({
        queryKey: appointmentQueryKeys.base.lists()
      });

      return { previousAppointments };
    },
    onSuccess: (result) => {
      const appointment = result.appointment;

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.base.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.base.statistics() });
      queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.lists.upcoming(appointment.nurseId)
      });

      toast.success('Appointment scheduled successfully');
      options.onSuccess?.(result);
    },
    onError: (error: Error, _variables, context: any) => {
      // Rollback optimistic updates
      if (context?.previousAppointments) {
        context.previousAppointments.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error('Failed to schedule appointment');
      options.onError?.(error);
    },
    gcTime: APPOINTMENT_CACHE_CONFIG.mutations.gcTime,
  });
}

/**
 * Update appointment mutation hook
 */
export function useUpdateAppointmentMutation(options: AppointmentMutationOptions = {}) {
  const queryClient = useQueryClient();
  const { handleError: handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useMutation({
    mutationKey: [APPOINTMENT_OPERATIONS.UPDATE],
    mutationFn: async ({ id, data }: { id: string; data: Partial<AppointmentFormData> }) => {
      try {
        await logCompliantAccess(
          'update_appointment',
          'appointment',
          'high',
          { appointmentId: id }
        );

        // Convert Partial<AppointmentFormData> to UpdateAppointmentData
        const updateData = {
          ...data,
          scheduledAt: data.scheduledAt ? data.scheduledAt.toISOString() : undefined,
        };

        const result = await appointmentsApi.update(id, updateData);

        if (!result.appointment) {
          throw new Error(APPOINTMENT_ERROR_CODES.UPDATE_FAILED);
        }

        return result;
      } catch (error: any) {
        throw handleApiError(error, APPOINTMENT_OPERATIONS.UPDATE);
      }
    },
    onSuccess: (result, { id }) => {
      // Update specific appointment cache
      queryClient.setQueryData(
        appointmentQueryKeys.details.byId(id),
        result
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.base.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.base.statistics() });

      toast.success('Appointment updated successfully');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to update appointment');
      options.onError?.(error);
    },
    gcTime: APPOINTMENT_CACHE_CONFIG.mutations.gcTime,
  });
}

/**
 * Create appointment result interface
 */
export interface CreateAppointmentMutation {
  mutate: (data: AppointmentFormData) => void;
  mutateAsync: (data: AppointmentFormData) => Promise<{ appointment: Appointment }>;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Update appointment result interface
 */
export interface UpdateAppointmentMutation {
  mutate: (data: { id: string; data: Partial<AppointmentFormData> }) => void;
  mutateAsync: (data: { id: string; data: Partial<AppointmentFormData> }) => Promise<{ appointment: Appointment }>;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}
