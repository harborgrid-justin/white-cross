/**
 * WF-ROUTE-002 | mutations.ts - Optimistic mutations for useMedicationsRoute
 * Purpose: Optimistic mutation hooks for medication operations
 * Upstream: @/hooks/domains/medications, @/hooks/utilities | Dependencies: React, optimistic hooks
 * Downstream: useMedicationsRoute | Called by: Main hook
 * Related: useOptimisticMedications, useMedicationToast
 * Exports: useMedicationsMutations
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Optimistic updates for medication CRUD and operations
 */

import {
  useOptimisticMedicationCreate,
  useOptimisticMedicationUpdate,
  useOptimisticMedicationDelete,
  useOptimisticMedicationAdministration,
  useOptimisticInventoryUpdate,
  useOptimisticAdverseReactionReport,
} from '@/hooks/domains/medications/mutations/useOptimisticMedications';
import { useMedicationToast } from '@/hooks/utilities/useMedicationToast';
import type {
  Medication,
  MedicationLog,
  InventoryItem,
  AdverseReaction,
} from './types';

interface MutationCallbacks {
  onCreateSuccess: (medication: Medication) => void;
  onUpdateSuccess: (medication: Medication) => void;
  onDeleteSuccess: () => void;
  onAdministerSuccess: (log: MedicationLog) => void;
  onInventoryUpdateSuccess: (inventory: InventoryItem) => void;
  onAdverseReactionSuccess: (reaction: AdverseReaction) => void;
}

/**
 * Hook for all medication-related mutations
 */
export function useMedicationsMutations(callbacks: MutationCallbacks) {
  const medicationToast = useMedicationToast();

  const createMutation = useOptimisticMedicationCreate({
    onSuccess: (medication: Medication) => {
      medicationToast.showSuccess(`Medication "${medication.name}" created successfully`);
      callbacks.onCreateSuccess(medication);
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to create medication: ${error.message}`);
    },
  } as any);

  const updateMutation = useOptimisticMedicationUpdate({
    onSuccess: (medication: Medication) => {
      medicationToast.showSuccess(`Medication "${medication.name}" updated successfully`);
      callbacks.onUpdateSuccess(medication);
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to update medication: ${error.message}`);
    },
  } as any);

  const deleteMutation = useOptimisticMedicationDelete({
    onSuccess: () => {
      medicationToast.showSuccess('Medication deleted successfully');
      callbacks.onDeleteSuccess();
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to delete medication: ${error.message}`);
    },
  } as any);

  const administrationMutation = useOptimisticMedicationAdministration({
    onSuccess: (log: MedicationLog) => {
      medicationToast.showSuccess('Medication administered successfully');
      callbacks.onAdministerSuccess(log);
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to log administration: ${error.message}`);
    },
  } as any);

  const inventoryMutation = useOptimisticInventoryUpdate({
    onSuccess: (inventory: InventoryItem) => {
      medicationToast.showSuccess(`Inventory updated successfully`);
      callbacks.onInventoryUpdateSuccess(inventory);
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to update inventory: ${error.message}`);
    },
  } as any);

  const adverseReactionMutation = useOptimisticAdverseReactionReport({
    onSuccess: (reaction: AdverseReaction) => {
      medicationToast.showWarning('Adverse reaction reported');
      callbacks.onAdverseReactionSuccess(reaction);
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to report adverse reaction: ${error.message}`);
    },
  } as any);

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    administrationMutation,
    inventoryMutation,
    adverseReactionMutation,
  };
}
