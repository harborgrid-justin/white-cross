/**
 * Schema Field Converters
 *
 * Converts form field definitions to Zod validation schemas.
 * Handles field type conversion and validation rule application.
 *
 * @module lib/forms/schema-field-converters
 * @example
 * ```typescript
 * import { fieldToZodType } from '@/lib/forms/schema-field-converters';
 *
 * const field: FormField = {
 *   name: 'email',
 *   type: 'email',
 *   required: true,
 *   label: 'Email'
 * };
 *
 * const schema = fieldToZodType(field);
 * ```
 */

import { z, type ZodTypeAny } from 'zod';
import type { FormField } from './types';
import { PATTERNS, ERROR_MESSAGES } from './schema-constants';
import { applyValidationRule, isZodString } from './schema-validation-rules';

/**
 * File validation metadata
 */
interface FileValidation {
  name: string;
  size: number;
  type: string;
}

/**
 * Convert form field to Zod type
 *
 * Creates appropriate Zod schema for the field type with all validation rules.
 *
 * @param field - Form field definition
 * @returns Zod schema for the field
 *
 * @example
 * ```typescript
 * const field: FormField = {
 *   id: 'email',
 *   name: 'email',
 *   type: 'email',
 *   required: true,
 *   label: 'Email',
 *   minLength: 5
 * };
 *
 * const schema = fieldToZodType(field);
 * // Returns: z.string().email().min(5)
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
        message: field.validation?.find(v => v.type === 'required')?.message || ERROR_MESSAGES.required,
      });
      break;

    case 'email':
      schema = z
        .string({
          message: ERROR_MESSAGES.required,
        })
        .email({
          message: ERROR_MESSAGES.email,
        });
      break;

    case 'phone':
      schema = z
        .string({
          message: ERROR_MESSAGES.required,
        })
        .regex(PATTERNS.phone, {
          message: ERROR_MESSAGES.phone,
        });
      break;

    case 'ssn':
      schema = z
        .string({
          message: ERROR_MESSAGES.required,
        })
        .regex(PATTERNS.ssn, {
          message: ERROR_MESSAGES.ssn,
        });
      break;

    case 'mrn':
      schema = z
        .string({
          message: ERROR_MESSAGES.required,
        })
        .regex(PATTERNS.mrn, {
          message: ERROR_MESSAGES.mrn,
        });
      break;

    case 'zipcode':
      schema = z
        .string({
          message: ERROR_MESSAGES.required,
        })
        .regex(PATTERNS.zipcode, {
          message: ERROR_MESSAGES.zipcode,
        });
      break;

    case 'url':
      schema = z
        .string({
          message: ERROR_MESSAGES.required,
        })
        .url({
          message: ERROR_MESSAGES.url,
        });
      break;

    case 'number':
      schema = z.number({
        message: 'Please enter a valid number',
      });

      if (field.min !== undefined) {
        schema = (schema as z.ZodNumber).min(field.min, {
          message: ERROR_MESSAGES.min(field.min),
        });
      }
      if (field.max !== undefined) {
        schema = (schema as z.ZodNumber).max(field.max, {
          message: ERROR_MESSAGES.max(field.max),
        });
      }
      break;

    case 'date':
    case 'time':
    case 'datetime':
      schema = z.string({
        message: ERROR_MESSAGES.required,
      });
      // Add date validation
      schema = schema.refine(
        (val: unknown) => !isNaN(Date.parse(String(val))),
        {
          message: 'Please enter a valid date',
        }
      );
      break;

    case 'boolean':
    case 'checkbox':
      schema = z.boolean({
        message: ERROR_MESSAGES.required,
      });
      break;

    case 'select':
    case 'radio':
      if (field.options && field.options.length > 0) {
        const values = field.options.map(opt => opt.value);

        if (typeof values[0] === 'number') {
          schema = z.number().refine(
            val => values.includes(val),
            {
              message: 'Please select a valid option',
            }
          );
        } else {
          schema = z.string().refine(
            val => values.includes(val),
            {
              message: 'Please select a valid option',
            }
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
              {
                message: 'Invalid option selected',
              }
            )
          );
        } else {
          schema = z.array(
            z.string().refine(
              val => values.includes(val),
              {
                message: 'Invalid option selected',
              }
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
          (file: FileValidation) => allowedTypes.some(type => file.type.includes(type)),
          {
            message: `File must be one of: ${field.accept}`,
          }
        );
      }

      if (field.metadata?.maxFileSize) {
        const maxSize = field.metadata.maxFileSize as number;
        schema = schema.refine(
          (file: FileValidation) => file.size <= maxSize,
          {
            message: `File size must be less than ${maxSize / 1024 / 1024}MB`,
          }
        );
      }
      break;

    case 'richtext':
      schema = z.string({
        message: ERROR_MESSAGES.required,
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
  if (isZodString(schema)) {
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

// Re-export applyValidationRule for backward compatibility
export { applyValidationRule } from './schema-validation-rules';
