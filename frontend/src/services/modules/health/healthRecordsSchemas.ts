/**
 * @fileoverview Health Records Validation Schemas
 * @module services/modules/health/healthRecordsSchemas
 * @category Services
 *
 * Zod validation schemas for health records data validation.
 * Ensures data integrity and type safety for health record operations.
 */

import { z } from 'zod';

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

/**
 * Health Record Creation Validation Schema
 *
 * @description
 * Validates all required and optional fields when creating a new health record.
 * Enforces data types, formats, and business rules.
 *
 * Validation Rules:
 * - studentId: Must be valid UUID format
 * - type: Must be one of the defined HealthRecordType values
 * - date: Must be valid ISO 8601 datetime string
 * - description: Required, 1-500 characters
 * - diagnosis: Optional, max 200 characters
 * - treatment: Optional, max 500 characters
 * - provider: Optional, max 100 characters
 * - providerNPI: Optional, must be exactly 10 digits
 * - location: Optional, max 100 characters
 * - notes: Optional, max 2000 characters
 * - attachments: Optional array of valid URLs
 * - isConfidential: Required boolean
 * - followUpRequired: Required boolean
 * - followUpDate: Optional ISO 8601 datetime (should be provided if followUpRequired is true)
 */
export const healthRecordCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  type: z.enum([
    'GENERAL_VISIT',
    'INJURY',
    'ILLNESS',
    'MEDICATION',
    'VACCINATION',
    'SCREENING',
    'PHYSICAL_EXAM',
    'EMERGENCY',
    'MENTAL_HEALTH',
    'DENTAL',
    'VISION',
    'HEARING',
    'OTHER'
  ]),
  date: z.string().datetime(),
  description: z.string().min(1, 'Description is required').max(500),
  diagnosis: z.string().max(200).optional(),
  treatment: z.string().max(500).optional(),
  provider: z.string().max(100).optional(),
  providerNPI: z.string().regex(/^\d{10}$/, 'Invalid NPI format').optional(),
  location: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
  attachments: z.array(z.string().url()).optional(),
  isConfidential: z.boolean(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().datetime().optional()
});

/**
 * Health Record Update Validation Schema
 *
 * @description
 * Validates partial updates to existing health records.
 * All fields are optional, allowing selective updates.
 */
export const healthRecordUpdateSchema = healthRecordCreateSchema.partial();

/**
 * Follow-Up Completion Validation Schema
 *
 * @description
 * Validates data when marking a follow-up as complete.
 */
export const followUpCompletionSchema = z.object({
  completionDate: z.string().datetime(),
  notes: z.string().min(1, 'Completion notes are required').max(1000),
  nextFollowUpDate: z.string().datetime().optional()
});

/**
 * Export Options Validation Schema
 *
 * @description
 * Validates export configuration options.
 */
export const exportOptionsSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  format: z.enum(['PDF', 'JSON', 'CSV', 'CCD']),
  includeTypes: z.array(z.enum([
    'GENERAL_VISIT',
    'INJURY',
    'ILLNESS',
    'MEDICATION',
    'VACCINATION',
    'SCREENING',
    'PHYSICAL_EXAM',
    'EMERGENCY',
    'MENTAL_HEALTH',
    'DENTAL',
    'VISION',
    'HEARING',
    'OTHER'
  ])).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  includeConfidential: z.boolean().optional(),
  includeSummary: z.boolean().optional(),
  includeAllergies: z.boolean().optional(),
  includeConditions: z.boolean().optional(),
  includeVaccinations: z.boolean().optional(),
  includeVitals: z.boolean().optional(),
  includeMedications: z.boolean().optional()
});
