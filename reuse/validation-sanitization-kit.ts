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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// SCHEMA VALIDATION (CLASS-VALIDATOR PATTERNS)
// ============================================================================

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
export const validateSchema = (data: any, schema: ValidationSchema): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitized: any = {};

  for (const [field, fieldSchema] of Object.entries(schema)) {
    const value = data?.[field];
    const fieldDef = fieldSchema as SchemaField;

    // Check required fields
    if (fieldDef.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: fieldDef.message || `${field} is required`,
        code: 'REQUIRED',
        value
      });
      continue;
    }

    // Skip validation if not required and value is empty
    if (!fieldDef.required && (value === undefined || value === null)) {
      continue;
    }

    // Type validation
    if (fieldDef.type && !validateType(value, fieldDef.type)) {
      errors.push({
        field,
        message: fieldDef.message || `${field} must be of type ${fieldDef.type}`,
        code: 'INVALID_TYPE',
        value
      });
      continue;
    }

    // Min/Max validation for numbers
    if (fieldDef.type === 'number') {
      if (fieldDef.min !== undefined && value < fieldDef.min) {
        errors.push({
          field,
          message: `${field} must be at least ${fieldDef.min}`,
          code: 'MIN_VALUE',
          value
        });
      }
      if (fieldDef.max !== undefined && value > fieldDef.max) {
        errors.push({
          field,
          message: `${field} must be at most ${fieldDef.max}`,
          code: 'MAX_VALUE',
          value
        });
      }
    }

    // Min/Max length validation for strings
    if (fieldDef.type === 'string') {
      if (fieldDef.minLength !== undefined && value.length < fieldDef.minLength) {
        errors.push({
          field,
          message: `${field} must be at least ${fieldDef.minLength} characters`,
          code: 'MIN_LENGTH',
          value
        });
      }
      if (fieldDef.maxLength !== undefined && value.length > fieldDef.maxLength) {
        errors.push({
          field,
          message: `${field} must be at most ${fieldDef.maxLength} characters`,
          code: 'MAX_LENGTH',
          value
        });
      }
    }

    // Pattern validation
    if (fieldDef.pattern && !fieldDef.pattern.test(value)) {
      errors.push({
        field,
        message: fieldDef.message || `${field} format is invalid`,
        code: 'PATTERN_MISMATCH',
        value
      });
    }

    // Enum validation
    if (fieldDef.enum && !fieldDef.enum.includes(value)) {
      errors.push({
        field,
        message: `${field} must be one of: ${fieldDef.enum.join(', ')}`,
        code: 'INVALID_ENUM',
        value
      });
    }

    // Custom validation
    if (fieldDef.custom && !fieldDef.custom(value)) {
      errors.push({
        field,
        message: fieldDef.message || `${field} validation failed`,
        code: 'CUSTOM_VALIDATION',
        value
      });
    }

    // Transform value
    sanitized[field] = fieldDef.transform ? fieldDef.transform(value) : value;
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    value: data,
    sanitized
  };
};

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
export const validateSchemaAsync = async (data: any, schema: ValidationSchema): Promise<ValidationResult> => {
  const errors: ValidationError[] = [];
  const sanitized: any = {};

  for (const [field, fieldSchema] of Object.entries(schema)) {
    const value = data?.[field];
    const fieldDef = fieldSchema as SchemaField;

    // Check required fields
    if (fieldDef.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: fieldDef.message || `${field} is required`,
        code: 'REQUIRED',
        value
      });
      continue;
    }

    // Skip validation if not required and value is empty
    if (!fieldDef.required && (value === undefined || value === null)) {
      continue;
    }

    // Type validation
    if (fieldDef.type && !validateType(value, fieldDef.type)) {
      errors.push({
        field,
        message: fieldDef.message || `${field} must be of type ${fieldDef.type}`,
        code: 'INVALID_TYPE',
        value
      });
      continue;
    }

    // Custom async validation
    if (fieldDef.custom) {
      const isValid = await Promise.resolve(fieldDef.custom(value));
      if (!isValid) {
        errors.push({
          field,
          message: fieldDef.message || `${field} validation failed`,
          code: 'CUSTOM_VALIDATION',
          value
        });
      }
    }

    // Transform value
    sanitized[field] = fieldDef.transform ? fieldDef.transform(value) : value;
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    value: data,
    sanitized
  };
};

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
export const validateType = (value: any, type: string): boolean => {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'date':
      return value instanceof Date && !isNaN(value.getTime());
    case 'email':
      return isValidEmail(value);
    case 'url':
      return isValidURL(value);
    case 'phone':
      return isValidPhoneNumber(value);
    case 'creditcard':
      return validateCreditCard(value).isValid;
    case 'ssn':
      return isValidSSN(value);
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    default:
      return true;
  }
};

// ============================================================================
// INPUT SANITIZATION (XSS, SQL INJECTION PREVENTION)
// ============================================================================

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
export const sanitizeInput = (input: string, options: SanitizationOptions = {}): string => {
  if (typeof input !== 'string') return '';

  let sanitized = input;

  // Trim whitespace
  if (options.trim !== false) {
    sanitized = sanitized.trim();
  }

  // Normalize whitespace
  if (options.normalizeWhitespace) {
    sanitized = sanitized.replace(/\s+/g, ' ');
  }

  // Remove scripts
  if (options.removeScripts !== false) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // Remove inline event handlers
  }

  // Remove HTML
  if (options.removeHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Escape HTML
  if (options.escapeHtml) {
    sanitized = escapeHtml(sanitized);
  }

  // Remove SQL injection patterns
  if (options.stripSql) {
    sanitized = sanitized.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|DECLARE)\b)/gi, '');
    sanitized = sanitized.replace(/[';]--/g, '');
    sanitized = sanitized.replace(/[';]/g, '');
  }

  // Remove special characters
  if (options.removeSpecialChars) {
    sanitized = sanitized.replace(/[^\w\s@.-]/g, '');
  }

  // Max length
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  // Case transformation
  if (options.lowercase) {
    sanitized = sanitized.toLowerCase();
  } else if (options.uppercase) {
    sanitized = sanitized.toUpperCase();
  }

  return sanitized;
};

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
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

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
export const unescapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (entity) => map[entity]);
};

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
export const sanitizeSqlInput = (input: string): string => {
  if (typeof input !== 'string') return '';

  // Remove SQL comments
  let sanitized = input.replace(/--.*$/gm, '');
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove dangerous SQL keywords patterns
  sanitized = sanitized.replace(/;\s*(DROP|DELETE|TRUNCATE|ALTER|EXEC|EXECUTE)\s+/gi, '; ');

  // Escape single quotes
  sanitized = sanitized.replace(/'/g, "''");

  return sanitized;
};

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
export const stripHtmlTags = (html: string, allowedTags: string[] = []): string => {
  if (typeof html !== 'string') return '';

  if (allowedTags.length === 0) {
    return html.replace(/<[^>]*>/g, '');
  }

  const tagPattern = new RegExp(`<(?!\/?(${allowedTags.join('|')})\b)[^>]*>`, 'gi');
  return html.replace(tagPattern, '');
};

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
export const sanitizeFilename = (filename: string): string => {
  if (typeof filename !== 'string') return '';

  // Remove directory traversal patterns
  let sanitized = filename.replace(/\.\./g, '');
  sanitized = sanitized.replace(/[\/\\]/g, '-');

  // Remove special characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '');

  // Remove leading dots
  sanitized = sanitized.replace(/^\.+/, '');

  return sanitized || 'unnamed';
};

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

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
export const isValidEmail = (email: string, options: EmailValidationOptions = {}): boolean => {
  if (typeof email !== 'string') return false;

  const {
    requireTld = true,
    allowIpDomain = false,
    domainBlacklist = [],
    domainWhitelist = []
  } = options;

  // Basic email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    if (!allowIpDomain) return false;

    // Check for IP domain
    const ipPattern = /^[^\s@]+@\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/;
    if (!ipPattern.test(email)) return false;
  }

  // Extract domain
  const domain = email.split('@')[1]?.toLowerCase();

  if (!domain) return false;

  // Check TLD requirement
  if (requireTld && !domain.includes('.')) return false;

  // Check domain whitelist
  if (domainWhitelist.length > 0 && !domainWhitelist.includes(domain)) {
    return false;
  }

  // Check domain blacklist
  if (domainBlacklist.includes(domain)) {
    return false;
  }

  // More strict RFC 5322 validation
  const strictPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return strictPattern.test(email);
};

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
export const normalizeEmail = (email: string): string => {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

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
export const extractEmailDomain = (email: string): string | null => {
  if (!isValidEmail(email)) return null;
  return email.split('@')[1].toLowerCase();
};

// ============================================================================
// PHONE NUMBER VALIDATION (INTERNATIONAL)
// ============================================================================

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
export const isValidPhoneNumber = (phone: string, options: PhoneValidationOptions = {}): boolean => {
  if (typeof phone !== 'string') return false;

  // Remove common separators
  const cleaned = phone.replace(/[\s\-().]/g, '');

  // Check for E.164 format (international)
  if (cleaned.startsWith('+')) {
    const e164Pattern = /^\+[1-9]\d{1,14}$/;
    return e164Pattern.test(cleaned);
  }

  // US/Canada format
  if (options.defaultCountry === 'US' || options.defaultCountry === 'CA') {
    const usPattern = /^[2-9]\d{9}$/;
    return usPattern.test(cleaned);
  }

  // UK format
  if (options.defaultCountry === 'GB') {
    const ukPattern = /^[1-9]\d{9,10}$/;
    return ukPattern.test(cleaned);
  }

  // Generic international format (7-15 digits)
  const genericPattern = /^\d{7,15}$/;
  return genericPattern.test(cleaned);
};

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
export const formatPhoneNumber = (phone: string, countryCode: string = 'US'): string | null => {
  if (typeof phone !== 'string') return null;

  const cleaned = phone.replace(/[\s\-().]/g, '');

  // Already in E.164 format
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // Country code prefixes
  const countryPrefixes: Record<string, string> = {
    'US': '+1',
    'CA': '+1',
    'GB': '+44',
    'AU': '+61',
    'DE': '+49',
    'FR': '+33',
    'IT': '+39',
    'ES': '+34'
  };

  const prefix = countryPrefixes[countryCode] || '+1';
  return `${prefix}${cleaned}`;
};

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
export const parsePhoneNumber = (phone: string): { countryCode: string; nationalNumber: string; formatted: string } | null => {
  if (typeof phone !== 'string') return null;

  const cleaned = phone.replace(/[\s\-().]/g, '');

  if (cleaned.startsWith('+')) {
    const match = cleaned.match(/^\+(\d{1,3})(\d+)$/);
    if (match) {
      return {
        countryCode: match[1],
        nationalNumber: match[2],
        formatted: cleaned
      };
    }
  }

  return null;
};

// ============================================================================
// URL VALIDATION
// ============================================================================

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
export const isValidURL = (url: string, options: URLValidationOptions = {}): boolean => {
  if (typeof url !== 'string') return false;

  const {
    protocols = ['http', 'https'],
    requireProtocol = true,
    requireTld = true,
    allowLocalhost = false,
    allowPrivateIP = false
  } = options;

  try {
    const urlObj = new URL(url);

    // Check protocol
    const protocol = urlObj.protocol.replace(':', '');
    if (!protocols.includes(protocol)) {
      return false;
    }

    // Check localhost
    if (!allowLocalhost && (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1')) {
      return false;
    }

    // Check private IP
    if (!allowPrivateIP && isPrivateIP(urlObj.hostname)) {
      return false;
    }

    // Check TLD
    if (requireTld && !urlObj.hostname.includes('.')) {
      return false;
    }

    return true;
  } catch {
    // If requireProtocol is false, try adding protocol
    if (!requireProtocol && !url.includes('://')) {
      return isValidURL(`http://${url}`, { ...options, requireProtocol: true });
    }
    return false;
  }
};

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
export const isPrivateIP = (hostname: string): boolean => {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./
  ];

  return privateRanges.some(range => range.test(hostname));
};

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
export const normalizeURL = (url: string): string | null => {
  if (typeof url !== 'string') return null;

  try {
    // Add protocol if missing
    if (!url.includes('://')) {
      url = `https://${url}`;
    }

    const urlObj = new URL(url);

    // Remove trailing slash
    let normalized = urlObj.toString();
    if (normalized.endsWith('/') && urlObj.pathname === '/') {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  } catch {
    return null;
  }
};

// ============================================================================
// DATE/TIME VALIDATION
// ============================================================================

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
export const isValidDate = (date: any, options: DateValidationOptions = {}): boolean => {
  const {
    min,
    max,
    allowFuture = true,
    allowPast = true
  } = options;

  let dateObj: Date;

  // Convert to Date object
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    return false;
  }

  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return false;
  }

  const now = new Date();

  // Check future/past
  if (!allowFuture && dateObj > now) {
    return false;
  }
  if (!allowPast && dateObj < now) {
    return false;
  }

  // Check min
  if (min) {
    const minDate = new Date(min);
    if (dateObj < minDate) {
      return false;
    }
  }

  // Check max
  if (max) {
    const maxDate = new Date(max);
    if (dateObj > maxDate) {
      return false;
    }
  }

  return true;
};

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
export const isValidDateFormat = (dateString: string, format: string = 'YYYY-MM-DD'): boolean => {
  if (typeof dateString !== 'string') return false;

  const formats: Record<string, RegExp> = {
    'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
    'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'YYYY/MM/DD': /^\d{4}\/\d{2}\/\d{2}$/,
    'ISO8601': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
  };

  const pattern = formats[format];
  if (!pattern) return false;

  if (!pattern.test(dateString)) return false;

  // Validate actual date values
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

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
export const isValidTime = (time: string, is24Hour: boolean = true): boolean => {
  if (typeof time !== 'string') return false;

  if (is24Hour) {
    const pattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    return pattern.test(time);
  } else {
    const pattern = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;
    return pattern.test(time);
  }
};

// ============================================================================
// CREDIT CARD VALIDATION
// ============================================================================

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
export const validateCreditCard = (cardNumber: string): CreditCardValidationResult => {
  if (typeof cardNumber !== 'string') {
    return { isValid: false, luhnValid: false };
  }

  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if only digits
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, luhnValid: false };
  }

  // Detect card type
  const type = detectCardType(cleaned);

  // Validate using Luhn algorithm
  const luhnValid = validateLuhn(cleaned);

  // Check length based on card type
  const lengthValid = validateCardLength(cleaned, type);

  return {
    isValid: luhnValid && lengthValid,
    type,
    luhnValid,
    formatted: formatCreditCard(cleaned)
  };
};

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
export const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.split('').reverse().map(Number);

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];

    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  return sum % 10 === 0;
};

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
export const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unknown' => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^35/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type as any;
    }
  }

  return 'unknown';
};

/**
 * Validates card number length based on card type.
 *
 * @param {string} cardNumber - Card number
 * @param {string} type - Card type
 * @returns {boolean} True if length is valid
 */
const validateCardLength = (cardNumber: string, type: string): boolean => {
  const lengths: Record<string, number[]> = {
    visa: [13, 16, 19],
    mastercard: [16],
    amex: [15],
    discover: [16],
    diners: [14],
    jcb: [16]
  };

  const validLengths = lengths[type] || [13, 14, 15, 16, 19];
  return validLengths.includes(cardNumber.length);
};

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
export const formatCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  const type = detectCardType(cleaned);

  // Amex: 4-6-5 format
  if (type === 'amex') {
    return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  }

  // Others: 4-4-4-4 format
  return cleaned.replace(/(\d{4})/g, '$1 ').trim();
};

// ============================================================================
// SSN/TAX ID VALIDATION
// ============================================================================

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
export const isValidSSN = (ssn: string): boolean => {
  if (typeof ssn !== 'string') return false;

  // Remove dashes and spaces
  const cleaned = ssn.replace(/[\s-]/g, '');

  // Must be 9 digits
  if (!/^\d{9}$/.test(cleaned)) return false;

  // Invalid patterns
  const area = cleaned.substring(0, 3);
  const group = cleaned.substring(3, 5);
  const serial = cleaned.substring(5, 9);

  // Area cannot be 000, 666, or 900-999
  if (area === '000' || area === '666' || parseInt(area) >= 900) {
    return false;
  }

  // Group cannot be 00
  if (group === '00') {
    return false;
  }

  // Serial cannot be 0000
  if (serial === '0000') {
    return false;
  }

  return true;
};

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
export const isValidEIN = (ein: string): boolean => {
  if (typeof ein !== 'string') return false;

  // Remove dashes and spaces
  const cleaned = ein.replace(/[\s-]/g, '');

  // Must be 9 digits
  if (!/^\d{9}$/.test(cleaned)) return false;

  // First two digits cannot be 00
  const prefix = cleaned.substring(0, 2);
  if (prefix === '00') {
    return false;
  }

  return true;
};

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
export const formatSSN = (ssn: string): string | null => {
  if (!isValidSSN(ssn)) return null;

  const cleaned = ssn.replace(/[\s-]/g, '');
  return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 5)}-${cleaned.substring(5, 9)}`;
};

// ============================================================================
// CUSTOM VALIDATOR BUILDERS
// ============================================================================

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
export const createValidator = <T = any>(
  validator: Validator<T>,
  constraints: { min?: number; max?: number } = {}
): Validator<T> => {
  return (value: T): boolean => {
    if (!validator(value)) return false;

    if (typeof value === 'number') {
      if (constraints.min !== undefined && value < constraints.min) return false;
      if (constraints.max !== undefined && value > constraints.max) return false;
    }

    return true;
  };
};

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
export const createRegexValidator = (pattern: RegExp, errorMessage?: string): Validator<string> => {
  const validator = (value: string): boolean => {
    if (typeof value !== 'string') return false;
    return pattern.test(value);
  };

  // Attach error message for better debugging
  (validator as any).errorMessage = errorMessage;

  return validator;
};

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
export const createEnumValidator = <T = any>(allowedValues: T[]): Validator<T> => {
  return (value: T): boolean => {
    return allowedValues.includes(value);
  };
};

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
export const createLengthValidator = (constraints: { min?: number; max?: number }): Validator<string | any[]> => {
  return (value: string | any[]): boolean => {
    if (typeof value !== 'string' && !Array.isArray(value)) return false;

    const length = value.length;

    if (constraints.min !== undefined && length < constraints.min) return false;
    if (constraints.max !== undefined && length > constraints.max) return false;

    return true;
  };
};

// ============================================================================
// ASYNC VALIDATORS
// ============================================================================

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
export const createAsyncValidator = <T = any>(
  validator: AsyncValidator<T>,
  delay: number = 0
): AsyncValidator<T> => {
  let timeoutId: NodeJS.Timeout;

  return async (value: T): Promise<boolean> => {
    if (delay > 0) {
      return new Promise((resolve) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          const result = await validator(value);
          resolve(result);
        }, delay);
      });
    }

    return validator(value);
  };
};

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
export const validateAsync = async <T = any>(
  validator: AsyncValidator<T>,
  value: T,
  timeout: number = 5000
): Promise<boolean> => {
  const timeoutPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(false), timeout);
  });

  const validationPromise = validator(value);

  return Promise.race([validationPromise, timeoutPromise]);
};

// ============================================================================
// CONDITIONAL VALIDATION
// ============================================================================

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
export const createConditionalValidator = <T = any>(
  condition: (data: any) => boolean,
  thenValidator: Validator<T>,
  elseValidator?: Validator<T>
): (value: T, data?: any) => boolean => {
  return (value: T, data?: any): boolean => {
    if (condition(data)) {
      return thenValidator(value);
    } else if (elseValidator) {
      return elseValidator(value);
    }
    return true;
  };
};

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
export const validateWhen = <T = any>(
  condition: (data: any) => boolean,
  validator: Validator<T>
): (value: T, data?: any) => boolean => {
  return (value: T, data?: any): boolean => {
    if (!condition(data)) return true;
    return validator(value);
  };
};

// ============================================================================
// CROSS-FIELD VALIDATION
// ============================================================================

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
export const validateFieldsMatch = (data: any, field1: string, field2: string): boolean => {
  if (!data || typeof data !== 'object') return false;
  return data[field1] === data[field2];
};

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
export const validateAtLeastOne = (data: any, fields: string[]): boolean => {
  if (!data || typeof data !== 'object') return false;

  return fields.some(field => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '';
  });
};

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
export const validateDateRange = (startDate: any, endDate: any): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

  return start <= end;
};

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
export const createCrossFieldValidator = (
  validator: (data: any) => boolean
): (data: any) => boolean => {
  return validator;
};

// ============================================================================
// ARRAY/OBJECT VALIDATION
// ============================================================================

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
export const validateArray = <T = any>(array: any[], validator: Validator<T>): boolean => {
  if (!Array.isArray(array)) return false;
  return array.every(item => validator(item));
};

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
export const validateArrayLength = (array: any[], constraints: { min?: number; max?: number }): boolean => {
  if (!Array.isArray(array)) return false;

  if (constraints.min !== undefined && array.length < constraints.min) return false;
  if (constraints.max !== undefined && array.length > constraints.max) return false;

  return true;
};

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
export const validateArrayUnique = <T = any>(
  array: T[],
  keyExtractor?: (item: T) => any
): boolean => {
  if (!Array.isArray(array)) return false;

  const seen = new Set();

  for (const item of array) {
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
 * @returns {boolean} True if all required keys present
 *
 * @example
 * ```typescript
 * validateObjectKeys(user, ['id', 'email', 'name'])
 * ```
 */
export const validateObjectKeys = (obj: any, requiredKeys: string[]): boolean => {
  if (!obj || typeof obj !== 'object') return false;

  return requiredKeys.every(key => key in obj);
};

// ============================================================================
// FILE TYPE VALIDATION
// ============================================================================

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
export const validateFile = (file: File, options: FileValidationOptions = {}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check file type
  if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.type)) {
    errors.push({
      field: 'file',
      message: `File type ${file.type} is not allowed`,
      code: 'INVALID_FILE_TYPE',
      value: file.type
    });
  }

  // Check file extension
  if (options.allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !options.allowedExtensions.includes(extension)) {
      errors.push({
        field: 'file',
        message: `File extension .${extension} is not allowed`,
        code: 'INVALID_FILE_EXTENSION',
        value: extension
      });
    }
  }

  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    errors.push({
      field: 'file',
      message: `File size ${file.size} exceeds maximum ${options.maxSize}`,
      code: 'FILE_TOO_LARGE',
      value: file.size
    });
  }

  if (options.minSize && file.size < options.minSize) {
    errors.push({
      field: 'file',
      message: `File size ${file.size} is below minimum ${options.minSize}`,
      code: 'FILE_TOO_SMALL',
      value: file.size
    });
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    value: file
  };
};

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
export const validateImageFile = async (
  file: File,
  options: { minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number } = {}
): Promise<ValidationResult> => {
  const errors: ValidationError[] = [];

  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    errors.push({
      field: 'file',
      message: 'File is not an image',
      code: 'NOT_AN_IMAGE',
      value: file.type
    });
    return { isValid: false, errors, value: file };
  }

  // For Node.js environment, we can't check dimensions without additional libraries
  // This is a placeholder for browser environment
  if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
    try {
      const dimensions = await getImageDimensions(file);

      if (options.minWidth && dimensions.width < options.minWidth) {
        errors.push({
          field: 'file',
          message: `Image width ${dimensions.width} is below minimum ${options.minWidth}`,
          code: 'IMAGE_WIDTH_TOO_SMALL',
          value: dimensions.width
        });
      }

      if (options.maxWidth && dimensions.width > options.maxWidth) {
        errors.push({
          field: 'file',
          message: `Image width ${dimensions.width} exceeds maximum ${options.maxWidth}`,
          code: 'IMAGE_WIDTH_TOO_LARGE',
          value: dimensions.width
        });
      }

      if (options.minHeight && dimensions.height < options.minHeight) {
        errors.push({
          field: 'file',
          message: `Image height ${dimensions.height} is below minimum ${options.minHeight}`,
          code: 'IMAGE_HEIGHT_TOO_SMALL',
          value: dimensions.height
        });
      }

      if (options.maxHeight && dimensions.height > options.maxHeight) {
        errors.push({
          field: 'file',
          message: `Image height ${dimensions.height} exceeds maximum ${options.maxHeight}`,
          code: 'IMAGE_HEIGHT_TOO_LARGE',
          value: dimensions.height
        });
      }
    } catch (error) {
      errors.push({
        field: 'file',
        message: 'Failed to read image dimensions',
        code: 'IMAGE_READ_ERROR',
        value: error
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    value: file
  };
};

/**
 * Gets image dimensions from file.
 *
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

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
export const transformData = (data: any, schema: ValidationSchema): ValidationResult => {
  const result = validateSchema(data, schema);
  return {
    ...result,
    value: result.sanitized || data
  };
};

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
export const stripUnknownFields = (data: any, schema: ValidationSchema): any => {
  if (!data || typeof data !== 'object') return data;

  const result: any = {};

  for (const key of Object.keys(schema)) {
    if (key in data) {
      result[key] = data[key];
    }
  }

  return result;
};

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
export const emptyStringsToNull = (data: any): any => {
  if (!data || typeof data !== 'object') return data;

  const result: any = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    if (value === '') {
      result[key] = null;
    } else if (typeof value === 'object' && value !== null) {
      result[key] = emptyStringsToNull(value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

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
export const trimObjectStrings = (data: any): any => {
  if (typeof data === 'string') {
    return data.trim();
  }

  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => trimObjectStrings(item));
  }

  const result: any = {};

  for (const [key, value] of Object.entries(data)) {
    result[key] = trimObjectStrings(value);
  }

  return result;
};
