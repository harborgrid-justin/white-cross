/**
 * Appointment Query Hooks
 * 
 * Enterprise-grade query hooks for appointment data fetching with
 * proper PHI handling, caching, and compliance logging.
 * 
 * @module hooks/domains/appointments/queries/useAppointmentQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { appointmentsApi } from '@/services/api';
import { useApiError } from '../../../shared/useApiError';
import { useHealthcareCompliance } from '../../../shared/useHealthcareCompliance';
import { 
  appointmentQueryKeys, 
  APPOINTMENT_CACHE_CONFIG,
  type AppointmentListFilters
} from '../config';
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatistics,
  PaginatedResponse,
  WaitlistEntryData,
  WaitlistFilters,
  AvailabilitySlot,
  NurseAvailability,
} from '@/types';

/**
 * Get all appointments with filtering and pagination
 */
export function useAppointmentsList(
  filters?: AppointmentListFilters,
  options?: Omit<UseQueryOptions<PaginatedResponse<Appointment>>, 'queryKey' | 'queryFn'>
) {
  const { handleError: handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: appointmentQueryKeys.lists.filtered(filters),
    queryFn: async () => {
      try {
        // Log compliance access
        await logCompliantAccess(
          'view_appointments_list',
          'appointment',
          'moderate',
          { filters }
        );

        const result = await appointmentsApi.getAll(filters);
        return result;
      } catch (error: any) {
        throw handleApiError(error, 'fetch_appointments');
      }
    },
    staleTime: APPOINTMENT_CACHE_CONFIG.appointments.staleTime,
    gcTime: APPOINTMENT_CACHE_CONFIG.appointments.gcTime,
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
  const { handleError: handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: appointmentQueryKeys.lists.upcoming(nurseId, limit),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_upcoming_appointments',
          'appointment',
          'moderate',
          { nurseId, limit }
        );

        return await appointmentsApi.getUpcoming(nurseId, limit);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_upcoming_appointments');
      }
    },
    staleTime: APPOINTMENT_CACHE_CONFIG.upcoming.staleTime,
    gcTime: APPOINTMENT_CACHE_CONFIG.upcoming.gcTime,
    enabled: !!nurseId,
    ...options,
  });
}

/**
 * Get appointment statistics with caching
 */
export function useAppointmentStatistics(
  filters?: { nurseId?: string; dateFrom?: string; dateTo?: string },
  options?: Omit<UseQueryOptions<AppointmentStatistics>, 'queryKey' | 'queryFn'>
) {
  const { handleError: handleApiError } = useApiError();

  return useQuery({
    queryKey: appointmentQueryKeys.statistics.global(filters),
    queryFn: async () => {
      try {
        return await appointmentsApi.getStatistics(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_appointment_statistics');
      }
    },
    staleTime: APPOINTMENT_CACHE_CONFIG.statistics.staleTime,
    gcTime: APPOINTMENT_CACHE_CONFIG.statistics.gcTime,
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
  const { handleError: handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: appointmentQueryKeys.waitlist.all(filters),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_appointment_waitlist',
          'appointment',
          'moderate',
          { filters }
        );

        return await appointmentsApi.getWaitlist(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_waitlist');
      }
    },
    staleTime: APPOINTMENT_CACHE_CONFIG.waitlist.staleTime,
    gcTime: APPOINTMENT_CACHE_CONFIG.waitlist.gcTime,
    ...options,
  });
}

/**
 * Get available time slots for scheduling
 */
export function useAvailabilitySlots(
  nurseId: string,
  date?: string,
  duration?: number,
  options?: Omit<UseQueryOptions<{ slots: AvailabilitySlot[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleError: handleApiError } = useApiError();

  return useQuery({
    queryKey: appointmentQueryKeys.availability.byNurse(nurseId, date, duration),
    queryFn: async () => {
      try {
        return await appointmentsApi.getAvailability(nurseId, date, duration);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_availability_slots');
      }
    },
    staleTime: APPOINTMENT_CACHE_CONFIG.availability.staleTime,
    gcTime: APPOINTMENT_CACHE_CONFIG.availability.gcTime,
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
  const { handleError: handleApiError } = useApiError();

  return useQuery({
    queryKey: appointmentQueryKeys.availability.nurseSchedule(nurseId, date),
    queryFn: async () => {
      try {
        return await appointmentsApi.getNurseAvailability(nurseId, date);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_nurse_availability');
      }
    },
    staleTime: APPOINTMENT_CACHE_CONFIG.nurseSchedule.staleTime,
    gcTime: APPOINTMENT_CACHE_CONFIG.nurseSchedule.gcTime,
    enabled: !!nurseId,
    ...options,
  });
}

/**
 * Get individual appointment details
 */
export function useAppointmentDetails(
  appointmentId: string,
  options?: Omit<UseQueryOptions<{ appointment: Appointment }>, 'queryKey' | 'queryFn'>
) {
  const { handleError: handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: appointmentQueryKeys.details.byId(appointmentId),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_appointment_details',
          'appointment',
          'high',
          { appointmentId }
        );

        return await appointmentsApi.getById(appointmentId);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_appointment_details');
      }
    },
    staleTime: APPOINTMENT_CACHE_CONFIG.appointments.staleTime,
    gcTime: APPOINTMENT_CACHE_CONFIG.appointments.gcTime,
    enabled: !!appointmentId,
    ...options,
  });
}

/**
 * Combined hook for appointment management dashboard
 */
export function useAppointmentDashboard(
  filters?: AppointmentFilters,
  statsFilters?: { nurseId?: string; dateFrom?: string; dateTo?: string },
  waitlistFilters?: WaitlistFilters
) {
  const appointments = useAppointmentsList(filters);
  const statistics = useAppointmentStatistics(statsFilters);
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