"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPropertyOptional = exports.ApiProperty = exports.Transform = exports.Type = exports.Expose = exports.ValidatorConstraintInterface = exports.ValidatorConstraint = exports.ValidationArguments = exports.ValidationOptions = exports.ValidationError = exports.IsCreditCard = exports.IsDate = exports.IsUUID = exports.IsEmail = exports.CommonSchemas = exports.SanitizationPipe = exports.EnhancedValidationPipe = exports.ZodValidationPipe = void 0;
exports.createMRNSchema = createMRNSchema;
exports.createICD10Schema = createICD10Schema;
exports.createNPISchema = createNPISchema;
exports.createSSNSchema = createSSNSchema;
exports.createEmailSchema = createEmailSchema;
exports.createPhoneSchema = createPhoneSchema;
exports.createPasswordSchema = createPasswordSchema;
exports.createDateSchema = createDateSchema;
exports.createFileSchema = createFileSchema;
exports.createArraySchema = createArraySchema;
exports.createConditionalSchema = createConditionalSchema;
exports.createNestedSchema = createNestedSchema;
exports.validateWithZod = validateWithZod;
exports.createPaginationSchema = createPaginationSchema;
exports.IsMRN = IsMRN;
exports.IsICD10 = IsICD10;
exports.IsNPI = IsNPI;
exports.IsSSN = IsSSN;
exports.IsInRange = IsInRange;
exports.Match = Match;
exports.IsPastDate = IsPastDate;
exports.IsFutureDate = IsFutureDate;
exports.sanitizeXSS = sanitizeXSS;
exports.sanitizeSQLInput = sanitizeSQLInput;
exports.sanitizeHTML = sanitizeHTML;
exports.sanitizeFileName = sanitizeFileName;
exports.sanitizeEmail = sanitizeEmail;
exports.sanitizePhoneNumber = sanitizePhoneNumber;
exports.sanitizeURL = sanitizeURL;
exports.transformToDTO = transformToDTO;
exports.transformToPlain = transformToPlain;
exports.coerceBoolean = coerceBoolean;
exports.coerceNumber = coerceNumber;
exports.coerceDate = coerceDate;
exports.coerceArray = coerceArray;
exports.convertCase = convertCase;
exports.createAsyncUniqueValidator = createAsyncUniqueValidator;
exports.createAsyncValidator = createAsyncValidator;
exports.formatValidationErrors = formatValidationErrors;
exports.validateObject = validateObject;
exports.validatePartialObject = validatePartialObject;
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
const zod_1 = require("zod");
const class_validator_1 = require("class-validator");
Object.defineProperty(exports, "ValidationOptions", { enumerable: true, get: function () { return class_validator_1.ValidationOptions; } });
Object.defineProperty(exports, "ValidationArguments", { enumerable: true, get: function () { return class_validator_1.ValidationArguments; } });
Object.defineProperty(exports, "ValidatorConstraint", { enumerable: true, get: function () { return class_validator_1.ValidatorConstraint; } });
Object.defineProperty(exports, "ValidatorConstraintInterface", { enumerable: true, get: function () { return class_validator_1.ValidatorConstraintInterface; } });
Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function () { return class_validator_1.ValidationError; } });
const class_transformer_1 = require("class-transformer");
Object.defineProperty(exports, "Transform", { enumerable: true, get: function () { return class_transformer_1.Transform; } });
Object.defineProperty(exports, "Type", { enumerable: true, get: function () { return class_transformer_1.Type; } });
Object.defineProperty(exports, "Expose", { enumerable: true, get: function () { return class_transformer_1.Expose; } });
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
Object.defineProperty(exports, "ApiProperty", { enumerable: true, get: function () { return swagger_1.ApiProperty; } });
Object.defineProperty(exports, "ApiPropertyOptional", { enumerable: true, get: function () { return swagger_1.ApiPropertyOptional; } });
const validator = __importStar(require("validator"));
// ============================================================================
// ZOD SCHEMA BUILDERS AND VALIDATORS
// ============================================================================
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
function createMRNSchema(options) {
    let schema = zod_1.z
        .string({
        required_error: options?.message || 'Medical Record Number is required',
        invalid_type_error: 'Medical Record Number must be a string',
    })
        .regex(/^[A-Z]{3}\d{6,10}$/, {
        message: options?.message ||
            'Medical Record Number must be 3 uppercase letters followed by 6-10 digits',
    });
    if (options?.transform === 'uppercase') {
        schema = schema.transform((val) => val.toUpperCase());
    }
    else if (options?.transform === 'lowercase') {
        schema = schema.transform((val) => val.toLowerCase());
    }
    return schema;
}
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
function createICD10Schema(options) {
    return zod_1.z
        .string({
        required_error: options?.message || 'ICD-10 code is required',
    })
        .regex(/^[A-Z]\d{2}(\.\d{0,4})?$/, {
        message: options?.message ||
            'ICD-10 code must be a letter followed by 2 digits and optional dot with up to 4 digits',
    });
}
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
function createNPISchema(options) {
    return zod_1.z
        .string({
        required_error: options?.message || 'NPI is required',
    })
        .regex(/^\d{10}$/, {
        message: options?.message || 'NPI must be exactly 10 digits',
    })
        .refine((npi) => {
        // Luhn algorithm validation
        const digits = npi.split('').map(Number);
        let sum = 0;
        let isEven = false;
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = digits[i];
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
    }, {
        message: options?.message || 'Invalid NPI checksum',
    });
}
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
function createSSNSchema(options) {
    const pattern = options?.allowDashes ? /^\d{3}-\d{2}-\d{4}$/ : /^\d{9}$/;
    let schema = zod_1.z
        .string({
        required_error: options?.message || 'SSN is required',
    })
        .regex(pattern, {
        message: options?.message ||
            `SSN must be in format ${options?.allowDashes ? 'XXX-XX-XXXX' : 'XXXXXXXXX'}`,
    });
    if (options?.mask) {
        schema = schema.transform((ssn) => {
            const digits = ssn.replace(/-/g, '');
            return `***-**-${digits.slice(-4)}`;
        });
    }
    return schema;
}
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
function createEmailSchema(options) {
    let schema = zod_1.z
        .string({
        required_error: options?.message || 'Email is required',
    })
        .email({
        message: options?.message || 'Invalid email address',
    });
    if (options?.normalize) {
        schema = schema.transform((email) => email.toLowerCase().trim());
    }
    if (options?.blockedDomains && options.blockedDomains.length > 0) {
        schema = schema.refine((email) => {
            const domain = email.split('@')[1]?.toLowerCase();
            return !options.blockedDomains.includes(domain);
        }, {
            message: 'Email domain is not allowed',
        });
    }
    if (options?.allowedDomains && options.allowedDomains.length > 0) {
        schema = schema.refine((email) => {
            const domain = email.split('@')[1]?.toLowerCase();
            return options.allowedDomains.includes(domain);
        }, {
            message: 'Email domain is not in the allowed list',
        });
    }
    return schema;
}
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
function createPhoneSchema(options) {
    let schema = zod_1.z
        .string({
        required_error: options?.message || 'Phone number is required',
    })
        .refine((phone) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
    }, {
        message: options?.message || 'Invalid US phone number',
    });
    if (options?.format) {
        schema = schema.transform((phone) => {
            const cleaned = phone.replace(/\D/g, '');
            const normalized = cleaned.length === 11 ? cleaned : `1${cleaned}`;
            switch (options.format) {
                case 'e164':
                    return `+${normalized}`;
                case 'national':
                    return `(${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7)}`;
                case 'raw':
                    return normalized;
                default:
                    return phone;
            }
        });
    }
    return schema;
}
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
function createPasswordSchema(options) {
    const { minLength = 8, maxLength = 128, requireUppercase = true, requireLowercase = true, requireNumber = true, requireSpecialChar = true, } = options || {};
    let schema = zod_1.z
        .string({
        required_error: options?.message || 'Password is required',
    })
        .min(minLength, {
        message: `Password must be at least ${minLength} characters`,
    })
        .max(maxLength, {
        message: `Password must be at most ${maxLength} characters`,
    });
    if (requireUppercase) {
        schema = schema.refine((pwd) => /[A-Z]/.test(pwd), {
            message: 'Password must contain at least one uppercase letter',
        });
    }
    if (requireLowercase) {
        schema = schema.refine((pwd) => /[a-z]/.test(pwd), {
            message: 'Password must contain at least one lowercase letter',
        });
    }
    if (requireNumber) {
        schema = schema.refine((pwd) => /\d/.test(pwd), {
            message: 'Password must contain at least one number',
        });
    }
    if (requireSpecialChar) {
        schema = schema.refine((pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd), {
            message: 'Password must contain at least one special character',
        });
    }
    return schema;
}
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
function createDateSchema(options) {
    let schema = zod_1.z.date({
        required_error: options?.message || 'Date is required',
        invalid_type_error: 'Invalid date',
    });
    if (options?.mustBePast) {
        schema = schema.refine((date) => date < new Date(), {
            message: 'Date must be in the past',
        });
    }
    if (options?.mustBeFuture) {
        schema = schema.refine((date) => date > new Date(), {
            message: 'Date must be in the future',
        });
    }
    if (options?.minDate) {
        schema = schema.refine((date) => date >= options.minDate, {
            message: `Date must be on or after ${options.minDate.toISOString()}`,
        });
    }
    if (options?.maxDate) {
        schema = schema.refine((date) => date <= options.maxDate, {
            message: `Date must be on or before ${options.maxDate.toISOString()}`,
        });
    }
    if (options?.minAge !== undefined) {
        schema = schema.refine((date) => {
            const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            return age >= options.minAge;
        }, {
            message: `Must be at least ${options.minAge} years old`,
        });
    }
    if (options?.maxAge !== undefined) {
        schema = schema.refine((date) => {
            const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            return age <= options.maxAge;
        }, {
            message: `Must be at most ${options.maxAge} years old`,
        });
    }
    return schema;
}
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
function createFileSchema(constraints) {
    const fileSchema = {
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mimetype: zod_1.z.string(),
        size: zod_1.z.number(),
    };
    if (constraints.maxSize) {
        fileSchema.size = zod_1.z.number().max(constraints.maxSize, {
            message: `File size must be less than ${constraints.maxSize} bytes`,
        });
    }
    if (constraints.minSize) {
        fileSchema.size = zod_1.z.number().min(constraints.minSize, {
            message: `File size must be at least ${constraints.minSize} bytes`,
        });
    }
    let schema = zod_1.z.object(fileSchema);
    if (constraints.allowedMimeTypes && constraints.allowedMimeTypes.length > 0) {
        schema = schema.refine((file) => constraints.allowedMimeTypes.includes(file.mimetype), {
            message: `File type must be one of: ${constraints.allowedMimeTypes.join(', ')}`,
        });
    }
    if (constraints.allowedExtensions && constraints.allowedExtensions.length > 0) {
        schema = schema.refine((file) => {
            const ext = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
            return ext && constraints.allowedExtensions.includes(ext);
        }, {
            message: `File extension must be one of: ${constraints.allowedExtensions.join(', ')}`,
        });
    }
    if (constraints.requireImage) {
        schema = schema.refine((file) => file.mimetype.startsWith('image/'), {
            message: 'File must be an image',
        });
    }
    return schema;
}
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
function createArraySchema(itemSchema, options) {
    let schema = zod_1.z.array(itemSchema, {
        required_error: options?.message || 'Array is required',
    });
    if (options?.minLength !== undefined) {
        schema = schema.min(options.minLength, {
            message: `Array must contain at least ${options.minLength} items`,
        });
    }
    if (options?.maxLength !== undefined) {
        schema = schema.max(options.maxLength, {
            message: `Array must contain at most ${options.maxLength} items`,
        });
    }
    if (options?.unique) {
        schema = schema.refine((arr) => {
            const set = new Set(arr.map((item) => JSON.stringify(item)));
            return set.size === arr.length;
        }, {
            message: 'Array must contain unique values',
        });
    }
    return schema;
}
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
function createConditionalSchema(baseSchema, rule) {
    return baseSchema.refine(async (data) => {
        const fieldValue = data[rule.field];
        let conditionMet = false;
        switch (rule.operator) {
            case 'equals':
                conditionMet = fieldValue === rule.value;
                break;
            case 'notEquals':
                conditionMet = fieldValue !== rule.value;
                break;
            case 'in':
                conditionMet = Array.isArray(rule.value) && rule.value.includes(fieldValue);
                break;
            case 'notIn':
                conditionMet = Array.isArray(rule.value) && !rule.value.includes(fieldValue);
                break;
            case 'exists':
                conditionMet = fieldValue !== undefined && fieldValue !== null;
                break;
            case 'notExists':
                conditionMet = fieldValue === undefined || fieldValue === null;
                break;
        }
        if (!conditionMet) {
            return true;
        }
        if (rule.validator instanceof zod_1.z.ZodType) {
            const result = await rule.validator.safeParseAsync(data);
            return result.success;
        }
        else if (typeof rule.validator === 'function') {
            return rule.validator(data);
        }
        return true;
    }, {
        message: `Conditional validation failed for field: ${rule.field}`,
    });
}
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
function createNestedSchema(shape, options) {
    let schema = zod_1.z.object(shape);
    if (options?.strict) {
        schema = schema.strict();
    }
    if (options?.stripUnknown) {
        schema = schema.passthrough().transform((obj) => {
            const keys = Object.keys(shape);
            return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
        });
    }
    return schema;
}
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
async function validateWithZod(schema, data) {
    const result = await schema.safeParseAsync(data);
    if (result.success) {
        return {
            success: true,
            data: result.data,
        };
    }
    return {
        success: false,
        errors: result.error.errors.map((err) => ({
            path: err.path,
            message: err.message,
            code: err.code,
        })),
    };
}
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
function createPaginationSchema(options) {
    const { maxLimit = 100, defaultLimit = 10, allowedSortFields } = options || {};
    let schema = zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().max(maxLimit).default(defaultLimit),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).default('asc'),
    });
    if (allowedSortFields && allowedSortFields.length > 0) {
        schema = schema.refine((data) => {
            if (!data.sort)
                return true;
            return allowedSortFields.includes(data.sort);
        }, {
            message: `Sort field must be one of: ${allowedSortFields.join(', ')}`,
        });
    }
    return schema;
}
// ============================================================================
// NESTJS CUSTOM VALIDATION PIPES
// ============================================================================
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
let ZodValidationPipe = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ZodValidationPipe = _classThis = class {
        constructor(schema) {
            this.schema = schema;
        }
        async transform(value, metadata) {
            try {
                const result = await this.schema.parseAsync(value);
                return result;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    const formattedErrors = error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                        code: err.code,
                    }));
                    throw new common_1.BadRequestException({
                        statusCode: 400,
                        message: 'Validation failed',
                        errors: formattedErrors,
                    });
                }
                throw new common_1.BadRequestException('Validation failed');
            }
        }
    };
    __setFunctionName(_classThis, "ZodValidationPipe");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZodValidationPipe = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZodValidationPipe = _classThis;
})();
exports.ZodValidationPipe = ZodValidationPipe;
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
let EnhancedValidationPipe = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EnhancedValidationPipe = _classThis = class {
        constructor(options) {
            this.options = options;
        }
        async transform(value, metadata) {
            if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
                return value;
            }
            const object = (0, class_transformer_1.plainToClass)(metadata.metatype, value, {
                excludeExtraneousValues: this.options?.whitelist || false,
            });
            const errors = await (0, class_validator_1.validate)(object, {
                whitelist: this.options?.whitelist,
                forbidNonWhitelisted: this.options?.forbidNonWhitelisted,
                skipMissingProperties: this.options?.skipMissingProperties,
                validationError: this.options?.validationError,
            });
            if (errors.length > 0) {
                const formattedErrors = this.formatErrors(errors);
                if (this.options?.exceptionFactory) {
                    throw this.options.exceptionFactory(errors);
                }
                throw new common_1.UnprocessableEntityException({
                    statusCode: 422,
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
            return errors.map((error) => ({
                field: error.property,
                constraints: error.constraints,
                children: error.children && error.children.length > 0 ? this.formatErrors(error.children) : undefined,
            }));
        }
    };
    __setFunctionName(_classThis, "EnhancedValidationPipe");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnhancedValidationPipe = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnhancedValidationPipe = _classThis;
})();
exports.EnhancedValidationPipe = EnhancedValidationPipe;
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
let SanitizationPipe = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SanitizationPipe = _classThis = class {
        constructor(options) {
            this.options = options;
        }
        transform(value, metadata) {
            if (typeof value === 'string') {
                return this.sanitizeString(value);
            }
            else if (Array.isArray(value)) {
                return value.map((item) => this.transform(item, metadata));
            }
            else if (typeof value === 'object' && value !== null) {
                return this.sanitizeObject(value);
            }
            return value;
        }
        sanitizeString(value) {
            let sanitized = value;
            if (this.options?.trim !== false) {
                sanitized = sanitized.trim();
            }
            if (this.options?.removeNullBytes) {
                sanitized = sanitized.replace(/\0/g, '');
            }
            if (this.options?.normalizeWhitespace) {
                sanitized = sanitized.replace(/\s+/g, ' ');
            }
            if (this.options?.stripScripts !== false) {
                sanitized = this.removeScripts(sanitized);
            }
            if (this.options?.stripSql) {
                sanitized = this.removeSQLPatterns(sanitized);
            }
            if (this.options?.lowercase) {
                sanitized = sanitized.toLowerCase();
            }
            if (this.options?.uppercase) {
                sanitized = sanitized.toUpperCase();
            }
            return sanitized;
        }
        sanitizeObject(obj) {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = this.transform(value, {});
            }
            return sanitized;
        }
        removeScripts(input) {
            return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        removeSQLPatterns(input) {
            let sanitized = input.replace(/--.*$/gm, '');
            sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');
            return sanitized;
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
// CUSTOM DECORATORS FOR HEALTHCARE VALIDATION
// ============================================================================
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
function IsMRN(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isMRN',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    return /^[A-Z]{3}\d{6,10}$/.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid Medical Record Number (3 letters + 6-10 digits)`;
                },
            },
        });
    };
}
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
function IsICD10(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isICD10',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    return /^[A-Z]\d{2}(\.\d{0,4})?$/.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid ICD-10 code`;
                },
            },
        });
    };
}
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
function IsNPI(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isNPI',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string' || !/^\d{10}$/.test(value)) {
                        return false;
                    }
                    // Luhn algorithm validation
                    const digits = value.split('').map(Number);
                    let sum = 0;
                    let isEven = false;
                    for (let i = digits.length - 1; i >= 0; i--) {
                        let digit = digits[i];
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
                defaultMessage(args) {
                    return `${args.property} must be a valid 10-digit NPI with valid checksum`;
                },
            },
        });
    };
}
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
function IsSSN(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isSSN',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    const cleaned = value.replace(/-/g, '');
                    return /^\d{9}$/.test(cleaned);
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid Social Security Number`;
                },
            },
        });
    };
}
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
function IsInRange(min, max, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isInRange',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min, max],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    if (typeof value !== 'number')
                        return false;
                    const [min, max] = args.constraints;
                    return value >= min && value <= max;
                },
                defaultMessage(args) {
                    const [min, max] = args.constraints;
                    return `${args.property} must be between ${min} and ${max}`;
                },
            },
        });
    };
}
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
function IsPastDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isPastDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (!(value instanceof Date) && typeof value !== 'string')
                        return false;
                    const date = value instanceof Date ? value : new Date(value);
                    return !isNaN(date.getTime()) && date < new Date();
                },
                defaultMessage(args) {
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
 *   @ApiProperty({ description: 'Appointment date and time' })
 *   scheduledAt: Date;
 * }
 * ```
 */
function IsFutureDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (!(value instanceof Date) && typeof value !== 'string')
                        return false;
                    const date = value instanceof Date ? value : new Date(value);
                    return !isNaN(date.getTime()) && date > new Date();
                },
                defaultMessage(args) {
                    return `${args.property} must be a date in the future`;
                },
            },
        });
    };
}
// ============================================================================
// INPUT SANITIZATION FUNCTIONS
// ============================================================================
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
function sanitizeXSS(input, options) {
    if (typeof input !== 'string')
        return '';
    let sanitized = input;
    // Remove script tags
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Remove event handlers (onclick, onload, etc.)
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');
    // Remove data: protocol (can be used for XSS)
    sanitized = sanitized.replace(/data:text\/html/gi, '');
    // Remove vbscript: protocol
    sanitized = sanitized.replace(/vbscript:/gi, '');
    if (options?.escapeHtml !== false) {
        sanitized = sanitized
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    return sanitized;
}
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
function sanitizeSQLInput(input) {
    if (typeof input !== 'string')
        return '';
    let sanitized = input;
    // Remove SQL comments
    sanitized = sanitized.replace(/--.*$/gm, '');
    sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');
    // Escape single quotes
    sanitized = sanitized.replace(/'/g, "''");
    // Remove common SQL injection patterns
    const dangerousPatterns = [
        /(\b(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|TRUNCATE|EXEC|EXECUTE|UNION|SELECT)\b)/gi,
        /;/g,
    ];
    dangerousPatterns.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, '');
    });
    return sanitized.trim();
}
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
function sanitizeHTML(html, options) {
    if (typeof html !== 'string')
        return '';
    const allowedTags = options?.allowedTags || ['p', 'br', 'b', 'i', 'u', 'strong', 'em'];
    const allowedPattern = allowedTags.join('|');
    const tagRegex = new RegExp(`<(?!\/?(${allowedPattern})\\b)[^>]+>`, 'gi');
    let sanitized = html.replace(tagRegex, '');
    // Remove event handlers from allowed tags
    sanitized = sanitized.replace(/(<[^>]+)\son\w+\s*=\s*["'][^"']*["']/gi, '$1');
    // Remove dangerous attributes
    const dangerousAttrs = ['href', 'src', 'action', 'formaction', 'data'];
    dangerousAttrs.forEach((attr) => {
        const attrRegex = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
        sanitized = sanitized.replace(attrRegex, '');
    });
    return sanitized;
}
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
function sanitizeFileName(filename) {
    if (typeof filename !== 'string')
        return 'unnamed';
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
        sanitized = ext ? `${name}.${ext}` : name;
    }
    return sanitized || 'unnamed';
}
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
function sanitizeEmail(email) {
    if (typeof email !== 'string')
        return null;
    let sanitized = email.trim().toLowerCase();
    sanitized = sanitized.replace(/[^a-z0-9@._+-]/g, '');
    if (!validator.isEmail(sanitized)) {
        return null;
    }
    return sanitized;
}
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
function sanitizePhoneNumber(phone, options) {
    if (typeof phone !== 'string')
        return '';
    const cleaned = phone.replace(/\D/g, '');
    if (options?.format === 'e164') {
        const normalized = cleaned.length === 11 ? cleaned : `1${cleaned}`;
        return `+${normalized}`;
    }
    else if (options?.format === 'national') {
        const normalized = cleaned.length === 11 ? cleaned.slice(1) : cleaned;
        return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
    }
    return cleaned;
}
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
function sanitizeURL(url, options) {
    if (typeof url !== 'string')
        return null;
    const trimmed = url.trim();
    const validatorOptions = {
        protocols: options?.protocols || ['http', 'https'],
        require_protocol: options?.requireProtocol !== false,
    };
    if (!validator.isURL(trimmed, validatorOptions)) {
        return null;
    }
    return trimmed;
}
// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================
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
async function transformToDTO(cls, plain, options) {
    const instance = (0, class_transformer_1.plainToClass)(cls, plain, {
        excludeExtraneousValues: options?.excludeExtraneous ?? true,
    });
    if (options?.validate !== false) {
        await (0, class_validator_1.validateOrReject)(instance, {
            groups: options?.groups,
        });
    }
    return instance;
}
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
function transformToPlain(instance, options) {
    return (0, class_transformer_1.classToPlain)(instance, {
        excludeExtraneousValues: options?.excludeExtraneous ?? true,
        groups: options?.groups,
    });
}
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
function coerceBoolean(value) {
    if (typeof value === 'boolean')
        return value;
    if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        return lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on';
    }
    if (typeof value === 'number')
        return value !== 0;
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
 * coerceNumber('123'); // 123
 * coerceNumber('12.34'); // 12.34
 * coerceNumber('invalid'); // null
 * coerceNumber('invalid', 0); // 0
 * ```
 */
function coerceNumber(value, defaultValue) {
    if (typeof value === 'number' && !isNaN(value))
        return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        if (!isNaN(parsed))
            return parsed;
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
 * coerceDate('2024-01-01'); // Date object
 * coerceDate('2024-01-01T00:00:00Z'); // Date object
 * coerceDate('invalid'); // null
 * ```
 */
function coerceDate(value) {
    if (value instanceof Date)
        return !isNaN(value.getTime()) ? value : null;
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
 * coerceArray('item'); // ['item']
 * coerceArray(['item1', 'item2']); // ['item1', 'item2']
 * coerceArray(null); // []
 * ```
 */
function coerceArray(value) {
    if (Array.isArray(value))
        return value;
    if (value === null || value === undefined)
        return [];
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
function convertCase(str, format) {
    if (typeof str !== 'string')
        return '';
    const words = str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]/g, ' ')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
    switch (format) {
        case 'camel':
            return words.map((word, idx) => (idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))).join('');
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
// ASYNC VALIDATION UTILITIES
// ============================================================================
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
function createAsyncUniqueValidator(checkFn, message) {
    return async (value, args) => {
        try {
            return await checkFn(value);
        }
        catch (error) {
            console.error('Async unique validation failed:', error);
            return false;
        }
    };
}
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
function createAsyncValidator(validatorFn, defaultMessage) {
    return async (value, args) => {
        try {
            return await validatorFn(value);
        }
        catch (error) {
            console.error('Async validation failed:', error);
            return false;
        }
    };
}
// ============================================================================
// VALIDATION RESULT HELPERS
// ============================================================================
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
function formatValidationErrors(errors) {
    const formatted = {};
    function extractErrors(error, prefix = '') {
        const propertyPath = prefix ? `${prefix}.${error.property}` : error.property;
        if (error.constraints) {
            formatted[propertyPath] = Object.values(error.constraints);
        }
        if (error.children && error.children.length > 0) {
            error.children.forEach((child) => extractErrors(child, propertyPath));
        }
    }
    errors.forEach((error) => extractErrors(error));
    return formatted;
}
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
async function validateObject(object, options) {
    const errors = await (0, class_validator_1.validate)(object, {
        groups: options?.groups,
        skipMissingProperties: options?.skipMissingProperties,
    });
    if (errors.length === 0) {
        return {
            isValid: true,
            value: object,
            errors: [],
        };
    }
    return {
        isValid: false,
        errors: errors.map((e) => Object.values(e.constraints || {}).join(', ')),
        fieldErrors: formatValidationErrors(errors),
        metadata: { validationErrors: errors },
    };
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
 * const result = await validatePartialObject({ email: 'new@example.com' }, UpdateUserDto);
 * ```
 */
async function validatePartialObject(partial, cls) {
    const instance = (0, class_transformer_1.plainToClass)(cls, partial, { excludeExtraneousValues: true });
    const errors = await (0, class_validator_1.validate)(instance, { skipMissingProperties: true });
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
        fieldErrors: formatValidationErrors(errors),
    };
}
// ============================================================================
// UTILITY EXPORTS
// ============================================================================
/**
 * Common Zod schemas for reuse across the application.
 */
exports.CommonSchemas = {
    email: createEmailSchema({ normalize: true }),
    phone: createPhoneSchema({ format: 'e164' }),
    password: createPasswordSchema(),
    mrn: createMRNSchema(),
    icd10: createICD10Schema(),
    npi: createNPISchema(),
    ssn: createSSNSchema({ allowDashes: true }),
    uuid: zod_1.z.string().uuid(),
    url: zod_1.z.string().url(),
    positiveInt: zod_1.z.number().int().positive(),
    nonNegativeInt: zod_1.z.number().int().nonnegative(),
    pagination: createPaginationSchema(),
};
//# sourceMappingURL=validation-sanitization-kit.prod.js.map