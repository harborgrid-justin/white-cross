/**
 * WF-COMM-EMERGENCY-HOOK-VALIDATION | useEmergencyValidation.ts - Emergency Form Validation Hook
 * Purpose: Validates emergency communication form fields
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

import { useState, useCallback } from 'react';
import type {
  EmergencyFormState,
  EmergencyFormErrors,
  UseEmergencyValidationReturn,
} from '../types';

/**
 * Custom hook for validating emergency form fields
 *
 * Provides validation logic for all emergency form fields with
 * error state management and validation triggers.
 *
 * @param {EmergencyFormState} formState - Current form state to validate
 * @returns {UseEmergencyValidationReturn} Validation errors and functions
 *
 * @example
 * ```tsx
 * const { errors, validateForm, clearErrors } = useEmergencyValidation(formState);
 *
 * const handleSubmit = () => {
 *   if (validateForm()) {
 *     // Submit form
 *   }
 * };
 * ```
 */
export function useEmergencyValidation(
  formState: EmergencyFormState
): UseEmergencyValidationReturn {
  const [errors, setErrors] = useState<EmergencyFormErrors>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: EmergencyFormErrors = {};

    // Validate emergency type
    if (!formState.emergencyType) {
      newErrors.emergencyType = 'Please select an emergency type';
    }

    // Validate recipients
    if (formState.recipientType === 'individual' && formState.selectedStudents.length === 0) {
      newErrors.recipients = 'Please select at least one student';
    }

    if (formState.recipientType === 'group' && !formState.selectedGroup) {
      newErrors.recipients = 'Please select a recipient group';
    }

    // Validate subject
    if (!formState.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // Validate message
    if (!formState.message.trim()) {
      newErrors.message = 'Message content is required';
    }

    // Validate delivery channels
    if (formState.deliveryChannels.length === 0) {
      newErrors.deliveryChannels = 'Please select at least one delivery channel';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setError = useCallback((field: keyof EmergencyFormErrors, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  return {
    errors,
    validateForm,
    clearErrors,
    setError,
  };
}
