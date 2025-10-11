/**
 * Protected Health Information (PHI) Type System
 * Branded types and type guards for HIPAA-compliant data handling
 *
 * HIPAA Compliance: Ensures PHI is handled with proper safeguards at type level
 * Security: Prevents accidental PHI exposure through type system
 */

/**
 * Branded type for PHI data
 * Compiler enforces special handling of PHI-marked data
 */
export type PHI<T> = T & { readonly __brand: 'PHI' };

/**
 * Branded type for Personally Identifiable Information (PII)
 */
export type PII<T> = T & { readonly __brand: 'PII' };

/**
 * Medical code types with validation
 */
export type ICD10Code = string & { readonly __brand: 'ICD10Code' };
export type CPTCode = string & { readonly __brand: 'CPTCode' };
export type NDCCode = string & { readonly __brand: 'NDCCode' };
export type CVXCode = string & { readonly __brand: 'CVXCode' };
export type LOINCCode = string & { readonly __brand: 'LOINCCode' };
export type NPICode = string & { readonly __brand: 'NPICode' };

/**
 * Medical measurement types
 */
export interface Dosage {
  amount: number;
  unit: 'mg' | 'ml' | 'mcg' | 'g' | 'tablet' | 'capsule' | 'puff' | 'drop' | 'unit';
  frequency?: string;
  route?: 'oral' | 'topical' | 'injection' | 'inhaled' | 'nasal' | 'rectal' | 'sublingual';
}

export interface VitalSignMeasurement {
  temperature?: {
    value: number;
    unit: 'F' | 'C';
  };
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    unit: 'mmHg';
  };
  heartRate?: {
    value: number;
    unit: 'bpm';
  };
  respiratoryRate?: {
    value: number;
    unit: 'breaths/min';
  };
  oxygenSaturation?: {
    value: number;
    unit: '%';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'lb';
  };
  height?: {
    value: number;
    unit: 'cm' | 'in';
  };
}

/**
 * Type guard for PHI data
 * Runtime check to verify PHI marking
 */
export function isPHI<T>(value: unknown): value is PHI<T> {
  return typeof value === 'object' &&
         value !== null &&
         '__brand' in value &&
         (value as any).__brand === 'PHI';
}

/**
 * Type guard for PII data
 */
export function isPII<T>(value: unknown): value is PII<T> {
  return typeof value === 'object' &&
         value !== null &&
         '__brand' in value &&
         (value as any).__brand === 'PII';
}

/**
 * Mark data as PHI
 * Use when data contains Protected Health Information
 */
export function markAsPHI<T>(data: T): PHI<T> {
  if (typeof data === 'object' && data !== null) {
    return { ...data, __brand: 'PHI' as const } as PHI<T>;
  }
  return data as PHI<T>;
}

/**
 * Mark data as PII
 * Use when data contains Personally Identifiable Information
 */
export function markAsPII<T>(data: T): PII<T> {
  if (typeof data === 'object' && data !== null) {
    return { ...data, __brand: 'PII' as const } as PII<T>;
  }
  return data as PII<T>;
}

/**
 * Redact PHI from data for logging
 * Replaces sensitive fields with [REDACTED]
 */
export function redactPHI<T extends Record<string, any>>(
  data: T,
  fieldsToRedact: (keyof T)[]
): T {
  const redacted = { ...data };

  for (const field of fieldsToRedact) {
    if (field in redacted) {
      redacted[field] = '[REDACTED]' as any;
    }
  }

  return redacted;
}

/**
 * Safe logging wrapper for PHI data
 * Automatically redacts sensitive fields
 */
export interface SafeLogData {
  context: string;
  action: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  // PHI fields are NOT included
}

export function createSafeLogData(
  context: string,
  action: string,
  metadata?: {
    userId?: string;
    entityType?: string;
    entityId?: string;
  }
): SafeLogData {
  return {
    context,
    action,
    userId: metadata?.userId,
    entityType: metadata?.entityType,
    entityId: metadata?.entityId
  };
}

/**
 * ICD-10 Code validation and creation
 * Format: A00.0 to Z99.9
 */
export function createICD10Code(code: string): ICD10Code | null {
  const icd10Pattern = /^[A-Z]\d{2}(\.\d{1,2})?$/;

  if (!icd10Pattern.test(code)) {
    return null;
  }

  return code as ICD10Code;
}

/**
 * Validate ICD-10 code
 */
export function isValidICD10Code(code: string): code is ICD10Code {
  return createICD10Code(code) !== null;
}

/**
 * CPT Code validation and creation
 * Format: 5-digit numeric code
 */
export function createCPTCode(code: string): CPTCode | null {
  const cptPattern = /^\d{5}$/;

  if (!cptPattern.test(code)) {
    return null;
  }

  return code as CPTCode;
}

/**
 * NDC Code validation and creation
 * Format: 5-4-2 or 5-4-1 or 5-3-2
 */
export function createNDCCode(code: string): NDCCode | null {
  const ndcPattern = /^\d{5}-\d{3,4}-\d{1,2}$/;

  if (!ndcPattern.test(code)) {
    return null;
  }

  return code as NDCCode;
}

/**
 * CVX Code validation and creation
 * Format: 2-3 digit numeric code (CDC vaccine codes)
 */
export function createCVXCode(code: string): CVXCode | null {
  const cvxPattern = /^\d{2,3}$/;

  if (!cvxPattern.test(code)) {
    return null;
  }

  return code as CVXCode;
}

/**
 * LOINC Code validation and creation
 * Format: 5-7 digits, dash, 1-2 digits
 */
export function createLOINCCode(code: string): LOINCCode | null {
  const loincPattern = /^\d{5,7}-\d{1,2}$/;

  if (!loincPattern.test(code)) {
    return null;
  }

  return code as LOINCCode;
}

/**
 * NPI Code validation and creation
 * Format: 10-digit numeric (National Provider Identifier)
 */
export function createNPICode(code: string): NPICode | null {
  const npiPattern = /^\d{10}$/;

  if (!npiPattern.test(code)) {
    return null;
  }

  // Validate NPI checksum (Luhn algorithm)
  if (!validateNPIChecksum(code)) {
    return null;
  }

  return code as NPICode;
}

/**
 * Validate NPI checksum using Luhn algorithm
 */
function validateNPIChecksum(npi: string): boolean {
  // Add prefix 80840 to the 10-digit NPI
  const fullNPI = '80840' + npi;

  let sum = 0;
  let alternate = false;

  // Process from right to left
  for (let i = fullNPI.length - 1; i >= 0; i--) {
    let digit = parseInt(fullNPI[i], 10);

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

/**
 * Dosage validation and creation
 */
export function createDosage(
  amount: number,
  unit: Dosage['unit'],
  frequency?: string,
  route?: Dosage['route']
): Dosage | null {
  if (amount <= 0) {
    return null;
  }

  return {
    amount,
    unit,
    frequency,
    route
  };
}

/**
 * Validate dosage amount is within safe limits
 */
export function validateDosageRange(
  dosage: Dosage,
  minAmount: number,
  maxAmount: number
): boolean {
  return dosage.amount >= minAmount && dosage.amount <= maxAmount;
}

/**
 * PHI-safe string representation
 * Returns sanitized string for PHI data (for logging, display)
 */
export function phiToSafeString(phi: PHI<any>): string {
  return '[PHI:REDACTED]';
}

/**
 * Check if field name indicates PHI
 * Helper for automatic PHI detection
 */
export function isLikelyPHIField(fieldName: string): boolean {
  const phiKeywords = [
    'ssn',
    'social',
    'diagnosis',
    'treatment',
    'medication',
    'allergy',
    'condition',
    'prescription',
    'medical',
    'health',
    'patient',
    'symptom',
    'test',
    'result',
    'vital',
    'immunization',
    'vaccination',
    'procedure',
    'surgery',
    'disability',
    'mental',
    'genetic',
    'biometric'
  ];

  const lowerFieldName = fieldName.toLowerCase();

  return phiKeywords.some(keyword => lowerFieldName.includes(keyword));
}

/**
 * PHI access context
 * Required context for accessing PHI data
 */
export interface PHIAccessContext {
  userId: string;
  userRole: string;
  purpose: 'treatment' | 'payment' | 'operations' | 'research' | 'legal';
  ipAddress: string;
  timestamp: Date;
  reason?: string;
}

/**
 * Validate PHI access context
 * Ensures all required fields are present
 */
export function validatePHIAccessContext(context: Partial<PHIAccessContext>): context is PHIAccessContext {
  return !!(
    context.userId &&
    context.userRole &&
    context.purpose &&
    context.ipAddress &&
    context.timestamp
  );
}

/**
 * De-identification levels per HIPAA Safe Harbor
 */
export type DeIdentificationLevel = 'none' | 'limited' | 'full';

/**
 * De-identify PHI data according to HIPAA Safe Harbor method
 */
export interface DeIdentifiedData<T> {
  data: Partial<T>;
  level: DeIdentificationLevel;
  removedFields: string[];
  deIdentifiedAt: Date;
}

export function deIdentifyPHI<T extends Record<string, any>>(
  data: T,
  level: DeIdentificationLevel
): DeIdentifiedData<T> {
  const removedFields: string[] = [];
  const deIdentified: Partial<T> = { ...data };

  // HIPAA Safe Harbor - 18 identifiers to remove
  const identifiersToRemove = [
    'name',
    'firstName',
    'lastName',
    'address',
    'city',
    'state',
    'zip',
    'dateOfBirth',
    'phone',
    'fax',
    'email',
    'ssn',
    'medicalRecordNumber',
    'healthPlanNumber',
    'accountNumber',
    'certificateNumber',
    'vehicleIdentifier',
    'deviceIdentifier',
    'ipAddress',
    'biometricIdentifier',
    'photoUrl',
    'fullFacePhoto'
  ];

  if (level === 'limited' || level === 'full') {
    // Remove direct identifiers
    for (const field of identifiersToRemove) {
      if (field in deIdentified) {
        delete deIdentified[field as keyof T];
        removedFields.push(field);
      }
    }
  }

  if (level === 'full') {
    // Also remove dates (keep only year)
    for (const [key, value] of Object.entries(deIdentified)) {
      if (value instanceof Date) {
        (deIdentified as any)[key] = value.getFullYear();
        removedFields.push(key);
      }
    }
  }

  return {
    data: deIdentified,
    level,
    removedFields,
    deIdentifiedAt: new Date()
  };
}

/**
 * PHI encryption marker
 * Indicates data should be encrypted at rest
 */
export type Encrypted<T> = T & { readonly __encrypted: true };

export function markAsEncrypted<T>(data: T): Encrypted<T> {
  return data as Encrypted<T>;
}

export function isEncrypted<T>(data: unknown): data is Encrypted<T> {
  return typeof data === 'object' &&
         data !== null &&
         '__encrypted' in data &&
         (data as any).__encrypted === true;
}

export default {
  isPHI,
  isPII,
  markAsPHI,
  markAsPII,
  redactPHI,
  createSafeLogData,
  createICD10Code,
  createCPTCode,
  createNDCCode,
  createCVXCode,
  createLOINCCode,
  createNPICode,
  createDosage,
  validateDosageRange,
  phiToSafeString,
  isLikelyPHIField,
  validatePHIAccessContext,
  deIdentifyPHI,
  markAsEncrypted,
  isEncrypted
};
