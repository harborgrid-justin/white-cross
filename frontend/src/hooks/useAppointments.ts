/**
 * WF-COMP-127 | useAppointments.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/services/api, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Appointments Domain Hook
 * Provides comprehensive appointment management functionality using TanStack Query
 * Implements enterprise patterns with proper caching, optimistic updates, and error handling
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { appointmentsApi } from '@/services/api';
import type {
  Appointment,
  AppointmentFilters,
  AppointmentFormData,
  AppointmentStatistics,
  PaginatedResponse,
  WaitlistEntryData,
  WaitlistFilters,
  AvailabilitySlot,
  NurseAvailability,
  NurseAvailabilityData,
  RecurringAppointmentData
} from '@/types';
import toast from 'react-hot-toast';

// =====================
// QUERY KEYS
// =====================
// Centralized query key factory for better cache management
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters?: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  statistics: (filters?: { nurseId?: string; dateFrom?: string; dateTo?: string }) =>
    [...appointmentKeys.all, 'statistics', filters] as const,
  upcoming: (nurseId: string, limit?: number) =>
    [...appointmentKeys.all, 'upcoming', nurseId, limit] as const,
  waitlist: (filters?: WaitlistFilters) =>
    [...appointmentKeys.all, 'waitlist', filters] as const,
  availability: (nurseId: string, date?: string, duration?: number) =>
    [...appointmentKeys.all, 'availability', nurseId, date, duration] as const,
  nurseAvailability: (nurseId: string, date?: string) =>
    [...appointmentKeys.all, 'nurseAvailability', nurseId, date] as const,
};

// =====================
// HOOKS - QUERIES
// =====================

/**
 * Get all appointments with filtering and pagination
 * Uses aggressive caching with 5-minute stale time
 */
export function useAppointments(
  filters?: AppointmentFilters,
  options?: Omit<UseQueryOptions<PaginatedResponse<Appointment>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    ...options,
  });
}

/**
 * Get upcoming appointments for a specific nurse
 */
export function useUpcomingAppointments(
  nurseId: string,
  limit?: number,
  options?: Omit<UseQueryOptions<{ appointments: Appointment[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.upcoming(nurseId, limit),
    queryFn: () => appointmentsApi.getUpcoming(nurseId, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for upcoming appointments
    enabled: !!nurseId,
    ...options,
  });
}

/**
 * Get appointment statistics with caching
 */
export function useAppointmentStats(
  filters?: { nurseId?: string; dateFrom?: string; dateTo?: string },
  options?: Omit<UseQueryOptions<AppointmentStatistics>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.statistics(filters),
    queryFn: () => appointmentsApi.getStatistics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Get appointment waitlist
 */
export function useWaitlist(
  filters?: WaitlistFilters,
  options?: Omit<UseQueryOptions<{ waitlist: WaitlistEntryData[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.waitlist(filters),
    queryFn: () => appointmentsApi.getWaitlist(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...options,
  });
}

/**
 * Get available time slots for scheduling
 */
export function useAvailability(
  nurseId: string,
  date?: string,
  duration?: number,
  options?: Omit<UseQueryOptions<{ slots: AvailabilitySlot[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.availability(nurseId, date, duration),
    queryFn: () => appointmentsApi.getAvailability(nurseId, date, duration),
    staleTime: 1 * 60 * 1000, // 1 minute - short stale time for availability
    enabled: !!nurseId,
    ...options,
  });
}

/**
 * Get nurse availability schedule
 */
export function useNurseAvailability(
  nurseId: string,
  date?: string,
  options?: Omit<UseQueryOptions<{ availability: NurseAvailability[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.nurseAvailability(nurseId, date),
    queryFn: () => appointmentsApi.getNurseAvailability(nurseId, date),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!nurseId,
    ...options,
  });
}

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
    mutationFn: (data: AppointmentFormData) => appointmentsApi.create(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentFormData> }) =>
      appointmentsApi.update(id, data),
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

// =====================
// COMPOSITE HOOKS
// =====================

/**
 * Combined hook for appointment management dashboard
 * Fetches appointments, statistics, and waitlist in parallel
 */
export function useAppointmentDashboard(
  filters?: AppointmentFilters,
  statsFilters?: { nurseId?: string; dateFrom?: string; dateTo?: string },
  waitlistFilters?: WaitlistFilters
) {
  const appointments = useAppointments(filters);
  const statistics = useAppointmentStats(statsFilters);
  const waitlist = useWaitlist(waitlistFilters);

  return {
    appointments,
    statistics,
    waitlist,
    isLoading: appointments.isLoading || statistics.isLoading || waitlist.isLoading,
    isError: appointments.isError || statistics.isError || waitlist.isError,
    refetchAll: () => {
      appointments.refetch();
      statistics.refetch();
      waitlist.refetch();
    },
  };
}
