/**
 * Basic OpenAPI Schema Generators
 *
 * Fundamental schema generators for primitive types (string, number, boolean, array, object).
 * These form the building blocks for more complex schema compositions.
 *
 * @module swagger/schemas/basic-generators
 * @version 1.0.0
 */

/**
 * Generates a basic string schema with validation rules.
 *
 * @param description - Schema description
 * @param options - String validation options
 * @returns OpenAPI schema object for string
 *
 * @example
 * ```typescript
 * // Email field
 * const emailSchema = generateStringSchema('User email address', {
 *   format: 'email',
 *   minLength: 5,
 *   maxLength: 255,
 *   example: 'user@example.com',
 *   pattern: '^[^@]+@[^@]+\\.[^@]+$'
 * });
 * ```
 */
export function generateStringSchema(
  description: string,
  options: {
    format?: 'email' | 'uri' | 'uuid' | 'date' | 'date-time' | 'password' | 'byte' | 'binary';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    example?: string;
    default?: string;
    enum?: string[];
  } = {},
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    type: 'string',
    description,
  };

  if (options.format) {
    schema.format = options.format;
  }

  if (options.minLength !== undefined) {
    schema.minLength = options.minLength;
  }

  if (options.maxLength !== undefined) {
    schema.maxLength = options.maxLength;
  }

  if (options.pattern) {
    schema.pattern = options.pattern;
  }

  if (options.example !== undefined) {
    schema.example = options.example;
  }

  if (options.default !== undefined) {
    schema.default = options.default;
  }

  if (options.enum && options.enum.length > 0) {
    schema.enum = options.enum;
  }

  return schema;
}

/**
 * Generates a numeric schema (integer or number) with validation rules.
 *
 * @param description - Schema description
 * @param options - Numeric validation options
 * @returns OpenAPI schema object for number/integer
 *
 * @example
 * ```typescript
 * // Age field
 * const ageSchema = generateNumericSchema('User age', {
 *   type: 'integer',
 *   minimum: 0,
 *   maximum: 150,
 *   example: 25
 * });
 * ```
 */
export function generateNumericSchema(
  description: string,
  options: {
    type?: 'integer' | 'number';
    format?: 'int32' | 'int64' | 'float' | 'double';
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
    multipleOf?: number;
    example?: number;
    default?: number;
  } = {},
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    type: options.type || 'number',
    description,
  };

  if (options.format) {
    schema.format = options.format;
  }

  if (options.minimum !== undefined) {
    schema.minimum = options.minimum;
  }

  if (options.maximum !== undefined) {
    schema.maximum = options.maximum;
  }

  if (options.exclusiveMinimum !== undefined) {
    schema.exclusiveMinimum = options.exclusiveMinimum;
  }

  if (options.exclusiveMaximum !== undefined) {
    schema.exclusiveMaximum = options.exclusiveMaximum;
  }

  if (options.multipleOf !== undefined) {
    schema.multipleOf = options.multipleOf;
  }

  if (options.example !== undefined) {
    schema.example = options.example;
  }

  if (options.default !== undefined) {
    schema.default = options.default;
  }

  return schema;
}

/**
 * Generates a boolean schema with default value.
 *
 * @param description - Schema description
 * @param defaultValue - Default boolean value
 * @param example - Example value
 * @returns OpenAPI schema object for boolean
 *
 * @example
 * ```typescript
 * // Active flag
 * const activeSchema = generateBooleanSchema('Whether user is active', true, true);
 * ```
 */
export function generateBooleanSchema(
  description: string,
  defaultValue?: boolean,
  example?: boolean,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    type: 'boolean',
    description,
  };

  if (defaultValue !== undefined) {
    schema.default = defaultValue;
  }

  if (example !== undefined) {
    schema.example = example;
  }

  return schema;
}

/**
 * Generates an array schema with item type definition.
 *
 * @param description - Schema description
 * @param itemSchema - Schema for array items
 * @param options - Array validation options
 * @returns OpenAPI schema object for array
 *
 * @example
 * ```typescript
 * // Array of strings
 * const tagsSchema = generateArraySchema(
 *   'Product tags',
 *   { type: 'string', minLength: 1, maxLength: 50 },
 *   { minItems: 1, maxItems: 10, uniqueItems: true }
 * );
 * ```
 */
export function generateArraySchema(
  description: string,
  itemSchema: Record<string, unknown>,
  options: {
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    example?: unknown[];
    default?: unknown[];
  } = {},
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    type: 'array',
    description,
    items: itemSchema,
  };

  if (options.minItems !== undefined) {
    schema.minItems = options.minItems;
  }

  if (options.maxItems !== undefined) {
    schema.maxItems = options.maxItems;
  }

  if (options.uniqueItems !== undefined) {
    schema.uniqueItems = options.uniqueItems;
  }

  if (options.example !== undefined) {
    schema.example = options.example;
  }

  if (options.default !== undefined) {
    schema.default = options.default;
  }

  return schema;
}

/**
 * Generates an object schema with properties.
 *
 * @param description - Schema description
 * @param properties - Object property definitions
 * @param requiredFields - Array of required field names
 * @param options - Object validation options
 * @returns OpenAPI schema object for object
 *
 * @example
 * ```typescript
 * // User profile object
 * const profileSchema = generateObjectSchema(
 *   'User profile information',
 *   {
 *     firstName: { type: 'string', description: 'First name', example: 'John' },
 *     lastName: { type: 'string', description: 'Last name', example: 'Doe' },
 *     age: { type: 'integer', minimum: 0, example: 25 }
 *   },
 *   ['firstName', 'lastName'],
 *   { additionalProperties: false }
 * );
 * ```
 */
export function generateObjectSchema(
  description: string,
  properties: Record<string, unknown>,
  requiredFields: string[] = [],
  options: {
    additionalProperties?: boolean | Record<string, unknown>;
    minProperties?: number;
    maxProperties?: number;
    example?: unknown;
  } = {},
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    type: 'object',
    description,
    properties,
  };

  if (requiredFields.length > 0) {
    schema.required = requiredFields;
  }

  if (options.additionalProperties !== undefined) {
    schema.additionalProperties = options.additionalProperties;
  }

  if (options.minProperties !== undefined) {
    schema.minProperties = options.minProperties;
  }

  if (options.maxProperties !== undefined) {
    schema.maxProperties = options.maxProperties;
  }

  if (options.example !== undefined) {
    schema.example = options.example;
  }

  return schema;
}

/**
 * Generates a reference schema pointing to a component schema.
 *
 * @param schemaName - Name of the component schema to reference
 * @param description - Optional description for the reference
 * @returns OpenAPI schema object with $ref
 *
 * @example
 * ```typescript
 * // Reference to User schema
 * const userRefSchema = generateRefSchema('User', 'User entity reference');
 * ```
 */
export function generateRefSchema(schemaName: string, description?: string): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    $ref: `#/components/schemas/${schemaName}`,
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}
