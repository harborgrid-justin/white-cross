/**
 * @fileoverview Validation schemas for admin-specific operations
 * @module schemas/admin
 *
 * Zod validation schemas for API keys, webhooks, system health monitoring, and logs.
 */

import { z } from 'zod';

// ==========================================
// API KEY SCHEMAS
// ==========================================

/**
 * API key permission enum
 */
export const apiKeyPermissionEnum = z.enum([
  'read:students',
  'write:students',
  'read:health_records',
  'write:health_records',
  'read:medications',
  'write:medications',
  'read:appointments',
  'write:appointments',
  'read:incidents',
  'write:incidents',
  'read:inventory',
  'write:inventory',
  'admin:all',
  'custom'
]);

/**
 * API key status enum
 */
export const apiKeyStatusEnum = z.enum([
  'active',
  'inactive',
  'expired',
  'revoked'
]);

/**
 * Create API key schema
 */
export const createAPIKeySchema = z.object({
  name: z.string()
    .min(3, 'API key name must be at least 3 characters')
    .max(100, 'API key name must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  permissions: z.array(apiKeyPermissionEnum)
    .min(1, 'At least one permission is required'),
  ipRestrictions: z.array(z.string().regex(
    /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/,
    'Invalid IP address or CIDR notation'
  )).optional(),
  rateLimit: z.number()
    .int()
    .min(1)
    .max(10000)
    .default(100), // requests per minute
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateAPIKeyInput = z.infer<typeof createAPIKeySchema>;

/**
 * Update API key schema
 */
export const updateAPIKeySchema = z.object({
  keyId: z.string().uuid('Invalid API key ID'),
  name: z.string()
    .min(3, 'API key name must be at least 3 characters')
    .max(100, 'API key name must be less than 100 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  permissions: z.array(apiKeyPermissionEnum).optional(),
  ipRestrictions: z.array(z.string()).optional(),
  rateLimit: z.number().int().min(1).max(10000).optional(),
  status: apiKeyStatusEnum.optional(),
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateAPIKeyInput = z.infer<typeof updateAPIKeySchema>;

/**
 * Revoke API key schema
 */
export const revokeAPIKeySchema = z.object({
  keyId: z.string().uuid('Invalid API key ID'),
  reason: z.string()
    .min(10, 'Revocation reason must be at least 10 characters')
    .max(500, 'Revocation reason must be less than 500 characters'),
  notifyOwner: z.boolean().default(true),
});

export type RevokeAPIKeyInput = z.infer<typeof revokeAPIKeySchema>;

/**
 * Rotate API key schema
 */
export const rotateAPIKeySchema = z.object({
  keyId: z.string().uuid('Invalid API key ID'),
  overlapPeriod: z.number()
    .int()
    .min(0)
    .max(30)
    .default(7), // days both keys are valid
  notifyOwner: z.boolean().default(true),
});

export type RotateAPIKeyInput = z.infer<typeof rotateAPIKeySchema>;

/**
 * List API keys schema
 */
export const listAPIKeysSchema = z.object({
  userId: z.string().uuid().optional(), // Filter by user
  status: apiKeyStatusEnum.optional(),
  includeExpired: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

export type ListAPIKeysInput = z.infer<typeof listAPIKeysSchema>;

/**
 * API key usage schema
 */
export const getAPIKeyUsageSchema = z.object({
  keyId: z.string().uuid('Invalid API key ID'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['hour', 'day', 'week', 'month']).default('day'),
});

export type GetAPIKeyUsageInput = z.infer<typeof getAPIKeyUsageSchema>;

// ==========================================
// WEBHOOK SCHEMAS
// ==========================================

/**
 * Webhook event enum
 */
export const webhookEventEnum = z.enum([
  'user.created',
  'user.updated',
  'user.deleted',
  'student.created',
  'student.updated',
  'student.deleted',
  'health_record.created',
  'health_record.updated',
  'medication.administered',
  'appointment.scheduled',
  'appointment.cancelled',
  'incident.reported',
  'inventory.low_stock',
  'system.alert',
  'custom'
]);

/**
 * Webhook status enum
 */
export const webhookStatusEnum = z.enum([
  'active',
  'inactive',
  'error',
  'paused'
]);

/**
 * Webhook delivery status enum
 */
export const webhookDeliveryStatusEnum = z.enum([
  'pending',
  'delivered',
  'failed',
  'retrying'
]);

/**
 * Create webhook schema
 */
export const createWebhookSchema = z.object({
  name: z.string()
    .min(3, 'Webhook name must be at least 3 characters')
    .max(100, 'Webhook name must be less than 100 characters')
    .trim(),
  url: z.string()
    .url('Invalid webhook URL')
    .refine((url) => {
      // Ensure HTTPS in production
      return url.startsWith('https://') || process.env.NODE_ENV === 'development';
    }, 'Webhook URL must use HTTPS in production'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  events: z.array(webhookEventEnum)
    .min(1, 'At least one event is required'),
  secret: z.string()
    .min(16, 'Webhook secret must be at least 16 characters')
    .optional(), // Auto-generated if not provided
  active: z.boolean().default(true),
  retryPolicy: z.object({
    enabled: z.boolean().default(true),
    maxRetries: z.number().int().min(0).max(10).default(3),
    backoffMultiplier: z.number().min(1).max(10).default(2),
    initialDelay: z.number().int().min(1000).max(60000).default(1000), // milliseconds
  }),
  headers: z.record(z.string()).optional(), // Custom headers
  timeout: z.number().int().min(1000).max(30000).default(10000), // milliseconds
  metadata: z.record(z.any()).optional(),
});

export type CreateWebhookInput = z.infer<typeof createWebhookSchema>;

/**
 * Update webhook schema
 */
export const updateWebhookSchema = z.object({
  webhookId: z.string().uuid('Invalid webhook ID'),
  name: z.string()
    .min(3, 'Webhook name must be at least 3 characters')
    .max(100, 'Webhook name must be less than 100 characters')
    .trim()
    .optional(),
  url: z.string().url('Invalid webhook URL').optional(),
  description: z.string().max(500).optional(),
  events: z.array(webhookEventEnum).optional(),
  active: z.boolean().optional(),
  retryPolicy: z.object({
    enabled: z.boolean(),
    maxRetries: z.number().int().min(0).max(10),
    backoffMultiplier: z.number().min(1).max(10),
    initialDelay: z.number().int().min(1000).max(60000),
  }).partial().optional(),
  headers: z.record(z.string()).optional(),
  timeout: z.number().int().min(1000).max(30000).optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateWebhookInput = z.infer<typeof updateWebhookSchema>;

/**
 * Delete webhook schema
 */
export const deleteWebhookSchema = z.object({
  webhookId: z.string().uuid('Invalid webhook ID'),
  reason: z.string()
    .min(5, 'Deletion reason must be at least 5 characters')
    .max(500, 'Deletion reason must be less than 500 characters'),
});

export type DeleteWebhookInput = z.infer<typeof deleteWebhookSchema>;

/**
 * Test webhook schema
 */
export const testWebhookSchema = z.object({
  webhookId: z.string().uuid('Invalid webhook ID'),
  event: webhookEventEnum.default('custom'),
  samplePayload: z.record(z.any()).optional(),
});

export type TestWebhookInput = z.infer<typeof testWebhookSchema>;

/**
 * Get webhook deliveries schema
 */
export const getWebhookDeliveriesSchema = z.object({
  webhookId: z.string().uuid('Invalid webhook ID'),
  status: webhookDeliveryStatusEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

export type GetWebhookDeliveriesInput = z.infer<typeof getWebhookDeliveriesSchema>;

/**
 * Retry webhook delivery schema
 */
export const retryWebhookDeliverySchema = z.object({
  deliveryId: z.string().uuid('Invalid delivery ID'),
  force: z.boolean().default(false), // Force retry even if max retries exceeded
});

export type RetryWebhookDeliveryInput = z.infer<typeof retryWebhookDeliverySchema>;

// ==========================================
// SYSTEM HEALTH SCHEMAS
// ==========================================

/**
 * Health status enum
 */
export const healthStatusEnum = z.enum([
  'healthy',
  'degraded',
  'critical',
  'unknown'
]);

/**
 * Alert severity enum
 */
export const alertSeverityEnum = z.enum([
  'info',
  'warning',
  'critical'
]);

/**
 * Get system health schema
 */
export const getSystemHealthSchema = z.object({
  includeMetrics: z.boolean().default(true),
  includeAlerts: z.boolean().default(true),
  detailed: z.boolean().default(false),
});

export type GetSystemHealthInput = z.infer<typeof getSystemHealthSchema>;

/**
 * Health check component enum
 */
export const healthComponentEnum = z.enum([
  'database',
  'redis',
  'api',
  'filesystem',
  'external_integrations',
  'all'
]);

/**
 * Run health check schema
 */
export const runHealthCheckSchema = z.object({
  component: healthComponentEnum.default('all'),
  timeout: z.number().int().min(1000).max(60000).default(10000), // milliseconds
});

export type RunHealthCheckInput = z.infer<typeof runHealthCheckSchema>;

/**
 * Clear cache schema
 */
export const clearCacheSchema = z.object({
  cacheType: z.enum(['all', 'redis', 'memory', 'cdn']).default('all'),
  pattern: z.string().optional(), // Cache key pattern to clear
  confirmDeletion: z.boolean().default(false),
});

export type ClearCacheInput = z.infer<typeof clearCacheSchema>;

/**
 * Run maintenance schema
 */
export const runMaintenanceSchema = z.object({
  operation: z.enum([
    'optimize_database',
    'cleanup_sessions',
    'archive_logs',
    'vacuum_database',
    'rebuild_indexes',
    'cleanup_temp_files'
  ]),
  dryRun: z.boolean().default(true), // Test without making changes
  force: z.boolean().default(false),
});

export type RunMaintenanceInput = z.infer<typeof runMaintenanceSchema>;

// ==========================================
// SYSTEM LOGS SCHEMAS
// ==========================================

/**
 * Log level enum
 */
export const logLevelEnum = z.enum([
  'debug',
  'info',
  'warn',
  'error',
  'critical'
]);

/**
 * Get system logs schema
 */
export const getSystemLogsSchema = z.object({
  level: logLevelEnum.optional(),
  source: z.string().optional(), // Service/module name
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(), // Full-text search
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(1000).default(100),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  realTimeStream: z.boolean().default(false),
});

export type GetSystemLogsInput = z.infer<typeof getSystemLogsSchema>;

/**
 * Export logs schema
 */
export const exportLogsSchema = z.object({
  format: z.enum(['csv', 'json', 'txt']).default('json'),
  filters: getSystemLogsSchema.omit({ page: true, limit: true, realTimeStream: true }),
  includeMetadata: z.boolean().default(true),
  maxRecords: z.number().int().min(1).max(1000000).default(10000),
});

export type ExportLogsInput = z.infer<typeof exportLogsSchema>;

/**
 * Archive logs schema
 */
export const archiveLogsSchema = z.object({
  beforeDate: z.string().datetime(),
  destination: z.enum(['s3', 'azure_blob', 'local']).default('s3'),
  compress: z.boolean().default(true),
  deleteAfterArchive: z.boolean().default(false),
});

export type ArchiveLogsInput = z.infer<typeof archiveLogsSchema>;

// ==========================================
// SYSTEM METRICS SCHEMAS
// ==========================================

/**
 * Get system metrics schema
 */
export const getSystemMetricsSchema = z.object({
  metric: z.enum([
    'cpu',
    'memory',
    'disk',
    'network',
    'database',
    'api_performance',
    'all'
  ]).default('all'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  interval: z.enum(['1m', '5m', '15m', '1h', '1d']).default('5m'),
  aggregation: z.enum(['avg', 'min', 'max', 'sum']).default('avg'),
});

export type GetSystemMetricsInput = z.infer<typeof getSystemMetricsSchema>;

// ==========================================
// ADMIN DASHBOARD SCHEMAS
// ==========================================

/**
 * Get admin dashboard schema
 */
export const getAdminDashboardSchema = z.object({
  includeStats: z.boolean().default(true),
  includeActivity: z.boolean().default(true),
  includeAlerts: z.boolean().default(true),
  includeMetrics: z.boolean().default(true),
  activityLimit: z.number().int().min(1).max(100).default(20),
});

export type GetAdminDashboardInput = z.infer<typeof getAdminDashboardSchema>;

// ==========================================
// MFA VERIFICATION SCHEMA (for admin actions)
// ==========================================

/**
 * MFA verification schema for admin actions
 */
export const adminMFAVerificationSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
  action: z.string().min(1, 'Action is required'), // e.g., 'delete_user', 'revoke_api_key'
  resourceId: z.string().optional(), // ID of resource being acted upon
  metadata: z.record(z.any()).optional(),
});

export type AdminMFAVerificationInput = z.infer<typeof adminMFAVerificationSchema>;

// ==========================================
// IP VALIDATION HELPER
// ==========================================

/**
 * Validate IP address against whitelist
 */
export const validateIPAccessSchema = z.object({
  ipAddress: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address'),
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
});

export type ValidateIPAccessInput = z.infer<typeof validateIPAccessSchema>;

// ==========================================
// BACKUP AND RESTORE SCHEMAS
// ==========================================

/**
 * Create backup schema
 */
export const createBackupSchema = z.object({
  backupType: z.enum(['full', 'incremental', 'database_only']).default('full'),
  includeFiles: z.boolean().default(true),
  includeDatabase: z.boolean().default(true),
  compress: z.boolean().default(true),
  encrypt: z.boolean().default(true),
  destination: z.string().optional(), // Storage location
});

export type CreateBackupInput = z.infer<typeof createBackupSchema>;

/**
 * Restore backup schema
 */
export const restoreBackupSchema = z.object({
  backupId: z.string().uuid('Invalid backup ID'),
  restoreType: z.enum(['full', 'database_only', 'files_only']).default('full'),
  confirmRestore: z.boolean().default(false),
  validateBeforeRestore: z.boolean().default(true),
});

export type RestoreBackupInput = z.infer<typeof restoreBackupSchema>;
