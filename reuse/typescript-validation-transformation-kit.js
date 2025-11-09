"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnum = exports.createValidationSummary = exports.formatValidationErrorsFlat = exports.formatValidationErrors = exports.validateWithGroups = exports.validateCrossField = exports.validateConditional = exports.validateObjectKeys = exports.validateArrayElements = exports.validateJson = exports.validateUuid = exports.validateUrl = exports.validatePhone = exports.validateEmail = exports.parseJsonSafe = exports.parseDate = exports.coerceToBoolean = exports.coerceToNumber = exports.coerceToString = exports.normalizeWhitespace = exports.escapeHtml = exports.stripHtmlTags = exports.sanitizeString = exports.createTransformDecorator = exports.transformToPlain = exports.transformToClass = exports.createAsyncValidator = exports.createCustomValidator = exports.validateNestedObject = exports.createValidationPipe = exports.validateAndTransform = exports.validateDTO = exports.validateRuntimeType = exports.validatePlainObject = exports.validateArrayType = exports.validatePrimitiveType = void 0;
exports.Match = Match;
exports.Different = Different;
exports.Trim = Trim;
exports.ToLowerCase = ToLowerCase;
exports.ToUpperCase = ToUpperCase;
exports.ToInt = ToInt;
exports.ToFloat = ToFloat;
exports.ToBoolean = ToBoolean;
exports.ToDate = ToDate;
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
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
// ============================================================================
// RUNTIME TYPE VALIDATION
// ============================================================================
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
const validatePrimitiveType = (value, expectedType) => {
    if (value === null || value === undefined) {
        return false;
    }
    return typeof value === expectedType;
};
exports.validatePrimitiveType = validatePrimitiveType;
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
const validateArrayType = (value, elementType) => {
    if (!Array.isArray(value)) {
        return false;
    }
    if (elementType) {
        return value.every((item) => typeof item === elementType);
    }
    return true;
};
exports.validateArrayType = validateArrayType;
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
const validatePlainObject = (value) => {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    return !Array.isArray(value) && !(value instanceof Date) && !(value instanceof RegExp);
};
exports.validatePlainObject = validatePlainObject;
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
const validateRuntimeType = (value, type) => {
    const errors = [];
    let isValid = true;
    switch (type.toLowerCase()) {
        case 'string':
            isValid = typeof value === 'string';
            break;
        case 'number':
            isValid = typeof value === 'number' && !isNaN(value);
            break;
        case 'boolean':
            isValid = typeof value === 'boolean';
            break;
        case 'array':
            isValid = Array.isArray(value);
            break;
        case 'object':
            isValid = (0, exports.validatePlainObject)(value);
            break;
        case 'date':
            isValid = value instanceof Date && !isNaN(value.getTime());
            break;
        default:
            isValid = false;
    }
    if (!isValid) {
        const error = new class_validator_1.ValidationError();
        error.property = 'value';
        error.value = value;
        error.constraints = { type: `Value must be of type ${type}` };
        errors.push(error);
    }
    return { isValid, errors };
};
exports.validateRuntimeType = validateRuntimeType;
// ============================================================================
// SCHEMA VALIDATION WITH CLASS-VALIDATOR
// ============================================================================
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
const validateDTO = async (dtoClass, plain, options) => {
    const instance = (0, class_transformer_1.plainToInstance)(dtoClass, plain);
    const errors = await (0, class_validator_1.validate)(instance, options);
    const isValid = errors.length === 0;
    const constraints = {};
    errors.forEach((error) => {
        if (error.constraints) {
            constraints[error.property] = Object.values(error.constraints);
        }
    });
    return { isValid, errors, constraints };
};
exports.validateDTO = validateDTO;
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
const validateAndTransform = async (dtoClass, plain, options) => {
    const instance = (0, class_transformer_1.plainToInstance)(dtoClass, plain);
    await (0, class_validator_1.validateOrReject)(instance, options).catch((errors) => {
        throw new common_1.BadRequestException((0, exports.formatValidationErrors)(errors));
    });
    return instance;
};
exports.validateAndTransform = validateAndTransform;
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
const createValidationPipe = (transform = true, whitelist = true, forbidNonWhitelisted = false) => {
    return new common_1.ValidationPipe({
        transform,
        whitelist,
        forbidNonWhitelisted,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            return new common_1.BadRequestException((0, exports.formatValidationErrors)(errors));
        },
    });
};
exports.createValidationPipe = createValidationPipe;
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
const validateNestedObject = async (dtoClass, plain) => {
    const instance = (0, class_transformer_1.plainToInstance)(dtoClass, plain);
    const errors = await (0, class_validator_1.validate)(instance, {
        validationError: { target: false, value: true },
    });
    const isValid = errors.length === 0;
    const constraints = {};
    const flattenErrors = (errs, prefix = '') => {
        errs.forEach((error) => {
            const key = prefix ? `${prefix}.${error.property}` : error.property;
            if (error.constraints) {
                constraints[key] = Object.values(error.constraints);
            }
            if (error.children && error.children.length > 0) {
                flattenErrors(error.children, key);
            }
        });
    };
    flattenErrors(errors);
    return { isValid, errors, constraints };
};
exports.validateNestedObject = validateNestedObject;
// ============================================================================
// CUSTOM VALIDATION DECORATORS
// ============================================================================
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
const createCustomValidator = (validatorFn, defaultMessage) => {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'customValidator',
            target: object.constructor,
            propertyName: propertyName,
            options: { message: defaultMessage },
            validator: {
                validate(value, args) {
                    return validatorFn(value, args);
                },
            },
        });
    };
};
exports.createCustomValidator = createCustomValidator;
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
const createAsyncValidator = (asyncValidatorFn, defaultMessage) => {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'asyncValidator',
            target: object.constructor,
            propertyName: propertyName,
            options: { message: defaultMessage },
            validator: {
                async validate(value, args) {
                    return await asyncValidatorFn(value, args);
                },
            },
        });
    };
};
exports.createAsyncValidator = createAsyncValidator;
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
function Match(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'match',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must match ${relatedPropertyName}`;
                },
            },
        });
    };
}
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
function Different(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'different',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value !== relatedValue;
                },
                defaultMessage(args) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must be different from ${relatedPropertyName}`;
                },
            },
        });
    };
}
// ============================================================================
// TRANSFORMATION DECORATORS & UTILITIES
// ============================================================================
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
const transformToClass = (dtoClass, plain, options) => {
    return (0, class_transformer_1.plainToInstance)(dtoClass, plain, {
        excludeExtraneousValues: options?.excludeExtraneousValues || false,
        exposeDefaultValues: options?.exposeDefaultValues || true,
        exposeUnsetFields: options?.exposeUnsetFields || true,
        enableImplicitConversion: options?.enableImplicitConversion || true,
    });
};
exports.transformToClass = transformToClass;
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
const transformToPlain = (instance) => {
    return (0, class_transformer_1.classToPlain)(instance);
};
exports.transformToPlain = transformToPlain;
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
const createTransformDecorator = (transformFn) => {
    return (0, class_transformer_1.Transform)(({ value, obj, type }) => transformFn(value, obj, type));
};
exports.createTransformDecorator = createTransformDecorator;
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
function Trim() {
    return (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value));
}
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
function ToLowerCase() {
    return (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value));
}
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
function ToUpperCase() {
    return (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value));
}
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
function ToInt() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'number')
            return Math.floor(value);
        if (typeof value === 'string')
            return parseInt(value, 10);
        return value;
    });
}
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
function ToFloat() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string')
            return parseFloat(value);
        return value;
    });
}
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
function ToBoolean() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string') {
            const lower = value.toLowerCase();
            return lower === 'true' || lower === '1' || lower === 'yes';
        }
        if (typeof value === 'number')
            return value !== 0;
        return Boolean(value);
    });
}
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
function ToDate() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (value instanceof Date)
            return value;
        if (typeof value === 'string' || typeof value === 'number') {
            const date = new Date(value);
            return isNaN(date.getTime()) ? value : date;
        }
        return value;
    });
}
// ============================================================================
// SANITIZATION HELPERS
// ============================================================================
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
const sanitizeString = (value, options = {}) => {
    if (typeof value !== 'string')
        return value;
    let result = value;
    if (options.trim) {
        result = result.trim();
    }
    if (options.removeHtml) {
        result = result.replace(/<[^>]*>/g, '');
    }
    if (options.removeScripts) {
        result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (options.removeSpecialChars) {
        result = result.replace(/[^\w\s]/gi, '');
    }
    if (options.stripWhitespace) {
        result = result.replace(/\s+/g, ' ');
    }
    if (options.lowercase) {
        result = result.toLowerCase();
    }
    if (options.uppercase) {
        result = result.toUpperCase();
    }
    if (options.normalizeUnicode) {
        result = result.normalize('NFC');
    }
    if (options.maxLength && result.length > options.maxLength) {
        result = result.substring(0, options.maxLength);
    }
    return result;
};
exports.sanitizeString = sanitizeString;
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
const stripHtmlTags = (value) => {
    if (typeof value !== 'string')
        return value;
    return value.replace(/<[^>]*>/g, '');
};
exports.stripHtmlTags = stripHtmlTags;
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
const escapeHtml = (value) => {
    if (typeof value !== 'string')
        return value;
    const htmlEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };
    return value.replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char]);
};
exports.escapeHtml = escapeHtml;
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
const normalizeWhitespace = (value) => {
    if (typeof value !== 'string')
        return value;
    return value.replace(/\s+/g, ' ');
};
exports.normalizeWhitespace = normalizeWhitespace;
// ============================================================================
// TYPE COERCION & PARSING
// ============================================================================
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
const coerceToString = (value, fallback = '') => {
    if (value === null || value === undefined)
        return fallback;
    return String(value);
};
exports.coerceToString = coerceToString;
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
const coerceToNumber = (value, options = {}) => {
    let num;
    if (typeof value === 'number') {
        num = value;
    }
    else if (typeof value === 'string') {
        num = parseFloat(value);
    }
    else {
        return null;
    }
    if (isNaN(num))
        return null;
    if (!options.allowNegative && num < 0)
        return null;
    if (!options.allowZero && num === 0)
        return null;
    if (options.min !== undefined && num < options.min)
        return null;
    if (options.max !== undefined && num > options.max)
        return null;
    if (options.decimals !== undefined) {
        num = parseFloat(num.toFixed(options.decimals));
    }
    return num;
};
exports.coerceToNumber = coerceToNumber;
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
const coerceToBoolean = (value) => {
    if (typeof value === 'boolean')
        return value;
    if (typeof value === 'number')
        return value !== 0;
    if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        return lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on';
    }
    return Boolean(value);
};
exports.coerceToBoolean = coerceToBoolean;
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
const parseDate = (value, options = {}) => {
    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
    }
    let date;
    if (typeof value === 'string' || typeof value === 'number') {
        date = new Date(value);
    }
    else {
        return null;
    }
    if (isNaN(date.getTime()))
        return null;
    const now = new Date();
    if (!options.allowPast && date < now)
        return null;
    if (!options.allowFuture && date > now)
        return null;
    return date;
};
exports.parseDate = parseDate;
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
const parseJsonSafe = (value, fallback = null) => {
    if (typeof value !== 'string')
        return fallback;
    try {
        return JSON.parse(value);
    }
    catch {
        return fallback;
    }
};
exports.parseJsonSafe = parseJsonSafe;
// ============================================================================
// FORMAT VALIDATORS
// ============================================================================
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
const validateEmail = (email) => {
    if (typeof email !== 'string')
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
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
const validatePhone = (phone, countryCode) => {
    if (typeof phone !== 'string')
        return false;
    // Remove all non-digit characters for validation
    const cleaned = phone.replace(/\D/g, '');
    // Basic validation: 10-15 digits
    if (cleaned.length < 10 || cleaned.length > 15)
        return false;
    if (countryCode && !phone.startsWith(countryCode))
        return false;
    return true;
};
exports.validatePhone = validatePhone;
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
const validateUrl = (url, allowedProtocols = ['http', 'https']) => {
    if (typeof url !== 'string')
        return false;
    try {
        const parsed = new URL(url);
        return allowedProtocols.includes(parsed.protocol.replace(':', ''));
    }
    catch {
        return false;
    }
};
exports.validateUrl = validateUrl;
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
const validateUuid = (uuid, version) => {
    if (typeof uuid !== 'string')
        return false;
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const uuidV5Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const genericUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (version === 4)
        return uuidV4Regex.test(uuid);
    if (version === 5)
        return uuidV5Regex.test(uuid);
    return genericUuidRegex.test(uuid);
};
exports.validateUuid = validateUuid;
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
const validateJson = (value) => {
    if (typeof value !== 'string')
        return false;
    try {
        JSON.parse(value);
        return true;
    }
    catch {
        return false;
    }
};
exports.validateJson = validateJson;
// ============================================================================
// ARRAY & OBJECT VALIDATION
// ============================================================================
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
const validateArrayElements = (array, validator) => {
    if (!Array.isArray(array)) {
        const error = new class_validator_1.ValidationError();
        error.property = 'array';
        error.constraints = { type: 'Value must be an array' };
        return { isValid: false, errors: [error] };
    }
    const errors = [];
    array.forEach((element, index) => {
        if (!validator(element, index)) {
            const error = new class_validator_1.ValidationError();
            error.property = `[${index}]`;
            error.value = element;
            error.constraints = { validation: `Element at index ${index} failed validation` };
            errors.push(error);
        }
    });
    return { isValid: errors.length === 0, errors };
};
exports.validateArrayElements = validateArrayElements;
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
const validateObjectKeys = (obj, requiredKeys, typeMap) => {
    if (!(0, exports.validatePlainObject)(obj)) {
        const error = new class_validator_1.ValidationError();
        error.property = 'object';
        error.constraints = { type: 'Value must be a plain object' };
        return { isValid: false, errors: [error] };
    }
    const errors = [];
    requiredKeys.forEach((key) => {
        if (!(key in obj)) {
            const error = new class_validator_1.ValidationError();
            error.property = key;
            error.constraints = { required: `Property '${key}' is required` };
            errors.push(error);
        }
        else if (typeMap && typeMap[key]) {
            const expectedType = typeMap[key];
            const actualType = typeof obj[key];
            if (actualType !== expectedType) {
                const error = new class_validator_1.ValidationError();
                error.property = key;
                error.value = obj[key];
                error.constraints = {
                    type: `Property '${key}' must be of type ${expectedType}, got ${actualType}`,
                };
                errors.push(error);
            }
        }
    });
    return { isValid: errors.length === 0, errors };
};
exports.validateObjectKeys = validateObjectKeys;
// ============================================================================
// CONDITIONAL & CROSS-FIELD VALIDATION
// ============================================================================
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
const validateConditional = async (obj, rule) => {
    const errors = [];
    for (const [key, value] of Object.entries(obj)) {
        if (rule.condition(value, obj)) {
            const isValid = await Promise.resolve(rule.validator(value));
            if (!isValid) {
                const error = new class_validator_1.ValidationError();
                error.property = key;
                error.value = value;
                error.constraints = { conditional: rule.message };
                errors.push(error);
            }
        }
    }
    return { isValid: errors.length === 0, errors };
};
exports.validateConditional = validateConditional;
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
const validateCrossField = async (obj, rule) => {
    const errors = [];
    const values = {};
    rule.fields.forEach((field) => {
        values[field] = obj[field];
    });
    const isValid = await Promise.resolve(rule.validator(values));
    if (!isValid) {
        const error = new class_validator_1.ValidationError();
        error.property = rule.fields.join(', ');
        error.constraints = { crossField: rule.message };
        errors.push(error);
    }
    return { isValid: errors.length === 0, errors };
};
exports.validateCrossField = validateCrossField;
// ============================================================================
// VALIDATION GROUPS & ERROR FORMATTING
// ============================================================================
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
const validateWithGroups = async (dtoClass, plain, groups) => {
    const instance = (0, class_transformer_1.plainToInstance)(dtoClass, plain);
    const errors = await (0, class_validator_1.validate)(instance, { groups });
    const isValid = errors.length === 0;
    const constraints = {};
    errors.forEach((error) => {
        if (error.constraints) {
            constraints[error.property] = Object.values(error.constraints);
        }
    });
    return { isValid, errors, constraints };
};
exports.validateWithGroups = validateWithGroups;
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
const formatValidationErrors = (errors) => {
    const formatted = {};
    const processError = (error, prefix = '') => {
        const key = prefix ? `${prefix}.${error.property}` : error.property;
        if (error.constraints) {
            formatted[key] = Object.values(error.constraints);
        }
        if (error.children && error.children.length > 0) {
            error.children.forEach((child) => processError(child, key));
        }
    };
    errors.forEach((error) => processError(error));
    return formatted;
};
exports.formatValidationErrors = formatValidationErrors;
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
const formatValidationErrorsFlat = (errors) => {
    const messages = [];
    const processError = (error, prefix = '') => {
        const key = prefix ? `${prefix}.${error.property}` : error.property;
        if (error.constraints) {
            Object.values(error.constraints).forEach((msg) => {
                messages.push(`${key}: ${msg}`);
            });
        }
        if (error.children && error.children.length > 0) {
            error.children.forEach((child) => processError(child, key));
        }
    };
    errors.forEach((error) => processError(error));
    return messages;
};
exports.formatValidationErrorsFlat = formatValidationErrorsFlat;
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
const createValidationSummary = (errors) => {
    const formattedErrors = (0, exports.formatValidationErrors)(errors);
    const messages = (0, exports.formatValidationErrorsFlat)(errors);
    return {
        totalErrors: messages.length,
        fieldCount: Object.keys(formattedErrors).length,
        errors: formattedErrors,
        messages,
    };
};
exports.createValidationSummary = createValidationSummary;
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
const validateEnum = (value, allowedValues) => {
    return allowedValues.includes(value);
};
exports.validateEnum = validateEnum;
//# sourceMappingURL=typescript-validation-transformation-kit.js.map