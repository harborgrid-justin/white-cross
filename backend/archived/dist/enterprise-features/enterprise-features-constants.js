"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTERPRISE_CONSTANTS = exports.DASHBOARD_CONSTANTS = exports.REPORT_CONSTANTS = exports.TRANSLATION_CONSTANTS = exports.BULK_MESSAGING_CONSTANTS = exports.TEMPLATE_CONSTANTS = exports.CONSENT_CONSTANTS = exports.REGULATION_CONSTANTS = exports.HIPAA_CONSTANTS = exports.INSURANCE_CONSTANTS = exports.WITNESS_CONSTANTS = exports.EVIDENCE_CONSTANTS = exports.REMINDER_CONSTANTS = exports.RECURRING_CONSTANTS = exports.WAITLIST_CONSTANTS = void 0;
const enterprise_features_interfaces_1 = require("./enterprise-features-interfaces");
exports.WAITLIST_CONSTANTS = {
    DEFAULT_PRIORITY: 'routine',
    MAX_WAITLIST_SIZE: 1000,
    AUTO_FILL_TIME_WINDOW_HOURS: 24,
    WAITLIST_EXPIRY_DAYS: 30,
};
exports.RECURRING_CONSTANTS = {
    MAX_RECURRENCE_INTERVAL: 365,
    DEFAULT_DURATION_MINUTES: 30,
    MAX_FUTURE_GENERATION_MONTHS: 12,
    CANCEL_GRACE_PERIOD_HOURS: 24,
};
exports.REMINDER_CONSTANTS = {
    DEFAULT_SCHEDULE: [
        { timing: enterprise_features_interfaces_1.ReminderTiming.HOURS_24, channel: enterprise_features_interfaces_1.CommunicationChannel.EMAIL },
        { timing: enterprise_features_interfaces_1.ReminderTiming.HOURS_1, channel: enterprise_features_interfaces_1.CommunicationChannel.SMS },
        { timing: enterprise_features_interfaces_1.ReminderTiming.MINUTES_15, channel: enterprise_features_interfaces_1.CommunicationChannel.PUSH },
    ],
    MAX_REMINDER_ATTEMPTS: 3,
    REMINDER_BATCH_SIZE: 100,
    REMINDER_PROCESSING_INTERVAL_MINUTES: 15,
};
exports.EVIDENCE_CONSTANTS = {
    MAX_FILE_SIZE_MB: 50,
    ALLOWED_MIME_TYPES: {
        PHOTO: ['image/jpeg', 'image/png', 'image/gif'],
        VIDEO: ['video/mp4', 'video/avi', 'video/mov'],
    },
    SECURE_URL_EXPIRY_HOURS: 24,
    AUDIT_RETENTION_DAYS: 2555,
};
exports.WITNESS_CONSTANTS = {
    MAX_STATEMENT_LENGTH: 10000,
    VOICE_PROCESSING_TIMEOUT_SECONDS: 300,
    VERIFICATION_TIMEOUT_HOURS: 72,
    STATEMENT_RETENTION_YEARS: 7,
};
exports.INSURANCE_CONSTANTS = {
    CLAIM_NUMBER_PREFIX: 'CLM-',
    MAX_CLAIM_AMOUNT: 100000,
    SUBMISSION_TIMEOUT_DAYS: 30,
    DOCUMENT_RETENTION_YEARS: 7,
    SUPPORTED_EXPORT_FORMATS: ['pdf', 'xml', 'edi'],
};
exports.HIPAA_CONSTANTS = {
    AUDIT_FREQUENCY_DAYS: 30,
    COMPLIANCE_RETENTION_YEARS: 7,
    REQUIRED_AREAS: [
        'Access Controls',
        'Audit Logs',
        'Encryption',
        'Data Backup',
        'Incident Response',
        'Training Records',
    ],
    CRITICAL_FINDINGS_THRESHOLD: 3,
};
exports.REGULATION_CONSTANTS = {
    SUPPORTED_STATES: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    ],
    HIGH_IMPACT_KEYWORDS: ['emergency', 'medication', 'privacy', 'consent', 'reporting'],
    MONITORING_INTERVAL_DAYS: 7,
};
exports.CONSENT_CONSTANTS = {
    DEFAULT_EXPIRY_YEARS: 1,
    RENEWAL_REMINDER_DAYS: 30,
    MAX_FORM_SIZE_KB: 2048,
    DIGITAL_SIGNATURE_ALGORITHM: 'sha256',
    VERSION_FORMAT: /^\d+\.\d+$/,
    EXPIRY_CHECK_BATCH_SIZE: 100,
    REMINDER_BATCH_SIZE: 50,
};
exports.TEMPLATE_CONSTANTS = {
    MAX_TEMPLATE_SIZE: 10000,
    VARIABLE_PATTERN: /\{\{(\w+)\}\}/g,
    SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'it', 'pt'],
    CATEGORIES: ['appointment', 'medication', 'emergency', 'consent', 'general'],
    USAGE_TRACKING_RETENTION_DAYS: 365,
};
exports.BULK_MESSAGING_CONSTANTS = {
    MAX_RECIPIENTS: 10000,
    BATCH_SIZE: 500,
    DELIVERY_TIMEOUT_MINUTES: 30,
    RETRY_ATTEMPTS: 3,
    SUPPORTED_CHANNELS: [
        enterprise_features_interfaces_1.CommunicationChannel.EMAIL,
        enterprise_features_interfaces_1.CommunicationChannel.SMS,
        enterprise_features_interfaces_1.CommunicationChannel.PUSH,
    ],
    DELIVERY_CHECK_INTERVAL_SECONDS: 60,
};
exports.TRANSLATION_CONSTANTS = {
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
    ],
    MAX_TEXT_LENGTH: 5000,
    CONFIDENCE_THRESHOLD: 0.8,
    CACHE_TTL_HOURS: 24,
    BATCH_SIZE: 100,
};
exports.REPORT_CONSTANTS = {
    MAX_FIELDS: 50,
    MAX_FILTERS: 20,
    EXECUTION_TIMEOUT_SECONDS: 300,
    CACHE_TTL_MINUTES: 15,
    EXPORT_FORMATS: ['pdf', 'excel', 'csv', 'json'],
    SCHEDULED_REPORTS_BATCH_SIZE: 10,
};
exports.DASHBOARD_CONSTANTS = {
    METRICS_UPDATE_INTERVAL_SECONDS: 60,
    TREND_PERIODS: ['day', 'week', 'month', 'quarter', 'year'],
    ALERT_THRESHOLDS: {
        CRITICAL: 0.9,
        WARNING: 0.5,
    },
    MAX_METRICS_HISTORY_DAYS: 90,
    CACHE_TTL_SECONDS: 30,
};
exports.ENTERPRISE_CONSTANTS = {
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
    },
    DEFAULT_TIMEZONE: 'America/New_York',
    LOG_RETENTION_DAYS: 90,
    MAX_CONCURRENT_OPERATIONS: 10,
    ENCRYPTION_ALGORITHM: 'aes-256-gcm',
    JWT_EXPIRY_HOURS: 24,
    API_RATE_LIMIT_REQUESTS: 1000,
    API_RATE_LIMIT_WINDOW_MINUTES: 15,
};
//# sourceMappingURL=enterprise-features-constants.js.map