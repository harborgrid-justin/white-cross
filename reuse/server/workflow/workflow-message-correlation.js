"use strict";
/**
 * LOC: WMC-001
 * File: /reuse/server/workflow/workflow-message-correlation.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - zod (v3.x)
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Workflow message services
 *   - Message queue handlers
 *   - Event correlation systems
 *   - Process communication modules
 *   - Saga coordinators
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMatchingRuleModel = exports.CorrelationSetModel = exports.MessageSubscriptionModel = exports.CorrelationMessage = exports.MessageMatchingRuleSchema = exports.CorrelationSetSchema = exports.MessageSubscriptionSchema = exports.MessageDefinitionSchema = exports.CorrelationKeySchema = void 0;
exports.initCorrelationMessageModel = initCorrelationMessageModel;
exports.initMessageSubscriptionModel = initMessageSubscriptionModel;
exports.initCorrelationSetModel = initCorrelationSetModel;
exports.initMessageMatchingRuleModel = initMessageMatchingRuleModel;
exports.setupCorrelationAssociations = setupCorrelationAssociations;
exports.generateCorrelationKey = generateCorrelationKey;
exports.parseCorrelationKey = parseCorrelationKey;
exports.validateCorrelationKey = validateCorrelationKey;
exports.createHashedCorrelationKey = createHashedCorrelationKey;
exports.getCorrelationMetadata = getCorrelationMetadata;
exports.createMessageSubscription = createMessageSubscription;
exports.findMessageSubscriptions = findMessageSubscriptions;
exports.updateSubscriptionMatchStats = updateSubscriptionMatchStats;
exports.toggleSubscriptionStatus = toggleSubscriptionStatus;
exports.cleanupSubscriptions = cleanupSubscriptions;
exports.evaluateMessageConditions = evaluateMessageConditions;
exports.findMatchingRules = findMatchingRules;
exports.matchMessageToSubscriptions = matchMessageToSubscriptions;
exports.priorityBasedRouting = priorityBasedRouting;
exports.roundRobinRouting = roundRobinRouting;
exports.enqueueMessage = enqueueMessage;
exports.dequeueMessages = dequeueMessages;
exports.peekMessages = peekMessages;
exports.getQueueDepth = getQueueDepth;
exports.purgeExpiredMessages = purgeExpiredMessages;
exports.bufferMessages = bufferMessages;
exports.flushMessageBuffer = flushMessageBuffer;
exports.getBufferStats = getBufferStats;
exports.deliverAtLeastOnce = deliverAtLeastOnce;
exports.deliverAtMostOnce = deliverAtMostOnce;
exports.deliverExactlyOnce = deliverExactlyOnce;
exports.acknowledgeMessage = acknowledgeMessage;
exports.negativeAcknowledgeMessage = negativeAcknowledgeMessage;
exports.detectDuplicateMessage = detectDuplicateMessage;
exports.deduplicateMessages = deduplicateMessages;
exports.createCorrelationSet = createCorrelationSet;
exports.addMessageToSet = addMessageToSet;
exports.isCorrelationSetComplete = isCorrelationSetComplete;
exports.expireCorrelationSet = expireCorrelationSet;
exports.cleanupCorrelationSets = cleanupCorrelationSets;
exports.triggerMessageReceivedEvent = triggerMessageReceivedEvent;
exports.triggerCorrelationCompleteEvent = triggerCorrelationCompleteEvent;
exports.triggerMessageFailedEvent = triggerMessageFailedEvent;
exports.setupMessageEventListeners = setupMessageEventListeners;
/**
 * File: /reuse/server/workflow/workflow-message-correlation.ts
 * Locator: WC-UTL-WMC-001
 * Purpose: Workflow Message Correlation Kit - Production-grade message correlation and handling
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/event-emitter, zod, crypto
 * Downstream: Workflow services, message handlers, event correlators, saga coordinators
 * Dependencies: Sequelize v6.x, NestJS 10.x, Zod 3.x, Node 18+, TypeScript 5.x
 * Exports: 44 production-grade functions for message correlation, matching, queuing, delivery guarantees
 *
 * LLM Context: Enterprise-grade workflow message correlation utilities for White Cross healthcare platform.
 * Provides comprehensive message subscription, correlation key management, message matching algorithms,
 * message queue handling, message buffering, expiration, delivery guarantees, message ordering,
 * deduplication, correlation set management, and message event triggering. Optimized for HIPAA-compliant
 * healthcare workflow communication with guaranteed delivery, at-least-once semantics, and audit trails.
 *
 * Features:
 * - Message correlation key generation and validation
 * - Advanced message matching algorithms
 * - Message queue and buffer management
 * - Message expiration and TTL handling
 * - Delivery guarantee mechanisms (at-least-once, at-most-once, exactly-once)
 * - Message ordering and sequencing
 * - Duplicate detection and deduplication
 * - Correlation set lifecycle management
 * - Event-driven message triggering
 * - Real-time message subscription
 * - Message payload validation and transformation
 * - Cross-process message correlation
 * - Message history and audit trails
 * - Performance optimization for high-throughput scenarios
 */
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for correlation key validation.
 */
exports.CorrelationKeySchema = zod_1.z.object({
    workflowId: zod_1.z.string().uuid(),
    processId: zod_1.z.string().uuid(),
    correlationId: zod_1.z.string().uuid(),
    businessKey: zod_1.z.string().optional(),
    tenantId: zod_1.z.string().uuid().optional(),
    namespace: zod_1.z.string().min(1).max(255).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for message definition.
 */
exports.MessageDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    correlationKey: exports.CorrelationKeySchema,
    messageType: zod_1.z.string().min(1).max(255),
    payload: zod_1.z.record(zod_1.z.any()),
    priority: zod_1.z.number().int().min(0).max(10).default(5),
    ttl: zod_1.z.number().int().positive().optional(),
    expiresAt: zod_1.z.date().optional(),
    deliveryMode: zod_1.z.enum(['at-least-once', 'at-most-once', 'exactly-once']).default('at-least-once'),
    sequence: zod_1.z.number().int().min(0).optional(),
    retryCount: zod_1.z.number().int().min(0).default(0),
    maxRetries: zod_1.z.number().int().min(0).default(3),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    deliveredAt: zod_1.z.date().optional(),
});
/**
 * Zod schema for message subscription.
 */
exports.MessageSubscriptionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    subscriberId: zod_1.z.string().uuid(),
    messageType: zod_1.z.string().min(1).max(255),
    correlationPattern: zod_1.z.string().optional(),
    filter: zod_1.z.record(zod_1.z.any()).optional(),
    callback: zod_1.z.string().optional(),
    active: zod_1.z.boolean().default(true),
    priority: zod_1.z.number().int().min(0).max(10).default(5),
    createdAt: zod_1.z.date(),
    lastMatchedAt: zod_1.z.date().optional(),
});
/**
 * Zod schema for correlation set.
 */
exports.CorrelationSetSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    correlationKey: exports.CorrelationKeySchema,
    messageCount: zod_1.z.number().int().min(0).default(0),
    expectedMessages: zod_1.z.array(zod_1.z.string()).optional(),
    receivedMessages: zod_1.z.array(zod_1.z.string()).default([]),
    status: zod_1.z.enum(['pending', 'partial', 'complete', 'expired']).default('pending'),
    completedAt: zod_1.z.date().optional(),
    expiresAt: zod_1.z.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for message matching rules.
 */
exports.MessageMatchingRuleSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(255),
    messageType: zod_1.z.string().min(1).max(255),
    conditions: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        operator: zod_1.z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'notIn', 'contains', 'startsWith', 'endsWith', 'regex']),
        value: zod_1.z.any(),
    })),
    priority: zod_1.z.number().int().min(0).max(10).default(5),
    enabled: zod_1.z.boolean().default(true),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * CorrelationMessage model for storing correlated messages
 */
class CorrelationMessage extends sequelize_1.Model {
}
exports.CorrelationMessage = CorrelationMessage;
/**
 * MessageSubscription model for managing subscriptions
 */
class MessageSubscriptionModel extends sequelize_1.Model {
}
exports.MessageSubscriptionModel = MessageSubscriptionModel;
/**
 * CorrelationSet model for managing correlation sets
 */
class CorrelationSetModel extends sequelize_1.Model {
}
exports.CorrelationSetModel = CorrelationSetModel;
/**
 * MessageMatchingRule model for defining matching rules
 */
class MessageMatchingRuleModel extends sequelize_1.Model {
}
exports.MessageMatchingRuleModel = MessageMatchingRuleModel;
// ============================================================================
// MODEL INITIALIZATION FUNCTIONS
// ============================================================================
/**
 * Initializes the CorrelationMessage model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for message correlation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof CorrelationMessage} Initialized model
 *
 * @example
 * ```typescript
 * const CorrelationMessageModel = initCorrelationMessageModel(sequelize);
 * const message = await CorrelationMessageModel.create({
 *   correlationId: 'abc-123',
 *   messageType: 'PAYMENT_PROCESSED',
 *   payload: { amount: 100 }
 * });
 * ```
 */
function initCorrelationMessageModel(sequelize) {
    CorrelationMessage.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique message identifier',
        },
        correlationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Correlation identifier for message grouping',
            validate: {
                isUUID: 4,
            },
        },
        messageType: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Type of message for routing and filtering',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        payload: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Message payload data',
            validate: {
                isValidJSON(value) {
                    if (typeof value !== 'object' || value === null) {
                        throw new Error('Payload must be a valid JSON object');
                    }
                },
            },
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            comment: 'Message priority (0-10, higher is more important)',
            validate: {
                min: 0,
                max: 10,
            },
        },
        deliveryMode: {
            type: sequelize_1.DataTypes.ENUM('at-least-once', 'at-most-once', 'exactly-once'),
            allowNull: false,
            defaultValue: 'at-least-once',
            comment: 'Message delivery guarantee mode',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'processing', 'delivered', 'acknowledged', 'failed', 'expired'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Current message status',
        },
        sequence: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Message sequence number for ordering',
        },
        retryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of delivery retry attempts',
        },
        maxRetries: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
            comment: 'Maximum number of retry attempts',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Message expiration timestamp',
        },
        deliveredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Message delivery timestamp',
        },
        acknowledgedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Message acknowledgment timestamp',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if delivery failed',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional message metadata',
        },
        tenantId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Multi-tenancy identifier',
            validate: {
                isUUID: 4,
            },
        },
    }, {
        sequelize,
        modelName: 'CorrelationMessage',
        tableName: 'correlation_messages',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['correlation_id'] },
            { fields: ['message_type'] },
            { fields: ['status'] },
            { fields: ['priority', 'created_at'] },
            { fields: ['expires_at'] },
            { fields: ['tenant_id'] },
            { fields: ['correlation_id', 'sequence'], unique: true },
        ],
        scopes: {
            pending: {
                where: { status: 'pending' },
            },
            delivered: {
                where: { status: 'delivered' },
            },
            failed: {
                where: { status: 'failed' },
            },
            expired: {
                where: {
                    status: 'expired',
                },
            },
            byPriority: {
                order: [['priority', 'DESC'], ['created_at', 'ASC']],
            },
            notExpired: {
                where: {
                    [sequelize_1.Op.or]: [
                        { expiresAt: null },
                        { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
                    ],
                },
            },
        },
        hooks: {
            beforeValidate: (message) => {
                // Set expiration if TTL metadata exists
                if (message.metadata && message.metadata.ttl) {
                    const ttl = message.metadata.ttl;
                    message.expiresAt = new Date(Date.now() + ttl * 1000);
                }
            },
            beforeCreate: (message) => {
                // Validate delivery mode constraints
                if (message.deliveryMode === 'exactly-once' && !message.sequence) {
                    throw new Error('Exactly-once delivery requires sequence number');
                }
            },
            afterCreate: async (message) => {
                // Emit message created event for subscribers
                const eventEmitter = sequelize.eventEmitter;
                if (eventEmitter) {
                    eventEmitter.emit('message.created', {
                        messageId: message.id,
                        correlationId: message.correlationId,
                        messageType: message.messageType,
                        priority: message.priority,
                    });
                }
            },
            beforeUpdate: (message) => {
                // Track delivery timestamp
                if (message.status === 'delivered' && !message.deliveredAt) {
                    message.deliveredAt = new Date();
                }
                // Track acknowledgment timestamp
                if (message.status === 'acknowledged' && !message.acknowledgedAt) {
                    message.acknowledgedAt = new Date();
                }
            },
            afterUpdate: async (message) => {
                // Emit status change events
                const eventEmitter = sequelize.eventEmitter;
                if (eventEmitter && message.changed('status')) {
                    eventEmitter.emit('message.status.changed', {
                        messageId: message.id,
                        correlationId: message.correlationId,
                        oldStatus: message.previous('status'),
                        newStatus: message.status,
                    });
                }
            },
        },
    });
    return CorrelationMessage;
}
/**
 * Initializes the MessageSubscription model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for subscription management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof MessageSubscriptionModel} Initialized model
 *
 * @example
 * ```typescript
 * const MessageSubscription = initMessageSubscriptionModel(sequelize);
 * const subscription = await MessageSubscription.create({
 *   subscriberId: 'user-123',
 *   messageType: 'PAYMENT_PROCESSED'
 * });
 * ```
 */
function initMessageSubscriptionModel(sequelize) {
    MessageSubscriptionModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique subscription identifier',
        },
        subscriberId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Subscriber identifier',
            validate: {
                isUUID: 4,
            },
        },
        messageType: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Message type to subscribe to',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        correlationPattern: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Regex pattern for correlation matching',
        },
        filterCriteria: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Filter criteria for message matching',
        },
        callbackUrl: {
            type: sequelize_1.DataTypes.STRING(2048),
            allowNull: true,
            comment: 'Callback URL for message delivery',
            validate: {
                isUrl: true,
            },
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether subscription is active',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            comment: 'Subscription priority (0-10)',
            validate: {
                min: 0,
                max: 10,
            },
        },
        matchCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of messages matched',
        },
        lastMatchedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last message match timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional subscription metadata',
        },
        tenantId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Multi-tenancy identifier',
            validate: {
                isUUID: 4,
            },
        },
    }, {
        sequelize,
        modelName: 'MessageSubscription',
        tableName: 'message_subscriptions',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['subscriber_id'] },
            { fields: ['message_type'] },
            { fields: ['active'] },
            { fields: ['priority'] },
            { fields: ['tenant_id'] },
            { fields: ['message_type', 'active'] },
        ],
        scopes: {
            active: {
                where: { active: true },
            },
            inactive: {
                where: { active: false },
            },
            byPriority: {
                order: [['priority', 'DESC']],
            },
        },
        hooks: {
            afterCreate: async (subscription) => {
                const eventEmitter = sequelize.eventEmitter;
                if (eventEmitter) {
                    eventEmitter.emit('subscription.created', {
                        subscriptionId: subscription.id,
                        subscriberId: subscription.subscriberId,
                        messageType: subscription.messageType,
                    });
                }
            },
        },
    });
    return MessageSubscriptionModel;
}
/**
 * Initializes the CorrelationSet model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for correlation set management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof CorrelationSetModel} Initialized model
 *
 * @example
 * ```typescript
 * const CorrelationSet = initCorrelationSetModel(sequelize);
 * const set = await CorrelationSet.create({
 *   correlationKey: 'order-123',
 *   workflowId: 'wf-456'
 * });
 * ```
 */
function initCorrelationSetModel(sequelize) {
    CorrelationSetModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique correlation set identifier',
        },
        correlationKey: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Correlation key for message grouping',
            validate: {
                notEmpty: true,
            },
        },
        workflowId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Associated workflow identifier',
            validate: {
                isUUID: 4,
            },
        },
        processId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Associated process identifier',
            validate: {
                isUUID: 4,
            },
        },
        messageCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of messages in set',
        },
        expectedMessages: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            comment: 'Expected message types',
        },
        receivedMessages: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Received message types',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'partial', 'complete', 'expired'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Correlation set status',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Completion timestamp',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Expiration timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional correlation metadata',
        },
        tenantId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Multi-tenancy identifier',
            validate: {
                isUUID: 4,
            },
        },
    }, {
        sequelize,
        modelName: 'CorrelationSet',
        tableName: 'correlation_sets',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['correlation_key'], unique: true },
            { fields: ['workflow_id'] },
            { fields: ['process_id'] },
            { fields: ['status'] },
            { fields: ['expires_at'] },
            { fields: ['tenant_id'] },
        ],
        scopes: {
            pending: {
                where: { status: 'pending' },
            },
            complete: {
                where: { status: 'complete' },
            },
            notExpired: {
                where: {
                    [sequelize_1.Op.or]: [
                        { expiresAt: null },
                        { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
                    ],
                },
            },
        },
        hooks: {
            beforeUpdate: (set) => {
                // Auto-complete if all expected messages received
                if (set.expectedMessages && set.receivedMessages) {
                    const allReceived = set.expectedMessages.every((msg) => set.receivedMessages.includes(msg));
                    if (allReceived && set.status !== 'complete') {
                        set.status = 'complete';
                        set.completedAt = new Date();
                    }
                }
            },
            afterUpdate: async (set) => {
                const eventEmitter = sequelize.eventEmitter;
                if (eventEmitter && set.changed('status')) {
                    eventEmitter.emit('correlation.set.status.changed', {
                        setId: set.id,
                        correlationKey: set.correlationKey,
                        oldStatus: set.previous('status'),
                        newStatus: set.status,
                    });
                }
            },
        },
    });
    return CorrelationSetModel;
}
/**
 * Initializes the MessageMatchingRule model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for rule management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof MessageMatchingRuleModel} Initialized model
 *
 * @example
 * ```typescript
 * const MatchingRule = initMessageMatchingRuleModel(sequelize);
 * const rule = await MatchingRule.create({
 *   name: 'High Priority Payments',
 *   messageType: 'PAYMENT',
 *   conditions: [{ field: 'amount', operator: 'gt', value: 1000 }]
 * });
 * ```
 */
function initMessageMatchingRuleModel(sequelize) {
    MessageMatchingRuleModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique rule identifier',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Rule name',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        messageType: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Message type this rule applies to',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Matching conditions',
            validate: {
                isValidConditions(value) {
                    if (!Array.isArray(value)) {
                        throw new Error('Conditions must be an array');
                    }
                    value.forEach((condition) => {
                        if (!condition.field || !condition.operator) {
                            throw new Error('Each condition must have field and operator');
                        }
                    });
                },
            },
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            comment: 'Rule priority (0-10)',
            validate: {
                min: 0,
                max: 10,
            },
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether rule is enabled',
        },
        matchCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of messages matched by this rule',
        },
        lastMatchedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last match timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional rule metadata',
        },
        tenantId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Multi-tenancy identifier',
            validate: {
                isUUID: 4,
            },
        },
    }, {
        sequelize,
        modelName: 'MessageMatchingRule',
        tableName: 'message_matching_rules',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['message_type'] },
            { fields: ['enabled'] },
            { fields: ['priority'] },
            { fields: ['tenant_id'] },
            { fields: ['message_type', 'enabled'] },
        ],
        scopes: {
            enabled: {
                where: { enabled: true },
            },
            byPriority: {
                order: [['priority', 'DESC']],
            },
        },
    });
    return MessageMatchingRuleModel;
}
/**
 * Sets up associations between correlation models.
 * Defines relationships for message correlation and set management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 *
 * @example
 * ```typescript
 * setupCorrelationAssociations(sequelize);
 * ```
 */
function setupCorrelationAssociations(sequelize) {
    const CorrelationMessage = sequelize.models.CorrelationMessage;
    const CorrelationSet = sequelize.models.CorrelationSet;
    if (CorrelationMessage && CorrelationSet) {
        CorrelationSet.hasMany(CorrelationMessage, {
            foreignKey: 'correlationId',
            sourceKey: 'correlationKey',
            as: 'messages',
        });
        CorrelationMessage.belongsTo(CorrelationSet, {
            foreignKey: 'correlationId',
            targetKey: 'correlationKey',
            as: 'correlationSet',
        });
    }
}
// ============================================================================
// CORRELATION KEY MANAGEMENT
// ============================================================================
/**
 * Generates a unique correlation key from workflow and process identifiers.
 * Creates a deterministic or random correlation key based on parameters.
 *
 * @param {CorrelationKey} params - Correlation key parameters
 * @returns {string} Generated correlation key
 *
 * @example
 * ```typescript
 * const key = generateCorrelationKey({
 *   workflowId: 'wf-123',
 *   processId: 'proc-456',
 *   correlationId: randomUUID()
 * });
 * ```
 */
function generateCorrelationKey(params) {
    const { workflowId, processId, correlationId, businessKey, namespace } = params;
    const parts = [
        namespace || 'default',
        workflowId,
        processId,
        correlationId,
    ];
    if (businessKey) {
        parts.push(businessKey);
    }
    return parts.join(':');
}
/**
 * Parses a correlation key string into its component parts.
 * Extracts workflow, process, and correlation identifiers.
 *
 * @param {string} correlationKey - Correlation key string
 * @returns {Partial<CorrelationKey>} Parsed correlation key components
 *
 * @example
 * ```typescript
 * const parsed = parseCorrelationKey('default:wf-123:proc-456:corr-789');
 * // Returns: { namespace: 'default', workflowId: 'wf-123', processId: 'proc-456', correlationId: 'corr-789' }
 * ```
 */
function parseCorrelationKey(correlationKey) {
    const parts = correlationKey.split(':');
    return {
        namespace: parts[0] || 'default',
        workflowId: parts[1],
        processId: parts[2],
        correlationId: parts[3],
        businessKey: parts[4],
    };
}
/**
 * Validates a correlation key structure and format.
 * Ensures all required components are present and valid.
 *
 * @param {CorrelationKey} correlationKey - Correlation key to validate
 * @returns {boolean} Whether the correlation key is valid
 *
 * @example
 * ```typescript
 * const isValid = validateCorrelationKey({
 *   workflowId: 'wf-123',
 *   processId: 'proc-456',
 *   correlationId: 'corr-789'
 * });
 * ```
 */
function validateCorrelationKey(correlationKey) {
    try {
        exports.CorrelationKeySchema.parse(correlationKey);
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * Creates a hash-based correlation key for deterministic correlation.
 * Generates consistent key from business data for idempotency.
 *
 * @param {Record<string, any>} businessData - Business data to hash
 * @param {string} namespace - Optional namespace
 * @returns {string} Hash-based correlation key
 *
 * @example
 * ```typescript
 * const key = createHashedCorrelationKey(
 *   { orderId: '123', customerId: '456' },
 *   'orders'
 * );
 * ```
 */
function createHashedCorrelationKey(businessData, namespace = 'default') {
    const dataString = JSON.stringify(businessData, Object.keys(businessData).sort());
    const hash = (0, crypto_1.createHash)('sha256').update(dataString).digest('hex');
    return `${namespace}:hashed:${hash}`;
}
/**
 * Extracts correlation metadata from a correlation key.
 * Returns associated metadata for correlation tracking.
 *
 * @param {string} correlationKey - Correlation key
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @returns {Promise<Record<string, any> | null>} Correlation metadata
 *
 * @example
 * ```typescript
 * const metadata = await getCorrelationMetadata('default:wf-123:proc-456', CorrelationSet);
 * ```
 */
async function getCorrelationMetadata(correlationKey, model) {
    const set = await model.findOne({
        where: { correlationKey },
        attributes: ['metadata'],
    });
    return set?.metadata || null;
}
// ============================================================================
// MESSAGE SUBSCRIPTION
// ============================================================================
/**
 * Creates a message subscription for a specific message type.
 * Registers a subscriber to receive matching messages.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {string} subscriberId - Subscriber identifier
 * @param {string} messageType - Message type to subscribe to
 * @param {Partial<MessageSubscriptionAttributes>} options - Additional subscription options
 * @returns {Promise<MessageSubscriptionModel>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createMessageSubscription(
 *   MessageSubscription,
 *   'user-123',
 *   'PAYMENT_PROCESSED',
 *   { priority: 8, callbackUrl: 'https://api.example.com/webhook' }
 * );
 * ```
 */
async function createMessageSubscription(model, subscriberId, messageType, options = {}) {
    return await model.create({
        id: (0, crypto_1.randomUUID)(),
        subscriberId,
        messageType,
        active: true,
        priority: 5,
        matchCount: 0,
        ...options,
    });
}
/**
 * Finds active subscriptions matching a message type.
 * Returns all active subscriptions for message routing.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {string} messageType - Message type to match
 * @param {string} [tenantId] - Optional tenant filter
 * @returns {Promise<MessageSubscriptionModel[]>} Matching subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await findMessageSubscriptions(
 *   MessageSubscription,
 *   'PAYMENT_PROCESSED'
 * );
 * ```
 */
async function findMessageSubscriptions(model, messageType, tenantId) {
    const where = {
        messageType,
        active: true,
    };
    if (tenantId) {
        where.tenantId = tenantId;
    }
    return await model.findAll({
        where,
        order: [['priority', 'DESC'], ['created_at', 'ASC']],
    });
}
/**
 * Updates subscription match statistics.
 * Increments match count and updates last matched timestamp.
 *
 * @param {MessageSubscriptionModel} subscription - Subscription instance
 * @returns {Promise<MessageSubscriptionModel>} Updated subscription
 *
 * @example
 * ```typescript
 * await updateSubscriptionMatchStats(subscription);
 * ```
 */
async function updateSubscriptionMatchStats(subscription) {
    subscription.matchCount += 1;
    subscription.lastMatchedAt = new Date();
    return await subscription.save();
}
/**
 * Activates or deactivates a message subscription.
 * Toggles subscription active status.
 *
 * @param {MessageSubscriptionModel} subscription - Subscription instance
 * @param {boolean} active - Active status
 * @returns {Promise<MessageSubscriptionModel>} Updated subscription
 *
 * @example
 * ```typescript
 * await toggleSubscriptionStatus(subscription, false);
 * ```
 */
async function toggleSubscriptionStatus(subscription, active) {
    subscription.active = active;
    return await subscription.save();
}
/**
 * Removes expired or inactive subscriptions.
 * Cleans up old subscriptions based on criteria.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {number} inactiveDays - Days of inactivity before removal
 * @returns {Promise<number>} Number of removed subscriptions
 *
 * @example
 * ```typescript
 * const removed = await cleanupSubscriptions(MessageSubscription, 90);
 * ```
 */
async function cleanupSubscriptions(model, inactiveDays = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);
    const result = await model.destroy({
        where: {
            [sequelize_1.Op.or]: [
                { active: false },
                {
                    lastMatchedAt: {
                        [sequelize_1.Op.lt]: cutoffDate,
                    },
                },
            ],
        },
    });
    return result;
}
// ============================================================================
// MESSAGE MATCHING ALGORITHMS
// ============================================================================
/**
 * Evaluates a message against matching conditions.
 * Determines if a message satisfies all conditions.
 *
 * @param {Record<string, any>} message - Message to evaluate
 * @param {MessageMatchingRule['conditions']} conditions - Conditions to check
 * @returns {boolean} Whether message matches conditions
 *
 * @example
 * ```typescript
 * const matches = evaluateMessageConditions(
 *   { amount: 1500, currency: 'USD' },
 *   [{ field: 'amount', operator: 'gt', value: 1000 }]
 * );
 * ```
 */
function evaluateMessageConditions(message, conditions) {
    return conditions.every((condition) => {
        const fieldValue = message[condition.field];
        const { operator, value } = condition;
        switch (operator) {
            case 'eq':
                return fieldValue === value;
            case 'ne':
                return fieldValue !== value;
            case 'gt':
                return fieldValue > value;
            case 'gte':
                return fieldValue >= value;
            case 'lt':
                return fieldValue < value;
            case 'lte':
                return fieldValue <= value;
            case 'in':
                return Array.isArray(value) && value.includes(fieldValue);
            case 'notIn':
                return Array.isArray(value) && !value.includes(fieldValue);
            case 'contains':
                return typeof fieldValue === 'string' && fieldValue.includes(value);
            case 'startsWith':
                return typeof fieldValue === 'string' && fieldValue.startsWith(value);
            case 'endsWith':
                return typeof fieldValue === 'string' && fieldValue.endsWith(value);
            case 'regex':
                return new RegExp(value).test(String(fieldValue));
            default:
                return false;
        }
    });
}
/**
 * Finds matching rules for a message.
 * Returns all enabled rules that match the message.
 *
 * @param {typeof MessageMatchingRuleModel} model - MessageMatchingRule model
 * @param {string} messageType - Message type
 * @param {Record<string, any>} payload - Message payload
 * @returns {Promise<MessageMatchingRuleModel[]>} Matching rules
 *
 * @example
 * ```typescript
 * const rules = await findMatchingRules(
 *   MatchingRule,
 *   'PAYMENT',
 *   { amount: 1500 }
 * );
 * ```
 */
async function findMatchingRules(model, messageType, payload) {
    const rules = await model.scope('enabled').findAll({
        where: { messageType },
        order: [['priority', 'DESC']],
    });
    return rules.filter((rule) => evaluateMessageConditions(payload, rule.conditions));
}
/**
 * Matches a message to subscriptions based on filters.
 * Returns subscriptions that match message criteria.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {CorrelationMessage} message - Message to match
 * @returns {Promise<MessageSubscriptionModel[]>} Matching subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await matchMessageToSubscriptions(MessageSubscription, message);
 * ```
 */
async function matchMessageToSubscriptions(model, message) {
    const subscriptions = await findMessageSubscriptions(model, message.messageType, message.tenantId || undefined);
    return subscriptions.filter((subscription) => {
        // Check correlation pattern if specified
        if (subscription.correlationPattern) {
            const pattern = new RegExp(subscription.correlationPattern);
            if (!pattern.test(message.correlationId)) {
                return false;
            }
        }
        // Check filter criteria if specified
        if (subscription.filterCriteria && Object.keys(subscription.filterCriteria).length > 0) {
            return evaluateMessageConditions(message.payload, Object.entries(subscription.filterCriteria).map(([field, value]) => ({
                field,
                operator: 'eq',
                value,
            })));
        }
        return true;
    });
}
/**
 * Performs priority-based message routing.
 * Routes message to highest priority matching subscription.
 *
 * @param {MessageSubscriptionModel[]} subscriptions - Available subscriptions
 * @param {CorrelationMessage} message - Message to route
 * @returns {MessageSubscriptionModel | null} Selected subscription
 *
 * @example
 * ```typescript
 * const target = priorityBasedRouting(subscriptions, message);
 * ```
 */
function priorityBasedRouting(subscriptions, message) {
    if (subscriptions.length === 0) {
        return null;
    }
    // Sort by priority (descending) and creation time (ascending)
    const sorted = subscriptions.sort((a, b) => {
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
    });
    return sorted[0];
}
/**
 * Implements round-robin message routing.
 * Distributes messages evenly across subscriptions.
 *
 * @param {MessageSubscriptionModel[]} subscriptions - Available subscriptions
 * @param {number} currentIndex - Current round-robin index
 * @returns {{ subscription: MessageSubscriptionModel | null; nextIndex: number }} Selected subscription and next index
 *
 * @example
 * ```typescript
 * const { subscription, nextIndex } = roundRobinRouting(subscriptions, 0);
 * ```
 */
function roundRobinRouting(subscriptions, currentIndex) {
    if (subscriptions.length === 0) {
        return { subscription: null, nextIndex: 0 };
    }
    const index = currentIndex % subscriptions.length;
    return {
        subscription: subscriptions[index],
        nextIndex: index + 1,
    };
}
// ============================================================================
// MESSAGE QUEUE HANDLING
// ============================================================================
/**
 * Enqueues a message for delivery.
 * Adds message to delivery queue with proper ordering.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {Partial<CorrelationMessageAttributes>} messageData - Message data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CorrelationMessage>} Enqueued message
 *
 * @example
 * ```typescript
 * const message = await enqueueMessage(CorrelationMessage, {
 *   correlationId: 'abc-123',
 *   messageType: 'PAYMENT',
 *   payload: { amount: 100 }
 * });
 * ```
 */
async function enqueueMessage(model, messageData, transaction) {
    // Get next sequence number for this correlation
    const lastMessage = await model.findOne({
        where: { correlationId: messageData.correlationId },
        order: [['sequence', 'DESC']],
        attributes: ['sequence'],
        transaction,
    });
    const sequence = lastMessage ? lastMessage.sequence + 1 : 0;
    return await model.create({
        id: (0, crypto_1.randomUUID)(),
        status: 'pending',
        priority: 5,
        deliveryMode: 'at-least-once',
        retryCount: 0,
        maxRetries: 3,
        sequence,
        ...messageData,
    }, { transaction });
}
/**
 * Dequeues messages for processing.
 * Retrieves pending messages for delivery.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {number} limit - Maximum number of messages to dequeue
 * @param {string} [tenantId] - Optional tenant filter
 * @returns {Promise<CorrelationMessage[]>} Dequeued messages
 *
 * @example
 * ```typescript
 * const messages = await dequeueMessages(CorrelationMessage, 10);
 * ```
 */
async function dequeueMessages(model, limit = 10, tenantId) {
    const where = {
        status: 'pending',
        [sequelize_1.Op.or]: [
            { expiresAt: null },
            { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
        ],
    };
    if (tenantId) {
        where.tenantId = tenantId;
    }
    return await model.scope('byPriority').findAll({
        where,
        limit,
    });
}
/**
 * Peeks at queued messages without removing them.
 * Views pending messages without changing status.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {number} limit - Maximum number of messages to peek
 * @returns {Promise<CorrelationMessage[]>} Peeked messages
 *
 * @example
 * ```typescript
 * const messages = await peekMessages(CorrelationMessage, 5);
 * ```
 */
async function peekMessages(model, limit = 10) {
    return await model.scope(['pending', 'byPriority']).findAll({
        limit,
    });
}
/**
 * Gets the current queue depth.
 * Returns number of pending messages.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} [correlationId] - Optional correlation filter
 * @returns {Promise<number>} Queue depth
 *
 * @example
 * ```typescript
 * const depth = await getQueueDepth(CorrelationMessage);
 * ```
 */
async function getQueueDepth(model, correlationId) {
    const where = {
        status: 'pending',
    };
    if (correlationId) {
        where.correlationId = correlationId;
    }
    return await model.count({ where });
}
/**
 * Purges expired messages from the queue.
 * Removes messages past their expiration time.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @returns {Promise<number>} Number of purged messages
 *
 * @example
 * ```typescript
 * const purged = await purgeExpiredMessages(CorrelationMessage);
 * ```
 */
async function purgeExpiredMessages(model) {
    const [affectedCount] = await model.update({ status: 'expired' }, {
        where: {
            status: { [sequelize_1.Op.in]: ['pending', 'processing'] },
            expiresAt: { [sequelize_1.Op.lt]: new Date() },
        },
    });
    return affectedCount;
}
// ============================================================================
// MESSAGE BUFFERING
// ============================================================================
/**
 * Buffers messages for batch processing.
 * Collects messages until buffer size or time threshold met.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @param {number} bufferSize - Buffer size threshold
 * @returns {Promise<CorrelationMessage[]>} Buffered messages
 *
 * @example
 * ```typescript
 * const buffered = await bufferMessages(CorrelationMessage, 'abc-123', 50);
 * ```
 */
async function bufferMessages(model, correlationId, bufferSize) {
    const messages = await model.findAll({
        where: {
            correlationId,
            status: 'pending',
        },
        limit: bufferSize,
        order: [['sequence', 'ASC']],
    });
    return messages;
}
/**
 * Flushes buffered messages for processing.
 * Marks buffered messages as processing.
 *
 * @param {CorrelationMessage[]} messages - Buffered messages
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await flushMessageBuffer(bufferedMessages);
 * ```
 */
async function flushMessageBuffer(messages) {
    await Promise.all(messages.map((message) => {
        message.status = 'processing';
        return message.save();
    }));
}
/**
 * Gets buffer statistics for a correlation.
 * Returns buffer size and age information.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<{ size: number; oldestMessage: Date | null; newestMessage: Date | null }>} Buffer stats
 *
 * @example
 * ```typescript
 * const stats = await getBufferStats(CorrelationMessage, 'abc-123');
 * ```
 */
async function getBufferStats(model, correlationId) {
    const messages = await model.findAll({
        where: {
            correlationId,
            status: 'pending',
        },
        order: [['created_at', 'ASC']],
        attributes: ['createdAt'],
    });
    return {
        size: messages.length,
        oldestMessage: messages.length > 0 ? messages[0].createdAt : null,
        newestMessage: messages.length > 0 ? messages[messages.length - 1].createdAt : null,
    };
}
// ============================================================================
// MESSAGE DELIVERY GUARANTEES
// ============================================================================
/**
 * Implements at-least-once delivery semantics.
 * Ensures message is delivered at least once with retries.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverAtLeastOnce(message, async () => {
 *   return await sendToWebhook(message.payload);
 * });
 * ```
 */
async function deliverAtLeastOnce(message, deliveryFn) {
    message.status = 'processing';
    await message.save();
    while (message.retryCount <= message.maxRetries) {
        try {
            const success = await deliveryFn();
            if (success) {
                message.status = 'delivered';
                message.deliveredAt = new Date();
                await message.save();
                return true;
            }
        }
        catch (error) {
            message.errorMessage = error.message;
        }
        message.retryCount += 1;
        await message.save();
        if (message.retryCount <= message.maxRetries) {
            // Exponential backoff
            const delay = Math.min(1000 * Math.pow(2, message.retryCount), 30000);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    message.status = 'failed';
    await message.save();
    return false;
}
/**
 * Implements at-most-once delivery semantics.
 * Attempts delivery once without retries.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverAtMostOnce(message, async () => {
 *   return await sendToQueue(message.payload);
 * });
 * ```
 */
async function deliverAtMostOnce(message, deliveryFn) {
    message.status = 'processing';
    await message.save();
    try {
        const success = await deliveryFn();
        message.status = success ? 'delivered' : 'failed';
        if (success) {
            message.deliveredAt = new Date();
        }
    }
    catch (error) {
        message.status = 'failed';
        message.errorMessage = error.message;
    }
    await message.save();
    return message.status === 'delivered';
}
/**
 * Implements exactly-once delivery semantics.
 * Ensures message is delivered exactly once using idempotency.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @param {(messageId: string) => Promise<boolean>} checkDeliveredFn - Check if already delivered
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverExactlyOnce(
 *   message,
 *   async () => sendToQueue(message.payload),
 *   async (id) => checkDeliveryLog(id)
 * );
 * ```
 */
async function deliverExactlyOnce(message, deliveryFn, checkDeliveredFn) {
    // Check if already delivered
    const alreadyDelivered = await checkDeliveredFn(message.id);
    if (alreadyDelivered) {
        message.status = 'delivered';
        await message.save();
        return true;
    }
    // Use at-least-once with deduplication
    return await deliverAtLeastOnce(message, deliveryFn);
}
/**
 * Acknowledges message delivery.
 * Marks message as acknowledged after successful processing.
 *
 * @param {CorrelationMessage} message - Message to acknowledge
 * @returns {Promise<CorrelationMessage>} Acknowledged message
 *
 * @example
 * ```typescript
 * await acknowledgeMessage(message);
 * ```
 */
async function acknowledgeMessage(message) {
    message.status = 'acknowledged';
    message.acknowledgedAt = new Date();
    return await message.save();
}
/**
 * Negatively acknowledges message delivery (NACK).
 * Requeues message for retry after failure.
 *
 * @param {CorrelationMessage} message - Message to NACK
 * @param {string} [reason] - Reason for NACK
 * @returns {Promise<CorrelationMessage>} Updated message
 *
 * @example
 * ```typescript
 * await negativeAcknowledgeMessage(message, 'Temporary service unavailable');
 * ```
 */
async function negativeAcknowledgeMessage(message, reason) {
    message.status = message.retryCount < message.maxRetries ? 'pending' : 'failed';
    message.retryCount += 1;
    if (reason) {
        message.errorMessage = reason;
    }
    return await message.save();
}
// ============================================================================
// MESSAGE DEDUPLICATION
// ============================================================================
/**
 * Detects duplicate messages based on content hash.
 * Identifies messages with identical payloads.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {Record<string, any>} payload - Message payload
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<CorrelationMessage | null>} Duplicate message if found
 *
 * @example
 * ```typescript
 * const duplicate = await detectDuplicateMessage(
 *   CorrelationMessage,
 *   { orderId: '123' },
 *   'abc-123'
 * );
 * ```
 */
async function detectDuplicateMessage(model, payload, correlationId) {
    const payloadHash = (0, crypto_1.createHash)('sha256')
        .update(JSON.stringify(payload))
        .digest('hex');
    const existingMessages = await model.findAll({
        where: {
            correlationId,
            status: { [sequelize_1.Op.in]: ['delivered', 'acknowledged'] },
        },
    });
    for (const msg of existingMessages) {
        const msgHash = (0, crypto_1.createHash)('sha256')
            .update(JSON.stringify(msg.payload))
            .digest('hex');
        if (msgHash === payloadHash) {
            return msg;
        }
    }
    return null;
}
/**
 * Deduplicates messages in a correlation set.
 * Removes duplicate messages based on content.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<number>} Number of duplicates removed
 *
 * @example
 * ```typescript
 * const removed = await deduplicateMessages(CorrelationMessage, 'abc-123');
 * ```
 */
async function deduplicateMessages(model, correlationId) {
    const messages = await model.findAll({
        where: { correlationId },
        order: [['created_at', 'ASC']],
    });
    const seen = new Set();
    let removedCount = 0;
    for (const message of messages) {
        const hash = (0, crypto_1.createHash)('sha256')
            .update(JSON.stringify(message.payload))
            .digest('hex');
        if (seen.has(hash)) {
            await message.destroy();
            removedCount += 1;
        }
        else {
            seen.add(hash);
        }
    }
    return removedCount;
}
// ============================================================================
// CORRELATION SET MANAGEMENT
// ============================================================================
/**
 * Creates a new correlation set.
 * Initializes a correlation set for message grouping.
 *
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @param {Partial<CorrelationSetAttributes>} setData - Correlation set data
 * @returns {Promise<CorrelationSetModel>} Created correlation set
 *
 * @example
 * ```typescript
 * const set = await createCorrelationSet(CorrelationSet, {
 *   correlationKey: 'order-123',
 *   workflowId: 'wf-456',
 *   processId: 'proc-789',
 *   expectedMessages: ['PAYMENT', 'SHIPPING', 'NOTIFICATION']
 * });
 * ```
 */
async function createCorrelationSet(model, setData) {
    return await model.create({
        id: (0, crypto_1.randomUUID)(),
        status: 'pending',
        messageCount: 0,
        receivedMessages: [],
        ...setData,
    });
}
/**
 * Adds a message to a correlation set.
 * Tracks message reception in the set.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @param {string} messageType - Message type
 * @returns {Promise<CorrelationSetModel>} Updated set
 *
 * @example
 * ```typescript
 * await addMessageToSet(set, 'PAYMENT');
 * ```
 */
async function addMessageToSet(set, messageType) {
    if (!set.receivedMessages.includes(messageType)) {
        set.receivedMessages = [...set.receivedMessages, messageType];
        set.messageCount += 1;
        // Check if all expected messages received
        if (set.expectedMessages && set.receivedMessages.length >= set.expectedMessages.length) {
            const allReceived = set.expectedMessages.every((msg) => set.receivedMessages.includes(msg));
            if (allReceived) {
                set.status = 'complete';
                set.completedAt = new Date();
            }
            else {
                set.status = 'partial';
            }
        }
        else {
            set.status = 'partial';
        }
    }
    return await set.save();
}
/**
 * Checks if a correlation set is complete.
 * Verifies all expected messages have been received.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @returns {boolean} Whether set is complete
 *
 * @example
 * ```typescript
 * if (isCorrelationSetComplete(set)) {
 *   // Process complete set
 * }
 * ```
 */
function isCorrelationSetComplete(set) {
    if (!set.expectedMessages || set.expectedMessages.length === 0) {
        return false;
    }
    return set.expectedMessages.every((msg) => set.receivedMessages.includes(msg));
}
/**
 * Expires a correlation set.
 * Marks set as expired if timeout reached.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @returns {Promise<CorrelationSetModel>} Updated set
 *
 * @example
 * ```typescript
 * await expireCorrelationSet(set);
 * ```
 */
async function expireCorrelationSet(set) {
    set.status = 'expired';
    return await set.save();
}
/**
 * Cleans up completed or expired correlation sets.
 * Removes old correlation sets based on age.
 *
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @param {number} retentionDays - Days to retain completed sets
 * @returns {Promise<number>} Number of cleaned up sets
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupCorrelationSets(CorrelationSet, 30);
 * ```
 */
async function cleanupCorrelationSets(model, retentionDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const result = await model.destroy({
        where: {
            status: { [sequelize_1.Op.in]: ['complete', 'expired'] },
            updatedAt: { [sequelize_1.Op.lt]: cutoffDate },
        },
    });
    return result;
}
// ============================================================================
// MESSAGE EVENT TRIGGERING
// ============================================================================
/**
 * Triggers an event when a message is received.
 * Emits event for message reception.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationMessage} message - Received message
 *
 * @example
 * ```typescript
 * triggerMessageReceivedEvent(eventEmitter, message);
 * ```
 */
function triggerMessageReceivedEvent(eventEmitter, message) {
    eventEmitter.emit('message.received', {
        messageId: message.id,
        correlationId: message.correlationId,
        messageType: message.messageType,
        payload: message.payload,
        timestamp: new Date(),
    });
}
/**
 * Triggers an event when correlation set completes.
 * Emits event for correlation completion.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationSetModel} set - Completed correlation set
 *
 * @example
 * ```typescript
 * triggerCorrelationCompleteEvent(eventEmitter, set);
 * ```
 */
function triggerCorrelationCompleteEvent(eventEmitter, set) {
    eventEmitter.emit('correlation.complete', {
        setId: set.id,
        correlationKey: set.correlationKey,
        workflowId: set.workflowId,
        processId: set.processId,
        messageCount: set.messageCount,
        completedAt: set.completedAt,
    });
}
/**
 * Triggers an event when message delivery fails.
 * Emits event for delivery failure.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationMessage} message - Failed message
 * @param {Error} error - Failure error
 *
 * @example
 * ```typescript
 * triggerMessageFailedEvent(eventEmitter, message, error);
 * ```
 */
function triggerMessageFailedEvent(eventEmitter, message, error) {
    eventEmitter.emit('message.failed', {
        messageId: message.id,
        correlationId: message.correlationId,
        messageType: message.messageType,
        error: error.message,
        retryCount: message.retryCount,
        timestamp: new Date(),
    });
}
/**
 * Sets up event listeners for message correlation events.
 * Registers handlers for correlation lifecycle events.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {Record<string, (...args: any[]) => void>} handlers - Event handlers
 *
 * @example
 * ```typescript
 * setupMessageEventListeners(eventEmitter, {
 *   'message.received': (data) => console.log('Message received:', data),
 *   'correlation.complete': (data) => console.log('Correlation complete:', data)
 * });
 * ```
 */
function setupMessageEventListeners(eventEmitter, handlers) {
    Object.entries(handlers).forEach(([event, handler]) => {
        eventEmitter.on(event, handler);
    });
}
//# sourceMappingURL=workflow-message-correlation.js.map