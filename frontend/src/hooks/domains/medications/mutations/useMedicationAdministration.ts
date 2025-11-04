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

// Re-export all types and functions from the modularized implementation
export type {
  AdministrationData,
  ValidationResult,
  UseMedicationAdministrationReturn,
} from './useMedicationAdministration';

export {
  useMedicationAdministration,
  validateAdministration,
  administrationSchema,
} from './useMedicationAdministration';
