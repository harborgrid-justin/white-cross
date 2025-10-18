/**
 * LOC: 8102259F4B
 * WC-GEN-347 | helpers.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (utils/healthRecords/index.ts)
 */

/**
 * WC-GEN-347 | helpers.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: crypto
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: functions, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Health Records Helper Utilities
 * Common utility functions for health record operations
 */

import crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Unit = 'CM' | 'IN' | 'KG' | 'LB' | 'C' | 'F' | 'ML' | 'OZ';

interface AgeCalculation {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
}

interface MedicalCode {
  code: string;
  type: 'ICD-10' | 'CVX' | 'NDC';
  version?: string;
  isValid: boolean;
  description?: string;
}

// ============================================================================
// UNIT CONVERSION UTILITIES
// ============================================================================

/**
 * Convert between different units of measurement
 * Supports: height (cm/in), weight (kg/lb), temperature (C/F), volume (ml/oz)
 */
export function convertUnits(
  value: number,
  fromUnit: Unit,
  toUnit: Unit
): number {
  // Same unit - no conversion needed
  if (fromUnit === toUnit) {
    return value;
  }

  // Height conversions
  if (fromUnit === 'CM' && toUnit === 'IN') {
    return value / 2.54;
  }
  if (fromUnit === 'IN' && toUnit === 'CM') {
    return value * 2.54;
  }

  // Weight conversions
  if (fromUnit === 'KG' && toUnit === 'LB') {
    return value * 2.20462;
  }
  if (fromUnit === 'LB' && toUnit === 'KG') {
    return value / 2.20462;
  }

  // Temperature conversions
  if (fromUnit === 'C' && toUnit === 'F') {
    return (value * 9/5) + 32;
  }
  if (fromUnit === 'F' && toUnit === 'C') {
    return (value - 32) * 5/9;
  }

  // Volume conversions
  if (fromUnit === 'ML' && toUnit === 'OZ') {
    return value / 29.5735;
  }
  if (fromUnit === 'OZ' && toUnit === 'ML') {
    return value * 29.5735;
  }

  throw new Error(`Conversion from ${fromUnit} to ${toUnit} not supported`);
}

/**
 * Convert multiple measurements at once
 */
export function convertMeasurements(measurements: {
  height?: { value: number; unit: Unit };
  weight?: { value: number; unit: Unit };
  temperature?: { value: number; unit: Unit };
}, targetUnits: {
  height?: Unit;
  weight?: Unit;
  temperature?: Unit;
}): any {
  const converted: any = {};

  if (measurements.height && targetUnits.height) {
    converted.height = {
      value: convertUnits(measurements.height.value, measurements.height.unit, targetUnits.height),
      unit: targetUnits.height,
      originalValue: measurements.height.value,
      originalUnit: measurements.height.unit
    };
  }

  if (measurements.weight && targetUnits.weight) {
    converted.weight = {
      value: convertUnits(measurements.weight.value, measurements.weight.unit, targetUnits.weight),
      unit: targetUnits.weight,
      originalValue: measurements.weight.value,
      originalUnit: measurements.weight.unit
    };
  }

  if (measurements.temperature && targetUnits.temperature) {
    converted.temperature = {
      value: convertUnits(measurements.temperature.value, measurements.temperature.unit, targetUnits.temperature),
      unit: targetUnits.temperature,
      originalValue: measurements.temperature.value,
      originalUnit: measurements.temperature.unit
    };
  }

  return converted;
}

/**
 * Round value to specified decimal places
 */
export function roundToDecimal(value: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ============================================================================
// AGE CALCULATION UTILITIES
// ============================================================================

/**
 * Calculate precise age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string, asOfDate?: Date): AgeCalculation {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = asOfDate || new Date();

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
  const totalMonths = years * 12 + months;

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths
  };
}

/**
 * Get age in years (simple)
 */
export function getAgeInYears(dateOfBirth: Date | string, asOfDate?: Date): number {
  const age = calculateAge(dateOfBirth, asOfDate);
  return age.years;
}

/**
 * Get age in months (for infants/toddlers)
 */
export function getAgeInMonths(dateOfBirth: Date | string, asOfDate?: Date): number {
  const age = calculateAge(dateOfBirth, asOfDate);
  return age.totalMonths;
}

/**
 * Format age for display
 */
export function formatAge(dateOfBirth: Date | string, asOfDate?: Date): string {
  const age = calculateAge(dateOfBirth, asOfDate);

  if (age.years === 0 && age.months === 0) {
    return `${age.days} day${age.days !== 1 ? 's' : ''}`;
  }

  if (age.years === 0) {
    return `${age.months} month${age.months !== 1 ? 's' : ''}`;
  }

  if (age.months === 0) {
    return `${age.years} year${age.years !== 1 ? 's' : ''}`;
  }

  return `${age.years} year${age.years !== 1 ? 's' : ''}, ${age.months} month${age.months !== 1 ? 's' : ''}`;
}

/**
 * Check if patient is pediatric (under 18)
 */
export function isPediatric(dateOfBirth: Date | string): boolean {
  return getAgeInYears(dateOfBirth) < 18;
}

/**
 * Get age category
 */
export function getAgeCategory(dateOfBirth: Date | string): string {
  const ageYears = getAgeInYears(dateOfBirth);
  const ageMonths = getAgeInMonths(dateOfBirth);

  if (ageMonths < 1) return 'Neonate';
  if (ageMonths < 12) return 'Infant';
  if (ageYears < 3) return 'Toddler';
  if (ageYears < 6) return 'Preschool';
  if (ageYears < 12) return 'School Age';
  if (ageYears < 18) return 'Adolescent';
  return 'Adult';
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format a health record for consistent output
 */
export function formatHealthRecord(record: any): any {
  return {
    id: record.id,
    type: record.recordType || record.type,
    date: formatDate(record.recordDate || record.createdAt),
    title: record.title || generateRecordTitle(record),
    summary: generateRecordSummary(record),
    metadata: {
      createdAt: formatDate(record.createdAt),
      updatedAt: formatDate(record.updatedAt),
      createdBy: record.createdBy,
      isConfidential: record.isConfidential || false
    },
    data: sanitizePHI(record, 'display')
  };
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'iso') {
    return d.toISOString();
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // short format
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generate a title for a health record
 */
function generateRecordTitle(record: any): string {
  if (record.vaccineName) {
    return `${record.vaccineName} - Dose ${record.doseNumber}`;
  }

  if (record.allergen) {
    return `${record.allergyType} Allergy: ${record.allergen}`;
  }

  if (record.condition) {
    return `${record.condition}`;
  }

  if (record.screeningType) {
    return `${record.screeningType} Screening`;
  }

  if (record.height || record.weight) {
    return 'Growth Measurement';
  }

  if (record.temperature || record.heartRate) {
    return 'Vital Signs';
  }

  return 'Health Record';
}

/**
 * Generate a summary for a health record
 */
function generateRecordSummary(record: any): string {
  if (record.vaccineName) {
    return `${record.vaccineName} administered on ${formatDate(record.administeredDate)}`;
  }

  if (record.allergen) {
    return `${record.severity} allergy to ${record.allergen}`;
  }

  if (record.condition) {
    return `${record.severity} ${record.condition}`;
  }

  if (record.screeningType) {
    return `${record.screeningType} screening - ${record.outcome}`;
  }

  if (record.height && record.weight) {
    return `Height: ${record.height}${record.heightUnit}, Weight: ${record.weight}${record.weightUnit}`;
  }

  if (record.temperature) {
    return `Temp: ${record.temperature}°${record.temperatureUnit}, HR: ${record.heartRate}, BP: ${record.bloodPressureSystolic}/${record.bloodPressureDiastolic}`;
  }

  return record.description || 'No summary available';
}

// ============================================================================
// PHI SANITIZATION UTILITIES
// ============================================================================

/**
 * Sanitize Protected Health Information (PHI) for logging or display
 * HIPAA compliance requirement
 */
export function sanitizePHI(
  data: any,
  level: 'log' | 'display' | 'export' = 'log'
): any {
  if (!data) return data;

  // For logging - remove all PHI
  if (level === 'log') {
    const sanitized = { ...data };

    // Remove identifying information
    delete sanitized.firstName;
    delete sanitized.lastName;
    delete sanitized.email;
    delete sanitized.phone;
    delete sanitized.address;
    delete sanitized.ssn;
    delete sanitized.medicalRecordNumber;
    delete sanitized.dateOfBirth;

    // Keep IDs for debugging
    return {
      id: sanitized.id,
      type: sanitized.type || sanitized.recordType,
      timestamp: sanitized.createdAt || sanitized.recordDate
    };
  }

  // For display - mask sensitive data
  if (level === 'display') {
    const sanitized = { ...data };

    if (sanitized.ssn) {
      sanitized.ssn = `***-**-${sanitized.ssn.slice(-4)}`;
    }

    if (sanitized.medicalRecordNumber) {
      sanitized.medicalRecordNumber = `***${sanitized.medicalRecordNumber.slice(-4)}`;
    }

    return sanitized;
  }

  // For export - include all data with metadata
  return {
    ...data,
    exportedAt: new Date().toISOString(),
    exportCompliance: 'HIPAA_COMPLIANT'
  };
}

/**
 * Mask sensitive information
 */
export function maskSensitiveData(value: string, visibleChars: number = 4): string {
  if (!value || value.length <= visibleChars) {
    return '****';
  }

  const masked = '*'.repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
}

/**
 * Check if data contains PHI
 */
export function containsPHI(data: any): boolean {
  const phiFields = [
    'ssn',
    'medicalRecordNumber',
    'dateOfBirth',
    'address',
    'email',
    'phone',
    'insurance'
  ];

  return Object.keys(data).some(key => phiFields.includes(key));
}

// ============================================================================
// ID GENERATION UTILITIES
// ============================================================================

/**
 * Generate a unique health record ID
 */
export function generateHealthRecordId(prefix: string = 'HR'): string {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(4).toString('hex');
  return `${prefix}-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Generate a medical record number (MRN)
 */
export function generateMedicalRecordNumber(): string {
  // Format: XXX-XXX-XXXX
  const part1 = Math.floor(Math.random() * 900) + 100;
  const part2 = Math.floor(Math.random() * 900) + 100;
  const part3 = Math.floor(Math.random() * 9000) + 1000;

  return `${part1}-${part2}-${part3}`;
}

/**
 * Generate a batch ID for bulk operations
 */
export function generateBatchId(): string {
  return `BATCH-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`.toUpperCase();
}

// ============================================================================
// MEDICAL CODE PARSING UTILITIES
// ============================================================================

/**
 * Parse and validate medical codes (ICD-10, CVX, NDC)
 */
export function parseMedicalCodes(
  code: string,
  type: 'ICD-10' | 'CVX' | 'NDC'
): MedicalCode {
  const result: MedicalCode = {
    code: code.trim().toUpperCase(),
    type,
    isValid: false
  };

  switch (type) {
    case 'ICD-10':
      result.isValid = validateICD10Code(code);
      result.version = '2024';
      break;

    case 'CVX':
      result.isValid = validateCVXCode(code);
      break;

    case 'NDC':
      result.isValid = validateNDCCode(code);
      break;
  }

  return result;
}

/**
 * Validate ICD-10 code format
 */
export function validateICD10Code(code: string): boolean {
  // ICD-10 format: Letter followed by 2 digits, optional decimal and 1-4 more characters
  // Examples: A09, E11.9, S72.001A
  const icd10Pattern = /^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/;
  return icd10Pattern.test(code.trim().toUpperCase());
}

/**
 * Validate CVX code format
 */
export function validateCVXCode(code: string): boolean {
  // CVX codes are 1-3 digit numbers
  const cvxPattern = /^[0-9]{1,3}$/;
  return cvxPattern.test(code.trim());
}

/**
 * Validate NDC code format
 */
export function validateNDCCode(code: string): boolean {
  // NDC format: 5-4-2 (e.g., 12345-1234-12)
  const ndcPattern = /^[0-9]{5}-[0-9]{4}-[0-9]{2}$/;
  return ndcPattern.test(code.trim());
}

/**
 * Format ICD-10 code consistently
 */
export function formatICD10Code(code: string): string {
  const cleaned = code.replace(/[^A-Z0-9.]/gi, '').toUpperCase();

  // Add decimal if missing
  if (cleaned.length > 3 && !cleaned.includes('.')) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  }

  return cleaned;
}

/**
 * Format NDC code consistently
 */
export function formatNDCCode(code: string): string {
  const cleaned = code.replace(/[^0-9]/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9, 11)}`;
  }

  return code;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate date is not in the future
 */
export function isValidPastDate(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d <= new Date();
}

/**
 * Validate date is in the future
 */
export function isValidFutureDate(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate: Date | string, endDate: Date | string): boolean {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return start < end;
}

/**
 * Validate realistic value ranges
 */
export function isRealisticValue(value: number, type: string): boolean {
  const ranges: Record<string, { min: number; max: number }> = {
    height_cm: { min: 40, max: 250 },
    height_in: { min: 15, max: 100 },
    weight_kg: { min: 2, max: 500 },
    weight_lb: { min: 4, max: 1100 },
    temperature_c: { min: 35, max: 42 },
    temperature_f: { min: 95, max: 108 },
    heart_rate: { min: 40, max: 200 },
    bp_systolic: { min: 60, max: 200 },
    bp_diastolic: { min: 40, max: 130 },
    oxygen_sat: { min: 70, max: 100 },
    bmi: { min: 10, max: 60 }
  };

  const range = ranges[type];
  if (!range) return true;

  return value >= range.min && value <= range.max;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalize first letter of each word
 */
export function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Clean and normalize text
 */
export function normalizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.-]/g, '');
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Remove duplicates from array
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Sort by date field
 */
export function sortByDate<T>(array: T[], dateField: keyof T, order: 'asc' | 'desc' = 'desc'): T[] {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateField] as any).getTime();
    const dateB = new Date(b[dateField] as any).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
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
};
