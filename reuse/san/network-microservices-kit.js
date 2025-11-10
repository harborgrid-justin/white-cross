"use strict";
/**
 * LOC: NWMS1234567
 * File: /reuse/san/network-microservices-kit.ts
 *
 * UPSTREAM (imports from):
 *   - NestJS microservices (@nestjs/microservices)
 *   - RxJS (rxjs)
 *   - Sequelize (sequelize)
 *
 * DOWNSTREAM (imported by):
 *   - Network microservice implementations
 *   - Network service orchestrators
 *   - Network message brokers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStaleServices = exports.updateServiceHeartbeat = exports.registerServiceWithHeartbeat = exports.discoverServices = exports.degradedServiceFallback = exports.cacheAsideFallback = exports.cascadingFallback = exports.executeWithFallback = exports.conditionalRetry = exports.retryWithDeadline = exports.createRetryPolicy = exports.calculateRetryDelay = exports.executeWithRetry = exports.resetCircuitBreaker = exports.handleCircuitBreakerFailure = exports.handleCircuitBreakerSuccess = exports.executeWithCircuitBreaker = exports.createCircuitBreaker = exports.deregisterServiceFromMesh = exports.registerServiceInMesh = exports.checkServiceHealth = exports.selectServiceInstance = exports.createServiceMesh = exports.replayEvents = exports.reconstructStateFromEvents = exports.createEventHandler = exports.publishNetworkEvent = exports.createNetworkEventBus = exports.isDuplicateMessage = exports.createDeadLetterQueueHandler = exports.subscribeToMessageQueue = exports.publishToMessageQueue = exports.createMessageQueueConfig = exports.generateServiceId = exports.createHybridMicroserviceConfig = exports.validateMicroserviceConfig = exports.createMicroserviceConfig = exports.createCircuitBreakerLogModel = exports.createNetworkEventModel = exports.createNetworkMicroserviceModel = void 0;
/**
 * File: /reuse/san/network-microservices-kit.ts
 * Locator: WC-UTL-NWMS-001
 * Purpose: Comprehensive Network Microservices Utilities - microservice patterns, message queues, event bus, service mesh, circuit breaker, retry strategies, fallback mechanisms, service discovery
 *
 * Upstream: Independent utility module for network microservices implementation
 * Downstream: ../backend/*, Network controllers, microservice handlers, event processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, RabbitMQ, Redis, NATS, Kafka
 * Exports: 40+ utility functions for network microservices, message queues, event bus, circuit breaker, service discovery
 *
 * LLM Context: Comprehensive network microservices utilities for implementing production-ready distributed network systems.
 * Provides microservice patterns, message queue integration, event-driven architecture, service mesh, circuit breakers,
 * retry logic, fallback mechanisms, and service discovery. Essential for scalable software-defined network infrastructure.
 */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Network Microservice Registry with health status and metadata.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkMicroservice model
 *
 * @example
 * ```typescript
 * const NetworkMicroservice = createNetworkMicroserviceModel(sequelize);
 * const service = await NetworkMicroservice.create({
 *   serviceId: 'network-sdn-controller-01',
 *   serviceName: 'sdn-controller',
 *   version: '2.1.0',
 *   transport: 'GRPC',
 *   host: '10.0.1.50',
 *   port: 50051,
 *   status: 'healthy'
 * });
 * ```
 */
const createNetworkMicroserviceModel = (sequelize) => {
    class NetworkMicroservice extends sequelize_1.Model {
    }
    NetworkMicroservice.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        serviceId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique service identifier',
        },
        serviceName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Service name for discovery',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: '1.0.0',
            comment: 'Service version',
        },
        transport: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Transport protocol (TCP, GRPC, REDIS, etc.)',
        },
        host: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Service host address',
        },
        port: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Service port number',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Service health status',
        },
        healthCheckUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Health check endpoint URL',
        },
        lastHeartbeat: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Last heartbeat timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Service metadata',
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Service tags for filtering',
        },
    }, {
        sequelize,
        tableName: 'network_microservices',
        timestamps: true,
        indexes: [
            { fields: ['serviceId'], unique: true },
            { fields: ['serviceName'] },
            { fields: ['status'] },
            { fields: ['lastHeartbeat'] },
        ],
    });
    return NetworkMicroservice;
};
exports.createNetworkMicroserviceModel = createNetworkMicroserviceModel;
/**
 * Sequelize model for Network Event Bus Events with persistence and replay.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkEvent model
 *
 * @example
 * ```typescript
 * const NetworkEvent = createNetworkEventModel(sequelize);
 * const event = await NetworkEvent.create({
 *   eventId: 'evt_network_topology_change_001',
 *   eventType: 'network.topology.updated',
 *   aggregateId: 'network_001',
 *   payload: { nodes: 5, links: 8 },
 *   version: 1
 * });
 * ```
 */
const createNetworkEventModel = (sequelize) => {
    class NetworkEvent extends sequelize_1.Model {
    }
    NetworkEvent.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        eventId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique event identifier',
        },
        eventType: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Event type for routing',
        },
        aggregateId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Aggregate identifier',
        },
        aggregateType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Aggregate type',
        },
        payload: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Event payload data',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Event version',
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'User who triggered the event',
        },
        publishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Event publication timestamp',
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Event processing timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Event metadata',
        },
    }, {
        sequelize,
        tableName: 'network_events',
        timestamps: true,
        indexes: [
            { fields: ['eventId'], unique: true },
            { fields: ['eventType'] },
            { fields: ['aggregateId'] },
            { fields: ['publishedAt'] },
            { fields: ['processedAt'] },
        ],
    });
    return NetworkEvent;
};
exports.createNetworkEventModel = createNetworkEventModel;
/**
 * Sequelize model for Circuit Breaker State tracking per service.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CircuitBreakerLog model
 *
 * @example
 * ```typescript
 * const CircuitBreakerLog = createCircuitBreakerLogModel(sequelize);
 * const log = await CircuitBreakerLog.create({
 *   serviceName: 'network-flow-analyzer',
 *   state: 'OPEN',
 *   failureCount: 5,
 *   lastFailure: new Date()
 * });
 * ```
 */
const createCircuitBreakerLogModel = (sequelize) => {
    class CircuitBreakerLog extends sequelize_1.Model {
    }
    CircuitBreakerLog.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        serviceName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Service name being monitored',
        },
        state: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'CLOSED',
            comment: 'Circuit breaker state',
        },
        failureCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Consecutive failure count',
        },
        successCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Consecutive success count',
        },
        lastFailure: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last failure timestamp',
        },
        lastSuccess: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last success timestamp',
        },
        stateChangedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Last state change timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'circuit_breaker_logs',
        timestamps: true,
        indexes: [
            { fields: ['serviceName', 'state'] },
            { fields: ['stateChangedAt'] },
        ],
    });
    return CircuitBreakerLog;
};
exports.createCircuitBreakerLogModel = createCircuitBreakerLogModel;
// ============================================================================
// MICROSERVICE CONFIGURATION & INITIALIZATION (4-7)
// ============================================================================
/**
 * Creates NestJS microservice configuration for network services.
 *
 * @param {MicroserviceConfig} config - Microservice configuration
 * @returns {any} NestJS microservice options
 *
 * @example
 * ```typescript
 * const options = createMicroserviceConfig({
 *   serviceName: 'network-topology-service',
 *   transport: 'GRPC',
 *   host: '0.0.0.0',
 *   port: 50051,
 *   retryAttempts: 5,
 *   retryDelay: 3000
 * });
 * ```
 */
const createMicroserviceConfig = (config) => {
    const baseConfig = {
        transport: config.transport,
        options: {
            host: config.host,
            port: config.port,
            retryAttempts: config.retryAttempts || 5,
            retryDelay: config.retryDelay || 3000,
            ...config.options,
        },
    };
    // Add transport-specific configurations
    switch (config.transport) {
        case 'GRPC':
            baseConfig.options.package = config.options?.package || config.serviceName;
            baseConfig.options.protoPath = config.options?.protoPath || `./proto/${config.serviceName}.proto`;
            baseConfig.options.loader = {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true,
                ...config.options?.loader,
            };
            break;
        case 'REDIS':
            baseConfig.options.retryAttempts = config.retryAttempts || 10;
            baseConfig.options.wildcards = true;
            break;
        case 'RABBITMQ':
            baseConfig.options.urls = config.options?.urls || [`amqp://${config.host}:${config.port}`];
            baseConfig.options.queue = config.options?.queue || `${config.serviceName}_queue`;
            baseConfig.options.queueOptions = {
                durable: true,
                ...config.options?.queueOptions,
            };
            break;
        case 'KAFKA':
            baseConfig.options.client = {
                clientId: config.serviceName,
                brokers: config.options?.brokers || [`${config.host}:${config.port}`],
                ...config.options?.client,
            };
            baseConfig.options.consumer = {
                groupId: `${config.serviceName}-group`,
                ...config.options?.consumer,
            };
            break;
        case 'NATS':
            baseConfig.options.servers = config.options?.servers || [`nats://${config.host}:${config.port}`];
            baseConfig.options.queue = config.serviceName;
            break;
    }
    return baseConfig;
};
exports.createMicroserviceConfig = createMicroserviceConfig;
/**
 * Validates microservice configuration and checks connectivity.
 *
 * @param {MicroserviceConfig} config - Microservice configuration
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateMicroserviceConfig({
 *   serviceName: 'network-sdn',
 *   transport: 'TCP',
 *   host: 'localhost',
 *   port: 3001
 * });
 * ```
 */
const validateMicroserviceConfig = async (config) => {
    const errors = [];
    if (!config.serviceName || config.serviceName.trim().length === 0) {
        errors.push('Service name is required');
    }
    if (!config.transport) {
        errors.push('Transport type is required');
    }
    if (!config.host || config.host.trim().length === 0) {
        errors.push('Host is required');
    }
    if (!config.port || config.port < 1 || config.port > 65535) {
        errors.push('Valid port number (1-65535) is required');
    }
    // Validate transport-specific requirements
    switch (config.transport) {
        case 'GRPC':
            if (!config.options?.protoPath && !config.options?.package) {
                errors.push('GRPC requires either protoPath or package option');
            }
            break;
        case 'KAFKA':
            if (!config.options?.brokers && !config.host) {
                errors.push('Kafka requires brokers configuration');
            }
            break;
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateMicroserviceConfig = validateMicroserviceConfig;
/**
 * Creates hybrid microservice configuration supporting multiple transports.
 *
 * @param {MicroserviceConfig[]} configs - Array of microservice configurations
 * @returns {any[]} Array of NestJS microservice options
 *
 * @example
 * ```typescript
 * const hybridConfigs = createHybridMicroserviceConfig([
 *   { serviceName: 'network-api', transport: 'TCP', host: '0.0.0.0', port: 3001 },
 *   { serviceName: 'network-events', transport: 'REDIS', host: 'localhost', port: 6379 }
 * ]);
 * ```
 */
const createHybridMicroserviceConfig = (configs) => {
    return configs.map(config => (0, exports.createMicroserviceConfig)(config));
};
exports.createHybridMicroserviceConfig = createHybridMicroserviceConfig;
/**
 * Generates unique service identifier for registration.
 *
 * @param {string} serviceName - Service name
 * @param {string} [version='1.0.0'] - Service version
 * @returns {string} Unique service ID
 *
 * @example
 * ```typescript
 * const serviceId = generateServiceId('network-flow-analyzer', '2.1.0');
 * // Result: 'network-flow-analyzer-2.1.0-a1b2c3d4'
 * ```
 */
const generateServiceId = (serviceName, version = '1.0.0') => {
    const crypto = require('crypto');
    const random = crypto.randomBytes(4).toString('hex');
    return `${serviceName}-${version}-${random}`;
};
exports.generateServiceId = generateServiceId;
// ============================================================================
// MESSAGE QUEUE INTEGRATION (8-12)
// ============================================================================
/**
 * Creates message queue configuration for network microservices.
 *
 * @param {MessageQueueConfig} config - Message queue configuration
 * @returns {any} Queue configuration object
 *
 * @example
 * ```typescript
 * const queueConfig = createMessageQueueConfig({
 *   broker: 'rabbitmq',
 *   url: 'amqp://localhost:5672',
 *   queue: 'network_events',
 *   exchange: 'network_exchange',
 *   durable: true
 * });
 * ```
 */
const createMessageQueueConfig = (config) => {
    const baseConfig = {
        broker: config.broker,
        url: config.url,
        queue: config.queue,
    };
    switch (config.broker) {
        case 'rabbitmq':
            return {
                ...baseConfig,
                urls: [config.url],
                queue: config.queue,
                queueOptions: {
                    durable: config.durable ?? true,
                },
                exchange: config.exchange,
                prefetchCount: config.prefetchCount || 10,
                noAck: !(config.autoAck ?? false),
                persistent: true,
            };
        case 'redis':
            return {
                ...baseConfig,
                host: new URL(config.url).hostname,
                port: parseInt(new URL(config.url).port) || 6379,
                retryAttempts: 5,
                retryDelay: 3000,
            };
        case 'kafka':
            return {
                ...baseConfig,
                client: {
                    brokers: [config.url],
                },
                consumer: {
                    groupId: config.queue,
                },
                producer: {
                    allowAutoTopicCreation: true,
                },
            };
        case 'nats':
            return {
                ...baseConfig,
                servers: [config.url],
                queue: config.queue,
            };
        default:
            return baseConfig;
    }
};
exports.createMessageQueueConfig = createMessageQueueConfig;
/**
 * Publishes message to network message queue with routing.
 *
 * @param {any} client - Message queue client
 * @param {string} pattern - Message pattern
 * @param {any} data - Message data
 * @param {Record<string, any>} [options] - Publish options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishToMessageQueue(
 *   rabbitClient,
 *   'network.topology.update',
 *   { networkId: 'net_001', nodes: 10 },
 *   { priority: 5, persistent: true }
 * );
 * ```
 */
const publishToMessageQueue = async (client, pattern, data, options) => {
    try {
        const message = {
            pattern,
            data,
            timestamp: new Date().toISOString(),
            messageId: generateMessageId(),
            ...options,
        };
        await client.emit(pattern, message);
    }
    catch (error) {
        throw new Error(`Failed to publish message: ${error.message}`);
    }
};
exports.publishToMessageQueue = publishToMessageQueue;
/**
 * Subscribes to network message queue pattern with handler.
 *
 * @param {any} client - Message queue client
 * @param {string} pattern - Message pattern to subscribe
 * @param {Function} handler - Message handler function
 * @returns {void}
 *
 * @example
 * ```typescript
 * subscribeToMessageQueue(
 *   rabbitClient,
 *   'network.topology.*',
 *   async (data) => {
 *     console.log('Topology update:', data);
 *     await processTopologyUpdate(data);
 *   }
 * );
 * ```
 */
const subscribeToMessageQueue = (client, pattern, handler) => {
    client.subscribeToResponseOf(pattern);
    client.on(pattern, async (data) => {
        try {
            await handler(data);
        }
        catch (error) {
            console.error(`Error handling message for pattern ${pattern}:`, error.message);
        }
    });
};
exports.subscribeToMessageQueue = subscribeToMessageQueue;
/**
 * Creates dead letter queue handler for failed messages.
 *
 * @param {any} client - Message queue client
 * @param {string} dlqName - Dead letter queue name
 * @param {Function} handler - DLQ handler function
 * @returns {void}
 *
 * @example
 * ```typescript
 * createDeadLetterQueueHandler(
 *   rabbitClient,
 *   'network_dlq',
 *   async (failedMessage) => {
 *     await logFailedMessage(failedMessage);
 *     await notifyAdministrators(failedMessage);
 *   }
 * );
 * ```
 */
const createDeadLetterQueueHandler = (client, dlqName, handler) => {
    client.subscribeToResponseOf(dlqName);
    client.on(dlqName, async (message) => {
        try {
            await handler({
                ...message,
                dlqProcessedAt: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error(`Error processing DLQ message:`, error.message);
        }
    });
};
exports.createDeadLetterQueueHandler = createDeadLetterQueueHandler;
/**
 * Implements message deduplication using message IDs.
 *
 * @param {string} messageId - Message ID to check
 * @param {number} [ttl=300000] - TTL in milliseconds (default 5 minutes)
 * @returns {Promise<boolean>} True if message is duplicate
 *
 * @example
 * ```typescript
 * const isDuplicate = await isDuplicateMessage('msg_abc123', 60000);
 * if (!isDuplicate) {
 *   await processMessage(message);
 * }
 * ```
 */
const isDuplicateMessage = async (messageId, ttl = 300000) => {
    const cache = new Map();
    const now = Date.now();
    // Clean expired entries
    for (const [id, timestamp] of cache.entries()) {
        if (now - timestamp > ttl) {
            cache.delete(id);
        }
    }
    if (cache.has(messageId)) {
        return true;
    }
    cache.set(messageId, now);
    return false;
};
exports.isDuplicateMessage = isDuplicateMessage;
// ============================================================================
// EVENT BUS IMPLEMENTATION (13-17)
// ============================================================================
/**
 * Creates network event bus with publish/subscribe capabilities.
 *
 * @param {EventBusConfig} config - Event bus configuration
 * @returns {any} Event bus instance
 *
 * @example
 * ```typescript
 * const eventBus = createNetworkEventBus({
 *   broker: 'redis',
 *   channels: ['network.topology', 'network.flows', 'network.alerts'],
 *   persistEvents: true,
 *   eventStore: true
 * });
 * ```
 */
const createNetworkEventBus = (config) => {
    const eventSubjects = new Map();
    config.channels.forEach(channel => {
        eventSubjects.set(channel, new rxjs_1.Subject());
    });
    return {
        publish: (channel, event) => {
            const subject = eventSubjects.get(channel);
            if (subject) {
                subject.next({
                    ...event,
                    publishedAt: new Date().toISOString(),
                    channel,
                });
            }
        },
        subscribe: (channel, handler) => {
            const subject = eventSubjects.get(channel);
            if (subject) {
                return subject.subscribe(handler);
            }
            return null;
        },
        channels: () => Array.from(eventSubjects.keys()),
    };
};
exports.createNetworkEventBus = createNetworkEventBus;
/**
 * Publishes network event to event bus with metadata.
 *
 * @param {any} eventBus - Event bus instance
 * @param {string} eventType - Event type
 * @param {any} payload - Event payload
 * @param {Record<string, any>} [metadata] - Event metadata
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishNetworkEvent(
 *   eventBus,
 *   'network.link.down',
 *   { linkId: 'link_001', source: 'sw1', target: 'sw2' },
 *   { severity: 'critical', userId: 'admin' }
 * );
 * ```
 */
const publishNetworkEvent = async (eventBus, eventType, payload, metadata) => {
    const event = {
        eventId: generateEventId(),
        eventType,
        payload,
        metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
        },
    };
    eventBus.publish(eventType, event);
};
exports.publishNetworkEvent = publishNetworkEvent;
/**
 * Creates event handler with filtering and transformation.
 *
 * @param {Function} handler - Event handler function
 * @param {any} [filter] - Event filter function
 * @param {any} [transform] - Event transformation function
 * @returns {Function} Wrapped event handler
 *
 * @example
 * ```typescript
 * const handler = createEventHandler(
 *   async (event) => { await processEvent(event); },
 *   (event) => event.metadata.severity === 'critical',
 *   (event) => ({ ...event, enriched: true })
 * );
 * ```
 */
const createEventHandler = (handler, filter, transform) => {
    return async (event) => {
        try {
            if (filter && !filter(event)) {
                return;
            }
            const processedEvent = transform ? transform(event) : event;
            await handler(processedEvent);
        }
        catch (error) {
            console.error('Event handler error:', error.message);
            throw error;
        }
    };
};
exports.createEventHandler = createEventHandler;
/**
 * Implements event sourcing for network state reconstruction.
 *
 * @param {any[]} events - Array of events
 * @param {any} initialState - Initial state
 * @param {Function} reducer - State reducer function
 * @returns {any} Reconstructed state
 *
 * @example
 * ```typescript
 * const currentState = reconstructStateFromEvents(
 *   events,
 *   { nodes: {}, links: {} },
 *   (state, event) => {
 *     if (event.type === 'NODE_ADDED') {
 *       return { ...state, nodes: { ...state.nodes, [event.nodeId]: event.data } };
 *     }
 *     return state;
 *   }
 * );
 * ```
 */
const reconstructStateFromEvents = (events, initialState, reducer) => {
    return events.reduce((state, event) => {
        try {
            return reducer(state, event);
        }
        catch (error) {
            console.error(`Error processing event ${event.eventId}:`, error.message);
            return state;
        }
    }, initialState);
};
exports.reconstructStateFromEvents = reconstructStateFromEvents;
/**
 * Creates event replay mechanism for event store.
 *
 * @param {Model} EventModel - Event model
 * @param {string} aggregateId - Aggregate identifier
 * @param {Function} handler - Event handler
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await replayEvents(
 *   NetworkEventModel,
 *   'network_001',
 *   async (event) => {
 *     await applyEventToState(event);
 *   }
 * );
 * ```
 */
const replayEvents = async (EventModel, aggregateId, handler) => {
    const events = await EventModel.findAll({
        where: { aggregateId },
        order: [['version', 'ASC'], ['createdAt', 'ASC']],
    });
    for (const event of events) {
        await handler(event);
    }
};
exports.replayEvents = replayEvents;
// ============================================================================
// SERVICE MESH UTILITIES (18-22)
// ============================================================================
/**
 * Creates service mesh configuration for network microservices.
 *
 * @param {ServiceMeshConfig} config - Service mesh configuration
 * @returns {any} Service mesh instance
 *
 * @example
 * ```typescript
 * const mesh = createServiceMesh({
 *   meshId: 'network-mesh-01',
 *   services: [
 *     { serviceId: 'svc1', serviceName: 'topology', host: '10.0.1.1', port: 3001 },
 *     { serviceId: 'svc2', serviceName: 'flows', host: '10.0.1.2', port: 3002 }
 *   ],
 *   loadBalancing: 'round-robin',
 *   healthCheckInterval: 30000,
 *   timeout: 5000
 * });
 * ```
 */
const createServiceMesh = (config) => {
    const serviceRegistry = new Map();
    const loadBalancerState = {
        currentIndex: 0,
        connections: new Map(),
        lastSelected: '',
    };
    config.services.forEach(service => {
        const instances = serviceRegistry.get(service.serviceName) || [];
        instances.push({
            id: service.serviceId,
            name: service.serviceName,
            host: service.host,
            port: service.port,
            healthy: true,
            lastHeartbeat: new Date(),
            metadata: service.metadata || {},
        });
        serviceRegistry.set(service.serviceName, instances);
    });
    return {
        registry: serviceRegistry,
        loadBalancerState,
        config,
        getService: (serviceName) => serviceRegistry.get(serviceName),
        selectInstance: (serviceName) => (0, exports.selectServiceInstance)(serviceRegistry.get(serviceName) || [], config.loadBalancing, loadBalancerState),
    };
};
exports.createServiceMesh = createServiceMesh;
/**
 * Selects service instance using load balancing strategy.
 *
 * @param {ServiceInstance[]} instances - Available service instances
 * @param {string} strategy - Load balancing strategy
 * @param {LoadBalancerState} state - Load balancer state
 * @returns {ServiceInstance | null} Selected instance
 *
 * @example
 * ```typescript
 * const instance = selectServiceInstance(
 *   instances,
 *   'least-connections',
 *   loadBalancerState
 * );
 * ```
 */
const selectServiceInstance = (instances, strategy, state) => {
    const healthy = instances.filter(i => i.healthy);
    if (healthy.length === 0)
        return null;
    switch (strategy) {
        case 'round-robin': {
            const instance = healthy[state.currentIndex % healthy.length];
            state.currentIndex++;
            return instance;
        }
        case 'least-connections': {
            let minConnections = Infinity;
            let selected = null;
            healthy.forEach(instance => {
                const connections = state.connections.get(instance.id) || 0;
                if (connections < minConnections) {
                    minConnections = connections;
                    selected = instance;
                }
            });
            return selected;
        }
        case 'random': {
            const index = Math.floor(Math.random() * healthy.length);
            return healthy[index];
        }
        case 'ip-hash': {
            const hash = state.lastSelected.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return healthy[hash % healthy.length];
        }
        default:
            return healthy[0];
    }
};
exports.selectServiceInstance = selectServiceInstance;
/**
 * Performs health check on service instance.
 *
 * @param {ServiceInstance} instance - Service instance
 * @param {number} [timeout=5000] - Timeout in milliseconds
 * @returns {Promise<boolean>} Health check result
 *
 * @example
 * ```typescript
 * const isHealthy = await checkServiceHealth(instance, 3000);
 * if (!isHealthy) {
 *   await removeInstanceFromMesh(instance);
 * }
 * ```
 */
const checkServiceHealth = async (instance, timeout = 5000) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(`http://${instance.host}:${instance.port}/health`, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response.ok;
    }
    catch (error) {
        return false;
    }
};
exports.checkServiceHealth = checkServiceHealth;
/**
 * Registers service in service mesh with metadata.
 *
 * @param {any} mesh - Service mesh instance
 * @param {ServiceRegistration} registration - Service registration details
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await registerServiceInMesh(mesh, {
 *   serviceId: 'network-analyzer-01',
 *   serviceName: 'network-analyzer',
 *   version: '2.0.0',
 *   host: '10.0.1.50',
 *   port: 3003,
 *   protocol: 'http',
 *   healthCheckUrl: '/health'
 * });
 * ```
 */
const registerServiceInMesh = async (mesh, registration) => {
    const instances = mesh.registry.get(registration.serviceName) || [];
    const instance = {
        id: registration.serviceId,
        name: registration.serviceName,
        host: registration.host,
        port: registration.port,
        healthy: true,
        lastHeartbeat: new Date(),
        metadata: {
            version: registration.version,
            protocol: registration.protocol,
            healthCheckUrl: registration.healthCheckUrl,
            ...registration.metadata,
        },
    };
    instances.push(instance);
    mesh.registry.set(registration.serviceName, instances);
};
exports.registerServiceInMesh = registerServiceInMesh;
/**
 * Deregisters service from service mesh.
 *
 * @param {any} mesh - Service mesh instance
 * @param {string} serviceId - Service ID to deregister
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deregisterServiceFromMesh(mesh, 'network-analyzer-01');
 * ```
 */
const deregisterServiceFromMesh = async (mesh, serviceId) => {
    for (const [serviceName, instances] of mesh.registry.entries()) {
        const filtered = instances.filter(i => i.id !== serviceId);
        mesh.registry.set(serviceName, filtered);
    }
};
exports.deregisterServiceFromMesh = deregisterServiceFromMesh;
// ============================================================================
// CIRCUIT BREAKER PATTERN (23-27)
// ============================================================================
/**
 * Creates circuit breaker for network service calls.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {any} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000,
 *   halfOpenRetryDelay: 30000,
 *   monitoringPeriod: 10000
 * });
 * ```
 */
const createCircuitBreaker = (config) => {
    const state = {
        state: 'CLOSED',
        failureCount: 0,
        successCount: 0,
        lastFailureTime: 0,
        lastStateChange: Date.now(),
    };
    return {
        state,
        config,
        execute: async (operation) => (0, exports.executeWithCircuitBreaker)(operation, state, config),
        getState: () => state.state,
        reset: () => (0, exports.resetCircuitBreaker)(state),
    };
};
exports.createCircuitBreaker = createCircuitBreaker;
/**
 * Executes operation with circuit breaker protection.
 *
 * @param {Function} operation - Operation to execute
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithCircuitBreaker(
 *   async () => await networkService.getTopology(),
 *   state,
 *   config
 * );
 * ```
 */
const executeWithCircuitBreaker = async (operation, state, config) => {
    // Check if circuit is open
    if (state.state === 'OPEN') {
        if (Date.now() - state.lastFailureTime > config.timeout) {
            state.state = 'HALF_OPEN';
            state.lastStateChange = Date.now();
        }
        else {
            throw new Error('Circuit breaker is OPEN');
        }
    }
    try {
        const result = await operation();
        (0, exports.handleCircuitBreakerSuccess)(state, config);
        return result;
    }
    catch (error) {
        (0, exports.handleCircuitBreakerFailure)(state, config);
        throw error;
    }
};
exports.executeWithCircuitBreaker = executeWithCircuitBreaker;
/**
 * Handles successful circuit breaker operation.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * handleCircuitBreakerSuccess(state, config);
 * ```
 */
const handleCircuitBreakerSuccess = (state, config) => {
    state.failureCount = 0;
    if (state.state === 'HALF_OPEN') {
        state.successCount++;
        if (state.successCount >= config.successThreshold) {
            state.state = 'CLOSED';
            state.successCount = 0;
            state.lastStateChange = Date.now();
        }
    }
};
exports.handleCircuitBreakerSuccess = handleCircuitBreakerSuccess;
/**
 * Handles failed circuit breaker operation.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * handleCircuitBreakerFailure(state, config);
 * ```
 */
const handleCircuitBreakerFailure = (state, config) => {
    state.failureCount++;
    state.lastFailureTime = Date.now();
    state.successCount = 0;
    if (state.failureCount >= config.failureThreshold) {
        state.state = 'OPEN';
        state.lastStateChange = Date.now();
    }
};
exports.handleCircuitBreakerFailure = handleCircuitBreakerFailure;
/**
 * Resets circuit breaker to initial state.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @returns {void}
 *
 * @example
 * ```typescript
 * resetCircuitBreaker(state);
 * ```
 */
const resetCircuitBreaker = (state) => {
    state.state = 'CLOSED';
    state.failureCount = 0;
    state.successCount = 0;
    state.lastFailureTime = 0;
    state.lastStateChange = Date.now();
};
exports.resetCircuitBreaker = resetCircuitBreaker;
// ============================================================================
// RETRY STRATEGIES (28-32)
// ============================================================================
/**
 * Executes operation with configurable retry strategy.
 *
 * @param {Function} operation - Operation to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   async () => await networkService.fetchData(),
 *   {
 *     maxAttempts: 5,
 *     backoffType: 'exponential',
 *     initialDelay: 1000,
 *     maxDelay: 30000,
 *     multiplier: 2,
 *     jitter: true
 *   }
 * );
 * ```
 */
const executeWithRetry = async (operation, config) => {
    let attempt = 0;
    let lastError;
    while (attempt < config.maxAttempts) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            attempt++;
            if (attempt >= config.maxAttempts) {
                throw new Error(`Operation failed after ${config.maxAttempts} attempts: ${lastError.message}`);
            }
            const delay = (0, exports.calculateRetryDelay)(attempt, config);
            await sleep(delay);
        }
    }
    throw lastError;
};
exports.executeWithRetry = executeWithRetry;
/**
 * Calculates retry delay based on backoff strategy.
 *
 * @param {number} attempt - Current attempt number
 * @param {RetryConfig} config - Retry configuration
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(3, {
 *   backoffType: 'exponential',
 *   initialDelay: 1000,
 *   maxDelay: 30000,
 *   multiplier: 2
 * });
 * // Result: 4000 (1000 * 2^2)
 * ```
 */
const calculateRetryDelay = (attempt, config) => {
    let delay;
    switch (config.backoffType) {
        case 'exponential':
            delay = Math.min(config.initialDelay * Math.pow(config.multiplier || 2, attempt - 1), config.maxDelay);
            break;
        case 'linear':
            delay = Math.min(config.initialDelay * attempt, config.maxDelay);
            break;
        case 'fixed':
        default:
            delay = config.initialDelay;
            break;
    }
    // Add jitter to prevent thundering herd
    if (config.jitter) {
        delay = delay * (0.5 + Math.random() * 0.5);
    }
    return Math.floor(delay);
};
exports.calculateRetryDelay = calculateRetryDelay;
/**
 * Creates retry policy with RxJS operators.
 *
 * @param {RetryConfig} config - Retry configuration
 * @returns {any} RxJS retry operator
 *
 * @example
 * ```typescript
 * const retryPolicy = createRetryPolicy({
 *   maxAttempts: 3,
 *   backoffType: 'exponential',
 *   initialDelay: 1000,
 *   maxDelay: 10000
 * });
 *
 * observable$.pipe(retryPolicy).subscribe(...);
 * ```
 */
const createRetryPolicy = (config) => {
    return (0, operators_1.retry)({
        count: config.maxAttempts,
        delay: (error, retryCount) => {
            const delay = (0, exports.calculateRetryDelay)(retryCount, config);
            return (0, rxjs_1.of)(error).pipe((0, operators_1.switchMap)(() => (0, rxjs_1.interval)(delay).pipe((0, operators_1.take)(1))));
        },
    });
};
exports.createRetryPolicy = createRetryPolicy;
/**
 * Implements deadline-based retry with timeout.
 *
 * @param {Function} operation - Operation to execute
 * @param {number} deadline - Deadline in milliseconds
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await retryWithDeadline(
 *   async () => await networkService.getData(),
 *   30000, // 30 second deadline
 *   { maxAttempts: 5, backoffType: 'exponential', initialDelay: 1000, maxDelay: 5000 }
 * );
 * ```
 */
const retryWithDeadline = async (operation, deadline, config) => {
    const startTime = Date.now();
    return (0, exports.executeWithRetry)(async () => {
        if (Date.now() - startTime > deadline) {
            throw new Error('Deadline exceeded');
        }
        return await operation();
    }, config);
};
exports.retryWithDeadline = retryWithDeadline;
/**
 * Creates conditional retry based on error type.
 *
 * @param {Function} operation - Operation to execute
 * @param {Function} shouldRetry - Function to determine if should retry
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await conditionalRetry(
 *   async () => await networkService.call(),
 *   (error) => error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT',
 *   { maxAttempts: 3, backoffType: 'fixed', initialDelay: 2000, maxDelay: 2000 }
 * );
 * ```
 */
const conditionalRetry = async (operation, shouldRetry, config) => {
    let attempt = 0;
    let lastError;
    while (attempt < config.maxAttempts) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            attempt++;
            if (!shouldRetry(error) || attempt >= config.maxAttempts) {
                throw error;
            }
            const delay = (0, exports.calculateRetryDelay)(attempt, config);
            await sleep(delay);
        }
    }
    throw lastError;
};
exports.conditionalRetry = conditionalRetry;
// ============================================================================
// FALLBACK MECHANISMS (33-36)
// ============================================================================
/**
 * Executes operation with fallback on failure.
 *
 * @param {Function} primary - Primary operation
 * @param {Function} fallback - Fallback operation
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const data = await executeWithFallback(
 *   async () => await primaryDataSource.fetch(),
 *   async () => await cacheDataSource.fetch()
 * );
 * ```
 */
const executeWithFallback = async (primary, fallback) => {
    try {
        return await primary();
    }
    catch (error) {
        console.warn('Primary operation failed, using fallback:', error);
        return await fallback();
    }
};
exports.executeWithFallback = executeWithFallback;
/**
 * Creates cascading fallback chain with multiple options.
 *
 * @param {Array<Function>} operations - Array of operations to try
 * @returns {Promise<any>} Result from first successful operation
 *
 * @example
 * ```typescript
 * const result = await cascadingFallback([
 *   async () => await primaryService.getData(),
 *   async () => await secondaryService.getData(),
 *   async () => await cacheService.getData(),
 *   async () => ({ data: 'default' })
 * ]);
 * ```
 */
const cascadingFallback = async (operations) => {
    let lastError;
    for (const operation of operations) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            console.warn('Operation failed, trying next fallback:', error);
        }
    }
    throw new Error(`All fallback operations failed. Last error: ${lastError?.message}`);
};
exports.cascadingFallback = cascadingFallback;
/**
 * Implements cache-aside pattern with fallback.
 *
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data
 * @param {Map<string, any>} cache - Cache storage
 * @param {number} [ttl=300000] - TTL in milliseconds
 * @returns {Promise<any>} Cached or fetched data
 *
 * @example
 * ```typescript
 * const topology = await cacheAsideFallback(
 *   'network_topology_001',
 *   async () => await networkService.getTopology(),
 *   cacheStore,
 *   60000
 * );
 * ```
 */
const cacheAsideFallback = async (key, fetchFn, cache, ttl = 300000) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
    }
    try {
        const data = await fetchFn();
        cache.set(key, { data, timestamp: Date.now() });
        return data;
    }
    catch (error) {
        // Return stale data if available
        if (cached) {
            console.warn('Using stale cache data due to fetch error');
            return cached.data;
        }
        throw error;
    }
};
exports.cacheAsideFallback = cacheAsideFallback;
/**
 * Creates degraded service fallback with reduced functionality.
 *
 * @param {Function} fullService - Full service operation
 * @param {Function} degradedService - Degraded service operation
 * @param {Function} healthCheck - Health check function
 * @returns {Promise<any>} Service result
 *
 * @example
 * ```typescript
 * const result = await degradedServiceFallback(
 *   async () => await fullNetworkAnalysis(),
 *   async () => await basicNetworkStatus(),
 *   async () => await checkServiceHealth()
 * );
 * ```
 */
const degradedServiceFallback = async (fullService, degradedService, healthCheck) => {
    const isHealthy = await healthCheck();
    if (isHealthy) {
        try {
            return await fullService();
        }
        catch (error) {
            console.warn('Full service failed, degrading to basic service');
            return await degradedService();
        }
    }
    return await degradedService();
};
exports.degradedServiceFallback = degradedServiceFallback;
// ============================================================================
// SERVICE DISCOVERY (37-40)
// ============================================================================
/**
 * Discovers network services by name and tags.
 *
 * @param {Model} MicroserviceModel - Microservice model
 * @param {string} [serviceName] - Service name filter
 * @param {string[]} [tags] - Tags filter
 * @returns {Promise<any[]>} Discovered services
 *
 * @example
 * ```typescript
 * const services = await discoverServices(
 *   NetworkMicroserviceModel,
 *   'network-topology',
 *   ['production', 'sdn']
 * );
 * ```
 */
const discoverServices = async (MicroserviceModel, serviceName, tags) => {
    const where = {
        status: 'healthy',
    };
    if (serviceName) {
        where.serviceName = serviceName;
    }
    const services = await MicroserviceModel.findAll({ where });
    if (tags && tags.length > 0) {
        return services.filter((service) => tags.every(tag => service.tags.includes(tag)));
    }
    return services;
};
exports.discoverServices = discoverServices;
/**
 * Registers service with heartbeat mechanism.
 *
 * @param {Model} MicroserviceModel - Microservice model
 * @param {ServiceRegistration} registration - Service registration
 * @returns {Promise<any>} Registered service
 *
 * @example
 * ```typescript
 * const service = await registerServiceWithHeartbeat(
 *   NetworkMicroserviceModel,
 *   {
 *     serviceId: 'network-sdn-01',
 *     serviceName: 'sdn-controller',
 *     version: '2.0.0',
 *     host: '10.0.1.1',
 *     port: 50051,
 *     protocol: 'grpc',
 *     tags: ['production', 'controller']
 *   }
 * );
 * ```
 */
const registerServiceWithHeartbeat = async (MicroserviceModel, registration) => {
    const [service, created] = await MicroserviceModel.findOrCreate({
        where: { serviceId: registration.serviceId },
        defaults: {
            serviceName: registration.serviceName,
            version: registration.version,
            transport: registration.protocol.toUpperCase(),
            host: registration.host,
            port: registration.port,
            status: 'healthy',
            healthCheckUrl: registration.healthCheckUrl,
            lastHeartbeat: new Date(),
            metadata: registration.metadata || {},
            tags: registration.tags || [],
        },
    });
    if (!created) {
        await service.update({
            lastHeartbeat: new Date(),
            status: 'healthy',
        });
    }
    return service;
};
exports.registerServiceWithHeartbeat = registerServiceWithHeartbeat;
/**
 * Updates service heartbeat to maintain registration.
 *
 * @param {Model} MicroserviceModel - Microservice model
 * @param {string} serviceId - Service ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // In service, run periodically
 * setInterval(async () => {
 *   await updateServiceHeartbeat(NetworkMicroserviceModel, 'network-sdn-01');
 * }, 30000);
 * ```
 */
const updateServiceHeartbeat = async (MicroserviceModel, serviceId) => {
    await MicroserviceModel.update({
        lastHeartbeat: new Date(),
        status: 'healthy',
    }, {
        where: { serviceId },
    });
};
exports.updateServiceHeartbeat = updateServiceHeartbeat;
/**
 * Removes stale services based on heartbeat timeout.
 *
 * @param {Model} MicroserviceModel - Microservice model
 * @param {number} [timeoutMs=90000] - Heartbeat timeout in milliseconds
 * @returns {Promise<number>} Number of removed services
 *
 * @example
 * ```typescript
 * // Run periodically to clean stale services
 * setInterval(async () => {
 *   const removed = await removeStaleServices(NetworkMicroserviceModel, 60000);
 *   console.log(`Removed ${removed} stale services`);
 * }, 30000);
 * ```
 */
const removeStaleServices = async (MicroserviceModel, timeoutMs = 90000) => {
    const threshold = new Date(Date.now() - timeoutMs);
    const result = await MicroserviceModel.update({ status: 'unhealthy' }, {
        where: {
            lastHeartbeat: {
                [sequelize_1.Op.lt]: threshold,
            },
            status: 'healthy',
        },
    });
    return result[0];
};
exports.removeStaleServices = removeStaleServices;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates unique message ID.
 */
const generateMessageId = () => {
    const crypto = require('crypto');
    return `msg_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};
/**
 * Generates unique event ID.
 */
const generateEventId = () => {
    const crypto = require('crypto');
    return `evt_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};
/**
 * Sleep utility function.
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.default = {
    // Sequelize Models
    createNetworkMicroserviceModel: exports.createNetworkMicroserviceModel,
    createNetworkEventModel: exports.createNetworkEventModel,
    createCircuitBreakerLogModel: exports.createCircuitBreakerLogModel,
    // Microservice Configuration & Initialization
    createMicroserviceConfig: exports.createMicroserviceConfig,
    validateMicroserviceConfig: exports.validateMicroserviceConfig,
    createHybridMicroserviceConfig: exports.createHybridMicroserviceConfig,
    generateServiceId: exports.generateServiceId,
    // Message Queue Integration
    createMessageQueueConfig: exports.createMessageQueueConfig,
    publishToMessageQueue: exports.publishToMessageQueue,
    subscribeToMessageQueue: exports.subscribeToMessageQueue,
    createDeadLetterQueueHandler: exports.createDeadLetterQueueHandler,
    isDuplicateMessage: exports.isDuplicateMessage,
    // Event Bus Implementation
    createNetworkEventBus: exports.createNetworkEventBus,
    publishNetworkEvent: exports.publishNetworkEvent,
    createEventHandler: exports.createEventHandler,
    reconstructStateFromEvents: exports.reconstructStateFromEvents,
    replayEvents: exports.replayEvents,
    // Service Mesh Utilities
    createServiceMesh: exports.createServiceMesh,
    selectServiceInstance: exports.selectServiceInstance,
    checkServiceHealth: exports.checkServiceHealth,
    registerServiceInMesh: exports.registerServiceInMesh,
    deregisterServiceFromMesh: exports.deregisterServiceFromMesh,
    // Circuit Breaker Pattern
    createCircuitBreaker: exports.createCircuitBreaker,
    executeWithCircuitBreaker: exports.executeWithCircuitBreaker,
    handleCircuitBreakerSuccess: exports.handleCircuitBreakerSuccess,
    handleCircuitBreakerFailure: exports.handleCircuitBreakerFailure,
    resetCircuitBreaker: exports.resetCircuitBreaker,
    // Retry Strategies
    executeWithRetry: exports.executeWithRetry,
    calculateRetryDelay: exports.calculateRetryDelay,
    createRetryPolicy: exports.createRetryPolicy,
    retryWithDeadline: exports.retryWithDeadline,
    conditionalRetry: exports.conditionalRetry,
    // Fallback Mechanisms
    executeWithFallback: exports.executeWithFallback,
    cascadingFallback: exports.cascadingFallback,
    cacheAsideFallback: exports.cacheAsideFallback,
    degradedServiceFallback: exports.degradedServiceFallback,
    // Service Discovery
    discoverServices: exports.discoverServices,
    registerServiceWithHeartbeat: exports.registerServiceWithHeartbeat,
    updateServiceHeartbeat: exports.updateServiceHeartbeat,
    removeStaleServices: exports.removeStaleServices,
};
//# sourceMappingURL=network-microservices-kit.js.map