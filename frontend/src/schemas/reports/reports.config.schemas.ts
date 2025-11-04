/**
 * Reports Configuration Validation Schemas
 *
 * Schemas for report configuration, generation settings, and templates.
 * Defines the structure for report generation requests and saved templates.
 *
 * @module reports.config.schemas
 */

import { z } from 'zod';
import { dateRangeSchema } from '../analytics/analytics.schemas';
import {
  reportFormatSchema,
  reportTypeSchema,
  reportParameterSchema,
  reportTemplateCategorySchema,
} from './reports.base.schemas';

/**
 * Report Configuration Schema
 * Main schema for report generation
 */
export const reportConfigSchema = z.object({
  // Report identification
  reportType: reportTypeSchema,
  title: z.string().min(1, 'Report title is required').max(200),
  description: z.string().max(500).optional(),

  // Date range (required for most reports)
  dateRange: dateRangeSchema,

  // Format
  format: reportFormatSchema,

  // Dynamic parameters
  parameters: z.array(reportParameterSchema).optional(),

  // Filters
  filters: z.object({
    schoolIds: z.array(z.string()).optional(),
    gradeLevels: z.array(z.string()).optional(),
    studentIds: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),

  // Grouping and sorting
  groupBy: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional().default('ASC'),

  // Options
  includeCharts: z.boolean().optional().default(false),
  includeMetadata: z.boolean().optional().default(true),
  includeSummary: z.boolean().optional().default(true),
  includeDetails: z.boolean().optional().default(true),

  // PDF-specific options
  pageSize: z.enum(['A4', 'LETTER', 'LEGAL']).optional().default('A4'),
  orientation: z.enum(['portrait', 'landscape']).optional().default('portrait'),

  // Excel-specific options
  sheetNames: z.array(z.string()).optional(),
  includeFormulas: z.boolean().optional().default(false),

  // Created by
  createdBy: z.string().optional(),
});

export type ReportConfig = z.infer<typeof reportConfigSchema>;

/**
 * Report Template Schema
 * Predefined report configurations
 */
export const reportTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Template name is required').max(100),
  description: z.string().max(500).optional(),
  reportType: reportTypeSchema,
  category: reportTemplateCategorySchema,
  config: reportConfigSchema.omit({ dateRange: true, createdBy: true }),
  isSystem: z.boolean().default(false), // System templates cannot be deleted
  isPublic: z.boolean().default(true),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ReportTemplate = z.infer<typeof reportTemplateSchema>;

/**
 * Batch Report Generation Schema
 * Generate multiple reports in one request
 */
export const batchReportGenerationSchema = z.object({
  reports: z.array(reportConfigSchema).min(1).max(10),
  combineIntoOne: z.boolean().default(false), // Combine all reports into single file
  format: reportFormatSchema.optional(), // Override individual formats
  delivery: z.object({
    email: z.object({
      enabled: z.boolean().default(false),
      recipients: z.array(z.string().email('Invalid email address')).min(1, 'At least one recipient required'),
      cc: z.array(z.string().email()).optional(),
      bcc: z.array(z.string().email()).optional(),
      subject: z.string().min(1, 'Email subject is required').max(200),
      body: z.string().max(2000).optional(),
      attachReport: z.boolean().default(true),
      includeLink: z.boolean().default(true),
    }).optional(),
    storage: z.object({
      enabled: z.boolean().default(true),
      path: z.string().optional(),
      retentionDays: z.number().int().min(1).max(365).optional().default(7),
      autoCleanup: z.boolean().default(true),
    }).optional(),
  }).optional(),
});

export type BatchReportGeneration = z.infer<typeof batchReportGenerationSchema>;
