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

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useCacheManager } from '../../../shared/useCacheManager';
import { appointmentQueryKeys } from '../config';
import type {
  Appointment,
  AppointmentFormData,
  WaitlistEntryData,
} from '@/types';
import {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  type CreateAppointmentMutation,
  type UpdateAppointmentMutation,
} from './useAppointmentCrudMutations';
import {
  useCancelAppointmentMutation,
  useAddToWaitlistMutation,
  type CancelAppointmentMutation,
  type AddToWaitlistMutation,
} from './useAppointmentActionMutations';

// Re-export mutation options and types
export type { AppointmentMutationOptions } from './useAppointmentCrudMutations';
export type {
  CreateAppointmentMutation,
  UpdateAppointmentMutation,
} from './useAppointmentCrudMutations';
export type {
  CancelAppointmentMutation,
  AddToWaitlistMutation,
} from './useAppointmentActionMutations';

// Import the options interface locally
import type { AppointmentMutationOptions } from './useAppointmentCrudMutations';

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
  const { invalidateCache: invalidateCacheManager } = useCacheManager();

  // Use modular mutation hooks
  const createAppointmentMutation = useCreateAppointmentMutation(options);
  const updateAppointmentMutation = useUpdateAppointmentMutation(options);
  const cancelAppointmentMutation = useCancelAppointmentMutation(options);
  const addToWaitlistMutation = useAddToWaitlistMutation(options);

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
  const mutation = useCreateAppointmentMutation(options);
  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

export function useUpdateAppointment(options: AppointmentMutationOptions = {}) {
  const mutation = useUpdateAppointmentMutation(options);
  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

export function useCancelAppointment(options: AppointmentMutationOptions = {}) {
  const mutation = useCancelAppointmentMutation(options);
  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
