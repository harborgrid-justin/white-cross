/**
 * WF-COMP-350 | routeValidationSchemas.ts - Zod validation schemas
 * Purpose: Zod schema definitions for route parameter validation
 * Upstream: ../../types/incidents | Dependencies: zod
 * Downstream: Validation hooks and utilities | Called by: Route components
 * Related: routeValidationTypes, routeValidationUtils
 * Exports: Zod schemas, schema factories | Key Features: Type-safe validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Schema definition → Parameter validation → Type inference
 * LLM Context: Zod schemas for route parameters in healthcare platform
 */

'use client';

import { z } from 'zod';
import {
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  ActionPriority,
  ActionStatus,
} from '../../../types/domain/incidents';

// =====================
// VALIDATION SCHEMAS
// =====================

/**
 * UUID parameter schema (v4)
 * Validates route parameters like :id that should be UUIDs
 *
 * @example
 * // Usage in route: /incidents/:id
 * const schema = z.object({ id: UUIDParamSchema });
 */
export const UUIDParamSchema = z
  .string()
  .uuid({ message: 'Must be a valid UUID format' })
  .describe('UUID route parameter');

/**
 * Numeric parameter schema
 * Validates numeric route parameters with optional min/max constraints
 *
 * @example
 * // Usage in route: /page/:pageNumber
 * const schema = z.object({ pageNumber: NumericParamSchema });
 */
export const NumericParamSchema = z
  .string()
  .regex(/^\d+$/, { message: 'Must be a valid number' })
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val), { message: 'Must be a valid integer' })
  .describe('Numeric route parameter');

/**
 * Positive integer parameter schema
 * For pagination, IDs, counts, etc.
 */
export const PositiveIntegerParamSchema = NumericParamSchema
  .refine((val) => val > 0, { message: 'Must be greater than 0' })
  .describe('Positive integer parameter');

/**
 * Date parameter schema (ISO 8601 format)
 * Validates date strings and transforms to Date objects
 *
 * @example
 * // Usage in route: /reports/:date
 * const schema = z.object({ date: DateParamSchema });
 */
export const DateParamSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, {
    message: 'Must be a valid ISO 8601 date',
  })
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), { message: 'Must be a valid date' })
  .describe('ISO 8601 date parameter');

/**
 * Generic enum parameter schema factory
 * Creates schemas for validating enum values in routes
 *
 * @template T - Enum type
 * @param enumObject - The enum object to validate against
 * @param enumName - Human-readable name for error messages
 *
 * @example
 * const schema = z.object({
 *   type: EnumParamSchema(IncidentType, 'Incident Type')
 * });
 */
export function EnumParamSchema<T extends Record<string, string>>(
  enumObject: T,
  enumName: string = 'Value'
): z.ZodEnum<any> {
  const values = Object.values(enumObject);
  if (values.length === 0) {
    throw new Error(`EnumParamSchema requires at least one enum value for ${enumName}`);
  }
  const enumSchema = z.enum([values[0], ...values.slice(1)] as [string, ...string[]]);
  // Add custom error message description
  return enumSchema.describe(`${enumName} must be one of: ${values.join(', ')}`) as z.ZodEnum<any>;
}

/**
 * Composite parameter schema
 * Combines multiple parameter schemas for routes with multiple params
 *
 * @example
 * const schema = CompositeParamSchema({
 *   studentId: UUIDParamSchema,
 *   incidentId: UUIDParamSchema,
 *   type: EnumParamSchema(IncidentType, 'Incident Type')
 * });
 */
export function CompositeParamSchema<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape);
}

// =====================
// PREDEFINED SCHEMAS FOR COMMON ROUTES
// =====================

/**
 * Student ID validation schema
 */
export const StudentIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Incident report ID validation schema
 */
export const IncidentIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Incident type parameter schema
 */
export const IncidentTypeParamSchema = EnumParamSchema(IncidentType, 'Incident Type');

/**
 * Incident severity parameter schema
 */
export const IncidentSeverityParamSchema = EnumParamSchema(IncidentSeverity, 'Severity');

/**
 * Incident status parameter schema
 */
export const IncidentStatusParamSchema = EnumParamSchema(IncidentStatus, 'Status');

/**
 * Action priority parameter schema
 */
export const ActionPriorityParamSchema = EnumParamSchema(ActionPriority, 'Priority');

/**
 * Action status parameter schema
 */
export const ActionStatusParamSchema = EnumParamSchema(ActionStatus, 'Action Status');

/**
 * Medication ID validation schema
 */
export const MedicationIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Appointment ID validation schema
 */
export const AppointmentIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Document ID validation schema
 */
export const DocumentIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Emergency Contact ID validation schema
 */
export const EmergencyContactIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Health Record ID validation schema
 */
export const HealthRecordIdParamSchema = z.object({
  id: UUIDParamSchema,
});

/**
 * Student with health record composite schema
 */
export const StudentHealthRecordParamSchema = z.object({
  studentId: UUIDParamSchema,
  id: UUIDParamSchema.optional(),
});

/**
 * Student with document composite schema
 */
export const StudentDocumentParamSchema = z.object({
  studentId: UUIDParamSchema,
  id: UUIDParamSchema.optional(),
});

/**
 * Student with emergency contact composite schema
 */
export const StudentEmergencyContactParamSchema = z.object({
  studentId: UUIDParamSchema,
  contactId: UUIDParamSchema.optional(),
});

/**
 * Date range validation schema
 */
export const DateRangeParamSchema = z.object({
  startDate: DateParamSchema,
  endDate: DateParamSchema,
}).refine(
  (data) => data.startDate <= data.endDate,
  { message: 'Start date must be before or equal to end date' }
);

/**
 * Pagination parameter schema
 */
export const PaginationParamSchema = z.object({
  page: z.string()
    .optional()
    .default('1')
    .refine((val) => /^\d+$/.test(val), { message: 'Must be a valid number' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, { message: 'Must be greater than 0' }),
  limit: z.string()
    .optional()
    .default('20')
    .refine((val) => /^\d+$/.test(val), { message: 'Must be a valid number' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, { message: 'Must be greater than 0' })
    .refine((val) => val <= 100, { message: 'Limit cannot exceed 100' }),
});
