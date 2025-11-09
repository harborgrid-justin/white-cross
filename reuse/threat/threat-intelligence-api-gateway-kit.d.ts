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
import { Model } from 'sequelize-typescript';
declare const __brand: unique symbol;
type Brand<T, TBrand> = T & {
    [__brand]: TBrand;
};
export type ApiKeyId = Brand<string, 'ApiKeyId'>;
export type WebhookId = Brand<string, 'WebhookId'>;
export type RequestId = Brand<string, 'RequestId'>;
export type ApiVersionId = Brand<string, 'ApiVersionId'>;
/**
 * HTTP methods
 */
export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD"
}
/**
 * API authentication type
 */
export declare enum AuthenticationType {
    API_KEY = "API_KEY",
    BEARER_TOKEN = "BEARER_TOKEN",
    BASIC_AUTH = "BASIC_AUTH",
    OAUTH2 = "OAUTH2",
    MUTUAL_TLS = "MUTUAL_TLS",
    JWT = "JWT"
}
/**
 * Rate limit strategy
 */
export declare enum RateLimitStrategy {
    FIXED_WINDOW = "FIXED_WINDOW",
    SLIDING_WINDOW = "SLIDING_WINDOW",
    TOKEN_BUCKET = "TOKEN_BUCKET",
    LEAKY_BUCKET = "LEAKY_BUCKET"
}
/**
 * Webhook event type
 */
export declare enum WebhookEventType {
    THREAT_DETECTED = "THREAT_DETECTED",
    IOC_ADDED = "IOC_ADDED",
    IOC_UPDATED = "IOC_UPDATED",
    THREAT_LEVEL_CHANGED = "THREAT_LEVEL_CHANGED",
    CAMPAIGN_STARTED = "CAMPAIGN_STARTED",
    INCIDENT_CREATED = "INCIDENT_CREATED",
    ALERT_TRIGGERED = "ALERT_TRIGGERED"
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
export declare class ApiKey extends Model {
    id: string;
    name: string;
    key: string;
    hashedKey: string;
    organizationId: string;
    userId?: string;
    permissions: string[];
    rateLimitTier: string;
    maxRequestsPerHour: number;
    allowedIps?: string[];
    allowedOrigins?: string[];
    expiresAt?: Date;
    enabled: boolean;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class Webhook extends Model {
    id: string;
    name: string;
    url: string;
    events: string[];
    secret: string;
    enabled: boolean;
    retryPolicy: Record<string, unknown>;
    authentication?: Record<string, unknown>;
    filters?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ApiRequestLog extends Model {
    id: string;
    timestamp: Date;
    method: string;
    endpoint: string;
    apiKeyId?: string;
    userId?: string;
    clientIp: string;
    statusCode: number;
    responseTimeMs: number;
    requestSizeBytes: number;
    responseSizeBytes: number;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
}
export declare class RateLimitBucket extends Model {
    id: string;
    key: string;
    windowStart: Date;
    requestCount: number;
    limit: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare const generateApiKey: (prefix?: string) => string;
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
export declare const hashApiKey: (apiKey: string) => string;
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
export declare const validateApiKeyFormat: (apiKey: string) => {
    valid: boolean;
    errors: string[];
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
export declare const createApiKeyConfig: (config: Partial<ApiKeyConfig>) => ApiKeyConfig;
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
export declare const verifyApiKeyPermission: (apiKey: ApiKeyConfig, requiredPermission: string) => boolean;
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
export declare const createRateLimitConfig: (config: Partial<RateLimitConfig>) => RateLimitConfig;
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
export declare const checkRateLimit: (key: string, config: RateLimitConfig, currentCount: number) => RateLimitInfo;
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
export declare const tokenBucketRateLimit: (key: string, capacity: number, refillRate: number, currentTokens: number, lastRefill: Date) => {
    allowed: boolean;
    tokensRemaining: number;
    nextRefill: Date;
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
export declare const slidingWindowRateLimit: (requestTimestamps: Date[], windowSizeMs: number, limit: number) => {
    allowed: boolean;
    requestsInWindow: number;
    oldestRequest?: Date;
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
export declare const calculateQuotaUsage: (apiKeyId: string, periodStart: Date, periodEnd: Date, requests: ApiRequestLog[]) => ApiQuotaUsage;
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
export declare const createWebhookConfig: (config: Partial<WebhookConfig>) => WebhookConfig;
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
export declare const generateWebhookSignature: (secret: string, payload: string, timestamp: number) => string;
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
export declare const verifyWebhookSignature: (signature: string, secret: string, payload: string, timestamp: number) => boolean;
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
export declare const createWebhookDelivery: (webhook: WebhookConfig, eventType: WebhookEventType, payload: Record<string, unknown>) => WebhookDelivery;
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
export declare const calculateWebhookRetryDelay: (attemptNumber: number, baseDelayMs: number, maxDelayMs: number) => number;
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
export declare const filterWebhookEvent: (event: Record<string, unknown>, filters?: Record<string, unknown>) => boolean;
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
export declare const createApiVersion: (version: Partial<ApiVersionInfo>) => ApiVersionInfo;
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
export declare const parseApiVersion: (headers: Record<string, string>, path: string) => string;
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
export declare const checkVersionDeprecation: (version: ApiVersionInfo) => {
    deprecated: boolean;
    sunset: boolean;
    daysUntilSunset?: number;
};
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
export declare const createTransformationRule: (rule: Partial<TransformationRule>) => TransformationRule;
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
export declare const applyTransformations: (data: Record<string, unknown>, rules: TransformationRule[]) => Record<string, unknown>;
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
export declare const sanitizeResponse: (data: Record<string, unknown>, sensitiveFields?: string[]) => Record<string, unknown>;
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
export declare const calculateGraphQLComplexity: (query: string, maxDepth?: number) => QueryComplexity;
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
export declare const generateThreatGraphQLSchema: () => string;
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
export declare const createGraphQLContext: (request: ApiRequestMetadata, apiKey: ApiKeyConfig) => Record<string, unknown>;
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
export declare const logApiAnalytics: (request: ApiRequestMetadata, response: ApiResponseMetadata) => ApiAnalyticsEvent;
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
export declare const analyzeApiPerformance: (events: ApiAnalyticsEvent[]) => {
    avgResponseTime: number;
    p95ResponseTime: number;
    errorRate: number;
    requestsPerSecond: number;
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
export declare const generateApiUsageReport: (apiKeyId: string, startDate: Date, endDate: Date, events: ApiAnalyticsEvent[]) => {
    totalRequests: number;
    successRate: number;
    topEndpoints: Array<{
        endpoint: string;
        count: number;
    }>;
    dataTransfer: number;
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
export declare const detectApiAnomalies: (events: ApiAnalyticsEvent[], thresholdMultiplier?: number) => {
    anomalies: Array<{
        type: string;
        severity: string;
        description: string;
    }>;
    suspiciousPatterns: string[];
};
/**
 * Generates a unique request ID.
 *
 * @returns {RequestId} Request ID
 */
export declare const generateRequestId: () => RequestId;
/**
 * Formats API error response.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {Record<string, unknown>} [details] - Error details
 * @returns {Record<string, unknown>} Formatted error response
 */
export declare const formatApiError: (statusCode: number, message: string, code?: string, details?: Record<string, unknown>) => Record<string, unknown>;
/**
 * Validates API request payload.
 *
 * @param {Record<string, unknown>} payload - Request payload
 * @param {string[]} requiredFields - Required field names
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 */
export declare const validateApiPayload: (payload: Record<string, unknown>, requiredFields: string[]) => {
    valid: boolean;
    errors: string[];
};
export {};
//# sourceMappingURL=threat-intelligence-api-gateway-kit.d.ts.map