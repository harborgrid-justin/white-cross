/**
 * @fileoverview Validation schemas for webhook management
 * @module schemas/admin/webhooks
 *
 * Zod validation schemas for webhook operations including creation,
 * updating, testing, and delivery tracking.
 */

import { z } from 'zod';

// ==========================================
// WEBHOOK ENUMS
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

// ==========================================
// WEBHOOK SCHEMAS
// ==========================================

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
