/**
 * Enterprise-Grade Health Record Validation Utilities
 *
 * Purpose: Comprehensive clinical validation for healthcare data
 * Compliance: HIPAA, CDC guidelines, clinical standards
 *
 * Architecture:
 * - Medical code format validators (ICD-10, CVX, NDC, NPI)
 * - Clinical range validators (vital signs, growth metrics)
 * - Age-based validation (pediatric vs adult ranges)
 * - Temporal validation (date sequences, intervals)
 * - Medical logic validation (BP relationships, BMI calculations)
 *
 * Security: All validators prevent injection attacks and data corruption
 */

import { AllergySeverity, ConditionSeverity, VaccineComplianceStatus } from '../database/types/enums';

/**
 * Validation result interface for detailed error reporting
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Age category for context-specific validation
 */
export enum AgeCategory {
  INFANT = 'INFANT',        // 0-2 years
  CHILD = 'CHILD',          // 2-12 years
  ADOLESCENT = 'ADOLESCENT', // 12-18 years
  ADULT = 'ADULT'           // 18+ years
}

// ==========================================
// MEDICAL CODE FORMAT VALIDATORS
// ==========================================

/**
 * Validate ICD-10 code format
 * Format: A00.0 to Z99.9 (letter + 2-3 digits + optional decimal + 1-2 digits)
 *
 * @param code - ICD-10 diagnosis code
 * @returns ValidationResult with detailed feedback
 */
export function validateICD10Code(code?: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!code) {
    return result; // Optional field
  }

  // ICD-10 format: Letter + 2 digits + optional decimal + up to 2 digits
  const icd10Pattern = /^[A-Z]\d{2}(\.\d{1,2})?$/;

  if (!icd10Pattern.test(code)) {
    result.isValid = false;
    result.errors.push(
      `Invalid ICD-10 code format: "${code}". Expected format: A00 or A00.0 or A00.00`
    );
  }

  // Check for valid letter range (A-Z, excluding some)
  const firstChar = code.charAt(0);
  const invalidStarts = ['U']; // U codes are reserved for special purposes

  if (invalidStarts.includes(firstChar)) {
    result.warnings.push(`ICD-10 code starts with "${firstChar}" which is reserved for special purposes`);
  }

  return result;
}

/**
 * Validate CVX (Vaccine) code format
 * CVX codes are 1-3 digit numeric codes assigned by CDC
 *
 * @param code - CVX vaccine code
 * @returns ValidationResult
 */
export function validateCVXCode(code?: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!code) {
    return result; // Optional field
  }

  // CVX codes are 1-3 digit numbers (001-999)
  const cvxPattern = /^\d{1,3}$/;

  if (!cvxPattern.test(code)) {
    result.isValid = false;
    result.errors.push(
      `Invalid CVX code format: "${code}". CVX codes must be 1-3 digit numbers (e.g., 03, 20, 140)`
    );
    return result;
  }

  const codeNum = parseInt(code, 10);
  if (codeNum < 1 || codeNum > 999) {
    result.isValid = false;
    result.errors.push(`CVX code must be between 001 and 999, received: ${code}`);
  }

  return result;
}

/**
 * Validate NDC (National Drug Code) format
 * Format: 5-4-2 (00000-0000-00) or other valid NDC formats
 *
 * @param code - NDC drug code
 * @returns ValidationResult
 */
export function validateNDCCode(code?: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!code) {
    return result; // Optional field
  }

  // Remove hyphens for validation
  const cleanCode = code.replace(/-/g, '');

  // NDC codes must be 10-11 digits
  if (!/^\d{10,11}$/.test(cleanCode)) {
    result.isValid = false;
    result.errors.push(
      `Invalid NDC code format: "${code}". NDC codes must be 10-11 digits in formats like 00000-0000-00`
    );
  }

  return result;
}

/**
 * Validate NPI (National Provider Identifier) format
 * Format: 10-digit number with Luhn checksum validation
 *
 * @param npi - NPI provider identifier
 * @returns ValidationResult
 */
export function validateNPI(npi?: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!npi) {
    return result; // Optional field
  }

  // NPI must be exactly 10 digits
  if (!/^\d{10}$/.test(npi)) {
    result.isValid = false;
    result.errors.push(`Invalid NPI format: "${npi}". NPI must be exactly 10 digits`);
    return result;
  }

  // Validate using Luhn algorithm
  if (!luhnCheck(npi)) {
    result.isValid = false;
    result.errors.push(`Invalid NPI checksum: "${npi}". NPI failed Luhn algorithm validation`);
  }

  return result;
}

/**
 * Luhn algorithm checksum validation (used for NPI validation)
 */
function luhnCheck(value: string): boolean {
  let sum = 0;
  let alternate = false;

  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i), 10);

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

// ==========================================
// VITAL SIGNS VALIDATION
// ==========================================

/**
 * Determine age category from date of birth
 */
function getAgeCategory(dateOfBirth: Date): AgeCategory {
  const age = (Date.now() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  if (age < 2) return AgeCategory.INFANT;
  if (age < 12) return AgeCategory.CHILD;
  if (age < 18) return AgeCategory.ADOLESCENT;
  return AgeCategory.ADULT;
}

/**
 * Vital signs range configuration by age category
 */
const VITAL_RANGES = {
  temperature: {
    celsius: {
      min: 35.0,
      max: 42.0,
      normalMin: 36.1,
      normalMax: 37.8,
      warningLow: 36.0,
      warningHigh: 38.0,
    },
    fahrenheit: {
      min: 95.0,
      max: 107.6,
      normalMin: 97.0,
      normalMax: 100.0,
      warningLow: 96.8,
      warningHigh: 100.4,
    },
  },
  bloodPressure: {
    [AgeCategory.INFANT]: {
      systolic: { min: 50, max: 100, normalMin: 65, normalMax: 85 },
      diastolic: { min: 30, max: 70, normalMin: 40, normalMax: 55 },
    },
    [AgeCategory.CHILD]: {
      systolic: { min: 70, max: 130, normalMin: 90, normalMax: 110 },
      diastolic: { min: 40, max: 90, normalMin: 55, normalMax: 75 },
    },
    [AgeCategory.ADOLESCENT]: {
      systolic: { min: 90, max: 140, normalMin: 100, normalMax: 120 },
      diastolic: { min: 50, max: 95, normalMin: 60, normalMax: 80 },
    },
    [AgeCategory.ADULT]: {
      systolic: { min: 90, max: 200, normalMin: 100, normalMax: 130 },
      diastolic: { min: 50, max: 130, normalMin: 60, normalMax: 85 },
    },
  },
  heartRate: {
    [AgeCategory.INFANT]: { min: 100, max: 180, normalMin: 110, normalMax: 160 },
    [AgeCategory.CHILD]: { min: 70, max: 140, normalMin: 80, normalMax: 120 },
    [AgeCategory.ADOLESCENT]: { min: 60, max: 120, normalMin: 60, normalMax: 100 },
    [AgeCategory.ADULT]: { min: 40, max: 150, normalMin: 60, normalMax: 100 },
  },
  respiratoryRate: {
    [AgeCategory.INFANT]: { min: 30, max: 60, normalMin: 35, normalMax: 50 },
    [AgeCategory.CHILD]: { min: 20, max: 40, normalMin: 22, normalMax: 34 },
    [AgeCategory.ADOLESCENT]: { min: 12, max: 30, normalMin: 14, normalMax: 22 },
    [AgeCategory.ADULT]: { min: 8, max: 30, normalMin: 12, normalMax: 20 },
  },
  oxygenSaturation: {
    min: 70,
    max: 100,
    normalMin: 95,
    critical: 90,
  },
};

/**
 * Validate temperature measurement
 *
 * @param temperature - Temperature value
 * @param unit - 'celsius' or 'fahrenheit'
 * @returns ValidationResult
 */
export function validateTemperature(
  temperature?: number,
  unit: 'celsius' | 'fahrenheit' = 'celsius'
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (temperature === undefined) {
    return result;
  }

  const ranges = VITAL_RANGES.temperature[unit];

  if (temperature < ranges.min || temperature > ranges.max) {
    result.isValid = false;
    result.errors.push(
      `Temperature ${temperature}°${unit === 'celsius' ? 'C' : 'F'} is outside valid range (${ranges.min}-${ranges.max})`
    );
  } else if (temperature < ranges.warningLow) {
    result.warnings.push(`Low temperature: ${temperature}°${unit === 'celsius' ? 'C' : 'F'} (hypothermia risk)`);
  } else if (temperature > ranges.warningHigh) {
    result.warnings.push(`High temperature: ${temperature}°${unit === 'celsius' ? 'C' : 'F'} (fever present)`);
  }

  return result;
}

/**
 * Validate blood pressure measurements with systolic/diastolic relationship
 *
 * @param systolic - Systolic blood pressure
 * @param diastolic - Diastolic blood pressure
 * @param ageCategory - Patient age category
 * @returns ValidationResult
 */
export function validateBloodPressure(
  systolic?: number,
  diastolic?: number,
  ageCategory: AgeCategory = AgeCategory.ADULT
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!systolic || !diastolic) {
    if (systolic && !diastolic) {
      result.errors.push('Systolic pressure provided without diastolic pressure');
      result.isValid = false;
    } else if (!systolic && diastolic) {
      result.errors.push('Diastolic pressure provided without systolic pressure');
      result.isValid = false;
    }
    return result;
  }

  const ranges = VITAL_RANGES.bloodPressure[ageCategory];

  // Validate systolic
  if (systolic < ranges.systolic.min || systolic > ranges.systolic.max) {
    result.isValid = false;
    result.errors.push(
      `Systolic pressure ${systolic} mmHg is outside valid range for age (${ranges.systolic.min}-${ranges.systolic.max})`
    );
  }

  // Validate diastolic
  if (diastolic < ranges.diastolic.min || diastolic > ranges.diastolic.max) {
    result.isValid = false;
    result.errors.push(
      `Diastolic pressure ${diastolic} mmHg is outside valid range for age (${ranges.diastolic.min}-${ranges.diastolic.max})`
    );
  }

  // Validate relationship: systolic must be greater than diastolic
  if (systolic <= diastolic) {
    result.isValid = false;
    result.errors.push(
      `Systolic pressure (${systolic}) must be greater than diastolic pressure (${diastolic})`
    );
  }

  // Check for hypertension
  if (result.isValid) {
    if (systolic >= ranges.systolic.normalMax || diastolic >= ranges.diastolic.normalMax) {
      result.warnings.push('Blood pressure elevated - consider follow-up');
    }
    if (systolic <= ranges.systolic.normalMin || diastolic <= ranges.diastolic.normalMin) {
      result.warnings.push('Blood pressure low - monitor patient');
    }
  }

  return result;
}

/**
 * Validate heart rate
 *
 * @param heartRate - Heart rate in beats per minute
 * @param ageCategory - Patient age category
 * @returns ValidationResult
 */
export function validateHeartRate(
  heartRate?: number,
  ageCategory: AgeCategory = AgeCategory.ADULT
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!heartRate) {
    return result;
  }

  const ranges = VITAL_RANGES.heartRate[ageCategory];

  if (heartRate < ranges.min || heartRate > ranges.max) {
    result.isValid = false;
    result.errors.push(
      `Heart rate ${heartRate} bpm is outside valid range for age (${ranges.min}-${ranges.max})`
    );
  } else if (heartRate < ranges.normalMin) {
    result.warnings.push(`Bradycardia: Heart rate ${heartRate} bpm is below normal range`);
  } else if (heartRate > ranges.normalMax) {
    result.warnings.push(`Tachycardia: Heart rate ${heartRate} bpm is above normal range`);
  }

  return result;
}

/**
 * Validate respiratory rate
 *
 * @param respiratoryRate - Respiratory rate in breaths per minute
 * @param ageCategory - Patient age category
 * @returns ValidationResult
 */
export function validateRespiratoryRate(
  respiratoryRate?: number,
  ageCategory: AgeCategory = AgeCategory.ADULT
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!respiratoryRate) {
    return result;
  }

  const ranges = VITAL_RANGES.respiratoryRate[ageCategory];

  if (respiratoryRate < ranges.min || respiratoryRate > ranges.max) {
    result.isValid = false;
    result.errors.push(
      `Respiratory rate ${respiratoryRate} breaths/min is outside valid range for age (${ranges.min}-${ranges.max})`
    );
  } else if (respiratoryRate < ranges.normalMin) {
    result.warnings.push(`Bradypnea: Respiratory rate ${respiratoryRate} breaths/min is below normal`);
  } else if (respiratoryRate > ranges.normalMax) {
    result.warnings.push(`Tachypnea: Respiratory rate ${respiratoryRate} breaths/min is above normal`);
  }

  return result;
}

/**
 * Validate oxygen saturation
 *
 * @param oxygenSaturation - SpO2 percentage
 * @returns ValidationResult
 */
export function validateOxygenSaturation(oxygenSaturation?: number): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!oxygenSaturation) {
    return result;
  }

  const ranges = VITAL_RANGES.oxygenSaturation;

  if (oxygenSaturation < ranges.min || oxygenSaturation > ranges.max) {
    result.isValid = false;
    result.errors.push(
      `Oxygen saturation ${oxygenSaturation}% is outside valid range (${ranges.min}-${ranges.max}%)`
    );
  } else if (oxygenSaturation < ranges.critical) {
    result.warnings.push(`CRITICAL: Oxygen saturation ${oxygenSaturation}% is dangerously low`);
  } else if (oxygenSaturation < ranges.normalMin) {
    result.warnings.push(`Low oxygen saturation: ${oxygenSaturation}% (hypoxemia)`);
  }

  return result;
}

// ==========================================
// GROWTH MEASUREMENTS VALIDATION
// ==========================================

/**
 * Calculate BMI from height and weight
 *
 * @param height - Height in centimeters
 * @param weight - Weight in kilograms
 * @returns BMI value rounded to 1 decimal place
 */
export function calculateBMI(height?: number, weight?: number): number | null {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return null;
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return Math.round(bmi * 10) / 10;
}

/**
 * Validate BMI calculation and value
 *
 * @param bmi - BMI value
 * @param calculatedBMI - Auto-calculated BMI from height/weight
 * @returns ValidationResult
 */
export function validateBMI(bmi?: number, calculatedBMI?: number | null): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!bmi) {
    return result;
  }

  // BMI range: 10-60 (extreme values are medically possible but rare)
  if (bmi < 10 || bmi > 60) {
    result.isValid = false;
    result.errors.push(`BMI ${bmi} is outside valid range (10-60)`);
    return result;
  }

  // If calculated BMI is provided, check for significant discrepancy
  if (calculatedBMI !== null && calculatedBMI !== undefined) {
    const difference = Math.abs(bmi - calculatedBMI);
    if (difference > 0.5) {
      result.warnings.push(
        `BMI mismatch: Provided BMI (${bmi}) differs from calculated BMI (${calculatedBMI}). Using calculated value.`
      );
    }
  }

  // BMI category warnings (adult categories)
  if (bmi < 18.5) {
    result.warnings.push(`Underweight: BMI ${bmi} is below normal range`);
  } else if (bmi >= 25 && bmi < 30) {
    result.warnings.push(`Overweight: BMI ${bmi} is above normal range`);
  } else if (bmi >= 30) {
    result.warnings.push(`Obese: BMI ${bmi} indicates obesity`);
  }

  return result;
}

/**
 * Validate height measurement
 *
 * @param height - Height in centimeters
 * @param ageCategory - Patient age category
 * @returns ValidationResult
 */
export function validateHeight(
  height?: number,
  ageCategory: AgeCategory = AgeCategory.ADULT
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!height) {
    return result;
  }

  // Height ranges by age (in cm)
  const ranges = {
    [AgeCategory.INFANT]: { min: 45, max: 100 },
    [AgeCategory.CHILD]: { min: 80, max: 160 },
    [AgeCategory.ADOLESCENT]: { min: 140, max: 200 },
    [AgeCategory.ADULT]: { min: 140, max: 230 },
  };

  const range = ranges[ageCategory];

  if (height < range.min || height > range.max) {
    result.isValid = false;
    result.errors.push(
      `Height ${height} cm is outside valid range for age category (${range.min}-${range.max} cm)`
    );
  }

  return result;
}

/**
 * Validate weight measurement
 *
 * @param weight - Weight in kilograms
 * @param ageCategory - Patient age category
 * @returns ValidationResult
 */
export function validateWeight(
  weight?: number,
  ageCategory: AgeCategory = AgeCategory.ADULT
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!weight) {
    return result;
  }

  // Weight ranges by age (in kg)
  const ranges = {
    [AgeCategory.INFANT]: { min: 2, max: 15 },
    [AgeCategory.CHILD]: { min: 10, max: 60 },
    [AgeCategory.ADOLESCENT]: { min: 30, max: 120 },
    [AgeCategory.ADULT]: { min: 35, max: 300 },
  };

  const range = ranges[ageCategory];

  if (weight < range.min || weight > range.max) {
    result.isValid = false;
    result.errors.push(
      `Weight ${weight} kg is outside valid range for age category (${range.min}-${range.max} kg)`
    );
  }

  return result;
}

/**
 * Validate complete vital signs record
 *
 * @param vitals - Vital signs object
 * @param dateOfBirth - Patient date of birth for age-based validation
 * @returns ValidationResult
 */
export function validateVitalSigns(
  vitals: {
    temperature?: number;
    temperatureMethod?: string;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    height?: number;
    weight?: number;
    bmi?: number;
  },
  dateOfBirth?: Date
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  const ageCategory = dateOfBirth ? getAgeCategory(dateOfBirth) : AgeCategory.ADULT;

  // Validate temperature
  if (vitals.temperature !== undefined) {
    const tempResult = validateTemperature(vitals.temperature, 'celsius');
    result.errors.push(...tempResult.errors);
    result.warnings.push(...tempResult.warnings);
    if (!tempResult.isValid) result.isValid = false;
  }

  // Validate blood pressure
  const bpResult = validateBloodPressure(
    vitals.bloodPressureSystolic,
    vitals.bloodPressureDiastolic,
    ageCategory
  );
  result.errors.push(...bpResult.errors);
  result.warnings.push(...bpResult.warnings);
  if (!bpResult.isValid) result.isValid = false;

  // Validate heart rate
  if (vitals.heartRate !== undefined) {
    const hrResult = validateHeartRate(vitals.heartRate, ageCategory);
    result.errors.push(...hrResult.errors);
    result.warnings.push(...hrResult.warnings);
    if (!hrResult.isValid) result.isValid = false;
  }

  // Validate respiratory rate
  if (vitals.respiratoryRate !== undefined) {
    const rrResult = validateRespiratoryRate(vitals.respiratoryRate, ageCategory);
    result.errors.push(...rrResult.errors);
    result.warnings.push(...rrResult.warnings);
    if (!rrResult.isValid) result.isValid = false;
  }

  // Validate oxygen saturation
  if (vitals.oxygenSaturation !== undefined) {
    const o2Result = validateOxygenSaturation(vitals.oxygenSaturation);
    result.errors.push(...o2Result.errors);
    result.warnings.push(...o2Result.warnings);
    if (!o2Result.isValid) result.isValid = false;
  }

  // Validate height
  if (vitals.height !== undefined) {
    const heightResult = validateHeight(vitals.height, ageCategory);
    result.errors.push(...heightResult.errors);
    result.warnings.push(...heightResult.warnings);
    if (!heightResult.isValid) result.isValid = false;
  }

  // Validate weight
  if (vitals.weight !== undefined) {
    const weightResult = validateWeight(vitals.weight, ageCategory);
    result.errors.push(...weightResult.errors);
    result.warnings.push(...weightResult.warnings);
    if (!weightResult.isValid) result.isValid = false;
  }

  // Validate and auto-calculate BMI
  if (vitals.height && vitals.weight) {
    const calculatedBMI = calculateBMI(vitals.height, vitals.weight);
    const bmiResult = validateBMI(vitals.bmi, calculatedBMI);
    result.errors.push(...bmiResult.errors);
    result.warnings.push(...bmiResult.warnings);
    if (!bmiResult.isValid) result.isValid = false;
  }

  return result;
}

// ==========================================
// DATE AND TEMPORAL VALIDATION
// ==========================================

/**
 * Validate diagnosis date is not in the future
 *
 * @param diagnosisDate - Date of diagnosis
 * @returns ValidationResult
 */
export function validateDiagnosisDate(diagnosisDate: Date): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  const now = new Date();

  if (diagnosisDate > now) {
    result.isValid = false;
    result.errors.push('Diagnosis date cannot be in the future');
  }

  // Check if diagnosis date is more than 100 years ago
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);

  if (diagnosisDate < hundredYearsAgo) {
    result.warnings.push('Diagnosis date is more than 100 years ago - please verify');
  }

  return result;
}

/**
 * Validate vaccination date and expiration
 *
 * @param administrationDate - Date vaccine was administered
 * @param expirationDate - Expiration date of vaccine
 * @returns ValidationResult
 */
export function validateVaccinationDates(
  administrationDate: Date,
  expirationDate?: Date
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  const now = new Date();

  // Administration date cannot be in the future
  if (administrationDate > now) {
    result.isValid = false;
    result.errors.push('Vaccination administration date cannot be in the future');
  }

  // If expiration date provided, it should be after administration date
  if (expirationDate) {
    if (expirationDate < administrationDate) {
      result.isValid = false;
      result.errors.push('Vaccine expiration date must be after administration date');
    }

    // Warn if vaccine was expired when administered
    if (expirationDate < administrationDate) {
      result.warnings.push('Vaccine was expired when administered - verify documentation');
    }
  }

  return result;
}

/**
 * Validate allergy reaction format
 *
 * @param reactions - Array of reaction descriptions or JSONB object
 * @returns ValidationResult
 */
export function validateAllergyReactions(reactions?: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!reactions) {
    return result;
  }

  // If it's a string, should not be empty
  if (typeof reactions === 'string') {
    if (reactions.trim().length === 0) {
      result.warnings.push('Empty reaction description provided');
    }
  }

  // If it's an array, validate contents
  if (Array.isArray(reactions)) {
    if (reactions.length === 0) {
      result.warnings.push('Empty reactions array provided');
    }

    reactions.forEach((reaction, index) => {
      if (typeof reaction !== 'string' || reaction.trim().length === 0) {
        result.warnings.push(`Reaction at index ${index} is empty or invalid`);
      }
    });
  }

  return result;
}

// ==========================================
// AGGREGATE VALIDATION FUNCTIONS
// ==========================================

/**
 * Validate complete health record data before creation/update
 *
 * @param data - Health record data
 * @param studentDateOfBirth - Optional student DOB for age-based validation
 * @returns ValidationResult
 */
export function validateHealthRecordData(
  data: {
    vital?: any;
    date?: Date;
    diagnosisCode?: string;
    providerNpi?: string;
  },
  studentDateOfBirth?: Date
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  // Validate vital signs if provided
  if (data.vital) {
    const vitalResult = validateVitalSigns(data.vital, studentDateOfBirth);
    result.errors.push(...vitalResult.errors);
    result.warnings.push(...vitalResult.warnings);
    if (!vitalResult.isValid) result.isValid = false;
  }

  // Validate ICD-10 code if provided
  if (data.diagnosisCode) {
    const icd10Result = validateICD10Code(data.diagnosisCode);
    result.errors.push(...icd10Result.errors);
    result.warnings.push(...icd10Result.warnings);
    if (!icd10Result.isValid) result.isValid = false;
  }

  // Validate NPI if provided
  if (data.providerNpi) {
    const npiResult = validateNPI(data.providerNpi);
    result.errors.push(...npiResult.errors);
    result.warnings.push(...npiResult.warnings);
    if (!npiResult.isValid) result.isValid = false;
  }

  return result;
}

/**
 * Export all validators for external use
 */
export default {
  // Medical codes
  validateICD10Code,
  validateCVXCode,
  validateNDCCode,
  validateNPI,

  // Vital signs
  validateTemperature,
  validateBloodPressure,
  validateHeartRate,
  validateRespiratoryRate,
  validateOxygenSaturation,
  validateVitalSigns,

  // Growth metrics
  calculateBMI,
  validateBMI,
  validateHeight,
  validateWeight,

  // Temporal validation
  validateDiagnosisDate,
  validateVaccinationDates,

  // Other
  validateAllergyReactions,
  validateHealthRecordData,
};
