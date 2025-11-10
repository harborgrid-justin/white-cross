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
import { ValidationOptions, ValidationArguments, ValidationError } from 'class-validator';
import { ClassConstructor } from 'class-transformer';
import { PipeTransform } from '@nestjs/common';
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
export declare function IsMedicalRecordNumber(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function IsICD10Code(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function IsInRange(min: number, max: number, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
 *   scheduledDate: Date;
 * }
 * ```
 */
export declare function IsFutureDate(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function IsUSPhoneNumber(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function IsPostalCode(country?: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function IsAlphanumeric(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function IsHexColor(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function IsUniqueArray(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function transformToDto<T extends object>(cls: ClassConstructor<T>, plain: any, validateAfterTransform?: boolean): Promise<T>;
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
export declare function transformToPlain<T extends object>(instance: T, excludeExtraneous?: boolean): any;
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
export declare function transformArrayToDto<T extends object>(cls: ClassConstructor<T>, plainArray: any[], validateAfterTransform?: boolean): Promise<T[]>;
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
export declare function transformAndMerge<T extends object>(cls: ClassConstructor<T>, ...sources: any[]): Promise<T>;
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
export declare function createTransformPipe<T extends object>(cls: ClassConstructor<T>, groups?: string[]): PipeTransform;
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
export declare function validateWithDetails<T extends object>(object: T, groups?: string[]): Promise<ValidationResult<T>>;
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
export declare function createAsyncValidator<T>(name: string, validatorFn: (value: T) => Promise<boolean>, defaultMessage: string): (value: T, args?: ValidationArguments) => Promise<boolean>;
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
export declare function extractValidationErrors(errors: ValidationError[]): Record<string, string[]>;
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
export declare function validatePartial<T extends object>(partial: Partial<T>, cls: ClassConstructor<T>): Promise<ValidationResult<Partial<T>>>;
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
export declare function ValidationGroup(groups: string[]): PropertyDecorator;
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
export declare function sanitizeXSS(input: string, options?: SanitizationOptions): string;
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
export declare function sanitizeSQLInjection(input: string): string;
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
export declare function sanitizeHTML(html: string, allowedTags?: string[]): string;
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
export declare function sanitizeFileName(filename: string): string;
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
export declare function sanitizeEmail(email: string): string | null;
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
export declare function coerceToBoolean(value: any): boolean;
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
export declare function coerceToNumber(value: any, defaultValue?: number): number | null;
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
export declare function coerceToDate(value: any): Date | null;
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
export declare function coerceToArray<T>(value: any): T[];
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
export declare function createSchemaValidator<T>(schema: SchemaDefinition<T>): SchemaValidator<T>;
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
export declare function validateObjectSchema<T extends object>(obj: T, schema: Record<string, SchemaDefinition>): Promise<ValidationResult<T>>;
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
export declare function createSchema<T extends object>(): {
    field(name: keyof T, definition: SchemaDefinition): /*elided*/ any;
    build(): {
        validate: (obj: T) => Promise<ValidationResult<T>>;
        schema: Record<string, SchemaDefinition<any>>;
    };
};
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
export declare function validateJSONSchema<T extends object>(jsonString: string, schema: Record<string, SchemaDefinition>): Promise<ValidationResult<T>>;
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
export declare function validateInterface<T extends object>(obj: any, typeMap: Record<keyof T, string>): ValidationResult<T>;
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
export declare function validateArray<T>(array: T[], itemValidator: SchemaValidator<T>): Promise<ValidationResult<T[]>>;
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
export declare function validateArrayUnique<T>(array: T[], keyOrFn: keyof T | ((item: T) => any)): ValidationResult<T[]>;
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
export declare function validateObjectKeys<T extends object>(obj: T, allowedKeys: string[]): ValidationResult<T>;
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
export declare function validateObjectNotEmpty(obj: object): ValidationResult<object>;
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
export declare function createConditionalValidator<T>(condition: (object: any) => boolean, validator: SchemaValidator<T>): SchemaValidator<T>;
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
export declare function ValidateIf(dependentField: string, expectedValue: any, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function createSwitchValidator<T>(rules: ConditionalRule<T>[], defaultValidator?: SchemaValidator<T>): SchemaValidator<T>;
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
export declare function Match(propertyToCompare: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function IsAfterDate(startDateProperty: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
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
export declare function RequireAtLeastOne(properties: string[], validationOptions?: ValidationOptions): (constructor: Function) => void;
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
export declare function validateFile(file: any, options: FileValidationOptions): ValidationResult<any>;
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
export declare function validateFiles(files: any[], options: FileValidationOptions): ValidationResult<any[]>;
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
export declare function validateImageDimensions(file: any, options: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
}): ValidationResult<any>;
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
export declare function validateEmailDetailed(email: string, options?: {
    requireTld?: boolean;
    allowDisplayName?: boolean;
    allowUtf8LocalPart?: boolean;
}): ValidationResult<string>;
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
export declare function validatePhoneNumber(phone: string, country?: string): PhoneValidationResult;
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
export declare function validateURLDetailed(url: string, options?: {
    protocols?: string[];
    requireProtocol?: boolean;
    requireTld?: boolean;
}): ValidationResult<string>;
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
export declare function validateCreditCard(cardNumber: string): CreditCardValidationResult;
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
export declare function validateCVV(cvv: string, cardType?: 'visa' | 'mastercard' | 'amex' | 'discover'): ValidationResult<string>;
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
export declare function validateCardExpiry(expiry: string): ValidationResult<{
    month: number;
    year: number;
}>;
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
export declare function validateISO8601Date(dateString: string): ValidationResult<Date>;
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
export declare function validateDateRange(startDate: Date | string, endDate: Date | string, options?: {
    maxDuration?: number;
    minDuration?: number;
}): ValidationResult<{
    start: Date;
    end: Date;
}>;
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
export declare function validateBusinessHours(time: string): ValidationResult<{
    hours: number;
    minutes: number;
}>;
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
export declare function validateGeoCoordinates(latitude: number, longitude: number): ValidationResult<GeoCoordinates>;
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
export declare function validateUSState(stateCode: string): ValidationResult<string>;
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
export declare function validateNestedObject<T extends object>(obj: T, schema: Record<string, SchemaDefinition>, path?: string): Promise<ValidationResult<T>>;
//# sourceMappingURL=validation-transform-kit.d.ts.map