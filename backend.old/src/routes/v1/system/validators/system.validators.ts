/**
 * System Validators
 * Joi validation schemas for system configuration and integration management
 */

import Joi from 'joi';

/**
 * COMMON SCHEMAS
 */

export const systemIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .description('System resource UUID')
});

export const integrationIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .description('Integration configuration UUID')
});

export const schoolIdParamSchema = Joi.object({
  schoolId: Joi.string().uuid().required()
    .description('School UUID')
});

/**
 * INTEGRATION TYPE ENUM
 */
const IntegrationType = Joi.string().valid(
  'SIS',
  'EMAIL',
  'SMS',
  'STORAGE',
  'AUTHENTICATION',
  'EHR',
  'PHARMACY',
  'LABORATORY',
  'INSURANCE',
  'PARENT_PORTAL',
  'HEALTH_APP',
  'GOVERNMENT_REPORTING'
).description('Integration type');

/**
 * INTEGRATION STATUS ENUM
 */
const IntegrationStatus = Joi.string().valid(
  'ACTIVE',
  'INACTIVE',
  'ERROR',
  'PENDING'
).description('Integration status');

/**
 * SYNC STATUS ENUM
 */
const SyncStatus = Joi.string().valid(
  'IDLE',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED'
).description('Synchronization status');

/**
 * FEATURE FLAGS ENUM
 */
const FeatureFlag = Joi.string().valid(
  'MEDICATION_MANAGEMENT',
  'INCIDENT_REPORTING',
  'PARENT_PORTAL',
  'MOBILE_APP',
  'ANALYTICS_DASHBOARD',
  'INTEGRATION_SIS',
  'AUTOMATED_NOTIFICATIONS'
).description('Feature flag identifier');

/**
 * SYSTEM CONFIGURATION VALIDATORS
 */

export const updateSystemConfigSchema = Joi.object({
  settings: Joi.object().pattern(
    Joi.string(),
    Joi.alternatives().try(
      Joi.string(),
      Joi.number(),
      Joi.boolean(),
      Joi.object()
    )
  ).required()
    .description('System configuration settings as key-value pairs')
    .example({
      'smtp.host': 'smtp.example.com',
      'smtp.port': 587,
      'session.timeout': 3600,
      'security.mfaRequired': true
    })
});

export const listSchoolsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .description('Page number for pagination'),
  limit: Joi.number().integer().min(1).max(100).default(20)
    .description('Number of records per page'),
  districtId: Joi.string().uuid()
    .description('Filter by district ID'),
  search: Joi.string()
    .description('Search by school name or code')
});

export const updateSchoolSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200)
    .description('School name'),
  code: Joi.string().trim().min(1).max(50)
    .description('School code'),
  address: Joi.string().max(500)
    .description('School address'),
  phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).max(20)
    .description('School phone number'),
  email: Joi.string().email()
    .description('School email address'),
  settings: Joi.object()
    .description('School-specific settings'),
  isActive: Joi.boolean()
    .description('Whether the school is active')
}).min(1).description('At least one field must be provided for update');

export const updateFeaturesSchema = Joi.object({
  features: Joi.array().items(FeatureFlag).min(1).required()
    .description('Array of feature flags to enable')
});

/**
 * INTEGRATION MANAGEMENT VALIDATORS
 */

export const listIntegrationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .description('Page number for pagination'),
  limit: Joi.number().integer().min(1).max(100).default(20)
    .description('Number of records per page'),
  type: IntegrationType
    .description('Filter by integration type'),
  status: IntegrationStatus
    .description('Filter by integration status')
});

export const createIntegrationSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required()
    .description('Integration name')
    .example('PowerSchool SIS Integration'),
  type: IntegrationType.required(),
  endpoint: Joi.string().uri().max(500)
    .description('Integration API endpoint URL')
    .example('https://api.powerschool.com/v1'),
  apiKey: Joi.string().max(500)
    .description('API key for authentication'),
  username: Joi.string().max(200)
    .description('Username for authentication'),
  password: Joi.string().max(500)
    .description('Password for authentication (will be encrypted)'),
  clientId: Joi.string().max(200)
    .description('OAuth client ID'),
  clientSecret: Joi.string().max(500)
    .description('OAuth client secret (will be encrypted)'),
  settings: Joi.object()
    .description('Integration-specific configuration settings')
    .example({
      apiVersion: '2.0',
      timeout: 30000,
      retryAttempts: 3
    }),
  syncFrequency: Joi.number().integer().min(0)
    .description('Sync frequency in minutes (0 for manual only)')
    .default(0),
  isActive: Joi.boolean().default(false)
    .description('Whether the integration is active')
}).description('Integration configuration data');

export const updateIntegrationSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200)
    .description('Integration name'),
  endpoint: Joi.string().uri().max(500)
    .description('Integration API endpoint URL'),
  apiKey: Joi.string().max(500)
    .description('API key for authentication'),
  username: Joi.string().max(200)
    .description('Username for authentication'),
  password: Joi.string().max(500)
    .description('Password for authentication (will be encrypted)'),
  clientId: Joi.string().max(200)
    .description('OAuth client ID'),
  clientSecret: Joi.string().max(500)
    .description('OAuth client secret (will be encrypted)'),
  settings: Joi.object()
    .description('Integration-specific configuration settings'),
  syncFrequency: Joi.number().integer().min(0)
    .description('Sync frequency in minutes'),
  isActive: Joi.boolean()
    .description('Whether the integration is active'),
  status: IntegrationStatus
    .description('Integration status')
}).min(1).description('At least one field must be provided for update');

/**
 * SYNCHRONIZATION VALIDATORS
 */

export const syncStudentsSchema = Joi.object({
  integrationId: Joi.string().uuid().required()
    .description('Integration configuration ID to use for sync'),
  grade: Joi.string()
    .description('Optional: sync only students in specific grade'),
  fullSync: Joi.boolean().default(false)
    .description('Perform full sync (true) or incremental sync (false)'),
  modifiedSince: Joi.date().iso()
    .description('Optional: sync only records modified since this date')
}).description('Student data synchronization parameters');

export const syncStatusQuerySchema = Joi.object({
  integrationId: Joi.string().uuid()
    .description('Filter by integration ID'),
  status: SyncStatus
    .description('Filter by sync status'),
  limit: Joi.number().integer().min(1).max(100).default(10)
    .description('Number of recent sync sessions to return')
});

export const syncLogsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .description('Page number for pagination'),
  limit: Joi.number().integer().min(1).max(100).default(50)
    .description('Number of log entries per page'),
  integrationId: Joi.string().uuid()
    .description('Filter by integration ID'),
  status: Joi.string().valid('success', 'failed')
    .description('Filter by operation status'),
  action: Joi.string()
    .description('Filter by action type (sync, test_connection, create, update, etc.)'),
  startDate: Joi.date().iso()
    .description('Filter logs after this date'),
  endDate: Joi.date().iso()
    .description('Filter logs before this date')
}).description('Sync log query parameters');

/**
 * UTILITY VALIDATORS
 */

export const gradeTransitionSchema = Joi.object({
  effectiveDate: Joi.date().iso()
    .description('Date when grade transition becomes effective')
    .default(new Date()),
  dryRun: Joi.boolean().default(false)
    .description('Preview mode - no changes will be saved'),
  grades: Joi.array().items(Joi.string())
    .description('Optional: transition only specific grades')
}).description('Grade transition parameters');
