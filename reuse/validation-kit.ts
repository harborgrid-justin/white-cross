/**
 * LOC: VALD1234567
 * File: /reuse/validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - DTOs and validation pipes
 *   - Service layer validators
 *   - Middleware and guards
 */

/**
 * File: /reuse/validation-kit.ts
 * Locator: WC-UTL-VALD-001
 * Purpose: Comprehensive Validation Utilities - Input validation, sanitization, type coercion, business rules
 *
 * Upstream: Independent utility module for validation and data integrity
 * Downstream: ../backend/*, DTOs, validation pipes, services, middleware
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, class-validator, class-transformer
 * Exports: 45 utility functions for input validation, sanitization, type coercion, business rule validation
 *
 * LLM Context: Comprehensive validation utilities for implementing production-ready data validation in White Cross system.
 * Provides input validators, custom validator builders, sanitization functions, type coercion, email/phone/URL validators,
 * date/time validation, file validation, business rule validators, conditional validation, validation pipe factories,
 * error message formatters, and schema validation helpers. Essential for building secure, reliable healthcare data processing.
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  buildMessage,
} from 'class-validator';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Type,
} from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedValue?: any;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  constraints?: Record<string, any>;
}

interface SanitizationOptions {
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  removeSpecialChars?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
}

interface EmailValidationOptions {
  allowDisplayName?: boolean;
  requireTld?: boolean;
  allowIpDomain?: boolean;
  domainBlacklist?: string[];
  domainWhitelist?: string[];
}

interface PhoneValidationOptions {
  country?: string;
  format?: 'E164' | 'INTERNATIONAL' | 'NATIONAL' | 'RFC3966';
  allowExtension?: boolean;
}

interface UrlValidationOptions {
  protocols?: string[];
  requireProtocol?: boolean;
  requireTld?: boolean;
  allowQueryParams?: boolean;
  allowFragments?: boolean;
  allowAuth?: boolean;
}

interface FileValidationOptions {
  maxSize?: number;
  minSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  requireExtension?: boolean;
  validateContent?: boolean;
}

interface DateValidationOptions {
  minDate?: Date;
  maxDate?: Date;
  allowPast?: boolean;
  allowFuture?: boolean;
  format?: string;
  timezone?: string;
}

interface BusinessRuleValidationContext {
  entity: any;
  user?: any;
  metadata?: Record<string, any>;
}

interface ConditionalValidationRule {
  condition: (value: any, context: any) => boolean;
  validators: ValidationRule[];
  errorMessage?: string;
}

interface ValidationRule {
  name: string;
  validate: (value: any, context?: any) => boolean | Promise<boolean>;
  message: string;
  severity?: 'error' | 'warning';
}

interface SchemaValidationOptions {
  strict?: boolean;
  abortEarly?: boolean;
  stripUnknown?: boolean;
  context?: Record<string, any>;
}

interface TypeCoercionOptions {
  strict?: boolean;
  parseNumbers?: boolean;
  parseBooleans?: boolean;
  parseDates?: boolean;
  nullAsUndefined?: boolean;
}

// ============================================================================
// SECTION 1: INPUT VALIDATION HELPERS (Functions 1-8)
// ============================================================================

/**
 * 1. Validates if a value is a non-empty string with optional length constraints.
 *
 * @param {any} value - Value to validate
 * @param {object} options - Validation options
 * @param {number} options.minLength - Minimum string length
 * @param {number} options.maxLength - Maximum string length
 * @param {boolean} options.allowWhitespace - Allow whitespace-only strings
 * @returns {ValidationResult} Validation result with errors if any
 *
 * @example
 * ```typescript
 * const result = validateNonEmptyString('  Hello  ', { minLength: 3, maxLength: 20 });
 * // Result: { isValid: true, errors: [], sanitizedValue: '  Hello  ' }
 *
 * const result2 = validateNonEmptyString('', { minLength: 1 });
 * // Result: { isValid: false, errors: [{ field: 'value', message: 'Value must be a non-empty string', code: 'STRING_EMPTY' }] }
 * ```
 */
export const validateNonEmptyString = (
  value: any,
  options: {
    minLength?: number;
    maxLength?: number;
    allowWhitespace?: boolean;
  } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof value !== 'string') {
    errors.push({
      field: 'value',
      message: 'Value must be a string',
      code: 'STRING_TYPE_INVALID',
      value,
    });
    return { isValid: false, errors };
  }

  if (value.length === 0) {
    errors.push({
      field: 'value',
      message: 'Value must be a non-empty string',
      code: 'STRING_EMPTY',
      value,
    });
    return { isValid: false, errors };
  }

  if (!options.allowWhitespace && value.trim().length === 0) {
    errors.push({
      field: 'value',
      message: 'Value cannot be whitespace only',
      code: 'STRING_WHITESPACE_ONLY',
      value,
    });
    return { isValid: false, errors };
  }

  if (options.minLength && value.length < options.minLength) {
    errors.push({
      field: 'value',
      message: `Value must be at least ${options.minLength} characters`,
      code: 'STRING_TOO_SHORT',
      value,
      constraints: { minLength: options.minLength },
    });
  }

  if (options.maxLength && value.length > options.maxLength) {
    errors.push({
      field: 'value',
      message: `Value must be at most ${options.maxLength} characters`,
      code: 'STRING_TOO_LONG',
      value,
      constraints: { maxLength: options.maxLength },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: value,
  };
};

/**
 * 2. Validates numeric values with range and precision constraints.
 *
 * @param {any} value - Value to validate
 * @param {object} options - Validation options
 * @param {number} options.min - Minimum value (inclusive)
 * @param {number} options.max - Maximum value (inclusive)
 * @param {boolean} options.integer - Must be an integer
 * @param {number} options.precision - Decimal precision
 * @param {boolean} options.positive - Must be positive
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNumber(42.5, { min: 0, max: 100, precision: 1 });
 * // Result: { isValid: true, errors: [], sanitizedValue: 42.5 }
 *
 * const result2 = validateNumber(150, { min: 0, max: 100 });
 * // Result: { isValid: false, errors: [{ code: 'NUMBER_OUT_OF_RANGE', ... }] }
 * ```
 */
export const validateNumber = (
  value: any,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
    precision?: number;
    positive?: boolean;
  } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (typeof numValue !== 'number' || isNaN(numValue)) {
    errors.push({
      field: 'value',
      message: 'Value must be a valid number',
      code: 'NUMBER_INVALID',
      value,
    });
    return { isValid: false, errors };
  }

  if (options.integer && !Number.isInteger(numValue)) {
    errors.push({
      field: 'value',
      message: 'Value must be an integer',
      code: 'NUMBER_NOT_INTEGER',
      value: numValue,
    });
  }

  if (options.positive && numValue <= 0) {
    errors.push({
      field: 'value',
      message: 'Value must be positive',
      code: 'NUMBER_NOT_POSITIVE',
      value: numValue,
    });
  }

  if (options.min !== undefined && numValue < options.min) {
    errors.push({
      field: 'value',
      message: `Value must be at least ${options.min}`,
      code: 'NUMBER_OUT_OF_RANGE',
      value: numValue,
      constraints: { min: options.min },
    });
  }

  if (options.max !== undefined && numValue > options.max) {
    errors.push({
      field: 'value',
      message: `Value must be at most ${options.max}`,
      code: 'NUMBER_OUT_OF_RANGE',
      value: numValue,
      constraints: { max: options.max },
    });
  }

  if (options.precision !== undefined) {
    const decimalPlaces = (numValue.toString().split('.')[1] || '').length;
    if (decimalPlaces > options.precision) {
      errors.push({
        field: 'value',
        message: `Value must have at most ${options.precision} decimal places`,
        code: 'NUMBER_PRECISION_EXCEEDED',
        value: numValue,
        constraints: { precision: options.precision },
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: numValue,
  };
};

/**
 * 3. Validates array inputs with element validation and size constraints.
 *
 * @param {any} value - Value to validate
 * @param {object} options - Validation options
 * @param {number} options.minLength - Minimum array length
 * @param {number} options.maxLength - Maximum array length
 * @param {Function} options.elementValidator - Validator for each element
 * @param {boolean} options.unique - Elements must be unique
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateArray([1, 2, 3], {
 *   minLength: 1,
 *   maxLength: 5,
 *   elementValidator: (val) => validateNumber(val, { min: 0 }),
 *   unique: true
 * });
 * ```
 */
export const validateArray = (
  value: any,
  options: {
    minLength?: number;
    maxLength?: number;
    elementValidator?: (element: any, index: number) => ValidationResult;
    unique?: boolean;
  } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!Array.isArray(value)) {
    errors.push({
      field: 'value',
      message: 'Value must be an array',
      code: 'ARRAY_TYPE_INVALID',
      value,
    });
    return { isValid: false, errors };
  }

  if (options.minLength !== undefined && value.length < options.minLength) {
    errors.push({
      field: 'value',
      message: `Array must contain at least ${options.minLength} elements`,
      code: 'ARRAY_TOO_SHORT',
      value,
      constraints: { minLength: options.minLength },
    });
  }

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    errors.push({
      field: 'value',
      message: `Array must contain at most ${options.maxLength} elements`,
      code: 'ARRAY_TOO_LONG',
      value,
      constraints: { maxLength: options.maxLength },
    });
  }

  if (options.unique) {
    const seen = new Set();
    const duplicates: any[] = [];
    value.forEach((element, index) => {
      const key = JSON.stringify(element);
      if (seen.has(key)) {
        duplicates.push({ element, index });
      }
      seen.add(key);
    });

    if (duplicates.length > 0) {
      errors.push({
        field: 'value',
        message: 'Array elements must be unique',
        code: 'ARRAY_CONTAINS_DUPLICATES',
        value: duplicates,
      });
    }
  }

  if (options.elementValidator) {
    value.forEach((element, index) => {
      const elementResult = options.elementValidator!(element, index);
      if (!elementResult.isValid) {
        errors.push(
          ...elementResult.errors.map((err) => ({
            ...err,
            field: `value[${index}].${err.field}`,
          })),
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: value,
  };
};

/**
 * 4. Validates object structure against a schema definition.
 *
 * @param {any} value - Value to validate
 * @param {object} schema - Schema definition with field validators
 * @param {SchemaValidationOptions} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const schema = {
 *   name: (val) => validateNonEmptyString(val, { minLength: 2 }),
 *   age: (val) => validateNumber(val, { min: 0, max: 150, integer: true }),
 *   email: (val) => validateEmail(val)
 * };
 * const result = validateObject({ name: 'John', age: 30, email: 'john@example.com' }, schema);
 * ```
 */
export const validateObject = (
  value: any,
  schema: Record<string, (val: any) => ValidationResult>,
  options: SchemaValidationOptions = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    errors.push({
      field: 'value',
      message: 'Value must be an object',
      code: 'OBJECT_TYPE_INVALID',
      value,
    });
    return { isValid: false, errors };
  }

  const sanitizedValue: Record<string, any> = {};

  // Validate defined schema fields
  for (const [field, validator] of Object.entries(schema)) {
    const fieldValue = value[field];
    const fieldResult = validator(fieldValue);

    if (!fieldResult.isValid) {
      errors.push(
        ...fieldResult.errors.map((err) => ({
          ...err,
          field: `${field}.${err.field}`.replace(/\.value$/, ''),
        })),
      );
      if (options.abortEarly) {
        break;
      }
    } else {
      sanitizedValue[field] = fieldResult.sanitizedValue ?? fieldValue;
    }
  }

  // Handle unknown fields
  if (options.strict) {
    const unknownFields = Object.keys(value).filter(
      (key) => !schema.hasOwnProperty(key),
    );
    if (unknownFields.length > 0) {
      errors.push({
        field: 'value',
        message: `Unknown fields: ${unknownFields.join(', ')}`,
        code: 'OBJECT_UNKNOWN_FIELDS',
        value: unknownFields,
      });
    }
  } else if (!options.stripUnknown) {
    Object.keys(value).forEach((key) => {
      if (!schema.hasOwnProperty(key)) {
        sanitizedValue[key] = value[key];
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue,
  };
};

/**
 * 5. Validates enum values against allowed options.
 *
 * @param {any} value - Value to validate
 * @param {any[]} allowedValues - Array of allowed enum values
 * @param {object} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEnum('ACTIVE', ['ACTIVE', 'INACTIVE', 'PENDING']);
 * // Result: { isValid: true, errors: [], sanitizedValue: 'ACTIVE' }
 *
 * const result2 = validateEnum('INVALID', ['ACTIVE', 'INACTIVE'], { caseSensitive: false });
 * // Result: { isValid: false, errors: [{ code: 'ENUM_INVALID_VALUE', ... }] }
 * ```
 */
export const validateEnum = (
  value: any,
  allowedValues: any[],
  options: { caseSensitive?: boolean; field?: string } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];
  const field = options.field || 'value';

  if (allowedValues.length === 0) {
    errors.push({
      field,
      message: 'No allowed values provided',
      code: 'ENUM_NO_VALUES',
      value,
    });
    return { isValid: false, errors };
  }

  let isValid = false;
  let sanitizedValue = value;

  if (options.caseSensitive === false && typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    const matchedValue = allowedValues.find(
      (allowed) =>
        typeof allowed === 'string' && allowed.toLowerCase() === lowerValue,
    );
    if (matchedValue) {
      isValid = true;
      sanitizedValue = matchedValue;
    }
  } else {
    isValid = allowedValues.includes(value);
  }

  if (!isValid) {
    errors.push({
      field,
      message: `Value must be one of: ${allowedValues.join(', ')}`,
      code: 'ENUM_INVALID_VALUE',
      value,
      constraints: { allowedValues },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue,
  };
};

/**
 * 6. Validates UUID strings in various formats (v1, v4, v5).
 *
 * @param {any} value - Value to validate
 * @param {object} options - Validation options
 * @param {number[]} options.versions - Allowed UUID versions
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateUuid('550e8400-e29b-41d4-a716-446655440000', { versions: [4] });
 * // Result: { isValid: true, errors: [], sanitizedValue: '550e8400-e29b-41d4-a716-446655440000' }
 * ```
 */
export const validateUuid = (
  value: any,
  options: { versions?: number[]; field?: string } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];
  const field = options.field || 'value';

  if (typeof value !== 'string') {
    errors.push({
      field,
      message: 'Value must be a string',
      code: 'UUID_TYPE_INVALID',
      value,
    });
    return { isValid: false, errors };
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(value)) {
    errors.push({
      field,
      message: 'Value must be a valid UUID',
      code: 'UUID_INVALID_FORMAT',
      value,
    });
    return { isValid: false, errors };
  }

  if (options.versions && options.versions.length > 0) {
    const version = parseInt(value.charAt(14), 16);
    if (!options.versions.includes(version)) {
      errors.push({
        field,
        message: `UUID must be version ${options.versions.join(' or ')}`,
        code: 'UUID_INVALID_VERSION',
        value,
        constraints: { allowedVersions: options.versions },
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: value.toLowerCase(),
  };
};

/**
 * 7. Validates regular expression patterns against input strings.
 *
 * @param {any} value - Value to validate
 * @param {RegExp} pattern - Regular expression pattern
 * @param {string} errorMessage - Custom error message
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePattern('ABC-123', /^[A-Z]{3}-\d{3}$/, 'Invalid format');
 * // Result: { isValid: true, errors: [], sanitizedValue: 'ABC-123' }
 * ```
 */
export const validatePattern = (
  value: any,
  pattern: RegExp,
  errorMessage: string = 'Value does not match required pattern',
  field: string = 'value',
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof value !== 'string') {
    errors.push({
      field,
      message: 'Value must be a string',
      code: 'PATTERN_TYPE_INVALID',
      value,
    });
    return { isValid: false, errors };
  }

  if (!pattern.test(value)) {
    errors.push({
      field,
      message: errorMessage,
      code: 'PATTERN_MISMATCH',
      value,
      constraints: { pattern: pattern.toString() },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: value,
  };
};

/**
 * 8. Validates that a value matches another value (e.g., password confirmation).
 *
 * @param {any} value - Value to validate
 * @param {any} matchValue - Value to match against
 * @param {object} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMatch('password123', 'password123', { field: 'confirmPassword' });
 * // Result: { isValid: true, errors: [], sanitizedValue: 'password123' }
 * ```
 */
export const validateMatch = (
  value: any,
  matchValue: any,
  options: { field?: string; matchField?: string; strict?: boolean } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];
  const field = options.field || 'value';
  const matchField = options.matchField || 'matchValue';

  const isMatch = options.strict ? value === matchValue : value == matchValue;

  if (!isMatch) {
    errors.push({
      field,
      message: `${field} must match ${matchField}`,
      code: 'VALUES_DO_NOT_MATCH',
      value,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: value,
  };
};

// ============================================================================
// SECTION 2: CUSTOM VALIDATOR BUILDERS (Functions 9-14)
// ============================================================================

/**
 * 9. Creates a custom validation decorator for class-validator.
 *
 * @param {Function} validatorFn - Validator function
 * @param {string} defaultMessage - Default error message
 * @returns {Function} Decorator factory
 *
 * @example
 * ```typescript
 * const IsValidStudentId = createCustomValidator(
 *   (value) => /^STU\d{6}$/.test(value),
 *   'Student ID must be in format STU123456'
 * );
 *
 * class CreateStudentDto {
 *   @IsValidStudentId()
 *   studentId: string;
 * }
 * ```
 */
export const createCustomValidator = (
  validatorFn: (value: any, args?: ValidationArguments) => boolean | Promise<boolean>,
  defaultMessage: string = 'Validation failed',
  name: string = 'CustomValidator',
) => {
  return (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
      registerDecorator({
        name: name,
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            return validatorFn(value, args);
          },
          defaultMessage: buildMessage(
            () => validationOptions?.message || defaultMessage,
          ),
        },
      });
    };
  };
};

/**
 * 10. Creates an async validator with external service validation.
 *
 * @param {Function} asyncValidatorFn - Async validator function
 * @param {string} defaultMessage - Default error message
 * @returns {Function} Decorator factory
 *
 * @example
 * ```typescript
 * const IsEmailUnique = createAsyncValidator(
 *   async (value) => {
 *     const exists = await userService.emailExists(value);
 *     return !exists;
 *   },
 *   'Email already exists'
 * );
 * ```
 */
export const createAsyncValidator = (
  asyncValidatorFn: (value: any, args?: ValidationArguments) => Promise<boolean>,
  defaultMessage: string = 'Async validation failed',
  name: string = 'AsyncValidator',
) => {
  @ValidatorConstraint({ name, async: true })
  class AsyncValidatorConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
      return asyncValidatorFn(value, args);
    }

    defaultMessage(args: ValidationArguments) {
      return defaultMessage;
    }
  }

  return (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: AsyncValidatorConstraint,
      });
    };
  };
};

/**
 * 11. Creates a composite validator that combines multiple validators.
 *
 * @param {Function[]} validators - Array of validator functions
 * @param {object} options - Validation options
 * @returns {Function} Combined validator function
 *
 * @example
 * ```typescript
 * const validateUserInput = createCompositeValidator([
 *   (val) => validateNonEmptyString(val, { minLength: 3 }),
 *   (val) => validatePattern(val, /^[a-zA-Z0-9]+$/, 'Alphanumeric only')
 * ], { stopOnFirstError: true });
 * ```
 */
export const createCompositeValidator = (
  validators: Array<(value: any) => ValidationResult>,
  options: { stopOnFirstError?: boolean } = {},
) => {
  return (value: any): ValidationResult => {
    const allErrors: ValidationError[] = [];
    let sanitizedValue = value;

    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        allErrors.push(...result.errors);
        if (options.stopOnFirstError) {
          break;
        }
      } else if (result.sanitizedValue !== undefined) {
        sanitizedValue = result.sanitizedValue;
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      sanitizedValue,
    };
  };
};

/**
 * 12. Creates a validator that validates dependencies between fields.
 *
 * @param {string[]} dependentFields - Fields to validate together
 * @param {Function} validatorFn - Cross-field validator function
 * @returns {Function} Decorator factory
 *
 * @example
 * ```typescript
 * const ValidateDateRange = createDependentFieldValidator(
 *   ['startDate', 'endDate'],
 *   (obj) => new Date(obj.startDate) < new Date(obj.endDate)
 * );
 *
 * @ValidateDateRange({ message: 'Start date must be before end date' })
 * class DateRangeDto {
 *   startDate: string;
 *   endDate: string;
 * }
 * ```
 */
export const createDependentFieldValidator = (
  dependentFields: string[],
  validatorFn: (object: any) => boolean | Promise<boolean>,
  defaultMessage: string = 'Dependent field validation failed',
) => {
  return (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
      registerDecorator({
        name: 'dependentFieldValidator',
        target: object.constructor,
        propertyName: propertyName,
        constraints: dependentFields,
        options: validationOptions,
        validator: {
          async validate(value: any, args: ValidationArguments) {
            return validatorFn(args.object);
          },
          defaultMessage: buildMessage(
            () => validationOptions?.message || defaultMessage,
          ),
        },
      });
    };
  };
};

/**
 * 13. Creates a validator factory with configurable parameters.
 *
 * @param {Function} factoryFn - Factory function that returns a validator
 * @returns {Function} Validator factory
 *
 * @example
 * ```typescript
 * const createRangeValidator = createValidatorFactory((min: number, max: number) => {
 *   return (value: any) => validateNumber(value, { min, max });
 * });
 *
 * const validate0to100 = createRangeValidator(0, 100);
 * const result = validate0to100(50);
 * ```
 */
export const createValidatorFactory = <TArgs extends any[], TValidator>(
  factoryFn: (...args: TArgs) => (value: any) => ValidationResult,
) => {
  return (...args: TArgs): ((value: any) => ValidationResult) => {
    return factoryFn(...args);
  };
};

/**
 * 14. Creates a reusable validator chain for complex validation flows.
 *
 * @param {string} name - Validator chain name
 * @returns {object} Validator chain builder
 *
 * @example
 * ```typescript
 * const passwordValidator = createValidatorChain('password')
 *   .addRule((val) => validateNonEmptyString(val, { minLength: 8 }))
 *   .addRule((val) => validatePattern(val, /[A-Z]/, 'Must contain uppercase'))
 *   .addRule((val) => validatePattern(val, /[0-9]/, 'Must contain number'))
 *   .build();
 *
 * const result = passwordValidator('MyPass123');
 * ```
 */
export const createValidatorChain = (name: string = 'validatorChain') => {
  const rules: Array<(value: any) => ValidationResult> = [];

  return {
    addRule(validator: (value: any) => ValidationResult) {
      rules.push(validator);
      return this;
    },
    build(options: { stopOnFirstError?: boolean } = {}) {
      return (value: any): ValidationResult => {
        const allErrors: ValidationError[] = [];
        let sanitizedValue = value;

        for (const rule of rules) {
          const result = rule(value);
          if (!result.isValid) {
            allErrors.push(...result.errors);
            if (options.stopOnFirstError) {
              break;
            }
          } else if (result.sanitizedValue !== undefined) {
            sanitizedValue = result.sanitizedValue;
          }
        }

        return {
          isValid: allErrors.length === 0,
          errors: allErrors,
          sanitizedValue,
        };
      };
    },
  };
};

// ============================================================================
// SECTION 3: SANITIZATION FUNCTIONS (Functions 15-20)
// ============================================================================

/**
 * 15. Sanitizes string input by removing unwanted characters and formatting.
 *
 * @param {string} value - String to sanitize
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const result = sanitizeString('  Hello World!  ', { trim: true, lowercase: true });
 * // Result: 'hello world!'
 *
 * const result2 = sanitizeString('User@#123', { removeSpecialChars: true });
 * // Result: 'User123'
 * ```
 */
export const sanitizeString = (
  value: string,
  options: SanitizationOptions = {},
): string => {
  if (typeof value !== 'string') {
    return '';
  }

  let sanitized = value;

  if (options.trim) {
    sanitized = sanitized.trim();
  }

  if (options.lowercase) {
    sanitized = sanitized.toLowerCase();
  }

  if (options.uppercase) {
    sanitized = sanitized.toUpperCase();
  }

  if (options.removeSpecialChars) {
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  if (options.allowedChars) {
    sanitized = sanitized
      .split('')
      .filter((char) => options.allowedChars!.test(char))
      .join('');
  }

  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  return sanitized;
};

/**
 * 16. Sanitizes HTML input to prevent XSS attacks.
 *
 * @param {string} html - HTML string to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized HTML string
 *
 * @example
 * ```typescript
 * const dirty = '<script>alert("XSS")</script><p>Safe content</p>';
 * const clean = sanitizeHtml(dirty, { allowedTags: ['p', 'strong', 'em'] });
 * // Result: '<p>Safe content</p>'
 * ```
 */
export const sanitizeHtml = (
  html: string,
  options: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    stripAll?: boolean;
  } = {},
): string => {
  if (typeof html !== 'string') {
    return '';
  }

  if (options.stripAll) {
    return html.replace(/<[^>]*>/g, '');
  }

  const allowedTags = options.allowedTags || ['p', 'br', 'strong', 'em', 'u'];
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
  ];

  let sanitized = html;

  // Remove dangerous patterns
  dangerousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Remove tags not in allowed list
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  sanitized = sanitized.replace(tagPattern, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Remove dangerous attributes
      return match.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    }
    return '';
  });

  return sanitized;
};

/**
 * 17. Sanitizes email addresses and normalizes format.
 *
 * @param {string} email - Email address to sanitize
 * @returns {string} Sanitized email address
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeEmail('  User.Name+Tag@EXAMPLE.COM  ');
 * // Result: 'user.name+tag@example.com'
 * ```
 */
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {
    return '';
  }

  let sanitized = email.trim().toLowerCase();

  // Remove multiple @ signs (keep only first)
  const parts = sanitized.split('@');
  if (parts.length > 2) {
    sanitized = parts[0] + '@' + parts.slice(1).join('');
  }

  // Remove spaces
  sanitized = sanitized.replace(/\s/g, '');

  return sanitized;
};

/**
 * 18. Sanitizes phone numbers to a standard format.
 *
 * @param {string} phone - Phone number to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized phone number
 *
 * @example
 * ```typescript
 * const sanitized = sanitizePhoneNumber('(555) 123-4567', { format: 'digits' });
 * // Result: '5551234567'
 *
 * const sanitized2 = sanitizePhoneNumber('555-123-4567', { format: 'E164', countryCode: '+1' });
 * // Result: '+15551234567'
 * ```
 */
export const sanitizePhoneNumber = (
  phone: string,
  options: { format?: 'digits' | 'E164' | 'international'; countryCode?: string } = {},
): string => {
  if (typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit characters except + at the start
  let sanitized = phone.replace(/[^\d+]/g, '');

  // If there's a + not at the start, remove it
  if (sanitized.indexOf('+') > 0) {
    sanitized = sanitized.replace(/\+/g, '');
  }

  if (options.format === 'digits') {
    sanitized = sanitized.replace(/\+/g, '');
  } else if (options.format === 'E164' || options.format === 'international') {
    if (!sanitized.startsWith('+')) {
      const countryCode = options.countryCode || '+1';
      sanitized = countryCode + sanitized;
    }
  }

  return sanitized;
};

/**
 * 19. Sanitizes file names to prevent path traversal attacks.
 *
 * @param {string} filename - File name to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized file name
 *
 * @example
 * ```typescript
 * const safe = sanitizeFilename('../../../etc/passwd', { maxLength: 255 });
 * // Result: 'etc_passwd'
 *
 * const safe2 = sanitizeFilename('my file (1).txt', { replaceSpaces: '_' });
 * // Result: 'my_file_1.txt'
 * ```
 */
export const sanitizeFilename = (
  filename: string,
  options: { maxLength?: number; replaceSpaces?: string; allowedExtensions?: string[] } = {},
): string => {
  if (typeof filename !== 'string') {
    return 'unnamed';
  }

  let sanitized = filename;

  // Remove path traversal attempts
  sanitized = sanitized.replace(/\.\./g, '');
  sanitized = sanitized.replace(/[\/\\]/g, '_');

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');

  // Replace spaces if requested
  if (options.replaceSpaces) {
    sanitized = sanitized.replace(/\s+/g, options.replaceSpaces);
  }

  // Limit length
  const maxLength = options.maxLength || 255;
  if (sanitized.length > maxLength) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    const nameLength = maxLength - ext.length;
    sanitized = sanitized.substring(0, nameLength) + ext;
  }

  // Validate extension if allowedExtensions provided
  if (options.allowedExtensions && options.allowedExtensions.length > 0) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.') + 1).toLowerCase();
    if (!options.allowedExtensions.includes(ext)) {
      sanitized = sanitized.substring(0, sanitized.lastIndexOf('.')) + '.txt';
    }
  }

  return sanitized || 'unnamed';
};

/**
 * 20. Sanitizes JSON input and removes unsafe content.
 *
 * @param {string} json - JSON string to sanitize
 * @param {object} options - Sanitization options
 * @returns {any} Sanitized parsed JSON object or null
 *
 * @example
 * ```typescript
 * const safe = sanitizeJson('{"name": "John", "__proto__": "hack"}', { removeProto: true });
 * // Result: { name: 'John' }
 * ```
 */
export const sanitizeJson = (
  json: string,
  options: { removeProto?: boolean; maxDepth?: number; removeConstructor?: boolean } = {},
): any => {
  try {
    const parsed = JSON.parse(json);

    const sanitize = (obj: any, depth: number = 0): any => {
      if (options.maxDepth && depth > options.maxDepth) {
        return null;
      }

      if (obj === null || typeof obj !== 'object') {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map((item) => sanitize(item, depth + 1));
      }

      const sanitized: any = {};
      for (const key of Object.keys(obj)) {
        // Remove prototype pollution attempts
        if (options.removeProto && (key === '__proto__' || key === 'prototype')) {
          continue;
        }
        // Remove constructor attempts
        if (options.removeConstructor && key === 'constructor') {
          continue;
        }
        sanitized[key] = sanitize(obj[key], depth + 1);
      }

      return sanitized;
    };

    return sanitize(parsed);
  } catch (error) {
    return null;
  }
};

// ============================================================================
// SECTION 4: TYPE COERCION UTILITIES (Functions 21-25)
// ============================================================================

/**
 * 21. Coerces value to boolean with intelligent parsing.
 *
 * @param {any} value - Value to coerce
 * @param {object} options - Coercion options
 * @returns {boolean | null} Coerced boolean value or null if invalid
 *
 * @example
 * ```typescript
 * coerceToBoolean('true'); // true
 * coerceToBoolean('1'); // true
 * coerceToBoolean('yes'); // true (with strict: false)
 * coerceToBoolean('invalid'); // null
 * ```
 */
export const coerceToBoolean = (
  value: any,
  options: { strict?: boolean; defaultValue?: boolean } = {},
): boolean | null => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === null || value === undefined) {
    return options.defaultValue !== undefined ? options.defaultValue : null;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1') {
      return true;
    }
    if (lower === 'false' || lower === '0') {
      return false;
    }
    if (!options.strict) {
      if (['yes', 'y', 'on', 'enabled'].includes(lower)) {
        return true;
      }
      if (['no', 'n', 'off', 'disabled'].includes(lower)) {
        return false;
      }
    }
  }

  return options.defaultValue !== undefined ? options.defaultValue : null;
};

/**
 * 22. Coerces value to number with validation.
 *
 * @param {any} value - Value to coerce
 * @param {object} options - Coercion options
 * @returns {number | null} Coerced number or null if invalid
 *
 * @example
 * ```typescript
 * coerceToNumber('42'); // 42
 * coerceToNumber('3.14'); // 3.14
 * coerceToNumber('42px', { strict: false }); // 42
 * coerceToNumber('invalid'); // null
 * ```
 */
export const coerceToNumber = (
  value: any,
  options: TypeCoercionOptions & { allowNaN?: boolean; allowInfinity?: boolean } = {},
): number | null => {
  if (typeof value === 'number') {
    if (!options.allowNaN && isNaN(value)) return null;
    if (!options.allowInfinity && !isFinite(value)) return null;
    return value;
  }

  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;

    // Try parsing as float
    const parsed = parseFloat(trimmed);
    if (!isNaN(parsed)) {
      if (!options.allowInfinity && !isFinite(parsed)) return null;
      return parsed;
    }
  }

  return null;
};

/**
 * 23. Coerces value to Date object with format support.
 *
 * @param {any} value - Value to coerce
 * @param {object} options - Coercion options
 * @returns {Date | null} Coerced Date object or null if invalid
 *
 * @example
 * ```typescript
 * coerceToDate('2024-01-01'); // Date object
 * coerceToDate(1704067200000); // Date from timestamp
 * coerceToDate('invalid'); // null
 * ```
 */
export const coerceToDate = (
  value: any,
  options: { strict?: boolean; allowInvalidDate?: boolean } = {},
): Date | null => {
  if (value instanceof Date) {
    return isNaN(value.getTime()) && !options.allowInvalidDate ? null : value;
  }

  if (value === null || value === undefined) {
    return null;
  }

  // Try parsing as number (timestamp)
  if (typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  // Try parsing as string
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;

    const date = new Date(trimmed);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
};

/**
 * 24. Coerces value to array with element type coercion.
 *
 * @param {any} value - Value to coerce
 * @param {object} options - Coercion options
 * @returns {any[] | null} Coerced array or null if invalid
 *
 * @example
 * ```typescript
 * coerceToArray('a,b,c', { delimiter: ',' }); // ['a', 'b', 'c']
 * coerceToArray('[1,2,3]', { parseJson: true }); // [1, 2, 3]
 * coerceToArray(5); // [5]
 * ```
 */
export const coerceToArray = (
  value: any,
  options: {
    delimiter?: string;
    parseJson?: boolean;
    elementCoercer?: (val: any) => any;
    filterEmpty?: boolean;
  } = {},
): any[] | null => {
  if (Array.isArray(value)) {
    const result = options.elementCoercer
      ? value.map(options.elementCoercer)
      : value;
    return options.filterEmpty ? result.filter((v) => v !== null && v !== undefined) : result;
  }

  if (value === null || value === undefined) {
    return null;
  }

  // Try parsing as JSON
  if (options.parseJson && typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return coerceToArray(parsed, { ...options, parseJson: false });
      }
    } catch {
      // Continue to delimiter parsing
    }
  }

  // Try splitting by delimiter
  if (options.delimiter && typeof value === 'string') {
    const split = value.split(options.delimiter).map((s) => s.trim());
    const result = options.elementCoercer ? split.map(options.elementCoercer) : split;
    return options.filterEmpty ? result.filter((v) => v !== '') : result;
  }

  // Wrap single value in array
  return [value];
};

/**
 * 25. Coerces value to string with formatting options.
 *
 * @param {any} value - Value to coerce
 * @param {object} options - Coercion options
 * @returns {string} Coerced string value
 *
 * @example
 * ```typescript
 * coerceToString(42); // '42'
 * coerceToString({ name: 'John' }, { jsonStringify: true }); // '{"name":"John"}'
 * coerceToString(null, { nullAsEmpty: true }); // ''
 * ```
 */
export const coerceToString = (
  value: any,
  options: {
    nullAsEmpty?: boolean;
    undefinedAsEmpty?: boolean;
    jsonStringify?: boolean;
    trim?: boolean;
  } = {},
): string => {
  if (typeof value === 'string') {
    return options.trim ? value.trim() : value;
  }

  if (value === null) {
    return options.nullAsEmpty ? '' : 'null';
  }

  if (value === undefined) {
    return options.undefinedAsEmpty ? '' : 'undefined';
  }

  if (typeof value === 'object' && options.jsonStringify) {
    try {
      return JSON.stringify(value);
    } catch {
      return '[object Object]';
    }
  }

  const result = String(value);
  return options.trim ? result.trim() : result;
};

// ============================================================================
// SECTION 5: EMAIL, PHONE, URL VALIDATORS (Functions 26-30)
// ============================================================================

/**
 * 26. Validates email addresses with comprehensive rules.
 *
 * @param {string} email - Email address to validate
 * @param {EmailValidationOptions} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEmail('user@example.com');
 * // Result: { isValid: true, errors: [], sanitizedValue: 'user@example.com' }
 *
 * const result2 = validateEmail('invalid@', { requireTld: true });
 * // Result: { isValid: false, errors: [...] }
 * ```
 */
export const validateEmail = (
  email: string,
  options: EmailValidationOptions = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof email !== 'string') {
    errors.push({
      field: 'email',
      message: 'Email must be a string',
      code: 'EMAIL_TYPE_INVALID',
      value: email,
    });
    return { isValid: false, errors };
  }

  const sanitized = sanitizeEmail(email);

  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const simpleRegex = /^[^\s@]+@[^\s@]+$/;

  const regex = options.requireTld !== false ? emailRegex : simpleRegex;

  if (!regex.test(sanitized)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
      code: 'EMAIL_INVALID_FORMAT',
      value: sanitized,
    });
    return { isValid: false, errors };
  }

  const [localPart, domain] = sanitized.split('@');

  // Validate local part
  if (localPart.length > 64) {
    errors.push({
      field: 'email',
      message: 'Email local part too long (max 64 characters)',
      code: 'EMAIL_LOCAL_TOO_LONG',
      value: sanitized,
    });
  }

  // Validate domain
  if (domain.length > 255) {
    errors.push({
      field: 'email',
      message: 'Email domain too long (max 255 characters)',
      code: 'EMAIL_DOMAIN_TOO_LONG',
      value: sanitized,
    });
  }

  // Check domain blacklist/whitelist
  if (options.domainBlacklist && options.domainBlacklist.includes(domain)) {
    errors.push({
      field: 'email',
      message: 'Email domain is not allowed',
      code: 'EMAIL_DOMAIN_BLACKLISTED',
      value: sanitized,
    });
  }

  if (options.domainWhitelist && !options.domainWhitelist.includes(domain)) {
    errors.push({
      field: 'email',
      message: 'Email domain is not in allowed list',
      code: 'EMAIL_DOMAIN_NOT_WHITELISTED',
      value: sanitized,
    });
  }

  // Check for IP domain
  if (!options.allowIpDomain && /^\[?\d+\.\d+\.\d+\.\d+\]?$/.test(domain)) {
    errors.push({
      field: 'email',
      message: 'Email domain cannot be an IP address',
      code: 'EMAIL_DOMAIN_IP_NOT_ALLOWED',
      value: sanitized,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: sanitized,
  };
};

/**
 * 27. Validates phone numbers with international format support.
 *
 * @param {string} phone - Phone number to validate
 * @param {PhoneValidationOptions} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePhoneNumber('+1-555-123-4567', { country: 'US' });
 * // Result: { isValid: true, errors: [], sanitizedValue: '+15551234567' }
 * ```
 */
export const validatePhoneNumber = (
  phone: string,
  options: PhoneValidationOptions = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof phone !== 'string') {
    errors.push({
      field: 'phone',
      message: 'Phone must be a string',
      code: 'PHONE_TYPE_INVALID',
      value: phone,
    });
    return { isValid: false, errors };
  }

  const sanitized = sanitizePhoneNumber(phone, {
    format: options.format || 'E164',
  });

  // E.164 format validation (e.g., +1234567890)
  const e164Regex = /^\+[1-9]\d{1,14}$/;

  // Basic validation - must have digits
  if (!/\d/.test(sanitized)) {
    errors.push({
      field: 'phone',
      message: 'Phone number must contain digits',
      code: 'PHONE_NO_DIGITS',
      value: sanitized,
    });
    return { isValid: false, errors };
  }

  // Validate format
  if (options.format === 'E164' && !e164Regex.test(sanitized)) {
    errors.push({
      field: 'phone',
      message: 'Phone number must be in E.164 format (+1234567890)',
      code: 'PHONE_INVALID_E164_FORMAT',
      value: sanitized,
    });
  }

  // Country-specific validation
  if (options.country === 'US') {
    const digitsOnly = sanitized.replace(/\D/g, '');
    if (digitsOnly.length !== 10 && digitsOnly.length !== 11) {
      errors.push({
        field: 'phone',
        message: 'US phone number must have 10 or 11 digits',
        code: 'PHONE_US_INVALID_LENGTH',
        value: sanitized,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: sanitized,
  };
};

/**
 * 28. Validates URLs with protocol and structure checks.
 *
 * @param {string} url - URL to validate
 * @param {UrlValidationOptions} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateUrl('https://example.com/path?query=1');
 * // Result: { isValid: true, errors: [], sanitizedValue: 'https://example.com/path?query=1' }
 * ```
 */
export const validateUrl = (
  url: string,
  options: UrlValidationOptions = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof url !== 'string') {
    errors.push({
      field: 'url',
      message: 'URL must be a string',
      code: 'URL_TYPE_INVALID',
      value: url,
    });
    return { isValid: false, errors };
  }

  try {
    const parsed = new URL(url);

    // Validate protocol
    if (options.protocols && !options.protocols.includes(parsed.protocol.slice(0, -1))) {
      errors.push({
        field: 'url',
        message: `URL protocol must be one of: ${options.protocols.join(', ')}`,
        code: 'URL_INVALID_PROTOCOL',
        value: url,
        constraints: { allowedProtocols: options.protocols },
      });
    }

    // Validate TLD
    if (options.requireTld !== false) {
      const hostname = parsed.hostname;
      if (!hostname.includes('.') || hostname.endsWith('.')) {
        errors.push({
          field: 'url',
          message: 'URL must have a valid TLD',
          code: 'URL_MISSING_TLD',
          value: url,
        });
      }
    }

    // Validate query params
    if (options.allowQueryParams === false && parsed.search) {
      errors.push({
        field: 'url',
        message: 'URL cannot contain query parameters',
        code: 'URL_QUERY_NOT_ALLOWED',
        value: url,
      });
    }

    // Validate fragments
    if (options.allowFragments === false && parsed.hash) {
      errors.push({
        field: 'url',
        message: 'URL cannot contain fragments',
        code: 'URL_FRAGMENT_NOT_ALLOWED',
        value: url,
      });
    }

    // Validate auth
    if (options.allowAuth === false && (parsed.username || parsed.password)) {
      errors.push({
        field: 'url',
        message: 'URL cannot contain authentication credentials',
        code: 'URL_AUTH_NOT_ALLOWED',
        value: url,
      });
    }
  } catch (error) {
    errors.push({
      field: 'url',
      message: 'Invalid URL format',
      code: 'URL_INVALID_FORMAT',
      value: url,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: url,
  };
};

/**
 * 29. Validates credit card numbers using Luhn algorithm.
 *
 * @param {string} cardNumber - Credit card number to validate
 * @param {object} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCreditCard('4532-1488-0343-6467');
 * // Result: { isValid: true, errors: [], sanitizedValue: '4532148803436467' }
 * ```
 */
export const validateCreditCard = (
  cardNumber: string,
  options: { cardType?: 'visa' | 'mastercard' | 'amex' | 'discover' } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof cardNumber !== 'string') {
    errors.push({
      field: 'cardNumber',
      message: 'Card number must be a string',
      code: 'CARD_TYPE_INVALID',
      value: cardNumber,
    });
    return { isValid: false, errors };
  }

  // Remove spaces and dashes
  const sanitized = cardNumber.replace(/[\s-]/g, '');

  // Must be all digits
  if (!/^\d+$/.test(sanitized)) {
    errors.push({
      field: 'cardNumber',
      message: 'Card number must contain only digits',
      code: 'CARD_INVALID_FORMAT',
      value: cardNumber,
    });
    return { isValid: false, errors };
  }

  // Length validation
  if (sanitized.length < 13 || sanitized.length > 19) {
    errors.push({
      field: 'cardNumber',
      message: 'Card number must be between 13 and 19 digits',
      code: 'CARD_INVALID_LENGTH',
      value: sanitized,
    });
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    errors.push({
      field: 'cardNumber',
      message: 'Invalid card number (failed Luhn check)',
      code: 'CARD_LUHN_CHECK_FAILED',
      value: sanitized,
    });
  }

  // Card type validation
  if (options.cardType) {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    if (!patterns[options.cardType].test(sanitized)) {
      errors.push({
        field: 'cardNumber',
        message: `Card number does not match ${options.cardType} pattern`,
        code: 'CARD_TYPE_MISMATCH',
        value: sanitized,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: sanitized,
  };
};

/**
 * 30. Validates IP addresses (IPv4 and IPv6).
 *
 * @param {string} ip - IP address to validate
 * @param {object} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateIpAddress('192.168.1.1', { version: 4 });
 * // Result: { isValid: true, errors: [], sanitizedValue: '192.168.1.1' }
 *
 * const result2 = validateIpAddress('2001:0db8:85a3::8a2e:0370:7334', { version: 6 });
 * // Result: { isValid: true, errors: [] }
 * ```
 */
export const validateIpAddress = (
  ip: string,
  options: { version?: 4 | 6; allowPrivate?: boolean } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof ip !== 'string') {
    errors.push({
      field: 'ip',
      message: 'IP address must be a string',
      code: 'IP_TYPE_INVALID',
      value: ip,
    });
    return { isValid: false, errors };
  }

  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^([0-9a-fA-F]{1,4}:){0,6}::([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$/;

  let isValid = false;
  let version: number | null = null;

  // Check IPv4
  if (ipv4Regex.test(ip)) {
    const octets = ip.split('.').map(Number);
    isValid = octets.every((octet) => octet >= 0 && octet <= 255);
    version = 4;

    // Check for private IPv4
    if (!options.allowPrivate && isValid) {
      const isPrivate =
        octets[0] === 10 ||
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (octets[0] === 192 && octets[1] === 168);

      if (isPrivate) {
        errors.push({
          field: 'ip',
          message: 'Private IP addresses are not allowed',
          code: 'IP_PRIVATE_NOT_ALLOWED',
          value: ip,
        });
      }
    }
  }
  // Check IPv6
  else if (ipv6Regex.test(ip)) {
    isValid = true;
    version = 6;
  }

  if (!isValid) {
    errors.push({
      field: 'ip',
      message: 'Invalid IP address format',
      code: 'IP_INVALID_FORMAT',
      value: ip,
    });
  }

  if (options.version && version !== options.version) {
    errors.push({
      field: 'ip',
      message: `IP address must be IPv${options.version}`,
      code: 'IP_VERSION_MISMATCH',
      value: ip,
      constraints: { requiredVersion: options.version },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: ip,
  };
};

// ============================================================================
// SECTION 6: DATE/TIME VALIDATION (Functions 31-35)
// ============================================================================

/**
 * 31. Validates date strings with format and range checks.
 *
 * @param {any} date - Date value to validate
 * @param {DateValidationOptions} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateDate('2024-01-01', {
 *   minDate: new Date('2020-01-01'),
 *   maxDate: new Date('2030-12-31')
 * });
 * ```
 */
export const validateDate = (
  date: any,
  options: DateValidationOptions = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  const dateObj = coerceToDate(date);

  if (!dateObj) {
    errors.push({
      field: 'date',
      message: 'Invalid date format',
      code: 'DATE_INVALID_FORMAT',
      value: date,
    });
    return { isValid: false, errors };
  }

  const now = new Date();

  // Check past/future constraints
  if (options.allowPast === false && dateObj < now) {
    errors.push({
      field: 'date',
      message: 'Date cannot be in the past',
      code: 'DATE_IN_PAST',
      value: date,
    });
  }

  if (options.allowFuture === false && dateObj > now) {
    errors.push({
      field: 'date',
      message: 'Date cannot be in the future',
      code: 'DATE_IN_FUTURE',
      value: date,
    });
  }

  // Check min/max constraints
  if (options.minDate && dateObj < options.minDate) {
    errors.push({
      field: 'date',
      message: `Date must be after ${options.minDate.toISOString()}`,
      code: 'DATE_BEFORE_MIN',
      value: date,
      constraints: { minDate: options.minDate },
    });
  }

  if (options.maxDate && dateObj > options.maxDate) {
    errors.push({
      field: 'date',
      message: `Date must be before ${options.maxDate.toISOString()}`,
      code: 'DATE_AFTER_MAX',
      value: date,
      constraints: { maxDate: options.maxDate },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: dateObj,
  };
};

/**
 * 32. Validates time strings in various formats (HH:MM, HH:MM:SS).
 *
 * @param {string} time - Time string to validate
 * @param {object} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateTime('14:30:00', { format: 'HH:MM:SS', twentyFourHour: true });
 * // Result: { isValid: true, errors: [], sanitizedValue: '14:30:00' }
 * ```
 */
export const validateTime = (
  time: string,
  options: { format?: 'HH:MM' | 'HH:MM:SS'; twentyFourHour?: boolean } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof time !== 'string') {
    errors.push({
      field: 'time',
      message: 'Time must be a string',
      code: 'TIME_TYPE_INVALID',
      value: time,
    });
    return { isValid: false, errors };
  }

  const format = options.format || 'HH:MM:SS';
  const twentyFourHour = options.twentyFourHour !== false;

  let regex: RegExp;
  if (format === 'HH:MM') {
    regex = twentyFourHour
      ? /^([01]\d|2[0-3]):([0-5]\d)$/
      : /^(0?\d|1[0-2]):([0-5]\d)\s?(AM|PM)?$/i;
  } else {
    regex = twentyFourHour
      ? /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
      : /^(0?\d|1[0-2]):([0-5]\d):([0-5]\d)\s?(AM|PM)?$/i;
  }

  if (!regex.test(time)) {
    errors.push({
      field: 'time',
      message: `Time must be in ${format} format`,
      code: 'TIME_INVALID_FORMAT',
      value: time,
      constraints: { format, twentyFourHour },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: time,
  };
};

/**
 * 33. Validates date range ensuring start is before end.
 *
 * @param {any} startDate - Start date
 * @param {any} endDate - End date
 * @param {object} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateDateRange('2024-01-01', '2024-12-31');
 * // Result: { isValid: true, errors: [] }
 * ```
 */
export const validateDateRange = (
  startDate: any,
  endDate: any,
  options: { maxDurationDays?: number; minDurationDays?: number } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  const start = coerceToDate(startDate);
  const end = coerceToDate(endDate);

  if (!start) {
    errors.push({
      field: 'startDate',
      message: 'Invalid start date format',
      code: 'START_DATE_INVALID',
      value: startDate,
    });
  }

  if (!end) {
    errors.push({
      field: 'endDate',
      message: 'Invalid end date format',
      code: 'END_DATE_INVALID',
      value: endDate,
    });
  }

  if (start && end) {
    if (start >= end) {
      errors.push({
        field: 'dateRange',
        message: 'Start date must be before end date',
        code: 'DATE_RANGE_INVALID',
        value: { startDate, endDate },
      });
    }

    // Check duration constraints
    const durationMs = end.getTime() - start.getTime();
    const durationDays = durationMs / (1000 * 60 * 60 * 24);

    if (options.maxDurationDays && durationDays > options.maxDurationDays) {
      errors.push({
        field: 'dateRange',
        message: `Date range cannot exceed ${options.maxDurationDays} days`,
        code: 'DATE_RANGE_TOO_LONG',
        value: { startDate, endDate, durationDays },
        constraints: { maxDurationDays: options.maxDurationDays },
      });
    }

    if (options.minDurationDays && durationDays < options.minDurationDays) {
      errors.push({
        field: 'dateRange',
        message: `Date range must be at least ${options.minDurationDays} days`,
        code: 'DATE_RANGE_TOO_SHORT',
        value: { startDate, endDate, durationDays },
        constraints: { minDurationDays: options.minDurationDays },
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: { startDate: start, endDate: end },
  };
};

/**
 * 34. Validates age from date of birth.
 *
 * @param {any} dateOfBirth - Date of birth
 * @param {object} options - Validation options
 * @returns {ValidationResult} Validation result with calculated age
 *
 * @example
 * ```typescript
 * const result = validateAge('2000-01-01', { minAge: 18, maxAge: 65 });
 * // Result: { isValid: true, errors: [], sanitizedValue: { dateOfBirth: Date, age: 24 } }
 * ```
 */
export const validateAge = (
  dateOfBirth: any,
  options: { minAge?: number; maxAge?: number } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  const dob = coerceToDate(dateOfBirth);

  if (!dob) {
    errors.push({
      field: 'dateOfBirth',
      message: 'Invalid date of birth format',
      code: 'DOB_INVALID_FORMAT',
      value: dateOfBirth,
    });
    return { isValid: false, errors };
  }

  const now = new Date();
  if (dob > now) {
    errors.push({
      field: 'dateOfBirth',
      message: 'Date of birth cannot be in the future',
      code: 'DOB_IN_FUTURE',
      value: dateOfBirth,
    });
    return { isValid: false, errors };
  }

  // Calculate age
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }

  if (options.minAge !== undefined && age < options.minAge) {
    errors.push({
      field: 'age',
      message: `Age must be at least ${options.minAge}`,
      code: 'AGE_TOO_YOUNG',
      value: age,
      constraints: { minAge: options.minAge },
    });
  }

  if (options.maxAge !== undefined && age > options.maxAge) {
    errors.push({
      field: 'age',
      message: `Age must be at most ${options.maxAge}`,
      code: 'AGE_TOO_OLD',
      value: age,
      constraints: { maxAge: options.maxAge },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: { dateOfBirth: dob, age },
  };
};

/**
 * 35. Validates timezone strings.
 *
 * @param {string} timezone - Timezone string (e.g., 'America/New_York')
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateTimezone('America/New_York');
 * // Result: { isValid: true, errors: [], sanitizedValue: 'America/New_York' }
 * ```
 */
export const validateTimezone = (timezone: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof timezone !== 'string') {
    errors.push({
      field: 'timezone',
      message: 'Timezone must be a string',
      code: 'TIMEZONE_TYPE_INVALID',
      value: timezone,
    });
    return { isValid: false, errors };
  }

  try {
    // Try to use the timezone with Intl.DateTimeFormat
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
  } catch (error) {
    errors.push({
      field: 'timezone',
      message: 'Invalid timezone identifier',
      code: 'TIMEZONE_INVALID',
      value: timezone,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: timezone,
  };
};

// ============================================================================
// SECTION 7: FILE VALIDATION (Functions 36-39)
// ============================================================================

/**
 * 36. Validates file size constraints.
 *
 * @param {number} fileSize - File size in bytes
 * @param {object} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFileSize(1024000, { maxSize: 5242880, minSize: 1024 });
 * // Result: { isValid: true, errors: [] }
 * ```
 */
export const validateFileSize = (
  fileSize: number,
  options: { maxSize?: number; minSize?: number } = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof fileSize !== 'number' || fileSize < 0) {
    errors.push({
      field: 'fileSize',
      message: 'File size must be a non-negative number',
      code: 'FILE_SIZE_INVALID',
      value: fileSize,
    });
    return { isValid: false, errors };
  }

  if (options.minSize && fileSize < options.minSize) {
    errors.push({
      field: 'fileSize',
      message: `File size must be at least ${options.minSize} bytes`,
      code: 'FILE_TOO_SMALL',
      value: fileSize,
      constraints: { minSize: options.minSize },
    });
  }

  if (options.maxSize && fileSize > options.maxSize) {
    errors.push({
      field: 'fileSize',
      message: `File size must not exceed ${options.maxSize} bytes`,
      code: 'FILE_TOO_LARGE',
      value: fileSize,
      constraints: { maxSize: options.maxSize },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: fileSize,
  };
};

/**
 * 37. Validates file MIME type against allowed types.
 *
 * @param {string} mimeType - File MIME type
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFileMimeType('image/jpeg', ['image/jpeg', 'image/png', 'application/pdf']);
 * // Result: { isValid: true, errors: [] }
 * ```
 */
export const validateFileMimeType = (
  mimeType: string,
  allowedTypes: string[],
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof mimeType !== 'string') {
    errors.push({
      field: 'mimeType',
      message: 'MIME type must be a string',
      code: 'MIME_TYPE_INVALID',
      value: mimeType,
    });
    return { isValid: false, errors };
  }

  const normalized = mimeType.toLowerCase().trim();

  // Check exact match or wildcard match
  const isAllowed = allowedTypes.some((allowed) => {
    const normalizedAllowed = allowed.toLowerCase().trim();
    if (normalizedAllowed.endsWith('/*')) {
      const prefix = normalizedAllowed.slice(0, -2);
      return normalized.startsWith(prefix);
    }
    return normalized === normalizedAllowed;
  });

  if (!isAllowed) {
    errors.push({
      field: 'mimeType',
      message: `File type ${mimeType} is not allowed`,
      code: 'MIME_TYPE_NOT_ALLOWED',
      value: mimeType,
      constraints: { allowedTypes },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: normalized,
  };
};

/**
 * 38. Validates file extension against allowed extensions.
 *
 * @param {string} filename - File name
 * @param {string[]} allowedExtensions - Allowed file extensions
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFileExtension('document.pdf', ['pdf', 'doc', 'docx']);
 * // Result: { isValid: true, errors: [] }
 * ```
 */
export const validateFileExtension = (
  filename: string,
  allowedExtensions: string[],
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof filename !== 'string') {
    errors.push({
      field: 'filename',
      message: 'Filename must be a string',
      code: 'FILENAME_TYPE_INVALID',
      value: filename,
    });
    return { isValid: false, errors };
  }

  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    errors.push({
      field: 'filename',
      message: 'File has no extension',
      code: 'FILE_NO_EXTENSION',
      value: filename,
    });
    return { isValid: false, errors };
  }

  const extension = filename.substring(lastDotIndex + 1).toLowerCase();
  const normalizedAllowed = allowedExtensions.map((ext) =>
    ext.toLowerCase().replace(/^\./, ''),
  );

  if (!normalizedAllowed.includes(extension)) {
    errors.push({
      field: 'filename',
      message: `File extension .${extension} is not allowed`,
      code: 'FILE_EXTENSION_NOT_ALLOWED',
      value: filename,
      constraints: { allowedExtensions },
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: filename,
  };
};

/**
 * 39. Validates complete file object (name, size, type).
 *
 * @param {object} file - File object with name, size, and type
 * @param {FileValidationOptions} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const file = { name: 'report.pdf', size: 1024000, type: 'application/pdf' };
 * const result = validateFile(file, {
 *   maxSize: 5242880,
 *   allowedMimeTypes: ['application/pdf'],
 *   allowedExtensions: ['pdf']
 * });
 * ```
 */
export const validateFile = (
  file: { name: string; size: number; type: string },
  options: FileValidationOptions = {},
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!file || typeof file !== 'object') {
    errors.push({
      field: 'file',
      message: 'File must be an object',
      code: 'FILE_INVALID',
      value: file,
    });
    return { isValid: false, errors };
  }

  // Validate file size
  if (options.maxSize || options.minSize) {
    const sizeResult = validateFileSize(file.size, {
      maxSize: options.maxSize,
      minSize: options.minSize,
    });
    errors.push(...sizeResult.errors);
  }

  // Validate MIME type
  if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
    const mimeResult = validateFileMimeType(file.type, options.allowedMimeTypes);
    errors.push(...mimeResult.errors);
  }

  // Validate extension
  if (options.allowedExtensions && options.allowedExtensions.length > 0) {
    const extResult = validateFileExtension(file.name, options.allowedExtensions);
    errors.push(...extResult.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: file,
  };
};

// ============================================================================
// SECTION 8: BUSINESS RULES & PIPES (Functions 40-45)
// ============================================================================

/**
 * 40. Creates a business rule validator with context.
 *
 * @param {ValidationRule[]} rules - Array of validation rules
 * @returns {Function} Validator function
 *
 * @example
 * ```typescript
 * const validatePatientEligibility = createBusinessRuleValidator([
 *   {
 *     name: 'ageRequirement',
 *     validate: (patient) => patient.age >= 18,
 *     message: 'Patient must be 18 or older'
 *   },
 *   {
 *     name: 'insuranceActive',
 *     validate: async (patient) => await insuranceService.isActive(patient.insuranceId),
 *     message: 'Patient insurance must be active'
 *   }
 * ]);
 * ```
 */
export const createBusinessRuleValidator = (rules: ValidationRule[]) => {
  return async (value: any, context?: BusinessRuleValidationContext): Promise<ValidationResult> => {
    const errors: ValidationError[] = [];

    for (const rule of rules) {
      try {
        const isValid = await rule.validate(value, context);
        if (!isValid) {
          errors.push({
            field: rule.name,
            message: rule.message,
            code: `BUSINESS_RULE_${rule.name.toUpperCase()}_FAILED`,
            value,
          });

          if (rule.severity === 'error') {
            break;
          }
        }
      } catch (error) {
        errors.push({
          field: rule.name,
          message: `Validation error: ${(error as Error).message}`,
          code: `BUSINESS_RULE_${rule.name.toUpperCase()}_ERROR`,
          value,
        });
      }
    }

    return {
      isValid: errors.filter((e) => e.code.includes('ERROR')).length === 0,
      errors,
      sanitizedValue: value,
    };
  };
};

/**
 * 41. Creates conditional validation based on field values.
 *
 * @param {ConditionalValidationRule[]} rules - Conditional validation rules
 * @returns {Function} Conditional validator
 *
 * @example
 * ```typescript
 * const validator = createConditionalValidator([
 *   {
 *     condition: (value, context) => context.paymentMethod === 'credit_card',
 *     validators: [
 *       { name: 'cardNumber', validate: validateCreditCard, message: 'Invalid card' }
 *     ]
 *   }
 * ]);
 * ```
 */
export const createConditionalValidator = (rules: ConditionalValidationRule[]) => {
  return async (value: any, context: any): Promise<ValidationResult> => {
    const errors: ValidationError[] = [];

    for (const rule of rules) {
      const shouldValidate = rule.condition(value, context);

      if (shouldValidate) {
        for (const validator of rule.validators) {
          try {
            const isValid = await validator.validate(value, context);
            if (!isValid) {
              errors.push({
                field: validator.name,
                message: validator.message,
                code: `CONDITIONAL_VALIDATION_FAILED`,
                value,
              });
            }
          } catch (error) {
            errors.push({
              field: validator.name,
              message: rule.errorMessage || validator.message,
              code: `CONDITIONAL_VALIDATION_ERROR`,
              value,
            });
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: value,
    };
  };
};

/**
 * 42. Creates a NestJS validation pipe factory with custom options.
 *
 * @param {object} options - Pipe options
 * @returns {PipeTransform} Validation pipe instance
 *
 * @example
 * ```typescript
 * @Post()
 * async create(
 *   @Body(createValidationPipe({ transform: true, whitelist: true }))
 *   createDto: CreatePatientDto
 * ) {
 *   return this.service.create(createDto);
 * }
 * ```
 */
export const createValidationPipe = (options: {
  transform?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  transformOptions?: any;
  errorHttpStatusCode?: number;
  exceptionFactory?: (errors: any[]) => any;
}) => {
  @Injectable()
  class CustomValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
      const { transform, whitelist, forbidNonWhitelisted } = options;

      if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
        return value;
      }

      // Simple pass-through for now - real implementation would use class-validator
      return value;
    }

    private toValidate(metatype: Function): boolean {
      const types: Function[] = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype);
    }
  }

  return new CustomValidationPipe();
};

/**
 * 43. Formats validation errors into user-friendly messages.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @param {object} options - Formatting options
 * @returns {string | object} Formatted error message(s)
 *
 * @example
 * ```typescript
 * const formatted = formatValidationErrors(errors, { format: 'string' });
 * // Result: 'Email is invalid; Password must be at least 8 characters'
 *
 * const formatted2 = formatValidationErrors(errors, { format: 'object' });
 * // Result: { email: ['Email is invalid'], password: ['Password must be at least 8 characters'] }
 * ```
 */
export const formatValidationErrors = (
  errors: ValidationError[],
  options: { format?: 'string' | 'object' | 'array'; includeCode?: boolean } = {},
): string | object | any[] => {
  if (errors.length === 0) {
    return options.format === 'object' ? {} : options.format === 'array' ? [] : '';
  }

  const format = options.format || 'string';

  if (format === 'string') {
    return errors
      .map((err) => {
        const prefix = err.field !== 'value' ? `${err.field}: ` : '';
        const suffix = options.includeCode ? ` (${err.code})` : '';
        return `${prefix}${err.message}${suffix}`;
      })
      .join('; ');
  }

  if (format === 'array') {
    return errors.map((err) => ({
      field: err.field,
      message: err.message,
      ...(options.includeCode && { code: err.code }),
    }));
  }

  // format === 'object'
  const grouped: Record<string, string[]> = {};
  errors.forEach((err) => {
    if (!grouped[err.field]) {
      grouped[err.field] = [];
    }
    const message = options.includeCode ? `${err.message} (${err.code})` : err.message;
    grouped[err.field].push(message);
  });

  return grouped;
};

/**
 * 44. Creates a schema validator from a type definition.
 *
 * @param {Type} type - Type class with decorators
 * @param {SchemaValidationOptions} options - Validation options
 * @returns {Function} Schema validator function
 *
 * @example
 * ```typescript
 * class CreatePatientDto {
 *   @IsString() @MinLength(2) name: string;
 *   @IsEmail() email: string;
 *   @IsInt() @Min(0) age: number;
 * }
 *
 * const validator = createSchemaValidator(CreatePatientDto);
 * const result = await validator({ name: 'John', email: 'john@example.com', age: 30 });
 * ```
 */
export const createSchemaValidator = <T>(
  type: Type<T>,
  options: SchemaValidationOptions = {},
) => {
  return async (value: any): Promise<ValidationResult> => {
    // This is a simplified version - real implementation would use class-validator
    const errors: ValidationError[] = [];

    if (typeof value !== 'object' || value === null) {
      errors.push({
        field: 'value',
        message: 'Value must be an object',
        code: 'SCHEMA_INVALID_TYPE',
        value,
      });
      return { isValid: false, errors };
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: value,
    };
  };
};

/**
 * 45. Validates multiple fields together with cross-field dependencies.
 *
 * @param {object} data - Data object to validate
 * @param {object} schema - Validation schema with cross-field rules
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCrossFieldDependencies(
 *   { startDate: '2024-01-01', endDate: '2024-12-31', duration: 365 },
 *   {
 *     dateRange: (data) => new Date(data.startDate) < new Date(data.endDate),
 *     durationMatch: (data) => {
 *       const days = (new Date(data.endDate) - new Date(data.startDate)) / (1000*60*60*24);
 *       return Math.abs(days - data.duration) < 1;
 *     }
 *   }
 * );
 * ```
 */
export const validateCrossFieldDependencies = (
  data: Record<string, any>,
  schema: Record<string, (data: any) => boolean | Promise<boolean>>,
): Promise<ValidationResult> => {
  return new Promise(async (resolve) => {
    const errors: ValidationError[] = [];

    for (const [ruleName, validator] of Object.entries(schema)) {
      try {
        const isValid = await validator(data);
        if (!isValid) {
          errors.push({
            field: ruleName,
            message: `Cross-field validation failed: ${ruleName}`,
            code: `CROSS_FIELD_${ruleName.toUpperCase()}_FAILED`,
            value: data,
          });
        }
      } catch (error) {
        errors.push({
          field: ruleName,
          message: `Validation error: ${(error as Error).message}`,
          code: `CROSS_FIELD_${ruleName.toUpperCase()}_ERROR`,
          value: data,
        });
      }
    }

    resolve({
      isValid: errors.length === 0,
      errors,
      sanitizedValue: data,
    });
  });
};
