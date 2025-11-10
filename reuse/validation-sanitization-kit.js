"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimObjectStrings = exports.emptyStringsToNull = exports.stripUnknownFields = exports.transformData = exports.validateImageFile = exports.validateFile = exports.validateObjectKeys = exports.validateArrayUnique = exports.validateArrayLength = exports.validateArray = exports.createCrossFieldValidator = exports.validateDateRange = exports.validateAtLeastOne = exports.validateFieldsMatch = exports.validateWhen = exports.createConditionalValidator = exports.validateAsync = exports.createAsyncValidator = exports.createLengthValidator = exports.createEnumValidator = exports.createRegexValidator = exports.createValidator = exports.formatSSN = exports.isValidEIN = exports.isValidSSN = exports.formatCreditCard = exports.detectCardType = exports.validateLuhn = exports.validateCreditCard = exports.isValidTime = exports.isValidDateFormat = exports.isValidDate = exports.normalizeURL = exports.isPrivateIP = exports.isValidURL = exports.parsePhoneNumber = exports.formatPhoneNumber = exports.isValidPhoneNumber = exports.extractEmailDomain = exports.normalizeEmail = exports.isValidEmail = exports.sanitizeFilename = exports.stripHtmlTags = exports.sanitizeSqlInput = exports.unescapeHtml = exports.escapeHtml = exports.sanitizeInput = exports.validateType = exports.validateSchemaAsync = exports.validateSchema = void 0;
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
const validateSchema = (data, schema) => {
    const errors = [];
    const sanitized = {};
    for (const [field, fieldSchema] of Object.entries(schema)) {
        const value = data?.[field];
        const fieldDef = fieldSchema;
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
        if (fieldDef.type && !(0, exports.validateType)(value, fieldDef.type)) {
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
exports.validateSchema = validateSchema;
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
const validateSchemaAsync = async (data, schema) => {
    const errors = [];
    const sanitized = {};
    for (const [field, fieldSchema] of Object.entries(schema)) {
        const value = data?.[field];
        const fieldDef = fieldSchema;
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
        if (fieldDef.type && !(0, exports.validateType)(value, fieldDef.type)) {
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
exports.validateSchemaAsync = validateSchemaAsync;
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
const validateType = (value, type) => {
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
            return (0, exports.isValidEmail)(value);
        case 'url':
            return (0, exports.isValidURL)(value);
        case 'phone':
            return (0, exports.isValidPhoneNumber)(value);
        case 'creditcard':
            return (0, exports.validateCreditCard)(value).isValid;
        case 'ssn':
            return (0, exports.isValidSSN)(value);
        case 'array':
            return Array.isArray(value);
        case 'object':
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        default:
            return true;
    }
};
exports.validateType = validateType;
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
const sanitizeInput = (input, options = {}) => {
    if (typeof input !== 'string')
        return '';
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
        sanitized = (0, exports.escapeHtml)(sanitized);
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
    }
    else if (options.uppercase) {
        sanitized = sanitized.toUpperCase();
    }
    return sanitized;
};
exports.sanitizeInput = sanitizeInput;
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
const escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
};
exports.escapeHtml = escapeHtml;
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
const unescapeHtml = (text) => {
    const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (entity) => map[entity]);
};
exports.unescapeHtml = unescapeHtml;
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
const sanitizeSqlInput = (input) => {
    if (typeof input !== 'string')
        return '';
    // Remove SQL comments
    let sanitized = input.replace(/--.*$/gm, '');
    sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove dangerous SQL keywords patterns
    sanitized = sanitized.replace(/;\s*(DROP|DELETE|TRUNCATE|ALTER|EXEC|EXECUTE)\s+/gi, '; ');
    // Escape single quotes
    sanitized = sanitized.replace(/'/g, "''");
    return sanitized;
};
exports.sanitizeSqlInput = sanitizeSqlInput;
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
const stripHtmlTags = (html, allowedTags = []) => {
    if (typeof html !== 'string')
        return '';
    if (allowedTags.length === 0) {
        return html.replace(/<[^>]*>/g, '');
    }
    const tagPattern = new RegExp(`<(?!\/?(${allowedTags.join('|')})\b)[^>]*>`, 'gi');
    return html.replace(tagPattern, '');
};
exports.stripHtmlTags = stripHtmlTags;
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
const sanitizeFilename = (filename) => {
    if (typeof filename !== 'string')
        return '';
    // Remove directory traversal patterns
    let sanitized = filename.replace(/\.\./g, '');
    sanitized = sanitized.replace(/[\/\\]/g, '-');
    // Remove special characters
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '');
    // Remove leading dots
    sanitized = sanitized.replace(/^\.+/, '');
    return sanitized || 'unnamed';
};
exports.sanitizeFilename = sanitizeFilename;
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
const isValidEmail = (email, options = {}) => {
    if (typeof email !== 'string')
        return false;
    const { requireTld = true, allowIpDomain = false, domainBlacklist = [], domainWhitelist = [] } = options;
    // Basic email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        if (!allowIpDomain)
            return false;
        // Check for IP domain
        const ipPattern = /^[^\s@]+@\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/;
        if (!ipPattern.test(email))
            return false;
    }
    // Extract domain
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain)
        return false;
    // Check TLD requirement
    if (requireTld && !domain.includes('.'))
        return false;
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
exports.isValidEmail = isValidEmail;
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
const normalizeEmail = (email) => {
    if (typeof email !== 'string')
        return '';
    return email.trim().toLowerCase();
};
exports.normalizeEmail = normalizeEmail;
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
const extractEmailDomain = (email) => {
    if (!(0, exports.isValidEmail)(email))
        return null;
    return email.split('@')[1].toLowerCase();
};
exports.extractEmailDomain = extractEmailDomain;
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
const isValidPhoneNumber = (phone, options = {}) => {
    if (typeof phone !== 'string')
        return false;
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
exports.isValidPhoneNumber = isValidPhoneNumber;
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
const formatPhoneNumber = (phone, countryCode = 'US') => {
    if (typeof phone !== 'string')
        return null;
    const cleaned = phone.replace(/[\s\-().]/g, '');
    // Already in E.164 format
    if (cleaned.startsWith('+')) {
        return cleaned;
    }
    // Country code prefixes
    const countryPrefixes = {
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
exports.formatPhoneNumber = formatPhoneNumber;
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
const parsePhoneNumber = (phone) => {
    if (typeof phone !== 'string')
        return null;
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
exports.parsePhoneNumber = parsePhoneNumber;
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
const isValidURL = (url, options = {}) => {
    if (typeof url !== 'string')
        return false;
    const { protocols = ['http', 'https'], requireProtocol = true, requireTld = true, allowLocalhost = false, allowPrivateIP = false } = options;
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
        if (!allowPrivateIP && (0, exports.isPrivateIP)(urlObj.hostname)) {
            return false;
        }
        // Check TLD
        if (requireTld && !urlObj.hostname.includes('.')) {
            return false;
        }
        return true;
    }
    catch {
        // If requireProtocol is false, try adding protocol
        if (!requireProtocol && !url.includes('://')) {
            return (0, exports.isValidURL)(`http://${url}`, { ...options, requireProtocol: true });
        }
        return false;
    }
};
exports.isValidURL = isValidURL;
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
const isPrivateIP = (hostname) => {
    const privateRanges = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[01])\./,
        /^192\.168\./,
        /^127\./,
        /^169\.254\./
    ];
    return privateRanges.some(range => range.test(hostname));
};
exports.isPrivateIP = isPrivateIP;
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
const normalizeURL = (url) => {
    if (typeof url !== 'string')
        return null;
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
    }
    catch {
        return null;
    }
};
exports.normalizeURL = normalizeURL;
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
const isValidDate = (date, options = {}) => {
    const { min, max, allowFuture = true, allowPast = true } = options;
    let dateObj;
    // Convert to Date object
    if (date instanceof Date) {
        dateObj = date;
    }
    else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
    }
    else {
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
exports.isValidDate = isValidDate;
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
const isValidDateFormat = (dateString, format = 'YYYY-MM-DD') => {
    if (typeof dateString !== 'string')
        return false;
    const formats = {
        'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
        'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
        'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
        'YYYY/MM/DD': /^\d{4}\/\d{2}\/\d{2}$/,
        'ISO8601': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
    };
    const pattern = formats[format];
    if (!pattern)
        return false;
    if (!pattern.test(dateString))
        return false;
    // Validate actual date values
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};
exports.isValidDateFormat = isValidDateFormat;
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
const isValidTime = (time, is24Hour = true) => {
    if (typeof time !== 'string')
        return false;
    if (is24Hour) {
        const pattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
        return pattern.test(time);
    }
    else {
        const pattern = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;
        return pattern.test(time);
    }
};
exports.isValidTime = isValidTime;
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
const validateCreditCard = (cardNumber) => {
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
    const type = (0, exports.detectCardType)(cleaned);
    // Validate using Luhn algorithm
    const luhnValid = (0, exports.validateLuhn)(cleaned);
    // Check length based on card type
    const lengthValid = validateCardLength(cleaned, type);
    return {
        isValid: luhnValid && lengthValid,
        type,
        luhnValid,
        formatted: (0, exports.formatCreditCard)(cleaned)
    };
};
exports.validateCreditCard = validateCreditCard;
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
const validateLuhn = (cardNumber) => {
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
exports.validateLuhn = validateLuhn;
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
const detectCardType = (cardNumber) => {
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
            return type;
        }
    }
    return 'unknown';
};
exports.detectCardType = detectCardType;
/**
 * Validates card number length based on card type.
 *
 * @param {string} cardNumber - Card number
 * @param {string} type - Card type
 * @returns {boolean} True if length is valid
 */
const validateCardLength = (cardNumber, type) => {
    const lengths = {
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
const formatCreditCard = (cardNumber) => {
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    const type = (0, exports.detectCardType)(cleaned);
    // Amex: 4-6-5 format
    if (type === 'amex') {
        return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    // Others: 4-4-4-4 format
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
};
exports.formatCreditCard = formatCreditCard;
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
const isValidSSN = (ssn) => {
    if (typeof ssn !== 'string')
        return false;
    // Remove dashes and spaces
    const cleaned = ssn.replace(/[\s-]/g, '');
    // Must be 9 digits
    if (!/^\d{9}$/.test(cleaned))
        return false;
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
exports.isValidSSN = isValidSSN;
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
const isValidEIN = (ein) => {
    if (typeof ein !== 'string')
        return false;
    // Remove dashes and spaces
    const cleaned = ein.replace(/[\s-]/g, '');
    // Must be 9 digits
    if (!/^\d{9}$/.test(cleaned))
        return false;
    // First two digits cannot be 00
    const prefix = cleaned.substring(0, 2);
    if (prefix === '00') {
        return false;
    }
    return true;
};
exports.isValidEIN = isValidEIN;
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
const formatSSN = (ssn) => {
    if (!(0, exports.isValidSSN)(ssn))
        return null;
    const cleaned = ssn.replace(/[\s-]/g, '');
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 5)}-${cleaned.substring(5, 9)}`;
};
exports.formatSSN = formatSSN;
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
const createValidator = (validator, constraints = {}) => {
    return (value) => {
        if (!validator(value))
            return false;
        if (typeof value === 'number') {
            if (constraints.min !== undefined && value < constraints.min)
                return false;
            if (constraints.max !== undefined && value > constraints.max)
                return false;
        }
        return true;
    };
};
exports.createValidator = createValidator;
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
const createRegexValidator = (pattern, errorMessage) => {
    const validator = (value) => {
        if (typeof value !== 'string')
            return false;
        return pattern.test(value);
    };
    // Attach error message for better debugging
    validator.errorMessage = errorMessage;
    return validator;
};
exports.createRegexValidator = createRegexValidator;
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
const createEnumValidator = (allowedValues) => {
    return (value) => {
        return allowedValues.includes(value);
    };
};
exports.createEnumValidator = createEnumValidator;
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
const createLengthValidator = (constraints) => {
    return (value) => {
        if (typeof value !== 'string' && !Array.isArray(value))
            return false;
        const length = value.length;
        if (constraints.min !== undefined && length < constraints.min)
            return false;
        if (constraints.max !== undefined && length > constraints.max)
            return false;
        return true;
    };
};
exports.createLengthValidator = createLengthValidator;
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
const createAsyncValidator = (validator, delay = 0) => {
    let timeoutId;
    return async (value) => {
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
exports.createAsyncValidator = createAsyncValidator;
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
const validateAsync = async (validator, value, timeout = 5000) => {
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(false), timeout);
    });
    const validationPromise = validator(value);
    return Promise.race([validationPromise, timeoutPromise]);
};
exports.validateAsync = validateAsync;
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
const createConditionalValidator = (condition, thenValidator, elseValidator) => {
    return (value, data) => {
        if (condition(data)) {
            return thenValidator(value);
        }
        else if (elseValidator) {
            return elseValidator(value);
        }
        return true;
    };
};
exports.createConditionalValidator = createConditionalValidator;
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
const validateWhen = (condition, validator) => {
    return (value, data) => {
        if (!condition(data))
            return true;
        return validator(value);
    };
};
exports.validateWhen = validateWhen;
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
const validateFieldsMatch = (data, field1, field2) => {
    if (!data || typeof data !== 'object')
        return false;
    return data[field1] === data[field2];
};
exports.validateFieldsMatch = validateFieldsMatch;
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
const validateAtLeastOne = (data, fields) => {
    if (!data || typeof data !== 'object')
        return false;
    return fields.some(field => {
        const value = data[field];
        return value !== undefined && value !== null && value !== '';
    });
};
exports.validateAtLeastOne = validateAtLeastOne;
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
const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
        return false;
    return start <= end;
};
exports.validateDateRange = validateDateRange;
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
const createCrossFieldValidator = (validator) => {
    return validator;
};
exports.createCrossFieldValidator = createCrossFieldValidator;
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
const validateArray = (array, validator) => {
    if (!Array.isArray(array))
        return false;
    return array.every(item => validator(item));
};
exports.validateArray = validateArray;
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
const validateArrayLength = (array, constraints) => {
    if (!Array.isArray(array))
        return false;
    if (constraints.min !== undefined && array.length < constraints.min)
        return false;
    if (constraints.max !== undefined && array.length > constraints.max)
        return false;
    return true;
};
exports.validateArrayLength = validateArrayLength;
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
const validateArrayUnique = (array, keyExtractor) => {
    if (!Array.isArray(array))
        return false;
    const seen = new Set();
    for (const item of array) {
        const key = keyExtractor ? keyExtractor(item) : item;
        if (seen.has(key))
            return false;
        seen.add(key);
    }
    return true;
};
exports.validateArrayUnique = validateArrayUnique;
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
const validateObjectKeys = (obj, requiredKeys) => {
    if (!obj || typeof obj !== 'object')
        return false;
    return requiredKeys.every(key => key in obj);
};
exports.validateObjectKeys = validateObjectKeys;
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
const validateFile = (file, options = {}) => {
    const errors = [];
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
exports.validateFile = validateFile;
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
const validateImageFile = async (file, options = {}) => {
    const errors = [];
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
        }
        catch (error) {
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
exports.validateImageFile = validateImageFile;
/**
 * Gets image dimensions from file.
 *
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
const getImageDimensions = (file) => {
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
const transformData = (data, schema) => {
    const result = (0, exports.validateSchema)(data, schema);
    return {
        ...result,
        value: result.sanitized || data
    };
};
exports.transformData = transformData;
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
const stripUnknownFields = (data, schema) => {
    if (!data || typeof data !== 'object')
        return data;
    const result = {};
    for (const key of Object.keys(schema)) {
        if (key in data) {
            result[key] = data[key];
        }
    }
    return result;
};
exports.stripUnknownFields = stripUnknownFields;
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
const emptyStringsToNull = (data) => {
    if (!data || typeof data !== 'object')
        return data;
    const result = Array.isArray(data) ? [] : {};
    for (const [key, value] of Object.entries(data)) {
        if (value === '') {
            result[key] = null;
        }
        else if (typeof value === 'object' && value !== null) {
            result[key] = (0, exports.emptyStringsToNull)(value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
};
exports.emptyStringsToNull = emptyStringsToNull;
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
const trimObjectStrings = (data) => {
    if (typeof data === 'string') {
        return data.trim();
    }
    if (!data || typeof data !== 'object') {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(item => (0, exports.trimObjectStrings)(item));
    }
    const result = {};
    for (const [key, value] of Object.entries(data)) {
        result[key] = (0, exports.trimObjectStrings)(value);
    }
    return result;
};
exports.trimObjectStrings = trimObjectStrings;
//# sourceMappingURL=validation-sanitization-kit.js.map