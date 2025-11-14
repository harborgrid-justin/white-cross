/**
 * @fileoverview Integration API Validation Schemas
 * @module services/modules/integrationApi/validation
 *
 * Comprehensive Zod validation schemas for enterprise integration configurations.
 * Provides type-safe validation for integration types, authentication methods,
 * OAuth 2.0 configurations, field mappings, webhooks, and security features.
 */

import { z } from 'zod';

// ==================== Type Schemas ====================

/** Integration types: SIS, EHR, PHARMACY, LABORATORY, INSURANCE, PARENT_PORTAL, HEALTH_APP, GOVERNMENT_REPORTING */
export const integrationTypeSchema = z.enum([
  'SIS', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL', 'HEALTH_APP', 'GOVERNMENT_REPORTING'
], { errorMap: () => ({ message: 'Invalid integration type' }) });

/** Authentication methods: api_key, basic_auth, oauth2, jwt, certificate, custom */
export const authenticationMethodSchema = z.enum([
  'api_key', 'basic_auth', 'oauth2', 'jwt', 'certificate', 'custom'
], { errorMap: () => ({ message: 'Invalid authentication method' }) });

/** Sync directions: inbound, outbound, bidirectional */
export const syncDirectionSchema = z.enum(['inbound', 'outbound', 'bidirectional'], {
  errorMap: () => ({ message: 'Invalid sync direction' })
});

/** OAuth2 grant types */
export const oauth2GrantTypeSchema = z.enum([
  'authorization_code', 'client_credentials', 'password', 'refresh_token'
]);

/** Data types for field mappings */
export const dataTypeSchema = z.enum(['string', 'number', 'boolean', 'date', 'array', 'object']);

// ==================== Complex Object Schemas ====================

/** OAuth2 configuration with all standard fields */
export const oauth2ConfigSchema = z.object({
  clientId: z.string().min(1, 'OAuth2 clientId is required'),
  clientSecret: z.string().min(1, 'OAuth2 clientSecret is required'),
  authorizationUrl: z.string().url('OAuth2 authorizationUrl must be a valid URL'),
  tokenUrl: z.string().url('OAuth2 tokenUrl must be a valid URL'),
  redirectUri: z.string().url('OAuth2 redirectUri must be a valid URL').optional(),
  scope: z.array(z.string()).optional(),
  grantType: oauth2GrantTypeSchema,
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional(),
});

/** Transform rule for field mapping */
export const transformRuleSchema = z.object({
  type: z.enum(['map', 'format', 'calculate', 'conditional']),
  expression: z.string(),
  params: z.record(z.unknown()).optional(),
});

/** Validation rule for field values */
export const validationRuleSchema = z.object({
  type: z.enum(['required', 'minLength', 'maxLength', 'pattern', 'custom']),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  message: z.string().optional(),
});

/** Field mapping between source and target systems */
export const fieldMappingSchema = z.object({
  sourceField: z.string().min(1, 'Source field is required'),
  targetField: z.string().min(1, 'Target field is required'),
  dataType: dataTypeSchema,
  required: z.boolean(),
  defaultValue: z.unknown().optional(),
  transformRule: transformRuleSchema.optional(),
  validationRules: z.array(validationRuleSchema).optional(),
});

/** Webhook retry policy with exponential backoff */
export const webhookRetryPolicySchema = z.object({
  maxAttempts: z.number().int().min(0).max(10, 'Webhook retry maxAttempts must be between 0 and 10'),
  initialDelay: z.number().int().min(100).max(60000, 'Webhook retry initialDelay must be between 100ms and 60000ms'),
  backoffMultiplier: z.number().min(1).max(10, 'Webhook retry backoffMultiplier must be between 1 and 10'),
  maxDelay: z.number().int().min(1000).max(300000, 'Webhook retry maxDelay must be between 1000ms and 300000ms'),
});

// ==================== String Validation Schemas ====================

/** Cron expression validator (5-7 fields) */
export const cronExpressionSchema = z.string().refine(
  (value) => {
    const cronParts = value.trim().split(/\s+/);
    if (cronParts.length < 5 || cronParts.length > 7) return false;
    const validCronChars = /^[0-9\*\-,\/\?LW#]+$/;
    return cronParts.every(part => validCronChars.test(part));
  },
  { message: 'Invalid cron expression format. Expected 5-7 fields (minute, hour, day, month, weekday, [year], [seconds])' }
);

/** Endpoint URL with security validation (HTTPS in production) */
export const endpointUrlSchema = z.string()
  .url('Invalid endpoint URL format')
  .max(2048, 'Endpoint URL cannot exceed 2048 characters')
  .refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    },
    { message: 'Endpoint must use HTTP or HTTPS protocol' }
  )
  .refine(
    (url) => {
      if (process.env.NODE_ENV === 'production') {
        try {
          const parsedUrl = new URL(url);
          return !['localhost', '127.0.0.1', '0.0.0.0'].includes(parsedUrl.hostname);
        } catch {
          return false;
        }
      }
      return true;
    },
    { message: 'Localhost endpoints are not allowed in production' }
  );

/** API key with strength validation */
export const apiKeySchema = z.string()
  .min(8, 'API Key must be at least 8 characters long')
  .max(512, 'API Key cannot exceed 512 characters')
  .refine(
    (value) => !/^(password|12345|test|demo|api[-_]?key)/i.test(value),
    { message: 'API Key appears to be insecure or a placeholder' }
  );

/** Username format validation */
export const usernameSchema = z.string()
  .min(2, 'Username must be at least 2 characters long')
  .max(100, 'Username cannot exceed 100 characters')
  .regex(/^[a-zA-Z0-9@._\-+]+$/, 'Username contains invalid characters');

/** Password with strength requirements */
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(256, 'Password cannot exceed 256 characters')
  .refine(
    (value) => !/^(password|12345678|qwerty|admin|test)/i.test(value),
    { message: 'Password is too weak or appears to be a placeholder' }
  );

/** Integration name format */
export const integrationNameSchema = z.string()
  .min(2, 'Integration name must be at least 2 characters long')
  .max(100, 'Integration name cannot exceed 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_()]+$/, 'Integration name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses');

/** Sync frequency in minutes (1-43200) */
export const syncFrequencySchema = z.number()
  .int('Sync frequency must be an integer')
  .min(1, 'Sync frequency must be at least 1 minute')
  .max(43200, 'Sync frequency cannot exceed 43200 minutes (30 days)');

// ==================== Integration Settings Schema ====================

/** Integration settings with all configuration options */
export const integrationSettingsSchema = z.object({
  // Common settings
  timeout: z.number().int().min(1000).max(300000, 'Timeout must be between 1000ms (1s) and 300000ms (5min)').optional(),
  retryAttempts: z.number().int().min(0).max(10, 'Retry attempts must be between 0 and 10').optional(),
  retryDelay: z.number().int().min(100).max(60000, 'Retry delay must be between 100ms and 60000ms (1min)').optional(),
  enableLogging: z.boolean().optional(),
  enableWebhooks: z.boolean().optional(),

  // Authentication settings
  authMethod: authenticationMethodSchema.optional(),
  oauth2Config: oauth2ConfigSchema.optional(),
  certificatePath: z.string().optional(),

  // Data mapping settings
  fieldMappings: z.array(fieldMappingSchema).optional(),
  transformRules: z.array(transformRuleSchema).optional(),

  // Sync settings
  syncDirection: syncDirectionSchema.optional(),
  syncSchedule: cronExpressionSchema.optional(),
  autoSync: z.boolean().optional(),

  // Webhook configuration
  webhookUrl: z.string().url('Invalid webhook URL').optional(),
  webhookSecret: z.string().min(16, 'Webhook secret must be at least 16 characters long').optional(),
  webhookSignatureValidation: z.boolean().optional(),
  webhookRetryPolicy: webhookRetryPolicySchema.optional(),
  webhookEvents: z.array(z.string()).min(1, 'At least one webhook event must be configured').optional(),

  // Rate limiting
  rateLimitPerSecond: z.number().int().min(1).max(1000, 'Rate limit must be between 1 and 1000 requests per second').optional(),

  // Type-specific settings (allow any configuration)
  sisConfig: z.record(z.unknown()).optional(),
  ehrConfig: z.record(z.unknown()).optional(),
  pharmacyConfig: z.record(z.unknown()).optional(),
  laboratoryConfig: z.record(z.unknown()).optional(),
  insuranceConfig: z.record(z.unknown()).optional(),
  parentPortalConfig: z.record(z.unknown()).optional(),
  healthAppConfig: z.record(z.unknown()).optional(),
  governmentReportingConfig: z.record(z.unknown()).optional(),
}).passthrough();

// ==================== Request Schemas ====================

/** Create integration request validation */
export const createIntegrationSchema = z.object({
  name: integrationNameSchema,
  type: integrationTypeSchema,
  endpoint: endpointUrlSchema.optional(),
  apiKey: apiKeySchema.optional(),
  username: usernameSchema.optional(),
  password: passwordSchema.optional(),
  settings: integrationSettingsSchema.optional(),
  syncFrequency: syncFrequencySchema.optional(),
}).superRefine((data, ctx) => {
  // Validate that authentication is provided for non-government integrations
  if (data.type !== 'GOVERNMENT_REPORTING') {
    const hasAuth = data.apiKey ||
                   (data.username && data.password) ||
                   (data.settings?.oauth2Config);

    if (!hasAuth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one authentication method (API Key, username/password, or OAuth2) must be configured',
        path: ['apiKey']
      });
    }
  }

  // Validate that endpoint is provided for external integrations
  const typesRequiringEndpoint = ['SIS', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL', 'HEALTH_APP'];
  if (typesRequiringEndpoint.includes(data.type) && !data.endpoint) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Endpoint URL is required for ${data.type} integration type`,
      path: ['endpoint']
    });
  }

  // Validate that if username is provided, password must also be provided
  if (data.username && !data.password && !data.apiKey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password is required when username is provided for basic authentication',
      path: ['password']
    });
  }

  // Validate webhook configuration
  if (data.settings?.enableWebhooks && data.settings?.webhookUrl) {
    if (data.settings?.webhookSignatureValidation && !data.settings?.webhookSecret) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Webhook secret is required when signature validation is enabled',
        path: ['settings', 'webhookSecret']
      });
    }
  }

  // Validate OAuth2 config if authMethod is oauth2
  if (data.settings?.authMethod === 'oauth2' && !data.settings?.oauth2Config) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'OAuth2 configuration is required when authentication method is OAuth2',
      path: ['settings', 'oauth2Config']
    });
  }
});

/** Update integration request validation */
export const updateIntegrationSchema = z.object({
  name: integrationNameSchema.optional(),
  endpoint: endpointUrlSchema.optional(),
  apiKey: apiKeySchema.optional(),
  username: usernameSchema.optional(),
  password: passwordSchema.optional(),
  settings: integrationSettingsSchema.optional(),
  syncFrequency: syncFrequencySchema.optional(),
  isActive: z.boolean().optional(),
}).superRefine((data, ctx) => {
  // Validate that if username is provided, password should also be considered
  if (data.username && !data.password && !data.apiKey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password is required when username is provided for basic authentication',
      path: ['password']
    });
  }

  // Validate webhook configuration if being updated
  if (data.settings?.enableWebhooks && data.settings?.webhookUrl) {
    if (data.settings?.webhookSignatureValidation && !data.settings?.webhookSecret) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Webhook secret is required when signature validation is enabled',
        path: ['settings', 'webhookSecret']
      });
    }
  }
});

// ==================== Error Handling ====================

/** Creates a standardized API error with context */
export function createApiError(error: unknown, message: string): Error {
  if (error instanceof Error) {
    const enhancedError = new Error(`${message}: ${error.message}`);
    enhancedError.stack = error.stack;
    return enhancedError;
  }
  return new Error(message);
}
