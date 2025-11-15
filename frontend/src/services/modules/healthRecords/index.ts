/**
 * MIGRATION STATUS: DEPRECATED - SCHEDULED FOR REMOVAL IN v2.0.0
 *
 * Health Records Module - Main Entry Point
 *
 * DEPRECATION TIMELINE:
 * - Deprecated: v1.5.0 (Current)
 * - Removal: v2.0.0 (Planned Q2 2025)
 *
 * This enterprise-grade health records management system has been replaced
 * by Next.js Server Actions for improved security and performance.
 *
 * REPLACEMENT: @/lib/actions/health-records.*
 *
 * MODULE MIGRATION MAP:
 *
 * Main Health Records:
 * OLD: import { healthRecordsApi } from '@/services/modules/healthRecords';
 * NEW: import { createHealthRecordAction, getHealthRecordsAction } from '@/lib/actions/health-records.crud';
 *
 * Allergies Management:
 * OLD: import { AllergiesApiClient } from '@/services/modules/healthRecords';
 * NEW: import { createAllergyAction, getStudentAllergiesAction } from '@/lib/actions/health-records.allergies';
 *
 * Chronic Conditions:
 * OLD: import { ChronicConditionsApiClient } from '@/services/modules/healthRecords';
 * NEW: Server Actions available in health-records.crud module
 *
 * Vaccinations:
 * OLD: import { VaccinationsApiClient } from '@/services/modules/healthRecords';
 * NEW: import { createImmunizationAction } from '@/lib/actions/health-records.immunizations';
 *
 * Health Screenings:
 * OLD: import { ScreeningsApiClient } from '@/services/modules/healthRecords';
 * NEW: Available through health-records.crud actions
 *
 * Growth Measurements:
 * OLD: import { GrowthMeasurementsApiClient } from '@/services/modules/healthRecords';
 * NEW: Available through health-records.crud actions
 *
 * Vital Signs:
 * OLD: import { VitalSignsApiClient } from '@/services/modules/healthRecords';
 * NEW: Available through health-records.crud actions
 *
 * Statistics & Analytics:
 * OLD: healthRecordsApi.getStatistics()
 * NEW: import { getHealthRecordsStats, getHealthRecordsDashboardData } from '@/lib/actions/health-records.stats';
 *
 * MIGRATION BENEFITS:
 * - Maintained PHI access logging and HIPAA compliance
 * - Enhanced security with Server Actions
 * - Better type safety with Zod validation
 * - Improved Next.js App Router integration
 * - Simplified error handling
 *
 * @deprecated Use Server Actions from @/lib/actions/health-records.* instead. Will be removed in v2.0.0
 * @see {@link /lib/actions/health-records.actions.ts} - Main barrel export
 * @see {@link /lib/actions/health-records.crud.ts} - CRUD operations
 * @see {@link /lib/actions/health-records.allergies.ts} - Allergy management
 * @see {@link /lib/actions/health-records.immunizations.ts} - Immunization tracking
 * @see {@link /lib/actions/health-records.stats.ts} - Statistics and analytics
 * @see {@link ../healthRecordsApi.ts} - Detailed migration examples and breaking changes
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
