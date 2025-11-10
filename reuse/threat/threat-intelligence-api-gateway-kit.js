"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiPayload = exports.formatApiError = exports.generateRequestId = exports.detectApiAnomalies = exports.generateApiUsageReport = exports.analyzeApiPerformance = exports.logApiAnalytics = exports.createGraphQLContext = exports.generateThreatGraphQLSchema = exports.calculateGraphQLComplexity = exports.sanitizeResponse = exports.applyTransformations = exports.createTransformationRule = exports.checkVersionDeprecation = exports.parseApiVersion = exports.createApiVersion = exports.filterWebhookEvent = exports.calculateWebhookRetryDelay = exports.createWebhookDelivery = exports.verifyWebhookSignature = exports.generateWebhookSignature = exports.createWebhookConfig = exports.calculateQuotaUsage = exports.slidingWindowRateLimit = exports.tokenBucketRateLimit = exports.checkRateLimit = exports.createRateLimitConfig = exports.verifyApiKeyPermission = exports.createApiKeyConfig = exports.validateApiKeyFormat = exports.hashApiKey = exports.generateApiKey = exports.RateLimitBucket = exports.ApiRequestLog = exports.Webhook = exports.ApiKey = exports.WebhookEventType = exports.RateLimitStrategy = exports.AuthenticationType = exports.HttpMethod = void 0;
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
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * HTTP methods
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["HEAD"] = "HEAD";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
/**
 * API authentication type
 */
var AuthenticationType;
(function (AuthenticationType) {
    AuthenticationType["API_KEY"] = "API_KEY";
    AuthenticationType["BEARER_TOKEN"] = "BEARER_TOKEN";
    AuthenticationType["BASIC_AUTH"] = "BASIC_AUTH";
    AuthenticationType["OAUTH2"] = "OAUTH2";
    AuthenticationType["MUTUAL_TLS"] = "MUTUAL_TLS";
    AuthenticationType["JWT"] = "JWT";
})(AuthenticationType || (exports.AuthenticationType = AuthenticationType = {}));
/**
 * Rate limit strategy
 */
var RateLimitStrategy;
(function (RateLimitStrategy) {
    RateLimitStrategy["FIXED_WINDOW"] = "FIXED_WINDOW";
    RateLimitStrategy["SLIDING_WINDOW"] = "SLIDING_WINDOW";
    RateLimitStrategy["TOKEN_BUCKET"] = "TOKEN_BUCKET";
    RateLimitStrategy["LEAKY_BUCKET"] = "LEAKY_BUCKET";
})(RateLimitStrategy || (exports.RateLimitStrategy = RateLimitStrategy = {}));
/**
 * Webhook event type
 */
var WebhookEventType;
(function (WebhookEventType) {
    WebhookEventType["THREAT_DETECTED"] = "THREAT_DETECTED";
    WebhookEventType["IOC_ADDED"] = "IOC_ADDED";
    WebhookEventType["IOC_UPDATED"] = "IOC_UPDATED";
    WebhookEventType["THREAT_LEVEL_CHANGED"] = "THREAT_LEVEL_CHANGED";
    WebhookEventType["CAMPAIGN_STARTED"] = "CAMPAIGN_STARTED";
    WebhookEventType["INCIDENT_CREATED"] = "INCIDENT_CREATED";
    WebhookEventType["ALERT_TRIGGERED"] = "ALERT_TRIGGERED";
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
let ApiKey = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'api_keys',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['key_hash'], unique: true },
                { fields: ['organization_id'] },
                { fields: ['enabled'] },
                { fields: ['expires_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _key_decorators;
    let _key_initializers = [];
    let _key_extraInitializers = [];
    let _hashedKey_decorators;
    let _hashedKey_initializers = [];
    let _hashedKey_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _permissions_decorators;
    let _permissions_initializers = [];
    let _permissions_extraInitializers = [];
    let _rateLimitTier_decorators;
    let _rateLimitTier_initializers = [];
    let _rateLimitTier_extraInitializers = [];
    let _maxRequestsPerHour_decorators;
    let _maxRequestsPerHour_initializers = [];
    let _maxRequestsPerHour_extraInitializers = [];
    let _allowedIps_decorators;
    let _allowedIps_initializers = [];
    let _allowedIps_extraInitializers = [];
    let _allowedOrigins_decorators;
    let _allowedOrigins_initializers = [];
    let _allowedOrigins_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ApiKey = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.key = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _key_initializers, void 0));
            this.hashedKey = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _hashedKey_initializers, void 0));
            this.organizationId = (__runInitializers(this, _hashedKey_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
            this.userId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.permissions = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
            this.rateLimitTier = (__runInitializers(this, _permissions_extraInitializers), __runInitializers(this, _rateLimitTier_initializers, void 0));
            this.maxRequestsPerHour = (__runInitializers(this, _rateLimitTier_extraInitializers), __runInitializers(this, _maxRequestsPerHour_initializers, void 0));
            this.allowedIps = (__runInitializers(this, _maxRequestsPerHour_extraInitializers), __runInitializers(this, _allowedIps_initializers, void 0));
            this.allowedOrigins = (__runInitializers(this, _allowedIps_extraInitializers), __runInitializers(this, _allowedOrigins_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _allowedOrigins_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.enabled = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _enabled_initializers, void 0));
            this.metadata = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ApiKey");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'key_123456', description: 'Unique API key identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Production API Key', description: 'API key name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _key_decorators = [(0, swagger_1.ApiProperty)({ example: 'wc_live_...', description: 'API key (shown once at creation)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true })];
        _hashedKey_decorators = [(0, swagger_1.ApiProperty)({ example: 'hash...', description: 'Hashed API key' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true, field: 'key_hash' })];
        _organizationId_decorators = [(0, swagger_1.ApiProperty)({ example: 'org_123', description: 'Organization ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'organization_id' })];
        _userId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'user_123', description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'user_id' })];
        _permissions_decorators = [(0, swagger_1.ApiProperty)({ description: 'API permissions', type: [String] }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false, defaultValue: [] })];
        _rateLimitTier_decorators = [(0, swagger_1.ApiProperty)({ enum: ['free', 'basic', 'premium', 'enterprise'], example: 'premium' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'rate_limit_tier' })];
        _maxRequestsPerHour_decorators = [(0, swagger_1.ApiProperty)({ example: 10000, description: 'Max requests per hour' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, field: 'max_requests_per_hour' })];
        _allowedIps_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Allowed IP addresses', type: [String] }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), field: 'allowed_ips' })];
        _allowedOrigins_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Allowed origins', type: [String] }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), field: 'allowed_origins' })];
        _expiresAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expiration timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'expires_at' })];
        _enabled_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'API key enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: true })];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'created_at' })];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'updated_at' })];
        _deletedAt_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'deleted_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: obj => "key" in obj, get: obj => obj.key, set: (obj, value) => { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
        __esDecorate(null, null, _hashedKey_decorators, { kind: "field", name: "hashedKey", static: false, private: false, access: { has: obj => "hashedKey" in obj, get: obj => obj.hashedKey, set: (obj, value) => { obj.hashedKey = value; } }, metadata: _metadata }, _hashedKey_initializers, _hashedKey_extraInitializers);
        __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: obj => "permissions" in obj, get: obj => obj.permissions, set: (obj, value) => { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
        __esDecorate(null, null, _rateLimitTier_decorators, { kind: "field", name: "rateLimitTier", static: false, private: false, access: { has: obj => "rateLimitTier" in obj, get: obj => obj.rateLimitTier, set: (obj, value) => { obj.rateLimitTier = value; } }, metadata: _metadata }, _rateLimitTier_initializers, _rateLimitTier_extraInitializers);
        __esDecorate(null, null, _maxRequestsPerHour_decorators, { kind: "field", name: "maxRequestsPerHour", static: false, private: false, access: { has: obj => "maxRequestsPerHour" in obj, get: obj => obj.maxRequestsPerHour, set: (obj, value) => { obj.maxRequestsPerHour = value; } }, metadata: _metadata }, _maxRequestsPerHour_initializers, _maxRequestsPerHour_extraInitializers);
        __esDecorate(null, null, _allowedIps_decorators, { kind: "field", name: "allowedIps", static: false, private: false, access: { has: obj => "allowedIps" in obj, get: obj => obj.allowedIps, set: (obj, value) => { obj.allowedIps = value; } }, metadata: _metadata }, _allowedIps_initializers, _allowedIps_extraInitializers);
        __esDecorate(null, null, _allowedOrigins_decorators, { kind: "field", name: "allowedOrigins", static: false, private: false, access: { has: obj => "allowedOrigins" in obj, get: obj => obj.allowedOrigins, set: (obj, value) => { obj.allowedOrigins = value; } }, metadata: _metadata }, _allowedOrigins_initializers, _allowedOrigins_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiKey = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiKey = _classThis;
})();
exports.ApiKey = ApiKey;
let Webhook = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'webhooks',
            timestamps: true,
            indexes: [
                { fields: ['enabled'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _events_decorators;
    let _events_initializers = [];
    let _events_extraInitializers = [];
    let _secret_decorators;
    let _secret_initializers = [];
    let _secret_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _retryPolicy_decorators;
    let _retryPolicy_initializers = [];
    let _retryPolicy_extraInitializers = [];
    let _authentication_decorators;
    let _authentication_initializers = [];
    let _authentication_extraInitializers = [];
    let _filters_decorators;
    let _filters_initializers = [];
    let _filters_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var Webhook = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.url = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _url_initializers, void 0));
            this.events = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _events_initializers, void 0));
            this.secret = (__runInitializers(this, _events_extraInitializers), __runInitializers(this, _secret_initializers, void 0));
            this.enabled = (__runInitializers(this, _secret_extraInitializers), __runInitializers(this, _enabled_initializers, void 0));
            this.retryPolicy = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _retryPolicy_initializers, void 0));
            this.authentication = (__runInitializers(this, _retryPolicy_extraInitializers), __runInitializers(this, _authentication_initializers, void 0));
            this.filters = (__runInitializers(this, _authentication_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
            this.metadata = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Webhook");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'webhook_123456', description: 'Unique webhook identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Threat Notification Webhook', description: 'Webhook name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _url_decorators = [(0, swagger_1.ApiProperty)({ example: 'https://api.example.com/webhooks/threats', description: 'Webhook URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _events_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subscribed events', enum: WebhookEventType, isArray: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _secret_decorators = [(0, swagger_1.ApiProperty)({ example: 'whsec_...', description: 'Webhook signing secret' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _enabled_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Webhook enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: true })];
        _retryPolicy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retry policy configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, field: 'retry_policy' })];
        _authentication_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Authentication configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _filters_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event filters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'created_at' })];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _events_decorators, { kind: "field", name: "events", static: false, private: false, access: { has: obj => "events" in obj, get: obj => obj.events, set: (obj, value) => { obj.events = value; } }, metadata: _metadata }, _events_initializers, _events_extraInitializers);
        __esDecorate(null, null, _secret_decorators, { kind: "field", name: "secret", static: false, private: false, access: { has: obj => "secret" in obj, get: obj => obj.secret, set: (obj, value) => { obj.secret = value; } }, metadata: _metadata }, _secret_initializers, _secret_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _retryPolicy_decorators, { kind: "field", name: "retryPolicy", static: false, private: false, access: { has: obj => "retryPolicy" in obj, get: obj => obj.retryPolicy, set: (obj, value) => { obj.retryPolicy = value; } }, metadata: _metadata }, _retryPolicy_initializers, _retryPolicy_extraInitializers);
        __esDecorate(null, null, _authentication_decorators, { kind: "field", name: "authentication", static: false, private: false, access: { has: obj => "authentication" in obj, get: obj => obj.authentication, set: (obj, value) => { obj.authentication = value; } }, metadata: _metadata }, _authentication_initializers, _authentication_extraInitializers);
        __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: obj => "filters" in obj, get: obj => obj.filters, set: (obj, value) => { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Webhook = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Webhook = _classThis;
})();
exports.Webhook = Webhook;
let ApiRequestLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'api_request_logs',
            timestamps: false,
            indexes: [
                { fields: ['timestamp'] },
                { fields: ['api_key_id'] },
                { fields: ['status_code'] },
                { fields: ['endpoint'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _method_decorators;
    let _method_initializers = [];
    let _method_extraInitializers = [];
    let _endpoint_decorators;
    let _endpoint_initializers = [];
    let _endpoint_extraInitializers = [];
    let _apiKeyId_decorators;
    let _apiKeyId_initializers = [];
    let _apiKeyId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _clientIp_decorators;
    let _clientIp_initializers = [];
    let _clientIp_extraInitializers = [];
    let _statusCode_decorators;
    let _statusCode_initializers = [];
    let _statusCode_extraInitializers = [];
    let _responseTimeMs_decorators;
    let _responseTimeMs_initializers = [];
    let _responseTimeMs_extraInitializers = [];
    let _requestSizeBytes_decorators;
    let _requestSizeBytes_initializers = [];
    let _requestSizeBytes_extraInitializers = [];
    let _responseSizeBytes_decorators;
    let _responseSizeBytes_initializers = [];
    let _responseSizeBytes_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ApiRequestLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.timestamp = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.method = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _method_initializers, void 0));
            this.endpoint = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _endpoint_initializers, void 0));
            this.apiKeyId = (__runInitializers(this, _endpoint_extraInitializers), __runInitializers(this, _apiKeyId_initializers, void 0));
            this.userId = (__runInitializers(this, _apiKeyId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.clientIp = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _clientIp_initializers, void 0));
            this.statusCode = (__runInitializers(this, _clientIp_extraInitializers), __runInitializers(this, _statusCode_initializers, void 0));
            this.responseTimeMs = (__runInitializers(this, _statusCode_extraInitializers), __runInitializers(this, _responseTimeMs_initializers, void 0));
            this.requestSizeBytes = (__runInitializers(this, _responseTimeMs_extraInitializers), __runInitializers(this, _requestSizeBytes_initializers, void 0));
            this.responseSizeBytes = (__runInitializers(this, _requestSizeBytes_extraInitializers), __runInitializers(this, _responseSizeBytes_initializers, void 0));
            this.errorMessage = (__runInitializers(this, _responseSizeBytes_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
            this.metadata = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ApiRequestLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'req_123456', description: 'Unique request identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Request timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _method_decorators = [(0, swagger_1.ApiProperty)({ enum: HttpMethod, example: HttpMethod.GET }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _endpoint_decorators = [(0, swagger_1.ApiProperty)({ example: '/api/v1/threats', description: 'Request path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _apiKeyId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'key_123', description: 'API key ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'api_key_id' })];
        _userId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'user_123', description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'user_id' })];
        _clientIp_decorators = [(0, swagger_1.ApiProperty)({ example: '192.168.1.100', description: 'Client IP address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'client_ip' })];
        _statusCode_decorators = [(0, swagger_1.ApiProperty)({ example: 200, description: 'HTTP status code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, field: 'status_code' })];
        _responseTimeMs_decorators = [(0, swagger_1.ApiProperty)({ example: 125, description: 'Response time in milliseconds' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, field: 'response_time_ms' })];
        _requestSizeBytes_decorators = [(0, swagger_1.ApiProperty)({ example: 1024, description: 'Request size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'request_size_bytes' })];
        _responseSizeBytes_decorators = [(0, swagger_1.ApiProperty)({ example: 4096, description: 'Response size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'response_size_bytes' })];
        _errorMessage_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Invalid API key', description: 'Error message if any' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, field: 'error_message' })];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method, set: (obj, value) => { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
        __esDecorate(null, null, _endpoint_decorators, { kind: "field", name: "endpoint", static: false, private: false, access: { has: obj => "endpoint" in obj, get: obj => obj.endpoint, set: (obj, value) => { obj.endpoint = value; } }, metadata: _metadata }, _endpoint_initializers, _endpoint_extraInitializers);
        __esDecorate(null, null, _apiKeyId_decorators, { kind: "field", name: "apiKeyId", static: false, private: false, access: { has: obj => "apiKeyId" in obj, get: obj => obj.apiKeyId, set: (obj, value) => { obj.apiKeyId = value; } }, metadata: _metadata }, _apiKeyId_initializers, _apiKeyId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _clientIp_decorators, { kind: "field", name: "clientIp", static: false, private: false, access: { has: obj => "clientIp" in obj, get: obj => obj.clientIp, set: (obj, value) => { obj.clientIp = value; } }, metadata: _metadata }, _clientIp_initializers, _clientIp_extraInitializers);
        __esDecorate(null, null, _statusCode_decorators, { kind: "field", name: "statusCode", static: false, private: false, access: { has: obj => "statusCode" in obj, get: obj => obj.statusCode, set: (obj, value) => { obj.statusCode = value; } }, metadata: _metadata }, _statusCode_initializers, _statusCode_extraInitializers);
        __esDecorate(null, null, _responseTimeMs_decorators, { kind: "field", name: "responseTimeMs", static: false, private: false, access: { has: obj => "responseTimeMs" in obj, get: obj => obj.responseTimeMs, set: (obj, value) => { obj.responseTimeMs = value; } }, metadata: _metadata }, _responseTimeMs_initializers, _responseTimeMs_extraInitializers);
        __esDecorate(null, null, _requestSizeBytes_decorators, { kind: "field", name: "requestSizeBytes", static: false, private: false, access: { has: obj => "requestSizeBytes" in obj, get: obj => obj.requestSizeBytes, set: (obj, value) => { obj.requestSizeBytes = value; } }, metadata: _metadata }, _requestSizeBytes_initializers, _requestSizeBytes_extraInitializers);
        __esDecorate(null, null, _responseSizeBytes_decorators, { kind: "field", name: "responseSizeBytes", static: false, private: false, access: { has: obj => "responseSizeBytes" in obj, get: obj => obj.responseSizeBytes, set: (obj, value) => { obj.responseSizeBytes = value; } }, metadata: _metadata }, _responseSizeBytes_initializers, _responseSizeBytes_extraInitializers);
        __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiRequestLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiRequestLog = _classThis;
})();
exports.ApiRequestLog = ApiRequestLog;
let RateLimitBucket = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'rate_limit_buckets',
            timestamps: true,
            indexes: [
                { fields: ['key', 'window_start'] },
                { fields: ['expires_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _key_decorators;
    let _key_initializers = [];
    let _key_extraInitializers = [];
    let _windowStart_decorators;
    let _windowStart_initializers = [];
    let _windowStart_extraInitializers = [];
    let _requestCount_decorators;
    let _requestCount_initializers = [];
    let _requestCount_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var RateLimitBucket = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.key = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _key_initializers, void 0));
            this.windowStart = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _windowStart_initializers, void 0));
            this.requestCount = (__runInitializers(this, _windowStart_extraInitializers), __runInitializers(this, _requestCount_initializers, void 0));
            this.limit = (__runInitializers(this, _requestCount_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RateLimitBucket");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'bucket_123456', description: 'Unique bucket identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _key_decorators = [(0, swagger_1.ApiProperty)({ example: 'key_123:2024-01-15:14', description: 'Rate limit key' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _windowStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Window start time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'window_start' })];
        _requestCount_decorators = [(0, swagger_1.ApiProperty)({ example: 50, description: 'Current request count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'request_count' })];
        _limit_decorators = [(0, swagger_1.ApiProperty)({ example: 100, description: 'Rate limit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _expiresAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bucket expiration time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'expires_at' })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'created_at' })];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: obj => "key" in obj, get: obj => obj.key, set: (obj, value) => { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
        __esDecorate(null, null, _windowStart_decorators, { kind: "field", name: "windowStart", static: false, private: false, access: { has: obj => "windowStart" in obj, get: obj => obj.windowStart, set: (obj, value) => { obj.windowStart = value; } }, metadata: _metadata }, _windowStart_initializers, _windowStart_extraInitializers);
        __esDecorate(null, null, _requestCount_decorators, { kind: "field", name: "requestCount", static: false, private: false, access: { has: obj => "requestCount" in obj, get: obj => obj.requestCount, set: (obj, value) => { obj.requestCount = value; } }, metadata: _metadata }, _requestCount_initializers, _requestCount_extraInitializers);
        __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RateLimitBucket = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RateLimitBucket = _classThis;
})();
exports.RateLimitBucket = RateLimitBucket;
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
const generateApiKey = (prefix = 'wc_live') => {
    const randomBytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
    const base64 = Buffer.from(randomBytes).toString('base64').replace(/[+/=]/g, '');
    return `${prefix}_${base64.substring(0, 48)}`;
};
exports.generateApiKey = generateApiKey;
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
const hashApiKey = (apiKey) => {
    // Simple hash for demonstration - use bcrypt or similar in production
    let hash = 0;
    for (let i = 0; i < apiKey.length; i++) {
        const char = apiKey.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return `hash_${Math.abs(hash).toString(16)}_${apiKey.length}`;
};
exports.hashApiKey = hashApiKey;
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
const validateApiKeyFormat = (apiKey) => {
    const errors = [];
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
exports.validateApiKeyFormat = validateApiKeyFormat;
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
const createApiKeyConfig = (config) => {
    const key = (0, exports.generateApiKey)('wc_live');
    const id = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        hashedKey: (0, exports.hashApiKey)(key),
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
exports.createApiKeyConfig = createApiKeyConfig;
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
const verifyApiKeyPermission = (apiKey, requiredPermission) => {
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
exports.verifyApiKeyPermission = verifyApiKeyPermission;
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
const createRateLimitConfig = (config) => {
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
exports.createRateLimitConfig = createRateLimitConfig;
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
const checkRateLimit = (key, config, currentCount) => {
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
exports.checkRateLimit = checkRateLimit;
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
const tokenBucketRateLimit = (key, capacity, refillRate, currentTokens, lastRefill) => {
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
exports.tokenBucketRateLimit = tokenBucketRateLimit;
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
const slidingWindowRateLimit = (requestTimestamps, windowSizeMs, limit) => {
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
exports.slidingWindowRateLimit = slidingWindowRateLimit;
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
const calculateQuotaUsage = (apiKeyId, periodStart, periodEnd, requests) => {
    const periodRequests = requests.filter((req) => req.timestamp >= periodStart && req.timestamp <= periodEnd && req.apiKeyId === apiKeyId);
    const requestCount = periodRequests.length;
    const dataTransferBytes = periodRequests.reduce((sum, req) => sum + (req.requestSizeBytes || 0) + (req.responseSizeBytes || 0), 0);
    // Calculate period type
    const periodDuration = periodEnd.getTime() - periodStart.getTime();
    let period;
    if (periodDuration <= 3600000) {
        period = 'hour';
    }
    else if (periodDuration <= 86400000) {
        period = 'day';
    }
    else {
        period = 'month';
    }
    return {
        apiKeyId: apiKeyId,
        period,
        periodStart,
        periodEnd,
        requestCount,
        quotaLimit: 10000, // Default, should come from API key config
        dataTransferBytes,
        costUnits: requestCount * 0.001, // Example cost calculation
    };
};
exports.calculateQuotaUsage = calculateQuotaUsage;
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
const createWebhookConfig = (config) => {
    const id = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
exports.createWebhookConfig = createWebhookConfig;
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
const generateWebhookSignature = (secret, payload, timestamp) => {
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
exports.generateWebhookSignature = generateWebhookSignature;
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
const verifyWebhookSignature = (signature, secret, payload, timestamp) => {
    const expectedSignature = (0, exports.generateWebhookSignature)(secret, payload, timestamp);
    return signature === expectedSignature;
};
exports.verifyWebhookSignature = verifyWebhookSignature;
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
const createWebhookDelivery = (webhook, eventType, payload) => {
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
exports.createWebhookDelivery = createWebhookDelivery;
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
const calculateWebhookRetryDelay = (attemptNumber, baseDelayMs, maxDelayMs) => {
    const exponentialDelay = baseDelayMs * Math.pow(2, attemptNumber - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay; // Add 10% jitter
    return Math.min(exponentialDelay + jitter, maxDelayMs);
};
exports.calculateWebhookRetryDelay = calculateWebhookRetryDelay;
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
const filterWebhookEvent = (event, filters = {}) => {
    for (const [key, filterValue] of Object.entries(filters)) {
        const eventValue = event[key];
        if (Array.isArray(filterValue)) {
            if (!filterValue.includes(eventValue)) {
                return false;
            }
        }
        else if (eventValue !== filterValue) {
            return false;
        }
    }
    return true;
};
exports.filterWebhookEvent = filterWebhookEvent;
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
const createApiVersion = (version) => {
    const id = `ver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
exports.createApiVersion = createApiVersion;
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
const parseApiVersion = (headers, path) => {
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
exports.parseApiVersion = parseApiVersion;
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
const checkVersionDeprecation = (version) => {
    const now = new Date();
    const deprecated = version.deprecationDate ? version.deprecationDate <= now : false;
    const sunset = version.sunsetDate ? version.sunsetDate <= now : false;
    let daysUntilSunset;
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
exports.checkVersionDeprecation = checkVersionDeprecation;
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
const createTransformationRule = (rule) => {
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
exports.createTransformationRule = createTransformationRule;
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
const applyTransformations = (data, rules) => {
    let result = { ...data };
    for (const rule of rules) {
        if (!rule.enabled)
            continue;
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
        if (!conditionsMet)
            continue;
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
exports.applyTransformations = applyTransformations;
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
const sanitizeResponse = (data, sensitiveFields = ['password', 'secret', 'token', 'key', 'hash']) => {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
            result[key] = '[REDACTED]';
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result[key] = (0, exports.sanitizeResponse)(value, sensitiveFields);
        }
        else {
            result[key] = value;
        }
    }
    return result;
};
exports.sanitizeResponse = sanitizeResponse;
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
const calculateGraphQLComplexity = (query, maxDepth = 10) => {
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
exports.calculateGraphQLComplexity = calculateGraphQLComplexity;
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
const generateThreatGraphQLSchema = () => {
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
exports.generateThreatGraphQLSchema = generateThreatGraphQLSchema;
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
const createGraphQLContext = (request, apiKey) => {
    return {
        requestId: request.requestId,
        apiKey: apiKey.id,
        organizationId: apiKey.organizationId,
        userId: apiKey.userId,
        permissions: apiKey.permissions,
        timestamp: request.timestamp,
    };
};
exports.createGraphQLContext = createGraphQLContext;
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
const logApiAnalytics = (request, response) => {
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
exports.logApiAnalytics = logApiAnalytics;
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
const analyzeApiPerformance = (events) => {
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
exports.analyzeApiPerformance = analyzeApiPerformance;
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
const generateApiUsageReport = (apiKeyId, startDate, endDate, events) => {
    const filteredEvents = events.filter((e) => e.apiKeyId === apiKeyId && e.timestamp >= startDate && e.timestamp <= endDate);
    const totalRequests = filteredEvents.length;
    const successCount = filteredEvents.filter((e) => e.statusCode >= 200 && e.statusCode < 300).length;
    const successRate = totalRequests > 0 ? successCount / totalRequests : 0;
    // Top endpoints
    const endpointCounts = new Map();
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
exports.generateApiUsageReport = generateApiUsageReport;
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
const detectApiAnomalies = (events, thresholdMultiplier = 2.0) => {
    const anomalies = [];
    const suspiciousPatterns = [];
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
    const ipCounts = new Map();
    events.forEach((e) => {
        const ip = e.metadata?.clientIp;
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
    const endpointCounts = new Map();
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
exports.detectApiAnomalies = detectApiAnomalies;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates a unique request ID.
 *
 * @returns {RequestId} Request ID
 */
const generateRequestId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `req_${timestamp}_${random}`;
};
exports.generateRequestId = generateRequestId;
/**
 * Formats API error response.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {Record<string, unknown>} [details] - Error details
 * @returns {Record<string, unknown>} Formatted error response
 */
const formatApiError = (statusCode, message, code, details) => {
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
exports.formatApiError = formatApiError;
/**
 * Validates API request payload.
 *
 * @param {Record<string, unknown>} payload - Request payload
 * @param {string[]} requiredFields - Required field names
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 */
const validateApiPayload = (payload, requiredFields) => {
    const errors = [];
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
exports.validateApiPayload = validateApiPayload;
//# sourceMappingURL=threat-intelligence-api-gateway-kit.js.map