/**
 * Communication & Contacts Domain Hooks
 *
 * Specialized hooks for emergency contacts, communication, and documents.
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../reduxStore';
import { useAppSelector } from './store-hooks-index';

import {
  emergencyContactsActions,
  emergencyContactsThunks,
  emergencyContactsSelectors,
  selectContactsByStudent,
  selectPrimaryContacts,
} from '../slices/emergencyContactsSlice';

import {
  documentsActions,
  documentsThunks,
  documentsSelectors,
  selectDocumentsByStudent,
  selectDocumentsByType,
} from '../slices/documentsSlice';

import {
  communicationActions,
  communicationThunks,
  communicationSelectors,
  selectUnreadMessages,
  selectMessagesByThread,
} from '../slices/communicationSlice';

// =====================
// EMERGENCY CONTACTS HOOKS
// =====================

/**
 * Hook that provides all emergency contacts actions
 */
export const useEmergencyContactsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(emergencyContactsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(emergencyContactsThunks.fetchById(id)),
    create: (data: any) => dispatch(emergencyContactsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(emergencyContactsThunks.update(params)),
    delete: (id: string) => dispatch(emergencyContactsThunks.delete(id)),
  };
};

/**
 * Hook to get all emergency contacts
 */
export const useEmergencyContacts = () => useAppSelector((state) => emergencyContactsSelectors.selectAll(state));

/**
 * Hook to get emergency contacts by student
 */
export const useContactsByStudent = (studentId: string) =>
  useAppSelector((state) => selectContactsByStudent(state, studentId));

// =====================
// DOCUMENTS HOOKS
// =====================

/**
 * Hook that provides all document actions
 */
export const useDocumentsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(documentsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(documentsThunks.fetchById(id)),
    create: (data: any) => dispatch(documentsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(documentsThunks.update(params)),
    delete: (id: string) => dispatch(documentsThunks.delete(id)),
  };
};

/**
 * Hook to get all documents
 */
export const useDocuments = () => useAppSelector((state) => documentsSelectors.selectAll(state));

/**
 * Hook to get documents by student
 */
export const useDocumentsByStudent = (studentId: string) =>
  useAppSelector((state) => selectDocumentsByStudent(state, studentId));

// =====================
// COMMUNICATION HOOKS
// =====================

/**
 * Hook that provides all communication actions
 */
export const useCommunicationActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(communicationThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(communicationThunks.fetchById(id)),
    create: (data: any) => dispatch(communicationThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(communicationThunks.update(params)),
    delete: (id: string) => dispatch(communicationThunks.delete(id)),
  };
};

/**
 * Hook to get all messages
 */
export const useMessages = () => useAppSelector((state) => communicationSelectors.selectAll(state));

/**
 * Hook to get unread messages
 */
export const useUnreadMessages = () => useAppSelector((state) => selectUnreadMessages(state));
