/**
 * Schema Validation Rules
 *
 * Applies validation rules to Zod schemas.
 * Handles rule-specific schema transformations and type guards.
 *
 * @module lib/forms/schema-validation-rules
 * @example
 * ```typescript
 * import { applyValidationRule } from '@/lib/forms/schema-validation-rules';
 *
 * let schema = z.string();
 * const rule: ValidationRule = {
 *   type: 'minLength',
 *   value: 5,
 *   message: 'Too short'
 * };
 * schema = applyValidationRule(schema, rule, field);
 * ```
 */

import { z, type ZodTypeAny } from 'zod';
import type { FormField, ValidationRule } from './types';
import { PATTERNS, ERROR_MESSAGES } from './schema-constants';

/**
 * Apply validation rule to schema
 *
 * Applies a specific validation rule to a Zod schema.
 *
 * @param schema - Base Zod schema
 * @param rule - Validation rule to apply
 * @param field - Field definition (for context)
 * @returns Modified schema with rule applied
 *
 * @example
 * ```typescript
 * let schema = z.string();
 * const rule: ValidationRule = {
 *   type: 'minLength',
 *   value: 5,
 *   message: 'Too short'
 * };
 * schema = applyValidationRule(schema, rule, field);
 * ```
 */
export function applyValidationRule(
  schema: ZodTypeAny,
  rule: ValidationRule,
  field: FormField
): ZodTypeAny {
  const errorMsg = rule.message || getDefaultErrorMessage(rule.type, rule.value);
  const message = typeof errorMsg === 'function' ? errorMsg(rule.value) : errorMsg;

  switch (rule.type) {
    case 'required':
      // Already handled by base schema
      return schema;

    case 'min':
      if (isZodNumber(schema)) {
        return (schema as z.ZodNumber).min(rule.value, {
          message: typeof errorMsg === 'function' ? errorMsg(rule.value) : message,
        });
      }
      return schema;

    case 'max':
      if (isZodNumber(schema)) {
        return (schema as z.ZodNumber).max(rule.value, {
          message: typeof errorMsg === 'function' ? errorMsg(rule.value) : message,
        });
      }
      return schema;

    case 'minLength':
      if (isZodString(schema)) {
        return (schema as z.ZodString).min(rule.value, {
          message: typeof errorMsg === 'function' ? errorMsg(rule.value) : message,
        });
      }
      return schema;

    case 'maxLength':
      if (isZodString(schema)) {
        return (schema as z.ZodString).max(rule.value, {
          message: typeof errorMsg === 'function' ? errorMsg(rule.value) : message,
        });
      }
      return schema;

    case 'pattern':
      if (isZodString(schema)) {
        return (schema as z.ZodString).regex(new RegExp(rule.value), {
          message: message as string,
        });
      }
      return schema;

    case 'email':
      if (isZodString(schema)) {
        return (schema as z.ZodString).email({
          message: message as string,
        });
      }
      return schema;

    case 'phone':
      return schema.refine(val => PATTERNS.phone.test(String(val)), {
        message: message as string,
      });

    case 'ssn':
      return schema.refine(val => PATTERNS.ssn.test(String(val)), {
        message: message as string,
      });

    case 'mrn':
      return schema.refine(val => PATTERNS.mrn.test(String(val)), {
        message: message as string,
      });

    case 'url':
      if (isZodString(schema)) {
        return (schema as z.ZodString).url({
          message: message as string,
        });
      }
      return schema;

    case 'custom':
      if (rule.validator) {
        return schema.refine(rule.validator, {
          message: message as string,
        });
      }
      return schema;

    default:
      return schema;
  }
}

/**
 * Type guard to check if a schema is a ZodString
 *
 * @param schema - Schema to check
 * @returns True if schema is ZodString
 */
export function isZodString(schema: ZodTypeAny): boolean {
  return schema instanceof z.ZodString || (schema as { _def?: { typeName?: string } })._def?.typeName === 'ZodString';
}

/**
 * Type guard to check if a schema is a ZodNumber
 *
 * @param schema - Schema to check
 * @returns True if schema is ZodNumber
 */
export function isZodNumber(schema: ZodTypeAny): boolean {
  return schema instanceof z.ZodNumber || (schema as { _def?: { typeName?: string } })._def?.typeName === 'ZodNumber';
}

/**
 * Get default error message for a validation rule type
 *
 * @param ruleType - Type of validation rule
 * @param value - Rule value (for dynamic messages)
 * @returns Error message string or function
 */
export function getDefaultErrorMessage(
  ruleType: string,
  value?: unknown
): string | ((val: unknown) => string) {
  const errorMessagesTyped = ERROR_MESSAGES as Record<string, string | ((val: number) => string)>;
  const msg = errorMessagesTyped[ruleType];

  if (typeof msg === 'function' && value !== undefined) {
    return msg;
  }

  return msg || ERROR_MESSAGES.pattern;
}
