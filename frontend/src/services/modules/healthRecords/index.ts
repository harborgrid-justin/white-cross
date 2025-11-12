/**
 * Health Records Module - Main Entry Point
 *
 * Complete enterprise-grade health records management system with:
 * - Main health records operations
 * - Allergies management with safety checks
 * - Chronic conditions tracking with care plans
 * - Vaccinations and compliance tracking
 * - Health screenings management
 * - Growth measurements and trends
 * - Vital signs tracking and alerts
 * - Bulk import/export operations
 * - PHI access logging and security (HIPAA compliant)
 *
 * @module services/modules/healthRecords
 */

// Export all types
export type {
  // Health Records
  HealthRecord,
  HealthRecordType,
  HealthRecordCreate,
  HealthRecordUpdate,
  HealthRecordFilters,
  HealthSummary,
  BulkImportRequest,
  BulkImportResult,
  CreateHealthRecordRequest,

  // Allergies
  Allergy,
  AllergyCreate,
  AllergyUpdate,
  CreateAllergyRequest,

  // Chronic Conditions
  ChronicCondition,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  CarePlanUpdate,
  CreateChronicConditionRequest,

  // Vaccinations
  Vaccination,
  VaccinationCreate,
  VaccinationUpdate,
  VaccinationCompliance,
  VaccinationRecord,
  CreateVaccinationRequest,

  // Screenings
  Screening,
  ScreeningCreate,
  ScreeningUpdate,
  ScreeningDue,

  // Growth Measurements
  GrowthMeasurement,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  GrowthTrend,

  // Vital Signs
  VitalSigns,
  VitalSignsCreate,
  VitalSignsUpdate,
  VitalSignsTrend,
  VitalSignsFilters,
  TemperatureMethod,
  VitalType,
} from './types';

// Export enums
export {
  AllergyType,
  AllergySeverity,
  ConditionStatus,
  ConditionSeverity,
  VaccinationStatus,
  ScreeningType,
  ScreeningOutcome,
} from './types';

// Export API clients
export {
  HealthRecordsApi,
  createHealthRecordsApi,
  healthRecordsApi,
  HealthRecordsApiClient,
  AllergiesApiClient,
  ChronicConditionsApiClient,
  VaccinationsApiClient,
  ScreeningsApiClient,
  GrowthMeasurementsApiClient,
  VitalSignsApiClient,
} from './api';

// Export validation schemas (for advanced use cases)
export {
  healthRecordCreateSchema,
  allergyCreateSchema,
  chronicConditionCreateSchema,
  carePlanUpdateSchema,
  vaccinationCreateSchema,
  screeningCreateSchema,
  growthMeasurementCreateSchema,
  vitalSignsCreateSchema,
  bulkImportSchema,
} from './validation/schemas';
