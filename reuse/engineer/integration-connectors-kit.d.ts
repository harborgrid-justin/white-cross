/**
 * LOC: INTCON123
 * File: /reuse/engineer/integration-connectors-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Integration services and controllers
 *   - External API adapters
 *   - Webhook handlers and processors
 */
interface APIConnectorConfig {
    name: string;
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    auth?: AuthConfig;
    retryConfig?: RetryConfig;
    rateLimitConfig?: RateLimitConfig;
    healthCheckEndpoint?: string;
    version?: string;
}
interface AuthConfig {
    type: 'none' | 'basic' | 'bearer' | 'api-key' | 'oauth2' | 'custom';
    credentials?: {
        username?: string;
        password?: string;
        token?: string;
        apiKey?: string;
        apiKeyHeader?: string;
    };
    oauth2?: OAuth2Config;
    customAuthFunction?: (request: any) => any;
}
interface OAuth2Config {
    clientId: string;
    clientSecret: string;
    authorizationURL: string;
    tokenURL: string;
    redirectURL: string;
    scope?: string[];
    grantType: 'authorization_code' | 'client_credentials' | 'password' | 'refresh_token';
    state?: string;
    pkce?: boolean;
}
interface OAuth2TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    issued_at: Date;
    expires_at: Date;
}
interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    retryableStatusCodes?: number[];
    retryableErrors?: string[];
    backoffStrategy?: 'fixed' | 'exponential' | 'linear';
    maxRetryDelay?: number;
}
interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    strategy?: 'fixed-window' | 'sliding-window' | 'token-bucket';
    burstLimit?: number;
}
interface APIRequest {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    endpoint: string;
    params?: Record<string, any>;
    data?: any;
    headers?: Record<string, string>;
    timeout?: number;
}
interface APIResponse<T = any> {
    status: number;
    statusText: string;
    data: T;
    headers: Record<string, string>;
    requestId?: string;
    responseTime: number;
}
interface WebhookConfig {
    id: string;
    url: string;
    events: string[];
    secret: string;
    active: boolean;
    retryConfig?: RetryConfig;
    headers?: Record<string, string>;
    signatureHeader?: string;
    signatureAlgorithm?: 'sha256' | 'sha1' | 'md5';
}
interface WebhookPayload {
    event: string;
    timestamp: Date;
    data: any;
    metadata?: Record<string, any>;
}
interface WebhookValidationResult {
    valid: boolean;
    signature?: string;
    errors?: string[];
}
interface DataMapping {
    sourceField: string;
    targetField: string;
    transform?: TransformFunction;
    defaultValue?: any;
    required?: boolean;
}
type TransformFunction = (value: any, context?: any) => any;
interface MappingContext {
    source: Record<string, any>;
    target: Record<string, any>;
    options?: Record<string, any>;
}
interface IntegrationError {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
    timestamp: Date;
    requestId?: string;
}
interface HealthCheckResult {
    healthy: boolean;
    status: 'operational' | 'degraded' | 'down';
    latency?: number;
    lastChecked: Date;
    details?: Record<string, any>;
    errors?: string[];
}
interface SyncConfig {
    source: string;
    target: string;
    batchSize: number;
    syncMode: 'full' | 'incremental' | 'delta';
    conflictResolution: 'source-wins' | 'target-wins' | 'latest-wins' | 'manual';
    filters?: Record<string, any>;
    mappings: DataMapping[];
}
interface SyncResult {
    syncId: string;
    status: 'completed' | 'partial' | 'failed';
    startTime: Date;
    endTime: Date;
    recordsProcessed: number;
    recordsCreated: number;
    recordsUpdated: number;
    recordsFailed: number;
    errors: IntegrationError[];
}
interface RateLimitState {
    requests: number[];
    tokens: number;
    lastRefill: Date;
}
interface IntegrationEvent {
    id: string;
    type: string;
    source: string;
    timestamp: Date;
    data: any;
    metadata?: Record<string, any>;
}
interface EventHandler {
    eventType: string;
    handler: (event: IntegrationEvent) => Promise<void>;
    priority?: number;
}
/**
 * 1. Creates a generic API connector with configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     APIConnectorConfig:
 *       type: object
 *       required:
 *         - name
 *         - baseURL
 *       properties:
 *         name:
 *           type: string
 *           description: Connector name
 *         baseURL:
 *           type: string
 *           description: Base URL for API
 *         timeout:
 *           type: number
 *           description: Request timeout in milliseconds
 *         headers:
 *           type: object
 *           additionalProperties:
 *             type: string
 *         auth:
 *           $ref: '#/components/schemas/AuthConfig'
 *
 * @param {APIConnectorConfig} config - Connector configuration
 * @returns {any} API connector instance
 *
 * @example
 * ```typescript
 * const connector = createAPIConnector({
 *   name: 'ehr-system',
 *   baseURL: 'https://api.ehrsystem.com',
 *   auth: { type: 'bearer', credentials: { token: 'abc123' } }
 * });
 * ```
 */
export declare const createAPIConnector: (config: APIConnectorConfig) => any;
/**
 * 2. Executes an API request with authentication and headers.
 *
 * @param {APIConnectorConfig} config - Connector configuration
 * @param {APIRequest} request - Request details
 * @returns {Promise<APIResponse>} API response
 *
 * @example
 * ```typescript
 * const response = await executeAPIRequest(config, {
 *   method: 'GET',
 *   endpoint: '/patients',
 *   params: { status: 'active' }
 * });
 * ```
 */
export declare const executeAPIRequest: (config: APIConnectorConfig, request: APIRequest) => Promise<APIResponse>;
/**
 * 3. Builds full request URL with parameters.
 *
 * @param {string} baseURL - Base URL
 * @param {string} endpoint - Endpoint path
 * @param {Record<string, any>} [params] - Query parameters
 * @returns {string} Full URL
 *
 * @example
 * ```typescript
 * const url = buildRequestURL('https://api.example.com', '/users', { page: 1 });
 * // Returns: "https://api.example.com/users?page=1"
 * ```
 */
export declare const buildRequestURL: (baseURL: string, endpoint: string, params?: Record<string, any>) => string;
/**
 * 4. Applies authentication to request headers.
 *
 * @param {Record<string, string>} headers - Request headers
 * @param {AuthConfig} auth - Authentication configuration
 *
 * @example
 * ```typescript
 * const headers = {};
 * applyAuthentication(headers, {
 *   type: 'bearer',
 *   credentials: { token: 'abc123' }
 * });
 * // headers.Authorization = "Bearer abc123"
 * ```
 */
export declare const applyAuthentication: (headers: Record<string, string>, auth: AuthConfig) => void;
/**
 * 5. Validates API connector configuration.
 *
 * @param {APIConnectorConfig} config - Configuration to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateConnectorConfig(config);
 * if (!validation.valid) {
 *   console.error('Config errors:', validation.errors);
 * }
 * ```
 */
export declare const validateConnectorConfig: (config: APIConnectorConfig) => {
    valid: boolean;
    errors: string[];
};
/**
 * 6. Generates OAuth2 authorization URL.
 *
 * @swagger
 * components:
 *   schemas:
 *     OAuth2Config:
 *       type: object
 *       required:
 *         - clientId
 *         - authorizationURL
 *         - redirectURL
 *       properties:
 *         clientId:
 *           type: string
 *         clientSecret:
 *           type: string
 *         authorizationURL:
 *           type: string
 *         tokenURL:
 *           type: string
 *         redirectURL:
 *           type: string
 *         scope:
 *           type: array
 *           items:
 *             type: string
 *
 * @param {OAuth2Config} config - OAuth2 configuration
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const authURL = generateOAuth2AuthorizationURL({
 *   clientId: 'client123',
 *   authorizationURL: 'https://auth.example.com/authorize',
 *   redirectURL: 'https://app.example.com/callback',
 *   scope: ['read', 'write']
 * });
 * ```
 */
export declare const generateOAuth2AuthorizationURL: (config: OAuth2Config) => string;
/**
 * 7. Exchanges authorization code for access token.
 *
 * @param {OAuth2Config} config - OAuth2 configuration
 * @param {string} authorizationCode - Authorization code from callback
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeOAuth2Code(oauth2Config, 'auth_code_123');
 * console.log('Access token:', tokens.access_token);
 * ```
 */
export declare const exchangeOAuth2Code: (config: OAuth2Config, authorizationCode: string) => Promise<OAuth2TokenResponse>;
/**
 * 8. Refreshes OAuth2 access token using refresh token.
 *
 * @param {OAuth2Config} config - OAuth2 configuration
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<OAuth2TokenResponse>} New token response
 *
 * @example
 * ```typescript
 * const newTokens = await refreshOAuth2Token(config, 'refresh_token_123');
 * ```
 */
export declare const refreshOAuth2Token: (config: OAuth2Config, refreshToken: string) => Promise<OAuth2TokenResponse>;
/**
 * 9. Validates OAuth2 token expiration.
 *
 * @param {OAuth2TokenResponse} token - Token to validate
 * @param {number} [bufferSeconds] - Buffer time in seconds before expiration
 * @returns {boolean} True if token is valid
 *
 * @example
 * ```typescript
 * if (!validateOAuth2Token(token, 300)) {
 *   // Token expires in less than 5 minutes, refresh it
 *   token = await refreshOAuth2Token(config, token.refresh_token);
 * }
 * ```
 */
export declare const validateOAuth2Token: (token: OAuth2TokenResponse, bufferSeconds?: number) => boolean;
/**
 * 10. Generates random state for OAuth2 CSRF protection.
 *
 * @returns {string} Random state string
 *
 * @example
 * ```typescript
 * const state = generateRandomState();
 * ```
 */
export declare const generateRandomState: () => string;
/**
 * 11. Creates a webhook configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     WebhookConfig:
 *       type: object
 *       required:
 *         - id
 *         - url
 *         - events
 *         - secret
 *       properties:
 *         id:
 *           type: string
 *         url:
 *           type: string
 *         events:
 *           type: array
 *           items:
 *             type: string
 *         secret:
 *           type: string
 *         active:
 *           type: boolean
 *
 * @param {Partial<WebhookConfig>} config - Webhook configuration
 * @returns {WebhookConfig} Complete webhook configuration
 *
 * @example
 * ```typescript
 * const webhook = createWebhookConfig({
 *   url: 'https://app.example.com/webhooks/events',
 *   events: ['patient.created', 'appointment.updated'],
 *   secret: 'webhook_secret_key'
 * });
 * ```
 */
export declare const createWebhookConfig: (config: Partial<WebhookConfig>) => WebhookConfig;
/**
 * 12. Generates webhook signature for payload.
 *
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @param {string} [algorithm] - Signature algorithm
 * @returns {string} Signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(payload, 'secret123', 'sha256');
 * ```
 */
export declare const generateWebhookSignature: (payload: WebhookPayload, secret: string, algorithm?: "sha256" | "sha1" | "md5") => string;
/**
 * 13. Validates webhook signature.
 *
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} receivedSignature - Signature from header
 * @param {string} secret - Webhook secret
 * @param {string} [algorithm] - Signature algorithm
 * @returns {WebhookValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateWebhookSignature(
 *   payload,
 *   req.headers['x-webhook-signature'],
 *   'secret123'
 * );
 * if (!validation.valid) {
 *   throw new Error('Invalid webhook signature');
 * }
 * ```
 */
export declare const validateWebhookSignature: (payload: WebhookPayload, receivedSignature: string, secret: string, algorithm?: "sha256" | "sha1" | "md5") => WebhookValidationResult;
/**
 * 14. Delivers webhook payload to URL.
 *
 * @param {WebhookConfig} config - Webhook configuration
 * @param {WebhookPayload} payload - Payload to send
 * @returns {Promise<{ success: boolean; response?: any; error?: any }>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverWebhook(webhookConfig, {
 *   event: 'patient.created',
 *   timestamp: new Date(),
 *   data: patientData
 * });
 * ```
 */
export declare const deliverWebhook: (config: WebhookConfig, payload: WebhookPayload) => Promise<{
    success: boolean;
    response?: any;
    error?: any;
}>;
/**
 * 15. Generates secure webhook secret.
 *
 * @returns {string} Webhook secret
 *
 * @example
 * ```typescript
 * const secret = generateWebhookSecret();
 * ```
 */
export declare const generateWebhookSecret: () => string;
/**
 * 16. Creates a data mapping configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     DataMapping:
 *       type: object
 *       required:
 *         - sourceField
 *         - targetField
 *       properties:
 *         sourceField:
 *           type: string
 *         targetField:
 *           type: string
 *         defaultValue:
 *           type: any
 *         required:
 *           type: boolean
 *
 * @param {Partial<DataMapping>} mapping - Mapping configuration
 * @returns {DataMapping} Complete mapping
 *
 * @example
 * ```typescript
 * const mapping = createDataMapping({
 *   sourceField: 'patient_name',
 *   targetField: 'name',
 *   transform: (value) => value.toUpperCase(),
 *   required: true
 * });
 * ```
 */
export declare const createDataMapping: (mapping: Partial<DataMapping>) => DataMapping;
/**
 * 17. Applies data mappings to transform source to target.
 *
 * @param {Record<string, any>} source - Source data
 * @param {DataMapping[]} mappings - Mapping configurations
 * @param {Record<string, any>} [options] - Transformation options
 * @returns {Record<string, any>} Transformed data
 *
 * @example
 * ```typescript
 * const transformed = applyDataMappings(sourceData, [
 *   { sourceField: 'first_name', targetField: 'firstName' },
 *   { sourceField: 'last_name', targetField: 'lastName' }
 * ]);
 * ```
 */
export declare const applyDataMappings: (source: Record<string, any>, mappings: DataMapping[], options?: Record<string, any>) => Record<string, any>;
/**
 * 18. Gets nested value from object using dot notation.
 *
 * @param {Record<string, any>} obj - Source object
 * @param {string} path - Dot-notation path
 * @returns {any} Value at path
 *
 * @example
 * ```typescript
 * const value = getNestedValue({ user: { name: 'John' } }, 'user.name');
 * // Returns: "John"
 * ```
 */
export declare const getNestedValue: (obj: Record<string, any>, path: string) => any;
/**
 * 19. Sets nested value in object using dot notation.
 *
 * @param {Record<string, any>} obj - Target object
 * @param {string} path - Dot-notation path
 * @param {any} value - Value to set
 *
 * @example
 * ```typescript
 * const obj = {};
 * setNestedValue(obj, 'user.profile.name', 'John');
 * // obj = { user: { profile: { name: 'John' } } }
 * ```
 */
export declare const setNestedValue: (obj: Record<string, any>, path: string, value: any) => void;
/**
 * 20. Creates common data transformation functions.
 *
 * @returns {Record<string, TransformFunction>} Transform functions
 *
 * @example
 * ```typescript
 * const transforms = createTransformFunctions();
 * const upperName = transforms.toUpperCase('john');
 * ```
 */
export declare const createTransformFunctions: () => Record<string, TransformFunction>;
/**
 * 21. Creates an integration error object.
 *
 * @swagger
 * components:
 *   schemas:
 *     IntegrationError:
 *       type: object
 *       required:
 *         - code
 *         - message
 *         - retryable
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         retryable:
 *           type: boolean
 *         details:
 *           type: object
 *
 * @param {any} error - Original error
 * @param {any} [context] - Error context
 * @returns {IntegrationError} Integration error
 *
 * @example
 * ```typescript
 * try {
 *   await apiCall();
 * } catch (err) {
 *   throw createIntegrationError(err, { endpoint: '/patients' });
 * }
 * ```
 */
export declare const createIntegrationError: (error: any, context?: any) => IntegrationError;
/**
 * 22. Determines if error is retryable.
 *
 * @param {any} error - Error to check
 * @param {RetryConfig} [config] - Retry configuration
 * @returns {boolean} True if retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(error, retryConfig)) {
 *   await retry();
 * }
 * ```
 */
export declare const isRetryableError: (error: any, config?: RetryConfig) => boolean;
/**
 * 23. Calculates retry delay with backoff strategy.
 *
 * @param {number} attemptNumber - Current attempt number (0-indexed)
 * @param {RetryConfig} config - Retry configuration
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(2, {
 *   retryDelay: 1000,
 *   backoffStrategy: 'exponential',
 *   maxRetryDelay: 30000
 * });
 * ```
 */
export declare const calculateRetryDelay: (attemptNumber: number, config: RetryConfig) => number;
/**
 * 24. Executes function with retry logic.
 *
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   () => apiConnector.get('/data'),
 *   { maxRetries: 3, retryDelay: 1000, backoffStrategy: 'exponential' }
 * );
 * ```
 */
export declare const executeWithRetry: <T>(fn: () => Promise<T>, config: RetryConfig) => Promise<T>;
/**
 * 25. Circuit breaker for failing integrations.
 *
 * @param {string} integrationName - Integration identifier
 * @returns {any} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker('ehr-api');
 * const result = await breaker.execute(() => apiCall());
 * ```
 */
export declare const createCircuitBreaker: (integrationName: string) => any;
/**
 * 26. Initializes rate limit state.
 *
 * @param {RateLimitConfig} [config] - Rate limit configuration
 * @returns {RateLimitState} Initial state
 *
 * @example
 * ```typescript
 * const state = initializeRateLimitState({
 *   maxRequests: 100,
 *   windowMs: 60000
 * });
 * ```
 */
export declare const initializeRateLimitState: (config?: RateLimitConfig) => RateLimitState;
/**
 * 27. Enforces rate limit before making request.
 *
 * @param {RateLimitState} state - Current rate limit state
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Promise<void>} Resolves when request can proceed
 *
 * @example
 * ```typescript
 * await enforceRateLimit(rateLimitState, rateLimitConfig);
 * // Now safe to make API request
 * ```
 */
export declare const enforceRateLimit: (state: RateLimitState, config: RateLimitConfig) => Promise<void>;
/**
 * 28. Gets current rate limit status.
 *
 * @param {RateLimitState} state - Rate limit state
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {any} Rate limit status
 *
 * @example
 * ```typescript
 * const status = getRateLimitStatus(state, config);
 * console.log(`Remaining: ${status.remaining}/${status.limit}`);
 * ```
 */
export declare const getRateLimitStatus: (state: RateLimitState, config: RateLimitConfig) => any;
/**
 * 29. Creates rate limiter middleware.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {any} Rate limiter middleware
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   maxRequests: 1000,
 *   windowMs: 3600000 // 1 hour
 * });
 * ```
 */
export declare const createRateLimiter: (config: RateLimitConfig) => any;
/**
 * 30. Handles rate limit exceeded response.
 *
 * @param {any} response - API response
 * @returns {number} Retry after seconds
 *
 * @example
 * ```typescript
 * const retryAfter = handleRateLimitResponse(response);
 * await sleep(retryAfter * 1000);
 * ```
 */
export declare const handleRateLimitResponse: (response: any) => number;
/**
 * 31. Performs health check on API integration.
 *
 * @swagger
 * /api/integrations/{integrationId}/health:
 *   get:
 *     summary: Check integration health
 *     parameters:
 *       - name: integrationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Health check result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheckResult'
 *
 * @param {APIConnectorConfig} config - Connector configuration
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const health = await checkAPIHealth(connectorConfig);
 * if (health.status === 'down') {
 *   alert('Integration is down!');
 * }
 * ```
 */
export declare const checkAPIHealth: (config: APIConnectorConfig) => Promise<HealthCheckResult>;
/**
 * 32. Monitors integration performance metrics.
 *
 * @param {string} integrationName - Integration identifier
 * @returns {any} Performance monitor
 *
 * @example
 * ```typescript
 * const monitor = createPerformanceMonitor('ehr-api');
 * monitor.recordRequest(200, 250);
 * const metrics = monitor.getMetrics();
 * ```
 */
export declare const createPerformanceMonitor: (integrationName: string) => any;
/**
 * 33. Creates integration status dashboard data.
 *
 * @param {HealthCheckResult[]} healthChecks - Health check results
 * @returns {any} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = createIntegrationDashboard([health1, health2, health3]);
 * ```
 */
export declare const createIntegrationDashboard: (healthChecks: HealthCheckResult[]) => any;
/**
 * 34. Logs integration activity.
 *
 * @param {string} integrationName - Integration identifier
 * @param {string} action - Action performed
 * @param {any} [details] - Additional details
 *
 * @example
 * ```typescript
 * logIntegrationActivity('ehr-api', 'patient_fetch', {
 *   patientId: '12345',
 *   status: 'success'
 * });
 * ```
 */
export declare const logIntegrationActivity: (integrationName: string, action: string, details?: any) => void;
/**
 * 35. Tracks integration quota usage.
 *
 * @param {string} integrationName - Integration identifier
 * @param {number} quota - Total quota
 * @returns {any} Quota tracker
 *
 * @example
 * ```typescript
 * const tracker = createQuotaTracker('api', 10000);
 * tracker.increment(10);
 * console.log(tracker.getUsage());
 * ```
 */
export declare const createQuotaTracker: (integrationName: string, quota: number) => any;
/**
 * 36. Creates a data synchronization configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     SyncConfig:
 *       type: object
 *       required:
 *         - source
 *         - target
 *         - batchSize
 *         - syncMode
 *         - mappings
 *       properties:
 *         source:
 *           type: string
 *         target:
 *           type: string
 *         batchSize:
 *           type: number
 *         syncMode:
 *           type: string
 *           enum: [full, incremental, delta]
 *
 * @param {Partial<SyncConfig>} config - Sync configuration
 * @returns {SyncConfig} Complete sync configuration
 *
 * @example
 * ```typescript
 * const syncConfig = createSyncConfig({
 *   source: 'external-ehr',
 *   target: 'local-db',
 *   batchSize: 100,
 *   syncMode: 'incremental',
 *   mappings: [...]
 * });
 * ```
 */
export declare const createSyncConfig: (config: Partial<SyncConfig>) => SyncConfig;
/**
 * 37. Performs bulk data synchronization.
 *
 * @param {SyncConfig} config - Sync configuration
 * @param {any} sourceConnector - Source API connector
 * @param {any} targetConnector - Target API connector
 * @returns {Promise<SyncResult>} Sync result
 *
 * @example
 * ```typescript
 * const result = await performBulkSync(syncConfig, sourceAPI, targetAPI);
 * console.log(`Synced ${result.recordsProcessed} records`);
 * ```
 */
export declare const performBulkSync: (config: SyncConfig, sourceConnector: any, targetConnector: any) => Promise<SyncResult>;
/**
 * 40. Schedules periodic data synchronization.
 *
 * @param {SyncConfig} config - Sync configuration
 * @param {string} schedule - Cron schedule expression
 * @returns {any} Scheduled sync job
 *
 * @example
 * ```typescript
 * const job = schedulePeriodicSync(syncConfig, '0 * * * *'); // Every hour
 * ```
 */
export declare const schedulePeriodicSync: (config: SyncConfig, schedule: string) => any;
export type { APIConnectorConfig, AuthConfig, OAuth2Config, OAuth2TokenResponse, RetryConfig, RateLimitConfig, APIRequest, APIResponse, WebhookConfig, WebhookPayload, WebhookValidationResult, DataMapping, TransformFunction, MappingContext, IntegrationError, HealthCheckResult, SyncConfig, SyncResult, RateLimitState, IntegrationEvent, EventHandler, };
//# sourceMappingURL=integration-connectors-kit.d.ts.map