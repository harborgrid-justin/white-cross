/**
 * @fileoverview Validation schemas for system and school settings
 * @module schemas/settings
 *
 * Barrel export file for all settings-related Zod validation schemas.
 * This file maintains backward compatibility by re-exporting all schemas
 * from their respective modular files.
 */

import { z } from 'zod';

// ==========================================
// BASE SCHEMAS EXPORTS
// ==========================================

export {
  timezoneSchema,
  emailProviderEnum,
  notificationChannelEnum,
  integrationTypeEnum,
  integrationStatusEnum,
  authMethodEnum,
} from './settings.base.schemas';

// ==========================================
// SYSTEM SETTINGS EXPORTS
// ==========================================

export {
  generalSettingsSchema,
  securitySettingsSchema,
  auditLogSettingsSchema,
  systemCoreSettingsSchema,
  type GeneralSettings,
  type SecuritySettings,
  type AuditLogSettings,
  type SystemCoreSettings,
} from './settings.system.schemas';

// ==========================================
// COMMUNICATION SETTINGS EXPORTS
// ==========================================

export {
  emailSettingsSchema,
  notificationSettingsSchema,
  type EmailSettings,
  type NotificationSettings,
} from './settings.communication.schemas';

// ==========================================
// SCHOOL SETTINGS EXPORTS
// ==========================================

export {
  businessHoursSchema,
  emergencyContactSchema,
  schoolSettingsSchema,
  type BusinessHours,
  type EmergencyContact,
  type SchoolSettings,
} from './settings.school.schemas';

// ==========================================
// INTEGRATION SETTINGS EXPORTS
// ==========================================

export {
  integrationSchema,
  integrationSettingsSchema,
  type Integration,
  type IntegrationSettings,
} from './settings.integration.schemas';

// ==========================================
// OPERATIONS SCHEMAS EXPORTS
// ==========================================

export {
  updateSystemSettingsSchema,
  updateSchoolSettingsSchema,
  updateIntegrationSettingsSchema,
  testIntegrationSchema,
  type UpdateSystemSettingsInput,
  type UpdateSchoolSettingsInput,
  type UpdateIntegrationSettingsInput,
  type TestIntegrationInput,
} from './settings.operations.schemas';

// ==========================================
// PROFILE SETTINGS EXPORTS
// ==========================================

export {
  updateProfileSchema,
  changeEmailSchema,
  verifyEmailSchema,
  changePasswordSchema,
  setupMFASchema,
  updateNotificationPreferencesSchema,
  updatePrivacySettingsSchema,
  exportUserDataSchema,
  type UpdateProfileInput,
  type ChangeEmailInput,
  type VerifyEmailInput,
  type ChangePasswordInput,
  type SetupMFAInput,
  type UpdateNotificationPreferencesInput,
  type UpdatePrivacySettingsInput,
  type ExportUserDataInput,
} from './settings.profile.schemas';

// ==========================================
// COMPOSITE SYSTEM SETTINGS SCHEMA
// ==========================================

/**
 * Import component schemas for composition
 */
import { systemCoreSettingsSchema } from './settings.system.schemas';
import { emailSettingsSchema, notificationSettingsSchema } from './settings.communication.schemas';

/**
 * Complete system settings schema
 * Composed from system core settings and communication settings
 */
export const systemSettingsSchema = z.object({
  general: systemCoreSettingsSchema.shape.general,
  security: systemCoreSettingsSchema.shape.security,
  email: emailSettingsSchema,
  notifications: notificationSettingsSchema,
  auditLog: systemCoreSettingsSchema.shape.auditLog,
  metadata: z.record(z.string(), z.any()).optional(),
});

export type SystemSettings = z.infer<typeof systemSettingsSchema>;
