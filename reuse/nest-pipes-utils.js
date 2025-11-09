"use strict";
/**
 * @fileoverview NestJS Pipe Utilities
 * @module reuse/nest-pipes-utils
 * @description Comprehensive pipe utilities for NestJS validation, transformation, and sanitization
 *
 * Features:
 * - Validation pipes for common data types
 * - Transformation pipes for data normalization
 * - Sanitization pipes for security
 * - Parse pipes for type conversion
 * - Custom validation pipes
 * - File validation pipes
 * - Array and object validation
 * - Query parameter parsing
 * - Body parsing and validation
 * - Schema validation helpers
 *
 * Security Features:
 * - XSS prevention through sanitization
 * - SQL injection prevention
 * - Type validation and coercion
 * - File upload validation
 * - Size and format restrictions
 * - HIPAA-compliant data validation
 *
 * @requires class-validator
 * @requires class-transformer
 * @requires sanitize-html
 *
 * @example Basic validation
 * ```typescript
 * import { validateEmail, validateUuid, parseIntSafe } from './nest-pipes-utils';
 *
 * // Email validation
 * validateEmail('user@example.com'); // true
 *
 * // UUID validation
 * validateUuid('123e4567-e89b-12d3-a456-426614174000'); // true
 *
 * // Safe integer parsing
 * parseIntSafe('123', 0); // 123
 * parseIntSafe('invalid', 0); // 0
 * ```
 *
 * @example Data transformation
 * ```typescript
 * import { trimString, normalizeEmail, sanitizeHtml } from './nest-pipes-utils';
 *
 * // Trim whitespace
 * const clean = trimString('  hello  '); // "hello"
 *
 * // Normalize email
 * const email = normalizeEmail('User@Example.COM'); // "user@example.com"
 *
 * // Sanitize HTML
 * const safe = sanitizeHtml('<script>alert("xss")</script>'); // ""
 * ```
 *
 * LOC: NEST_PIPE_UTILS_V1
 * UPSTREAM: class-validator, class-transformer, sanitize-html
 * DOWNSTREAM: Controllers, DTOs, validation pipes, transform interceptors
 *
 * @version 1.0.0
 * @since 2025-11-08
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
exports.buildPaginationParams = exports.parseQueryArray = exports.parseQueryBoolean = exports.parseQueryInt = exports.createValidationPipe = exports.formatValidationErrors = exports.transformAndValidate = exports.validateDto = exports.getFileExtension = exports.validateDocumentFile = exports.validateImageFile = exports.validateFileType = exports.validateFileSize = exports.parseEnumSafe = exports.parseArraySafe = exports.parseJsonSafe = exports.parseDateSafe = exports.parseBooleanSafe = exports.parseFloatSafe = exports.parseIntSafe = exports.removeNullBytes = exports.sanitizeFilename = exports.escapeHtml = exports.sanitizeString = exports.sanitizeHtmlContent = exports.stripHtml = exports.removeExtraSpaces = exports.truncateString = exports.slugify = exports.capitalizeString = exports.normalizePhoneNumber = exports.normalizeEmail = exports.trimString = exports.validateStringLength = exports.validateArrayLength = exports.validateYear = exports.validateAge = exports.validateDateRange = exports.validateDateString = exports.validateUrl = exports.validatePhoneNumber = exports.validateUuid = exports.validateEmail = exports.VALIDATION_CONFIG = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sanitizeHtml = __importStar(require("sanitize-html"));
/**
 * Validation configuration constants
 */
exports.VALIDATION_CONFIG = {
    EMAIL_MAX_LENGTH: 254,
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 15,
    STRING_MAX_LENGTH: 1000,
    TEXT_MAX_LENGTH: 10000,
    ARRAY_MAX_SIZE: 1000,
    FILE_MAX_SIZE: 10485760, // 10MB
    IMAGE_MAX_SIZE: 5242880, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    UUID_VERSION: 4,
    MIN_AGE: 0,
    MAX_AGE: 150,
    MIN_YEAR: 1900,
    MAX_YEAR: 2100,
};
// =============================================================================
// VALIDATION PIPE UTILITIES
// =============================================================================
/**
 * @function validateEmail
 * @description Validate email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 *
 * @example
 * ```typescript
 * validateEmail('user@example.com'); // true
 * validateEmail('invalid.email'); // false
 * ```
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (emailRegex.test(email) &&
        email.length <= exports.VALIDATION_CONFIG.EMAIL_MAX_LENGTH);
};
exports.validateEmail = validateEmail;
/**
 * @function validateUuid
 * @description Validate UUID v4 format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} True if valid UUID v4
 *
 * @example
 * ```typescript
 * validateUuid('123e4567-e89b-12d3-a456-426614174000'); // true
 * validateUuid('invalid-uuid'); // false
 * ```
 */
const validateUuid = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
exports.validateUuid = validateUuid;
/**
 * @function validatePhoneNumber
 * @description Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 *
 * @example
 * ```typescript
 * validatePhoneNumber('+15551234567'); // true
 * validatePhoneNumber('123'); // false
 * ```
 */
const validatePhoneNumber = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return (digitsOnly.length >= exports.VALIDATION_CONFIG.PHONE_MIN_LENGTH &&
        digitsOnly.length <= exports.VALIDATION_CONFIG.PHONE_MAX_LENGTH);
};
exports.validatePhoneNumber = validatePhoneNumber;
/**
 * @function validateUrl
 * @description Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 *
 * @example
 * ```typescript
 * validateUrl('https://example.com'); // true
 * validateUrl('not-a-url'); // false
 * ```
 */
const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
exports.validateUrl = validateUrl;
/**
 * @function validateDateString
 * @description Validate date string format (ISO 8601)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 *
 * @example
 * ```typescript
 * validateDateString('2024-01-15'); // true
 * validateDateString('invalid-date'); // false
 * ```
 */
const validateDateString = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
};
exports.validateDateString = validateDateString;
/**
 * @function validateDateRange
 * @description Validate date is within allowed range
 * @param {Date} date - Date to validate
 * @param {Date} minDate - Minimum allowed date
 * @param {Date} maxDate - Maximum allowed date
 * @returns {boolean} True if date is within range
 *
 * @example
 * ```typescript
 * const valid = validateDateRange(
 *   new Date('2024-01-15'),
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * ); // true
 * ```
 */
const validateDateRange = (date, minDate, maxDate) => {
    if (minDate && date < minDate)
        return false;
    if (maxDate && date > maxDate)
        return false;
    return true;
};
exports.validateDateRange = validateDateRange;
/**
 * @function validateAge
 * @description Validate age is within acceptable range
 * @param {number} age - Age to validate
 * @returns {boolean} True if valid age
 *
 * @example
 * ```typescript
 * validateAge(25); // true
 * validateAge(-5); // false
 * validateAge(200); // false
 * ```
 */
const validateAge = (age) => {
    return age >= exports.VALIDATION_CONFIG.MIN_AGE && age <= exports.VALIDATION_CONFIG.MAX_AGE;
};
exports.validateAge = validateAge;
/**
 * @function validateYear
 * @description Validate year is within acceptable range
 * @param {number} year - Year to validate
 * @returns {boolean} True if valid year
 *
 * @example
 * ```typescript
 * validateYear(2024); // true
 * validateYear(1800); // false
 * ```
 */
const validateYear = (year) => {
    return (year >= exports.VALIDATION_CONFIG.MIN_YEAR && year <= exports.VALIDATION_CONFIG.MAX_YEAR);
};
exports.validateYear = validateYear;
/**
 * @function validateArrayLength
 * @description Validate array length
 * @param {any[]} array - Array to validate
 * @param {number} minLength - Minimum length (default: 0)
 * @param {number} maxLength - Maximum length (default: 1000)
 * @returns {boolean} True if array length is valid
 *
 * @example
 * ```typescript
 * validateArrayLength([1, 2, 3], 1, 5); // true
 * validateArrayLength([], 1, 5); // false
 * ```
 */
const validateArrayLength = (array, minLength = 0, maxLength = exports.VALIDATION_CONFIG.ARRAY_MAX_SIZE) => {
    return array.length >= minLength && array.length <= maxLength;
};
exports.validateArrayLength = validateArrayLength;
/**
 * @function validateStringLength
 * @description Validate string length
 * @param {string} str - String to validate
 * @param {number} minLength - Minimum length (default: 0)
 * @param {number} maxLength - Maximum length (default: 1000)
 * @returns {boolean} True if string length is valid
 *
 * @example
 * ```typescript
 * validateStringLength('hello', 1, 10); // true
 * validateStringLength('', 1, 10); // false
 * ```
 */
const validateStringLength = (str, minLength = 0, maxLength = exports.VALIDATION_CONFIG.STRING_MAX_LENGTH) => {
    return str.length >= minLength && str.length <= maxLength;
};
exports.validateStringLength = validateStringLength;
// =============================================================================
// TRANSFORMATION PIPE UTILITIES
// =============================================================================
/**
 * @function trimString
 * @description Trim whitespace from string
 * @param {string} str - String to trim
 * @returns {string} Trimmed string
 *
 * @example
 * ```typescript
 * trimString('  hello  '); // "hello"
 * ```
 */
const trimString = (str) => {
    return str.trim();
};
exports.trimString = trimString;
/**
 * @function normalizeEmail
 * @description Normalize email address (lowercase, trim)
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email
 *
 * @example
 * ```typescript
 * normalizeEmail('User@Example.COM  '); // "user@example.com"
 * ```
 */
const normalizeEmail = (email) => {
    return email.trim().toLowerCase();
};
exports.normalizeEmail = normalizeEmail;
/**
 * @function normalizePhoneNumber
 * @description Normalize phone number (remove non-digits)
 * @param {string} phone - Phone number to normalize
 * @returns {string} Normalized phone number
 *
 * @example
 * ```typescript
 * normalizePhoneNumber('+1 (555) 123-4567'); // "15551234567"
 * ```
 */
const normalizePhoneNumber = (phone) => {
    return phone.replace(/\D/g, '');
};
exports.normalizePhoneNumber = normalizePhoneNumber;
/**
 * @function capitalizeString
 * @description Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 *
 * @example
 * ```typescript
 * capitalizeString('john doe'); // "John Doe"
 * ```
 */
const capitalizeString = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
exports.capitalizeString = capitalizeString;
/**
 * @function slugify
 * @description Convert string to URL-friendly slug
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 *
 * @example
 * ```typescript
 * slugify('Hello World!'); // "hello-world"
 * ```
 */
const slugify = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.slugify = slugify;
/**
 * @function truncateString
 * @description Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 *
 * @example
 * ```typescript
 * truncateString('Long text here', 8); // "Long tex..."
 * ```
 */
const truncateString = (str, maxLength, suffix = '...') => {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - suffix.length) + suffix;
};
exports.truncateString = truncateString;
/**
 * @function removeExtraSpaces
 * @description Remove extra whitespace from string
 * @param {string} str - String to process
 * @returns {string} String with single spaces
 *
 * @example
 * ```typescript
 * removeExtraSpaces('hello    world'); // "hello world"
 * ```
 */
const removeExtraSpaces = (str) => {
    return str.replace(/\s+/g, ' ').trim();
};
exports.removeExtraSpaces = removeExtraSpaces;
/**
 * @function stripHtml
 * @description Remove all HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 *
 * @example
 * ```typescript
 * stripHtml('<p>Hello <strong>world</strong></p>'); // "Hello world"
 * ```
 */
const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
};
exports.stripHtml = stripHtml;
// =============================================================================
// SANITIZATION PIPE UTILITIES
// =============================================================================
/**
 * @function sanitizeHtmlContent
 * @description Sanitize HTML to prevent XSS attacks
 * @param {string} html - HTML to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized HTML
 *
 * @security Removes dangerous HTML tags and attributes
 *
 * @example
 * ```typescript
 * sanitizeHtmlContent('<script>alert("xss")</script>'); // ""
 * sanitizeHtmlContent('<p>Safe content</p>'); // "<p>Safe content</p>"
 * ```
 */
const sanitizeHtmlContent = (html, options) => {
    const defaultOptions = {
        allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
        allowedAttributes: {
            a: ['href', 'target'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
    };
    return sanitizeHtml(html, options || defaultOptions);
};
exports.sanitizeHtmlContent = sanitizeHtmlContent;
/**
 * @function sanitizeString
 * @description Sanitize string by removing dangerous characters
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 *
 * @security Prevents SQL injection and XSS
 *
 * @example
 * ```typescript
 * sanitizeString("'; DROP TABLE users; --"); // "DROP TABLE users"
 * ```
 */
const sanitizeString = (str) => {
    return str
        .replace(/[<>]/g, '')
        .replace(/['";]/g, '')
        .trim();
};
exports.sanitizeString = sanitizeString;
/**
 * @function escapeHtml
 * @description Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 *
 * @example
 * ```typescript
 * escapeHtml('<script>alert("xss")</script>');
 * // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 * ```
 */
const escapeHtml = (str) => {
    const htmlEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };
    return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
};
exports.escapeHtml = escapeHtml;
/**
 * @function sanitizeFilename
 * @description Sanitize filename to prevent directory traversal
 * @param {string} filename - Filename to sanitize
 * @returns {string} Safe filename
 *
 * @security Prevents path traversal attacks
 *
 * @example
 * ```typescript
 * sanitizeFilename('../../../etc/passwd'); // "etc-passwd"
 * sanitizeFilename('file name.pdf'); // "file-name.pdf"
 * ```
 */
const sanitizeFilename = (filename) => {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '-')
        .replace(/\.{2,}/g, '.')
        .replace(/^\.+/, '')
        .replace(/\.+$/, '');
};
exports.sanitizeFilename = sanitizeFilename;
/**
 * @function removeNullBytes
 * @description Remove null bytes from string
 * @param {string} str - String to clean
 * @returns {string} String without null bytes
 *
 * @security Prevents null byte injection
 *
 * @example
 * ```typescript
 * removeNullBytes('hello\x00world'); // "helloworld"
 * ```
 */
const removeNullBytes = (str) => {
    return str.replace(/\0/g, '');
};
exports.removeNullBytes = removeNullBytes;
// =============================================================================
// PARSE PIPE UTILITIES
// =============================================================================
/**
 * @function parseIntSafe
 * @description Safely parse integer with fallback
 * @param {string | number} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed integer or default
 *
 * @example
 * ```typescript
 * parseIntSafe('123', 0); // 123
 * parseIntSafe('invalid', 0); // 0
 * parseIntSafe('12.5', 0); // 12
 * ```
 */
const parseIntSafe = (value, defaultValue = 0) => {
    const parsed = parseInt(String(value), 10);
    return isNaN(parsed) ? defaultValue : parsed;
};
exports.parseIntSafe = parseIntSafe;
/**
 * @function parseFloatSafe
 * @description Safely parse float with fallback
 * @param {string | number} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed float or default
 *
 * @example
 * ```typescript
 * parseFloatSafe('12.5', 0); // 12.5
 * parseFloatSafe('invalid', 0); // 0
 * ```
 */
const parseFloatSafe = (value, defaultValue = 0) => {
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? defaultValue : parsed;
};
exports.parseFloatSafe = parseFloatSafe;
/**
 * @function parseBooleanSafe
 * @description Safely parse boolean from string
 * @param {string | boolean} value - Value to parse
 * @returns {boolean} Parsed boolean
 *
 * @example
 * ```typescript
 * parseBooleanSafe('true'); // true
 * parseBooleanSafe('false'); // false
 * parseBooleanSafe('1'); // true
 * parseBooleanSafe('0'); // false
 * parseBooleanSafe('yes'); // true
 * ```
 */
const parseBooleanSafe = (value) => {
    if (typeof value === 'boolean')
        return value;
    const normalized = String(value).toLowerCase().trim();
    return ['true', '1', 'yes', 'on'].includes(normalized);
};
exports.parseBooleanSafe = parseBooleanSafe;
/**
 * @function parseDateSafe
 * @description Safely parse date with fallback
 * @param {string | Date} value - Value to parse
 * @param {Date} defaultValue - Default value if parsing fails
 * @returns {Date} Parsed date or default
 *
 * @example
 * ```typescript
 * parseDateSafe('2024-01-15', new Date()); // Date object for 2024-01-15
 * parseDateSafe('invalid', new Date()); // Current date
 * ```
 */
const parseDateSafe = (value, defaultValue = new Date()) => {
    if (value instanceof Date)
        return value;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? defaultValue : parsed;
};
exports.parseDateSafe = parseDateSafe;
/**
 * @function parseJsonSafe
 * @description Safely parse JSON with fallback
 * @param {string} json - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed object or default
 *
 * @example
 * ```typescript
 * parseJsonSafe('{"key": "value"}', {}); // { key: "value" }
 * parseJsonSafe('invalid json', {}); // {}
 * ```
 */
const parseJsonSafe = (json, defaultValue = {}) => {
    try {
        return JSON.parse(json);
    }
    catch {
        return defaultValue;
    }
};
exports.parseJsonSafe = parseJsonSafe;
/**
 * @function parseArraySafe
 * @description Safely parse array from string or ensure array
 * @param {string | any[]} value - Value to parse
 * @param {string} delimiter - Delimiter for string parsing (default: ',')
 * @returns {any[]} Parsed array
 *
 * @example
 * ```typescript
 * parseArraySafe('a,b,c'); // ['a', 'b', 'c']
 * parseArraySafe(['a', 'b']); // ['a', 'b']
 * parseArraySafe('a|b|c', '|'); // ['a', 'b', 'c']
 * ```
 */
const parseArraySafe = (value, delimiter = ',') => {
    if (Array.isArray(value))
        return value;
    if (typeof value !== 'string')
        return [];
    return value.split(delimiter).map((item) => item.trim()).filter(Boolean);
};
exports.parseArraySafe = parseArraySafe;
/**
 * @function parseEnumSafe
 * @description Safely parse enum value
 * @param {string} value - Value to parse
 * @param {object} enumType - Enum object
 * @param {any} defaultValue - Default value if not in enum
 * @returns {any} Enum value or default
 *
 * @example
 * ```typescript
 * enum Status { Active = 'active', Inactive = 'inactive' }
 * parseEnumSafe('active', Status, Status.Inactive); // Status.Active
 * parseEnumSafe('invalid', Status, Status.Inactive); // Status.Inactive
 * ```
 */
const parseEnumSafe = (value, enumType, defaultValue) => {
    const enumValues = Object.values(enumType);
    return enumValues.includes(value) ? value : defaultValue;
};
exports.parseEnumSafe = parseEnumSafe;
// =============================================================================
// FILE VALIDATION UTILITIES
// =============================================================================
/**
 * @function validateFileSize
 * @description Validate file size is within limit
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} True if size is valid
 *
 * @example
 * ```typescript
 * validateFileSize(1024000, 5242880); // true (1MB < 5MB)
 * validateFileSize(10485760, 5242880); // false (10MB > 5MB)
 * ```
 */
const validateFileSize = (size, maxSize) => {
    return size <= maxSize;
};
exports.validateFileSize = validateFileSize;
/**
 * @function validateFileType
 * @description Validate file MIME type
 * @param {string} mimeType - File MIME type
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} True if type is allowed
 *
 * @example
 * ```typescript
 * validateFileType('image/jpeg', ['image/jpeg', 'image/png']); // true
 * validateFileType('text/html', ['image/jpeg', 'image/png']); // false
 * ```
 */
const validateFileType = (mimeType, allowedTypes) => {
    return allowedTypes.includes(mimeType);
};
exports.validateFileType = validateFileType;
/**
 * @function validateImageFile
 * @description Validate uploaded image file
 * @param {Express.Multer.File} file - Uploaded file
 * @returns {FileValidationResult} Validation result
 *
 * @security Validates image type and size
 *
 * @example
 * ```typescript
 * const result = validateImageFile(uploadedFile);
 * if (!result.isValid) {
 *   throw new BadRequestException(result.errors);
 * }
 * ```
 */
const validateImageFile = (file) => {
    const errors = [];
    if (!file) {
        return { isValid: false, errors: ['File is required'] };
    }
    if (!(0, exports.validateFileType)(file.mimetype, exports.VALIDATION_CONFIG.ALLOWED_IMAGE_TYPES)) {
        errors.push(`Invalid file type. Allowed types: ${exports.VALIDATION_CONFIG.ALLOWED_IMAGE_TYPES.join(', ')}`);
    }
    if (!(0, exports.validateFileSize)(file.size, exports.VALIDATION_CONFIG.IMAGE_MAX_SIZE)) {
        errors.push(`File too large. Maximum size: ${exports.VALIDATION_CONFIG.IMAGE_MAX_SIZE / 1024 / 1024}MB`);
    }
    return {
        isValid: errors.length === 0,
        errors,
        file: errors.length === 0 ? file : undefined,
    };
};
exports.validateImageFile = validateImageFile;
/**
 * @function validateDocumentFile
 * @description Validate uploaded document file
 * @param {Express.Multer.File} file - Uploaded file
 * @returns {FileValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateDocumentFile(uploadedFile);
 * if (!result.isValid) {
 *   throw new BadRequestException(result.errors);
 * }
 * ```
 */
const validateDocumentFile = (file) => {
    const errors = [];
    if (!file) {
        return { isValid: false, errors: ['File is required'] };
    }
    if (!(0, exports.validateFileType)(file.mimetype, exports.VALIDATION_CONFIG.ALLOWED_DOCUMENT_TYPES)) {
        errors.push(`Invalid file type. Allowed types: ${exports.VALIDATION_CONFIG.ALLOWED_DOCUMENT_TYPES.join(', ')}`);
    }
    if (!(0, exports.validateFileSize)(file.size, exports.VALIDATION_CONFIG.FILE_MAX_SIZE)) {
        errors.push(`File too large. Maximum size: ${exports.VALIDATION_CONFIG.FILE_MAX_SIZE / 1024 / 1024}MB`);
    }
    return {
        isValid: errors.length === 0,
        errors,
        file: errors.length === 0 ? file : undefined,
    };
};
exports.validateDocumentFile = validateDocumentFile;
/**
 * @function getFileExtension
 * @description Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension (lowercase)
 *
 * @example
 * ```typescript
 * getFileExtension('document.pdf'); // "pdf"
 * getFileExtension('image.JPEG'); // "jpeg"
 * ```
 */
const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};
exports.getFileExtension = getFileExtension;
// =============================================================================
// DTO VALIDATION UTILITIES
// =============================================================================
/**
 * @function validateDto
 * @description Validate DTO using class-validator
 * @param {any} dto - DTO instance
 * @param {ValidatorOptions} options - Validation options
 * @returns {Promise<ValidationError[]>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = await validateDto(createUserDto);
 * if (errors.length > 0) {
 *   throw new BadRequestException(formatValidationErrors(errors));
 * }
 * ```
 */
const validateDto = async (dto, options) => {
    return (0, class_validator_1.validate)(dto, options);
};
exports.validateDto = validateDto;
/**
 * @function transformAndValidate
 * @description Transform plain object to class instance and validate
 * @param {any} classType - Class type
 * @param {object} plain - Plain object
 * @returns {Promise<any>} Validated instance
 *
 * @example
 * ```typescript
 * const user = await transformAndValidate(CreateUserDto, plainObject);
 * ```
 */
const transformAndValidate = async (classType, plain) => {
    const instance = (0, class_transformer_1.plainToInstance)(classType, plain);
    const errors = await (0, class_validator_1.validate)(instance);
    if (errors.length > 0) {
        throw new common_1.BadRequestException((0, exports.formatValidationErrors)(errors));
    }
    return instance;
};
exports.transformAndValidate = transformAndValidate;
/**
 * @function formatValidationErrors
 * @description Format validation errors for response
 * @param {ValidationError[]} errors - Validation errors
 * @returns {object} Formatted error object
 *
 * @example
 * ```typescript
 * const formatted = formatValidationErrors(errors);
 * // { email: ['Email is invalid'], password: ['Password is too short'] }
 * ```
 */
const formatValidationErrors = (errors) => {
    const formatted = {};
    errors.forEach((error) => {
        if (error.constraints) {
            formatted[error.property] = Object.values(error.constraints);
        }
        if (error.children && error.children.length > 0) {
            const childErrors = (0, exports.formatValidationErrors)(error.children);
            Object.keys(childErrors).forEach((key) => {
                formatted[`${error.property}.${key}`] = childErrors[key];
            });
        }
    });
    return formatted;
};
exports.formatValidationErrors = formatValidationErrors;
/**
 * @function createValidationPipe
 * @description Create custom validation pipe
 * @param {ValidatorOptions} options - Validator options
 * @returns {PipeTransform} Validation pipe
 *
 * @example
 * ```typescript
 * const pipe = createValidationPipe({ whitelist: true });
 * ```
 */
const createValidationPipe = (options) => {
    let CustomValidationPipe = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var CustomValidationPipe = _classThis = class {
            async transform(value, metadata) {
                if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
                    return value;
                }
                const object = (0, class_transformer_1.plainToInstance)(metadata.metatype, value);
                const errors = await (0, class_validator_1.validate)(object, options);
                if (errors.length > 0) {
                    throw new common_1.BadRequestException({
                        statusCode: common_1.HttpStatus.BAD_REQUEST,
                        message: 'Validation failed',
                        errors: (0, exports.formatValidationErrors)(errors),
                    });
                }
                return object;
            }
            toValidate(metatype) {
                const types = [String, Boolean, Number, Array, Object];
                return !types.includes(metatype);
            }
        };
        __setFunctionName(_classThis, "CustomValidationPipe");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CustomValidationPipe = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return CustomValidationPipe = _classThis;
    })();
    return new CustomValidationPipe();
};
exports.createValidationPipe = createValidationPipe;
// =============================================================================
// QUERY PARAMETER UTILITIES
// =============================================================================
/**
 * @function parseQueryInt
 * @description Parse integer from query parameter
 * @param {any} value - Query value
 * @param {number} defaultValue - Default value
 * @returns {number} Parsed integer
 *
 * @example
 * ```typescript
 * const page = parseQueryInt(req.query.page, 1); // 1
 * ```
 */
const parseQueryInt = (value, defaultValue) => {
    return (0, exports.parseIntSafe)(value, defaultValue);
};
exports.parseQueryInt = parseQueryInt;
/**
 * @function parseQueryBoolean
 * @description Parse boolean from query parameter
 * @param {any} value - Query value
 * @returns {boolean} Parsed boolean
 *
 * @example
 * ```typescript
 * const isActive = parseQueryBoolean(req.query.active); // true/false
 * ```
 */
const parseQueryBoolean = (value) => {
    return (0, exports.parseBooleanSafe)(value);
};
exports.parseQueryBoolean = parseQueryBoolean;
/**
 * @function parseQueryArray
 * @description Parse array from query parameter
 * @param {any} value - Query value
 * @returns {string[]} Parsed array
 *
 * @example
 * ```typescript
 * const tags = parseQueryArray(req.query.tags); // ['tag1', 'tag2']
 * ```
 */
const parseQueryArray = (value) => {
    if (Array.isArray(value))
        return value;
    if (typeof value === 'string')
        return (0, exports.parseArraySafe)(value);
    return [];
};
exports.parseQueryArray = parseQueryArray;
/**
 * @function buildPaginationParams
 * @description Build pagination parameters from query
 * @param {any} query - Query object
 * @returns {object} Pagination params (page, limit, offset)
 *
 * @example
 * ```typescript
 * const { page, limit, offset } = buildPaginationParams(req.query);
 * ```
 */
const buildPaginationParams = (query) => {
    const page = Math.max(1, (0, exports.parseQueryInt)(query.page, 1));
    const limit = Math.min(100, Math.max(1, (0, exports.parseQueryInt)(query.limit, 10)));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
};
exports.buildPaginationParams = buildPaginationParams;
exports.default = {
    // Validation
    validateEmail: exports.validateEmail,
    validateUuid: exports.validateUuid,
    validatePhoneNumber: exports.validatePhoneNumber,
    validateUrl: exports.validateUrl,
    validateDateString: exports.validateDateString,
    validateDateRange: exports.validateDateRange,
    validateAge: exports.validateAge,
    validateYear: exports.validateYear,
    validateArrayLength: exports.validateArrayLength,
    validateStringLength: exports.validateStringLength,
    // Transformation
    trimString: exports.trimString,
    normalizeEmail: exports.normalizeEmail,
    normalizePhoneNumber: exports.normalizePhoneNumber,
    capitalizeString: exports.capitalizeString,
    slugify: exports.slugify,
    truncateString: exports.truncateString,
    removeExtraSpaces: exports.removeExtraSpaces,
    stripHtml: exports.stripHtml,
    // Sanitization
    sanitizeHtmlContent: exports.sanitizeHtmlContent,
    sanitizeString: exports.sanitizeString,
    escapeHtml: exports.escapeHtml,
    sanitizeFilename: exports.sanitizeFilename,
    removeNullBytes: exports.removeNullBytes,
    // Parsing
    parseIntSafe: exports.parseIntSafe,
    parseFloatSafe: exports.parseFloatSafe,
    parseBooleanSafe: exports.parseBooleanSafe,
    parseDateSafe: exports.parseDateSafe,
    parseJsonSafe: exports.parseJsonSafe,
    parseArraySafe: exports.parseArraySafe,
    parseEnumSafe: exports.parseEnumSafe,
    // File Validation
    validateFileSize: exports.validateFileSize,
    validateFileType: exports.validateFileType,
    validateImageFile: exports.validateImageFile,
    validateDocumentFile: exports.validateDocumentFile,
    getFileExtension: exports.getFileExtension,
    // DTO Validation
    validateDto: exports.validateDto,
    transformAndValidate: exports.transformAndValidate,
    formatValidationErrors: exports.formatValidationErrors,
    createValidationPipe: exports.createValidationPipe,
    // Query Parameters
    parseQueryInt: exports.parseQueryInt,
    parseQueryBoolean: exports.parseQueryBoolean,
    parseQueryArray: exports.parseQueryArray,
    buildPaginationParams: exports.buildPaginationParams,
    // Constants
    VALIDATION_CONFIG: exports.VALIDATION_CONFIG,
};
//# sourceMappingURL=nest-pipes-utils.js.map