/**
 * Medication Schedule & Reminder Query Hooks
 *
 * Query hooks for medication reminders, upcoming schedules, and administration scheduling.
 * Time-sensitive data with appropriate refetch intervals.
 *
 * @module hooks/domains/medications/queries/useMedicationScheduleQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { medicationsApi } from '@/services/api';
import { useApiError } from '../../../shared/useApiError';
import { useHealthcareCompliance } from '../../../shared/useHealthcareCompliance';
import {
  medicationQueryKeys,
  MEDICATION_CACHE_CONFIG,
} from '../config';
import type {
  MedicationReminder,
} from '@/types/api';

/**
 * Get medication reminders
 */
export function useMedicationReminders(
  filters?: any,
  options?: Omit<UseQueryOptions<{ reminders: MedicationReminder[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.reminders.all(filters),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_medication_reminders',
          'medication',
          'confidential',
          { filters }
        );

        return await medicationsApi.getReminders(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_reminders');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.reminders.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.reminders.gcTime,
    ...options,
  });
}

/**
 * Get upcoming medication reminders
 */
export function useUpcomingReminders(
  hours: number = 24,
  options?: Omit<UseQueryOptions<{ reminders: MedicationReminder[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.reminders.upcoming(hours),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_upcoming_reminders',
          'medication',
          'confidential',
          { hours }
        );

        return await medicationsApi.getUpcomingReminders(hours);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_upcoming_reminders');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.reminders.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.reminders.gcTime,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  });
}

/**
 * Get administration schedule for a specific date
 */
export function useAdministrationSchedule(
  date?: string,
  options?: Omit<UseQueryOptions<{ schedule: any[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.administration.schedule(date),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_administration_schedule',
          'medication',
          'critical',
          { date }
        );

        return await medicationsApi.getAdministrationSchedule(date);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_administration_schedule');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.administration.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.administration.gcTime,
    ...options,
  });
}
