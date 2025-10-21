/**
 * Appointment Mutation Hooks
 * 
 * Enterprise-grade mutations for appointment management with
 * proper PHI handling, optimistic updates, and compliance logging.
 * 
 * @module hooks/domains/appointments/mutations/useAppointmentMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { appointmentsApi } from '@/services/api';
import { useApiError } from '../../../shared/useApiError';
import { useCacheManager } from '../../../shared/useCacheManager';
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
 * Appointment mutations result interface
 */
export interface AppointmentMutationsResult {
  // Create operations
  createAppointment: {
    mutate: (data: AppointmentFormData) => void;
    mutateAsync: (data: AppointmentFormData) => Promise<{ appointment: Appointment }>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Update operations
  updateAppointment: {
    mutate: (data: { id: string; data: Partial<AppointmentFormData> }) => void;
    mutateAsync: (data: { id: string; data: Partial<AppointmentFormData> }) => Promise<{ appointment: Appointment }>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Cancel operations
  cancelAppointment: {
    mutate: (data: { id: string; reason?: string }) => void;
    mutateAsync: (data: { id: string; reason?: string }) => Promise<{ appointment: Appointment }>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Waitlist operations
  addToWaitlist: {
    mutate: (data: WaitlistEntryData) => void;
    mutateAsync: (data: WaitlistEntryData) => Promise<any>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Utility functions
  invalidateAppointmentData: (appointmentId?: string) => Promise<void>;
}

/**
 * Enterprise appointment mutations hook
 */
export function useAppointmentMutations(
  options: AppointmentMutationOptions = {}
): AppointmentMutationsResult {
  const queryClient = useQueryClient();
  const { handleApiError } = useApiError();
  const { invalidateCacheManager } = useCacheManager();
  const { logCompliantAccess } = useHealthcareCompliance();

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationKey: [APPOINTMENT_OPERATIONS.CREATE],
    mutationFn: async (data: AppointmentFormData) => {
      try {
        await logCompliantAccess(
          'create_appointment',
          'appointment',
          'high',
          { operation: 'create_appointment' }
        );

        const result = await appointmentsApi.create(data);
        
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

  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationKey: [APPOINTMENT_OPERATIONS.UPDATE],
    mutationFn: async ({ id, data }: { id: string; data: Partial<AppointmentFormData> }) => {
      try {
        await logCompliantAccess(
          'update_appointment',
          'appointment',
          'high',
          { appointmentId: id }
        );

        const result = await appointmentsApi.update(id, data);
        
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

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
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

  // Add to waitlist mutation
  const addToWaitlistMutation = useMutation({
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

  // Cache invalidation utility
  const invalidateAppointmentData = useCallback(async (appointmentId?: string) => {
    if (appointmentId) {
      // Invalidate specific appointment
      await invalidateCacheManager([...appointmentQueryKeys.details.byId(appointmentId)], 'exact');
      queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.details.byId(appointmentId),
      });
    } else {
      // Invalidate all appointment data
      await invalidateCacheManager([...appointmentQueryKeys.domain], 'prefix');
      queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.domain,
      });
    }
  }, [invalidateCacheManager, queryClient]);

  // Return mutations with consistent interface
  return useMemo(
    () => ({
      createAppointment: {
        mutate: createAppointmentMutation.mutate,
        mutateAsync: createAppointmentMutation.mutateAsync,
        isLoading: createAppointmentMutation.isPending,
        error: createAppointmentMutation.error,
        isError: createAppointmentMutation.isError,
        isSuccess: createAppointmentMutation.isSuccess,
      },
      updateAppointment: {
        mutate: updateAppointmentMutation.mutate,
        mutateAsync: updateAppointmentMutation.mutateAsync,
        isLoading: updateAppointmentMutation.isPending,
        error: updateAppointmentMutation.error,
        isError: updateAppointmentMutation.isError,
        isSuccess: updateAppointmentMutation.isSuccess,
      },
      cancelAppointment: {
        mutate: cancelAppointmentMutation.mutate,
        mutateAsync: cancelAppointmentMutation.mutateAsync,
        isLoading: cancelAppointmentMutation.isPending,
        error: cancelAppointmentMutation.error,
        isError: cancelAppointmentMutation.isError,
        isSuccess: cancelAppointmentMutation.isSuccess,
      },
      addToWaitlist: {
        mutate: addToWaitlistMutation.mutate,
        mutateAsync: addToWaitlistMutation.mutateAsync,
        isLoading: addToWaitlistMutation.isPending,
        error: addToWaitlistMutation.error,
        isError: addToWaitlistMutation.isError,
        isSuccess: addToWaitlistMutation.isSuccess,
      },
      invalidateAppointmentData,
    }),
    [
      createAppointmentMutation,
      updateAppointmentMutation,
      cancelAppointmentMutation,
      addToWaitlistMutation,
      invalidateAppointmentData,
    ]
  );
}

/**
 * Convenience hooks for specific operations
 */

export function useCreateAppointment(options: AppointmentMutationOptions = {}) {
  const { createAppointment } = useAppointmentMutations(options);
  return createAppointment;
}

export function useUpdateAppointment(options: AppointmentMutationOptions = {}) {
  const { updateAppointment } = useAppointmentMutations(options);
  return updateAppointment;
}

export function useCancelAppointment(options: AppointmentMutationOptions = {}) {
  const { cancelAppointment } = useAppointmentMutations(options);
  return cancelAppointment;
}