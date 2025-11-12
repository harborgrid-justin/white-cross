/**
 * Health Records Types - Main Export
 *
 * Centralized export of all health records type definitions
 *
 * @module services/modules/healthRecords/types
 */

// Health Records
export type {
  HealthRecord,
  HealthRecordType,
  HealthRecordCreate,
  HealthRecordUpdate,
  HealthRecordFilters,
  HealthSummary,
  BulkImportRequest,
  BulkImportResult,
  CreateHealthRecordRequest,
} from './healthRecords.types';

// Allergies
export {
  AllergyType,
  AllergySeverity,
} from './allergies.types';

export type {
  Allergy,
  AllergyCreate,
  AllergyUpdate,
  CreateAllergyRequest,
} from './allergies.types';

// Chronic Conditions
export {
  ConditionStatus,
  ConditionSeverity,
} from './chronicConditions.types';

export type {
  ChronicCondition,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  CarePlanUpdate,
  CreateChronicConditionRequest,
} from './chronicConditions.types';

// Vaccinations
export {
  VaccinationStatus,
} from './vaccinations.types';

export type {
  Vaccination,
  VaccinationCreate,
  VaccinationUpdate,
  VaccinationCompliance,
  VaccinationRecord,
  CreateVaccinationRequest,
} from './vaccinations.types';

// Screenings
export {
  ScreeningType,
  ScreeningOutcome,
} from './screenings.types';

export type {
  Screening,
  ScreeningCreate,
  ScreeningUpdate,
  ScreeningDue,
} from './screenings.types';

// Growth Measurements
export type {
  GrowthMeasurement,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  GrowthTrend,
} from './growthMeasurements.types';

// Vital Signs
export type {
  VitalSigns,
  VitalSignsCreate,
  VitalSignsUpdate,
  VitalSignsTrend,
  VitalSignsFilters,
  TemperatureMethod,
  VitalType,
} from './vitalSigns.types';
