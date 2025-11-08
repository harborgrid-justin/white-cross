/**
 * LOC: VTK1234567
 * File: /reuse/validation-transform-kit.ts
 *
 * UPSTREAM (imports from):
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *   - @nestjs/common (v11.1.8)
 *   - validator (v13.11.0)
 *
 * DOWNSTREAM (imported by):
 *   - DTO classes
 *   - Validation pipes
 *   - Input sanitization middleware
 *   - Form validation services
 *   - API controllers
 */

/**
 * File: /reuse/validation-transform-kit.ts
 * Locator: WC-UTL-VTRF-001
 * Purpose: Validation and Data Transformation Utilities - Comprehensive validation & transformation toolkit
 *
 * Upstream: class-validator, class-transformer, @nestjs/common, validator
 * Downstream: ../backend/*, DTOs, validation pipes, sanitization middleware, controllers
 * Dependencies: TypeScript 5.x, Node 18+, class-validator, class-transformer, validator
 * Exports: 50 validation & transformation utilities for runtime validation, sanitization, type conversion
 *
 * LLM Context: Production-grade validation and transformation toolkit for White Cross healthcare system.
 * Provides custom validation decorators, DTO transformation utilities, class-validator integration,
 * XSS/SQL injection sanitization, type coercion, schema validation (JSON Schema, Joi-like patterns),
 * array/object validation, conditional validation, cross-field validation, file upload validation,
 * email/phone/URL validators, credit card/payment validation, date/time validation, geographic validation,
 * and complex nested object validation. All functions are type-safe and production-ready.
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validateOrReject,
  validate,
  ValidationError,
  isEmail,
  isURL,
  isUUID,
  isCreditCard,
  isJSON,
} from 'class-validator';
import { Transform, Type, plainToClass, classToPlain, ClassConstructor } from 'class-transformer';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as validator from 'validator';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Validation result interface
 */
export interface ValidationResult<T = any> {
  isValid: boolean;
  value?: T;
  errors?: string[];
  warnings?: string[];
  metadata?: Record<string, any>;
}

/**
 * Schema validator function type
 */
export type SchemaValidator<T> = (value: T) => ValidationResult<T> | Promise<ValidationResult<T>>;

/**
 * Transformation function type
 */
export type TransformFn<TInput, TOutput> = (value: TInput) => TOutput;

/**
 * Sanitization options
 */
export interface SanitizationOptions {
  allowHtml?: boolean;
  allowedTags?: string[];
  stripScripts?: boolean;
  stripSql?: boolean;
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
}

/**
 * File validation options
 */
export interface FileValidationOptions {
  maxSize?: number;
  minSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  maxFiles?: number;
  requireImage?: boolean;
}

/**
 * Credit card validation result
 */
export interface CreditCardValidationResult {
  isValid: boolean;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
  lastFour?: string;
}

/**
 * Geographic coordinates
 */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Phone number validation result
 */
export interface PhoneValidationResult {
  isValid: boolean;
  formatted?: string;
  country?: string;
  type?: 'mobile' | 'landline' | 'unknown';
}

/**
 * Schema definition for Joi-like validation
 */
export interface SchemaDefinition<T = any> {
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'email' | 'url';
  required?: boolean;
  nullable?: boolean;
  default?: T;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: T[];
  custom?: (value: T) => boolean | Promise<boolean>;
  transform?: TransformFn<any, T>;
  items?: SchemaDefinition;
  properties?: Record<string, SchemaDefinition>;
}

/**
 * Conditional validation rule
 */
export interface ConditionalRule<T = any> {
  condition: (object: any) => boolean;
  validator: SchemaValidator<T>;
}

// ============================================================================
// CUSTOM VALIDATION DECORATORS
// ============================================================================

/**
 * Validates that a string is a valid medical record number (MRN).
 * Format: 3 letters followed by 6-10 digits.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @IsMedicalRecordNumber()
 *   mrn: string;
 * }
 * ```
 */
export function IsMedicalRecordNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMedicalRecordNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /^[A-Z]{3}\d{6,10}$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid medical record number (3 letters + 6-10 digits)`;
        },
      },
    });
  };
}

/**
 * Validates that a string is a valid ICD-10 code.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class DiagnosisDto {
 *   @IsICD10Code()
 *   diagnosisCode: string;
 * }
 * ```
 */
export function IsICD10Code(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isICD10Code',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          // ICD-10 format: Letter + 2 digits + optional dot + 0-4 alphanumeric
          return /^[A-Z]\d{2}(\.\d{0,4})?$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ICD-10 code`;
        },
      },
    });
  };
}

/**
 * Validates that a value is within a specified range.
 *
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class VitalSignsDto {
 *   @IsInRange(60, 100)
 *   heartRate: number;
 * }
 * ```
 */
export function IsInRange(min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'number') return false;
          const [min, max] = args.constraints;
          return value >= min && value <= max;
        },
        defaultMessage(args: ValidationArguments) {
          const [min, max] = args.constraints;
          return `${args.property} must be between ${min} and ${max}`;
        },
      },
    });
  };
}

/**
 * Validates that a date is in the past.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @IsPastDate()
 *   dateOfBirth: Date;
 * }
 * ```
 */
export function IsPastDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date) && typeof value !== 'string') return false;
          const date = value instanceof Date ? value : new Date(value);
          return date < new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a date in the past`;
        },
      },
    });
  };
}

/**
 * Validates that a date is in the future.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class AppointmentDto {
 *   @IsFutureDate()
 *   scheduledDate: Date;
 * }
 * ```
 */
export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date) && typeof value !== 'string') return false;
          const date = value instanceof Date ? value : new Date(value);
          return date > new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a date in the future`;
        },
      },
    });
  };
}

/**
 * Validates that a string is a valid US phone number.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ContactDto {
 *   @IsUSPhoneNumber()
 *   phone: string;
 * }
 * ```
 */
export function IsUSPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUSPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const cleaned = value.replace(/\D/g, '');
          return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid US phone number`;
        },
      },
    });
  };
}

/**
 * Validates that a string is a valid postal code (US or international).
 *
 * @param {string} [country='US'] - Country code
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class AddressDto {
 *   @IsPostalCode('US')
 *   zipCode: string;
 * }
 * ```
 */
export function IsPostalCode(country: string = 'US', validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPostalCode',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [country],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const [country] = args.constraints;
          return validator.isPostalCode(value, country);
        },
        defaultMessage(args: ValidationArguments) {
          const [country] = args.constraints;
          return `${args.property} must be a valid ${country} postal code`;
        },
      },
    });
  };
}

/**
 * Validates that a string contains only alphanumeric characters.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UsernameDto {
 *   @IsAlphanumeric()
 *   username: string;
 * }
 * ```
 */
export function IsAlphanumeric(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAlphanumeric',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /^[a-zA-Z0-9]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only alphanumeric characters`;
        },
      },
    });
  };
}

/**
 * Validates that a string is a valid hex color code.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ThemeDto {
 *   @IsHexColor()
 *   primaryColor: string;
 * }
 * ```
 */
export function IsHexColor(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isHexColor',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid hex color code`;
        },
      },
    });
  };
}

/**
 * Validates that a value is unique within an array property.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class BatchDto {
 *   @IsUniqueArray()
 *   patientIds: string[];
 * }
 * ```
 */
export function IsUniqueArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUniqueArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!Array.isArray(value)) return false;
          const set = new Set(value);
          return set.size === value.length;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain unique values`;
        },
      },
    });
  };
}

// ============================================================================
// DTO TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Transforms a plain object to a class instance with validation.
 *
 * @template T - Target class type
 * @param {ClassConstructor<T>} cls - Target class constructor
 * @param {any} plain - Plain object to transform
 * @param {boolean} [validateAfterTransform=true] - Whether to validate after transformation
 * @returns {Promise<T>} Transformed and validated instance
 *
 * @example
 * ```typescript
 * const dto = await transformToDto(CreateUserDto, { email: 'test@example.com' });
 * ```
 */
export async function transformToDto<T extends object>(
  cls: ClassConstructor<T>,
  plain: any,
  validateAfterTransform: boolean = true
): Promise<T> {
  const instance = plainToClass(cls, plain, { excludeExtraneousValues: true });

  if (validateAfterTransform) {
    await validateOrReject(instance);
  }

  return instance;
}

/**
 * Transforms a class instance to a plain object.
 *
 * @template T - Source class type
 * @param {T} instance - Class instance to transform
 * @param {boolean} [excludeExtraneous=true] - Whether to exclude non-exposed properties
 * @returns {any} Plain object
 *
 * @example
 * ```typescript
 * const plain = transformToPlain(userEntity);
 * ```
 */
export function transformToPlain<T extends object>(
  instance: T,
  excludeExtraneous: boolean = true
): any {
  return classToPlain(instance, { excludeExtraneousValues: excludeExtraneous });
}

/**
 * Transforms an array of plain objects to class instances with validation.
 *
 * @template T - Target class type
 * @param {ClassConstructor<T>} cls - Target class constructor
 * @param {any[]} plainArray - Array of plain objects
 * @param {boolean} [validateAfterTransform=true] - Whether to validate after transformation
 * @returns {Promise<T[]>} Array of transformed and validated instances
 *
 * @example
 * ```typescript
 * const dtos = await transformArrayToDto(CreateUserDto, [{ email: 'test1@example.com' }, { email: 'test2@example.com' }]);
 * ```
 */
export async function transformArrayToDto<T extends object>(
  cls: ClassConstructor<T>,
  plainArray: any[],
  validateAfterTransform: boolean = true
): Promise<T[]> {
  const instances = plainArray.map((plain) =>
    plainToClass(cls, plain, { excludeExtraneousValues: true })
  );

  if (validateAfterTransform) {
    await Promise.all(instances.map((instance) => validateOrReject(instance)));
  }

  return instances;
}

/**
 * Transforms and merges multiple objects into a DTO with validation.
 *
 * @template T - Target class type
 * @param {ClassConstructor<T>} cls - Target class constructor
 * @param {...any[]} sources - Source objects to merge
 * @returns {Promise<T>} Merged and validated instance
 *
 * @example
 * ```typescript
 * const dto = await transformAndMerge(UserDto, baseData, additionalData, overrides);
 * ```
 */
export async function transformAndMerge<T extends object>(
  cls: ClassConstructor<T>,
  ...sources: any[]
): Promise<T> {
  const merged = Object.assign({}, ...sources);
  return transformToDto(cls, merged, true);
}

/**
 * Creates a transformation pipe for NestJS with custom validation groups.
 *
 * @template T - Target class type
 * @param {ClassConstructor<T>} cls - Target class constructor
 * @param {string[]} [groups] - Validation groups to apply
 * @returns {PipeTransform} NestJS pipe transform
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body(createTransformPipe(CreateUserDto, ['create'])) dto: CreateUserDto) {
 *   return this.service.create(dto);
 * }
 * ```
 */
export function createTransformPipe<T extends object>(
  cls: ClassConstructor<T>,
  groups?: string[]
): PipeTransform {
  @Injectable()
  class TransformPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata): Promise<T> {
      const object = plainToClass(cls, value, { excludeExtraneousValues: true });
      const errors = await validate(object, { groups });

      if (errors.length > 0) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      return object;
    }
  }

  return new TransformPipe();
}

// ============================================================================
// CLASS-VALIDATOR INTEGRATION HELPERS
// ============================================================================

/**
 * Validates an object and returns detailed validation results.
 *
 * @template T - Object type
 * @param {T} object - Object to validate
 * @param {string[]} [groups] - Validation groups
 * @returns {Promise<ValidationResult<T>>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateWithDetails(userDto);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export async function validateWithDetails<T extends object>(
  object: T,
  groups?: string[]
): Promise<ValidationResult<T>> {
  const errors = await validate(object, { groups });

  if (errors.length === 0) {
    return {
      isValid: true,
      value: object,
      errors: [],
    };
  }

  const errorMessages = errors.map((error) => {
    const constraints = error.constraints || {};
    return Object.values(constraints).join(', ');
  });

  return {
    isValid: false,
    errors: errorMessages,
    metadata: {
      validationErrors: errors,
    },
  };
}

/**
 * Creates a custom validator constraint for async validation.
 *
 * @template T - Value type
 * @param {string} name - Validator name
 * @param {(value: T) => Promise<boolean>} validatorFn - Async validator function
 * @param {string} defaultMessage - Default error message
 * @returns {ValidatorConstraintInterface} Validator constraint
 *
 * @example
 * ```typescript
 * @ValidatorConstraint({ async: true })
 * class IsUserAlreadyExist implements ValidatorConstraintInterface {
 *   validate = createAsyncValidator('isUserAlreadyExist', async (email) => {
 *     const user = await this.userRepository.findByEmail(email);
 *     return !user;
 *   }, 'User with this email already exists');
 * }
 * ```
 */
export function createAsyncValidator<T>(
  name: string,
  validatorFn: (value: T) => Promise<boolean>,
  defaultMessage: string
): (value: T, args?: ValidationArguments) => Promise<boolean> {
  return async (value: T, args?: ValidationArguments): Promise<boolean> => {
    try {
      return await validatorFn(value);
    } catch (error) {
      console.error(`Async validator ${name} failed:`, error);
      return false;
    }
  };
}

/**
 * Extracts all validation errors from a validation error array.
 *
 * @param {ValidationError[]} errors - Validation errors
 * @returns {Record<string, string[]>} Errors grouped by property
 *
 * @example
 * ```typescript
 * const errors = await validate(dto);
 * const errorMap = extractValidationErrors(errors);
 * // { email: ['Email is invalid', 'Email is required'], age: ['Age must be positive'] }
 * ```
 */
export function extractValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const errorMap: Record<string, string[]> = {};

  function extractErrors(error: ValidationError, prefix: string = '') {
    const propertyPath = prefix ? `${prefix}.${error.property}` : error.property;

    if (error.constraints) {
      errorMap[propertyPath] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((child) => extractErrors(child, propertyPath));
    }
  }

  errors.forEach((error) => extractErrors(error));

  return errorMap;
}

/**
 * Validates a partial object (useful for PATCH operations).
 *
 * @template T - Object type
 * @param {Partial<T>} partial - Partial object to validate
 * @param {ClassConstructor<T>} cls - Class constructor
 * @returns {Promise<ValidationResult<Partial<T>>>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePartial({ email: 'new@example.com' }, UpdateUserDto);
 * ```
 */
export async function validatePartial<T extends object>(
  partial: Partial<T>,
  cls: ClassConstructor<T>
): Promise<ValidationResult<Partial<T>>> {
  const instance = plainToClass(cls, partial, { excludeExtraneousValues: true });
  const errors = await validate(instance, { skipMissingProperties: true });

  if (errors.length === 0) {
    return {
      isValid: true,
      value: partial,
      errors: [],
    };
  }

  return {
    isValid: false,
    errors: errors.map((e) => Object.values(e.constraints || {}).join(', ')),
    metadata: { validationErrors: errors },
  };
}

/**
 * Creates a validation group decorator.
 *
 * @param {string[]} groups - Validation groups
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsEmail()
 *   @ValidationGroup(['create', 'update'])
 *   email: string;
 * }
 * ```
 */
export function ValidationGroup(groups: string[]): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata('validation:groups', groups, target, propertyKey);
  };
}

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

/**
 * Sanitizes a string to prevent XSS attacks.
 *
 * @param {string} input - Input string
 * @param {SanitizationOptions} [options] - Sanitization options
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const safe = sanitizeXSS('<script>alert("xss")</script>Hello');
 * // Returns: 'Hello'
 * ```
 */
export function sanitizeXSS(input: string, options: SanitizationOptions = {}): string {
  if (typeof input !== 'string') return '';

  let sanitized = input;

  // Remove script tags
  if (options.stripScripts !== false) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  if (!options.allowHtml) {
    // Escape HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (options.trim) {
    sanitized = sanitized.trim();
  }

  return sanitized;
}

/**
 * Sanitizes a string to prevent SQL injection.
 *
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const safe = sanitizeSQLInjection("'; DROP TABLE users; --");
 * ```
 */
export function sanitizeSQLInjection(input: string): string {
  if (typeof input !== 'string') return '';

  // Remove common SQL injection patterns
  let sanitized = input;

  // Remove SQL comments
  sanitized = sanitized.replace(/--.*$/gm, '');
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');

  // Escape single quotes
  sanitized = sanitized.replace(/'/g, "''");

  // Remove common SQL keywords used in attacks
  const sqlKeywords = [
    'DROP',
    'DELETE',
    'INSERT',
    'UPDATE',
    'EXEC',
    'EXECUTE',
    'UNION',
    'SELECT',
    'CREATE',
    'ALTER',
    'TRUNCATE',
  ];

  const pattern = new RegExp(`\\b(${sqlKeywords.join('|')})\\b`, 'gi');
  sanitized = sanitized.replace(pattern, '');

  return sanitized;
}

/**
 * Sanitizes HTML by allowing only specific tags.
 *
 * @param {string} html - HTML string
 * @param {string[]} [allowedTags] - Allowed HTML tags
 * @returns {string} Sanitized HTML
 *
 * @example
 * ```typescript
 * const safe = sanitizeHTML('<p>Hello</p><script>alert("xss")</script>', ['p', 'br']);
 * // Returns: '<p>Hello</p>'
 * ```
 */
export function sanitizeHTML(html: string, allowedTags: string[] = ['p', 'br', 'b', 'i', 'u']): string {
  if (typeof html !== 'string') return '';

  // Create regex pattern for allowed tags
  const allowedPattern = allowedTags.join('|');
  const tagRegex = new RegExp(`<(?!\/?(${allowedPattern})\\b)[^>]+>`, 'gi');

  // Remove disallowed tags
  let sanitized = html.replace(tagRegex, '');

  // Remove event handlers from allowed tags
  sanitized = sanitized.replace(/(<[^>]+)\son\w+\s*=\s*["'][^"']*["']/gi, '$1');

  return sanitized;
}

/**
 * Sanitizes file names to prevent path traversal attacks.
 *
 * @param {string} filename - File name
 * @returns {string} Sanitized file name
 *
 * @example
 * ```typescript
 * const safe = sanitizeFileName('../../etc/passwd');
 * // Returns: 'etcpasswd'
 * ```
 */
export function sanitizeFileName(filename: string): string {
  if (typeof filename !== 'string') return '';

  // Remove path separators
  let sanitized = filename.replace(/[\/\\]/g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove special characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, '');

  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop() || '';
    const name = sanitized.substring(0, 255 - ext.length - 1);
    sanitized = `${name}.${ext}`;
  }

  return sanitized || 'unnamed';
}

/**
 * Sanitizes and normalizes email addresses.
 *
 * @param {string} email - Email address
 * @returns {string | null} Sanitized email or null if invalid
 *
 * @example
 * ```typescript
 * const email = sanitizeEmail(' User@Example.COM ');
 * // Returns: 'user@example.com'
 * ```
 */
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') return null;

  // Trim and lowercase
  let sanitized = email.trim().toLowerCase();

  // Remove any characters that shouldn't be in an email
  sanitized = sanitized.replace(/[^a-z0-9@._+-]/g, '');

  // Validate email format
  if (!validator.isEmail(sanitized)) {
    return null;
  }

  return sanitized;
}

// ============================================================================
// TYPE COERCION AND CONVERSION
// ============================================================================

/**
 * Coerces a value to a boolean.
 *
 * @param {any} value - Value to coerce
 * @returns {boolean} Boolean value
 *
 * @example
 * ```typescript
 * coerceToBoolean('true'); // true
 * coerceToBoolean('1'); // true
 * coerceToBoolean('false'); // false
 * coerceToBoolean(0); // false
 * ```
 */
export function coerceToBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
}

/**
 * Coerces a value to a number with validation.
 *
 * @param {any} value - Value to coerce
 * @param {number} [defaultValue] - Default value if coercion fails
 * @returns {number | null} Number value or null
 *
 * @example
 * ```typescript
 * coerceToNumber('123'); // 123
 * coerceToNumber('12.34'); // 12.34
 * coerceToNumber('invalid'); // null
 * coerceToNumber('invalid', 0); // 0
 * ```
 */
export function coerceToNumber(value: any, defaultValue?: number): number | null {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return defaultValue !== undefined ? defaultValue : null;
}

/**
 * Coerces a value to a Date object.
 *
 * @param {any} value - Value to coerce
 * @returns {Date | null} Date object or null
 *
 * @example
 * ```typescript
 * coerceToDate('2024-01-01'); // Date object
 * coerceToDate('2024-01-01T00:00:00Z'); // Date object
 * coerceToDate('invalid'); // null
 * ```
 */
export function coerceToDate(value: any): Date | null {
  if (value instanceof Date) return !isNaN(value.getTime()) ? value : null;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date : null;
  }
  return null;
}

/**
 * Coerces a value to an array.
 *
 * @template T - Array item type
 * @param {any} value - Value to coerce
 * @returns {T[]} Array
 *
 * @example
 * ```typescript
 * coerceToArray('item'); // ['item']
 * coerceToArray(['item1', 'item2']); // ['item1', 'item2']
 * coerceToArray(null); // []
 * ```
 */
export function coerceToArray<T>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

/**
 * Converts a string to a specific case format.
 *
 * @param {string} str - String to convert
 * @param {'camel' | 'pascal' | 'snake' | 'kebab'} format - Target format
 * @returns {string} Converted string
 *
 * @example
 * ```typescript
 * convertCase('hello world', 'camel'); // 'helloWorld'
 * convertCase('hello world', 'pascal'); // 'HelloWorld'
 * convertCase('hello world', 'snake'); // 'hello_world'
 * convertCase('hello world', 'kebab'); // 'hello-world'
 * ```
 */
export function convertCase(str: string, format: 'camel' | 'pascal' | 'snake' | 'kebab'): string {
  if (typeof str !== 'string') return '';

  // Normalize to words
  const words = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  switch (format) {
    case 'camel':
      return words
        .map((word, index) =>
          index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');

    case 'pascal':
      return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');

    case 'snake':
      return words.join('_');

    case 'kebab':
      return words.join('-');

    default:
      return str;
  }
}

// ============================================================================
// SCHEMA VALIDATION (JOI-LIKE)
// ============================================================================

/**
 * Creates a schema validator from a schema definition.
 *
 * @template T - Value type
 * @param {SchemaDefinition<T>} schema - Schema definition
 * @returns {SchemaValidator<T>} Schema validator function
 *
 * @example
 * ```typescript
 * const schema = createSchemaValidator<User>({
 *   type: 'object',
 *   required: true,
 *   properties: {
 *     email: { type: 'email', required: true },
 *     age: { type: 'number', min: 0, max: 120 }
 *   }
 * });
 *
 * const result = await schema({ email: 'test@example.com', age: 25 });
 * ```
 */
export function createSchemaValidator<T>(schema: SchemaDefinition<T>): SchemaValidator<T> {
  return async (value: T): Promise<ValidationResult<T>> => {
    const errors: string[] = [];

    // Check required
    if (schema.required && (value === undefined || value === null)) {
      errors.push('Value is required');
      return { isValid: false, errors };
    }

    // Check nullable
    if (value === null) {
      if (schema.nullable) {
        return { isValid: true, value: null as any };
      } else {
        errors.push('Value cannot be null');
        return { isValid: false, errors };
      }
    }

    // Apply default
    if (value === undefined && schema.default !== undefined) {
      value = schema.default;
    }

    // Type validation
    if (schema.type && value !== undefined && value !== null) {
      switch (schema.type) {
        case 'string':
          if (typeof value !== 'string') errors.push('Value must be a string');
          break;
        case 'number':
          if (typeof value !== 'number' || isNaN(value)) errors.push('Value must be a number');
          break;
        case 'boolean':
          if (typeof value !== 'boolean') errors.push('Value must be a boolean');
          break;
        case 'date':
          if (!(value instanceof Date) || isNaN(value.getTime())) errors.push('Value must be a valid date');
          break;
        case 'array':
          if (!Array.isArray(value)) errors.push('Value must be an array');
          break;
        case 'object':
          if (typeof value !== 'object' || Array.isArray(value)) errors.push('Value must be an object');
          break;
        case 'email':
          if (typeof value !== 'string' || !validator.isEmail(value)) errors.push('Value must be a valid email');
          break;
        case 'url':
          if (typeof value !== 'string' || !validator.isURL(value)) errors.push('Value must be a valid URL');
          break;
      }
    }

    // Min/Max validation for numbers and strings
    if (schema.min !== undefined && value !== undefined && value !== null) {
      if (typeof value === 'number' && value < schema.min) {
        errors.push(`Value must be at least ${schema.min}`);
      }
      if (typeof value === 'string' && value.length < schema.min) {
        errors.push(`Value must be at least ${schema.min} characters`);
      }
    }

    if (schema.max !== undefined && value !== undefined && value !== null) {
      if (typeof value === 'number' && value > schema.max) {
        errors.push(`Value must be at most ${schema.max}`);
      }
      if (typeof value === 'string' && value.length > schema.max) {
        errors.push(`Value must be at most ${schema.max} characters`);
      }
    }

    // Pattern validation
    if (schema.pattern && typeof value === 'string') {
      if (!schema.pattern.test(value)) {
        errors.push('Value does not match required pattern');
      }
    }

    // Enum validation
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`Value must be one of: ${schema.enum.join(', ')}`);
    }

    // Custom validation
    if (schema.custom) {
      const customResult = await schema.custom(value);
      if (!customResult) {
        errors.push('Custom validation failed');
      }
    }

    // Transform
    let transformedValue = value;
    if (schema.transform && errors.length === 0) {
      transformedValue = schema.transform(value);
    }

    return {
      isValid: errors.length === 0,
      value: transformedValue,
      errors,
    };
  };
}

/**
 * Validates an object against a schema definition with nested properties.
 *
 * @template T - Object type
 * @param {T} obj - Object to validate
 * @param {Record<string, SchemaDefinition>} schema - Schema definition
 * @returns {Promise<ValidationResult<T>>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateObjectSchema(
 *   { name: 'John', age: 25 },
 *   {
 *     name: { type: 'string', required: true, min: 2 },
 *     age: { type: 'number', required: true, min: 0, max: 120 }
 *   }
 * );
 * ```
 */
export async function validateObjectSchema<T extends object>(
  obj: T,
  schema: Record<string, SchemaDefinition>
): Promise<ValidationResult<T>> {
  const errors: string[] = [];

  for (const [key, fieldSchema] of Object.entries(schema)) {
    const value = (obj as any)[key];
    const validator = createSchemaValidator(fieldSchema);
    const result = await validator(value);

    if (!result.isValid) {
      errors.push(...(result.errors || []).map((err) => `${key}: ${err}`));
    }
  }

  return {
    isValid: errors.length === 0,
    value: obj,
    errors,
  };
}

/**
 * Creates a reusable schema builder with chainable methods.
 *
 * @template T - Schema type
 * @returns {SchemaBuilder<T>} Schema builder
 *
 * @example
 * ```typescript
 * const userSchema = createSchema<User>()
 *   .field('email', { type: 'email', required: true })
 *   .field('age', { type: 'number', min: 0, max: 120 })
 *   .build();
 *
 * const result = await userSchema.validate(userData);
 * ```
 */
export function createSchema<T extends object>() {
  const schema: Record<string, SchemaDefinition> = {};

  return {
    field(name: keyof T, definition: SchemaDefinition) {
      schema[name as string] = definition;
      return this;
    },

    build() {
      return {
        validate: (obj: T) => validateObjectSchema(obj, schema),
        schema,
      };
    },
  };
}

/**
 * Validates a JSON string against a schema.
 *
 * @template T - Expected object type
 * @param {string} jsonString - JSON string to validate
 * @param {Record<string, SchemaDefinition>} schema - Schema definition
 * @returns {Promise<ValidationResult<T>>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateJSONSchema(
 *   '{"name":"John","age":25}',
 *   { name: { type: 'string' }, age: { type: 'number' } }
 * );
 * ```
 */
export async function validateJSONSchema<T extends object>(
  jsonString: string,
  schema: Record<string, SchemaDefinition>
): Promise<ValidationResult<T>> {
  try {
    const obj = JSON.parse(jsonString);
    return validateObjectSchema<T>(obj, schema);
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid JSON format'],
    };
  }
}

/**
 * Validates that an object conforms to a TypeScript interface at runtime.
 *
 * @template T - Interface type
 * @param {any} obj - Object to validate
 * @param {Record<keyof T, string>} typeMap - Map of property names to expected types
 * @returns {ValidationResult<T>} Validation result
 *
 * @example
 * ```typescript
 * interface User { name: string; age: number; }
 * const result = validateInterface<User>(
 *   { name: 'John', age: 25 },
 *   { name: 'string', age: 'number' }
 * );
 * ```
 */
export function validateInterface<T extends object>(
  obj: any,
  typeMap: Record<keyof T, string>
): ValidationResult<T> {
  const errors: string[] = [];

  for (const [key, expectedType] of Object.entries(typeMap)) {
    const value = obj[key];
    const actualType = Array.isArray(value) ? 'array' : typeof value;

    if (actualType !== expectedType) {
      errors.push(`Property '${key}' should be ${expectedType}, got ${actualType}`);
    }
  }

  return {
    isValid: errors.length === 0,
    value: obj as T,
    errors,
  };
}

// ============================================================================
// ARRAY AND OBJECT VALIDATION
// ============================================================================

/**
 * Validates all items in an array against a schema.
 *
 * @template T - Array item type
 * @param {T[]} array - Array to validate
 * @param {SchemaValidator<T>} itemValidator - Item validator
 * @returns {Promise<ValidationResult<T[]>>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateArray(
 *   [{ email: 'test@example.com' }, { email: 'invalid' }],
 *   createSchemaValidator({ type: 'email' })
 * );
 * ```
 */
export async function validateArray<T>(
  array: T[],
  itemValidator: SchemaValidator<T>
): Promise<ValidationResult<T[]>> {
  if (!Array.isArray(array)) {
    return {
      isValid: false,
      errors: ['Value must be an array'],
    };
  }

  const errors: string[] = [];
  const validatedItems: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const result = await itemValidator(array[i]);
    if (!result.isValid) {
      errors.push(`Item ${i}: ${result.errors?.join(', ')}`);
    } else if (result.value !== undefined) {
      validatedItems.push(result.value);
    }
  }

  return {
    isValid: errors.length === 0,
    value: validatedItems,
    errors,
  };
}

/**
 * Validates that an array contains unique values based on a key.
 *
 * @template T - Array item type
 * @param {T[]} array - Array to validate
 * @param {keyof T | ((item: T) => any)} keyOrFn - Key or function to extract unique value
 * @returns {ValidationResult<T[]>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateArrayUnique(
 *   [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 1, name: 'C' }],
 *   'id'
 * );
 * // Returns: { isValid: false, errors: ['Duplicate values found for key: id'] }
 * ```
 */
export function validateArrayUnique<T>(
  array: T[],
  keyOrFn: keyof T | ((item: T) => any)
): ValidationResult<T[]> {
  if (!Array.isArray(array)) {
    return {
      isValid: false,
      errors: ['Value must be an array'],
    };
  }

  const seen = new Set();
  const duplicates: any[] = [];

  for (const item of array) {
    const value = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];

    if (seen.has(value)) {
      duplicates.push(value);
    } else {
      seen.add(value);
    }
  }

  if (duplicates.length > 0) {
    const key = typeof keyOrFn === 'function' ? 'custom function' : String(keyOrFn);
    return {
      isValid: false,
      errors: [`Duplicate values found for key: ${key}`],
      metadata: { duplicates },
    };
  }

  return {
    isValid: true,
    value: array,
  };
}

/**
 * Validates that an object has only allowed keys.
 *
 * @template T - Object type
 * @param {T} obj - Object to validate
 * @param {string[]} allowedKeys - Allowed keys
 * @returns {ValidationResult<T>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateObjectKeys(
 *   { name: 'John', age: 25, extra: 'not allowed' },
 *   ['name', 'age']
 * );
 * // Returns: { isValid: false, errors: ['Unexpected keys: extra'] }
 * ```
 */
export function validateObjectKeys<T extends object>(
  obj: T,
  allowedKeys: string[]
): ValidationResult<T> {
  const actualKeys = Object.keys(obj);
  const unexpectedKeys = actualKeys.filter((key) => !allowedKeys.includes(key));

  if (unexpectedKeys.length > 0) {
    return {
      isValid: false,
      errors: [`Unexpected keys: ${unexpectedKeys.join(', ')}`],
      metadata: { unexpectedKeys },
    };
  }

  return {
    isValid: true,
    value: obj,
  };
}

/**
 * Validates that an object is not empty.
 *
 * @param {object} obj - Object to validate
 * @returns {ValidationResult<object>} Validation result
 *
 * @example
 * ```typescript
 * validateObjectNotEmpty({}); // { isValid: false, errors: ['Object is empty'] }
 * validateObjectNotEmpty({ key: 'value' }); // { isValid: true }
 * ```
 */
export function validateObjectNotEmpty(obj: object): ValidationResult<object> {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return {
      isValid: false,
      errors: ['Value must be an object'],
    };
  }

  if (Object.keys(obj).length === 0) {
    return {
      isValid: false,
      errors: ['Object is empty'],
    };
  }

  return {
    isValid: true,
    value: obj,
  };
}

// ============================================================================
// CONDITIONAL VALIDATION RULES
// ============================================================================

/**
 * Creates a conditional validator that applies validation based on a condition.
 *
 * @template T - Value type
 * @param {(object: any) => boolean} condition - Condition function
 * @param {SchemaValidator<T>} validator - Validator to apply if condition is true
 * @returns {SchemaValidator<T>} Conditional validator
 *
 * @example
 * ```typescript
 * const validator = createConditionalValidator(
 *   (obj) => obj.type === 'email',
 *   createSchemaValidator({ type: 'email' })
 * );
 * ```
 */
export function createConditionalValidator<T>(
  condition: (object: any) => boolean,
  validator: SchemaValidator<T>
): SchemaValidator<T> {
  return async (value: T, context?: any): Promise<ValidationResult<T>> => {
    if (!condition(context || {})) {
      return {
        isValid: true,
        value,
      };
    }

    return validator(value);
  };
}

/**
 * Validates a value based on the value of another field.
 *
 * @param {string} dependentField - Field to check
 * @param {any} expectedValue - Expected value of dependent field
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ConditionalDto {
 *   type: 'email' | 'phone';
 *
 *   @ValidateIf('type', 'email')
 *   @IsEmail()
 *   contact: string;
 * }
 * ```
 */
export function ValidateIf(
  dependentField: string,
  expectedValue: any,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateIf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [dependentField, expectedValue],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [dependentField, expectedValue] = args.constraints;
          const dependentValue = (args.object as any)[dependentField];

          // If condition is not met, validation passes
          if (dependentValue !== expectedValue) {
            return true;
          }

          // If condition is met and value is present, validation passes
          return value !== undefined && value !== null && value !== '';
        },
        defaultMessage(args: ValidationArguments) {
          const [dependentField, expectedValue] = args.constraints;
          return `${args.property} is required when ${dependentField} is ${expectedValue}`;
        },
      },
    });
  };
}

/**
 * Creates a validator that applies different validators based on conditions.
 *
 * @template T - Value type
 * @param {ConditionalRule<T>[]} rules - Conditional rules
 * @param {SchemaValidator<T>} [defaultValidator] - Default validator if no conditions match
 * @returns {SchemaValidator<T>} Conditional validator
 *
 * @example
 * ```typescript
 * const validator = createSwitchValidator([
 *   { condition: (obj) => obj.type === 'email', validator: emailValidator },
 *   { condition: (obj) => obj.type === 'phone', validator: phoneValidator }
 * ], defaultValidator);
 * ```
 */
export function createSwitchValidator<T>(
  rules: ConditionalRule<T>[],
  defaultValidator?: SchemaValidator<T>
): SchemaValidator<T> {
  return async (value: T, context?: any): Promise<ValidationResult<T>> => {
    for (const rule of rules) {
      if (rule.condition(context || {})) {
        return rule.validator(value);
      }
    }

    if (defaultValidator) {
      return defaultValidator(value);
    }

    return {
      isValid: true,
      value,
    };
  };
}

// ============================================================================
// CROSS-FIELD VALIDATION
// ============================================================================

/**
 * Validates that one field matches another field.
 *
 * @param {string} propertyToCompare - Property to compare with
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PasswordDto {
 *   password: string;
 *
 *   @Match('password')
 *   confirmPassword: string;
 * }
 * ```
 */
export function Match(propertyToCompare: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyToCompare],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}

/**
 * Validates that a date field is after another date field.
 *
 * @param {string} startDateProperty - Start date property name
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class EventDto {
 *   startDate: Date;
 *
 *   @IsAfterDate('startDate')
 *   endDate: Date;
 * }
 * ```
 */
export function IsAfterDate(startDateProperty: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [startDateProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [startDateProperty] = args.constraints;
          const startDate = (args.object as any)[startDateProperty];

          if (!startDate || !value) return false;

          const start = startDate instanceof Date ? startDate : new Date(startDate);
          const end = value instanceof Date ? value : new Date(value);

          return end > start;
        },
        defaultMessage(args: ValidationArguments) {
          const [startDateProperty] = args.constraints;
          return `${args.property} must be after ${startDateProperty}`;
        },
      },
    });
  };
}

/**
 * Validates that at least one of the specified fields is present.
 *
 * @param {string[]} properties - Property names
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @RequireAtLeastOne(['email', 'phone'])
 * class ContactDto {
 *   email?: string;
 *   phone?: string;
 * }
 * ```
 */
export function RequireAtLeastOne(properties: string[], validationOptions?: ValidationOptions) {
  return function (constructor: Function) {
    registerDecorator({
      name: 'requireAtLeastOne',
      target: constructor,
      propertyName: properties[0],
      constraints: properties,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          return properties.some((prop) => {
            const val = object[prop];
            return val !== undefined && val !== null && val !== '';
          });
        },
        defaultMessage(args: ValidationArguments) {
          return `At least one of the following fields is required: ${properties.join(', ')}`;
        },
      },
    });
  };
}

// ============================================================================
// FILE UPLOAD VALIDATION
// ============================================================================

/**
 * Validates file upload metadata.
 *
 * @param {any} file - File object (Express.Multer.File or similar)
 * @param {FileValidationOptions} options - Validation options
 * @returns {ValidationResult<any>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFile(uploadedFile, {
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   allowedMimeTypes: ['image/jpeg', 'image/png'],
 *   allowedExtensions: ['.jpg', '.jpeg', '.png']
 * });
 * ```
 */
export function validateFile(file: any, options: FileValidationOptions): ValidationResult<any> {
  const errors: string[] = [];

  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }

  // Validate file size
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`File size must be less than ${options.maxSize} bytes`);
  }

  if (options.minSize && file.size < options.minSize) {
    errors.push(`File size must be at least ${options.minSize} bytes`);
  }

  // Validate MIME type
  if (options.allowedMimeTypes && file.mimetype) {
    if (!options.allowedMimeTypes.includes(file.mimetype)) {
      errors.push(
        `File type ${file.mimetype} is not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`
      );
    }
  }

  // Validate file extension
  if (options.allowedExtensions && file.originalname) {
    const ext = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!ext || !options.allowedExtensions.includes(ext)) {
      errors.push(
        `File extension ${ext} is not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`
      );
    }
  }

  // Validate image
  if (options.requireImage && file.mimetype) {
    if (!file.mimetype.startsWith('image/')) {
      errors.push('File must be an image');
    }
  }

  return {
    isValid: errors.length === 0,
    value: file,
    errors,
  };
}

/**
 * Validates multiple file uploads.
 *
 * @param {any[]} files - Array of file objects
 * @param {FileValidationOptions} options - Validation options
 * @returns {ValidationResult<any[]>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFiles(uploadedFiles, {
 *   maxFiles: 5,
 *   maxSize: 5 * 1024 * 1024,
 *   allowedMimeTypes: ['image/jpeg', 'image/png']
 * });
 * ```
 */
export function validateFiles(files: any[], options: FileValidationOptions): ValidationResult<any[]> {
  if (!Array.isArray(files)) {
    return {
      isValid: false,
      errors: ['Files must be an array'],
    };
  }

  if (options.maxFiles && files.length > options.maxFiles) {
    return {
      isValid: false,
      errors: [`Maximum ${options.maxFiles} files allowed`],
    };
  }

  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = validateFile(files[i], options);
    if (!result.isValid) {
      errors.push(`File ${i + 1}: ${result.errors?.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    value: files,
    errors,
  };
}

/**
 * Validates image dimensions.
 *
 * @param {any} file - File object with width/height or buffer
 * @param {object} options - Dimension options
 * @returns {ValidationResult<any>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateImageDimensions(imageFile, {
 *   minWidth: 200,
 *   minHeight: 200,
 *   maxWidth: 2000,
 *   maxHeight: 2000
 * });
 * ```
 */
export function validateImageDimensions(
  file: any,
  options: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  }
): ValidationResult<any> {
  // Note: In production, you would use a library like 'sharp' or 'jimp' to read image dimensions
  // This is a simplified version that assumes dimensions are provided

  const errors: string[] = [];

  if (!file.width || !file.height) {
    errors.push('Image dimensions could not be determined');
    return { isValid: false, errors };
  }

  if (options.minWidth && file.width < options.minWidth) {
    errors.push(`Image width must be at least ${options.minWidth}px`);
  }

  if (options.minHeight && file.height < options.minHeight) {
    errors.push(`Image height must be at least ${options.minHeight}px`);
  }

  if (options.maxWidth && file.width > options.maxWidth) {
    errors.push(`Image width must be at most ${options.maxWidth}px`);
  }

  if (options.maxHeight && file.height > options.maxHeight) {
    errors.push(`Image height must be at most ${options.maxHeight}px`);
  }

  return {
    isValid: errors.length === 0,
    value: file,
    errors,
  };
}

// ============================================================================
// EMAIL, PHONE, URL VALIDATORS
// ============================================================================

/**
 * Validates and normalizes an email address with detailed checks.
 *
 * @param {string} email - Email address
 * @param {object} [options] - Validation options
 * @returns {ValidationResult<string>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEmailDetailed('user@example.com', {
 *   requireTld: true,
 *   allowDisplayName: false
 * });
 * ```
 */
export function validateEmailDetailed(
  email: string,
  options?: {
    requireTld?: boolean;
    allowDisplayName?: boolean;
    allowUtf8LocalPart?: boolean;
  }
): ValidationResult<string> {
  if (typeof email !== 'string') {
    return {
      isValid: false,
      errors: ['Email must be a string'],
    };
  }

  const trimmed = email.trim();

  if (!validator.isEmail(trimmed, options)) {
    return {
      isValid: false,
      errors: ['Invalid email format'],
    };
  }

  const normalized = trimmed.toLowerCase();

  return {
    isValid: true,
    value: normalized,
    metadata: {
      domain: normalized.split('@')[1],
      localPart: normalized.split('@')[0],
    },
  };
}

/**
 * Validates a phone number with detailed formatting.
 *
 * @param {string} phone - Phone number
 * @param {string} [country='US'] - Country code
 * @returns {PhoneValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePhoneNumber('+1-555-123-4567', 'US');
 * // Returns: { isValid: true, formatted: '+15551234567', country: 'US' }
 * ```
 */
export function validatePhoneNumber(phone: string, country: string = 'US'): PhoneValidationResult {
  if (typeof phone !== 'string') {
    return { isValid: false };
  }

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // US phone number validation
  if (country === 'US') {
    const isValid =
      cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');

    if (!isValid) {
      return { isValid: false };
    }

    const normalized = cleaned.length === 11 ? cleaned : `1${cleaned}`;

    return {
      isValid: true,
      formatted: `+${normalized}`,
      country: 'US',
      type: 'unknown',
    };
  }

  // Generic validation for other countries
  return {
    isValid: cleaned.length >= 10 && cleaned.length <= 15,
    formatted: `+${cleaned}`,
    country,
  };
}

/**
 * Validates a URL with detailed checks.
 *
 * @param {string} url - URL string
 * @param {object} [options] - Validation options
 * @returns {ValidationResult<string>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateURLDetailed('https://example.com/path', {
 *   protocols: ['https'],
 *   requireProtocol: true
 * });
 * ```
 */
export function validateURLDetailed(
  url: string,
  options?: {
    protocols?: string[];
    requireProtocol?: boolean;
    requireTld?: boolean;
  }
): ValidationResult<string> {
  if (typeof url !== 'string') {
    return {
      isValid: false,
      errors: ['URL must be a string'],
    };
  }

  const validatorOptions = {
    protocols: options?.protocols || ['http', 'https'],
    require_protocol: options?.requireProtocol !== false,
    require_tld: options?.requireTld !== false,
  };

  if (!validator.isURL(url, validatorOptions)) {
    return {
      isValid: false,
      errors: ['Invalid URL format'],
    };
  }

  try {
    const parsed = new URL(url);
    return {
      isValid: true,
      value: url,
      metadata: {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        pathname: parsed.pathname,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Failed to parse URL'],
    };
  }
}

// ============================================================================
// CREDIT CARD AND PAYMENT VALIDATION
// ============================================================================

/**
 * Validates a credit card number using Luhn algorithm.
 *
 * @param {string} cardNumber - Credit card number
 * @returns {CreditCardValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCreditCard('4532015112830366');
 * // Returns: { isValid: true, cardType: 'visa', lastFour: '0366' }
 * ```
 */
export function validateCreditCard(cardNumber: string): CreditCardValidationResult {
  if (typeof cardNumber !== 'string') {
    return { isValid: false };
  }

  const cleaned = cardNumber.replace(/\s/g, '');

  if (!validator.isCreditCard(cleaned)) {
    return { isValid: false };
  }

  // Detect card type
  let cardType: CreditCardValidationResult['cardType'] = 'unknown';

  if (/^4/.test(cleaned)) {
    cardType = 'visa';
  } else if (/^5[1-5]/.test(cleaned)) {
    cardType = 'mastercard';
  } else if (/^3[47]/.test(cleaned)) {
    cardType = 'amex';
  } else if (/^6(?:011|5)/.test(cleaned)) {
    cardType = 'discover';
  }

  return {
    isValid: true,
    cardType,
    lastFour: cleaned.slice(-4),
  };
}

/**
 * Validates a CVV/CVC code.
 *
 * @param {string} cvv - CVV code
 * @param {'visa' | 'mastercard' | 'amex' | 'discover'} [cardType] - Card type
 * @returns {ValidationResult<string>} Validation result
 *
 * @example
 * ```typescript
 * validateCVV('123', 'visa'); // { isValid: true }
 * validateCVV('1234', 'amex'); // { isValid: true }
 * ```
 */
export function validateCVV(
  cvv: string,
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover'
): ValidationResult<string> {
  if (typeof cvv !== 'string') {
    return {
      isValid: false,
      errors: ['CVV must be a string'],
    };
  }

  const cleaned = cvv.replace(/\s/g, '');

  // Amex uses 4-digit CVV, others use 3-digit
  const expectedLength = cardType === 'amex' ? 4 : 3;

  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      errors: ['CVV must contain only digits'],
    };
  }

  if (cleaned.length !== expectedLength) {
    return {
      isValid: false,
      errors: [`CVV must be ${expectedLength} digits for ${cardType || 'this card type'}`],
    };
  }

  return {
    isValid: true,
    value: cleaned,
  };
}

/**
 * Validates credit card expiration date.
 *
 * @param {string} expiry - Expiration date (MM/YY or MM/YYYY)
 * @returns {ValidationResult<{ month: number; year: number }>} Validation result
 *
 * @example
 * ```typescript
 * validateCardExpiry('12/25');
 * // Returns: { isValid: true, value: { month: 12, year: 2025 } }
 * ```
 */
export function validateCardExpiry(
  expiry: string
): ValidationResult<{ month: number; year: number }> {
  if (typeof expiry !== 'string') {
    return {
      isValid: false,
      errors: ['Expiry must be a string'],
    };
  }

  const match = expiry.match(/^(\d{1,2})\/(\d{2,4})$/);

  if (!match) {
    return {
      isValid: false,
      errors: ['Expiry must be in MM/YY or MM/YYYY format'],
    };
  }

  const month = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);

  // Convert 2-digit year to 4-digit
  if (year < 100) {
    year += 2000;
  }

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      errors: ['Month must be between 01 and 12'],
    };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return {
      isValid: false,
      errors: ['Card has expired'],
    };
  }

  return {
    isValid: true,
    value: { month, year },
  };
}

// ============================================================================
// DATE AND TIME VALIDATION
// ============================================================================

/**
 * Validates a date string in ISO 8601 format.
 *
 * @param {string} dateString - Date string
 * @returns {ValidationResult<Date>} Validation result
 *
 * @example
 * ```typescript
 * validateISO8601Date('2024-01-15T10:30:00Z');
 * // Returns: { isValid: true, value: Date object }
 * ```
 */
export function validateISO8601Date(dateString: string): ValidationResult<Date> {
  if (typeof dateString !== 'string') {
    return {
      isValid: false,
      errors: ['Date must be a string'],
    };
  }

  if (!validator.isISO8601(dateString)) {
    return {
      isValid: false,
      errors: ['Date must be in ISO 8601 format'],
    };
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      errors: ['Invalid date'],
    };
  }

  return {
    isValid: true,
    value: date,
  };
}

/**
 * Validates a date range.
 *
 * @param {Date | string} startDate - Start date
 * @param {Date | string} endDate - End date
 * @param {object} [options] - Validation options
 * @returns {ValidationResult<{ start: Date; end: Date }>} Validation result
 *
 * @example
 * ```typescript
 * validateDateRange('2024-01-01', '2024-12-31', { maxDuration: 365 });
 * ```
 */
export function validateDateRange(
  startDate: Date | string,
  endDate: Date | string,
  options?: {
    maxDuration?: number; // in days
    minDuration?: number; // in days
  }
): ValidationResult<{ start: Date; end: Date }> {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  if (isNaN(start.getTime())) {
    return {
      isValid: false,
      errors: ['Invalid start date'],
    };
  }

  if (isNaN(end.getTime())) {
    return {
      isValid: false,
      errors: ['Invalid end date'],
    };
  }

  if (end <= start) {
    return {
      isValid: false,
      errors: ['End date must be after start date'],
    };
  }

  if (options?.maxDuration || options?.minDuration) {
    const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (options.maxDuration && duration > options.maxDuration) {
      return {
        isValid: false,
        errors: [`Date range must not exceed ${options.maxDuration} days`],
      };
    }

    if (options.minDuration && duration < options.minDuration) {
      return {
        isValid: false,
        errors: [`Date range must be at least ${options.minDuration} days`],
      };
    }
  }

  return {
    isValid: true,
    value: { start, end },
  };
}

/**
 * Validates business hours (HH:MM format).
 *
 * @param {string} time - Time string (HH:MM)
 * @returns {ValidationResult<{ hours: number; minutes: number }>} Validation result
 *
 * @example
 * ```typescript
 * validateBusinessHours('09:30');
 * // Returns: { isValid: true, value: { hours: 9, minutes: 30 } }
 * ```
 */
export function validateBusinessHours(
  time: string
): ValidationResult<{ hours: number; minutes: number }> {
  if (typeof time !== 'string') {
    return {
      isValid: false,
      errors: ['Time must be a string'],
    };
  }

  const match = time.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);

  if (!match) {
    return {
      isValid: false,
      errors: ['Time must be in HH:MM format (24-hour)'],
    };
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  return {
    isValid: true,
    value: { hours, minutes },
  };
}

// ============================================================================
// GEOGRAPHIC DATA VALIDATION
// ============================================================================

/**
 * Validates geographic coordinates (latitude/longitude).
 *
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {ValidationResult<GeoCoordinates>} Validation result
 *
 * @example
 * ```typescript
 * validateGeoCoordinates(40.7128, -74.0060);
 * // Returns: { isValid: true, value: { latitude: 40.7128, longitude: -74.0060 } }
 * ```
 */
export function validateGeoCoordinates(
  latitude: number,
  longitude: number
): ValidationResult<GeoCoordinates> {
  const errors: string[] = [];

  if (typeof latitude !== 'number' || isNaN(latitude)) {
    errors.push('Latitude must be a number');
  } else if (latitude < -90 || latitude > 90) {
    errors.push('Latitude must be between -90 and 90');
  }

  if (typeof longitude !== 'number' || isNaN(longitude)) {
    errors.push('Longitude must be a number');
  } else if (longitude < -180 || longitude > 180) {
    errors.push('Longitude must be between -180 and 180');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    value: { latitude, longitude },
  };
}

/**
 * Validates a US state code.
 *
 * @param {string} stateCode - Two-letter state code
 * @returns {ValidationResult<string>} Validation result
 *
 * @example
 * ```typescript
 * validateUSState('CA'); // { isValid: true, value: 'CA' }
 * validateUSState('ZZ'); // { isValid: false }
 * ```
 */
export function validateUSState(stateCode: string): ValidationResult<string> {
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];

  if (typeof stateCode !== 'string') {
    return {
      isValid: false,
      errors: ['State code must be a string'],
    };
  }

  const normalized = stateCode.toUpperCase().trim();

  if (!validStates.includes(normalized)) {
    return {
      isValid: false,
      errors: ['Invalid US state code'],
    };
  }

  return {
    isValid: true,
    value: normalized,
  };
}

// ============================================================================
// COMPLEX NESTED OBJECT VALIDATION
// ============================================================================

/**
 * Validates a deeply nested object against a schema with recursive validation.
 *
 * @template T - Object type
 * @param {T} obj - Object to validate
 * @param {Record<string, SchemaDefinition>} schema - Schema definition with nested schemas
 * @param {string} [path=''] - Current path (for nested validation)
 * @returns {Promise<ValidationResult<T>>} Validation result
 *
 * @example
 * ```typescript
 * const schema = {
 *   user: {
 *     type: 'object',
 *     properties: {
 *       name: { type: 'string', required: true },
 *       address: {
 *         type: 'object',
 *         properties: {
 *           street: { type: 'string', required: true },
 *           city: { type: 'string', required: true }
 *         }
 *       }
 *     }
 *   }
 * };
 *
 * const result = await validateNestedObject(data, schema);
 * ```
 */
export async function validateNestedObject<T extends object>(
  obj: T,
  schema: Record<string, SchemaDefinition>,
  path: string = ''
): Promise<ValidationResult<T>> {
  const errors: string[] = [];

  for (const [key, fieldSchema] of Object.entries(schema)) {
    const value = (obj as any)[key];
    const fieldPath = path ? `${path}.${key}` : key;

    // Handle nested objects
    if (fieldSchema.type === 'object' && fieldSchema.properties) {
      if (value !== undefined && value !== null) {
        const nestedResult = await validateNestedObject(value, fieldSchema.properties, fieldPath);
        if (!nestedResult.isValid) {
          errors.push(...(nestedResult.errors || []));
        }
      } else if (fieldSchema.required) {
        errors.push(`${fieldPath} is required`);
      }
      continue;
    }

    // Handle arrays with item validation
    if (fieldSchema.type === 'array' && fieldSchema.items) {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          if (fieldSchema.items.properties) {
            const itemResult = await validateNestedObject(
              value[i],
              fieldSchema.items.properties as any,
              `${fieldPath}[${i}]`
            );
            if (!itemResult.isValid) {
              errors.push(...(itemResult.errors || []));
            }
          } else {
            const itemValidator = createSchemaValidator(fieldSchema.items);
            const itemResult = await itemValidator(value[i]);
            if (!itemResult.isValid) {
              errors.push(`${fieldPath}[${i}]: ${itemResult.errors?.join(', ')}`);
            }
          }
        }
      } else if (fieldSchema.required) {
        errors.push(`${fieldPath} must be an array`);
      }
      continue;
    }

    // Regular field validation
    const validator = createSchemaValidator(fieldSchema);
    const result = await validator(value);

    if (!result.isValid) {
      errors.push(...(result.errors || []).map((err) => `${fieldPath}: ${err}`));
    }
  }

  return {
    isValid: errors.length === 0,
    value: obj,
    errors,
  };
}
