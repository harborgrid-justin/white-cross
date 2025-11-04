/**
 * Medication Mutation Hooks - Unified Export
 *
 * Enterprise-grade mutations for medication management with
 * HIPAA compliance, proper PHI handling, and safety validations.
 *
 * This file serves as a unified export point for all medication mutations,
 * which have been modularized for maintainability:
 * - Prescription mutations (create medication)
 * - Administration mutations (administer medication, dosage validation)
 * - Adverse reaction mutations (report reactions)
 *
 * @module hooks/domains/medications/mutations/useMedicationMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMemo } from 'react';
import {
  useMedicationPrescriptionMutations,
  useCreateMedication,
  type PrescriptionMutationsResult,
} from './useMedicationPrescriptionMutations';
import {
  useMedicationAdministrationMutations,
  useMedicationAdministration,
  type AdministrationMutationsResult,
  type AdministrationData,
} from './useMedicationAdministrationMutations';
import {
  useMedicationReactionMutations,
  useAdverseReactionReporting,
  type ReactionMutationsResult,
} from './useMedicationReactionMutations';

// Re-export types
export type { AdministrationData } from './useMedicationAdministrationMutations';
export type { MedicationMutationOptions } from './useMedicationPrescriptionMutations';

/**
 * Medication mutations result interface
 */
export interface MedicationMutationsResult
  extends PrescriptionMutationsResult,
    AdministrationMutationsResult,
    ReactionMutationsResult {}

/**
 * Enterprise medication mutations hook (unified)
 *
 * Combines all medication mutation operations into a single hook
 * for backward compatibility and convenience.
 */
export function useMedicationMutations(
  options: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    enableOptimisticUpdates?: boolean;
    validateDosage?: boolean;
  } = {}
): MedicationMutationsResult {
  const prescriptionMutations = useMedicationPrescriptionMutations(options);
  const administrationMutations = useMedicationAdministrationMutations(options);
  const reactionMutations = useMedicationReactionMutations(options);

  return useMemo(
    () => ({
      ...prescriptionMutations,
      ...administrationMutations,
      ...reactionMutations,
    }),
    [prescriptionMutations, administrationMutations, reactionMutations]
  );
}

/**
 * Re-export convenience hooks for specific operations
 */
export { useCreateMedication } from './useMedicationPrescriptionMutations';
export { useMedicationAdministration } from './useMedicationAdministrationMutations';
export { useAdverseReactionReporting } from './useMedicationReactionMutations';

/**
 * Re-export modular hooks for fine-grained control
 */
export { useMedicationPrescriptionMutations } from './useMedicationPrescriptionMutations';
export { useMedicationAdministrationMutations } from './useMedicationAdministrationMutations';
export { useMedicationReactionMutations } from './useMedicationReactionMutations';
