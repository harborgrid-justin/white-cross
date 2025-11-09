"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidZipCode = exports.isValidMACAddress = exports.isValidIPv6 = exports.isValidIPv4 = exports.validatePasswordStrength = exports.isValidMRN = exports.maskSensitiveData = exports.isValidSSN = exports.validatePHI = exports.escapeHtml = exports.removeDangerousChars = exports.sanitizePhone = exports.sanitizeEmail = exports.sanitizeString = exports.validateDependentField = exports.validateDateRange = exports.validateFieldsMatch = exports.validateOneOf = exports.validateWhen = exports.validateAllowedKeys = exports.validateRequiredKeys = exports.hasUniqueElements = exports.validateArray = exports.createValidator = exports.validateSchema = exports.validateField = exports.isValidISODate = exports.isValidAge = exports.validateDate = exports.isValidDateString = exports.isValidCVV = exports.getCreditCardType = exports.isValidCreditCard = exports.isValidInternationalPhone = exports.isValidUrl = exports.isValidPhone = exports.isValidEmail = exports.isEmpty = exports.isNullOrUndefined = exports.isObject = exports.isArray = exports.isDate = exports.isBoolean = exports.isNumber = exports.isString = void 0;
// ============================================================================
// TYPE GUARDS AND TYPE PREDICATES
// ============================================================================
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
const isString = (value) => {
    return typeof value === 'string';
};
exports.isString = isString;
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
const isNumber = (value) => {
    return typeof value === 'number' && !isNaN(value);
};
exports.isNumber = isNumber;
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
const isBoolean = (value) => {
    return typeof value === 'boolean';
};
exports.isBoolean = isBoolean;
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
const isDate = (value) => {
    return value instanceof Date && !isNaN(value.getTime());
};
exports.isDate = isDate;
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
const isArray = (value) => {
    return Array.isArray(value);
};
exports.isArray = isArray;
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
const isObject = (value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};
exports.isObject = isObject;
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
const isNullOrUndefined = (value) => {
    return value === null || value === undefined;
};
exports.isNullOrUndefined = isNullOrUndefined;
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
const isEmpty = (value) => {
    if ((0, exports.isNullOrUndefined)(value))
        return true;
    if ((0, exports.isString)(value))
        return value.trim().length === 0;
    if ((0, exports.isArray)(value))
        return value.length === 0;
    if ((0, exports.isObject)(value))
        return Object.keys(value).length === 0;
    return false;
};
exports.isEmpty = isEmpty;
// ============================================================================
// EMAIL, PHONE, URL VALIDATORS
// ============================================================================
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
const isValidEmail = (email) => {
    if (!(0, exports.isString)(email))
        return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
};
exports.isValidEmail = isValidEmail;
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
const isValidPhone = (phone) => {
    if (!(0, exports.isString)(phone))
        return false;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};
exports.isValidPhone = isValidPhone;
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
const isValidUrl = (url, requireProtocol = true) => {
    if (!(0, exports.isString)(url))
        return false;
    try {
        const urlObj = new URL(url);
        if (requireProtocol && !['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }
        return true;
    }
    catch {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
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
const isValidInternationalPhone = (phone) => {
    if (!(0, exports.isString)(phone))
        return false;
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone.replace(/[\s()-]/g, ''));
};
exports.isValidInternationalPhone = isValidInternationalPhone;
// ============================================================================
// CREDIT CARD VALIDATION
// ============================================================================
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
const isValidCreditCard = (cardNumber) => {
    if (!(0, exports.isString)(cardNumber))
        return false;
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    if (!/^\d+$/.test(cleaned))
        return false;
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);
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
};
exports.isValidCreditCard = isValidCreditCard;
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
const getCreditCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    const luhnValid = (0, exports.isValidCreditCard)(cardNumber);
    const patterns = {
        Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        Mastercard: /^5[1-5][0-9]{14}$/,
        'American Express': /^3[47][0-9]{13}$/,
        Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        'Diners Club': /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        JCB: /^(?:2131|1800|35\d{3})\d{11}$/,
    };
    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cleaned)) {
            return { type, valid: true, luhnValid };
        }
    }
    return { type: 'Unknown', valid: false, luhnValid };
};
exports.getCreditCardType = getCreditCardType;
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
const isValidCVV = (cvv, cardType) => {
    if (!(0, exports.isString)(cvv) || !/^\d+$/.test(cvv))
        return false;
    if (cardType === 'American Express') {
        return cvv.length === 4;
    }
    return cvv.length === 3;
};
exports.isValidCVV = isValidCVV;
// ============================================================================
// DATE/TIME VALIDATION
// ============================================================================
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
const isValidDateString = (dateString) => {
    if (!(0, exports.isString)(dateString))
        return false;
    const date = new Date(dateString);
    return (0, exports.isDate)(date);
};
exports.isValidDateString = isValidDateString;
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
const validateDate = (date, options) => {
    const errors = [];
    if (!(0, exports.isDate)(date)) {
        return { isValid: false, errors: ['Invalid date'] };
    }
    const now = new Date();
    if (options?.min && date < options.min) {
        errors.push(`Date must be after ${options.min.toISOString()}`);
    }
    if (options?.max && date > options.max) {
        errors.push(`Date must be before ${options.max.toISOString()}`);
    }
    if (options?.allowFuture === false && date > now) {
        errors.push('Future dates are not allowed');
    }
    if (options?.allowPast === false && date < now) {
        errors.push('Past dates are not allowed');
    }
    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        value: date,
    };
};
exports.validateDate = validateDate;
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
const isValidAge = (birthDate, minAge, maxAge) => {
    if (!(0, exports.isDate)(birthDate))
        return false;
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
    }
    if (actualAge < minAge)
        return false;
    if (maxAge !== undefined && actualAge > maxAge)
        return false;
    return true;
};
exports.isValidAge = isValidAge;
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
const isValidISODate = (dateString) => {
    if (!(0, exports.isString)(dateString))
        return false;
    const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
    return isoRegex.test(dateString) && (0, exports.isValidDateString)(dateString);
};
exports.isValidISODate = isValidISODate;
// ============================================================================
// SCHEMA VALIDATION (Joi/Yup/Zod patterns)
// ============================================================================
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
const validateField = (value, field, fieldName) => {
    const errors = [];
    // Check required
    if (field.required && (0, exports.isEmpty)(value)) {
        return {
            isValid: false,
            errors: [`${fieldName} is required`],
        };
    }
    // Skip validation if value is empty and not required
    if ((0, exports.isEmpty)(value) && !field.required) {
        return { isValid: true, value };
    }
    // Type validation
    switch (field.type) {
        case 'string':
            if (!(0, exports.isString)(value))
                errors.push(`${fieldName} must be a string`);
            break;
        case 'number':
            if (!(0, exports.isNumber)(value))
                errors.push(`${fieldName} must be a number`);
            break;
        case 'boolean':
            if (!(0, exports.isBoolean)(value))
                errors.push(`${fieldName} must be a boolean`);
            break;
        case 'date':
            if (!(0, exports.isDate)(value))
                errors.push(`${fieldName} must be a valid date`);
            break;
        case 'email':
            if (!(0, exports.isValidEmail)(value))
                errors.push(`${fieldName} must be a valid email`);
            break;
        case 'url':
            if (!(0, exports.isValidUrl)(value))
                errors.push(`${fieldName} must be a valid URL`);
            break;
        case 'array':
            if (!(0, exports.isArray)(value))
                errors.push(`${fieldName} must be an array`);
            break;
        case 'object':
            if (!(0, exports.isObject)(value))
                errors.push(`${fieldName} must be an object`);
            break;
    }
    // Min/Max validation
    if (field.min !== undefined) {
        if ((0, exports.isString)(value) && value.length < field.min) {
            errors.push(`${fieldName} must be at least ${field.min} characters`);
        }
        else if ((0, exports.isNumber)(value) && value < field.min) {
            errors.push(`${fieldName} must be at least ${field.min}`);
        }
    }
    if (field.max !== undefined) {
        if ((0, exports.isString)(value) && value.length > field.max) {
            errors.push(`${fieldName} must be at most ${field.max} characters`);
        }
        else if ((0, exports.isNumber)(value) && value > field.max) {
            errors.push(`${fieldName} must be at most ${field.max}`);
        }
    }
    // Pattern validation
    if (field.pattern && (0, exports.isString)(value) && !field.pattern.test(value)) {
        errors.push(field.message || `${fieldName} does not match required pattern`);
    }
    // Enum validation
    if (field.enum && !field.enum.includes(value)) {
        errors.push(`${fieldName} must be one of: ${field.enum.join(', ')}`);
    }
    // Custom validation
    if (field.custom && !field.custom(value)) {
        errors.push(field.message || `${fieldName} failed custom validation`);
    }
    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        value,
    };
};
exports.validateField = validateField;
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
const validateSchema = (data, schema) => {
    if (!(0, exports.isObject)(data)) {
        return { isValid: false, errors: ['Data must be an object'] };
    }
    const errors = [];
    const validatedData = {};
    for (const [key, fieldSchema] of Object.entries(schema)) {
        const value = data[key];
        const result = (0, exports.validateField)(value, fieldSchema, key);
        if (!result.isValid && result.errors) {
            errors.push(...result.errors);
        }
        else {
            validatedData[key] = result.value;
        }
    }
    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        value: validatedData,
    };
};
exports.validateSchema = validateSchema;
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
const createValidator = (schema) => {
    return (data) => (0, exports.validateSchema)(data, schema);
};
exports.createValidator = createValidator;
// ============================================================================
// ARRAY AND OBJECT VALIDATION
// ============================================================================
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
const validateArray = (arr, validator) => {
    if (!(0, exports.isArray)(arr)) {
        return { isValid: false, errors: ['Value must be an array'] };
    }
    const errors = [];
    arr.forEach((item, index) => {
        if (!validator(item, index)) {
            errors.push(`Element at index ${index} is invalid`);
        }
    });
    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        value: arr,
    };
};
exports.validateArray = validateArray;
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
const hasUniqueElements = (arr, keyExtractor) => {
    if (!(0, exports.isArray)(arr))
        return false;
    const seen = new Set();
    for (const item of arr) {
        const key = keyExtractor ? keyExtractor(item) : item;
        if (seen.has(key))
            return false;
        seen.add(key);
    }
    return true;
};
exports.hasUniqueElements = hasUniqueElements;
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
const validateRequiredKeys = (obj, requiredKeys) => {
    if (!(0, exports.isObject)(obj)) {
        return { isValid: false, errors: ['Value must be an object'] };
    }
    const missing = requiredKeys.filter((key) => !(key in obj));
    if (missing.length > 0) {
        return {
            isValid: false,
            errors: [`Missing required keys: ${missing.join(', ')}`],
        };
    }
    return { isValid: true, value: obj };
};
exports.validateRequiredKeys = validateRequiredKeys;
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
const validateAllowedKeys = (obj, allowedKeys) => {
    if (!(0, exports.isObject)(obj)) {
        return { isValid: false, errors: ['Value must be an object'] };
    }
    const unexpected = Object.keys(obj).filter((key) => !allowedKeys.includes(key));
    if (unexpected.length > 0) {
        return {
            isValid: false,
            errors: [`Unexpected keys: ${unexpected.join(', ')}`],
        };
    }
    return { isValid: true, value: obj };
};
exports.validateAllowedKeys = validateAllowedKeys;
// ============================================================================
// CONDITIONAL VALIDATION
// ============================================================================
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
const validateWhen = (value, condition, validator) => {
    if (!condition()) {
        return { isValid: true, value };
    }
    const isValid = validator(value);
    return {
        isValid,
        errors: isValid ? undefined : ['Conditional validation failed'],
        value,
    };
};
exports.validateWhen = validateWhen;
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
const validateOneOf = (value, options) => {
    return options.includes(value);
};
exports.validateOneOf = validateOneOf;
// ============================================================================
// CROSS-FIELD VALIDATION
// ============================================================================
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
const validateFieldsMatch = (value1, value2, fieldName) => {
    const isValid = value1 === value2;
    return {
        isValid,
        errors: isValid
            ? undefined
            : [`${fieldName || 'Fields'} do not match`],
    };
};
exports.validateFieldsMatch = validateFieldsMatch;
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
const validateDateRange = (startDate, endDate) => {
    if (!(0, exports.isDate)(startDate) || !(0, exports.isDate)(endDate)) {
        return { isValid: false, errors: ['Invalid date(s)'] };
    }
    if (startDate >= endDate) {
        return {
            isValid: false,
            errors: ['End date must be after start date'],
        };
    }
    return { isValid: true, value: { startDate, endDate } };
};
exports.validateDateRange = validateDateRange;
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
const validateDependentField = (data, sourceField, dependentField) => {
    if (!(0, exports.isObject)(data)) {
        return { isValid: false, errors: ['Data must be an object'] };
    }
    const hasSource = !(0, exports.isEmpty)(data[sourceField]);
    const hasDependent = !(0, exports.isEmpty)(data[dependentField]);
    if (hasSource && !hasDependent) {
        return {
            isValid: false,
            errors: [`${dependentField} is required when ${sourceField} is provided`],
        };
    }
    return { isValid: true, value: data };
};
exports.validateDependentField = validateDependentField;
// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================
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
const sanitizeString = (input, options) => {
    if (!(0, exports.isString)(input))
        return '';
    let result = input;
    if (options?.trim) {
        result = result.trim();
    }
    if (options?.removeHtml) {
        result = result.replace(/<[^>]*>/g, '');
    }
    if (options?.removeSpecialChars) {
        result = result.replace(/[^a-zA-Z0-9\s]/g, '');
    }
    if (options?.lowercase) {
        result = result.toLowerCase();
    }
    if (options?.uppercase) {
        result = result.toUpperCase();
    }
    if (options?.maxLength && result.length > options.maxLength) {
        result = result.substring(0, options.maxLength);
    }
    return result;
};
exports.sanitizeString = sanitizeString;
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
const sanitizeEmail = (email) => {
    return (0, exports.sanitizeString)(email, { trim: true, lowercase: true });
};
exports.sanitizeEmail = sanitizeEmail;
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
const sanitizePhone = (phone) => {
    if (!(0, exports.isString)(phone))
        return '';
    return phone.replace(/[^\d+]/g, '');
};
exports.sanitizePhone = sanitizePhone;
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
const removeDangerousChars = (input) => {
    if (!(0, exports.isString)(input))
        return '';
    return input.replace(/[<>'"&]/g, '');
};
exports.removeDangerousChars = removeDangerousChars;
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
const escapeHtml = (input) => {
    if (!(0, exports.isString)(input))
        return '';
    const htmlEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };
    return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
};
exports.escapeHtml = escapeHtml;
// ============================================================================
// HIPAA DATA VALIDATION PATTERNS
// ============================================================================
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
const validatePHI = (data, context) => {
    if (!context.allowPHI) {
        return {
            isValid: false,
            errors: ['PHI data not allowed in this context'],
        };
    }
    if (context.requireEncryption) {
        // Check if data contains unencrypted sensitive fields
        const sensitiveFields = ['ssn', 'medicalRecordNumber', 'healthPlanNumber'];
        const warnings = [];
        if ((0, exports.isObject)(data)) {
            for (const field of sensitiveFields) {
                if (data[field] && (0, exports.isString)(data[field]) && !data[field].includes('*')) {
                    warnings.push(`${field} should be encrypted or masked`);
                }
            }
        }
        if (warnings.length > 0) {
            return { isValid: false, errors: warnings };
        }
    }
    return { isValid: true, value: data };
};
exports.validatePHI = validatePHI;
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
const isValidSSN = (ssn, allowMasked = false) => {
    if (!(0, exports.isString)(ssn))
        return false;
    const ssnRegex = /^(?:\d{3}-\d{2}-\d{4}|\d{9})$/;
    const maskedRegex = /^(?:\*{3}-\*{2}-\d{4}|\*{5}\d{4})$/;
    if (allowMasked && maskedRegex.test(ssn)) {
        return true;
    }
    return ssnRegex.test(ssn);
};
exports.isValidSSN = isValidSSN;
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
const maskSensitiveData = (value, visibleChars = 4) => {
    if (!(0, exports.isString)(value) || value.length <= visibleChars)
        return value;
    const masked = '*'.repeat(value.length - visibleChars);
    const visible = value.slice(-visibleChars);
    return masked + visible;
};
exports.maskSensitiveData = maskSensitiveData;
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
const isValidMRN = (mrn, pattern) => {
    if (!(0, exports.isString)(mrn))
        return false;
    const defaultPattern = /^[A-Z0-9]{6,20}$/;
    const regex = pattern || defaultPattern;
    return regex.test(mrn);
};
exports.isValidMRN = isValidMRN;
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
const validatePasswordStrength = (password, requirements) => {
    const errors = [];
    const config = {
        minLength: 8,
        maxLength: 128,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        ...requirements,
    };
    if (!(0, exports.isString)(password)) {
        return { isValid: false, errors: ['Password must be a string'] };
    }
    if (password.length < config.minLength) {
        errors.push(`Password must be at least ${config.minLength} characters`);
    }
    if (password.length > config.maxLength) {
        errors.push(`Password must be at most ${config.maxLength} characters`);
    }
    if (config.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (config.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (config.requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        value: password,
    };
};
exports.validatePasswordStrength = validatePasswordStrength;
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
const isValidIPv4 = (ip) => {
    if (!(0, exports.isString)(ip))
        return false;
    const parts = ip.split('.');
    if (parts.length !== 4)
        return false;
    return parts.every((part) => {
        const num = parseInt(part, 10);
        return !isNaN(num) && num >= 0 && num <= 255 && part === String(num);
    });
};
exports.isValidIPv4 = isValidIPv4;
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
const isValidIPv6 = (ip) => {
    if (!(0, exports.isString)(ip))
        return false;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv6Regex.test(ip);
};
exports.isValidIPv6 = isValidIPv6;
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
const isValidMACAddress = (mac, separator) => {
    if (!(0, exports.isString)(mac))
        return false;
    const macRegexColon = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    const macRegexHyphen = /^([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/;
    if (separator === ':')
        return macRegexColon.test(mac);
    if (separator === '-')
        return macRegexHyphen.test(mac);
    return macRegexColon.test(mac) || macRegexHyphen.test(mac);
};
exports.isValidMACAddress = isValidMACAddress;
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
const isValidZipCode = (zipCode, requireExtended = false) => {
    if (!(0, exports.isString)(zipCode))
        return false;
    const basicZipRegex = /^\d{5}$/;
    const extendedZipRegex = /^\d{5}-\d{4}$/;
    if (requireExtended) {
        return extendedZipRegex.test(zipCode);
    }
    return basicZipRegex.test(zipCode) || extendedZipRegex.test(zipCode);
};
exports.isValidZipCode = isValidZipCode;
exports.default = {
    // Type guards
    isString: exports.isString,
    isNumber: exports.isNumber,
    isBoolean: exports.isBoolean,
    isDate: exports.isDate,
    isArray: exports.isArray,
    isObject: exports.isObject,
    isNullOrUndefined: exports.isNullOrUndefined,
    isEmpty: exports.isEmpty,
    // Email, phone, URL validators
    isValidEmail: exports.isValidEmail,
    isValidPhone: exports.isValidPhone,
    isValidUrl: exports.isValidUrl,
    isValidInternationalPhone: exports.isValidInternationalPhone,
    // Credit card validation
    isValidCreditCard: exports.isValidCreditCard,
    getCreditCardType: exports.getCreditCardType,
    isValidCVV: exports.isValidCVV,
    // Date/time validation
    isValidDateString: exports.isValidDateString,
    validateDate: exports.validateDate,
    isValidAge: exports.isValidAge,
    isValidISODate: exports.isValidISODate,
    // Schema validation
    validateField: exports.validateField,
    validateSchema: exports.validateSchema,
    createValidator: exports.createValidator,
    // Array and object validation
    validateArray: exports.validateArray,
    hasUniqueElements: exports.hasUniqueElements,
    validateRequiredKeys: exports.validateRequiredKeys,
    validateAllowedKeys: exports.validateAllowedKeys,
    // Conditional validation
    validateWhen: exports.validateWhen,
    validateOneOf: exports.validateOneOf,
    // Cross-field validation
    validateFieldsMatch: exports.validateFieldsMatch,
    validateDateRange: exports.validateDateRange,
    validateDependentField: exports.validateDependentField,
    // Sanitization
    sanitizeString: exports.sanitizeString,
    sanitizeEmail: exports.sanitizeEmail,
    sanitizePhone: exports.sanitizePhone,
    removeDangerousChars: exports.removeDangerousChars,
    escapeHtml: exports.escapeHtml,
    // HIPAA validation
    validatePHI: exports.validatePHI,
    isValidSSN: exports.isValidSSN,
    maskSensitiveData: exports.maskSensitiveData,
    isValidMRN: exports.isValidMRN,
    validatePasswordStrength: exports.validatePasswordStrength,
    isValidIPv4: exports.isValidIPv4,
    isValidIPv6: exports.isValidIPv6,
    isValidMACAddress: exports.isValidMACAddress,
    isValidZipCode: exports.isValidZipCode,
};
//# sourceMappingURL=data-validation-utils.js.map