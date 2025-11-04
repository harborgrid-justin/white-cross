/**
 * @fileoverview Integration settings validation schemas
 * @module schemas/settings/integration
 *
 * Zod validation schemas for third-party integrations and external system connections.
 */

import { z } from 'zod';
import {
  integrationTypeEnum,
  integrationStatusEnum,
  authMethodEnum
} from './settings.base.schemas';

// ==========================================
// INTEGRATION SCHEMAS
// ==========================================

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
    customHeaders: z.record(z.string(), z.string()).optional(),
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
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Integration = z.infer<typeof integrationSchema>;

// ==========================================
// INTEGRATION SETTINGS COLLECTION SCHEMAS
// ==========================================

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
