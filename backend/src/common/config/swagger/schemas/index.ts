/**
 * Schema Generators Index
 *
 * Central export point for all schema generation utilities.
 * Provides a clean interface to all schema generation functions.
 *
 * @module swagger/schemas
 * @version 1.0.0
 */

// Export types
export type {
  SchemaGenerationOptions,
  PropertyDefinition,
  InheritanceConfig,
  PolymorphicConfig,
} from './types';

// Export basic generators
export {
  generateStringSchema,
  generateNumericSchema,
  generateBooleanSchema,
  generateArraySchema,
} from './basic-generators';

// Export inheritance generators
export {
  generateExtendedSchema,
  generateMixinSchema,
} from './inheritance-generators';

// Export polymorphic generators
export {
  generatePolymorphicSchema,
  generateDiscriminator,
  generatePolymorphicBaseSchema,
  generatePolymorphicSubtype,
  generatePolymorphicUnion,
} from './polymorphic-generators';