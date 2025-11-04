/**
 * WF-COMM-EMERGENCY-HOOK-FORM | useEmergencyForm.ts - Emergency Form State Hook
 * Purpose: Manages state for emergency communication form
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

import { useState, useCallback } from 'react';
import type {
  EmergencyFormState,
  UseEmergencyFormReturn,
  RecipientType,
  DeliveryChannel,
} from '../types';
import { DEFAULT_EMERGENCY_FORM } from '../constants';

/**
 * Custom hook for managing emergency form state
 *
 * Provides centralized state management for all emergency form fields
 * with type-safe setters and reset functionality.
 *
 * @returns {UseEmergencyFormReturn} Form state and setter functions
 *
 * @example
 * ```tsx
 * const {
 *   formState,
 *   setEmergencyType,
 *   setMessage,
 *   resetForm
 * } = useEmergencyForm();
 * ```
 */
export function useEmergencyForm(): UseEmergencyFormReturn {
  const [formState, setFormState] = useState<EmergencyFormState>({
    ...DEFAULT_EMERGENCY_FORM,
  });

  const setEmergencyType = useCallback((typeId: string) => {
    setFormState((prev) => ({ ...prev, emergencyType: typeId }));
  }, []);

  const setRecipientType = useCallback((type: RecipientType) => {
    setFormState((prev) => ({ ...prev, recipientType: type }));
  }, []);

  const setSelectedStudents = useCallback((students: string[]) => {
    setFormState((prev) => ({ ...prev, selectedStudents: students }));
  }, []);

  const setSelectedGroup = useCallback((group: string) => {
    setFormState((prev) => ({ ...prev, selectedGroup: group }));
  }, []);

  const setSubject = useCallback((subject: string) => {
    setFormState((prev) => ({ ...prev, subject }));
  }, []);

  const setMessage = useCallback((message: string) => {
    setFormState((prev) => ({ ...prev, message }));
  }, []);

  const setDeliveryChannels = useCallback((channels: DeliveryChannel[]) => {
    setFormState((prev) => ({ ...prev, deliveryChannels: channels }));
  }, []);

  const setRequireConfirmation = useCallback((value: boolean) => {
    setFormState((prev) => ({ ...prev, requireConfirmation: value }));
  }, []);

  const setEscalateToEmergencyContact = useCallback((value: boolean) => {
    setFormState((prev) => ({ ...prev, escalateToEmergencyContact: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({ ...DEFAULT_EMERGENCY_FORM });
  }, []);

  return {
    formState,
    setEmergencyType,
    setRecipientType,
    setSelectedStudents,
    setSelectedGroup,
    setSubject,
    setMessage,
    setDeliveryChannels,
    setRequireConfirmation,
    setEscalateToEmergencyContact,
    resetForm,
  };
}
