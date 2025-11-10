/**
 * Healthcare Validation Decorators
 *
 * Specialized validation decorators for healthcare and HIPAA-compliant data.
 * Validates Medical Record Numbers (MRN), National Provider Identifiers (NPI),
 * ICD-10 codes, CPT codes, and provider taxonomy codes.
 *
 * Decorators:
 * - @IsMRN() - Medical Record Number
 * - @IsNPI() - National Provider Identifier (10 digits)
 * - @IsICD10() - ICD-10 diagnosis codes
 * - @IsCPT() - CPT procedure codes
 * - @IsTaxonomy() - Provider taxonomy codes
 *
 * @module validators/healthcare
 * @version 1.0.0
 * @compliance HIPAA
 */

import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';

// ============================================================================
// Custom Validators
// ============================================================================

/**
 * Validates Medical Record Number (MRN)
 * Format: 6-10 alphanumeric characters
 */
@ValidatorConstraint({ name: 'isMRN', async: false })
export class IsMRNConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // MRN: 6-10 alphanumeric characters
    const mrnPattern = /^[A-Z0-9]{6,10}$/i;
    return mrnPattern.test(value);
  }

  defaultMessage(): string {
    return 'Medical Record Number must be 6-10 alphanumeric characters';
  }
}

/**
 * Validates National Provider Identifier (NPI)
 * Format: Exactly 10 digits with valid Luhn check digit
 */
@ValidatorConstraint({ name: 'isNPI', async: false })
export class IsNPIConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // NPI must be exactly 10 digits
    if (!/^\d{10}$/.test(value)) return false;

    // Validate using Luhn algorithm
    return this.validateLuhn(value);
  }

  /**
   * Validate NPI using Luhn algorithm (mod-10 check digit)
   */
  private validateLuhn(npi: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    // Process digits from right to left
    for (let i = npi.length - 1; i >= 0; i--) {
      let digit = parseInt(npi[i], 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  defaultMessage(): string {
    return 'National Provider Identifier must be a valid 10-digit NPI';
  }
}

/**
 * Validates ICD-10 diagnosis codes
 * Format: Letter followed by 2 digits, optional dot, optional 1-4 more characters
 * Examples: A00, A00.0, A00.01, Z99.89
 */
@ValidatorConstraint({ name: 'isICD10', async: false })
export class IsICD10Constraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // ICD-10 pattern: Letter + 2 digits + optional (. + 1-4 characters)
    const icd10Pattern = /^[A-Z]\d{2}(\.\d{1,4})?$/i;
    return icd10Pattern.test(value);
  }

  defaultMessage(): string {
    return 'ICD-10 code must be in format A00 or A00.0 (letter followed by 2 digits, optional decimal and 1-4 digits)';
  }
}

/**
 * Validates CPT (Current Procedural Terminology) codes
 * Format: 5 digits (00000-99999)
 */
@ValidatorConstraint({ name: 'isCPT', async: false })
export class IsCPTConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // CPT code: exactly 5 digits
    const cptPattern = /^\d{5}$/;
    return cptPattern.test(value);
  }

  defaultMessage(): string {
    return 'CPT code must be exactly 5 digits (e.g., 99213)';
  }
}

/**
 * Validates Provider Taxonomy codes
 * Format: 10 characters (XXXXXXXXXX) - alphanumeric
 * Standard: National Uniform Claim Committee (NUCC)
 */
@ValidatorConstraint({ name: 'isTaxonomy', async: false })
export class IsTaxonomyConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;

    // Taxonomy code: exactly 10 alphanumeric characters
    const taxonomyPattern = /^[A-Z0-9]{10}$/i;
    return taxonomyPattern.test(value);
  }

  defaultMessage(): string {
    return 'Provider taxonomy code must be exactly 10 alphanumeric characters (NUCC standard)';
  }
}

// ============================================================================
// Decorator Functions
// ============================================================================

/**
 * Validates Medical Record Number (MRN)
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @IsMRN()
 *   medicalRecordNumber: string;
 * }
 * ```
 */
export function IsMRN(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsMRNConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'Medical Record Number (6-10 alphanumeric characters)',
      example: 'MRN123456',
      minLength: 6,
      maxLength: 10,
      pattern: '^[A-Z0-9]{6,10}$',
    }),
  );
}

/**
 * Validates National Provider Identifier (NPI)
 *
 * @example
 * ```typescript
 * class ProviderDto {
 *   @IsNPI()
 *   npiNumber: string;
 * }
 * ```
 */
export function IsNPI(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsNPIConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'National Provider Identifier (10-digit NPI with Luhn check)',
      example: '1234567893',
      minLength: 10,
      maxLength: 10,
      pattern: '^\\d{10}$',
    }),
  );
}

/**
 * Validates ICD-10 diagnosis code
 *
 * @example
 * ```typescript
 * class DiagnosisDto {
 *   @IsICD10()
 *   diagnosisCode: string;
 * }
 * ```
 */
export function IsICD10(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsICD10Constraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'ICD-10 diagnosis code',
      example: 'Z99.89',
      pattern: '^[A-Z]\\d{2}(\\.\\d{1,4})?$',
    }),
  );
}

/**
 * Validates CPT procedure code
 *
 * @example
 * ```typescript
 * class ProcedureDto {
 *   @IsCPT()
 *   procedureCode: string;
 * }
 * ```
 */
export function IsCPT(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsCPTConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'CPT procedure code (5 digits)',
      example: '99213',
      minLength: 5,
      maxLength: 5,
      pattern: '^\\d{5}$',
    }),
  );
}

/**
 * Validates provider taxonomy code (NUCC standard)
 *
 * @example
 * ```typescript
 * class ProviderDto {
 *   @IsTaxonomy()
 *   taxonomyCode: string;
 * }
 * ```
 */
export function IsTaxonomy(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    Validate(IsTaxonomyConstraint, validationOptions),
    ApiProperty({
      type: String,
      description: 'Provider taxonomy code (NUCC standard, 10 alphanumeric characters)',
      example: '207Q00000X',
      minLength: 10,
      maxLength: 10,
      pattern: '^[A-Z0-9]{10}$',
    }),
  );
}

// ============================================================================
// Healthcare-Specific Constants
// ============================================================================

/**
 * Common ICD-10 chapter ranges for validation
 */
export const ICD10_CHAPTERS = {
  INFECTIOUS_DISEASES: { start: 'A00', end: 'B99' },
  NEOPLASMS: { start: 'C00', end: 'D49' },
  BLOOD_DISORDERS: { start: 'D50', end: 'D89' },
  ENDOCRINE_DISORDERS: { start: 'E00', end: 'E89' },
  MENTAL_DISORDERS: { start: 'F01', end: 'F99' },
  NERVOUS_SYSTEM: { start: 'G00', end: 'G99' },
  EYE: { start: 'H00', end: 'H59' },
  EAR: { start: 'H60', end: 'H95' },
  CIRCULATORY_SYSTEM: { start: 'I00', end: 'I99' },
  RESPIRATORY_SYSTEM: { start: 'J00', end: 'J99' },
  DIGESTIVE_SYSTEM: { start: 'K00', end: 'K95' },
  SKIN: { start: 'L00', end: 'L99' },
  MUSCULOSKELETAL: { start: 'M00', end: 'M99' },
  GENITOURINARY: { start: 'N00', end: 'N99' },
  PREGNANCY: { start: 'O00', end: 'O9A' },
  PERINATAL: { start: 'P00', end: 'P96' },
  CONGENITAL: { start: 'Q00', end: 'Q99' },
  SYMPTOMS: { start: 'R00', end: 'R99' },
  INJURY: { start: 'S00', end: 'T88' },
  EXTERNAL_CAUSES: { start: 'V00', end: 'Y99' },
  HEALTH_STATUS: { start: 'Z00', end: 'Z99' },
};

/**
 * Common CPT code ranges
 */
export const CPT_CATEGORIES = {
  EVALUATION_MANAGEMENT: { start: '99201', end: '99499' },
  ANESTHESIA: { start: '00100', end: '01999' },
  SURGERY: { start: '10000', end: '69990' },
  RADIOLOGY: { start: '70000', end: '79999' },
  PATHOLOGY_LABORATORY: { start: '80000', end: '89999' },
  MEDICINE: { start: '90000', end: '99607' },
};
