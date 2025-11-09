"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryMetrics = exports.retryDeadLetterItem = exports.processDeadLetterQueue = exports.moveToDeadLetterQueue = exports.incrementRateLimit = exports.checkRateLimit = exports.validateIpWhitelist = exports.scheduleDeliveryWindow = exports.throttleDelivery = exports.prioritizeDeliveries = exports.checkBatchSize = exports.createBatchPayload = exports.deliverBatch = exports.batchWebhookEvents = exports.matchEventToSubscriptions = exports.filterEventsBySubscription = exports.verifyWebhookEndpoint = exports.validateWebhookUrl = exports.listWebhookSubscriptions = exports.getWebhookSubscription = exports.deleteWebhookSubscription = exports.updateWebhookSubscription = exports.createWebhookSubscription = exports.cancelScheduledDelivery = exports.getDeliveryHistory = exports.closeCircuitBreaker = exports.openCircuitBreaker = exports.checkCircuitBreaker = exports.updateDeliveryStatus = exports.trackDeliveryAttempt = exports.scheduleRetry = exports.deliverWebhookWithRetry = exports.calculateRetryDelay = exports.deliverWebhook = exports.validateReplayProtection = exports.parseSignatureHeader = exports.rotateWebhookSecret = exports.generateWebhookSecret = exports.validateSignatureTimestamp = exports.createSignatureHeaders = exports.verifyHmacSignature = exports.generateHmacSignature = exports.createDeadLetterQueueModel = exports.createWebhookEventModel = exports.createWebhookDeliveryModel = exports.createWebhookSubscriptionModel = exports.DeliveryResultSchema = exports.SignatureConfigSchema = exports.WebhookEventSchema = exports.WebhookSubscriptionSchema = void 0;
exports.WebhookController = exports.WebhookDeliveryService = exports.WebhookService = exports.alertOnFailure = exports.generateAuditLog = exports.logWebhookEvent = void 0;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const crypto = __importStar(require("crypto"));
const axios_1 = __importDefault(require("axios"));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for webhook subscription creation/update
 */
exports.WebhookSubscriptionSchema = zod_1.z.object({
    url: zod_1.z.string().url('Must be a valid URL'),
    events: zod_1.z.array(zod_1.z.string()).min(1, 'At least one event type required'),
    secret: zod_1.z.string().optional(),
    active: zod_1.z.boolean().default(true),
    filters: zod_1.z.record(zod_1.z.any()).optional(),
    headers: zod_1.z.record(zod_1.z.string()).optional(),
    retryConfig: zod_1.z.object({
        maxAttempts: zod_1.z.number().min(0).max(10).default(3),
        initialDelay: zod_1.z.number().min(100).default(1000),
        maxDelay: zod_1.z.number().min(1000).default(300000),
        backoffMultiplier: zod_1.z.number().min(1).max(5).default(2),
        retryableStatusCodes: zod_1.z.array(zod_1.z.number()).default([408, 429, 500, 502, 503, 504]),
        timeout: zod_1.z.number().min(1000).max(60000).default(30000),
    }).optional(),
    rateLimit: zod_1.z.number().min(1).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for webhook event
 */
exports.WebhookEventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.string().min(1),
    data: zod_1.z.any(),
    timestamp: zod_1.z.date(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for signature configuration
 */
exports.SignatureConfigSchema = zod_1.z.object({
    algorithm: zod_1.z.enum(['sha256', 'sha512']).default('sha256'),
    header: zod_1.z.string().default('X-Webhook-Signature'),
    timestampHeader: zod_1.z.string().default('X-Webhook-Timestamp'),
    includeTimestamp: zod_1.z.boolean().default(true),
    timestampTolerance: zod_1.z.number().min(0).default(300),
});
/**
 * Zod schema for delivery result
 */
exports.DeliveryResultSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    subscriptionId: zod_1.z.string(),
    deliveryId: zod_1.z.string(),
    status: zod_1.z.number(),
    responseBody: zod_1.z.string().optional(),
    error: zod_1.z.string().optional(),
    duration: zod_1.z.number(),
    attempt: zod_1.z.number(),
    willRetry: zod_1.z.boolean(),
    nextRetryAt: zod_1.z.date().optional(),
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
const createWebhookSubscriptionModel = (sequelize) => {
    class WebhookSubscriptionModel extends sequelize_1.Model {
    }
    WebhookSubscriptionModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique subscription identifier',
        },
        url: {
            type: sequelize_1.DataTypes.STRING(2048),
            allowNull: false,
            validate: {
                isUrl: true,
            },
            comment: 'Webhook endpoint URL',
        },
        events: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of subscribed event types',
        },
        secret: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'HMAC secret for signature verification',
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether subscription is active',
        },
        filters: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Event filtering criteria',
        },
        headers: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Custom headers to include in delivery',
        },
        retryConfig: {
            type: sequelize_1.DataTypes.JSON,
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
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum deliveries per minute',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional subscription metadata',
        },
    }, {
        sequelize,
        tableName: 'webhook_subscriptions',
        timestamps: true,
        indexes: [
            { fields: ['url'] },
            { fields: ['active'] },
            { fields: ['events'], using: 'GIN' },
        ],
    });
    return WebhookSubscriptionModel;
};
exports.createWebhookSubscriptionModel = createWebhookSubscriptionModel;
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
const createWebhookDeliveryModel = (sequelize) => {
    class WebhookDeliveryModel extends sequelize_1.Model {
    }
    WebhookDeliveryModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique delivery identifier',
        },
        subscriptionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to webhook subscription',
        },
        eventId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to webhook event',
        },
        eventType: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Type of event being delivered',
        },
        url: {
            type: sequelize_1.DataTypes.STRING(2048),
            allowNull: false,
            comment: 'Delivery endpoint URL',
        },
        payload: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Event payload data',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'delivered', 'failed', 'retrying', 'dead_letter'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Current delivery status',
        },
        attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of delivery attempts',
        },
        maxAttempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
            comment: 'Maximum retry attempts',
        },
        lastAttemptAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp of last delivery attempt',
        },
        nextRetryAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled retry timestamp',
        },
        responseStatus: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'HTTP response status code',
        },
        responseBody: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'HTTP response body',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if delivery failed',
        },
        deliveredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Successful delivery timestamp',
        },
    }, {
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
    });
    return WebhookDeliveryModel;
};
exports.createWebhookDeliveryModel = createWebhookDeliveryModel;
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
const createWebhookEventModel = (sequelize) => {
    class WebhookEventModel extends sequelize_1.Model {
    }
    WebhookEventModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique event identifier',
        },
        type: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Event type (e.g., user.created, order.completed)',
        },
        data: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Event payload data',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Event occurrence timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional event metadata',
        },
    }, {
        sequelize,
        tableName: 'webhook_events',
        timestamps: true,
        indexes: [
            { fields: ['type'] },
            { fields: ['timestamp'] },
            { fields: ['createdAt'] },
        ],
    });
    return WebhookEventModel;
};
exports.createWebhookEventModel = createWebhookEventModel;
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
const createDeadLetterQueueModel = (sequelize) => {
    class DeadLetterQueueModel extends sequelize_1.Model {
    }
    DeadLetterQueueModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique DLQ entry identifier',
        },
        deliveryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to failed delivery',
        },
        subscriptionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to webhook subscription',
        },
        eventId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to webhook event',
        },
        reason: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Failure reason',
        },
        payload: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Original event payload',
        },
        attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Total delivery attempts made',
        },
        lastError: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Last error message',
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Manual processing timestamp',
        },
        retryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of manual retry attempts',
        },
    }, {
        sequelize,
        tableName: 'webhook_dead_letter_queue',
        timestamps: true,
        indexes: [
            { fields: ['deliveryId'] },
            { fields: ['subscriptionId'] },
            { fields: ['processedAt'] },
            { fields: ['createdAt'] },
        ],
    });
    return DeadLetterQueueModel;
};
exports.createDeadLetterQueueModel = createDeadLetterQueueModel;
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
const generateHmacSignature = (payload, secret, algorithm = 'sha256') => {
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hmac = crypto.createHmac(algorithm, secret);
    hmac.update(payloadString);
    return hmac.digest('hex');
};
exports.generateHmacSignature = generateHmacSignature;
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
const verifyHmacSignature = (payload, signature, secret, algorithm = 'sha256') => {
    const expectedSignature = (0, exports.generateHmacSignature)(payload, secret, algorithm);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};
exports.verifyHmacSignature = verifyHmacSignature;
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
const createSignatureHeaders = (payload, secret, config) => {
    const defaultConfig = {
        algorithm: 'sha256',
        header: 'X-Webhook-Signature',
        timestampHeader: 'X-Webhook-Timestamp',
        includeTimestamp: true,
        timestampTolerance: 300,
    };
    const finalConfig = { ...defaultConfig, ...config };
    const timestamp = Math.floor(Date.now() / 1000);
    const headers = {};
    if (finalConfig.includeTimestamp) {
        headers[finalConfig.timestampHeader] = timestamp.toString();
        const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
        headers[finalConfig.header] = (0, exports.generateHmacSignature)(signedPayload, secret, finalConfig.algorithm);
    }
    else {
        headers[finalConfig.header] = (0, exports.generateHmacSignature)(payload, secret, finalConfig.algorithm);
    }
    return headers;
};
exports.createSignatureHeaders = createSignatureHeaders;
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
const validateSignatureTimestamp = (timestamp, tolerance = 300) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.abs(now - timestamp);
    return diff <= tolerance;
};
exports.validateSignatureTimestamp = validateSignatureTimestamp;
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
const generateWebhookSecret = (length = 32) => {
    const randomBytes = crypto.randomBytes(length);
    return `whsec_${randomBytes.toString('base64url')}`;
};
exports.generateWebhookSecret = generateWebhookSecret;
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
const rotateWebhookSecret = (subscriptionId, oldSecret) => {
    const newSecret = (0, exports.generateWebhookSecret)();
    const gracePeriodEnd = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return {
        newSecret,
        oldSecret,
        gracePeriodEnd,
    };
};
exports.rotateWebhookSecret = rotateWebhookSecret;
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
const parseSignatureHeader = (headerValue) => {
    const parts = headerValue.split(',');
    const parsed = {
        signatures: {},
    };
    for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === 't') {
            parsed.timestamp = parseInt(value, 10);
        }
        else {
            parsed.signatures[key] = value;
        }
    }
    return parsed;
};
exports.parseSignatureHeader = parseSignatureHeader;
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
const validateReplayProtection = (signature, timestamp, nonce, processedNonces) => {
    // Validate timestamp
    if (!(0, exports.validateSignatureTimestamp)(timestamp, 300)) {
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
exports.validateReplayProtection = validateReplayProtection;
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
const deliverWebhook = async (url, payload, headers, timeout = 30000) => {
    const startTime = Date.now();
    try {
        const config = {
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
        const response = await (0, axios_1.default)(config);
        const duration = Date.now() - startTime;
        return {
            success: response.status >= 200 && response.status < 300,
            status: response.status,
            responseBody: JSON.stringify(response.data),
            duration,
        };
    }
    catch (error) {
        const duration = Date.now() - startTime;
        return {
            success: false,
            status: error.response?.status || 0,
            error: error.message,
            duration,
        };
    }
};
exports.deliverWebhook = deliverWebhook;
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
const calculateRetryDelay = (attempt, config) => {
    const exponentialDelay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
    const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
    const delay = Math.min(exponentialDelay + jitter, config.maxDelay);
    return Math.floor(delay);
};
exports.calculateRetryDelay = calculateRetryDelay;
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
const deliverWebhookWithRetry = async (subscriptionId, url, payload, headers, retryConfig) => {
    let lastResult = {};
    for (let attempt = 0; attempt < retryConfig.maxAttempts; attempt++) {
        lastResult = await (0, exports.deliverWebhook)(url, payload, headers, retryConfig.timeout);
        if (lastResult.success) {
            return {
                success: true,
                subscriptionId,
                deliveryId: '', // Should be set by caller
                status: lastResult.status,
                responseBody: lastResult.responseBody,
                duration: lastResult.duration,
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
        const delay = (0, exports.calculateRetryDelay)(attempt, retryConfig);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    // All retries exhausted
    const nextRetryDelay = (0, exports.calculateRetryDelay)(retryConfig.maxAttempts - 1, retryConfig);
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
exports.deliverWebhookWithRetry = deliverWebhookWithRetry;
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
const scheduleRetry = (deliveryId, attempt, config) => {
    const delay = (0, exports.calculateRetryDelay)(attempt, config);
    return new Date(Date.now() + delay);
};
exports.scheduleRetry = scheduleRetry;
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
const trackDeliveryAttempt = (deliveryId, attempt, status, error) => {
    return {
        deliveryId,
        attempt,
        timestamp: new Date(),
        status,
        error,
    };
};
exports.trackDeliveryAttempt = trackDeliveryAttempt;
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
const updateDeliveryStatus = async (delivery, status, details) => {
    delivery.status = status;
    delivery.lastAttemptAt = new Date();
    if (details) {
        if (details.responseStatus !== undefined)
            delivery.responseStatus = details.responseStatus;
        if (details.responseBody !== undefined)
            delivery.responseBody = details.responseBody;
        if (details.errorMessage !== undefined)
            delivery.errorMessage = details.errorMessage;
        if (details.deliveredAt !== undefined)
            delivery.deliveredAt = details.deliveredAt;
        if (details.nextRetryAt !== undefined)
            delivery.nextRetryAt = details.nextRetryAt;
    }
    delivery.attempts += 1;
    return await delivery.save();
};
exports.updateDeliveryStatus = updateDeliveryStatus;
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
const checkCircuitBreaker = (subscriptionId, circuitBreakers) => {
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
exports.checkCircuitBreaker = checkCircuitBreaker;
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
const openCircuitBreaker = (subscriptionId, circuitBreakers, resetTimeout = 60000) => {
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
exports.openCircuitBreaker = openCircuitBreaker;
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
const closeCircuitBreaker = (subscriptionId, circuitBreakers) => {
    const breaker = circuitBreakers.get(subscriptionId);
    if (breaker) {
        breaker.state = 'closed';
        breaker.failures = 0;
        breaker.lastFailureAt = undefined;
        breaker.nextResetAt = undefined;
        circuitBreakers.set(subscriptionId, breaker);
    }
};
exports.closeCircuitBreaker = closeCircuitBreaker;
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
const getDeliveryHistory = async (DeliveryModel, subscriptionId, limit = 50) => {
    return await DeliveryModel.findAll({
        where: { subscriptionId },
        order: [['createdAt', 'DESC']],
        limit,
    });
};
exports.getDeliveryHistory = getDeliveryHistory;
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
const cancelScheduledDelivery = async (delivery) => {
    delivery.status = 'failed';
    delivery.errorMessage = 'Cancelled by user';
    delivery.nextRetryAt = null;
    return await delivery.save();
};
exports.cancelScheduledDelivery = cancelScheduledDelivery;
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
const createWebhookSubscription = async (SubscriptionModel, data) => {
    const validated = exports.WebhookSubscriptionSchema.parse({
        ...data,
        secret: data.secret || (0, exports.generateWebhookSecret)(),
    });
    return await SubscriptionModel.create(validated);
};
exports.createWebhookSubscription = createWebhookSubscription;
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
const updateWebhookSubscription = async (subscription, updates) => {
    Object.assign(subscription, updates);
    return await subscription.save();
};
exports.updateWebhookSubscription = updateWebhookSubscription;
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
const deleteWebhookSubscription = async (subscription) => {
    await subscription.destroy();
};
exports.deleteWebhookSubscription = deleteWebhookSubscription;
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
const getWebhookSubscription = async (SubscriptionModel, id) => {
    return await SubscriptionModel.findByPk(id);
};
exports.getWebhookSubscription = getWebhookSubscription;
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
const listWebhookSubscriptions = async (SubscriptionModel, filters) => {
    const where = {};
    if (filters?.active !== undefined) {
        where.active = filters.active;
    }
    if (filters?.url) {
        where.url = { [sequelize_1.Op.like]: `%${filters.url}%` };
    }
    if (filters?.events) {
        where.events = { [sequelize_1.Op.contains]: filters.events };
    }
    return await SubscriptionModel.findAll({ where });
};
exports.listWebhookSubscriptions = listWebhookSubscriptions;
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
const validateWebhookUrl = async (url) => {
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
    }
    catch {
        return false;
    }
};
exports.validateWebhookUrl = validateWebhookUrl;
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
const verifyWebhookEndpoint = async (url, secret) => {
    try {
        const challenge = crypto.randomBytes(32).toString('hex');
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = (0, exports.generateHmacSignature)(`${timestamp}.${challenge}`, secret);
        const response = await axios_1.default.post(url, {
            type: 'webhook.verification',
            challenge,
            timestamp,
        }, {
            headers: {
                'X-Webhook-Signature': signature,
                'X-Webhook-Timestamp': timestamp.toString(),
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });
        return response.status === 200 && response.data?.challenge === challenge;
    }
    catch {
        return false;
    }
};
exports.verifyWebhookEndpoint = verifyWebhookEndpoint;
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
const filterEventsBySubscription = (event, subscription) => {
    // Check event type
    if (!subscription.events.includes(event.type)) {
        return false;
    }
    // Check filters
    if (subscription.filters && Object.keys(subscription.filters).length > 0) {
        for (const [key, value] of Object.entries(subscription.filters)) {
            const eventValue = event.data[key];
            if (Array.isArray(value)) {
                if (!value.includes(eventValue))
                    return false;
            }
            else if (eventValue !== value) {
                return false;
            }
        }
    }
    return true;
};
exports.filterEventsBySubscription = filterEventsBySubscription;
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
const matchEventToSubscriptions = (event, subscriptions) => {
    return subscriptions.filter((sub) => sub.active && (0, exports.filterEventsBySubscription)(event, sub));
};
exports.matchEventToSubscriptions = matchEventToSubscriptions;
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
const batchWebhookEvents = (events, config) => {
    const batches = [];
    let currentBatch = [];
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
exports.batchWebhookEvents = batchWebhookEvents;
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
const deliverBatch = async (url, events, headers, timeout = 30000) => {
    const payload = {
        type: 'webhook.batch',
        events,
        count: events.length,
        timestamp: new Date(),
    };
    return await (0, exports.deliverWebhook)(url, payload, headers, timeout);
};
exports.deliverBatch = deliverBatch;
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
const createBatchPayload = (events) => {
    return {
        type: 'webhook.batch',
        events,
        count: events.length,
        timestamp: new Date(),
    };
};
exports.createBatchPayload = createBatchPayload;
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
const checkBatchSize = (batch, maxSize) => {
    return batch.length >= maxSize;
};
exports.checkBatchSize = checkBatchSize;
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
const prioritizeDeliveries = (deliveries, strategy = 'fifo') => {
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
exports.prioritizeDeliveries = prioritizeDeliveries;
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
const throttleDelivery = (subscriptionId, rateLimits, maxPerMinute) => {
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
exports.throttleDelivery = throttleDelivery;
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
const scheduleDeliveryWindow = (startHour = 0, endHour = 23) => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= startHour && currentHour <= endHour) {
        return null; // In window
    }
    // Calculate next window start
    const nextStart = new Date(now);
    if (currentHour < startHour) {
        nextStart.setHours(startHour, 0, 0, 0);
    }
    else {
        nextStart.setDate(nextStart.getDate() + 1);
        nextStart.setHours(startHour, 0, 0, 0);
    }
    return nextStart;
};
exports.scheduleDeliveryWindow = scheduleDeliveryWindow;
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
const validateIpWhitelist = (ip, whitelist) => {
    if (whitelist.length === 0) {
        return true; // No whitelist = allow all
    }
    return whitelist.includes(ip);
};
exports.validateIpWhitelist = validateIpWhitelist;
const checkRateLimit = (subscriptionId, rateLimits, config) => {
    const now = Date.now();
    const entry = rateLimits.get(subscriptionId);
    if (!entry || now >= entry.resetTime) {
        return true;
    }
    return entry.count < config.maxRequests;
};
exports.checkRateLimit = checkRateLimit;
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
const incrementRateLimit = (subscriptionId, rateLimits, config) => {
    const now = Date.now();
    const entry = rateLimits.get(subscriptionId);
    if (!entry || now >= entry.resetTime) {
        rateLimits.set(subscriptionId, {
            count: 1,
            resetTime: now + config.windowMs,
        });
    }
    else {
        entry.count += 1;
    }
};
exports.incrementRateLimit = incrementRateLimit;
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
const moveToDeadLetterQueue = async (DeadLetterModel, delivery, reason) => {
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
exports.moveToDeadLetterQueue = moveToDeadLetterQueue;
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
const processDeadLetterQueue = async (DeadLetterModel, limit = 100) => {
    return await DeadLetterModel.findAll({
        where: {
            processedAt: null,
        },
        order: [['createdAt', 'ASC']],
        limit,
    });
};
exports.processDeadLetterQueue = processDeadLetterQueue;
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
const retryDeadLetterItem = async (dlqItem, deliveryFn) => {
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
    }
    catch {
        return false;
    }
};
exports.retryDeadLetterItem = retryDeadLetterItem;
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
const getDeliveryMetrics = async (DeliveryModel, subscriptionId, startDate, endDate) => {
    const where = {};
    if (subscriptionId)
        where.subscriptionId = subscriptionId;
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate)
            where.createdAt[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.createdAt[sequelize_1.Op.lte] = endDate;
    }
    const deliveries = await DeliveryModel.findAll({ where });
    const total = deliveries.length;
    const successful = deliveries.filter((d) => d.status === 'delivered').length;
    const failed = deliveries.filter((d) => d.status === 'failed').length;
    const retrying = deliveries.filter((d) => d.status === 'retrying').length;
    const deadLetter = deliveries.filter((d) => d.status === 'dead_letter').length;
    // Calculate latencies (mock - would need actual latency data)
    const latencies = deliveries
        .filter((d) => d.deliveredAt)
        .map((d) => d.deliveredAt.getTime() - d.createdAt.getTime());
    latencies.sort((a, b) => a - b);
    return {
        subscriptionId,
        totalDeliveries: total,
        successfulDeliveries: successful,
        failedDeliveries: failed,
        retryingDeliveries: retrying,
        deadLetterDeliveries: deadLetter,
        averageLatency: latencies.length > 0
            ? latencies.reduce((a, b) => a + b, 0) / latencies.length
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
exports.getDeliveryMetrics = getDeliveryMetrics;
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
const logWebhookEvent = (event, action, metadata) => {
    return {
        timestamp: new Date(),
        eventId: event.id,
        eventType: event.type,
        action,
        metadata,
    };
};
exports.logWebhookEvent = logWebhookEvent;
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
const generateAuditLog = (operation, userId, details) => {
    return {
        timestamp: new Date(),
        operation,
        userId,
        details,
    };
};
exports.generateAuditLog = generateAuditLog;
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
const alertOnFailure = async (delivery, threshold = 3) => {
    if (delivery.attempts >= threshold) {
        // Send alert (email, Slack, PagerDuty, etc.)
        console.error(`[WEBHOOK ALERT] Delivery ${delivery.id} failed ${delivery.attempts} times`);
        // Implementation would integrate with alerting service
    }
};
exports.alertOnFailure = alertOnFailure;
// ============================================================================
// NESTJS SERVICES
// ============================================================================
/**
 * NestJS service for webhook management operations
 */
let WebhookService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WebhookService = _classThis = class {
        constructor(subscriptionModel, eventModel, deliveryModel, deadLetterModel) {
            this.subscriptionModel = subscriptionModel;
            this.eventModel = eventModel;
            this.deliveryModel = deliveryModel;
            this.deadLetterModel = deadLetterModel;
        }
        /**
         * Creates a new webhook subscription
         */
        async createSubscription(data) {
            const validated = exports.WebhookSubscriptionSchema.parse(data);
            const subscription = await this.subscriptionModel.create({
                ...validated,
                secret: validated.secret || (0, exports.generateWebhookSecret)(),
            });
            return subscription;
        }
        /**
         * Verifies webhook endpoint
         */
        async verifyEndpoint(subscriptionId) {
            const subscription = await this.subscriptionModel.findByPk(subscriptionId);
            if (!subscription) {
                throw new common_1.HttpException('Subscription not found', common_1.HttpStatus.NOT_FOUND);
            }
            return await (0, exports.verifyWebhookEndpoint)(subscription.url, subscription.secret);
        }
        /**
         * Rotates webhook secret
         */
        async rotateSecret(subscriptionId) {
            const subscription = await this.subscriptionModel.findByPk(subscriptionId);
            if (!subscription) {
                throw new common_1.HttpException('Subscription not found', common_1.HttpStatus.NOT_FOUND);
            }
            const { newSecret, oldSecret, gracePeriodEnd } = (0, exports.rotateWebhookSecret)(subscriptionId, subscription.secret);
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
        async listSubscriptions(filters) {
            return await (0, exports.listWebhookSubscriptions)(this.subscriptionModel, filters);
        }
        /**
         * Gets webhook subscription by ID
         */
        async getSubscription(id) {
            const subscription = await this.subscriptionModel.findByPk(id);
            if (!subscription) {
                throw new common_1.HttpException('Subscription not found', common_1.HttpStatus.NOT_FOUND);
            }
            return subscription;
        }
        /**
         * Updates webhook subscription
         */
        async updateSubscription(id, updates) {
            const subscription = await this.getSubscription(id);
            return await (0, exports.updateWebhookSubscription)(subscription, updates);
        }
        /**
         * Deletes webhook subscription
         */
        async deleteSubscription(id) {
            const subscription = await this.getSubscription(id);
            await (0, exports.deleteWebhookSubscription)(subscription);
        }
    };
    __setFunctionName(_classThis, "WebhookService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhookService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhookService = _classThis;
})();
exports.WebhookService = WebhookService;
/**
 * NestJS service for webhook delivery operations
 */
let WebhookDeliveryService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WebhookDeliveryService = _classThis = class {
        constructor(subscriptionModel, deliveryModel, deadLetterModel) {
            this.subscriptionModel = subscriptionModel;
            this.deliveryModel = deliveryModel;
            this.deadLetterModel = deadLetterModel;
            this.circuitBreakers = new Map();
            this.rateLimits = new Map();
        }
        /**
         * Processes webhook event and delivers to matching subscriptions
         */
        async processEvent(event) {
            const subscriptions = await this.subscriptionModel.findAll({
                where: { active: true },
            });
            const matchingSubscriptions = (0, exports.matchEventToSubscriptions)(event, subscriptions);
            const results = [];
            for (const subscription of matchingSubscriptions) {
                // Check circuit breaker
                if (!(0, exports.checkCircuitBreaker)(subscription.id, this.circuitBreakers)) {
                    console.warn(`Circuit breaker open for subscription ${subscription.id}`);
                    continue;
                }
                // Check rate limit
                const rateLimitConfig = {
                    windowMs: 60000,
                    maxRequests: subscription.rateLimit || 1000,
                };
                if (!(0, exports.checkRateLimit)(subscription.id, this.rateLimits, rateLimitConfig)) {
                    console.warn(`Rate limit exceeded for subscription ${subscription.id}`);
                    continue;
                }
                (0, exports.incrementRateLimit)(subscription.id, this.rateLimits, rateLimitConfig);
                // Create signature headers
                const headers = (0, exports.createSignatureHeaders)(event, subscription.secret);
                // Merge custom headers
                const allHeaders = { ...headers, ...subscription.headers };
                // Attempt delivery
                const result = await (0, exports.deliverWebhookWithRetry)(subscription.id, subscription.url, event, allHeaders, subscription.retryConfig);
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
                    (0, exports.closeCircuitBreaker)(subscription.id, this.circuitBreakers);
                }
                else {
                    const breaker = this.circuitBreakers.get(subscription.id) || {
                        subscriptionId: subscription.id,
                        state: 'closed',
                        failures: 0,
                        threshold: 5,
                        resetTimeout: 60000,
                    };
                    breaker.failures += 1;
                    if (breaker.failures >= breaker.threshold) {
                        (0, exports.openCircuitBreaker)(subscription.id, this.circuitBreakers);
                    }
                    // Move to DLQ if max retries exceeded
                    if (!result.willRetry) {
                        await (0, exports.moveToDeadLetterQueue)(this.deadLetterModel, delivery, 'Max retries exceeded');
                    }
                }
                results.push(result);
            }
            return results;
        }
        /**
         * Retries a failed delivery
         */
        async retryDelivery(deliveryId) {
            const delivery = await this.deliveryModel.findByPk(deliveryId);
            if (!delivery) {
                throw new common_1.HttpException('Delivery not found', common_1.HttpStatus.NOT_FOUND);
            }
            const subscription = await this.subscriptionModel.findByPk(delivery.subscriptionId);
            if (!subscription) {
                throw new common_1.HttpException('Subscription not found', common_1.HttpStatus.NOT_FOUND);
            }
            const headers = (0, exports.createSignatureHeaders)(delivery.payload, subscription.secret);
            const allHeaders = { ...headers, ...subscription.headers };
            const result = await (0, exports.deliverWebhook)(subscription.url, delivery.payload, allHeaders, subscription.retryConfig.timeout);
            await (0, exports.updateDeliveryStatus)(delivery, result.success ? 'delivered' : 'failed', {
                responseStatus: result.status,
                responseBody: result.responseBody,
                errorMessage: result.error,
                deliveredAt: result.success ? new Date() : undefined,
            });
            return {
                success: result.success,
                subscriptionId: subscription.id,
                deliveryId: delivery.id,
                status: result.status,
                responseBody: result.responseBody,
                error: result.error,
                duration: result.duration,
                attempt: delivery.attempts,
                willRetry: false,
            };
        }
        /**
         * Gets delivery metrics
         */
        async getMetrics(subscriptionId, startDate, endDate) {
            return await (0, exports.getDeliveryMetrics)(this.deliveryModel, subscriptionId, startDate, endDate);
        }
    };
    __setFunctionName(_classThis, "WebhookDeliveryService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhookDeliveryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhookDeliveryService = _classThis;
})();
exports.WebhookDeliveryService = WebhookDeliveryService;
// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================
/**
 * NestJS controller for webhook management endpoints
 */
let WebhookController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Webhooks'), (0, common_1.Controller)('webhooks'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createSubscription_decorators;
    let _listSubscriptions_decorators;
    let _getSubscription_decorators;
    let _updateSubscription_decorators;
    let _deleteSubscription_decorators;
    let _verifyEndpoint_decorators;
    let _rotateSecret_decorators;
    let _listDeliveries_decorators;
    let _retryDelivery_decorators;
    let _getMetrics_decorators;
    let _listDeadLetterQueue_decorators;
    var WebhookController = _classThis = class {
        constructor(webhookService, deliveryService) {
            this.webhookService = (__runInitializers(this, _instanceExtraInitializers), webhookService);
            this.deliveryService = deliveryService;
        }
        /**
         * Create webhook subscription
         */
        async createSubscription(data) {
            return await this.webhookService.createSubscription(data);
        }
        /**
         * List webhook subscriptions
         */
        async listSubscriptions(filters) {
            return await this.webhookService.listSubscriptions(filters);
        }
        /**
         * Get webhook subscription
         */
        async getSubscription(id) {
            return await this.webhookService.getSubscription(id);
        }
        /**
         * Update webhook subscription
         */
        async updateSubscription(id, updates) {
            return await this.webhookService.updateSubscription(id, updates);
        }
        /**
         * Delete webhook subscription
         */
        async deleteSubscription(id) {
            await this.webhookService.deleteSubscription(id);
        }
        /**
         * Verify webhook endpoint
         */
        async verifyEndpoint(id) {
            const verified = await this.webhookService.verifyEndpoint(id);
            return { verified };
        }
        /**
         * Rotate webhook secret
         */
        async rotateSecret(id) {
            return await this.webhookService.rotateSecret(id);
        }
        /**
         * List webhook deliveries
         */
        async listDeliveries(filters) {
            // Implementation would query delivery model with filters
            return [];
        }
        /**
         * Retry webhook delivery
         */
        async retryDelivery(id) {
            return await this.deliveryService.retryDelivery(id);
        }
        /**
         * Get webhook metrics
         */
        async getMetrics(query) {
            return await this.deliveryService.getMetrics(query.subscriptionId, query.startDate ? new Date(query.startDate) : undefined, query.endDate ? new Date(query.endDate) : undefined);
        }
        /**
         * List dead letter queue items
         */
        async listDeadLetterQueue() {
            // Implementation would query DLQ model
            return [];
        }
    };
    __setFunctionName(_classThis, "WebhookController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createSubscription_decorators = [(0, common_1.Post)('subscriptions'), (0, swagger_1.ApiOperation)({
                summary: 'Create webhook subscription',
                description: 'Creates a new webhook subscription for receiving event notifications',
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Subscription created successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Invalid subscription data',
            })];
        _listSubscriptions_decorators = [(0, common_1.Get)('subscriptions'), (0, swagger_1.ApiOperation)({
                summary: 'List webhook subscriptions',
                description: 'Retrieves all webhook subscriptions with optional filtering',
            }), (0, swagger_1.ApiQuery)({ name: 'active', required: false, type: Boolean }), (0, swagger_1.ApiQuery)({ name: 'url', required: false, type: String }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Subscriptions retrieved successfully',
            })];
        _getSubscription_decorators = [(0, common_1.Get)('subscriptions/:id'), (0, swagger_1.ApiOperation)({
                summary: 'Get webhook subscription',
                description: 'Retrieves a webhook subscription by ID',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Subscription ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Subscription retrieved successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Subscription not found',
            })];
        _updateSubscription_decorators = [(0, common_1.Put)('subscriptions/:id'), (0, swagger_1.ApiOperation)({
                summary: 'Update webhook subscription',
                description: 'Updates an existing webhook subscription',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Subscription ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Subscription updated successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Subscription not found',
            })];
        _deleteSubscription_decorators = [(0, common_1.Delete)('subscriptions/:id'), (0, swagger_1.ApiOperation)({
                summary: 'Delete webhook subscription',
                description: 'Deletes a webhook subscription',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Subscription ID' }), (0, swagger_1.ApiResponse)({
                status: 204,
                description: 'Subscription deleted successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Subscription not found',
            })];
        _verifyEndpoint_decorators = [(0, common_1.Post)('subscriptions/:id/verify'), (0, swagger_1.ApiOperation)({
                summary: 'Verify webhook endpoint',
                description: 'Verifies that the webhook endpoint can receive webhooks',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Subscription ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Endpoint verified successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Endpoint verification failed',
            })];
        _rotateSecret_decorators = [(0, common_1.Post)('subscriptions/:id/rotate-secret'), (0, swagger_1.ApiOperation)({
                summary: 'Rotate webhook secret',
                description: 'Rotates the webhook secret for enhanced security',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Subscription ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Secret rotated successfully',
            })];
        _listDeliveries_decorators = [(0, common_1.Get)('deliveries'), (0, swagger_1.ApiOperation)({
                summary: 'List webhook deliveries',
                description: 'Retrieves webhook delivery history',
            }), (0, swagger_1.ApiQuery)({ name: 'subscriptionId', required: false, type: String }), (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Deliveries retrieved successfully',
            })];
        _retryDelivery_decorators = [(0, common_1.Post)('deliveries/:id/retry'), (0, swagger_1.ApiOperation)({
                summary: 'Retry webhook delivery',
                description: 'Manually retries a failed webhook delivery',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Delivery ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Delivery retried successfully',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Delivery not found',
            })];
        _getMetrics_decorators = [(0, common_1.Get)('metrics'), (0, swagger_1.ApiOperation)({
                summary: 'Get webhook metrics',
                description: 'Retrieves delivery metrics and statistics',
            }), (0, swagger_1.ApiQuery)({ name: 'subscriptionId', required: false, type: String }), (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }), (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Metrics retrieved successfully',
            })];
        _listDeadLetterQueue_decorators = [(0, common_1.Get)('dead-letter-queue'), (0, swagger_1.ApiOperation)({
                summary: 'List dead letter queue items',
                description: 'Retrieves failed deliveries in dead letter queue',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'DLQ items retrieved successfully',
            })];
        __esDecorate(_classThis, null, _createSubscription_decorators, { kind: "method", name: "createSubscription", static: false, private: false, access: { has: obj => "createSubscription" in obj, get: obj => obj.createSubscription }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listSubscriptions_decorators, { kind: "method", name: "listSubscriptions", static: false, private: false, access: { has: obj => "listSubscriptions" in obj, get: obj => obj.listSubscriptions }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSubscription_decorators, { kind: "method", name: "getSubscription", static: false, private: false, access: { has: obj => "getSubscription" in obj, get: obj => obj.getSubscription }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSubscription_decorators, { kind: "method", name: "updateSubscription", static: false, private: false, access: { has: obj => "updateSubscription" in obj, get: obj => obj.updateSubscription }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteSubscription_decorators, { kind: "method", name: "deleteSubscription", static: false, private: false, access: { has: obj => "deleteSubscription" in obj, get: obj => obj.deleteSubscription }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyEndpoint_decorators, { kind: "method", name: "verifyEndpoint", static: false, private: false, access: { has: obj => "verifyEndpoint" in obj, get: obj => obj.verifyEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rotateSecret_decorators, { kind: "method", name: "rotateSecret", static: false, private: false, access: { has: obj => "rotateSecret" in obj, get: obj => obj.rotateSecret }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listDeliveries_decorators, { kind: "method", name: "listDeliveries", static: false, private: false, access: { has: obj => "listDeliveries" in obj, get: obj => obj.listDeliveries }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _retryDelivery_decorators, { kind: "method", name: "retryDelivery", static: false, private: false, access: { has: obj => "retryDelivery" in obj, get: obj => obj.retryDelivery }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMetrics_decorators, { kind: "method", name: "getMetrics", static: false, private: false, access: { has: obj => "getMetrics" in obj, get: obj => obj.getMetrics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listDeadLetterQueue_decorators, { kind: "method", name: "listDeadLetterQueue", static: false, private: false, access: { has: obj => "listDeadLetterQueue" in obj, get: obj => obj.listDeadLetterQueue }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhookController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhookController = _classThis;
})();
exports.WebhookController = WebhookController;
//# sourceMappingURL=webhook-management-kit.prod.js.map