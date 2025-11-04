/**
 * Additional signature workflow hooks
 *
 * @module hooks/documents/signatureHooks
 * @description Additional hooks for signature workflows (create, pending)
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SignatureWorkflow } from '@/types/documents';
import {
  signatureKeys,
  createWorkflow,
  fetchPendingSignatures
} from './signatureApi';

/**
 * Hook for creating signature workflows
 */
export function useCreateSignatureWorkflow(token?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (workflowData: Partial<SignatureWorkflow>) =>
      createWorkflow(workflowData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureKeys.workflows() });
    }
  });

  return {
    createWorkflow: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    workflow: mutation.data
  };
}

/**
 * Hook for pending signatures
 */
export function usePendingSignatures(token?: string) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: signatureKeys.pending(),
    queryFn: () => fetchPendingSignatures(token)
  });

  return {
    pendingSignatures: data || [],
    isLoading,
    isError,
    error,
    refetch
  };
}
