/**
 * Health Records API Type Definitions
 *
 * Comprehensive type definitions for all health record related entities:
 * - Health Records
 * - Allergies
 * - Chronic Conditions
 * - Vaccinations
 * - Screenings
 * - Growth Measurements
 * - Vital Signs
 * - Health Summaries
 * - Bulk Import/Export
 *
 * This file serves as a barrel export, re-exporting types from the modular
 * type definitions in the types/ subdirectory.
 *
 * @module services/modules/healthRecords/types
 */

// ==========================================
// HEALTH RECORD TYPES
// ==========================================

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
} from './types/healthRecords.types';

// ==========================================
// ALLERGY TYPES
// ==========================================

export {
  AllergyType,
  AllergySeverity,
} from './types/allergies.types';

export type {
  Allergy,
  AllergyCreate,
  AllergyUpdate,
  CreateAllergyRequest,
} from './types/allergies.types';

// ==========================================
// CHRONIC CONDITION TYPES
// ==========================================

export {
  ConditionStatus,
  ConditionSeverity,
} from './types/chronicConditions.types';

export type {
  ChronicCondition,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  CarePlanUpdate,
  CreateChronicConditionRequest,
} from './types/chronicConditions.types';

// ==========================================
// VACCINATION TYPES
// ==========================================

export {
  VaccinationStatus,
} from './types/vaccinations.types';

export type {
  Vaccination,
  VaccinationCreate,
  VaccinationUpdate,
  VaccinationCompliance,
  VaccinationRecord,
  CreateVaccinationRequest,
} from './types/vaccinations.types';

// ==========================================
// SCREENING TYPES
// ==========================================

export {
  ScreeningType,
  ScreeningOutcome,
} from './types/screenings.types';

export type {
  Screening,
  ScreeningCreate,
  ScreeningUpdate,
  ScreeningDue,
} from './types/screenings.types';

// ==========================================
// GROWTH MEASUREMENT TYPES
// ==========================================

export type {
  GrowthMeasurement,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  GrowthTrend,
} from './types/growthMeasurements.types';

// ==========================================
// VITAL SIGNS TYPES
// ==========================================

export type {
  VitalSigns,
  VitalSignsCreate,
  VitalSignsUpdate,
  VitalSignsTrend,
  VitalSignsFilters,
  TemperatureMethod,
  VitalType,
} from './types/vitalSigns.types';

// ==========================================
// BACKWARD COMPATIBILITY ALIASES
// ==========================================

// Note: Individual backward compatibility aliases are defined
// in their respective type files and re-exported above.
// This ensures each domain maintains its own compatibility layer.
