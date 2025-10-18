/**
 * WF-COMP-184 | useEmergencyContactsData.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../hooks/useEmergencyContacts, ../../../hooks/useCommunicationOptions | Dependencies: react, ../../../hooks/useEmergencyContacts, ../../../hooks/useCommunicationOptions
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions | Key Features: useEffect
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * useEmergencyContactsData Hook
 *
 * Manages data fetching and mutations for emergency contacts
 *
 * @module hooks/useEmergencyContactsData
 */

import { useEffect } from 'react';
import {
  useEmergencyContacts,
  useEmergencyContactStatistics,
  useCreateEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
  useNotifyStudentContacts,
  useVerifyContact,
} from '../../../hooks/useEmergencyContacts';
import {
  useCommunicationChannels,
  useNotificationTypes,
  usePriorityLevels,
} from '../../../hooks/useCommunicationOptions';
import type { Contact, EmergencyContactStatistics } from '../types';

interface UseEmergencyContactsDataParams {
  selectedStudent: string;
  isRestored: boolean;
}

/**
 * Custom hook for managing emergency contacts data
 */
export function useEmergencyContactsData({
  selectedStudent,
  isRestored,
}: UseEmergencyContactsDataParams) {
  // Fetch emergency contacts for selected student
  const {
    data: contactsData,
    isLoading: contactsLoading,
    refetch: refetchContacts,
  } = useEmergencyContacts(selectedStudent, {
    enabled: !!selectedStudent && isRestored,
  });

  const contacts = (contactsData?.contacts || []) as Contact[];

  // Fetch statistics
  const { data: statistics, refetch: refetchStatistics } = useEmergencyContactStatistics();
  const stats = statistics as EmergencyContactStatistics | undefined;

  // Fetch communication options
  const { data: channels = [] } = useCommunicationChannels();
  const { data: notificationTypes = [] } = useNotificationTypes();
  const { data: priorityLevels = [] } = usePriorityLevels();

  // Mutations
  const createContact = useCreateEmergencyContact();
  const updateContact = useUpdateEmergencyContact();
  const deleteContact = useDeleteEmergencyContact();
  const notifyContacts = useNotifyStudentContacts();
  const verifyContact = useVerifyContact();

  // Refetch data when student changes
  useEffect(() => {
    if (selectedStudent && isRestored) {
      refetchContacts();
    }
  }, [selectedStudent, isRestored, refetchContacts]);

  return {
    // Data
    contacts,
    statistics: stats,
    channels,
    notificationTypes,
    priorityLevels,

    // Loading states
    contactsLoading,
    isCreating: createContact.isPending,
    isUpdating: updateContact.isPending,
    isDeleting: deleteContact.isPending,
    isNotifying: notifyContacts.isPending,
    isVerifying: verifyContact.isPending,

    // Mutations
    createContact,
    updateContact,
    deleteContact,
    notifyContacts,
    verifyContact,

    // Refetch functions
    refetchContacts,
    refetchStatistics,
  };
}
