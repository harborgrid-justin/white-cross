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
import { PipeTransform } from '@nestjs/common';
import { ValidationError, ValidatorOptions } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';
/**
 * Validation configuration constants
 */
export declare const VALIDATION_CONFIG: {
    readonly EMAIL_MAX_LENGTH: 254;
    readonly PHONE_MIN_LENGTH: 10;
    readonly PHONE_MAX_LENGTH: 15;
    readonly STRING_MAX_LENGTH: 1000;
    readonly TEXT_MAX_LENGTH: 10000;
    readonly ARRAY_MAX_SIZE: 1000;
    readonly FILE_MAX_SIZE: 10485760;
    readonly IMAGE_MAX_SIZE: 5242880;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp"];
    readonly ALLOWED_DOCUMENT_TYPES: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    readonly UUID_VERSION: 4;
    readonly MIN_AGE: 0;
    readonly MAX_AGE: 150;
    readonly MIN_YEAR: 1900;
    readonly MAX_YEAR: 2100;
};
/**
 * File validation result interface
 */
export interface FileValidationResult {
    isValid: boolean;
    errors: string[];
    file?: Express.Multer.File;
}
/**
 * Parse result interface
 */
export interface ParseResult<T> {
    value: T;
    isValid: boolean;
    error?: string;
}
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
export declare const validateEmail: (email: string) => boolean;
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
export declare const validateUuid: (uuid: string) => boolean;
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
export declare const validatePhoneNumber: (phone: string) => boolean;
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
export declare const validateUrl: (url: string) => boolean;
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
export declare const validateDateString: (dateString: string) => boolean;
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
export declare const validateDateRange: (date: Date, minDate?: Date, maxDate?: Date) => boolean;
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
export declare const validateAge: (age: number) => boolean;
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
export declare const validateYear: (year: number) => boolean;
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
export declare const validateArrayLength: (array: any[], minLength?: number, maxLength?: number) => boolean;
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
export declare const validateStringLength: (str: string, minLength?: number, maxLength?: number) => boolean;
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
export declare const trimString: (str: string) => string;
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
export declare const normalizeEmail: (email: string) => string;
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
export declare const normalizePhoneNumber: (phone: string) => string;
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
export declare const capitalizeString: (str: string) => string;
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
export declare const slugify: (str: string) => string;
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
export declare const truncateString: (str: string, maxLength: number, suffix?: string) => string;
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
export declare const removeExtraSpaces: (str: string) => string;
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
export declare const stripHtml: (html: string) => string;
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
export declare const sanitizeHtmlContent: (html: string, options?: sanitizeHtml.IOptions) => string;
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
export declare const sanitizeString: (str: string) => string;
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
export declare const escapeHtml: (str: string) => string;
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
export declare const sanitizeFilename: (filename: string) => string;
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
export declare const removeNullBytes: (str: string) => string;
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
export declare const parseIntSafe: (value: string | number, defaultValue?: number) => number;
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
export declare const parseFloatSafe: (value: string | number, defaultValue?: number) => number;
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
export declare const parseBooleanSafe: (value: string | boolean) => boolean;
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
export declare const parseDateSafe: (value: string | Date, defaultValue?: Date) => Date;
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
export declare const parseJsonSafe: <T = any>(json: string, defaultValue?: T) => T;
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
export declare const parseArraySafe: (value: string | any[], delimiter?: string) => any[];
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
export declare const parseEnumSafe: <T>(value: string, enumType: T, defaultValue: T[keyof T]) => T[keyof T];
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
export declare const validateFileSize: (size: number, maxSize: number) => boolean;
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
export declare const validateFileType: (mimeType: string, allowedTypes: string[]) => boolean;
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
export declare const validateImageFile: (file: Express.Multer.File) => FileValidationResult;
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
export declare const validateDocumentFile: (file: Express.Multer.File) => FileValidationResult;
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
export declare const getFileExtension: (filename: string) => string;
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
export declare const validateDto: (dto: any, options?: ValidatorOptions) => Promise<ValidationError[]>;
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
export declare const transformAndValidate: <T extends object>(classType: new (...args: any[]) => T, plain: object) => Promise<T>;
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
export declare const formatValidationErrors: (errors: ValidationError[]) => Record<string, string[]>;
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
export declare const createValidationPipe: (options?: ValidatorOptions) => PipeTransform;
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
export declare const parseQueryInt: (value: any, defaultValue: number) => number;
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
export declare const parseQueryBoolean: (value: any) => boolean;
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
export declare const parseQueryArray: (value: any) => string[];
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
export declare const buildPaginationParams: (query: any) => {
    page: number;
    limit: number;
    offset: number;
};
declare const _default: {
    validateEmail: (email: string) => boolean;
    validateUuid: (uuid: string) => boolean;
    validatePhoneNumber: (phone: string) => boolean;
    validateUrl: (url: string) => boolean;
    validateDateString: (dateString: string) => boolean;
    validateDateRange: (date: Date, minDate?: Date, maxDate?: Date) => boolean;
    validateAge: (age: number) => boolean;
    validateYear: (year: number) => boolean;
    validateArrayLength: (array: any[], minLength?: number, maxLength?: number) => boolean;
    validateStringLength: (str: string, minLength?: number, maxLength?: number) => boolean;
    trimString: (str: string) => string;
    normalizeEmail: (email: string) => string;
    normalizePhoneNumber: (phone: string) => string;
    capitalizeString: (str: string) => string;
    slugify: (str: string) => string;
    truncateString: (str: string, maxLength: number, suffix?: string) => string;
    removeExtraSpaces: (str: string) => string;
    stripHtml: (html: string) => string;
    sanitizeHtmlContent: (html: string, options?: sanitizeHtml.IOptions) => string;
    sanitizeString: (str: string) => string;
    escapeHtml: (str: string) => string;
    sanitizeFilename: (filename: string) => string;
    removeNullBytes: (str: string) => string;
    parseIntSafe: (value: string | number, defaultValue?: number) => number;
    parseFloatSafe: (value: string | number, defaultValue?: number) => number;
    parseBooleanSafe: (value: string | boolean) => boolean;
    parseDateSafe: (value: string | Date, defaultValue?: Date) => Date;
    parseJsonSafe: <T = any>(json: string, defaultValue?: T) => T;
    parseArraySafe: (value: string | any[], delimiter?: string) => any[];
    parseEnumSafe: <T>(value: string, enumType: T, defaultValue: T[keyof T]) => T[keyof T];
    validateFileSize: (size: number, maxSize: number) => boolean;
    validateFileType: (mimeType: string, allowedTypes: string[]) => boolean;
    validateImageFile: (file: Express.Multer.File) => FileValidationResult;
    validateDocumentFile: (file: Express.Multer.File) => FileValidationResult;
    getFileExtension: (filename: string) => string;
    validateDto: (dto: any, options?: ValidatorOptions) => Promise<ValidationError[]>;
    transformAndValidate: <T extends object>(classType: new (...args: any[]) => T, plain: object) => Promise<T>;
    formatValidationErrors: (errors: ValidationError[]) => Record<string, string[]>;
    createValidationPipe: (options?: ValidatorOptions) => PipeTransform;
    parseQueryInt: (value: any, defaultValue: number) => number;
    parseQueryBoolean: (value: any) => boolean;
    parseQueryArray: (value: any) => string[];
    buildPaginationParams: (query: any) => {
        page: number;
        limit: number;
        offset: number;
    };
    VALIDATION_CONFIG: {
        readonly EMAIL_MAX_LENGTH: 254;
        readonly PHONE_MIN_LENGTH: 10;
        readonly PHONE_MAX_LENGTH: 15;
        readonly STRING_MAX_LENGTH: 1000;
        readonly TEXT_MAX_LENGTH: 10000;
        readonly ARRAY_MAX_SIZE: 1000;
        readonly FILE_MAX_SIZE: 10485760;
        readonly IMAGE_MAX_SIZE: 5242880;
        readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp"];
        readonly ALLOWED_DOCUMENT_TYPES: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        readonly UUID_VERSION: 4;
        readonly MIN_AGE: 0;
        readonly MAX_AGE: 150;
        readonly MIN_YEAR: 1900;
        readonly MAX_YEAR: 2100;
    };
};
export default _default;
//# sourceMappingURL=nest-pipes-utils.d.ts.map