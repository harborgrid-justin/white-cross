"use strict";
/**
 * @fileoverview Configuration Validation Utilities
 * @module core/config/validation
 *
 * Configuration validation, schema definitions, and validation rules
 * for ensuring configuration integrity.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRules = void 0;
exports.validateConfig = validateConfig;
exports.validateType = validateType;
exports.applyDefaults = applyDefaults;
exports.sanitizeConfig = sanitizeConfig;
exports.createValidator = createValidator;
exports.validateOrThrow = validateOrThrow;
/**
 * Validates a value against a schema
 *
 * @param value - Value to validate
 * @param schema - Validation schema
 * @param path - Current field path (for nested objects)
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const schema: ValidationSchema = {
 *   port: {
 *     type: 'number',
 *     required: true,
 *     rules: [(v) => v > 0 && v < 65536 || 'Port must be between 1 and 65535']
 *   },
 *   host: {
 *     type: 'string',
 *     required: true
 *   }
 * };
 *
 * const result = validateConfig({ port: 3000, host: 'localhost' }, schema);
 * ```
 */
function validateConfig(value, schema, path = '') {
    const errors = [];
    const warnings = [];
    for (const [key, fieldSchema] of Object.entries(schema)) {
        const fieldPath = path ? `${path}.${key}` : key;
        const fieldValue = value?.[key];
        // Check required fields
        if (fieldSchema.required && (fieldValue === undefined || fieldValue === null)) {
            errors.push({
                field: fieldPath,
                message: `Field is required`,
            });
            continue;
        }
        // Skip validation if field is not present and not required
        if (fieldValue === undefined || fieldValue === null) {
            continue;
        }
        // Type validation
        if (fieldSchema.type) {
            const typeValid = validateType(fieldValue, fieldSchema.type);
            if (!typeValid) {
                errors.push({
                    field: fieldPath,
                    message: `Expected type ${fieldSchema.type}, got ${typeof fieldValue}`,
                });
                continue;
            }
        }
        // Custom rules validation
        if (fieldSchema.rules) {
            for (const rule of fieldSchema.rules) {
                const result = rule(fieldValue);
                if (result !== true) {
                    errors.push({
                        field: fieldPath,
                        message: typeof result === 'string' ? result : 'Validation failed',
                    });
                }
            }
        }
        // Nested object validation
        if (fieldSchema.schema && typeof fieldValue === 'object') {
            const nestedResult = validateConfig(fieldValue, fieldSchema.schema, fieldPath);
            errors.push(...nestedResult.errors);
            if (nestedResult.warnings) {
                warnings.push(...nestedResult.warnings);
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined,
    };
}
/**
 * Validates value type
 *
 * @param value - Value to validate
 * @param type - Expected type
 * @returns True if type matches
 */
function validateType(value, type) {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'array':
            return Array.isArray(value);
        case 'object':
            return typeof value === 'object' && !Array.isArray(value) && value !== null;
        default:
            return false;
    }
}
/**
 * Common validation rules
 */
exports.ValidationRules = {
    /**
     * Validates string is not empty
     */
    notEmpty: (message = 'Value cannot be empty') => {
        return (value) => (value && value.trim().length > 0) || message;
    },
    /**
     * Validates string minimum length
     */
    minLength: (min, message) => {
        return (value) => value.length >= min || message || `Minimum length is ${min}`;
    },
    /**
     * Validates string maximum length
     */
    maxLength: (max, message) => {
        return (value) => value.length <= max || message || `Maximum length is ${max}`;
    },
    /**
     * Validates number is within range
     */
    range: (min, max, message) => {
        return (value) => (value >= min && value <= max) ||
            message ||
            `Value must be between ${min} and ${max}`;
    },
    /**
     * Validates number is positive
     */
    positive: (message = 'Value must be positive') => {
        return (value) => value > 0 || message;
    },
    /**
     * Validates number is non-negative
     */
    nonNegative: (message = 'Value must be non-negative') => {
        return (value) => value >= 0 || message;
    },
    /**
     * Validates string matches pattern
     */
    pattern: (regex, message) => {
        return (value) => regex.test(value) || message || `Value does not match pattern ${regex}`;
    },
    /**
     * Validates email format
     */
    email: (message = 'Invalid email format') => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return (value) => emailRegex.test(value) || message;
    },
    /**
     * Validates URL format
     */
    url: (message = 'Invalid URL format') => {
        return (value) => {
            try {
                new URL(value);
                return true;
            }
            catch {
                return message;
            }
        };
    },
    /**
     * Validates value is one of allowed values
     */
    oneOf: (allowedValues, message) => {
        return (value) => allowedValues.includes(value) ||
            message ||
            `Value must be one of: ${allowedValues.join(', ')}`;
    },
    /**
     * Validates array is not empty
     */
    notEmptyArray: (message = 'Array cannot be empty') => {
        return (value) => value.length > 0 || message;
    },
    /**
     * Validates array minimum length
     */
    minArrayLength: (min, message) => {
        return (value) => value.length >= min || message || `Array minimum length is ${min}`;
    },
    /**
     * Validates array maximum length
     */
    maxArrayLength: (max, message) => {
        return (value) => value.length <= max || message || `Array maximum length is ${max}`;
    },
    /**
     * Validates port number
     */
    port: (message = 'Invalid port number') => {
        return (value) => (value >= 1 && value <= 65535) || message;
    },
    /**
     * Validates IP address (v4)
     */
    ipv4: (message = 'Invalid IPv4 address') => {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return (value) => ipv4Regex.test(value) || message;
    },
    /**
     * Validates hostname
     */
    hostname: (message = 'Invalid hostname') => {
        const hostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
        return (value) => hostnameRegex.test(value) || message;
    },
    /**
     * Custom validation function
     */
    custom: (fn, message) => {
        return (value) => fn(value) || message;
    },
};
/**
 * Applies default values from schema to configuration
 *
 * @param config - Configuration object
 * @param schema - Validation schema with defaults
 * @returns Configuration with defaults applied
 */
function applyDefaults(config, schema) {
    const result = { ...config };
    for (const [key, fieldSchema] of Object.entries(schema)) {
        if (result[key] === undefined && fieldSchema.default !== undefined) {
            result[key] = fieldSchema.default;
        }
        // Apply nested defaults
        if (fieldSchema.schema &&
            typeof result[key] === 'object' &&
            !Array.isArray(result[key])) {
            result[key] = applyDefaults(result[key] || {}, fieldSchema.schema);
        }
    }
    return result;
}
/**
 * Sanitizes configuration by removing unknown fields
 *
 * @param config - Configuration object
 * @param schema - Validation schema
 * @returns Sanitized configuration
 */
function sanitizeConfig(config, schema) {
    const result = {};
    for (const [key, fieldSchema] of Object.entries(schema)) {
        if (config[key] !== undefined) {
            if (fieldSchema.schema && typeof config[key] === 'object') {
                result[key] = sanitizeConfig(config[key], fieldSchema.schema);
            }
            else {
                result[key] = config[key];
            }
        }
    }
    return result;
}
/**
 * Creates a validator function from a schema
 *
 * @param schema - Validation schema
 * @returns Validator function
 */
function createValidator(schema) {
    return (value) => validateConfig(value, schema);
}
/**
 * Validates and throws error if validation fails
 *
 * @param value - Value to validate
 * @param schema - Validation schema
 * @throws Error if validation fails
 */
function validateOrThrow(value, schema) {
    const result = validateConfig(value, schema);
    if (!result.valid) {
        const errorMessages = result.errors
            .map((e) => `${e.field}: ${e.message}`)
            .join('\n');
        throw new Error(`Configuration validation failed:\n${errorMessages}`);
    }
}
//# sourceMappingURL=validation.js.map