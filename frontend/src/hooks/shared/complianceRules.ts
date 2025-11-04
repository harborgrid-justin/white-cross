/**
 * Healthcare Compliance Rules
 *
 * PHI detection and compliance level determination logic.
 *
 * @module hooks/shared/complianceRules
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type { PHIType, ComplianceLevel } from './complianceTypes';

/**
 * Detect PHI in data
 */
export function detectPHI(data: unknown, enableDetection: boolean = true): PHIType[] {
  if (!enableDetection) return [];

  const phiTypes: PHIType[] = [];
  const dataStr = JSON.stringify(data).toLowerCase();

  // Name patterns
  if (/\b(first_?name|last_?name|full_?name|patient_?name)\b/.test(dataStr)) {
    phiTypes.push('name');
  }

  // Address patterns
  if (/\b(address|street|city|state|zip|postal)\b/.test(dataStr)) {
    phiTypes.push('address');
  }

  // Date patterns
  if (/\b(birth_?date|dob|date_of_birth)\b/.test(dataStr)) {
    phiTypes.push('birth_date');
  }

  // SSN patterns
  if (/\b(ssn|social_security|social_security_number)\b/.test(dataStr)) {
    phiTypes.push('ssn');
  }

  // Medical record patterns
  if (/\b(medical_?record|mrn|chart_?number)\b/.test(dataStr)) {
    phiTypes.push('medical_record');
  }

  // Account number patterns
  if (/\b(account_?number|patient_?id)\b/.test(dataStr)) {
    phiTypes.push('account_number');
  }

  return phiTypes;
}

/**
 * Determine compliance level
 */
export function getComplianceLevel(data: unknown, phiTypes: PHIType[]): ComplianceLevel {
  if (phiTypes.length > 0) {
    return 'phi';
  }

  const dataStr = JSON.stringify(data).toLowerCase();

  // Check for critical safety data
  if (/\b(allergy|medication|dosage|vital_signs|emergency)\b/.test(dataStr)) {
    return 'critical';
  }

  // Check for restricted internal data
  if (/\b(internal|confidential|restricted)\b/.test(dataStr)) {
    return 'restricted';
  }

  // Check for internal business data
  if (/\b(employee|staff|internal_id)\b/.test(dataStr)) {
    return 'internal';
  }

  return 'public';
}

/**
 * Sanitize data for logging (remove PHI)
 */
export function sanitizeForLogging(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = { ...data as Record<string, unknown> };
  const phiFields = [
    'firstName', 'lastName', 'fullName', 'name',
    'address', 'street', 'city', 'state', 'zip',
    'birthDate', 'dob', 'dateOfBirth',
    'ssn', 'socialSecurity', 'socialSecurityNumber',
    'medicalRecord', 'mrn', 'chartNumber',
    'accountNumber', 'patientId'
  ];

  for (const field of phiFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}
