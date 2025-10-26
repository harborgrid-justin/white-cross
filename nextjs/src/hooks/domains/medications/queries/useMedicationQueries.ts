/**
 * Medication Query Hooks
 * 
 * Enterprise-grade query hooks for medication data fetching with
 * HIPAA compliance, proper PHI handling, and healthcare-appropriate caching.
 * 
 * @module hooks/domains/medications/queries/useMedicationQueries
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
  type MedicationListFilters
} from '../config';
import type {
  Medication,
  MedicationInventory,
  MedicationReminder,
  AdverseReaction,
  MedicationAlert,
  MedicationStatsResponse,
  PaginatedResponse,
} from '@/types/api';

/**
 * Get all medications with filtering and pagination
 */
export function useMedicationsList(
  filters?: MedicationListFilters,
  options?: Omit<UseQueryOptions<PaginatedResponse<Medication>>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.lists.all(filters),
    queryFn: async () => {
      try {
        // Log compliance access
        await logCompliantAccess(
          'view_medications_list',
          'medication',
          'phi',
          { filters }
        );

        const result = await medicationsApi.getAll(filters);
        return result;
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medications');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.catalog.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.catalog.gcTime,
    retry: 2,
    ...options,
  });
}

/**
 * Get medications for a specific student
 */
export function useStudentMedications(
  studentId: string,
  options?: Omit<UseQueryOptions<{ medications: Medication[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.lists.byStudent(studentId),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_student_medications',
          'medication',
          'critical',
          { studentId }
        );

        return await medicationsApi.getByStudent(studentId);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_student_medications');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.patientMedications.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.patientMedications.gcTime,
    enabled: !!studentId,
    ...options,
  });
}

/**
 * Get medication inventory
 */
export function useMedicationInventory(
  filters?: any,
  options?: Omit<UseQueryOptions<{ inventory: MedicationInventory[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: medicationQueryKeys.inventory.all(filters),
    queryFn: async () => {
      try {
        return await medicationsApi.getInventory(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_inventory');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.inventory.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.inventory.gcTime,
    ...options,
  });
}

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
 * Get adverse reactions
 */
export function useAdverseReactions(
  filters?: any,
  options?: Omit<UseQueryOptions<{ reactions: AdverseReaction[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.reactions.all(filters),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_adverse_reactions',
          'medication',
          'critical',
          { filters }
        );

        return await medicationsApi.getAdverseReactions(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_adverse_reactions');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.adverseReactions.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.adverseReactions.gcTime,
    ...options,
  });
}

/**
 * Get medication alerts
 */
export function useMedicationAlerts(
  options?: Omit<UseQueryOptions<{ alerts: MedicationAlert[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.alerts.all(),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_medication_alerts',
          'medication',
          'confidential'
        );

        return await medicationsApi.getAlerts();
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_alerts');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.alerts.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.alerts.gcTime,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    ...options,
  });
}

/**
 * Get medication statistics
 */
export function useMedicationStatistics(
  filters?: any,
  options?: Omit<UseQueryOptions<MedicationStatsResponse>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: medicationQueryKeys.statistics.overview(filters),
    queryFn: async () => {
      try {
        return await medicationsApi.getStatistics(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_statistics');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.statistics.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Get individual medication details
 */
export function useMedicationDetails(
  medicationId: string,
  options?: Omit<UseQueryOptions<{ medication: Medication }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.details.byId(medicationId),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_medication_details',
          'medication',
          'phi',
          { medicationId }
        );

        return await medicationsApi.getById(medicationId);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_details');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.catalog.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.catalog.gcTime,
    enabled: !!medicationId,
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

/**
 * Combined hook for medication dashboard
 */
export function useMedicationDashboard() {
  const medications = useMedicationsList({ limit: 20 });
  const inventory = useMedicationInventory();
  const upcomingReminders = useUpcomingReminders(24);
  const alerts = useMedicationAlerts();
  const statistics = useMedicationStatistics();

  return {
    medications,
    inventory,
    upcomingReminders,
    alerts,
    statistics,
    isLoading: medications.isLoading || inventory.isLoading || upcomingReminders.isLoading,
    isError: medications.isError || inventory.isError || upcomingReminders.isError,
    refetchAll: () => {
      medications.refetch();
      inventory.refetch();
      upcomingReminders.refetch();
      alerts.refetch();
      statistics.refetch();
    },
  };
}