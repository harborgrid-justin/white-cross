/**
 * @fileoverview Validation schemas for system and school settings
 * @module schemas/settings
 *
 * Zod validation schemas for system configuration, school settings, and integration management.
 */

import { z } from 'zod';

// ==========================================
// SYSTEM SETTINGS SCHEMAS
// ==========================================

/**
 * Timezone schema (IANA timezone identifiers)
 */
export const timezoneSchema = z.string()
  .refine((tz) => {
    // Basic validation - actual validation should check against IANA database
    return /^[A-Za-z]+\/[A-Za-z_]+$/.test(tz);
  }, 'Invalid timezone format');

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

/**
 * Complete system settings schema
 */
export const systemSettingsSchema = z.object({
  general: generalSettingsSchema,
  security: securitySettingsSchema,
  email: emailSettingsSchema,
  notifications: notificationSettingsSchema,
  auditLog: auditLogSettingsSchema,
  metadata: z.record(z.any()).optional(),
});

export type SystemSettings = z.infer<typeof systemSettingsSchema>;

// ==========================================
// SCHOOL SETTINGS SCHEMAS
// ==========================================

/**
 * Business hours schema
 */
export const businessHoursSchema = z.object({
  monday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  tuesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  wednesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  thursday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  friday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  saturday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(true),
  }),
  sunday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(true),
  }),
});

export type BusinessHours = z.infer<typeof businessHoursSchema>;

/**
 * Emergency contact schema
 */
export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required').max(50),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  email: z.string().email().optional(),
  availableAfterHours: z.boolean().default(false),
});

export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

/**
 * School settings schema
 */
export const schoolSettingsSchema = z.object({
  name: z.string().min(1, 'School name is required').max(200),
  type: z.enum(['elementary', 'middle', 'high', 'k12', 'private', 'charter', 'other']).optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().length(2, 'State must be a 2-letter code'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    country: z.string().length(2, 'Country must be a 2-letter code').default('US'),
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  fax: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid fax number').optional(),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional(),
  logo: z.string().url('Invalid logo URL').optional(),
  hours: businessHoursSchema,
  emergencyContacts: z.array(emergencyContactSchema).min(1, 'At least one emergency contact is required'),
  studentCapacity: z.number().int().min(1).optional(),
  currentEnrollment: z.number().int().min(0).optional(),
  grades: z.array(z.string()).optional(), // e.g., ['K', '1', '2', ..., '12']
  metadata: z.record(z.any()).optional(),
});

export type SchoolSettings = z.infer<typeof schoolSettingsSchema>;

// ==========================================
// INTEGRATION SETTINGS SCHEMAS
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

/**
 * Individual integration schema
 */
export const integrationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Integration name is required').max(100),
  type: integrationTypeEnum,
  description: z.string().max(500).optional(),
  status: integrationStatusEnum.default('pending_approval'),
  authMethod: authMethodEnum,
  config: z.object({
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
    baseUrl: z.string().url('Invalid base URL').optional(),
    oauth2: z.object({
      clientId: z.string(),
      clientSecret: z.string(),
      authorizationUrl: z.string().url(),
      tokenUrl: z.string().url(),
      scopes: z.array(z.string()),
    }).optional(),
    basicAuth: z.object({
      username: z.string(),
      password: z.string(),
    }).optional(),
    customHeaders: z.record(z.string()).optional(),
    timeout: z.number().int().min(1000).max(60000).default(30000), // milliseconds
    retryAttempts: z.number().int().min(0).max(5).default(3),
  }),
  features: z.array(z.string()).optional(), // e.g., ['sync_students', 'sync_health_records']
  syncSchedule: z.object({
    enabled: z.boolean().default(false),
    interval: z.enum(['hourly', 'daily', 'weekly', 'monthly']).default('daily'),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:MM for daily/weekly/monthly
    dayOfWeek: z.number().int().min(0).max(6).optional(), // 0 = Sunday for weekly
    dayOfMonth: z.number().int().min(1).max(31).optional(), // For monthly
  }).optional(),
  webhookUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export type Integration = z.infer<typeof integrationSchema>;

/**
 * Integration settings collection schema
 */
export const integrationSettingsSchema = z.object({
  integrations: z.array(integrationSchema),
  globalSettings: z.object({
    allowCustomIntegrations: z.boolean().default(false),
    requireApproval: z.boolean().default(true),
    maxConcurrentSyncs: z.number().int().min(1).max(10).default(3),
    logRetentionDays: z.number().int().min(7).max(365).default(90),
  }),
});

export type IntegrationSettings = z.infer<typeof integrationSettingsSchema>;

// ==========================================
// SETTINGS UPDATE SCHEMAS
// ==========================================

export const updateSystemSettingsSchema = z.object({
  section: z.enum(['general', 'security', 'email', 'notifications', 'auditLog', 'all']),
  settings: z.any(), // Will be validated against specific section schema
  validateOnly: z.boolean().default(false), // Test validation without saving
});

export type UpdateSystemSettingsInput = z.infer<typeof updateSystemSettingsSchema>;

export const updateSchoolSettingsSchema = z.object({
  settings: schoolSettingsSchema.partial(),
  validateOnly: z.boolean().default(false),
});

export type UpdateSchoolSettingsInput = z.infer<typeof updateSchoolSettingsSchema>;

export const updateIntegrationSettingsSchema = z.object({
  integrationId: z.string().uuid().optional(), // If updating specific integration
  settings: integrationSchema.partial(),
  testConnection: z.boolean().default(false),
});

export type UpdateIntegrationSettingsInput = z.infer<typeof updateIntegrationSettingsSchema>;

// ==========================================
// TEST INTEGRATION SCHEMA
// ==========================================

export const testIntegrationSchema = z.object({
  integrationId: z.string().uuid('Invalid integration ID'),
  testType: z.enum(['connection', 'authentication', 'sync', 'all']).default('connection'),
  sampleData: z.record(z.any()).optional(),
});

export type TestIntegrationInput = z.infer<typeof testIntegrationSchema>;
