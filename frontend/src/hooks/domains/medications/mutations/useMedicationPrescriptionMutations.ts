/**
 * Medication Prescription Mutation Hooks
 *
 * Enterprise-grade mutations for medication creation and prescription management
 * with HIPAA compliance and proper PHI handling.
 *
 * @module hooks/domains/medications/mutations/useMedicationPrescriptionMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { medicationsApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';
import { useCacheManager } from '../../../shared/useCacheManager';
import { useHealthcareCompliance } from '../../../shared/useHealthcareCompliance';
import {
  medicationQueryKeys,
  MEDICATION_OPERATIONS,
  MEDICATION_ERROR_CODES,
  MEDICATION_CACHE_CONFIG,
} from '../config';
import type {
  Medication,
  MedicationFormData,
} from '@/types/api';
import toast from 'react-hot-toast';

/**
 * Medication mutation options interface
 */
export interface MedicationMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enableOptimisticUpdates?: boolean;
  validateDosage?: boolean;
}

/**
 * Prescription mutations result interface
 */
export interface PrescriptionMutationsResult {
  createMedication: {
    mutate: (data: MedicationFormData) => void;
    mutateAsync: (data: MedicationFormData) => Promise<{ medication: Medication }>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  invalidateMedicationData: (medicationId?: string) => Promise<void>;
}

/**
 * Medication prescription mutations hook
 */
export function useMedicationPrescriptionMutations(
  options: MedicationMutationOptions = {}
): PrescriptionMutationsResult {
  const queryClient = useQueryClient();
  const { handleApiError } = useApiError();
  const { invalidateCacheManager } = useCacheManager();
  const { logCompliantAccess } = useHealthcareCompliance();

  // Create medication mutation
  const createMedicationMutation = useMutation({
    mutationKey: [MEDICATION_OPERATIONS.CREATE],
    mutationFn: async (data: MedicationFormData) => {
      try {
        await logCompliantAccess(
          'create_medication',
          'medication',
          'phi',
          { operation: 'create_medication' }
        );

        const result = await medicationsApi.create(data);

        if (!result.medication) {
          throw new Error(MEDICATION_ERROR_CODES.CREATE_FAILED);
        }

        return result;
      } catch (error: any) {
        throw handleApiError(error, MEDICATION_OPERATIONS.CREATE);
      }
    },
    onSuccess: (result) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: medicationQueryKeys.base.lists() });

      // Update cache with new medication
      queryClient.setQueryData(
        medicationQueryKeys.details.byId(result.medication.id),
        result
      );

      toast.success('Medication created successfully');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to create medication');
      options.onError?.(error);
    },
    gcTime: MEDICATION_CACHE_CONFIG.mutations.gcTime,
  });

  // Cache invalidation utility
  const invalidateMedicationData = useCallback(async (medicationId?: string) => {
    if (medicationId) {
      // Invalidate specific medication
      await invalidateCacheManager([...medicationQueryKeys.details.byId(medicationId)], 'exact');
      queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.details.byId(medicationId),
      });
    } else {
      // Invalidate all medication data
      await invalidateCacheManager([...medicationQueryKeys.domain], 'prefix');
      queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.domain,
      });
    }
  }, [invalidateCacheManager, queryClient]);

  // Return mutations with consistent interface
  return useMemo(
    () => ({
      createMedication: {
        mutate: createMedicationMutation.mutate,
        mutateAsync: createMedicationMutation.mutateAsync,
        isLoading: createMedicationMutation.isPending,
        error: createMedicationMutation.error,
        isError: createMedicationMutation.isError,
        isSuccess: createMedicationMutation.isSuccess,
      },
      invalidateMedicationData,
    }),
    [
      createMedicationMutation,
      invalidateMedicationData,
    ]
  );
}

/**
 * Convenience hook for medication creation
 */
export function useCreateMedication(options: MedicationMutationOptions = {}) {
  const { createMedication } = useMedicationPrescriptionMutations(options);
  return createMedication;
}
