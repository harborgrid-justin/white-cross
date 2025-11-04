/**
 * WF-COMP-129 | useEmergencyContacts.constants.ts - Constants and utilities
 * Purpose: Constants, query keys, and utility functions
 * Upstream: None | Dependencies: react-hot-toast
 * Downstream: useEmergencyContacts hooks | Called by: React component tree
 * Related: useEmergencyContacts queries and mutations
 * Exports: constants, functions, query keys | Key Features: Configuration and utilities
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Constants and utilities extracted from useEmergencyContacts
 */

import { toast } from 'react-hot-toast';

// ============================================================================
// Constants
// ============================================================================

export const STALE_TIME = {
  CONTACTS: 5 * 60 * 1000, // 5 minutes
  STATISTICS: 10 * 60 * 1000, // 10 minutes
};

export const CACHE_TIME = {
  DEFAULT: 30 * 60 * 1000, // 30 minutes
};

export const RETRY_CONFIG = {
  ATTEMPTS: 3,
  DELAY: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// ============================================================================
// Query Keys Factory
// ============================================================================

export const emergencyContactsKeys = {
  all: ['emergencyContacts'] as const,
  contacts: (studentId?: string) => [...emergencyContactsKeys.all, 'contacts', studentId] as const,
  contact: (id: string) => [...emergencyContactsKeys.all, 'contact', id] as const,
  statistics: () => [...emergencyContactsKeys.all, 'statistics'] as const,
};

// ============================================================================
// Error Handling Utilities
// ============================================================================

export function handleQueryError(error: unknown, context: string): void {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

  toast.error(`Failed to ${context}: ${errorMessage}`);
  console.error(`Error ${context}:`, error);
}

export function shouldRetry(failureCount: number, error: unknown): boolean {
  // Don't retry on certain errors
  if (error instanceof Error && error.message.includes('not found')) {
    return false;
  }

  return failureCount < RETRY_CONFIG.ATTEMPTS;
}
