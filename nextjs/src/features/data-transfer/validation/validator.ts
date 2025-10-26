/**
 * Data Validation Engine
 *
 * Multi-layer validation system for import data with healthcare-specific
 * validation rules, cross-field validation, and HIPAA compliance checks.
 */

import {
  type FieldValidator,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidationSchema,
  type EntityType,
} from '../types';

// ============================================================================
// Validation Engine
// ============================================================================

export class DataValidator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  /**
   * Validates a single row of data
   */
  validate(data: Record<string, unknown>, rowNumber?: number): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate each field according to rules
    for (const rule of this.schema.rules) {
      const value = data[rule.field];

      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: rule.field,
          row: rowNumber,
          code: 'REQUIRED_FIELD',
          message: `Field "${rule.field}" is required`,
          value,
        });
        continue;
      }

      // Skip validation if field is not required and empty
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Run validators
      for (const validator of rule.validators) {
        const result = this.validateField(value, validator, rule.field, rowNumber);
        errors.push(...result.errors);
        warnings.push(...result.warnings);
      }
    }

    // Run custom validators
    if (this.schema.customValidators) {
      for (const customValidator of this.schema.customValidators) {
        const result = customValidator.fn(data);
        errors.push(...result.errors);
        warnings.push(...result.warnings);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates a batch of rows
   */
  validateBatch(rows: Array<Record<string, unknown>>): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];

    rows.forEach((row, index) => {
      const result = this.validate(row, index + 1);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    });

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  /**
   * Validates a single field value
   */
  private validateField(
    value: unknown,
    validator: FieldValidator,
    fieldName: string,
    rowNumber?: number
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    switch (validator.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          errors.push({
            field: fieldName,
            row: rowNumber,
            code: 'REQUIRED',
            message: `Field "${fieldName}" is required`,
            value,
          });
        }
        break;

      case 'email':
        if (typeof value === 'string' && !this.isValidEmail(value)) {
          errors.push({
            field: fieldName,
            row: rowNumber,
            code: 'INVALID_EMAIL',
            message: `Invalid email format in field "${fieldName}"`,
            value,
          });
        }
        break;

      case 'phone':
        if (typeof value === 'string' && !this.isValidPhone(value)) {
          errors.push({
            field: fieldName,
            row: rowNumber,
            code: 'INVALID_PHONE',
            message: `Invalid phone number format in field "${fieldName}"`,
            value,
          });
        }
        break;

      case 'date':
        if (!this.isValidDate(value, validator.format)) {
          errors.push({
            field: fieldName,
            row: rowNumber,
            code: 'INVALID_DATE',
            message: `Invalid date format in field "${fieldName}"${
              validator.format ? ` (expected: ${validator.format})` : ''
            }`,
            value,
          });
        }
        break;

      case 'number':
        const num = typeof value === 'number' ? value : Number(value);
        if (isNaN(num)) {
          errors.push({
            field: fieldName,
            row: rowNumber,
            code: 'INVALID_NUMBER',
            message: `Invalid number in field "${fieldName}"`,
            value,
          });
        } else {
          if (validator.min !== undefined && num < validator.min) {
            errors.push({
              field: fieldName,
              row: rowNumber,
              code: 'NUMBER_TOO_SMALL',
              message: `Value in field "${fieldName}" is less than minimum (${validator.min})`,
              value,
            });
          }
          if (validator.max !== undefined && num > validator.max) {
            errors.push({
              field: fieldName,
              row: rowNumber,
              code: 'NUMBER_TOO_LARGE',
              message: `Value in field "${fieldName}" exceeds maximum (${validator.max})`,
              value,
            });
          }
        }
        break;

      case 'length':
        if (typeof value === 'string') {
          if (validator.min !== undefined && value.length < validator.min) {
            errors.push({
              field: fieldName,
              row: rowNumber,
              code: 'STRING_TOO_SHORT',
              message: `Field "${fieldName}" is shorter than minimum length (${validator.min})`,
              value,
            });
          }
          if (validator.max !== undefined && value.length > validator.max) {
            errors.push({
              field: fieldName,
              row: rowNumber,
              code: 'STRING_TOO_LONG',
              message: `Field "${fieldName}" exceeds maximum length (${validator.max})`,
              value,
            });
          }
        }
        break;

      case 'regex':
        if (typeof value === 'string') {
          const regex = new RegExp(validator.pattern);
          if (!regex.test(value)) {
            errors.push({
              field: fieldName,
              row: rowNumber,
              code: 'REGEX_MISMATCH',
              message: `Field "${fieldName}" does not match required pattern`,
              value,
            });
          }
        }
        break;

      case 'enum':
        if (!validator.values.includes(String(value))) {
          errors.push({
            field: fieldName,
            row: rowNumber,
            code: 'INVALID_ENUM',
            message: `Field "${fieldName}" must be one of: ${validator.values.join(', ')}`,
            value,
          });
        }
        break;

      case 'custom':
        try {
          if (!validator.fn(value)) {
            errors.push({
              field: fieldName,
              row: rowNumber,
              code: 'CUSTOM_VALIDATION_FAILED',
              message: validator.message,
              value,
            });
          }
        } catch (error) {
          errors.push({
            field: fieldName,
            row: rowNumber,
            code: 'VALIDATION_ERROR',
            message: `Validation error in field "${fieldName}": ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            value,
          });
        }
        break;
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Phone number validation (US format)
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  }

  /**
   * Date validation
   */
  private isValidDate(value: unknown, format?: string): boolean {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }

    if (typeof value === 'string') {
      // If format is specified, validate against it
      if (format) {
        return this.validateDateFormat(value, format);
      }

      // Try to parse as ISO date
      const date = new Date(value);
      return !isNaN(date.getTime());
    }

    return false;
  }

  /**
   * Validates date against specific format
   */
  private validateDateFormat(dateStr: string, format: string): boolean {
    // Simple format validation - can be extended
    const formats: Record<string, RegExp> = {
      'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
      'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
      'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
      'YYYY/MM/DD': /^\d{4}\/\d{2}\/\d{2}$/,
    };

    const regex = formats[format];
    if (!regex) {
      return false;
    }

    return regex.test(dateStr) && !isNaN(new Date(dateStr).getTime());
  }
}

// ============================================================================
// Healthcare-Specific Validators
// ============================================================================

/**
 * Validates SSN format and checksum
 */
export function validateSSN(ssn: string): boolean {
  // Format: XXX-XX-XXXX
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  if (!ssnRegex.test(ssn)) {
    return false;
  }

  // Additional validation: no all-zeros in any group
  const [area, group, serial] = ssn.split('-');
  if (area === '000' || group === '00' || serial === '0000') {
    return false;
  }

  // Area code 666 is not valid
  if (area === '666') {
    return false;
  }

  // Area codes 900-999 are not valid
  if (parseInt(area) >= 900) {
    return false;
  }

  return true;
}

/**
 * Validates NPI (National Provider Identifier)
 */
export function validateNPI(npi: string): boolean {
  if (!/^\d{10}$/.test(npi)) {
    return false;
  }

  // Luhn algorithm check
  const digits = npi.split('').map(Number);
  let sum = 0;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if ((digits.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  return sum % 10 === 0;
}

/**
 * Validates ICD-10 code format
 */
export function validateICD10(code: string): boolean {
  // Format: A00.0 to Z99.9999
  const icd10Regex = /^[A-Z]\d{2}(\.\d{1,4})?$/;
  return icd10Regex.test(code);
}

/**
 * Validates medication dosage format
 */
export function validateDosage(dosage: string): boolean {
  const dosageRegex = /^\d+(\.\d+)?\s*(mg|g|ml|mcg|units?)$/i;
  return dosageRegex.test(dosage);
}

/**
 * Validates date of birth (not in future, reasonable past)
 */
export function validateDOB(dob: Date): boolean {
  const now = new Date();
  const minDate = new Date(1900, 0, 1);

  if (dob > now) {
    return false;
  }

  if (dob < minDate) {
    return false;
  }

  return true;
}

// ============================================================================
// HIPAA Compliance Validators
// ============================================================================

/**
 * Detects potential PHI in text fields
 */
export function detectPHI(text: string): boolean {
  // SSN pattern
  if (/\d{3}-\d{2}-\d{4}/.test(text)) {
    return true;
  }

  // Phone number pattern
  if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
    return true;
  }

  // Email pattern
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(text)) {
    return true;
  }

  // Medical record number pattern (common formats)
  if (/MRN\s*:?\s*\d+/i.test(text)) {
    return true;
  }

  return false;
}

/**
 * Validates HIPAA minimum necessary principle
 */
export function validateMinimumNecessary(
  requestedFields: string[],
  necessaryFields: string[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const unnecessaryFields = requestedFields.filter(
    (field) => !necessaryFields.includes(field)
  );

  if (unnecessaryFields.length > 0) {
    warnings.push({
      field: 'export',
      message: `The following fields may not be necessary: ${unnecessaryFields.join(', ')}`,
    });
  }

  return { valid: true, errors, warnings };
}

// ============================================================================
// Duplicate Detection
// ============================================================================

export interface DuplicateDetectionConfig {
  uniqueFields: string[];
  fuzzyMatch?: boolean;
  threshold?: number; // For fuzzy matching (0-1)
}

export class DuplicateDetector {
  private config: DuplicateDetectionConfig;
  private seenRecords: Map<string, number>;

  constructor(config: DuplicateDetectionConfig) {
    this.config = config;
    this.seenRecords = new Map();
  }

  /**
   * Checks if a record is a duplicate
   */
  isDuplicate(record: Record<string, unknown>, rowNumber: number): boolean {
    const key = this.generateKey(record);

    if (this.seenRecords.has(key)) {
      return true;
    }

    this.seenRecords.set(key, rowNumber);
    return false;
  }

  /**
   * Gets the row number of the original record
   */
  getOriginalRow(record: Record<string, unknown>): number | undefined {
    const key = this.generateKey(record);
    return this.seenRecords.get(key);
  }

  /**
   * Generates a unique key from record fields
   */
  private generateKey(record: Record<string, unknown>): string {
    const values = this.config.uniqueFields.map((field) => {
      const value = record[field];
      return value === undefined || value === null ? '' : String(value).toLowerCase().trim();
    });

    return values.join('|');
  }

  /**
   * Resets the duplicate detector
   */
  reset(): void {
    this.seenRecords.clear();
  }
}

// ============================================================================
// Cross-Field Validators
// ============================================================================

/**
 * Validates that end date is after start date
 */
export function validateDateRange(
  startDate: Date,
  endDate: Date,
  fieldNames: { start: string; end: string }
): ValidationResult {
  const errors: ValidationError[] = [];

  if (endDate < startDate) {
    errors.push({
      field: fieldNames.end,
      code: 'INVALID_DATE_RANGE',
      message: `End date (${fieldNames.end}) must be after start date (${fieldNames.start})`,
    });
  }

  return { valid: errors.length === 0, errors, warnings: [] };
}

/**
 * Validates that age matches date of birth
 */
export function validateAgeConsistency(
  dob: Date,
  age: number,
  fieldNames: { dob: string; age: string }
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const calculatedAge = Math.floor(
    (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );

  if (Math.abs(calculatedAge - age) > 1) {
    errors.push({
      field: fieldNames.age,
      code: 'AGE_DOB_MISMATCH',
      message: `Age (${age}) does not match date of birth (calculated age: ${calculatedAge})`,
    });
  } else if (calculatedAge !== age) {
    warnings.push({
      field: fieldNames.age,
      message: `Age (${age}) differs slightly from calculated age (${calculatedAge})`,
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates medication administration fields
 */
export function validateMedicationAdministration(data: {
  medication: string;
  dosage: string;
  route: string;
  time: Date;
}): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate dosage format
  if (!validateDosage(data.dosage)) {
    errors.push({
      field: 'dosage',
      code: 'INVALID_DOSAGE',
      message: 'Invalid dosage format',
      value: data.dosage,
    });
  }

  // Validate administration route
  const validRoutes = ['oral', 'iv', 'im', 'subcutaneous', 'topical', 'inhalation', 'other'];
  if (!validRoutes.includes(data.route.toLowerCase())) {
    errors.push({
      field: 'route',
      code: 'INVALID_ROUTE',
      message: `Invalid administration route. Must be one of: ${validRoutes.join(', ')}`,
      value: data.route,
    });
  }

  // Validate time (not in future)
  if (data.time > new Date()) {
    errors.push({
      field: 'time',
      code: 'FUTURE_TIME',
      message: 'Administration time cannot be in the future',
      value: data.time,
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}
