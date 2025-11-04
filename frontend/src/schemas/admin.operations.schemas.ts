/**
 * @fileoverview Validation schemas for system operations and settings
 * @module schemas/admin/operations
 *
 * Zod validation schemas for backup/restore operations, system settings,
 * school settings, and integration testing.
 */

import { z } from 'zod';

// ==========================================
// BACKUP AND RESTORE SCHEMAS
// ==========================================

/**
 * Create backup schema
 */
export const createBackupSchema = z.object({
  backupType: z.enum(['full', 'incremental', 'database_only']).default('full'),
  includeFiles: z.boolean().default(true),
  includeDatabase: z.boolean().default(true),
  compress: z.boolean().default(true),
  encrypt: z.boolean().default(true),
  destination: z.string().optional(), // Storage location
});

export type CreateBackupInput = z.infer<typeof createBackupSchema>;

/**
 * Restore backup schema
 */
export const restoreBackupSchema = z.object({
  backupId: z.string().uuid('Invalid backup ID'),
  restoreType: z.enum(['full', 'database_only', 'files_only']).default('full'),
  confirmRestore: z.boolean().default(false),
  validateBeforeRestore: z.boolean().default(true),
});

export type RestoreBackupInput = z.infer<typeof restoreBackupSchema>;

// ==========================================
// SYSTEM SETTINGS SCHEMAS
// ==========================================

/**
 * Update system settings schema
 */
export const updateSystemSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  allowNewRegistrations: z.boolean().optional(),
  sessionTimeout: z.number().int().min(5).max(1440).optional(), // minutes
  maxLoginAttempts: z.number().int().min(3).max(10).optional(),
  passwordExpiryDays: z.number().int().min(0).max(365).optional(),
  enableAuditLog: z.boolean().optional(),
  enableEmailNotifications: z.boolean().optional(),
  enableSmsNotifications: z.boolean().optional(),
  defaultLanguage: z.string().optional(),
  defaultTimezone: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateSystemSettingsInput = z.infer<typeof updateSystemSettingsSchema>;

/**
 * Update school settings schema
 */
export const updateSchoolSettingsSchema = z.object({
  schoolId: z.string().uuid('Invalid school ID').optional(),
  schoolName: z.string().min(1).max(200).optional(),
  schoolCode: z.string().min(1).max(50).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default('US').optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  timezone: z.string().optional(),
  academicYearStart: z.string().optional(),
  academicYearEnd: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateSchoolSettingsInput = z.infer<typeof updateSchoolSettingsSchema>;

// ==========================================
// INTEGRATION TESTING SCHEMAS
// ==========================================

/**
 * Test integration schema (based on testWebhookSchema)
 */
export const testIntegrationSchema = z.object({
  integrationId: z.string().uuid('Invalid integration ID'),
  testType: z.enum(['connection', 'authentication', 'data_sync', 'webhook']).default('connection'),
  samplePayload: z.record(z.any()).optional(),
  timeout: z.number().int().min(1000).max(60000).default(30000), // milliseconds
});

export type TestIntegrationInput = z.infer<typeof testIntegrationSchema>;
