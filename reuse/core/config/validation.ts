/**
 * @fileoverview Configuration Validation Utilities
 * @module core/config/validation
 *
 * Configuration validation, schema definitions, and validation rules
 * for ensuring configuration integrity.
 */

/**
 * Validation rule type
 */
export type ValidationRule<T = any> = (value: T) => boolean | string;

/**
 * Validation schema for a configuration object
 */
export interface ValidationSchema<T = any> {
  [key: string]: {
    /** Field type */
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    /** Required field flag */
    required?: boolean;
    /** Custom validation rules */
    rules?: ValidationRule<any>[];
    /** Nested schema for objects */
    schema?: ValidationSchema;
    /** Default value */
    default?: any;
    /** Field description */
    description?: string;
  };
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Validation success flag */
  valid: boolean;
  /** Validation errors */
  errors: Array<{
    field: string;
    message: string;
  }>;
  /** Warnings */
  warnings?: Array<{
    field: string;
    message: string;
  }>;
}

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
export function validateConfig(
  value: any,
  schema: ValidationSchema,
  path: string = ''
): ValidationResult {
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];

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
export function validateType(
  value: any,
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
): boolean {
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
export const ValidationRules = {
  /**
   * Validates string is not empty
   */
  notEmpty: (message = 'Value cannot be empty'): ValidationRule<string> => {
    return (value: string) => (value && value.trim().length > 0) || message;
  },

  /**
   * Validates string minimum length
   */
  minLength: (min: number, message?: string): ValidationRule<string> => {
    return (value: string) =>
      value.length >= min || message || `Minimum length is ${min}`;
  },

  /**
   * Validates string maximum length
   */
  maxLength: (max: number, message?: string): ValidationRule<string> => {
    return (value: string) =>
      value.length <= max || message || `Maximum length is ${max}`;
  },

  /**
   * Validates number is within range
   */
  range: (min: number, max: number, message?: string): ValidationRule<number> => {
    return (value: number) =>
      (value >= min && value <= max) ||
      message ||
      `Value must be between ${min} and ${max}`;
  },

  /**
   * Validates number is positive
   */
  positive: (message = 'Value must be positive'): ValidationRule<number> => {
    return (value: number) => value > 0 || message;
  },

  /**
   * Validates number is non-negative
   */
  nonNegative: (message = 'Value must be non-negative'): ValidationRule<number> => {
    return (value: number) => value >= 0 || message;
  },

  /**
   * Validates string matches pattern
   */
  pattern: (regex: RegExp, message?: string): ValidationRule<string> => {
    return (value: string) =>
      regex.test(value) || message || `Value does not match pattern ${regex}`;
  },

  /**
   * Validates email format
   */
  email: (message = 'Invalid email format'): ValidationRule<string> => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (value: string) => emailRegex.test(value) || message;
  },

  /**
   * Validates URL format
   */
  url: (message = 'Invalid URL format'): ValidationRule<string> => {
    return (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return message;
      }
    };
  },

  /**
   * Validates value is one of allowed values
   */
  oneOf: <T>(allowedValues: T[], message?: string): ValidationRule<T> => {
    return (value: T) =>
      allowedValues.includes(value) ||
      message ||
      `Value must be one of: ${allowedValues.join(', ')}`;
  },

  /**
   * Validates array is not empty
   */
  notEmptyArray: (message = 'Array cannot be empty'): ValidationRule<any[]> => {
    return (value: any[]) => value.length > 0 || message;
  },

  /**
   * Validates array minimum length
   */
  minArrayLength: (min: number, message?: string): ValidationRule<any[]> => {
    return (value: any[]) =>
      value.length >= min || message || `Array minimum length is ${min}`;
  },

  /**
   * Validates array maximum length
   */
  maxArrayLength: (max: number, message?: string): ValidationRule<any[]> => {
    return (value: any[]) =>
      value.length <= max || message || `Array maximum length is ${max}`;
  },

  /**
   * Validates port number
   */
  port: (message = 'Invalid port number'): ValidationRule<number> => {
    return (value: number) => (value >= 1 && value <= 65535) || message;
  },

  /**
   * Validates IP address (v4)
   */
  ipv4: (message = 'Invalid IPv4 address'): ValidationRule<string> => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return (value: string) => ipv4Regex.test(value) || message;
  },

  /**
   * Validates hostname
   */
  hostname: (message = 'Invalid hostname'): ValidationRule<string> => {
    const hostnameRegex =
      /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
    return (value: string) => hostnameRegex.test(value) || message;
  },

  /**
   * Custom validation function
   */
  custom: (fn: (value: any) => boolean, message: string): ValidationRule => {
    return (value: any) => fn(value) || message;
  },
};

/**
 * Applies default values from schema to configuration
 *
 * @param config - Configuration object
 * @param schema - Validation schema with defaults
 * @returns Configuration with defaults applied
 */
export function applyDefaults<T extends Record<string, any>>(
  config: Partial<T>,
  schema: ValidationSchema
): T {
  const result = { ...config } as T;

  for (const [key, fieldSchema] of Object.entries(schema)) {
    if (result[key] === undefined && fieldSchema.default !== undefined) {
      result[key] = fieldSchema.default;
    }

    // Apply nested defaults
    if (
      fieldSchema.schema &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
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
export function sanitizeConfig<T extends Record<string, any>>(
  config: any,
  schema: ValidationSchema
): Partial<T> {
  const result: any = {};

  for (const [key, fieldSchema] of Object.entries(schema)) {
    if (config[key] !== undefined) {
      if (fieldSchema.schema && typeof config[key] === 'object') {
        result[key] = sanitizeConfig(config[key], fieldSchema.schema);
      } else {
        result[key] = config[key];
      }
    }
  }

  return result as Partial<T>;
}

/**
 * Creates a validator function from a schema
 *
 * @param schema - Validation schema
 * @returns Validator function
 */
export function createValidator<T = any>(
  schema: ValidationSchema
): (value: T) => ValidationResult {
  return (value: T) => validateConfig(value, schema);
}

/**
 * Validates and throws error if validation fails
 *
 * @param value - Value to validate
 * @param schema - Validation schema
 * @throws Error if validation fails
 */
export function validateOrThrow(value: any, schema: ValidationSchema): void {
  const result = validateConfig(value, schema);
  if (!result.valid) {
    const errorMessages = result.errors
      .map((e) => `${e.field}: ${e.message}`)
      .join('\n');
    throw new Error(`Configuration validation failed:\n${errorMessages}`);
  }
}
