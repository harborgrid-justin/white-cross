/**
 * @fileoverview User profile settings validation schemas
 * @module schemas/settings/profile
 *
 * Zod validation schemas for user profile management, authentication, and preferences.
 */

import { z } from 'zod';
import { timezoneSchema } from './settings.base.schemas';

// ==========================================
// PROFILE UPDATE SCHEMAS
// ==========================================

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  timezone: timezoneSchema.optional(),
  language: z.string().length(2).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ==========================================
// EMAIL MANAGEMENT SCHEMAS
// ==========================================

/**
 * Change Email Schema
 */
export const changeEmailSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

/**
 * Verify Email Schema
 */
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

// ==========================================
// PASSWORD MANAGEMENT SCHEMAS
// ==========================================

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ==========================================
// MFA SETUP SCHEMAS
// ==========================================

/**
 * Setup MFA Schema
 */
export const setupMFASchema = z.object({
  method: z.enum(['totp', 'sms', 'email']),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
});

export type SetupMFAInput = z.infer<typeof setupMFASchema>;

// ==========================================
// NOTIFICATION PREFERENCES SCHEMAS
// ==========================================

/**
 * Update Notification Preferences Schema
 */
export const updateNotificationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  push: z.boolean().default(false),
  emailTypes: z.object({
    appointmentReminders: z.boolean().default(true),
    medicationReminders: z.boolean().default(true),
    incidentReports: z.boolean().default(true),
    systemAlerts: z.boolean().default(true),
  }).optional(),
});

export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;

// ==========================================
// PRIVACY SETTINGS SCHEMAS
// ==========================================

/**
 * Update Privacy Settings Schema
 */
export const updatePrivacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'staff_only', 'private']).default('staff_only'),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  allowAnalytics: z.boolean().default(true),
});

export type UpdatePrivacySettingsInput = z.infer<typeof updatePrivacySettingsSchema>;

// ==========================================
// DATA EXPORT SCHEMAS
// ==========================================

/**
 * Export User Data Schema
 */
export const exportUserDataSchema = z.object({
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
  includeHealthRecords: z.boolean().default(true),
  includeDocuments: z.boolean().default(true),
  includeActivityLog: z.boolean().default(true),
});

export type ExportUserDataInput = z.infer<typeof exportUserDataSchema>;
