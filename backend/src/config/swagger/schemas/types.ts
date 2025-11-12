/**
 * Schema Generation Types
 *
 * TypeScript interfaces and types for OpenAPI schema generation,
 * including options, property definitions, inheritance, and polymorphism.
 *
 * @module swagger/schemas/types
 * @version 1.0.0
 */

import { Type } from '@nestjs/common';

/**
 * Options for schema generation
 */
export interface SchemaGenerationOptions {
  /** Whether to include examples in generated schema */
  includeExamples?: boolean;
  /** Whether to include descriptions */
  includeDescriptions?: boolean;
  /** Default values for properties */
  defaults?: Record<string, unknown>;
  /** Additional validation rules */
  validation?: Record<string, unknown>;
}

/**
 * Definition for a schema property
 */
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
  example?: unknown;
  /** Enum values */
  enum?: unknown[];
  /** Default value */
  default?: unknown;
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

/**
 * Configuration for inheritance relationships
 */
export interface InheritanceConfig {
  /** Base schema type */
  baseType: Type<unknown>;
  /** Properties to override */
  overrides?: Record<string, PropertyDefinition>;
  /** Additional properties */
  additionalProperties?: Record<string, PropertyDefinition>;
  /** Discriminator property name */
  discriminator?: string;
}

/**
 * Configuration for polymorphic schemas
 */
export interface PolymorphicConfig {
  /** Discriminator property name */
  discriminator: string;
  /** Map of discriminator values to schema types */
  mapping: Record<string, Type<unknown>>;
  /** Description for the polymorphic schema */
  description?: string;
}