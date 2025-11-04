/**
 * WF-COMP-129 | useEmergencyContacts.mutations.ts - Mutation hooks
 * Purpose: React Query hooks for emergency contact mutations (CRUD, notifications, verification)
 * Upstream: ../services/modules/emergencyContactsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Components, pages | Called by: React component tree
 * Related: useEmergencyContacts queries, types, constants
 * Exports: mutation hooks | Key Features: Data mutations with optimistic updates
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Mutation hooks extracted from useEmergencyContacts
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { emergencyContactsApi } from '@/services';
import {
  EmergencyContact,
  CreateEmergencyContactRequest,
  UpdateEmergencyContactRequest,
  NotificationRequest,
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

// ============================================================================
// Notification Mutations
// ============================================================================

/**
 * Hook to send notifications to all emergency contacts for a student
 *
 * @param options - Additional mutation options
 * @returns Mutation function to send notifications
 *
 * @example
 * ```tsx
 * const notifyContacts = useNotifyStudentContacts();
 *
 * await notifyContacts.mutateAsync({
 *   studentId: '123',
 *   notification: {
 *     message: 'Emergency alert',
 *     type: 'emergency',
 *     priority: 'high',
 *     channels: ['sms', 'email'],
 *   },
 * });
 * ```
 */
export function useNotifyStudentContacts(
  options?: UseMutationOptions<
    { results: any[] },
    Error,
    { studentId: string; notification: NotificationRequest }
  >
) {
  return useMutation<
    { results: any[] },
    Error,
    { studentId: string; notification: NotificationRequest }
  >({
    mutationFn: ({ studentId, notification }) =>
      emergencyContactsApi.notifyStudent(studentId, {
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        channels: notification.channels as ('sms' | 'email' | 'voice')[],
      }),
    onSuccess: () => {
      toast.success('Notifications sent successfully to all emergency contacts');
    },
    onError: (error) => {
      handleQueryError(error, 'send notifications');
    },
    ...options,
  });
}

/**
 * Hook to send notification to a specific emergency contact
 *
 * @param options - Additional mutation options
 * @returns Mutation function to send notification to one contact
 *
 * @example
 * ```tsx
 * const notifyContact = useNotifyContact();
 *
 * await notifyContact.mutateAsync({
 *   contactId: 'contact-id',
 *   notification: {
 *     message: 'Health update',
 *     type: 'health',
 *     priority: 'medium',
 *     channels: ['email'],
 *   },
 * });
 * ```
 */
export function useNotifyContact(
  options?: UseMutationOptions<
    { result: any },
    Error,
    { contactId: string; notification: NotificationRequest }
  >
) {
  return useMutation<
    { result: any },
    Error,
    { contactId: string; notification: NotificationRequest }
  >({
    mutationFn: ({ contactId, notification }) =>
      emergencyContactsApi.notifyContact(contactId, {
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        channels: notification.channels as ('sms' | 'email' | 'voice')[],
      }),
    onSuccess: () => {
      toast.success('Notification sent successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'send notification');
    },
    ...options,
  });
}

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
