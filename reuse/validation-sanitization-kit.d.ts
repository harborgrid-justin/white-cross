/**
 * LOC: VALSANI001
 * File: /reuse/validation-sanitization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API request validators
 *   - Form validation services
 *   - Input sanitization middleware
 *   - Data transformation pipelines
 *   - Security validation layers
 */
/**
 * File: /reuse/validation-sanitization-kit.ts
 * Locator: WC-UTL-VALSANI-001
 * Purpose: Validation & Sanitization Kit - Comprehensive input validation, sanitization, and security
 *
 * Upstream: Independent utility module for validation and sanitization
 * Downstream: ../backend/*, ../frontend/*, Security middleware, DTO validators
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for schema validation, sanitization, security, custom validators
 *
 * LLM Context: Production-grade validation and sanitization utilities for secure applications.
 * Provides class-validator patterns, XSS/SQL injection prevention, email/phone/URL validation,
 * credit card/SSN validation, async validators, conditional/cross-field validation, file type
 * validation, and data transformation utilities. Essential for security and data integrity.
 */
/**
 * Validation result with detailed error information
 */
export interface ValidationResult<T = any> {
    isValid: boolean;
    value?: T;
    errors?: ValidationError[];
    sanitized?: T;
}
/**
 * Detailed validation error
 */
export interface ValidationError {
    field: string;
    message: string;
    code: string;
    value?: any;
}
/**
 * Schema field definition for validation
 */
export interface SchemaField {
    type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'array' | 'object' | 'phone' | 'creditcard' | 'ssn' | 'custom';
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean | Promise<boolean>;
    sanitize?: boolean;
    message?: string;
    transform?: (value: any) => any;
}
/**
 * Complete validation schema
 */
export interface ValidationSchema {
    [key: string]: SchemaField | ValidationSchema;
}
/**
 * Sanitization options
 */
export interface SanitizationOptions {
    trim?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    removeHtml?: boolean;
    escapeHtml?: boolean;
    removeScripts?: boolean;
    removeSpecialChars?: boolean;
    allowedTags?: string[];
    maxLength?: number;
    stripSql?: boolean;
    normalizeWhitespace?: boolean;
}
/**
 * Email validation options
 */
export interface EmailValidationOptions {
    allowDisplayName?: boolean;
    requireTld?: boolean;
    allowIpDomain?: boolean;
    domainBlacklist?: string[];
    domainWhitelist?: string[];
}
/**
 * Phone validation options
 */
export interface PhoneValidationOptions {
    defaultCountry?: string;
    allowedCountries?: string[];
    requireCountryCode?: boolean;
    format?: 'E164' | 'NATIONAL' | 'INTERNATIONAL';
}
/**
 * URL validation options
 */
export interface URLValidationOptions {
    protocols?: string[];
    requireProtocol?: boolean;
    requireTld?: boolean;
    allowQueryParams?: boolean;
    allowFragments?: boolean;
    allowAuth?: boolean;
    allowLocalhost?: boolean;
    allowPrivateIP?: boolean;
}
/**
 * Date validation options
 */
export interface DateValidationOptions {
    min?: Date | string;
    max?: Date | string;
    allowFuture?: boolean;
    allowPast?: boolean;
    format?: string;
}
/**
 * Credit card validation result
 */
export interface CreditCardValidationResult {
    isValid: boolean;
    type?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unknown';
    luhnValid: boolean;
    formatted?: string;
}
/**
 * File validation options
 */
export interface FileValidationOptions {
    allowedTypes?: string[];
    allowedExtensions?: string[];
    maxSize?: number;
    minSize?: number;
    allowedMimeTypes?: string[];
}
/**
 * Async validator function type
 */
export type AsyncValidator<T = any> = (value: T) => Promise<boolean>;
/**
 * Validator function type
 */
export type Validator<T = any> = (value: T) => boolean;
/**
 * Conditional validator options
 */
export interface ConditionalValidationOptions {
    when: (data: any) => boolean;
    then: SchemaField | Validator<any>;
    otherwise?: SchemaField | Validator<any>;
}
/**
 * Validates data against a schema definition.
 * Supports nested objects, arrays, custom validators, and transformations.
 *
 * @param {any} data - Data to validate
 * @param {ValidationSchema} schema - Validation schema
 * @returns {ValidationResult} Validation result with errors
 *
 * @example
 * ```typescript
 * const schema: ValidationSchema = {
 *   email: { type: 'email', required: true },
 *   age: { type: 'number', min: 18, max: 120 }
 * };
 * const result = validateSchema(userData, schema);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export declare const validateSchema: (data: any, schema: ValidationSchema) => ValidationResult;
/**
 * Validates async schema with support for async validators.
 *
 * @param {any} data - Data to validate
 * @param {ValidationSchema} schema - Validation schema
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const schema: ValidationSchema = {
 *   username: {
 *     type: 'string',
 *     custom: async (val) => await isUsernameAvailable(val)
 *   }
 * };
 * const result = await validateSchemaAsync(userData, schema);
 * ```
 */
export declare const validateSchemaAsync: (data: any, schema: ValidationSchema) => Promise<ValidationResult>;
/**
 * Validates value against a specific type.
 *
 * @param {any} value - Value to validate
 * @param {string} type - Expected type
 * @returns {boolean} True if value matches type
 *
 * @example
 * ```typescript
 * validateType('test@email.com', 'email') // true
 * validateType('invalid', 'email') // false
 * ```
 */
export declare const validateType: (value: any, type: string) => boolean;
/**
 * Sanitizes string input to prevent XSS attacks.
 * Removes or escapes potentially dangerous HTML/JavaScript.
 *
 * @param {string} input - Input string to sanitize
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const safe = sanitizeInput('<script>alert("XSS")</script>Hello');
 * // Returns: 'Hello'
 * ```
 */
export declare const sanitizeInput: (input: string, options?: SanitizationOptions) => string;
/**
 * Escapes HTML special characters to prevent XSS.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 *
 * @example
 * ```typescript
 * const escaped = escapeHtml('<div>Test</div>');
 * // Returns: '&lt;div&gt;Test&lt;/div&gt;'
 * ```
 */
export declare const escapeHtml: (text: string) => string;
/**
 * Unescapes HTML entities back to characters.
 *
 * @param {string} text - Text to unescape
 * @returns {string} Unescaped text
 *
 * @example
 * ```typescript
 * const unescaped = unescapeHtml('&lt;div&gt;Test&lt;/div&gt;');
 * // Returns: '<div>Test</div>'
 * ```
 */
export declare const unescapeHtml: (text: string) => string;
/**
 * Sanitizes SQL input to prevent SQL injection attacks.
 *
 * @param {string} input - SQL input to sanitize
 * @returns {string} Sanitized SQL input
 *
 * @example
 * ```typescript
 * const safe = sanitizeSqlInput("'; DROP TABLE users; --");
 * // Returns: " DROP TABLE users "
 * ```
 */
export declare const sanitizeSqlInput: (input: string) => string;
/**
 * Strips all HTML tags from input, keeping only text content.
 *
 * @param {string} html - HTML string to strip
 * @param {string[]} allowedTags - Optional array of allowed tags
 * @returns {string} Text without HTML tags
 *
 * @example
 * ```typescript
 * const text = stripHtmlTags('<p>Hello <strong>World</strong></p>');
 * // Returns: 'Hello World'
 * ```
 */
export declare const stripHtmlTags: (html: string, allowedTags?: string[]) => string;
/**
 * Sanitizes filename to prevent directory traversal attacks.
 *
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 *
 * @example
 * ```typescript
 * const safe = sanitizeFilename('../../etc/passwd');
 * // Returns: 'etc-passwd'
 * ```
 */
export declare const sanitizeFilename: (filename: string) => string;
/**
 * Validates email address with comprehensive RFC 5322 compliance.
 *
 * @param {string} email - Email address to validate
 * @param {EmailValidationOptions} options - Validation options
 * @returns {boolean} True if email is valid
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid@') // false
 * isValidEmail('user@localhost', { requireTld: false }) // true
 * ```
 */
export declare const isValidEmail: (email: string, options?: EmailValidationOptions) => boolean;
/**
 * Normalizes email address (lowercase, trim).
 *
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email
 *
 * @example
 * ```typescript
 * normalizeEmail('  User@Example.COM  ') // 'user@example.com'
 * ```
 */
export declare const normalizeEmail: (email: string) => string;
/**
 * Extracts domain from email address.
 *
 * @param {string} email - Email address
 * @returns {string | null} Domain or null if invalid
 *
 * @example
 * ```typescript
 * extractEmailDomain('user@example.com') // 'example.com'
 * ```
 */
export declare const extractEmailDomain: (email: string) => string | null;
/**
 * Validates phone number with international format support.
 *
 * @param {string} phone - Phone number to validate
 * @param {PhoneValidationOptions} options - Validation options
 * @returns {boolean} True if phone number is valid
 *
 * @example
 * ```typescript
 * isValidPhoneNumber('+1-555-123-4567') // true
 * isValidPhoneNumber('555-1234', { defaultCountry: 'US' }) // true
 * isValidPhoneNumber('+44 20 7946 0958') // true
 * ```
 */
export declare const isValidPhoneNumber: (phone: string, options?: PhoneValidationOptions) => boolean;
/**
 * Formats phone number to E.164 international format.
 *
 * @param {string} phone - Phone number to format
 * @param {string} countryCode - Country code (e.g., 'US', 'GB')
 * @returns {string | null} Formatted phone or null if invalid
 *
 * @example
 * ```typescript
 * formatPhoneNumber('5551234567', 'US') // '+15551234567'
 * formatPhoneNumber('+1-555-123-4567', 'US') // '+15551234567'
 * ```
 */
export declare const formatPhoneNumber: (phone: string, countryCode?: string) => string | null;
/**
 * Parses phone number into components.
 *
 * @param {string} phone - Phone number to parse
 * @returns {object | null} Parsed components or null
 *
 * @example
 * ```typescript
 * parsePhoneNumber('+1-555-123-4567')
 * // Returns: { countryCode: '1', nationalNumber: '5551234567', ... }
 * ```
 */
export declare const parsePhoneNumber: (phone: string) => {
    countryCode: string;
    nationalNumber: string;
    formatted: string;
} | null;
/**
 * Validates URL with comprehensive options.
 *
 * @param {string} url - URL to validate
 * @param {URLValidationOptions} options - Validation options
 * @returns {boolean} True if URL is valid
 *
 * @example
 * ```typescript
 * isValidURL('https://example.com') // true
 * isValidURL('http://localhost:3000', { allowLocalhost: true }) // true
 * isValidURL('ftp://files.com', { protocols: ['ftp'] }) // true
 * ```
 */
export declare const isValidURL: (url: string, options?: URLValidationOptions) => boolean;
/**
 * Checks if IP address is private/local.
 *
 * @param {string} hostname - Hostname or IP to check
 * @returns {boolean} True if private IP
 *
 * @example
 * ```typescript
 * isPrivateIP('192.168.1.1') // true
 * isPrivateIP('8.8.8.8') // false
 * ```
 */
export declare const isPrivateIP: (hostname: string) => boolean;
/**
 * Normalizes URL (adds protocol, removes trailing slash).
 *
 * @param {string} url - URL to normalize
 * @returns {string | null} Normalized URL or null if invalid
 *
 * @example
 * ```typescript
 * normalizeURL('example.com/path/') // 'https://example.com/path'
 * ```
 */
export declare const normalizeURL: (url: string) => string | null;
/**
 * Validates date with comprehensive options.
 *
 * @param {any} date - Date to validate (Date object, string, or number)
 * @param {DateValidationOptions} options - Validation options
 * @returns {boolean} True if date is valid
 *
 * @example
 * ```typescript
 * isValidDate(new Date()) // true
 * isValidDate('2024-01-01', { allowFuture: false }) // depends on current date
 * isValidDate('2024-12-31', { min: '2024-01-01', max: '2024-12-31' }) // true
 * ```
 */
export declare const isValidDate: (date: any, options?: DateValidationOptions) => boolean;
/**
 * Validates date string format (ISO 8601, custom formats).
 *
 * @param {string} dateString - Date string to validate
 * @param {string} format - Expected format (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY')
 * @returns {boolean} True if format matches
 *
 * @example
 * ```typescript
 * isValidDateFormat('2024-01-01', 'YYYY-MM-DD') // true
 * isValidDateFormat('01/01/2024', 'MM/DD/YYYY') // true
 * ```
 */
export declare const isValidDateFormat: (dateString: string, format?: string) => boolean;
/**
 * Validates time string (24-hour or 12-hour format).
 *
 * @param {string} time - Time string to validate
 * @param {boolean} is24Hour - True for 24-hour format
 * @returns {boolean} True if time is valid
 *
 * @example
 * ```typescript
 * isValidTime('14:30') // true (24-hour)
 * isValidTime('2:30 PM', false) // true (12-hour)
 * ```
 */
export declare const isValidTime: (time: string, is24Hour?: boolean) => boolean;
/**
 * Validates credit card number using Luhn algorithm and card type detection.
 *
 * @param {string} cardNumber - Credit card number to validate
 * @returns {CreditCardValidationResult} Validation result with card type
 *
 * @example
 * ```typescript
 * const result = validateCreditCard('4532015112830366');
 * // Returns: { isValid: true, type: 'visa', luhnValid: true }
 * ```
 */
export declare const validateCreditCard: (cardNumber: string) => CreditCardValidationResult;
/**
 * Validates credit card using Luhn algorithm (mod-10 checksum).
 *
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} True if Luhn check passes
 *
 * @example
 * ```typescript
 * validateLuhn('4532015112830366') // true
 * ```
 */
export declare const validateLuhn: (cardNumber: string) => boolean;
/**
 * Detects credit card type from card number.
 *
 * @param {string} cardNumber - Card number
 * @returns {string} Card type (visa, mastercard, amex, etc.)
 *
 * @example
 * ```typescript
 * detectCardType('4532015112830366') // 'visa'
 * detectCardType('5425233430109903') // 'mastercard'
 * ```
 */
export declare const detectCardType: (cardNumber: string) => "visa" | "mastercard" | "amex" | "discover" | "diners" | "jcb" | "unknown";
/**
 * Formats credit card number with spaces.
 *
 * @param {string} cardNumber - Card number to format
 * @returns {string} Formatted card number
 *
 * @example
 * ```typescript
 * formatCreditCard('4532015112830366') // '4532 0151 1283 0366'
 * ```
 */
export declare const formatCreditCard: (cardNumber: string) => string;
/**
 * Validates US Social Security Number (SSN).
 *
 * @param {string} ssn - SSN to validate
 * @returns {boolean} True if SSN is valid
 *
 * @example
 * ```typescript
 * isValidSSN('123-45-6789') // true
 * isValidSSN('000-00-0000') // false (invalid)
 * ```
 */
export declare const isValidSSN: (ssn: string) => boolean;
/**
 * Validates US Employer Identification Number (EIN).
 *
 * @param {string} ein - EIN to validate
 * @returns {boolean} True if EIN is valid
 *
 * @example
 * ```typescript
 * isValidEIN('12-3456789') // true
 * isValidEIN('00-0000000') // false
 * ```
 */
export declare const isValidEIN: (ein: string) => boolean;
/**
 * Formats SSN with dashes.
 *
 * @param {string} ssn - SSN to format
 * @returns {string | null} Formatted SSN or null if invalid
 *
 * @example
 * ```typescript
 * formatSSN('123456789') // '123-45-6789'
 * ```
 */
export declare const formatSSN: (ssn: string) => string | null;
/**
 * Creates a custom validator function with min/max constraints.
 *
 * @param {Validator<T>} validator - Base validator function
 * @param {object} constraints - Min/max constraints
 * @returns {Validator<T>} Enhanced validator
 *
 * @example
 * ```typescript
 * const ageValidator = createValidator(
 *   (val) => typeof val === 'number',
 *   { min: 18, max: 120 }
 * );
 * ```
 */
export declare const createValidator: <T = any>(validator: Validator<T>, constraints?: {
    min?: number;
    max?: number;
}) => Validator<T>;
/**
 * Creates a regex-based validator.
 *
 * @param {RegExp} pattern - Regex pattern
 * @param {string} errorMessage - Error message
 * @returns {Validator<string>} Validator function
 *
 * @example
 * ```typescript
 * const zipValidator = createRegexValidator(/^\d{5}$/, 'Invalid ZIP code');
 * ```
 */
export declare const createRegexValidator: (pattern: RegExp, errorMessage?: string) => Validator<string>;
/**
 * Creates an enum validator.
 *
 * @param {T[]} allowedValues - Array of allowed values
 * @returns {Validator<T>} Validator function
 *
 * @example
 * ```typescript
 * const statusValidator = createEnumValidator(['active', 'inactive', 'pending']);
 * ```
 */
export declare const createEnumValidator: <T = any>(allowedValues: T[]) => Validator<T>;
/**
 * Creates a length validator for strings or arrays.
 *
 * @param {object} constraints - Min/max length constraints
 * @returns {Validator<string | any[]>} Validator function
 *
 * @example
 * ```typescript
 * const passwordValidator = createLengthValidator({ min: 8, max: 128 });
 * ```
 */
export declare const createLengthValidator: (constraints: {
    min?: number;
    max?: number;
}) => Validator<string | any[]>;
/**
 * Creates an async validator with debounce.
 *
 * @param {AsyncValidator<T>} validator - Async validator function
 * @param {number} delay - Debounce delay in ms
 * @returns {AsyncValidator<T>} Debounced async validator
 *
 * @example
 * ```typescript
 * const checkUsername = createAsyncValidator(
 *   async (username) => await api.checkAvailability(username),
 *   300
 * );
 * ```
 */
export declare const createAsyncValidator: <T = any>(validator: AsyncValidator<T>, delay?: number) => AsyncValidator<T>;
/**
 * Validates value using async validator with timeout.
 *
 * @param {AsyncValidator<T>} validator - Async validator
 * @param {T} value - Value to validate
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<boolean>} Validation result
 *
 * @example
 * ```typescript
 * const isValid = await validateAsync(checkEmail, email, 5000);
 * ```
 */
export declare const validateAsync: <T = any>(validator: AsyncValidator<T>, value: T, timeout?: number) => Promise<boolean>;
/**
 * Creates a conditional validator based on condition.
 *
 * @param {Function} condition - Condition function
 * @param {Validator<T>} thenValidator - Validator if condition is true
 * @param {Validator<T>} elseValidator - Validator if condition is false
 * @returns {Function} Conditional validator
 *
 * @example
 * ```typescript
 * const validator = createConditionalValidator(
 *   (data) => data.type === 'email',
 *   isValidEmail,
 *   isValidPhoneNumber
 * );
 * ```
 */
export declare const createConditionalValidator: <T = any>(condition: (data: any) => boolean, thenValidator: Validator<T>, elseValidator?: Validator<T>) => (value: T, data?: any) => boolean;
/**
 * Validates value only when condition is met.
 *
 * @param {Function} condition - Condition function
 * @param {Validator<T>} validator - Validator to apply
 * @returns {Function} Conditional validator
 *
 * @example
 * ```typescript
 * const validateEmail = validateWhen(
 *   (data) => data.contactMethod === 'email',
 *   isValidEmail
 * );
 * ```
 */
export declare const validateWhen: <T = any>(condition: (data: any) => boolean, validator: Validator<T>) => (value: T, data?: any) => boolean;
/**
 * Validates that two fields match (e.g., password confirmation).
 *
 * @param {any} data - Data object containing fields
 * @param {string} field1 - First field name
 * @param {string} field2 - Second field name
 * @returns {boolean} True if fields match
 *
 * @example
 * ```typescript
 * validateFieldsMatch(formData, 'password', 'confirmPassword')
 * ```
 */
export declare const validateFieldsMatch: (data: any, field1: string, field2: string) => boolean;
/**
 * Validates that at least one field in a group is present.
 *
 * @param {any} data - Data object
 * @param {string[]} fields - Field names
 * @returns {boolean} True if at least one field has a value
 *
 * @example
 * ```typescript
 * validateAtLeastOne(data, ['email', 'phone']) // At least one contact method
 * ```
 */
export declare const validateAtLeastOne: (data: any, fields: string[]) => boolean;
/**
 * Validates that date range is valid (start before end).
 *
 * @param {any} startDate - Start date
 * @param {any} endDate - End date
 * @returns {boolean} True if range is valid
 *
 * @example
 * ```typescript
 * validateDateRange(formData.startDate, formData.endDate)
 * ```
 */
export declare const validateDateRange: (startDate: any, endDate: any) => boolean;
/**
 * Creates a cross-field validator.
 *
 * @param {Function} validator - Validator function receiving full data
 * @returns {Function} Cross-field validator
 *
 * @example
 * ```typescript
 * const validator = createCrossFieldValidator((data) => {
 *   return data.password === data.confirmPassword;
 * });
 * ```
 */
export declare const createCrossFieldValidator: (validator: (data: any) => boolean) => (data: any) => boolean;
/**
 * Validates that all items in array pass validator.
 *
 * @param {any[]} array - Array to validate
 * @param {Validator<T>} validator - Validator for each item
 * @returns {boolean} True if all items are valid
 *
 * @example
 * ```typescript
 * validateArray(emails, isValidEmail) // All emails valid
 * ```
 */
export declare const validateArray: <T = any>(array: any[], validator: Validator<T>) => boolean;
/**
 * Validates array length constraints.
 *
 * @param {any[]} array - Array to validate
 * @param {object} constraints - Min/max length constraints
 * @returns {boolean} True if array length is valid
 *
 * @example
 * ```typescript
 * validateArrayLength(items, { min: 1, max: 10 })
 * ```
 */
export declare const validateArrayLength: (array: any[], constraints: {
    min?: number;
    max?: number;
}) => boolean;
/**
 * Validates that all items in array are unique.
 *
 * @param {any[]} array - Array to validate
 * @param {Function} keyExtractor - Optional key extractor for objects
 * @returns {boolean} True if all items are unique
 *
 * @example
 * ```typescript
 * validateArrayUnique([1, 2, 3]) // true
 * validateArrayUnique([{ id: 1 }, { id: 2 }], item => item.id) // true
 * ```
 */
export declare const validateArrayUnique: <T = any>(array: T[], keyExtractor?: (item: T) => any) => boolean;
/**
 * Validates object has required keys.
 *
 * @param {object} obj - Object to validate
 * @param {string[]} requiredKeys - Required key names
 * @returns {boolean} True if all required keys present
 *
 * @example
 * ```typescript
 * validateObjectKeys(user, ['id', 'email', 'name'])
 * ```
 */
export declare const validateObjectKeys: (obj: any, requiredKeys: string[]) => boolean;
/**
 * Validates file based on type, size, and extension.
 *
 * @param {File} file - File object to validate
 * @param {FileValidationOptions} options - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFile(uploadedFile, {
 *   allowedTypes: ['image/jpeg', 'image/png'],
 *   maxSize: 5 * 1024 * 1024 // 5MB
 * });
 * ```
 */
export declare const validateFile: (file: File, options?: FileValidationOptions) => ValidationResult;
/**
 * Validates file is an image and optionally checks dimensions.
 *
 * @param {File} file - Image file
 * @param {object} options - Width/height constraints
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateImageFile(file, {
 *   minWidth: 800,
 *   maxWidth: 3000,
 *   minHeight: 600
 * });
 * ```
 */
export declare const validateImageFile: (file: File, options?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}) => Promise<ValidationResult>;
/**
 * Transforms and validates data using schema.
 *
 * @param {any} data - Data to transform
 * @param {ValidationSchema} schema - Schema with transform functions
 * @returns {ValidationResult} Transformed data
 *
 * @example
 * ```typescript
 * const schema = {
 *   email: { type: 'email', transform: (v) => v.toLowerCase() },
 *   age: { type: 'number', transform: (v) => parseInt(v) }
 * };
 * const result = transformData(rawData, schema);
 * ```
 */
export declare const transformData: (data: any, schema: ValidationSchema) => ValidationResult;
/**
 * Strips unknown fields from object based on schema.
 *
 * @param {any} data - Data object
 * @param {ValidationSchema} schema - Validation schema
 * @returns {any} Object with only known fields
 *
 * @example
 * ```typescript
 * const clean = stripUnknownFields(userData, userSchema);
 * // Only fields defined in schema are kept
 * ```
 */
export declare const stripUnknownFields: (data: any, schema: ValidationSchema) => any;
/**
 * Converts empty strings to null in object.
 *
 * @param {any} data - Data object
 * @returns {any} Object with empty strings converted to null
 *
 * @example
 * ```typescript
 * const cleaned = emptyStringsToNull({ name: '', age: 25 });
 * // Returns: { name: null, age: 25 }
 * ```
 */
export declare const emptyStringsToNull: (data: any) => any;
/**
 * Trims all string values in object recursively.
 *
 * @param {any} data - Data object
 * @returns {any} Object with trimmed strings
 *
 * @example
 * ```typescript
 * const trimmed = trimObjectStrings({ name: '  John  ', nested: { value: '  test  ' } });
 * // Returns: { name: 'John', nested: { value: 'test' } }
 * ```
 */
export declare const trimObjectStrings: (data: any) => any;
//# sourceMappingURL=validation-sanitization-kit.d.ts.map