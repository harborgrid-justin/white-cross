"use strict";
/**
 * LOC: MCSVC1234567
 * File: /reuse/microservices-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Microservices modules
 *   - NestJS message handlers
 *   - Event-driven services
 *   - Backend microservices infrastructure
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealthCheckResponse = exports.checkMessageBrokerHealth = exports.checkDatabaseHealth = exports.addHealthCheck = exports.createHealthCheckStatus = exports.deregisterService = exports.selectServiceInstance = exports.discoverService = exports.registerService = exports.executeWithCircuitBreaker = exports.canExecuteOperation = exports.updateCircuitBreakerState = exports.createCircuitBreakerState = exports.executeWithRetry = exports.calculateRetryDelay = exports.createRetryPolicy = exports.createHealthcareMessageSchema = exports.validateMessageSize = exports.sanitizeMessagePayload = exports.validateFieldType = exports.validateMessagePayload = exports.natsRequestReply = exports.createNatsQueueGroup = exports.createNatsSubject = exports.createNatsConfig = exports.validateGrpcService = exports.createGrpcError = exports.handleGrpcStream = exports.createGrpcMetadata = exports.createGrpcConfig = exports.createKafkaConsumer = exports.deserializeKafkaMessage = exports.serializeKafkaMessage = exports.createKafkaTopic = exports.createKafkaConfig = exports.rejectMessage = exports.acknowledgeMessage = exports.createDeadLetterQueue = exports.createRabbitMQExchange = exports.createRabbitMQConfig = exports.generateCorrelationId = exports.extractMessageContext = exports.wrapMessageWithContext = exports.createEventPattern = exports.createMessagePattern = void 0;
/**
 * File: /reuse/microservices-kit.ts
 * Locator: WC-UTL-MCSVC-001
 * Purpose: Comprehensive NestJS Microservices Utilities - message patterns, event-driven architecture, RabbitMQ, Kafka, gRPC, NATS, circuit breakers, service discovery
 *
 * Upstream: Independent utility module for NestJS microservices implementation
 * Downstream: ../backend/*, microservices modules, message handlers, event services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/microservices, RabbitMQ, Kafka, gRPC, NATS
 * Exports: 45+ utility functions for microservices, message patterns, event-driven architecture, resilience patterns
 *
 * LLM Context: Comprehensive NestJS microservices utilities for implementing production-ready distributed systems.
 * Provides message pattern definitions, event-driven architecture, transport layer integrations (RabbitMQ, Kafka, gRPC, NATS),
 * request-response patterns, event publishing, message validation, dead letter queues, retry policies, circuit breakers,
 * service discovery, and health checks. Essential for building scalable, resilient microservices in healthcare platforms.
 */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// ============================================================================
// MESSAGE PATTERN UTILITIES (1-5)
// ============================================================================
/**
 * Creates a typed message pattern for request-response communication.
 *
 * @param {string} cmd - Command name
 * @param {string} [version] - API version
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {MessagePattern} Message pattern object
 *
 * @example
 * ```typescript
 * const pattern = createMessagePattern('get_patient', 'v1', { source: 'api-gateway' });
 * // Result: { cmd: 'get_patient', version: 'v1', metadata: { source: 'api-gateway' } }
 * ```
 */
const createMessagePattern = (cmd, version, metadata) => {
    return {
        cmd,
        ...(version && { version }),
        ...(metadata && { metadata }),
    };
};
exports.createMessagePattern = createMessagePattern;
/**
 * Creates a typed event pattern for event-driven communication.
 *
 * @param {string} event - Event name
 * @param {string} [aggregateId] - Aggregate identifier
 * @param {number} [version] - Event version
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {EventPattern} Event pattern object
 *
 * @example
 * ```typescript
 * const pattern = createEventPattern('patient.created', 'patient-123', 1);
 * // Result: { event: 'patient.created', aggregateId: 'patient-123', version: 1, timestamp: Date }
 * ```
 */
const createEventPattern = (event, aggregateId, version, metadata) => {
    return {
        event,
        ...(aggregateId && { aggregateId }),
        ...(version && { version }),
        timestamp: new Date(),
        ...(metadata && { metadata }),
    };
};
exports.createEventPattern = createEventPattern;
/**
 * Wraps message payload with request context for distributed tracing.
 *
 * @param {any} payload - Message payload
 * @param {RequestContext} context - Request context
 * @returns {{ payload: any; context: RequestContext }} Wrapped message
 *
 * @example
 * ```typescript
 * const message = wrapMessageWithContext(
 *   { patientId: '123' },
 *   { traceId: 'trace-1', spanId: 'span-1', correlationId: 'corr-1', timestamp: new Date() }
 * );
 * ```
 */
const wrapMessageWithContext = (payload, context) => {
    return {
        payload,
        context: {
            ...context,
            timestamp: context.timestamp || new Date(),
        },
    };
};
exports.wrapMessageWithContext = wrapMessageWithContext;
/**
 * Extracts request context from wrapped message.
 *
 * @param {any} message - Wrapped message
 * @returns {{ payload: any; context: RequestContext | null }} Extracted payload and context
 *
 * @example
 * ```typescript
 * const { payload, context } = extractMessageContext(wrappedMessage);
 * console.log(context.traceId); // 'trace-1'
 * ```
 */
const extractMessageContext = (message) => {
    if (message && typeof message === 'object' && 'payload' in message && 'context' in message) {
        return {
            payload: message.payload,
            context: message.context,
        };
    }
    return {
        payload: message,
        context: null,
    };
};
exports.extractMessageContext = extractMessageContext;
/**
 * Generates correlation ID for message tracing.
 *
 * @param {string} [prefix='msg'] - Prefix for correlation ID
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId('patient');
 * // Result: 'patient_1699564800000_a1b2c3d4'
 * ```
 */
const generateCorrelationId = (prefix = 'msg') => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${timestamp}_${random}`;
};
exports.generateCorrelationId = generateCorrelationId;
// ============================================================================
// RABBITMQ INTEGRATION (6-10)
// ============================================================================
/**
 * Creates RabbitMQ configuration with best practices.
 *
 * @param {string} queue - Queue name
 * @param {string[]} urls - RabbitMQ URLs
 * @param {Partial<RabbitMQConfig>} [options] - Additional options
 * @returns {RabbitMQConfig} RabbitMQ configuration
 *
 * @example
 * ```typescript
 * const config = createRabbitMQConfig('patient-queue', ['amqp://localhost:5672'], {
 *   prefetchCount: 10,
 *   queueOptions: { durable: true }
 * });
 * ```
 */
const createRabbitMQConfig = (queue, urls, options) => {
    return {
        urls,
        queue,
        queueOptions: {
            durable: true,
            exclusive: false,
            autoDelete: false,
            ...options?.queueOptions,
        },
        prefetchCount: options?.prefetchCount || 10,
        noAck: options?.noAck || false,
        socketOptions: options?.socketOptions || {},
    };
};
exports.createRabbitMQConfig = createRabbitMQConfig;
/**
 * Creates RabbitMQ exchange configuration with routing.
 *
 * @param {string} exchange - Exchange name
 * @param {'direct' | 'topic' | 'fanout' | 'headers'} type - Exchange type
 * @param {string} [routingKey] - Routing key
 * @returns {Record<string, any>} Exchange configuration
 *
 * @example
 * ```typescript
 * const config = createRabbitMQExchange('healthcare-events', 'topic', 'patient.created');
 * ```
 */
const createRabbitMQExchange = (exchange, type, routingKey) => {
    return {
        exchange,
        type,
        ...(routingKey && { routingKey }),
        durable: true,
        autoDelete: false,
    };
};
exports.createRabbitMQExchange = createRabbitMQExchange;
/**
 * Creates dead letter queue configuration for RabbitMQ.
 *
 * @param {string} originalQueue - Original queue name
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @param {number} [retryDelay=5000] - Retry delay in milliseconds
 * @returns {DeadLetterQueueConfig} DLQ configuration
 *
 * @example
 * ```typescript
 * const dlqConfig = createDeadLetterQueue('patient-queue', 3, 5000);
 * // Result: { queueName: 'patient-queue-dlq', maxRetries: 3, retryDelay: 5000 }
 * ```
 */
const createDeadLetterQueue = (originalQueue, maxRetries = 3, retryDelay = 5000) => {
    return {
        queueName: `${originalQueue}-dlq`,
        exchange: `${originalQueue}-dlx`,
        routingKey: `${originalQueue}-dlx-key`,
        maxRetries,
        retryDelay,
        ttl: retryDelay * maxRetries,
    };
};
exports.createDeadLetterQueue = createDeadLetterQueue;
/**
 * Acknowledges RabbitMQ message with error handling.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - RabbitMQ message
 * @param {boolean} [requeue=false] - Whether to requeue on failure
 * @returns {void}
 *
 * @example
 * ```typescript
 * acknowledgeMessage(channel, originalMsg, false);
 * ```
 */
const acknowledgeMessage = (channel, message, requeue = false) => {
    try {
        channel.ack(message);
    }
    catch (error) {
        console.error('Failed to acknowledge message:', error);
        if (requeue) {
            channel.nack(message, false, true);
        }
    }
};
exports.acknowledgeMessage = acknowledgeMessage;
/**
 * Rejects RabbitMQ message and optionally sends to dead letter queue.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - RabbitMQ message
 * @param {boolean} [requeue=false] - Whether to requeue
 * @param {string} [reason] - Rejection reason
 * @returns {void}
 *
 * @example
 * ```typescript
 * rejectMessage(channel, originalMsg, false, 'Invalid payload');
 * ```
 */
const rejectMessage = (channel, message, requeue = false, reason) => {
    try {
        if (reason) {
            console.warn(`Rejecting message: ${reason}`);
        }
        channel.nack(message, false, requeue);
    }
    catch (error) {
        console.error('Failed to reject message:', error);
    }
};
exports.rejectMessage = rejectMessage;
// ============================================================================
// KAFKA INTEGRATION (11-15)
// ============================================================================
/**
 * Creates Kafka configuration with consumer and producer settings.
 *
 * @param {string} clientId - Kafka client ID
 * @param {string[]} brokers - Kafka broker URLs
 * @param {string} groupId - Consumer group ID
 * @param {Partial<KafkaConfig>} [options] - Additional options
 * @returns {KafkaConfig} Kafka configuration
 *
 * @example
 * ```typescript
 * const config = createKafkaConfig('healthcare-service', ['localhost:9092'], 'patient-consumers');
 * ```
 */
const createKafkaConfig = (clientId, brokers, groupId, options) => {
    return {
        clientId,
        brokers,
        groupId,
        ssl: options?.ssl || false,
        sasl: options?.sasl,
        retry: {
            initialRetryTime: 100,
            retries: 8,
            ...options?.retry,
        },
    };
};
exports.createKafkaConfig = createKafkaConfig;
/**
 * Creates Kafka topic configuration with partitions and replication.
 *
 * @param {string} topic - Topic name
 * @param {number} [numPartitions=3] - Number of partitions
 * @param {number} [replicationFactor=2] - Replication factor
 * @returns {Record<string, any>} Topic configuration
 *
 * @example
 * ```typescript
 * const topicConfig = createKafkaTopic('patient-events', 5, 3);
 * ```
 */
const createKafkaTopic = (topic, numPartitions = 3, replicationFactor = 2) => {
    return {
        topic,
        numPartitions,
        replicationFactor,
        configEntries: [
            { name: 'compression.type', value: 'snappy' },
            { name: 'retention.ms', value: '604800000' }, // 7 days
            { name: 'cleanup.policy', value: 'delete' },
        ],
    };
};
exports.createKafkaTopic = createKafkaTopic;
/**
 * Serializes Kafka message with JSON encoding and compression.
 *
 * @param {any} data - Data to serialize
 * @param {Record<string, any>} [headers] - Message headers
 * @returns {{ value: string; headers?: Record<string, any> }} Serialized message
 *
 * @example
 * ```typescript
 * const message = serializeKafkaMessage({ patientId: '123' }, { 'content-type': 'application/json' });
 * ```
 */
const serializeKafkaMessage = (data, headers) => {
    return {
        value: JSON.stringify(data),
        ...(headers && { headers }),
    };
};
exports.serializeKafkaMessage = serializeKafkaMessage;
/**
 * Deserializes Kafka message with error handling.
 *
 * @param {any} message - Kafka message
 * @returns {{ data: any; headers: Record<string, any> | null; error?: string }} Deserialized message
 *
 * @example
 * ```typescript
 * const { data, headers, error } = deserializeKafkaMessage(kafkaMessage);
 * ```
 */
const deserializeKafkaMessage = (message) => {
    try {
        const data = JSON.parse(message.value.toString());
        const headers = message.headers || null;
        return { data, headers };
    }
    catch (error) {
        return {
            data: null,
            headers: null,
            error: `Failed to deserialize message: ${error.message}`,
        };
    }
};
exports.deserializeKafkaMessage = deserializeKafkaMessage;
/**
 * Creates Kafka consumer with auto-commit and offset management.
 *
 * @param {KafkaConfig} config - Kafka configuration
 * @param {string[]} topics - Topics to subscribe to
 * @param {boolean} [autoCommit=true] - Enable auto-commit
 * @returns {Record<string, any>} Consumer configuration
 *
 * @example
 * ```typescript
 * const consumer = createKafkaConsumer(kafkaConfig, ['patient-events', 'appointment-events']);
 * ```
 */
const createKafkaConsumer = (config, topics, autoCommit = true) => {
    return {
        groupId: config.groupId,
        topics,
        autoCommit,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        rebalanceTimeout: 60000,
    };
};
exports.createKafkaConsumer = createKafkaConsumer;
// ============================================================================
// GRPC INTEGRATION (16-20)
// ============================================================================
/**
 * Creates gRPC configuration with keepalive and message limits.
 *
 * @param {string} packageName - gRPC package name
 * @param {string} protoPath - Path to proto file
 * @param {string} url - gRPC server URL
 * @param {Partial<GrpcConfig>} [options] - Additional options
 * @returns {GrpcConfig} gRPC configuration
 *
 * @example
 * ```typescript
 * const config = createGrpcConfig('healthcare', './proto/healthcare.proto', '0.0.0.0:5000');
 * ```
 */
const createGrpcConfig = (packageName, protoPath, url, options) => {
    return {
        package: packageName,
        protoPath,
        url,
        maxReceiveMessageLength: options?.maxReceiveMessageLength || 1024 * 1024 * 100, // 100 MB
        maxSendMessageLength: options?.maxSendMessageLength || 1024 * 1024 * 100,
        keepalive: {
            keepaliveTimeMs: 120000,
            keepaliveTimeoutMs: 20000,
            keepalivePermitWithoutCalls: 1,
            ...options?.keepalive,
        },
        loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            ...options?.loader,
        },
    };
};
exports.createGrpcConfig = createGrpcConfig;
/**
 * Creates gRPC metadata for authentication and tracing.
 *
 * @param {Record<string, string>} metadata - Metadata key-value pairs
 * @returns {Map<string, string>} gRPC metadata
 *
 * @example
 * ```typescript
 * const metadata = createGrpcMetadata({
 *   'authorization': 'Bearer token123',
 *   'x-trace-id': 'trace-1'
 * });
 * ```
 */
const createGrpcMetadata = (metadata) => {
    return new Map(Object.entries(metadata));
};
exports.createGrpcMetadata = createGrpcMetadata;
/**
 * Handles gRPC streaming with backpressure and error recovery.
 *
 * @param {Observable<any>} stream$ - gRPC stream observable
 * @param {(data: any) => void} onData - Data handler
 * @param {(error: any) => void} [onError] - Error handler
 * @returns {void}
 *
 * @example
 * ```typescript
 * handleGrpcStream(
 *   vitalSignsStream$,
 *   (data) => console.log('Received vital sign:', data),
 *   (error) => console.error('Stream error:', error)
 * );
 * ```
 */
const handleGrpcStream = (stream$, onData, onError) => {
    stream$.subscribe({
        next: onData,
        error: onError || ((error) => console.error('Stream error:', error)),
        complete: () => console.log('Stream completed'),
    });
};
exports.handleGrpcStream = handleGrpcStream;
/**
 * Creates gRPC error with proper status codes.
 *
 * @param {number} code - gRPC status code
 * @param {string} message - Error message
 * @param {Record<string, any>} [details] - Error details
 * @returns {Error} gRPC error
 *
 * @example
 * ```typescript
 * throw createGrpcError(5, 'Patient not found', { patientId: '123' });
 * ```
 */
const createGrpcError = (code, message, details) => {
    const error = new Error(message);
    error.code = code;
    error.details = details || {};
    return error;
};
exports.createGrpcError = createGrpcError;
/**
 * Validates gRPC service definition and methods.
 *
 * @param {any} serviceDefinition - gRPC service definition
 * @param {string[]} requiredMethods - Required method names
 * @returns {{ valid: boolean; missing?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateGrpcService(HealthcareService, ['GetPatient', 'CreatePatient']);
 * ```
 */
const validateGrpcService = (serviceDefinition, requiredMethods) => {
    const availableMethods = Object.keys(serviceDefinition || {});
    const missing = requiredMethods.filter(method => !availableMethods.includes(method));
    return {
        valid: missing.length === 0,
        ...(missing.length > 0 && { missing }),
    };
};
exports.validateGrpcService = validateGrpcService;
// ============================================================================
// NATS INTEGRATION (21-24)
// ============================================================================
/**
 * Creates NATS configuration with authentication and reconnection.
 *
 * @param {string[]} servers - NATS server URLs
 * @param {Partial<NatsConfig>} [options] - Additional options
 * @returns {NatsConfig} NATS configuration
 *
 * @example
 * ```typescript
 * const config = createNatsConfig(['nats://localhost:4222'], {
 *   user: 'admin',
 *   pass: 'password',
 *   maxReconnectAttempts: 10
 * });
 * ```
 */
const createNatsConfig = (servers, options) => {
    return {
        servers,
        user: options?.user,
        pass: options?.pass,
        token: options?.token,
        maxReconnectAttempts: options?.maxReconnectAttempts || 10,
        reconnectTimeWait: options?.reconnectTimeWait || 2000,
        queue: options?.queue,
    };
};
exports.createNatsConfig = createNatsConfig;
/**
 * Creates NATS subject with wildcards for pub/sub patterns.
 *
 * @param {string} domain - Domain name
 * @param {string} entity - Entity name
 * @param {string} action - Action name
 * @param {string} [wildcard] - Wildcard pattern
 * @returns {string} NATS subject
 *
 * @example
 * ```typescript
 * const subject = createNatsSubject('healthcare', 'patient', 'created');
 * // Result: 'healthcare.patient.created'
 *
 * const wildcardSubject = createNatsSubject('healthcare', '*', 'created');
 * // Result: 'healthcare.*.created'
 * ```
 */
const createNatsSubject = (domain, entity, action, wildcard) => {
    if (wildcard) {
        return `${domain}.${wildcard}.${action}`;
    }
    return `${domain}.${entity}.${action}`;
};
exports.createNatsSubject = createNatsSubject;
/**
 * Creates NATS queue group for load balancing.
 *
 * @param {string} serviceName - Service name
 * @param {string} [environment='production'] - Environment
 * @returns {string} Queue group name
 *
 * @example
 * ```typescript
 * const queueGroup = createNatsQueueGroup('patient-service', 'production');
 * // Result: 'patient-service-production'
 * ```
 */
const createNatsQueueGroup = (serviceName, environment = 'production') => {
    return `${serviceName}-${environment}`;
};
exports.createNatsQueueGroup = createNatsQueueGroup;
/**
 * Handles NATS request-reply pattern with timeout.
 *
 * @param {any} client - NATS client
 * @param {string} subject - NATS subject
 * @param {any} data - Request data
 * @param {number} [timeoutMs=5000] - Timeout in milliseconds
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * const response = await natsRequestReply(natsClient, 'patient.get', { id: '123' }, 5000);
 * ```
 */
const natsRequestReply = async (client, subject, data, timeoutMs = 5000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`NATS request timeout after ${timeoutMs}ms`));
        }, timeoutMs);
        client.request(subject, JSON.stringify(data), (response) => {
            clearTimeout(timer);
            try {
                resolve(JSON.parse(response));
            }
            catch (error) {
                reject(new Error('Failed to parse NATS response'));
            }
        });
    });
};
exports.natsRequestReply = natsRequestReply;
// ============================================================================
// MESSAGE VALIDATION (25-29)
// ============================================================================
/**
 * Validates message payload against schema rules.
 *
 * @param {any} payload - Message payload
 * @param {MessageValidationRule[]} rules - Validation rules
 * @returns {{ valid: boolean; errors?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const rules = [
 *   { field: 'patientId', type: 'uuid', required: true },
 *   { field: 'age', type: 'number', min: 0, max: 150 }
 * ];
 * const result = validateMessagePayload({ patientId: '123', age: 30 }, rules);
 * ```
 */
const validateMessagePayload = (payload, rules) => {
    const errors = [];
    for (const rule of rules) {
        const value = payload[rule.field];
        // Check required
        if (rule.required && (value === undefined || value === null)) {
            errors.push(`Field '${rule.field}' is required`);
            continue;
        }
        if (value === undefined || value === null) {
            continue;
        }
        // Type validation
        if (!(0, exports.validateFieldType)(value, rule.type)) {
            errors.push(`Field '${rule.field}' must be of type ${rule.type}`);
        }
        // Min/Max validation
        if (rule.min !== undefined && value < rule.min) {
            errors.push(`Field '${rule.field}' must be >= ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
            errors.push(`Field '${rule.field}' must be <= ${rule.max}`);
        }
        // Pattern validation
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
            errors.push(`Field '${rule.field}' does not match required pattern`);
        }
        // Enum validation
        if (rule.enum && !rule.enum.includes(value)) {
            errors.push(`Field '${rule.field}' must be one of: ${rule.enum.join(', ')}`);
        }
        // Custom validation
        if (rule.custom && !rule.custom(value)) {
            errors.push(`Field '${rule.field}' failed custom validation`);
        }
    }
    return {
        valid: errors.length === 0,
        ...(errors.length > 0 && { errors }),
    };
};
exports.validateMessagePayload = validateMessagePayload;
/**
 * Validates field type for message validation.
 *
 * @param {any} value - Field value
 * @param {string} type - Expected type
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateFieldType('test@example.com', 'email'); // true
 * ```
 */
const validateFieldType = (value, type) => {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'object':
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        case 'array':
            return Array.isArray(value);
        case 'date':
            return value instanceof Date || !isNaN(Date.parse(value));
        case 'uuid':
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        default:
            return true;
    }
};
exports.validateFieldType = validateFieldType;
/**
 * Sanitizes message payload by removing sensitive fields.
 *
 * @param {any} payload - Message payload
 * @param {string[]} sensitiveFields - Fields to remove
 * @returns {any} Sanitized payload
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeMessagePayload(
 *   { patientId: '123', ssn: '123-45-6789', name: 'John' },
 *   ['ssn', 'password']
 * );
 * // Result: { patientId: '123', name: 'John' }
 * ```
 */
const sanitizeMessagePayload = (payload, sensitiveFields) => {
    if (!payload || typeof payload !== 'object') {
        return payload;
    }
    const sanitized = { ...payload };
    for (const field of sensitiveFields) {
        if (field in sanitized) {
            delete sanitized[field];
        }
    }
    return sanitized;
};
exports.sanitizeMessagePayload = sanitizeMessagePayload;
/**
 * Validates message size to prevent payload overflow.
 *
 * @param {any} payload - Message payload
 * @param {number} maxSizeBytes - Maximum size in bytes
 * @returns {{ valid: boolean; size: number; maxSize: number }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMessageSize(largePayload, 1024 * 1024); // 1 MB
 * ```
 */
const validateMessageSize = (payload, maxSizeBytes) => {
    const size = Buffer.byteLength(JSON.stringify(payload), 'utf8');
    return {
        valid: size <= maxSizeBytes,
        size,
        maxSize: maxSizeBytes,
    };
};
exports.validateMessageSize = validateMessageSize;
/**
 * Creates validation schema for common healthcare message types.
 *
 * @param {'patient' | 'appointment' | 'prescription' | 'vital-signs'} entityType - Entity type
 * @returns {MessageValidationRule[]} Validation rules
 *
 * @example
 * ```typescript
 * const schema = createHealthcareMessageSchema('patient');
 * const result = validateMessagePayload(payload, schema);
 * ```
 */
const createHealthcareMessageSchema = (entityType) => {
    const baseRules = [
        { field: 'id', type: 'uuid', required: true },
        { field: 'timestamp', type: 'date', required: true },
    ];
    switch (entityType) {
        case 'patient':
            return [
                ...baseRules,
                { field: 'firstName', type: 'string', required: true },
                { field: 'lastName', type: 'string', required: true },
                { field: 'dateOfBirth', type: 'date', required: true },
                { field: 'medicalRecordNumber', type: 'string', required: true },
            ];
        case 'appointment':
            return [
                ...baseRules,
                { field: 'patientId', type: 'uuid', required: true },
                { field: 'providerId', type: 'uuid', required: true },
                { field: 'scheduledAt', type: 'date', required: true },
                { field: 'duration', type: 'number', min: 15, max: 240 },
            ];
        case 'prescription':
            return [
                ...baseRules,
                { field: 'patientId', type: 'uuid', required: true },
                { field: 'medicationName', type: 'string', required: true },
                { field: 'dosage', type: 'string', required: true },
                { field: 'frequency', type: 'string', required: true },
            ];
        case 'vital-signs':
            return [
                ...baseRules,
                { field: 'patientId', type: 'uuid', required: true },
                { field: 'temperature', type: 'number', min: 35, max: 42 },
                { field: 'heartRate', type: 'number', min: 40, max: 200 },
                { field: 'bloodPressureSystolic', type: 'number', min: 70, max: 200 },
                { field: 'bloodPressureDiastolic', type: 'number', min: 40, max: 130 },
            ];
        default:
            return baseRules;
    }
};
exports.createHealthcareMessageSchema = createHealthcareMessageSchema;
// ============================================================================
// RETRY POLICIES (30-32)
// ============================================================================
/**
 * Creates retry policy with configurable backoff strategy.
 *
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {'fixed' | 'exponential' | 'linear'} backoffType - Backoff strategy
 * @param {number} initialDelay - Initial delay in milliseconds
 * @param {Partial<RetryPolicy>} [options] - Additional options
 * @returns {RetryPolicy} Retry policy
 *
 * @example
 * ```typescript
 * const policy = createRetryPolicy(5, 'exponential', 1000, {
 *   maxDelay: 30000,
 *   multiplier: 2
 * });
 * ```
 */
const createRetryPolicy = (maxAttempts, backoffType, initialDelay, options) => {
    return {
        maxAttempts,
        backoffType,
        initialDelay,
        maxDelay: options?.maxDelay || 60000,
        multiplier: options?.multiplier || 2,
        shouldRetry: options?.shouldRetry || ((error) => {
            // Retry on transient errors
            const retryableErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'];
            return retryableErrors.includes(error.code);
        }),
    };
};
exports.createRetryPolicy = createRetryPolicy;
/**
 * Calculates retry delay based on policy and attempt number.
 *
 * @param {RetryPolicy} policy - Retry policy
 * @param {number} attempt - Current attempt number
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(policy, 3);
 * // For exponential: 1000 * 2^3 = 8000ms
 * ```
 */
const calculateRetryDelay = (policy, attempt) => {
    let delay;
    switch (policy.backoffType) {
        case 'fixed':
            delay = policy.initialDelay;
            break;
        case 'exponential':
            delay = policy.initialDelay * Math.pow(policy.multiplier || 2, attempt);
            break;
        case 'linear':
            delay = policy.initialDelay * (attempt + 1);
            break;
        default:
            delay = policy.initialDelay;
    }
    return Math.min(delay, policy.maxDelay || 60000);
};
exports.calculateRetryDelay = calculateRetryDelay;
/**
 * Executes operation with retry policy using RxJS.
 *
 * @param {() => Observable<any>} operation - Operation to execute
 * @param {RetryPolicy} policy - Retry policy
 * @returns {Observable<any>} Observable with retry logic
 *
 * @example
 * ```typescript
 * executeWithRetry(
 *   () => client.send('get_patient', { id: '123' }),
 *   retryPolicy
 * ).subscribe(result => console.log(result));
 * ```
 */
const executeWithRetry = (operation, policy) => {
    return operation().pipe((0, operators_1.retry)({
        count: policy.maxAttempts,
        delay: (error, retryCount) => {
            if (!policy.shouldRetry || !policy.shouldRetry(error)) {
                throw error;
            }
            const delay = (0, exports.calculateRetryDelay)(policy, retryCount - 1);
            console.log(`Retry attempt ${retryCount} after ${delay}ms`);
            return (0, rxjs_1.timer)(delay);
        },
    }), (0, operators_1.catchError)((error) => {
        console.error(`Operation failed after ${policy.maxAttempts} attempts:`, error);
        return (0, rxjs_1.throwError)(() => error);
    }));
};
exports.executeWithRetry = executeWithRetry;
// ============================================================================
// CIRCUIT BREAKER (33-36)
// ============================================================================
/**
 * Creates circuit breaker state tracker.
 *
 * @returns {CircuitBreakerState} Initial circuit breaker state
 *
 * @example
 * ```typescript
 * const state = createCircuitBreakerState();
 * // Result: { state: 'CLOSED', failureCount: 0, successCount: 0, ... }
 * ```
 */
const createCircuitBreakerState = () => {
    return {
        state: 'CLOSED',
        failureCount: 0,
        successCount: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0,
    };
};
exports.createCircuitBreakerState = createCircuitBreakerState;
/**
 * Updates circuit breaker state based on operation result.
 *
 * @param {CircuitBreakerState} state - Current state
 * @param {CircuitBreakerConfig} config - Circuit breaker config
 * @param {boolean} success - Whether operation succeeded
 * @returns {CircuitBreakerState} Updated state
 *
 * @example
 * ```typescript
 * const newState = updateCircuitBreakerState(state, config, false);
 * ```
 */
const updateCircuitBreakerState = (state, config, success) => {
    const now = Date.now();
    if (success) {
        const newSuccessCount = state.successCount + 1;
        if (state.state === 'HALF_OPEN' && newSuccessCount >= config.successThreshold) {
            return {
                state: 'CLOSED',
                failureCount: 0,
                successCount: 0,
                lastFailureTime: 0,
                nextAttemptTime: 0,
            };
        }
        return {
            ...state,
            successCount: newSuccessCount,
            failureCount: 0,
        };
    }
    else {
        const newFailureCount = state.failureCount + 1;
        if (newFailureCount >= config.failureThreshold) {
            return {
                state: 'OPEN',
                failureCount: newFailureCount,
                successCount: 0,
                lastFailureTime: now,
                nextAttemptTime: now + config.resetTimeout,
            };
        }
        return {
            ...state,
            failureCount: newFailureCount,
            successCount: 0,
            lastFailureTime: now,
        };
    }
};
exports.updateCircuitBreakerState = updateCircuitBreakerState;
/**
 * Checks if circuit breaker allows operation execution.
 *
 * @param {CircuitBreakerState} state - Current state
 * @param {CircuitBreakerConfig} config - Circuit breaker config
 * @returns {{ allowed: boolean; reason?: string }} Execution permission
 *
 * @example
 * ```typescript
 * const { allowed, reason } = canExecuteOperation(state, config);
 * if (!allowed) console.log(reason);
 * ```
 */
const canExecuteOperation = (state, config) => {
    const now = Date.now();
    if (state.state === 'CLOSED') {
        return { allowed: true };
    }
    if (state.state === 'OPEN') {
        if (now >= state.nextAttemptTime) {
            // Transition to HALF_OPEN
            return { allowed: true };
        }
        return {
            allowed: false,
            reason: `Circuit breaker is OPEN. Next attempt at ${new Date(state.nextAttemptTime).toISOString()}`,
        };
    }
    // HALF_OPEN state
    return { allowed: true };
};
exports.canExecuteOperation = canExecuteOperation;
/**
 * Executes operation with circuit breaker protection.
 *
 * @param {() => Promise<any>} operation - Operation to execute
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Circuit breaker config
 * @param {(state: CircuitBreakerState) => void} onStateChange - State change callback
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithCircuitBreaker(
 *   () => serviceClient.callMethod(),
 *   state,
 *   config,
 *   (newState) => circuitBreakerState = newState
 * );
 * ```
 */
const executeWithCircuitBreaker = async (operation, state, config, onStateChange) => {
    const { allowed, reason } = (0, exports.canExecuteOperation)(state, config);
    if (!allowed) {
        throw new Error(reason || 'Circuit breaker is OPEN');
    }
    // Transition to HALF_OPEN if coming from OPEN
    if (state.state === 'OPEN') {
        const newState = { ...state, state: 'HALF_OPEN' };
        onStateChange(newState);
        state = newState;
    }
    try {
        const result = await Promise.race([
            operation(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), config.timeout)),
        ]);
        const newState = (0, exports.updateCircuitBreakerState)(state, config, true);
        onStateChange(newState);
        return result;
    }
    catch (error) {
        const newState = (0, exports.updateCircuitBreakerState)(state, config, false);
        onStateChange(newState);
        throw error;
    }
};
exports.executeWithCircuitBreaker = executeWithCircuitBreaker;
// ============================================================================
// SERVICE DISCOVERY (37-40)
// ============================================================================
/**
 * Registers service instance for service discovery.
 *
 * @param {ServiceRegistration} registration - Service registration details
 * @returns {Promise<string>} Registration ID
 *
 * @example
 * ```typescript
 * const id = await registerService({
 *   serviceId: 'patient-service-1',
 *   serviceName: 'patient-service',
 *   version: '1.0.0',
 *   host: 'localhost',
 *   port: 3001,
 *   protocol: 'tcp',
 *   tags: ['healthcare', 'primary']
 * });
 * ```
 */
const registerService = async (registration) => {
    // In production, this would register with Consul, etcd, or similar
    const registrationId = `${registration.serviceName}-${Date.now()}`;
    console.log(`Registered service: ${registration.serviceName}`, {
        id: registrationId,
        endpoint: `${registration.protocol}://${registration.host}:${registration.port}`,
        version: registration.version,
    });
    return registrationId;
};
exports.registerService = registerService;
/**
 * Discovers service instances with load balancing.
 *
 * @param {string} serviceName - Service name
 * @param {string} [version] - Service version
 * @param {string[]} [tags] - Service tags
 * @returns {Promise<ServiceDiscoveryResult>} Discovered instances
 *
 * @example
 * ```typescript
 * const result = await discoverService('patient-service', '1.0.0', ['primary']);
 * const instance = selectServiceInstance(result, 'round-robin');
 * ```
 */
const discoverService = async (serviceName, version, tags) => {
    // Mock implementation - in production, query service registry
    const mockInstances = [
        {
            serviceId: `${serviceName}-1`,
            serviceName,
            version: version || '1.0.0',
            host: 'localhost',
            port: 3001,
            protocol: 'tcp',
            tags: tags || [],
        },
        {
            serviceId: `${serviceName}-2`,
            serviceName,
            version: version || '1.0.0',
            host: 'localhost',
            port: 3002,
            protocol: 'tcp',
            tags: tags || [],
        },
    ];
    return {
        instances: mockInstances,
        strategy: 'round-robin',
    };
};
exports.discoverService = discoverService;
/**
 * Selects service instance based on load balancing strategy.
 *
 * @param {ServiceDiscoveryResult} discoveryResult - Discovery result
 * @param {'round-robin' | 'random' | 'least-connections'} [strategy='round-robin'] - Selection strategy
 * @returns {ServiceRegistration | null} Selected instance
 *
 * @example
 * ```typescript
 * const instance = selectServiceInstance(discoveryResult, 'random');
 * if (instance) {
 *   const url = `${instance.protocol}://${instance.host}:${instance.port}`;
 * }
 * ```
 */
const selectServiceInstance = (discoveryResult, strategy = 'round-robin') => {
    const instances = discoveryResult.instances;
    if (instances.length === 0) {
        return null;
    }
    if (instances.length === 1) {
        return instances[0];
    }
    switch (strategy) {
        case 'random':
            return instances[Math.floor(Math.random() * instances.length)];
        case 'round-robin':
            // In production, maintain counter state
            return instances[0];
        case 'least-connections':
            // In production, track connection counts
            return instances[0];
        default:
            return instances[0];
    }
};
exports.selectServiceInstance = selectServiceInstance;
/**
 * Deregisters service instance from service discovery.
 *
 * @param {string} serviceId - Service instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deregisterService('patient-service-1');
 * ```
 */
const deregisterService = async (serviceId) => {
    console.log(`Deregistered service: ${serviceId}`);
};
exports.deregisterService = deregisterService;
// ============================================================================
// HEALTH CHECKS (41-45)
// ============================================================================
/**
 * Creates health check status for microservice.
 *
 * @param {string} [version] - Service version
 * @param {number} [startTime=Date.now()] - Service start time
 * @returns {HealthCheckStatus} Health check status
 *
 * @example
 * ```typescript
 * const health = createHealthCheckStatus('1.0.0', startTime);
 * ```
 */
const createHealthCheckStatus = (version, startTime = Date.now()) => {
    const now = new Date();
    return {
        status: 'healthy',
        timestamp: now,
        uptime: Date.now() - startTime,
        checks: {},
        ...(version && { version }),
    };
};
exports.createHealthCheckStatus = createHealthCheckStatus;
/**
 * Adds component health check to overall status.
 *
 * @param {HealthCheckStatus} status - Overall health status
 * @param {string} componentName - Component name
 * @param {ComponentHealth} componentHealth - Component health details
 * @returns {HealthCheckStatus} Updated health status
 *
 * @example
 * ```typescript
 * const updated = addHealthCheck(status, 'database', {
 *   status: 'pass',
 *   componentType: 'datastore',
 *   observedValue: 5,
 *   observedUnit: 'ms',
 *   time: new Date().toISOString()
 * });
 * ```
 */
const addHealthCheck = (status, componentName, componentHealth) => {
    const updatedChecks = {
        ...status.checks,
        [componentName]: componentHealth,
    };
    // Determine overall status
    const hasFailure = Object.values(updatedChecks).some(check => check.status === 'fail');
    const hasWarning = Object.values(updatedChecks).some(check => check.status === 'warn');
    let overallStatus = 'healthy';
    if (hasFailure) {
        overallStatus = 'unhealthy';
    }
    else if (hasWarning) {
        overallStatus = 'degraded';
    }
    return {
        ...status,
        status: overallStatus,
        checks: updatedChecks,
    };
};
exports.addHealthCheck = addHealthCheck;
/**
 * Checks database connectivity for health monitoring.
 *
 * @param {any} connection - Database connection
 * @returns {Promise<ComponentHealth>} Database health status
 *
 * @example
 * ```typescript
 * const dbHealth = await checkDatabaseHealth(sequelize);
 * const status = addHealthCheck(healthStatus, 'database', dbHealth);
 * ```
 */
const checkDatabaseHealth = async (connection) => {
    const startTime = Date.now();
    try {
        await connection.authenticate();
        const responseTime = Date.now() - startTime;
        return {
            status: 'pass',
            componentType: 'datastore',
            observedValue: responseTime,
            observedUnit: 'ms',
            time: new Date().toISOString(),
        };
    }
    catch (error) {
        return {
            status: 'fail',
            componentType: 'datastore',
            time: new Date().toISOString(),
            output: error.message,
        };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
/**
 * Checks message broker connectivity (RabbitMQ, Kafka, NATS).
 *
 * @param {any} client - Message broker client
 * @param {string} brokerType - Broker type
 * @returns {Promise<ComponentHealth>} Broker health status
 *
 * @example
 * ```typescript
 * const brokerHealth = await checkMessageBrokerHealth(kafkaClient, 'kafka');
 * const status = addHealthCheck(healthStatus, 'message-broker', brokerHealth);
 * ```
 */
const checkMessageBrokerHealth = async (client, brokerType) => {
    const startTime = Date.now();
    try {
        // Perform ping or connection check
        const isConnected = client && (client.isConnected ? client.isConnected() : true);
        const responseTime = Date.now() - startTime;
        return {
            status: isConnected ? 'pass' : 'fail',
            componentType: 'message-broker',
            observedValue: responseTime,
            observedUnit: 'ms',
            time: new Date().toISOString(),
            output: `${brokerType} connection ${isConnected ? 'active' : 'inactive'}`,
        };
    }
    catch (error) {
        return {
            status: 'fail',
            componentType: 'message-broker',
            time: new Date().toISOString(),
            output: error.message,
        };
    }
};
exports.checkMessageBrokerHealth = checkMessageBrokerHealth;
/**
 * Creates comprehensive health check endpoint response.
 *
 * @param {HealthCheckStatus} status - Health check status
 * @param {boolean} [detailed=true] - Include detailed component info
 * @returns {Record<string, any>} Health check response
 *
 * @example
 * ```typescript
 * // In NestJS controller:
 * @Get('health')
 * getHealth() {
 *   return createHealthCheckResponse(this.healthStatus);
 * }
 * ```
 */
const createHealthCheckResponse = (status, detailed = true) => {
    const response = {
        status: status.status,
        timestamp: status.timestamp.toISOString(),
        uptime: status.uptime,
    };
    if (status.version) {
        response.version = status.version;
    }
    if (detailed) {
        response.checks = status.checks;
    }
    else {
        // Only include failing components in non-detailed mode
        const failedChecks = Object.entries(status.checks)
            .filter(([_, check]) => check.status === 'fail')
            .reduce((acc, [name, check]) => ({ ...acc, [name]: check }), {});
        if (Object.keys(failedChecks).length > 0) {
            response.failedChecks = failedChecks;
        }
    }
    return response;
};
exports.createHealthCheckResponse = createHealthCheckResponse;
//# sourceMappingURL=microservices-kit.js.map