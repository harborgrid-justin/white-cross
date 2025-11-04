/**
 * @fileoverview Validation schemas for system monitoring and management
 * @module schemas/admin/system
 *
 * Zod validation schemas for system health monitoring, logs, metrics,
 * and admin dashboard operations.
 */

import { z } from 'zod';

// ==========================================
// SYSTEM HEALTH ENUMS
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

// ==========================================
// SYSTEM HEALTH SCHEMAS
// ==========================================

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
// SYSTEM LOGS ENUMS
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

// ==========================================
// SYSTEM LOGS SCHEMAS
// ==========================================

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
