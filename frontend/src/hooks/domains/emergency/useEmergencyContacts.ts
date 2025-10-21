/**
 * WF-COMP-129 | useEmergencyContacts.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/modules/emergencyContactsApi | Dependencies: @tanstack/react-query, react-hot-toast, ../services/modules/emergencyContactsApi
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Custom React Query Hooks for Emergency Contacts
 *
 * Enterprise-grade hooks with:
 * - Type-safe API integration
 * - Automatic caching and invalidation
 * - Optimistic updates for better UX
 * - Error handling and retry strategies
 * - HIPAA-compliant data handling
 * - Multi-channel communication support
 *
 * @module useEmergencyContacts
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { emergencyContactsApi } from '../services/modules/emergencyContactsApi';

// ============================================================================
// Type Definitions
// ============================================================================

export interface EmergencyContact {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY';
  isActive: boolean;
  verified?: boolean;
  verifiedAt?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

export interface CreateEmergencyContactRequest {
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: string;
}

export interface UpdateEmergencyContactRequest {
  firstName?: string;
  lastName?: string;
  relationship?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  priority?: string;
  isActive?: boolean;
}

export interface NotificationRequest {
  message: string;
  type: 'emergency' | 'health' | 'medication' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
}

export interface EmergencyContactStatistics {
  totalContacts: number;
  studentsWithoutContacts: number;
  byPriority: Record<string, number>;
}

export interface VerificationMethod {
  method: 'sms' | 'email' | 'voice';
}

// ============================================================================
// Constants
// ============================================================================

const STALE_TIME = {
  CONTACTS: 5 * 60 * 1000, // 5 minutes
  STATISTICS: 10 * 60 * 1000, // 10 minutes
};

const CACHE_TIME = {
  DEFAULT: 30 * 60 * 1000, // 30 minutes
};

const RETRY_CONFIG = {
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

function handleQueryError(error: unknown, context: string): void {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

  toast.error(`Failed to ${context}: ${errorMessage}`);
  console.error(`Error ${context}:`, error);
}

function shouldRetry(failureCount: number, error: unknown): boolean {
  // Don't retry on certain errors
  if (error instanceof Error && error.message.includes('not found')) {
    return false;
  }

  return failureCount < RETRY_CONFIG.ATTEMPTS;
}

// ============================================================================
// Emergency Contacts Queries
// ============================================================================

/**
 * Hook to fetch emergency contacts for a specific student
 *
 * @param studentId - The ID of the student
 * @param options - Additional query options
 * @returns Query result with contacts data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useEmergencyContacts(studentId);
 * const contacts = data?.contacts || [];
 * ```
 */
export function useEmergencyContacts(
  studentId: string,
  options?: Omit<UseQueryOptions<{ contacts: EmergencyContact[] }, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<{ contacts: EmergencyContact[] }, Error>({
    queryKey: emergencyContactsKeys.contacts(studentId),
    queryFn: () => emergencyContactsApi.getByStudent(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.CONTACTS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Hook to fetch emergency contact statistics
 *
 * @param options - Additional query options
 * @returns Query result with statistics data
 *
 * @example
 * ```tsx
 * const { data: statistics } = useEmergencyContactStatistics();
 * ```
 */
export function useEmergencyContactStatistics(
  options?: Omit<UseQueryOptions<EmergencyContactStatistics, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<EmergencyContactStatistics, Error>({
    queryKey: emergencyContactsKeys.statistics(),
    queryFn: () => emergencyContactsApi.getStatistics(),
    staleTime: STALE_TIME.STATISTICS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

// ============================================================================
// Emergency Contacts Mutations
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
