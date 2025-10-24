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

  /**
   * Validates medication master data form.
   *
   * Validates drug information including name, dosage form, strength, and related fields.
   * Ensures data quality for medication database entries.
   *
   * @param {MedicationFormData} data - Medication form data to validate
   * @returns {FormErrors} Object mapping field names to error messages (empty if valid)
   *
   * @validates
   * - Required: name, dosageForm, strength
   * - Length: name ≤ 100, genericName ≤ 100, manufacturer ≤ 100
   * - Format: strength must include valid unit (mg, g, ml, mcg, units, iu, %)
   *
   * @example
   * ```ts
   * const errors = validateMedicationForm({
   *   name: 'Amoxicillin',
   *   dosageForm: 'Capsule',
   *   strength: '500mg', // Valid format
   *   genericName: 'Amoxicillin',
   *   manufacturer: 'Generic Pharma'
   * });
   * // errors = {} (no errors)
   *
   * const invalidErrors = validateMedicationForm({
   *   name: '',
   *   dosageForm: 'Tablet',
   *   strength: '500' // Missing unit - INVALID
   * });
   * // invalidErrors = { name: 'Medication name is required', strength: '...' }
   * ```
   *
   * @safety Strength validation ensures dosage units are always specified,
   * preventing ambiguous medication orders.
   */
  const validateMedicationForm = (data: MedicationFormData): FormErrors => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!data.name?.trim()) {
      newErrors.name = 'Medication name is required'
    }

    if (!data.dosageForm?.trim()) {
      newErrors.dosageForm = 'Dosage form is required'
    }

    if (!data.strength?.trim()) {
      newErrors.strength = 'Strength is required'
    }

    // Length validations
    if (data.name && data.name.length > 100) {
      newErrors.name = 'Medication name must be less than 100 characters'
    }

    if (data.genericName && data.genericName.length > 100) {
      newErrors.genericName = 'Generic name must be less than 100 characters'
    }

    if (data.manufacturer && data.manufacturer.length > 100) {
      newErrors.manufacturer = 'Manufacturer name must be less than 100 characters'
    }

    // Format validations
    if (data.strength && !/^[\d.]+\s*(mg|g|ml|mcg|units?|iu|%)$/i.test(data.strength.trim())) {
      newErrors.strength = 'Strength must include a valid unit (e.g., 500mg, 10ml, 1g)'
    }

    setErrors(newErrors)
    return newErrors
  }

  /**
   * Validates adverse reaction reporting form.
   *
   * Validates safety reporting data for documenting medication adverse reactions.
   * Ensures comprehensive documentation of patient safety incidents.
   *
   * @param {AdverseReactionFormData} data - Adverse reaction form data to validate
   * @returns {FormErrors} Object mapping field names to error messages (empty if valid)
   *
   * @validates
   * - Required: studentId, medicationId, severity, description, actionsTaken, occurredAt
   * - Length: description (10-1000 chars), actionsTaken (5-500 chars)
   * - Date: occurredAt must be valid date, not in future
   *
   * @safety This validation ensures complete documentation of adverse reactions,
   * which is critical for patient safety, regulatory compliance, and pharmacovigilance.
   *
   * @example
   * ```ts
   * const errors = validateAdverseReactionForm({
   *   studentId: 'student-123',
   *   medicationId: 'med-456',
   *   severity: 'moderate',
   *   description: 'Patient developed urticarial rash on torso and arms within 2 hours',
   *   actionsTaken: 'Medication discontinued immediately, antihistamine administered',
   *   occurredAt: '2025-10-24T14:30:00Z'
   * });
   * // errors = {} (valid)
   *
   * const invalidErrors = validateAdverseReactionForm({
   *   studentId: 'student-123',
   *   medicationId: 'med-456',
   *   severity: 'moderate',
   *   description: 'Rash', // Too short - INVALID
   *   actionsTaken: 'Stop', // Too short - INVALID
   *   occurredAt: '2026-01-01T00:00:00Z' // Future date - INVALID
   * });
   * ```
   *
   * @remarks Minimum lengths ensure sufficient detail for clinical review and
   * regulatory reporting requirements.
   */
  const validateAdverseReactionForm = (data: AdverseReactionFormData): FormErrors => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!data.studentId?.trim()) {
      newErrors.studentId = 'Student selection is required'
    }

    if (!data.medicationId?.trim()) {
      newErrors.medicationId = 'Medication selection is required'
    }

    if (!data.severity) {
      newErrors.severity = 'Severity level is required'
    }

    if (!data.description?.trim()) {
      newErrors.description = 'Reaction description is required'
    }

    if (!data.actionsTaken?.trim()) {
      newErrors.actionsTaken = 'Actions taken is required'
    }

    if (!data.occurredAt?.trim()) {
      newErrors.occurredAt = 'Occurrence date/time is required'
    }

    // Length validations
    if (data.description && data.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (data.description && data.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    if (data.actionsTaken && data.actionsTaken.length < 5) {
      newErrors.actionsTaken = 'Actions taken must be at least 5 characters'
    }

    if (data.actionsTaken && data.actionsTaken.length > 500) {
      newErrors.actionsTaken = 'Actions taken must be less than 500 characters'
    }

    // Date validation
    if (data.occurredAt) {
      const occurredDate = new Date(data.occurredAt)
      const now = new Date()

      if (isNaN(occurredDate.getTime())) {
        newErrors.occurredAt = 'Invalid date format'
      } else if (occurredDate > now) {
        newErrors.occurredAt = 'Occurrence date cannot be in the future'
      }
    }

    setErrors(newErrors)
    return newErrors
  }

  /**
   * Validates medication inventory form.
   *
   * Validates inventory management data including quantities, batch tracking,
   * expiration dates, and reorder levels. Ensures accurate medication stock tracking.
   *
   * @param {InventoryFormData} data - Inventory form data to validate
   * @returns {FormErrors} Object mapping field names to error messages (empty if valid)
   *
   * @validates
   * - Required: medicationId, batchNumber, quantity, reorderLevel, expirationDate
   * - Numeric: quantity (0-99,999), reorderLevel (0-999)
   * - Logical: reorderLevel ≤ quantity
   * - Date: expirationDate must be valid and in future
   * - Length: batchNumber ≤ 50, supplier ≤ 100
   *
   * @safety This validation helps prevent:
   * - Stock shortages (via reorder level validation)
   * - Dispensing expired medications (via expiration date validation)
   * - Inventory tracking errors (via batch number validation)
   *
   * @example
   * ```ts
   * const errors = validateInventoryForm({
   *   medicationId: 'med-789',
   *   batchNumber: 'BATCH-2025-001',
   *   quantity: 500,
   *   reorderLevel: 100,
   *   expirationDate: '2026-12-31',
   *   supplier: 'Generic Pharma Distributors'
   * });
   * // errors = {} (valid)
   *
   * const invalidErrors = validateInventoryForm({
   *   medicationId: 'med-789',
   *   batchNumber: 'BATCH-2025-001',
   *   quantity: 50,
   *   reorderLevel: 100, // Greater than quantity - INVALID
   *   expirationDate: '2024-01-01' // Past date - INVALID
   * });
   * ```
   *
   * @remarks Reorder level validation prevents illogical inventory configurations
   * that could lead to unnecessary reorder alerts.
   */
  const validateInventoryForm = (data: InventoryFormData): FormErrors => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!data.medicationId?.trim()) {
      newErrors.medicationId = 'Medication selection is required'
    }

    if (!data.batchNumber?.trim()) {
      newErrors.batchNumber = 'Batch number is required'
    }

    if (data.quantity === undefined || data.quantity === null) {
      newErrors.quantity = 'Quantity is required'
    }

    if (data.reorderLevel === undefined || data.reorderLevel === null) {
      newErrors.reorderLevel = 'Reorder level is required'
    }

    if (!data.expirationDate?.trim()) {
      newErrors.expirationDate = 'Expiration date is required'
    }

    // Numeric validations
    if (data.quantity !== undefined && data.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative'
    }

    if (data.quantity !== undefined && data.quantity > 99999) {
      newErrors.quantity = 'Quantity cannot exceed 99,999'
    }

    if (data.reorderLevel !== undefined && data.reorderLevel < 0) {
      newErrors.reorderLevel = 'Reorder level cannot be negative'
    }

    if (data.reorderLevel !== undefined && data.reorderLevel > 999) {
      newErrors.reorderLevel = 'Reorder level cannot exceed 999'
    }

    if (data.quantity !== undefined && data.reorderLevel !== undefined && data.reorderLevel > data.quantity) {
      newErrors.reorderLevel = 'Reorder level cannot be greater than current quantity'
    }

    // Date validations
    if (data.expirationDate) {
      const expirationDate = new Date(data.expirationDate)
      const now = new Date()
      
      if (isNaN(expirationDate.getTime())) {
        newErrors.expirationDate = 'Invalid date format'
      } else if (expirationDate <= now) {
        newErrors.expirationDate = 'Expiration date must be in the future'
      }
    }

    // Format validations
    if (data.batchNumber && data.batchNumber.length > 50) {
      newErrors.batchNumber = 'Batch number must be less than 50 characters'
    }

    if (data.supplier && data.supplier.length > 100) {
      newErrors.supplier = 'Supplier name must be less than 100 characters'
    }

    setErrors(newErrors)
    return newErrors
  }

  /**
   * Clears all validation errors.
   *
   * Resets error state to empty object. Useful when clearing form or
   * starting new validation cycle.
   *
   * @example
   * ```tsx
   * const { clearErrors } = useMedicationFormValidation();
   *
   * const handleReset = () => {
   *   clearErrors();
   *   resetForm();
   * };
   * ```
   */
  const clearErrors = () => {
    setErrors({})
  }

  /**
   * Sets error message for a specific field.
   *
   * Allows programmatic error setting, useful for server-side validation errors
   * or custom validation logic.
   *
   * @param {string} field - Field name to set error for
   * @param {string} error - Error message to display
   *
   * @example
   * ```tsx
   * const { setFieldError } = useMedicationFormValidation();
   *
   * // Set custom error from server response
   * if (serverError.code === 'DUPLICATE_NDC') {
   *   setFieldError('ndc', 'This NDC is already registered in the system');
   * }
   * ```
   */
  const setFieldError = (field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  /**
   * Displays validation errors in DOM elements.
   *
   * Automatically finds and updates DOM elements with matching data-testid attributes.
   * Shows errors by removing 'hidden' class and setting textContent.
   * Hides errors no longer present by adding 'hidden' class.
   *
   * @param {FormErrors} validationErrors - Errors to display
   * @param {string} [prefix=''] - Prefix for data-testid attributes (e.g., 'medication-')
   *
   * @remarks This function directly manipulates the DOM. It expects elements with
   * data-testid attributes in format: `${prefix}${fieldName}-error`
   *
   * @example
   * ```tsx
   * const { displayValidationErrors, validateMedicationForm } = useMedicationFormValidation();
   *
   * const handleValidate = (data: MedicationFormData) => {
   *   const errors = validateMedicationForm(data);
   *   displayValidationErrors(errors, 'medication-');
   * };
   *
   * // In JSX, error elements should have:
   * // <span data-testid="medication-name-error" className="hidden text-red-500"></span>
   * ```
   */
  const displayValidationErrors = (validationErrors: FormErrors, prefix = '') => {
    // Display errors in DOM elements with data-testid attributes
    Object.keys(validationErrors).forEach(key => {
      const errorElement = document.querySelector(`[data-testid="${prefix}${key}-error"]`)
      if (errorElement) {
        errorElement.classList.remove('hidden')
        errorElement.textContent = validationErrors[key]
      }
    })

    // Hide errors that are no longer present
    const currentErrorKeys = Object.keys(validationErrors)
    const allErrorElements = document.querySelectorAll(`[data-testid*="${prefix}"][data-testid*="-error"]`)
    
    allErrorElements.forEach(element => {
      const testId = element.getAttribute('data-testid') || ''
      const fieldKey = testId.replace(prefix, '').replace('-error', '')
      
      if (!currentErrorKeys.includes(fieldKey)) {
        element.classList.add('hidden')
        element.textContent = ''
      }
    })
  }

  return {
    errors,
    validateMedicationForm,
    validateAdverseReactionForm,
    validateInventoryForm,
    clearErrors,
    setFieldError,
    displayValidationErrors
  }
}