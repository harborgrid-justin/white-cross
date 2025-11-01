/**
 * useSignatureWorkflow hook for e-signature management
 *
 * @module hooks/documents/useSignatureWorkflow
 * @description Hook for managing signature workflows
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type {
  SignatureWorkflow,
  Signature,
  SignatureStatus,
  WorkflowStatus
} from '@/types/documents';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Signature workflow query keys
 */
export const signatureKeys = {
  all: ['signatures'] as const,
  workflows: () => [...signatureKeys.all, 'workflows'] as const,
  workflow: (id: string) => [...signatureKeys.workflows(), id] as const,
  pending: () => [...signatureKeys.all, 'pending'] as const,
  document: (documentId: string) => [...signatureKeys.all, 'document', documentId] as const
};

/**
 * Fetch signature workflow
 */
async function fetchWorkflow(workflowId: string, token?: string): Promise<SignatureWorkflow> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/signatures/workflows/${workflowId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch signature workflow');
  }

  return response.json();
}

/**
 * Create signature workflow
 */
async function createWorkflow(
  workflowData: Partial<SignatureWorkflow>,
  token?: string
): Promise<SignatureWorkflow> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/signatures/workflows`, {
    method: 'POST',
    headers,
    body: JSON.stringify(workflowData)
  });

  if (!response.ok) {
    throw new Error('Failed to create signature workflow');
  }

  return response.json();
}

/**
 * Sign document
 */
async function signDocument(
  signatureId: string,
  signatureData: {
    type: string;
    signatureData?: string;
    signatureText?: string;
    reason?: string;
    location?: string;
  },
  token?: string
): Promise<Signature> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/signatures/${signatureId}/sign`, {
    method: 'POST',
    headers,
    body: JSON.stringify(signatureData)
  });

  if (!response.ok) {
    throw new Error('Failed to sign document');
  }

  return response.json();
}

/**
 * Decline signature
 */
async function declineSignature(
  signatureId: string,
  reason: string,
  token?: string
): Promise<Signature> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/signatures/${signatureId}/decline`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ reason })
  });

  if (!response.ok) {
    throw new Error('Failed to decline signature');
  }

  return response.json();
}

/**
 * Cancel workflow
 */
async function cancelWorkflow(
  workflowId: string,
  reason: string,
  token?: string
): Promise<SignatureWorkflow> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/signatures/workflows/${workflowId}/cancel`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ reason })
  });

  if (!response.ok) {
    throw new Error('Failed to cancel workflow');
  }

  return response.json();
}

/**
 * Send reminder
 */
async function sendReminder(
  workflowId: string,
  partyId: string,
  token?: string
): Promise<void> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/signatures/workflows/${workflowId}/remind/${partyId}`,
    {
      method: 'POST',
      headers
    }
  );

  if (!response.ok) {
    throw new Error('Failed to send reminder');
  }
}

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
    queryFn: async () => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/signatures/pending`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending signatures');
      }

      return response.json();
    }
  });

  return {
    pendingSignatures: data || [],
    isLoading,
    isError,
    error,
    refetch
  };
}
