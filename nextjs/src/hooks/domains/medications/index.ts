/**
 * Medications Domain - Central Export Hub
 *
 * Enterprise-grade medication management hooks for school healthcare environments.
 * Provides comprehensive medication administration, safety validation, and HIPAA-compliant
 * tracking following the Five Rights of Medication Administration.
 *
 * ## Architecture Overview
 *
 * The medication hooks are organized into logical categories:
 *
 * ### Query Hooks (Data Fetching)
 * - **useMedicationFormulary**: Medication formulary search, barcode scanning, drug interactions
 * - **useMedicationsData**: Composite hook aggregating medications, inventory, reminders, reactions
 * - **useMedicationQueries**: Enterprise query hooks with HIPAA compliance logging
 *
 * ### Mutation Hooks (Data Modification)
 * - **useMedicationAdministrationService**: SAFETY-CRITICAL administration with Five Rights
 * - **useMedicationAdministration**: Simplified administration workflow
 * - **useMedicationSafety**: Allergy checking, drug interactions, dosage validation
 * - **useMedicationMutations**: Enterprise mutations (create, administer, report reactions)
 * - **useMedicationFormValidation**: Comprehensive form validation
 * - **useOptimisticMedications**: Optimistic updates for non-critical operations
 * - **useMedicationToast**: Standardized notification patterns
 * - **useOfflineQueue**: Offline operation queue management
 *
 * ### Configuration & Types
 * - Query keys, cache strategies, error codes, validation patterns
 * - Type definitions for medications, API responses, form data
 *
 * ## Safety-Critical Features
 *
 * ### Five Rights of Medication Administration
 * 1. **Right Patient**: Barcode scanning and photo confirmation
 * 2. **Right Medication**: NDC matching and LASA warnings
 * 3. **Right Dose**: Dosage validation and prescription matching
 * 4. **Right Route**: Administration route verification
 * 5. **Right Time**: Administration window validation
 *
 * ### Additional Safety Checks
 * - Patient allergy verification before administration
 * - Drug interaction detection for polypharmacy
 * - Maximum dosage validation
 * - LASA (Look-Alike Sound-Alike) medication warnings
 * - Adverse reaction reporting and tracking
 *
 * ### HIPAA Compliance
 * - All PHI access is audited with compliance logging
 * - Healthcare-appropriate cache strategies (critical data = always fresh)
 * - No PHI in localStorage (session storage or memory only)
 * - Proper data sensitivity classification
 *
 * ## Usage Examples
 *
 * ### Medication Administration Workflow
 * ```typescript
 * import { useMedicationAdministrationService } from '@/hooks/domains/medications';
 *
 * function AdministrationPage() {
 *   const {
 *     initSession,
 *     verifyFiveRights,
 *     recordAdministration,
 *     sessionData
 *   } = useMedicationAdministrationService(nurseId);
 *
 *   // 1. Initialize session by scanning prescription
 *   const handleScanPrescription = async (prescriptionId: string) => {
 *     await initSession.mutateAsync(prescriptionId);
 *   };
 *
 *   // 2. Verify Five Rights
 *   const handleVerify = () => {
 *     const result = verifyFiveRights({
 *       studentBarcode: scannedStudentBarcode,
 *       medicationNDC: scannedMedicationNDC,
 *       scannedDose: scannedDose,
 *       route: selectedRoute,
 *       administrationTime: new Date().toISOString(),
 *       patientPhotoConfirmed: true,
 *       allergyAcknowledged: true
 *     });
 *
 *     if (!result.valid) {
 *       alert(`Cannot proceed: ${result.errors.join(', ')}`);
 *       return false;
 *     }
 *     return true;
 *   };
 *
 *   // 3. Record administration
 *   const handleAdminister = async () => {
 *     if (!handleVerify()) return;
 *     await recordAdministration.mutateAsync({
 *       studentId: sessionData.studentId,
 *       medicationId: sessionData.medicationId,
 *       fiveRightsData: {...}
 *     });
 *   };
 * }
 * ```
 *
 * ### Safety Validation
 * ```typescript
 * import { useMedicationSafety } from '@/hooks/domains/medications';
 *
 * function PrescriptionForm() {
 *   const { checkSafety, validateDosage } = useMedicationSafety();
 *
 *   const handlePrescribe = async (medicationId: string, studentId: string, dosage: number) => {
 *     // Check allergies and interactions
 *     const safety = await checkSafety(medicationId, studentId);
 *     if (safety.isAllergic) {
 *       alert('ALLERGY WARNING: Patient is allergic to this medication!');
 *       return;
 *     }
 *
 *     // Validate dosage
 *     if (!validateDosage(dosage, maxDosage)) {
 *       alert('Dosage exceeds maximum safe limit');
 *       return;
 *     }
 *
 *     // Proceed with prescription...
 *   };
 * }
 * ```
 *
 * ### Form Validation
 * ```typescript
 * import { useMedicationFormValidation } from '@/hooks/domains/medications';
 *
 * function MedicationForm() {
 *   const { validateMedicationForm, errors } = useMedicationFormValidation();
 *
 *   const handleSubmit = (formData: MedicationFormData) => {
 *     const validationErrors = validateMedicationForm(formData);
 *     if (Object.keys(validationErrors).length > 0) {
 *       // Show errors to user
 *       return;
 *     }
 *     // Submit form...
 *   };
 * }
 * ```
 *
 * @module hooks/domains/medications
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @see {@link useMedicationAdministrationService} for complete administration workflow
 * @see {@link useMedicationSafety} for safety validation
 * @see {@link useMedicationFormValidation} for form validation
 *
 * @remarks
 * - All medication administration operations require Five Rights verification
 * - PHI access is automatically logged for HIPAA compliance
 * - Critical safety operations do NOT use optimistic updates
 * - Offline queue requires verification on sync to prevent duplicate dosing
 */

// Configuration exports
export * from './config';

// Query Hooks
export { useMedicationsData } from './queries/useMedicationsData';
export * from './queries/useMedicationFormulary';

// Mutation Hooks
export { useMedicationAdministration } from './mutations/useMedicationAdministration';
export { useMedicationFormValidation } from './mutations/useMedicationFormValidation';
export { useOptimisticMedications } from './mutations/useOptimisticMedications';
export * from './mutations/useMedicationAdministrationService';