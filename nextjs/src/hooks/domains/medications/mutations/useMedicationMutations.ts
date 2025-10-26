/**
 * Medication Mutation Hooks
 * 
 * Enterprise-grade mutations for medication management with
 * HIPAA compliance, proper PHI handling, and safety validations.
 * 
 * @module hooks/domains/medications/mutations/useMedicationMutations
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
  DOSAGE_PATTERNS
} from '../config';
import type {
  Medication,
  MedicationFormData,
  AdverseReactionFormData,
} from '@/types/api';
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
 * Medication mutations result interface
 */
export interface MedicationMutationsResult {
  // Create operations
  createMedication: {
    mutate: (data: MedicationFormData) => void;
    mutateAsync: (data: MedicationFormData) => Promise<{ medication: Medication }>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Administration operations
  administerMedication: {
    mutate: (data: AdministrationData) => void;
    mutateAsync: (data: AdministrationData) => Promise<any>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Adverse reaction reporting
  reportAdverseReaction: {
    mutate: (data: AdverseReactionFormData) => void;
    mutateAsync: (data: AdverseReactionFormData) => Promise<any>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Utility functions
  validateDosage: (dosage: string) => { isValid: boolean; error?: string };
  invalidateMedicationData: (medicationId?: string) => Promise<void>;
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
 * Enterprise medication mutations hook
 */
export function useMedicationMutations(
  options: MedicationMutationOptions = {}
): MedicationMutationsResult {
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

  // Report adverse reaction mutation
  const reportAdverseReactionMutation = useMutation({
    mutationKey: [MEDICATION_OPERATIONS.REPORT_REACTION],
    mutationFn: async (data: AdverseReactionFormData) => {
      try {
        await logCompliantAccess(
          'report_adverse_reaction',
          'medication',
          'critical',
          { 
            studentId: data.studentId,
            medicationId: data.medicationId,
            severity: data.severity
          }
        );

        const result = await medicationsApi.reportAdverseReaction(data);
        
        if (!result) {
          throw new Error('Failed to report adverse reaction');
        }

        return result;
      } catch (error: any) {
        throw handleApiError(error, MEDICATION_OPERATIONS.REPORT_REACTION);
      }
    },
    onSuccess: (result, variables) => {
      // Invalidate adverse reactions queries
      queryClient.invalidateQueries({ queryKey: medicationQueryKeys.base.reactions() });
      
      // Invalidate student-specific medication data
      if (variables.studentId) {
        queryClient.invalidateQueries({ 
          queryKey: medicationQueryKeys.lists.byStudent(variables.studentId) 
        });
      }

      // Generate alerts if severe reaction
      if (variables.severity === 'severe' || variables.severity === 'life-threatening') {
        queryClient.invalidateQueries({ queryKey: medicationQueryKeys.base.alerts() });
      }

      toast.success('Adverse reaction reported successfully');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to report adverse reaction');
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

  // Dosage validation function
  const validateDosage = useCallback((dosage: string) => {
    return validateDosageFormat(dosage);
  }, []);

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
      administerMedication: {
        mutate: administerMedicationMutation.mutate,
        mutateAsync: administerMedicationMutation.mutateAsync,
        isLoading: administerMedicationMutation.isPending,
        error: administerMedicationMutation.error,
        isError: administerMedicationMutation.isError,
        isSuccess: administerMedicationMutation.isSuccess,
      },
      reportAdverseReaction: {
        mutate: reportAdverseReactionMutation.mutate,
        mutateAsync: reportAdverseReactionMutation.mutateAsync,
        isLoading: reportAdverseReactionMutation.isPending,
        error: reportAdverseReactionMutation.error,
        isError: reportAdverseReactionMutation.isError,
        isSuccess: reportAdverseReactionMutation.isSuccess,
      },
      validateDosage,
      invalidateMedicationData,
    }),
    [
      createMedicationMutation,
      administerMedicationMutation,
      reportAdverseReactionMutation,
      validateDosage,
      invalidateMedicationData,
    ]
  );
}

/**
 * Convenience hooks for specific operations
 */

export function useCreateMedication(options: MedicationMutationOptions = {}) {
  const { createMedication } = useMedicationMutations(options);
  return createMedication;
}

export function useMedicationAdministration(options: MedicationMutationOptions = {}) {
  const { administerMedication, validateDosage } = useMedicationMutations(options);
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

export function useAdverseReactionReporting(options: MedicationMutationOptions = {}) {
  const { reportAdverseReaction } = useMedicationMutations(options);
  return reportAdverseReaction;
}