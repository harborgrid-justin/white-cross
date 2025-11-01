/**
 * Zod Validation Schemas for Import/Export
 *
 * Type-safe validation schemas for all import/export configurations
 * and data structures with healthcare-specific validation rules.
 */

import { z } from 'zod';

// ============================================================================
// Base Schemas
// ============================================================================

export const entityTypeSchema = z.enum([
  'students',
  'medications',
  'health-records',
  'immunizations',
  'allergies',
  'appointments',
  'emergency-contacts',
  'incidents',
  'documents',
]);

export const importFormatSchema = z.enum(['csv', 'excel', 'json']);
export const exportFormatSchema = z.enum(['csv', 'excel', 'json', 'pdf']);

export const duplicateStrategySchema = z.enum(['skip', 'update', 'error', 'prompt']);
export const importStatusSchema = z.enum([
  'pending',
  'validating',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'paused',
]);
export const exportStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
]);

// ============================================================================
// Import Format Configuration Schemas
// ============================================================================

const csvFormatConfigSchema = z.object({
  type: z.literal('csv'),
  delimiter: z.string().min(1).max(1).default(','),
  hasHeader: z.boolean().default(true),
  encoding: z.string().default('utf-8'),
});

const excelFormatConfigSchema = z.object({
  type: z.literal('excel'),
  sheetName: z.string().optional(),
  startRow: z.number().int().min(0).optional(),
});

const jsonFormatConfigSchema = z.object({
  type: z.literal('json'),
  schema: z.string().optional(),
});

export const importFormatConfigSchema = z.discriminatedUnion('type', [
  csvFormatConfigSchema,
  excelFormatConfigSchema,
  jsonFormatConfigSchema,
]);

// ============================================================================
// Export Format Configuration Schemas
// ============================================================================

const csvExportConfigSchema = z.object({
  type: z.literal('csv'),
  delimiter: z.string().min(1).max(1).default(','),
  includeHeader: z.boolean().default(true),
});

const excelExportConfigSchema = z.object({
  type: z.literal('excel'),
  sheetName: z.string().default('Data'),
  autoFilter: z.boolean().default(true),
});

const jsonExportConfigSchema = z.object({
  type: z.literal('json'),
  pretty: z.boolean().default(false),
  schema: z.string().optional(),
});

const pdfExportConfigSchema = z.object({
  type: z.literal('pdf'),
  template: z.string().optional(),
  orientation: z.enum(['portrait', 'landscape']).default('portrait'),
});

export const exportFormatConfigSchema = z.discriminatedUnion('type', [
  csvExportConfigSchema,
  excelExportConfigSchema,
  jsonExportConfigSchema,
  pdfExportConfigSchema,
]);

// ============================================================================
// Field Transform Schemas
// ============================================================================

export const fieldTransformSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('uppercase') }),
  z.object({ type: z.literal('lowercase') }),
  z.object({ type: z.literal('trim') }),
  z.object({
    type: z.literal('date'),
    format: z.string(),
  }),
  z.object({
    type: z.literal('number'),
    decimals: z.number().int().min(0).max(10).optional(),
  }),
  z.object({
    type: z.literal('boolean'),
    trueValues: z.array(z.string()),
    falseValues: z.array(z.string()),
  }),
  z.object({
    type: z.literal('split'),
    delimiter: z.string(),
    index: z.number().int().min(0),
  }),
  z.object({
    type: z.literal('regex'),
    pattern: z.string(),
    replacement: z.string(),
  }),
  z.object({
    type: z.literal('custom'),
    fn: z.function().args(z.unknown()).returns(z.unknown()),
  }),
]);

// ============================================================================
// Field Validator Schemas
// ============================================================================

export const fieldValidatorSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('required') }),
  z.object({ type: z.literal('email') }),
  z.object({ type: z.literal('phone') }),
  z.object({
    type: z.literal('date'),
    format: z.string().optional(),
  }),
  z.object({
    type: z.literal('number'),
    min: z.number().optional(),
    max: z.number().optional(),
  }),
  z.object({
    type: z.literal('length'),
    min: z.number().int().min(0).optional(),
    max: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal('regex'),
    pattern: z.string(),
  }),
  z.object({
    type: z.literal('enum'),
    values: z.array(z.string()),
  }),
  z.object({
    type: z.literal('custom'),
    fn: z.function().args(z.unknown()).returns(z.boolean()),
    message: z.string(),
  }),
]);

// ============================================================================
// Field Mapping Schemas
// ============================================================================

export const fieldMappingItemSchema = z.object({
  sourceField: z.string().min(1),
  targetField: z.string().min(1),
  transform: fieldTransformSchema.optional(),
  validator: fieldValidatorSchema.optional(),
});

export const fieldMappingSchema = z.object({
  entityType: entityTypeSchema,
  mappings: z.array(fieldMappingItemSchema).min(1),
});

// ============================================================================
// Import Options Schema
// ============================================================================

export const importOptionsSchema = z.object({
  batchSize: z.number().int().min(1).max(10000).default(1000),
  skipErrors: z.boolean().default(false),
  errorThreshold: z.number().int().min(0).default(100),
  duplicateStrategy: duplicateStrategySchema.default('error'),
  validateOnly: z.boolean().default(false),
  createCheckpoints: z.boolean().default(true),
  notifyOnComplete: z.boolean().default(true),
});

// ============================================================================
// Import Configuration Schema
// ============================================================================

export const importConfigSchema = z.object({
  entityType: entityTypeSchema,
  format: importFormatConfigSchema,
  mapping: fieldMappingSchema,
  options: importOptionsSchema,
});

// ============================================================================
// Export Options Schema
// ============================================================================

export const exportScheduleSchema = z.object({
  frequency: z.enum(['once', 'daily', 'weekly', 'monthly']),
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  dayOfMonth: z.number().int().min(1).max(31).optional(),
  enabled: z.boolean().default(true),
});

export const exportEncryptionSchema = z.object({
  enabled: z.boolean(),
  algorithm: z.literal('aes-256-gcm'),
  password: z.string().min(12).optional(),
});

export const exportOptionsSchema = z.object({
  compress: z.boolean().default(false),
  sanitize: z.boolean().default(false),
  includeMetadata: z.boolean().default(true),
  emailTo: z.array(z.string().email()).optional(),
  schedule: exportScheduleSchema.optional(),
  encryption: exportEncryptionSchema.optional(),
});

// ============================================================================
// Field Selection Schema
// ============================================================================

export const fieldSelectionItemSchema = z.object({
  field: z.string().min(1),
  label: z.string().optional(),
  transform: fieldTransformSchema.optional(),
});

export const fieldSelectionSchema = z.object({
  entityType: entityTypeSchema,
  fields: z.array(fieldSelectionItemSchema).min(1),
});

// ============================================================================
// Export Filters Schema
// ============================================================================

export const exportFiltersSchema = z.object({
  dateRange: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .optional(),
  searchQuery: z.string().optional(),
  customFilters: z.record(z.string(), z.unknown()).optional(),
});

// ============================================================================
// Export Configuration Schema
// ============================================================================

export const exportConfigSchema = z.object({
  entityType: entityTypeSchema,
  format: exportFormatConfigSchema,
  fields: fieldSelectionSchema,
  filters: exportFiltersSchema.optional(),
  options: exportOptionsSchema,
});

// ============================================================================
// Result Schemas
// ============================================================================

export const importErrorSchema = z.object({
  row: z.number().int().min(0),
  field: z.string().optional(),
  code: z.string(),
  message: z.string(),
  severity: z.enum(['error', 'critical']),
  data: z.unknown().optional(),
});

export const importWarningSchema = z.object({
  row: z.number().int().min(0),
  field: z.string().optional(),
  message: z.string(),
  data: z.unknown().optional(),
});

export const importCheckpointSchema = z.object({
  id: z.string().uuid(),
  rowNumber: z.number().int().min(0),
  timestamp: z.date(),
  state: z.unknown(),
});

export const importResultSchema = z.object({
  importId: z.string().uuid(),
  status: importStatusSchema,
  entityType: entityTypeSchema,
  startedAt: z.date(),
  completedAt: z.date().optional(),
  totalRows: z.number().int().min(0),
  processedRows: z.number().int().min(0),
  successfulRows: z.number().int().min(0),
  failedRows: z.number().int().min(0),
  skippedRows: z.number().int().min(0),
  errors: z.array(importErrorSchema),
  warnings: z.array(importWarningSchema),
  checkpoints: z.array(importCheckpointSchema),
  metadata: z.record(z.string(), z.unknown()),
});

export const exportErrorSchema = z.object({
  recordId: z.string().optional(),
  code: z.string(),
  message: z.string(),
  severity: z.enum(['error', 'critical']),
});

export const exportResultSchema = z.object({
  exportId: z.string().uuid(),
  status: exportStatusSchema,
  entityType: entityTypeSchema,
  startedAt: z.date(),
  completedAt: z.date().optional(),
  totalRecords: z.number().int().min(0),
  exportedRecords: z.number().int().min(0),
  fileSize: z.number().int().min(0).optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  errors: z.array(exportErrorSchema),
});

// ============================================================================
// Template Schemas
// ============================================================================

export const importTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000),
  entityType: entityTypeSchema,
  format: importFormatConfigSchema,
  mapping: fieldMappingSchema,
  options: importOptionsSchema.partial(),
  createdAt: z.date(),
  updatedAt: z.date(),
  usageCount: z.number().int().min(0).default(0),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()),
});

export const exportTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000),
  entityType: entityTypeSchema,
  format: exportFormatConfigSchema,
  fields: fieldSelectionSchema,
  filters: exportFiltersSchema.optional(),
  options: exportOptionsSchema.partial(),
  createdAt: z.date(),
  updatedAt: z.date(),
  usageCount: z.number().int().min(0).default(0),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()),
});

// ============================================================================
// History Schemas
// ============================================================================

export const importHistorySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  userName: z.string(),
  entityType: entityTypeSchema,
  fileName: z.string(),
  fileSize: z.number().int().min(0),
  format: importFormatSchema,
  status: importStatusSchema,
  totalRows: z.number().int().min(0),
  successfulRows: z.number().int().min(0),
  failedRows: z.number().int().min(0),
  startedAt: z.date(),
  completedAt: z.date().optional(),
  duration: z.number().int().min(0).optional(),
  templateId: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.unknown()),
});

export const exportHistorySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  userName: z.string(),
  entityType: entityTypeSchema,
  fileName: z.string(),
  fileSize: z.number().int().min(0).optional(),
  format: exportFormatSchema,
  status: exportStatusSchema,
  totalRecords: z.number().int().min(0),
  exportedRecords: z.number().int().min(0),
  startedAt: z.date(),
  completedAt: z.date().optional(),
  duration: z.number().int().min(0).optional(),
  templateId: z.string().uuid().optional(),
  downloadUrl: z.string().url().optional(),
  expiresAt: z.date().optional(),
  metadata: z.record(z.string(), z.unknown()),
});

// ============================================================================
// Validation Schemas
// ============================================================================

export const validationErrorSchema = z.object({
  field: z.string(),
  row: z.number().int().min(0).optional(),
  code: z.string(),
  message: z.string(),
  value: z.unknown().optional(),
});

export const validationWarningSchema = z.object({
  field: z.string(),
  row: z.number().int().min(0).optional(),
  message: z.string(),
  value: z.unknown().optional(),
});

export const validationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(validationErrorSchema),
  warnings: z.array(validationWarningSchema),
});

export const validationRuleSchema = z.object({
  field: z.string(),
  validators: z.array(fieldValidatorSchema),
  required: z.boolean().optional(),
});

export const validationSchemaSchema = z.object({
  entityType: entityTypeSchema,
  rules: z.array(validationRuleSchema),
  customValidators: z
    .array(
      z.object({
        name: z.string(),
        fn: z.function().args(z.unknown()).returns(validationResultSchema),
      })
    )
    .optional(),
});

// ============================================================================
// Sanitization Schemas
// ============================================================================

export const sanitizationRuleSchema = z.object({
  field: z.string(),
  action: z.enum(['remove', 'mask', 'hash', 'anonymize']),
  options: z
    .object({
      maskChar: z.string().length(1).optional(),
      keepFirst: z.number().int().min(0).optional(),
      keepLast: z.number().int().min(0).optional(),
      hashAlgorithm: z.enum(['sha256', 'md5']).optional(),
    })
    .optional(),
});

export const sanitizationConfigSchema = z.object({
  removePHI: z.boolean().default(false),
  maskSSN: z.boolean().default(false),
  maskDOB: z.boolean().default(false),
  removeNotes: z.boolean().default(false),
  removeDiagnosticCodes: z.boolean().default(false),
  customRules: z.array(sanitizationRuleSchema).optional(),
});

// ============================================================================
// Healthcare-Specific Validators
// ============================================================================

/**
 * Validates SSN format (XXX-XX-XXXX)
 */
export const ssnSchema = z.string().regex(/^\d{3}-\d{2}-\d{4}$/, {
  message: 'Invalid SSN format. Expected XXX-XX-XXXX',
});

/**
 * Validates phone number (US format)
 */
export const phoneSchema = z.string().regex(/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, {
  message: 'Invalid phone number format',
});

/**
 * Validates NPI (National Provider Identifier)
 */
export const npiSchema = z.string().regex(/^\d{10}$/, {
  message: 'Invalid NPI. Must be 10 digits',
});

/**
 * Validates ICD-10 code format
 */
export const icd10Schema = z.string().regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, {
  message: 'Invalid ICD-10 code format',
});

/**
 * Validates date of birth (not in future, not too far in past)
 */
export const dobSchema = z.date().max(new Date(), {
  message: 'Date of birth cannot be in the future',
}).min(new Date(1900, 0, 1), {
  message: 'Date of birth too far in the past',
});

/**
 * Validates medication dosage format
 */
export const dosageSchema = z.string().regex(/^\d+(\.\d+)?\s*(mg|g|ml|mcg|units?)$/i, {
  message: 'Invalid dosage format. Example: 10 mg, 2.5 ml',
});

// ============================================================================
// Type Exports
// ============================================================================

export type ImportConfigInput = z.input<typeof importConfigSchema>;
export type ImportConfigOutput = z.output<typeof importConfigSchema>;
export type ExportConfigInput = z.input<typeof exportConfigSchema>;
export type ExportConfigOutput = z.output<typeof exportConfigSchema>;
export type ValidationResultOutput = z.output<typeof validationResultSchema>;
