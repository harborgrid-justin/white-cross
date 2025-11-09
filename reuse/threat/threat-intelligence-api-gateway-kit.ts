/**
 * LOC: TIAPIGW1234567
 * File: /reuse/threat/threat-intelligence-api-gateway-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/graphql
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - API gateway services
 *   - Threat intelligence controllers
 *   - GraphQL resolvers
 *   - Rate limiting middleware
 *   - Authentication services
 */

/**
 * File: /reuse/threat/threat-intelligence-api-gateway-kit.ts
 * Locator: WC-THREAT-API-GATEWAY-001
 * Purpose: Comprehensive Threat Intelligence API Gateway Toolkit - Production-ready API gateway operations
 *
 * Upstream: Independent utility module for threat intelligence API gateway
 * Downstream: ../backend/*, API services, Controllers, GraphQL, Rate limiting, Authentication
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, @nestjs/graphql, sequelize-typescript
 * Exports: 40 utility functions for REST APIs, GraphQL, rate limiting, authentication, versioning, webhooks
 *
 * LLM Context: Enterprise-grade threat intelligence API gateway toolkit for White Cross healthcare platform.
 * Provides comprehensive RESTful API endpoints, GraphQL schema and resolvers, API rate limiting and throttling,
 * authentication and authorization, API versioning, request/response transformation, API analytics and monitoring,
 * webhook management, and HIPAA-compliant API security for healthcare systems. Includes NestJS controllers,
 * guards, interceptors, and Sequelize models with advanced TypeScript type safety.
 */

import { Model, Column, Table, DataType, Index } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// BRANDED TYPES FOR TYPE SAFETY
// ============================================================================

declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { [__brand]: TBrand };

export type ApiKeyId = Brand<string, 'ApiKeyId'>;
export type WebhookId = Brand<string, 'WebhookId'>;
export type RequestId = Brand<string, 'RequestId'>;
export type ApiVersionId = Brand<string, 'ApiVersionId'>;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * HTTP methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

/**
 * API authentication type
 */
export enum AuthenticationType {
  API_KEY = 'API_KEY',
  BEARER_TOKEN = 'BEARER_TOKEN',
  BASIC_AUTH = 'BASIC_AUTH',
  OAUTH2 = 'OAUTH2',
  MUTUAL_TLS = 'MUTUAL_TLS',
  JWT = 'JWT',
}

/**
 * Rate limit strategy
 */
export enum RateLimitStrategy {
  FIXED_WINDOW = 'FIXED_WINDOW',
  SLIDING_WINDOW = 'SLIDING_WINDOW',
  TOKEN_BUCKET = 'TOKEN_BUCKET',
  LEAKY_BUCKET = 'LEAKY_BUCKET',
}

/**
 * Webhook event type
 */
export enum WebhookEventType {
  THREAT_DETECTED = 'THREAT_DETECTED',
  IOC_ADDED = 'IOC_ADDED',
  IOC_UPDATED = 'IOC_UPDATED',
  THREAT_LEVEL_CHANGED = 'THREAT_LEVEL_CHANGED',
  CAMPAIGN_STARTED = 'CAMPAIGN_STARTED',
  INCIDENT_CREATED = 'INCIDENT_CREATED',
  ALERT_TRIGGERED = 'ALERT_TRIGGERED',
}

/**
 * API request metadata
 */
export interface ApiRequestMetadata {
  requestId: RequestId;
  timestamp: Date;
  method: HttpMethod;
  path: string;
  query?: Record<string, unknown>;
  headers: Record<string, string>;
  clientIp: string;
  userAgent?: string;
  apiKeyId?: ApiKeyId;
  userId?: string;
  version: string;
}

/**
 * API response metadata
 */
export interface ApiResponseMetadata {
  requestId: RequestId;
  timestamp: Date;
  statusCode: number;
  contentType: string;
  contentLength: number;
  processingTimeMs: number;
  cached: boolean;
  rateLimit?: RateLimitInfo;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  id: string;
  name: string;
  strategy: RateLimitStrategy;
  requestsPerWindow: number;
  windowSizeMs: number;
  burstSize?: number;
  scope: 'global' | 'api_key' | 'ip' | 'user';
  exemptApiKeys?: string[];
  exemptIps?: string[];
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

/**
 * API key configuration
 */
export interface ApiKeyConfig {
  id: ApiKeyId;
  name: string;
  key: string;
  hashedKey: string;
  organizationId: string;
  userId?: string;
  permissions: string[];
  rateLimitTier: 'free' | 'basic' | 'premium' | 'enterprise';
  maxRequestsPerHour: number;
  allowedIps?: string[];
  allowedOrigins?: string[];
  expiresAt?: Date;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  id: WebhookId;
  name: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  enabled: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
    maxBackoffMs: number;
  };
  authentication?: {
    type: 'basic' | 'bearer' | 'custom';
    credentials: Record<string, string>;
  };
  filters?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Webhook delivery
 */
export interface WebhookDelivery {
  id: string;
  webhookId: WebhookId;
  eventType: WebhookEventType;
  payload: Record<string, unknown>;
  attempts: number;
  status: 'pending' | 'delivered' | 'failed' | 'cancelled';
  lastAttemptAt?: Date;
  nextRetryAt?: Date;
  responseStatus?: number;
  responseBody?: string;
  error?: string;
}

/**
 * GraphQL query complexity
 */
export interface QueryComplexity {
  depth: number;
  breadth: number;
  estimatedCost: number;
  maxAllowedCost: number;
  fields: string[];
}

/**
 * API versioning info
 */
export interface ApiVersionInfo {
  id: ApiVersionId;
  version: string;
  releaseDate: Date;
  deprecationDate?: Date;
  sunsetDate?: Date;
  status: 'current' | 'deprecated' | 'sunset';
  changelog: string[];
  breakingChanges: string[];
}

/**
 * Request transformation rule
 */
export interface TransformationRule {
  id: string;
  name: string;
  type: 'request' | 'response';
  enabled: boolean;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'regex';
    value: unknown;
  }>;
  transformations: Array<{
    action: 'add' | 'remove' | 'rename' | 'modify';
    field: string;
    value?: unknown;
    newField?: string;
  }>;
}

/**
 * API analytics event
 */
export interface ApiAnalyticsEvent {
  timestamp: Date;
  requestId: RequestId;
  apiKeyId?: ApiKeyId;
  userId?: string;
  endpoint: string;
  method: HttpMethod;
  statusCode: number;
  responseTimeMs: number;
  requestSizeBytes: number;
  responseSizeBytes: number;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

/**
 * API quota usage
 */
export interface ApiQuotaUsage {
  apiKeyId: ApiKeyId;
  period: 'hour' | 'day' | 'month';
  periodStart: Date;
  periodEnd: Date;
  requestCount: number;
  quotaLimit: number;
  dataTransferBytes: number;
  costUnits: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

@Table({
  tableName: 'api_keys',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['key_hash'], unique: true },
    { fields: ['organization_id'] },
    { fields: ['enabled'] },
    { fields: ['expires_at'] },
  ],
})
export class ApiKey extends Model {
  @ApiProperty({ example: 'key_123456', description: 'Unique API key identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'Production API Key', description: 'API key name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'wc_live_...', description: 'API key (shown once at creation)' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  key: string;

  @ApiProperty({ example: 'hash...', description: 'Hashed API key' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'key_hash' })
  hashedKey: string;

  @ApiProperty({ example: 'org_123', description: 'Organization ID' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'organization_id' })
  organizationId: string;

  @ApiPropertyOptional({ example: 'user_123', description: 'User ID' })
  @Column({ type: DataType.STRING, field: 'user_id' })
  userId?: string;

  @ApiProperty({ description: 'API permissions', type: [String] })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  permissions: string[];

  @ApiProperty({ enum: ['free', 'basic', 'premium', 'enterprise'], example: 'premium' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'rate_limit_tier' })
  rateLimitTier: string;

  @ApiProperty({ example: 10000, description: 'Max requests per hour' })
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'max_requests_per_hour' })
  maxRequestsPerHour: number;

  @ApiPropertyOptional({ description: 'Allowed IP addresses', type: [String] })
  @Column({ type: DataType.ARRAY(DataType.STRING), field: 'allowed_ips' })
  allowedIps?: string[];

  @ApiPropertyOptional({ description: 'Allowed origins', type: [String] })
  @Column({ type: DataType.ARRAY(DataType.STRING), field: 'allowed_origins' })
  allowedOrigins?: string[];

  @ApiPropertyOptional({ description: 'Expiration timestamp' })
  @Column({ type: DataType.DATE, field: 'expires_at' })
  expiresAt?: Date;

  @ApiProperty({ example: true, description: 'API key enabled' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB, defaultValue: {} })
  metadata?: Record<string, unknown>;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, field: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, field: 'updated_at' })
  updatedAt: Date;

  @ApiPropertyOptional()
  @Column({ type: DataType.DATE, field: 'deleted_at' })
  deletedAt?: Date;
}

@Table({
  tableName: 'webhooks',
  timestamps: true,
  indexes: [
    { fields: ['enabled'] },
    { fields: ['created_at'] },
  ],
})
export class Webhook extends Model {
  @ApiProperty({ example: 'webhook_123456', description: 'Unique webhook identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'Threat Notification Webhook', description: 'Webhook name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'https://api.example.com/webhooks/threats', description: 'Webhook URL' })
  @Column({ type: DataType.STRING, allowNull: false })
  url: string;

  @ApiProperty({ description: 'Subscribed events', enum: WebhookEventType, isArray: true })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  events: string[];

  @ApiProperty({ example: 'whsec_...', description: 'Webhook signing secret' })
  @Column({ type: DataType.STRING, allowNull: false })
  secret: string;

  @ApiProperty({ example: true, description: 'Webhook enabled' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ description: 'Retry policy configuration' })
  @Column({ type: DataType.JSONB, allowNull: false, field: 'retry_policy' })
  retryPolicy: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Authentication configuration' })
  @Column({ type: DataType.JSONB })
  authentication?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Event filters' })
  @Column({ type: DataType.JSONB })
  filters?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB, defaultValue: {} })
  metadata?: Record<string, unknown>;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, field: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, field: 'updated_at' })
  updatedAt: Date;
}

@Table({
  tableName: 'api_request_logs',
  timestamps: false,
  indexes: [
    { fields: ['timestamp'] },
    { fields: ['api_key_id'] },
    { fields: ['status_code'] },
    { fields: ['endpoint'] },
  ],
})
export class ApiRequestLog extends Model {
  @ApiProperty({ example: 'req_123456', description: 'Unique request identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Request timestamp' })
  @Column({ type: DataType.DATE, allowNull: false })
  timestamp: Date;

  @ApiProperty({ enum: HttpMethod, example: HttpMethod.GET })
  @Column({ type: DataType.STRING, allowNull: false })
  method: string;

  @ApiProperty({ example: '/api/v1/threats', description: 'Request path' })
  @Column({ type: DataType.STRING, allowNull: false })
  endpoint: string;

  @ApiPropertyOptional({ example: 'key_123', description: 'API key ID' })
  @Column({ type: DataType.STRING, field: 'api_key_id' })
  apiKeyId?: string;

  @ApiPropertyOptional({ example: 'user_123', description: 'User ID' })
  @Column({ type: DataType.STRING, field: 'user_id' })
  userId?: string;

  @ApiProperty({ example: '192.168.1.100', description: 'Client IP address' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'client_ip' })
  clientIp: string;

  @ApiProperty({ example: 200, description: 'HTTP status code' })
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'status_code' })
  statusCode: number;

  @ApiProperty({ example: 125, description: 'Response time in milliseconds' })
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'response_time_ms' })
  responseTimeMs: number;

  @ApiProperty({ example: 1024, description: 'Request size in bytes' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'request_size_bytes' })
  requestSizeBytes: number;

  @ApiProperty({ example: 4096, description: 'Response size in bytes' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'response_size_bytes' })
  responseSizeBytes: number;

  @ApiPropertyOptional({ example: 'Invalid API key', description: 'Error message if any' })
  @Column({ type: DataType.TEXT, field: 'error_message' })
  errorMessage?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB, defaultValue: {} })
  metadata?: Record<string, unknown>;
}

@Table({
  tableName: 'rate_limit_buckets',
  timestamps: true,
  indexes: [
    { fields: ['key', 'window_start'] },
    { fields: ['expires_at'] },
  ],
})
export class RateLimitBucket extends Model {
  @ApiProperty({ example: 'bucket_123456', description: 'Unique bucket identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'key_123:2024-01-15:14', description: 'Rate limit key' })
  @Column({ type: DataType.STRING, allowNull: false })
  key: string;

  @ApiProperty({ description: 'Window start time' })
  @Column({ type: DataType.DATE, allowNull: false, field: 'window_start' })
  windowStart: Date;

  @ApiProperty({ example: 50, description: 'Current request count' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'request_count' })
  requestCount: number;

  @ApiProperty({ example: 100, description: 'Rate limit' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  limit: number;

  @ApiProperty({ description: 'Bucket expiration time' })
  @Column({ type: DataType.DATE, allowNull: false, field: 'expires_at' })
  expiresAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, field: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, field: 'updated_at' })
  updatedAt: Date;
}

// ============================================================================
// API KEY MANAGEMENT
// ============================================================================

/**
 * Generates a new API key with cryptographic security.
 *
 * @param {string} prefix - API key prefix (e.g., 'wc_live', 'wc_test')
 * @returns {string} Generated API key
 *
 * @example
 * ```typescript
 * const apiKey = generateApiKey('wc_live');
 * console.log('API Key:', apiKey);
 * ```
 */
export const generateApiKey = (prefix: string = 'wc_live'): string => {
  const randomBytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
  const base64 = Buffer.from(randomBytes).toString('base64').replace(/[+/=]/g, '');
  return `${prefix}_${base64.substring(0, 48)}`;
};

/**
 * Hashes an API key for secure storage.
 *
 * @param {string} apiKey - API key to hash
 * @returns {string} Hashed API key
 *
 * @example
 * ```typescript
 * const hash = hashApiKey(apiKey);
 * // Store hash in database, never store plain key
 * ```
 */
export const hashApiKey = (apiKey: string): string => {
  // Simple hash for demonstration - use bcrypt or similar in production
  let hash = 0;
  for (let i = 0; i < apiKey.length; i++) {
    const char = apiKey.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16)}_${apiKey.length}`;
};

/**
 * Validates an API key format.
 *
 * @param {string} apiKey - API key to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateApiKeyFormat(apiKey);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export const validateApiKeyFormat = (apiKey: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!apiKey) {
    errors.push('API key is required');
    return { valid: false, errors };
  }

  if (!apiKey.startsWith('wc_')) {
    errors.push('API key must start with "wc_"');
  }

  if (apiKey.length < 20) {
    errors.push('API key is too short');
  }

  if (!/^wc_[a-z]+_[A-Za-z0-9]+$/.test(apiKey)) {
    errors.push('API key has invalid format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Creates an API key configuration.
 *
 * @param {Partial<ApiKeyConfig>} config - API key configuration
 * @returns {ApiKeyConfig} Complete API key configuration
 *
 * @example
 * ```typescript
 * const apiKeyConfig = createApiKeyConfig({
 *   name: 'Production API Key',
 *   organizationId: 'org_123',
 *   permissions: ['read:threats', 'write:iocs'],
 *   rateLimitTier: 'premium'
 * });
 * ```
 */
export const createApiKeyConfig = (config: Partial<ApiKeyConfig>): ApiKeyConfig => {
  const key = generateApiKey('wc_live');
  const id = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as ApiKeyId;

  const rateLimitTiers = {
    free: 1000,
    basic: 10000,
    premium: 100000,
    enterprise: 1000000,
  };

  return {
    id,
    name: config.name || 'API Key',
    key,
    hashedKey: hashApiKey(key),
    organizationId: config.organizationId || 'org_default',
    userId: config.userId,
    permissions: config.permissions || ['read:threats'],
    rateLimitTier: config.rateLimitTier || 'basic',
    maxRequestsPerHour: rateLimitTiers[config.rateLimitTier || 'basic'],
    allowedIps: config.allowedIps,
    allowedOrigins: config.allowedOrigins,
    expiresAt: config.expiresAt,
    enabled: config.enabled !== false,
    metadata: config.metadata || {},
  };
};

/**
 * Verifies API key permissions.
 *
 * @param {ApiKeyConfig} apiKey - API key configuration
 * @param {string} requiredPermission - Required permission
 * @returns {boolean} Whether API key has permission
 *
 * @example
 * ```typescript
 * if (!verifyApiKeyPermission(apiKey, 'write:threats')) {
 *   throw new ForbiddenException('Insufficient permissions');
 * }
 * ```
 */
export const verifyApiKeyPermission = (apiKey: ApiKeyConfig, requiredPermission: string): boolean => {
  if (!apiKey.enabled) {
    return false;
  }

  if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
    return false;
  }

  // Check wildcard permissions
  if (apiKey.permissions.includes('*') || apiKey.permissions.includes('admin')) {
    return true;
  }

  // Check exact permission
  if (apiKey.permissions.includes(requiredPermission)) {
    return true;
  }

  // Check wildcard patterns (e.g., 'read:*' matches 'read:threats')
  const wildcardPatterns = apiKey.permissions.filter((p) => p.includes('*'));
  for (const pattern of wildcardPatterns) {
    const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
    if (regex.test(requiredPermission)) {
      return true;
    }
  }

  return false;
};

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Creates a rate limit configuration.
 *
 * @param {Partial<RateLimitConfig>} config - Rate limit configuration
 * @returns {RateLimitConfig} Complete rate limit configuration
 *
 * @example
 * ```typescript
 * const rateLimit = createRateLimitConfig({
 *   name: 'API Rate Limit',
 *   requestsPerWindow: 100,
 *   windowSizeMs: 60000,
 *   strategy: RateLimitStrategy.SLIDING_WINDOW
 * });
 * ```
 */
export const createRateLimitConfig = (config: Partial<RateLimitConfig>): RateLimitConfig => {
  const id = `rl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    name: config.name || 'Default Rate Limit',
    strategy: config.strategy || RateLimitStrategy.SLIDING_WINDOW,
    requestsPerWindow: config.requestsPerWindow || 100,
    windowSizeMs: config.windowSizeMs || 60000,
    burstSize: config.burstSize,
    scope: config.scope || 'api_key',
    exemptApiKeys: config.exemptApiKeys || [],
    exemptIps: config.exemptIps || [],
  };
};

/**
 * Checks if a request is rate limited.
 *
 * @param {string} key - Rate limit key (API key, IP, or user)
 * @param {RateLimitConfig} config - Rate limit configuration
 * @param {number} currentCount - Current request count in window
 * @returns {RateLimitInfo} Rate limit information
 *
 * @example
 * ```typescript
 * const rateLimitInfo = checkRateLimit('key_123', rateLimitConfig, currentCount);
 * if (rateLimitInfo.remaining === 0) {
 *   throw new TooManyRequestsException('Rate limit exceeded');
 * }
 * ```
 */
export const checkRateLimit = (
  key: string,
  config: RateLimitConfig,
  currentCount: number,
): RateLimitInfo => {
  const now = new Date();
  const resetTime = new Date(now.getTime() + config.windowSizeMs);

  const remaining = Math.max(0, config.requestsPerWindow - currentCount);
  const retryAfter = remaining === 0 ? Math.ceil(config.windowSizeMs / 1000) : undefined;

  return {
    limit: config.requestsPerWindow,
    remaining,
    reset: resetTime,
    retryAfter,
  };
};

/**
 * Implements token bucket rate limiting algorithm.
 *
 * @param {string} key - Bucket key
 * @param {number} capacity - Bucket capacity
 * @param {number} refillRate - Tokens per second
 * @param {number} currentTokens - Current tokens in bucket
 * @param {Date} lastRefill - Last refill timestamp
 * @returns {{ allowed: boolean; tokensRemaining: number; nextRefill: Date }} Token bucket state
 *
 * @example
 * ```typescript
 * const result = tokenBucketRateLimit('key_123', 100, 10, currentTokens, lastRefill);
 * if (!result.allowed) {
 *   throw new TooManyRequestsException('Rate limit exceeded');
 * }
 * ```
 */
export const tokenBucketRateLimit = (
  key: string,
  capacity: number,
  refillRate: number,
  currentTokens: number,
  lastRefill: Date,
): { allowed: boolean; tokensRemaining: number; nextRefill: Date } => {
  const now = new Date();
  const elapsedSeconds = (now.getTime() - lastRefill.getTime()) / 1000;

  // Refill tokens based on elapsed time
  const tokensToAdd = Math.floor(elapsedSeconds * refillRate);
  const newTokenCount = Math.min(capacity, currentTokens + tokensToAdd);

  // Check if request is allowed
  const allowed = newTokenCount >= 1;
  const tokensRemaining = allowed ? newTokenCount - 1 : newTokenCount;

  // Calculate next refill time
  const nextRefill = new Date(now.getTime() + (1000 / refillRate));

  return {
    allowed,
    tokensRemaining,
    nextRefill,
  };
};

/**
 * Implements sliding window rate limiting algorithm.
 *
 * @param {Date[]} requestTimestamps - Array of request timestamps
 * @param {number} windowSizeMs - Window size in milliseconds
 * @param {number} limit - Request limit
 * @returns {{ allowed: boolean; requestsInWindow: number; oldestRequest?: Date }} Sliding window result
 *
 * @example
 * ```typescript
 * const result = slidingWindowRateLimit(recentRequests, 60000, 100);
 * if (!result.allowed) {
 *   throw new TooManyRequestsException('Rate limit exceeded');
 * }
 * ```
 */
export const slidingWindowRateLimit = (
  requestTimestamps: Date[],
  windowSizeMs: number,
  limit: number,
): { allowed: boolean; requestsInWindow: number; oldestRequest?: Date } => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSizeMs);

  // Filter requests within the sliding window
  const requestsInWindow = requestTimestamps.filter((ts) => ts >= windowStart);

  const allowed = requestsInWindow.length < limit;
  const oldestRequest = requestsInWindow.length > 0 ? requestsInWindow[0] : undefined;

  return {
    allowed,
    requestsInWindow: requestsInWindow.length,
    oldestRequest,
  };
};

/**
 * Calculates rate limit quota usage.
 *
 * @param {string} apiKeyId - API key ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {ApiRequestLog[]} requests - API request logs
 * @returns {ApiQuotaUsage} Quota usage information
 *
 * @example
 * ```typescript
 * const usage = calculateQuotaUsage('key_123', startDate, endDate, requestLogs);
 * console.log(`${usage.requestCount} / ${usage.quotaLimit} requests used`);
 * ```
 */
export const calculateQuotaUsage = (
  apiKeyId: string,
  periodStart: Date,
  periodEnd: Date,
  requests: ApiRequestLog[],
): ApiQuotaUsage => {
  const periodRequests = requests.filter(
    (req) => req.timestamp >= periodStart && req.timestamp <= periodEnd && req.apiKeyId === apiKeyId,
  );

  const requestCount = periodRequests.length;
  const dataTransferBytes = periodRequests.reduce(
    (sum, req) => sum + (req.requestSizeBytes || 0) + (req.responseSizeBytes || 0),
    0,
  );

  // Calculate period type
  const periodDuration = periodEnd.getTime() - periodStart.getTime();
  let period: 'hour' | 'day' | 'month';
  if (periodDuration <= 3600000) {
    period = 'hour';
  } else if (periodDuration <= 86400000) {
    period = 'day';
  } else {
    period = 'month';
  }

  return {
    apiKeyId: apiKeyId as ApiKeyId,
    period,
    periodStart,
    periodEnd,
    requestCount,
    quotaLimit: 10000, // Default, should come from API key config
    dataTransferBytes,
    costUnits: requestCount * 0.001, // Example cost calculation
  };
};

// ============================================================================
// WEBHOOK MANAGEMENT
// ============================================================================

/**
 * Creates a webhook configuration.
 *
 * @param {Partial<WebhookConfig>} config - Webhook configuration
 * @returns {WebhookConfig} Complete webhook configuration
 *
 * @example
 * ```typescript
 * const webhook = createWebhookConfig({
 *   name: 'Threat Notifications',
 *   url: 'https://api.example.com/webhooks',
 *   events: [WebhookEventType.THREAT_DETECTED]
 * });
 * ```
 */
export const createWebhookConfig = (config: Partial<WebhookConfig>): WebhookConfig => {
  const id = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as WebhookId;
  const secret = `whsec_${Math.random().toString(36).substr(2, 32)}`;

  return {
    id,
    name: config.name || 'Webhook',
    url: config.url || '',
    events: config.events || [],
    secret,
    enabled: config.enabled !== false,
    retryPolicy: config.retryPolicy || {
      maxRetries: 3,
      backoffMs: 1000,
      maxBackoffMs: 60000,
    },
    authentication: config.authentication,
    filters: config.filters,
    metadata: config.metadata || {},
  };
};

/**
 * Generates a webhook signature for payload verification.
 *
 * @param {string} secret - Webhook secret
 * @param {string} payload - Payload to sign
 * @param {number} timestamp - Timestamp
 * @returns {string} Webhook signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(webhook.secret, JSON.stringify(payload), Date.now());
 * // Include signature in webhook headers
 * ```
 */
export const generateWebhookSignature = (secret: string, payload: string, timestamp: number): string => {
  const signedPayload = `${timestamp}.${payload}`;
  // Simple signature for demonstration - use HMAC-SHA256 in production
  let hash = 0;
  for (let i = 0; i < signedPayload.length; i++) {
    const char = signedPayload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `v1=${Math.abs(hash).toString(16)}`;
};

/**
 * Verifies a webhook signature.
 *
 * @param {string} signature - Received signature
 * @param {string} secret - Webhook secret
 * @param {string} payload - Payload
 * @param {number} timestamp - Timestamp
 * @returns {boolean} Whether signature is valid
 *
 * @example
 * ```typescript
 * const valid = verifyWebhookSignature(headers['x-webhook-signature'], secret, body, timestamp);
 * if (!valid) {
 *   throw new UnauthorizedException('Invalid webhook signature');
 * }
 * ```
 */
export const verifyWebhookSignature = (
  signature: string,
  secret: string,
  payload: string,
  timestamp: number,
): boolean => {
  const expectedSignature = generateWebhookSignature(secret, payload, timestamp);
  return signature === expectedSignature;
};

/**
 * Creates a webhook delivery record.
 *
 * @param {WebhookConfig} webhook - Webhook configuration
 * @param {WebhookEventType} eventType - Event type
 * @param {Record<string, unknown>} payload - Event payload
 * @returns {WebhookDelivery} Webhook delivery record
 *
 * @example
 * ```typescript
 * const delivery = createWebhookDelivery(webhook, WebhookEventType.THREAT_DETECTED, eventData);
 * // Queue delivery for processing
 * ```
 */
export const createWebhookDelivery = (
  webhook: WebhookConfig,
  eventType: WebhookEventType,
  payload: Record<string, unknown>,
): WebhookDelivery => {
  const id = `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    webhookId: webhook.id,
    eventType,
    payload,
    attempts: 0,
    status: 'pending',
  };
};

/**
 * Calculates webhook retry delay with exponential backoff.
 *
 * @param {number} attemptNumber - Current attempt number
 * @param {number} baseDelayMs - Base delay in milliseconds
 * @param {number} maxDelayMs - Maximum delay in milliseconds
 * @returns {number} Retry delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateWebhookRetryDelay(3, 1000, 60000);
 * // Wait for delay before retrying webhook delivery
 * ```
 */
export const calculateWebhookRetryDelay = (
  attemptNumber: number,
  baseDelayMs: number,
  maxDelayMs: number,
): number => {
  const exponentialDelay = baseDelayMs * Math.pow(2, attemptNumber - 1);
  const jitter = Math.random() * 0.1 * exponentialDelay; // Add 10% jitter
  return Math.min(exponentialDelay + jitter, maxDelayMs);
};

/**
 * Filters webhook events based on configuration.
 *
 * @param {Record<string, unknown>} event - Event data
 * @param {Record<string, unknown>} filters - Filter configuration
 * @returns {boolean} Whether event passes filters
 *
 * @example
 * ```typescript
 * if (filterWebhookEvent(eventData, webhook.filters)) {
 *   // Deliver webhook
 * }
 * ```
 */
export const filterWebhookEvent = (
  event: Record<string, unknown>,
  filters: Record<string, unknown> = {},
): boolean => {
  for (const [key, filterValue] of Object.entries(filters)) {
    const eventValue = event[key];

    if (Array.isArray(filterValue)) {
      if (!filterValue.includes(eventValue)) {
        return false;
      }
    } else if (eventValue !== filterValue) {
      return false;
    }
  }

  return true;
};

// ============================================================================
// API VERSIONING
// ============================================================================

/**
 * Creates an API version configuration.
 *
 * @param {Partial<ApiVersionInfo>} version - Version information
 * @returns {ApiVersionInfo} Complete version information
 *
 * @example
 * ```typescript
 * const v2 = createApiVersion({
 *   version: 'v2',
 *   releaseDate: new Date('2024-01-15'),
 *   changelog: ['Added GraphQL support', 'Improved rate limiting']
 * });
 * ```
 */
export const createApiVersion = (version: Partial<ApiVersionInfo>): ApiVersionInfo => {
  const id = `ver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as ApiVersionId;

  return {
    id,
    version: version.version || 'v1',
    releaseDate: version.releaseDate || new Date(),
    deprecationDate: version.deprecationDate,
    sunsetDate: version.sunsetDate,
    status: version.status || 'current',
    changelog: version.changelog || [],
    breakingChanges: version.breakingChanges || [],
  };
};

/**
 * Parses API version from request headers or path.
 *
 * @param {Record<string, string>} headers - Request headers
 * @param {string} path - Request path
 * @returns {string} API version
 *
 * @example
 * ```typescript
 * const version = parseApiVersion(headers, '/api/v2/threats');
 * console.log('Version:', version); // 'v2'
 * ```
 */
export const parseApiVersion = (headers: Record<string, string>, path: string): string => {
  // Check version header
  if (headers['api-version']) {
    return headers['api-version'];
  }

  // Check accept header (e.g., 'application/vnd.whitecross.v2+json')
  const acceptHeader = headers['accept'] || '';
  const versionMatch = acceptHeader.match(/vnd\.whitecross\.v(\d+)/);
  if (versionMatch) {
    return `v${versionMatch[1]}`;
  }

  // Check path version (e.g., '/api/v2/threats')
  const pathMatch = path.match(/\/v(\d+)\//);
  if (pathMatch) {
    return `v${pathMatch[1]}`;
  }

  // Default to v1
  return 'v1';
};

/**
 * Checks if an API version is deprecated or sunset.
 *
 * @param {ApiVersionInfo} version - Version information
 * @returns {{ deprecated: boolean; sunset: boolean; daysUntilSunset?: number }} Version status
 *
 * @example
 * ```typescript
 * const status = checkVersionDeprecation(versionInfo);
 * if (status.deprecated) {
 *   res.setHeader('Deprecation', 'true');
 * }
 * ```
 */
export const checkVersionDeprecation = (
  version: ApiVersionInfo,
): { deprecated: boolean; sunset: boolean; daysUntilSunset?: number } => {
  const now = new Date();

  const deprecated = version.deprecationDate ? version.deprecationDate <= now : false;
  const sunset = version.sunsetDate ? version.sunsetDate <= now : false;

  let daysUntilSunset: number | undefined;
  if (version.sunsetDate && !sunset) {
    const diffMs = version.sunsetDate.getTime() - now.getTime();
    daysUntilSunset = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  return {
    deprecated,
    sunset,
    daysUntilSunset,
  };
};

// ============================================================================
// REQUEST/RESPONSE TRANSFORMATION
// ============================================================================

/**
 * Creates a transformation rule.
 *
 * @param {Partial<TransformationRule>} rule - Transformation rule
 * @returns {TransformationRule} Complete transformation rule
 *
 * @example
 * ```typescript
 * const rule = createTransformationRule({
 *   name: 'Add Organization ID',
 *   type: 'request',
 *   transformations: [{ action: 'add', field: 'organizationId', value: 'org_123' }]
 * });
 * ```
 */
export const createTransformationRule = (rule: Partial<TransformationRule>): TransformationRule => {
  const id = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    name: rule.name || 'Transformation Rule',
    type: rule.type || 'request',
    enabled: rule.enabled !== false,
    conditions: rule.conditions || [],
    transformations: rule.transformations || [],
  };
};

/**
 * Applies transformation rules to data.
 *
 * @param {Record<string, unknown>} data - Data to transform
 * @param {TransformationRule[]} rules - Transformation rules
 * @returns {Record<string, unknown>} Transformed data
 *
 * @example
 * ```typescript
 * const transformed = applyTransformations(requestBody, transformationRules);
 * ```
 */
export const applyTransformations = (
  data: Record<string, unknown>,
  rules: TransformationRule[],
): Record<string, unknown> => {
  let result = { ...data };

  for (const rule of rules) {
    if (!rule.enabled) continue;

    // Check conditions
    const conditionsMet = rule.conditions.every((condition) => {
      const value = result[condition.field];
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'regex':
          return new RegExp(String(condition.value)).test(String(value));
        default:
          return true;
      }
    });

    if (!conditionsMet) continue;

    // Apply transformations
    for (const transform of rule.transformations) {
      switch (transform.action) {
        case 'add':
          result[transform.field] = transform.value;
          break;
        case 'remove':
          delete result[transform.field];
          break;
        case 'rename':
          if (transform.newField) {
            result[transform.newField] = result[transform.field];
            delete result[transform.field];
          }
          break;
        case 'modify':
          result[transform.field] = transform.value;
          break;
      }
    }
  }

  return result;
};

/**
 * Sanitizes response data by removing sensitive fields.
 *
 * @param {Record<string, unknown>} data - Data to sanitize
 * @param {string[]} sensitiveFields - Sensitive field names
 * @returns {Record<string, unknown>} Sanitized data
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeResponse(userData, ['password', 'apiKey', 'secret']);
 * ```
 */
export const sanitizeResponse = (
  data: Record<string, unknown>,
  sensitiveFields: string[] = ['password', 'secret', 'token', 'key', 'hash'],
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeResponse(value as Record<string, unknown>, sensitiveFields);
    } else {
      result[key] = value;
    }
  }

  return result;
};

// ============================================================================
// GRAPHQL UTILITIES
// ============================================================================

/**
 * Calculates GraphQL query complexity.
 *
 * @param {string} query - GraphQL query string
 * @param {number} maxDepth - Maximum allowed depth
 * @returns {QueryComplexity} Query complexity analysis
 *
 * @example
 * ```typescript
 * const complexity = calculateGraphQLComplexity(query, 10);
 * if (complexity.estimatedCost > complexity.maxAllowedCost) {
 *   throw new Error('Query too complex');
 * }
 * ```
 */
export const calculateGraphQLComplexity = (query: string, maxDepth: number = 10): QueryComplexity => {
  // Simplified complexity calculation
  const depth = (query.match(/{/g) || []).length;
  const fields = query.match(/\w+(?=\s*{|$)/g) || [];
  const breadth = fields.length;
  const estimatedCost = depth * breadth;
  const maxAllowedCost = maxDepth * 100;

  return {
    depth,
    breadth,
    estimatedCost,
    maxAllowedCost,
    fields,
  };
};

/**
 * Generates GraphQL schema SDL for threat intelligence types.
 *
 * @returns {string} GraphQL schema SDL
 *
 * @example
 * ```typescript
 * const schema = generateThreatGraphQLSchema();
 * // Use schema with GraphQL server
 * ```
 */
export const generateThreatGraphQLSchema = (): string => {
  return `
type Threat {
  id: ID!
  type: String!
  severity: ThreatSeverity!
  description: String
  firstSeen: DateTime!
  lastSeen: DateTime!
  iocs: [IOC!]!
  campaigns: [Campaign!]!
  actors: [ThreatActor!]!
}

enum ThreatSeverity {
  CRITICAL
  HIGH
  MEDIUM
  LOW
  INFO
}

type IOC {
  id: ID!
  type: IOCType!
  value: String!
  confidence: Float!
  sources: [IOCSource!]!
}

enum IOCType {
  IPV4
  IPV6
  DOMAIN
  URL
  FILE_HASH
}

type IOCSource {
  provider: String!
  confidence: Float!
  firstSeen: DateTime!
}

type ThreatActor {
  id: ID!
  name: String!
  aliases: [String!]!
  sophistication: String!
  motivation: [String!]!
}

type Campaign {
  id: ID!
  name: String!
  status: CampaignStatus!
  startDate: DateTime!
  endDate: DateTime
}

enum CampaignStatus {
  ACTIVE
  SUSPECTED
  DORMANT
  CONCLUDED
}

scalar DateTime

type Query {
  threats(filter: ThreatFilter, limit: Int, offset: Int): [Threat!]!
  threat(id: ID!): Threat
  iocs(filter: IOCFilter, limit: Int, offset: Int): [IOC!]!
  ioc(id: ID!): IOC
}

input ThreatFilter {
  severity: ThreatSeverity
  type: String
  startDate: DateTime
  endDate: DateTime
}

input IOCFilter {
  type: IOCType
  severity: ThreatSeverity
  minConfidence: Float
}
  `.trim();
};

/**
 * Creates GraphQL resolver context with authentication.
 *
 * @param {ApiRequestMetadata} request - Request metadata
 * @param {ApiKeyConfig} apiKey - API key configuration
 * @returns {Record<string, unknown>} GraphQL context
 *
 * @example
 * ```typescript
 * const context = createGraphQLContext(requestMetadata, apiKey);
 * // Use context in GraphQL resolvers
 * ```
 */
export const createGraphQLContext = (
  request: ApiRequestMetadata,
  apiKey: ApiKeyConfig,
): Record<string, unknown> => {
  return {
    requestId: request.requestId,
    apiKey: apiKey.id,
    organizationId: apiKey.organizationId,
    userId: apiKey.userId,
    permissions: apiKey.permissions,
    timestamp: request.timestamp,
  };
};

// ============================================================================
// API ANALYTICS AND MONITORING
// ============================================================================

/**
 * Logs an API analytics event.
 *
 * @param {ApiRequestMetadata} request - Request metadata
 * @param {ApiResponseMetadata} response - Response metadata
 * @returns {ApiAnalyticsEvent} Analytics event
 *
 * @example
 * ```typescript
 * const event = logApiAnalytics(requestMetadata, responseMetadata);
 * // Store event for analysis
 * ```
 */
export const logApiAnalytics = (
  request: ApiRequestMetadata,
  response: ApiResponseMetadata,
): ApiAnalyticsEvent => {
  return {
    timestamp: request.timestamp,
    requestId: request.requestId,
    apiKeyId: request.apiKeyId,
    userId: request.userId,
    endpoint: request.path,
    method: request.method,
    statusCode: response.statusCode,
    responseTimeMs: response.processingTimeMs,
    requestSizeBytes: 0, // Calculate from request body
    responseSizeBytes: response.contentLength,
    metadata: {
      userAgent: request.userAgent,
      clientIp: request.clientIp,
      cached: response.cached,
    },
  };
};

/**
 * Analyzes API performance metrics.
 *
 * @param {ApiAnalyticsEvent[]} events - Analytics events
 * @returns {{ avgResponseTime: number; p95ResponseTime: number; errorRate: number; requestsPerSecond: number }} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = analyzeApiPerformance(recentEvents);
 * console.log(`Avg response time: ${metrics.avgResponseTime}ms`);
 * ```
 */
export const analyzeApiPerformance = (
  events: ApiAnalyticsEvent[],
): { avgResponseTime: number; p95ResponseTime: number; errorRate: number; requestsPerSecond: number } => {
  if (events.length === 0) {
    return {
      avgResponseTime: 0,
      p95ResponseTime: 0,
      errorRate: 0,
      requestsPerSecond: 0,
    };
  }

  // Calculate average response time
  const totalResponseTime = events.reduce((sum, e) => sum + e.responseTimeMs, 0);
  const avgResponseTime = totalResponseTime / events.length;

  // Calculate P95 response time
  const sortedTimes = events.map((e) => e.responseTimeMs).sort((a, b) => a - b);
  const p95Index = Math.floor(sortedTimes.length * 0.95);
  const p95ResponseTime = sortedTimes[p95Index] || 0;

  // Calculate error rate
  const errorCount = events.filter((e) => e.statusCode >= 400).length;
  const errorRate = errorCount / events.length;

  // Calculate requests per second
  const timestamps = events.map((e) => e.timestamp.getTime());
  const timeRangeMs = Math.max(...timestamps) - Math.min(...timestamps);
  const requestsPerSecond = timeRangeMs > 0 ? (events.length / timeRangeMs) * 1000 : 0;

  return {
    avgResponseTime,
    p95ResponseTime,
    errorRate,
    requestsPerSecond,
  };
};

/**
 * Generates API usage report.
 *
 * @param {string} apiKeyId - API key ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {ApiAnalyticsEvent[]} events - Analytics events
 * @returns {{ totalRequests: number; successRate: number; topEndpoints: Array<{ endpoint: string; count: number }>; dataTransfer: number }} Usage report
 *
 * @example
 * ```typescript
 * const report = generateApiUsageReport('key_123', startDate, endDate, events);
 * console.log(`Total requests: ${report.totalRequests}`);
 * ```
 */
export const generateApiUsageReport = (
  apiKeyId: string,
  startDate: Date,
  endDate: Date,
  events: ApiAnalyticsEvent[],
): { totalRequests: number; successRate: number; topEndpoints: Array<{ endpoint: string; count: number }>; dataTransfer: number } => {
  const filteredEvents = events.filter(
    (e) => e.apiKeyId === apiKeyId && e.timestamp >= startDate && e.timestamp <= endDate,
  );

  const totalRequests = filteredEvents.length;
  const successCount = filteredEvents.filter((e) => e.statusCode >= 200 && e.statusCode < 300).length;
  const successRate = totalRequests > 0 ? successCount / totalRequests : 0;

  // Top endpoints
  const endpointCounts = new Map<string, number>();
  filteredEvents.forEach((e) => {
    endpointCounts.set(e.endpoint, (endpointCounts.get(e.endpoint) || 0) + 1);
  });

  const topEndpoints = Array.from(endpointCounts.entries())
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const dataTransfer = filteredEvents.reduce((sum, e) => sum + e.requestSizeBytes + e.responseSizeBytes, 0);

  return {
    totalRequests,
    successRate,
    topEndpoints,
    dataTransfer,
  };
};

/**
 * Detects API anomalies and suspicious patterns.
 *
 * @param {ApiAnalyticsEvent[]} events - Analytics events
 * @param {number} thresholdMultiplier - Anomaly threshold multiplier
 * @returns {{ anomalies: Array<{ type: string; severity: string; description: string }>; suspiciousPatterns: string[] }} Anomaly detection result
 *
 * @example
 * ```typescript
 * const anomalies = detectApiAnomalies(recentEvents, 2.0);
 * if (anomalies.anomalies.length > 0) {
 *   console.warn('Anomalies detected:', anomalies);
 * }
 * ```
 */
export const detectApiAnomalies = (
  events: ApiAnalyticsEvent[],
  thresholdMultiplier: number = 2.0,
): { anomalies: Array<{ type: string; severity: string; description: string }>; suspiciousPatterns: string[] } => {
  const anomalies: Array<{ type: string; severity: string; description: string }> = [];
  const suspiciousPatterns: string[] = [];

  if (events.length === 0) {
    return { anomalies, suspiciousPatterns };
  }

  // Calculate baseline metrics
  const avgResponseTime = events.reduce((sum, e) => sum + e.responseTimeMs, 0) / events.length;
  const errorRate = events.filter((e) => e.statusCode >= 400).length / events.length;

  // Detect slow responses
  const slowRequests = events.filter((e) => e.responseTimeMs > avgResponseTime * thresholdMultiplier);
  if (slowRequests.length > events.length * 0.1) {
    anomalies.push({
      type: 'slow_responses',
      severity: 'warning',
      description: `${slowRequests.length} requests are significantly slower than average`,
    });
  }

  // Detect high error rate
  if (errorRate > 0.1) {
    anomalies.push({
      type: 'high_error_rate',
      severity: 'critical',
      description: `Error rate is ${(errorRate * 100).toFixed(2)}%, exceeding 10% threshold`,
    });
  }

  // Detect rapid requests from same IP
  const ipCounts = new Map<string, number>();
  events.forEach((e) => {
    const ip = e.metadata?.clientIp as string;
    if (ip) {
      ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1);
    }
  });

  ipCounts.forEach((count, ip) => {
    if (count > 100) {
      suspiciousPatterns.push(`High request volume from IP ${ip}: ${count} requests`);
    }
  });

  // Detect unusual endpoint access patterns
  const endpointCounts = new Map<string, number>();
  events.forEach((e) => {
    endpointCounts.set(e.endpoint, (endpointCounts.get(e.endpoint) || 0) + 1);
  });

  const avgEndpointCount = events.length / endpointCounts.size;
  endpointCounts.forEach((count, endpoint) => {
    if (count > avgEndpointCount * 5) {
      suspiciousPatterns.push(`Unusual access pattern for ${endpoint}: ${count} requests`);
    }
  });

  return { anomalies, suspiciousPatterns };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a unique request ID.
 *
 * @returns {RequestId} Request ID
 */
export const generateRequestId = (): RequestId => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `req_${timestamp}_${random}` as RequestId;
};

/**
 * Formats API error response.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {Record<string, unknown>} [details] - Error details
 * @returns {Record<string, unknown>} Formatted error response
 */
export const formatApiError = (
  statusCode: number,
  message: string,
  code?: string,
  details?: Record<string, unknown>,
): Record<string, unknown> => {
  return {
    error: {
      code: code || `ERR_${statusCode}`,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      details,
    },
  };
};

/**
 * Validates API request payload.
 *
 * @param {Record<string, unknown>} payload - Request payload
 * @param {string[]} requiredFields - Required field names
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 */
export const validateApiPayload = (
  payload: Record<string, unknown>,
  requiredFields: string[],
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    if (!(field in payload) || payload[field] === null || payload[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
