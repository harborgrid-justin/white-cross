/**
 * LOC: VALSAN1234567
 * File: /reuse/validation-sanitization-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - zod (v3.22.4)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v8.0.0)
 *   - validator (v13.11.0)
 *   - dompurify (v3.0.6)
 *   - xss (v1.0.14)
 *
 * DOWNSTREAM (imported by):
 *   - DTO validation classes
 *   - NestJS controllers
 *   - Input sanitization middleware
 *   - GraphQL resolvers
 *   - API validation pipes
 *   - HIPAA compliance modules
 */
/**
 * File: /reuse/validation-sanitization-kit.prod.ts
 * Locator: WC-UTL-VALSAN-001
 * Purpose: Production-Grade Validation & Sanitization Kit - Comprehensive Zod + NestJS validation toolkit
 *
 * Upstream: Independent utility module with Zod schemas, class-validator, NestJS pipes, Swagger decorators
 * Downstream: ../backend/*, DTOs, Controllers, Resolvers, Middleware, Validation pipes, HIPAA modules
 * Dependencies: TypeScript 5.x, Node 18+, zod, class-validator, class-transformer, @nestjs/common, @nestjs/swagger
 * Exports: 50 validation & sanitization utilities including Zod schemas, custom validators, NestJS pipes, decorators
 *
 * LLM Context: Enterprise-grade validation and sanitization toolkit for White Cross healthcare platform.
 * Provides comprehensive Zod schema builders and validators, NestJS validation pipes with detailed error handling,
 * custom decorators for healthcare-specific validation (MRN, ICD codes, SSN, NPI), input sanitization for XSS/SQL
 * injection prevention, data transformation utilities, async validation with database lookups, conditional validation,
 * nested object validation, file upload validation, HIPAA-compliant PHI validation, API schema documentation with
 * Swagger/OpenAPI decorators, type-safe schema inference, and production-ready error messages. All functions are
 * optimized for healthcare data security and regulatory compliance.
 */
import { z } from 'zod';
import { ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, ValidationError } from 'class-validator';
import { Transform, Type, ClassConstructor, Expose } from 'class-transformer';
import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
/**
 * Zod validation result with detailed error information
 */
export interface ZodValidationResult<T = any> {
    success: boolean;
    data?: T;
    errors?: Array<{
        path: (string | number)[];
        message: string;
        code: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Comprehensive validation result interface
 */
export interface ValidationResult<T = any> {
    isValid: boolean;
    value?: T;
    errors?: string[];
    warnings?: string[];
    fieldErrors?: Record<string, string[]>;
    metadata?: Record<string, any>;
    sanitized?: boolean;
}
/**
 * Async validator function type
 */
export type AsyncValidatorFn<T> = (value: T, context?: any) => Promise<boolean>;
/**
 * Sanitization configuration options
 */
export interface SanitizationOptions {
    allowHtml?: boolean;
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    stripScripts?: boolean;
    stripSql?: boolean;
    trim?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    removeNullBytes?: boolean;
    normalizeWhitespace?: boolean;
}
/**
 * XSS sanitization options
 */
export interface XSSSanitizationOptions {
    whiteList?: Record<string, string[]>;
    stripIgnoreTag?: boolean;
    stripIgnoreTagBody?: boolean;
    allowCommentTag?: boolean;
    escapeHtml?: boolean;
}
/**
 * File validation constraints
 */
export interface FileValidationConstraints {
    maxSize?: number;
    minSize?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
    requiredMimeTypes?: string[];
    maxFiles?: number;
    requireImage?: boolean;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}
/**
 * Healthcare-specific validation types
 */
export interface HealthcareValidationTypes {
    mrn?: string;
    icd10?: string;
    npi?: string;
    ssn?: string;
    ein?: string;
    cptCode?: string;
    loincCode?: string;
}
/**
 * Conditional validation rule
 */
export interface ConditionalValidationRule<T = any> {
    field: string;
    operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'exists' | 'notExists';
    value?: any;
    validator: z.ZodType<T> | ((value: T) => boolean | Promise<boolean>);
}
/**
 * Validation pipe options
 */
export interface ValidationPipeOptions {
    transform?: boolean;
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
    skipMissingProperties?: boolean;
    validationError?: {
        target?: boolean;
        value?: boolean;
    };
    exceptionFactory?: (errors: ValidationError[]) => any;
}
/**
 * Schema transformation options
 */
export interface SchemaTransformOptions {
    stripUnknown?: boolean;
    coerceTypes?: boolean;
    defaultValues?: boolean;
    strict?: boolean;
}
/**
 * Creates a Zod schema for healthcare Medical Record Number (MRN).
 * Format: 3 letters followed by 6-10 digits (e.g., ABC1234567).
 *
 * @param {object} [options] - Additional validation options
 * @returns {z.ZodString} Zod string schema with MRN validation
 *
 * @example
 * ```typescript
 * const mrnSchema = createMRNSchema();
 * const result = mrnSchema.safeParse('ABC1234567'); // { success: true, data: 'ABC1234567' }
 * ```
 */
export declare function createMRNSchema(options?: {
    message?: string;
    transform?: 'uppercase' | 'lowercase';
}): z.ZodString;
/**
 * Creates a Zod schema for ICD-10 diagnostic codes.
 * Format: Letter + 2 digits + optional dot + 0-4 alphanumeric characters.
 *
 * @param {object} [options] - Additional validation options
 * @returns {z.ZodString} Zod string schema with ICD-10 validation
 *
 * @example
 * ```typescript
 * const icd10Schema = createICD10Schema();
 * const result = icd10Schema.safeParse('A01.0'); // { success: true }
 * ```
 */
export declare function createICD10Schema(options?: {
    message?: string;
}): z.ZodString;
/**
 * Creates a Zod schema for National Provider Identifier (NPI).
 * Format: 10 digits, passes Luhn algorithm checksum validation.
 *
 * @param {object} [options] - Additional validation options
 * @returns {z.ZodString} Zod string schema with NPI validation
 *
 * @example
 * ```typescript
 * const npiSchema = createNPISchema();
 * const result = npiSchema.safeParse('1234567893'); // validates with Luhn algorithm
 * ```
 */
export declare function createNPISchema(options?: {
    message?: string;
}): z.ZodString;
/**
 * Creates a Zod schema for US Social Security Number (SSN).
 * Format: XXX-XX-XXXX or XXXXXXXXX.
 *
 * @param {object} [options] - Additional validation options
 * @returns {z.ZodString} Zod string schema with SSN validation
 *
 * @example
 * ```typescript
 * const ssnSchema = createSSNSchema({ allowDashes: true });
 * const result = ssnSchema.safeParse('123-45-6789');
 * ```
 */
export declare function createSSNSchema(options?: {
    message?: string;
    allowDashes?: boolean;
    mask?: boolean;
}): z.ZodString;
/**
 * Creates a Zod schema for email addresses with advanced validation.
 *
 * @param {object} [options] - Email validation options
 * @returns {z.ZodString} Zod string schema with email validation
 *
 * @example
 * ```typescript
 * const emailSchema = createEmailSchema({
 *   normalize: true,
 *   blockedDomains: ['tempmail.com']
 * });
 * ```
 */
export declare function createEmailSchema(options?: {
    message?: string;
    normalize?: boolean;
    blockedDomains?: string[];
    allowedDomains?: string[];
}): z.ZodString;
/**
 * Creates a Zod schema for US phone numbers with formatting.
 *
 * @param {object} [options] - Phone validation options
 * @returns {z.ZodString} Zod string schema with phone validation
 *
 * @example
 * ```typescript
 * const phoneSchema = createPhoneSchema({ format: 'e164' });
 * const result = phoneSchema.safeParse('555-123-4567'); // transforms to +15551234567
 * ```
 */
export declare function createPhoneSchema(options?: {
    message?: string;
    format?: 'e164' | 'national' | 'raw';
    country?: string;
}): z.ZodString;
/**
 * Creates a Zod schema for password validation with strength requirements.
 *
 * @param {object} [options] - Password strength options
 * @returns {z.ZodString} Zod string schema with password validation
 *
 * @example
 * ```typescript
 * const passwordSchema = createPasswordSchema({
 *   minLength: 12,
 *   requireSpecialChar: true
 * });
 * ```
 */
export declare function createPasswordSchema(options?: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecialChar?: boolean;
    message?: string;
}): z.ZodString;
/**
 * Creates a Zod schema for date validation with range constraints.
 *
 * @param {object} [options] - Date validation options
 * @returns {z.ZodDate} Zod date schema with validation
 *
 * @example
 * ```typescript
 * const dobSchema = createDateSchema({
 *   mustBePast: true,
 *   minAge: 18
 * });
 * ```
 */
export declare function createDateSchema(options?: {
    message?: string;
    mustBePast?: boolean;
    mustBeFuture?: boolean;
    minDate?: Date;
    maxDate?: Date;
    minAge?: number;
    maxAge?: number;
}): z.ZodDate;
/**
 * Creates a Zod schema for file upload validation.
 *
 * @param {FileValidationConstraints} constraints - File validation constraints
 * @returns {z.ZodObject} Zod object schema for file validation
 *
 * @example
 * ```typescript
 * const fileSchema = createFileSchema({
 *   maxSize: 5 * 1024 * 1024,
 *   allowedMimeTypes: ['image/jpeg', 'image/png']
 * });
 * ```
 */
export declare function createFileSchema(constraints: FileValidationConstraints): z.ZodObject<any>;
/**
 * Creates a Zod schema for array validation with custom item validation.
 *
 * @template T - Array item type
 * @param {z.ZodType<T>} itemSchema - Schema for array items
 * @param {object} [options] - Array validation options
 * @returns {z.ZodArray<z.ZodType<T>>} Zod array schema
 *
 * @example
 * ```typescript
 * const tagsSchema = createArraySchema(z.string(), {
 *   minLength: 1,
 *   maxLength: 10,
 *   unique: true
 * });
 * ```
 */
export declare function createArraySchema<T>(itemSchema: z.ZodType<T>, options?: {
    minLength?: number;
    maxLength?: number;
    unique?: boolean;
    message?: string;
}): z.ZodArray<z.ZodType<T>>;
/**
 * Creates a Zod schema with conditional validation based on other fields.
 *
 * @template T - Schema type
 * @param {z.ZodObject<any>} baseSchema - Base schema object
 * @param {ConditionalValidationRule<T>} rule - Conditional validation rule
 * @returns {z.ZodEffects<z.ZodObject<any>>} Zod schema with conditional validation
 *
 * @example
 * ```typescript
 * const schema = createConditionalSchema(
 *   z.object({ type: z.string(), email: z.string().optional() }),
 *   { field: 'type', operator: 'equals', value: 'email', validator: createEmailSchema() }
 * );
 * ```
 */
export declare function createConditionalSchema<T>(baseSchema: z.ZodObject<any>, rule: ConditionalValidationRule<T>): z.ZodEffects<z.ZodObject<any>>;
/**
 * Creates a Zod schema for nested object validation with deep validation.
 *
 * @param {z.ZodRawShape} shape - Object shape definition
 * @param {object} [options] - Nested validation options
 * @returns {z.ZodObject<any>} Zod object schema
 *
 * @example
 * ```typescript
 * const addressSchema = createNestedSchema({
 *   street: z.string(),
 *   city: z.string(),
 *   state: z.string(),
 *   zip: z.string().regex(/^\d{5}(-\d{4})?$/)
 * });
 * ```
 */
export declare function createNestedSchema(shape: z.ZodRawShape, options?: {
    strict?: boolean;
    stripUnknown?: boolean;
}): z.ZodObject<any>;
/**
 * Validates data against a Zod schema and returns detailed results.
 *
 * @template T - Data type
 * @param {z.ZodType<T>} schema - Zod schema
 * @param {unknown} data - Data to validate
 * @returns {Promise<ZodValidationResult<T>>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateWithZod(emailSchema, 'test@example.com');
 * if (result.success) {
 *   console.log('Valid email:', result.data);
 * } else {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateWithZod<T>(schema: z.ZodType<T>, data: unknown): Promise<ZodValidationResult<T>>;
/**
 * Creates a Zod schema for pagination parameters.
 *
 * @param {object} [options] - Pagination options
 * @returns {z.ZodObject} Zod object schema for pagination
 *
 * @example
 * ```typescript
 * const paginationSchema = createPaginationSchema({ maxLimit: 100 });
 * const result = paginationSchema.parse({ page: 1, limit: 20, sort: 'createdAt', order: 'desc' });
 * ```
 */
export declare function createPaginationSchema(options?: {
    maxLimit?: number;
    defaultLimit?: number;
    allowedSortFields?: string[];
}): z.ZodObject<any>;
/**
 * NestJS pipe for Zod schema validation with detailed error handling.
 *
 * @template T - Expected data type
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body(new ZodValidationPipe(createUserSchema)) dto: CreateUserDto) {
 *   return this.service.create(dto);
 * }
 * ```
 */
export declare class ZodValidationPipe<T> implements PipeTransform {
    private schema;
    constructor(schema: z.ZodType<T>);
    transform(value: unknown, metadata: ArgumentMetadata): Promise<T>;
}
/**
 * Enhanced NestJS validation pipe with transformation and sanitization.
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body(new EnhancedValidationPipe({ whitelist: true, transform: true })) dto: CreateUserDto) {
 *   return this.service.create(dto);
 * }
 * ```
 */
export declare class EnhancedValidationPipe implements PipeTransform {
    private options?;
    constructor(options?: ValidationPipeOptions | undefined);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    private toValidate;
    private formatErrors;
}
/**
 * Sanitization pipe that cleans input data before validation.
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body(SanitizationPipe) dto: CreateUserDto) {
 *   return this.service.create(dto);
 * }
 * ```
 */
export declare class SanitizationPipe implements PipeTransform {
    private options?;
    constructor(options?: SanitizationOptions | undefined);
    transform(value: any, metadata: ArgumentMetadata): any;
    private sanitizeString;
    private sanitizeObject;
    private removeScripts;
    private removeSQLPatterns;
}
/**
 * Validates that a string is a valid Medical Record Number (MRN).
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @IsMRN()
 *   @ApiProperty({ description: 'Medical Record Number' })
 *   mrn: string;
 * }
 * ```
 */
export declare function IsMRN(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * Validates that a string is a valid ICD-10 diagnostic code.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class DiagnosisDto {
 *   @IsICD10()
 *   @ApiProperty({ description: 'ICD-10 Code' })
 *   code: string;
 * }
 * ```
 */
export declare function IsICD10(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * Validates that a string is a valid National Provider Identifier (NPI).
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ProviderDto {
 *   @IsNPI()
 *   @ApiProperty({ description: 'National Provider Identifier' })
 *   npi: string;
 * }
 * ```
 */
export declare function IsNPI(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * Validates that a string is a valid US Social Security Number (SSN).
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PersonDto {
 *   @IsSSN()
 *   @ApiProperty({ description: 'Social Security Number' })
 *   ssn: string;
 * }
 * ```
 */
export declare function IsSSN(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * Validates that a value is within a specified numeric range.
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
 *   @ApiProperty({ description: 'Heart rate in BPM', minimum: 60, maximum: 100 })
 *   heartRate: number;
 * }
 * ```
 */
export declare function IsInRange(min: number, max: number, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * Validates that a field matches another field (useful for password confirmation).
 *
 * @param {string} property - Property name to match
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ChangePasswordDto {
 *   @IsString()
 *   password: string;
 *
 *   @Match('password')
 *   @ApiProperty({ description: 'Password confirmation' })
 *   confirmPassword: string;
 * }
 * ```
 */
export declare function Match(property: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
 *   @ApiProperty({ description: 'Date of Birth' })
 *   dateOfBirth: Date;
 * }
 * ```
 */
export declare function IsPastDate(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
 *   @ApiProperty({ description: 'Appointment date and time' })
 *   scheduledAt: Date;
 * }
 * ```
 */
export declare function IsFutureDate(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
/**
 * Sanitizes input to prevent XSS attacks with advanced options.
 *
 * @param {string} input - Input string to sanitize
 * @param {XSSSanitizationOptions} [options] - Sanitization options
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const safe = sanitizeXSS('<script>alert("xss")</script>Hello World');
 * // Returns: 'Hello World'
 * ```
 */
export declare function sanitizeXSS(input: string, options?: XSSSanitizationOptions): string;
/**
 * Sanitizes SQL query input to prevent SQL injection.
 *
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const safe = sanitizeSQLInput("'; DROP TABLE users; --");
 * ```
 */
export declare function sanitizeSQLInput(input: string): string;
/**
 * Sanitizes HTML input by allowing only specific tags and attributes.
 *
 * @param {string} html - HTML string to sanitize
 * @param {object} [options] - Sanitization options
 * @returns {string} Sanitized HTML
 *
 * @example
 * ```typescript
 * const safe = sanitizeHTML('<p>Hello</p><script>alert("xss")</script>', {
 *   allowedTags: ['p', 'br', 'strong']
 * });
 * ```
 */
export declare function sanitizeHTML(html: string, options?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
}): string;
/**
 * Sanitizes file names to prevent path traversal attacks.
 *
 * @param {string} filename - File name to sanitize
 * @returns {string} Sanitized file name
 *
 * @example
 * ```typescript
 * const safe = sanitizeFileName('../../etc/passwd');
 * // Returns: 'etcpasswd'
 * ```
 */
export declare function sanitizeFileName(filename: string): string;
/**
 * Sanitizes email addresses by normalizing and validating format.
 *
 * @param {string} email - Email address to sanitize
 * @returns {string | null} Sanitized email or null if invalid
 *
 * @example
 * ```typescript
 * const email = sanitizeEmail(' User@Example.COM ');
 * // Returns: 'user@example.com'
 * ```
 */
export declare function sanitizeEmail(email: string): string | null;
/**
 * Sanitizes phone numbers by removing non-numeric characters.
 *
 * @param {string} phone - Phone number to sanitize
 * @param {object} [options] - Sanitization options
 * @returns {string} Sanitized phone number
 *
 * @example
 * ```typescript
 * const phone = sanitizePhoneNumber('(555) 123-4567');
 * // Returns: '5551234567'
 * ```
 */
export declare function sanitizePhoneNumber(phone: string, options?: {
    format?: 'e164' | 'national' | 'raw';
    country?: string;
}): string;
/**
 * Sanitizes URLs by validating and normalizing format.
 *
 * @param {string} url - URL to sanitize
 * @param {object} [options] - Sanitization options
 * @returns {string | null} Sanitized URL or null if invalid
 *
 * @example
 * ```typescript
 * const url = sanitizeURL('  https://example.com/path  ');
 * // Returns: 'https://example.com/path'
 * ```
 */
export declare function sanitizeURL(url: string, options?: {
    protocols?: string[];
    requireProtocol?: boolean;
}): string | null;
/**
 * Transforms a plain object to a DTO class instance with validation.
 *
 * @template T - Target class type
 * @param {ClassConstructor<T>} cls - Target class constructor
 * @param {any} plain - Plain object to transform
 * @param {object} [options] - Transformation options
 * @returns {Promise<T>} Transformed and validated instance
 *
 * @example
 * ```typescript
 * const dto = await transformToDTO(CreateUserDto, { email: 'test@example.com', name: 'John' });
 * ```
 */
export declare function transformToDTO<T extends object>(cls: ClassConstructor<T>, plain: any, options?: {
    validate?: boolean;
    groups?: string[];
    excludeExtraneous?: boolean;
}): Promise<T>;
/**
 * Transforms a DTO class instance to a plain object.
 *
 * @template T - Source class type
 * @param {T} instance - Class instance to transform
 * @param {object} [options] - Transformation options
 * @returns {any} Plain object
 *
 * @example
 * ```typescript
 * const plain = transformToPlain(userDto);
 * ```
 */
export declare function transformToPlain<T extends object>(instance: T, options?: {
    excludeExtraneous?: boolean;
    groups?: string[];
}): any;
/**
 * Coerces a value to a boolean with intelligent parsing.
 *
 * @param {any} value - Value to coerce
 * @returns {boolean} Boolean value
 *
 * @example
 * ```typescript
 * coerceBoolean('true'); // true
 * coerceBoolean('1'); // true
 * coerceBoolean('yes'); // true
 * coerceBoolean('false'); // false
 * coerceBoolean(0); // false
 * ```
 */
export declare function coerceBoolean(value: any): boolean;
/**
 * Coerces a value to a number with validation.
 *
 * @param {any} value - Value to coerce
 * @param {number} [defaultValue] - Default value if coercion fails
 * @returns {number | null} Number value or null
 *
 * @example
 * ```typescript
 * coerceNumber('123'); // 123
 * coerceNumber('12.34'); // 12.34
 * coerceNumber('invalid'); // null
 * coerceNumber('invalid', 0); // 0
 * ```
 */
export declare function coerceNumber(value: any, defaultValue?: number): number | null;
/**
 * Coerces a value to a Date object.
 *
 * @param {any} value - Value to coerce
 * @returns {Date | null} Date object or null
 *
 * @example
 * ```typescript
 * coerceDate('2024-01-01'); // Date object
 * coerceDate('2024-01-01T00:00:00Z'); // Date object
 * coerceDate('invalid'); // null
 * ```
 */
export declare function coerceDate(value: any): Date | null;
/**
 * Coerces a value to an array.
 *
 * @template T - Array item type
 * @param {any} value - Value to coerce
 * @returns {T[]} Array
 *
 * @example
 * ```typescript
 * coerceArray('item'); // ['item']
 * coerceArray(['item1', 'item2']); // ['item1', 'item2']
 * coerceArray(null); // []
 * ```
 */
export declare function coerceArray<T>(value: any): T[];
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
export declare function convertCase(str: string, format: 'camel' | 'pascal' | 'snake' | 'kebab'): string;
/**
 * Creates an async validator that checks database uniqueness.
 *
 * @template T - Entity type
 * @param {Function} checkFn - Async function to check existence
 * @param {string} [message] - Error message
 * @returns {Function} Async validator function
 *
 * @example
 * ```typescript
 * @ValidatorConstraint({ async: true })
 * @Injectable()
 * class IsEmailUnique implements ValidatorConstraintInterface {
 *   constructor(private userRepository: UserRepository) {}
 *
 *   validate = createAsyncUniqueValidator(
 *     async (email: string) => {
 *       const user = await this.userRepository.findByEmail(email);
 *       return !user;
 *     },
 *     'Email already exists'
 *   );
 * }
 * ```
 */
export declare function createAsyncUniqueValidator<T>(checkFn: (value: T) => Promise<boolean>, message?: string): (value: T, args?: ValidationArguments) => Promise<boolean>;
/**
 * Creates an async validator with custom logic and error handling.
 *
 * @template T - Value type
 * @param {AsyncValidatorFn<T>} validatorFn - Async validator function
 * @param {string} [defaultMessage] - Default error message
 * @returns {Function} Async validator function
 *
 * @example
 * ```typescript
 * const validator = createAsyncValidator(
 *   async (username: string) => {
 *     const reserved = await getReservedUsernames();
 *     return !reserved.includes(username);
 *   },
 *   'Username is reserved'
 * );
 * ```
 */
export declare function createAsyncValidator<T>(validatorFn: AsyncValidatorFn<T>, defaultMessage?: string): (value: T, args?: ValidationArguments) => Promise<boolean>;
/**
 * Formats validation errors into a structured response.
 *
 * @param {ValidationError[]} errors - Validation errors
 * @returns {Record<string, string[]>} Formatted errors
 *
 * @example
 * ```typescript
 * const errors = await validate(dto);
 * const formatted = formatValidationErrors(errors);
 * // { email: ['Email is invalid'], password: ['Password is too short'] }
 * ```
 */
export declare function formatValidationErrors(errors: ValidationError[]): Record<string, string[]>;
/**
 * Validates an object and returns detailed validation results.
 *
 * @template T - Object type
 * @param {T} object - Object to validate
 * @param {object} [options] - Validation options
 * @returns {Promise<ValidationResult<T>>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateObject(userDto, { groups: ['create'] });
 * if (!result.isValid) {
 *   console.error(result.fieldErrors);
 * }
 * ```
 */
export declare function validateObject<T extends object>(object: T, options?: {
    groups?: string[];
    skipMissingProperties?: boolean;
}): Promise<ValidationResult<T>>;
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
 * const result = await validatePartialObject({ email: 'new@example.com' }, UpdateUserDto);
 * ```
 */
export declare function validatePartialObject<T extends object>(partial: Partial<T>, cls: ClassConstructor<T>): Promise<ValidationResult<Partial<T>>>;
/**
 * Common Zod schemas for reuse across the application.
 */
export declare const CommonSchemas: {
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    mrn: z.ZodString;
    icd10: z.ZodString;
    npi: z.ZodString;
    ssn: z.ZodString;
    uuid: any;
    url: any;
    positiveInt: any;
    nonNegativeInt: any;
    pagination: z.ZodObject<any>;
};
/**
 * Re-export commonly used validation decorators and types.
 */
export { IsEmail, IsUUID, IsDate, IsCreditCard, ValidationError, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, Expose, Type, Transform, ApiProperty, ApiPropertyOptional, };
//# sourceMappingURL=validation-sanitization-kit.prod.d.ts.map