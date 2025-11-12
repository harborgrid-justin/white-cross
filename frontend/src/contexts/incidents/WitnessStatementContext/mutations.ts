/**
 * WF-HOOK-150 | mutations.ts - TanStack Query mutation hooks
 * Purpose: TanStack Query mutations for witness statement CRUD operations
 * Features: Optimistic updates, automatic cache invalidation, error handling
 * Last Updated: 2025-11-12 | File Type: .ts
 */

import { useMutation, type QueryClient } from '@tanstack/react-query';
import type {
  WitnessStatement,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
} from './types';
import { incidentsApi } from '@/services';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

// ==========================================
// TYPES
// ==========================================

interface WitnessStatementsCache {
  statements: WitnessStatement[];
}

interface MutationContext {
  previousStatements?: WitnessStatementsCache;
  incidentReportId: string;
}

// ==========================================
// CREATE MUTATION
// ==========================================

/**
 * Create mutation with optimistic updates
 */
export function useCreateStatementMutation(
  queryClient: QueryClient,
  onSuccessCallback?: () => void
) {
  return useMutation({
    mutationFn: async (data: CreateWitnessStatementRequest) => {
      return await incidentsApi.addWitnessStatement(data);
    },
    onMutate: async (newStatement: CreateWitnessStatementRequest) => {
      // Snapshot previous value for rollback
      const previousStatements = queryClient.getQueryData<WitnessStatementsCache>([
        'witness-statements',
        newStatement.incidentReportId
      ]);

      // Create optimistic temporary statement
      const optimisticStatement: WitnessStatement = {
        id: `temp-${Date.now()}`,
        incidentReportId: newStatement.incidentReportId,
        witnessName: newStatement.witnessName,
        witnessType: newStatement.witnessType,
        witnessContact: newStatement.witnessContact,
        statement: newStatement.statement,
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically update cache
      queryClient.setQueryData<WitnessStatementsCache>(
        ['witness-statements', newStatement.incidentReportId],
        (old) => ({
          statements: [...(old?.statements || []), optimisticStatement]
        })
      );

      return {
        previousStatements,
        incidentReportId: newStatement.incidentReportId
      } as MutationContext;
    },
    onSuccess: (
      response: { statement: WitnessStatement },
      variables: CreateWitnessStatementRequest
    ) => {
      // Invalidate and refetch to get server data
      queryClient.invalidateQueries({
        queryKey: ['witness-statements', variables.incidentReportId]
      });
      queryClient.invalidateQueries({
        queryKey: ['incident-reports', variables.incidentReportId]
      });

      showSuccessToast('Witness statement added successfully');
      onSuccessCallback?.();
    },
    onError: (
      error: Error,
      variables: CreateWitnessStatementRequest,
      context: MutationContext | undefined
    ) => {
      // Rollback on error
      if (context?.previousStatements) {
        queryClient.setQueryData(
          ['witness-statements', context.incidentReportId],
          context.previousStatements
        );
      }

      const errorMessage = error?.message || 'Failed to add witness statement';
      showErrorToast(errorMessage);
      console.error('Create witness statement error:', error);
    },
  });
}

// ==========================================
// UPDATE MUTATION
// ==========================================

/**
 * Update mutation with optimistic updates
 */
export function useUpdateStatementMutation(
  queryClient: QueryClient,
  currentIncidentId: string | null,
  onSuccessCallback?: () => void
) {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWitnessStatementRequest }) => {
      return await incidentsApi.updateWitnessStatement(id, data);
    },
    onMutate: async ({ id, data }: { id: string; data: UpdateWitnessStatementRequest }) => {
      if (!currentIncidentId) return;

      // Snapshot previous value for rollback
      const previousStatements = queryClient.getQueryData<WitnessStatementsCache>([
        'witness-statements',
        currentIncidentId
      ]);

      // Optimistically update cache
      queryClient.setQueryData<WitnessStatementsCache>(
        ['witness-statements', currentIncidentId],
        (old) => ({
          statements: old?.statements.map(statement =>
            statement.id === id
              ? { ...statement, ...data, updatedAt: new Date().toISOString() }
              : statement
          ) || []
        })
      );

      return {
        previousStatements,
        incidentReportId: currentIncidentId
      } as MutationContext;
    },
    onSuccess: (
      response: { statement: WitnessStatement },
      variables: { id: string; data: UpdateWitnessStatementRequest }
    ) => {
      // Invalidate and refetch
      if (currentIncidentId) {
        queryClient.invalidateQueries({
          queryKey: ['witness-statements', currentIncidentId]
        });
        queryClient.invalidateQueries({
          queryKey: ['incident-reports', currentIncidentId]
        });
      }

      showSuccessToast('Witness statement updated successfully');
      onSuccessCallback?.();
    },
    onError: (
      error: Error,
      variables: { id: string; data: UpdateWitnessStatementRequest },
      context: MutationContext | undefined
    ) => {
      // Rollback handled automatically by React Query
      const errorMessage = error?.message || 'Failed to update witness statement';
      showErrorToast(errorMessage);
      console.error('Update witness statement error:', error);
    },
  });
}

// ==========================================
// DELETE MUTATION
// ==========================================

/**
 * Delete mutation with optimistic removal from cache
 */
export function useDeleteStatementMutation(
  queryClient: QueryClient,
  currentIncidentId: string | null,
  selectedStatementId: string | null | undefined,
  onSuccessCallback?: () => void
) {
  return useMutation({
    mutationFn: async (id: string) => {
      return await incidentsApi.deleteWitnessStatement(id);
    },
    onMutate: async (id: string) => {
      if (!currentIncidentId) return;

      // Snapshot previous value for rollback
      const previousStatements = queryClient.getQueryData<WitnessStatementsCache>([
        'witness-statements',
        currentIncidentId
      ]);

      // Optimistically remove from cache
      queryClient.setQueryData<WitnessStatementsCache>(
        ['witness-statements', currentIncidentId],
        (old) => ({
          statements: old?.statements.filter(statement => statement.id !== id) || []
        })
      );

      return {
        previousStatements,
        incidentReportId: currentIncidentId
      } as MutationContext;
    },
    onSuccess: (response: { success: boolean }, variables: string) => {
      // Invalidate and refetch
      if (currentIncidentId) {
        queryClient.invalidateQueries({
          queryKey: ['witness-statements', currentIncidentId]
        });
        queryClient.invalidateQueries({
          queryKey: ['incident-reports', currentIncidentId]
        });
      }

      showSuccessToast('Witness statement deleted successfully');

      // Clear selected statement if it was the deleted one
      if (selectedStatementId === variables) {
        onSuccessCallback?.();
      }
    },
    onError: (
      error: Error,
      variables: string,
      context: MutationContext | undefined
    ) => {
      // Rollback handled automatically by React Query
      const errorMessage = error?.message || 'Failed to delete witness statement';
      showErrorToast(errorMessage);
      console.error('Delete witness statement error:', error);
    },
  });
}

// ==========================================
// VERIFY MUTATION
// ==========================================

/**
 * Verify mutation - marks statement as verified
 */
export function useVerifyStatementMutation(
  queryClient: QueryClient,
  currentIncidentId: string | null
) {
  return useMutation({
    mutationFn: async (id: string) => {
      return await incidentsApi.verifyWitnessStatement(id);
    },
    onMutate: async (id: string) => {
      if (!currentIncidentId) return;

      // Snapshot previous value for rollback
      const previousStatements = queryClient.getQueryData<WitnessStatementsCache>([
        'witness-statements',
        currentIncidentId
      ]);

      // Optimistically update verification status
      queryClient.setQueryData<WitnessStatementsCache>(
        ['witness-statements', currentIncidentId],
        (old) => ({
          statements: old?.statements.map(statement =>
            statement.id === id
              ? {
                  ...statement,
                  verified: true,
                  verifiedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              : statement
          ) || []
        })
      );

      return {
        previousStatements,
        incidentReportId: currentIncidentId
      } as MutationContext;
    },
    onSuccess: (response: { statement: WitnessStatement }, variables: string) => {
      // Invalidate and refetch
      if (currentIncidentId) {
        queryClient.invalidateQueries({
          queryKey: ['witness-statements', currentIncidentId]
        });
        queryClient.invalidateQueries({
          queryKey: ['incident-reports', currentIncidentId]
        });
      }

      showSuccessToast('Witness statement verified successfully');
    },
    onError: (
      error: Error,
      variables: string,
      context: MutationContext | undefined
    ) => {
      // Rollback handled automatically by React Query
      const errorMessage = error?.message || 'Failed to verify witness statement';
      showErrorToast(errorMessage);
      console.error('Verify witness statement error:', error);
    },
  });
}

// ==========================================
// UNVERIFY MUTATION
// ==========================================

/**
 * Unverify mutation - removes verification status
 */
export function useUnverifyStatementMutation(
  queryClient: QueryClient,
  currentIncidentId: string | null
) {
  return useMutation({
    mutationFn: async (id: string) => {
      return await incidentsApi.updateWitnessStatement(id, { verified: false });
    },
    onMutate: async (id: string) => {
      if (!currentIncidentId) return;

      // Snapshot previous value for rollback
      const previousStatements = queryClient.getQueryData<WitnessStatementsCache>([
        'witness-statements',
        currentIncidentId
      ]);

      // Optimistically update verification status
      queryClient.setQueryData<WitnessStatementsCache>(
        ['witness-statements', currentIncidentId],
        (old) => ({
          statements: old?.statements.map(statement =>
            statement.id === id
              ? {
                  ...statement,
                  verified: false,
                  verifiedAt: undefined,
                  verifiedBy: undefined,
                  updatedAt: new Date().toISOString()
                }
              : statement
          ) || []
        })
      );

      return {
        previousStatements,
        incidentReportId: currentIncidentId
      } as MutationContext;
    },
    onSuccess: (response: { statement: WitnessStatement }, variables: string) => {
      // Invalidate and refetch
      if (currentIncidentId) {
        queryClient.invalidateQueries({
          queryKey: ['witness-statements', currentIncidentId]
        });
        queryClient.invalidateQueries({
          queryKey: ['incident-reports', currentIncidentId]
        });
      }

      showSuccessToast('Witness statement unverified successfully');
    },
    onError: (
      error: Error,
      variables: string,
      context: MutationContext | undefined
    ) => {
      // Rollback handled automatically by React Query
      const errorMessage = error?.message || 'Failed to unverify witness statement';
      showErrorToast(errorMessage);
      console.error('Unverify witness statement error:', error);
    },
  });
}
