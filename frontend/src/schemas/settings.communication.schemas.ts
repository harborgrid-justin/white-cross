/**
 * @fileoverview Communication settings validation schemas
 * @module schemas/settings/communication
 *
 * Zod validation schemas for email configuration and notification settings.
 */

import { z } from 'zod';
import {
  emailProviderEnum,
  notificationChannelEnum,
  timezoneSchema
} from './settings.base.schemas';

// ==========================================
// EMAIL SETTINGS SCHEMAS
// ==========================================

/**
 * Email settings schema
 */
export const emailSettingsSchema = z.object({
  provider: emailProviderEnum,
  from: z.string().email('Invalid from email address'),
  fromName: z.string().min(1).max(100).default('White Cross Health'),
  replyTo: z.string().email('Invalid reply-to email address').optional(),
  smtp: z.object({
    host: z.string().min(1, 'SMTP host is required'),
    port: z.number().int().min(1).max(65535).default(587),
    secure: z.boolean().default(true), // Use TLS
    auth: z.object({
      username: z.string().min(1, 'SMTP username is required'),
      password: z.string().min(1, 'SMTP password is required'),
    }),
  }).optional(),
  sendgrid: z.object({
    apiKey: z.string().min(1, 'SendGrid API key is required'),
  }).optional(),
  ses: z.object({
    region: z.string().min(1, 'AWS region is required'),
    accessKeyId: z.string().min(1, 'AWS access key ID is required'),
    secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  }).optional(),
  mailgun: z.object({
    apiKey: z.string().min(1, 'Mailgun API key is required'),
    domain: z.string().min(1, 'Mailgun domain is required'),
  }).optional(),
  testMode: z.boolean().default(false),
  testEmail: z.string().email().optional(),
}).refine((data) => {
  // Validate provider-specific configuration
  if (data.provider === 'smtp' && !data.smtp) return false;
  if (data.provider === 'sendgrid' && !data.sendgrid) return false;
  if (data.provider === 'ses' && !data.ses) return false;
  if (data.provider === 'mailgun' && !data.mailgun) return false;
  return true;
}, {
  message: 'Provider-specific configuration is required',
  path: ['provider'],
});

export type EmailSettings = z.infer<typeof emailSettingsSchema>;

// ==========================================
// NOTIFICATION SETTINGS SCHEMAS
// ==========================================

/**
 * Notification settings schema
 */
export const notificationSettingsSchema = z.object({
  channels: z.array(notificationChannelEnum).min(1, 'At least one notification channel is required'),
  defaultChannel: notificationChannelEnum.default('email'),
  quietHours: z.object({
    enabled: z.boolean().default(false),
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    timezone: timezoneSchema.optional(),
  }),
  emailNotifications: z.object({
    enabled: z.boolean().default(true),
    newUser: z.boolean().default(true),
    passwordReset: z.boolean().default(true),
    appointmentReminder: z.boolean().default(true),
    medicationReminder: z.boolean().default(true),
    incidentReport: z.boolean().default(true),
    systemAlert: z.boolean().default(true),
  }),
  smsNotifications: z.object({
    enabled: z.boolean().default(false),
    provider: z.enum(['twilio', 'sns', 'nexmo']).optional(),
    urgentOnly: z.boolean().default(true),
  }),
  pushNotifications: z.object({
    enabled: z.boolean().default(false),
    provider: z.enum(['fcm', 'apns']).optional(),
  }),
});

export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
