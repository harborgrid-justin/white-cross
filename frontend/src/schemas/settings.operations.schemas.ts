/**
 * @fileoverview Settings operations validation schemas
 * @module schemas/settings/operations
 *
 * Zod validation schemas for settings update operations and integration testing.
 */

import { z } from 'zod';
import { schoolSettingsSchema } from './settings.school.schemas';
import { integrationSchema } from './settings.integration.schemas';

// ==========================================
// SETTINGS UPDATE SCHEMAS
// ==========================================

/**
 * Update system settings schema
 */
export const updateSystemSettingsSchema = z.object({
  section: z.enum(['general', 'security', 'email', 'notifications', 'auditLog', 'all']),
  settings: z.any(), // Will be validated against specific section schema
  validateOnly: z.boolean().default(false), // Test validation without saving
});

export type UpdateSystemSettingsInput = z.infer<typeof updateSystemSettingsSchema>;

/**
 * Update school settings schema
 */
export const updateSchoolSettingsSchema = z.object({
  settings: schoolSettingsSchema.partial(),
  validateOnly: z.boolean().default(false),
});

export type UpdateSchoolSettingsInput = z.infer<typeof updateSchoolSettingsSchema>;

/**
 * Update integration settings schema
 */
export const updateIntegrationSettingsSchema = z.object({
  integrationId: z.string().uuid().optional(), // If updating specific integration
  settings: integrationSchema.partial(),
  testConnection: z.boolean().default(false),
});

export type UpdateIntegrationSettingsInput = z.infer<typeof updateIntegrationSettingsSchema>;

// ==========================================
// TEST INTEGRATION SCHEMA
// ==========================================

/**
 * Test integration schema
 */
export const testIntegrationSchema = z.object({
  integrationId: z.string().uuid('Invalid integration ID'),
  testType: z.enum(['connection', 'authentication', 'sync', 'all']).default('connection'),
  sampleData: z.record(z.string(), z.any()).optional(),
});

export type TestIntegrationInput = z.infer<typeof testIntegrationSchema>;
