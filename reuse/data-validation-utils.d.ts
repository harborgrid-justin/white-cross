/**
 * LOC: VAL1234567
 * File: /reuse/data-validation-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Input validation middleware
 *   - DTO validation decorators
 *   - API request validators
 *   - Form validation services
 *   - HIPAA compliance modules
 */
/**
 * File: /reuse/data-validation-utils.ts
 * Locator: WC-UTL-VAL-003
 * Purpose: Data Validation Utilities - Comprehensive validation, sanitization, and type guards
 *
 * Upstream: Independent utility module for data validation
 * Downstream: ../backend/*, ../frontend/*, Validation middleware, DTO classes
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for schema validation, type guards, sanitization, HIPAA compliance
 *
 * LLM Context: Comprehensive data validation utilities for White Cross healthcare system.
 * Provides schema validation patterns (Joi, Yup, Zod-like), type guards, email/phone/URL validators,
 * credit card validation, date/time validation, custom decorators, array/object validation,
 * conditional/cross-field validation, sanitization, and HIPAA data validation patterns.
 * Essential for data integrity and compliance in healthcare applications.
 */
interface ValidationResult {
    isValid: boolean;
    errors?: string[];
    value?: any;
}
interface SchemaField {
    type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'array' | 'object';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean;
    message?: string;
}
interface Schema {
    [key: string]: SchemaField | Schema;
}
interface SanitizationOptions {
    trim?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    removeHtml?: boolean;
    removeSpecialChars?: boolean;
    maxLength?: number;
}
interface HIPAAValidationContext {
    allowPHI: boolean;
    requireEncryption: boolean;
    auditLog?: boolean;
}
interface CreditCardInfo {
    type: string;
    valid: boolean;
    luhnValid: boolean;
}
interface DateValidationOptions {
    min?: Date;
    max?: Date;
    allowFuture?: boolean;
    allowPast?: boolean;
}
/**
 * Type guard to check if value is a string.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a string
 *
 * @example
 * ```typescript
 * if (isString(userInput)) {
 *   console.log(userInput.toUpperCase());
 * }
 * ```
 */
export declare const isString: (value: any) => value is string;
/**
 * Type guard to check if value is a number (not NaN).
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a valid number
 *
 * @example
 * ```typescript
 * if (isNumber(userInput)) {
 *   console.log(userInput.toFixed(2));
 * }
 * ```
 */
export declare const isNumber: (value: any) => value is number;
/**
 * Type guard to check if value is a boolean.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a boolean
 *
 * @example
 * ```typescript
 * if (isBoolean(value)) {
 *   console.log(value ? 'Yes' : 'No');
 * }
 * ```
 */
export declare const isBoolean: (value: any) => value is boolean;
/**
 * Type guard to check if value is a valid Date object.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a valid Date
 *
 * @example
 * ```typescript
 * if (isDate(userInput)) {
 *   console.log(userInput.toISOString());
 * }
 * ```
 */
export declare const isDate: (value: any) => value is Date;
/**
 * Type guard to check if value is an array.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is an array
 *
 * @example
 * ```typescript
 * if (isArray(value)) {
 *   console.log(`Array length: ${value.length}`);
 * }
 * ```
 */
export declare const isArray: (value: any) => value is any[];
/**
 * Type guard to check if value is a plain object.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a plain object
 *
 * @example
 * ```typescript
 * if (isObject(value)) {
 *   console.log(Object.keys(value));
 * }
 * ```
 */
export declare const isObject: (value: any) => value is Record<string, any>;
/**
 * Type guard to check if value is null or undefined.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is null or undefined
 *
 * @example
 * ```typescript
 * if (!isNullOrUndefined(value)) {
 *   processValue(value);
 * }
 * ```
 */
export declare const isNullOrUndefined: (value: any) => value is null | undefined;
/**
 * Type guard to check if value is empty (null, undefined, empty string, empty array, empty object).
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is empty
 *
 * @example
 * ```typescript
 * if (isEmpty(userInput)) {
 *   throw new Error('Input cannot be empty');
 * }
 * ```
 */
export declare const isEmpty: (value: any) => boolean;
/**
 * Validates email address format using comprehensive regex.
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid.email'); // false
 * isValidEmail('user+tag@sub.example.co.uk'); // true
 * ```
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Validates US phone number format (various formats supported).
 *
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid US format
 *
 * @example
 * ```typescript
 * isValidPhone('(555) 123-4567'); // true
 * isValidPhone('555-123-4567'); // true
 * isValidPhone('5551234567'); // true
 * isValidPhone('123-4567'); // false
 * ```
 */
export declare const isValidPhone: (phone: string) => boolean;
/**
 * Validates URL format with optional protocol requirement.
 *
 * @param {string} url - URL to validate
 * @param {boolean} [requireProtocol] - Require http/https protocol (default: true)
 * @returns {boolean} True if URL is valid
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com'); // true
 * isValidUrl('http://sub.example.com/path?query=1'); // true
 * isValidUrl('example.com', false); // true
 * isValidUrl('example.com', true); // false
 * ```
 */
export declare const isValidUrl: (url: string, requireProtocol?: boolean) => boolean;
/**
 * Validates international phone number using E.164 format.
 *
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone matches E.164 format
 *
 * @example
 * ```typescript
 * isValidInternationalPhone('+12025550123'); // true
 * isValidInternationalPhone('+441234567890'); // true
 * isValidInternationalPhone('555-1234'); // false
 * ```
 */
export declare const isValidInternationalPhone: (phone: string) => boolean;
/**
 * Validates credit card number using Luhn algorithm.
 *
 * @param {string} cardNumber - Credit card number (with or without spaces/dashes)
 * @returns {boolean} True if card passes Luhn check
 *
 * @example
 * ```typescript
 * isValidCreditCard('4532-1488-0343-6467'); // true (Visa)
 * isValidCreditCard('5425233430109903'); // true (Mastercard)
 * isValidCreditCard('1234567890123456'); // false
 * ```
 */
export declare const isValidCreditCard: (cardNumber: string) => boolean;
/**
 * Detects credit card type and validates format.
 *
 * @param {string} cardNumber - Credit card number
 * @returns {CreditCardInfo} Card type, validity, and Luhn check result
 *
 * @example
 * ```typescript
 * getCreditCardType('4532148803436467');
 * // { type: 'Visa', valid: true, luhnValid: true }
 *
 * getCreditCardType('5425233430109903');
 * // { type: 'Mastercard', valid: true, luhnValid: true }
 * ```
 */
export declare const getCreditCardType: (cardNumber: string) => CreditCardInfo;
/**
 * Validates CVV/CVC code based on card type.
 *
 * @param {string} cvv - CVV/CVC code
 * @param {string} [cardType] - Card type (e.g., 'Visa', 'American Express')
 * @returns {boolean} True if CVV is valid for card type
 *
 * @example
 * ```typescript
 * isValidCVV('123', 'Visa'); // true
 * isValidCVV('1234', 'American Express'); // true
 * isValidCVV('12', 'Visa'); // false
 * ```
 */
export declare const isValidCVV: (cvv: string, cardType?: string) => boolean;
/**
 * Validates date string and checks if parseable.
 *
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if date is valid and parseable
 *
 * @example
 * ```typescript
 * isValidDateString('2024-03-15'); // true
 * isValidDateString('2024-13-45'); // false
 * isValidDateString('March 15, 2024'); // true
 * ```
 */
export declare const isValidDateString: (dateString: string) => boolean;
/**
 * Validates date against min/max bounds and future/past constraints.
 *
 * @param {Date} date - Date to validate
 * @param {DateValidationOptions} [options] - Validation options
 * @returns {ValidationResult} Validation result with errors if any
 *
 * @example
 * ```typescript
 * validateDate(new Date('2024-03-15'), {
 *   min: new Date('2024-01-01'),
 *   max: new Date('2024-12-31'),
 *   allowFuture: true
 * });
 * // { isValid: true }
 * ```
 */
export declare const validateDate: (date: Date, options?: DateValidationOptions) => ValidationResult;
/**
 * Validates if date is within a specific age range.
 *
 * @param {Date} birthDate - Birth date to validate
 * @param {number} minAge - Minimum age
 * @param {number} [maxAge] - Maximum age (optional)
 * @returns {boolean} True if age is within range
 *
 * @example
 * ```typescript
 * const birthDate = new Date('2000-01-01');
 * isValidAge(birthDate, 18); // true (if older than 18)
 * isValidAge(birthDate, 18, 65); // true (if between 18-65)
 * ```
 */
export declare const isValidAge: (birthDate: Date, minAge: number, maxAge?: number) => boolean;
/**
 * Validates ISO 8601 date format.
 *
 * @param {string} dateString - ISO date string to validate
 * @returns {boolean} True if valid ISO 8601 format
 *
 * @example
 * ```typescript
 * isValidISODate('2024-03-15T10:30:00Z'); // true
 * isValidISODate('2024-03-15T10:30:00.123Z'); // true
 * isValidISODate('2024-03-15'); // true
 * isValidISODate('15-03-2024'); // false
 * ```
 */
export declare const isValidISODate: (dateString: string) => boolean;
/**
 * Validates value against a schema field definition.
 *
 * @param {any} value - Value to validate
 * @param {SchemaField} field - Schema field definition
 * @param {string} fieldName - Field name for error messages
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * validateField('test@example.com', {
 *   type: 'email',
 *   required: true
 * }, 'email');
 * // { isValid: true, value: 'test@example.com' }
 * ```
 */
export declare const validateField: (value: any, field: SchemaField, fieldName: string) => ValidationResult;
/**
 * Validates object against schema definition.
 *
 * @param {any} data - Data object to validate
 * @param {Schema} schema - Schema definition
 * @returns {ValidationResult} Validation result with all errors
 *
 * @example
 * ```typescript
 * const schema = {
 *   email: { type: 'email', required: true },
 *   age: { type: 'number', min: 18, max: 120 },
 *   website: { type: 'url', required: false }
 * };
 *
 * validateSchema({ email: 'user@example.com', age: 25 }, schema);
 * // { isValid: true, value: { email: 'user@example.com', age: 25 } }
 * ```
 */
export declare const validateSchema: (data: any, schema: Schema) => ValidationResult;
/**
 * Creates a reusable validator function from schema.
 *
 * @param {Schema} schema - Schema definition
 * @returns {Function} Validator function
 *
 * @example
 * ```typescript
 * const validateUser = createValidator({
 *   email: { type: 'email', required: true },
 *   age: { type: 'number', min: 18 }
 * });
 *
 * const result = validateUser({ email: 'user@example.com', age: 25 });
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export declare const createValidator: (schema: Schema) => (data: any) => ValidationResult;
/**
 * Validates all elements in array against a validation function.
 *
 * @param {any[]} arr - Array to validate
 * @param {Function} validator - Validation function for each element
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * validateArray([1, 2, 3, 4], (x) => x > 0);
 * // { isValid: true, value: [1, 2, 3, 4] }
 *
 * validateArray([1, -2, 3], (x) => x > 0);
 * // { isValid: false, errors: ['Element at index 1 is invalid'] }
 * ```
 */
export declare const validateArray: (arr: any[], validator: (item: any, index: number) => boolean) => ValidationResult;
/**
 * Validates array has unique elements.
 *
 * @param {any[]} arr - Array to validate
 * @param {Function} [keyExtractor] - Optional function to extract comparison key
 * @returns {boolean} True if all elements are unique
 *
 * @example
 * ```typescript
 * hasUniqueElements([1, 2, 3, 4]); // true
 * hasUniqueElements([1, 2, 2, 3]); // false
 *
 * hasUniqueElements(
 *   [{ id: 1 }, { id: 2 }, { id: 1 }],
 *   (item) => item.id
 * ); // false
 * ```
 */
export declare const hasUniqueElements: (arr: any[], keyExtractor?: (item: any) => any) => boolean;
/**
 * Validates object has required keys.
 *
 * @param {object} obj - Object to validate
 * @param {string[]} requiredKeys - Required key names
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * validateRequiredKeys({ name: 'John', age: 30 }, ['name', 'age']);
 * // { isValid: true }
 *
 * validateRequiredKeys({ name: 'John' }, ['name', 'age', 'email']);
 * // { isValid: false, errors: ['Missing required keys: age, email'] }
 * ```
 */
export declare const validateRequiredKeys: (obj: any, requiredKeys: string[]) => ValidationResult;
/**
 * Validates object only contains allowed keys.
 *
 * @param {object} obj - Object to validate
 * @param {string[]} allowedKeys - Allowed key names
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * validateAllowedKeys({ name: 'John', age: 30 }, ['name', 'age', 'email']);
 * // { isValid: true }
 *
 * validateAllowedKeys({ name: 'John', hacker: 'data' }, ['name', 'age']);
 * // { isValid: false, errors: ['Unexpected keys: hacker'] }
 * ```
 */
export declare const validateAllowedKeys: (obj: any, allowedKeys: string[]) => ValidationResult;
/**
 * Validates value conditionally based on predicate.
 *
 * @param {any} value - Value to validate
 * @param {Function} condition - Condition to check
 * @param {Function} validator - Validator to apply if condition is true
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const data = { type: 'email', value: 'user@example.com' };
 * validateWhen(
 *   data.value,
 *   () => data.type === 'email',
 *   (val) => isValidEmail(val)
 * );
 * // { isValid: true, value: 'user@example.com' }
 * ```
 */
export declare const validateWhen: (value: any, condition: () => boolean, validator: (value: any) => boolean) => ValidationResult;
/**
 * Validates value is one of allowed options.
 *
 * @param {any} value - Value to validate
 * @param {any[]} options - Allowed options
 * @returns {boolean} True if value is in options
 *
 * @example
 * ```typescript
 * validateOneOf('admin', ['admin', 'user', 'guest']); // true
 * validateOneOf('superuser', ['admin', 'user', 'guest']); // false
 * ```
 */
export declare const validateOneOf: (value: any, options: any[]) => boolean;
/**
 * Validates two fields match (e.g., password confirmation).
 *
 * @param {any} value1 - First value
 * @param {any} value2 - Second value
 * @param {string} [fieldName] - Field name for error message
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * validateFieldsMatch('password123', 'password123', 'password');
 * // { isValid: true }
 *
 * validateFieldsMatch('password123', 'different', 'password');
 * // { isValid: false, errors: ['password fields do not match'] }
 * ```
 */
export declare const validateFieldsMatch: (value1: any, value2: any, fieldName?: string) => ValidationResult;
/**
 * Validates date range (start date before end date).
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * validateDateRange(new Date('2024-01-01'), new Date('2024-12-31'));
 * // { isValid: true }
 *
 * validateDateRange(new Date('2024-12-31'), new Date('2024-01-01'));
 * // { isValid: false, errors: ['End date must be after start date'] }
 * ```
 */
export declare const validateDateRange: (startDate: Date, endDate: Date) => ValidationResult;
/**
 * Validates dependent fields (if field A exists, field B is required).
 *
 * @param {any} data - Data object
 * @param {string} sourceField - Source field name
 * @param {string} dependentField - Dependent field name
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * validateDependentField(
 *   { hasShipping: true, shippingAddress: '123 Main St' },
 *   'hasShipping',
 *   'shippingAddress'
 * );
 * // { isValid: true }
 * ```
 */
export declare const validateDependentField: (data: any, sourceField: string, dependentField: string) => ValidationResult;
/**
 * Sanitizes string input with various options.
 *
 * @param {string} input - Input string to sanitize
 * @param {SanitizationOptions} [options] - Sanitization options
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * sanitizeString('  Hello World  ', { trim: true });
 * // 'Hello World'
 *
 * sanitizeString('Hello World', { uppercase: true });
 * // 'HELLO WORLD'
 *
 * sanitizeString('<script>alert("xss")</script>', { removeHtml: true });
 * // 'alert("xss")'
 * ```
 */
export declare const sanitizeString: (input: string, options?: SanitizationOptions) => string;
/**
 * Sanitizes email address (trim, lowercase).
 *
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 *
 * @example
 * ```typescript
 * sanitizeEmail('  User@EXAMPLE.com  ');
 * // 'user@example.com'
 * ```
 */
export declare const sanitizeEmail: (email: string) => string;
/**
 * Sanitizes phone number (remove non-digits except +).
 *
 * @param {string} phone - Phone number to sanitize
 * @returns {string} Sanitized phone number
 *
 * @example
 * ```typescript
 * sanitizePhone('(555) 123-4567');
 * // '5551234567'
 *
 * sanitizePhone('+1 (555) 123-4567');
 * // '+15551234567'
 * ```
 */
export declare const sanitizePhone: (phone: string) => string;
/**
 * Removes potentially dangerous characters from input.
 *
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 *
 * @example
 * ```typescript
 * removeDangerousChars('<script>alert("xss")</script>');
 * // 'scriptalert"xss"/script'
 * ```
 */
export declare const removeDangerousChars: (input: string) => string;
/**
 * Escapes HTML special characters.
 *
 * @param {string} input - Input to escape
 * @returns {string} Escaped string
 *
 * @example
 * ```typescript
 * escapeHtml('<div>Hello & goodbye</div>');
 * // '&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;'
 * ```
 */
export declare const escapeHtml: (input: string) => string;
/**
 * Validates and sanitizes Protected Health Information (PHI).
 *
 * @param {any} data - Data to validate
 * @param {HIPAAValidationContext} context - HIPAA validation context
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * validatePHI(
 *   { patientName: 'John Doe', ssn: '123-45-6789' },
 *   { allowPHI: true, requireEncryption: true }
 * );
 * // { isValid: true, value: { patientName: 'John Doe', ssn: '***-**-6789' } }
 * ```
 */
export declare const validatePHI: (data: any, context: HIPAAValidationContext) => ValidationResult;
/**
 * Validates Social Security Number (SSN) format.
 *
 * @param {string} ssn - SSN to validate
 * @param {boolean} [allowMasked] - Allow partially masked SSNs
 * @returns {boolean} True if SSN is valid format
 *
 * @example
 * ```typescript
 * isValidSSN('123-45-6789'); // true
 * isValidSSN('***-**-6789', true); // true (masked)
 * isValidSSN('123456789'); // true
 * isValidSSN('123-45-678'); // false
 * ```
 */
export declare const isValidSSN: (ssn: string, allowMasked?: boolean) => boolean;
/**
 * Masks sensitive data for logging/display.
 *
 * @param {string} value - Value to mask
 * @param {number} [visibleChars] - Number of characters to keep visible at end
 * @returns {string} Masked value
 *
 * @example
 * ```typescript
 * maskSensitiveData('123-45-6789', 4);
 * // '***-**-6789'
 *
 * maskSensitiveData('4532148803436467', 4);
 * // '************6467'
 * ```
 */
export declare const maskSensitiveData: (value: string, visibleChars?: number) => string;
/**
 * Validates Medical Record Number (MRN) format.
 *
 * @param {string} mrn - MRN to validate
 * @param {RegExp} [pattern] - Custom MRN pattern (default: alphanumeric)
 * @returns {boolean} True if MRN is valid
 *
 * @example
 * ```typescript
 * isValidMRN('MRN12345678'); // true
 * isValidMRN('12-345-678', /^\d{2}-\d{3}-\d{3}$/); // true
 * ```
 */
export declare const isValidMRN: (mrn: string, pattern?: RegExp) => boolean;
/**
 * Validates password strength with configurable requirements.
 *
 * @param {string} password - Password to validate
 * @param {object} [requirements] - Password requirements
 * @returns {ValidationResult} Validation result with specific errors
 *
 * @example
 * ```typescript
 * validatePasswordStrength('MyP@ssw0rd', {
 *   minLength: 8,
 *   requireUppercase: true,
 *   requireLowercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true
 * });
 * // { isValid: true, value: 'MyP@ssw0rd' }
 * ```
 */
export declare const validatePasswordStrength: (password: string, requirements?: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
}) => ValidationResult;
/**
 * Validates IPv4 address format.
 *
 * @param {string} ip - IP address to validate
 * @returns {boolean} True if valid IPv4 address
 *
 * @example
 * ```typescript
 * isValidIPv4('192.168.1.1'); // true
 * isValidIPv4('255.255.255.255'); // true
 * isValidIPv4('256.1.1.1'); // false
 * isValidIPv4('192.168.1'); // false
 * ```
 */
export declare const isValidIPv4: (ip: string) => boolean;
/**
 * Validates IPv6 address format.
 *
 * @param {string} ip - IP address to validate
 * @returns {boolean} True if valid IPv6 address
 *
 * @example
 * ```typescript
 * isValidIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // true
 * isValidIPv6('2001:db8:85a3::8a2e:370:7334'); // true
 * isValidIPv6('::1'); // true (localhost)
 * ```
 */
export declare const isValidIPv6: (ip: string) => boolean;
/**
 * Validates MAC address format.
 *
 * @param {string} mac - MAC address to validate
 * @param {string} [separator] - Separator character (default: ':' or '-')
 * @returns {boolean} True if valid MAC address
 *
 * @example
 * ```typescript
 * isValidMACAddress('00:1A:2B:3C:4D:5E'); // true
 * isValidMACAddress('00-1A-2B-3C-4D-5E'); // true
 * isValidMACAddress('001A.2B3C.4D5E'); // false
 * ```
 */
export declare const isValidMACAddress: (mac: string, separator?: string) => boolean;
/**
 * Validates US Zip Code format (5-digit or ZIP+4).
 *
 * @param {string} zipCode - Zip code to validate
 * @param {boolean} [requireExtended] - Require ZIP+4 format
 * @returns {boolean} True if valid US zip code
 *
 * @example
 * ```typescript
 * isValidZipCode('12345'); // true
 * isValidZipCode('12345-6789'); // true
 * isValidZipCode('12345-6789', true); // true (ZIP+4)
 * isValidZipCode('12345', true); // false (requires ZIP+4)
 * ```
 */
export declare const isValidZipCode: (zipCode: string, requireExtended?: boolean) => boolean;
declare const _default: {
    isString: (value: any) => value is string;
    isNumber: (value: any) => value is number;
    isBoolean: (value: any) => value is boolean;
    isDate: (value: any) => value is Date;
    isArray: (value: any) => value is any[];
    isObject: (value: any) => value is Record<string, any>;
    isNullOrUndefined: (value: any) => value is null | undefined;
    isEmpty: (value: any) => boolean;
    isValidEmail: (email: string) => boolean;
    isValidPhone: (phone: string) => boolean;
    isValidUrl: (url: string, requireProtocol?: boolean) => boolean;
    isValidInternationalPhone: (phone: string) => boolean;
    isValidCreditCard: (cardNumber: string) => boolean;
    getCreditCardType: (cardNumber: string) => CreditCardInfo;
    isValidCVV: (cvv: string, cardType?: string) => boolean;
    isValidDateString: (dateString: string) => boolean;
    validateDate: (date: Date, options?: DateValidationOptions) => ValidationResult;
    isValidAge: (birthDate: Date, minAge: number, maxAge?: number) => boolean;
    isValidISODate: (dateString: string) => boolean;
    validateField: (value: any, field: SchemaField, fieldName: string) => ValidationResult;
    validateSchema: (data: any, schema: Schema) => ValidationResult;
    createValidator: (schema: Schema) => (data: any) => ValidationResult;
    validateArray: (arr: any[], validator: (item: any, index: number) => boolean) => ValidationResult;
    hasUniqueElements: (arr: any[], keyExtractor?: (item: any) => any) => boolean;
    validateRequiredKeys: (obj: any, requiredKeys: string[]) => ValidationResult;
    validateAllowedKeys: (obj: any, allowedKeys: string[]) => ValidationResult;
    validateWhen: (value: any, condition: () => boolean, validator: (value: any) => boolean) => ValidationResult;
    validateOneOf: (value: any, options: any[]) => boolean;
    validateFieldsMatch: (value1: any, value2: any, fieldName?: string) => ValidationResult;
    validateDateRange: (startDate: Date, endDate: Date) => ValidationResult;
    validateDependentField: (data: any, sourceField: string, dependentField: string) => ValidationResult;
    sanitizeString: (input: string, options?: SanitizationOptions) => string;
    sanitizeEmail: (email: string) => string;
    sanitizePhone: (phone: string) => string;
    removeDangerousChars: (input: string) => string;
    escapeHtml: (input: string) => string;
    validatePHI: (data: any, context: HIPAAValidationContext) => ValidationResult;
    isValidSSN: (ssn: string, allowMasked?: boolean) => boolean;
    maskSensitiveData: (value: string, visibleChars?: number) => string;
    isValidMRN: (mrn: string, pattern?: RegExp) => boolean;
    validatePasswordStrength: (password: string, requirements?: {
        minLength?: number;
        maxLength?: number;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
    }) => ValidationResult;
    isValidIPv4: (ip: string) => boolean;
    isValidIPv6: (ip: string) => boolean;
    isValidMACAddress: (mac: string, separator?: string) => boolean;
    isValidZipCode: (zipCode: string, requireExtended?: boolean) => boolean;
};
export default _default;
//# sourceMappingURL=data-validation-utils.d.ts.map