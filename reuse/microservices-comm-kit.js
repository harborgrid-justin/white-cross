"use strict";
/**
 * LOC: MSVC-COMM-001
 * File: /reuse/microservices-comm-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/microservices
 *   - @nestjs/common
 *   - @grpc/grpc-js
 *   - amqplib (RabbitMQ)
 *   - kafkajs
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Microservices modules and controllers
 *   - API gateway implementations
 *   - Service mesh integrations
 *   - Event-driven handlers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectServiceInstance = exports.validateServiceToken = exports.generateServiceToken = exports.checkVersionCompatibility = exports.addTraceLog = exports.finishTraceSpan = exports.createTraceSpan = exports.injectCorrelationContext = exports.extractCorrelationContext = exports.generateCorrelationContext = exports.monitorServiceHealth = exports.performHealthCheck = exports.executeWithRetryAndTimeout = exports.executeWithTimeout = exports.executeWithRetry = exports.resetCircuitBreaker = exports.getCircuitBreakerState = exports.executeWithCircuitBreaker = exports.createSagaStep = exports.compensateSaga = exports.executeSaga = exports.replayEvents = exports.getEventStream = exports.subscribeToEvents = exports.publishDomainEvent = exports.createKafkaConsumer = exports.publishToKafka = exports.createKafkaProducer = exports.subscribeToRabbitMQ = exports.publishToRabbitMQ = exports.createRabbitMQConnection = exports.createGrpcStream = exports.createGrpcMetadata = exports.createGrpcServer = exports.createGrpcClient = exports.findServicesByTags = exports.deregisterService = exports.updateServiceHeartbeat = exports.discoverService = exports.registerService = exports.initMessageQueueModel = exports.MessageQueue = exports.initServiceEventModel = exports.ServiceEvent = exports.initServiceRegistryModel = exports.ServiceRegistry = void 0;
/**
 * File: /reuse/microservices-comm-kit.ts
 * Locator: WC-UTL-MSVCCOMM-001
 * Purpose: Comprehensive Microservices Communication Utilities - Service Discovery, gRPC, Message Brokers, Saga Patterns, Circuit Breakers
 *
 * Upstream: @nestjs/microservices, @nestjs/common, @grpc/grpc-js, amqplib, kafkajs, sequelize
 * Downstream: ../backend/*, microservices controllers, API gateways, service meshes, event handlers
 * Dependencies: TypeScript 5.x, NestJS 10.x, gRPC, RabbitMQ, Kafka, Redis, Sequelize 6.x
 * Exports: 45 utility functions for microservices communication, distributed systems, resilience patterns, service orchestration
 *
 * LLM Context: Production-ready microservices communication toolkit for White Cross healthcare platform.
 * Provides service discovery, gRPC client/server utilities, RabbitMQ/Kafka integration, event-driven patterns,
 * saga orchestration, circuit breakers, retry policies, distributed tracing, service mesh integration,
 * API gateway routing, health checks, correlation IDs, service versioning, inter-service auth, and load balancing.
 * Essential for building scalable, resilient, HIPAA-compliant distributed healthcare systems.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * 1. Service Registry Sequelize Model
 * Stores registered microservices with their metadata and health status
 */
class ServiceRegistry extends sequelize_1.Model {
}
exports.ServiceRegistry = ServiceRegistry;
const initServiceRegistryModel = (sequelize) => {
    ServiceRegistry.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        serviceId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: 'service_id',
        },
        serviceName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'service_name',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        host: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        port: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        protocol: {
            type: sequelize_1.DataTypes.ENUM('http', 'grpc', 'tcp', 'amqp', 'kafka'),
            allowNull: false,
            defaultValue: 'http',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('healthy', 'unhealthy', 'degraded', 'starting', 'stopping'),
            allowNull: false,
            defaultValue: 'starting',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        healthCheckUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            field: 'health_check_url',
        },
        lastHeartbeat: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'last_heartbeat',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
    }, {
        sequelize,
        tableName: 'service_registry',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['service_name'] },
            { fields: ['status'] },
            { fields: ['last_heartbeat'] },
            { fields: ['tags'], using: 'gin' },
        ],
    });
    return ServiceRegistry;
};
exports.initServiceRegistryModel = initServiceRegistryModel;
/**
 * 2. Service Events Sequelize Model
 * Stores all events published by microservices for event sourcing and audit
 */
class ServiceEvent extends sequelize_1.Model {
}
exports.ServiceEvent = ServiceEvent;
const initServiceEventModel = (sequelize) => {
    ServiceEvent.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        eventId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            field: 'event_id',
        },
        eventType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'event_type',
        },
        source: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        aggregateId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'aggregate_id',
        },
        aggregateType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'aggregate_type',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        data: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        correlationId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'correlation_id',
        },
        causationId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'causation_id',
        },
    }, {
        sequelize,
        tableName: 'service_events',
        timestamps: true,
        updatedAt: false,
        underscored: true,
        indexes: [
            { fields: ['event_type'] },
            { fields: ['aggregate_id'] },
            { fields: ['aggregate_type'] },
            { fields: ['correlation_id'] },
            { fields: ['created_at'] },
            { fields: ['aggregate_id', 'version'], unique: true },
        ],
    });
    return ServiceEvent;
};
exports.initServiceEventModel = initServiceEventModel;
/**
 * 3. Message Queue Sequelize Model
 * Persistent message queue for reliable message delivery between services
 */
class MessageQueue extends sequelize_1.Model {
}
exports.MessageQueue = MessageQueue;
const initMessageQueueModel = (sequelize) => {
    MessageQueue.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        messageId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            field: 'message_id',
        },
        queueName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'queue_name',
        },
        pattern: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        data: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'dead_letter'),
            allowNull: false,
            defaultValue: 'pending',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        maxAttempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
            field: 'max_attempts',
        },
        scheduledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'scheduled_at',
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'processed_at',
        },
        error: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        correlationId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'correlation_id',
        },
        replyTo: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            field: 'reply_to',
        },
        headers: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'message_queue',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['queue_name'] },
            { fields: ['status'] },
            { fields: ['scheduled_at'] },
            { fields: ['priority'] },
            { fields: ['correlation_id'] },
            { fields: ['status', 'scheduled_at', 'priority'] },
        ],
    });
    return MessageQueue;
};
exports.initMessageQueueModel = initMessageQueueModel;
// ============================================================================
// SERVICE DISCOVERY
// ============================================================================
/**
 * 4. Register a service in the service registry
 *
 * @param {ServiceRegistryEntry} serviceInfo - Service registration details
 * @returns {Promise<ServiceRegistry>} Registered service record
 *
 * @example
 * ```typescript
 * const service = await registerService({
 *   serviceId: 'patient-service-01',
 *   serviceName: 'patient-service',
 *   version: '1.0.0',
 *   host: 'localhost',
 *   port: 3001,
 *   protocol: 'grpc',
 *   healthCheckUrl: 'http://localhost:3001/health',
 *   tags: ['healthcare', 'patient-data']
 * });
 * ```
 */
const registerService = async (serviceInfo) => {
    return await ServiceRegistry.create({
        serviceId: serviceInfo.serviceId,
        serviceName: serviceInfo.serviceName,
        version: serviceInfo.version,
        host: serviceInfo.host,
        port: serviceInfo.port,
        protocol: serviceInfo.protocol,
        status: serviceInfo.status || 'starting',
        metadata: serviceInfo.metadata || {},
        healthCheckUrl: serviceInfo.healthCheckUrl,
        lastHeartbeat: new Date(),
        tags: serviceInfo.tags || [],
    });
};
exports.registerService = registerService;
/**
 * 5. Discover services by name with optional version filtering
 *
 * @param {string} serviceName - Name of the service to discover
 * @param {string} [version] - Optional version filter
 * @returns {Promise<ServiceRegistry[]>} Array of matching service instances
 *
 * @example
 * ```typescript
 * const instances = await discoverService('patient-service', '1.0.0');
 * const endpoint = instances[0];
 * console.log(`Connect to ${endpoint.host}:${endpoint.port}`);
 * ```
 */
const discoverService = async (serviceName, version) => {
    const where = {
        serviceName,
        status: 'healthy',
    };
    if (version) {
        where.version = version;
    }
    return await ServiceRegistry.findAll({
        where,
        order: [['lastHeartbeat', 'DESC']],
    });
};
exports.discoverService = discoverService;
/**
 * 6. Update service heartbeat to maintain liveness
 *
 * @param {string} serviceId - Unique service identifier
 * @param {string} [status] - Optional status update
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * setInterval(async () => {
 *   await updateServiceHeartbeat('patient-service-01', 'healthy');
 * }, 30000); // Every 30 seconds
 * ```
 */
const updateServiceHeartbeat = async (serviceId, status) => {
    const updateData = {
        lastHeartbeat: new Date(),
    };
    if (status) {
        updateData.status = status;
    }
    const [affectedRows] = await ServiceRegistry.update(updateData, {
        where: { serviceId },
    });
    return affectedRows > 0;
};
exports.updateServiceHeartbeat = updateServiceHeartbeat;
/**
 * 7. Deregister a service from the registry
 *
 * @param {string} serviceId - Service ID to deregister
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * process.on('SIGTERM', async () => {
 *   await deregisterService('patient-service-01');
 *   process.exit(0);
 * });
 * ```
 */
const deregisterService = async (serviceId) => {
    const deleted = await ServiceRegistry.destroy({
        where: { serviceId },
    });
    return deleted > 0;
};
exports.deregisterService = deregisterService;
/**
 * 8. Find services by tags for service grouping and discovery
 *
 * @param {string[]} tags - Array of tags to match
 * @param {boolean} [matchAll] - Require all tags to match (default: false)
 * @returns {Promise<ServiceRegistry[]>} Matching services
 *
 * @example
 * ```typescript
 * const healthcareServices = await findServicesByTags(['healthcare', 'hipaa-compliant']);
 * ```
 */
const findServicesByTags = async (tags, matchAll = false) => {
    const { Op } = require('sequelize');
    const where = {
        status: 'healthy',
    };
    if (matchAll) {
        where.tags = { [Op.contains]: tags };
    }
    else {
        where.tags = { [Op.overlap]: tags };
    }
    return await ServiceRegistry.findAll({ where });
};
exports.findServicesByTags = findServicesByTags;
// ============================================================================
// GRPC CLIENT AND SERVER UTILITIES
// ============================================================================
/**
 * 9. Create a gRPC client connection with retry logic
 *
 * @param {GrpcServiceConfig} config - gRPC service configuration
 * @returns {any} gRPC client instance
 *
 * @example
 * ```typescript
 * const client = createGrpcClient({
 *   packageName: 'healthcare',
 *   serviceName: 'PatientService',
 *   protoPath: './protos/patient.proto',
 *   host: 'localhost',
 *   port: 5000,
 *   options: { keepalive: true }
 * });
 * ```
 */
const createGrpcClient = (config) => {
    const grpc = require('@grpc/grpc-js');
    const protoLoader = require('@grpc/proto-loader');
    const packageDefinition = protoLoader.loadSync(config.protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const ServiceConstructor = proto[config.packageName][config.serviceName];
    const credentials = grpc.credentials.createInsecure();
    const client = new ServiceConstructor(`${config.host}:${config.port}`, credentials, config.options);
    return client;
};
exports.createGrpcClient = createGrpcClient;
/**
 * 10. Create gRPC server with service implementation
 *
 * @param {number} port - Port to bind the gRPC server
 * @param {any} serviceImplementation - Service method implementations
 * @returns {any} gRPC server instance
 *
 * @example
 * ```typescript
 * const server = createGrpcServer(5000, {
 *   getPatient: async (call, callback) => {
 *     const patient = await findPatient(call.request.patientId);
 *     callback(null, patient);
 *   }
 * });
 * ```
 */
const createGrpcServer = (port, serviceImplementation) => {
    const grpc = require('@grpc/grpc-js');
    const server = new grpc.Server();
    server.addService(serviceImplementation.service, serviceImplementation);
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
        if (err) {
            throw err;
        }
        console.log(`gRPC server running on port ${boundPort}`);
        server.start();
    });
    return server;
};
exports.createGrpcServer = createGrpcServer;
/**
 * 11. Create gRPC metadata for authentication and tracing
 *
 * @param {Record<string, string>} headers - Metadata key-value pairs
 * @returns {any} gRPC Metadata object
 *
 * @example
 * ```typescript
 * const metadata = createGrpcMetadata({
 *   'authorization': 'Bearer token123',
 *   'x-trace-id': 'trace-abc-123',
 *   'x-tenant-id': 'tenant-001'
 * });
 * ```
 */
const createGrpcMetadata = (headers) => {
    const grpc = require('@grpc/grpc-js');
    const metadata = new grpc.Metadata();
    Object.entries(headers).forEach(([key, value]) => {
        metadata.add(key, value);
    });
    return metadata;
};
exports.createGrpcMetadata = createGrpcMetadata;
/**
 * 12. Create gRPC streaming client for bi-directional communication
 *
 * @param {any} client - gRPC client instance
 * @param {string} method - Streaming method name
 * @param {Function} onData - Callback for received data
 * @returns {any} Stream instance
 *
 * @example
 * ```typescript
 * const stream = createGrpcStream(client, 'streamVitals', (data) => {
 *   console.log('Received vital signs:', data);
 * });
 * stream.write({ patientId: 'P001', heartRate: 72 });
 * ```
 */
const createGrpcStream = (client, method, onData) => {
    const stream = client[method]();
    stream.on('data', onData);
    stream.on('error', (error) => {
        console.error('gRPC stream error:', error);
    });
    stream.on('end', () => {
        console.log('gRPC stream ended');
    });
    return stream;
};
exports.createGrpcStream = createGrpcStream;
// ============================================================================
// MESSAGE BROKER INTEGRATION (RABBITMQ, KAFKA)
// ============================================================================
/**
 * 13. Create RabbitMQ connection and channel
 *
 * @param {string} connectionString - RabbitMQ connection URL
 * @returns {Promise<{connection: any, channel: any}>} Connection and channel
 *
 * @example
 * ```typescript
 * const { connection, channel } = await createRabbitMQConnection(
 *   'amqp://user:pass@localhost:5672'
 * );
 * ```
 */
const createRabbitMQConnection = async (connectionString) => {
    const amqp = require('amqplib');
    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();
    connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
    });
    return { connection, channel };
};
exports.createRabbitMQConnection = createRabbitMQConnection;
/**
 * 14. Publish message to RabbitMQ exchange
 *
 * @param {any} channel - RabbitMQ channel
 * @param {string} exchange - Exchange name
 * @param {string} routingKey - Routing key
 * @param {any} message - Message payload
 * @param {Record<string, any>} [options] - Message options
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * await publishToRabbitMQ(channel, 'healthcare.events', 'patient.created', {
 *   patientId: 'P001',
 *   name: 'John Doe'
 * }, { persistent: true, correlationId: 'corr-123' });
 * ```
 */
const publishToRabbitMQ = async (channel, exchange, routingKey, message, options) => {
    await channel.assertExchange(exchange, 'topic', { durable: true });
    const messageBuffer = Buffer.from(JSON.stringify(message));
    const publishOptions = {
        persistent: true,
        timestamp: Date.now(),
        ...options,
    };
    return channel.publish(exchange, routingKey, messageBuffer, publishOptions);
};
exports.publishToRabbitMQ = publishToRabbitMQ;
/**
 * 15. Subscribe to RabbitMQ queue with message handler
 *
 * @param {any} channel - RabbitMQ channel
 * @param {string} queue - Queue name
 * @param {Function} handler - Message handler function
 * @param {Record<string, any>} [options] - Queue options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await subscribeToRabbitMQ(channel, 'patient.queue', async (msg) => {
 *   const data = JSON.parse(msg.content.toString());
 *   console.log('Processing patient event:', data);
 *   channel.ack(msg);
 * }, { durable: true, prefetch: 10 });
 * ```
 */
const subscribeToRabbitMQ = async (channel, queue, handler, options) => {
    await channel.assertQueue(queue, { durable: true, ...options });
    if (options?.prefetch) {
        channel.prefetch(options.prefetch);
    }
    channel.consume(queue, async (msg) => {
        if (msg) {
            try {
                await handler(msg);
            }
            catch (error) {
                console.error('Error processing message:', error);
                channel.nack(msg, false, false); // Send to dead letter queue
            }
        }
    });
};
exports.subscribeToRabbitMQ = subscribeToRabbitMQ;
/**
 * 16. Create Kafka producer client
 *
 * @param {string[]} brokers - Kafka broker addresses
 * @param {Record<string, any>} [options] - Producer options
 * @returns {Promise<any>} Kafka producer instance
 *
 * @example
 * ```typescript
 * const producer = await createKafkaProducer(
 *   ['localhost:9092'],
 *   { clientId: 'patient-service' }
 * );
 * ```
 */
const createKafkaProducer = async (brokers, options) => {
    const { Kafka } = require('kafkajs');
    const kafka = new Kafka({
        clientId: options?.clientId || 'microservice-client',
        brokers,
        ...options,
    });
    const producer = kafka.producer();
    await producer.connect();
    return producer;
};
exports.createKafkaProducer = createKafkaProducer;
/**
 * 17. Publish message to Kafka topic
 *
 * @param {any} producer - Kafka producer instance
 * @param {string} topic - Topic name
 * @param {any} message - Message payload
 * @param {string} [key] - Optional partition key
 * @returns {Promise<any>} Send result
 *
 * @example
 * ```typescript
 * await publishToKafka(producer, 'patient-events', {
 *   eventType: 'PatientCreated',
 *   patientId: 'P001',
 *   data: { name: 'John Doe' }
 * }, 'P001');
 * ```
 */
const publishToKafka = async (producer, topic, message, key) => {
    return await producer.send({
        topic,
        messages: [
            {
                key: key || null,
                value: JSON.stringify(message),
                timestamp: Date.now().toString(),
            },
        ],
    });
};
exports.publishToKafka = publishToKafka;
/**
 * 18. Create Kafka consumer with message handler
 *
 * @param {string[]} brokers - Kafka broker addresses
 * @param {string} groupId - Consumer group ID
 * @param {string[]} topics - Topics to subscribe to
 * @param {Function} handler - Message handler function
 * @returns {Promise<any>} Kafka consumer instance
 *
 * @example
 * ```typescript
 * const consumer = await createKafkaConsumer(
 *   ['localhost:9092'],
 *   'patient-service-group',
 *   ['patient-events'],
 *   async ({ topic, partition, message }) => {
 *     const data = JSON.parse(message.value.toString());
 *     console.log('Received event:', data);
 *   }
 * );
 * ```
 */
const createKafkaConsumer = async (brokers, groupId, topics, handler) => {
    const { Kafka } = require('kafkajs');
    const kafka = new Kafka({
        clientId: `${groupId}-client`,
        brokers,
    });
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning: false });
    await consumer.run({
        eachMessage: async (payload) => {
            await handler(payload);
        },
    });
    return consumer;
};
exports.createKafkaConsumer = createKafkaConsumer;
// ============================================================================
// EVENT-DRIVEN COMMUNICATION PATTERNS
// ============================================================================
/**
 * 19. Publish domain event to event store
 *
 * @param {EventMessage} event - Event to publish
 * @returns {Promise<ServiceEvent>} Created event record
 *
 * @example
 * ```typescript
 * await publishDomainEvent({
 *   eventId: uuidv4(),
 *   eventType: 'PatientAdmitted',
 *   source: 'patient-service',
 *   aggregateId: 'P001',
 *   version: 1,
 *   data: { patientId: 'P001', admissionDate: new Date() },
 *   metadata: { userId: 'U001' },
 *   timestamp: new Date()
 * });
 * ```
 */
const publishDomainEvent = async (event) => {
    return await ServiceEvent.create({
        eventId: event.eventId,
        eventType: event.eventType,
        source: event.source,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateId.split('-')[0], // Extract type from ID
        version: event.version,
        data: event.data,
        metadata: event.metadata || {},
        correlationId: event.metadata?.correlationId,
        causationId: event.metadata?.causationId,
    });
};
exports.publishDomainEvent = publishDomainEvent;
/**
 * 20. Subscribe to domain events by type
 *
 * @param {string[]} eventTypes - Event types to subscribe to
 * @param {Function} handler - Event handler function
 * @param {number} [pollInterval] - Polling interval in ms (default: 1000)
 * @returns {Function} Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToEvents(
 *   ['PatientAdmitted', 'PatientDischarged'],
 *   async (event) => {
 *     console.log('Processing event:', event.eventType);
 *   }
 * );
 * ```
 */
const subscribeToEvents = (eventTypes, handler, pollInterval = 1000) => {
    let lastProcessedId = null;
    let isRunning = true;
    const poll = async () => {
        while (isRunning) {
            try {
                const where = {
                    eventType: eventTypes,
                };
                if (lastProcessedId) {
                    where.id = { [require('sequelize').Op.gt]: lastProcessedId };
                }
                const events = await ServiceEvent.findAll({
                    where,
                    order: [['createdAt', 'ASC']],
                    limit: 100,
                });
                for (const event of events) {
                    await handler(event);
                    lastProcessedId = event.id;
                }
                await new Promise((resolve) => setTimeout(resolve, pollInterval));
            }
            catch (error) {
                console.error('Error polling events:', error);
            }
        }
    };
    poll();
    return () => {
        isRunning = false;
    };
};
exports.subscribeToEvents = subscribeToEvents;
/**
 * 21. Get event stream for an aggregate
 *
 * @param {string} aggregateId - Aggregate ID
 * @param {number} [fromVersion] - Start from version (default: 1)
 * @returns {Promise<ServiceEvent[]>} Event stream
 *
 * @example
 * ```typescript
 * const events = await getEventStream('P001', 1);
 * const patient = rebuildPatientFromEvents(events);
 * ```
 */
const getEventStream = async (aggregateId, fromVersion = 1) => {
    return await ServiceEvent.findAll({
        where: {
            aggregateId,
            version: {
                [require('sequelize').Op.gte]: fromVersion,
            },
        },
        order: [['version', 'ASC']],
    });
};
exports.getEventStream = getEventStream;
/**
 * 22. Replay events for event sourcing
 *
 * @param {string} aggregateId - Aggregate ID to replay
 * @param {Function} applyEvent - Function to apply each event
 * @returns {Promise<any>} Rebuilt aggregate state
 *
 * @example
 * ```typescript
 * const patientState = await replayEvents('P001', (state, event) => {
 *   switch(event.eventType) {
 *     case 'PatientCreated': return { ...state, ...event.data };
 *     case 'PatientUpdated': return { ...state, ...event.data };
 *     default: return state;
 *   }
 * });
 * ```
 */
const replayEvents = async (aggregateId, applyEvent) => {
    const events = await (0, exports.getEventStream)(aggregateId);
    let state = {};
    for (const event of events) {
        state = applyEvent(state, event);
    }
    return state;
};
exports.replayEvents = replayEvents;
// ============================================================================
// SAGA PATTERN IMPLEMENTATION
// ============================================================================
/**
 * 23. Create and execute a distributed saga
 *
 * @param {SagaStep[]} steps - Array of saga steps
 * @param {any} initialData - Initial saga data
 * @returns {Promise<SagaContext>} Saga execution result
 *
 * @example
 * ```typescript
 * const saga = await executeSaga([
 *   { stepId: '1', stepName: 'reserve-slot', serviceName: 'appointment-service',
 *     action: 'reserve', execute: reserveSlot, compensate: releaseSlot },
 *   { stepId: '2', stepName: 'charge-payment', serviceName: 'billing-service',
 *     action: 'charge', execute: chargePayment, compensate: refundPayment }
 * ], { appointmentId: 'A001', amount: 100 });
 * ```
 */
const executeSaga = async (steps, initialData) => {
    const sagaId = `saga-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const context = {
        sagaId,
        sagaType: 'distributed-saga',
        currentStep: 0,
        status: 'running',
        data: initialData,
        executedSteps: [],
        compensatedSteps: [],
        startTime: new Date(),
    };
    try {
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            context.currentStep = i;
            try {
                const result = await executeStepWithTimeout(step, context.data);
                context.executedSteps.push({
                    stepId: step.stepId,
                    result,
                    timestamp: new Date(),
                });
                context.data = { ...context.data, ...result };
            }
            catch (error) {
                context.error = error;
                context.status = 'compensating';
                await (0, exports.compensateSaga)(context, steps);
                throw error;
            }
        }
        context.status = 'completed';
        context.endTime = new Date();
        return context;
    }
    catch (error) {
        context.status = 'failed';
        context.endTime = new Date();
        throw error;
    }
};
exports.executeSaga = executeSaga;
/**
 * 24. Compensate saga by rolling back executed steps
 *
 * @param {SagaContext} context - Saga execution context
 * @param {SagaStep[]} steps - Original saga steps
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Automatically called by executeSaga on failure
 * await compensateSaga(sagaContext, sagaSteps);
 * ```
 */
const compensateSaga = async (context, steps) => {
    const executedStepIds = context.executedSteps.map((s) => s.stepId);
    for (let i = executedStepIds.length - 1; i >= 0; i--) {
        const stepId = executedStepIds[i];
        const step = steps.find((s) => s.stepId === stepId);
        if (step && step.compensate) {
            try {
                await step.compensate(context.data);
                context.compensatedSteps.push(stepId);
            }
            catch (error) {
                console.error(`Failed to compensate step ${stepId}:`, error);
            }
        }
    }
    context.status = 'compensated';
};
exports.compensateSaga = compensateSaga;
/**
 * 25. Execute saga step with timeout
 *
 * @param {SagaStep} step - Saga step to execute
 * @param {any} data - Step input data
 * @returns {Promise<any>} Step execution result
 */
const executeStepWithTimeout = async (step, data) => {
    const timeout = step.timeout || 30000; // Default 30 seconds
    return Promise.race([
        step.execute(data),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`Step ${step.stepId} timeout`)), timeout)),
    ]);
};
/**
 * 26. Create saga step builder for fluent API
 *
 * @param {string} stepId - Step identifier
 * @param {string} stepName - Step name
 * @returns {Object} Saga step builder
 *
 * @example
 * ```typescript
 * const step = createSagaStep('1', 'reserve-slot')
 *   .withService('appointment-service')
 *   .withAction('reserve')
 *   .withExecute(async (data) => ({ slotId: 'S001' }))
 *   .withCompensate(async (data) => { await releaseSlot(data.slotId); })
 *   .withTimeout(5000)
 *   .build();
 * ```
 */
const createSagaStep = (stepId, stepName) => {
    const step = { stepId, stepName };
    return {
        withService(serviceName) {
            step.serviceName = serviceName;
            return this;
        },
        withAction(action) {
            step.action = action;
            return this;
        },
        withExecute(execute) {
            step.execute = execute;
            return this;
        },
        withCompensate(compensate) {
            step.compensate = compensate;
            return this;
        },
        withTimeout(timeout) {
            step.timeout = timeout;
            return this;
        },
        withRetryPolicy(policy) {
            step.retryPolicy = policy;
            return this;
        },
        build() {
            if (!step.execute || !step.compensate) {
                throw new Error('Execute and compensate functions are required');
            }
            return step;
        },
    };
};
exports.createSagaStep = createSagaStep;
// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================
const circuitBreakers = new Map();
/**
 * 27. Execute operation with circuit breaker protection
 *
 * @param {string} name - Circuit breaker name
 * @param {Function} operation - Operation to execute
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithCircuitBreaker(
 *   'patient-service',
 *   async () => await patientService.getPatient('P001'),
 *   { failureThreshold: 5, successThreshold: 2, timeout: 5000, resetTimeout: 60000 }
 * );
 * ```
 */
const executeWithCircuitBreaker = async (name, operation, config) => {
    let state = circuitBreakers.get(name);
    if (!state) {
        state = {
            state: 'CLOSED',
            failures: 0,
            successes: 0,
            consecutiveSuccesses: 0,
        };
        circuitBreakers.set(name, state);
    }
    // Check if circuit is open
    if (state.state === 'OPEN') {
        if (state.nextAttemptTime && Date.now() >= state.nextAttemptTime.getTime()) {
            state.state = 'HALF_OPEN';
            state.halfOpenAttempts = 0;
        }
        else {
            throw new Error(`Circuit breaker ${name} is OPEN`);
        }
    }
    // Check half-open requests limit
    if (state.state === 'HALF_OPEN') {
        if (state.halfOpenAttempts &&
            state.halfOpenAttempts >= (config.halfOpenRequests || 3)) {
            throw new Error(`Circuit breaker ${name} half-open request limit exceeded`);
        }
        state.halfOpenAttempts = (state.halfOpenAttempts || 0) + 1;
    }
    try {
        const result = await Promise.race([
            operation(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Circuit breaker timeout')), config.timeout)),
        ]);
        handleCircuitSuccess(state, config);
        return result;
    }
    catch (error) {
        handleCircuitFailure(state, config);
        throw error;
    }
};
exports.executeWithCircuitBreaker = executeWithCircuitBreaker;
/**
 * 28. Handle successful circuit breaker execution
 */
const handleCircuitSuccess = (state, config) => {
    state.failures = 0;
    state.consecutiveSuccesses++;
    if (state.state === 'HALF_OPEN') {
        if (state.consecutiveSuccesses >= config.successThreshold) {
            state.state = 'CLOSED';
            state.consecutiveSuccesses = 0;
            state.halfOpenAttempts = 0;
        }
    }
};
/**
 * 29. Handle failed circuit breaker execution
 */
const handleCircuitFailure = (state, config) => {
    state.failures++;
    state.consecutiveSuccesses = 0;
    state.lastFailureTime = new Date();
    if (state.failures >= config.failureThreshold) {
        state.state = 'OPEN';
        state.nextAttemptTime = new Date(Date.now() + config.resetTimeout);
    }
};
/**
 * 30. Get circuit breaker state
 *
 * @param {string} name - Circuit breaker name
 * @returns {CircuitBreakerState | undefined} Current state
 *
 * @example
 * ```typescript
 * const state = getCircuitBreakerState('patient-service');
 * console.log(`Circuit state: ${state?.state}, Failures: ${state?.failures}`);
 * ```
 */
const getCircuitBreakerState = (name) => {
    return circuitBreakers.get(name);
};
exports.getCircuitBreakerState = getCircuitBreakerState;
/**
 * 31. Reset circuit breaker to closed state
 *
 * @param {string} name - Circuit breaker name
 *
 * @example
 * ```typescript
 * resetCircuitBreaker('patient-service');
 * ```
 */
const resetCircuitBreaker = (name) => {
    circuitBreakers.set(name, {
        state: 'CLOSED',
        failures: 0,
        successes: 0,
        consecutiveSuccesses: 0,
    });
};
exports.resetCircuitBreaker = resetCircuitBreaker;
// ============================================================================
// RETRY AND TIMEOUT POLICIES
// ============================================================================
/**
 * 32. Execute operation with retry policy
 *
 * @param {Function} operation - Operation to execute
 * @param {RetryPolicy} policy - Retry configuration
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   async () => await externalService.call(),
 *   { maxRetries: 3, initialDelay: 1000, maxDelay: 10000, backoffMultiplier: 2 }
 * );
 * ```
 */
const executeWithRetry = async (operation, policy) => {
    let lastError;
    let delay = policy.initialDelay;
    for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Check if error is retryable
            if (policy.retryableErrors && policy.retryableErrors.length > 0) {
                const isRetryable = policy.retryableErrors.some((pattern) => lastError.message.includes(pattern));
                if (!isRetryable) {
                    throw error;
                }
            }
            if (attempt < policy.maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay = Math.min(delay * policy.backoffMultiplier, policy.maxDelay);
            }
        }
    }
    throw lastError;
};
exports.executeWithRetry = executeWithRetry;
/**
 * 33. Execute operation with timeout
 *
 * @param {Function} operation - Operation to execute
 * @param {TimeoutPolicy} policy - Timeout configuration
 * @returns {Promise<any>} Operation result or fallback
 *
 * @example
 * ```typescript
 * const result = await executeWithTimeout(
 *   async () => await slowService.getData(),
 *   { timeout: 5000, fallback: async () => ({ cached: true, data: [] }) }
 * );
 * ```
 */
const executeWithTimeout = async (operation, policy) => {
    try {
        return await Promise.race([
            operation(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), policy.timeout)),
        ]);
    }
    catch (error) {
        if (policy.fallback && error.message === 'Operation timeout') {
            return await policy.fallback();
        }
        throw error;
    }
};
exports.executeWithTimeout = executeWithTimeout;
/**
 * 34. Combine retry and timeout policies
 *
 * @param {Function} operation - Operation to execute
 * @param {RetryPolicy} retryPolicy - Retry configuration
 * @param {TimeoutPolicy} timeoutPolicy - Timeout configuration
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetryAndTimeout(
 *   async () => await unreliableService.call(),
 *   { maxRetries: 3, initialDelay: 1000, maxDelay: 5000, backoffMultiplier: 2 },
 *   { timeout: 10000 }
 * );
 * ```
 */
const executeWithRetryAndTimeout = async (operation, retryPolicy, timeoutPolicy) => {
    return (0, exports.executeWithRetry)(() => (0, exports.executeWithTimeout)(operation, timeoutPolicy), retryPolicy);
};
exports.executeWithRetryAndTimeout = executeWithRetryAndTimeout;
// ============================================================================
// SERVICE HEALTH CHECKS
// ============================================================================
/**
 * 35. Perform health check on a service
 *
 * @param {string} serviceId - Service ID to check
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const health = await performHealthCheck('patient-service-01');
 * if (health.status === 'healthy') {
 *   console.log('Service is healthy');
 * }
 * ```
 */
const performHealthCheck = async (serviceId) => {
    const service = await ServiceRegistry.findOne({ where: { serviceId } });
    if (!service) {
        throw new Error(`Service ${serviceId} not found`);
    }
    const startTime = Date.now();
    let status = 'healthy';
    const checks = [];
    try {
        if (service.healthCheckUrl) {
            const response = await fetch(service.healthCheckUrl, {
                signal: AbortSignal.timeout(5000),
            });
            if (response.ok) {
                checks.push({ name: 'endpoint', status: 'pass' });
            }
            else {
                checks.push({
                    name: 'endpoint',
                    status: 'fail',
                    message: `HTTP ${response.status}`,
                });
                status = 'unhealthy';
            }
        }
        // Check heartbeat freshness
        const heartbeatAge = service.lastHeartbeat
            ? Date.now() - service.lastHeartbeat.getTime()
            : Infinity;
        if (heartbeatAge < 60000) {
            // Less than 1 minute
            checks.push({ name: 'heartbeat', status: 'pass' });
        }
        else if (heartbeatAge < 180000) {
            // Less than 3 minutes
            checks.push({
                name: 'heartbeat',
                status: 'warn',
                message: 'Heartbeat stale',
            });
            status = status === 'healthy' ? 'degraded' : status;
        }
        else {
            checks.push({ name: 'heartbeat', status: 'fail', message: 'No recent heartbeat' });
            status = 'unhealthy';
        }
        const responseTime = Date.now() - startTime;
        return {
            serviceName: service.serviceName,
            serviceId: service.serviceId,
            status,
            timestamp: new Date(),
            responseTime,
            checks,
        };
    }
    catch (error) {
        return {
            serviceName: service.serviceName,
            serviceId: service.serviceId,
            status: 'unhealthy',
            timestamp: new Date(),
            responseTime: Date.now() - startTime,
            checks: [
                {
                    name: 'health-check',
                    status: 'fail',
                    message: error.message,
                },
            ],
        };
    }
};
exports.performHealthCheck = performHealthCheck;
/**
 * 36. Continuous health monitoring for services
 *
 * @param {string[]} serviceIds - Service IDs to monitor
 * @param {number} interval - Check interval in milliseconds
 * @param {Function} callback - Callback for health status changes
 * @returns {Function} Stop monitoring function
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorServiceHealth(
 *   ['patient-service-01', 'appointment-service-01'],
 *   30000,
 *   async (result) => {
 *     if (result.status === 'unhealthy') {
 *       await alertOps(result);
 *     }
 *   }
 * );
 * ```
 */
const monitorServiceHealth = (serviceIds, interval, callback) => {
    let isRunning = true;
    const monitor = async () => {
        while (isRunning) {
            for (const serviceId of serviceIds) {
                try {
                    const result = await (0, exports.performHealthCheck)(serviceId);
                    await callback(result);
                    // Update service status in registry
                    await ServiceRegistry.update({ status: result.status }, { where: { serviceId } });
                }
                catch (error) {
                    console.error(`Health check failed for ${serviceId}:`, error);
                }
            }
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    };
    monitor();
    return () => {
        isRunning = false;
    };
};
exports.monitorServiceHealth = monitorServiceHealth;
// ============================================================================
// REQUEST/RESPONSE CORRELATION
// ============================================================================
/**
 * 37. Generate correlation context for request tracking
 *
 * @param {Partial<CorrelationContext>} [context] - Optional context overrides
 * @returns {CorrelationContext} Complete correlation context
 *
 * @example
 * ```typescript
 * const context = generateCorrelationContext({
 *   userId: 'U001',
 *   tenantId: 'T001'
 * });
 * // Use context.correlationId in all downstream calls
 * ```
 */
const generateCorrelationContext = (context) => {
    return {
        correlationId: context?.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        causationId: context?.causationId,
        conversationId: context?.conversationId,
        userId: context?.userId,
        tenantId: context?.tenantId,
        traceId: context?.traceId || `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        spanId: context?.spanId || `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
    };
};
exports.generateCorrelationContext = generateCorrelationContext;
/**
 * 38. Extract correlation context from request headers
 *
 * @param {Record<string, string>} headers - Request headers
 * @returns {CorrelationContext} Extracted correlation context
 *
 * @example
 * ```typescript
 * const context = extractCorrelationContext(request.headers);
 * // Use in service calls to maintain correlation chain
 * ```
 */
const extractCorrelationContext = (headers) => {
    return {
        correlationId: headers['x-correlation-id'] || `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        causationId: headers['x-causation-id'],
        conversationId: headers['x-conversation-id'],
        userId: headers['x-user-id'],
        tenantId: headers['x-tenant-id'],
        traceId: headers['x-trace-id'] || `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        spanId: headers['x-span-id'] || `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
    };
};
exports.extractCorrelationContext = extractCorrelationContext;
/**
 * 39. Inject correlation context into outgoing request headers
 *
 * @param {CorrelationContext} context - Correlation context
 * @returns {Record<string, string>} Headers with correlation data
 *
 * @example
 * ```typescript
 * const headers = injectCorrelationContext(context);
 * await axios.get(url, { headers });
 * ```
 */
const injectCorrelationContext = (context) => {
    const headers = {
        'x-correlation-id': context.correlationId,
        'x-trace-id': context.traceId,
        'x-span-id': context.spanId,
    };
    if (context.causationId)
        headers['x-causation-id'] = context.causationId;
    if (context.conversationId)
        headers['x-conversation-id'] = context.conversationId;
    if (context.userId)
        headers['x-user-id'] = context.userId;
    if (context.tenantId)
        headers['x-tenant-id'] = context.tenantId;
    return headers;
};
exports.injectCorrelationContext = injectCorrelationContext;
// ============================================================================
// DISTRIBUTED TRACING
// ============================================================================
/**
 * 40. Create a trace span for distributed tracing
 *
 * @param {string} serviceName - Name of the service
 * @param {string} operationName - Operation being traced
 * @param {Partial<TraceSpan>} [spanData] - Optional span data
 * @returns {TraceSpan} Created trace span
 *
 * @example
 * ```typescript
 * const span = createTraceSpan('patient-service', 'getPatient', {
 *   traceId: context.traceId,
 *   parentSpanId: context.spanId
 * });
 * try {
 *   const result = await getPatient(id);
 *   finishTraceSpan(span, 'ok');
 * } catch (error) {
 *   finishTraceSpan(span, 'error', { error: error.message });
 * }
 * ```
 */
const createTraceSpan = (serviceName, operationName, spanData) => {
    return {
        traceId: spanData?.traceId || `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        spanId: spanData?.spanId || `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        parentSpanId: spanData?.parentSpanId,
        serviceName,
        operationName,
        startTime: new Date(),
        tags: spanData?.tags || {},
        logs: spanData?.logs || [],
    };
};
exports.createTraceSpan = createTraceSpan;
/**
 * 41. Finish a trace span with status and metadata
 *
 * @param {TraceSpan} span - Trace span to finish
 * @param {string} status - Span status ('ok' or 'error')
 * @param {Record<string, any>} [tags] - Additional tags
 *
 * @example
 * ```typescript
 * finishTraceSpan(span, 'ok', { resultCount: 5, cached: false });
 * ```
 */
const finishTraceSpan = (span, status, tags) => {
    span.endTime = new Date();
    span.duration = span.endTime.getTime() - span.startTime.getTime();
    span.status = status;
    if (tags) {
        span.tags = { ...span.tags, ...tags };
    }
    // In production, send to tracing backend (Jaeger, Zipkin, etc.)
    console.log('Trace span completed:', {
        traceId: span.traceId,
        spanId: span.spanId,
        operation: span.operationName,
        duration: span.duration,
        status: span.status,
    });
};
exports.finishTraceSpan = finishTraceSpan;
/**
 * 42. Add log entry to trace span
 *
 * @param {TraceSpan} span - Trace span
 * @param {string} message - Log message
 * @param {Record<string, any>} [fields] - Additional fields
 *
 * @example
 * ```typescript
 * addTraceLog(span, 'Database query executed', { query: 'SELECT * FROM patients', rowCount: 10 });
 * ```
 */
const addTraceLog = (span, message, fields) => {
    span.logs = span.logs || [];
    span.logs.push({
        timestamp: new Date(),
        message,
        fields: fields || {},
    });
};
exports.addTraceLog = addTraceLog;
// ============================================================================
// SERVICE VERSIONING
// ============================================================================
/**
 * 43. Check service version compatibility
 *
 * @param {ServiceVersion} serviceVersion - Service version info
 * @param {string} requestedVersion - Requested API version
 * @returns {boolean} Whether versions are compatible
 *
 * @example
 * ```typescript
 * const isCompatible = checkVersionCompatibility(
 *   { serviceName: 'patient-service', version: '2.0.0', apiVersion: 'v2',
 *     compatibleVersions: ['v1', 'v2'], deprecatedVersions: ['v0'] },
 *   'v1'
 * );
 * ```
 */
const checkVersionCompatibility = (serviceVersion, requestedVersion) => {
    if (serviceVersion.deprecatedVersions.includes(requestedVersion)) {
        console.warn(`API version ${requestedVersion} is deprecated`);
    }
    return serviceVersion.compatibleVersions.includes(requestedVersion);
};
exports.checkVersionCompatibility = checkVersionCompatibility;
// ============================================================================
// INTER-SERVICE AUTHENTICATION
// ============================================================================
/**
 * 44. Generate inter-service authentication token
 *
 * @param {string} serviceId - Service identifier
 * @param {string[]} scopes - Token scopes
 * @param {number} [expiresIn] - Expiration time in seconds (default: 3600)
 * @returns {ServiceAuthToken} Generated auth token
 *
 * @example
 * ```typescript
 * const token = generateServiceToken('patient-service', ['read:patients', 'write:appointments']);
 * // Use token.token in Authorization header
 * ```
 */
const generateServiceToken = (serviceId, scopes, expiresIn = 3600) => {
    const jwt = require('jsonwebtoken');
    const secret = process.env.SERVICE_AUTH_SECRET || 'service-secret-key';
    const payload = {
        sub: serviceId,
        scopes,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
    return {
        serviceId,
        token,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        scopes,
        algorithm: 'HS256',
    };
};
exports.generateServiceToken = generateServiceToken;
/**
 * 45. Validate inter-service authentication token
 *
 * @param {string} token - JWT token to validate
 * @param {string[]} [requiredScopes] - Required scopes
 * @returns {ServiceAuthToken | null} Decoded token or null if invalid
 *
 * @example
 * ```typescript
 * const authToken = validateServiceToken(
 *   request.headers.authorization?.replace('Bearer ', ''),
 *   ['read:patients']
 * );
 * if (!authToken) throw new UnauthorizedException();
 * ```
 */
const validateServiceToken = (token, requiredScopes) => {
    try {
        const jwt = require('jsonwebtoken');
        const secret = process.env.SERVICE_AUTH_SECRET || 'service-secret-key';
        const decoded = jwt.verify(token, secret);
        const authToken = {
            serviceId: decoded.sub,
            token,
            expiresAt: new Date(decoded.exp * 1000),
            scopes: decoded.scopes,
            algorithm: 'HS256',
        };
        // Check required scopes
        if (requiredScopes && requiredScopes.length > 0) {
            const hasRequiredScopes = requiredScopes.every((scope) => authToken.scopes.includes(scope));
            if (!hasRequiredScopes) {
                return null;
            }
        }
        return authToken;
    }
    catch (error) {
        return null;
    }
};
exports.validateServiceToken = validateServiceToken;
// ============================================================================
// LOAD BALANCING STRATEGIES
// ============================================================================
const loadBalancerState = new Map();
/**
 * 46. Select service instance using load balancing strategy
 *
 * @param {string} serviceName - Service name
 * @param {LoadBalancerStrategy} strategy - Load balancing strategy
 * @returns {Promise<ServiceInstance | null>} Selected service instance
 *
 * @example
 * ```typescript
 * const instance = await selectServiceInstance('patient-service', { type: 'round-robin' });
 * const url = `http://${instance.host}:${instance.port}`;
 * ```
 */
const selectServiceInstance = async (serviceName, strategy) => {
    const services = await (0, exports.discoverService)(serviceName);
    if (services.length === 0) {
        return null;
    }
    const instances = services.map((s, idx) => ({
        id: s.serviceId,
        name: s.serviceName,
        host: s.host,
        port: s.port,
        weight: s.metadata?.weight || 1,
        status: 'active',
        metadata: s.metadata,
    }));
    switch (strategy.type) {
        case 'round-robin':
            return roundRobinSelect(serviceName, instances);
        case 'random':
            return randomSelect(instances);
        case 'least-connections':
            return leastConnectionsSelect(instances);
        case 'weighted':
            return weightedSelect(instances);
        default:
            return instances[0];
    }
};
exports.selectServiceInstance = selectServiceInstance;
/**
 * Round-robin load balancing
 */
const roundRobinSelect = (serviceName, instances) => {
    let state = loadBalancerState.get(serviceName);
    if (!state) {
        state = { instances, currentIndex: 0 };
        loadBalancerState.set(serviceName, state);
    }
    const instance = instances[state.currentIndex];
    state.currentIndex = (state.currentIndex + 1) % instances.length;
    return instance;
};
/**
 * Random load balancing
 */
const randomSelect = (instances) => {
    const randomIndex = Math.floor(Math.random() * instances.length);
    return instances[randomIndex];
};
/**
 * Least connections load balancing
 */
const leastConnectionsSelect = (instances) => {
    return instances.reduce((prev, curr) => (curr.connections || 0) < (prev.connections || 0) ? curr : prev);
};
/**
 * Weighted load balancing
 */
const weightedSelect = (instances) => {
    const totalWeight = instances.reduce((sum, inst) => sum + inst.weight, 0);
    let random = Math.random() * totalWeight;
    for (const instance of instances) {
        random -= instance.weight;
        if (random <= 0) {
            return instance;
        }
    }
    return instances[instances.length - 1];
};
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    initServiceRegistryModel: exports.initServiceRegistryModel,
    initServiceEventModel: exports.initServiceEventModel,
    initMessageQueueModel: exports.initMessageQueueModel,
    // Service Discovery
    registerService: exports.registerService,
    discoverService: exports.discoverService,
    updateServiceHeartbeat: exports.updateServiceHeartbeat,
    deregisterService: exports.deregisterService,
    findServicesByTags: exports.findServicesByTags,
    // gRPC
    createGrpcClient: exports.createGrpcClient,
    createGrpcServer: exports.createGrpcServer,
    createGrpcMetadata: exports.createGrpcMetadata,
    createGrpcStream: exports.createGrpcStream,
    // Message Brokers
    createRabbitMQConnection: exports.createRabbitMQConnection,
    publishToRabbitMQ: exports.publishToRabbitMQ,
    subscribeToRabbitMQ: exports.subscribeToRabbitMQ,
    createKafkaProducer: exports.createKafkaProducer,
    publishToKafka: exports.publishToKafka,
    createKafkaConsumer: exports.createKafkaConsumer,
    // Event-Driven
    publishDomainEvent: exports.publishDomainEvent,
    subscribeToEvents: exports.subscribeToEvents,
    getEventStream: exports.getEventStream,
    replayEvents: exports.replayEvents,
    // Saga
    executeSaga: exports.executeSaga,
    compensateSaga: exports.compensateSaga,
    createSagaStep: exports.createSagaStep,
    // Circuit Breaker
    executeWithCircuitBreaker: exports.executeWithCircuitBreaker,
    getCircuitBreakerState: exports.getCircuitBreakerState,
    resetCircuitBreaker: exports.resetCircuitBreaker,
    // Retry & Timeout
    executeWithRetry: exports.executeWithRetry,
    executeWithTimeout: exports.executeWithTimeout,
    executeWithRetryAndTimeout: exports.executeWithRetryAndTimeout,
    // Health Checks
    performHealthCheck: exports.performHealthCheck,
    monitorServiceHealth: exports.monitorServiceHealth,
    // Correlation
    generateCorrelationContext: exports.generateCorrelationContext,
    extractCorrelationContext: exports.extractCorrelationContext,
    injectCorrelationContext: exports.injectCorrelationContext,
    // Tracing
    createTraceSpan: exports.createTraceSpan,
    finishTraceSpan: exports.finishTraceSpan,
    addTraceLog: exports.addTraceLog,
    // Versioning
    checkVersionCompatibility: exports.checkVersionCompatibility,
    // Auth
    generateServiceToken: exports.generateServiceToken,
    validateServiceToken: exports.validateServiceToken,
    // Load Balancing
    selectServiceInstance: exports.selectServiceInstance,
};
//# sourceMappingURL=microservices-comm-kit.js.map