/**
 * Zod Schema Generation Utilities
 *
 * Dynamically generates Zod validation schemas from form field definitions.
 * Supports healthcare-specific validation rules (SSN, MRN, phone, etc.).
 *
 * @module lib/forms/schema
 * @example
 * ```typescript
 * import { generateZodSchema, parseZodSchema, fieldToZodType } from '@/lib/forms/schema';
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
 * const result = schema.safeParse({
 *   firstName: 'John',
 *   email: 'john@example.com'
 * });
 * ```
 */

import { z, type ZodType, type ZodTypeAny } from 'zod';
import type { FormField, ValidationRule, GeneratedSchema } from './types';

/**
 * Healthcare-specific regex patterns
 */
const PATTERNS = {
  // SSN: 123-45-6789
  ssn: /^\d{3}-\d{2}-\d{4}$/,

  // Phone: (123) 456-7890, 123-456-7890, 1234567890
  phone: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,

  // Medical Record Number: varies by institution
  mrn: /^[A-Z0-9]{6,12}$/,

  // ZIP Code: 12345 or 12345-6789
  zipcode: /^\d{5}(-\d{4})?$/,

  // URL
  url: /^https?:\/\/.+/,

  // Email (basic)
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // ICD-10 code
  icd10: /^[A-Z]\d{2}(\.\d{1,3})?$/,

  // NDC (National Drug Code): 11 digits
  ndc: /^\d{5}-\d{4}-\d{2}$/,

  // NPI (National Provider Identifier): 10 digits
  npi: /^\d{10}$/,
};

/**
 * Error messages
 */
const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number (e.g., (555) 123-4567)',
  ssn: 'Please enter a valid SSN (e.g., 123-45-6789)',
  mrn: 'Please enter a valid medical record number',
  zipcode: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)',
  url: 'Please enter a valid URL',
  min: (min: number) => `Minimum value is ${min}`,
  max: (max: number) => `Maximum value is ${max}`,
  minLength: (min: number) => `Minimum length is ${min} characters`,
  maxLength: (max: number) => `Maximum length is ${max} characters`,
  pattern: 'Invalid format',
  icd10: 'Please enter a valid ICD-10 code',
  ndc: 'Please enter a valid NDC code',
  npi: 'Please enter a valid NPI number',
};

/**
 * Convert form field to Zod type
 *
 * Creates appropriate Zod schema for the field type.
 *
 * @param field - Form field definition
 * @returns Zod schema for the field
 *
 * @example
 * ```typescript
 * const field: FormField = {
 *   name: 'email',
 *   type: 'email',
 *   required: true,
 *   label: 'Email'
 * };
 *
 * const schema = fieldToZodType(field);
 * // z.string().email()
 * ```
 */
export function fieldToZodType(field: FormField): ZodTypeAny {
  let schema: ZodTypeAny;

  // Base schema based on field type
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'password':
    case 'hidden':
      schema = z.string({
        required_error: field.validation?.find(v => v.type === 'required')?.message || ERROR_MESSAGES.required,
      });
      break;

    case 'email':
      schema = z
        .string({
          required_error: ERROR_MESSAGES.required,
        })
        .email(ERROR_MESSAGES.email);
      break;

    case 'phone':
      schema = z
        .string({
          required_error: ERROR_MESSAGES.required,
        })
        .regex(PATTERNS.phone, ERROR_MESSAGES.phone);
      break;

    case 'ssn':
      schema = z
        .string({
          required_error: ERROR_MESSAGES.required,
        })
        .regex(PATTERNS.ssn, ERROR_MESSAGES.ssn);
      break;

    case 'mrn':
      schema = z
        .string({
          required_error: ERROR_MESSAGES.required,
        })
        .regex(PATTERNS.mrn, ERROR_MESSAGES.mrn);
      break;

    case 'zipcode':
      schema = z
        .string({
          required_error: ERROR_MESSAGES.required,
        })
        .regex(PATTERNS.zipcode, ERROR_MESSAGES.zipcode);
      break;

    case 'url':
      schema = z
        .string({
          required_error: ERROR_MESSAGES.required,
        })
        .url(ERROR_MESSAGES.url);
      break;

    case 'number':
      schema = z.number({
        required_error: ERROR_MESSAGES.required,
        invalid_type_error: 'Please enter a valid number',
      });

      if (field.min !== undefined) {
        schema = schema.min(field.min, ERROR_MESSAGES.min(field.min));
      }
      if (field.max !== undefined) {
        schema = schema.max(field.max, ERROR_MESSAGES.max(field.max));
      }
      break;

    case 'date':
    case 'time':
    case 'datetime':
      schema = z.string({
        required_error: ERROR_MESSAGES.required,
      });
      // Could add date validation here
      schema = schema.refine(
        val => !isNaN(Date.parse(val)),
        'Please enter a valid date'
      );
      break;

    case 'boolean':
    case 'checkbox':
      schema = z.boolean({
        required_error: ERROR_MESSAGES.required,
      });
      break;

    case 'select':
    case 'radio':
      if (field.options && field.options.length > 0) {
        const values = field.options.map(opt => opt.value);

        if (typeof values[0] === 'number') {
          schema = z.number().refine(
            val => values.includes(val),
            'Please select a valid option'
          );
        } else {
          schema = z.string().refine(
            val => values.includes(val),
            'Please select a valid option'
          );
        }
      } else {
        schema = z.string();
      }
      break;

    case 'multiselect':
      if (field.options && field.options.length > 0) {
        const values = field.options.map(opt => opt.value);

        if (typeof values[0] === 'number') {
          schema = z.array(
            z.number().refine(
              val => values.includes(val),
              'Invalid option selected'
            )
          );
        } else {
          schema = z.array(
            z.string().refine(
              val => values.includes(val),
              'Invalid option selected'
            )
          );
        }
      } else {
        schema = z.array(z.string());
      }
      break;

    case 'file':
    case 'image':
      // File validation schema
      schema = z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      });

      if (field.accept) {
        const allowedTypes = field.accept.split(',').map(t => t.trim());
        schema = schema.refine(
          file => allowedTypes.some(type => file.type.includes(type)),
          `File must be one of: ${field.accept}`
        );
      }

      if (field.metadata?.maxFileSize) {
        const maxSize = field.metadata.maxFileSize;
        schema = schema.refine(
          file => file.size <= maxSize,
          `File size must be less than ${maxSize / 1024 / 1024}MB`
        );
      }
      break;

    case 'richtext':
      schema = z.string({
        required_error: ERROR_MESSAGES.required,
      });
      break;

    default:
      schema = z.string();
  }

  // Apply additional validations
  if (field.validation) {
    for (const rule of field.validation) {
      schema = applyValidationRule(schema, rule, field);
    }
  }

  // Apply string-specific validations
  if (schema instanceof z.ZodString || (schema as any)._def?.typeName === 'ZodString') {
    if (field.minLength) {
      schema = (schema as z.ZodString).min(
        field.minLength,
        ERROR_MESSAGES.minLength(field.minLength)
      );
    }
    if (field.maxLength) {
      schema = (schema as z.ZodString).max(
        field.maxLength,
        ERROR_MESSAGES.maxLength(field.maxLength)
      );
    }
    if (field.pattern) {
      schema = (schema as z.ZodString).regex(
        new RegExp(field.pattern),
        ERROR_MESSAGES.pattern
      );
    }
  }

  // Make optional if not required
  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Apply validation rule to schema
 *
 * @param schema - Base Zod schema
 * @param rule - Validation rule
 * @param field - Field definition
 * @returns Modified schema with rule applied
 */
function applyValidationRule(
  schema: ZodTypeAny,
  rule: ValidationRule,
  field: FormField
): ZodTypeAny {
  const message = rule.message || ERROR_MESSAGES[rule.type as keyof typeof ERROR_MESSAGES];

  switch (rule.type) {
    case 'required':
      // Already handled by base schema
      return schema;

    case 'min':
      if (schema instanceof z.ZodNumber || (schema as any)._def?.typeName === 'ZodNumber') {
        return (schema as z.ZodNumber).min(
          rule.value,
          typeof message === 'function' ? message(rule.value) : message
        );
      }
      return schema;

    case 'max':
      if (schema instanceof z.ZodNumber || (schema as any)._def?.typeName === 'ZodNumber') {
        return (schema as z.ZodNumber).max(
          rule.value,
          typeof message === 'function' ? message(rule.value) : message
        );
      }
      return schema;

    case 'minLength':
      if (schema instanceof z.ZodString || (schema as any)._def?.typeName === 'ZodString') {
        return (schema as z.ZodString).min(
          rule.value,
          typeof message === 'function' ? message(rule.value) : message
        );
      }
      return schema;

    case 'maxLength':
      if (schema instanceof z.ZodString || (schema as any)._def?.typeName === 'ZodString') {
        return (schema as z.ZodString).max(
          rule.value,
          typeof message === 'function' ? message(rule.value) : message
        );
      }
      return schema;

    case 'pattern':
      if (schema instanceof z.ZodString || (schema as any)._def?.typeName === 'ZodString') {
        return (schema as z.ZodString).regex(
          new RegExp(rule.value),
          message as string
        );
      }
      return schema;

    case 'email':
      if (schema instanceof z.ZodString || (schema as any)._def?.typeName === 'ZodString') {
        return (schema as z.ZodString).email(message as string);
      }
      return schema;

    case 'phone':
      return schema.refine(
        val => PATTERNS.phone.test(String(val)),
        message as string
      );

    case 'ssn':
      return schema.refine(
        val => PATTERNS.ssn.test(String(val)),
        message as string
      );

    case 'mrn':
      return schema.refine(
        val => PATTERNS.mrn.test(String(val)),
        message as string
      );

    case 'url':
      if (schema instanceof z.ZodString || (schema as any)._def?.typeName === 'ZodString') {
        return (schema as z.ZodString).url(message as string);
      }
      return schema;

    case 'custom':
      if (rule.validator) {
        return schema.refine(rule.validator, message as string);
      }
      return schema;

    default:
      return schema;
  }
}

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
 *     name: 'firstName',
 *     type: 'text',
 *     required: true,
 *     label: 'First Name',
 *     minLength: 2
 *   },
 *   {
 *     name: 'email',
 *     type: 'email',
 *     required: true,
 *     label: 'Email'
 *   },
 *   {
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
export function generateZodSchema(fields: FormField[]): z.ZodObject<any> {
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

  const fieldTypes: Record<string, any> = {};
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
export function parseSchemaMetadata(metadata: GeneratedSchema): z.ZodObject<any> {
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
 * @param str - String to hash
 * @returns Hash string
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Add healthcare-specific validation
 *
 * Adds custom validators for healthcare data types.
 *
 * @param field - Field definition
 * @param schema - Base Zod schema
 * @returns Schema with healthcare validation
 *
 * @example
 * ```typescript
 * let schema = z.string();
 * schema = addHealthcareValidation(
 *   { name: 'icd10', type: 'text', metadata: { healthcareType: 'icd10' } },
 *   schema
 * );
 * ```
 */
export function addHealthcareValidation(
  field: FormField,
  schema: ZodTypeAny
): ZodTypeAny {
  const healthcareType = field.metadata?.healthcareType;

  if (!healthcareType) {
    return schema;
  }

  switch (healthcareType) {
    case 'icd10':
      return schema.refine(
        val => PATTERNS.icd10.test(String(val)),
        ERROR_MESSAGES.icd10
      );

    case 'ndc':
      return schema.refine(
        val => PATTERNS.ndc.test(String(val)),
        ERROR_MESSAGES.ndc
      );

    case 'npi':
      return schema.refine(
        val => PATTERNS.npi.test(String(val)),
        ERROR_MESSAGES.npi
      );

    default:
      return schema;
  }
}

/**
 * Validate form data against schema
 *
 * Helper function for validating form submissions.
 *
 * @param data - Form data to validate
 * @param fields - Form field definitions
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateFormData(
 *   { firstName: 'John', email: 'invalid' },
 *   fields
 * );
 *
 * if (!result.success) {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 */
export function validateFormData(
  data: Record<string, any>,
  fields: FormField[]
): {
  success: boolean;
  data?: Record<string, any>;
  errors?: Record<string, string[]>;
} {
  const schema = generateZodSchema(fields);
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors: Record<string, string[]> = {};

  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }

  return {
    success: false,
    errors,
  };
}
