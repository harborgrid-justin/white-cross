/**
 * Appointment Action Mutation Hooks
 *
 * Handles cancellation and waitlist operations for appointments with
 * proper PHI handling and compliance logging.
 *
 * @module hooks/domains/appointments/mutations/useAppointmentActionMutations
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
  WaitlistEntryData,
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
 * Cancel appointment mutation hook
 */
export function useCancelAppointmentMutation(options: AppointmentMutationOptions = {}) {
  const queryClient = useQueryClient();
  const { handleError: handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useMutation({
    mutationKey: [APPOINTMENT_OPERATIONS.CANCEL],
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      try {
        await logCompliantAccess(
          'cancel_appointment',
          'appointment',
          'high',
          { appointmentId: id, reason }
        );

        const result = await appointmentsApi.cancel(id, reason);

        if (!result.appointment) {
          throw new Error(APPOINTMENT_ERROR_CODES.DELETE_FAILED);
        }

        return result;
      } catch (error: any) {
        throw handleApiError(error, APPOINTMENT_OPERATIONS.CANCEL);
      }
    },
    onSuccess: (result, { id }) => {
      // Update cache with cancelled appointment
      queryClient.setQueryData(
        appointmentQueryKeys.details.byId(id),
        result
      );

      // Invalidate lists and statistics
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.base.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.base.statistics() });

      toast.success('Appointment cancelled successfully');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel appointment');
      options.onError?.(error);
    },
    gcTime: APPOINTMENT_CACHE_CONFIG.mutations.gcTime,
  });
}

/**
 * Add to waitlist mutation hook
 */
export function useAddToWaitlistMutation(options: AppointmentMutationOptions = {}) {
  const queryClient = useQueryClient();
  const { handleError: handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useMutation({
    mutationKey: [APPOINTMENT_OPERATIONS.ADD_TO_WAITLIST],
    mutationFn: async (data: WaitlistEntryData) => {
      try {
        await logCompliantAccess(
          'add_to_waitlist',
          'appointment',
          'moderate',
          { studentId: data.studentId }
        );

        return await appointmentsApi.addToWaitlist(data);
      } catch (error: any) {
        throw handleApiError(error, APPOINTMENT_OPERATIONS.ADD_TO_WAITLIST);
      }
    },
    onSuccess: (result) => {
      // Invalidate waitlist queries
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.base.waitlist() });

      toast.success('Student added to waitlist');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to add student to waitlist');
      options.onError?.(error);
    },
    gcTime: APPOINTMENT_CACHE_CONFIG.mutations.gcTime,
  });
}

/**
 * Cancel appointment result interface
 */
export interface CancelAppointmentMutation {
  mutate: (data: { id: string; reason?: string }) => void;
  mutateAsync: (data: { id: string; reason?: string }) => Promise<{ appointment: Appointment }>;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Add to waitlist result interface
 */
export interface AddToWaitlistMutation {
  mutate: (data: WaitlistEntryData) => void;
  mutateAsync: (data: WaitlistEntryData) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}
