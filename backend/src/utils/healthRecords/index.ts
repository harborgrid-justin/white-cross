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
