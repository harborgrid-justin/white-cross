/**
 * Schema Inheritance and Composition Generators
 *
 * Utilities for creating schemas with inheritance patterns,
 * composition strategies, and schema mixing capabilities.
 *
 * @module swagger-inheritance-generators
 * @version 1.0.0
 */

import { OpenApiSchema } from '../types';

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
  additionalProperties: Record<string, OpenApiSchema>,
  description?: string,
): OpenApiSchema {
  const schema: OpenApiSchema = {
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
export function generateAllOfSchema(schemas: OpenApiSchema[], description?: string): OpenApiSchema {
  const schema: OpenApiSchema = {
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
  schemas: OpenApiSchema[],
  discriminator?: { propertyName: string; mapping?: Record<string, string> },
  description?: string,
): OpenApiSchema {
  const schema: OpenApiSchema = {
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
export function generateAnyOfSchema(schemas: OpenApiSchema[], description?: string): OpenApiSchema {
  const schema: OpenApiSchema = {
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
export function generateNotSchema(notSchema: OpenApiSchema, description?: string): OpenApiSchema {
  const schema: OpenApiSchema = {
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
  baseSchema: OpenApiSchema,
  mixins: OpenApiSchema[],
  additionalProperties?: Record<string, OpenApiSchema>,
  description?: string,
): OpenApiSchema {
  const schemas = [baseSchema, ...mixins];

  if (additionalProperties && Object.keys(additionalProperties).length > 0) {
    schemas.push({
      type: 'object',
      properties: additionalProperties,
    });
  }

  return generateAllOfSchema(schemas, description);
}
