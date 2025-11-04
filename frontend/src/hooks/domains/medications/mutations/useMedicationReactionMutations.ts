/**
 * Medication Adverse Reaction Mutation Hooks
 *
 * Enterprise-grade mutations for adverse reaction reporting with
 * HIPAA compliance, critical safety alerts, and proper PHI handling.
 *
 * @module hooks/domains/medications/mutations/useMedicationReactionMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { medicationsApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';
import { useHealthcareCompliance } from '../../../shared/useHealthcareCompliance';
import {
  medicationQueryKeys,
  MEDICATION_OPERATIONS,
  MEDICATION_CACHE_CONFIG,
} from '../config';
import type {
  AdverseReactionFormData,
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
 * Adverse reaction mutations result interface
 */
export interface ReactionMutationsResult {
  reportAdverseReaction: {
    mutate: (data: AdverseReactionFormData) => void;
    mutateAsync: (data: AdverseReactionFormData) => Promise<any>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
}

/**
 * Medication adverse reaction mutations hook
 */
export function useMedicationReactionMutations(
  options: MedicationMutationOptions = {}
): ReactionMutationsResult {
  const queryClient = useQueryClient();
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

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

  // Return mutations with consistent interface
  return useMemo(
    () => ({
      reportAdverseReaction: {
        mutate: reportAdverseReactionMutation.mutate,
        mutateAsync: reportAdverseReactionMutation.mutateAsync,
        isLoading: reportAdverseReactionMutation.isPending,
        error: reportAdverseReactionMutation.error,
        isError: reportAdverseReactionMutation.isError,
        isSuccess: reportAdverseReactionMutation.isSuccess,
      },
    }),
    [
      reportAdverseReactionMutation,
    ]
  );
}

/**
 * Convenience hook for adverse reaction reporting
 */
export function useAdverseReactionReporting(options: MedicationMutationOptions = {}) {
  const { reportAdverseReaction } = useMedicationReactionMutations(options);
  return reportAdverseReaction;
}
