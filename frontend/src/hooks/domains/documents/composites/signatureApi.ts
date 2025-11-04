/**
 * Signature workflow API functions
 *
 * @module hooks/documents/signatureApi
 * @description API functions and query keys for signature workflows
 */

'use client';

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
export async function fetchWorkflow(workflowId: string, token?: string): Promise<SignatureWorkflow> {
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
export async function createWorkflow(
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
export async function signDocument(
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
export async function declineSignature(
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
export async function cancelWorkflow(
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
export async function sendReminder(
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
 * Fetch pending signatures
 */
export async function fetchPendingSignatures(token?: string) {
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
