/**
 * Polymorphic Schema Generators
 *
 * Utilities for creating polymorphic schemas with discriminators,
 * type-based routing, and inheritance patterns.
 *
 * @module swagger-polymorphic-generators
 * @version 1.0.0
 */

import { OpenApiSchema } from '../types';

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
  description?: string,
): OpenApiSchema {
  const schemaRefs = Object.values(schemas).map(ref => ({ $ref: ref }));

  const schema: OpenApiSchema = {
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
  typeMapping: Record<string, string>,
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
  baseProperties?: Record<string, OpenApiSchema>,
  description?: string,
): OpenApiSchema {
  const properties: Record<string, OpenApiSchema> = {
    [discriminatorProperty]:
      discriminatorType === 'enum' && allowedValues
        ? { type: 'string', enum: allowedValues }
        : { type: 'string' },
  };

  if (baseProperties) {
    Object.assign(properties, baseProperties);
  }

  const schema: OpenApiSchema = {
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
  subtypeProperties: Record<string, OpenApiSchema>,
  description?: string,
): OpenApiSchema {
  const schema: OpenApiSchema = {
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
  typeSchemas: OpenApiSchema[],
  description?: string,
): OpenApiSchema {
  const schema: OpenApiSchema = {
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
