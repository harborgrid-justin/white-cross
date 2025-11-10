"use strict";
/**
 * LOC: WSB-001
 * File: /reuse/server/workflow/workflow-signal-broadcasting.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - zod (v3.x)
 *   - rxjs (v7.x)
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Workflow signal services
 *   - Event broadcasting systems
 *   - Real-time notification handlers
 *   - Process synchronization modules
 *   - Cross-workflow communication
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalFilterModel = exports.SignalDeliveryLog = exports.SignalSubscriptionModel = exports.WorkflowSignal = exports.SignalFilterSchema = exports.SignalHistorySchema = exports.SignalSubscriptionSchema = exports.SignalDefinitionSchema = void 0;
exports.initWorkflowSignalModel = initWorkflowSignalModel;
exports.initSignalSubscriptionModel = initSignalSubscriptionModel;
exports.initSignalDeliveryLogModel = initSignalDeliveryLogModel;
exports.initSignalFilterModel = initSignalFilterModel;
exports.setupSignalAssociations = setupSignalAssociations;
exports.emitSignal = emitSignal;
exports.emitSignalBatch = emitSignalBatch;
exports.cancelSignal = cancelSignal;
exports.subscribeToSignal = subscribeToSignal;
exports.unsubscribeFromSignal = unsubscribeFromSignal;
exports.findSignalSubscriptions = findSignalSubscriptions;
exports.updateSubscriptionTriggerStats = updateSubscriptionTriggerStats;
exports.broadcastSignal = broadcastSignal;
exports.broadcastGlobalSignal = broadcastGlobalSignal;
exports.broadcastScopedSignal = broadcastScopedSignal;
exports.evaluateSignalFilter = evaluateSignalFilter;
exports.applySignalFilters = applySignalFilters;
exports.createSignalFilter = createSignalFilter;
exports.getSignalHistory = getSignalHistory;
exports.getSubscriptionHistory = getSubscriptionHistory;
exports.archiveSignalHistory = archiveSignalHistory;
exports.createSignalBarrier = createSignalBarrier;
exports.signalRendezvous = signalRendezvous;
exports.createSignalNamespace = createSignalNamespace;
exports.listNamespaceSignals = listNamespaceSignals;
exports.purgeNamespaceSignals = purgeNamespaceSignals;
exports.createThrottledSignalObservable = createThrottledSignalObservable;
exports.createDebouncedSignalObservable = createDebouncedSignalObservable;
exports.createDistinctSignalObservable = createDistinctSignalObservable;
exports.batchSignalsForProcessing = batchSignalsForProcessing;
exports.optimizedParallelDelivery = optimizedParallelDelivery;
exports.getCachedSignal = getCachedSignal;
exports.getSignalPerformanceMetrics = getSignalPerformanceMetrics;
exports.replaySignals = replaySignals;
exports.createSignalSnapshot = createSignalSnapshot;
exports.restoreSignalSnapshot = restoreSignalSnapshot;
exports.upgradeSignalVersion = upgradeSignalVersion;
exports.isSignalVersionCompatible = isSignalVersionCompatible;
exports.migrateSignalsToVersion = migrateSignalsToVersion;
exports.aggregateSignalsByType = aggregateSignalsByType;
exports.aggregateSignalsByTimeWindow = aggregateSignalsByTimeWindow;
exports.computeSubscriberSuccessRates = computeSubscriberSuccessRates;
exports.boostStaleSignalPriority = boostStaleSignalPriority;
exports.checkSignalRateLimit = checkSignalRateLimit;
exports.cloneSignal = cloneSignal;
/**
 * File: /reuse/server/workflow/workflow-signal-broadcasting.ts
 * Locator: WC-UTL-WSB-001
 * Purpose: Workflow Signal Broadcasting Kit - Production-grade signal events and broadcasting
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/event-emitter, zod, rxjs, crypto
 * Downstream: Workflow services, signal handlers, event broadcasters, synchronization systems
 * Dependencies: Sequelize v6.x, NestJS 10.x, Zod 3.x, RxJS 7.x, Node 18+, TypeScript 5.x
 * Exports: 44 production-grade functions for signal emission, subscription, broadcasting, filtering, synchronization
 *
 * LLM Context: Enterprise-grade workflow signal broadcasting utilities for White Cross healthcare platform.
 * Provides comprehensive signal emission, subscription management, global/scoped broadcasting, signal filtering,
 * history tracking, payload management, signal-based synchronization, cross-process signaling, signal namespacing,
 * and performance optimization. Optimized for HIPAA-compliant healthcare workflow coordination with real-time
 * event distribution, subscriber management, and audit trails.
 *
 * Features:
 * - Signal emission and lifecycle management
 * - Multi-subscriber signal broadcasting
 * - Global and scoped signal delivery
 * - Advanced signal filtering and routing
 * - Signal history and audit trails
 * - Payload validation and transformation
 * - Signal-based workflow synchronization
 * - Cross-process and cross-service signaling
 * - Namespace-based signal isolation
 * - Performance optimization for high-throughput
 * - Signal versioning and compatibility
 * - Signal replay and time-travel debugging
 * - Signal throttling and rate limiting
 * - Signal aggregation and batching
 */
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
const rxjs_1 = require("rxjs");
const crypto_1 = require("crypto");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for signal definition.
 */
exports.SignalDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(255),
    namespace: zod_1.z.string().min(1).max(255).default('default'),
    scope: zod_1.z.enum(['global', 'workflow', 'process', 'tenant', 'user']).default('global'),
    scopeId: zod_1.z.string().optional(),
    payload: zod_1.z.record(zod_1.z.any()),
    version: zod_1.z.string().regex(/^\d+\.\d+\.\d+$/).default('1.0.0'),
    priority: zod_1.z.number().int().min(0).max(10).default(5),
    persistent: zod_1.z.boolean().default(true),
    ttl: zod_1.z.number().int().positive().optional(),
    expiresAt: zod_1.z.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    emittedAt: zod_1.z.date(),
    emittedBy: zod_1.z.string().uuid(),
});
/**
 * Zod schema for signal subscription.
 */
exports.SignalSubscriptionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    subscriberId: zod_1.z.string().uuid(),
    signalName: zod_1.z.string().min(1).max(255),
    namespace: zod_1.z.string().min(1).max(255).default('default'),
    scope: zod_1.z.enum(['global', 'workflow', 'process', 'tenant', 'user']).optional(),
    scopeId: zod_1.z.string().optional(),
    filter: zod_1.z.record(zod_1.z.any()).optional(),
    priority: zod_1.z.number().int().min(0).max(10).default(5),
    active: zod_1.z.boolean().default(true),
    throttleMs: zod_1.z.number().int().min(0).optional(),
    debounceMs: zod_1.z.number().int().min(0).optional(),
    distinct: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    lastTriggeredAt: zod_1.z.date().optional(),
});
/**
 * Zod schema for signal history entry.
 */
exports.SignalHistorySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    signalId: zod_1.z.string().uuid(),
    signalName: zod_1.z.string(),
    namespace: zod_1.z.string(),
    payload: zod_1.z.record(zod_1.z.any()),
    deliveredTo: zod_1.z.array(zod_1.z.string()),
    subscriberCount: zod_1.z.number().int().min(0),
    timestamp: zod_1.z.date(),
    processingTimeMs: zod_1.z.number().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for signal filter.
 */
exports.SignalFilterSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(255),
    signalName: zod_1.z.string().optional(),
    namespace: zod_1.z.string().optional(),
    conditions: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        operator: zod_1.z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'notIn', 'contains', 'startsWith', 'endsWith', 'regex']),
        value: zod_1.z.any(),
    })),
    enabled: zod_1.z.boolean().default(true),
    priority: zod_1.z.number().int().min(0).max(10).default(5),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * WorkflowSignal model for storing emitted signals
 */
class WorkflowSignal extends sequelize_1.Model {
}
exports.WorkflowSignal = WorkflowSignal;
/**
 * SignalSubscription model for managing subscriptions
 */
class SignalSubscriptionModel extends sequelize_1.Model {
}
exports.SignalSubscriptionModel = SignalSubscriptionModel;
/**
 * SignalDeliveryLog model for tracking signal deliveries
 */
class SignalDeliveryLog extends sequelize_1.Model {
}
exports.SignalDeliveryLog = SignalDeliveryLog;
/**
 * SignalFilter model for defining signal filters
 */
class SignalFilterModel extends sequelize_1.Model {
}
exports.SignalFilterModel = SignalFilterModel;
// ============================================================================
// MODEL INITIALIZATION FUNCTIONS
// ============================================================================
/**
 * Initializes the WorkflowSignal model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for signal management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof WorkflowSignal} Initialized model
 *
 * @example
 * ```typescript
 * const Signal = initWorkflowSignalModel(sequelize);
 * const signal = await Signal.create({
 *   name: 'ORDER_COMPLETED',
 *   namespace: 'orders',
 *   payload: { orderId: '123' }
 * });
 * ```
 */
function initWorkflowSignalModel(sequelize) {
    WorkflowSignal.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique signal identifier',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Signal name for routing and identification',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        namespace: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'default',
            comment: 'Signal namespace for isolation',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM('global', 'workflow', 'process', 'tenant', 'user'),
            allowNull: false,
            defaultValue: 'global',
            comment: 'Signal scope for targeted delivery',
        },
        scopeId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Scope-specific identifier',
        },
        payload: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Signal payload data',
            validate: {
                isValidJSON(value) {
                    if (typeof value !== 'object' || value === null) {
                        throw new Error('Payload must be a valid JSON object');
                    }
                },
            },
        },
        version: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: '1.0.0',
            comment: 'Signal schema version',
            validate: {
                is: /^\d+\.\d+\.\d+$/,
            },
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            comment: 'Signal priority (0-10)',
            validate: {
                min: 0,
                max: 10,
            },
        },
        persistent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether signal should be persisted',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'broadcasting', 'delivered', 'expired'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Signal delivery status',
        },
        subscriberCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of subscribers',
        },
        deliveredCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of successful deliveries',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Signal expiration timestamp',
        },
        emittedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Identifier of signal emitter',
            validate: {
                isUUID: 4,
            },
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional signal metadata',
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
        modelName: 'WorkflowSignal',
        tableName: 'workflow_signals',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['namespace'] },
            { fields: ['scope', 'scope_id'] },
            { fields: ['status'] },
            { fields: ['priority', 'created_at'] },
            { fields: ['expires_at'] },
            { fields: ['tenant_id'] },
            { fields: ['name', 'namespace'] },
            { fields: ['emitted_by'] },
        ],
        scopes: {
            pending: {
                where: { status: 'pending' },
            },
            delivered: {
                where: { status: 'delivered' },
            },
            active: {
                where: {
                    status: { [sequelize_1.Op.in]: ['pending', 'broadcasting'] },
                    [sequelize_1.Op.or]: [
                        { expiresAt: null },
                        { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
                    ],
                },
            },
            byPriority: {
                order: [['priority', 'DESC'], ['created_at', 'ASC']],
            },
            global: {
                where: { scope: 'global' },
            },
        },
        hooks: {
            beforeValidate: (signal) => {
                // Set expiration if TTL metadata exists
                if (signal.metadata && signal.metadata.ttl) {
                    const ttl = signal.metadata.ttl;
                    signal.expiresAt = new Date(Date.now() + ttl * 1000);
                }
            },
            afterCreate: async (signal) => {
                const eventEmitter = sequelize.eventEmitter;
                if (eventEmitter) {
                    eventEmitter.emit('signal.created', {
                        signalId: signal.id,
                        name: signal.name,
                        namespace: signal.namespace,
                        scope: signal.scope,
                        priority: signal.priority,
                    });
                }
            },
            afterUpdate: async (signal) => {
                const eventEmitter = sequelize.eventEmitter;
                if (eventEmitter && signal.changed('status')) {
                    eventEmitter.emit('signal.status.changed', {
                        signalId: signal.id,
                        name: signal.name,
                        oldStatus: signal.previous('status'),
                        newStatus: signal.status,
                    });
                }
            },
        },
    });
    return WorkflowSignal;
}
/**
 * Initializes the SignalSubscription model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for subscription management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof SignalSubscriptionModel} Initialized model
 *
 * @example
 * ```typescript
 * const Subscription = initSignalSubscriptionModel(sequelize);
 * const sub = await Subscription.create({
 *   subscriberId: 'user-123',
 *   signalName: 'ORDER_COMPLETED',
 *   namespace: 'orders'
 * });
 * ```
 */
function initSignalSubscriptionModel(sequelize) {
    SignalSubscriptionModel.init({
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
        signalName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Signal name to subscribe to',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        namespace: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'default',
            comment: 'Signal namespace',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM('global', 'workflow', 'process', 'tenant', 'user'),
            allowNull: true,
            comment: 'Subscription scope filter',
        },
        scopeId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Scope-specific identifier filter',
        },
        filterCriteria: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Filter criteria for signal matching',
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
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether subscription is active',
        },
        throttleMs: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Throttle interval in milliseconds',
            validate: {
                min: 0,
            },
        },
        debounceMs: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Debounce interval in milliseconds',
            validate: {
                min: 0,
            },
        },
        distinct: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether to filter distinct signals only',
        },
        triggerCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times subscription triggered',
        },
        lastTriggeredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last trigger timestamp',
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
        modelName: 'SignalSubscription',
        tableName: 'signal_subscriptions',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['subscriber_id'] },
            { fields: ['signal_name'] },
            { fields: ['namespace'] },
            { fields: ['active'] },
            { fields: ['priority'] },
            { fields: ['scope', 'scope_id'] },
            { fields: ['tenant_id'] },
            { fields: ['signal_name', 'namespace', 'active'] },
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
                        signalName: subscription.signalName,
                        namespace: subscription.namespace,
                    });
                }
            },
        },
    });
    return SignalSubscriptionModel;
}
/**
 * Initializes the SignalDeliveryLog model with comprehensive configuration.
 * Tracks signal delivery attempts and results.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof SignalDeliveryLog} Initialized model
 *
 * @example
 * ```typescript
 * const DeliveryLog = initSignalDeliveryLogModel(sequelize);
 * ```
 */
function initSignalDeliveryLogModel(sequelize) {
    SignalDeliveryLog.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique delivery log identifier',
        },
        signalId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Signal identifier',
            validate: {
                isUUID: 4,
            },
        },
        subscriptionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Subscription identifier',
            validate: {
                isUUID: 4,
            },
        },
        subscriberId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Subscriber identifier',
            validate: {
                isUUID: 4,
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'delivered', 'failed', 'skipped'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Delivery status',
        },
        deliveredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Delivery timestamp',
        },
        processingTimeMs: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Processing time in milliseconds',
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
            comment: 'Additional delivery metadata',
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
        modelName: 'SignalDeliveryLog',
        tableName: 'signal_delivery_logs',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['signal_id'] },
            { fields: ['subscription_id'] },
            { fields: ['subscriber_id'] },
            { fields: ['status'] },
            { fields: ['delivered_at'] },
            { fields: ['tenant_id'] },
        ],
        scopes: {
            delivered: {
                where: { status: 'delivered' },
            },
            failed: {
                where: { status: 'failed' },
            },
        },
    });
    return SignalDeliveryLog;
}
/**
 * Initializes the SignalFilter model with comprehensive configuration.
 * Defines signal filtering rules for advanced routing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof SignalFilterModel} Initialized model
 *
 * @example
 * ```typescript
 * const Filter = initSignalFilterModel(sequelize);
 * const filter = await Filter.create({
 *   name: 'High Value Orders',
 *   signalName: 'ORDER_COMPLETED',
 *   conditions: [{ field: 'amount', operator: 'gt', value: 1000 }]
 * });
 * ```
 */
function initSignalFilterModel(sequelize) {
    SignalFilterModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique filter identifier',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Filter name',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        signalName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Signal name this filter applies to',
        },
        namespace: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Namespace this filter applies to',
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Filter conditions',
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
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether filter is enabled',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            comment: 'Filter priority (0-10)',
            validate: {
                min: 0,
                max: 10,
            },
        },
        matchCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of signals matched by this filter',
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
            comment: 'Additional filter metadata',
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
        modelName: 'SignalFilter',
        tableName: 'signal_filters',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['signal_name'] },
            { fields: ['namespace'] },
            { fields: ['enabled'] },
            { fields: ['priority'] },
            { fields: ['tenant_id'] },
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
    return SignalFilterModel;
}
/**
 * Sets up associations between signal models.
 * Defines relationships for signal delivery tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 *
 * @example
 * ```typescript
 * setupSignalAssociations(sequelize);
 * ```
 */
function setupSignalAssociations(sequelize) {
    const WorkflowSignal = sequelize.models.WorkflowSignal;
    const SignalSubscription = sequelize.models.SignalSubscription;
    const SignalDeliveryLog = sequelize.models.SignalDeliveryLog;
    if (WorkflowSignal && SignalDeliveryLog) {
        WorkflowSignal.hasMany(SignalDeliveryLog, {
            foreignKey: 'signalId',
            as: 'deliveryLogs',
        });
        SignalDeliveryLog.belongsTo(WorkflowSignal, {
            foreignKey: 'signalId',
            as: 'signal',
        });
    }
    if (SignalSubscription && SignalDeliveryLog) {
        SignalSubscription.hasMany(SignalDeliveryLog, {
            foreignKey: 'subscriptionId',
            as: 'deliveryLogs',
        });
        SignalDeliveryLog.belongsTo(SignalSubscription, {
            foreignKey: 'subscriptionId',
            as: 'subscription',
        });
    }
}
// ============================================================================
// SIGNAL EMISSION
// ============================================================================
/**
 * Emits a signal with specified name and payload.
 * Creates and broadcasts a signal to all matching subscriptions.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} name - Signal name
 * @param {Record<string, any>} payload - Signal payload
 * @param {SignalBroadcastOptions} options - Broadcast options
 * @returns {Promise<WorkflowSignal>} Emitted signal
 *
 * @example
 * ```typescript
 * const signal = await emitSignal(
 *   WorkflowSignal,
 *   'ORDER_COMPLETED',
 *   { orderId: '123', amount: 500 },
 *   { namespace: 'orders', priority: 8 }
 * );
 * ```
 */
async function emitSignal(model, name, payload, options = {}) {
    const signal = await model.create({
        id: (0, crypto_1.randomUUID)(),
        name,
        namespace: options.namespace || 'default',
        scope: options.scope || 'global',
        scopeId: options.scopeId,
        payload,
        version: options.version || '1.0.0',
        priority: options.priority ?? 5,
        persistent: options.persistent ?? true,
        status: 'pending',
        subscriberCount: 0,
        deliveredCount: 0,
        emittedBy: options.metadata?.emittedBy || (0, crypto_1.randomUUID)(),
        metadata: options.metadata,
    });
    return signal;
}
/**
 * Emits multiple signals in batch.
 * Efficiently creates multiple signals in a single transaction.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {Array<{ name: string; payload: Record<string, any>; options?: SignalBroadcastOptions }>} signals - Signals to emit
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowSignal[]>} Emitted signals
 *
 * @example
 * ```typescript
 * const signals = await emitSignalBatch(WorkflowSignal, [
 *   { name: 'ORDER_CREATED', payload: { orderId: '123' } },
 *   { name: 'INVENTORY_UPDATED', payload: { productId: '456' } }
 * ]);
 * ```
 */
async function emitSignalBatch(model, signals, transaction) {
    const signalData = signals.map((sig) => ({
        id: (0, crypto_1.randomUUID)(),
        name: sig.name,
        namespace: sig.options?.namespace || 'default',
        scope: sig.options?.scope || 'global',
        scopeId: sig.options?.scopeId,
        payload: sig.payload,
        version: sig.options?.version || '1.0.0',
        priority: sig.options?.priority ?? 5,
        persistent: sig.options?.persistent ?? true,
        status: 'pending',
        subscriberCount: 0,
        deliveredCount: 0,
        emittedBy: sig.options?.metadata?.emittedBy || (0, crypto_1.randomUUID)(),
        metadata: sig.options?.metadata,
    }));
    return await model.bulkCreate(signalData, { transaction });
}
/**
 * Cancels a pending signal before delivery.
 * Prevents signal from being broadcast to subscribers.
 *
 * @param {WorkflowSignal} signal - Signal to cancel
 * @returns {Promise<WorkflowSignal>} Cancelled signal
 *
 * @example
 * ```typescript
 * await cancelSignal(signal);
 * ```
 */
async function cancelSignal(signal) {
    signal.status = 'expired';
    return await signal.save();
}
// ============================================================================
// SIGNAL SUBSCRIPTION
// ============================================================================
/**
 * Creates a signal subscription for a specific signal.
 * Registers a subscriber to receive matching signals.
 *
 * @param {typeof SignalSubscriptionModel} model - SignalSubscription model
 * @param {string} subscriberId - Subscriber identifier
 * @param {string} signalName - Signal name to subscribe to
 * @param {Partial<SignalSubscriptionAttributes>} options - Additional subscription options
 * @returns {Promise<SignalSubscriptionModel>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await subscribeToSignal(
 *   SignalSubscription,
 *   'user-123',
 *   'ORDER_COMPLETED',
 *   { namespace: 'orders', priority: 8, throttleMs: 5000 }
 * );
 * ```
 */
async function subscribeToSignal(model, subscriberId, signalName, options = {}) {
    return await model.create({
        id: (0, crypto_1.randomUUID)(),
        subscriberId,
        signalName,
        namespace: options.namespace || 'default',
        active: true,
        priority: 5,
        distinct: false,
        triggerCount: 0,
        ...options,
    });
}
/**
 * Unsubscribes from a signal.
 * Deactivates or removes a subscription.
 *
 * @param {SignalSubscriptionModel} subscription - Subscription to remove
 * @param {boolean} soft - Whether to soft delete (deactivate) or hard delete
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unsubscribeFromSignal(subscription, true);
 * ```
 */
async function unsubscribeFromSignal(subscription, soft = true) {
    if (soft) {
        subscription.active = false;
        await subscription.save();
    }
    else {
        await subscription.destroy();
    }
}
/**
 * Finds active subscriptions matching a signal.
 * Returns all active subscriptions for signal routing.
 *
 * @param {typeof SignalSubscriptionModel} model - SignalSubscription model
 * @param {WorkflowSignal} signal - Signal to match
 * @returns {Promise<SignalSubscriptionModel[]>} Matching subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await findSignalSubscriptions(SignalSubscription, signal);
 * ```
 */
async function findSignalSubscriptions(model, signal) {
    const where = {
        signalName: signal.name,
        namespace: signal.namespace,
        active: true,
    };
    // Add scope filtering
    if (signal.scope !== 'global') {
        where[sequelize_1.Op.or] = [
            { scope: null },
            { scope: 'global' },
            { scope: signal.scope, scopeId: signal.scopeId },
        ];
    }
    if (signal.tenantId) {
        where[sequelize_1.Op.or] = [
            { tenantId: null },
            { tenantId: signal.tenantId },
        ];
    }
    return await model.scope('active').findAll({
        where,
        order: [['priority', 'DESC'], ['created_at', 'ASC']],
    });
}
/**
 * Updates subscription trigger statistics.
 * Increments trigger count and updates last triggered timestamp.
 *
 * @param {SignalSubscriptionModel} subscription - Subscription instance
 * @returns {Promise<SignalSubscriptionModel>} Updated subscription
 *
 * @example
 * ```typescript
 * await updateSubscriptionTriggerStats(subscription);
 * ```
 */
async function updateSubscriptionTriggerStats(subscription) {
    subscription.triggerCount += 1;
    subscription.lastTriggeredAt = new Date();
    return await subscription.save();
}
// ============================================================================
// SIGNAL BROADCASTING
// ============================================================================
/**
 * Broadcasts a signal to all matching subscribers.
 * Delivers signal to subscribers and tracks delivery.
 *
 * @param {WorkflowSignal} signal - Signal to broadcast
 * @param {typeof SignalSubscriptionModel} subscriptionModel - Subscription model
 * @param {typeof SignalDeliveryLog} logModel - Delivery log model
 * @param {(subscription: SignalSubscriptionModel, signal: WorkflowSignal) => Promise<boolean>} deliveryFn - Delivery function
 * @returns {Promise<SignalDeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await broadcastSignal(
 *   signal,
 *   SignalSubscription,
 *   DeliveryLog,
 *   async (sub, sig) => await notifySubscriber(sub, sig)
 * );
 * ```
 */
async function broadcastSignal(signal, subscriptionModel, logModel, deliveryFn) {
    const startTime = Date.now();
    const subscriptions = await findSignalSubscriptions(subscriptionModel, signal);
    signal.status = 'broadcasting';
    signal.subscriberCount = subscriptions.length;
    await signal.save();
    const deliveredTo = [];
    const failedDeliveries = [];
    for (const subscription of subscriptions) {
        const deliveryStart = Date.now();
        let status = 'pending';
        let errorMessage;
        try {
            const success = await deliveryFn(subscription, signal);
            status = success ? 'delivered' : 'failed';
            if (success) {
                deliveredTo.push(subscription.subscriberId);
                await updateSubscriptionTriggerStats(subscription);
            }
            else {
                failedDeliveries.push(subscription.subscriberId);
            }
        }
        catch (error) {
            status = 'failed';
            errorMessage = error.message;
            failedDeliveries.push(subscription.subscriberId);
        }
        // Log delivery attempt
        await logModel.create({
            id: (0, crypto_1.randomUUID)(),
            signalId: signal.id,
            subscriptionId: subscription.id,
            subscriberId: subscription.subscriberId,
            status,
            deliveredAt: status === 'delivered' ? new Date() : undefined,
            processingTimeMs: Date.now() - deliveryStart,
            errorMessage,
            tenantId: signal.tenantId,
        });
    }
    signal.status = 'delivered';
    signal.deliveredCount = deliveredTo.length;
    await signal.save();
    return {
        signalId: signal.id,
        subscriberCount: subscriptions.length,
        deliveredTo,
        failedDeliveries,
        processingTimeMs: Date.now() - startTime,
    };
}
/**
 * Broadcasts a signal globally to all namespaces.
 * Delivers signal across all namespace boundaries.
 *
 * @param {typeof WorkflowSignal} signalModel - WorkflowSignal model
 * @param {string} name - Signal name
 * @param {Record<string, any>} payload - Signal payload
 * @param {SignalBroadcastOptions} options - Broadcast options
 * @returns {Promise<WorkflowSignal>} Broadcast signal
 *
 * @example
 * ```typescript
 * const signal = await broadcastGlobalSignal(
 *   WorkflowSignal,
 *   'SYSTEM_MAINTENANCE',
 *   { message: 'Scheduled maintenance at 2am' }
 * );
 * ```
 */
async function broadcastGlobalSignal(signalModel, name, payload, options = {}) {
    return await emitSignal(signalModel, name, payload, {
        ...options,
        scope: 'global',
        namespace: '*', // Special namespace for global broadcasts
    });
}
/**
 * Broadcasts a signal to a specific scope.
 * Delivers signal only to subscribers within the scope.
 *
 * @param {typeof WorkflowSignal} signalModel - WorkflowSignal model
 * @param {string} name - Signal name
 * @param {'workflow' | 'process' | 'tenant' | 'user'} scope - Target scope
 * @param {string} scopeId - Scope identifier
 * @param {Record<string, any>} payload - Signal payload
 * @param {SignalBroadcastOptions} options - Additional options
 * @returns {Promise<WorkflowSignal>} Scoped signal
 *
 * @example
 * ```typescript
 * const signal = await broadcastScopedSignal(
 *   WorkflowSignal,
 *   'WORKFLOW_UPDATED',
 *   'workflow',
 *   'wf-123',
 *   { status: 'completed' }
 * );
 * ```
 */
async function broadcastScopedSignal(signalModel, name, scope, scopeId, payload, options = {}) {
    return await emitSignal(signalModel, name, payload, {
        ...options,
        scope,
        scopeId,
    });
}
// ============================================================================
// SIGNAL FILTERING
// ============================================================================
/**
 * Evaluates a signal against filter conditions.
 * Determines if a signal matches filter criteria.
 *
 * @param {WorkflowSignal} signal - Signal to evaluate
 * @param {SignalFilter['conditions']} conditions - Filter conditions
 * @returns {boolean} Whether signal matches conditions
 *
 * @example
 * ```typescript
 * const matches = evaluateSignalFilter(
 *   signal,
 *   [{ field: 'amount', operator: 'gt', value: 1000 }]
 * );
 * ```
 */
function evaluateSignalFilter(signal, conditions) {
    return conditions.every((condition) => {
        const fieldValue = signal.payload[condition.field];
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
 * Applies filters to a signal before delivery.
 * Filters subscriptions based on signal content.
 *
 * @param {SignalSubscriptionModel[]} subscriptions - Available subscriptions
 * @param {WorkflowSignal} signal - Signal to filter
 * @returns {SignalSubscriptionModel[]} Filtered subscriptions
 *
 * @example
 * ```typescript
 * const filtered = applySignalFilters(subscriptions, signal);
 * ```
 */
function applySignalFilters(subscriptions, signal) {
    return subscriptions.filter((subscription) => {
        if (!subscription.filterCriteria || Object.keys(subscription.filterCriteria).length === 0) {
            return true;
        }
        const conditions = Object.entries(subscription.filterCriteria).map(([field, value]) => ({
            field,
            operator: 'eq',
            value,
        }));
        return evaluateSignalFilter(signal, conditions);
    });
}
/**
 * Creates a reusable signal filter.
 * Defines filter rules for signal routing.
 *
 * @param {typeof SignalFilterModel} model - SignalFilter model
 * @param {Partial<SignalFilterAttributes>} filterData - Filter configuration
 * @returns {Promise<SignalFilterModel>} Created filter
 *
 * @example
 * ```typescript
 * const filter = await createSignalFilter(SignalFilter, {
 *   name: 'High Priority Orders',
 *   signalName: 'ORDER_CREATED',
 *   conditions: [{ field: 'priority', operator: 'gte', value: 8 }]
 * });
 * ```
 */
async function createSignalFilter(model, filterData) {
    return await model.create({
        id: (0, crypto_1.randomUUID)(),
        enabled: true,
        priority: 5,
        matchCount: 0,
        ...filterData,
    });
}
// ============================================================================
// SIGNAL HISTORY TRACKING
// ============================================================================
/**
 * Retrieves signal delivery history.
 * Gets all delivery logs for a signal.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {string} signalId - Signal identifier
 * @returns {Promise<SignalDeliveryLog[]>} Delivery history
 *
 * @example
 * ```typescript
 * const history = await getSignalHistory(DeliveryLog, signal.id);
 * ```
 */
async function getSignalHistory(model, signalId) {
    return await model.findAll({
        where: { signalId },
        order: [['created_at', 'ASC']],
    });
}
/**
 * Gets subscription delivery history.
 * Retrieves all signals delivered to a subscription.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {string} subscriptionId - Subscription identifier
 * @param {number} limit - Maximum number of records
 * @returns {Promise<SignalDeliveryLog[]>} Subscription history
 *
 * @example
 * ```typescript
 * const history = await getSubscriptionHistory(DeliveryLog, subscription.id, 50);
 * ```
 */
async function getSubscriptionHistory(model, subscriptionId, limit = 100) {
    return await model.findAll({
        where: { subscriptionId },
        order: [['created_at', 'DESC']],
        limit,
    });
}
/**
 * Archives old signal delivery logs.
 * Removes or archives logs older than retention period.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {number} retentionDays - Days to retain logs
 * @returns {Promise<number>} Number of archived logs
 *
 * @example
 * ```typescript
 * const archived = await archiveSignalHistory(DeliveryLog, 90);
 * ```
 */
async function archiveSignalHistory(model, retentionDays = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const result = await model.destroy({
        where: {
            createdAt: { [sequelize_1.Op.lt]: cutoffDate },
        },
    });
    return result;
}
// ============================================================================
// SIGNAL SYNCHRONIZATION
// ============================================================================
/**
 * Creates a synchronization barrier using signals.
 * Waits for multiple signals before proceeding.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string[]} signalNames - Signal names to wait for
 * @param {string} namespace - Signal namespace
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<WorkflowSignal[]>} Synchronized signals
 *
 * @example
 * ```typescript
 * const signals = await createSignalBarrier(
 *   WorkflowSignal,
 *   ['PAYMENT_COMPLETED', 'SHIPPING_CONFIRMED'],
 *   'orders',
 *   30000
 * );
 * ```
 */
async function createSignalBarrier(model, signalNames, namespace = 'default', timeoutMs = 30000) {
    const startTime = Date.now();
    const receivedSignals = [];
    while (receivedSignals.length < signalNames.length) {
        if (Date.now() - startTime > timeoutMs) {
            throw new Error(`Signal barrier timeout: waiting for ${signalNames.join(', ')}`);
        }
        for (const signalName of signalNames) {
            if (!receivedSignals.find((s) => s.name === signalName)) {
                const signal = await model.findOne({
                    where: {
                        name: signalName,
                        namespace,
                        status: 'delivered',
                        createdAt: { [sequelize_1.Op.gte]: new Date(startTime) },
                    },
                });
                if (signal) {
                    receivedSignals.push(signal);
                }
            }
        }
        // Wait before checking again
        if (receivedSignals.length < signalNames.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    return receivedSignals;
}
/**
 * Implements signal-based rendezvous synchronization.
 * Coordinates multiple processes using signals.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} rendezvousName - Rendezvous point name
 * @param {number} participantCount - Expected number of participants
 * @param {string} participantId - This participant's identifier
 * @returns {Promise<boolean>} Whether rendezvous succeeded
 *
 * @example
 * ```typescript
 * const success = await signalRendezvous(
 *   WorkflowSignal,
 *   'batch-processing',
 *   3,
 *   'worker-1'
 * );
 * ```
 */
async function signalRendezvous(model, rendezvousName, participantCount, participantId) {
    // Emit arrival signal
    await emitSignal(model, `rendezvous:${rendezvousName}`, { participantId }, {
        namespace: 'sync',
        metadata: { rendezvousName, participantId },
    });
    // Wait for all participants
    const signals = await createSignalBarrier(model, Array(participantCount).fill(`rendezvous:${rendezvousName}`), 'sync', 60000);
    return signals.length === participantCount;
}
// ============================================================================
// SIGNAL NAMESPACING
// ============================================================================
/**
 * Creates an isolated signal namespace.
 * Configures namespace-specific settings and isolation.
 *
 * @param {string} namespace - Namespace name
 * @param {SignalNamespaceConfig} config - Namespace configuration
 * @returns {SignalNamespaceConfig} Created namespace config
 *
 * @example
 * ```typescript
 * const namespace = createSignalNamespace('orders', {
 *   name: 'orders',
 *   isolation: true,
 *   maxSignalsPerMinute: 1000,
 *   retentionDays: 30
 * });
 * ```
 */
function createSignalNamespace(namespace, config = {}) {
    return {
        name: namespace,
        isolation: config.isolation ?? true,
        maxSignalsPerMinute: config.maxSignalsPerMinute,
        retentionDays: config.retentionDays ?? 30,
        allowedScopes: config.allowedScopes || ['global', 'workflow', 'process', 'tenant', 'user'],
    };
}
/**
 * Lists all signals in a namespace.
 * Retrieves signals filtered by namespace.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to query
 * @param {number} limit - Maximum number of signals
 * @returns {Promise<WorkflowSignal[]>} Namespace signals
 *
 * @example
 * ```typescript
 * const signals = await listNamespaceSignals(WorkflowSignal, 'orders', 100);
 * ```
 */
async function listNamespaceSignals(model, namespace, limit = 100) {
    return await model.findAll({
        where: { namespace },
        order: [['created_at', 'DESC']],
        limit,
    });
}
/**
 * Purges expired signals from a namespace.
 * Cleans up old signals based on namespace retention.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to purge
 * @param {number} retentionDays - Retention period in days
 * @returns {Promise<number>} Number of purged signals
 *
 * @example
 * ```typescript
 * const purged = await purgeNamespaceSignals(WorkflowSignal, 'orders', 30);
 * ```
 */
async function purgeNamespaceSignals(model, namespace, retentionDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const result = await model.destroy({
        where: {
            namespace,
            status: 'delivered',
            createdAt: { [sequelize_1.Op.lt]: cutoffDate },
        },
    });
    return result;
}
// ============================================================================
// SIGNAL PERFORMANCE OPTIMIZATION
// ============================================================================
/**
 * Creates a throttled signal observable.
 * Limits signal emission rate using RxJS throttle.
 *
 * @param {Subject<WorkflowSignal>} signalSubject - Signal subject
 * @param {number} throttleMs - Throttle interval in milliseconds
 * @returns {Observable<WorkflowSignal>} Throttled observable
 *
 * @example
 * ```typescript
 * const throttled = createThrottledSignalObservable(signalSubject, 1000);
 * throttled.subscribe(signal => console.log('Throttled signal:', signal));
 * ```
 */
function createThrottledSignalObservable(signalSubject, throttleMs) {
    return signalSubject.pipe((0, rxjs_1.throttleTime)(throttleMs));
}
/**
 * Creates a debounced signal observable.
 * Delays signal emission until quiet period using RxJS debounce.
 *
 * @param {Subject<WorkflowSignal>} signalSubject - Signal subject
 * @param {number} debounceMs - Debounce interval in milliseconds
 * @returns {Observable<WorkflowSignal>} Debounced observable
 *
 * @example
 * ```typescript
 * const debounced = createDebouncedSignalObservable(signalSubject, 500);
 * debounced.subscribe(signal => console.log('Debounced signal:', signal));
 * ```
 */
function createDebouncedSignalObservable(signalSubject, debounceMs) {
    return signalSubject.pipe((0, rxjs_1.debounceTime)(debounceMs));
}
/**
 * Creates a distinct signal observable.
 * Filters duplicate signals based on content.
 *
 * @param {Subject<WorkflowSignal>} signalSubject - Signal subject
 * @param {(signal: WorkflowSignal) => string} keySelector - Key selection function
 * @returns {Observable<WorkflowSignal>} Distinct observable
 *
 * @example
 * ```typescript
 * const distinct = createDistinctSignalObservable(
 *   signalSubject,
 *   signal => `${signal.name}:${JSON.stringify(signal.payload)}`
 * );
 * ```
 */
function createDistinctSignalObservable(signalSubject, keySelector) {
    return signalSubject.pipe((0, rxjs_1.distinctUntilChanged)((prev, curr) => keySelector(prev) === keySelector(curr)));
}
/**
 * Batches signals for efficient processing.
 * Collects signals into batches for bulk operations.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to batch
 * @param {number} batchSize - Batch size
 * @returns {Promise<WorkflowSignal[][]>} Batched signals
 *
 * @example
 * ```typescript
 * const batches = await batchSignalsForProcessing(WorkflowSignal, 'orders', 50);
 * ```
 */
async function batchSignalsForProcessing(model, namespace, batchSize = 50) {
    const signals = await model.findAll({
        where: {
            namespace,
            status: 'pending',
        },
        order: [['priority', 'DESC'], ['created_at', 'ASC']],
    });
    const batches = [];
    for (let i = 0; i < signals.length; i += batchSize) {
        batches.push(signals.slice(i, i + batchSize));
    }
    return batches;
}
/**
 * Optimizes signal delivery with parallel processing.
 * Delivers signals to multiple subscribers in parallel.
 *
 * @param {WorkflowSignal} signal - Signal to deliver
 * @param {SignalSubscriptionModel[]} subscriptions - Target subscriptions
 * @param {(subscription: SignalSubscriptionModel, signal: WorkflowSignal) => Promise<boolean>} deliveryFn - Delivery function
 * @param {number} concurrency - Maximum concurrent deliveries
 * @returns {Promise<{ success: number; failed: number }>} Delivery statistics
 *
 * @example
 * ```typescript
 * const stats = await optimizedParallelDelivery(
 *   signal,
 *   subscriptions,
 *   async (sub, sig) => await deliverToSubscriber(sub, sig),
 *   10
 * );
 * ```
 */
async function optimizedParallelDelivery(signal, subscriptions, deliveryFn, concurrency = 10) {
    let success = 0;
    let failed = 0;
    // Process in chunks of concurrency size
    for (let i = 0; i < subscriptions.length; i += concurrency) {
        const chunk = subscriptions.slice(i, i + concurrency);
        const results = await Promise.allSettled(chunk.map((sub) => deliveryFn(sub, signal)));
        results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value) {
                success++;
            }
            else {
                failed++;
            }
        });
    }
    return { success, failed };
}
/**
 * Implements signal caching for performance.
 * Caches frequently accessed signals in memory.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} signalId - Signal identifier
 * @param {Map<string, WorkflowSignal>} cache - Cache storage
 * @param {number} ttlMs - Cache TTL in milliseconds
 * @returns {Promise<WorkflowSignal | null>} Cached or fetched signal
 *
 * @example
 * ```typescript
 * const cache = new Map();
 * const signal = await getCachedSignal(WorkflowSignal, signalId, cache, 60000);
 * ```
 */
async function getCachedSignal(model, signalId, cache, ttlMs = 60000) {
    const cached = cache.get(signalId);
    if (cached && cached.expiry > Date.now()) {
        return cached.signal;
    }
    const signal = await model.findByPk(signalId);
    if (signal) {
        cache.set(signalId, {
            signal,
            expiry: Date.now() + ttlMs,
        });
    }
    return signal;
}
/**
 * Gets signal delivery performance metrics.
 * Calculates delivery statistics and performance indicators.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {string} namespace - Namespace to analyze
 * @param {Date} since - Start date for metrics
 * @returns {Promise<{ totalDeliveries: number; successRate: number; avgProcessingTimeMs: number }>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await getSignalPerformanceMetrics(
 *   DeliveryLog,
 *   'orders',
 *   new Date(Date.now() - 24 * 60 * 60 * 1000)
 * );
 * ```
 */
async function getSignalPerformanceMetrics(model, namespace, since) {
    const logs = await model.findAll({
        where: {
            createdAt: { [sequelize_1.Op.gte]: since },
        },
        include: [
            {
                model: WorkflowSignal,
                as: 'signal',
                where: { namespace },
                attributes: [],
            },
        ],
    });
    const totalDeliveries = logs.length;
    const successfulDeliveries = logs.filter((log) => log.status === 'delivered').length;
    const avgProcessingTimeMs = logs.reduce((sum, log) => sum + (log.processingTimeMs || 0), 0) / totalDeliveries || 0;
    return {
        totalDeliveries,
        successRate: totalDeliveries > 0 ? successfulDeliveries / totalDeliveries : 0,
        avgProcessingTimeMs,
    };
}
// ============================================================================
// SIGNAL REPLAY AND TIME-TRAVEL
// ============================================================================
/**
 * Replays signals from a specific point in time.
 * Re-broadcasts historical signals for debugging or recovery.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {Date} fromTime - Start time for replay
 * @param {Date} toTime - End time for replay
 * @param {string} [namespace] - Optional namespace filter
 * @returns {Promise<WorkflowSignal[]>} Replayed signals
 *
 * @example
 * ```typescript
 * const replayed = await replaySignals(
 *   WorkflowSignal,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-02'),
 *   'orders'
 * );
 * ```
 */
async function replaySignals(model, fromTime, toTime, namespace) {
    const where = {
        createdAt: {
            [sequelize_1.Op.gte]: fromTime,
            [sequelize_1.Op.lte]: toTime,
        },
    };
    if (namespace) {
        where.namespace = namespace;
    }
    const signals = await model.findAll({
        where,
        order: [['created_at', 'ASC']],
    });
    // Create replay copies
    const replayed = [];
    for (const signal of signals) {
        const replaySignal = await emitSignal(model, signal.name, signal.payload, {
            namespace: signal.namespace,
            scope: signal.scope,
            scopeId: signal.scopeId || undefined,
            priority: signal.priority,
            version: signal.version,
            metadata: { ...signal.metadata, isReplay: true, originalSignalId: signal.id },
        });
        replayed.push(replaySignal);
    }
    return replayed;
}
/**
 * Creates a signal snapshot for time-travel debugging.
 * Captures the state of all signals at a point in time.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to snapshot
 * @param {Date} [timestamp] - Snapshot timestamp (defaults to now)
 * @returns {Promise<{ timestamp: Date; signals: WorkflowSignal[]; count: number }>} Signal snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await createSignalSnapshot(WorkflowSignal, 'orders');
 * ```
 */
async function createSignalSnapshot(model, namespace, timestamp = new Date()) {
    const signals = await model.findAll({
        where: {
            namespace,
            createdAt: { [sequelize_1.Op.lte]: timestamp },
        },
        order: [['created_at', 'ASC']],
    });
    return {
        timestamp,
        signals,
        count: signals.length,
    };
}
/**
 * Restores signals from a snapshot.
 * Resets signal state to a previous snapshot.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {{ timestamp: Date; signals: WorkflowSignal[] }} snapshot - Snapshot to restore
 * @returns {Promise<number>} Number of signals restored
 *
 * @example
 * ```typescript
 * const restored = await restoreSignalSnapshot(WorkflowSignal, snapshot);
 * ```
 */
async function restoreSignalSnapshot(model, snapshot) {
    // Remove signals created after snapshot
    await model.destroy({
        where: {
            createdAt: { [sequelize_1.Op.gt]: snapshot.timestamp },
        },
    });
    // Restore snapshot signals
    let restored = 0;
    for (const signal of snapshot.signals) {
        const existing = await model.findByPk(signal.id);
        if (!existing) {
            await model.create(signal.get({ plain: true }));
            restored++;
        }
    }
    return restored;
}
// ============================================================================
// SIGNAL VERSIONING
// ============================================================================
/**
 * Upgrades signal payload to a new version.
 * Transforms signal payload for version compatibility.
 *
 * @param {WorkflowSignal} signal - Signal to upgrade
 * @param {string} targetVersion - Target version
 * @param {(payload: any, fromVersion: string, toVersion: string) => any} transformFn - Transform function
 * @returns {Promise<WorkflowSignal>} Upgraded signal
 *
 * @example
 * ```typescript
 * const upgraded = await upgradeSignalVersion(
 *   signal,
 *   '2.0.0',
 *   (payload, from, to) => ({ ...payload, newField: 'default' })
 * );
 * ```
 */
async function upgradeSignalVersion(signal, targetVersion, transformFn) {
    const transformedPayload = transformFn(signal.payload, signal.version, targetVersion);
    signal.payload = transformedPayload;
    signal.version = targetVersion;
    return await signal.save();
}
/**
 * Checks signal version compatibility.
 * Validates if signal version is compatible with expected version.
 *
 * @param {string} signalVersion - Signal version
 * @param {string} expectedVersion - Expected version
 * @returns {boolean} Whether versions are compatible
 *
 * @example
 * ```typescript
 * const compatible = isSignalVersionCompatible('1.2.3', '1.0.0');
 * ```
 */
function isSignalVersionCompatible(signalVersion, expectedVersion) {
    const [sMajor, sMinor] = signalVersion.split('.').map(Number);
    const [eMajor, eMinor] = expectedVersion.split('.').map(Number);
    // Major version must match, minor version can be equal or higher
    return sMajor === eMajor && sMinor >= eMinor;
}
/**
 * Migrates signals to a new version schema.
 * Batch upgrades all signals in a namespace.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to migrate
 * @param {string} targetVersion - Target version
 * @param {(payload: any) => any} transformFn - Transform function
 * @returns {Promise<number>} Number of migrated signals
 *
 * @example
 * ```typescript
 * const migrated = await migrateSignalsToVersion(
 *   WorkflowSignal,
 *   'orders',
 *   '2.0.0',
 *   (payload) => ({ ...payload, v2Field: true })
 * );
 * ```
 */
async function migrateSignalsToVersion(model, namespace, targetVersion, transformFn) {
    const signals = await model.findAll({
        where: {
            namespace,
            version: { [sequelize_1.Op.ne]: targetVersion },
        },
    });
    for (const signal of signals) {
        signal.payload = transformFn(signal.payload);
        signal.version = targetVersion;
        await signal.save();
    }
    return signals.length;
}
// ============================================================================
// SIGNAL AGGREGATION
// ============================================================================
/**
 * Aggregates signals by type.
 * Groups and counts signals by their type.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to aggregate
 * @param {Date} [since] - Start date for aggregation
 * @returns {Promise<Array<{ name: string; count: number }>>} Aggregated signal counts
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateSignalsByType(
 *   WorkflowSignal,
 *   'orders',
 *   new Date(Date.now() - 24 * 60 * 60 * 1000)
 * );
 * ```
 */
async function aggregateSignalsByType(model, namespace, since) {
    const where = { namespace };
    if (since) {
        where.createdAt = { [sequelize_1.Op.gte]: since };
    }
    const signals = await model.findAll({
        where,
        attributes: [
            'name',
            [model.sequelize.fn('COUNT', model.sequelize.col('id')), 'count'],
        ],
        group: ['name'],
        raw: true,
    });
    return signals;
}
/**
 * Aggregates signals by time window.
 * Groups signals into time buckets for analysis.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to aggregate
 * @param {Date} fromTime - Start time
 * @param {Date} toTime - End time
 * @param {number} bucketMinutes - Bucket size in minutes
 * @returns {Promise<Array<{ bucket: Date; count: number }>>} Time-bucketed counts
 *
 * @example
 * ```typescript
 * const timeSeries = await aggregateSignalsByTimeWindow(
 *   WorkflowSignal,
 *   'orders',
 *   new Date(Date.now() - 24 * 60 * 60 * 1000),
 *   new Date(),
 *   60
 * );
 * ```
 */
async function aggregateSignalsByTimeWindow(model, namespace, fromTime, toTime, bucketMinutes = 60) {
    const signals = await model.findAll({
        where: {
            namespace,
            createdAt: {
                [sequelize_1.Op.gte]: fromTime,
                [sequelize_1.Op.lte]: toTime,
            },
        },
        order: [['created_at', 'ASC']],
    });
    const buckets = new Map();
    const bucketMs = bucketMinutes * 60 * 1000;
    signals.forEach((signal) => {
        const bucketTime = new Date(Math.floor(signal.createdAt.getTime() / bucketMs) * bucketMs);
        const key = bucketTime.toISOString();
        buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    return Array.from(buckets.entries()).map(([bucket, count]) => ({
        bucket: new Date(bucket),
        count,
    }));
}
/**
 * Computes signal delivery success rate by subscriber.
 * Analyzes delivery success per subscriber.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {Date} since - Start date for analysis
 * @returns {Promise<Array<{ subscriberId: string; totalDeliveries: number; successRate: number }>>} Subscriber success rates
 *
 * @example
 * ```typescript
 * const rates = await computeSubscriberSuccessRates(
 *   DeliveryLog,
 *   new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
async function computeSubscriberSuccessRates(model, since) {
    const logs = await model.findAll({
        where: {
            createdAt: { [sequelize_1.Op.gte]: since },
        },
    });
    const subscriberStats = new Map();
    logs.forEach((log) => {
        const stats = subscriberStats.get(log.subscriberId) || { total: 0, success: 0 };
        stats.total++;
        if (log.status === 'delivered') {
            stats.success++;
        }
        subscriberStats.set(log.subscriberId, stats);
    });
    return Array.from(subscriberStats.entries()).map(([subscriberId, stats]) => ({
        subscriberId,
        totalDeliveries: stats.total,
        successRate: stats.total > 0 ? stats.success / stats.total : 0,
    }));
}
// ============================================================================
// ADVANCED SIGNAL MANAGEMENT
// ============================================================================
/**
 * Implements signal priority boosting.
 * Increases priority of signals that have been waiting too long.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {number} ageThresholdMs - Age threshold for boosting
 * @param {number} boostAmount - Amount to increase priority
 * @returns {Promise<number>} Number of signals boosted
 *
 * @example
 * ```typescript
 * const boosted = await boostStaleSignalPriority(
 *   WorkflowSignal,
 *   60000, // 1 minute
 *   2
 * );
 * ```
 */
async function boostStaleSignalPriority(model, ageThresholdMs, boostAmount = 1) {
    const thresholdTime = new Date(Date.now() - ageThresholdMs);
    const [affectedCount] = await model.update({
        priority: model.sequelize.literal(`LEAST(priority + ${boostAmount}, 10)`),
    }, {
        where: {
            status: 'pending',
            createdAt: { [sequelize_1.Op.lt]: thresholdTime },
            priority: { [sequelize_1.Op.lt]: 10 },
        },
    });
    return affectedCount;
}
/**
 * Implements signal rate limiting per namespace.
 * Enforces maximum signal emission rate.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to check
 * @param {number} maxSignalsPerMinute - Rate limit
 * @returns {Promise<boolean>} Whether rate limit is exceeded
 *
 * @example
 * ```typescript
 * const exceeded = await checkSignalRateLimit(WorkflowSignal, 'orders', 1000);
 * if (exceeded) {
 *   throw new Error('Rate limit exceeded');
 * }
 * ```
 */
async function checkSignalRateLimit(model, namespace, maxSignalsPerMinute) {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const count = await model.count({
        where: {
            namespace,
            createdAt: { [sequelize_1.Op.gte]: oneMinuteAgo },
        },
    });
    return count >= maxSignalsPerMinute;
}
/**
 * Clones a signal with modifications.
 * Creates a copy of a signal with updated fields.
 *
 * @param {WorkflowSignal} signal - Signal to clone
 * @param {Partial<WorkflowSignalAttributes>} modifications - Fields to modify
 * @returns {Promise<WorkflowSignal>} Cloned signal
 *
 * @example
 * ```typescript
 * const cloned = await cloneSignal(signal, {
 *   priority: 10,
 *   metadata: { clonedFrom: signal.id }
 * });
 * ```
 */
async function cloneSignal(signal, modifications = {}) {
    const signalData = signal.get({ plain: true });
    delete signalData.id;
    delete signalData.createdAt;
    delete signalData.updatedAt;
    return await signal.constructor.create({
        ...signalData,
        id: (0, crypto_1.randomUUID)(),
        status: 'pending',
        subscriberCount: 0,
        deliveredCount: 0,
        ...modifications,
    });
}
//# sourceMappingURL=workflow-signal-broadcasting.js.map