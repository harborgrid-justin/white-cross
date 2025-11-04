/**
 * Medication Form Types
 *
 * Type definitions for medication form state, validation, and user notifications.
 * Used for creating and editing medication prescriptions with validation support.
 *
 * @module hooks/domains/medications/types/medication-forms
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { InventoryFormData, AdverseReactionFormData } from './medication-inventory';

/**
 * Medication prescription form state for creating or editing prescriptions.
 *
 * Represents the form data structure used when prescribing new medications or
 * editing existing prescriptions. Validation should be applied before submission.
 *
 * @interface MedicationFormState
 *
 * @property {string} name - Medication name to be prescribed
 * @property {string} dosage - Prescribed dosage amount and unit
 * @property {string} frequency - How often medication should be administered
 * @property {string} studentId - ID of student receiving the prescription
 * @property {string} startDate - ISO 8601 date when prescription should begin
 * @property {string} [endDate] - ISO 8601 date when prescription should end (optional)
 * @property {string} [notes] - Additional prescription instructions or notes
 *
 * @example
 * ```typescript
 * const prescriptionForm: MedicationFormState = {
 *   name: 'Ibuprofen',
 *   dosage: '200mg',
 *   frequency: 'Every 6 hours as needed for pain',
 *   studentId: 'student-123',
 *   startDate: '2025-10-26T00:00:00Z',
 *   endDate: '2025-11-02T23:59:59Z',
 *   notes: 'Take with food to prevent stomach upset'
 * };
 * ```
 *
 * @remarks
 * - Validate all fields using validation hooks before submission
 * - Dosage must include units to prevent medication errors
 * - Frequency should be clear and unambiguous
 * - Check for drug interactions and allergies before prescribing
 *
 * @see {@link MedicationValidationErrors} for validation error structure
 */
export interface MedicationFormState {
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

/**
 * Validation errors for medication form fields.
 *
 * Maps form field names to their validation error messages. Used to display
 * user-friendly validation feedback when prescription form validation fails.
 *
 * @interface MedicationValidationErrors
 *
 * @property {string} [name] - Error message for medication name field
 * @property {string} [dosage] - Error message for dosage field
 * @property {string} [frequency] - Error message for frequency field
 * @property {string} [studentId] - Error message for student selection
 * @property {string} [startDate] - Error message for start date field
 * @property {string} [endDate] - Error message for end date field
 *
 * @example
 * ```typescript
 * const errors: MedicationValidationErrors = {
 *   name: 'Medication name is required',
 *   dosage: 'Dosage must include units (e.g., 500mg, 2 tablets)',
 *   frequency: 'Frequency is required'
 * };
 *
 * // Display errors in UI
 * Object.entries(errors).forEach(([field, message]) => {
 *   showFieldError(field, message);
 * });
 * ```
 *
 * @remarks
 * - Undefined properties indicate valid fields
 * - All error messages should be user-friendly and actionable
 * - Validation should be performed both client-side and server-side
 *
 * @see {@link MedicationFormState} for the form data structure
 */
export interface MedicationValidationErrors {
  name?: string;
  dosage?: string;
  frequency?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Generic form validation errors mapping field names to error messages.
 *
 * Flexible error structure that maps any form field name to its validation error message.
 * Used across different medication-related forms for consistent error handling.
 *
 * @interface FormErrors
 *
 * @property {string} [key] - Field name mapped to its error message
 *
 * @example
 * ```typescript
 * const errors: FormErrors = {
 *   'medicationName': 'Name is required',
 *   'dosage': 'Invalid dosage format',
 *   'expirationDate': 'Must be a future date'
 * };
 *
 * // Check if form has errors
 * const hasErrors = Object.keys(errors).length > 0;
 *
 * // Display all errors
 * Object.entries(errors).forEach(([field, message]) => {
 *   console.log(`${field}: ${message}`);
 * });
 * ```
 *
 * @remarks
 * - Empty object `{}` indicates no validation errors
 * - Use this interface for any medication-related form validation
 * - All error messages should be user-friendly and actionable
 *
 * @see {@link MedicationValidationErrors} for specific medication form errors
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * Return type interface for medication form validation hook.
 *
 * Provides comprehensive validation functions for all medication-related forms
 * including prescriptions, inventory, and adverse reaction reporting.
 *
 * @interface UseFormValidationReturn
 *
 * @property {FormErrors} errors - Current validation errors map
 * @property {Function} validateMedicationForm - Validates medication prescription form
 * @property {Function} validateAdverseReactionForm - Validates adverse reaction report form
 * @property {Function} validateInventoryForm - Validates inventory management form
 * @property {Function} clearErrors - Clears all validation errors
 * @property {Function} setFieldError - Sets error for specific field
 * @property {Function} displayValidationErrors - Displays errors in DOM elements
 *
 * @example
 * ```typescript
 * const {
 *   errors,
 *   validateMedicationForm,
 *   clearErrors
 * } = useMedicationFormValidation();
 *
 * const handleSubmit = (formData: MedicationFormData) => {
 *   const validationErrors = validateMedicationForm(formData);
 *   if (Object.keys(validationErrors).length > 0) {
 *     // Show errors to user
 *     return;
 *   }
 *   // Submit form
 * };
 * ```
 *
 * @remarks
 * - Validation is client-side only; server-side validation still required
 * - All validation functions return FormErrors object
 * - Empty FormErrors object indicates valid form
 */
export interface UseFormValidationReturn {
  errors: FormErrors;
  validateMedicationForm: (data: any) => FormErrors;
  validateAdverseReactionForm: (data: AdverseReactionFormData) => FormErrors;
  validateInventoryForm: (data: InventoryFormData) => FormErrors;
  clearErrors: () => void;
  setFieldError: (field: string, error: string) => void;
  displayValidationErrors: (validationErrors: FormErrors, prefix?: string) => void;
}

/**
 * Return type interface for medication toast notification hook.
 *
 * Provides standardized notification methods for medication operations including
 * success confirmations, error alerts, warnings, and informational messages.
 *
 * @interface UseToastReturn
 *
 * @property {Function} showSuccess - Display success notification (green toast)
 * @property {Function} showError - Display error notification (red toast)
 * @property {Function} showWarning - Display warning notification (yellow toast)
 * @property {Function} showInfo - Display informational notification (blue toast)
 *
 * @example
 * ```typescript
 * const toast = useMedicationToast();
 *
 * // Success notification
 * toast.showSuccess('Medication administered successfully');
 *
 * // Error notification
 * toast.showError('Failed to save medication - please try again');
 *
 * // Warning notification
 * toast.showWarning('Medication expiring in 7 days');
 *
 * // Info notification
 * toast.showInfo('Reminder: Complete administration documentation');
 * ```
 *
 * @remarks
 * - Use success for completed operations
 * - Use error for failed operations that require user action
 * - Use warning for important notices that don't block operations
 * - Use info for general status updates
 * - Toast notifications are non-blocking UI elements
 */
export interface UseToastReturn {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}
