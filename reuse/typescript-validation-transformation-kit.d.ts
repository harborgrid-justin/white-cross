/**
 * LOC: TSVT1234567
 * File: /reuse/typescript-validation-transformation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - class-validator (validation decorators)
 *   - class-transformer (transformation decorators)
 *   - @nestjs/common (validation pipes, exceptions)
 *
 * DOWNSTREAM (imported by):
 *   - DTO classes and validation schemas
 *   - API controllers and services
 *   - Data transformation pipelines
 *   - Input validation middleware
 */
/**
 * File: /reuse/typescript-validation-transformation-kit.ts
 * Locator: WC-UTL-TSVT-001
 * Purpose: Comprehensive TypeScript Validation & Transformation Utilities - Runtime validation, decorators, transformations
 *
 * Upstream: class-validator, class-transformer, @nestjs/common, TypeScript decorators
 * Downstream: ../backend/*, DTO classes, validation middleware, transformation services
 * Dependencies: TypeScript 5.x, Node 18+, class-validator 0.14+, class-transformer 0.5+, NestJS 10.x
 * Exports: 45 utility functions for runtime validation, DTO validation, custom decorators, transformations, sanitization
 *
 * LLM Context: Comprehensive TypeScript validation and transformation utilities for White Cross healthcare system.
 * Provides runtime type validation, schema validation with class-validator patterns, custom validation decorators,
 * transformation decorators, sanitization helpers, type coercion, parsing utilities (dates, numbers, JSON),
 * string normalization, format validators (email, phone, URL, UUID), nested object/array validation,
 * conditional validation, cross-field validation, async validation, validation groups, and error formatting.
 * Essential for ensuring data integrity, type safety, and compliance in healthcare applications.
 */
import { ValidationError, ValidatorOptions, ValidationOptions, ValidationArguments } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    constraints?: Record<string, string[]>;
}
interface TransformOptions {
    excludeExtraneousValues?: boolean;
    exposeDefaultValues?: boolean;
    exposeUnsetFields?: boolean;
    enableImplicitConversion?: boolean;
    excludePrefixes?: string[];
}
interface SanitizationOptions {
    trim?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    removeHtml?: boolean;
    removeScripts?: boolean;
    removeSpecialChars?: boolean;
    maxLength?: number;
    stripWhitespace?: boolean;
    normalizeUnicode?: boolean;
}
interface DateParseOptions {
    strict?: boolean;
    format?: string;
    timezone?: string;
    allowPast?: boolean;
    allowFuture?: boolean;
}
interface NumberParseOptions {
    min?: number;
    max?: number;
    decimals?: number;
    allowNegative?: boolean;
    allowZero?: boolean;
}
interface CrossFieldValidationRule {
    fields: string[];
    validator: (values: Record<string, any>) => boolean | Promise<boolean>;
    message: string;
}
interface ConditionalValidationRule {
    condition: (value: any, object: any) => boolean;
    validator: (value: any) => boolean | Promise<boolean>;
    message: string;
}
/**
 * 1. Validates if value is a non-null, non-undefined primitive type.
 *
 * @param {any} value - Value to validate
 * @param {string} expectedType - Expected primitive type ('string' | 'number' | 'boolean' | 'symbol')
 * @returns {boolean} True if value matches expected type
 *
 * @example
 * ```typescript
 * const isValid = validatePrimitiveType('hello', 'string'); // true
 * const isValid2 = validatePrimitiveType(null, 'string'); // false
 * ```
 */
export declare const validatePrimitiveType: (value: any, expectedType: string) => boolean;
/**
 * 2. Validates if value is a valid array with optional element type checking.
 *
 * @param {any} value - Value to validate
 * @param {string} [elementType] - Optional element type to check
 * @returns {boolean} True if value is valid array
 *
 * @example
 * ```typescript
 * const isValid = validateArrayType([1, 2, 3], 'number'); // true
 * const isValid2 = validateArrayType(['a', 1], 'string'); // false
 * ```
 */
export declare const validateArrayType: (value: any, elementType?: string) => boolean;
/**
 * 3. Validates if value is a plain object (not array, null, or Date).
 *
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is plain object
 *
 * @example
 * ```typescript
 * const isValid = validatePlainObject({ name: 'John' }); // true
 * const isValid2 = validatePlainObject([]); // false
 * const isValid3 = validatePlainObject(null); // false
 * ```
 */
export declare const validatePlainObject: (value: any) => boolean;
/**
 * 4. Validates runtime type with comprehensive type checking.
 *
 * @param {any} value - Value to validate
 * @param {string} type - Expected type descriptor
 * @returns {ValidationResult} Validation result with errors
 *
 * @example
 * ```typescript
 * const result = validateRuntimeType({ age: 25 }, 'object');
 * // Result: { isValid: true, errors: [] }
 * ```
 */
export declare const validateRuntimeType: (value: any, type: string) => ValidationResult;
/**
 * 5. Validates object against DTO class using class-validator.
 *
 * @param {any} dtoClass - DTO class constructor
 * @param {any} plain - Plain object to validate
 * @param {ValidatorOptions} [options] - Validation options
 * @returns {Promise<ValidationResult>} Async validation result
 *
 * @example
 * ```typescript
 * class CreateUserDto {
 *   @IsString() name: string;
 *   @IsEmail() email: string;
 * }
 * const result = await validateDTO(CreateUserDto, { name: 'John', email: 'john@example.com' });
 * ```
 */
export declare const validateDTO: <T extends object>(dtoClass: new () => T, plain: any, options?: ValidatorOptions) => Promise<ValidationResult>;
/**
 * 6. Validates and transforms plain object to DTO instance.
 *
 * @param {any} dtoClass - DTO class constructor
 * @param {any} plain - Plain object to transform and validate
 * @param {ValidatorOptions} [options] - Validation options
 * @returns {Promise<T>} Validated DTO instance
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const userDto = await validateAndTransform(CreateUserDto, rawData);
 * ```
 */
export declare const validateAndTransform: <T extends object>(dtoClass: new () => T, plain: any, options?: ValidatorOptions) => Promise<T>;
/**
 * 7. Creates a NestJS validation pipe with custom configuration.
 *
 * @param {boolean} [transform=true] - Enable automatic transformation
 * @param {boolean} [whitelist=true] - Strip non-whitelisted properties
 * @param {boolean} [forbidNonWhitelisted=false] - Throw on non-whitelisted properties
 * @returns {ValidationPipe} Configured validation pipe
 *
 * @example
 * ```typescript
 * const pipe = createValidationPipe(true, true, true);
 * // Use in controller: @UsePipes(pipe)
 * ```
 */
export declare const createValidationPipe: (transform?: boolean, whitelist?: boolean, forbidNonWhitelisted?: boolean) => ValidationPipe;
/**
 * 8. Validates nested object recursively with class-validator.
 *
 * @param {any} dtoClass - DTO class constructor
 * @param {any} plain - Plain object with nested structures
 * @returns {Promise<ValidationResult>} Validation result including nested errors
 *
 * @example
 * ```typescript
 * class AddressDto {
 *   @IsString() street: string;
 * }
 * class UserDto {
 *   @ValidateNested() @Type(() => AddressDto) address: AddressDto;
 * }
 * const result = await validateNestedObject(UserDto, data);
 * ```
 */
export declare const validateNestedObject: <T extends object>(dtoClass: new () => T, plain: any) => Promise<ValidationResult>;
/**
 * 9. Creates a custom validation decorator with inline validator function.
 *
 * @param {Function} validatorFn - Validator function (value, args) => boolean
 * @param {string} defaultMessage - Default error message
 * @returns {PropertyDecorator} Custom validation decorator
 *
 * @example
 * ```typescript
 * const IsPositive = createCustomValidator(
 *   (value) => typeof value === 'number' && value > 0,
 *   'Value must be positive'
 * );
 * class Dto { @IsPositive() count: number; }
 * ```
 */
export declare const createCustomValidator: (validatorFn: (value: any, args: ValidationArguments) => boolean, defaultMessage: string) => PropertyDecorator;
/**
 * 10. Creates an async validation decorator with external validation logic.
 *
 * @param {Function} asyncValidatorFn - Async validator function
 * @param {string} defaultMessage - Default error message
 * @returns {PropertyDecorator} Async validation decorator
 *
 * @example
 * ```typescript
 * const IsUniqueEmail = createAsyncValidator(
 *   async (email) => !(await userRepo.findByEmail(email)),
 *   'Email already exists'
 * );
 * ```
 */
export declare const createAsyncValidator: (asyncValidatorFn: (value: any, args: ValidationArguments) => Promise<boolean>, defaultMessage: string) => PropertyDecorator;
/**
 * 11. Decorator for validating matches another field (e.g., password confirmation).
 *
 * @param {string} property - Property name to match
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Match validation decorator
 *
 * @example
 * ```typescript
 * class PasswordDto {
 *   @IsString() password: string;
 *   @Match('password', { message: 'Passwords do not match' })
 *   confirmPassword: string;
 * }
 * ```
 */
export declare function Match(property: string, validationOptions?: ValidationOptions): PropertyDecorator;
/**
 * 12. Decorator for validating field is different from another field.
 *
 * @param {string} property - Property name to differ from
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Different validation decorator
 *
 * @example
 * ```typescript
 * class AccountDto {
 *   @IsEmail() email: string;
 *   @IsEmail() @Different('email') recoveryEmail: string;
 * }
 * ```
 */
export declare function Different(property: string, validationOptions?: ValidationOptions): PropertyDecorator;
/**
 * 13. Transforms plain object to class instance with type safety.
 *
 * @param {any} dtoClass - Target DTO class
 * @param {any} plain - Plain object or array
 * @param {TransformOptions} [options] - Transformation options
 * @returns {T | T[]} Transformed instance(s)
 *
 * @example
 * ```typescript
 * const user = transformToClass(UserDto, { name: 'John', age: 30 });
 * const users = transformToClass(UserDto, [{ name: 'John' }, { name: 'Jane' }]);
 * ```
 */
export declare const transformToClass: <T extends object>(dtoClass: new () => T, plain: any, options?: TransformOptions) => T | T[];
/**
 * 14. Transforms class instance to plain object.
 *
 * @param {T} instance - Class instance
 * @returns {Record<string, any>} Plain object representation
 *
 * @example
 * ```typescript
 * const userDto = new UserDto();
 * const plain = transformToPlain(userDto);
 * // Result: { name: 'John', email: 'john@example.com' }
 * ```
 */
export declare const transformToPlain: <T extends object>(instance: T) => Record<string, any>;
/**
 * 15. Creates a transform decorator for custom property transformation.
 *
 * @param {Function} transformFn - Transform function
 * @returns {PropertyDecorator} Transform decorator
 *
 * @example
 * ```typescript
 * const ToUpperCase = createTransformDecorator((value) => value?.toUpperCase());
 * class Dto { @ToUpperCase() name: string; }
 * ```
 */
export declare const createTransformDecorator: (transformFn: (value: any, obj: any, type: any) => any) => PropertyDecorator;
/**
 * 16. Decorator to trim whitespace from string properties.
 *
 * @returns {PropertyDecorator} Trim decorator
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @Trim() name: string;
 * }
 * ```
 */
export declare function Trim(): PropertyDecorator;
/**
 * 17. Decorator to convert string to lowercase.
 *
 * @returns {PropertyDecorator} Lowercase decorator
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @ToLowerCase() email: string;
 * }
 * ```
 */
export declare function ToLowerCase(): PropertyDecorator;
/**
 * 18. Decorator to convert string to uppercase.
 *
 * @returns {PropertyDecorator} Uppercase decorator
 *
 * @example
 * ```typescript
 * class CodeDto {
 *   @ToUpperCase() code: string;
 * }
 * ```
 */
export declare function ToUpperCase(): PropertyDecorator;
/**
 * 19. Decorator to parse string to integer.
 *
 * @returns {PropertyDecorator} Parse int decorator
 *
 * @example
 * ```typescript
 * class QueryDto {
 *   @ToInt() page: number;
 * }
 * ```
 */
export declare function ToInt(): PropertyDecorator;
/**
 * 20. Decorator to parse string to float.
 *
 * @returns {PropertyDecorator} Parse float decorator
 *
 * @example
 * ```typescript
 * class PriceDto {
 *   @ToFloat() amount: number;
 * }
 * ```
 */
export declare function ToFloat(): PropertyDecorator;
/**
 * 21. Decorator to parse string to boolean.
 *
 * @returns {PropertyDecorator} Parse boolean decorator
 *
 * @example
 * ```typescript
 * class SettingsDto {
 *   @ToBoolean() enabled: boolean;
 * }
 * ```
 */
export declare function ToBoolean(): PropertyDecorator;
/**
 * 22. Decorator to parse string to Date.
 *
 * @returns {PropertyDecorator} Parse date decorator
 *
 * @example
 * ```typescript
 * class EventDto {
 *   @ToDate() startDate: Date;
 * }
 * ```
 */
export declare function ToDate(): PropertyDecorator;
/**
 * 23. Sanitizes string with comprehensive options.
 *
 * @param {string} value - String to sanitize
 * @param {SanitizationOptions} [options] - Sanitization options
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const clean = sanitizeString('  Hello <script>alert(1)</script>  ', {
 *   trim: true,
 *   removeHtml: true,
 *   lowercase: true
 * });
 * // Result: 'hello alert(1)'
 * ```
 */
export declare const sanitizeString: (value: string, options?: SanitizationOptions) => string;
/**
 * 24. Removes HTML tags from string.
 *
 * @param {string} value - String with HTML
 * @returns {string} String without HTML tags
 *
 * @example
 * ```typescript
 * const text = stripHtmlTags('<p>Hello <strong>World</strong></p>');
 * // Result: 'Hello World'
 * ```
 */
export declare const stripHtmlTags: (value: string) => string;
/**
 * 25. Escapes HTML special characters to prevent XSS.
 *
 * @param {string} value - String to escape
 * @returns {string} Escaped string
 *
 * @example
 * ```typescript
 * const safe = escapeHtml('<script>alert("XSS")</script>');
 * // Result: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 * ```
 */
export declare const escapeHtml: (value: string) => string;
/**
 * 26. Normalizes whitespace in string (multiple spaces to single space).
 *
 * @param {string} value - String with irregular whitespace
 * @returns {string} Normalized string
 *
 * @example
 * ```typescript
 * const normalized = normalizeWhitespace('Hello    World\n\n  ');
 * // Result: 'Hello World '
 * ```
 */
export declare const normalizeWhitespace: (value: string) => string;
/**
 * 27. Coerces value to string with fallback.
 *
 * @param {any} value - Value to coerce
 * @param {string} [fallback=''] - Fallback value if coercion fails
 * @returns {string} Coerced string
 *
 * @example
 * ```typescript
 * const str = coerceToString(123); // '123'
 * const str2 = coerceToString(null, 'N/A'); // 'N/A'
 * ```
 */
export declare const coerceToString: (value: any, fallback?: string) => string;
/**
 * 28. Coerces value to number with validation options.
 *
 * @param {any} value - Value to coerce
 * @param {NumberParseOptions} [options] - Parse options
 * @returns {number | null} Coerced number or null
 *
 * @example
 * ```typescript
 * const num = coerceToNumber('42.5', { min: 0, max: 100, decimals: 1 });
 * // Result: 42.5
 * ```
 */
export declare const coerceToNumber: (value: any, options?: NumberParseOptions) => number | null;
/**
 * 29. Coerces value to boolean with intelligent parsing.
 *
 * @param {any} value - Value to coerce
 * @returns {boolean} Coerced boolean
 *
 * @example
 * ```typescript
 * const bool = coerceToBoolean('true'); // true
 * const bool2 = coerceToBoolean('1'); // true
 * const bool3 = coerceToBoolean('no'); // false
 * ```
 */
export declare const coerceToBoolean: (value: any) => boolean;
/**
 * 30. Parses date string with multiple format support.
 *
 * @param {any} value - Date value to parse
 * @param {DateParseOptions} [options] - Parse options
 * @returns {Date | null} Parsed date or null
 *
 * @example
 * ```typescript
 * const date = parseDate('2024-01-15', { allowFuture: true });
 * const date2 = parseDate('2020-01-15', { allowPast: true });
 * ```
 */
export declare const parseDate: (value: any, options?: DateParseOptions) => Date | null;
/**
 * 31. Parses JSON string safely with error handling.
 *
 * @param {string} value - JSON string to parse
 * @param {any} [fallback=null] - Fallback value on parse error
 * @returns {any} Parsed JSON or fallback
 *
 * @example
 * ```typescript
 * const obj = parseJsonSafe('{"name":"John"}'); // { name: 'John' }
 * const obj2 = parseJsonSafe('invalid', {}); // {}
 * ```
 */
export declare const parseJsonSafe: (value: string, fallback?: any) => any;
/**
 * 32. Validates email format with comprehensive RFC-compliant regex.
 *
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 *
 * @example
 * ```typescript
 * const isValid = validateEmail('user@example.com'); // true
 * const isValid2 = validateEmail('invalid.email'); // false
 * ```
 */
export declare const validateEmail: (email: string) => boolean;
/**
 * 33. Validates phone number with international format support.
 *
 * @param {string} phone - Phone number to validate
 * @param {string} [countryCode] - Optional country code filter
 * @returns {boolean} True if valid phone format
 *
 * @example
 * ```typescript
 * const isValid = validatePhone('+1-555-123-4567'); // true
 * const isValid2 = validatePhone('555-1234'); // true
 * ```
 */
export declare const validatePhone: (phone: string, countryCode?: string) => boolean;
/**
 * 34. Validates URL format with protocol checking.
 *
 * @param {string} url - URL to validate
 * @param {string[]} [allowedProtocols] - Allowed protocols (default: ['http', 'https'])
 * @returns {boolean} True if valid URL format
 *
 * @example
 * ```typescript
 * const isValid = validateUrl('https://example.com'); // true
 * const isValid2 = validateUrl('ftp://files.com', ['ftp']); // true
 * ```
 */
export declare const validateUrl: (url: string, allowedProtocols?: string[]) => boolean;
/**
 * 35. Validates UUID format (v4 primarily).
 *
 * @param {string} uuid - UUID to validate
 * @param {number} [version] - UUID version (4 or 5)
 * @returns {boolean} True if valid UUID format
 *
 * @example
 * ```typescript
 * const isValid = validateUuid('550e8400-e29b-41d4-a716-446655440000'); // true
 * const isValid2 = validateUuid('invalid-uuid'); // false
 * ```
 */
export declare const validateUuid: (uuid: string, version?: number) => boolean;
/**
 * 36. Validates JSON string format.
 *
 * @param {string} value - String to validate as JSON
 * @returns {boolean} True if valid JSON
 *
 * @example
 * ```typescript
 * const isValid = validateJson('{"name":"John"}'); // true
 * const isValid2 = validateJson('{invalid}'); // false
 * ```
 */
export declare const validateJson: (value: string) => boolean;
/**
 * 37. Validates array elements with custom validator.
 *
 * @param {any[]} array - Array to validate
 * @param {Function} validator - Validator function for each element
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateArrayElements([1, 2, 3], (x) => typeof x === 'number');
 * // Result: { isValid: true, errors: [] }
 * ```
 */
export declare const validateArrayElements: (array: any[], validator: (element: any, index: number) => boolean) => ValidationResult;
/**
 * 38. Validates object has required keys with optional type checking.
 *
 * @param {Record<string, any>} obj - Object to validate
 * @param {string[]} requiredKeys - Required key names
 * @param {Record<string, string>} [typeMap] - Optional type checking map
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateObjectKeys(
 *   { name: 'John', age: 30 },
 *   ['name', 'age'],
 *   { name: 'string', age: 'number' }
 * );
 * ```
 */
export declare const validateObjectKeys: (obj: Record<string, any>, requiredKeys: string[], typeMap?: Record<string, string>) => ValidationResult;
/**
 * 39. Validates field conditionally based on another field's value.
 *
 * @param {Record<string, any>} obj - Object to validate
 * @param {ConditionalValidationRule} rule - Conditional validation rule
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const rule = {
 *   condition: (value, obj) => obj.type === 'premium',
 *   validator: (value) => value > 100,
 *   message: 'Premium amount must be greater than 100'
 * };
 * const result = await validateConditional({ type: 'premium', amount: 150 }, rule);
 * ```
 */
export declare const validateConditional: (obj: Record<string, any>, rule: ConditionalValidationRule) => Promise<ValidationResult>;
/**
 * 40. Validates cross-field dependencies (e.g., endDate > startDate).
 *
 * @param {Record<string, any>} obj - Object to validate
 * @param {CrossFieldValidationRule} rule - Cross-field validation rule
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const rule = {
 *   fields: ['startDate', 'endDate'],
 *   validator: (values) => values.endDate > values.startDate,
 *   message: 'End date must be after start date'
 * };
 * const result = await validateCrossField(dateRange, rule);
 * ```
 */
export declare const validateCrossField: (obj: Record<string, any>, rule: CrossFieldValidationRule) => Promise<ValidationResult>;
/**
 * 41. Validates object with validation groups (partial validation).
 *
 * @param {any} dtoClass - DTO class constructor
 * @param {any} plain - Plain object to validate
 * @param {string[]} groups - Validation groups to apply
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsString({ groups: ['create', 'update'] }) name: string;
 *   @IsEmail({ groups: ['create'] }) email: string;
 * }
 * const result = await validateWithGroups(UserDto, data, ['create']);
 * ```
 */
export declare const validateWithGroups: <T extends object>(dtoClass: new () => T, plain: any, groups: string[]) => Promise<ValidationResult>;
/**
 * 42. Formats validation errors into user-friendly messages.
 *
 * @param {ValidationError[]} errors - Validation errors from class-validator
 * @returns {Record<string, string[]>} Formatted errors by field
 *
 * @example
 * ```typescript
 * const formatted = formatValidationErrors(errors);
 * // Result: { email: ['Email must be valid', 'Email is required'], age: ['Age must be positive'] }
 * ```
 */
export declare const formatValidationErrors: (errors: ValidationError[]) => Record<string, string[]>;
/**
 * 43. Formats validation errors as flat array of messages.
 *
 * @param {ValidationError[]} errors - Validation errors
 * @returns {string[]} Array of error messages
 *
 * @example
 * ```typescript
 * const messages = formatValidationErrorsFlat(errors);
 * // Result: ['email: Email must be valid', 'age: Age must be positive']
 * ```
 */
export declare const formatValidationErrorsFlat: (errors: ValidationError[]) => string[];
/**
 * 44. Creates a detailed validation summary with statistics.
 *
 * @param {ValidationError[]} errors - Validation errors
 * @returns {Object} Validation summary with counts and details
 *
 * @example
 * ```typescript
 * const summary = createValidationSummary(errors);
 * // Result: { totalErrors: 5, fieldCount: 3, errors: {...}, messages: [...] }
 * ```
 */
export declare const createValidationSummary: (errors: ValidationError[]) => {
    totalErrors: number;
    fieldCount: number;
    errors: Record<string, string[]>;
    messages: string[];
};
/**
 * 45. Validates value is within allowed set (enum validation).
 *
 * @param {any} value - Value to validate
 * @param {any[]} allowedValues - Allowed values array
 * @returns {boolean} True if value is in allowed set
 *
 * @example
 * ```typescript
 * const isValid = validateEnum('active', ['active', 'inactive', 'pending']); // true
 * const isValid2 = validateEnum('deleted', ['active', 'inactive']); // false
 * ```
 */
export declare const validateEnum: (value: any, allowedValues: any[]) => boolean;
export {};
//# sourceMappingURL=typescript-validation-transformation-kit.d.ts.map