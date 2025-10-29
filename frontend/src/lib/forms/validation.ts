/**
 * Form validation utilities using Zod
 * Dynamically generates Zod schemas from form field definitions
 *
 * @module lib/forms/validation
 */

import { z } from 'zod';

/**
 * Form field definition
 */
export interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    url?: boolean;
    customMessage?: string;
  };
  options?: { label: string; value: string }[];
}

/**
 * Generate Zod schema from form field definitions
 * Creates a dynamic validation schema based on field types and rules
 *
 * @param fields - Array of form field definitions
 * @returns Zod schema object for validation
 *
 * @example
 * ```typescript
 * const schema = generateZodSchema(formFields);
 * const validatedData = schema.parse(formData);
 * ```
 */
export function generateZodSchema(fields: FormField[]): z.ZodObject<any> {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema = createFieldSchema(field);

    // Handle required/optional
    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[field.name] = fieldSchema;
  }

  return z.object(schemaFields);
}

/**
 * Create Zod schema for individual field
 *
 * @param field - Form field definition
 * @returns Zod schema for the field
 */
function createFieldSchema(field: FormField): z.ZodTypeAny {
  const validation = field.validation || {};
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
    case 'textarea':
      schema = z.string({
        required_error: validation.customMessage || `${field.label} is required`
      });

      if (validation.minLength) {
        schema = (schema as z.ZodString).min(validation.minLength, {
          message: `${field.label} must be at least ${validation.minLength} characters`
        });
      }

      if (validation.maxLength) {
        schema = (schema as z.ZodString).max(validation.maxLength, {
          message: `${field.label} must be at most ${validation.maxLength} characters`
        });
      }

      if (validation.pattern) {
        schema = (schema as z.ZodString).regex(new RegExp(validation.pattern), {
          message: `${field.label} format is invalid`
        });
      }
      break;

    case 'email':
      schema = z.string().email({
        message: 'Please enter a valid email address'
      });
      break;

    case 'url':
      schema = z.string().url({
        message: 'Please enter a valid URL'
      });
      break;

    case 'number':
      schema = z.number({
        required_error: validation.customMessage || `${field.label} is required`,
        invalid_type_error: `${field.label} must be a number`
      });

      if (validation.min !== undefined) {
        schema = (schema as z.ZodNumber).min(validation.min, {
          message: `${field.label} must be at least ${validation.min}`
        });
      }

      if (validation.max !== undefined) {
        schema = (schema as z.ZodNumber).max(validation.max, {
          message: `${field.label} must be at most ${validation.max}`
        });
      }
      break;

    case 'integer':
      schema = z.number().int({
        message: `${field.label} must be a whole number`
      });

      if (validation.min !== undefined) {
        schema = (schema as z.ZodNumber).min(validation.min);
      }

      if (validation.max !== undefined) {
        schema = (schema as z.ZodNumber).max(validation.max);
      }
      break;

    case 'date':
      schema = z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        { message: 'Please enter a valid date' }
      );
      break;

    case 'datetime':
      schema = z.string().datetime({
        message: 'Please enter a valid date and time'
      });
      break;

    case 'time':
      schema = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Please enter a valid time (HH:MM)'
      });
      break;

    case 'checkbox':
      schema = z.boolean({
        required_error: `${field.label} must be checked`,
        invalid_type_error: `${field.label} must be a boolean`
      });
      break;

    case 'select':
    case 'radio':
      if (field.options && field.options.length > 0) {
        const validValues = field.options.map(opt => opt.value);
        schema = z.enum(validValues as [string, ...string[]], {
          required_error: validation.customMessage || `Please select ${field.label}`,
          invalid_type_error: `Invalid ${field.label} selection`
        });
      } else {
        schema = z.string();
      }
      break;

    case 'multi-select':
    case 'checkbox-group':
      if (field.options && field.options.length > 0) {
        const validValues = field.options.map(opt => opt.value);
        schema = z.array(z.enum(validValues as [string, ...string[]])).min(
          field.required ? 1 : 0,
          { message: `Please select at least one ${field.label}` }
        );
      } else {
        schema = z.array(z.string());
      }
      break;

    case 'file':
      // File validation is typically done separately
      // This is a placeholder for file metadata
      schema = z.object({
        name: z.string(),
        size: z.number(),
        type: z.string()
      }).optional();
      break;

    case 'phone':
      schema = z.string().regex(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        { message: 'Please enter a valid phone number' }
      );
      break;

    case 'ssn':
      // SSN validation - PHI sensitive
      schema = z.string().regex(
        /^\d{3}-?\d{2}-?\d{4}$/,
        { message: 'Please enter a valid SSN (XXX-XX-XXXX)' }
      );
      break;

    case 'zip':
      schema = z.string().regex(
        /^\d{5}(-\d{4})?$/,
        { message: 'Please enter a valid ZIP code' }
      );
      break;

    default:
      // Default to string for unknown types
      schema = z.string();
      break;
  }

  return schema;
}

/**
 * Validate form data against schema
 * Returns validated data or throws validation error
 *
 * @param schema - Zod schema
 * @param data - Form data to validate
 * @returns Validated and typed data
 * @throws ZodError if validation fails
 */
export function validateFormData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe validation that returns result object instead of throwing
 *
 * @param schema - Zod schema
 * @param data - Form data to validate
 * @returns Success/error result with data or error details
 */
export function safeValidateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Convert Zod schema to JSON schema representation
 * Useful for storing schema definition in database
 *
 * @param schema - Zod schema
 * @returns JSON string representation
 */
export function serializeZodSchema(schema: z.ZodSchema): string {
  // Store the schema definition as JSON
  // This is a simplified version - in production you might use zodToJsonSchema
  return JSON.stringify(schema._def);
}

/**
 * Format validation errors for user display
 *
 * @param error - Zod validation error
 * @returns User-friendly error messages
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    formattedErrors[path] = issue.message;
  }

  return formattedErrors;
}
