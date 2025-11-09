/**
 * LOC: DOC-COMP-API-001
 * File: /reuse/document/composites/document-api-integration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - express (v4.x)
 *   - jsonwebtoken (v9.x)
 *   - ../document-api-integration-kit
 *   - ../document-workflow-kit
 *   - ../document-notification-advanced-kit
 *   - ../document-automation-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - API gateway controllers
 *   - Webhook handler services
 *   - Integration middleware modules
 *   - Event streaming services
 *   - External system connectors
 */
import { Sequelize } from 'sequelize';
import { Request } from 'express';
/**
 * REST API endpoint configuration
 */
export interface RestEndpointConfig {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    handler: string;
    authentication: boolean;
    rateLimit?: number;
    cors?: boolean;
    validation?: Record<string, any>;
    documentation?: {
        summary: string;
        description: string;
        tags: string[];
    };
}
/**
 * GraphQL resolver configuration
 */
export interface GraphQLResolverConfig {
    typeName: string;
    fieldName: string;
    type: 'Query' | 'Mutation' | 'Subscription';
    resolver: Function;
    authentication: boolean;
    complexity?: number;
}
/**
 * Webhook subscription configuration
 */
export interface WebhookSubscriptionConfig {
    url: string;
    events: string[];
    secret: string;
    retryAttempts: number;
    timeout: number;
    active: boolean;
    headers?: Record<string, string>;
}
/**
 * API authentication configuration
 */
export interface ApiAuthConfig {
    type: 'apiKey' | 'jwt' | 'oauth2' | 'basic';
    apiKey?: string;
    jwtSecret?: string;
    jwtExpiresIn?: string;
    oauth2Config?: {
        clientId: string;
        clientSecret: string;
        authorizationUrl: string;
        tokenUrl: string;
    };
}
/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (req: Request) => string;
}
/**
 * API event payload
 */
export interface ApiEventPayload {
    eventType: string;
    eventId: string;
    timestamp: Date;
    data: Record<string, any>;
    metadata?: Record<string, any>;
    source?: string;
}
/**
 * Webhook delivery result
 */
export interface WebhookDeliveryResult {
    webhookId: string;
    url: string;
    status: 'success' | 'failed' | 'pending';
    statusCode?: number;
    responseTime: number;
    retryCount: number;
    error?: string;
    timestamp: Date;
}
/**
 * API Integration Composite Service
 *
 * Provides comprehensive API integration capabilities including REST/GraphQL endpoints,
 * webhooks, authentication, rate limiting, and event streaming.
 */
export declare class ApiIntegrationCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates REST API endpoint with documentation.
     *
     * @param {RestEndpointConfig} config - Endpoint configuration
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.createRestApiEndpoint({
     *   path: '/api/v1/documents',
     *   method: 'GET',
     *   handler: 'getDocuments',
     *   authentication: true,
     *   rateLimit: 100,
     *   documentation: {
     *     summary: 'List documents',
     *     description: 'Returns paginated list of documents',
     *     tags: ['documents']
     *   }
     * });
     * ```
     */
    createRestApiEndpoint(config: RestEndpointConfig): Promise<void>;
    /**
     * 2. Generates OpenAPI specification for endpoints.
     *
     * @param {Array<RestEndpointConfig>} endpoints - API endpoints
     * @returns {Promise<Object>} OpenAPI specification
     *
     * @example
     * ```typescript
     * const spec = await service.generateOpenApiSpecification(endpoints);
     * ```
     */
    generateOpenApiSpecification(endpoints: Array<RestEndpointConfig>): Promise<{
        openapi: string;
        info: Record<string, any>;
        paths: Record<string, any>;
    }>;
    /**
     * 3. Configures CORS for API endpoints.
     *
     * @param {Object} corsConfig - CORS configuration
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.configureApiCors({
     *   origin: ['https://app.whitecross.health'],
     *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
     *   credentials: true
     * });
     * ```
     */
    configureApiCors(corsConfig: {
        origin: string | string[];
        methods: string[];
        credentials: boolean;
    }): Promise<void>;
    /**
     * 4. Transforms request payload with validation.
     *
     * @param {Request} req - Express request
     * @param {Record<string, any>} schema - Validation schema
     * @returns {Promise<Record<string, any>>} Transformed payload
     *
     * @example
     * ```typescript
     * const payload = await service.transformApiRequestPayload(req, validationSchema);
     * ```
     */
    transformApiRequestPayload(req: Request, schema: Record<string, any>): Promise<Record<string, any>>;
    /**
     * 5. Serializes response payload for API.
     *
     * @param {any} data - Data to serialize
     * @param {string} format - Serialization format
     * @returns {Promise<string>} Serialized payload
     *
     * @example
     * ```typescript
     * const serialized = await service.serializeApiPayload(responseData, 'json');
     * ```
     */
    serializeApiPayload(data: any, format: 'json' | 'xml'): Promise<string>;
    /**
     * 6. Creates paginated API response.
     *
     * @param {Array<any>} data - Data to paginate
     * @param {number} page - Page number
     * @param {number} pageSize - Items per page
     * @returns {Promise<Object>} Paginated response
     *
     * @example
     * ```typescript
     * const response = await service.createPaginatedApiResponse(documents, 1, 50);
     * ```
     */
    createPaginatedApiResponse(data: Array<any>, page: number, pageSize: number): Promise<{
        data: Array<any>;
        pagination: {
            page: number;
            pageSize: number;
            totalPages: number;
            totalItems: number;
        };
    }>;
    /**
     * 7. Creates standardized API error response.
     *
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     * @param {string} [code] - Error code
     * @returns {Object} API error object
     *
     * @example
     * ```typescript
     * const error = service.createApiErrorResponse(404, 'Document not found', 'DOC_NOT_FOUND');
     * ```
     */
    createApiErrorResponse(statusCode: number, message: string, code?: string): {
        statusCode: number;
        message: string;
        code?: string;
        timestamp: Date;
    };
    /**
     * 8. Creates global exception filter for API.
     *
     * @returns {any} Exception filter
     *
     * @example
     * ```typescript
     * const filter = service.createGlobalApiExceptionFilter();
     * app.useGlobalFilters(filter);
     * ```
     */
    createGlobalApiExceptionFilter(): any;
    /**
     * 9. Creates GraphQL resolver with authentication.
     *
     * @param {GraphQLResolverConfig} config - Resolver configuration
     * @returns {Promise<Function>} Created resolver function
     *
     * @example
     * ```typescript
     * const resolver = await service.createGraphQLApiResolver({
     *   typeName: 'Document',
     *   fieldName: 'documents',
     *   type: 'Query',
     *   resolver: async (parent, args, context) => { return documents; },
     *   authentication: true
     * });
     * ```
     */
    createGraphQLApiResolver(config: GraphQLResolverConfig): Promise<Function>;
    /**
     * 10. Generates GraphQL schema from resolvers.
     *
     * @param {Array<GraphQLResolverConfig>} resolvers - Resolver configurations
     * @returns {Promise<string>} GraphQL schema
     *
     * @example
     * ```typescript
     * const schema = await service.generateGraphQLSchema(resolvers);
     * ```
     */
    generateGraphQLSchema(resolvers: Array<GraphQLResolverConfig>): Promise<string>;
    /**
     * 11. Validates GraphQL query complexity.
     *
     * @param {string} query - GraphQL query
     * @param {number} maxComplexity - Maximum allowed complexity
     * @returns {Promise<boolean>} True if within complexity limits
     *
     * @example
     * ```typescript
     * const valid = await service.validateGraphQLComplexity(query, 100);
     * ```
     */
    validateGraphQLComplexity(query: string, maxComplexity: number): Promise<boolean>;
    /**
     * 12. Creates GraphQL subscription resolver.
     *
     * @param {string} subscriptionName - Subscription name
     * @param {Function} resolver - Resolver function
     * @returns {Promise<Function>} Subscription resolver
     *
     * @example
     * ```typescript
     * const subscription = await service.createGraphQLSubscription(
     *   'documentUpdated',
     *   async (documentId) => { return asyncIterator; }
     * );
     * ```
     */
    createGraphQLSubscription(subscriptionName: string, resolver: Function): Promise<Function>;
    /**
     * 13. Registers webhook subscription.
     *
     * @param {WebhookSubscriptionConfig} config - Webhook configuration
     * @returns {Promise<string>} Created webhook ID
     *
     * @example
     * ```typescript
     * const webhookId = await service.registerWebhookSubscription({
     *   url: 'https://api.example.com/webhooks',
     *   events: ['document.created', 'document.updated'],
     *   secret: 'webhook-secret-123',
     *   retryAttempts: 3,
     *   timeout: 5000,
     *   active: true
     * });
     * ```
     */
    registerWebhookSubscription(config: WebhookSubscriptionConfig): Promise<string>;
    /**
     * 14. Delivers webhook payload to subscriber.
     *
     * @param {string} webhookId - Webhook ID
     * @param {ApiEventPayload} payload - Event payload
     * @returns {Promise<WebhookDeliveryResult>} Delivery result
     *
     * @example
     * ```typescript
     * const result = await service.deliverWebhookPayload('webhook-123', {
     *   eventType: 'document.created',
     *   eventId: 'evt-456',
     *   timestamp: new Date(),
     *   data: { documentId: 'doc-789' }
     * });
     * ```
     */
    deliverWebhookPayload(webhookId: string, payload: ApiEventPayload): Promise<WebhookDeliveryResult>;
    /**
     * 15. Generates webhook signature for security.
     *
     * @param {string} payload - Webhook payload
     * @param {string} secret - Webhook secret
     * @returns {Promise<string>} Generated signature
     *
     * @example
     * ```typescript
     * const signature = await service.generateWebhookSecuritySignature(payload, secret);
     * ```
     */
    generateWebhookSecuritySignature(payload: string, secret: string): Promise<string>;
    /**
     * 16. Verifies webhook signature.
     *
     * @param {string} payload - Webhook payload
     * @param {string} signature - Received signature
     * @param {string} secret - Webhook secret
     * @returns {Promise<boolean>} True if signature is valid
     *
     * @example
     * ```typescript
     * const valid = await service.verifyWebhookSecuritySignature(payload, signature, secret);
     * ```
     */
    verifyWebhookSecuritySignature(payload: string, signature: string, secret: string): Promise<boolean>;
    /**
     * 17. Retries failed webhook delivery.
     *
     * @param {string} webhookId - Webhook ID
     * @param {string} deliveryId - Failed delivery ID
     * @returns {Promise<WebhookDeliveryResult>} Retry result
     *
     * @example
     * ```typescript
     * const result = await service.retryFailedWebhookDelivery('webhook-123', 'delivery-456');
     * ```
     */
    retryFailedWebhookDelivery(webhookId: string, deliveryId: string): Promise<WebhookDeliveryResult>;
    /**
     * 18. Lists active webhook subscriptions.
     *
     * @param {string} [eventType] - Filter by event type
     * @returns {Promise<Array<WebhookSubscriptionConfig>>} Active webhooks
     *
     * @example
     * ```typescript
     * const webhooks = await service.listActiveWebhookSubscriptions('document.created');
     * ```
     */
    listActiveWebhookSubscriptions(eventType?: string): Promise<Array<WebhookSubscriptionConfig>>;
    /**
     * 19. Deactivates webhook subscription.
     *
     * @param {string} webhookId - Webhook ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.deactivateWebhookSubscription('webhook-123');
     * ```
     */
    deactivateWebhookSubscription(webhookId: string): Promise<void>;
    /**
     * 20. Broadcasts event to all matching webhooks.
     *
     * @param {ApiEventPayload} event - Event to broadcast
     * @returns {Promise<Array<WebhookDeliveryResult>>} Delivery results
     *
     * @example
     * ```typescript
     * const results = await service.broadcastEventToWebhooks({
     *   eventType: 'document.created',
     *   eventId: 'evt-123',
     *   timestamp: new Date(),
     *   data: { documentId: 'doc-456' }
     * });
     * ```
     */
    broadcastEventToWebhooks(event: ApiEventPayload): Promise<Array<WebhookDeliveryResult>>;
    /**
     * 21. Generates API key for authentication.
     *
     * @param {string} userId - User ID
     * @param {Object} [options] - API key options
     * @returns {Promise<string>} Generated API key
     *
     * @example
     * ```typescript
     * const apiKey = await service.generateApiKeyForUser('user-123', {
     *   expiresIn: '90d',
     *   scopes: ['read:documents', 'write:documents']
     * });
     * ```
     */
    generateApiKeyForUser(userId: string, options?: {
        expiresIn?: string;
        scopes?: string[];
    }): Promise<string>;
    /**
     * 22. Validates API key.
     *
     * @param {string} apiKey - API key to validate
     * @returns {Promise<{valid: boolean; userId?: string; scopes?: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateApiKeyAuth(apiKey);
     * if (validation.valid) {
     *   console.log('User:', validation.userId);
     * }
     * ```
     */
    validateApiKeyAuth(apiKey: string): Promise<{
        valid: boolean;
        userId?: string;
        scopes?: string[];
    }>;
    /**
     * 23. Generates JWT token for authentication.
     *
     * @param {Record<string, any>} payload - JWT payload
     * @param {string} [expiresIn] - Expiration time
     * @returns {Promise<string>} Generated JWT token
     *
     * @example
     * ```typescript
     * const token = await service.generateJwtAuthToken({
     *   userId: 'user-123',
     *   role: 'doctor',
     *   permissions: ['read:documents']
     * }, '24h');
     * ```
     */
    generateJwtAuthToken(payload: Record<string, any>, expiresIn?: string): Promise<string>;
    /**
     * 24. Verifies JWT token.
     *
     * @param {string} token - JWT token
     * @returns {Promise<{valid: boolean; payload?: Record<string, any>}>} Verification result
     *
     * @example
     * ```typescript
     * const verification = await service.verifyJwtAuthToken(token);
     * if (verification.valid) {
     *   console.log('Payload:', verification.payload);
     * }
     * ```
     */
    verifyJwtAuthToken(token: string): Promise<{
        valid: boolean;
        payload?: Record<string, any>;
    }>;
    /**
     * 25. Creates authentication middleware.
     *
     * @param {ApiAuthConfig} config - Authentication configuration
     * @returns {Function} Authentication middleware
     *
     * @example
     * ```typescript
     * const authMiddleware = service.createAuthenticationMiddleware({
     *   type: 'jwt',
     *   jwtSecret: process.env.JWT_SECRET
     * });
     * ```
     */
    createAuthenticationMiddleware(config: ApiAuthConfig): Function;
    /**
     * 26. Checks user permissions for API action.
     *
     * @param {string} userId - User ID
     * @param {string} action - Required permission
     * @returns {Promise<boolean>} True if user has permission
     *
     * @example
     * ```typescript
     * const hasPermission = await service.checkUserApiPermission('user-123', 'write:documents');
     * ```
     */
    checkUserApiPermission(userId: string, action: string): Promise<boolean>;
    /**
     * 27. Refreshes JWT token.
     *
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<{accessToken: string; refreshToken: string}>} New tokens
     *
     * @example
     * ```typescript
     * const tokens = await service.refreshJwtToken(refreshToken);
     * ```
     */
    refreshJwtToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    /**
     * 28. Revokes API key.
     *
     * @param {string} apiKey - API key to revoke
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.revokeApiKey(apiKey);
     * ```
     */
    revokeApiKey(apiKey: string): Promise<void>;
    /**
     * 29. Creates rate limiter for API endpoint.
     *
     * @param {RateLimitConfig} config - Rate limit configuration
     * @returns {Promise<Function>} Rate limiter middleware
     *
     * @example
     * ```typescript
     * const limiter = await service.createApiRateLimiter({
     *   windowMs: 60000,
     *   maxRequests: 100,
     *   message: 'Too many requests'
     * });
     * ```
     */
    createApiRateLimiter(config: RateLimitConfig): Promise<Function>;
    /**
     * 30. Checks rate limit for request.
     *
     * @param {string} identifier - Client identifier
     * @param {string} endpoint - API endpoint
     * @returns {Promise<{allowed: boolean; remaining: number; resetAt: Date}>} Rate limit status
     *
     * @example
     * ```typescript
     * const status = await service.checkApiRateLimit('user-123', '/api/documents');
     * if (!status.allowed) {
     *   console.log(`Rate limit exceeded. Reset at: ${status.resetAt}`);
     * }
     * ```
     */
    checkApiRateLimit(identifier: string, endpoint: string): Promise<{
        allowed: boolean;
        remaining: number;
        resetAt: Date;
    }>;
    /**
     * 31. Records rate limit request.
     *
     * @param {string} identifier - Client identifier
     * @param {string} endpoint - API endpoint
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.recordApiRateLimitRequest('user-123', '/api/documents');
     * ```
     */
    recordApiRateLimitRequest(identifier: string, endpoint: string): Promise<void>;
    /**
     * 32. Creates circuit breaker for API calls.
     *
     * @param {Object} config - Circuit breaker configuration
     * @returns {Promise<any>} Circuit breaker instance
     *
     * @example
     * ```typescript
     * const breaker = await service.createApiCircuitBreaker({
     *   threshold: 5,
     *   timeout: 60000,
     *   resetTimeout: 30000
     * });
     * ```
     */
    createApiCircuitBreaker(config: {
        threshold: number;
        timeout: number;
        resetTimeout?: number;
    }): Promise<any>;
    /**
     * 33. Implements API request throttling.
     *
     * @param {number} requestsPerSecond - Max requests per second
     * @returns {Function} Throttle middleware
     *
     * @example
     * ```typescript
     * const throttle = service.implementApiThrottling(10);
     * ```
     */
    implementApiThrottling(requestsPerSecond: number): Function;
    /**
     * 34. Creates workflow triggered by API event.
     *
     * @param {string} eventType - Triggering event type
     * @param {Object} workflowConfig - Workflow configuration
     * @returns {Promise<string>} Created workflow ID
     *
     * @example
     * ```typescript
     * const workflowId = await service.createApiTriggeredWorkflow('document.created', {
     *   steps: [...],
     *   approvalRequired: true
     * });
     * ```
     */
    createApiTriggeredWorkflow(eventType: string, workflowConfig: Record<string, any>): Promise<string>;
    /**
     * 35. Executes workflow from API request.
     *
     * @param {string} workflowId - Workflow ID
     * @param {Record<string, any>} data - Workflow data from API
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.executeWorkflowFromApi('wf-123', { documentId: 'doc-456' });
     * ```
     */
    executeWorkflowFromApi(workflowId: string, data: Record<string, any>): Promise<void>;
    /**
     * 36. Gets workflow status via API.
     *
     * @param {string} workflowId - Workflow ID
     * @returns {Promise<Object>} Workflow status
     *
     * @example
     * ```typescript
     * const status = await service.getApiWorkflowStatus('wf-123');
     * ```
     */
    getApiWorkflowStatus(workflowId: string): Promise<{
        id: string;
        state: string;
        progress: number;
        completedSteps: number;
        totalSteps: number;
    }>;
    /**
     * 37. Sends notification via API integration.
     *
     * @param {Object} notification - Notification details
     * @returns {Promise<string>} Notification ID
     *
     * @example
     * ```typescript
     * const notificationId = await service.sendApiNotification({
     *   recipient: 'user@example.com',
     *   subject: 'Document Ready',
     *   message: 'Your document is ready for review',
     *   channel: 'email'
     * });
     * ```
     */
    sendApiNotification(notification: {
        recipient: string;
        subject: string;
        message: string;
        channel: string;
    }): Promise<string>;
    /**
     * 38. Sends bulk notifications via API.
     *
     * @param {Array<any>} notifications - Notifications to send
     * @returns {Promise<Array<{id: string; status: string}>>} Notification statuses
     *
     * @example
     * ```typescript
     * const results = await service.sendBulkApiNotifications(notifications);
     * ```
     */
    sendBulkApiNotifications(notifications: Array<any>): Promise<Array<{
        id: string;
        status: string;
    }>>;
    /**
     * 39. Schedules notification from API request.
     *
     * @param {Object} notification - Notification details
     * @param {Date} scheduleTime - Schedule time
     * @returns {Promise<string>} Scheduled notification ID
     *
     * @example
     * ```typescript
     * const id = await service.scheduleApiNotification(notification, new Date('2024-01-15 09:00'));
     * ```
     */
    scheduleApiNotification(notification: Record<string, any>, scheduleTime: Date): Promise<string>;
    /**
     * 40. Tracks notification status via API.
     *
     * @param {string} notificationId - Notification ID
     * @returns {Promise<{id: string; status: string; sentAt?: Date; deliveredAt?: Date}>} Notification status
     *
     * @example
     * ```typescript
     * const status = await service.trackApiNotificationStatus('notif-123');
     * ```
     */
    trackApiNotificationStatus(notificationId: string): Promise<{
        id: string;
        status: string;
        sentAt?: Date;
        deliveredAt?: Date;
    }>;
    /**
     * 41. Records API metrics.
     *
     * @param {Object} metrics - Metrics to record
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.recordApiMetricsData({
     *   endpoint: '/api/documents',
     *   method: 'GET',
     *   statusCode: 200,
     *   duration: 150
     * });
     * ```
     */
    recordApiMetricsData(metrics: {
        endpoint: string;
        method: string;
        statusCode: number;
        duration: number;
    }): Promise<void>;
    /**
     * 42. Creates API logger middleware.
     *
     * @returns {Function} Logger middleware
     *
     * @example
     * ```typescript
     * const logger = service.createApiLoggerMiddleware();
     * app.use(logger);
     * ```
     */
    createApiLoggerMiddleware(): Function;
    /**
     * 43. Generates API usage report.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<Object>} Usage report
     *
     * @example
     * ```typescript
     * const report = await service.generateApiUsageAnalytics(
     *   new Date('2024-01-01'),
     *   new Date('2024-01-31')
     * );
     * ```
     */
    generateApiUsageAnalytics(startDate: Date, endDate: Date): Promise<{
        totalRequests: number;
        uniqueUsers: number;
        avgResponseTime: number;
        errorRate: number;
        topEndpoints: Array<{
            endpoint: string;
            count: number;
        }>;
    }>;
    /**
     * 44. Tracks API event.
     *
     * @param {string} eventType - Event type
     * @param {Record<string, any>} data - Event data
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.trackApiIntegrationEvent('webhook_delivered', { webhookId: 'wh-123' });
     * ```
     */
    trackApiIntegrationEvent(eventType: string, data: Record<string, any>): Promise<void>;
    /**
     * 45. Generates comprehensive API integration dashboard.
     *
     * @returns {Promise<Object>} Dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateApiIntegrationDashboard();
     * ```
     */
    generateApiIntegrationDashboard(): Promise<{
        totalEndpoints: number;
        totalWebhooks: number;
        activeApiKeys: number;
        requestsToday: number;
        avgResponseTime: number;
        errorRate: number;
    }>;
}
export default ApiIntegrationCompositeService;
//# sourceMappingURL=document-api-integration-composite.d.ts.map