/**
 * useSignatureWorkflow hook for e-signature management
 *
 * @module hooks/documents/useSignatureWorkflow
 * @description Hook for managing signature workflows
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  signatureKeys,
  fetchWorkflow,
  signDocument,
  declineSignature,
  cancelWorkflow,
  sendReminder
} from './signatureApi';

/**
 * useSignatureWorkflow hook
 */
export function useSignatureWorkflow(workflowId: string, token?: string) {
  const queryClient = useQueryClient();

  const {
    data: workflow,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: signatureKeys.workflow(workflowId),
    queryFn: () => fetchWorkflow(workflowId, token),
    enabled: !!workflowId
  });

  const signMutation = useMutation({
    mutationFn: (signatureData: Parameters<typeof signDocument>[1]) =>
      signDocument(workflow?.parties.find((p) => p.status === 'pending')?.signatureId || '', signatureData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureKeys.workflow(workflowId) });
    }
  });

  const declineMutation = useMutation({
    mutationFn: (reason: string) =>
      declineSignature(workflow?.parties.find((p) => p.status === 'pending')?.signatureId || '', reason, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureKeys.workflow(workflowId) });
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => cancelWorkflow(workflowId, reason, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureKeys.workflow(workflowId) });
    }
  });

  const reminderMutation = useMutation({
    mutationFn: (partyId: string) => sendReminder(workflowId, partyId, token)
  });

  const sign = useCallback(
    (signatureData: Parameters<typeof signDocument>[1]) => {
      return signMutation.mutateAsync(signatureData);
    },
    [signMutation]
  );

  const decline = useCallback(
    (reason: string) => {
      return declineMutation.mutateAsync(reason);
    },
    [declineMutation]
  );

  const cancel = useCallback(
    (reason: string) => {
      return cancelMutation.mutateAsync(reason);
    },
    [cancelMutation]
  );

  const sendReminderToParty = useCallback(
    (partyId: string) => {
      return reminderMutation.mutateAsync(partyId);
    },
    [reminderMutation]
  );

  return {
    workflow,
    isLoading,
    isError,
    error,
    refetch,
    sign,
    decline,
    cancel,
    sendReminder: sendReminderToParty,
    isSigning: signMutation.isPending,
    isDeclining: declineMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isSendingReminder: reminderMutation.isPending
  };
}

// Re-export everything from other modules
export { signatureKeys } from './signatureApi';
export {
  fetchWorkflow,
  createWorkflow,
  signDocument,
  declineSignature,
  cancelWorkflow,
  sendReminder,
  fetchPendingSignatures
} from './signatureApi';
export {
  useCreateSignatureWorkflow,
  usePendingSignatures
} from './signatureHooks';
