/**
 * Medication Administration Mutation Hooks
 *
 * Enterprise-grade mutations for medication administration with
 * HIPAA compliance, dosage validation, and safety checks.
 *
 * @module hooks/domains/medications/mutations/useMedicationAdministrationMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { medicationsApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';
import { useHealthcareCompliance } from '../../../shared/useHealthcareCompliance';
import {
  medicationQueryKeys,
  MEDICATION_OPERATIONS,
  MEDICATION_ERROR_CODES,
  MEDICATION_CACHE_CONFIG,
  DOSAGE_PATTERNS
} from '../config';
import toast from 'react-hot-toast';

/**
 * Administration data interface
 */
export interface AdministrationData {
  studentId: string;
  medicationId: string;
  dosage: string;
  administrationTime: string;
  notes?: string;
}

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
 * Administration mutations result interface
 */
export interface AdministrationMutationsResult {
  administerMedication: {
    mutate: (data: AdministrationData) => void;
    mutateAsync: (data: AdministrationData) => Promise<any>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  validateDosage: (dosage: string) => { isValid: boolean; error?: string };
}

/**
 * Dosage validation utility
 */
const validateDosageFormat = (dosage: string): { isValid: boolean; error?: string } => {
  if (!dosage?.trim()) {
    return { isValid: false, error: 'Dosage is required' };
  }

  // Check against standard patterns
  const patterns = Object.values(DOSAGE_PATTERNS);
  const isValid = patterns.some(pattern => pattern.test(dosage.trim()));

  if (!isValid) {
    return {
      isValid: false,
      error: 'Invalid dosage format. Examples: 5mg, 2 tablets, 1 puff, 10mg/kg'
    };
  }

  return { isValid: true };
};

/**
 * Medication administration mutations hook
 */
export function useMedicationAdministrationMutations(
  options: MedicationMutationOptions = {}
): AdministrationMutationsResult {
  const queryClient = useQueryClient();
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  // Administer medication mutation
  const administerMedicationMutation = useMutation({
    mutationKey: [MEDICATION_OPERATIONS.ADMINISTER],
    mutationFn: async (data: AdministrationData) => {
      try {
        // Validate dosage if enabled
        if (options.validateDosage !== false) {
          const validation = validateDosageFormat(data.dosage);
          if (!validation.isValid) {
            throw new Error(validation.error || MEDICATION_ERROR_CODES.DOSAGE_VALIDATION_ERROR);
          }
        }

        await logCompliantAccess(
          'administer_medication',
          'medication',
          'critical',
          {
            studentId: data.studentId,
            medicationId: data.medicationId,
            dosage: data.dosage
          }
        );

        const result = await medicationsApi.administer(data);

        if (!result) {
          throw new Error(MEDICATION_ERROR_CODES.ADMINISTRATION_FAILED);
        }

        return result;
      } catch (error: any) {
        throw handleApiError(error, MEDICATION_OPERATIONS.ADMINISTER);
      }
    },
    onSuccess: (result, variables) => {
      // Invalidate administration-related queries
      queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.administration.byStudent(variables.studentId)
      });
      queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.administration.schedule()
      });
      queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.reminders.byStudent(variables.studentId)
      });

      toast.success('Medication administered successfully');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to administer medication');
      options.onError?.(error);
    },
    gcTime: MEDICATION_CACHE_CONFIG.mutations.gcTime,
  });

  // Dosage validation function
  const validateDosage = useCallback((dosage: string) => {
    return validateDosageFormat(dosage);
  }, []);

  // Return mutations with consistent interface
  return useMemo(
    () => ({
      administerMedication: {
        mutate: administerMedicationMutation.mutate,
        mutateAsync: administerMedicationMutation.mutateAsync,
        isLoading: administerMedicationMutation.isPending,
        error: administerMedicationMutation.error,
        isError: administerMedicationMutation.isError,
        isSuccess: administerMedicationMutation.isSuccess,
      },
      validateDosage,
    }),
    [
      administerMedicationMutation,
      validateDosage,
    ]
  );
}

/**
 * Convenience hook for medication administration with validation
 */
export function useMedicationAdministration(options: MedicationMutationOptions = {}) {
  const { administerMedication, validateDosage } = useMedicationAdministrationMutations(options);
  return {
    administerMedication,
    validateAdministration: (data: AdministrationData) => {
      const dosageValidation = validateDosage(data.dosage);
      const isValid = dosageValidation.isValid &&
                      !!data.studentId &&
                      !!data.medicationId &&
                      !!data.administrationTime;

      const errors: Record<string, string> = {};
      if (!data.studentId) errors.studentId = 'Student selection is required';
      if (!data.medicationId) errors.medicationId = 'Medication ID is required';
      if (!data.administrationTime) errors.administrationTime = 'Administration time is required';
      if (!dosageValidation.isValid) errors.dosage = dosageValidation.error || 'Invalid dosage';

      return { isValid, errors };
    }
  };
}
