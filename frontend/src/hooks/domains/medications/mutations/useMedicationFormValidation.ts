/**
 * Medication Form Validation Hook
 *
 * Provides comprehensive client-side validation for medication-related forms including:
 * - Medication master data forms (drug information)
 * - Adverse reaction reporting forms
 * - Inventory management forms
 *
 * Validation Features:
 * - Required field enforcement
 * - Field length constraints
 * - Format validation (dosage units, dates, etc.)
 * - Logical validation (quantity > reorder level, dates in valid ranges)
 * - Real-time error display in DOM
 *
 * @module useMedicationFormValidation
 * @safety Validation rules enforce data quality for medication safety. However,
 * this is CLIENT-SIDE validation only. Server-side validation is still REQUIRED.
 */

import { useState } from 'react'
import type {
  MedicationFormData
} from '../types/api'
import type {
  FormErrors,
  InventoryFormData,
  UseFormValidationReturn,
  AdverseReactionFormData
} from '../types/medications'
import {
  validateMedicationForm,
  validateAdverseReactionForm,
  validateInventoryForm
} from './validationRules'
import {
  createClearErrors,
  createSetFieldError,
  displayValidationErrors
} from './validationHelpers'

/**
 * Hook for validating medication-related forms.
 *
 * Provides validation functions for medication data entry, adverse reaction
 * reporting, and inventory management. All validation is performed client-side
 * for immediate user feedback.
 *
 * @returns {UseFormValidationReturn} Validation functions and error state
 *
 * @example
 * ```tsx
 * function MedicationForm({ onSubmit }) {
 *   const { validateMedicationForm, errors } = useMedicationFormValidation();
 *
 *   const handleSubmit = (data: MedicationFormData) => {
 *     const validationErrors = validateMedicationForm(data);
 *     if (Object.keys(validationErrors).length > 0) {
 *       // Show errors to user
 *       return;
 *     }
 *     onSubmit(data);
 *   };
 *
 *   return <form>...</form>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Validate adverse reaction form
 * const { validateAdverseReactionForm } = useMedicationFormValidation();
 *
 * const errors = validateAdverseReactionForm({
 *   studentId: 'student-123',
 *   medicationId: 'med-456',
 *   severity: 'moderate',
 *   description: 'Patient developed rash on arms and torso',
 *   actionsTaken: 'Medication discontinued, physician notified',
 *   occurredAt: '2025-10-24T14:30:00Z'
 * });
 * ```
 */
export const useMedicationFormValidation = (): UseFormValidationReturn => {
  const [errors, setErrors] = useState<FormErrors>({})

  // Wrap validation functions to update state
  const validateMedicationFormWithState = (data: MedicationFormData): FormErrors => {
    const newErrors = validateMedicationForm(data)
    setErrors(newErrors)
    return newErrors
  }

  const validateAdverseReactionFormWithState = (data: AdverseReactionFormData): FormErrors => {
    const newErrors = validateAdverseReactionForm(data)
    setErrors(newErrors)
    return newErrors
  }

  const validateInventoryFormWithState = (data: InventoryFormData): FormErrors => {
    const newErrors = validateInventoryForm(data)
    setErrors(newErrors)
    return newErrors
  }

  return {
    errors,
    validateMedicationForm: validateMedicationFormWithState,
    validateAdverseReactionForm: validateAdverseReactionFormWithState,
    validateInventoryForm: validateInventoryFormWithState,
    clearErrors: createClearErrors(setErrors),
    setFieldError: createSetFieldError(setErrors),
    displayValidationErrors
  }
}

// Re-export validation functions for direct use
export {
  validateMedicationForm,
  validateAdverseReactionForm,
  validateInventoryForm
} from './validationRules'

// Re-export helper functions
export {
  displayValidationErrors
} from './validationHelpers'
