/**
 * WF-COMP-117-MUTATIONS | FollowUpAction/useMutations.ts - Mutation hooks
 * Purpose: TanStack Query mutation hooks for follow-up actions
 * Upstream: @tanstack/react-query, @/services
 * Downstream: FollowUpActionProvider
 * Related: TanStack Query mutations, optimistic updates
 * Exports: useMutations custom hook
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Mutation hooks for CRUD operations with optimistic updates
 */

/**
 * Follow-Up Action Mutations
 * Custom hooks for managing follow-up action mutations with TanStack Query
 *
 * @module FollowUpAction/useMutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentReportsApi } from '@/services';
import type {
  FollowUpAction,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
} from '@/types/domain/incidents';
import { QUERY_KEYS } from './constants';

// =====================
// TYPE DEFINITIONS
// =====================

/**
 * Response type for follow-up actions query
 */
interface FollowUpActionsResponse {
  actions: FollowUpAction[];
}

/**
 * Response type for single follow-up action mutations
 */
interface FollowUpActionResponse {
  action: FollowUpAction;
}

/**
 * Return type for useMutations hook
 */
export interface UseMutationsReturn {
  createMutation: ReturnType<typeof useMutation<FollowUpActionResponse, Error, CreateFollowUpActionRequest>>;
  updateMutation: ReturnType<typeof useMutation<FollowUpActionResponse, Error, { id: string; data: UpdateFollowUpActionRequest }, { previousActions?: FollowUpActionsResponse }>>;
  deleteMutation: ReturnType<typeof useMutation<void, Error, string, { previousActions?: FollowUpActionsResponse }>>;
}

// =====================
// CUSTOM HOOK
// =====================

/**
 * Custom hook for managing follow-up action mutations
 * Provides create, update, and delete mutations with optimistic updates
 *
 * @param currentIncidentId - The current incident ID for cache invalidation
 * @returns Object containing all mutation hooks
 *
 * @example
 * ```typescript
 * const { createMutation, updateMutation, deleteMutation } = useMutations(incidentId);
 *
 * // Create a new action
 * const response = await createMutation.mutateAsync(data);
 *
 * // Update an action
 * await updateMutation.mutateAsync({ id: 'action-123', data: { status: 'COMPLETED' } });
 *
 * // Delete an action
 * await deleteMutation.mutateAsync('action-123');
 * ```
 */
export function useMutations(currentIncidentId?: string): UseMutationsReturn {
  const queryClient = useQueryClient();

  /**
   * Mutation for creating a follow-up action
   */
  const createMutation = useMutation<
    FollowUpActionResponse,
    Error,
    CreateFollowUpActionRequest
  >({
    mutationFn: (data: CreateFollowUpActionRequest) => incidentReportsApi.addFollowUpAction(data),
    onSuccess: (response) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.actions(response.action.incidentReportId) });
      // Also invalidate the incident query to update follow-up action count
      queryClient.invalidateQueries({ queryKey: ['incidentReport', response.action.incidentReportId] });
    },
  });

  /**
   * Mutation for updating a follow-up action
   */
  const updateMutation = useMutation<
    FollowUpActionResponse,
    Error,
    { id: string; data: UpdateFollowUpActionRequest },
    { previousActions?: FollowUpActionsResponse }
  >({
    mutationFn: ({ id, data }: { id: string; data: UpdateFollowUpActionRequest }) =>
      incidentReportsApi.updateFollowUpAction(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.actions(currentIncidentId) });

      // Snapshot previous value
      const previousActions = queryClient.getQueryData<FollowUpActionsResponse>(
        QUERY_KEYS.actions(currentIncidentId)
      );

      // Optimistically update
      queryClient.setQueryData<FollowUpActionsResponse>(
        QUERY_KEYS.actions(currentIncidentId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            actions: old.actions.map((action: FollowUpAction) =>
              action.id === id ? { ...action, ...data } : action
            ),
          };
        }
      );

      return { previousActions };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousActions) {
        queryClient.setQueryData(QUERY_KEYS.actions(currentIncidentId), context.previousActions);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.actions(response.action.incidentReportId) });
    },
  });

  /**
   * Mutation for deleting a follow-up action
   */
  const deleteMutation = useMutation<
    void,
    Error,
    string,
    { previousActions?: FollowUpActionsResponse }
  >({
    mutationFn: (id: string) => incidentReportsApi.deleteFollowUpAction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.actions(currentIncidentId) });

      const previousActions = queryClient.getQueryData<FollowUpActionsResponse>(
        QUERY_KEYS.actions(currentIncidentId)
      );

      // Optimistically remove
      queryClient.setQueryData<FollowUpActionsResponse>(
        QUERY_KEYS.actions(currentIncidentId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            actions: old.actions.filter((action: FollowUpAction) => action.id !== id),
          };
        }
      );

      return { previousActions };
    },
    onError: (err, variables, context) => {
      if (context?.previousActions) {
        queryClient.setQueryData(QUERY_KEYS.actions(currentIncidentId), context.previousActions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.actions(currentIncidentId) });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
