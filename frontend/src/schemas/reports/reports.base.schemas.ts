/**
 * Reports Base Validation Schemas
 *
 * Core types, enums, and parameter definitions used across report modules.
 * Provides foundational schemas for report formats, types, and parameters.
 *
 * @module reports.base.schemas
 */

import { z } from 'zod';

/**
 * Report Format Enum
 */
export const reportFormatSchema = z.enum(['PDF', 'EXCEL', 'CSV']);

export type ReportFormat = z.infer<typeof reportFormatSchema>;

/**
 * Report Type Enum
 */
export const reportTypeSchema = z.enum([
  'STUDENT_HEALTH_SUMMARY',
  'MEDICATION_ADMINISTRATION',
  'MEDICATION_COMPLIANCE',
  'INCIDENT_REPORTS',
  'INCIDENT_TRENDS',
  'ATTENDANCE_HEALTH',
  'INVENTORY_USAGE',
  'INVENTORY_EXPIRATION',
  'APPOINTMENTS_SUMMARY',
  'HEALTH_METRICS',
  'COMPLIANCE_AUDIT',
  'CUSTOM',
]);

export type ReportType = z.infer<typeof reportTypeSchema>;

/**
 * Report Parameter Schema
 * Dynamic parameters for different report types
 */
export const reportParameterSchema = z.object({
  name: z.string().min(1),
  label: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'date', 'select', 'multiselect']),
  value: z.any(),
  required: z.boolean().default(false),
  options: z.array(z.object({
    label: z.string(),
    value: z.any(),
  })).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
});

export type ReportParameter = z.infer<typeof reportParameterSchema>;

/**
 * Report Execution Status Enum
 */
export const reportExecutionStatusSchema = z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);

export type ReportExecutionStatus = z.infer<typeof reportExecutionStatusSchema>;

/**
 * Report Template Category Enum
 */
export const reportTemplateCategorySchema = z.enum([
  'health',
  'medication',
  'incidents',
  'appointments',
  'inventory',
  'compliance',
  'custom',
]);

export type ReportTemplateCategory = z.infer<typeof reportTemplateCategorySchema>;
