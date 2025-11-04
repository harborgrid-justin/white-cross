/**
 * WF-COMP-129 | useEmergencyContacts.mutations.verification.ts - Verification mutation hooks
 * Purpose: React Query hooks for emergency contact verification operations
 * Upstream: ../services/modules/emergencyContactsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Components, pages | Called by: React component tree
 * Related: useEmergencyContacts queries, types, constants
 * Exports: Verification mutation hooks | Key Features: Verify contact information
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Verification mutation hooks extracted from useEmergencyContacts.mutations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { emergencyContactsApi } from '@/services';
import {
  emergencyContactsKeys,
  handleQueryError,
} from './useEmergencyContacts.constants';

// ============================================================================
// Verification Mutations
// ============================================================================

/**
 * Hook to verify an emergency contact's information
 *
 * @param options - Additional mutation options
 * @returns Mutation function to verify contact
 *
 * @example
 * ```tsx
 * const verifyContact = useVerifyContact();
 *
 * await verifyContact.mutateAsync({
 *   contactId: 'contact-id',
 *   studentId: 'student-id',
 *   method: 'sms',
 * });
 * ```
 */
export function useVerifyContact(
  options?: UseMutationOptions<
    any,
    Error,
    { contactId: string; studentId: string; method: 'sms' | 'email' | 'voice' }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { contactId: string; studentId: string; method: 'sms' | 'email' | 'voice' }
  >({
    mutationFn: ({ contactId, method }) => emergencyContactsApi.verify(contactId, method),
    onSuccess: (_, variables) => {
      // Invalidate contacts to refresh verification status
      queryClient.invalidateQueries({
        queryKey: emergencyContactsKeys.contacts(variables.studentId),
      });
      queryClient.invalidateQueries({ queryKey: emergencyContactsKeys.statistics() });

      toast.success(`Verification sent via ${variables.method}`);
    },
    onError: (error) => {
      handleQueryError(error, 'send verification');
    },
    ...options,
  });
}
