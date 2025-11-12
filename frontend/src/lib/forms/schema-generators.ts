/**
 * Schema Generators
 *
 * Functions for generating Zod schemas and schema metadata from form field definitions.
 * Handles schema serialization and reconstruction for storage and retrieval.
 *
 * @module lib/forms/schema-generators
 * @example
 * ```typescript
 * import { generateZodSchema, generateSchemaMetadata } from '@/lib/forms/schema-generators';
 *
 * const fields: FormField[] = [
 *   { name: 'firstName', type: 'text', required: true },
 *   { name: 'email', type: 'email', required: true }
 * ];
 *
 * // Generate Zod schema
 * const schema = generateZodSchema(fields);
 *
 * // Generate metadata for storage
 * const metadata = generateSchemaMetadata(fields);
 * ```
 */

import { z, type ZodTypeAny } from 'zod';
import type { FormField, GeneratedSchema } from './types';
import { fieldToZodType } from './schema-field-converters';

/**
 * Generate Zod schema from form fields
 *
 * Creates a complete Zod object schema for form validation.
 *
 * @param fields - Array of form field definitions
 * @returns Zod object schema
 *
 * @example
 * ```typescript
 * const fields: FormField[] = [
 *   {
 *     id: 'firstName',
 *     name: 'firstName',
 *     type: 'text',
 *     required: true,
 *     label: 'First Name',
 *     minLength: 2
 *   },
 *   {
 *     id: 'email',
 *     name: 'email',
 *     type: 'email',
 *     required: true,
 *     label: 'Email'
 *   },
 *   {
 *     id: 'age',
 *     name: 'age',
 *     type: 'number',
 *     min: 0,
 *     max: 120,
 *     label: 'Age'
 *   }
 * ];
 *
 * const schema = generateZodSchema(fields);
 *
 * // Validate data
 * const result = schema.safeParse({
 *   firstName: 'John',
 *   email: 'john@example.com',
 *   age: 30
 * });
 *
 * if (result.success) {
 *   console.log('Valid:', result.data);
 * } else {
 *   console.log('Errors:', result.error.flatten());
 * }
 * ```
 */
export function generateZodSchema(fields: FormField[]): z.ZodObject<Record<string, ZodTypeAny>> {
  const schemaShape: Record<string, ZodTypeAny> = {};

  for (const field of fields) {
    schemaShape[field.name] = fieldToZodType(field);
  }

  return z.object(schemaShape);
}

/**
 * Generate serialized schema metadata
 *
 * Creates metadata for storing and reconstructing schemas.
 * Note: This stores schema configuration, not the actual Zod schema object.
 *
 * @param fields - Form fields
 * @returns Schema metadata
 *
 * @example
 * ```typescript
 * const metadata = generateSchemaMetadata(fields);
 * // Store metadata in database
 * await db.form.update({
 *   where: { id: formId },
 *   data: { schemaMetadata: JSON.stringify(metadata) }
 * });
 * ```
 */
export function generateSchemaMetadata(fields: FormField[]): GeneratedSchema {
  // Create a hash of field configurations
  const fieldConfig = fields.map(f => ({
    name: f.name,
    type: f.type,
    required: f.required,
    validation: f.validation,
    min: f.min,
    max: f.max,
    minLength: f.minLength,
    maxLength: f.maxLength,
    pattern: f.pattern,
  }));

  const schemaString = JSON.stringify(fieldConfig);
  const hash = simpleHash(schemaString);

  const fieldTypes: Record<string, string> = {};
  const phiFields: string[] = [];
  const requiredFields: string[] = [];

  for (const field of fields) {
    fieldTypes[field.name] = field.type;

    if (field.isPHI) {
      phiFields.push(field.name);
    }

    if (field.required) {
      requiredFields.push(field.name);
    }
  }

  return {
    schemaString,
    hash,
    fieldTypes,
    phiFields,
    requiredFields,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Parse schema metadata and reconstruct Zod schema
 *
 * Reconstructs a Zod schema from stored metadata.
 *
 * @param metadata - Schema metadata
 * @returns Reconstructed Zod schema
 *
 * @example
 * ```typescript
 * // Load from database
 * const form = await db.form.findUnique({ where: { id: formId } });
 * const metadata = JSON.parse(form.schemaMetadata);
 *
 * // Reconstruct schema
 * const schema = parseSchemaMetadata(metadata);
 *
 * // Validate data
 * const result = schema.safeParse(formData);
 * ```
 */
export function parseSchemaMetadata(metadata: GeneratedSchema): z.ZodObject<Record<string, ZodTypeAny>> {
  const fieldConfigs = JSON.parse(metadata.schemaString) as Array<Partial<FormField>>;

  const fields: FormField[] = fieldConfigs.map(config => ({
    id: config.name || '',
    name: config.name || '',
    type: config.type || 'text',
    label: config.name || '',
    required: config.required,
    validation: config.validation,
    min: config.min,
    max: config.max,
    minLength: config.minLength,
    maxLength: config.maxLength,
    pattern: config.pattern,
  }));

  return generateZodSchema(fields);
}

/**
 * Simple hash function for schema versioning
 *
 * Creates a hash of the schema configuration for version tracking.
 * Uses a simple 32-bit hash algorithm.
 *
 * @param str - String to hash
 * @returns Hash string in hexadecimal format
 *
 * @example
 * ```typescript
 * const hash = simpleHash(JSON.stringify(fieldConfigs));
 * // Returns: "a3f5b2c9"
 * ```
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
