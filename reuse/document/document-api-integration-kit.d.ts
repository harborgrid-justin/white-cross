/**
 * LOC: DOC-API-001
 * File: /reuse/document/document-api-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/throttler
 *   - express (v4.x)
 *   - axios (v1.x)
 *   - sequelize (v6.x)
 *   - jsonwebtoken
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - API gateway services
 *   - Webhook handlers
 *   - External integration modules
 *   - Authentication middleware
 */
/**
 * File: /reuse/document/document-api-integration-kit.ts
 * Locator: WC-UTL-DOCAPI-001
 * Purpose: API Integration & Webhooks Kit - REST/GraphQL endpoints, webhook delivery, API authentication, rate limiting
 *
 * Upstream: @nestjs/common, @nestjs/swagger, @nestjs/throttler, express, axios, sequelize, jsonwebtoken, crypto
 * Downstream: API controllers, webhook services, integration handlers, auth middleware
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Axios 1.x, Express 4.x
 * Exports: 45 utility functions for API integrations, webhooks, REST/GraphQL, authentication, rate limiting, monitoring
 *
 * LLM Context: Production-grade API integration utilities for White Cross healthcare platform.
 * Provides REST/GraphQL API endpoint creation, webhook management and delivery, API key authentication,
 * JWT token handling, OAuth2 integration, rate limiting and throttling, request/response transformation,
 * payload validation, error handling with proper HTTP status codes, API versioning, OpenAPI/Swagger documentation,
 * webhook retry logic, HMAC signature verification, API analytics and monitoring, CORS configuration,
 * and comprehensive logging. Designed to compete with DocuSign API, Box API, and Dropbox API capabilities
 * for document management and integration. Essential for third-party integrations, developer portals,
 * and enterprise API gateway patterns.
 */
import { Sequelize } from 'sequelize';
/**
 * HTTP methods supported
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
/**
 * API authentication types
 */
export type AuthenticationType = 'API_KEY' | 'JWT' | 'OAUTH2' | 'BASIC' | 'HMAC' | 'BEARER';
/**
 * Webhook event types
 */
export type WebhookEventType = 'document.created' | 'document.updated' | 'document.deleted' | 'document.signed' | 'document.shared' | 'document.viewed' | 'user.created' | 'user.updated' | 'custom';
/**
 * Webhook delivery status
 */
export type WebhookStatus = 'pending' | 'delivered' | 'failed' | 'retrying' | 'cancelled';
/**
 * API rate limit window
 */
export type RateLimitWindow = '1s' | '1m' | '1h' | '1d';
/**
 * API endpoint configuration
 */
export interface ApiEndpointConfig {
    path: string;
    method: HttpMethod;
    controller: string;
    action: string;
    authentication?: AuthenticationType;
    rateLimit?: RateLimitConfig;
    version?: string;
    deprecated?: boolean;
    swagger?: SwaggerConfig;
    cors?: CorsConfig;
}
/**
 * Swagger/OpenAPI configuration
 */
export interface SwaggerConfig {
    summary: string;
    description?: string;
    tags?: string[];
    operationId?: string;
    parameters?: SwaggerParameter[];
    requestBody?: SwaggerRequestBody;
    responses?: Record<number, SwaggerResponse>;
    security?: Record<string, string[]>[];
}
/**
 * Swagger parameter definition
 */
export interface SwaggerParameter {
    name: string;
    in: 'query' | 'path' | 'header' | 'cookie';
    description?: string;
    required?: boolean;
    schema: {
        type: string;
        format?: string;
        enum?: string[];
        default?: any;
    };
}
/**
 * Swagger request body definition
 */
export interface SwaggerRequestBody {
    description?: string;
    required?: boolean;
    content: Record<string, {
        schema: any;
    }>;
}
/**
 * Swagger response definition
 */
export interface SwaggerResponse {
    description: string;
    content?: Record<string, {
        schema: any;
    }>;
    headers?: Record<string, any>;
}
/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
    maxRequests: number;
    window: RateLimitWindow;
    strategy?: 'fixed' | 'sliding';
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: (req: any) => string;
}
/**
 * CORS configuration
 */
export interface CorsConfig {
    origin: string | string[] | boolean;
    methods?: HttpMethod[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
}
/**
 * Webhook configuration
 */
export interface WebhookConfig {
    url: string;
    events: WebhookEventType[];
    secret?: string;
    headers?: Record<string, string>;
    retryPolicy?: WebhookRetryPolicy;
    timeout?: number;
    active?: boolean;
    description?: string;
}
/**
 * Webhook retry policy
 */
export interface WebhookRetryPolicy {
    maxAttempts: number;
    backoffStrategy: 'exponential' | 'linear' | 'fixed';
    initialDelay: number;
    maxDelay?: number;
    retryableStatusCodes?: number[];
}
/**
 * Webhook payload
 */
export interface WebhookPayload {
    event: WebhookEventType;
    timestamp: Date;
    data: Record<string, any>;
    webhookId: string;
    deliveryAttempt?: number;
    signature?: string;
}
/**
 * Webhook delivery result
 */
export interface WebhookDeliveryResult {
    webhookId: string;
    status: WebhookStatus;
    statusCode?: number;
    response?: any;
    error?: string;
    deliveredAt?: Date;
    nextRetryAt?: Date;
    attempts: number;
}
/**
 * API key configuration
 */
export interface ApiKeyConfig {
    name: string;
    description?: string;
    scopes?: string[];
    expiresAt?: Date;
    rateLimit?: RateLimitConfig;
    ipWhitelist?: string[];
    metadata?: Record<string, any>;
}
/**
 * API key validation result
 */
export interface ApiKeyValidation {
    valid: boolean;
    apiKeyId?: string;
    userId?: string;
    scopes?: string[];
    rateLimit?: RateLimitConfig;
    errors?: string[];
}
/**
 * JWT token payload
 */
export interface JwtPayload {
    sub: string;
    iss?: string;
    aud?: string;
    exp?: number;
    iat?: number;
    nbf?: number;
    jti?: string;
    scopes?: string[];
    [key: string]: any;
}
/**
 * JWT configuration
 */
export interface JwtConfig {
    secret: string;
    expiresIn?: string | number;
    algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
    issuer?: string;
    audience?: string;
    notBefore?: string | number;
}
/**
 * OAuth2 token response
 */
export interface OAuth2TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}
/**
 * API request transformation
 */
export interface RequestTransform {
    headers?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    path?: string;
    method?: HttpMethod;
}
/**
 * API response transformation
 */
export interface ResponseTransform {
    statusCode?: number;
    headers?: Record<string, string>;
    body?: any;
    format?: 'json' | 'xml' | 'text' | 'binary';
}
/**
 * API error response
 */
export interface ApiErrorResponse {
    statusCode: number;
    error: string;
    message: string;
    details?: any;
    timestamp: string;
    path?: string;
    requestId?: string;
}
/**
 * API pagination options
 */
export interface PaginationOptions {
    page?: number;
    limit?: number;
    offset?: number;
    cursor?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * API pagination response
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
        nextCursor?: string;
        prevCursor?: string;
    };
}
/**
 * API metrics
 */
export interface ApiMetrics {
    endpoint: string;
    method: HttpMethod;
    statusCode: number;
    responseTime: number;
    requestSize?: number;
    responseSize?: number;
    userId?: string;
    apiKeyId?: string;
    timestamp: Date;
    userAgent?: string;
    ipAddress?: string;
}
/**
 * Rate limit status
 */
export interface RateLimitStatus {
    limit: number;
    remaining: number;
    reset: Date;
    retryAfter?: number;
}
/**
 * HMAC signature configuration
 */
export interface HmacConfig {
    secret: string;
    algorithm: 'sha256' | 'sha512';
    header?: string;
    encoding?: 'hex' | 'base64';
}
/**
 * GraphQL query configuration
 */
export interface GraphQLConfig {
    endpoint: string;
    query: string;
    variables?: Record<string, any>;
    operationName?: string;
    headers?: Record<string, string>;
}
/**
 * API Integration model attributes
 */
export interface ApiIntegrationAttributes {
    id: string;
    name: string;
    description?: string;
    type: string;
    baseUrl?: string;
    authenticationType: string;
    authConfig?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
    retryPolicy?: Record<string, any>;
    rateLimit?: Record<string, any>;
    active: boolean;
    metadata?: Record<string, any>;
    ownerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Webhook model attributes
 */
export interface WebhookAttributes {
    id: string;
    integrationId?: string;
    url: string;
    events: string[];
    secret?: string;
    headers?: Record<string, string>;
    retryPolicy?: Record<string, any>;
    timeout: number;
    active: boolean;
    lastDeliveredAt?: Date;
    failureCount: number;
    successCount: number;
    description?: string;
    ownerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * API Key model attributes
 */
export interface ApiKeyAttributes {
    id: string;
    name: string;
    keyHash: string;
    keyPrefix: string;
    description?: string;
    scopes?: string[];
    expiresAt?: Date;
    lastUsedAt?: Date;
    rateLimit?: Record<string, any>;
    ipWhitelist?: string[];
    metadata?: Record<string, any>;
    active: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates ApiIntegration model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ApiIntegrationAttributes>>} ApiIntegration model
 *
 * @example
 * ```typescript
 * const IntegrationModel = createApiIntegrationModel(sequelize);
 * const integration = await IntegrationModel.create({
 *   name: 'DocuSign Integration',
 *   type: 'REST',
 *   baseUrl: 'https://api.docusign.com/v2',
 *   authenticationType: 'OAUTH2',
 *   active: true,
 *   ownerId: 'user-uuid'
 * });
 * ```
 */
export declare const createApiIntegrationModel: (sequelize: Sequelize) => any;
/**
 * Creates Webhook model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<WebhookAttributes>>} Webhook model
 *
 * @example
 * ```typescript
 * const WebhookModel = createWebhookModel(sequelize);
 * const webhook = await WebhookModel.create({
 *   url: 'https://example.com/webhook',
 *   events: ['document.signed', 'document.created'],
 *   secret: 'webhook-secret-key',
 *   timeout: 10000,
 *   active: true,
 *   ownerId: 'user-uuid'
 * });
 * ```
 */
export declare const createWebhookModel: (sequelize: Sequelize) => any;
/**
 * Creates ApiKey model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ApiKeyAttributes>>} ApiKey model
 *
 * @example
 * ```typescript
 * const ApiKeyModel = createApiKeyModel(sequelize);
 * const apiKey = await ApiKeyModel.create({
 *   name: 'Production API Key',
 *   keyHash: hashedKey,
 *   keyPrefix: 'wc_live_',
 *   scopes: ['documents:read', 'documents:write'],
 *   active: true,
 *   ownerId: 'user-uuid'
 * });
 * ```
 */
export declare const createApiKeyModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates REST API endpoint configuration.
 *
 * @param {ApiEndpointConfig} config - Endpoint configuration
 * @returns {ApiEndpointConfig} Validated endpoint config
 *
 * @example
 * ```typescript
 * const endpoint = createRestEndpoint({
 *   path: '/api/v1/documents/:id',
 *   method: 'GET',
 *   controller: 'DocumentsController',
 *   action: 'getDocument',
 *   authentication: 'JWT',
 *   rateLimit: { maxRequests: 100, window: '1m' }
 * });
 * ```
 */
export declare const createRestEndpoint: (config: ApiEndpointConfig) => ApiEndpointConfig;
/**
 * 2. Generates OpenAPI/Swagger specification.
 *
 * @param {ApiEndpointConfig[]} endpoints - Array of endpoints
 * @returns {Record<string, any>} OpenAPI 3.0 specification
 *
 * @example
 * ```typescript
 * const spec = generateOpenApiSpec([endpoint1, endpoint2]);
 * console.log(JSON.stringify(spec, null, 2));
 * ```
 */
export declare const generateOpenApiSpec: (endpoints: ApiEndpointConfig[]) => Record<string, any>;
/**
 * 3. Creates GraphQL resolver configuration.
 *
 * @param {string} typeName - GraphQL type name
 * @param {string} fieldName - Field name
 * @param {Function} resolver - Resolver function
 * @returns {Record<string, any>} Resolver configuration
 *
 * @example
 * ```typescript
 * const resolver = createGraphQLResolver('Query', 'document', async (parent, args, context) => {
 *   return context.documentService.findById(args.id);
 * });
 * ```
 */
export declare const createGraphQLResolver: (typeName: string, fieldName: string, resolver: Function) => Record<string, any>;
/**
 * 4. Configures CORS for API endpoints.
 *
 * @param {CorsConfig} config - CORS configuration
 * @returns {Record<string, any>} Express CORS options
 *
 * @example
 * ```typescript
 * const corsOptions = configureCors({
 *   origin: ['https://app.whitecross.com'],
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   credentials: true
 * });
 * ```
 */
export declare const configureCors: (config: CorsConfig) => Record<string, any>;
/**
 * 5. Creates API versioning middleware.
 *
 * @param {string} defaultVersion - Default API version
 * @returns {Function} Express middleware function
 *
 * @example
 * ```typescript
 * const versionMiddleware = createApiVersioning('v1');
 * app.use(versionMiddleware);
 * ```
 */
export declare const createApiVersioning: (defaultVersion: string) => Function;
/**
 * 6. Registers NestJS controller with decorators.
 *
 * @param {string} controllerPath - Controller base path
 * @param {Record<string, any>} metadata - Controller metadata
 * @returns {Record<string, any>} Controller configuration
 *
 * @example
 * ```typescript
 * const controller = registerNestController('/documents', {
 *   version: 'v1',
 *   guards: ['JwtAuthGuard'],
 *   interceptors: ['LoggingInterceptor']
 * });
 * ```
 */
export declare const registerNestController: (controllerPath: string, metadata: Record<string, any>) => Record<string, any>;
/**
 * 7. Creates API route handler with validation.
 *
 * @param {Function} handler - Route handler function
 * @param {Record<string, any>} validation - Validation schema
 * @returns {Function} Validated route handler
 *
 * @example
 * ```typescript
 * const handler = createRouteHandler(async (req, res) => {
 *   const document = await getDocument(req.params.id);
 *   res.json(document);
 * }, { params: { id: 'uuid' } });
 * ```
 */
export declare const createRouteHandler: (handler: Function, validation: Record<string, any>) => Function;
/**
 * 8. Registers webhook endpoint.
 *
 * @param {WebhookConfig} config - Webhook configuration
 * @returns {Promise<string>} Webhook ID
 *
 * @example
 * ```typescript
 * const webhookId = await registerWebhook({
 *   url: 'https://example.com/webhooks/documents',
 *   events: ['document.signed', 'document.created'],
 *   secret: 'webhook-secret-123',
 *   retryPolicy: { maxAttempts: 3, backoffStrategy: 'exponential', initialDelay: 1000 }
 * });
 * ```
 */
export declare const registerWebhook: (config: WebhookConfig) => Promise<string>;
/**
 * 9. Delivers webhook payload.
 *
 * @param {string} webhookId - Webhook identifier
 * @param {WebhookPayload} payload - Webhook payload
 * @returns {Promise<WebhookDeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverWebhook('webhook-123', {
 *   event: 'document.signed',
 *   timestamp: new Date(),
 *   data: { documentId: 'doc-456', signedBy: 'user-789' },
 *   webhookId: 'webhook-123'
 * });
 * ```
 */
export declare const deliverWebhook: (webhookId: string, payload: WebhookPayload) => Promise<WebhookDeliveryResult>;
/**
 * 10. Generates HMAC signature for webhook.
 *
 * @param {Record<string, any>} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @param {HmacConfig} [config] - HMAC configuration
 * @returns {string} HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(payload, 'secret-key', {
 *   algorithm: 'sha256',
 *   encoding: 'hex'
 * });
 * ```
 */
export declare const generateWebhookSignature: (payload: Record<string, any>, secret: string, config?: Partial<HmacConfig>) => string;
/**
 * 11. Verifies webhook HMAC signature.
 *
 * @param {Record<string, any>} payload - Webhook payload
 * @param {string} signature - Received signature
 * @param {string} secret - Webhook secret
 * @param {HmacConfig} [config] - HMAC configuration
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(payload, receivedSignature, 'secret-key');
 * ```
 */
export declare const verifyWebhookSignature: (payload: Record<string, any>, signature: string, secret: string, config?: Partial<HmacConfig>) => boolean;
/**
 * 12. Retries failed webhook delivery.
 *
 * @param {string} webhookId - Webhook identifier
 * @param {WebhookPayload} payload - Webhook payload
 * @param {WebhookRetryPolicy} retryPolicy - Retry policy
 * @returns {Promise<WebhookDeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await retryWebhookDelivery('webhook-123', payload, {
 *   maxAttempts: 5,
 *   backoffStrategy: 'exponential',
 *   initialDelay: 1000,
 *   maxDelay: 60000
 * });
 * ```
 */
export declare const retryWebhookDelivery: (webhookId: string, payload: WebhookPayload, retryPolicy: WebhookRetryPolicy) => Promise<WebhookDeliveryResult>;
/**
 * 13. Lists webhooks for integration.
 *
 * @param {string} [integrationId] - Integration identifier
 * @param {boolean} [activeOnly] - Return only active webhooks
 * @returns {Promise<WebhookConfig[]>} List of webhooks
 *
 * @example
 * ```typescript
 * const webhooks = await listWebhooks('integration-123', true);
 * ```
 */
export declare const listWebhooks: (integrationId?: string, activeOnly?: boolean) => Promise<WebhookConfig[]>;
/**
 * 14. Deactivates webhook.
 *
 * @param {string} webhookId - Webhook identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deactivateWebhook('webhook-123');
 * ```
 */
export declare const deactivateWebhook: (webhookId: string) => Promise<void>;
/**
 * 15. Generates API key.
 *
 * @param {ApiKeyConfig} config - API key configuration
 * @returns {Promise<{ apiKey: string; keyId: string }>} Generated API key and ID
 *
 * @example
 * ```typescript
 * const { apiKey, keyId } = await generateApiKey({
 *   name: 'Production API Key',
 *   scopes: ['documents:read', 'documents:write'],
 *   expiresAt: new Date('2025-12-31')
 * });
 * ```
 */
export declare const generateApiKey: (config: ApiKeyConfig) => Promise<{
    apiKey: string;
    keyId: string;
}>;
/**
 * 16. Validates API key.
 *
 * @param {string} apiKey - API key to validate
 * @param {string} [ipAddress] - Client IP address
 * @returns {Promise<ApiKeyValidation>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateApiKey('wc_live_abc123...', '192.168.1.1');
 * if (validation.valid) {
 *   console.log('API key is valid for scopes:', validation.scopes);
 * }
 * ```
 */
export declare const validateApiKey: (apiKey: string, ipAddress?: string) => Promise<ApiKeyValidation>;
/**
 * 17. Generates JWT token.
 *
 * @param {JwtPayload} payload - Token payload
 * @param {JwtConfig} config - JWT configuration
 * @returns {Promise<string>} JWT token
 *
 * @example
 * ```typescript
 * const token = await generateJwtToken({
 *   sub: 'user-123',
 *   scopes: ['documents:read']
 * }, {
 *   secret: 'jwt-secret',
 *   expiresIn: '1h',
 *   issuer: 'whitecross.com'
 * });
 * ```
 */
export declare const generateJwtToken: (payload: JwtPayload, config: JwtConfig) => Promise<string>;
/**
 * 18. Verifies JWT token.
 *
 * @param {string} token - JWT token
 * @param {JwtConfig} config - JWT configuration
 * @returns {Promise<JwtPayload>} Decoded token payload
 *
 * @example
 * ```typescript
 * const payload = await verifyJwtToken(token, { secret: 'jwt-secret' });
 * console.log('User ID:', payload.sub);
 * ```
 */
export declare const verifyJwtToken: (token: string, config: JwtConfig) => Promise<JwtPayload>;
/**
 * 19. Refreshes OAuth2 access token.
 *
 * @param {string} refreshToken - Refresh token
 * @param {string} clientId - OAuth2 client ID
 * @param {string} clientSecret - OAuth2 client secret
 * @param {string} tokenUrl - Token endpoint URL
 * @returns {Promise<OAuth2TokenResponse>} New access token
 *
 * @example
 * ```typescript
 * const tokens = await refreshOAuth2Token(refreshToken, 'client-id', 'client-secret', 'https://oauth.example.com/token');
 * ```
 */
export declare const refreshOAuth2Token: (refreshToken: string, clientId: string, clientSecret: string, tokenUrl: string) => Promise<OAuth2TokenResponse>;
/**
 * 20. Creates basic authentication header.
 *
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {string} Base64 encoded basic auth header
 *
 * @example
 * ```typescript
 * const authHeader = createBasicAuthHeader('user', 'password');
 * // Returns: 'Basic dXNlcjpwYXNzd29yZA=='
 * ```
 */
export declare const createBasicAuthHeader: (username: string, password: string) => string;
/**
 * 21. Validates bearer token.
 *
 * @param {string} token - Bearer token
 * @param {JwtConfig} config - JWT configuration
 * @returns {Promise<{ valid: boolean; payload?: JwtPayload }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateBearerToken(token, jwtConfig);
 * if (result.valid) {
 *   console.log('User:', result.payload.sub);
 * }
 * ```
 */
export declare const validateBearerToken: (token: string, config: JwtConfig) => Promise<{
    valid: boolean;
    payload?: JwtPayload;
}>;
/**
 * 22. Creates rate limiter middleware.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const rateLimiter = createRateLimiter({
 *   maxRequests: 100,
 *   window: '1m',
 *   strategy: 'sliding'
 * });
 * app.use('/api', rateLimiter);
 * ```
 */
export declare const createRateLimiter: (config: RateLimitConfig) => Function;
/**
 * 23. Checks rate limit status.
 *
 * @param {string} key - Rate limit key (user ID, API key, IP)
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Promise<RateLimitStatus>} Current rate limit status
 *
 * @example
 * ```typescript
 * const status = await checkRateLimit('user-123', {
 *   maxRequests: 100,
 *   window: '1h'
 * });
 * console.log('Remaining:', status.remaining);
 * ```
 */
export declare const checkRateLimit: (key: string, config: RateLimitConfig) => Promise<RateLimitStatus>;
/**
 * 24. Parses rate limit window to milliseconds.
 *
 * @param {RateLimitWindow} window - Rate limit window
 * @returns {number} Window in milliseconds
 *
 * @example
 * ```typescript
 * const ms = parseRateLimitWindow('1h'); // Returns 3600000
 * ```
 */
export declare const parseRateLimitWindow: (window: RateLimitWindow) => number;
/**
 * 25. Records API request for rate limiting.
 *
 * @param {string} key - Rate limit key
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordRateLimitRequest('api-key-123', rateLimitConfig);
 * ```
 */
export declare const recordRateLimitRequest: (key: string, config: RateLimitConfig) => Promise<void>;
/**
 * 26. Resets rate limit for key.
 *
 * @param {string} key - Rate limit key
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resetRateLimit('user-123');
 * ```
 */
export declare const resetRateLimit: (key: string) => Promise<void>;
/**
 * 27. Creates custom rate limit key generator.
 *
 * @param {string[]} fields - Fields to include in key
 * @returns {Function} Key generator function
 *
 * @example
 * ```typescript
 * const keyGen = createRateLimitKeyGenerator(['userId', 'apiKey']);
 * const key = keyGen(req); // Returns 'user-123:api-key-456'
 * ```
 */
export declare const createRateLimitKeyGenerator: (fields: string[]) => Function;
/**
 * 28. Transforms request payload.
 *
 * @param {any} payload - Original payload
 * @param {RequestTransform} transform - Transformation configuration
 * @returns {any} Transformed payload
 *
 * @example
 * ```typescript
 * const transformed = transformRequestPayload(originalData, {
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { ...originalData.body, timestamp: new Date() }
 * });
 * ```
 */
export declare const transformRequestPayload: (payload: any, transform: RequestTransform) => any;
/**
 * 29. Transforms response payload.
 *
 * @param {any} payload - Original response
 * @param {ResponseTransform} transform - Transformation configuration
 * @returns {any} Transformed response
 *
 * @example
 * ```typescript
 * const transformed = transformResponsePayload(apiResponse, {
 *   statusCode: 200,
 *   body: { success: true, data: apiResponse }
 * });
 * ```
 */
export declare const transformResponsePayload: (payload: any, transform: ResponseTransform) => any;
/**
 * 30. Serializes payload to format.
 *
 * @param {any} data - Data to serialize
 * @param {string} format - Output format (json, xml, text)
 * @returns {string} Serialized data
 *
 * @example
 * ```typescript
 * const json = serializePayload({ name: 'Document' }, 'json');
 * const xml = serializePayload({ name: 'Document' }, 'xml');
 * ```
 */
export declare const serializePayload: (data: any, format: string) => string;
/**
 * 31. Deserializes payload from format.
 *
 * @param {string} data - Serialized data
 * @param {string} format - Input format
 * @returns {any} Deserialized data
 *
 * @example
 * ```typescript
 * const obj = deserializePayload('{"name":"Document"}', 'json');
 * ```
 */
export declare const deserializePayload: (data: string, format: string) => any;
/**
 * 32. Validates payload against schema.
 *
 * @param {any} payload - Payload to validate
 * @param {Record<string, any>} schema - Validation schema
 * @returns {{ valid: boolean; errors?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePayload(requestBody, {
 *   type: 'object',
 *   required: ['name', 'email'],
 *   properties: {
 *     name: { type: 'string' },
 *     email: { type: 'string', format: 'email' }
 *   }
 * });
 * ```
 */
export declare const validatePayload: (payload: any, schema: Record<string, any>) => {
    valid: boolean;
    errors?: string[];
};
/**
 * 33. Sanitizes payload data.
 *
 * @param {any} payload - Payload to sanitize
 * @param {string[]} allowedFields - Allowed field names
 * @returns {any} Sanitized payload
 *
 * @example
 * ```typescript
 * const sanitized = sanitizePayload(userInput, ['name', 'email', 'phone']);
 * ```
 */
export declare const sanitizePayload: (payload: any, allowedFields: string[]) => any;
/**
 * 34. Creates paginated response.
 *
 * @param {any[]} data - Array of items
 * @param {PaginationOptions} options - Pagination options
 * @param {number} total - Total item count
 * @returns {PaginatedResponse<any>} Paginated response
 *
 * @example
 * ```typescript
 * const response = createPaginatedResponse(documents, {
 *   page: 1,
 *   limit: 20
 * }, 150);
 * ```
 */
export declare const createPaginatedResponse: <T>(data: T[], options: PaginationOptions, total: number) => PaginatedResponse<T>;
/**
 * 35. Creates API error response.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {any} [details] - Additional error details
 * @returns {ApiErrorResponse} Formatted error response
 *
 * @example
 * ```typescript
 * const error = createApiError(404, 'Document not found', { documentId: 'doc-123' });
 * ```
 */
export declare const createApiError: (statusCode: number, message: string, details?: any) => ApiErrorResponse;
/**
 * 36. Creates global exception filter.
 *
 * @returns {Function} NestJS exception filter
 *
 * @example
 * ```typescript
 * const filter = createGlobalExceptionFilter();
 * app.useGlobalFilters(filter);
 * ```
 */
export declare const createGlobalExceptionFilter: () => Function;
/**
 * 37. Handles validation errors.
 *
 * @param {any} validationErrors - Validation error object
 * @returns {ApiErrorResponse} Formatted validation error
 *
 * @example
 * ```typescript
 * const error = handleValidationError({
 *   name: ['Name is required'],
 *   email: ['Invalid email format']
 * });
 * ```
 */
export declare const handleValidationError: (validationErrors: any) => ApiErrorResponse;
/**
 * 38. Creates timeout error handler.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Function} Timeout middleware
 *
 * @example
 * ```typescript
 * const timeoutHandler = createTimeoutHandler(30000);
 * app.use(timeoutHandler);
 * ```
 */
export declare const createTimeoutHandler: (timeoutMs: number) => Function;
/**
 * 39. Logs API errors.
 *
 * @param {Error} error - Error object
 * @param {any} context - Request context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logApiError(error, {
 *   path: '/api/documents',
 *   method: 'POST',
 *   userId: 'user-123'
 * });
 * ```
 */
export declare const logApiError: (error: Error, context: any) => Promise<void>;
/**
 * 40. Creates circuit breaker for API calls.
 *
 * @param {number} failureThreshold - Number of failures before opening
 * @param {number} resetTimeout - Time before attempting reset
 * @returns {Function} Circuit breaker wrapper
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker(5, 60000);
 * const result = await breaker(() => externalApiCall());
 * ```
 */
export declare const createCircuitBreaker: (failureThreshold: number, resetTimeout: number) => Function;
/**
 * 41. Records API metrics.
 *
 * @param {ApiMetrics} metrics - API metrics data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordApiMetrics({
 *   endpoint: '/api/v1/documents',
 *   method: 'GET',
 *   statusCode: 200,
 *   responseTime: 145,
 *   userId: 'user-123',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const recordApiMetrics: (metrics: ApiMetrics) => Promise<void>;
/**
 * 42. Creates API logging middleware.
 *
 * @param {Record<string, any>} options - Logging options
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const logger = createApiLogger({
 *   logRequests: true,
 *   logResponses: true,
 *   sensitiveHeaders: ['authorization']
 * });
 * app.use(logger);
 * ```
 */
export declare const createApiLogger: (options: Record<string, any>) => Function;
/**
 * 43. Tracks API usage by endpoint.
 *
 * @param {string} endpoint - API endpoint
 * @param {string} userId - User identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackApiUsage('/api/v1/documents', 'user-123');
 * ```
 */
export declare const trackApiUsage: (endpoint: string, userId: string) => Promise<void>;
/**
 * 44. Generates API usage report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {string} [userId] - Optional user filter
 * @returns {Promise<Record<string, any>>} Usage report
 *
 * @example
 * ```typescript
 * const report = await generateApiUsageReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare const generateApiUsageReport: (startDate: Date, endDate: Date, userId?: string) => Promise<Record<string, any>>;
/**
 * 45. Creates health check endpoint.
 *
 * @param {Function[]} healthChecks - Array of health check functions
 * @returns {Function} Health check handler
 *
 * @example
 * ```typescript
 * const healthCheck = createHealthCheckEndpoint([
 *   async () => ({ database: await checkDatabase() }),
 *   async () => ({ cache: await checkCache() })
 * ]);
 * app.get('/health', healthCheck);
 * ```
 */
export declare const createHealthCheckEndpoint: (healthChecks: Function[]) => Function;
declare const _default: {
    createApiIntegrationModel: (sequelize: Sequelize) => any;
    createWebhookModel: (sequelize: Sequelize) => any;
    createApiKeyModel: (sequelize: Sequelize) => any;
    createRestEndpoint: (config: ApiEndpointConfig) => ApiEndpointConfig;
    generateOpenApiSpec: (endpoints: ApiEndpointConfig[]) => Record<string, any>;
    createGraphQLResolver: (typeName: string, fieldName: string, resolver: Function) => Record<string, any>;
    configureCors: (config: CorsConfig) => Record<string, any>;
    createApiVersioning: (defaultVersion: string) => Function;
    registerNestController: (controllerPath: string, metadata: Record<string, any>) => Record<string, any>;
    createRouteHandler: (handler: Function, validation: Record<string, any>) => Function;
    registerWebhook: (config: WebhookConfig) => Promise<string>;
    deliverWebhook: (webhookId: string, payload: WebhookPayload) => Promise<WebhookDeliveryResult>;
    generateWebhookSignature: (payload: Record<string, any>, secret: string, config?: Partial<HmacConfig>) => string;
    verifyWebhookSignature: (payload: Record<string, any>, signature: string, secret: string, config?: Partial<HmacConfig>) => boolean;
    retryWebhookDelivery: (webhookId: string, payload: WebhookPayload, retryPolicy: WebhookRetryPolicy) => Promise<WebhookDeliveryResult>;
    listWebhooks: (integrationId?: string, activeOnly?: boolean) => Promise<WebhookConfig[]>;
    deactivateWebhook: (webhookId: string) => Promise<void>;
    generateApiKey: (config: ApiKeyConfig) => Promise<{
        apiKey: string;
        keyId: string;
    }>;
    validateApiKey: (apiKey: string, ipAddress?: string) => Promise<ApiKeyValidation>;
    generateJwtToken: (payload: JwtPayload, config: JwtConfig) => Promise<string>;
    verifyJwtToken: (token: string, config: JwtConfig) => Promise<JwtPayload>;
    refreshOAuth2Token: (refreshToken: string, clientId: string, clientSecret: string, tokenUrl: string) => Promise<OAuth2TokenResponse>;
    createBasicAuthHeader: (username: string, password: string) => string;
    validateBearerToken: (token: string, config: JwtConfig) => Promise<{
        valid: boolean;
        payload?: JwtPayload;
    }>;
    createRateLimiter: (config: RateLimitConfig) => Function;
    checkRateLimit: (key: string, config: RateLimitConfig) => Promise<RateLimitStatus>;
    parseRateLimitWindow: (window: RateLimitWindow) => number;
    recordRateLimitRequest: (key: string, config: RateLimitConfig) => Promise<void>;
    resetRateLimit: (key: string) => Promise<void>;
    createRateLimitKeyGenerator: (fields: string[]) => Function;
    transformRequestPayload: (payload: any, transform: RequestTransform) => any;
    transformResponsePayload: (payload: any, transform: ResponseTransform) => any;
    serializePayload: (data: any, format: string) => string;
    deserializePayload: (data: string, format: string) => any;
    validatePayload: (payload: any, schema: Record<string, any>) => {
        valid: boolean;
        errors?: string[];
    };
    sanitizePayload: (payload: any, allowedFields: string[]) => any;
    createPaginatedResponse: <T>(data: T[], options: PaginationOptions, total: number) => PaginatedResponse<T>;
    createApiError: (statusCode: number, message: string, details?: any) => ApiErrorResponse;
    createGlobalExceptionFilter: () => Function;
    handleValidationError: (validationErrors: any) => ApiErrorResponse;
    createTimeoutHandler: (timeoutMs: number) => Function;
    logApiError: (error: Error, context: any) => Promise<void>;
    createCircuitBreaker: (failureThreshold: number, resetTimeout: number) => Function;
    recordApiMetrics: (metrics: ApiMetrics) => Promise<void>;
    createApiLogger: (options: Record<string, any>) => Function;
    trackApiUsage: (endpoint: string, userId: string) => Promise<void>;
    generateApiUsageReport: (startDate: Date, endDate: Date, userId?: string) => Promise<Record<string, any>>;
    createHealthCheckEndpoint: (healthChecks: Function[]) => Function;
};
export default _default;
//# sourceMappingURL=document-api-integration-kit.d.ts.map