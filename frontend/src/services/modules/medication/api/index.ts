/**
 * WF-IDX-283 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, types, named exports | Key Features: Standard module
 * Last Updated: 2025-11-15 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Medication Module API Exports
 *
 * @deprecated This entire medication API module is deprecated and will be removed on 2026-06-30.
 * Please migrate to server actions at @/lib/actions/medications.* instead.
 *
 * MIGRATION PATH:
 * - Formulary operations → @/lib/actions/medications.cache (getMedications, getMedicationById)
 * - Prescription operations → @/lib/actions/medications.crud (createMedication, updateMedication)
 * - Administration operations → @/lib/actions/medications.administration (administerMedication)
 *
 * WHY MIGRATE:
 * ✓ End-to-end type safety with Zod validation
 * ✓ Built-in Next.js cache integration
 * ✓ Automatic HIPAA audit logging
 * ✓ Server-side security
 * ✓ Better error handling
 *
 * DUPLICATE DIRECTORY NOTE:
 * This directory (/medication) appears to duplicate functionality from /medications.
 * Both directories will be deprecated in favor of server actions.
 *
 * Centralized export point for all medication-related API clients
 */

// API Clients
export { MedicationFormularyApi, createMedicationFormularyApi, medicationFormularyApi } from './MedicationFormularyApi';
export { PrescriptionApi, createPrescriptionApi, prescriptionApi } from './PrescriptionApi';
export { AdministrationApi, createAdministrationApi, administrationApi } from './AdministrationApi';

// Types from MedicationFormularyApi
export type {
  Medication,
  MedicationForm,
  AdministrationRoute,
  FormularyFilters,
  DrugInteraction,
  DrugMonograph,
  BarcodeResult,
  LASAMedication,
} from './MedicationFormularyApi';

// Types from PrescriptionApi
export type {
  Prescription,
  PrescriptionFrequency,
  Allergy,
  AllergyWarning,
  PrescriptionFilters,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  VerificationResult,
  PrescriptionHistory,
} from './PrescriptionApi';

// Types from AdministrationApi
export type {
  AdministrationSession,
  FiveRightsData,
  FiveRightsVerificationResult,
  AdministrationRecord,
  AdministrationLog,
  WitnessSignature,
  AdministrationHistoryFilters,
  MedicationReminder,
} from './AdministrationApi';

import { medicationFormularyApi } from './MedicationFormularyApi';
import { prescriptionApi } from './PrescriptionApi';
import { administrationApi } from './AdministrationApi';

// Create consolidated medication API object
export const medicationApi = {
  formulary: medicationFormularyApi,
  prescription: prescriptionApi,
  administration: administrationApi,
} as const;

// Default export
export default medicationApi;
