/**
 * Health Records API - Type Definitions Index
 *
 * Barrel export file for all health records type definitions
 * Maintains backward compatibility with the original types.ts file
 *
 * @module services/modules/healthRecordsApi/types
 */

// Base types
export type {
  StudentReference,
  StudentReferenceWithDemographics
} from './base';

// Health Records
export type {
  HealthRecordType,
  HealthRecord,
  HealthRecordCreate,
  HealthRecordUpdate,
  HealthRecordFilters
} from './healthRecords';

// Allergies
export {
  AllergyType,
  AllergySeverity
} from './allergies';

export type {
  Allergy,
  AllergyCreate,
  AllergyUpdate
} from './allergies';

// Chronic Conditions
export {
  ConditionStatus,
  ConditionSeverity
} from './conditions';

export type {
  ChronicCondition,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  CarePlanUpdate
} from './conditions';

// Vaccinations
export {
  VaccinationStatus
} from './vaccinations';

export type {
  Vaccination,
  VaccinationCreate,
  VaccinationUpdate,
  VaccinationCompliance
} from './vaccinations';

// Screenings
export {
  ScreeningType,
  ScreeningOutcome
} from './screenings';

export type {
  ScreeningMeasurements,
  Screening,
  ScreeningCreate,
  ScreeningUpdate,
  ScreeningsDue
} from './screenings';

// Measurements (Growth and Vital Signs)
export type {
  GrowthMeasurement,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  GrowthTrendDirection,
  GrowthTrend,
  TemperatureMethod,
  VitalSigns,
  VitalSignsCreate,
  VitalSignsUpdate,
  VitalSignsFilters,
  VitalType,
  VitalTrendDirection,
  VitalSignsTrend
} from './measurements';

// Summary and Bulk Operations
export type {
  MedicationSummary,
  PhysicalExamSummary,
  VaccinationSummary,
  HealthSummary,
  BulkImportError,
  BulkImportWarning,
  BulkImportRequest,
  BulkImportResult
} from './summary';

// API Response Types and Legacy Aliases
export type {
  AllergiesResponse,
  ConditionsResponse,
  VaccinationsResponse,
  ScreeningsResponse,
  ScreeningsDueResponse,
  GrowthMeasurementsResponse,
  VitalSignsResponse,
  // Legacy type aliases (deprecated)
  VaccinationRecord,
  CreateHealthRecordRequest,
  CreateAllergyRequest,
  CreateChronicConditionRequest,
  CreateVaccinationRequest
} from './responses';
