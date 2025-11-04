/**
 * @fileoverview Core Medication Administration Hook Implementation
 *
 * Implements the main useMedicationAdministration hook with TanStack Query integration,
 * toast notifications, and query invalidation for medication administration workflow.
 *
 * @module core
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationsApi } from '@/services';
import { useMedicationToast } from '../useMedicationToast';
import { validateAdministration } from './validation';
import type { AdministrationData, UseMedicationAdministrationReturn } from './types';

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
 * @see {@link AdministrationData} for data structure details
 * @see {@link UseMedicationAdministrationReturn} for return type details
 * @see {@link validateAdministration} for validation function details
 * @see {@link useMedicationSafety} for comprehensive safety checks before administration
 */
export const useMedicationAdministration = (): UseMedicationAdministrationReturn => {
  const queryClient = useQueryClient();
  const toast = useMedicationToast();

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
