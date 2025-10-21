/**
 * WF-COMP-140 | useOptimisticMedications.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/services/modules/medicationsApi, @/utils/optimisticHelpers
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Optimistic Medication Management Hooks
 *
 * Custom TanStack Query mutation hooks with optimistic updates for
 * medication CRUD operations, prescriptions, and administration with
 * comprehensive error handling and Five Rights validation support.
 *
 * @module useOptimisticMedications
 * @version 1.0.0
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { medicationsApi, CreateMedicationRequest, CreateInventoryRequest, UpdateInventoryRequest } from '@/services/modules/medicationsApi';
import type {
  Medication,
  StudentMedication,
  MedicationLog,
  InventoryItem,
  AdverseReaction,
  StudentMedicationFormData,
  MedicationAdministrationData,
  AdverseReactionData,
} from '@/types/medications';
import {
  optimisticCreate,
  optimisticUpdate,
  optimisticDelete,
  confirmCreate,
  confirmUpdate,
  rollbackUpdate,
} from '@/utils/optimisticHelpers';
import {
  RollbackStrategy,
  ConflictResolutionStrategy,
} from '@/utils/optimisticUpdates';

// =====================
// QUERY KEYS
// =====================

export const medicationKeys = {
  all: ['medications'] as const,
  lists: () => [...medicationKeys.all, 'list'] as const,
  list: (filters?: any) => [...medicationKeys.lists(), filters] as const,
  details: () => [...medicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...medicationKeys.details(), id] as const,
  inventory: () => [...medicationKeys.all, 'inventory'] as const,
  inventoryItem: (id: string) => [...medicationKeys.inventory(), id] as const,
  schedule: (startDate?: string, endDate?: string) => [...medicationKeys.all, 'schedule', startDate, endDate] as const,
  reminders: (date?: string) => [...medicationKeys.all, 'reminders', date] as const,
  studentMedications: (studentId: string) => [...medicationKeys.all, 'student', studentId] as const,
  administrationLogs: (studentId: string) => [...medicationKeys.all, 'logs', studentId] as const,
  adverseReactions: (medicationId?: string, studentId?: string) => [...medicationKeys.all, 'adverse-reactions', medicationId, studentId] as const,
  stats: () => [...medicationKeys.all, 'stats'] as const,
  alerts: () => [...medicationKeys.all, 'alerts'] as const,
};

// =====================
// MEDICATION CREATE HOOK
// =====================

/**
 * Hook for creating medications with optimistic updates
 *
 * @example
 * ```typescript
 * const createMutation = useOptimisticMedicationCreate({
 *   onSuccess: (medication) => console.log('Created:', medication)
 * });
 *
 * createMutation.mutate({
 *   name: 'Ibuprofen',
 *   genericName: 'Ibuprofen',
 *   dosageForm: 'Tablet',
 *   strength: '200mg',
 *   manufacturer: 'Generic Pharma',
 *   isControlled: false
 * });
 * ```
 */
export function useOptimisticMedicationCreate(
  options?: UseMutationOptions<Medication, Error, CreateMedicationRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMedicationRequest) => medicationsApi.create(data),

    onMutate: async (newMedication) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: medicationKeys.lists() });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<Medication>(
        queryClient,
        medicationKeys.all,
        {
          ...newMedication,
          isControlled: newMedication.isControlled || false,
          inventory: [],
          studentMedicationCount: 0,
        } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
          conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
        }
      );

      return { updateId, tempId, tempEntity };
    },

    onSuccess: (response, variables, context) => {
      if (context) {
        // Replace temp ID with real server ID
        confirmCreate(
          queryClient,
          medicationKeys.all,
          context.updateId,
          context.tempId,
          response
        );
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.stats() });

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context) {
        // Rollback optimistic update
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// MEDICATION UPDATE HOOK
// =====================

/**
 * Hook for updating medications with optimistic updates
 */
export function useOptimisticMedicationUpdate(
  options?: UseMutationOptions<
    Medication,
    Error,
    { id: string; data: Partial<CreateMedicationRequest> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => medicationsApi.update(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: medicationKeys.detail(id) });

      // Create optimistic update
      const updateId = optimisticUpdate<Medication>(
        queryClient,
        medicationKeys.all,
        id,
        data as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
          conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
        }
      );

      return { updateId };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        // Confirm with server data
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
      queryClient.setQueryData(medicationKeys.detail(variables.id), response);

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        // Rollback optimistic update
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// MEDICATION DELETE HOOK
// =====================

/**
 * Hook for deleting medications with optimistic updates
 */
export function useOptimisticMedicationDelete(
  options?: UseMutationOptions<{ id: string }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => medicationsApi.delete(id),

    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: medicationKeys.detail(id) });

      // Create optimistic delete
      const updateId = optimisticDelete<Medication>(
        queryClient,
        medicationKeys.all,
        id,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId };
    },

    onSuccess: (response, id, context) => {
      if (context?.updateId) {
        // Confirm deletion
        confirmUpdate(context.updateId, null as any, queryClient);
      }

      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: medicationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.stats() });

      options?.onSuccess?.(response, id, context);
    },

    onError: (error, id, context) => {
      if (context?.updateId) {
        // Rollback - restore the deleted medication
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, id, context);
    },
  });
}

// =====================
// PRESCRIPTION (STUDENT MEDICATION) HOOKS
// =====================

/**
 * Hook for assigning medication to student (creating prescription) with optimistic updates
 */
export function useOptimisticPrescriptionCreate(
  options?: UseMutationOptions<StudentMedication, Error, StudentMedicationFormData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentMedicationFormData) => medicationsApi.assignToStudent(data),

    onMutate: async (newPrescription) => {
      const queryKey = medicationKeys.studentMedications(newPrescription.studentId);
      await queryClient.cancelQueries({ queryKey });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<StudentMedication>(
        queryClient,
        queryKey,
        {
          ...newPrescription,
          isActive: true,
          logs: [],
        } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, tempId, tempEntity };
    },

    onSuccess: (response, variables, context) => {
      if (context) {
        confirmCreate(
          queryClient,
          medicationKeys.studentMedications(variables.studentId),
          context.updateId,
          context.tempId,
          response
        );
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: medicationKeys.schedule() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.stats() });
      queryClient.invalidateQueries({
        queryKey: medicationKeys.detail(variables.medicationId),
      });

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

/**
 * Hook for deactivating student medication (stopping prescription)
 */
export function useOptimisticPrescriptionDeactivate(
  options?: UseMutationOptions<
    StudentMedication,
    Error,
    { id: string; reason?: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => medicationsApi.deactivateStudentMedication(id, reason),

    onMutate: async ({ id }) => {
      // Find the student medication in cache to get studentId
      const allQueries = queryClient.getQueriesData<{ data: StudentMedication[] }>({
        queryKey: medicationKeys.all,
      });

      let studentId: string | undefined;
      for (const [key, value] of allQueries) {
        if (value?.data) {
          const prescription = value.data.find((p: StudentMedication) => p.id === id);
          if (prescription) {
            studentId = prescription.studentId;
            break;
          }
        }
      }

      if (!studentId) return { updateId: '' };

      const updateId = optimisticUpdate<StudentMedication>(
        queryClient,
        medicationKeys.studentMedications(studentId),
        id,
        { isActive: false } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, studentId };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Invalidate related queries
      if (context?.studentId) {
        queryClient.invalidateQueries({
          queryKey: medicationKeys.studentMedications(context.studentId),
        });
      }
      queryClient.invalidateQueries({ queryKey: medicationKeys.schedule() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.stats() });

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// MEDICATION ADMINISTRATION HOOK
// =====================

/**
 * Hook for logging medication administration with optimistic updates
 * Implements Five Rights validation support
 */
export function useOptimisticMedicationAdministration(
  options?: UseMutationOptions<MedicationLog, Error, MedicationAdministrationData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MedicationAdministrationData) => medicationsApi.logAdministration(data),

    onMutate: async (newLog) => {
      // Get the student medication to find student ID
      const allQueries = queryClient.getQueriesData<{ data: StudentMedication[] }>({
        queryKey: medicationKeys.all,
      });

      let studentId: string | undefined;
      for (const [key, value] of allQueries) {
        if (value?.data) {
          const prescription = value.data.find(
            (p: StudentMedication) => p.id === newLog.studentMedicationId
          );
          if (prescription) {
            studentId = prescription.studentId;
            break;
          }
        }
      }

      if (!studentId) return { updateId: '', studentId: undefined };

      const queryKey = medicationKeys.administrationLogs(studentId);
      await queryClient.cancelQueries({ queryKey });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<MedicationLog>(
        queryClient,
        queryKey,
        {
          ...newLog,
          administeredBy: newLog.nurseId || 'current-user',
        } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
          userId: newLog.nurseId,
        }
      );

      return { updateId, tempId, tempEntity, studentId };
    },

    onSuccess: (response, variables, context) => {
      if (context && context.studentId) {
        confirmCreate(
          queryClient,
          medicationKeys.administrationLogs(context.studentId),
          context.updateId,
          context.tempId,
          response
        );
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: medicationKeys.schedule() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.reminders() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.stats() });

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// INVENTORY MANAGEMENT HOOKS
// =====================

/**
 * Hook for adding medication to inventory with optimistic updates
 */
export function useOptimisticInventoryAdd(
  options?: UseMutationOptions<InventoryItem, Error, CreateInventoryRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryRequest) => medicationsApi.addToInventory(data),

    onMutate: async (newInventory) => {
      await queryClient.cancelQueries({ queryKey: medicationKeys.inventory() });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<InventoryItem>(
        queryClient,
        medicationKeys.inventory(),
        newInventory as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, tempId, tempEntity };
    },

    onSuccess: (response, variables, context) => {
      if (context) {
        confirmCreate(
          queryClient,
          medicationKeys.inventory(),
          context.updateId,
          context.tempId,
          response
        );
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: medicationKeys.inventory() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.alerts() });
      queryClient.invalidateQueries({
        queryKey: medicationKeys.detail(variables.medicationId),
      });

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

/**
 * Hook for updating inventory quantity with optimistic updates
 */
export function useOptimisticInventoryUpdate(
  options?: UseMutationOptions<
    InventoryItem,
    Error,
    { id: string; data: UpdateInventoryRequest }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => medicationsApi.updateInventoryQuantity(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: medicationKeys.inventoryItem(id) });

      // Create optimistic update
      const updateId = optimisticUpdate<InventoryItem>(
        queryClient,
        medicationKeys.inventory(),
        id,
        { quantity: data.quantity } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: medicationKeys.inventory() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.alerts() });
      queryClient.setQueryData(medicationKeys.inventoryItem(variables.id), response);

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// ADVERSE REACTION HOOK
// =====================

/**
 * Hook for reporting adverse reactions with optimistic updates
 */
export function useOptimisticAdverseReactionReport(
  options?: UseMutationOptions<AdverseReaction, Error, AdverseReactionData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdverseReactionData) => medicationsApi.reportAdverseReaction(data),

    onMutate: async (newReaction) => {
      const queryKey = medicationKeys.adverseReactions();
      await queryClient.cancelQueries({ queryKey });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<AdverseReaction>(
        queryClient,
        queryKey,
        newReaction as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, tempId, tempEntity };
    },

    onSuccess: (response, variables, context) => {
      if (context) {
        confirmCreate(
          queryClient,
          medicationKeys.adverseReactions(),
          context.updateId,
          context.tempId,
          response
        );
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: medicationKeys.adverseReactions() });
      queryClient.invalidateQueries({ queryKey: medicationKeys.stats() });

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// COMPOSITE HOOK
// =====================

/**
 * Composite hook that provides all medication optimistic operations
 */
export function useOptimisticMedications() {
  const createMedication = useOptimisticMedicationCreate();
  const updateMedication = useOptimisticMedicationUpdate();
  const deleteMedication = useOptimisticMedicationDelete();
  const createPrescription = useOptimisticPrescriptionCreate();
  const deactivatePrescription = useOptimisticPrescriptionDeactivate();
  const logAdministration = useOptimisticMedicationAdministration();
  const addInventory = useOptimisticInventoryAdd();
  const updateInventory = useOptimisticInventoryUpdate();
  const reportAdverseReaction = useOptimisticAdverseReactionReport();

  return {
    // Medication mutations
    createMedication,
    updateMedication,
    deleteMedication,

    // Prescription mutations
    createPrescription,
    deactivatePrescription,

    // Administration mutations
    logAdministration,

    // Inventory mutations
    addInventory,
    updateInventory,

    // Adverse reaction mutations
    reportAdverseReaction,

    // Convenience functions
    createMedicationWithOptimism: createMedication.mutate,
    updateMedicationWithOptimism: updateMedication.mutate,
    deleteMedicationWithOptimism: deleteMedication.mutate,
    createPrescriptionWithOptimism: createPrescription.mutate,
    deactivatePrescriptionWithOptimism: deactivatePrescription.mutate,
    logAdministrationWithOptimism: logAdministration.mutate,
    addInventoryWithOptimism: addInventory.mutate,
    updateInventoryWithOptimism: updateInventory.mutate,
    reportAdverseReactionWithOptimism: reportAdverseReaction.mutate,

    // Loading states
    isCreatingMedication: createMedication.isPending,
    isUpdatingMedication: updateMedication.isPending,
    isDeletingMedication: deleteMedication.isPending,
    isCreatingPrescription: createPrescription.isPending,
    isDeactivatingPrescription: deactivatePrescription.isPending,
    isLoggingAdministration: logAdministration.isPending,
    isAddingInventory: addInventory.isPending,
    isUpdatingInventory: updateInventory.isPending,
    isReportingAdverseReaction: reportAdverseReaction.isPending,

    // Error states
    medicationCreateError: createMedication.error,
    medicationUpdateError: updateMedication.error,
    medicationDeleteError: deleteMedication.error,
    prescriptionCreateError: createPrescription.error,
    prescriptionDeactivateError: deactivatePrescription.error,
    administrationLogError: logAdministration.error,
    inventoryAddError: addInventory.error,
    inventoryUpdateError: updateInventory.error,
    adverseReactionError: reportAdverseReaction.error,
  };
}
