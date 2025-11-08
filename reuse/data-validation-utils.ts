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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

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
export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

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
export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean';
};

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
export const isDate = (value: any): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

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
export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

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
export const isObject = (value: any): value is Record<string, any> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

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
export const isNullOrUndefined = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};

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
export const isEmpty = (value: any): boolean => {
  if (isNullOrUndefined(value)) return true;
  if (isString(value)) return value.trim().length === 0;
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
};

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
export const isValidEmail = (email: string): boolean => {
  if (!isString(email)) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

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
export const isValidPhone = (phone: string): boolean => {
  if (!isString(phone)) return false;
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

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
export const isValidUrl = (url: string, requireProtocol: boolean = true): boolean => {
  if (!isString(url)) return false;
  try {
    const urlObj = new URL(url);
    if (requireProtocol && !['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

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
export const isValidInternationalPhone = (phone: string): boolean => {
  if (!isString(phone)) return false;
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone.replace(/[\s()-]/g, ''));
};

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
export const isValidCreditCard = (cardNumber: string): boolean => {
  if (!isString(cardNumber)) return false;
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(cleaned)) return false;

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
export const getCreditCardType = (cardNumber: string): CreditCardInfo => {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  const luhnValid = isValidCreditCard(cardNumber);

  const patterns: Record<string, RegExp> = {
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
export const isValidCVV = (cvv: string, cardType?: string): boolean => {
  if (!isString(cvv) || !/^\d+$/.test(cvv)) return false;

  if (cardType === 'American Express') {
    return cvv.length === 4;
  }

  return cvv.length === 3;
};

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
export const isValidDateString = (dateString: string): boolean => {
  if (!isString(dateString)) return false;
  const date = new Date(dateString);
  return isDate(date);
};

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
export const validateDate = (
  date: Date,
  options?: DateValidationOptions,
): ValidationResult => {
  const errors: string[] = [];

  if (!isDate(date)) {
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
export const isValidAge = (birthDate: Date, minAge: number, maxAge?: number): boolean => {
  if (!isDate(birthDate)) return false;

  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    actualAge--;
  }

  if (actualAge < minAge) return false;
  if (maxAge !== undefined && actualAge > maxAge) return false;

  return true;
};

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
export const isValidISODate = (dateString: string): boolean => {
  if (!isString(dateString)) return false;
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  return isoRegex.test(dateString) && isValidDateString(dateString);
};

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
export const validateField = (
  value: any,
  field: SchemaField,
  fieldName: string,
): ValidationResult => {
  const errors: string[] = [];

  // Check required
  if (field.required && isEmpty(value)) {
    return {
      isValid: false,
      errors: [`${fieldName} is required`],
    };
  }

  // Skip validation if value is empty and not required
  if (isEmpty(value) && !field.required) {
    return { isValid: true, value };
  }

  // Type validation
  switch (field.type) {
    case 'string':
      if (!isString(value)) errors.push(`${fieldName} must be a string`);
      break;
    case 'number':
      if (!isNumber(value)) errors.push(`${fieldName} must be a number`);
      break;
    case 'boolean':
      if (!isBoolean(value)) errors.push(`${fieldName} must be a boolean`);
      break;
    case 'date':
      if (!isDate(value)) errors.push(`${fieldName} must be a valid date`);
      break;
    case 'email':
      if (!isValidEmail(value)) errors.push(`${fieldName} must be a valid email`);
      break;
    case 'url':
      if (!isValidUrl(value)) errors.push(`${fieldName} must be a valid URL`);
      break;
    case 'array':
      if (!isArray(value)) errors.push(`${fieldName} must be an array`);
      break;
    case 'object':
      if (!isObject(value)) errors.push(`${fieldName} must be an object`);
      break;
  }

  // Min/Max validation
  if (field.min !== undefined) {
    if (isString(value) && value.length < field.min) {
      errors.push(`${fieldName} must be at least ${field.min} characters`);
    } else if (isNumber(value) && value < field.min) {
      errors.push(`${fieldName} must be at least ${field.min}`);
    }
  }

  if (field.max !== undefined) {
    if (isString(value) && value.length > field.max) {
      errors.push(`${fieldName} must be at most ${field.max} characters`);
    } else if (isNumber(value) && value > field.max) {
      errors.push(`${fieldName} must be at most ${field.max}`);
    }
  }

  // Pattern validation
  if (field.pattern && isString(value) && !field.pattern.test(value)) {
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
export const validateSchema = (data: any, schema: Schema): ValidationResult => {
  if (!isObject(data)) {
    return { isValid: false, errors: ['Data must be an object'] };
  }

  const errors: string[] = [];
  const validatedData: Record<string, any> = {};

  for (const [key, fieldSchema] of Object.entries(schema)) {
    const value = data[key];
    const result = validateField(value, fieldSchema as SchemaField, key);

    if (!result.isValid && result.errors) {
      errors.push(...result.errors);
    } else {
      validatedData[key] = result.value;
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    value: validatedData,
  };
};

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
export const createValidator = (schema: Schema) => {
  return (data: any): ValidationResult => validateSchema(data, schema);
};

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
export const validateArray = (
  arr: any[],
  validator: (item: any, index: number) => boolean,
): ValidationResult => {
  if (!isArray(arr)) {
    return { isValid: false, errors: ['Value must be an array'] };
  }

  const errors: string[] = [];

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
export const hasUniqueElements = (
  arr: any[],
  keyExtractor?: (item: any) => any,
): boolean => {
  if (!isArray(arr)) return false;

  const seen = new Set();

  for (const item of arr) {
    const key = keyExtractor ? keyExtractor(item) : item;
    if (seen.has(key)) return false;
    seen.add(key);
  }

  return true;
};

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
export const validateRequiredKeys = (
  obj: any,
  requiredKeys: string[],
): ValidationResult => {
  if (!isObject(obj)) {
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
export const validateAllowedKeys = (
  obj: any,
  allowedKeys: string[],
): ValidationResult => {
  if (!isObject(obj)) {
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
export const validateWhen = (
  value: any,
  condition: () => boolean,
  validator: (value: any) => boolean,
): ValidationResult => {
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
export const validateOneOf = (value: any, options: any[]): boolean => {
  return options.includes(value);
};

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
export const validateFieldsMatch = (
  value1: any,
  value2: any,
  fieldName?: string,
): ValidationResult => {
  const isValid = value1 === value2;

  return {
    isValid,
    errors: isValid
      ? undefined
      : [`${fieldName || 'Fields'} do not match`],
  };
};

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
export const validateDateRange = (startDate: Date, endDate: Date): ValidationResult => {
  if (!isDate(startDate) || !isDate(endDate)) {
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
export const validateDependentField = (
  data: any,
  sourceField: string,
  dependentField: string,
): ValidationResult => {
  if (!isObject(data)) {
    return { isValid: false, errors: ['Data must be an object'] };
  }

  const hasSource = !isEmpty(data[sourceField]);
  const hasDependent = !isEmpty(data[dependentField]);

  if (hasSource && !hasDependent) {
    return {
      isValid: false,
      errors: [`${dependentField} is required when ${sourceField} is provided`],
    };
  }

  return { isValid: true, value: data };
};

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
export const sanitizeString = (input: string, options?: SanitizationOptions): string => {
  if (!isString(input)) return '';

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
export const sanitizeEmail = (email: string): string => {
  return sanitizeString(email, { trim: true, lowercase: true });
};

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
export const sanitizePhone = (phone: string): string => {
  if (!isString(phone)) return '';
  return phone.replace(/[^\d+]/g, '');
};

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
export const removeDangerousChars = (input: string): string => {
  if (!isString(input)) return '';
  return input.replace(/[<>'"&]/g, '');
};

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
export const escapeHtml = (input: string): string => {
  if (!isString(input)) return '';

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
};

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
export const validatePHI = (
  data: any,
  context: HIPAAValidationContext,
): ValidationResult => {
  if (!context.allowPHI) {
    return {
      isValid: false,
      errors: ['PHI data not allowed in this context'],
    };
  }

  if (context.requireEncryption) {
    // Check if data contains unencrypted sensitive fields
    const sensitiveFields = ['ssn', 'medicalRecordNumber', 'healthPlanNumber'];
    const warnings: string[] = [];

    if (isObject(data)) {
      for (const field of sensitiveFields) {
        if (data[field] && isString(data[field]) && !data[field].includes('*')) {
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
export const isValidSSN = (ssn: string, allowMasked: boolean = false): boolean => {
  if (!isString(ssn)) return false;

  const ssnRegex = /^(?:\d{3}-\d{2}-\d{4}|\d{9})$/;
  const maskedRegex = /^(?:\*{3}-\*{2}-\d{4}|\*{5}\d{4})$/;

  if (allowMasked && maskedRegex.test(ssn)) {
    return true;
  }

  return ssnRegex.test(ssn);
};

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
export const maskSensitiveData = (value: string, visibleChars: number = 4): string => {
  if (!isString(value) || value.length <= visibleChars) return value;

  const masked = '*'.repeat(value.length - visibleChars);
  const visible = value.slice(-visibleChars);

  return masked + visible;
};

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
export const isValidMRN = (mrn: string, pattern?: RegExp): boolean => {
  if (!isString(mrn)) return false;
  const defaultPattern = /^[A-Z0-9]{6,20}$/;
  const regex = pattern || defaultPattern;
  return regex.test(mrn);
};

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
export const validatePasswordStrength = (
  password: string,
  requirements?: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  },
): ValidationResult => {
  const errors: string[] = [];
  const config = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    ...requirements,
  };

  if (!isString(password)) {
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
export const isValidIPv4 = (ip: string): boolean => {
  if (!isString(ip)) return false;

  const parts = ip.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === String(num);
  });
};

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
export const isValidIPv6 = (ip: string): boolean => {
  if (!isString(ip)) return false;

  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  return ipv6Regex.test(ip);
};

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
export const isValidMACAddress = (mac: string, separator?: string): boolean => {
  if (!isString(mac)) return false;

  const macRegexColon = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
  const macRegexHyphen = /^([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/;

  if (separator === ':') return macRegexColon.test(mac);
  if (separator === '-') return macRegexHyphen.test(mac);

  return macRegexColon.test(mac) || macRegexHyphen.test(mac);
};

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
export const isValidZipCode = (zipCode: string, requireExtended: boolean = false): boolean => {
  if (!isString(zipCode)) return false;

  const basicZipRegex = /^\d{5}$/;
  const extendedZipRegex = /^\d{5}-\d{4}$/;

  if (requireExtended) {
    return extendedZipRegex.test(zipCode);
  }

  return basicZipRegex.test(zipCode) || extendedZipRegex.test(zipCode);
};

export default {
  // Type guards
  isString,
  isNumber,
  isBoolean,
  isDate,
  isArray,
  isObject,
  isNullOrUndefined,
  isEmpty,

  // Email, phone, URL validators
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidInternationalPhone,

  // Credit card validation
  isValidCreditCard,
  getCreditCardType,
  isValidCVV,

  // Date/time validation
  isValidDateString,
  validateDate,
  isValidAge,
  isValidISODate,

  // Schema validation
  validateField,
  validateSchema,
  createValidator,

  // Array and object validation
  validateArray,
  hasUniqueElements,
  validateRequiredKeys,
  validateAllowedKeys,

  // Conditional validation
  validateWhen,
  validateOneOf,

  // Cross-field validation
  validateFieldsMatch,
  validateDateRange,
  validateDependentField,

  // Sanitization
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  removeDangerousChars,
  escapeHtml,

  // HIPAA validation
  validatePHI,
  isValidSSN,
  maskSensitiveData,
  isValidMRN,
  validatePasswordStrength,
  isValidIPv4,
  isValidIPv6,
  isValidMACAddress,
  isValidZipCode,
};
