/**
 * Health Records Hooks - Barrel Exports
 *
 * Central export point for all health records related hooks.
 */

// Query Keys
export { healthRecordsKeys } from './queryKeys';

// Health Records
export {
  useHealthRecords,
  useHealthRecord,
  useCreateHealthRecord,
  useUpdateHealthRecord,
  useDeleteHealthRecord,
} from './healthRecordHooks';

// Allergies
export {
  useAllergies,
  useCreateAllergy,
  useUpdateAllergy,
  useDeleteAllergy,
} from './allergyHooks';

// Chronic Conditions
export {
  useConditions,
  useCreateCondition,
  useUpdateCondition,
  useDeleteCondition,
} from './conditionHooks';

// Vaccinations
export {
  useVaccinations,
  useCreateVaccination,
  useUpdateVaccination,
  useDeleteVaccination,
} from './vaccinationHooks';

// Vital Signs
export {
  useVitalSigns,
  useCreateVitalSigns,
  useUpdateVitalSigns,
  useDeleteVitalSigns,
} from './vitalSignsHooks';

// Growth Measurements
export {
  useGrowthMeasurements,
  useCreateGrowthMeasurement,
  useUpdateGrowthMeasurement,
  useDeleteGrowthMeasurement,
} from './growthHooks';

// Screenings
export {
  useScreenings,
  useCreateScreening,
  useUpdateScreening,
  useDeleteScreening,
} from './screeningHooks';

// Re-export types for convenience
export type {
  HealthRecord,
  Allergy,
  ChronicCondition,
  Vaccination,
  VitalSigns,
  GrowthMeasurement,
  Screening,
  HealthRecordFilters,
  HealthRecordCreate,
  HealthRecordUpdate,
  AllergyCreate,
  AllergyUpdate,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  VaccinationCreate,
  VaccinationUpdate,
  VitalSignsCreate,
  VitalSignsUpdate,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  ScreeningCreate,
  ScreeningUpdate,
} from '../../../services/modules/healthRecordsApi';
