/**
 * WF-COMP-127 | mutations.ts - Appointment mutation hooks
 * Purpose: TanStack Query hooks for appointment data mutations
 * Upstream: React, TanStack Query | Dependencies: @tanstack/react-query, @/services/api, react-hot-toast
 * Downstream: Components, forms | Called by: React component tree
 * Related: queries.ts, query-keys.ts
 * Exports: Mutation hooks | Key Features: Optimistic updates, cache invalidation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: User action → Mutation → Cache update → UI refresh
 * LLM Context: TanStack Query hooks for appointment mutations with optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/services/api';
import type {
  AppointmentFormData,
  RecurringAppointmentData,
  NurseAvailabilityData,
} from '@/types';
import toast from 'react-hot-toast';
import { appointmentKeys } from './query-keys';

// =====================
// HOOKS - MUTATIONS
// =====================

/**
 * Create a new appointment
 * Implements optimistic updates and cache invalidation
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentFormData) => {
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
      return appointmentsApi.create(createData);
    },
    onMutate: async (newAppointment) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: appointmentKeys.lists() });

      // Snapshot previous values for rollback
      const previousAppointments = queryClient.getQueriesData({
        queryKey: appointmentKeys.lists()
      });

      return { previousAppointments };
    },
    onSuccess: (data) => {
      // Invalidate and refetch all appointment queries
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming(data.appointment.nurseId) });

      toast.success('Appointment scheduled successfully');
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousAppointments) {
        context.previousAppointments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error('Failed to schedule appointment');
      console.error('Create appointment error:', error);
    },
  });
}

/**
 * Update an existing appointment
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentFormData> }) => {
      // Convert Partial<AppointmentFormData> to UpdateAppointmentData
      const updateData = {
        ...data,
        scheduledAt: data.scheduledAt ? data.scheduledAt.toISOString() : undefined,
      };
      return appointmentsApi.update(id, updateData);
    },
    onSuccess: (data) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data.appointment.id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.statistics() });

      toast.success('Appointment updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update appointment');
      console.error('Update appointment error:', error);
    },
  });
}

/**
 * Cancel an appointment
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      appointmentsApi.cancel(id, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data.appointment.id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.statistics() });

      toast.success('Appointment cancelled successfully');
    },
    onError: (error) => {
      toast.error('Failed to cancel appointment');
      console.error('Cancel appointment error:', error);
    },
  });
}

/**
 * Mark appointment as no-show
 */
export function useMarkNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.markNoShow(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data.appointment.id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.statistics() });

      toast.success('Appointment marked as no-show');
    },
    onError: (error) => {
      toast.error('Failed to mark appointment as no-show');
      console.error('Mark no-show error:', error);
    },
  });
}

/**
 * Create recurring appointments
 */
export function useCreateRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecurringAppointmentData) => appointmentsApi.createRecurring(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.statistics() });

      toast.success(`${result.count} recurring appointments created successfully`);
    },
    onError: (error) => {
      toast.error('Failed to create recurring appointments');
      console.error('Create recurring error:', error);
    },
  });
}

/**
 * Add student to waitlist
 */
export function useAddToWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      studentId: string;
      nurseId?: string;
      type: string;
      reason: string;
      priority?: string;
      preferredDate?: string;
      duration?: number;
      notes?: string;
    }) => appointmentsApi.addToWaitlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.waitlist() });
      toast.success('Student added to waitlist');
    },
    onError: (error) => {
      toast.error('Failed to add student to waitlist');
      console.error('Add to waitlist error:', error);
    },
  });
}

/**
 * Remove student from waitlist
 */
export function useRemoveFromWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      appointmentsApi.removeFromWaitlist(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.waitlist() });
      toast.success('Student removed from waitlist');
    },
    onError: (error) => {
      toast.error('Failed to remove student from waitlist');
      console.error('Remove from waitlist error:', error);
    },
  });
}

/**
 * Set nurse availability
 */
export function useSetAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NurseAvailabilityData) => appointmentsApi.setAvailability(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.nurseAvailability(data.availability.nurseId)
      });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.availability(data.availability.nurseId)
      });

      toast.success('Availability set successfully');
    },
    onError: (error) => {
      toast.error('Failed to set availability');
      console.error('Set availability error:', error);
    },
  });
}

/**
 * Update nurse availability
 */
export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NurseAvailabilityData> }) =>
      appointmentsApi.updateAvailability(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.nurseAvailability(data.availability.nurseId)
      });

      toast.success('Availability updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update availability');
      console.error('Update availability error:', error);
    },
  });
}

/**
 * Delete nurse availability
 */
export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.deleteAvailability(id),
    onSuccess: () => {
      // Invalidate all availability queries since we don't have nurseId in response
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });

      toast.success('Availability deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete availability');
      console.error('Delete availability error:', error);
    },
  });
}

/**
 * Export calendar
 * Returns a blob for download
 */
export function useExportCalendar() {
  return useMutation({
    mutationFn: ({ nurseId, dateFrom, dateTo }: {
      nurseId: string;
      dateFrom?: string;
      dateTo?: string
    }) => appointmentsApi.exportCalendar(nurseId, dateFrom, dateTo),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments-${new Date().toISOString().split('T')[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Calendar exported successfully');
    },
    onError: (error) => {
      toast.error('Failed to export calendar');
      console.error('Export calendar error:', error);
    },
  });
}
