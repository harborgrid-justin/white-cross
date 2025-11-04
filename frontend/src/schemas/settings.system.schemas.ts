/**
 * @fileoverview System settings validation schemas
 * @module schemas/settings/system
 *
 * Zod validation schemas for general system configuration, security, and audit logging.
 */

import { z } from 'zod';
import { timezoneSchema } from './settings.base.schemas';

// ==========================================
// GENERAL SETTINGS SCHEMAS
// ==========================================

/**
 * General system settings schema
 */
export const generalSettingsSchema = z.object({
  appName: z.string()
    .min(1, 'Application name is required')
    .max(100, 'Application name must be less than 100 characters'),
  timezone: timezoneSchema.default('America/New_York'),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).default('MM/DD/YYYY'),
  timeFormat: z.enum(['12h', '24h']).default('12h'),
  language: z.string().length(2, 'Language must be a 2-letter code').default('en'),
  currency: z.string().length(3, 'Currency must be a 3-letter code').default('USD'),
  maxFileUploadSize: z.number().int().min(1).max(100).default(10), // MB
  allowedFileTypes: z.array(z.string()).default(['.pdf', '.jpg', '.png', '.doc', '.docx']),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().max(500).optional(),
});

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;

// ==========================================
// SECURITY SETTINGS SCHEMAS
// ==========================================

/**
 * Security settings schema
 */
export const securitySettingsSchema = z.object({
  sessionTimeout: z.number().int().min(5).max(1440).default(30), // minutes
  adminSessionTimeout: z.number().int().min(5).max(60).default(15), // minutes
  mfaRequired: z.boolean().default(false),
  mfaRequiredForAdmin: z.boolean().default(true),
  passwordPolicy: z.object({
    minLength: z.number().int().min(8).max(128).default(12),
    requireUppercase: z.boolean().default(true),
    requireLowercase: z.boolean().default(true),
    requireNumbers: z.boolean().default(true),
    requireSpecialChars: z.boolean().default(true),
    expiryDays: z.number().int().min(0).max(365).default(90), // 0 = never expires
    preventReuse: z.number().int().min(0).max(24).default(5), // Prevent reusing last N passwords
  }),
  ipWhitelist: z.array(z.string()).optional(), // Admin IP whitelist
  ipWhitelistEnabled: z.boolean().default(false),
  failedLoginLockout: z.object({
    enabled: z.boolean().default(true),
    maxAttempts: z.number().int().min(3).max(10).default(5),
    lockoutDuration: z.number().int().min(5).max(1440).default(30), // minutes
  }),
  corsAllowedOrigins: z.array(z.string().url()).default([]),
  csrfProtection: z.boolean().default(true),
  contentSecurityPolicy: z.boolean().default(true),
});

export type SecuritySettings = z.infer<typeof securitySettingsSchema>;

// ==========================================
// AUDIT LOG SETTINGS SCHEMAS
// ==========================================

/**
 * Audit log settings schema
 */
export const auditLogSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  retentionDays: z.number().int().min(90).max(3650).default(2555), // 7 years for HIPAA
  logLevel: z.enum(['minimal', 'standard', 'detailed']).default('detailed'),
  excludeReadOperations: z.boolean().default(false),
  realTimeStreaming: z.boolean().default(false),
  archiveLocation: z.string().optional(), // S3 bucket, Azure Blob, etc.
  autoArchiveAfterDays: z.number().int().min(90).max(365).default(365),
});

export type AuditLogSettings = z.infer<typeof auditLogSettingsSchema>;

// ==========================================
// COMPLETE SYSTEM SETTINGS SCHEMAS
// ==========================================

/**
 * Complete system settings schema
 * Note: This is a partial schema. The full systemSettingsSchema is composed
 * in the main settings.schemas.ts file to avoid circular dependencies.
 */
export const systemCoreSettingsSchema = z.object({
  general: generalSettingsSchema,
  security: securitySettingsSchema,
  auditLog: auditLogSettingsSchema,
});

export type SystemCoreSettings = z.infer<typeof systemCoreSettingsSchema>;
