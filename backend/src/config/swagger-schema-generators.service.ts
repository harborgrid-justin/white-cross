/**
 * Swagger/OpenAPI Schema Generators
 *
 * Enterprise-ready TypeScript utilities for dynamic schema generation,
 * inheritance, polymorphism, and schema composition. Fully compliant
 * with OpenAPI 3.0/3.1 and JSON Schema specifications.
 *
 * @module swagger-schema-generators
 * @version 1.0.0
 */

import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';

/**
 * Type definitions for schema generation options
 */

export interface SchemaGenerationOptions {
  /** Whether to include examples in generated schema */
  includeExamples?: boolean;
  /** Whether to include descriptions */
  includeDescriptions?: boolean;
  /** Default values for properties */
  defaults?: Record<string, any>;
  /** Additional validation rules */
  validation?: Record<string, any>;
}

export interface PropertyDefinition {
  /** Property type */
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  /** Property description */
  description?: string;
  /** Property format (e.g., 'email', 'uuid', 'date-time') */
  format?: string;
  /** Whether property is required */
  required?: boolean;
  /** Example value */
  example?: any;
  /** Enum values */
  enum?: any[];
  /** Default value */
  default?: any;
  /** Validation rules */
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
  };
}

export interface InheritanceConfig {
  /** Base schema type */
  baseType: Type<any>;
  /** Properties to override */
  overrides?: Record<string, PropertyDefinition>;
  /** Additional properties */
  additionalProperties?: Record<string, PropertyDefinition>;
  /** Discriminator property name */
  discriminator?: string;
}

export interface PolymorphicConfig {
  /** Discriminator property name */
  discriminator: string;
  /** Map of discriminator values to schema types */
  mapping: Record<string, Type<any>>;
  /** Description for the polymorphic schema */
  description?: string;
}

// ============================================================================
// BASIC SCHEMA GENERATORS (6 functions)
// ============================================================================

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
 *
 * // URL field
 * const urlSchema = generateStringSchema('Website URL', {
 *   format: 'uri',
 *   example: 'https://example.com',
 *   pattern: '^https?://'
 * });
 *
 * // UUID field
 * const uuidSchema = generateStringSchema('Unique identifier', {
 *   format: 'uuid',
 *   example: '123e4567-e89b-12d3-a456-426614174000'
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
  } = {}
): any {
  const schema: any = {
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
 *
 * // Price field
 * const priceSchema = generateNumericSchema('Product price', {
 *   type: 'number',
 *   format: 'double',
 *   minimum: 0,
 *   exclusiveMinimum: true,
 *   example: 19.99,
 *   multipleOf: 0.01
 * });
 *
 * // Quantity field
 * const quantitySchema = generateNumericSchema('Order quantity', {
 *   type: 'integer',
 *   minimum: 1,
 *   maximum: 1000,
 *   default: 1
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
  } = {}
): any {
  const schema: any = {
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
 *
 * // Email notifications
 * const notifySchema = generateBooleanSchema('Enable email notifications', false, false);
 *
 * // Public visibility
 * const publicSchema = generateBooleanSchema('Public visibility flag', false);
 * ```
 */
export function generateBooleanSchema(
  description: string,
  defaultValue?: boolean,
  example?: boolean
): any {
  const schema: any = {
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
 *
 * // Array of numbers
 * const scoresSchema = generateArraySchema(
 *   'Test scores',
 *   { type: 'number', minimum: 0, maximum: 100 },
 *   { minItems: 1, maxItems: 5 }
 * );
 *
 * // Array of objects
 * const addressesSchema = generateArraySchema(
 *   'User addresses',
 *   { $ref: '#/components/schemas/Address' },
 *   { minItems: 0, maxItems: 3 }
 * );
 * ```
 */
export function generateArraySchema(
  description: string,
  itemSchema: any,
  options: {
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    example?: any[];
    default?: any[];
  } = {}
): any {
  const schema: any = {
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
 *
 * // Address object
 * const addressSchema = generateObjectSchema(
 *   'Mailing address',
 *   {
 *     street: { type: 'string', example: '123 Main St' },
 *     city: { type: 'string', example: 'New York' },
 *     zipCode: { type: 'string', pattern: '^\\d{5}$', example: '10001' }
 *   },
 *   ['street', 'city', 'zipCode']
 * );
 * ```
 */
export function generateObjectSchema(
  description: string,
  properties: Record<string, any>,
  requiredFields: string[] = [],
  options: {
    additionalProperties?: boolean | any;
    minProperties?: number;
    maxProperties?: number;
    example?: any;
  } = {}
): any {
  const schema: any = {
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
 *
 * // Reference to Product schema
 * const productRefSchema = generateRefSchema('Product');
 *
 * // Use in object property
 * const orderSchema = generateObjectSchema('Order', {
 *   user: generateRefSchema('User', 'Order creator'),
 *   product: generateRefSchema('Product', 'Ordered product')
 * }, ['user', 'product']);
 * ```
 */
export function generateRefSchema(schemaName: string, description?: string): any {
  const schema: any = {
    $ref: `#/components/schemas/${schemaName}`,
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

// ============================================================================
// INHERITANCE & COMPOSITION (6 functions)
// ============================================================================

/**
 * Generates a schema that extends a base schema using allOf composition.
 *
 * @param baseSchemaRef - Reference to base schema
 * @param additionalProperties - Additional properties for the extended schema
 * @param description - Description for the extended schema
 * @returns OpenAPI schema object with allOf composition
 *
 * @example
 * ```typescript
 * // Extend BaseEntity with User-specific fields
 * const userSchema = generateExtendedSchema(
 *   '#/components/schemas/BaseEntity',
 *   {
 *     email: { type: 'string', format: 'email', example: 'user@example.com' },
 *     role: { type: 'string', enum: ['admin', 'user'], example: 'user' }
 *   },
 *   'User entity extending BaseEntity'
 * );
 *
 * // Extend Product with DigitalProduct-specific fields
 * const digitalProductSchema = generateExtendedSchema(
 *   '#/components/schemas/Product',
 *   {
 *     downloadUrl: { type: 'string', format: 'uri' },
 *     fileSize: { type: 'integer', minimum: 0 }
 *   },
 *   'Digital product with download information'
 * );
 * ```
 */
export function generateExtendedSchema(
  baseSchemaRef: string,
  additionalProperties: Record<string, any>,
  description?: string
): any {
  const schema: any = {
    allOf: [
      { $ref: baseSchemaRef },
      {
        type: 'object',
        properties: additionalProperties,
      },
    ],
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * Generates a schema using allOf composition (intersection of schemas).
 *
 * @param schemas - Array of schema references or definitions to combine
 * @param description - Description for the composed schema
 * @returns OpenAPI schema object with allOf
 *
 * @example
 * ```typescript
 * // Combine Timestampable and Auditable traits
 * const auditedEntitySchema = generateAllOfSchema(
 *   [
 *     { $ref: '#/components/schemas/Timestampable' },
 *     { $ref: '#/components/schemas/Auditable' },
 *     {
 *       type: 'object',
 *       properties: {
 *         id: { type: 'string', format: 'uuid' }
 *       }
 *     }
 *   ],
 *   'Entity with timestamps and audit information'
 * );
 *
 * // Combine multiple schemas
 * const fullUserSchema = generateAllOfSchema(
 *   [
 *     { $ref: '#/components/schemas/BaseUser' },
 *     { $ref: '#/components/schemas/ProfileData' },
 *     { $ref: '#/components/schemas/Preferences' }
 *   ],
 *   'Complete user profile'
 * );
 * ```
 */
export function generateAllOfSchema(schemas: any[], description?: string): any {
  const schema: any = {
    allOf: schemas,
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * Generates a schema using oneOf composition (exactly one schema must match).
 *
 * @param schemas - Array of schema references or definitions
 * @param discriminator - Optional discriminator configuration
 * @param description - Description for the composed schema
 * @returns OpenAPI schema object with oneOf
 *
 * @example
 * ```typescript
 * // Payment method selection
 * const paymentMethodSchema = generateOneOfSchema(
 *   [
 *     { $ref: '#/components/schemas/CreditCard' },
 *     { $ref: '#/components/schemas/PayPal' },
 *     { $ref: '#/components/schemas/BankTransfer' }
 *   ],
 *   { propertyName: 'paymentType' },
 *   'Payment method options'
 * );
 *
 * // Response type selection
 * const responseSchema = generateOneOfSchema(
 *   [
 *     { $ref: '#/components/schemas/SuccessResponse' },
 *     { $ref: '#/components/schemas/ErrorResponse' }
 *   ],
 *   { propertyName: 'status' },
 *   'API response'
 * );
 * ```
 */
export function generateOneOfSchema(
  schemas: any[],
  discriminator?: { propertyName: string; mapping?: Record<string, string> },
  description?: string
): any {
  const schema: any = {
    oneOf: schemas,
  };

  if (discriminator) {
    schema.discriminator = discriminator;
  }

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * Generates a schema using anyOf composition (one or more schemas must match).
 *
 * @param schemas - Array of schema references or definitions
 * @param description - Description for the composed schema
 * @returns OpenAPI schema object with anyOf
 *
 * @example
 * ```typescript
 * // Contact information (email, phone, or both)
 * const contactSchema = generateAnyOfSchema(
 *   [
 *     { type: 'object', properties: { email: { type: 'string', format: 'email' } } },
 *     { type: 'object', properties: { phone: { type: 'string', pattern: '^\\+?[0-9]{10,15}$' } } }
 *   ],
 *   'Contact information - at least one method required'
 * );
 *
 * // Flexible identifier
 * const identifierSchema = generateAnyOfSchema(
 *   [
 *     { type: 'string', format: 'uuid' },
 *     { type: 'integer', minimum: 1 },
 *     { type: 'string', pattern: '^[A-Z]{3}-\\d{6}$' }
 *   ],
 *   'Flexible identifier format'
 * );
 * ```
 */
export function generateAnyOfSchema(schemas: any[], description?: string): any {
  const schema: any = {
    anyOf: schemas,
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * Generates a schema using not composition (must not match the schema).
 *
 * @param notSchema - Schema that must not be matched
 * @param description - Description for the composed schema
 * @returns OpenAPI schema object with not
 *
 * @example
 * ```typescript
 * // Exclude admin users
 * const regularUserSchema = generateNotSchema(
 *   { type: 'object', properties: { role: { const: 'admin' } } },
 *   'Any user except admins'
 * );
 *
 * // Exclude empty strings
 * const nonEmptyStringSchema = generateNotSchema(
 *   { type: 'string', maxLength: 0 },
 *   'Non-empty string'
 * );
 * ```
 */
export function generateNotSchema(notSchema: any, description?: string): any {
  const schema: any = {
    not: notSchema,
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * Generates a mixin schema by combining multiple schemas.
 *
 * @param baseSchema - Base schema reference or definition
 * @param mixins - Array of mixin schema references
 * @param additionalProperties - Additional properties to add
 * @param description - Description for the mixed schema
 * @returns OpenAPI schema object with allOf composition
 *
 * @example
 * ```typescript
 * // Entity with timestamp and audit mixins
 * const entitySchema = generateMixinSchema(
 *   { $ref: '#/components/schemas/BaseEntity' },
 *   [
 *     { $ref: '#/components/schemas/Timestampable' },
 *     { $ref: '#/components/schemas/Auditable' },
 *     { $ref: '#/components/schemas/SoftDeletable' }
 *   ],
 *   {
 *     version: { type: 'integer', minimum: 1, default: 1 }
 *   },
 *   'Entity with common mixins'
 * );
 * ```
 */
export function generateMixinSchema(
  baseSchema: any,
  mixins: any[],
  additionalProperties?: Record<string, any>,
  description?: string
): any {
  const schemas = [baseSchema, ...mixins];

  if (additionalProperties && Object.keys(additionalProperties).length > 0) {
    schemas.push({
      type: 'object',
      properties: additionalProperties,
    });
  }

  return generateAllOfSchema(schemas, description);
}

// ============================================================================
// POLYMORPHIC SCHEMA GENERATORS (5 functions)
// ============================================================================

/**
 * Generates a polymorphic schema with discriminator.
 *
 * @param discriminatorProperty - Property name used for discrimination
 * @param schemas - Map of discriminator values to schema references
 * @param description - Description for the polymorphic schema
 * @returns OpenAPI schema object with discriminator
 *
 * @example
 * ```typescript
 * // Animal polymorphic schema
 * const animalSchema = generatePolymorphicSchema(
 *   'animalType',
 *   {
 *     dog: '#/components/schemas/Dog',
 *     cat: '#/components/schemas/Cat',
 *     bird: '#/components/schemas/Bird'
 *   },
 *   'Animal entity with type discrimination'
 * );
 *
 * // Notification polymorphic schema
 * const notificationSchema = generatePolymorphicSchema(
 *   'notificationType',
 *   {
 *     email: '#/components/schemas/EmailNotification',
 *     sms: '#/components/schemas/SmsNotification',
 *     push: '#/components/schemas/PushNotification'
 *   },
 *   'Notification with type-based routing'
 * );
 * ```
 */
export function generatePolymorphicSchema(
  discriminatorProperty: string,
  schemas: Record<string, string>,
  description?: string
): any {
  const schemaRefs = Object.values(schemas).map(ref => ({ $ref: ref }));

  const schema: any = {
    oneOf: schemaRefs,
    discriminator: {
      propertyName: discriminatorProperty,
      mapping: schemas,
    },
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * Generates a discriminator mapping for polymorphic types.
 *
 * @param discriminatorProperty - Property name for discrimination
 * @param typeMapping - Map of type values to schema names
 * @returns Discriminator object for OpenAPI schema
 *
 * @example
 * ```typescript
 * // Vehicle type discriminator
 * const vehicleDiscriminator = generateDiscriminator(
 *   'vehicleType',
 *   {
 *     car: 'Car',
 *     truck: 'Truck',
 *     motorcycle: 'Motorcycle'
 *   }
 * );
 *
 * // Event type discriminator
 * const eventDiscriminator = generateDiscriminator(
 *   'eventType',
 *   {
 *     click: 'ClickEvent',
 *     view: 'ViewEvent',
 *     purchase: 'PurchaseEvent'
 *   }
 * );
 * ```
 */
export function generateDiscriminator(
  discriminatorProperty: string,
  typeMapping: Record<string, string>
): { propertyName: string; mapping: Record<string, string> } {
  const mapping: Record<string, string> = {};

  Object.entries(typeMapping).forEach(([key, schemaName]) => {
    mapping[key] = `#/components/schemas/${schemaName}`;
  });

  return {
    propertyName: discriminatorProperty,
    mapping,
  };
}

/**
 * Generates a polymorphic base schema with discriminator property.
 *
 * @param discriminatorProperty - Property name for discrimination
 * @param discriminatorType - Type of discriminator (string, enum)
 * @param allowedValues - Allowed discriminator values
 * @param baseProperties - Common properties for all subtypes
 * @param description - Description for the base schema
 * @returns OpenAPI schema object for polymorphic base
 *
 * @example
 * ```typescript
 * // Shape base schema
 * const shapeBaseSchema = generatePolymorphicBaseSchema(
 *   'shapeType',
 *   'string',
 *   ['circle', 'square', 'triangle'],
 *   {
 *     color: { type: 'string', example: '#FF0000' },
 *     area: { type: 'number', minimum: 0 }
 *   },
 *   'Base schema for geometric shapes'
 * );
 * ```
 */
export function generatePolymorphicBaseSchema(
  discriminatorProperty: string,
  discriminatorType: 'string' | 'enum',
  allowedValues?: string[],
  baseProperties?: Record<string, any>,
  description?: string
): any {
  const properties: Record<string, any> = {
    [discriminatorProperty]:
      discriminatorType === 'enum' && allowedValues
        ? { type: 'string', enum: allowedValues }
        : { type: 'string' },
  };

  if (baseProperties) {
    Object.assign(properties, baseProperties);
  }

  const schema: any = {
    type: 'object',
    required: [discriminatorProperty],
    properties,
    discriminator: {
      propertyName: discriminatorProperty,
    },
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * Generates a polymorphic subtype schema extending a base.
 *
 * @param baseSchemaRef - Reference to base polymorphic schema
 * @param discriminatorValue - Value for discriminator property
 * @param subtypeProperties - Properties specific to this subtype
 * @param description - Description for the subtype
 * @returns OpenAPI schema object for polymorphic subtype
 *
 * @example
 * ```typescript
 * // Circle subtype
 * const circleSchema = generatePolymorphicSubtype(
 *   '#/components/schemas/Shape',
 *   'circle',
 *   {
 *     radius: { type: 'number', minimum: 0, example: 5 }
 *   },
 *   'Circle shape with radius'
 * );
 *
 * // Square subtype
 * const squareSchema = generatePolymorphicSubtype(
 *   '#/components/schemas/Shape',
 *   'square',
 *   {
 *     sideLength: { type: 'number', minimum: 0, example: 10 }
 *   },
 *   'Square shape with side length'
 * );
 * ```
 */
export function generatePolymorphicSubtype(
  baseSchemaRef: string,
  discriminatorValue: string,
  subtypeProperties: Record<string, any>,
  description?: string
): any {
  const schema: any = {
    allOf: [
      { $ref: baseSchemaRef },
      {
        type: 'object',
        properties: subtypeProperties,
      },
    ],
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

/**
 * Generates a polymorphic union schema with type guards.
 *
 * @param discriminatorProperty - Property name for discrimination
 * @param typeSchemas - Array of type-specific schemas
 * @param description - Description for the union schema
 * @returns OpenAPI schema object with oneOf and discriminator
 *
 * @example
 * ```typescript
 * // Response union
 * const responseUnionSchema = generatePolymorphicUnion(
 *   'responseType',
 *   [
 *     {
 *       type: 'object',
 *       properties: {
 *         responseType: { const: 'success' },
 *         data: { type: 'object' }
 *       }
 *     },
 *     {
 *       type: 'object',
 *       properties: {
 *         responseType: { const: 'error' },
 *         error: { type: 'string' }
 *       }
 *     }
 *   ],
 *   'Response union with type guards'
 * );
 * ```
 */
export function generatePolymorphicUnion(
  discriminatorProperty: string,
  typeSchemas: any[],
  description?: string
): any {
  const schema: any = {
    oneOf: typeSchemas,
    discriminator: {
      propertyName: discriminatorProperty,
    },
  };

  if (description) {
    schema.description = description;
  }

  return schema;
}

// ============================================================================
// ENUM & CONSTANT SCHEMAS (5 functions)
// ============================================================================

/**
 * Generates an enum schema with allowed values.
 *
 * @param values - Array of allowed enum values
 * @param description - Description for the enum
 * @param type - Type of enum values
 * @param example - Example value
 * @returns OpenAPI schema object for enum
 *
 * @example
 * ```typescript
 * // User role enum
 * const roleSchema = generateEnumSchema(
 *   ['admin', 'user', 'guest'],
 *   'User role',
 *   'string',
 *   'user'
 * );
 *
 * // Status code enum
 * const statusSchema = generateEnumSchema(
 *   [200, 201, 400, 404, 500],
 *   'HTTP status codes',
 *   'integer',
 *   200
 * );
 * ```
 */
export function generateEnumSchema(
  values: any[],
  description: string,
  type: 'string' | 'integer' | 'number' = 'string',
  example?: any
): any {
  const schema: any = {
    type,
    enum: values,
    description,
  };

  if (example !== undefined) {
    schema.example = example;
  }

  return schema;
}

/**
 * Generates a constant schema with a single allowed value.
 *
 * @param value - The constant value
 * @param description - Description for the constant
 * @returns OpenAPI schema object for constant
 *
 * @example
 * ```typescript
 * // API version constant
 * const versionSchema = generateConstantSchema('v1', 'API version identifier');
 *
 * // Entity type constant
 * const typeSchema = generateConstantSchema('user', 'Entity type discriminator');
 *
 * // Status constant
 * const statusSchema = generateConstantSchema('active', 'Active status indicator');
 * ```
 */
export function generateConstantSchema(value: any, description: string): any {
  return {
    const: value,
    description,
  };
}

/**
 * Generates a typed enum schema with descriptions for each value.
 *
 * @param values - Map of enum values to descriptions
 * @param schemaDescription - Overall schema description
 * @param type - Type of enum values
 * @returns OpenAPI schema object for described enum
 *
 * @example
 * ```typescript
 * // Order status with descriptions
 * const orderStatusSchema = generateDescribedEnumSchema(
 *   {
 *     pending: 'Order received but not yet processed',
 *     processing: 'Order is being processed',
 *     shipped: 'Order has been shipped',
 *     delivered: 'Order has been delivered',
 *     cancelled: 'Order was cancelled'
 *   },
 *   'Order status lifecycle',
 *   'string'
 * );
 * ```
 */
export function generateDescribedEnumSchema(
  values: Record<string, string>,
  schemaDescription: string,
  type: 'string' | 'integer' | 'number' = 'string'
): any {
  const enumValues = Object.keys(values);
  const descriptions = Object.entries(values)
    .map(([key, desc]) => `- **${key}**: ${desc}`)
    .join('\n');

  return {
    type,
    enum: enumValues,
    description: `${schemaDescription}\n\nAllowed values:\n${descriptions}`,
  };
}

/**
 * Generates a flags/bitfield enum schema for multiple selections.
 *
 * @param flags - Map of flag names to bit values
 * @param description - Description for the flags
 * @returns OpenAPI schema object for flags
 *
 * @example
 * ```typescript
 * // User permissions flags
 * const permissionsSchema = generateFlagsSchema(
 *   {
 *     read: 1,
 *     write: 2,
 *     delete: 4,
 *     admin: 8
 *   },
 *   'User permission flags (bitfield)'
 * );
 *
 * // Feature flags
 * const featuresSchema = generateFlagsSchema(
 *   {
 *     darkMode: 1,
 *     notifications: 2,
 *     analytics: 4,
 *     beta: 8
 *   },
 *   'Enabled feature flags'
 * );
 * ```
 */
export function generateFlagsSchema(
  flags: Record<string, number>,
  description: string
): any {
  const flagDescriptions = Object.entries(flags)
    .map(([name, value]) => `- **${name}**: ${value}`)
    .join('\n');

  return {
    type: 'integer',
    description: `${description}\n\nFlags:\n${flagDescriptions}\n\nUse bitwise OR to combine flags.`,
    example: Object.values(flags).reduce((acc, val) => acc | val, 0),
  };
}

/**
 * Generates a nullable enum schema.
 *
 * @param values - Array of allowed enum values
 * @param description - Description for the enum
 * @param type - Type of enum values
 * @returns OpenAPI schema object for nullable enum
 *
 * @example
 * ```typescript
 * // Optional status
 * const statusSchema = generateNullableEnumSchema(
 *   ['active', 'inactive', 'suspended'],
 *   'User status (optional)',
 *   'string'
 * );
 *
 * // Optional priority
 * const prioritySchema = generateNullableEnumSchema(
 *   [1, 2, 3, 4, 5],
 *   'Task priority (1-5, or null)',
 *   'integer'
 * );
 * ```
 */
export function generateNullableEnumSchema(
  values: any[],
  description: string,
  type: 'string' | 'integer' | 'number' = 'string'
): any {
  return {
    oneOf: [
      {
        type,
        enum: values,
      },
      {
        type: 'null',
      },
    ],
    description,
  };
}

// ============================================================================
// ARRAY & COLLECTION SCHEMAS (5 functions)
// ============================================================================

/**
 * Generates a typed array schema with item validation.
 *
 * @param itemType - Type of array items
 * @param description - Description for the array
 * @param options - Array validation options
 * @returns OpenAPI schema object for typed array
 *
 * @example
 * ```typescript
 * // String array
 * const tagsSchema = generateTypedArraySchema(
 *   'string',
 *   'Product tags',
 *   {
 *     minItems: 1,
 *     maxItems: 10,
 *     uniqueItems: true,
 *     itemValidation: { minLength: 2, maxLength: 50 }
 *   }
 * );
 *
 * // Number array
 * const ratingsSchema = generateTypedArraySchema(
 *   'number',
 *   'Product ratings',
 *   {
 *     minItems: 0,
 *     maxItems: 100,
 *     itemValidation: { minimum: 1, maximum: 5 }
 *   }
 * );
 * ```
 */
export function generateTypedArraySchema(
  itemType: 'string' | 'number' | 'integer' | 'boolean',
  description: string,
  options: {
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    itemValidation?: any;
    example?: any[];
  } = {}
): any {
  const itemSchema: any = { type: itemType };

  if (options.itemValidation) {
    Object.assign(itemSchema, options.itemValidation);
  }

  return generateArraySchema(description, itemSchema, {
    minItems: options.minItems,
    maxItems: options.maxItems,
    uniqueItems: options.uniqueItems,
    example: options.example,
  });
}

/**
 * Generates a tuple schema with fixed item types at each position.
 *
 * @param itemSchemas - Array of schemas for each tuple position
 * @param description - Description for the tuple
 * @param additionalItems - Whether additional items are allowed
 * @returns OpenAPI schema object for tuple
 *
 * @example
 * ```typescript
 * // Coordinate tuple [latitude, longitude]
 * const coordinateSchema = generateTupleSchema(
 *   [
 *     { type: 'number', minimum: -90, maximum: 90 },
 *     { type: 'number', minimum: -180, maximum: 180 }
 *   ],
 *   'Geographic coordinates [lat, lng]',
 *   false
 * );
 *
 * // RGB color tuple [red, green, blue]
 * const colorSchema = generateTupleSchema(
 *   [
 *     { type: 'integer', minimum: 0, maximum: 255 },
 *     { type: 'integer', minimum: 0, maximum: 255 },
 *     { type: 'integer', minimum: 0, maximum: 255 }
 *   ],
 *   'RGB color values',
 *   false
 * );
 * ```
 */
export function generateTupleSchema(
  itemSchemas: any[],
  description: string,
  additionalItems = false
): any {
  return {
    type: 'array',
    description,
    items: itemSchemas,
    additionalItems,
    minItems: itemSchemas.length,
    maxItems: additionalItems ? undefined : itemSchemas.length,
  };
}

/**
 * Generates a nested array schema (array of arrays).
 *
 * @param innerItemSchema - Schema for items in inner arrays
 * @param description - Description for the nested array
 * @param options - Validation options for both levels
 * @returns OpenAPI schema object for nested array
 *
 * @example
 * ```typescript
 * // Matrix (2D array of numbers)
 * const matrixSchema = generateNestedArraySchema(
 *   { type: 'number' },
 *   '2D matrix of numbers',
 *   {
 *     outerMinItems: 1,
 *     outerMaxItems: 10,
 *     innerMinItems: 1,
 *     innerMaxItems: 10
 *   }
 * );
 *
 * // Grid of strings
 * const gridSchema = generateNestedArraySchema(
 *   { type: 'string', maxLength: 1 },
 *   'Character grid',
 *   {
 *     outerMinItems: 3,
 *     outerMaxItems: 10,
 *     innerMinItems: 3,
 *     innerMaxItems: 10
 *   }
 * );
 * ```
 */
export function generateNestedArraySchema(
  innerItemSchema: any,
  description: string,
  options: {
    outerMinItems?: number;
    outerMaxItems?: number;
    innerMinItems?: number;
    innerMaxItems?: number;
  } = {}
): any {
  const innerArraySchema = {
    type: 'array',
    items: innerItemSchema,
    ...(options.innerMinItems !== undefined && { minItems: options.innerMinItems }),
    ...(options.innerMaxItems !== undefined && { maxItems: options.innerMaxItems }),
  };

  return {
    type: 'array',
    description,
    items: innerArraySchema,
    ...(options.outerMinItems !== undefined && { minItems: options.outerMinItems }),
    ...(options.outerMaxItems !== undefined && { maxItems: options.outerMaxItems }),
  };
}

/**
 * Generates a collection schema with pagination metadata.
 *
 * @param itemSchemaRef - Reference to item schema
 * @param description - Description for the collection
 * @param includePaginationMetadata - Whether to include pagination fields
 * @returns OpenAPI schema object for paginated collection
 *
 * @example
 * ```typescript
 * // Paginated user collection
 * const usersCollectionSchema = generateCollectionSchema(
 *   '#/components/schemas/User',
 *   'Paginated collection of users',
 *   true
 * );
 *
 * // Simple product collection
 * const productsCollectionSchema = generateCollectionSchema(
 *   '#/components/schemas/Product',
 *   'Collection of products',
 *   false
 * );
 * ```
 */
export function generateCollectionSchema(
  itemSchemaRef: string,
  description: string,
  includePaginationMetadata = true
): any {
  const properties: Record<string, any> = {
    items: {
      type: 'array',
      items: { $ref: itemSchemaRef },
      description: 'Collection items',
    },
    total: {
      type: 'integer',
      minimum: 0,
      description: 'Total number of items',
    },
  };

  if (includePaginationMetadata) {
    properties.page = {
      type: 'integer',
      minimum: 1,
      description: 'Current page number',
    };
    properties.pageSize = {
      type: 'integer',
      minimum: 1,
      description: 'Items per page',
    };
    properties.totalPages = {
      type: 'integer',
      minimum: 0,
      description: 'Total number of pages',
    };
    properties.hasNextPage = {
      type: 'boolean',
      description: 'Whether there is a next page',
    };
    properties.hasPreviousPage = {
      type: 'boolean',
      description: 'Whether there is a previous page',
    };
  }

  return {
    type: 'object',
    description,
    properties,
    required: includePaginationMetadata
      ? ['items', 'total', 'page', 'pageSize', 'totalPages', 'hasNextPage', 'hasPreviousPage']
      : ['items', 'total'],
  };
}

/**
 * Generates a set schema (array with unique items).
 *
 * @param itemSchema - Schema for set items
 * @param description - Description for the set
 * @param options - Set validation options
 * @returns OpenAPI schema object for set
 *
 * @example
 * ```typescript
 * // Unique tag set
 * const tagSetSchema = generateSetSchema(
 *   { type: 'string', minLength: 1 },
 *   'Unique set of tags',
 *   { minItems: 1, maxItems: 20 }
 * );
 *
 * // Unique ID set
 * const idSetSchema = generateSetSchema(
 *   { type: 'string', format: 'uuid' },
 *   'Set of unique identifiers',
 *   { minItems: 0, maxItems: 100 }
 * );
 * ```
 */
export function generateSetSchema(
  itemSchema: any,
  description: string,
  options: {
    minItems?: number;
    maxItems?: number;
  } = {}
): any {
  return {
    type: 'array',
    description,
    items: itemSchema,
    uniqueItems: true,
    ...(options.minItems !== undefined && { minItems: options.minItems }),
    ...(options.maxItems !== undefined && { maxItems: options.maxItems }),
  };
}

// ============================================================================
// NESTED OBJECT GENERATORS (5 functions)
// ============================================================================

/**
 * Generates a deeply nested object schema.
 *
 * @param structure - Nested structure definition
 * @param description - Description for the nested object
 * @returns OpenAPI schema object for nested structure
 *
 * @example
 * ```typescript
 * // User with nested address and preferences
 * const userSchema = generateNestedObjectSchema(
 *   {
 *     name: { type: 'string' },
 *     address: {
 *       type: 'object',
 *       properties: {
 *         street: { type: 'string' },
 *         city: { type: 'string' },
 *         country: { type: 'string' }
 *       }
 *     },
 *     preferences: {
 *       type: 'object',
 *       properties: {
 *         notifications: {
 *           type: 'object',
 *           properties: {
 *             email: { type: 'boolean' },
 *             sms: { type: 'boolean' }
 *           }
 *         }
 *       }
 *     }
 *   },
 *   'User with nested structures'
 * );
 * ```
 */
export function generateNestedObjectSchema(
  structure: Record<string, any>,
  description: string
): any {
  return {
    type: 'object',
    description,
    properties: structure,
  };
}

/**
 * Generates a recursive schema for self-referencing structures.
 *
 * @param schemaName - Name of the schema (for self-reference)
 * @param baseProperties - Base properties for the recursive type
 * @param recursiveProperty - Name of the property that creates recursion
 * @param description - Description for the recursive schema
 * @returns OpenAPI schema object for recursive structure
 *
 * @example
 * ```typescript
 * // Tree node
 * const treeNodeSchema = generateRecursiveSchema(
 *   'TreeNode',
 *   {
 *     value: { type: 'string' },
 *     id: { type: 'string', format: 'uuid' }
 *   },
 *   'children',
 *   'Recursive tree node structure'
 * );
 *
 * // Category with subcategories
 * const categorySchema = generateRecursiveSchema(
 *   'Category',
 *   {
 *     name: { type: 'string' },
 *     slug: { type: 'string' }
 *   },
 *   'subcategories',
 *   'Category with nested subcategories'
 * );
 * ```
 */
export function generateRecursiveSchema(
  schemaName: string,
  baseProperties: Record<string, any>,
  recursiveProperty: string,
  description: string
): any {
  const properties = {
    ...baseProperties,
    [recursiveProperty]: {
      type: 'array',
      items: { $ref: `#/components/schemas/${schemaName}` },
      description: `Nested ${schemaName} items`,
    },
  };

  return {
    type: 'object',
    description,
    properties,
  };
}

/**
 * Generates a map/dictionary schema with dynamic keys.
 *
 * @param valueSchema - Schema for map values
 * @param description - Description for the map
 * @param keyPattern - Optional regex pattern for keys
 * @returns OpenAPI schema object for map
 *
 * @example
 * ```typescript
 * // String-to-string map
 * const translationsSchema = generateMapSchema(
 *   { type: 'string' },
 *   'Translation key-value pairs',
 *   '^[a-z][a-zA-Z0-9]*$'
 * );
 *
 * // String-to-object map
 * const configSchema = generateMapSchema(
 *   {
 *     type: 'object',
 *     properties: {
 *       enabled: { type: 'boolean' },
 *       value: { type: 'string' }
 *     }
 *   },
 *   'Configuration settings map'
 * );
 * ```
 */
export function generateMapSchema(
  valueSchema: any,
  description: string,
  keyPattern?: string
): any {
  const schema: any = {
    type: 'object',
    description,
    additionalProperties: valueSchema,
  };

  if (keyPattern) {
    schema.propertyNames = {
      pattern: keyPattern,
    };
  }

  return schema;
}

/**
 * Generates a schema with optional nested objects.
 *
 * @param requiredProperties - Required top-level properties
 * @param optionalNestedObjects - Optional nested object definitions
 * @param description - Description for the schema
 * @returns OpenAPI schema object with optional nesting
 *
 * @example
 * ```typescript
 * // User with optional profile and settings
 * const userSchema = generateOptionalNestedSchema(
 *   {
 *     id: { type: 'string', format: 'uuid' },
 *     email: { type: 'string', format: 'email' }
 *   },
 *   {
 *     profile: {
 *       type: 'object',
 *       properties: {
 *         avatar: { type: 'string', format: 'uri' },
 *         bio: { type: 'string' }
 *       }
 *     },
 *     settings: {
 *       type: 'object',
 *       properties: {
 *         theme: { type: 'string', enum: ['light', 'dark'] },
 *         language: { type: 'string' }
 *       }
 *     }
 *   },
 *   'User with optional nested data'
 * );
 * ```
 */
export function generateOptionalNestedSchema(
  requiredProperties: Record<string, any>,
  optionalNestedObjects: Record<string, any>,
  description: string
): any {
  return {
    type: 'object',
    description,
    required: Object.keys(requiredProperties),
    properties: {
      ...requiredProperties,
      ...optionalNestedObjects,
    },
  };
}

/**
 * Generates a composition schema combining multiple nested objects.
 *
 * @param baseProperties - Base object properties
 * @param nestedSchemaRefs - Array of nested schema references to include
 * @param description - Description for the composed schema
 * @returns OpenAPI schema object with nested composition
 *
 * @example
 * ```typescript
 * // Product with multiple nested aspects
 * const fullProductSchema = generateNestedCompositionSchema(
 *   {
 *     id: { type: 'string', format: 'uuid' },
 *     name: { type: 'string' }
 *   },
 *   [
 *     '#/components/schemas/ProductPricing',
 *     '#/components/schemas/ProductInventory',
 *     '#/components/schemas/ProductMetadata'
 *   ],
 *   'Complete product with all nested data'
 * );
 * ```
 */
export function generateNestedCompositionSchema(
  baseProperties: Record<string, any>,
  nestedSchemaRefs: string[],
  description: string
): any {
  const schemas = [
    {
      type: 'object',
      properties: baseProperties,
    },
    ...nestedSchemaRefs.map(ref => ({ $ref: ref })),
  ];

  return generateAllOfSchema(schemas, description);
}

// ============================================================================
// VALIDATION RULE GENERATORS (5 functions)
// ============================================================================

/**
 * Generates a schema with string format validation.
 *
 * @param format - String format type
 * @param description - Description for the validated string
 * @param additionalRules - Additional validation rules
 * @returns OpenAPI schema object with format validation
 *
 * @example
 * ```typescript
 * // Email validation
 * const emailSchema = generateFormatValidationSchema(
 *   'email',
 *   'User email address',
 *   { maxLength: 255, example: 'user@example.com' }
 * );
 *
 * // URL validation
 * const urlSchema = generateFormatValidationSchema(
 *   'uri',
 *   'Website URL',
 *   { example: 'https://example.com' }
 * );
 *
 * // Date validation
 * const dateSchema = generateFormatValidationSchema(
 *   'date',
 *   'Birth date',
 *   { example: '1990-01-01' }
 * );
 * ```
 */
export function generateFormatValidationSchema(
  format: 'email' | 'uri' | 'uuid' | 'date' | 'date-time' | 'time' | 'ipv4' | 'ipv6' | 'hostname',
  description: string,
  additionalRules?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    example?: string;
  }
): any {
  return generateStringSchema(description, {
    format,
    ...additionalRules,
  });
}

/**
 * Generates a schema with range validation (min/max).
 *
 * @param type - Numeric type
 * @param min - Minimum value
 * @param max - Maximum value
 * @param description - Description for the validated number
 * @param options - Additional numeric options
 * @returns OpenAPI schema object with range validation
 *
 * @example
 * ```typescript
 * // Age range
 * const ageSchema = generateRangeValidationSchema(
 *   'integer',
 *   0,
 *   150,
 *   'User age',
 *   { example: 25 }
 * );
 *
 * // Price range
 * const priceSchema = generateRangeValidationSchema(
 *   'number',
 *   0.01,
 *   999999.99,
 *   'Product price',
 *   { format: 'double', multipleOf: 0.01, example: 19.99 }
 * );
 * ```
 */
export function generateRangeValidationSchema(
  type: 'integer' | 'number',
  min: number,
  max: number,
  description: string,
  options?: {
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
    format?: 'int32' | 'int64' | 'float' | 'double';
    multipleOf?: number;
    example?: number;
  }
): any {
  return generateNumericSchema(description, {
    type,
    minimum: min,
    maximum: max,
    ...options,
  });
}

/**
 * Generates a schema with regex pattern validation.
 *
 * @param pattern - Regex pattern string
 * @param description - Description for the validated string
 * @param examples - Example values matching the pattern
 * @returns OpenAPI schema object with pattern validation
 *
 * @example
 * ```typescript
 * // Phone number validation
 * const phoneSchema = generatePatternValidationSchema(
 *   '^\\+?[1-9]\\d{1,14}$',
 *   'International phone number',
 *   ['+1234567890', '+44123456789']
 * );
 *
 * // Postal code validation
 * const postalSchema = generatePatternValidationSchema(
 *   '^\\d{5}(-\\d{4})?$',
 *   'US ZIP code',
 *   ['12345', '12345-6789']
 * );
 *
 * // Username validation
 * const usernameSchema = generatePatternValidationSchema(
 *   '^[a-zA-Z0-9_-]{3,20}$',
 *   'Username (alphanumeric, underscore, hyphen)',
 *   ['user123', 'john_doe']
 * );
 * ```
 */
export function generatePatternValidationSchema(
  pattern: string,
  description: string,
  examples?: string[]
): any {
  const schema = generateStringSchema(description, { pattern });

  if (examples && examples.length > 0) {
    schema.examples = examples;
    schema.example = examples[0];
  }

  return schema;
}

/**
 * Generates a schema with length validation (min/max length).
 *
 * @param minLength - Minimum string length
 * @param maxLength - Maximum string length
 * @param description - Description for the validated string
 * @param options - Additional string options
 * @returns OpenAPI schema object with length validation
 *
 * @example
 * ```typescript
 * // Username length
 * const usernameSchema = generateLengthValidationSchema(
 *   3,
 *   20,
 *   'Username',
 *   { pattern: '^[a-zA-Z0-9_]+$', example: 'john_doe' }
 * );
 *
 * // Password length
 * const passwordSchema = generateLengthValidationSchema(
 *   8,
 *   100,
 *   'User password',
 *   { format: 'password' }
 * );
 * ```
 */
export function generateLengthValidationSchema(
  minLength: number,
  maxLength: number,
  description: string,
  options?: {
    format?: string;
    pattern?: string;
    example?: string;
  }
): any {
  return generateStringSchema(description, {
    minLength,
    maxLength,
    ...options,
  });
}

/**
 * Generates a schema with multiple validation rules combined.
 *
 * @param type - Property type
 * @param validationRules - Combined validation rules
 * @param description - Description for the validated property
 * @returns OpenAPI schema object with multiple validations
 *
 * @example
 * ```typescript
 * // Email with comprehensive validation
 * const emailSchema = generateMultiValidationSchema(
 *   'string',
 *   {
 *     format: 'email',
 *     minLength: 5,
 *     maxLength: 255,
 *     pattern: '^[^@]+@[^@]+\\.[^@]+$'
 *   },
 *   'Validated email address'
 * );
 *
 * // Quantity with multiple rules
 * const quantitySchema = generateMultiValidationSchema(
 *   'integer',
 *   {
 *     minimum: 1,
 *     maximum: 1000,
 *     multipleOf: 1
 *   },
 *   'Order quantity'
 * );
 * ```
 */
export function generateMultiValidationSchema(
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object',
  validationRules: Record<string, any>,
  description: string
): any {
  return {
    type,
    description,
    ...validationRules,
  };
}

// ============================================================================
// SCHEMA TRANSFORMATION UTILITIES (7 functions)
// ============================================================================

/**
 * Converts a schema to a nullable schema (allows null values).
 *
 * @param schema - Base schema to make nullable
 * @param description - Optional description override
 * @returns OpenAPI schema object allowing null
 *
 * @example
 * ```typescript
 * // Nullable string
 * const optionalNameSchema = makeSchemaNullable(
 *   { type: 'string', minLength: 1, maxLength: 100 },
 *   'Optional name (can be null)'
 * );
 *
 * // Nullable reference
 * const optionalUserSchema = makeSchemaNullable(
 *   { $ref: '#/components/schemas/User' },
 *   'Optional user reference'
 * );
 * ```
 */
export function makeSchemaNullable(schema: any, description?: string): any {
  const nullableSchema: any = {
    oneOf: [schema, { type: 'null' }],
  };

  if (description) {
    nullableSchema.description = description;
  } else if (schema.description) {
    nullableSchema.description = `${schema.description} (nullable)`;
  }

  return nullableSchema;
}

/**
 * Converts a required schema to optional (adds default value).
 *
 * @param schema - Base schema
 * @param defaultValue - Default value for optional field
 * @returns OpenAPI schema object with default
 *
 * @example
 * ```typescript
 * // Optional boolean with default
 * const activeSchema = makeSchemaOptional(
 *   { type: 'boolean', description: 'Active flag' },
 *   true
 * );
 *
 * // Optional number with default
 * const quantitySchema = makeSchemaOptional(
 *   { type: 'integer', minimum: 1 },
 *   1
 * );
 * ```
 */
export function makeSchemaOptional(schema: any, defaultValue: any): any {
  return {
    ...schema,
    default: defaultValue,
  };
}

/**
 * Merges multiple schemas into one combined schema.
 *
 * @param schemas - Array of schemas to merge
 * @param strategy - Merge strategy (allOf, oneOf, anyOf)
 * @param description - Description for merged schema
 * @returns OpenAPI schema object with merged schemas
 *
 * @example
 * ```typescript
 * // Merge with allOf
 * const combinedSchema = mergeSchemas(
 *   [
 *     { $ref: '#/components/schemas/BaseEntity' },
 *     { $ref: '#/components/schemas/Timestampable' }
 *   ],
 *   'allOf',
 *   'Entity with timestamps'
 * );
 *
 * // Merge with oneOf
 * const unionSchema = mergeSchemas(
 *   [
 *     { type: 'string' },
 *     { type: 'number' }
 *   ],
 *   'oneOf',
 *   'String or number value'
 * );
 * ```
 */
export function mergeSchemas(
  schemas: any[],
  strategy: 'allOf' | 'oneOf' | 'anyOf',
  description?: string
): any {
  const merged: any = {
    [strategy]: schemas,
  };

  if (description) {
    merged.description = description;
  }

  return merged;
}

/**
 * Adds examples to an existing schema.
 *
 * @param schema - Base schema
 * @param examples - Array of example values
 * @param exampleDescriptions - Optional descriptions for examples
 * @returns OpenAPI schema object with examples
 *
 * @example
 * ```typescript
 * // Add examples to string schema
 * const emailSchema = addExamplesToSchema(
 *   { type: 'string', format: 'email' },
 *   ['user@example.com', 'admin@company.org'],
 *   ['User email', 'Admin email']
 * );
 *
 * // Add examples to number schema
 * const priceSchema = addExamplesToSchema(
 *   { type: 'number', minimum: 0 },
 *   [9.99, 19.99, 99.99]
 * );
 * ```
 */
export function addExamplesToSchema(
  schema: any,
  examples: any[],
  exampleDescriptions?: string[]
): any {
  const updatedSchema = { ...schema };

  updatedSchema.examples = examples;
  updatedSchema.example = examples[0];

  if (exampleDescriptions && exampleDescriptions.length > 0) {
    updatedSchema['x-examples'] = examples.map((ex, i) => ({
      value: ex,
      description: exampleDescriptions[i] || '',
    }));
  }

  return updatedSchema;
}

/**
 * Adds metadata to a schema (title, description, examples).
 *
 * @param schema - Base schema
 * @param metadata - Metadata to add
 * @returns OpenAPI schema object with metadata
 *
 * @example
 * ```typescript
 * // Add comprehensive metadata
 * const userSchema = addSchemaMetadata(
 *   { type: 'object', properties: { name: { type: 'string' } } },
 *   {
 *     title: 'User',
 *     description: 'User entity with profile information',
 *     example: { name: 'John Doe' },
 *     externalDocs: {
 *       description: 'User documentation',
 *       url: 'https://docs.example.com/user'
 *     }
 *   }
 * );
 * ```
 */
export function addSchemaMetadata(
  schema: any,
  metadata: {
    title?: string;
    description?: string;
    example?: any;
    externalDocs?: { description?: string; url: string };
    deprecated?: boolean;
  }
): any {
  return {
    ...schema,
    ...metadata,
  };
}

/**
 * Converts a schema to read-only or write-only.
 *
 * @param schema - Base schema
 * @param mode - Access mode (readOnly, writeOnly, or both)
 * @returns OpenAPI schema object with access control
 *
 * @example
 * ```typescript
 * // Read-only ID field
 * const idSchema = setSchemaAccessMode(
 *   { type: 'string', format: 'uuid' },
 *   'readOnly'
 * );
 *
 * // Write-only password field
 * const passwordSchema = setSchemaAccessMode(
 *   { type: 'string', format: 'password', minLength: 8 },
 *   'writeOnly'
 * );
 * ```
 */
export function setSchemaAccessMode(
  schema: any,
  mode: 'readOnly' | 'writeOnly' | 'both'
): any {
  const updated = { ...schema };

  if (mode === 'readOnly' || mode === 'both') {
    updated.readOnly = true;
  }

  if (mode === 'writeOnly' || mode === 'both') {
    updated.writeOnly = true;
  }

  return updated;
}

/**
 * Creates a partial schema where all properties are optional.
 *
 * @param schema - Base schema with required properties
 * @param description - Optional description override
 * @returns OpenAPI schema object with all optional properties
 *
 * @example
 * ```typescript
 * // Create partial update DTO
 * const updateUserSchema = createPartialSchema(
 *   {
 *     type: 'object',
 *     required: ['name', 'email'],
 *     properties: {
 *       name: { type: 'string' },
 *       email: { type: 'string', format: 'email' },
 *       age: { type: 'integer' }
 *     }
 *   },
 *   'Partial user update (all fields optional)'
 * );
 * ```
 */
export function createPartialSchema(schema: any, description?: string): any {
  const partial = { ...schema };

  // Remove required fields
  delete partial.required;

  if (description) {
    partial.description = description;
  } else if (partial.description) {
    partial.description = `Partial: ${partial.description}`;
  }

  return partial;
}
