/**
 * WF-COMP-139 | useOptimisticIncidents.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/services/modules/incidentReportsApi, @/utils/optimisticHelpers
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Optimistic Incident Report Hooks
 *
 * Custom TanStack Query mutation hooks with optimistic updates for
 * incident reports, witness statements, and follow-up actions.
 *
 * @module useOptimisticIncidents
 * @version 1.0.0
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { incidentReportsApi } from '@/services/modules/incidentReportsApi';
import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
} from '@/types/incidents';
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
  OptimisticOperationOptions,
} from '@/utils/optimisticUpdates';

// =====================
// QUERY KEYS
// =====================

export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (filters?: any) => [...incidentKeys.lists(), filters] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
  witnesses: (incidentId: string) => [...incidentKeys.all, incidentId, 'witnesses'] as const,
  followUps: (incidentId: string) => [...incidentKeys.all, incidentId, 'followUps'] as const,
};

// =====================
// INCIDENT REPORT HOOKS
// =====================

/**
 * Hook for creating incident reports with optimistic updates
 *
 * @example
 * ```typescript
 * const createMutation = useOptimisticIncidentCreate({
 *   onSuccess: (incident) => console.log('Created:', incident)
 * });
 *
 * createMutation.mutate({
 *   studentId: '123',
 *   type: IncidentType.INJURY,
 *   // ... other fields
 * });
 * ```
 */
export function useOptimisticIncidentCreate(
  options?: UseMutationOptions<
    { report: IncidentReport },
    Error,
    CreateIncidentReportRequest
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncidentReportRequest) => incidentReportsApi.create(data),

    onMutate: async (newIncident) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: incidentKeys.lists() });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<IncidentReport>(
        queryClient,
        incidentKeys.all,
        newIncident as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
          conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
          userId: newIncident.reportedById,
        }
      );

      return { updateId, tempId, tempEntity };
    },

    onSuccess: (response, variables, context) => {
      if (context) {
        // Replace temp ID with real server ID
        confirmCreate(
          queryClient,
          incidentKeys.all,
          context.updateId,
          context.tempId,
          response.report
        );
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });

      options?.onSuccess?.(response, variables, context, queryClient);
    },

    onError: (error, variables, context) => {
      if (context) {
        // Rollback optimistic update
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, variables, context, queryClient);
    },
  });
}

/**
 * Hook for updating incident reports with optimistic updates
 *
 * @example
 * ```typescript
 * const updateMutation = useOptimisticIncidentUpdate({
 *   onSuccess: () => console.log('Updated successfully')
 * });
 *
 * updateMutation.mutate({
 *   id: '123',
 *   data: { status: IncidentStatus.RESOLVED }
 * });
 * ```
 */
export function useOptimisticIncidentUpdate(
  options?: UseMutationOptions<
    { report: IncidentReport },
    Error,
    { id: string; data: UpdateIncidentReportRequest }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => incidentReportsApi.update(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: incidentKeys.detail(id) });

      // Create optimistic update
      const updateId = optimisticUpdate<IncidentReport>(
        queryClient,
        incidentKeys.all,
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
      if (context) {
        // Confirm with server data
        confirmUpdate(context.updateId, response.report, queryClient);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
      queryClient.setQueryData(incidentKeys.detail(variables.id), response.report);

      options?.onSuccess?.(response, variables, context, queryClient);
    },

    onError: (error, variables, context) => {
      if (context) {
        // Rollback optimistic update
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, variables, context, queryClient);
    },
  });
}

/**
 * Hook for deleting incident reports with optimistic updates
 *
 * @example
 * ```typescript
 * const deleteMutation = useOptimisticIncidentDelete();
 * deleteMutation.mutate('incident-id');
 * ```
 */
export function useOptimisticIncidentDelete(
  options?: UseMutationOptions<{ success: boolean }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => incidentReportsApi.delete(id),

    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: incidentKeys.detail(id) });

      // Create optimistic delete
      const updateId = optimisticDelete<IncidentReport>(
        queryClient,
        incidentKeys.all,
        id,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId };
    },

    onSuccess: (response, id, context) => {
      if (context) {
        // Confirm deletion
        confirmUpdate(context.updateId, null as any, queryClient);
      }

      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: incidentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });

      options?.onSuccess?.(response, id, context, queryClient);
    },

    onError: (error, id, context) => {
      if (context) {
        // Rollback - restore the deleted incident
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, id, context, queryClient);
    },
  });
}

// =====================
// WITNESS STATEMENT HOOKS
// =====================

/**
 * Hook for creating witness statements with optimistic updates
 *
 * @example
 * ```typescript
 * const createMutation = useOptimisticWitnessCreate();
 *
 * createMutation.mutate({
 *   incidentReportId: '123',
 *   witnessName: 'John Doe',
 *   statement: 'I witnessed...'
 * });
 * ```
 */
export function useOptimisticWitnessCreate(
  options?: UseMutationOptions<
    { statement: WitnessStatement },
    Error,
    CreateWitnessStatementRequest
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWitnessStatementRequest) =>
      incidentReportsApi.addWitnessStatement(data),

    onMutate: async (newStatement) => {
      const queryKey = incidentKeys.witnesses(newStatement.incidentReportId);
      await queryClient.cancelQueries({ queryKey });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<WitnessStatement>(
        queryClient,
        queryKey,
        newStatement as any,
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
          incidentKeys.witnesses(variables.incidentReportId),
          context.updateId,
          context.tempId,
          response.statement
        );
      }

      // Invalidate incident detail to refresh witness count
      queryClient.invalidateQueries({
        queryKey: incidentKeys.detail(variables.incidentReportId),
      });

      options?.onSuccess?.(response, variables, context, queryClient);
    },

    onError: (error, variables, context) => {
      if (context) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context, queryClient);
    },
  });
}

/**
 * Hook for updating witness statements with optimistic updates
 */
export function useOptimisticWitnessUpdate(
  options?: UseMutationOptions<
    { statement: WitnessStatement },
    Error,
    { id: string; data: UpdateWitnessStatementRequest }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => incidentReportsApi.updateWitnessStatement(id, data),

    onMutate: async ({ id, data }) => {
      // Get the witness statement to find incident ID
      const allIncidents = queryClient.getQueriesData<{ statements: WitnessStatement[] }>({
        queryKey: incidentKeys.all,
      });

      let incidentId: string | undefined;
      for (const [key, value] of allIncidents) {
        if (value?.statements) {
          const statement = value.statements.find((s: WitnessStatement) => s.id === id);
          if (statement) {
            incidentId = statement.incidentReportId;
            break;
          }
        }
      }

      if (!incidentId) return { updateId: '' };

      const updateId = optimisticUpdate<WitnessStatement>(
        queryClient,
        incidentKeys.witnesses(incidentId),
        id,
        data as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, incidentId };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        confirmUpdate(context.updateId, response.statement, queryClient);
      }

      options?.onSuccess?.(response, variables, context, queryClient);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context, queryClient);
    },
  });
}

/**
 * Hook for verifying witness statements (marks as verified)
 */
export function useOptimisticWitnessVerify(
  options?: UseMutationOptions<{ statement: WitnessStatement }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (statementId: string) =>
      incidentReportsApi.verifyWitnessStatement(statementId),

    onMutate: async (statementId) => {
      // Similar to update, but specifically sets verified = true
      const allIncidents = queryClient.getQueriesData<{ statements: WitnessStatement[] }>({
        queryKey: incidentKeys.all,
      });

      let incidentId: string | undefined;
      for (const [key, value] of allIncidents) {
        if (value?.statements) {
          const statement = value.statements.find((s: WitnessStatement) => s.id === statementId);
          if (statement) {
            incidentId = statement.incidentReportId;
            break;
          }
        }
      }

      if (!incidentId) return { updateId: '' };

      const updateId = optimisticUpdate<WitnessStatement>(
        queryClient,
        incidentKeys.witnesses(incidentId),
        statementId,
        { verified: true, verifiedAt: new Date().toISOString() } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, incidentId };
    },

    onSuccess: (response, statementId, context) => {
      if (context?.updateId) {
        confirmUpdate(context.updateId, response.statement, queryClient);
      }

      options?.onSuccess?.(response, statementId, context, queryClient);
    },

    onError: (error, statementId, context) => {
      if (context?.updateId) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, statementId, context, queryClient);
    },
  });
}

// =====================
// FOLLOW-UP ACTION HOOKS
// =====================

/**
 * Hook for creating follow-up actions with optimistic updates
 *
 * @example
 * ```typescript
 * const createMutation = useOptimisticFollowUpCreate();
 *
 * createMutation.mutate({
 *   incidentReportId: '123',
 *   action: 'Schedule follow-up appointment',
 *   dueDate: '2024-01-15',
 *   priority: ActionPriority.HIGH
 * });
 * ```
 */
export function useOptimisticFollowUpCreate(
  options?: UseMutationOptions<
    { action: FollowUpAction },
    Error,
    CreateFollowUpActionRequest
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFollowUpActionRequest) =>
      incidentReportsApi.addFollowUpAction(data),

    onMutate: async (newAction) => {
      const queryKey = incidentKeys.followUps(newAction.incidentReportId);
      await queryClient.cancelQueries({ queryKey });

      const { updateId, tempId, tempEntity } = optimisticCreate<FollowUpAction>(
        queryClient,
        queryKey,
        newAction as any,
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
          incidentKeys.followUps(variables.incidentReportId),
          context.updateId,
          context.tempId,
          response.action
        );
      }

      // Invalidate incident detail to refresh follow-up count
      queryClient.invalidateQueries({
        queryKey: incidentKeys.detail(variables.incidentReportId),
      });

      options?.onSuccess?.(response, variables, context, queryClient);
    },

    onError: (error, variables, context) => {
      if (context) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context, queryClient);
    },
  });
}

/**
 * Hook for updating follow-up actions with optimistic updates
 */
export function useOptimisticFollowUpUpdate(
  options?: UseMutationOptions<
    { action: FollowUpAction },
    Error,
    { id: string; data: UpdateFollowUpActionRequest }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => incidentReportsApi.updateFollowUpAction(id, data),

    onMutate: async ({ id, data }) => {
      // Find the incident ID from cached follow-up actions
      const allIncidents = queryClient.getQueriesData<{ actions: FollowUpAction[] }>({
        queryKey: incidentKeys.all,
      });

      let incidentId: string | undefined;
      for (const [key, value] of allIncidents) {
        if (value?.actions) {
          const action = value.actions.find((a: FollowUpAction) => a.id === id);
          if (action) {
            incidentId = action.incidentReportId;
            break;
          }
        }
      }

      if (!incidentId) return { updateId: '' };

      const updateId = optimisticUpdate<FollowUpAction>(
        queryClient,
        incidentKeys.followUps(incidentId),
        id,
        data as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, incidentId };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        confirmUpdate(context.updateId, response.action, queryClient);
      }

      options?.onSuccess?.(response, variables, context, queryClient);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context, queryClient);
    },
  });
}

/**
 * Hook for completing follow-up actions (shortcut for status update)
 */
export function useOptimisticFollowUpComplete(
  options?: UseMutationOptions<
    { action: FollowUpAction },
    Error,
    { id: string; notes?: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }) => incidentReportsApi.completeFollowUpAction(id, notes),

    onMutate: async ({ id, notes }) => {
      // Find incident ID
      const allIncidents = queryClient.getQueriesData<{ actions: FollowUpAction[] }>({
        queryKey: incidentKeys.all,
      });

      let incidentId: string | undefined;
      for (const [key, value] of allIncidents) {
        if (value?.actions) {
          const action = value.actions.find((a: FollowUpAction) => a.id === id);
          if (action) {
            incidentId = action.incidentReportId;
            break;
          }
        }
      }

      if (!incidentId) return { updateId: '' };

      const updateId = optimisticUpdate<FollowUpAction>(
        queryClient,
        incidentKeys.followUps(incidentId),
        id,
        {
          status: 'COMPLETED' as any,
          completedAt: new Date().toISOString(),
          notes,
        } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, incidentId };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        confirmUpdate(context.updateId, response.action, queryClient);
      }

      options?.onSuccess?.(response, variables, context, queryClient);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
        });
      }

      options?.onError?.(error, variables, context, queryClient);
    },
  });
}

// =====================
// COMPOSITE HOOKS
// =====================

/**
 * Composite hook that provides all incident report operations
 *
 * @example
 * ```typescript
 * const {
 *   createIncident,
 *   updateIncident,
 *   deleteIncident,
 *   isCreating,
 *   isUpdating
 * } = useOptimisticIncidents();
 *
 * await createIncident.mutateAsync({ ... });
 * ```
 */
export function useOptimisticIncidents() {
  const createIncident = useOptimisticIncidentCreate();
  const updateIncident = useOptimisticIncidentUpdate();
  const deleteIncident = useOptimisticIncidentDelete();

  return {
    // Mutations
    createIncident,
    updateIncident,
    deleteIncident,

    // Convenience functions
    createWithOptimism: createIncident.mutate,
    updateWithOptimism: updateIncident.mutate,
    deleteWithOptimism: deleteIncident.mutate,

    // Loading states
    isCreating: createIncident.isPending,
    isUpdating: updateIncident.isPending,
    isDeleting: deleteIncident.isPending,

    // Error states
    createError: createIncident.error,
    updateError: updateIncident.error,
    deleteError: deleteIncident.error,

    // Success flags
    createSuccess: createIncident.isSuccess,
    updateSuccess: updateIncident.isSuccess,
    deleteSuccess: deleteIncident.isSuccess,

    // Reset functions
    resetCreate: createIncident.reset,
    resetUpdate: updateIncident.reset,
    resetDelete: deleteIncident.reset,
  };
}

/**
 * Composite hook for witness statement operations
 */
export function useOptimisticWitnessStatements() {
  const createWitness = useOptimisticWitnessCreate();
  const updateWitness = useOptimisticWitnessUpdate();
  const verifyWitness = useOptimisticWitnessVerify();

  return {
    // Mutations
    createWitness,
    updateWitness,
    verifyWitness,

    // Convenience functions
    createWithOptimism: createWitness.mutate,
    updateWithOptimism: updateWitness.mutate,
    verifyWithOptimism: verifyWitness.mutate,

    // Loading states
    isCreating: createWitness.isPending,
    isUpdating: updateWitness.isPending,
    isVerifying: verifyWitness.isPending,

    // Error states
    createError: createWitness.error,
    updateError: updateWitness.error,
    verifyError: verifyWitness.error,

    // Success flags
    createSuccess: createWitness.isSuccess,
    updateSuccess: updateWitness.isSuccess,
    verifySuccess: verifyWitness.isSuccess,
  };
}

/**
 * Composite hook for follow-up action operations
 */
export function useOptimisticFollowUpActions() {
  const createAction = useOptimisticFollowUpCreate();
  const updateAction = useOptimisticFollowUpUpdate();
  const completeAction = useOptimisticFollowUpComplete();

  return {
    // Mutations
    createAction,
    updateAction,
    completeAction,

    // Convenience functions
    createWithOptimism: createAction.mutate,
    updateWithOptimism: updateAction.mutate,
    completeWithOptimism: completeAction.mutate,

    // Loading states
    isCreating: createAction.isPending,
    isUpdating: updateAction.isPending,
    isCompleting: completeAction.isPending,

    // Error states
    createError: createAction.error,
    updateError: updateAction.error,
    completeError: completeAction.error,

    // Success flags
    createSuccess: createAction.isSuccess,
    updateSuccess: updateAction.isSuccess,
    completeSuccess: completeAction.isSuccess,
  };
}
