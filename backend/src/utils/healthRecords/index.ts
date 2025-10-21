/**
 * LOC: 269A33ACDE
 * WC-IDX-348 | index.ts - Module exports and entry point
 *
 * UPSTREAM (imports from):
 *   - helpers.ts (utils/healthRecords/helpers.ts)
 *   - integrations.ts (utils/healthRecords/integrations.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-IDX-348 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: ./helpers, ./integrations | Dependencies: ./helpers, ./integrations
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

/**
 * Health Records Utilities - Main Export
 * Comprehensive validation, business logic, helpers, and integrations
 * for health records management in the White Cross platform
 */

// Validation Schemas
export * from './healthRecordValidators';

// Business Logic
export {
  // Allergy business logic
  checkAllergyContraindications,
  validateAllergyVerification,
  generateAllergyAlert,

  // Vaccination business logic
  calculateVaccinationCompliance,
  determineNextDueDate,
  validateVaccinationSchedule,
  checkExemptionEligibility,

  // Chronic condition business logic
  calculateConditionRiskScore,
  determineReviewFrequency,
  checkAccommodationRequirements,
  generateActionPlan,

  // Growth business logic
  calculateBMI,
  calculatePercentiles,
  identifyGrowthConcerns,
  analyzeTrends,

  // Vital signs business logic
  validateVitalRanges,
  flagAbnormalVitals,
  calculateMeanArterialPressure,
  assessVitalTrends,

  // Screening business logic
  determineReferralUrgency,
  scheduleFollowUp,
  validateScreeningFrequency
} from './businessLogic';

// Helper Utilities
export {
  // Unit conversion
  convertUnits,
  convertMeasurements,
  roundToDecimal,

  // Age calculation
  calculateAge,
  getAgeInYears,
  getAgeInMonths,
  formatAge,
  isPediatric,
  getAgeCategory,

  // Formatting
  formatHealthRecord,
  formatDate,
  formatDateTime,

  // PHI sanitization
  sanitizePHI,
  maskSensitiveData,
  containsPHI,

  // ID generation
  generateHealthRecordId,
  generateMedicalRecordNumber,
  generateBatchId,

  // Medical codes
  parseMedicalCodes,
  validateICD10Code,
  validateCVXCode,
  validateNDCCode,
  formatICD10Code,
  formatNDCCode,

  // Validation
  isValidPastDate,
  isValidFutureDate,
  isValidDateRange,
  isRealisticValue,

  // String utilities
  titleCase,
  truncate,
  normalizeText,

  // Array utilities
  removeDuplicates,
  sortByDate
} from './helpers';

// Integration Functions
export {
  // Vaccine lookups
  lookupCVXCode,
  lookupVaccineByNDC,
  searchVaccineByName,
  getAllActiveVaccines,
  getManufacturerByMVX,

  // ICD codes
  validateICDCode,
  searchICDCodes,
  getICDCodesByCategory,

  // State requirements
  checkStateVaccinationRequirements,
  getExemptionRules,

  // Growth charts
  getCDCGrowthChartData,
  calculateZScore,
  zScoreToPercentile
} from './integrations';

// Re-export default helpers object
import helpers from './helpers';
import integrations from './integrations';

export { helpers, integrations };
