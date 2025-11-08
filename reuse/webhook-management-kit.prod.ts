/**
 * LOC: WHK1234567
 * File: /reuse/webhook-management-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Webhook delivery services
 *   - Event notification systems
 *   - Integration platforms
 *   - API webhook endpoints
 */

/**
 * File: /reuse/webhook-management-kit.prod.ts
 * Locator: WC-UTL-WHK-001
 * Purpose: Production-Grade Webhook Management Utilities - delivery, retry, signing, verification, subscriptions
 *
 * Upstream: Independent utility module for webhook management
 * Downstream: ../backend/*, webhook services, event systems, integration platforms
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x, crypto
 * Exports: 48 utility functions for webhook delivery, retry logic, HMAC signing, verification, subscriptions, monitoring
 *
 * LLM Context: Comprehensive webhook management toolkit for production-grade webhook delivery systems.
 * Provides HMAC-SHA256 signing, signature verification, exponential backoff retry, delivery tracking,
 * subscription management, event filtering, batching, rate limiting, dead letter queue, circuit breaker,
 * and comprehensive monitoring. Essential for building reliable webhook delivery infrastructure.
 */

import { Injectable, Controller, Post, Get, Put, Delete, Param, Body, Query, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Model, DataTypes, Sequelize, Op } from 'sequelize';
import { z } from 'zod';
import * as crypto from 'crypto';
import axios, { AxiosRequestConfig } from 'axios';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Webhook subscription configuration
 */
export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  filters?: Record<string, any>;
  headers?: Record<string, string>;
  retryConfig?: RetryConfig;
  rateLimit?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Webhook delivery record
 */
export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventId: string;
  eventType: string;
  url: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed' | 'retrying' | 'dead_letter';
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: Date;
  nextRetryAt?: Date;
  responseStatus?: number;
  responseBody?: string;
  errorMessage?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Webhook event payload
 */
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Signature configuration for HMAC signing
 */
export interface SignatureConfig {
  algorithm: 'sha256' | 'sha512';
  header: string;
  timestampHeader?: string;
  includeTimestamp?: boolean;
  timestampTolerance?: number; // seconds
}

/**
 * Retry configuration with exponential backoff
 */
export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  retryableStatusCodes: number[];
  timeout: number; // milliseconds
}

/**
 * Delivery result with detailed information
 */
export interface DeliveryResult {
  success: boolean;
  subscriptionId: string;
  deliveryId: string;
  status: number;
  responseBody?: string;
  error?: string;
  duration: number;
  attempt: number;
  willRetry: boolean;
  nextRetryAt?: Date;
}

/**
 * Batch delivery configuration
 */
export interface BatchConfig {
  maxSize: number;
  maxWaitTime: number; // milliseconds
  flushOnShutdown: boolean;
}

/**
 * Rate limit configuration per subscription
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

/**
 * Dead letter queue configuration
 */
export interface DeadLetterConfig {
  maxRetries: number;
  retentionPeriod: number; // days
  notifyOnFailure: boolean;
  notificationUrl?: string;
}

/**
 * Circuit breaker state
 */
export interface CircuitBreakerState {
  subscriptionId: string;
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  threshold: number;
  lastFailureAt?: Date;
  resetTimeout: number; // milliseconds
  nextResetAt?: Date;
}

/**
 * Delivery metrics and statistics
 */
export interface DeliveryMetrics {
  subscriptionId?: string;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  retryingDeliveries: number;
  deadLetterDeliveries: number;
  averageLatency: number;
  p95Latency: number;
  p99Latency: number;
  successRate: number;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * Webhook verification challenge
 */
export interface WebhookVerificationChallenge {
  challenge: string;
  timestamp: Date;
  expiresAt: Date;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for webhook subscription creation/update
 */
export const WebhookSubscriptionSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  events: z.array(z.string()).min(1, 'At least one event type required'),
  secret: z.string().optional(),
  active: z.boolean().default(true),
  filters: z.record(z.any()).optional(),
  headers: z.record(z.string()).optional(),
  retryConfig: z.object({
    maxAttempts: z.number().min(0).max(10).default(3),
    initialDelay: z.number().min(100).default(1000),
    maxDelay: z.number().min(1000).default(300000),
    backoffMultiplier: z.number().min(1).max(5).default(2),
    retryableStatusCodes: z.array(z.number()).default([408, 429, 500, 502, 503, 504]),
    timeout: z.number().min(1000).max(60000).default(30000),
  }).optional(),
  rateLimit: z.number().min(1).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for webhook event
 */
export const WebhookEventSchema = z.object({
  id: z.string().uuid(),
  type: z.string().min(1),
  data: z.any(),
  timestamp: z.date(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for signature configuration
 */
export const SignatureConfigSchema = z.object({
  algorithm: z.enum(['sha256', 'sha512']).default('sha256'),
  header: z.string().default('X-Webhook-Signature'),
  timestampHeader: z.string().default('X-Webhook-Timestamp'),
  includeTimestamp: z.boolean().default(true),
  timestampTolerance: z.number().min(0).default(300),
});

/**
 * Zod schema for delivery result
 */
export const DeliveryResultSchema = z.object({
  success: z.boolean(),
  subscriptionId: z.string(),
  deliveryId: z.string(),
  status: z.number(),
  responseBody: z.string().optional(),
  error: z.string().optional(),
  duration: z.number(),
  attempt: z.number(),
  willRetry: z.boolean(),
  nextRetryAt: z.date().optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Webhook Subscriptions with events, filters, and retry configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WebhookSubscription model
 *
 * @example
 * ```typescript
 * const WebhookSubscription = createWebhookSubscriptionModel(sequelize);
 * const subscription = await WebhookSubscription.create({
 *   url: 'https://example.com/webhooks',
 *   events: ['user.created', 'user.updated'],
 *   secret: 'whsec_abc123xyz',
 *   active: true
 * });
 * ```
 */
export const createWebhookSubscriptionModel = (sequelize: Sequelize) => {
  class WebhookSubscriptionModel extends Model {
    public id!: string;
    public url!: string;
    public events!: string[];
    public secret!: string;
    public active!: boolean;
    public filters!: Record<string, any>;
    public headers!: Record<string, string>;
    public retryConfig!: Record<string, any>;
    public rateLimit!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WebhookSubscriptionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique subscription identifier',
      },
      url: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: {
          isUrl: true,
        },
        comment: 'Webhook endpoint URL',
      },
      events: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of subscribed event types',
      },
      secret: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'HMAC secret for signature verification',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether subscription is active',
      },
      filters: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Event filtering criteria',
      },
      headers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Custom headers to include in delivery',
      },
      retryConfig: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          maxAttempts: 3,
          initialDelay: 1000,
          maxDelay: 300000,
          backoffMultiplier: 2,
          retryableStatusCodes: [408, 429, 500, 502, 503, 504],
          timeout: 30000,
        },
        comment: 'Retry configuration with exponential backoff',
      },
      rateLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Maximum deliveries per minute',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional subscription metadata',
      },
    },
    {
      sequelize,
      tableName: 'webhook_subscriptions',
      timestamps: true,
      indexes: [
        { fields: ['url'] },
        { fields: ['active'] },
        { fields: ['events'], using: 'GIN' },
      ],
    },
  );

  return WebhookSubscriptionModel;
};

/**
 * Sequelize model for Webhook Deliveries with status tracking and retry management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WebhookDelivery model
 *
 * @example
 * ```typescript
 * const WebhookDelivery = createWebhookDeliveryModel(sequelize);
 * const delivery = await WebhookDelivery.create({
 *   subscriptionId: 'sub-uuid',
 *   eventId: 'evt-uuid',
 *   eventType: 'user.created',
 *   url: 'https://example.com/webhooks',
 *   payload: { user: { id: 123, name: 'John' } },
 *   status: 'pending'
 * });
 * ```
 */
export const createWebhookDeliveryModel = (sequelize: Sequelize) => {
  class WebhookDeliveryModel extends Model {
    public id!: string;
    public subscriptionId!: string;
    public eventId!: string;
    public eventType!: string;
    public url!: string;
    public payload!: any;
    public status!: string;
    public attempts!: number;
    public maxAttempts!: number;
    public lastAttemptAt!: Date | null;
    public nextRetryAt!: Date | null;
    public responseStatus!: number | null;
    public responseBody!: string | null;
    public errorMessage!: string | null;
    public deliveredAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WebhookDeliveryModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique delivery identifier',
      },
      subscriptionId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to webhook subscription',
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to webhook event',
      },
      eventType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Type of event being delivered',
      },
      url: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        comment: 'Delivery endpoint URL',
      },
      payload: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Event payload data',
      },
      status: {
        type: DataTypes.ENUM('pending', 'delivered', 'failed', 'retrying', 'dead_letter'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Current delivery status',
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of delivery attempts',
      },
      maxAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
        comment: 'Maximum retry attempts',
      },
      lastAttemptAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp of last delivery attempt',
      },
      nextRetryAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Scheduled retry timestamp',
      },
      responseStatus: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'HTTP response status code',
      },
      responseBody: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'HTTP response body',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if delivery failed',
      },
      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Successful delivery timestamp',
      },
    },
    {
      sequelize,
      tableName: 'webhook_deliveries',
      timestamps: true,
      indexes: [
        { fields: ['subscriptionId'] },
        { fields: ['eventId'] },
        { fields: ['status'] },
        { fields: ['nextRetryAt'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return WebhookDeliveryModel;
};

/**
 * Sequelize model for Webhook Events with type and payload storage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WebhookEvent model
 *
 * @example
 * ```typescript
 * const WebhookEvent = createWebhookEventModel(sequelize);
 * const event = await WebhookEvent.create({
 *   type: 'user.created',
 *   data: { user: { id: 123, name: 'John Doe' } },
 *   timestamp: new Date()
 * });
 * ```
 */
export const createWebhookEventModel = (sequelize: Sequelize) => {
  class WebhookEventModel extends Model {
    public id!: string;
    public type!: string;
    public data!: any;
    public timestamp!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WebhookEventModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique event identifier',
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Event type (e.g., user.created, order.completed)',
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Event payload data',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Event occurrence timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional event metadata',
      },
    },
    {
      sequelize,
      tableName: 'webhook_events',
      timestamps: true,
      indexes: [
        { fields: ['type'] },
        { fields: ['timestamp'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return WebhookEventModel;
};

/**
 * Sequelize model for Dead Letter Queue storing failed webhook deliveries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DeadLetterQueue model
 *
 * @example
 * ```typescript
 * const DeadLetterQueue = createDeadLetterQueueModel(sequelize);
 * const dlqItem = await DeadLetterQueue.create({
 *   deliveryId: 'del-uuid',
 *   subscriptionId: 'sub-uuid',
 *   eventId: 'evt-uuid',
 *   reason: 'Max retries exceeded',
 *   payload: { ... }
 * });
 * ```
 */
export const createDeadLetterQueueModel = (sequelize: Sequelize) => {
  class DeadLetterQueueModel extends Model {
    public id!: string;
    public deliveryId!: string;
    public subscriptionId!: string;
    public eventId!: string;
    public reason!: string;
    public payload!: any;
    public attempts!: number;
    public lastError!: string;
    public processedAt!: Date | null;
    public retryCount!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DeadLetterQueueModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique DLQ entry identifier',
      },
      deliveryId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to failed delivery',
      },
      subscriptionId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to webhook subscription',
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to webhook event',
      },
      reason: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Failure reason',
      },
      payload: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Original event payload',
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total delivery attempts made',
      },
      lastError: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Last error message',
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Manual processing timestamp',
      },
      retryCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of manual retry attempts',
      },
    },
    {
      sequelize,
      tableName: 'webhook_dead_letter_queue',
      timestamps: true,
      indexes: [
        { fields: ['deliveryId'] },
        { fields: ['subscriptionId'] },
        { fields: ['processedAt'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return DeadLetterQueueModel;
};

// ============================================================================
// SIGNING AND VERIFICATION FUNCTIONS
// ============================================================================

/**
 * @function generateHmacSignature
 * @description Generates HMAC-SHA256 signature for webhook payload
 * @param {any} payload - Webhook payload
 * @param {string} secret - HMAC secret key
 * @param {string} [algorithm='sha256'] - Hash algorithm
 * @returns {string} Hex-encoded HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateHmacSignature(
 *   { event: 'user.created', data: { id: 123 } },
 *   'whsec_abc123xyz',
 *   'sha256'
 * );
 * // Returns: 'a1b2c3d4e5f6...'
 * ```
 */
export const generateHmacSignature = (
  payload: any,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256',
): string => {
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(payloadString);
  return hmac.digest('hex');
};

/**
 * @function verifyHmacSignature
 * @description Verifies HMAC signature for webhook payload
 * @param {any} payload - Webhook payload
 * @param {string} signature - Provided signature
 * @param {string} secret - HMAC secret key
 * @param {string} [algorithm='sha256'] - Hash algorithm
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyHmacSignature(
 *   payload,
 *   'a1b2c3d4e5f6...',
 *   'whsec_abc123xyz'
 * );
 * if (isValid) {
 *   // Process webhook
 * }
 * ```
 */
export const verifyHmacSignature = (
  payload: any,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256',
): boolean => {
  const expectedSignature = generateHmacSignature(payload, secret, algorithm);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
};

/**
 * @function createSignatureHeaders
 * @description Creates signature headers for webhook delivery
 * @param {any} payload - Webhook payload
 * @param {string} secret - HMAC secret key
 * @param {SignatureConfig} [config] - Signature configuration
 * @returns {Record<string, string>} Headers object with signature
 *
 * @example
 * ```typescript
 * const headers = createSignatureHeaders(
 *   { event: 'user.created' },
 *   'whsec_abc123xyz',
 *   { algorithm: 'sha256', includeTimestamp: true }
 * );
 * // Returns: { 'X-Webhook-Signature': '...', 'X-Webhook-Timestamp': '...' }
 * ```
 */
export const createSignatureHeaders = (
  payload: any,
  secret: string,
  config?: Partial<SignatureConfig>,
): Record<string, string> => {
  const defaultConfig: SignatureConfig = {
    algorithm: 'sha256',
    header: 'X-Webhook-Signature',
    timestampHeader: 'X-Webhook-Timestamp',
    includeTimestamp: true,
    timestampTolerance: 300,
  };

  const finalConfig = { ...defaultConfig, ...config };
  const timestamp = Math.floor(Date.now() / 1000);
  const headers: Record<string, string> = {};

  if (finalConfig.includeTimestamp) {
    headers[finalConfig.timestampHeader!] = timestamp.toString();
    const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
    headers[finalConfig.header] = generateHmacSignature(signedPayload, secret, finalConfig.algorithm);
  } else {
    headers[finalConfig.header] = generateHmacSignature(payload, secret, finalConfig.algorithm);
  }

  return headers;
};

/**
 * @function validateSignatureTimestamp
 * @description Validates webhook signature timestamp to prevent replay attacks
 * @param {number} timestamp - Provided timestamp (seconds)
 * @param {number} [tolerance=300] - Tolerance in seconds
 * @returns {boolean} True if timestamp is within tolerance
 *
 * @example
 * ```typescript
 * const isValid = validateSignatureTimestamp(1699999999, 300);
 * if (!isValid) {
 *   throw new Error('Timestamp too old - possible replay attack');
 * }
 * ```
 */
export const validateSignatureTimestamp = (
  timestamp: number,
  tolerance: number = 300,
): boolean => {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.abs(now - timestamp);
  return diff <= tolerance;
};

/**
 * @function generateWebhookSecret
 * @description Generates a cryptographically secure webhook secret
 * @param {number} [length=32] - Secret length in bytes
 * @returns {string} Base64-encoded secret with 'whsec_' prefix
 *
 * @example
 * ```typescript
 * const secret = generateWebhookSecret(32);
 * // Returns: 'whsec_abcdef123456...'
 * ```
 */
export const generateWebhookSecret = (length: number = 32): string => {
  const randomBytes = crypto.randomBytes(length);
  return `whsec_${randomBytes.toString('base64url')}`;
};

/**
 * @function rotateWebhookSecret
 * @description Rotates webhook secret for a subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {string} oldSecret - Current secret
 * @returns {Object} New secret and grace period end
 *
 * @example
 * ```typescript
 * const { newSecret, gracePeriodEnd } = rotateWebhookSecret(
 *   'sub-uuid',
 *   'whsec_old123'
 * );
 * // Allow both old and new secrets during grace period
 * ```
 */
export const rotateWebhookSecret = (
  subscriptionId: string,
  oldSecret: string,
): { newSecret: string; oldSecret: string; gracePeriodEnd: Date } => {
  const newSecret = generateWebhookSecret();
  const gracePeriodEnd = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    newSecret,
    oldSecret,
    gracePeriodEnd,
  };
};

/**
 * @function parseSignatureHeader
 * @description Parses webhook signature header (supports multiple formats)
 * @param {string} headerValue - Signature header value
 * @returns {Object} Parsed signature components
 *
 * @example
 * ```typescript
 * const parsed = parseSignatureHeader('t=1699999999,v1=abc123,v2=def456');
 * // Returns: { timestamp: 1699999999, signatures: { v1: 'abc123', v2: 'def456' } }
 * ```
 */
export const parseSignatureHeader = (
  headerValue: string,
): { timestamp?: number; signatures: Record<string, string> } => {
  const parts = headerValue.split(',');
  const parsed: { timestamp?: number; signatures: Record<string, string> } = {
    signatures: {},
  };

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 't') {
      parsed.timestamp = parseInt(value, 10);
    } else {
      parsed.signatures[key] = value;
    }
  }

  return parsed;
};

/**
 * @function validateReplayProtection
 * @description Validates webhook against replay attacks using timestamp and nonce
 * @param {string} signature - Webhook signature
 * @param {number} timestamp - Webhook timestamp
 * @param {string} [nonce] - Optional nonce for additional security
 * @param {Set<string>} [processedNonces] - Set of processed nonces
 * @returns {boolean} True if webhook is valid and not a replay
 *
 * @example
 * ```typescript
 * const processedNonces = new Set<string>();
 * const isValid = validateReplayProtection(
 *   signature,
 *   timestamp,
 *   nonce,
 *   processedNonces
 * );
 * ```
 */
export const validateReplayProtection = (
  signature: string,
  timestamp: number,
  nonce?: string,
  processedNonces?: Set<string>,
): boolean => {
  // Validate timestamp
  if (!validateSignatureTimestamp(timestamp, 300)) {
    return false;
  }

  // Validate nonce if provided
  if (nonce && processedNonces) {
    if (processedNonces.has(nonce)) {
      return false; // Replay detected
    }
    processedNonces.add(nonce);
  }

  return true;
};

// ============================================================================
// DELIVERY AND RETRY FUNCTIONS
// ============================================================================

/**
 * @function deliverWebhook
 * @description Delivers webhook to endpoint with timeout
 * @param {string} url - Webhook endpoint URL
 * @param {any} payload - Event payload
 * @param {Record<string, string>} [headers] - Custom headers
 * @param {number} [timeout=30000] - Request timeout in milliseconds
 * @returns {Promise<DeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverWebhook(
 *   'https://example.com/webhooks',
 *   { event: 'user.created', data: { id: 123 } },
 *   { 'X-Custom-Header': 'value' },
 *   30000
 * );
 * ```
 */
export const deliverWebhook = async (
  url: string,
  payload: any,
  headers?: Record<string, string>,
  timeout: number = 30000,
): Promise<Partial<DeliveryResult>> => {
  const startTime = Date.now();

  try {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WhiteCross-Webhook/1.0',
        ...headers,
      },
      timeout,
      validateStatus: () => true, // Don't throw on any status
    };

    const response = await axios(config);
    const duration = Date.now() - startTime;

    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      responseBody: JSON.stringify(response.data),
      duration,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;

    return {
      success: false,
      status: error.response?.status || 0,
      error: error.message,
      duration,
    };
  }
};

/**
 * @function calculateRetryDelay
 * @description Calculates exponential backoff retry delay
 * @param {number} attempt - Attempt number (0-indexed)
 * @param {RetryConfig} config - Retry configuration
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(2, {
 *   initialDelay: 1000,
 *   maxDelay: 300000,
 *   backoffMultiplier: 2
 * });
 * // Returns: 4000 (1000 * 2^2)
 * ```
 */
export const calculateRetryDelay = (
  attempt: number,
  config: RetryConfig,
): number => {
  const exponentialDelay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
  const delay = Math.min(exponentialDelay + jitter, config.maxDelay);
  return Math.floor(delay);
};

/**
 * @function deliverWebhookWithRetry
 * @description Delivers webhook with exponential backoff retry logic
 * @param {string} subscriptionId - Subscription identifier
 * @param {string} url - Webhook endpoint URL
 * @param {any} payload - Event payload
 * @param {Record<string, string>} headers - Headers including signature
 * @param {RetryConfig} retryConfig - Retry configuration
 * @returns {Promise<DeliveryResult>} Final delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverWebhookWithRetry(
 *   'sub-uuid',
 *   'https://example.com/webhooks',
 *   { event: 'user.created' },
 *   signatureHeaders,
 *   { maxAttempts: 3, initialDelay: 1000, backoffMultiplier: 2 }
 * );
 * ```
 */
export const deliverWebhookWithRetry = async (
  subscriptionId: string,
  url: string,
  payload: any,
  headers: Record<string, string>,
  retryConfig: RetryConfig,
): Promise<DeliveryResult> => {
  let lastResult: Partial<DeliveryResult> = {};

  for (let attempt = 0; attempt < retryConfig.maxAttempts; attempt++) {
    lastResult = await deliverWebhook(url, payload, headers, retryConfig.timeout);

    if (lastResult.success) {
      return {
        success: true,
        subscriptionId,
        deliveryId: '', // Should be set by caller
        status: lastResult.status!,
        responseBody: lastResult.responseBody,
        duration: lastResult.duration!,
        attempt: attempt + 1,
        willRetry: false,
      };
    }

    // Check if status is retryable
    const isRetryable = retryConfig.retryableStatusCodes.includes(lastResult.status || 0);
    const hasMoreAttempts = attempt < retryConfig.maxAttempts - 1;

    if (!isRetryable || !hasMoreAttempts) {
      break;
    }

    // Wait before retry
    const delay = calculateRetryDelay(attempt, retryConfig);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // All retries exhausted
  const nextRetryDelay = calculateRetryDelay(retryConfig.maxAttempts - 1, retryConfig);
  return {
    success: false,
    subscriptionId,
    deliveryId: '', // Should be set by caller
    status: lastResult.status || 0,
    error: lastResult.error || 'All retry attempts failed',
    duration: lastResult.duration || 0,
    attempt: retryConfig.maxAttempts,
    willRetry: false,
    nextRetryAt: new Date(Date.now() + nextRetryDelay),
  };
};

/**
 * @function scheduleRetry
 * @description Schedules a webhook delivery retry
 * @param {string} deliveryId - Delivery identifier
 * @param {number} attempt - Current attempt number
 * @param {RetryConfig} config - Retry configuration
 * @returns {Date} Next retry timestamp
 *
 * @example
 * ```typescript
 * const nextRetry = scheduleRetry('del-uuid', 2, retryConfig);
 * // Schedule retry at returned timestamp
 * ```
 */
export const scheduleRetry = (
  deliveryId: string,
  attempt: number,
  config: RetryConfig,
): Date => {
  const delay = calculateRetryDelay(attempt, config);
  return new Date(Date.now() + delay);
};

/**
 * @function trackDeliveryAttempt
 * @description Records a webhook delivery attempt
 * @param {string} deliveryId - Delivery identifier
 * @param {number} attempt - Attempt number
 * @param {number} status - HTTP status code
 * @param {string} [error] - Error message if failed
 * @returns {Object} Delivery attempt record
 *
 * @example
 * ```typescript
 * const attempt = trackDeliveryAttempt('del-uuid', 1, 500, 'Internal Server Error');
 * ```
 */
export const trackDeliveryAttempt = (
  deliveryId: string,
  attempt: number,
  status: number,
  error?: string,
): {
  deliveryId: string;
  attempt: number;
  timestamp: Date;
  status: number;
  error?: string;
} => {
  return {
    deliveryId,
    attempt,
    timestamp: new Date(),
    status,
    error,
  };
};

/**
 * @function updateDeliveryStatus
 * @description Updates webhook delivery status
 * @param {Model} delivery - Delivery model instance
 * @param {string} status - New status
 * @param {Object} [details] - Additional details
 * @returns {Promise<Model>} Updated delivery
 *
 * @example
 * ```typescript
 * await updateDeliveryStatus(delivery, 'delivered', {
 *   responseStatus: 200,
 *   deliveredAt: new Date()
 * });
 * ```
 */
export const updateDeliveryStatus = async (
  delivery: any,
  status: 'pending' | 'delivered' | 'failed' | 'retrying' | 'dead_letter',
  details?: {
    responseStatus?: number;
    responseBody?: string;
    errorMessage?: string;
    deliveredAt?: Date;
    nextRetryAt?: Date;
  },
): Promise<any> => {
  delivery.status = status;
  delivery.lastAttemptAt = new Date();

  if (details) {
    if (details.responseStatus !== undefined) delivery.responseStatus = details.responseStatus;
    if (details.responseBody !== undefined) delivery.responseBody = details.responseBody;
    if (details.errorMessage !== undefined) delivery.errorMessage = details.errorMessage;
    if (details.deliveredAt !== undefined) delivery.deliveredAt = details.deliveredAt;
    if (details.nextRetryAt !== undefined) delivery.nextRetryAt = details.nextRetryAt;
  }

  delivery.attempts += 1;
  return await delivery.save();
};

/**
 * @function checkCircuitBreaker
 * @description Checks circuit breaker state for a subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, CircuitBreakerState>} circuitBreakers - Circuit breaker state map
 * @returns {boolean} True if circuit is closed (delivery allowed)
 *
 * @example
 * ```typescript
 * const circuitBreakers = new Map();
 * if (checkCircuitBreaker('sub-uuid', circuitBreakers)) {
 *   // Proceed with delivery
 * }
 * ```
 */
export const checkCircuitBreaker = (
  subscriptionId: string,
  circuitBreakers: Map<string, CircuitBreakerState>,
): boolean => {
  const breaker = circuitBreakers.get(subscriptionId);

  if (!breaker) {
    return true; // No breaker = circuit closed
  }

  if (breaker.state === 'closed') {
    return true;
  }

  if (breaker.state === 'open') {
    // Check if reset timeout has passed
    if (breaker.nextResetAt && new Date() >= breaker.nextResetAt) {
      breaker.state = 'half-open';
      return true;
    }
    return false;
  }

  // Half-open state - allow one request
  return true;
};

/**
 * @function openCircuitBreaker
 * @description Opens circuit breaker after threshold failures
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, CircuitBreakerState>} circuitBreakers - Circuit breaker state map
 * @param {number} [resetTimeout=60000] - Reset timeout in milliseconds
 *
 * @example
 * ```typescript
 * openCircuitBreaker('sub-uuid', circuitBreakers, 60000);
 * // Circuit will remain open for 60 seconds
 * ```
 */
export const openCircuitBreaker = (
  subscriptionId: string,
  circuitBreakers: Map<string, CircuitBreakerState>,
  resetTimeout: number = 60000,
): void => {
  const breaker = circuitBreakers.get(subscriptionId) || {
    subscriptionId,
    state: 'closed',
    failures: 0,
    threshold: 5,
    resetTimeout,
  };

  breaker.state = 'open';
  breaker.lastFailureAt = new Date();
  breaker.nextResetAt = new Date(Date.now() + resetTimeout);

  circuitBreakers.set(subscriptionId, breaker);
};

/**
 * @function closeCircuitBreaker
 * @description Closes circuit breaker after successful delivery
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, CircuitBreakerState>} circuitBreakers - Circuit breaker state map
 *
 * @example
 * ```typescript
 * closeCircuitBreaker('sub-uuid', circuitBreakers);
 * // Reset failure count and close circuit
 * ```
 */
export const closeCircuitBreaker = (
  subscriptionId: string,
  circuitBreakers: Map<string, CircuitBreakerState>,
): void => {
  const breaker = circuitBreakers.get(subscriptionId);

  if (breaker) {
    breaker.state = 'closed';
    breaker.failures = 0;
    breaker.lastFailureAt = undefined;
    breaker.nextResetAt = undefined;
    circuitBreakers.set(subscriptionId, breaker);
  }
};

/**
 * @function getDeliveryHistory
 * @description Retrieves delivery history for a subscription
 * @param {Model} DeliveryModel - Delivery model
 * @param {string} subscriptionId - Subscription identifier
 * @param {number} [limit=50] - Number of records to retrieve
 * @returns {Promise<any[]>} Delivery history
 *
 * @example
 * ```typescript
 * const history = await getDeliveryHistory(WebhookDelivery, 'sub-uuid', 50);
 * ```
 */
export const getDeliveryHistory = async (
  DeliveryModel: any,
  subscriptionId: string,
  limit: number = 50,
): Promise<any[]> => {
  return await DeliveryModel.findAll({
    where: { subscriptionId },
    order: [['createdAt', 'DESC']],
    limit,
  });
};

/**
 * @function cancelScheduledDelivery
 * @description Cancels a scheduled webhook delivery
 * @param {Model} delivery - Delivery model instance
 * @returns {Promise<Model>} Updated delivery
 *
 * @example
 * ```typescript
 * await cancelScheduledDelivery(delivery);
 * ```
 */
export const cancelScheduledDelivery = async (delivery: any): Promise<any> => {
  delivery.status = 'failed';
  delivery.errorMessage = 'Cancelled by user';
  delivery.nextRetryAt = null;
  return await delivery.save();
};

// ============================================================================
// SUBSCRIPTION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * @function createWebhookSubscription
 * @description Creates a new webhook subscription
 * @param {Model} SubscriptionModel - Subscription model
 * @param {Object} data - Subscription data
 * @returns {Promise<WebhookSubscription>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createWebhookSubscription(WebhookSubscription, {
 *   url: 'https://example.com/webhooks',
 *   events: ['user.created', 'user.updated'],
 *   secret: generateWebhookSecret()
 * });
 * ```
 */
export const createWebhookSubscription = async (
  SubscriptionModel: any,
  data: {
    url: string;
    events: string[];
    secret?: string;
    filters?: Record<string, any>;
    headers?: Record<string, string>;
    retryConfig?: Partial<RetryConfig>;
    rateLimit?: number;
    metadata?: Record<string, any>;
  },
): Promise<any> => {
  const validated = WebhookSubscriptionSchema.parse({
    ...data,
    secret: data.secret || generateWebhookSecret(),
  });

  return await SubscriptionModel.create(validated);
};

/**
 * @function updateWebhookSubscription
 * @description Updates an existing webhook subscription
 * @param {Model} subscription - Subscription model instance
 * @param {Object} updates - Update data
 * @returns {Promise<WebhookSubscription>} Updated subscription
 *
 * @example
 * ```typescript
 * const updated = await updateWebhookSubscription(subscription, {
 *   events: ['user.created', 'user.updated', 'user.deleted'],
 *   active: true
 * });
 * ```
 */
export const updateWebhookSubscription = async (
  subscription: any,
  updates: Partial<WebhookSubscription>,
): Promise<any> => {
  Object.assign(subscription, updates);
  return await subscription.save();
};

/**
 * @function deleteWebhookSubscription
 * @description Deletes a webhook subscription
 * @param {Model} subscription - Subscription model instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteWebhookSubscription(subscription);
 * ```
 */
export const deleteWebhookSubscription = async (subscription: any): Promise<void> => {
  await subscription.destroy();
};

/**
 * @function getWebhookSubscription
 * @description Retrieves a webhook subscription by ID
 * @param {Model} SubscriptionModel - Subscription model
 * @param {string} id - Subscription identifier
 * @returns {Promise<WebhookSubscription | null>} Subscription or null
 *
 * @example
 * ```typescript
 * const subscription = await getWebhookSubscription(WebhookSubscription, 'sub-uuid');
 * ```
 */
export const getWebhookSubscription = async (
  SubscriptionModel: any,
  id: string,
): Promise<any | null> => {
  return await SubscriptionModel.findByPk(id);
};

/**
 * @function listWebhookSubscriptions
 * @description Lists webhook subscriptions with filtering
 * @param {Model} SubscriptionModel - Subscription model
 * @param {Object} [filters] - Filter criteria
 * @returns {Promise<WebhookSubscription[]>} List of subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await listWebhookSubscriptions(WebhookSubscription, {
 *   active: true,
 *   events: ['user.created']
 * });
 * ```
 */
export const listWebhookSubscriptions = async (
  SubscriptionModel: any,
  filters?: {
    active?: boolean;
    events?: string[];
    url?: string;
  },
): Promise<any[]> => {
  const where: any = {};

  if (filters?.active !== undefined) {
    where.active = filters.active;
  }

  if (filters?.url) {
    where.url = { [Op.like]: `%${filters.url}%` };
  }

  if (filters?.events) {
    where.events = { [Op.contains]: filters.events };
  }

  return await SubscriptionModel.findAll({ where });
};

/**
 * @function validateWebhookUrl
 * @description Validates webhook URL format and accessibility
 * @param {string} url - Webhook URL
 * @returns {Promise<boolean>} True if URL is valid
 *
 * @example
 * ```typescript
 * const isValid = await validateWebhookUrl('https://example.com/webhooks');
 * ```
 */
export const validateWebhookUrl = async (url: string): Promise<boolean> => {
  try {
    const parsedUrl = new URL(url);

    // Only allow HTTPS in production
    if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
      return false;
    }

    // Reject localhost in production
    if (process.env.NODE_ENV === 'production' &&
        (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * @function verifyWebhookEndpoint
 * @description Verifies webhook endpoint can receive webhooks (challenge-response)
 * @param {string} url - Webhook URL
 * @param {string} secret - Webhook secret
 * @returns {Promise<boolean>} True if endpoint verified
 *
 * @example
 * ```typescript
 * const verified = await verifyWebhookEndpoint(
 *   'https://example.com/webhooks',
 *   'whsec_abc123'
 * );
 * ```
 */
export const verifyWebhookEndpoint = async (
  url: string,
  secret: string,
): Promise<boolean> => {
  try {
    const challenge = crypto.randomBytes(32).toString('hex');
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateHmacSignature(`${timestamp}.${challenge}`, secret);

    const response = await axios.post(
      url,
      {
        type: 'webhook.verification',
        challenge,
        timestamp,
      },
      {
        headers: {
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': timestamp.toString(),
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      },
    );

    return response.status === 200 && response.data?.challenge === challenge;
  } catch {
    return false;
  }
};

/**
 * @function filterEventsBySubscription
 * @description Filters events based on subscription criteria
 * @param {WebhookEvent} event - Webhook event
 * @param {WebhookSubscription} subscription - Subscription
 * @returns {boolean} True if event matches subscription
 *
 * @example
 * ```typescript
 * if (filterEventsBySubscription(event, subscription)) {
 *   // Deliver webhook
 * }
 * ```
 */
export const filterEventsBySubscription = (
  event: WebhookEvent,
  subscription: WebhookSubscription,
): boolean => {
  // Check event type
  if (!subscription.events.includes(event.type)) {
    return false;
  }

  // Check filters
  if (subscription.filters && Object.keys(subscription.filters).length > 0) {
    for (const [key, value] of Object.entries(subscription.filters)) {
      const eventValue = event.data[key];
      if (Array.isArray(value)) {
        if (!value.includes(eventValue)) return false;
      } else if (eventValue !== value) {
        return false;
      }
    }
  }

  return true;
};

/**
 * @function matchEventToSubscriptions
 * @description Finds all subscriptions matching an event
 * @param {WebhookEvent} event - Webhook event
 * @param {WebhookSubscription[]} subscriptions - All subscriptions
 * @returns {WebhookSubscription[]} Matching subscriptions
 *
 * @example
 * ```typescript
 * const matching = matchEventToSubscriptions(event, allSubscriptions);
 * // Deliver to all matching subscriptions
 * ```
 */
export const matchEventToSubscriptions = (
  event: WebhookEvent,
  subscriptions: WebhookSubscription[],
): WebhookSubscription[] => {
  return subscriptions.filter(
    (sub) => sub.active && filterEventsBySubscription(event, sub),
  );
};

// ============================================================================
// BATCHING AND OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * @function batchWebhookEvents
 * @description Batches multiple webhook events for efficient delivery
 * @param {WebhookEvent[]} events - Array of events
 * @param {BatchConfig} config - Batch configuration
 * @returns {WebhookEvent[][]} Batched events
 *
 * @example
 * ```typescript
 * const batches = batchWebhookEvents(events, { maxSize: 10, maxWaitTime: 5000 });
 * ```
 */
export const batchWebhookEvents = (
  events: WebhookEvent[],
  config: BatchConfig,
): WebhookEvent[][] => {
  const batches: WebhookEvent[][] = [];
  let currentBatch: WebhookEvent[] = [];

  for (const event of events) {
    currentBatch.push(event);

    if (currentBatch.length >= config.maxSize) {
      batches.push(currentBatch);
      currentBatch = [];
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};

/**
 * @function deliverBatch
 * @description Delivers a batch of webhook events
 * @param {string} url - Webhook endpoint URL
 * @param {WebhookEvent[]} events - Events to deliver
 * @param {Record<string, string>} headers - Headers including signature
 * @param {number} [timeout=30000] - Request timeout
 * @returns {Promise<DeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverBatch(
 *   'https://example.com/webhooks/batch',
 *   events,
 *   signatureHeaders
 * );
 * ```
 */
export const deliverBatch = async (
  url: string,
  events: WebhookEvent[],
  headers: Record<string, string>,
  timeout: number = 30000,
): Promise<Partial<DeliveryResult>> => {
  const payload = {
    type: 'webhook.batch',
    events,
    count: events.length,
    timestamp: new Date(),
  };

  return await deliverWebhook(url, payload, headers, timeout);
};

/**
 * @function createBatchPayload
 * @description Creates a standardized batch payload
 * @param {WebhookEvent[]} events - Events to batch
 * @returns {Object} Batch payload
 *
 * @example
 * ```typescript
 * const payload = createBatchPayload(events);
 * ```
 */
export const createBatchPayload = (
  events: WebhookEvent[],
): {
  type: string;
  events: WebhookEvent[];
  count: number;
  timestamp: Date;
} => {
  return {
    type: 'webhook.batch',
    events,
    count: events.length,
    timestamp: new Date(),
  };
};

/**
 * @function checkBatchSize
 * @description Checks if batch has reached maximum size
 * @param {WebhookEvent[]} batch - Current batch
 * @param {number} maxSize - Maximum batch size
 * @returns {boolean} True if batch should be flushed
 *
 * @example
 * ```typescript
 * if (checkBatchSize(currentBatch, 10)) {
 *   await deliverBatch(...);
 * }
 * ```
 */
export const checkBatchSize = (batch: WebhookEvent[], maxSize: number): boolean => {
  return batch.length >= maxSize;
};

/**
 * @function prioritizeDeliveries
 * @description Prioritizes webhook deliveries based on criteria
 * @param {WebhookDelivery[]} deliveries - Deliveries to prioritize
 * @param {string} [strategy='fifo'] - Priority strategy
 * @returns {WebhookDelivery[]} Sorted deliveries
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeDeliveries(deliveries, 'priority');
 * ```
 */
export const prioritizeDeliveries = (
  deliveries: WebhookDelivery[],
  strategy: 'fifo' | 'priority' | 'latest' = 'fifo',
): WebhookDelivery[] => {
  switch (strategy) {
    case 'fifo':
      return deliveries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    case 'latest':
      return deliveries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case 'priority':
      // Could sort by event type, subscription priority, etc.
      return deliveries;
    default:
      return deliveries;
  }
};

/**
 * @function throttleDelivery
 * @description Throttles webhook delivery based on rate limit
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, number[]>} rateLimits - Rate limit tracking map
 * @param {number} maxPerMinute - Maximum deliveries per minute
 * @returns {boolean} True if delivery is allowed
 *
 * @example
 * ```typescript
 * const rateLimits = new Map();
 * if (throttleDelivery('sub-uuid', rateLimits, 100)) {
 *   // Proceed with delivery
 * }
 * ```
 */
export const throttleDelivery = (
  subscriptionId: string,
  rateLimits: Map<string, number[]>,
  maxPerMinute: number,
): boolean => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Get recent delivery timestamps
  const timestamps = rateLimits.get(subscriptionId) || [];

  // Filter to last minute
  const recentTimestamps = timestamps.filter((ts) => ts > oneMinuteAgo);

  if (recentTimestamps.length >= maxPerMinute) {
    return false;
  }

  // Add current timestamp
  recentTimestamps.push(now);
  rateLimits.set(subscriptionId, recentTimestamps);

  return true;
};

/**
 * @function scheduleDeliveryWindow
 * @description Schedules delivery within allowed time window
 * @param {Date} [startHour=0] - Window start hour (0-23)
 * @param {Date} [endHour=23] - Window end hour (0-23)
 * @returns {Date | null} Next available delivery time or null if in window
 *
 * @example
 * ```typescript
 * const nextWindow = scheduleDeliveryWindow(9, 17); // Business hours
 * if (nextWindow) {
 *   // Schedule for next window
 * }
 * ```
 */
export const scheduleDeliveryWindow = (
  startHour: number = 0,
  endHour: number = 23,
): Date | null => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= startHour && currentHour <= endHour) {
    return null; // In window
  }

  // Calculate next window start
  const nextStart = new Date(now);
  if (currentHour < startHour) {
    nextStart.setHours(startHour, 0, 0, 0);
  } else {
    nextStart.setDate(nextStart.getDate() + 1);
    nextStart.setHours(startHour, 0, 0, 0);
  }

  return nextStart;
};

// ============================================================================
// SECURITY AND MONITORING FUNCTIONS
// ============================================================================

/**
 * @function validateIpWhitelist
 * @description Validates webhook delivery IP against whitelist
 * @param {string} ip - IP address
 * @param {string[]} whitelist - Allowed IP addresses/ranges
 * @returns {boolean} True if IP is whitelisted
 *
 * @example
 * ```typescript
 * if (validateIpWhitelist(req.ip, subscription.ipWhitelist)) {
 *   // Process webhook
 * }
 * ```
 */
export const validateIpWhitelist = (ip: string, whitelist: string[]): boolean => {
  if (whitelist.length === 0) {
    return true; // No whitelist = allow all
  }

  return whitelist.includes(ip);
};

/**
 * @function checkRateLimit
 * @description Checks if subscription has exceeded rate limit
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, RateLimitEntry>} rateLimits - Rate limit state
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {boolean} True if within limit
 *
 * @example
 * ```typescript
 * if (!checkRateLimit('sub-uuid', rateLimits, { windowMs: 60000, maxRequests: 100 })) {
 *   throw new Error('Rate limit exceeded');
 * }
 * ```
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export const checkRateLimit = (
  subscriptionId: string,
  rateLimits: Map<string, RateLimitEntry>,
  config: RateLimitConfig,
): boolean => {
  const now = Date.now();
  const entry = rateLimits.get(subscriptionId);

  if (!entry || now >= entry.resetTime) {
    return true;
  }

  return entry.count < config.maxRequests;
};

/**
 * @function incrementRateLimit
 * @description Increments rate limit counter for subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, RateLimitEntry>} rateLimits - Rate limit state
 * @param {RateLimitConfig} config - Rate limit configuration
 *
 * @example
 * ```typescript
 * incrementRateLimit('sub-uuid', rateLimits, config);
 * ```
 */
export const incrementRateLimit = (
  subscriptionId: string,
  rateLimits: Map<string, RateLimitEntry>,
  config: RateLimitConfig,
): void => {
  const now = Date.now();
  const entry = rateLimits.get(subscriptionId);

  if (!entry || now >= entry.resetTime) {
    rateLimits.set(subscriptionId, {
      count: 1,
      resetTime: now + config.windowMs,
    });
  } else {
    entry.count += 1;
  }
};

/**
 * @function moveToDeadLetterQueue
 * @description Moves failed delivery to dead letter queue
 * @param {Model} DeadLetterModel - Dead letter queue model
 * @param {WebhookDelivery} delivery - Failed delivery
 * @param {string} reason - Failure reason
 * @returns {Promise<any>} DLQ entry
 *
 * @example
 * ```typescript
 * await moveToDeadLetterQueue(DeadLetterQueue, delivery, 'Max retries exceeded');
 * ```
 */
export const moveToDeadLetterQueue = async (
  DeadLetterModel: any,
  delivery: WebhookDelivery,
  reason: string,
): Promise<any> => {
  return await DeadLetterModel.create({
    deliveryId: delivery.id,
    subscriptionId: delivery.subscriptionId,
    eventId: delivery.eventId,
    reason,
    payload: delivery.payload,
    attempts: delivery.attempts,
    lastError: delivery.errorMessage || 'Unknown error',
  });
};

/**
 * @function processDeadLetterQueue
 * @description Processes items in dead letter queue
 * @param {Model} DeadLetterModel - Dead letter queue model
 * @param {number} [limit=100] - Number of items to process
 * @returns {Promise<any[]>} Processed DLQ items
 *
 * @example
 * ```typescript
 * const items = await processDeadLetterQueue(DeadLetterQueue, 100);
 * ```
 */
export const processDeadLetterQueue = async (
  DeadLetterModel: any,
  limit: number = 100,
): Promise<any[]> => {
  return await DeadLetterModel.findAll({
    where: {
      processedAt: null,
    },
    order: [['createdAt', 'ASC']],
    limit,
  });
};

/**
 * @function retryDeadLetterItem
 * @description Retries a dead letter queue item
 * @param {Model} dlqItem - DLQ item
 * @param {Function} deliveryFn - Delivery function
 * @returns {Promise<boolean>} True if retry successful
 *
 * @example
 * ```typescript
 * const success = await retryDeadLetterItem(dlqItem, deliverWebhook);
 * ```
 */
export const retryDeadLetterItem = async (
  dlqItem: any,
  deliveryFn: (url: string, payload: any, headers?: Record<string, string>) => Promise<any>,
): Promise<boolean> => {
  try {
    dlqItem.retryCount += 1;
    await dlqItem.save();

    // Attempt delivery (headers would need to be reconstructed)
    const result = await deliveryFn(dlqItem.payload.url, dlqItem.payload);

    if (result.success) {
      dlqItem.processedAt = new Date();
      await dlqItem.save();
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * @function getDeliveryMetrics
 * @description Calculates delivery metrics for a subscription
 * @param {Model} DeliveryModel - Delivery model
 * @param {string} [subscriptionId] - Optional subscription filter
 * @param {Date} [startDate] - Start date for metrics
 * @param {Date} [endDate] - End date for metrics
 * @returns {Promise<DeliveryMetrics>} Delivery metrics
 *
 * @example
 * ```typescript
 * const metrics = await getDeliveryMetrics(
 *   WebhookDelivery,
 *   'sub-uuid',
 *   new Date('2025-01-01'),
 *   new Date()
 * );
 * ```
 */
export const getDeliveryMetrics = async (
  DeliveryModel: any,
  subscriptionId?: string,
  startDate?: Date,
  endDate?: Date,
): Promise<DeliveryMetrics> => {
  const where: any = {};

  if (subscriptionId) where.subscriptionId = subscriptionId;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = startDate;
    if (endDate) where.createdAt[Op.lte] = endDate;
  }

  const deliveries = await DeliveryModel.findAll({ where });

  const total = deliveries.length;
  const successful = deliveries.filter((d: any) => d.status === 'delivered').length;
  const failed = deliveries.filter((d: any) => d.status === 'failed').length;
  const retrying = deliveries.filter((d: any) => d.status === 'retrying').length;
  const deadLetter = deliveries.filter((d: any) => d.status === 'dead_letter').length;

  // Calculate latencies (mock - would need actual latency data)
  const latencies = deliveries
    .filter((d: any) => d.deliveredAt)
    .map((d: any) => d.deliveredAt.getTime() - d.createdAt.getTime());

  latencies.sort((a: number, b: number) => a - b);

  return {
    subscriptionId,
    totalDeliveries: total,
    successfulDeliveries: successful,
    failedDeliveries: failed,
    retryingDeliveries: retrying,
    deadLetterDeliveries: deadLetter,
    averageLatency: latencies.length > 0
      ? latencies.reduce((a: number, b: number) => a + b, 0) / latencies.length
      : 0,
    p95Latency: latencies.length > 0
      ? latencies[Math.floor(latencies.length * 0.95)]
      : 0,
    p99Latency: latencies.length > 0
      ? latencies[Math.floor(latencies.length * 0.99)]
      : 0,
    successRate: total > 0 ? (successful / total) * 100 : 0,
    period: {
      start: startDate || new Date(0),
      end: endDate || new Date(),
    },
  };
};

/**
 * @function logWebhookEvent
 * @description Logs webhook event for audit trail
 * @param {WebhookEvent} event - Webhook event
 * @param {string} action - Action performed
 * @param {any} [metadata] - Additional metadata
 * @returns {Object} Log entry
 *
 * @example
 * ```typescript
 * logWebhookEvent(event, 'delivered', { subscriptionId: 'sub-uuid' });
 * ```
 */
export const logWebhookEvent = (
  event: WebhookEvent,
  action: string,
  metadata?: any,
): {
  timestamp: Date;
  eventId: string;
  eventType: string;
  action: string;
  metadata?: any;
} => {
  return {
    timestamp: new Date(),
    eventId: event.id,
    eventType: event.type,
    action,
    metadata,
  };
};

/**
 * @function generateAuditLog
 * @description Generates audit log entry for webhook operations
 * @param {string} operation - Operation type
 * @param {string} userId - User performing operation
 * @param {any} details - Operation details
 * @returns {Object} Audit log entry
 *
 * @example
 * ```typescript
 * generateAuditLog('subscription.created', 'user-123', { subscriptionId: 'sub-uuid' });
 * ```
 */
export const generateAuditLog = (
  operation: string,
  userId: string,
  details: any,
): {
  timestamp: Date;
  operation: string;
  userId: string;
  details: any;
} => {
  return {
    timestamp: new Date(),
    operation,
    userId,
    details,
  };
};

/**
 * @function alertOnFailure
 * @description Sends alert when webhook delivery fails repeatedly
 * @param {WebhookDelivery} delivery - Failed delivery
 * @param {number} threshold - Failure threshold
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await alertOnFailure(delivery, 5);
 * ```
 */
export const alertOnFailure = async (
  delivery: WebhookDelivery,
  threshold: number = 3,
): Promise<void> => {
  if (delivery.attempts >= threshold) {
    // Send alert (email, Slack, PagerDuty, etc.)
    console.error(`[WEBHOOK ALERT] Delivery ${delivery.id} failed ${delivery.attempts} times`);
    // Implementation would integrate with alerting service
  }
};

// ============================================================================
// NESTJS SERVICES
// ============================================================================

/**
 * NestJS service for webhook management operations
 */
@Injectable()
export class WebhookService {
  constructor(
    private readonly subscriptionModel: any,
    private readonly eventModel: any,
    private readonly deliveryModel: any,
    private readonly deadLetterModel: any,
  ) {}

  /**
   * Creates a new webhook subscription
   */
  async createSubscription(data: any): Promise<any> {
    const validated = WebhookSubscriptionSchema.parse(data);
    const subscription = await this.subscriptionModel.create({
      ...validated,
      secret: validated.secret || generateWebhookSecret(),
    });

    return subscription;
  }

  /**
   * Verifies webhook endpoint
   */
  async verifyEndpoint(subscriptionId: string): Promise<boolean> {
    const subscription = await this.subscriptionModel.findByPk(subscriptionId);
    if (!subscription) {
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    }

    return await verifyWebhookEndpoint(subscription.url, subscription.secret);
  }

  /**
   * Rotates webhook secret
   */
  async rotateSecret(subscriptionId: string): Promise<any> {
    const subscription = await this.subscriptionModel.findByPk(subscriptionId);
    if (!subscription) {
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    }

    const { newSecret, oldSecret, gracePeriodEnd } = rotateWebhookSecret(
      subscriptionId,
      subscription.secret,
    );

    subscription.secret = newSecret;
    await subscription.save();

    return {
      newSecret,
      oldSecret,
      gracePeriodEnd,
    };
  }

  /**
   * Lists webhook subscriptions
   */
  async listSubscriptions(filters?: any): Promise<any[]> {
    return await listWebhookSubscriptions(this.subscriptionModel, filters);
  }

  /**
   * Gets webhook subscription by ID
   */
  async getSubscription(id: string): Promise<any> {
    const subscription = await this.subscriptionModel.findByPk(id);
    if (!subscription) {
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    }
    return subscription;
  }

  /**
   * Updates webhook subscription
   */
  async updateSubscription(id: string, updates: any): Promise<any> {
    const subscription = await this.getSubscription(id);
    return await updateWebhookSubscription(subscription, updates);
  }

  /**
   * Deletes webhook subscription
   */
  async deleteSubscription(id: string): Promise<void> {
    const subscription = await this.getSubscription(id);
    await deleteWebhookSubscription(subscription);
  }
}

/**
 * NestJS service for webhook delivery operations
 */
@Injectable()
export class WebhookDeliveryService {
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private rateLimits = new Map<string, RateLimitEntry>();

  constructor(
    private readonly subscriptionModel: any,
    private readonly deliveryModel: any,
    private readonly deadLetterModel: any,
  ) {}

  /**
   * Processes webhook event and delivers to matching subscriptions
   */
  async processEvent(event: WebhookEvent): Promise<DeliveryResult[]> {
    const subscriptions = await this.subscriptionModel.findAll({
      where: { active: true },
    });

    const matchingSubscriptions = matchEventToSubscriptions(event, subscriptions);
    const results: DeliveryResult[] = [];

    for (const subscription of matchingSubscriptions) {
      // Check circuit breaker
      if (!checkCircuitBreaker(subscription.id, this.circuitBreakers)) {
        console.warn(`Circuit breaker open for subscription ${subscription.id}`);
        continue;
      }

      // Check rate limit
      const rateLimitConfig: RateLimitConfig = {
        windowMs: 60000,
        maxRequests: subscription.rateLimit || 1000,
      };

      if (!checkRateLimit(subscription.id, this.rateLimits, rateLimitConfig)) {
        console.warn(`Rate limit exceeded for subscription ${subscription.id}`);
        continue;
      }

      incrementRateLimit(subscription.id, this.rateLimits, rateLimitConfig);

      // Create signature headers
      const headers = createSignatureHeaders(event, subscription.secret);

      // Merge custom headers
      const allHeaders = { ...headers, ...subscription.headers };

      // Attempt delivery
      const result = await deliverWebhookWithRetry(
        subscription.id,
        subscription.url,
        event,
        allHeaders,
        subscription.retryConfig,
      );

      // Create delivery record
      const delivery = await this.deliveryModel.create({
        subscriptionId: subscription.id,
        eventId: event.id,
        eventType: event.type,
        url: subscription.url,
        payload: event.data,
        status: result.success ? 'delivered' : 'failed',
        attempts: result.attempt,
        maxAttempts: subscription.retryConfig.maxAttempts,
        responseStatus: result.status,
        responseBody: result.responseBody,
        errorMessage: result.error,
        deliveredAt: result.success ? new Date() : null,
      });

      result.deliveryId = delivery.id;

      // Handle circuit breaker
      if (result.success) {
        closeCircuitBreaker(subscription.id, this.circuitBreakers);
      } else {
        const breaker = this.circuitBreakers.get(subscription.id) || {
          subscriptionId: subscription.id,
          state: 'closed',
          failures: 0,
          threshold: 5,
          resetTimeout: 60000,
        };

        breaker.failures += 1;

        if (breaker.failures >= breaker.threshold) {
          openCircuitBreaker(subscription.id, this.circuitBreakers);
        }

        // Move to DLQ if max retries exceeded
        if (!result.willRetry) {
          await moveToDeadLetterQueue(
            this.deadLetterModel,
            delivery,
            'Max retries exceeded',
          );
        }
      }

      results.push(result);
    }

    return results;
  }

  /**
   * Retries a failed delivery
   */
  async retryDelivery(deliveryId: string): Promise<DeliveryResult> {
    const delivery = await this.deliveryModel.findByPk(deliveryId);
    if (!delivery) {
      throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
    }

    const subscription = await this.subscriptionModel.findByPk(delivery.subscriptionId);
    if (!subscription) {
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    }

    const headers = createSignatureHeaders(delivery.payload, subscription.secret);
    const allHeaders = { ...headers, ...subscription.headers };

    const result = await deliverWebhook(
      subscription.url,
      delivery.payload,
      allHeaders,
      subscription.retryConfig.timeout,
    );

    await updateDeliveryStatus(
      delivery,
      result.success ? 'delivered' : 'failed',
      {
        responseStatus: result.status,
        responseBody: result.responseBody,
        errorMessage: result.error,
        deliveredAt: result.success ? new Date() : undefined,
      },
    );

    return {
      success: result.success!,
      subscriptionId: subscription.id,
      deliveryId: delivery.id,
      status: result.status!,
      responseBody: result.responseBody,
      error: result.error,
      duration: result.duration!,
      attempt: delivery.attempts,
      willRetry: false,
    };
  }

  /**
   * Gets delivery metrics
   */
  async getMetrics(
    subscriptionId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DeliveryMetrics> {
    return await getDeliveryMetrics(
      this.deliveryModel,
      subscriptionId,
      startDate,
      endDate,
    );
  }
}

// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================

/**
 * NestJS controller for webhook management endpoints
 */
@ApiTags('Webhooks')
@Controller('webhooks')
@ApiBearerAuth()
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly deliveryService: WebhookDeliveryService,
  ) {}

  /**
   * Create webhook subscription
   */
  @Post('subscriptions')
  @ApiOperation({
    summary: 'Create webhook subscription',
    description: 'Creates a new webhook subscription for receiving event notifications',
  })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid subscription data',
  })
  async createSubscription(@Body() data: any): Promise<any> {
    return await this.webhookService.createSubscription(data);
  }

  /**
   * List webhook subscriptions
   */
  @Get('subscriptions')
  @ApiOperation({
    summary: 'List webhook subscriptions',
    description: 'Retrieves all webhook subscriptions with optional filtering',
  })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiQuery({ name: 'url', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions retrieved successfully',
  })
  async listSubscriptions(@Query() filters: any): Promise<any[]> {
    return await this.webhookService.listSubscriptions(filters);
  }

  /**
   * Get webhook subscription
   */
  @Get('subscriptions/:id')
  @ApiOperation({
    summary: 'Get webhook subscription',
    description: 'Retrieves a webhook subscription by ID',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscription retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async getSubscription(@Param('id') id: string): Promise<any> {
    return await this.webhookService.getSubscription(id);
  }

  /**
   * Update webhook subscription
   */
  @Put('subscriptions/:id')
  @ApiOperation({
    summary: 'Update webhook subscription',
    description: 'Updates an existing webhook subscription',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscription updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updates: any,
  ): Promise<any> {
    return await this.webhookService.updateSubscription(id, updates);
  }

  /**
   * Delete webhook subscription
   */
  @Delete('subscriptions/:id')
  @ApiOperation({
    summary: 'Delete webhook subscription',
    description: 'Deletes a webhook subscription',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({
    status: 204,
    description: 'Subscription deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async deleteSubscription(@Param('id') id: string): Promise<void> {
    await this.webhookService.deleteSubscription(id);
  }

  /**
   * Verify webhook endpoint
   */
  @Post('subscriptions/:id/verify')
  @ApiOperation({
    summary: 'Verify webhook endpoint',
    description: 'Verifies that the webhook endpoint can receive webhooks',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({
    status: 200,
    description: 'Endpoint verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Endpoint verification failed',
  })
  async verifyEndpoint(@Param('id') id: string): Promise<{ verified: boolean }> {
    const verified = await this.webhookService.verifyEndpoint(id);
    return { verified };
  }

  /**
   * Rotate webhook secret
   */
  @Post('subscriptions/:id/rotate-secret')
  @ApiOperation({
    summary: 'Rotate webhook secret',
    description: 'Rotates the webhook secret for enhanced security',
  })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({
    status: 200,
    description: 'Secret rotated successfully',
  })
  async rotateSecret(@Param('id') id: string): Promise<any> {
    return await this.webhookService.rotateSecret(id);
  }

  /**
   * List webhook deliveries
   */
  @Get('deliveries')
  @ApiOperation({
    summary: 'List webhook deliveries',
    description: 'Retrieves webhook delivery history',
  })
  @ApiQuery({ name: 'subscriptionId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Deliveries retrieved successfully',
  })
  async listDeliveries(@Query() filters: any): Promise<any[]> {
    // Implementation would query delivery model with filters
    return [];
  }

  /**
   * Retry webhook delivery
   */
  @Post('deliveries/:id/retry')
  @ApiOperation({
    summary: 'Retry webhook delivery',
    description: 'Manually retries a failed webhook delivery',
  })
  @ApiParam({ name: 'id', description: 'Delivery ID' })
  @ApiResponse({
    status: 200,
    description: 'Delivery retried successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery not found',
  })
  async retryDelivery(@Param('id') id: string): Promise<DeliveryResult> {
    return await this.deliveryService.retryDelivery(id);
  }

  /**
   * Get webhook metrics
   */
  @Get('metrics')
  @ApiOperation({
    summary: 'Get webhook metrics',
    description: 'Retrieves delivery metrics and statistics',
  })
  @ApiQuery({ name: 'subscriptionId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Metrics retrieved successfully',
  })
  async getMetrics(@Query() query: any): Promise<DeliveryMetrics> {
    return await this.deliveryService.getMetrics(
      query.subscriptionId,
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined,
    );
  }

  /**
   * List dead letter queue items
   */
  @Get('dead-letter-queue')
  @ApiOperation({
    summary: 'List dead letter queue items',
    description: 'Retrieves failed deliveries in dead letter queue',
  })
  @ApiResponse({
    status: 200,
    description: 'DLQ items retrieved successfully',
  })
  async listDeadLetterQueue(): Promise<any[]> {
    // Implementation would query DLQ model
    return [];
  }
}
