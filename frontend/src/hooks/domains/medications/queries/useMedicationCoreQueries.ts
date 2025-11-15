/**
 * Core Medication Query Hooks
 *
 * Primary medication data fetching for lists, details, and student-specific medications.
 * HIPAA compliant with proper PHI handling.
 *
 * @module hooks/domains/medications/queries/useMedicationCoreQueries
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
 * Get OTC medications
 */
export function useOTCMedications(
  options?: Omit<UseQueryOptions<PaginatedResponse<Medication>>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.lists.all({ type: 'over_the_counter' }),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_otc_medications',
          'medication',
          'phi',
          { type: 'over_the_counter' }
        );

        const result = await medicationsApi.getAll({ type: 'over_the_counter' });
        return result;
      } catch (error: any) {
        throw handleApiError(error, 'fetch_otc_medications');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.catalog.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.catalog.gcTime,
    ...options,
  });
}
