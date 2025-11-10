"use strict";
/**
 * LOC: VAL1234567
 * File: /reuse/typescript-validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *   - @nestjs/common (v11.1.8)
 *
 * DOWNSTREAM (imported by):
 *   - DTO classes
 *   - Validation pipes
 *   - Input sanitization middleware
 *   - Form validation services
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizationPipe = exports.ValidationPipeWithDetails = void 0;
exports.createTypeValidator = createTypeValidator;
exports.assertType = assertType;
exports.validateType = validateType;
exports.schemaBuilder = schemaBuilder;
exports.IsUniqueArray = IsUniqueArray;
exports.IsJsonString = IsJsonString;
exports.IsPositive = IsPositive;
exports.IsNegative = IsNegative;
exports.IsAlphanumeric = IsAlphanumeric;
exports.IsEnumValue = IsEnumValue;
exports.ToTitleCase = ToTitleCase;
exports.ToSlug = ToSlug;
exports.SplitString = SplitString;
exports.ParseNumber = ParseNumber;
exports.ParseDate = ParseDate;
exports.StripHtml = StripHtml;
exports.Sanitize = Sanitize;
exports.createAsyncValidator = createAsyncValidator;
exports.IsGreaterThan = IsGreaterThan;
exports.IsLessThan = IsLessThan;
exports.ValidateIf = ValidateIf;
exports.aggregateValidationErrors = aggregateValidationErrors;
exports.flattenValidationErrors = flattenValidationErrors;
exports.validateDto = validateDto;
exports.validateDtoWithResult = validateDtoWithResult;
exports.transformAndValidate = transformAndValidate;
/**
 * File: /reuse/typescript-validation-kit.ts
 * Locator: WC-UTL-TVAL-002
 * Purpose: TypeScript Runtime Validation Utilities - Advanced validation patterns
 *
 * Upstream: class-validator, class-transformer, @nestjs/common
 * Downstream: ../backend/*, DTOs, validation pipes, sanitization middleware
 * Dependencies: TypeScript 5.x, Node 18+, class-validator, class-transformer
 * Exports: 45 validation utilities for runtime checks, schema validation, transformations
 *
 * LLM Context: Production-grade TypeScript runtime validation for White Cross healthcare system.
 * Provides type-safe validation patterns, runtime type checking, schema builders, custom validators,
 * class-based validation, transformation pipelines, sanitization, DTO validation decorators,
 * async validation, cross-field validation, conditional validation, and error aggregation.
 * Integrates with NestJS validation pipes and class-validator for enterprise-grade validation.
 */
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
// ============================================================================
// RUNTIME TYPE VALIDATION
// ============================================================================
/**
 * Runtime type validator builder.
 *
 * @template T - Expected type
 * @returns {TypeValidator<T>} Type validator
 *
 * @example
 * ```typescript
 * const validator = createTypeValidator<User>()
 *   .string('email')
 *   .number('age')
 *   .boolean('isActive')
 *   .build();
 *
 * const result = validator.validate(data);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
function createTypeValidator() {
    const rules = new Map();
    const addRule = (key, rule) => {
        if (!rules.has(key)) {
            rules.set(key, []);
        }
        rules.get(key).push(rule);
    };
    const builder = {
        string(key, options) {
            addRule(key, {
                validate: (value) => typeof value === 'string',
                message: `${String(key)} must be a string`,
            });
            if (options?.min !== undefined) {
                addRule(key, {
                    validate: (value) => typeof value === 'string' && value.length >= options.min,
                    message: `${String(key)} must be at least ${options.min} characters`,
                });
            }
            if (options?.max !== undefined) {
                addRule(key, {
                    validate: (value) => typeof value === 'string' && value.length <= options.max,
                    message: `${String(key)} must be at most ${options.max} characters`,
                });
            }
            if (options?.pattern) {
                addRule(key, {
                    validate: (value) => typeof value === 'string' && options.pattern.test(value),
                    message: `${String(key)} does not match required pattern`,
                });
            }
            return builder;
        },
        number(key, options) {
            addRule(key, {
                validate: (value) => typeof value === 'number' && !isNaN(value),
                message: `${String(key)} must be a number`,
            });
            if (options?.min !== undefined) {
                addRule(key, {
                    validate: (value) => typeof value === 'number' && value >= options.min,
                    message: `${String(key)} must be at least ${options.min}`,
                });
            }
            if (options?.max !== undefined) {
                addRule(key, {
                    validate: (value) => typeof value === 'number' && value <= options.max,
                    message: `${String(key)} must be at most ${options.max}`,
                });
            }
            return builder;
        },
        boolean(key) {
            addRule(key, {
                validate: (value) => typeof value === 'boolean',
                message: `${String(key)} must be a boolean`,
            });
            return builder;
        },
        date(key, options) {
            addRule(key, {
                validate: (value) => value instanceof Date && !isNaN(value.getTime()),
                message: `${String(key)} must be a valid date`,
            });
            if (options?.min) {
                addRule(key, {
                    validate: (value) => value instanceof Date && value >= options.min,
                    message: `${String(key)} must be after ${options.min.toISOString()}`,
                });
            }
            if (options?.max) {
                addRule(key, {
                    validate: (value) => value instanceof Date && value <= options.max,
                    message: `${String(key)} must be before ${options.max.toISOString()}`,
                });
            }
            return builder;
        },
        array(key, itemValidator) {
            addRule(key, {
                validate: (value) => Array.isArray(value),
                message: `${String(key)} must be an array`,
            });
            return builder;
        },
        object(key, schema) {
            addRule(key, {
                validate: (value) => typeof value === 'object' && value !== null && !Array.isArray(value),
                message: `${String(key)} must be an object`,
            });
            return builder;
        },
        optional(key) {
            return builder;
        },
        build() {
            return (value) => {
                const errors = [];
                for (const [key, keyRules] of rules.entries()) {
                    const fieldValue = value[key];
                    for (const rule of keyRules) {
                        if (!rule.validate(fieldValue)) {
                            const message = typeof rule.message === 'function'
                                ? rule.message(fieldValue)
                                : rule.message;
                            errors.push(message);
                        }
                    }
                }
                return {
                    isValid: errors.length === 0,
                    value,
                    errors: errors.length > 0 ? errors : undefined,
                };
            };
        },
    };
    return builder;
}
/**
 * Guards value to be of specific type at runtime.
 *
 * @template T - Expected type
 * @param {any} value - Value to guard
 * @param {(value: any) => value is T} guard - Type guard function
 * @param {string} message - Error message
 * @returns {T} Guarded value
 *
 * @example
 * ```typescript
 * function isUser(value: any): value is User {
 *   return value && typeof value.id === 'string';
 * }
 *
 * const user = assertType(data, isUser, 'Invalid user data');
 * // user is now typed as User
 * ```
 */
function assertType(value, guard, message = 'Type assertion failed') {
    if (!guard(value)) {
        throw new TypeError(message);
    }
    return value;
}
/**
 * Validates that value matches expected type structure.
 *
 * @template T - Expected type
 * @param {any} value - Value to validate
 * @param {SchemaDefinition<T>} schema - Schema definition
 * @returns {ValidationResult<T>} Validation result
 *
 * @example
 * ```typescript
 * const schema: SchemaDefinition<User> = {
 *   type: 'object',
 *   required: true,
 *   nested: {
 *     id: { type: 'string', required: true },
 *     email: { type: 'string', required: true }
 *   }
 * };
 *
 * const result = validateType(data, schema);
 * ```
 */
function validateType(value, schema) {
    const errors = [];
    // Check required
    if (schema.required && (value === null || value === undefined)) {
        errors.push('Value is required');
        return { isValid: false, errors };
    }
    // Allow nullable
    if (schema.nullable && value === null) {
        return { isValid: true, value: null };
    }
    // Type validation
    if (schema.type) {
        const typeValid = validatePrimitiveType(value, schema.type);
        if (!typeValid) {
            errors.push(`Value must be of type ${schema.type}`);
        }
    }
    // Custom rules
    if (schema.rules) {
        for (const rule of schema.rules) {
            if (!rule.validate(value)) {
                const message = typeof rule.message === 'function' ? rule.message(value) : rule.message;
                errors.push(message);
            }
        }
    }
    // Transform
    let finalValue = value;
    if (schema.transform && errors.length === 0) {
        try {
            finalValue = schema.transform(value);
        }
        catch (error) {
            errors.push(`Transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    return {
        isValid: errors.length === 0,
        value: finalValue,
        errors: errors.length > 0 ? errors : undefined,
    };
}
/**
 * Validates primitive type.
 *
 * @param {any} value - Value to validate
 * @param {string} type - Expected type
 * @returns {boolean} True if type matches
 */
function validatePrimitiveType(value, type) {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'object':
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        case 'array':
            return Array.isArray(value);
        case 'date':
            return value instanceof Date && !isNaN(value.getTime());
        default:
            return false;
    }
}
// ============================================================================
// SCHEMA VALIDATION
// ============================================================================
/**
 * Schema builder for fluent schema definition.
 *
 * @template T - Schema type
 * @returns {SchemaBuilder<T>} Schema builder
 *
 * @example
 * ```typescript
 * const userSchema = schemaBuilder<User>()
 *   .field('id', (f) => f.string().required())
 *   .field('email', (f) => f.string().email().required())
 *   .field('age', (f) => f.number().min(0).max(120))
 *   .build();
 *
 * const result = userSchema.validate(userData);
 * ```
 */
function schemaBuilder() {
    const fields = new Map();
    return {
        field(key, configure) {
            const fieldBuilder = new FieldBuilder();
            const configured = configure(fieldBuilder);
            fields.set(key, configured.getSchema());
            return this;
        },
        build() {
            return {
                validate(value) {
                    const errors = [];
                    for (const [key, schema] of fields.entries()) {
                        const fieldValue = value[key];
                        const result = validateType(fieldValue, schema);
                        if (!result.isValid) {
                            errors.push(...(result.errors || []).map((e) => `${String(key)}: ${e}`));
                        }
                    }
                    return {
                        isValid: errors.length === 0,
                        value,
                        errors: errors.length > 0 ? errors : undefined,
                    };
                },
            };
        },
    };
}
/**
 * Field builder for schema field configuration.
 */
class FieldBuilder {
    constructor() {
        this.schema = {};
    }
    string() {
        this.schema.type = 'string';
        return this;
    }
    number() {
        this.schema.type = 'number';
        return this;
    }
    boolean() {
        this.schema.type = 'boolean';
        return this;
    }
    date() {
        this.schema.type = 'date';
        return this;
    }
    array() {
        this.schema.type = 'array';
        return this;
    }
    object() {
        this.schema.type = 'object';
        return this;
    }
    required() {
        this.schema.required = true;
        return this;
    }
    nullable() {
        this.schema.nullable = true;
        return this;
    }
    default(value) {
        this.schema.default = value;
        return this;
    }
    min(value) {
        if (!this.schema.rules)
            this.schema.rules = [];
        this.schema.rules.push({
            validate: (v) => {
                if (typeof v === 'number')
                    return v >= value;
                if (typeof v === 'string')
                    return v.length >= value;
                return false;
            },
            message: `Must be at least ${value}`,
        });
        return this;
    }
    max(value) {
        if (!this.schema.rules)
            this.schema.rules = [];
        this.schema.rules.push({
            validate: (v) => {
                if (typeof v === 'number')
                    return v <= value;
                if (typeof v === 'string')
                    return v.length <= value;
                return false;
            },
            message: `Must be at most ${value}`,
        });
        return this;
    }
    email() {
        if (!this.schema.rules)
            this.schema.rules = [];
        this.schema.rules.push({
            validate: (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Must be a valid email address',
        });
        return this;
    }
    pattern(regex) {
        if (!this.schema.rules)
            this.schema.rules = [];
        this.schema.rules.push({
            validate: (v) => typeof v === 'string' && regex.test(v),
            message: 'Does not match required pattern',
        });
        return this;
    }
    custom(validator) {
        if (!this.schema.rules)
            this.schema.rules = [];
        this.schema.rules.push(validator);
        return this;
    }
    transform(fn) {
        this.schema.transform = fn;
        return this;
    }
    getSchema() {
        return this.schema;
    }
}
// ============================================================================
// CLASS-BASED VALIDATION DECORATORS
// ============================================================================
/**
 * Validates that array contains only unique values.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class CreatePlaylistDto {
 *   @IsUniqueArray({ message: 'Song IDs must be unique' })
 *   songIds: string[];
 * }
 * ```
 */
function IsUniqueArray(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isUniqueArray',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (!Array.isArray(value))
                        return false;
                    const uniqueSet = new Set(value);
                    return uniqueSet.size === value.length;
                },
                defaultMessage() {
                    return `${propertyName} must contain only unique values`;
                },
            },
        });
    };
}
/**
 * Validates that string is a valid JSON.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ConfigDto {
 *   @IsJsonString()
 *   metadata: string; // Must be valid JSON string
 * }
 * ```
 */
function IsJsonString(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isJsonString',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    try {
                        JSON.parse(value);
                        return true;
                    }
                    catch {
                        return false;
                    }
                },
                defaultMessage() {
                    return `${propertyName} must be a valid JSON string`;
                },
            },
        });
    };
}
/**
 * Validates that number is positive.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ProductDto {
 *   @IsPositive()
 *   price: number; // Must be > 0
 * }
 * ```
 */
function IsPositive(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isPositive',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    return typeof value === 'number' && value > 0;
                },
                defaultMessage() {
                    return `${propertyName} must be a positive number`;
                },
            },
        });
    };
}
/**
 * Validates that number is negative.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class TransactionDto {
 *   @IsNegative()
 *   deduction: number; // Must be < 0
 * }
 * ```
 */
function IsNegative(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isNegative',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    return typeof value === 'number' && value < 0;
                },
                defaultMessage() {
                    return `${propertyName} must be a negative number`;
                },
            },
        });
    };
}
/**
 * Validates that string contains only alphanumeric characters.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UsernameDto {
 *   @IsAlphanumeric()
 *   username: string; // Only letters and numbers
 * }
 * ```
 */
function IsAlphanumeric(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isAlphanumeric',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    return typeof value === 'string' && /^[a-zA-Z0-9]+$/.test(value);
                },
                defaultMessage() {
                    return `${propertyName} must contain only letters and numbers`;
                },
            },
        });
    };
}
/**
 * Validates that value is within specified enum.
 *
 * @template T - Enum type
 * @param {T} enumType - Enum object
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * enum UserRole {
 *   ADMIN = 'admin',
 *   USER = 'user'
 * }
 *
 * class CreateUserDto {
 *   @IsEnumValue(UserRole)
 *   role: UserRole;
 * }
 * ```
 */
function IsEnumValue(enumType, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isEnumValue',
            target: object.constructor,
            propertyName,
            constraints: [enumType],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [enumObject] = args.constraints;
                    return Object.values(enumObject).includes(value);
                },
                defaultMessage(args) {
                    const [enumObject] = args.constraints;
                    return `${propertyName} must be one of: ${Object.values(enumObject).join(', ')}`;
                },
            },
        });
    };
}
// ============================================================================
// TRANSFORMATION DECORATORS
// ============================================================================
/**
 * Transforms string to title case.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @ToTitleCase()
 *   name: string; // 'john doe' => 'John Doe'
 * }
 * ```
 */
function ToTitleCase() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        return value
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });
}
/**
 * Transforms value to slug format.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PostDto {
 *   @ToSlug()
 *   title: string; // 'Hello World!' => 'hello-world'
 * }
 * ```
 */
function ToSlug() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        return value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    });
}
/**
 * Transforms string array from comma-separated string.
 *
 * @param {string} separator - Separator character (default: ',')
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class FilterDto {
 *   @SplitString(',')
 *   tags: string[]; // 'tag1,tag2,tag3' => ['tag1', 'tag2', 'tag3']
 * }
 * ```
 */
function SplitString(separator = ',') {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (Array.isArray(value))
            return value;
        if (typeof value !== 'string')
            return value;
        return value.split(separator).map((v) => v.trim()).filter((v) => v);
    });
}
/**
 * Transforms numeric string to number.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class QueryDto {
 *   @ParseNumber()
 *   page: number; // '5' => 5
 * }
 * ```
 */
function ParseNumber() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string') {
            const parsed = Number(value);
            return isNaN(parsed) ? value : parsed;
        }
        return value;
    });
}
/**
 * Transforms value to Date object.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class EventDto {
 *   @ParseDate()
 *   startDate: Date; // '2024-01-01' => Date object
 * }
 * ```
 */
function ParseDate() {
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
/**
 * Strips HTML tags from string.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class CommentDto {
 *   @StripHtml()
 *   content: string; // '<p>Hello</p>' => 'Hello'
 * }
 * ```
 */
function StripHtml() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        return value.replace(/<[^>]*>/g, '');
    });
}
/**
 * Sanitizes string by removing special characters.
 *
 * @param {string} allowedChars - Regex pattern of allowed characters
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class SearchDto {
 *   @Sanitize('[^a-zA-Z0-9\\s]')
 *   query: string; // Removes all special chars except letters, numbers, spaces
 * }
 * ```
 */
function Sanitize(allowedChars = '[^a-zA-Z0-9\\s]') {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        const regex = new RegExp(allowedChars, 'g');
        return value.replace(regex, '');
    });
}
// ============================================================================
// ASYNC VALIDATION
// ============================================================================
/**
 * Async validator constraint for database uniqueness checks.
 *
 * @example
 * ```typescript
 * @ValidatorConstraint({ async: true })
 * class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
 *   async validate(email: string) {
 *     const user = await userRepository.findByEmail(email);
 *     return !user;
 *   }
 *
 *   defaultMessage() {
 *     return 'Email already exists';
 *   }
 * }
 *
 * function IsEmailUnique(validationOptions?: ValidationOptions) {
 *   return function (object: Object, propertyName: string) {
 *     registerDecorator({
 *       target: object.constructor,
 *       propertyName,
 *       options: validationOptions,
 *       constraints: [],
 *       validator: IsEmailUniqueConstraint,
 *     });
 *   };
 * }
 * ```
 */
function createAsyncValidator(name, validator, message) {
    let AsyncValidatorConstraint = (() => {
        let _classDecorators = [(0, class_validator_1.ValidatorConstraint)({ async: true })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var AsyncValidatorConstraint = _classThis = class {
            async validate(value) {
                return await validator(value);
            }
            defaultMessage(args) {
                return typeof message === 'function' ? message(args.value) : message;
            }
        };
        __setFunctionName(_classThis, "AsyncValidatorConstraint");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AsyncValidatorConstraint = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return AsyncValidatorConstraint = _classThis;
    })();
    return (validationOptions) => {
        return function (object, propertyName) {
            (0, class_validator_1.registerDecorator)({
                name,
                target: object.constructor,
                propertyName,
                options: validationOptions,
                constraints: [],
                validator: AsyncValidatorConstraint,
            });
        };
    };
}
// ============================================================================
// VALIDATION PIPES
// ============================================================================
/**
 * Validation pipe with detailed error messages.
 *
 * @example
 * ```typescript
 * @Controller('users')
 * class UsersController {
 *   @Post()
 *   async create(@Body(new ValidationPipeWithDetails()) dto: CreateUserDto) {
 *     return this.usersService.create(dto);
 *   }
 * }
 * ```
 */
let ValidationPipeWithDetails = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ValidationPipeWithDetails = _classThis = class {
        async transform(value, metadata) {
            if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
                return value;
            }
            const object = (0, class_transformer_1.plainToClass)(metadata.metatype, value);
            const errors = await (0, class_validator_1.validate)(object, {
                whitelist: true,
                forbidNonWhitelisted: true,
                skipMissingProperties: false,
            });
            if (errors.length > 0) {
                const formattedErrors = this.formatErrors(errors);
                throw new common_1.BadRequestException({
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
            }
            return object;
        }
        toValidate(metatype) {
            const types = [String, Boolean, Number, Array, Object];
            return !types.includes(metatype);
        }
        formatErrors(errors) {
            const formatted = {};
            errors.forEach((error) => {
                if (error.constraints) {
                    formatted[error.property] = Object.values(error.constraints);
                }
                if (error.children && error.children.length > 0) {
                    const childErrors = this.formatErrors(error.children);
                    Object.keys(childErrors).forEach((key) => {
                        formatted[`${error.property}.${key}`] = childErrors[key];
                    });
                }
            });
            return formatted;
        }
    };
    __setFunctionName(_classThis, "ValidationPipeWithDetails");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ValidationPipeWithDetails = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ValidationPipeWithDetails = _classThis;
})();
exports.ValidationPipeWithDetails = ValidationPipeWithDetails;
/**
 * Sanitization pipe that strips unwanted properties.
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body(new SanitizationPipe()) dto: CreateUserDto) {
 *   // Only whitelisted properties will be present
 * }
 * ```
 */
let SanitizationPipe = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SanitizationPipe = _classThis = class {
        transform(value, metadata) {
            if (!metadata.metatype || !this.toTransform(metadata.metatype)) {
                return value;
            }
            // Convert to class instance and back to remove extra properties
            const object = (0, class_transformer_1.plainToClass)(metadata.metatype, value, {
                excludeExtraneousValues: true,
            });
            return (0, class_transformer_1.classToPlain)(object);
        }
        toTransform(metatype) {
            const types = [String, Boolean, Number, Array, Object];
            return !types.includes(metatype);
        }
    };
    __setFunctionName(_classThis, "SanitizationPipe");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SanitizationPipe = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SanitizationPipe = _classThis;
})();
exports.SanitizationPipe = SanitizationPipe;
// ============================================================================
// CROSS-FIELD VALIDATION
// ============================================================================
/**
 * Validates that one field is greater than another.
 *
 * @param {string} property - Property to compare against
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class DateRangeDto {
 *   @IsDate()
 *   startDate: Date;
 *
 *   @IsGreaterThan('startDate')
 *   endDate: Date;
 * }
 * ```
 */
function IsGreaterThan(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isGreaterThan',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value > relatedValue;
                },
                defaultMessage(args) {
                    const [relatedPropertyName] = args.constraints;
                    return `${propertyName} must be greater than ${relatedPropertyName}`;
                },
            },
        });
    };
}
/**
 * Validates that one field is less than another.
 *
 * @param {string} property - Property to compare against
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PriceRangeDto {
 *   @IsLessThan('maxPrice')
 *   minPrice: number;
 *
 *   @IsNumber()
 *   maxPrice: number;
 * }
 * ```
 */
function IsLessThan(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isLessThan',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value < relatedValue;
                },
                defaultMessage(args) {
                    const [relatedPropertyName] = args.constraints;
                    return `${propertyName} must be less than ${relatedPropertyName}`;
                },
            },
        });
    };
}
/**
 * Validates field conditionally based on another field's value.
 *
 * @param {string} property - Property to check
 * @param {any} expectedValue - Expected value for condition
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ShippingDto {
 *   @IsBoolean()
 *   hasShipping: boolean;
 *
 *   @ValidateIf('hasShipping', true)
 *   @IsString()
 *   shippingAddress?: string;
 * }
 * ```
 */
function ValidateIf(property, expectedValue, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'validateIf',
            target: object.constructor,
            propertyName,
            constraints: [property, expectedValue],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName, expectedVal] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    // If condition not met, validation passes
                    if (relatedValue !== expectedVal) {
                        return true;
                    }
                    // Otherwise, value must be present
                    return value !== null && value !== undefined;
                },
                defaultMessage(args) {
                    const [relatedPropertyName, expectedVal] = args.constraints;
                    return `${propertyName} is required when ${relatedPropertyName} is ${expectedVal}`;
                },
            },
        });
    };
}
// ============================================================================
// ERROR AGGREGATION
// ============================================================================
/**
 * Aggregates validation errors into a structured format.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {Record<string, any>} Aggregated errors
 *
 * @example
 * ```typescript
 * const errors = await validate(dto);
 * const aggregated = aggregateValidationErrors(errors);
 * // {
 * //   email: ['Email is required', 'Email must be valid'],
 * //   password: ['Password is too short']
 * // }
 * ```
 */
function aggregateValidationErrors(errors) {
    const aggregated = {};
    function processError(error, prefix = '') {
        const path = prefix ? `${prefix}.${error.property}` : error.property;
        if (error.constraints) {
            aggregated[path] = Object.values(error.constraints);
        }
        if (error.children && error.children.length > 0) {
            error.children.forEach((child) => processError(child, path));
        }
    }
    errors.forEach((error) => processError(error));
    return aggregated;
}
/**
 * Formats validation errors as flat array of messages.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {string[]} Array of error messages
 *
 * @example
 * ```typescript
 * const errors = await validate(dto);
 * const messages = flattenValidationErrors(errors);
 * // ['Email is required', 'Password is too short']
 * ```
 */
function flattenValidationErrors(errors) {
    const messages = [];
    function processError(error) {
        if (error.constraints) {
            messages.push(...Object.values(error.constraints));
        }
        if (error.children && error.children.length > 0) {
            error.children.forEach((child) => processError(child));
        }
    }
    errors.forEach((error) => processError(error));
    return messages;
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Validates DTO and throws on error.
 *
 * @template T - DTO type
 * @param {T} dto - DTO instance to validate
 * @returns {Promise<void>} Resolves if valid, rejects if invalid
 *
 * @example
 * ```typescript
 * const dto = new CreateUserDto();
 * await validateDto(dto); // Throws if invalid
 * ```
 */
async function validateDto(dto) {
    await (0, class_validator_1.validateOrReject)(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
    });
}
/**
 * Validates DTO and returns validation result.
 *
 * @template T - DTO type
 * @param {T} dto - DTO instance to validate
 * @returns {Promise<ValidationResult<T>>} Validation result
 *
 * @example
 * ```typescript
 * const dto = new CreateUserDto();
 * const result = await validateDtoWithResult(dto);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
async function validateDtoWithResult(dto) {
    const errors = await (0, class_validator_1.validate)(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
        return {
            isValid: false,
            errors: flattenValidationErrors(errors),
        };
    }
    return {
        isValid: true,
        value: dto,
    };
}
/**
 * Transforms and validates plain object to DTO.
 *
 * @template T - DTO type
 * @param {Constructor<T>} dtoClass - DTO class
 * @param {any} plain - Plain object
 * @returns {Promise<T>} Validated DTO instance
 *
 * @example
 * ```typescript
 * const dto = await transformAndValidate(CreateUserDto, requestBody);
 * // dto is now a validated CreateUserDto instance
 * ```
 */
async function transformAndValidate(dtoClass, plain) {
    const dto = (0, class_transformer_1.plainToClass)(dtoClass, plain, {
        excludeExtraneousValues: false,
    });
    await (0, class_validator_1.validateOrReject)(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
    });
    return dto;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Runtime Type Validation
    createTypeValidator,
    assertType,
    validateType,
    // Schema Validation
    schemaBuilder,
    // Class-Based Validation Decorators
    IsUniqueArray,
    IsJsonString,
    IsPositive,
    IsNegative,
    IsAlphanumeric,
    IsEnumValue,
    // Transformation Decorators
    ToTitleCase,
    ToSlug,
    SplitString,
    ParseNumber,
    ParseDate,
    StripHtml,
    Sanitize,
    // Async Validation
    createAsyncValidator,
    // Validation Pipes
    ValidationPipeWithDetails,
    SanitizationPipe,
    // Cross-Field Validation
    IsGreaterThan,
    IsLessThan,
    ValidateIf,
    // Error Aggregation
    aggregateValidationErrors,
    flattenValidationErrors,
    // Utility Functions
    validateDto,
    validateDtoWithResult,
    transformAndValidate,
};
//# sourceMappingURL=typescript-validation-kit.js.map