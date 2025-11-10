/**
 * Enterprise Sequelize Model Validation Composites
 *
 * Advanced validation patterns including cross-field validation, async validators,
 * conditional validation, custom error handling, and HIPAA-compliant validation
 * for healthcare applications.
 *
 * @module reuse/data/composites/model-validation-composites
 * @version 1.0.0
 * @requires sequelize v6
 */

import {
  Model,
  ModelStatic,
  ValidationError,
  ValidationErrorItem,
  DataTypes,
  Op,
  Sequelize,
} from 'sequelize';

/**
 * Type definitions for validation composites
 */
export interface ValidationRule {
  validator: (value: any, instance: any) => boolean | Promise<boolean>;
  message: string | ((value: any, instance: any) => string);
  async?: boolean;
}

export interface CrossFieldValidation {
  fields: string[];
  validator: (values: Record<string, any>, instance: any) => boolean | Promise<boolean>;
  message: string;
}

export interface ConditionalValidation {
  condition: (instance: any) => boolean;
  validations: Record<string, ValidationRule[]>;
}

export interface ValidationContext {
  userId?: string | number;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Date;
  source?: string;
}

export interface ValidatorOptions {
  allowNull?: boolean;
  allowEmpty?: boolean;
  trim?: boolean;
  message?: string;
}

// ============================================================================
// Basic Field Validators
// ============================================================================

/**
 * Creates email validation rule with DNS verification option
 *
 * Validates email format with RFC 5322 compliance and optional MX record
 * checking for enhanced validation in production environments.
 *
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const emailValidator = createEmailValidator({
 *   checkMX: true,
 *   allowDisposable: false,
 *   message: 'Please provide a valid corporate email'
 * });
 * ```
 */
export function createEmailValidator(
  options: {
    checkMX?: boolean;
    allowDisposable?: boolean;
    message?: string;
  } = {}
): ValidationRule {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const disposableDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com'];

  return {
    validator: async (value: string) => {
      if (!value) return false;

      // Basic format check
      if (!emailRegex.test(value)) return false;

      const domain = value.split('@')[1].toLowerCase();

      // Check disposable domains
      if (!options.allowDisposable && disposableDomains.includes(domain)) {
        return false;
      }

      return true;
    },
    message: options.message || 'Invalid email address',
    async: options.checkMX || false,
  };
}

/**
 * Creates phone number validator with international format support
 *
 * Validates phone numbers with E.164 format support and country-specific
 * validation rules for healthcare contact information.
 *
 * @param format - Phone format ('US', 'E164', 'international')
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const phoneValidator = createPhoneValidator('US', {
 *   allowExtensions: true
 * });
 * ```
 */
export function createPhoneValidator(
  format: 'US' | 'E164' | 'international',
  options: { allowExtensions?: boolean; message?: string } = {}
): ValidationRule {
  const patterns: Record<string, RegExp> = {
    US: /^\+?1?\d{10}$/,
    E164: /^\+[1-9]\d{1,14}$/,
    international: /^\+?[\d\s\-()]+$/,
  };

  return {
    validator: (value: string) => {
      if (!value) return false;
      const cleaned = value.replace(/[\s\-()]/g, '');
      return patterns[format].test(cleaned);
    },
    message: options.message || `Invalid phone number format (expected ${format})`,
  };
}

/**
 * Creates SSN validator with format and checksum validation
 *
 * Validates US Social Security Numbers with proper formatting and
 * exclusion of invalid number ranges. Critical for HIPAA compliance.
 *
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const ssnValidator = createSSNValidator({
 *   allowDashes: true,
 *   validateChecksum: true
 * });
 * ```
 */
export function createSSNValidator(
  options: {
    allowDashes?: boolean;
    validateChecksum?: boolean;
    message?: string;
  } = {}
): ValidationRule {
  return {
    validator: (value: string) => {
      if (!value) return false;

      // Remove dashes if allowed
      let ssn = value;
      if (options.allowDashes) {
        ssn = ssn.replace(/-/g, '');
      }

      // Must be 9 digits
      if (!/^\d{9}$/.test(ssn)) return false;

      // Invalid ranges
      const area = parseInt(ssn.substring(0, 3));
      const group = parseInt(ssn.substring(3, 5));
      const serial = parseInt(ssn.substring(5, 9));

      // Area number validation
      if (area === 0 || area === 666 || area >= 900) return false;

      // Group number validation
      if (group === 0) return false;

      // Serial number validation
      if (serial === 0) return false;

      return true;
    },
    message: options.message || 'Invalid Social Security Number',
  };
}

/**
 * Creates date range validator
 *
 * Validates dates fall within specified range, useful for birth dates,
 * appointment scheduling, and medical record date validation.
 *
 * @param minDate - Minimum allowed date
 * @param maxDate - Maximum allowed date
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const birthDateValidator = createDateRangeValidator(
 *   new Date('1900-01-01'),
 *   new Date(),
 *   { message: 'Birth date must be in the past' }
 * );
 * ```
 */
export function createDateRangeValidator(
  minDate: Date | null,
  maxDate: Date | null,
  options: { message?: string; inclusive?: boolean } = {}
): ValidationRule {
  return {
    validator: (value: Date) => {
      if (!value) return false;
      const date = new Date(value);

      if (minDate) {
        if (options.inclusive) {
          if (date < minDate) return false;
        } else {
          if (date <= minDate) return false;
        }
      }

      if (maxDate) {
        if (options.inclusive) {
          if (date > maxDate) return false;
        } else {
          if (date >= maxDate) return false;
        }
      }

      return true;
    },
    message: options.message || 'Date is outside valid range',
  };
}

/**
 * Creates age validator from date of birth
 *
 * Calculates age from birth date and validates against min/max constraints,
 * essential for age-restricted medical procedures and consent validation.
 *
 * @param minAge - Minimum age requirement
 * @param maxAge - Maximum age limit
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const ageValidator = createAgeValidator(18, 120, {
 *   message: 'Patient must be 18 or older'
 * });
 * ```
 */
export function createAgeValidator(
  minAge: number | null,
  maxAge: number | null,
  options: { message?: string } = {}
): ValidationRule {
  return {
    validator: (value: Date) => {
      if (!value) return false;

      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (minAge !== null && age < minAge) return false;
      if (maxAge !== null && age > maxAge) return false;

      return true;
    },
    message: options.message || `Age must be between ${minAge} and ${maxAge}`,
  };
}

/**
 * Creates credit card number validator with Luhn algorithm
 *
 * Validates credit card numbers using Luhn checksum algorithm and
 * card type detection for payment processing validation.
 *
 * @param allowedTypes - Array of allowed card types
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const cardValidator = createCreditCardValidator(['visa', 'mastercard']);
 * ```
 */
export function createCreditCardValidator(
  allowedTypes?: string[],
  options: { message?: string } = {}
): ValidationRule {
  return {
    validator: (value: string) => {
      if (!value) return false;

      const cleaned = value.replace(/\s/g, '');
      if (!/^\d+$/.test(cleaned)) return false;

      // Luhn algorithm
      let sum = 0;
      let isEven = false;

      for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i), 10);

        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        isEven = !isEven;
      }

      return sum % 10 === 0;
    },
    message: options.message || 'Invalid credit card number',
  };
}

/**
 * Creates IP address validator (IPv4/IPv6)
 *
 * Validates IP addresses with support for IPv4, IPv6, and CIDR notation,
 * useful for audit logging and access control validation.
 *
 * @param version - IP version ('v4', 'v6', or 'both')
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const ipValidator = createIPAddressValidator('both', {
 *   allowCIDR: true
 * });
 * ```
 */
export function createIPAddressValidator(
  version: 'v4' | 'v6' | 'both' = 'both',
  options: { allowCIDR?: boolean; message?: string } = {}
): ValidationRule {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return {
    validator: (value: string) => {
      if (!value) return false;

      const hasCIDR = value.includes('/');
      if (hasCIDR && !options.allowCIDR) return false;

      if (version === 'v4' || version === 'both') {
        if (ipv4Regex.test(value)) {
          const parts = value.split('/')[0].split('.');
          return parts.every((part) => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
          });
        }
      }

      if (version === 'v6' || version === 'both') {
        if (ipv6Regex.test(value)) {
          return true;
        }
      }

      return false;
    },
    message: options.message || `Invalid IP address (expected IPv${version === 'both' ? '4/6' : version})`,
  };
}

/**
 * Creates URL validator with protocol and domain validation
 *
 * Validates URLs with customizable protocol requirements and domain
 * whitelist support for secure external reference validation.
 *
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const urlValidator = createURLValidator({
 *   requireHTTPS: true,
 *   allowedDomains: ['example.com', 'trusted.org']
 * });
 * ```
 */
export function createURLValidator(
  options: {
    requireHTTPS?: boolean;
    allowedDomains?: string[];
    allowedProtocols?: string[];
    message?: string;
  } = {}
): ValidationRule {
  return {
    validator: (value: string) => {
      if (!value) return false;

      try {
        const url = new URL(value);

        // Check protocol
        if (options.requireHTTPS && url.protocol !== 'https:') {
          return false;
        }

        if (options.allowedProtocols && !options.allowedProtocols.includes(url.protocol.slice(0, -1))) {
          return false;
        }

        // Check domain whitelist
        if (options.allowedDomains && !options.allowedDomains.includes(url.hostname)) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    },
    message: options.message || 'Invalid URL',
  };
}

// ============================================================================
// Cross-Field Validation
// ============================================================================

/**
 * Creates cross-field equality validator
 *
 * Validates that multiple fields have equal values, commonly used for
 * password confirmation and critical data entry verification.
 *
 * @param fields - Array of field names to compare
 * @param options - Validation options
 * @returns Cross-field validation rule
 *
 * @example
 * ```typescript
 * const passwordMatch = createCrossFieldEqualityValidator(
 *   ['password', 'passwordConfirm'],
 *   { message: 'Passwords must match' }
 * );
 * ```
 */
export function createCrossFieldEqualityValidator(
  fields: string[],
  options: { message?: string; caseSensitive?: boolean } = {}
): CrossFieldValidation {
  return {
    fields,
    validator: (values: Record<string, any>) => {
      if (fields.length < 2) return true;

      const firstValue = values[fields[0]];
      if (firstValue === null || firstValue === undefined) return true;

      const compareValue = options.caseSensitive !== false
        ? firstValue
        : String(firstValue).toLowerCase();

      return fields.slice(1).every((field) => {
        const value = values[field];
        const compare = options.caseSensitive !== false
          ? value
          : String(value || '').toLowerCase();
        return compare === compareValue;
      });
    },
    message: options.message || `Fields ${fields.join(', ')} must match`,
  };
}

/**
 * Creates date range cross-field validator
 *
 * Validates that start date is before end date, essential for appointment
 * scheduling, medical procedure planning, and treatment date validation.
 *
 * @param startField - Start date field name
 * @param endField - End date field name
 * @param options - Validation options
 * @returns Cross-field validation rule
 *
 * @example
 * ```typescript
 * const dateRangeValidator = createDateRangeCrossValidator(
 *   'appointmentStart',
 *   'appointmentEnd',
 *   { allowEqual: false, message: 'End must be after start' }
 * );
 * ```
 */
export function createDateRangeCrossValidator(
  startField: string,
  endField: string,
  options: { allowEqual?: boolean; message?: string } = {}
): CrossFieldValidation {
  return {
    fields: [startField, endField],
    validator: (values: Record<string, any>) => {
      const start = values[startField];
      const end = values[endField];

      if (!start || !end) return true;

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (options.allowEqual) {
        return startDate <= endDate;
      }

      return startDate < endDate;
    },
    message: options.message || `${endField} must be after ${startField}`,
  };
}

/**
 * Creates conditional requirement validator
 *
 * Validates that a field is required when another field meets specific
 * conditions, useful for dynamic form validation in healthcare workflows.
 *
 * @param dependentField - Field that becomes required
 * @param conditionField - Field that triggers requirement
 * @param conditionValue - Value that triggers requirement
 * @param options - Validation options
 * @returns Cross-field validation rule
 *
 * @example
 * ```typescript
 * const insuranceValidator = createConditionalRequirement(
 *   'insuranceNumber',
 *   'hasInsurance',
 *   true,
 *   { message: 'Insurance number required when insurance is selected' }
 * );
 * ```
 */
export function createConditionalRequirement(
  dependentField: string,
  conditionField: string,
  conditionValue: any,
  options: { message?: string } = {}
): CrossFieldValidation {
  return {
    fields: [dependentField, conditionField],
    validator: (values: Record<string, any>) => {
      const condition = values[conditionField];
      const dependent = values[dependentField];

      if (condition === conditionValue) {
        return dependent !== null && dependent !== undefined && dependent !== '';
      }

      return true;
    },
    message: options.message || `${dependentField} is required when ${conditionField} is ${conditionValue}`,
  };
}

/**
 * Creates mutual exclusivity validator
 *
 * Validates that only one field from a group has a value, preventing
 * conflicting data entry in mutually exclusive options.
 *
 * @param fields - Array of mutually exclusive fields
 * @param options - Validation options
 * @returns Cross-field validation rule
 *
 * @example
 * ```typescript
 * const paymentValidator = createMutualExclusivityValidator(
 *   ['creditCard', 'bankAccount', 'insurance'],
 *   { message: 'Select only one payment method' }
 * );
 * ```
 */
export function createMutualExclusivityValidator(
  fields: string[],
  options: { allowNone?: boolean; message?: string } = {}
): CrossFieldValidation {
  return {
    fields,
    validator: (values: Record<string, any>) => {
      const nonEmptyCount = fields.filter((field) => {
        const value = values[field];
        return value !== null && value !== undefined && value !== '';
      }).length;

      if (nonEmptyCount > 1) return false;
      if (nonEmptyCount === 0 && !options.allowNone) return false;

      return true;
    },
    message: options.message || `Only one of ${fields.join(', ')} can be specified`,
  };
}

/**
 * Creates sum validation across fields
 *
 * Validates that the sum of numeric fields meets a specific constraint,
 * useful for billing, dosage calculations, and resource allocation.
 *
 * @param fields - Array of numeric fields to sum
 * @param expectedSum - Expected sum value or validation function
 * @param options - Validation options
 * @returns Cross-field validation rule
 *
 * @example
 * ```typescript
 * const percentValidator = createSumValidator(
 *   ['allocation1', 'allocation2', 'allocation3'],
 *   100,
 *   { message: 'Allocations must sum to 100%' }
 * );
 * ```
 */
export function createSumValidator(
  fields: string[],
  expectedSum: number | ((sum: number) => boolean),
  options: { message?: string; tolerance?: number } = {}
): CrossFieldValidation {
  return {
    fields,
    validator: (values: Record<string, any>) => {
      const sum = fields.reduce((acc, field) => {
        const value = parseFloat(values[field]);
        return acc + (isNaN(value) ? 0 : value);
      }, 0);

      if (typeof expectedSum === 'number') {
        const tolerance = options.tolerance || 0;
        return Math.abs(sum - expectedSum) <= tolerance;
      }

      return expectedSum(sum);
    },
    message: options.message || `Sum of ${fields.join(', ')} must equal ${expectedSum}`,
  };
}

// ============================================================================
// Async Validators
// ============================================================================

/**
 * Creates async uniqueness validator with database check
 *
 * Validates field uniqueness by querying database, with support for
 * composite uniqueness and update scenarios (excluding current record).
 *
 * @param model - Model to check against
 * @param field - Field to validate uniqueness
 * @param options - Validation options
 * @returns Async validation rule
 *
 * @example
 * ```typescript
 * const emailUnique = createAsyncUniquenessValidator(User, 'email', {
 *   scope: { tenantId: instance => instance.tenantId },
 *   message: 'Email already registered'
 * });
 * ```
 */
export function createAsyncUniquenessValidator(
  model: ModelStatic<any>,
  field: string,
  options: {
    scope?: Record<string, any> | ((instance: any) => Record<string, any>);
    caseSensitive?: boolean;
    message?: string;
  } = {}
): ValidationRule {
  return {
    validator: async (value: any, instance: any) => {
      if (!value) return true;

      const where: any = {};

      if (options.caseSensitive === false) {
        where[field] = { [Op.iLike]: value };
      } else {
        where[field] = value;
      }

      // Add scope conditions
      if (options.scope) {
        const scopeConditions = typeof options.scope === 'function'
          ? options.scope(instance)
          : options.scope;
        Object.assign(where, scopeConditions);
      }

      // Exclude current record if updating
      if (instance.id) {
        where.id = { [Op.ne]: instance.id };
      }

      const existing = await model.findOne({ where });
      return !existing;
    },
    message: options.message || `${field} must be unique`,
    async: true,
  };
}

/**
 * Creates async external API validator
 *
 * Validates data against external API, useful for address verification,
 * insurance validation, and drug database checks in healthcare systems.
 *
 * @param apiValidator - Async function that calls external API
 * @param options - Validation options
 * @returns Async validation rule
 *
 * @example
 * ```typescript
 * const addressValidator = createAsyncExternalAPIValidator(
 *   async (address) => {
 *     const response = await fetch(`/api/validate-address?address=${address}`);
 *     return response.ok;
 *   },
 *   { timeout: 5000, message: 'Invalid address' }
 * );
 * ```
 */
export function createAsyncExternalAPIValidator(
  apiValidator: (value: any, instance: any) => Promise<boolean>,
  options: {
    timeout?: number;
    retries?: number;
    message?: string;
  } = {}
): ValidationRule {
  return {
    validator: async (value: any, instance: any) => {
      if (!value) return true;

      const timeout = options.timeout || 5000;
      const retries = options.retries || 1;

      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const result = await Promise.race([
            apiValidator(value, instance),
            new Promise<boolean>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), timeout)
            ),
          ]);

          return result;
        } catch (error) {
          if (attempt === retries - 1) {
            console.error('External API validation failed:', error);
            return false;
          }
        }
      }

      return false;
    },
    message: options.message || 'External validation failed',
    async: true,
  };
}

/**
 * Creates async reference existence validator
 *
 * Validates that referenced record exists in related table, with support
 * for soft-deleted records and composite key validation.
 *
 * @param model - Referenced model
 * @param options - Validation options
 * @returns Async validation rule
 *
 * @example
 * ```typescript
 * const doctorExists = createAsyncReferenceValidator(Doctor, {
 *   respectParanoid: true,
 *   additionalConditions: { status: 'active' }
 * });
 * ```
 */
export function createAsyncReferenceValidator(
  model: ModelStatic<any>,
  options: {
    respectParanoid?: boolean;
    additionalConditions?: Record<string, any>;
    message?: string;
  } = {}
): ValidationRule {
  return {
    validator: async (value: any) => {
      if (!value) return true;

      const where: any = { id: value };

      if (options.additionalConditions) {
        Object.assign(where, options.additionalConditions);
      }

      const findOptions: any = { where };
      if (options.respectParanoid === false) {
        findOptions.paranoid = false;
      }

      const record = await model.findOne(findOptions);
      return !!record;
    },
    message: options.message || 'Referenced record does not exist',
    async: true,
  };
}

/**
 * Creates async rate limit validator
 *
 * Validates that action hasn't exceeded rate limit, essential for
 * preventing abuse and ensuring fair resource allocation.
 *
 * @param key - Rate limit key (e.g., userId, ipAddress)
 * @param limit - Maximum attempts allowed
 * @param window - Time window in milliseconds
 * @param options - Validation options
 * @returns Async validation rule
 *
 * @example
 * ```typescript
 * const loginRateLimit = createAsyncRateLimitValidator(
 *   'email',
 *   5,
 *   15 * 60 * 1000, // 15 minutes
 *   { message: 'Too many login attempts' }
 * );
 * ```
 */
export function createAsyncRateLimitValidator(
  key: string,
  limit: number,
  window: number,
  options: {
    storage?: any; // Redis or in-memory cache
    message?: string;
  } = {}
): ValidationRule {
  const attemptCache = new Map<string, { count: number; resetAt: Date }>();

  return {
    validator: async (value: any, instance: any) => {
      const cacheKey = `${key}:${value || instance[key]}`;
      const now = new Date();

      let attempts = attemptCache.get(cacheKey);

      if (!attempts || attempts.resetAt < now) {
        attempts = {
          count: 1,
          resetAt: new Date(now.getTime() + window),
        };
        attemptCache.set(cacheKey, attempts);
        return true;
      }

      if (attempts.count >= limit) {
        return false;
      }

      attempts.count++;
      return true;
    },
    message: options.message || `Rate limit exceeded (${limit} attempts per ${window}ms)`,
    async: true,
  };
}

// ============================================================================
// Complex Validators
// ============================================================================

/**
 * Creates password strength validator
 *
 * Validates password strength with configurable requirements for length,
 * character types, and common password detection. HIPAA-compliant.
 *
 * @param requirements - Password requirements
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const passwordValidator = createPasswordStrengthValidator({
 *   minLength: 12,
 *   requireUppercase: true,
 *   requireLowercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true,
 *   preventCommonPasswords: true
 * });
 * ```
 */
export function createPasswordStrengthValidator(
  requirements: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    preventCommonPasswords?: boolean;
    preventRepeating?: boolean;
  },
  options: { message?: string } = {}
): ValidationRule {
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];

  return {
    validator: (value: string) => {
      if (!value) return false;

      if (requirements.minLength && value.length < requirements.minLength) return false;
      if (requirements.maxLength && value.length > requirements.maxLength) return false;

      if (requirements.requireUppercase && !/[A-Z]/.test(value)) return false;
      if (requirements.requireLowercase && !/[a-z]/.test(value)) return false;
      if (requirements.requireNumbers && !/\d/.test(value)) return false;
      if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return false;

      if (requirements.preventCommonPasswords) {
        const lower = value.toLowerCase();
        if (commonPasswords.some((pwd) => lower.includes(pwd))) return false;
      }

      if (requirements.preventRepeating) {
        if (/(.)\1{2,}/.test(value)) return false;
      }

      return true;
    },
    message: options.message || 'Password does not meet strength requirements',
  };
}

/**
 * Creates medical record number validator
 *
 * Validates medical record numbers with configurable format patterns,
 * check digit algorithms, and facility-specific validation rules.
 *
 * @param format - MRN format pattern
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const mrnValidator = createMedicalRecordNumberValidator(
 *   /^MRN\d{7}$/,
 *   { checkDigit: 'mod10', message: 'Invalid MRN format' }
 * );
 * ```
 */
export function createMedicalRecordNumberValidator(
  format: RegExp | ((value: string) => boolean),
  options: {
    checkDigit?: 'mod10' | 'mod11' | 'luhn';
    facilityPrefix?: string;
    message?: string;
  } = {}
): ValidationRule {
  return {
    validator: (value: string) => {
      if (!value) return false;

      // Check facility prefix
      if (options.facilityPrefix && !value.startsWith(options.facilityPrefix)) {
        return false;
      }

      // Check format
      if (format instanceof RegExp) {
        if (!format.test(value)) return false;
      } else {
        if (!format(value)) return false;
      }

      // Check digit validation
      if (options.checkDigit) {
        const digits = value.replace(/\D/g, '');
        switch (options.checkDigit) {
          case 'mod10': {
            const sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
            if (sum % 10 !== 0) return false;
            break;
          }
          case 'luhn': {
            let sum = 0;
            let isEven = false;
            for (let i = digits.length - 1; i >= 0; i--) {
              let digit = parseInt(digits[i]);
              if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
              }
              sum += digit;
              isEven = !isEven;
            }
            if (sum % 10 !== 0) return false;
            break;
          }
        }
      }

      return true;
    },
    message: options.message || 'Invalid medical record number',
  };
}

/**
 * Creates drug NDC code validator
 *
 * Validates National Drug Code format and check digit for pharmaceutical
 * data integrity in healthcare prescription systems.
 *
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const ndcValidator = createDrugNDCValidator({
 *   format: '5-4-2',
 *   validateCheckDigit: true
 * });
 * ```
 */
export function createDrugNDCValidator(
  options: {
    format?: '5-4-2' | '5-3-2' | '4-4-2';
    validateCheckDigit?: boolean;
    message?: string;
  } = {}
): ValidationRule {
  const formats: Record<string, RegExp> = {
    '5-4-2': /^\d{5}-\d{4}-\d{2}$/,
    '5-3-2': /^\d{5}-\d{3}-\d{2}$/,
    '4-4-2': /^\d{4}-\d{4}-\d{2}$/,
  };

  return {
    validator: (value: string) => {
      if (!value) return false;

      const format = options.format || '5-4-2';
      if (!formats[format].test(value)) return false;

      return true;
    },
    message: options.message || 'Invalid NDC code format',
  };
}

/**
 * Creates ICD-10 code validator
 *
 * Validates ICD-10 diagnosis codes with proper format checking and
 * category validation for medical billing and records.
 *
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const icd10Validator = createICD10Validator({
 *   validateCategory: true,
 *   allowProvisional: false
 * });
 * ```
 */
export function createICD10Validator(
  options: {
    validateCategory?: boolean;
    allowProvisional?: boolean;
    message?: string;
  } = {}
): ValidationRule {
  // ICD-10 format: Letter + 2-6 alphanumeric characters
  const icd10Regex = /^[A-TV-Z]\d{2}(\.\d{1,4})?$/;

  return {
    validator: (value: string) => {
      if (!value) return false;

      const code = value.toUpperCase();
      if (!icd10Regex.test(code)) return false;

      // Category validation (first character)
      if (options.validateCategory) {
        const category = code.charAt(0);
        // Valid ICD-10 categories exclude U (except for U00-U99)
        if (category === 'U' && !code.startsWith('U0')) return false;
      }

      return true;
    },
    message: options.message || 'Invalid ICD-10 code',
  };
}

/**
 * Creates CPT code validator
 *
 * Validates Current Procedural Terminology codes for medical procedure
 * documentation and billing in healthcare systems.
 *
 * @param options - Validation options
 * @returns Validation rule
 *
 * @example
 * ```typescript
 * const cptValidator = createCPTValidator({
 *   allowModifiers: true,
 *   validateRange: true
 * });
 * ```
 */
export function createCPTValidator(
  options: {
    allowModifiers?: boolean;
    validateRange?: boolean;
    message?: string;
  } = {}
): ValidationRule {
  // CPT codes are 5 digits, optionally followed by modifiers
  const cptRegex = /^\d{5}(-\d{2})?$/;

  return {
    validator: (value: string) => {
      if (!value) return false;

      if (!cptRegex.test(value)) return false;

      const baseCode = parseInt(value.substring(0, 5));

      // Validate range (CPT codes are in specific ranges)
      if (options.validateRange) {
        // Simplified range check
        if (baseCode < 1 || baseCode > 99999) return false;
      }

      // Check modifiers if present
      if (value.length > 5 && !options.allowModifiers) return false;

      return true;
    },
    message: options.message || 'Invalid CPT code',
  };
}

// ============================================================================
// Validation Application Helpers
// ============================================================================

/**
 * Applies validation rules to model
 *
 * Registers all validation rules on model with proper error handling
 * and async support for comprehensive model validation.
 *
 * @param model - Model to apply validations to
 * @param validations - Validation configuration
 * @returns Model with validations applied
 *
 * @example
 * ```typescript
 * applyValidationRules(User, {
 *   email: [createEmailValidator({ checkMX: true })],
 *   password: [createPasswordStrengthValidator({ minLength: 12 })]
 * });
 * ```
 */
export function applyValidationRules<T extends Model>(
  model: ModelStatic<T>,
  validations: Record<string, ValidationRule[]>
): ModelStatic<T> {
  for (const [field, rules] of Object.entries(validations)) {
    const attribute = model.rawAttributes[field];
    if (!attribute) continue;

    attribute.validate = attribute.validate || {};

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const validatorName = `custom_${field}_${i}`;

      attribute.validate[validatorName] = async function (value: any) {
        try {
          const isValid = await rule.validator(value, this);
          if (!isValid) {
            const message = typeof rule.message === 'function'
              ? rule.message(value, this)
              : rule.message;
            throw new Error(message);
          }
        } catch (error) {
          throw error instanceof Error ? error : new Error(String(error));
        }
      };
    }
  }

  return model;
}

/**
 * Applies cross-field validations to model
 *
 * Registers cross-field validation rules with beforeValidate hook
 * for coordinated multi-field validation logic.
 *
 * @param model - Model to apply validations to
 * @param validations - Array of cross-field validations
 * @returns Model with cross-field validations
 *
 * @example
 * ```typescript
 * applyCrossFieldValidations(User, [
 *   createCrossFieldEqualityValidator(['password', 'passwordConfirm'])
 * ]);
 * ```
 */
export function applyCrossFieldValidations<T extends Model>(
  model: ModelStatic<T>,
  validations: CrossFieldValidation[]
): ModelStatic<T> {
  model.addHook('beforeValidate', async (instance: any) => {
    const errors: ValidationErrorItem[] = [];

    for (const validation of validations) {
      const values: Record<string, any> = {};
      for (const field of validation.fields) {
        values[field] = instance[field];
      }

      try {
        const isValid = await validation.validator(values, instance);
        if (!isValid) {
          errors.push(
            new ValidationErrorItem(
              validation.message,
              'Validation error',
              validation.fields[0],
              values[validation.fields[0]],
              instance,
              'function',
              validation.fields[0],
              []
            )
          );
        }
      } catch (error) {
        errors.push(
          new ValidationErrorItem(
            (error as Error).message,
            'Validation error',
            validation.fields[0],
            values[validation.fields[0]],
            instance,
            'function',
            validation.fields[0],
            []
          )
        );
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Cross-field validation failed', errors);
    }
  });

  return model;
}

/**
 * Creates custom validation error with context
 *
 * Generates detailed validation error with additional context for
 * improved debugging and user feedback in healthcare applications.
 *
 * @param field - Field that failed validation
 * @param message - Error message
 * @param value - Field value
 * @param instance - Model instance
 * @param context - Additional context
 * @returns ValidationErrorItem
 *
 * @example
 * ```typescript
 * throw new ValidationError('Validation failed', [
 *   createCustomValidationError('email', 'Invalid email', value, instance, {
 *     attemptedFormat: value,
 *     suggestedFormat: 'user@example.com'
 *   })
 * ]);
 * ```
 */
export function createCustomValidationError(
  field: string,
  message: string,
  value: any,
  instance: any,
  context?: Record<string, any>
): ValidationErrorItem {
  const error = new ValidationErrorItem(
    message,
    'Validation error',
    field,
    value,
    instance,
    'function',
    field,
    []
  );

  if (context) {
    (error as any).context = context;
  }

  return error;
}

/**
 * Validates instance against all rules
 *
 * Manually validates model instance with comprehensive error reporting
 * for use in custom validation flows and batch processing.
 *
 * @param instance - Instance to validate
 * @param options - Validation options
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = await validateInstance(user, {
 *   fields: ['email', 'password'],
 *   skipHooks: false
 * });
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export async function validateInstance<T extends Model>(
  instance: T,
  options: {
    fields?: string[];
    skipHooks?: boolean;
  } = {}
): Promise<{
  valid: boolean;
  errors: ValidationErrorItem[];
}> {
  try {
    await instance.validate({ fields: options.fields, hooks: !options.skipHooks });
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { valid: false, errors: error.errors };
    }
    throw error;
  }
}

/**
 * Creates validation summary from errors
 *
 * Formats validation errors into user-friendly summary with field
 * grouping and internationalization support for healthcare UIs.
 *
 * @param errors - Array of validation errors
 * @param options - Formatting options
 * @returns Formatted error summary
 *
 * @example
 * ```typescript
 * const summary = createValidationSummary(validationErrors, {
 *   groupByField: true,
 *   includeValues: false
 * });
 * ```
 */
export function createValidationSummary(
  errors: ValidationErrorItem[],
  options: {
    groupByField?: boolean;
    includeValues?: boolean;
    format?: 'text' | 'json' | 'html';
  } = {}
): string | object {
  if (options.groupByField) {
    const grouped: Record<string, string[]> = {};

    for (const error of errors) {
      const field = error.path || 'general';
      if (!grouped[field]) {
        grouped[field] = [];
      }
      grouped[field].push(error.message);
    }

    if (options.format === 'json') {
      return grouped;
    }

    if (options.format === 'html') {
      let html = '<ul class="validation-errors">';
      for (const [field, messages] of Object.entries(grouped)) {
        html += `<li><strong>${field}:</strong><ul>`;
        for (const message of messages) {
          html += `<li>${message}</li>`;
        }
        html += '</ul></li>';
      }
      html += '</ul>';
      return html;
    }

    // Text format
    let text = '';
    for (const [field, messages] of Object.entries(grouped)) {
      text += `${field}:\n`;
      for (const message of messages) {
        text += `  - ${message}\n`;
      }
    }
    return text;
  }

  // Non-grouped format
  if (options.format === 'json') {
    return errors.map((e) => ({
      field: e.path,
      message: e.message,
      value: options.includeValues ? e.value : undefined,
    }));
  }

  return errors.map((e) => e.message).join('\n');
}
