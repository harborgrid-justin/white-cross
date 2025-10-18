/**
 * WF-IDX-283 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, types, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Medication Module API Exports
 *
 * Centralized export point for all medication-related API clients
 */

// API Clients
export { MedicationFormularyApi, medicationFormularyApi } from './MedicationFormularyApi';
export { PrescriptionApi, prescriptionApi } from './PrescriptionApi';
export { AdministrationApi, administrationApi } from './AdministrationApi';

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

// Create consolidated medication API object
export const medicationApi = {
  formulary: medicationFormularyApi,
  prescription: prescriptionApi,
  administration: administrationApi,
} as const;

// Default export
export default medicationApi;
