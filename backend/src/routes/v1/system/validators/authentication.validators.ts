/**
 * System Authentication Validators
 * Joi validation schemas for MFA and system monitoring features
 */

import Joi from 'joi';

/**
 * MFA SETUP SCHEMA
 */

export const mfaSetupSchema = Joi.object({
  method: Joi.string().valid('totp', 'sms', 'email').required()
    .description('MFA method to set up'),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).when('method', {
    is: 'sms',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
    .description('Phone number for SMS-based MFA (E.164 format)'),
  email: Joi.string().email().when('method', {
    is: 'email',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
    .description('Email address for email-based MFA'),
  deviceName: Joi.string().max(100).optional()
    .description('Name of the device being registered')
});

/**
 * MFA VERIFICATION SCHEMA
 */

export const mfaVerificationSchema = Joi.object({
  code: Joi.string().min(6).max(8).required()
    .description('MFA verification code'),
  secret: Joi.string().when('method', {
    is: 'totp',
    then: Joi.optional(),
    otherwise: Joi.optional()
  })
    .description('TOTP secret key (for initial setup verification)'),
  method: Joi.string().valid('totp', 'sms', 'email', 'backup').required()
    .description('MFA method being verified'),
  rememberDevice: Joi.boolean().default(false)
    .description('Whether to remember this device for future logins')
});

/**
 * SYSTEM HEALTH QUERY SCHEMA
 */

export const systemHealthQuerySchema = Joi.object({
  includeDetails: Joi.boolean().default(false)
    .description('Include detailed component information'),
  format: Joi.string().valid('json', 'summary').default('json')
    .description('Response format preference'),
  components: Joi.array().items(
    Joi.string().valid('database', 'authentication', 'healthcare', 'storage', 'email', 'external')
  ).optional()
    .description('Specific components to check (if not provided, checks all)')
});

/**
 * FEATURE STATUS QUERY SCHEMA
 */

export const featureStatusQuerySchema = Joi.object({
  module: Joi.string().valid('healthcare', 'operations', 'analytics', 'communication', 'system').optional()
    .description('Filter by specific module'),
  includeMetrics: Joi.boolean().default(false)
    .description('Include usage metrics and performance data'),
  includeEndpoints: Joi.boolean().default(true)
    .description('Include endpoint count and availability'),
  timeRange: Joi.string().valid('hour', 'day', 'week', 'month').default('day')
    .description('Time range for metrics data')
});

/**
 * VALIDATION FUNCTIONS
 */

export const validateMFASetup = (payload: any) => {
  return mfaSetupSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
};

export const validateMFAVerification = (payload: any) => {
  return mfaVerificationSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
};

export const validateSystemHealthQuery = (query: any) => {
  return systemHealthQuerySchema.validate(query, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
};

export const validateFeatureStatusQuery = (query: any) => {
  return featureStatusQuerySchema.validate(query, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
};

/**
 * ADDITIONAL VALIDATION SCHEMAS
 */

export const mfaDisableSchema = Joi.object({
  currentPassword: Joi.string().min(1).required()
    .description('Current user password for security verification'),
  confirmDisable: Joi.boolean().valid(true).required()
    .description('Explicit confirmation to disable MFA'),
  reason: Joi.string().max(500).optional()
    .description('Optional reason for disabling MFA')
});

export const mfaBackupCodeSchema = Joi.object({
  generateNew: Joi.boolean().default(false)
    .description('Generate new backup codes (invalidates existing ones)'),
  count: Joi.number().min(5).max(20).default(10)
    .description('Number of backup codes to generate')
});

export const systemMaintenanceSchema = Joi.object({
  maintenanceType: Joi.string().valid('scheduled', 'emergency', 'update').required()
    .description('Type of maintenance being performed'),
  startTime: Joi.date().greater('now').required()
    .description('Maintenance start time'),
  estimatedDuration: Joi.number().min(1).max(1440).required()
    .description('Estimated duration in minutes'),
  affectedServices: Joi.array().items(
    Joi.string().valid('all', 'healthcare', 'operations', 'analytics', 'communication')
  ).min(1).required()
    .description('Services affected by maintenance'),
  notifyUsers: Joi.boolean().default(true)
    .description('Whether to notify users about maintenance'),
  message: Joi.string().max(500).when('notifyUsers', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  })
    .description('Maintenance notification message')
});

export const validateMFADisable = (payload: any) => {
  return mfaDisableSchema.validate(payload);
};

export const validateMFABackupCode = (payload: any) => {
  return mfaBackupCodeSchema.validate(payload);
};

export const validateSystemMaintenance = (payload: any) => {
  return systemMaintenanceSchema.validate(payload);
};
