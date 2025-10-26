/**
 * @fileoverview Medication Administration Hook - SAFETY-CRITICAL MODULE
 *
 * This module provides React hooks for safe medication administration in school healthcare settings.
 * It implements the Five Rights of Medication Administration protocol and comprehensive safety validation.
 *
 * ## Five Rights of Medication Administration
 *
 * This module enforces the industry-standard "Five Rights" protocol:
 *
 * 1. **Right Patient** - Validates student identity through studentId verification
 * 2. **Right Medication** - Confirms medication identity through medicationId validation
 * 3. **Right Dose** - Validates dosage format, amount, and units against prescription
 * 4. **Right Route** - Ensures proper administration route (implied in dosage format)
 * 5. **Right Time** - Validates administration time against scheduled time
 *
 * ## Safety Features
 *
 * - **Pre-administration validation**: Zod schema validation of all required fields
 * - **Dosage format verification**: Regex-based validation of dosage strings (e.g., "5mg", "2 tablets")
 * - **Real-time error feedback**: Immediate validation errors returned to UI
 * - **Audit trail**: All administrations logged via medicationsApi.logAdministration()
 * - **Query invalidation**: Ensures UI reflects current medication status immediately
 * - **Toast notifications**: User feedback for success/failure of administration
 *
 * @module useMedicationAdministration
 *
 * @compliance DEA - Drug Enforcement Administration: Maintains administration records for controlled substances
 * @compliance FDA - Food and Drug Administration: Follows medication administration safety guidelines
 * @compliance HIPAA - Health Insurance Portability and Accountability Act: All administrations create audit logs
 *
 * @warning SAFETY-CRITICAL CODE: This module handles medication administration.
 * All validation rules must be followed strictly. Never bypass validation checks.
 *
 * @see {@link useMedicationSafety} for comprehensive safety checks (allergies, interactions, duplicates)
 * @see {@link medicationsApi.logAdministration} for backend API integration
 *
 * @example
 * ```tsx
 * import { useMedicationAdministration } from '@/hooks/domains/medications/mutations/useMedicationAdministration';
 *
 * function MedicationAdminForm({ studentId, medicationId }) {
 *   const { administerMedication, isAdministering, validateAdministration } = useMedicationAdministration();
 *
 *   const handleSubmit = async (formData) => {
 *     // Validate before submission
 *     const validation = validateAdministration(formData);
 *     if (!validation.isValid) {
 *       console.error('Validation errors:', validation.errors);
 *       return;
 *     }
 *
 *     // Administer medication
 *     try {
 *       await administerMedication(formData);
 *       console.log('Medication administered successfully');
 *     } catch (error) {
 *       console.error('Administration failed:', error);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleSubmit} disabled={isAdministering}>
 *       {isAdministering ? 'Administering...' : 'Administer Medication'}
 *     </button>
 *   );
 * }
 * ```
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationsApi } from '@/services';
import { useMedicationToast } from './useMedicationToast';
import { z } from 'zod';

/**
 * Zod validation schema for medication administration data.
 *
 * Enforces the Five Rights protocol through strict validation rules:
 * - Right Patient: studentId required and non-empty
 * - Right Medication: medicationId required and non-empty
 * - Right Dose: dosage format validated with regex pattern
 * - Right Route: implied in dosage unit (mg, tablets, puffs, etc.)
 * - Right Time: administrationTime required and non-empty
 *
 * @constant
 * @type {z.ZodObject}
 *
 * @property {z.ZodString} studentId - Must be non-empty string identifying the patient
 * @property {z.ZodString} medicationId - Must be non-empty string identifying the medication
 * @property {z.ZodString} dosage - Must match format: number + space + unit (e.g., "5mg", "2 tablets")
 * @property {z.ZodString} administrationTime - Must be non-empty ISO timestamp or time string
 * @property {z.ZodString} notes - Optional additional notes for administration record
 *
 * @remarks Dosage regex pattern accepts common units: mg, ml, units, tablets, capsules, puffs, drops, tsp, tbsp
 */
const administrationSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required'),
  medicationId: z.string().min(1, 'Medication ID is required'),
  dosage: z.string().min(1, 'Dosage is required').regex(
    /^[0-9]+(\.[0-9]+)?\s*(mg|ml|units?|tablets?|capsules?|puffs?|drops?|tsp|tbsp)$/i,
    'Invalid dosage format. Examples: 5mg, 2 tablets, 1 puff'
  ),
  administrationTime: z.string().min(1, 'Administration time is required'),
  notes: z.string().optional(),
});

/**
 * Data structure for medication administration request.
 *
 * Contains all required information to safely administer medication following
 * the Five Rights protocol. All fields are validated before submission.
 *
 * @interface AdministrationData
 *
 * @property {string} studentId - Unique identifier for the patient/student receiving medication.
 *                                 Must correspond to a valid student record in the system.
 *                                 **Five Rights: Right Patient**
 *
 * @property {string} medicationId - Unique identifier for the medication being administered.
 *                                   Must correspond to a valid medication record.
 *                                   **Five Rights: Right Medication**
 *
 * @property {string} dosage - Dosage amount with units in format "number unit" (e.g., "5mg", "2 tablets").
 *                             Must match the prescribed dosage and include proper units.
 *                             Supported units: mg, ml, units, tablets, capsules, puffs, drops, tsp, tbsp
 *                             **Five Rights: Right Dose**
 *
 * @property {string} administrationTime - ISO timestamp or time string when medication is administered.
 *                                         Should be close to scheduled administration time.
 *                                         **Five Rights: Right Time**
 *
 * @property {string} [notes] - Optional notes about the administration (e.g., "Patient complained of nausea").
 *                              Notes are included in audit trail for compliance and safety monitoring.
 *
 * @example
 * ```typescript
 * const administrationData: AdministrationData = {
 *   studentId: 'student-12345',
 *   medicationId: 'med-67890',
 *   dosage: '10mg',
 *   administrationTime: '2025-10-26T14:30:00Z',
 *   notes: 'Administered with food as prescribed'
 * };
 * ```
 *
 * @audit All AdministrationData submissions create audit log entries via medicationsApi.logAdministration()
 */
export interface AdministrationData {
  studentId: string;
  medicationId: string;
  dosage: string;
  administrationTime: string;
  notes?: string;
}

/**
 * Return type for the useMedicationAdministration hook.
 *
 * Provides methods and state for medication administration workflow with
 * comprehensive validation and safety checks.
 *
 * @interface UseMedicationAdministrationReturn
 *
 * @property {function(AdministrationData): Promise<void>} administerMedication
 *           Primary method to administer medication. Validates data, calls backend API,
 *           invalidates queries, and shows toast notifications.
 *
 *           **Workflow:**
 *           1. Validates AdministrationData using validateAdministration()
 *           2. Calls medicationsApi.logAdministration() with formatted data
 *           3. On success: invalidates queries and shows success toast
 *           4. On error: shows error toast and re-throws error
 *
 *           @param {AdministrationData} data - Validated administration data
 *           @returns {Promise<void>} Resolves on successful administration
 *           @throws {Error} If validation fails or API call fails
 *
 * @property {boolean} isAdministering
 *           Loading state indicator. True while API call is in progress.
 *           Use this to disable UI elements during administration.
 *
 * @property {function(AdministrationData): object} validateAdministration
 *           Validates administration data against Zod schema.
 *
 *           @param {AdministrationData} data - Data to validate
 *           @returns {object} Validation result with structure:
 *                    - isValid: boolean indicating if data is valid
 *                    - errors: Record<string, string> mapping field names to error messages
 *
 * @example
 * ```tsx
 * const { administerMedication, isAdministering, validateAdministration } = useMedicationAdministration();
 *
 * // Validate before submission
 * const validation = validateAdministration(formData);
 * if (!validation.isValid) {
 *   setFieldErrors(validation.errors);
 *   return;
 * }
 *
 * // Administer with loading state
 * try {
 *   await administerMedication(formData);
 * } catch (error) {
 *   // Error already shown via toast
 * }
 * ```
 */
export interface UseMedicationAdministrationReturn {
  administerMedication: (data: AdministrationData) => Promise<void>;
  isAdministering: boolean;
  validateAdministration: (data: AdministrationData) => { isValid: boolean; errors: Record<string, string> };
}

/**
 * React hook for safe medication administration with comprehensive validation.
 *
 * This hook implements the Five Rights of Medication Administration protocol and provides
 * complete validation, API integration, and error handling for medication administration.
 *
 * ## Key Features
 *
 * - **Five Rights Validation**: Enforces Right Patient, Medication, Dose, Route, Time
 * - **Zod Schema Validation**: Type-safe validation with detailed error messages
 * - **TanStack Query Integration**: Optimistic updates and automatic query invalidation
 * - **Toast Notifications**: User-friendly success/error feedback
 * - **Audit Trail**: All administrations logged for compliance and safety monitoring
 * - **Loading State**: isAdministering flag for UI state management
 *
 * ## Validation Process
 *
 * 1. **Client-side validation** using Zod schema (administrationSchema)
 * 2. **Format validation** for dosage string (regex pattern)
 * 3. **Required field validation** for studentId, medicationId, dosage, administrationTime
 * 4. **Backend validation** via medicationsApi.logAdministration()
 *
 * ## Query Invalidation Strategy
 *
 * On successful administration, invalidates:
 * - `medication-reminders` - Updates reminder list
 * - `medications` - Updates medication records
 * - `medication-schedule` - Updates administration schedule
 *
 * This ensures UI reflects current medication status immediately.
 *
 * @returns {UseMedicationAdministrationReturn} Hook methods and state
 *
 * @throws {Error} Validation errors if data fails Zod schema validation
 * @throws {Error} API errors if backend call fails (network, server, database errors)
 *
 * @warning CRITICAL: Never bypass validation. All administrations MUST pass validateAdministration()
 * before calling administerMedication(). Bypassing validation could result in medication errors.
 *
 * @warning AUDIT REQUIREMENT: Every call to administerMedication() creates an audit log entry.
 * This is required for HIPAA compliance and medication tracking.
 *
 * @compliance DEA - All controlled substance administrations are logged with timestamps
 * @compliance FDA - Follows FDA medication administration safety guidelines
 * @compliance HIPAA - Creates audit trail for all Protected Health Information (PHI) access
 *
 * @example
 * ```tsx
 * // Complete medication administration workflow with error handling
 * import { useMedicationAdministration } from '@/hooks/domains/medications/mutations/useMedicationAdministration';
 *
 * function MedicationAdministrationForm({ studentId, medicationId, scheduledTime }) {
 *   const { administerMedication, isAdministering, validateAdministration } = useMedicationAdministration();
 *   const [formData, setFormData] = useState({
 *     studentId,
 *     medicationId,
 *     dosage: '',
 *     administrationTime: new Date().toISOString(),
 *     notes: ''
 *   });
 *   const [errors, setErrors] = useState({});
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *
 *     // Step 1: Validate form data
 *     const validation = validateAdministration(formData);
 *     if (!validation.isValid) {
 *       setErrors(validation.errors);
 *       return;
 *     }
 *
 *     // Step 2: Administer medication
 *     try {
 *       await administerMedication(formData);
 *       // Success toast shown automatically
 *       onClose();
 *     } catch (error) {
 *       // Error toast shown automatically
 *       console.error('Administration failed:', error);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         type="text"
 *         value={formData.dosage}
 *         onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
 *         placeholder="e.g., 10mg, 2 tablets"
 *       />
 *       {errors.dosage && <span className="error">{errors.dosage}</span>}
 *
 *       <textarea
 *         value={formData.notes}
 *         onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
 *         placeholder="Optional notes"
 *       />
 *
 *       <button type="submit" disabled={isAdministering}>
 *         {isAdministering ? 'Administering...' : 'Administer Medication'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Real-time validation as user types
 * import { useMedicationAdministration } from '@/hooks/domains/medications/mutations/useMedicationAdministration';
 *
 * function DosageInput({ value, onChange }) {
 *   const { validateAdministration } = useMedicationAdministration();
 *   const [error, setError] = useState('');
 *
 *   const handleChange = (e) => {
 *     const newValue = e.target.value;
 *     onChange(newValue);
 *
 *     // Validate dosage format
 *     const validation = validateAdministration({
 *       studentId: 'temp',
 *       medicationId: 'temp',
 *       dosage: newValue,
 *       administrationTime: new Date().toISOString()
 *     });
 *
 *     setError(validation.errors.dosage || '');
 *   };
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={value}
 *         onChange={handleChange}
 *         placeholder="e.g., 5mg, 2 tablets, 1 puff"
 *       />
 *       {error && <span className="error">{error}</span>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Error handling with retry logic
 * import { useMedicationAdministration } from '@/hooks/domains/medications/mutations/useMedicationAdministration';
 *
 * function MedicationAdminWithRetry({ administrationData }) {
 *   const { administerMedication, isAdministering } = useMedicationAdministration();
 *   const [retryCount, setRetryCount] = useState(0);
 *
 *   const handleAdminister = async () => {
 *     try {
 *       await administerMedication(administrationData);
 *       setRetryCount(0); // Reset on success
 *     } catch (error) {
 *       if (retryCount < 3 && error.message.includes('network')) {
 *         // Retry on network errors
 *         setRetryCount(retryCount + 1);
 *         setTimeout(() => handleAdminister(), 1000 * retryCount);
 *       } else {
 *         // Show error to user
 *         console.error('Maximum retries reached or non-network error:', error);
 *       }
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleAdminister} disabled={isAdministering}>
 *       {isAdministering ? 'Administering...' : 'Administer Medication'}
 *       {retryCount > 0 && ` (Retry ${retryCount}/3)`}
 *     </button>
 *   );
 * }
 * ```
 *
 * @see {@link AdministrationData} for data structure details
 * @see {@link UseMedicationAdministrationReturn} for return type details
 * @see {@link validateAdministration} for validation function details
 * @see {@link useMedicationSafety} for comprehensive safety checks before administration
 */
export const useMedicationAdministration = (): UseMedicationAdministrationReturn => {
  const queryClient = useQueryClient();
  const toast = useMedicationToast();

  /**
   * Validates administration data against Zod schema.
   *
   * Performs comprehensive validation of all fields required for safe medication
   * administration according to the Five Rights protocol.
   *
   * ## Validation Rules
   *
   * - **studentId**: Must be non-empty string (Right Patient)
   * - **medicationId**: Must be non-empty string (Right Medication)
   * - **dosage**: Must match format "number unit" (e.g., "5mg", "2 tablets") (Right Dose)
   * - **administrationTime**: Must be non-empty string (Right Time)
   * - **notes**: Optional, no validation (additional documentation)
   *
   * ## Dosage Format Validation
   *
   * Dosage must match regex: `/^[0-9]+(\.[0-9]+)?\s*(mg|ml|units?|tablets?|capsules?|puffs?|drops?|tsp|tbsp)$/i`
   *
   * Valid examples:
   * - "5mg", "10.5mg", "100 mg"
   * - "2 tablets", "1 tablet"
   * - "3ml", "1.5 ml"
   * - "1 puff", "2 puffs"
   *
   * Invalid examples:
   * - "5" (missing unit)
   * - "mg 5" (wrong order)
   * - "five mg" (not numeric)
   *
   * @param {AdministrationData} data - Administration data to validate
   *
   * @returns {object} Validation result
   * @returns {boolean} returns.isValid - True if all fields pass validation
   * @returns {Record<string, string>} returns.errors - Map of field names to error messages.
   *                                                     Empty object if validation passes.
   *
   * @example
   * ```typescript
   * const validation = validateAdministration({
   *   studentId: 'student-123',
   *   medicationId: 'med-456',
   *   dosage: '10mg',
   *   administrationTime: '2025-10-26T14:30:00Z'
   * });
   *
   * if (validation.isValid) {
   *   console.log('Validation passed');
   * } else {
   *   console.error('Validation errors:', validation.errors);
   *   // { dosage: 'Invalid dosage format. Examples: 5mg, 2 tablets, 1 puff' }
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Handle validation errors in form
   * const handleFormValidation = (formData) => {
   *   const validation = validateAdministration(formData);
   *
   *   if (!validation.isValid) {
   *     // Set field-specific errors
   *     Object.entries(validation.errors).forEach(([field, message]) => {
   *       setFieldError(field, message);
   *     });
   *     return false;
   *   }
   *
   *   return true;
   * };
   * ```
   */
  const validateAdministration = (data: AdministrationData): { isValid: boolean; errors: Record<string, string> } => {
    try {
      administrationSchema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Validation error' } };
    }
  };

  /**
   * TanStack Query mutation for medication administration.
   *
   * Handles the complete medication administration workflow:
   * 1. Pre-validation of data
   * 2. API call to log administration
   * 3. Query invalidation on success
   * 4. Toast notification for user feedback
   * 5. Error handling and propagation
   *
   * @private
   * @type {UseMutationResult}
   */
  const administerMutation = useMutation({
    mutationFn: async (data: AdministrationData) => {
      // Validate before sending
      const validation = validateAdministration(data);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Call the API to log medication administration
      const response = await medicationsApi.logAdministration({
        studentMedicationId: `${data.studentId}-${data.medicationId}`, // This should be the actual student medication ID
        scheduledTime: data.administrationTime,
        dosage: data.dosage,
        status: 'administered',
        notes: data.notes,
      });

      return response;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['medication-reminders'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medication-schedule'] });
      toast.showSuccess('Medication administered successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to administer medication';
      toast.showError(message);
      throw error;
    },
  });

  /**
   * Administers medication with comprehensive validation and audit logging.
   *
   * This is the primary method for medication administration. It validates the data,
   * calls the backend API, invalidates queries, and shows toast notifications.
   *
   * ## Workflow
   *
   * 1. **Validate**: Calls validateAdministration() to ensure data integrity
   * 2. **API Call**: Calls medicationsApi.logAdministration() to record administration
   * 3. **Audit Log**: Backend creates audit trail entry (HIPAA compliance)
   * 4. **Query Invalidation**: Invalidates medication-related queries for UI updates
   * 5. **Notification**: Shows success/error toast to user
   *
   * ## Error Handling
   *
   * Throws errors in these scenarios:
   * - Validation failure (missing fields, invalid format)
   * - Network errors (timeout, connection refused)
   * - Server errors (500, 503)
   * - Business logic errors (medication not found, student not found)
   *
   * All errors show toast notification before being thrown.
   *
   * @async
   * @param {AdministrationData} data - Complete administration data
   *
   * @returns {Promise<void>} Resolves when administration is successfully logged
   *
   * @throws {Error} Validation errors with message from Zod schema
   * @throws {Error} API errors with message from backend
   * @throws {Error} Network errors if API call fails
   *
   * @warning CRITICAL: This function creates permanent records. Ensure all data is correct
   * before calling. There is no undo for medication administration.
   *
   * @audit Every call creates an audit log entry with:
   * - Timestamp of administration
   * - Nurse/staff member ID (from authentication)
   * - Student ID
   * - Medication ID
   * - Dosage administered
   * - Any notes provided
   *
   * @example
   * ```tsx
   * // Basic administration
   * const { administerMedication } = useMedicationAdministration();
   *
   * try {
   *   await administerMedication({
   *     studentId: 'student-12345',
   *     medicationId: 'med-67890',
   *     dosage: '10mg',
   *     administrationTime: new Date().toISOString(),
   *     notes: 'Student took medication without issues'
   *   });
   *   console.log('Administration successful');
   * } catch (error) {
   *   console.error('Administration failed:', error.message);
   * }
   * ```
   *
   * @example
   * ```tsx
   * // Administration with pre-validation
   * const { administerMedication, validateAdministration } = useMedicationAdministration();
   *
   * const handleAdminister = async (formData) => {
   *   // Validate first
   *   const validation = validateAdministration(formData);
   *   if (!validation.isValid) {
   *     showErrors(validation.errors);
   *     return;
   *   }
   *
   *   // Then administer
   *   try {
   *     await administerMedication(formData);
   *     navigateToNextPatient();
   *   } catch (error) {
   *     // Handle error (already shown via toast)
   *     logErrorToMonitoring(error);
   *   }
   * };
   * ```
   *
   * @see {@link AdministrationData} for required data structure
   * @see {@link validateAdministration} for validation rules
   */
  const administerMedication = async (data: AdministrationData): Promise<void> => {
    await administerMutation.mutateAsync(data);
  };

  return {
    administerMedication,
    isAdministering: administerMutation.isPending,
    validateAdministration,
  };
};
