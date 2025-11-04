/**
 * WF-COMP-129 | useEmergencyContacts.mutations.notifications.ts - Notification mutation hooks
 * Purpose: React Query hooks for emergency contact notification operations
 * Upstream: ../services/modules/emergencyContactsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Components, pages | Called by: React component tree
 * Related: useEmergencyContacts queries, types, constants
 * Exports: Notification mutation hooks | Key Features: Send notifications to contacts
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Notification mutation hooks extracted from useEmergencyContacts.mutations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { emergencyContactsApi } from '@/services';
import { NotificationRequest } from './useEmergencyContacts.types';
import { handleQueryError } from './useEmergencyContacts.constants';

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
