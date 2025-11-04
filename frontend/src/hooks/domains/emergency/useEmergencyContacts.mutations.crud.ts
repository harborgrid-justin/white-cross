/**
 * WF-COMP-129 | useEmergencyContacts.mutations.crud.ts - CRUD mutation hooks
 * Purpose: React Query hooks for emergency contact CRUD operations (create, update, delete)
 * Upstream: ../services/modules/emergencyContactsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Components, pages | Called by: React component tree
 * Related: useEmergencyContacts queries, types, constants
 * Exports: CRUD mutation hooks | Key Features: Data mutations with optimistic updates
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: CRUD mutation hooks extracted from useEmergencyContacts.mutations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { emergencyContactsApi } from '@/services';
import {
  EmergencyContact,
  CreateEmergencyContactRequest,
  UpdateEmergencyContactRequest,
} from './useEmergencyContacts.types';
import {
  emergencyContactsKeys,
  handleQueryError,
} from './useEmergencyContacts.constants';

// ============================================================================
// Emergency Contacts CRUD Mutations
// ============================================================================

/**
 * Hook to create a new emergency contact
 *
 * @param options - Additional mutation options
 * @returns Mutation function to create an emergency contact
 *
 * @example
 * ```tsx
 * const createContact = useCreateEmergencyContact();
 *
 * await createContact.mutateAsync({
 *   studentId: '123',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   relationship: 'Father',
 *   phoneNumber: '555-1234',
 *   priority: 'PRIMARY',
 * });
 * ```
 */
export function useCreateEmergencyContact(
  options?: UseMutationOptions<{ contact: EmergencyContact }, Error, CreateEmergencyContactRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<{ contact: EmergencyContact }, Error, CreateEmergencyContactRequest>({
    mutationFn: (data) => emergencyContactsApi.create(data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch contacts for this student
      queryClient.invalidateQueries({ queryKey: emergencyContactsKeys.contacts(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: emergencyContactsKeys.statistics() });

      toast.success('Emergency contact created successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'create emergency contact');
    },
    ...options,
  });
}

/**
 * Hook to update an existing emergency contact
 *
 * @param options - Additional mutation options
 * @returns Mutation function to update an emergency contact
 *
 * @example
 * ```tsx
 * const updateContact = useUpdateEmergencyContact();
 *
 * await updateContact.mutateAsync({
 *   id: 'contact-id',
 *   data: { phoneNumber: '555-5678' },
 * });
 * ```
 */
export function useUpdateEmergencyContact(
  options?: UseMutationOptions<
    { contact: EmergencyContact },
    Error,
    { id: string; data: UpdateEmergencyContactRequest },
    { previousContact?: { contact: EmergencyContact } | undefined }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    { contact: EmergencyContact },
    Error,
    { id: string; data: UpdateEmergencyContactRequest },
    { previousContact?: { contact: EmergencyContact } | undefined }
  >({
    mutationFn: ({ id, data }) => emergencyContactsApi.update(id, data),
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: emergencyContactsKeys.contact(id) });

      // Snapshot previous value for rollback
      const previousContact = queryClient.getQueryData<{ contact: EmergencyContact }>(
        emergencyContactsKeys.contact(id)
      );

      return { previousContact };
    },
    onSuccess: (data) => {
      // Update cache with new data
      queryClient.setQueryData(emergencyContactsKeys.contact(data.contact.id), data);

      // Invalidate contacts list for this student
      if (data.contact.student?.id) {
        queryClient.invalidateQueries({
          queryKey: emergencyContactsKeys.contacts(data.contact.student.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: emergencyContactsKeys.statistics() });

      toast.success('Emergency contact updated successfully');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousContact) {
        queryClient.setQueryData(
          emergencyContactsKeys.contact(variables.id),
          context.previousContact
        );
      }
      handleQueryError(error, 'update emergency contact');
    },
    ...options,
  });
}

/**
 * Hook to delete an emergency contact
 *
 * @param options - Additional mutation options
 * @returns Mutation function to delete an emergency contact
 *
 * @example
 * ```tsx
 * const deleteContact = useDeleteEmergencyContact();
 *
 * await deleteContact.mutateAsync({
 *   id: 'contact-id',
 *   studentId: 'student-id',
 * });
 * ```
 */
export function useDeleteEmergencyContact(
  options?: UseMutationOptions<{ success: boolean }, Error, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { id: string; studentId: string }>({
    mutationFn: ({ id }) => emergencyContactsApi.delete(id),
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: emergencyContactsKeys.contact(variables.id) });

      // Invalidate contacts list for this student
      queryClient.invalidateQueries({
        queryKey: emergencyContactsKeys.contacts(variables.studentId),
      });
      queryClient.invalidateQueries({ queryKey: emergencyContactsKeys.statistics() });

      toast.success('Emergency contact deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'delete emergency contact');
    },
    ...options,
  });
}
