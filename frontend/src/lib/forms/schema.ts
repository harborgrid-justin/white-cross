/**
 * Zod Schema Generation Utilities
 *
 * Dynamically generates Zod validation schemas from form field definitions.
 * Supports healthcare-specific validation rules (SSN, MRN, phone, etc.).
 *
 * This is the main entry point for the schema generation system.
 * The implementation is split across multiple modules for maintainability:
 * - schema-constants: Validation patterns and error messages
 * - schema-field-converters: Field-to-Zod type conversion
 * - schema-generators: Schema generation and metadata
 * - schema-validators: Validation utilities
 *
 * @module lib/forms/schema
 * @example
 * ```typescript
 * import { generateZodSchema, validateFormData, fieldToZodType } from '@/lib/forms/schema';
 *
 * const fields: FormField[] = [
 *   { name: 'firstName', type: 'text', required: true },
 *   { name: 'email', type: 'email', required: true },
 *   { name: 'ssn', type: 'ssn', required: false }
 * ];
 *
 * // Generate schema
 * const schema = generateZodSchema(fields);
 *
 * // Validate data
 * const result = validateFormData({
 *   firstName: 'John',
 *   email: 'john@example.com'
 * }, fields);
 * ```
 */

// Re-export constants
export { PATTERNS, ERROR_MESSAGES } from './schema-constants';
export type { ErrorMessageKey, PatternKey } from './schema-constants';

// Re-export field converters
export { fieldToZodType, applyValidationRule } from './schema-field-converters';

// Re-export generators
export {
  generateZodSchema,
  generateSchemaMetadata,
  parseSchemaMetadata,
  simpleHash,
} from './schema-generators';

// Re-export validators
export {
  addHealthcareValidation,
  validateFormData,
  type ValidationResult,
} from './schema-validators';
