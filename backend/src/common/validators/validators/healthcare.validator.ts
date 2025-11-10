/**
 * @fileoverview Healthcare Validation Utilities
 * @module common/validators/validators/healthcare
 * @description Utility functions for healthcare data validation
 */

import { HEALTHCARE_PATTERNS } from '../../../middleware/core/types/validation.types';

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  return HEALTHCARE_PATTERNS.PHONE.test(phone);
}

/**
 * Normalize phone number to standard format
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digits except + at start
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Extract digits
  const match = cleaned.match(/^(\+?1)?(\d{3})(\d{3})(\d{4})$/);

  if (!match) return phone;

  const [, countryCode, area, prefix, line] = match;

  // Format as (555) 123-4567
  return `(${area}) ${prefix}-${line}`;
}

/**
 * Validate SSN
 */
export function isValidSSN(ssn: string): boolean {
  return HEALTHCARE_PATTERNS.SSN.test(ssn);
}

/**
 * Mask SSN for display (XXX-XX-1234)
 */
export function maskSSN(ssn: string): string {
  const cleaned = ssn.replace(/-/g, '');
  if (cleaned.length !== 9) return '***-**-****';

  return `***-**-${cleaned.substring(5)}`;
}

/**
 * Validate Medical Record Number
 */
export function isValidMRN(mrn: string): boolean {
  return HEALTHCARE_PATTERNS.MRN.test(mrn);
}

/**
 * Validate NPI with Luhn checksum
 */
export function isValidNPI(npi: string): boolean {
  if (!/^\d{10}$/.test(npi)) return false;

  // Luhn algorithm
  const fullNumber = '80840' + npi.substring(0, 9);
  let sum = 0;
  let shouldDouble = true;

  for (let i = fullNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(fullNumber[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(npi[9], 10);
}

/**
 * Validate ICD-10 code
 */
export function isValidICD10(code: string): boolean {
  return HEALTHCARE_PATTERNS.ICD10.test(code);
}

/**
 * Validate medication dosage
 */
export function isValidDosage(dosage: string): boolean {
  return HEALTHCARE_PATTERNS.DOSAGE.test(dosage);
}

/**
 * Parse dosage into amount and unit
 */
export function parseDosage(
  dosage: string,
): { amount: number; unit: string } | null {
  const match = dosage.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)$/);
  if (!match) return null;

  return {
    amount: parseFloat(match[1]),
    unit: match[2],
  };
}

/**
 * Validate date is in HIPAA-compliant format
 */
export function isValidHIPAADate(date: string): boolean {
  // YYYY-MM-DD format
  if (!HEALTHCARE_PATTERNS.DATE.test(date)) return false;

  // Validate it's a real date
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
}

/**
 * Validate age is within acceptable range for student
 */
export function isValidStudentAge(age: number): boolean {
  return age >= 3 && age <= 22; // K-12 + early childhood + special ed
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Validate blood type
 */
export function isValidBloodType(bloodType: string): boolean {
  const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validTypes.includes(bloodType.toUpperCase());
}

/**
 * Validate temperature value (in Fahrenheit)
 */
export function isValidTemperature(
  temp: number,
  unit: 'F' | 'C' = 'F',
): boolean {
  if (unit === 'F') {
    return temp >= 95.0 && temp <= 108.0; // Normal range + fever range
  } else {
    return temp >= 35.0 && temp <= 42.0; // Celsius equivalent
  }
}

/**
 * Validate heart rate (bpm)
 */
export function isValidHeartRate(bpm: number, age?: number): boolean {
  // Age-specific ranges
  if (age !== undefined) {
    if (age < 1) return bpm >= 80 && bpm <= 180; // Infant
    if (age < 12) return bpm >= 70 && bpm <= 130; // Child
    if (age < 18) return bpm >= 60 && bpm <= 120; // Adolescent
  }

  // Adult range
  return bpm >= 40 && bpm <= 200;
}

/**
 * Validate blood pressure
 */
export function isValidBloodPressure(
  systolic: number,
  diastolic: number,
): { valid: boolean; warning?: string } {
  if (systolic < 60 || systolic > 250) {
    return { valid: false, warning: 'Systolic out of measurable range' };
  }

  if (diastolic < 40 || diastolic > 150) {
    return { valid: false, warning: 'Diastolic out of measurable range' };
  }

  if (systolic <= diastolic) {
    return { valid: false, warning: 'Systolic must be greater than diastolic' };
  }

  // Check for hypertensive crisis
  if (systolic >= 180 || diastolic >= 120) {
    return {
      valid: true,
      warning: 'Hypertensive crisis - immediate attention required',
    };
  }

  return { valid: true };
}

/**
 * Validate weight (in pounds)
 */
export function isValidWeight(pounds: number, age?: number): boolean {
  if (pounds <= 0 || pounds > 500) return false;

  if (age !== undefined) {
    if (age < 1 && pounds > 30) return false; // Infant
    if (age < 12 && pounds > 200) return false; // Child
  }

  return true;
}

/**
 * Validate height (in inches)
 */
export function isValidHeight(inches: number, age?: number): boolean {
  if (inches <= 0 || inches > 96) return false; // 8 feet max

  if (age !== undefined) {
    if (age < 1 && inches > 36) return false; // Infant
    if (age < 12 && inches > 72) return false; // Child
  }

  return true;
}
