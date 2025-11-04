/**
 * @fileoverview Base validation schemas and shared primitives for settings
 * @module schemas/settings/base
 *
 * Shared Zod schemas, enums, and primitive types used across all settings modules.
 */

import { z } from 'zod';

// ==========================================
// SHARED PRIMITIVE SCHEMAS
// ==========================================

/**
 * Timezone schema (IANA timezone identifiers)
 */
export const timezoneSchema = z.string()
  .refine((tz) => {
    // Basic validation - actual validation should check against IANA database
    return /^[A-Za-z]+\/[A-Za-z_]+$/.test(tz);
  }, 'Invalid timezone format');

// ==========================================
// COMMUNICATION ENUMS
// ==========================================

/**
 * Email provider enum
 */
export const emailProviderEnum = z.enum([
  'smtp',
  'sendgrid',
  'ses', // Amazon SES
  'mailgun',
  'postmark'
]);

/**
 * Notification channel enum
 */
export const notificationChannelEnum = z.enum([
  'email',
  'sms',
  'push',
  'in_app'
]);

// ==========================================
// INTEGRATION ENUMS
// ==========================================

/**
 * Integration type enum
 */
export const integrationTypeEnum = z.enum([
  'sis', // Student Information System
  'ehr', // Electronic Health Record
  'pharmacy',
  'lab',
  'sso', // Single Sign-On
  'payment',
  'analytics',
  'communication',
  'custom'
]);

/**
 * Integration status enum
 */
export const integrationStatusEnum = z.enum([
  'active',
  'inactive',
  'testing',
  'error',
  'pending_approval'
]);

/**
 * Authentication method enum
 */
export const authMethodEnum = z.enum([
  'api_key',
  'oauth2',
  'basic_auth',
  'jwt',
  'saml',
  'custom'
]);
