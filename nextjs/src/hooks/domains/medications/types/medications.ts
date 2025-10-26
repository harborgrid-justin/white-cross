/**
 * Medication Domain Types
 *
 * Core type definitions for medication management including prescriptions,
 * administration records, and form validation. These types support the Five Rights
 * of Medication Administration and HIPAA-compliant medication tracking.
 *
 * @module hooks/domains/medications/types/medications
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Medication prescription interface representing a prescribed medication for a student.
 *
 * Contains complete prescription information including dosage instructions, schedule,
 * and status tracking. This interface represents a student's active or historical
 * medication prescription.
 *
 * @interface Medication
 *
 * @property {string} id - Unique identifier for the medication prescription
 * @property {string} name - Medication name (brand or generic)
 * @property {string} dosage - Prescribed dosage with unit (e.g., "500mg", "2 tablets")
 * @property {string} frequency - Administration frequency (e.g., "twice daily", "every 6 hours")
 * @property {string} studentId - Unique identifier of the student prescribed this medication
 * @property {string} startDate - ISO 8601 date string when prescription starts
 * @property {string} [endDate] - ISO 8601 date string when prescription ends (optional for ongoing)
 * @property {'active' | 'paused' | 'completed'} status - Current prescription status
 * @property {string} [notes] - Additional prescription notes or special instructions
 * @property {string} createdAt - ISO 8601 timestamp when prescription was created
 * @property {string} updatedAt - ISO 8601 timestamp of last prescription update
 *
 * @example
 * ```typescript
 * const medication: Medication = {
 *   id: 'rx-12345',
 *   name: 'Amoxicillin',
 *   dosage: '500mg',
 *   frequency: 'Three times daily with meals',
 *   studentId: 'student-789',
 *   startDate: '2025-10-20T08:00:00Z',
 *   endDate: '2025-10-27T20:00:00Z',
 *   status: 'active',
 *   notes: 'Complete full course even if symptoms improve',
 *   createdAt: '2025-10-20T08:00:00Z',
 *   updatedAt: '2025-10-20T08:00:00Z'
 * };
 * ```
 *
 * @remarks
 * - This is PHI (Protected Health Information) and must be handled according to HIPAA
 * - Status changes should be audited with timestamps and user identification
 * - Dosage should include units to prevent medication errors
 *
 * @see {@link MedicationAdministration} for administration records
 * @see {@link MedicationFormState} for prescription form data
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Medication administration record documenting a single medication dose administered.
 *
 * Represents one instance of medication administration following the Five Rights protocol.
 * Each record serves as legal documentation and is immutable once created.
 *
 * @interface MedicationAdministration
 *
 * @property {string} id - Unique identifier for this administration event
 * @property {string} medicationId - ID of the medication that was administered
 * @property {string} studentId - ID of the student who received the medication
 * @property {string} administeredAt - ISO 8601 timestamp of actual administration
 * @property {string} administeredBy - ID or name of healthcare staff who administered
 * @property {string} dosageGiven - Actual dosage administered (e.g., "500mg", "2 tablets")
 * @property {string} [notes] - Optional notes about administration (refusal, complications, etc.)
 *
 * @example
 * ```typescript
 * const administrationRecord: MedicationAdministration = {
 *   id: 'admin-67890',
 *   medicationId: 'rx-12345',
 *   studentId: 'student-789',
 *   administeredAt: '2025-10-26T08:15:00Z',
 *   administeredBy: 'nurse-smith-456',
 *   dosageGiven: '500mg',
 *   notes: 'Student tolerated medication well, no adverse effects observed'
 * };
 * ```
 *
 * @remarks
 * - **CRITICAL**: Administration records are immutable legal documentation
 * - Must include Five Rights verification before creation
 * - All administrations must be audited with full traceability
 * - Dosage given must match prescribed dosage (verify with Five Rights)
 * - This is PHI and subject to HIPAA protection
 *
 * @see {@link Medication} for prescription details
 * @see {@link useMedicationAdministration} for administration workflow
 */
export interface MedicationAdministration {
  id: string;
  medicationId: string;
  studentId: string;
  administeredAt: string;
  administeredBy: string;
  dosageGiven: string;
  notes?: string;
}

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
 * - Validate all fields using {@link useMedicationFormValidation} before submission
 * - Dosage must include units to prevent medication errors
 * - Frequency should be clear and unambiguous
 * - Check for drug interactions and allergies before prescribing
 *
 * @see {@link Medication} for the complete prescription interface
 * @see {@link MedicationValidationErrors} for validation error structure
 * @see {@link useMedicationFormValidation} for validation logic
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
 * @see {@link useMedicationFormValidation} for validation implementation
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
 * Inventory form data for medication stock management and tracking.
 *
 * Used when adding new medication inventory batches or updating stock levels.
 * Supports batch tracking, expiration management, and reorder level automation.
 *
 * @interface InventoryFormData
 *
 * @property {string} medicationId - ID of the medication being stocked
 * @property {string} batchNumber - Manufacturer's batch/lot number for tracking
 * @property {number} quantity - Number of units in stock (0-99,999)
 * @property {number} reorderLevel - Threshold quantity that triggers reorder alert (0-999)
 * @property {string} expirationDate - ISO 8601 date when batch expires
 * @property {string} [supplier] - Optional supplier/distributor name
 *
 * @example
 * ```typescript
 * const inventoryData: InventoryFormData = {
 *   medicationId: 'med-456',
 *   batchNumber: 'BATCH-2025-Q4-1234',
 *   quantity: 500,
 *   reorderLevel: 100,
 *   expirationDate: '2026-12-31',
 *   supplier: 'Generic Pharma Distributors Inc.'
 * };
 * ```
 *
 * @remarks
 * - **SAFETY**: Never dispense expired medications - check expiration before administration
 * - Batch numbers enable recall management and quality tracking
 * - Reorder level should account for lead time and typical usage rate
 * - Quantity must be verified during physical counts (reconciliation)
 *
 * @see {@link useMedicationFormValidation} for validation logic
 */
export interface InventoryFormData {
  medicationId: string;
  batchNumber: string;
  quantity: number;
  reorderLevel: number;
  expirationDate: string;
  supplier?: string;
}

/**
 * Adverse reaction report form data for pharmacovigilance and patient safety.
 *
 * Used when reporting medication adverse reactions, side effects, or complications.
 * These reports are critical for patient safety, regulatory compliance, and drug monitoring.
 *
 * @interface AdverseReactionFormData
 *
 * @property {string} studentId - ID of student who experienced the reaction
 * @property {string} medicationId - ID of medication that caused the reaction
 * @property {'mild' | 'moderate' | 'severe'} severity - Reaction severity level
 * @property {string} description - Detailed description of reaction (10-1000 characters)
 * @property {string} actionsTaken - Actions taken in response (5-500 characters)
 * @property {string} occurredAt - ISO 8601 timestamp when reaction occurred
 *
 * @example
 * ```typescript
 * const adverseReaction: AdverseReactionFormData = {
 *   studentId: 'student-789',
 *   medicationId: 'med-123',
 *   severity: 'moderate',
 *   description: 'Patient developed urticarial rash on torso and arms within 2 hours of administration. Rash was itchy but patient remained hemodynamically stable.',
 *   actionsTaken: 'Medication discontinued immediately. Antihistamine (diphenhydramine 25mg) administered PO. Physician notified. Parent contacted.',
 *   occurredAt: '2025-10-26T14:30:00Z'
 * };
 * ```
 *
 * @remarks
 * - **CRITICAL SAFETY**: All adverse reactions must be reported promptly
 * - Severe reactions require immediate medical attention and physician notification
 * - Reports contribute to pharmacovigilance databases (FDA FAERS)
 * - Description must be detailed enough for clinical review
 * - This is PHI and subject to HIPAA protection
 * - May trigger medication discontinuation and allergy documentation
 *
 * @see {@link useMedicationFormValidation} for validation requirements
 * @see {@link useAdverseReactionReporting} for reporting workflow
 */
export interface AdverseReactionFormData {
  studentId: string;
  medicationId: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  actionsTaken: string;
  occurredAt: string;
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
 *
 * @see {@link useMedicationFormValidation} for implementation
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
 *
 * @see {@link useMedicationToast} for implementation
 */
export interface UseToastReturn {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}
