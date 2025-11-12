// Enterprise Features Constants and Configuration
// Centralized configuration values for all enterprise features

import { ReminderTiming, CommunicationChannel } from './enterprise-features-interfaces';

// ============================================
// Waitlist Management Constants
// ============================================

export const WAITLIST_CONSTANTS = {
  DEFAULT_PRIORITY: 'routine' as const,
  MAX_WAITLIST_SIZE: 1000,
  AUTO_FILL_TIME_WINDOW_HOURS: 24,
  WAITLIST_EXPIRY_DAYS: 30,
} as const;

// ============================================
// Recurring Appointments Constants
// ============================================

export const RECURRING_CONSTANTS = {
  MAX_RECURRENCE_INTERVAL: 365, // days
  DEFAULT_DURATION_MINUTES: 30,
  MAX_FUTURE_GENERATION_MONTHS: 12,
  CANCEL_GRACE_PERIOD_HOURS: 24,
} as const;

// ============================================
// Reminder System Constants
// ============================================

export const REMINDER_CONSTANTS = {
  DEFAULT_SCHEDULE: [
    { timing: ReminderTiming.HOURS_24, channel: CommunicationChannel.EMAIL },
    { timing: ReminderTiming.HOURS_1, channel: CommunicationChannel.SMS },
    { timing: ReminderTiming.MINUTES_15, channel: CommunicationChannel.PUSH },
  ] as const,
  MAX_REMINDER_ATTEMPTS: 3,
  REMINDER_BATCH_SIZE: 100,
  REMINDER_PROCESSING_INTERVAL_MINUTES: 15,
} as const;

// ============================================
// Evidence Management Constants
// ============================================

export const EVIDENCE_CONSTANTS = {
  MAX_FILE_SIZE_MB: 50,
  ALLOWED_MIME_TYPES: {
    PHOTO: ['image/jpeg', 'image/png', 'image/gif'],
    VIDEO: ['video/mp4', 'video/avi', 'video/mov'],
  } as const,
  SECURE_URL_EXPIRY_HOURS: 24,
  AUDIT_RETENTION_DAYS: 2555, // 7 years for HIPAA
} as const;

// ============================================
// Witness Statement Constants
// ============================================

export const WITNESS_CONSTANTS = {
  MAX_STATEMENT_LENGTH: 10000, // characters
  VOICE_PROCESSING_TIMEOUT_SECONDS: 300,
  VERIFICATION_TIMEOUT_HOURS: 72,
  STATEMENT_RETENTION_YEARS: 7,
} as const;

// ============================================
// Insurance Claim Constants
// ============================================

export const INSURANCE_CONSTANTS = {
  CLAIM_NUMBER_PREFIX: 'CLM-',
  MAX_CLAIM_AMOUNT: 100000, // dollars
  SUBMISSION_TIMEOUT_DAYS: 30,
  DOCUMENT_RETENTION_YEARS: 7,
  SUPPORTED_EXPORT_FORMATS: ['pdf', 'xml', 'edi'] as const,
} as const;

// ============================================
// HIPAA Compliance Constants
// ============================================

export const HIPAA_CONSTANTS = {
  AUDIT_FREQUENCY_DAYS: 30,
  COMPLIANCE_RETENTION_YEARS: 7,
  REQUIRED_AREAS: [
    'Access Controls',
    'Audit Logs',
    'Encryption',
    'Data Backup',
    'Incident Response',
    'Training Records',
  ] as const,
  CRITICAL_FINDINGS_THRESHOLD: 3,
} as const;

// ============================================
// Regulation Tracking Constants
// ============================================

export const REGULATION_CONSTANTS = {
  SUPPORTED_STATES: [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ] as const,
  HIGH_IMPACT_KEYWORDS: ['emergency', 'medication', 'privacy', 'consent', 'reporting'] as const,
  MONITORING_INTERVAL_DAYS: 7,
} as const;

// ============================================
// Consent Form Constants
// ============================================

export const CONSENT_CONSTANTS = {
  DEFAULT_EXPIRY_YEARS: 1,
  RENEWAL_REMINDER_DAYS: 30,
  MAX_FORM_SIZE_KB: 2048,
  DIGITAL_SIGNATURE_ALGORITHM: 'sha256',
  VERSION_FORMAT: /^\d+\.\d+$/,
  EXPIRY_CHECK_BATCH_SIZE: 100,
  REMINDER_BATCH_SIZE: 50,
} as const;

// ============================================
// Message Template Constants
// ============================================

export const TEMPLATE_CONSTANTS = {
  MAX_TEMPLATE_SIZE: 10000, // characters
  VARIABLE_PATTERN: /\{\{(\w+)\}\}/g,
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'it', 'pt'] as const,
  CATEGORIES: ['appointment', 'medication', 'emergency', 'consent', 'general'] as const,
  USAGE_TRACKING_RETENTION_DAYS: 365,
} as const;

// ============================================
// Bulk Messaging Constants
// ============================================

export const BULK_MESSAGING_CONSTANTS = {
  MAX_RECIPIENTS: 10000,
  BATCH_SIZE: 500,
  DELIVERY_TIMEOUT_MINUTES: 30,
  RETRY_ATTEMPTS: 3,
  SUPPORTED_CHANNELS: [
    CommunicationChannel.EMAIL,
    CommunicationChannel.SMS,
    CommunicationChannel.PUSH,
  ] as const,
  DELIVERY_CHECK_INTERVAL_SECONDS: 60,
} as const;

// ============================================
// Translation Constants
// ============================================

export const TRANSLATION_CONSTANTS = {
  SUPPORTED_LANGUAGES: [
    'en',
    'es',
    'fr',
    'de',
    'it',
    'pt',
    'zh',
    'ja',
    'ko',
    'ar',
    'hi',
    'ru',
    'tr',
    'nl',
    'sv',
    'da',
    'no',
    'fi',
    'pl',
    'cs',
  ] as const,
  MAX_TEXT_LENGTH: 5000,
  CONFIDENCE_THRESHOLD: 0.8,
  CACHE_TTL_HOURS: 24,
  BATCH_SIZE: 100,
} as const;

// ============================================
// Custom Report Constants
// ============================================

export const REPORT_CONSTANTS = {
  MAX_FIELDS: 50,
  MAX_FILTERS: 20,
  EXECUTION_TIMEOUT_SECONDS: 300,
  CACHE_TTL_MINUTES: 15,
  EXPORT_FORMATS: ['pdf', 'excel', 'csv', 'json'] as const,
  SCHEDULED_REPORTS_BATCH_SIZE: 10,
} as const;

// ============================================
// Real-time Dashboard Constants
// ============================================

export const DASHBOARD_CONSTANTS = {
  METRICS_UPDATE_INTERVAL_SECONDS: 60,
  TREND_PERIODS: ['day', 'week', 'month', 'quarter', 'year'] as const,
  ALERT_THRESHOLDS: {
    CRITICAL: 0.9, // 90% change
    WARNING: 0.5, // 50% change
  } as const,
  MAX_METRICS_HISTORY_DAYS: 90,
  CACHE_TTL_SECONDS: 30,
} as const;

// ============================================
// General Enterprise Constants
// ============================================

export const ENTERPRISE_CONSTANTS = {
  ID_PREFIXES: {
    WAITLIST: 'WL-',
    RECURRING_TEMPLATE: 'RT-',
    EVIDENCE: 'EV-',
    WITNESS_STATEMENT: 'WS-',
    INSURANCE_CLAIM: 'IC-',
    CONSENT_FORM: 'CF-',
    MESSAGE_TEMPLATE: 'MT-',
    BULK_MESSAGE: 'BM-',
    REPORT_DEFINITION: 'RPT-',
  } as const,

  DEFAULT_TIMEZONE: 'America/New_York',
  LOG_RETENTION_DAYS: 90,
  MAX_CONCURRENT_OPERATIONS: 10,

  // Security settings
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  JWT_EXPIRY_HOURS: 24,
  API_RATE_LIMIT_REQUESTS: 1000,
  API_RATE_LIMIT_WINDOW_MINUTES: 15,
} as const;
