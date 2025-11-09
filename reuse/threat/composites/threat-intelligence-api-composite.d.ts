/**
 * LOC: TIAPICMP1234567
 * File: /reuse/threat/composites/threat-intelligence-api-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-intelligence-api-gateway-kit
 *   - ../threat-intelligence-platform-kit
 *   - ../threat-feeds-integration-kit
 *   - ../threat-sharing-kit
 *   - ../threat-intelligence-sharing-kit
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence REST API controllers
 *   - GraphQL resolvers and schemas
 *   - API gateway services
 *   - API documentation generators
 *   - Client SDK generators
 */
/**
 * File: /reuse/threat/composites/threat-intelligence-api-composite.ts
 * Locator: WC-THREAT-API-COMPOSITE-001
 * Purpose: Comprehensive Threat Intelligence API Composite - REST APIs, GraphQL, and API Gateway
 *
 * Upstream: Composes functions from threat-intelligence-api-gateway-kit, threat-intelligence-platform-kit,
 *           threat-feeds-integration-kit, threat-sharing-kit, threat-intelligence-sharing-kit
 * Downstream: ../backend/*, API controllers, GraphQL resolvers, API gateway, SDK generators
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, @nestjs/graphql
 * Exports: 45 composite functions for RESTful APIs, GraphQL endpoints, API versioning, authentication
 *
 * LLM Context: Enterprise-grade threat intelligence API infrastructure for White Cross healthcare platform.
 * Provides comprehensive RESTful API design with OpenAPI/Swagger specifications, GraphQL schema and resolvers,
 * API gateway integration, rate limiting and throttling, authentication and authorization, API versioning
 * strategies, webhook management, request/response transformation, API analytics and monitoring, and
 * HIPAA-compliant API security. Competes with enterprise TIP platforms like Anomali, ThreatConnect, and
 * Recorded Future with production-ready API infrastructure.
 *
 * API Design Principles:
 * - RESTful resource modeling with consistent endpoint patterns
 * - GraphQL for flexible threat intelligence queries
 * - API versioning with backward compatibility
 * - Comprehensive authentication and authorization
 * - Rate limiting and quota management
 * - Webhook event delivery with retry logic
 * - Request validation and sanitization
 * - Response transformation and caching
 * - API analytics and usage monitoring
 * - OpenAPI 3.0 specification generation
 */
import { type RateLimitConfig, type WebhookConfig, type ApiVersionInfo, type ApiRequestMetadata, type ApiResponseMetadata, type HttpMethod, type AuthenticationType } from '../threat-intelligence-api-gateway-kit';
import { type ThreatIntelligence } from '../threat-intelligence-platform-kit';
import { type TLPLevel, type ThreatSharePackage, type BidirectionalExchange } from '../threat-sharing-kit';
import { type TAXIICollection } from '../threat-intelligence-sharing-kit';
/**
 * Threat Intelligence REST API configuration
 */
export interface ThreatApiConfig {
    baseUrl: string;
    version: string;
    authentication: AuthenticationType;
    rateLimit: RateLimitConfig;
    cors: CorsConfig;
    swagger: SwaggerConfig;
    features: ApiFeatureFlags;
}
/**
 * CORS configuration for API
 */
export interface CorsConfig {
    allowedOrigins: string[];
    allowedMethods: HttpMethod[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
    maxAge: number;
}
/**
 * Swagger/OpenAPI configuration
 */
export interface SwaggerConfig {
    enabled: boolean;
    title: string;
    description: string;
    version: string;
    contactEmail: string;
    license: string;
    servers: SwaggerServer[];
}
/**
 * Swagger server configuration
 */
export interface SwaggerServer {
    url: string;
    description: string;
}
/**
 * API feature flags
 */
export interface ApiFeatureFlags {
    graphql: boolean;
    webhooks: boolean;
    rateLimit: boolean;
    analytics: boolean;
    caching: boolean;
    compression: boolean;
}
/**
 * REST API endpoint definition
 */
export interface RestEndpoint {
    path: string;
    method: HttpMethod;
    authentication: boolean;
    rateLimit?: RateLimitConfig;
    requestSchema?: any;
    responseSchema?: any;
    description: string;
    tags: string[];
}
/**
 * GraphQL query definition
 */
export interface GraphQLQuery {
    name: string;
    type: 'Query' | 'Mutation' | 'Subscription';
    args: GraphQLArgument[];
    returnType: string;
    complexity: number;
    authentication: boolean;
    description: string;
}
/**
 * GraphQL argument definition
 */
export interface GraphQLArgument {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
    description: string;
}
/**
 * API request context
 */
export interface ApiContext {
    requestId: string;
    userId?: string;
    apiKeyId?: string;
    permissions: string[];
    metadata: ApiRequestMetadata;
}
/**
 * API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    metadata: ApiResponseMetadata;
    links?: HATEOASLinks;
}
/**
 * API error structure
 */
export interface ApiError {
    code: string;
    message: string;
    details?: any;
    stack?: string;
}
/**
 * HATEOAS links for REST API
 */
export interface HATEOASLinks {
    self: string;
    related?: Record<string, string>;
    next?: string;
    prev?: string;
}
/**
 * Creates a complete REST API configuration for threat intelligence
 * Composes: createRateLimitConfig, createApiVersion, authentication setup
 */
export declare const createThreatIntelligenceRestApi: (config: Partial<ThreatApiConfig>) => ThreatApiConfig;
/**
 * Creates REST endpoint for threat intelligence search
 * Composes: searchThreatIntelligence, validateApiPayload, formatApiError
 */
export declare const createThreatSearchEndpoint: () => RestEndpoint;
/**
 * Creates REST endpoint for IOC lookup
 * Composes: searchThreatIntelligence, enrichThreatIntelligence
 */
export declare const createIocLookupEndpoint: () => RestEndpoint;
/**
 * Creates REST endpoint for threat feed management
 * Composes: createFeedManagementController, createFeedApiSpec
 */
export declare const createThreatFeedEndpoint: () => RestEndpoint;
/**
 * Creates REST endpoint for STIX bundle submission
 * Composes: createSTIXBundle, validateSTIXObject, parseSTIXBundle
 */
export declare const createStixBundleEndpoint: () => RestEndpoint;
/**
 * Creates REST endpoint for TLP-based sharing
 * Composes: createThreatSharePackage, validateTLPSharing, getTLPClassification
 */
export declare const createTlpSharingEndpoint: () => RestEndpoint;
/**
 * Processes REST API request with full lifecycle
 * Composes: generateRequestId, validateApiPayload, checkRateLimit, logApiAnalytics
 */
export declare const processRestApiRequest: <T>(endpoint: RestEndpoint, request: any, context: ApiContext) => Promise<ApiResponse<T>>;
/**
 * Generates complete GraphQL schema for threat intelligence
 * Composes: generateThreatGraphQLSchema with threat types
 */
export declare const generateCompleteThreatGraphQLSchema: () => string;
/**
 * Creates GraphQL query for threat intelligence search
 * Composes: searchThreatIntelligence, calculateGraphQLComplexity
 */
export declare const createThreatSearchQuery: () => GraphQLQuery;
/**
 * Creates GraphQL mutation for threat intelligence submission
 * Composes: validateThreatIntelligence, enrichThreatIntelligence
 */
export declare const createThreatSubmissionMutation: () => GraphQLQuery;
/**
 * Creates GraphQL subscription for real-time threat updates
 */
export declare const createThreatUpdatesSubscription: () => GraphQLQuery;
/**
 * Executes GraphQL query with complexity analysis
 * Composes: calculateGraphQLComplexity, createGraphQLContext, validateApiPayload
 */
export declare const executeGraphQLQuery: (query: string, variables: any, context: ApiContext) => Promise<ApiResponse<any>>;
/**
 * Initializes complete API gateway for threat intelligence
 * Composes: createRateLimitConfig, createApiVersion, generateApiKey
 */
export declare const initializeThreatApiGateway: (config: ThreatApiConfig) => Promise<{
    apiKey: string;
    rateLimiter: RateLimitConfig;
    version: ApiVersionInfo;
}>;
/**
 * Validates API authentication and authorization
 * Composes: validateApiKeyFormat, verifyApiKeyPermission, hashApiKey
 */
export declare const validateApiAuthentication: (apiKey: string, requiredPermissions: string[]) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Applies rate limiting to API request
 * Composes: tokenBucketRateLimit, slidingWindowRateLimit, calculateQuotaUsage
 */
export declare const applyApiRateLimit: (config: RateLimitConfig, apiKeyId: string, timestamp: number) => Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: number;
}>;
/**
 * Manages webhook delivery with retry logic
 * Composes: createWebhookDelivery, generateWebhookSignature, calculateWebhookRetryDelay
 */
export declare const deliverWebhookEvent: (webhook: WebhookConfig, event: any, attempt?: number) => Promise<{
    success: boolean;
    deliveryId: string;
    nextRetryDelay?: number;
}>;
/**
 * Generates OpenAPI 3.0 specification
 * Composes: createFeedApiSpec, generateSharingOpenAPISpec, swagger config
 */
export declare const generateThreatApiOpenApiSpec: (config: ThreatApiConfig) => any;
/**
 * Manages API version lifecycle
 * Composes: createApiVersion, checkVersionDeprecation, parseApiVersion
 */
export declare const manageApiVersionLifecycle: (currentVersion: string, headers: Record<string, string>, path: string) => {
    version: ApiVersionInfo;
    deprecation: {
        deprecated: boolean;
        message?: string;
        sunsetDate?: Date;
    };
    requestedVersion: string;
};
/**
 * Transforms API request between versions
 * Composes: createTransformationRule, applyTransformations
 */
export declare const transformApiRequestBetweenVersions: (request: any, fromVersion: string, toVersion: string) => any;
/**
 * Sanitizes API response for version compatibility
 * Composes: sanitizeResponse, applyTransformations
 */
export declare const sanitizeApiResponseForVersion: (response: any, version: string, sensitiveFields: string[]) => any;
/**
 * Tracks comprehensive API usage metrics
 * Composes: logApiAnalytics, analyzeApiPerformance, generateApiUsageReport
 */
export declare const trackApiUsageMetrics: (apiKeyId: string, startDate: Date, endDate: Date) => Promise<{
    usage: any;
    performance: any;
    report: any;
}>;
/**
 * Detects API usage anomalies
 * Composes: detectApiAnomalies with ML-based detection
 */
export declare const detectApiUsageAnomalies: (apiKeyId: string, metrics: any[]) => {
    anomalies: any[];
    severity: "low" | "medium" | "high" | "critical";
};
/**
 * Searches threat intelligence via REST API
 * Composes: searchThreatIntelligence, filterIntelligence, validateApiPayload
 */
export declare const searchThreatsViaApi: (query: any, context: ApiContext) => Promise<ApiResponse<ThreatIntelligence[]>>;
/**
 * Exports threat intelligence in multiple formats
 * Composes: exportThreatIntelligence, convertToSTIX, serializeSTIXBundle
 */
export declare const exportThreatsViaApi: (threatIds: string[], format: "json" | "stix" | "csv", context: ApiContext) => Promise<ApiResponse<any>>;
/**
 * Imports threat intelligence via API
 * Composes: importThreatIntelligence, parseSTIXBundle, validateSTIXObject
 */
export declare const importThreatsViaApi: (data: any, format: "json" | "stix" | "csv", context: ApiContext) => Promise<ApiResponse<{
    imported: number;
    failed: number;
}>>;
/**
 * Manages threat feeds via REST API
 * Composes: createRestFeedConnector, calculateFeedMetrics, generateFeedReport
 */
export declare const manageThreatFeedsViaApi: (feedId: string, operation: "start" | "stop" | "status" | "metrics", context: ApiContext) => Promise<ApiResponse<any>>;
/**
 * Shares threat intelligence via TLP-based API
 * Composes: createThreatSharePackage, validateTLPSharing, getTLPClassification
 */
export declare const shareThreatViaTlpApi: (threatId: string, tlpLevel: TLPLevel, recipients: string[], context: ApiContext) => Promise<ApiResponse<ThreatSharePackage>>;
/**
 * Creates bidirectional threat sharing exchange
 * Composes: createBidirectionalExchange, generateSharingMetrics, generateSharingReport
 */
export declare const createThreatExchangeApi: (partnerId: string, config: any, context: ApiContext) => Promise<ApiResponse<BidirectionalExchange>>;
/**
 * Validates STIX bundle submission via API
 * Composes: parseSTIXBundle, validateSTIXObject, createSTIXBundle
 */
export declare const validateStixBundleApi: (bundleJson: string, context: ApiContext) => Promise<ApiResponse<{
    valid: boolean;
    errors: any[];
}>>;
/**
 * Creates TAXII collection API endpoint
 * Composes: createTAXIICollection, createTAXIIDiscovery
 */
export declare const createTaxiiCollectionApi: (collectionId: string, config: any) => TAXIICollection;
/**
 * Generates TAXII discovery endpoint
 * Composes: createTAXIIDiscovery with server configuration
 */
export declare const generateTaxiiDiscoveryApi: (baseUrl: string) => any;
export { createThreatIntelligenceRestApi, createThreatSearchEndpoint, createIocLookupEndpoint, createThreatFeedEndpoint, createStixBundleEndpoint, createTlpSharingEndpoint, processRestApiRequest, generateCompleteThreatGraphQLSchema, createThreatSearchQuery, createThreatSubmissionMutation, createThreatUpdatesSubscription, executeGraphQLQuery, initializeThreatApiGateway, validateApiAuthentication, applyApiRateLimit, deliverWebhookEvent, generateThreatApiOpenApiSpec, manageApiVersionLifecycle, transformApiRequestBetweenVersions, sanitizeApiResponseForVersion, trackApiUsageMetrics, detectApiUsageAnomalies, searchThreatsViaApi, exportThreatsViaApi, importThreatsViaApi, manageThreatFeedsViaApi, shareThreatViaTlpApi, createThreatExchangeApi, validateStixBundleApi, createTaxiiCollectionApi, generateTaxiiDiscoveryApi, };
//# sourceMappingURL=threat-intelligence-api-composite.d.ts.map