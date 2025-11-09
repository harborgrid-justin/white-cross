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
export declare function validateConfig(value: any, schema: ValidationSchema, path?: string): ValidationResult;
/**
 * Validates value type
 *
 * @param value - Value to validate
 * @param type - Expected type
 * @returns True if type matches
 */
export declare function validateType(value: any, type: 'string' | 'number' | 'boolean' | 'array' | 'object'): boolean;
/**
 * Common validation rules
 */
export declare const ValidationRules: {
    /**
     * Validates string is not empty
     */
    notEmpty: (message?: string) => ValidationRule<string>;
    /**
     * Validates string minimum length
     */
    minLength: (min: number, message?: string) => ValidationRule<string>;
    /**
     * Validates string maximum length
     */
    maxLength: (max: number, message?: string) => ValidationRule<string>;
    /**
     * Validates number is within range
     */
    range: (min: number, max: number, message?: string) => ValidationRule<number>;
    /**
     * Validates number is positive
     */
    positive: (message?: string) => ValidationRule<number>;
    /**
     * Validates number is non-negative
     */
    nonNegative: (message?: string) => ValidationRule<number>;
    /**
     * Validates string matches pattern
     */
    pattern: (regex: RegExp, message?: string) => ValidationRule<string>;
    /**
     * Validates email format
     */
    email: (message?: string) => ValidationRule<string>;
    /**
     * Validates URL format
     */
    url: (message?: string) => ValidationRule<string>;
    /**
     * Validates value is one of allowed values
     */
    oneOf: <T>(allowedValues: T[], message?: string) => ValidationRule<T>;
    /**
     * Validates array is not empty
     */
    notEmptyArray: (message?: string) => ValidationRule<any[]>;
    /**
     * Validates array minimum length
     */
    minArrayLength: (min: number, message?: string) => ValidationRule<any[]>;
    /**
     * Validates array maximum length
     */
    maxArrayLength: (max: number, message?: string) => ValidationRule<any[]>;
    /**
     * Validates port number
     */
    port: (message?: string) => ValidationRule<number>;
    /**
     * Validates IP address (v4)
     */
    ipv4: (message?: string) => ValidationRule<string>;
    /**
     * Validates hostname
     */
    hostname: (message?: string) => ValidationRule<string>;
    /**
     * Custom validation function
     */
    custom: (fn: (value: any) => boolean, message: string) => ValidationRule;
};
/**
 * Applies default values from schema to configuration
 *
 * @param config - Configuration object
 * @param schema - Validation schema with defaults
 * @returns Configuration with defaults applied
 */
export declare function applyDefaults<T extends Record<string, any>>(config: Partial<T>, schema: ValidationSchema): T;
/**
 * Sanitizes configuration by removing unknown fields
 *
 * @param config - Configuration object
 * @param schema - Validation schema
 * @returns Sanitized configuration
 */
export declare function sanitizeConfig<T extends Record<string, any>>(config: any, schema: ValidationSchema): Partial<T>;
/**
 * Creates a validator function from a schema
 *
 * @param schema - Validation schema
 * @returns Validator function
 */
export declare function createValidator<T = any>(schema: ValidationSchema): (value: T) => ValidationResult;
/**
 * Validates and throws error if validation fails
 *
 * @param value - Value to validate
 * @param schema - Validation schema
 * @throws Error if validation fails
 */
export declare function validateOrThrow(value: any, schema: ValidationSchema): void;
//# sourceMappingURL=validation.d.ts.map