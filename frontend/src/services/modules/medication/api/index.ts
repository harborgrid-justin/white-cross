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
