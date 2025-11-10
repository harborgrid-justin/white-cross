/**
 * LOC: MSMSGKIT001
 * File: /reuse/microservices-messaging-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/microservices
 *   - @nestjs/common
 *   - rxjs
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Microservices modules
 *   - Message handlers and controllers
 *   - Event-driven services
 *   - Backend microservices infrastructure
 */
/**
 * File: /reuse/microservices-messaging-kit.ts
 * Locator: WC-UTL-MSMSGKIT-001
 * Purpose: Comprehensive NestJS Microservices Messaging Utilities Kit - Production-ready microservices and message queue utilities
 *
 * Upstream: Independent utility module for NestJS microservices messaging operations
 * Downstream: ../backend/*, Microservices modules, Message handlers, Event services, Queue processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/microservices, RabbitMQ, Kafka, NATS, Redis, RxJS
 * Exports: 45+ utility functions for microservices messaging, queue management, resilience patterns, saga orchestration
 *
 * LLM Context: Enterprise-grade microservices messaging utilities for White Cross healthcare platform.
 * Provides comprehensive RabbitMQ message handlers with DLQ support, Kafka producer/consumer utilities with
 * partition management, NATS client helpers with JetStream, Redis pub/sub with pattern matching, message
 * pattern builders for request-response and event-driven architectures, serialization/deserialization with
 * schema validation, dead letter queue handlers with retry logic, exponential backoff retry mechanisms,
 * circuit breaker patterns for resilience, service discovery helpers, message routing with priority queues,
 * consumer group coordination, saga pattern orchestrators for distributed transactions, message idempotency
 * guards for exactly-once processing, and comprehensive health checks for HIPAA-compliant microservices.
 */
import { Observable } from 'rxjs';
/**
 * Message pattern for request-response communication
 */
export interface MessagePattern {
    cmd: string;
    version?: string;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    metadata?: Record<string, any>;
}
/**
 * Event pattern for event-driven communication
 */
export interface EventPattern {
    event: string;
    aggregateId?: string;
    aggregateType?: string;
    version?: number;
    timestamp: Date;
    causationId?: string;
    correlationId?: string;
    metadata?: Record<string, any>;
}
/**
 * RabbitMQ configuration
 */
export interface RabbitMQConfig {
    urls: string[];
    queue: string;
    exchange?: string;
    routingKey?: string;
    queueOptions?: {
        durable?: boolean;
        exclusive?: boolean;
        autoDelete?: boolean;
        arguments?: Record<string, any>;
    };
    exchangeOptions?: {
        type?: 'direct' | 'topic' | 'fanout' | 'headers';
        durable?: boolean;
        autoDelete?: boolean;
    };
    prefetchCount?: number;
    noAck?: boolean;
    persistent?: boolean;
    heartbeat?: number;
    connectionTimeout?: number;
}
/**
 * Kafka configuration
 */
export interface KafkaConfig {
    clientId: string;
    brokers: string[];
    groupId: string;
    ssl?: boolean;
    sasl?: {
        mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
        username: string;
        password: string;
    };
    retry?: {
        initialRetryTime: number;
        retries: number;
        maxRetryTime?: number;
        multiplier?: number;
    };
    connectionTimeout?: number;
    requestTimeout?: number;
}
/**
 * Kafka topic configuration
 */
export interface KafkaTopicConfig {
    topic: string;
    numPartitions?: number;
    replicationFactor?: number;
    retentionMs?: number;
    compressionType?: 'none' | 'gzip' | 'snappy' | 'lz4' | 'zstd';
    cleanupPolicy?: 'delete' | 'compact' | 'compact,delete';
    minInsyncReplicas?: number;
}
/**
 * NATS configuration
 */
export interface NatsConfig {
    servers: string[];
    user?: string;
    pass?: string;
    token?: string;
    maxReconnectAttempts?: number;
    reconnectTimeWait?: number;
    queue?: string;
    noRandomize?: boolean;
    timeout?: number;
    pingInterval?: number;
    maxPingOut?: number;
}
/**
 * Redis pub/sub configuration
 */
export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    retryStrategy?: (times: number) => number;
    enableReadyCheck?: boolean;
    maxRetriesPerRequest?: number;
}
/**
 * Dead letter queue configuration
 */
export interface DeadLetterQueueConfig {
    queueName: string;
    exchange?: string;
    routingKey?: string;
    maxRetries: number;
    retryDelay: number;
    ttl?: number;
    errorHandler?: (error: any, message: any) => void;
}
/**
 * Retry policy configuration
 */
export interface RetryPolicy {
    maxAttempts: number;
    backoffType: 'fixed' | 'exponential' | 'linear' | 'jitter';
    initialDelay: number;
    maxDelay?: number;
    multiplier?: number;
    jitterFactor?: number;
    shouldRetry?: (error: any) => boolean;
    onRetry?: (attempt: number, error: any) => void;
}
/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    resetTimeout: number;
    monitoringPeriod?: number;
    halfOpenRequests?: number;
}
/**
 * Circuit breaker state
 */
export interface CircuitBreakerState {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    successCount: number;
    lastFailureTime: number;
    nextAttemptTime: number;
    consecutiveSuccesses?: number;
    consecutiveFailures?: number;
}
/**
 * Message validation rule
 */
export interface MessageValidationRule {
    field: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'uuid' | 'email' | 'phone';
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean | Promise<boolean>;
    customMessage?: string;
}
/**
 * Service registration for discovery
 */
export interface ServiceRegistration {
    serviceId: string;
    serviceName: string;
    version: string;
    host: string;
    port: number;
    protocol: 'tcp' | 'http' | 'https' | 'grpc' | 'nats' | 'rabbitmq' | 'kafka' | 'redis';
    healthCheckUrl?: string;
    healthCheckInterval?: number;
    metadata?: Record<string, any>;
    tags?: string[];
    weight?: number;
}
/**
 * Health check status
 */
export interface HealthCheckStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: Date;
    uptime: number;
    checks: Record<string, ComponentHealth>;
    version?: string;
    serviceId?: string;
}
/**
 * Component health details
 */
export interface ComponentHealth {
    status: 'pass' | 'fail' | 'warn';
    componentType: string;
    componentId?: string;
    observedValue?: any;
    observedUnit?: string;
    time?: string;
    output?: string;
    affectedEndpoints?: string[];
}
/**
 * Saga step definition
 */
export interface SagaStep<T = any> {
    stepId: string;
    stepName: string;
    action: (context: SagaContext) => Promise<T>;
    compensation: (context: SagaContext, result?: T) => Promise<void>;
    timeout?: number;
    retryPolicy?: RetryPolicy;
}
/**
 * Saga context for orchestration
 */
export interface SagaContext {
    sagaId: string;
    currentStep: number;
    completedSteps: string[];
    stepResults: Record<string, any>;
    data: Record<string, any>;
    status: 'pending' | 'running' | 'completed' | 'compensating' | 'compensated' | 'failed';
    startedAt: Date;
    completedAt?: Date;
    error?: any;
}
/**
 * Message metadata for tracing
 */
export interface MessageMetadata {
    messageId: string;
    correlationId: string;
    causationId?: string;
    timestamp: Date;
    traceId?: string;
    spanId?: string;
    userId?: string;
    tenantId?: string;
    source?: string;
    destination?: string;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    ttl?: number;
    retryCount?: number;
    maxRetries?: number;
}
/**
 * Idempotency record
 */
export interface IdempotencyRecord {
    messageId: string;
    processedAt: Date;
    expiresAt: Date;
    result?: any;
    status: 'processing' | 'completed' | 'failed';
}
/**
 * Message envelope wrapper
 */
export interface MessageEnvelope<T = any> {
    metadata: MessageMetadata;
    payload: T;
    headers?: Record<string, string>;
}
/**
 * Consumer group configuration
 */
export interface ConsumerGroupConfig {
    groupId: string;
    topics: string[];
    autoCommit?: boolean;
    commitInterval?: number;
    sessionTimeout?: number;
    heartbeatInterval?: number;
    maxPollRecords?: number;
    maxPollInterval?: number;
}
/**
 * Message routing rule
 */
export interface MessageRoutingRule {
    pattern: string | RegExp;
    destination: string;
    priority?: number;
    condition?: (message: any) => boolean;
    transform?: (message: any) => any;
}
/**
 * Priority queue message
 */
export interface PriorityQueueMessage<T = any> {
    priority: number;
    payload: T;
    timestamp: Date;
    messageId: string;
}
/**
 * Distributed transaction context
 */
export interface DistributedTransactionContext {
    transactionId: string;
    participants: string[];
    status: 'prepared' | 'committed' | 'aborted';
    timeout: number;
    startedAt: Date;
    preparedParticipants: string[];
    committedParticipants: string[];
}
/**
 * 1. Creates a typed message pattern for request-response communication.
 *
 * @param {string} cmd - Command name
 * @param {string} [version] - API version
 * @param {'low' | 'normal' | 'high' | 'critical'} [priority] - Message priority
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {MessagePattern} Message pattern object
 *
 * @example
 * ```typescript
 * const pattern = createMessagePattern('get_patient', 'v1', 'high', {
 *   source: 'api-gateway',
 *   requiresAuth: true
 * });
 * // Result: { cmd: 'get_patient', version: 'v1', priority: 'high', metadata: {...} }
 * ```
 */
export declare function createMessagePattern(cmd: string, version?: string, priority?: 'low' | 'normal' | 'high' | 'critical', metadata?: Record<string, any>): MessagePattern;
/**
 * 2. Creates a typed event pattern for event-driven communication.
 *
 * @param {string} event - Event name
 * @param {string} [aggregateId] - Aggregate identifier
 * @param {string} [aggregateType] - Aggregate type
 * @param {number} [version] - Event version
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {EventPattern} Event pattern object
 *
 * @example
 * ```typescript
 * const pattern = createEventPattern(
 *   'patient.created',
 *   'patient-123',
 *   'Patient',
 *   1,
 *   { facility: 'White Cross General' }
 * );
 * ```
 */
export declare function createEventPattern(event: string, aggregateId?: string, aggregateType?: string, version?: number, metadata?: Record<string, any>): EventPattern;
/**
 * 3. Wraps message payload with comprehensive metadata envelope.
 *
 * @param {T} payload - Message payload
 * @param {Partial<MessageMetadata>} [metadata] - Optional metadata overrides
 * @returns {MessageEnvelope<T>} Wrapped message with metadata
 *
 * @example
 * ```typescript
 * const envelope = wrapMessageWithMetadata(
 *   { patientId: '123', diagnosis: 'Hypertension' },
 *   { priority: 'high', userId: 'doctor-456' }
 * );
 * // Includes messageId, correlationId, timestamp, etc.
 * ```
 */
export declare function wrapMessageWithMetadata<T = any>(payload: T, metadata?: Partial<MessageMetadata>): MessageEnvelope<T>;
/**
 * 4. Extracts payload and metadata from message envelope.
 *
 * @param {MessageEnvelope<T>} envelope - Message envelope
 * @returns {{ payload: T; metadata: MessageMetadata }} Extracted data
 *
 * @example
 * ```typescript
 * const { payload, metadata } = unwrapMessageEnvelope(envelope);
 * console.log(`Processing message ${metadata.messageId}`);
 * console.log(`Patient ID: ${payload.patientId}`);
 * ```
 */
export declare function unwrapMessageEnvelope<T = any>(envelope: MessageEnvelope<T>): {
    payload: T;
    metadata: MessageMetadata;
};
/**
 * 5. Generates unique correlation ID for distributed tracing.
 *
 * @param {string} [prefix='corr'] - Prefix for correlation ID
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId('patient');
 * // Result: 'patient_20231108_a1b2c3d4e5f6'
 * ```
 */
export declare function generateCorrelationId(prefix?: string): string;
/**
 * 6. Creates comprehensive RabbitMQ configuration with best practices.
 *
 * @param {string} queue - Queue name
 * @param {string[]} urls - RabbitMQ server URLs
 * @param {Partial<RabbitMQConfig>} [options] - Additional configuration options
 * @returns {RabbitMQConfig} Complete RabbitMQ configuration
 *
 * @example
 * ```typescript
 * const config = createRabbitMQConfig('patient-queue', ['amqp://localhost:5672'], {
 *   exchange: 'healthcare-events',
 *   routingKey: 'patient.*',
 *   prefetchCount: 10,
 *   queueOptions: { durable: true, arguments: { 'x-max-priority': 10 } }
 * });
 * ```
 */
export declare function createRabbitMQConfig(queue: string, urls: string[], options?: Partial<RabbitMQConfig>): RabbitMQConfig;
/**
 * 7. Creates dead letter queue configuration for failed message handling.
 *
 * @param {string} originalQueue - Original queue name
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @param {number} [retryDelay=5000] - Retry delay in milliseconds
 * @param {(error: any, message: any) => void} [errorHandler] - Custom error handler
 * @returns {DeadLetterQueueConfig} Dead letter queue configuration
 *
 * @example
 * ```typescript
 * const dlqConfig = createDeadLetterQueue('patient-queue', 3, 5000, (error, msg) => {
 *   console.error('Message failed after retries:', error);
 *   // Send alert to monitoring system
 * });
 * ```
 */
export declare function createDeadLetterQueue(originalQueue: string, maxRetries?: number, retryDelay?: number, errorHandler?: (error: any, message: any) => void): DeadLetterQueueConfig;
/**
 * 8. Acknowledges RabbitMQ message with error handling and logging.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - RabbitMQ message
 * @param {boolean} [multiple=false] - Acknowledge multiple messages
 * @returns {boolean} True if acknowledgment succeeded
 *
 * @example
 * ```typescript
 * @MessagePattern('process_patient')
 * async handleMessage(@Payload() data: any, @Ctx() context: RmqContext) {
 *   const channel = context.getChannelRef();
 *   const originalMsg = context.getMessage();
 *
 *   try {
 *     await this.processPatient(data);
 *     acknowledgeRabbitMQMessage(channel, originalMsg);
 *   } catch (error) {
 *     rejectRabbitMQMessage(channel, originalMsg, false);
 *   }
 * }
 * ```
 */
export declare function acknowledgeRabbitMQMessage(channel: any, message: any, multiple?: boolean): boolean;
/**
 * 9. Rejects RabbitMQ message with optional requeue and DLQ routing.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - RabbitMQ message
 * @param {boolean} [requeue=false] - Whether to requeue message
 * @param {string} [reason] - Rejection reason for logging
 * @returns {boolean} True if rejection succeeded
 *
 * @example
 * ```typescript
 * if (!isValidPatientData(data)) {
 *   rejectRabbitMQMessage(channel, originalMsg, false, 'Invalid patient data format');
 *   return;
 * }
 * ```
 */
export declare function rejectRabbitMQMessage(channel: any, message: any, requeue?: boolean, reason?: string): boolean;
/**
 * 10. Publishes message to RabbitMQ exchange with routing.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {string} exchange - Exchange name
 * @param {string} routingKey - Routing key
 * @param {any} message - Message payload
 * @param {Record<string, any>} [options] - Publish options
 * @returns {boolean} True if publish succeeded
 *
 * @example
 * ```typescript
 * publishToRabbitMQ(
 *   channel,
 *   'healthcare-events',
 *   'patient.created',
 *   { patientId: '123', name: 'John Doe' },
 *   { persistent: true, priority: 5 }
 * );
 * ```
 */
export declare function publishToRabbitMQ(channel: any, exchange: string, routingKey: string, message: any, options?: Record<string, any>): boolean;
/**
 * 11. Creates comprehensive Kafka configuration with security and retry settings.
 *
 * @param {string} clientId - Kafka client ID
 * @param {string[]} brokers - Kafka broker URLs
 * @param {string} groupId - Consumer group ID
 * @param {Partial<KafkaConfig>} [options] - Additional options
 * @returns {KafkaConfig} Complete Kafka configuration
 *
 * @example
 * ```typescript
 * const config = createKafkaConfig(
 *   'healthcare-service',
 *   ['localhost:9092', 'localhost:9093'],
 *   'patient-consumers',
 *   {
 *     ssl: true,
 *     sasl: { mechanism: 'scram-sha-256', username: 'user', password: 'pass' },
 *     retry: { initialRetryTime: 100, retries: 8 }
 *   }
 * );
 * ```
 */
export declare function createKafkaConfig(clientId: string, brokers: string[], groupId: string, options?: Partial<KafkaConfig>): KafkaConfig;
/**
 * 12. Creates Kafka topic configuration with partitioning and retention.
 *
 * @param {string} topic - Topic name
 * @param {number} [numPartitions=3] - Number of partitions
 * @param {number} [replicationFactor=2] - Replication factor
 * @param {Partial<KafkaTopicConfig>} [options] - Additional topic options
 * @returns {KafkaTopicConfig} Topic configuration
 *
 * @example
 * ```typescript
 * const topicConfig = createKafkaTopic('patient-events', 5, 3, {
 *   retentionMs: 604800000, // 7 days
 *   compressionType: 'snappy',
 *   cleanupPolicy: 'delete',
 *   minInsyncReplicas: 2
 * });
 * ```
 */
export declare function createKafkaTopic(topic: string, numPartitions?: number, replicationFactor?: number, options?: Partial<KafkaTopicConfig>): KafkaTopicConfig;
/**
 * 13. Serializes message for Kafka with headers and key.
 *
 * @param {any} data - Message data
 * @param {string} [key] - Partition key
 * @param {Record<string, string>} [headers] - Message headers
 * @returns {{ key?: string; value: string; headers?: Record<string, string> }} Serialized message
 *
 * @example
 * ```typescript
 * const kafkaMessage = serializeKafkaMessage(
 *   { patientId: '123', event: 'created' },
 *   '123', // Partition by patient ID
 *   { 'content-type': 'application/json', 'schema-version': 'v1' }
 * );
 * ```
 */
export declare function serializeKafkaMessage(data: any, key?: string, headers?: Record<string, string>): {
    key?: string;
    value: string;
    headers?: Record<string, string>;
};
/**
 * 14. Deserializes Kafka message with error handling and validation.
 *
 * @param {any} message - Kafka message
 * @returns {{ data: any; key: string | null; headers: Record<string, any> | null; error?: string }} Deserialized data
 *
 * @example
 * ```typescript
 * const { data, key, headers, error } = deserializeKafkaMessage(kafkaMessage);
 * if (error) {
 *   console.error('Deserialization failed:', error);
 *   return;
 * }
 * console.log(`Processing patient ${key}:`, data);
 * ```
 */
export declare function deserializeKafkaMessage(message: any): {
    data: any;
    key: string | null;
    headers: Record<string, any> | null;
    error?: string;
};
/**
 * 15. Creates Kafka consumer group configuration with offset management.
 *
 * @param {string} groupId - Consumer group ID
 * @param {string[]} topics - Topics to subscribe to
 * @param {Partial<ConsumerGroupConfig>} [options] - Additional options
 * @returns {ConsumerGroupConfig} Consumer group configuration
 *
 * @example
 * ```typescript
 * const consumerConfig = createKafkaConsumerGroup(
 *   'patient-processors',
 *   ['patient-events', 'appointment-events'],
 *   { autoCommit: false, maxPollRecords: 100, sessionTimeout: 30000 }
 * );
 * ```
 */
export declare function createKafkaConsumerGroup(groupId: string, topics: string[], options?: Partial<ConsumerGroupConfig>): ConsumerGroupConfig;
/**
 * 16. Creates NATS configuration with authentication and reconnection strategy.
 *
 * @param {string[]} servers - NATS server URLs
 * @param {Partial<NatsConfig>} [options] - Additional options
 * @returns {NatsConfig} NATS configuration
 *
 * @example
 * ```typescript
 * const config = createNatsConfig(['nats://localhost:4222', 'nats://localhost:4223'], {
 *   user: 'healthcare-service',
 *   pass: 'secret',
 *   maxReconnectAttempts: 10,
 *   reconnectTimeWait: 2000
 * });
 * ```
 */
export declare function createNatsConfig(servers: string[], options?: Partial<NatsConfig>): NatsConfig;
/**
 * 17. Creates NATS subject with hierarchical naming convention.
 *
 * @param {string} domain - Domain name (e.g., 'healthcare')
 * @param {string} entity - Entity name (e.g., 'patient')
 * @param {string} action - Action name (e.g., 'created')
 * @param {string} [environment='prod'] - Environment
 * @returns {string} NATS subject
 *
 * @example
 * ```typescript
 * const subject = createNatsSubject('healthcare', 'patient', 'created', 'prod');
 * // Result: 'healthcare.prod.patient.created'
 *
 * // With wildcard for subscribing to all patient events:
 * const wildcardSubject = createNatsSubject('healthcare', 'patient', '*', 'prod');
 * ```
 */
export declare function createNatsSubject(domain: string, entity: string, action: string, environment?: string): string;
/**
 * 18. Creates NATS queue group for load-balanced processing.
 *
 * @param {string} serviceName - Service name
 * @param {string} [version='v1'] - Service version
 * @param {string} [environment='prod'] - Environment
 * @returns {string} Queue group name
 *
 * @example
 * ```typescript
 * const queueGroup = createNatsQueueGroup('patient-service', 'v1', 'prod');
 * // Result: 'patient-service-v1-prod'
 * // Multiple instances will share messages in this queue group
 * ```
 */
export declare function createNatsQueueGroup(serviceName: string, version?: string, environment?: string): string;
/**
 * 19. Implements NATS request-reply pattern with timeout.
 *
 * @param {any} client - NATS client
 * @param {string} subject - NATS subject
 * @param {any} data - Request data
 * @param {number} [timeoutMs=5000] - Timeout in milliseconds
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * try {
 *   const response = await natsRequestReply(
 *     natsClient,
 *     'healthcare.prod.patient.get',
 *     { patientId: '123' },
 *     5000
 *   );
 *   console.log('Patient data:', response);
 * } catch (error) {
 *   console.error('Request failed:', error);
 * }
 * ```
 */
export declare function natsRequestReply(client: any, subject: string, data: any, timeoutMs?: number): Promise<any>;
/**
 * 20. Publishes message to NATS subject with fire-and-forget.
 *
 * @param {any} client - NATS client
 * @param {string} subject - NATS subject
 * @param {any} data - Message data
 * @param {string} [replyTo] - Reply-to subject for responses
 * @returns {boolean} True if publish succeeded
 *
 * @example
 * ```typescript
 * publishToNats(
 *   natsClient,
 *   'healthcare.prod.patient.created',
 *   { patientId: '123', name: 'John Doe', createdAt: new Date() }
 * );
 * ```
 */
export declare function publishToNats(client: any, subject: string, data: any, replyTo?: string): boolean;
/**
 * 21. Creates Redis pub/sub configuration with connection pooling.
 *
 * @param {string} host - Redis host
 * @param {number} port - Redis port
 * @param {Partial<RedisConfig>} [options] - Additional options
 * @returns {RedisConfig} Redis configuration
 *
 * @example
 * ```typescript
 * const config = createRedisConfig('localhost', 6379, {
 *   password: 'secret',
 *   db: 0,
 *   keyPrefix: 'healthcare:',
 *   retryStrategy: (times) => Math.min(times * 50, 2000)
 * });
 * ```
 */
export declare function createRedisConfig(host: string, port: number, options?: Partial<RedisConfig>): RedisConfig;
/**
 * 22. Creates Redis pub/sub channel name with namespacing.
 *
 * @param {string} domain - Domain name
 * @param {string} event - Event name
 * @param {string} [namespace='default'] - Namespace
 * @returns {string} Channel name
 *
 * @example
 * ```typescript
 * const channel = createRedisChannel('healthcare', 'patient.created', 'prod');
 * // Result: 'prod:healthcare:patient.created'
 * ```
 */
export declare function createRedisChannel(domain: string, event: string, namespace?: string): string;
/**
 * 23. Publishes message to Redis pub/sub channel.
 *
 * @param {any} client - Redis client
 * @param {string} channel - Channel name
 * @param {any} message - Message data
 * @returns {Promise<number>} Number of subscribers that received the message
 *
 * @example
 * ```typescript
 * const subscriberCount = await publishToRedis(
 *   redisClient,
 *   'prod:healthcare:patient.created',
 *   { patientId: '123', name: 'John Doe' }
 * );
 * console.log(`Message delivered to ${subscriberCount} subscribers`);
 * ```
 */
export declare function publishToRedis(client: any, channel: string, message: any): Promise<number>;
/**
 * 24. Subscribes to Redis pub/sub channel with pattern matching.
 *
 * @param {any} client - Redis client
 * @param {string} pattern - Channel pattern (supports wildcards: * and ?)
 * @param {(channel: string, message: any) => void} handler - Message handler
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await subscribeToRedisPattern(
 *   redisClient,
 *   'prod:healthcare:patient.*',
 *   (channel, message) => {
 *     console.log(`Received on ${channel}:`, message);
 *     // Handle patient.created, patient.updated, etc.
 *   }
 * );
 * ```
 */
export declare function subscribeToRedisPattern(client: any, pattern: string, handler: (channel: string, message: any) => void): Promise<void>;
/**
 * 25. Implements Redis pub/sub with message expiration (TTL).
 *
 * @param {any} client - Redis client
 * @param {string} key - Message key
 * @param {any} message - Message data
 * @param {number} ttlSeconds - Time to live in seconds
 * @returns {Promise<boolean>} True if message was stored
 *
 * @example
 * ```typescript
 * await publishWithTTL(
 *   redisClient,
 *   'session:user-123',
 *   { sessionId: 'abc', userId: '123' },
 *   3600 // 1 hour
 * );
 * ```
 */
export declare function publishWithTTL(client: any, key: string, message: any, ttlSeconds: number): Promise<boolean>;
/**
 * 26. Validates message payload against schema rules.
 *
 * @param {any} payload - Message payload
 * @param {MessageValidationRule[]} rules - Validation rules
 * @returns {Promise<{ valid: boolean; errors?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const rules: MessageValidationRule[] = [
 *   { field: 'patientId', type: 'uuid', required: true },
 *   { field: 'age', type: 'number', min: 0, max: 150 },
 *   { field: 'email', type: 'email', required: true }
 * ];
 *
 * const { valid, errors } = await validateMessagePayload(payload, rules);
 * if (!valid) {
 *   throw new ValidationException(errors);
 * }
 * ```
 */
export declare function validateMessagePayload(payload: any, rules: MessageValidationRule[]): Promise<{
    valid: boolean;
    errors?: string[];
}>;
/**
 * 27. Validates field type for message validation.
 *
 * @param {any} value - Field value
 * @param {string} type - Expected type
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * validateFieldType('test@example.com', 'email'); // true
 * validateFieldType(123, 'string'); // false
 * validateFieldType('550e8400-e29b-41d4-a716-446655440000', 'uuid'); // true
 * ```
 */
export declare function validateFieldType(value: any, type: string): boolean;
/**
 * 28. Sanitizes message payload by removing sensitive fields.
 *
 * @param {any} payload - Message payload
 * @param {string[]} sensitiveFields - Fields to remove or mask
 * @param {boolean} [mask=false] - Mask instead of remove
 * @returns {any} Sanitized payload
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeMessagePayload(
 *   { patientId: '123', ssn: '123-45-6789', name: 'John', password: 'secret' },
 *   ['ssn', 'password'],
 *   true // Mask instead of remove
 * );
 * // Result: { patientId: '123', ssn: '***-**-****', name: 'John', password: '******' }
 * ```
 */
export declare function sanitizeMessagePayload(payload: any, sensitiveFields: string[], mask?: boolean): any;
/**
 * 29. Validates message size to prevent payload overflow.
 *
 * @param {any} payload - Message payload
 * @param {number} maxSizeBytes - Maximum size in bytes
 * @returns {{ valid: boolean; size: number; maxSize: number; exceeded?: number }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMessageSize(largePayload, 1024 * 1024); // 1 MB limit
 * if (!result.valid) {
 *   console.error(`Message too large: ${result.size} bytes (max: ${result.maxSize})`);
 * }
 * ```
 */
export declare function validateMessageSize(payload: any, maxSizeBytes: number): {
    valid: boolean;
    size: number;
    maxSize: number;
    exceeded?: number;
};
/**
 * 30. Creates healthcare-specific message validation schema.
 *
 * @param {'patient' | 'appointment' | 'prescription' | 'vital-signs' | 'lab-result'} entityType - Entity type
 * @returns {MessageValidationRule[]} Validation rules
 *
 * @example
 * ```typescript
 * const patientSchema = createHealthcareMessageSchema('patient');
 * const { valid, errors } = await validateMessagePayload(patientData, patientSchema);
 * ```
 */
export declare function createHealthcareMessageSchema(entityType: 'patient' | 'appointment' | 'prescription' | 'vital-signs' | 'lab-result'): MessageValidationRule[];
/**
 * 31. Creates retry policy with configurable backoff strategy.
 *
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {'fixed' | 'exponential' | 'linear' | 'jitter'} backoffType - Backoff strategy
 * @param {number} initialDelay - Initial delay in milliseconds
 * @param {Partial<RetryPolicy>} [options] - Additional options
 * @returns {RetryPolicy} Retry policy
 *
 * @example
 * ```typescript
 * const policy = createRetryPolicy(5, 'exponential', 1000, {
 *   maxDelay: 30000,
 *   multiplier: 2,
 *   jitterFactor: 0.1,
 *   shouldRetry: (error) => error.code !== 'VALIDATION_ERROR'
 * });
 * ```
 */
export declare function createRetryPolicy(maxAttempts: number, backoffType: 'fixed' | 'exponential' | 'linear' | 'jitter', initialDelay: number, options?: Partial<RetryPolicy>): RetryPolicy;
/**
 * 32. Calculates retry delay based on policy and attempt number.
 *
 * @param {RetryPolicy} policy - Retry policy
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(policy, 3);
 * // For exponential with multiplier 2: 1000 * 2^3 = 8000ms
 * // With jitter: 8000 ± (8000 * 0.1) = 7200-8800ms
 * ```
 */
export declare function calculateRetryDelay(policy: RetryPolicy, attempt: number): number;
/**
 * 33. Executes operation with retry policy using async/await.
 *
 * @param {() => Promise<T>} operation - Operation to execute
 * @param {RetryPolicy} policy - Retry policy
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   async () => {
 *     const response = await fetch('https://api.example.com/patients/123');
 *     return response.json();
 *   },
 *   retryPolicy
 * );
 * ```
 */
export declare function executeWithRetry<T>(operation: () => Promise<T>, policy: RetryPolicy): Promise<T>;
/**
 * 34. Executes operation with retry policy using RxJS Observable.
 *
 * @param {() => Observable<T>} operation - Operation to execute
 * @param {RetryPolicy} policy - Retry policy
 * @returns {Observable<T>} Observable with retry logic
 *
 * @example
 * ```typescript
 * executeWithRetryObservable(
 *   () => this.httpClient.get('/api/patients/123'),
 *   retryPolicy
 * ).subscribe(
 *   result => console.log('Success:', result),
 *   error => console.error('Failed after retries:', error)
 * );
 * ```
 */
export declare function executeWithRetryObservable<T>(operation: () => Observable<T>, policy: RetryPolicy): Observable<T>;
/**
 * 35. Creates retry policy for specific error types.
 *
 * @param {string[]} retryableErrorCodes - Error codes to retry
 * @param {number} [maxAttempts=3] - Maximum attempts
 * @param {number} [initialDelay=1000] - Initial delay
 * @returns {RetryPolicy} Retry policy
 *
 * @example
 * ```typescript
 * const networkRetryPolicy = createRetryPolicyForErrors(
 *   ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'],
 *   5,
 *   1000
 * );
 * ```
 */
export declare function createRetryPolicyForErrors(retryableErrorCodes: string[], maxAttempts?: number, initialDelay?: number): RetryPolicy;
/**
 * 36. Creates circuit breaker state tracker.
 *
 * @returns {CircuitBreakerState} Initial circuit breaker state
 *
 * @example
 * ```typescript
 * const circuitState = createCircuitBreakerState();
 * // State starts as CLOSED (allowing requests)
 * ```
 */
export declare function createCircuitBreakerState(): CircuitBreakerState;
/**
 * 37. Updates circuit breaker state based on operation result.
 *
 * @param {CircuitBreakerState} state - Current state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @param {boolean} success - Whether operation succeeded
 * @returns {CircuitBreakerState} Updated state
 *
 * @example
 * ```typescript
 * let state = createCircuitBreakerState();
 * // After failure:
 * state = updateCircuitBreakerState(state, config, false);
 * // After success:
 * state = updateCircuitBreakerState(state, config, true);
 * ```
 */
export declare function updateCircuitBreakerState(state: CircuitBreakerState, config: CircuitBreakerConfig, success: boolean): CircuitBreakerState;
/**
 * 38. Checks if circuit breaker allows operation execution.
 *
 * @param {CircuitBreakerState} state - Current state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {{ allowed: boolean; reason?: string; nextState?: CircuitBreakerState }} Execution permission
 *
 * @example
 * ```typescript
 * const { allowed, reason, nextState } = canExecuteOperation(state, config);
 * if (!allowed) {
 *   console.error('Operation blocked:', reason);
 *   return;
 * }
 * if (nextState) state = nextState; // Transition to HALF_OPEN
 * ```
 */
export declare function canExecuteOperation(state: CircuitBreakerState, config: CircuitBreakerConfig): {
    allowed: boolean;
    reason?: string;
    nextState?: CircuitBreakerState;
};
/**
 * 39. Executes operation with circuit breaker protection.
 *
 * @param {() => Promise<T>} operation - Operation to execute
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @param {(state: CircuitBreakerState) => void} onStateChange - State change callback
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * let circuitState = createCircuitBreakerState();
 *
 * const result = await executeWithCircuitBreaker(
 *   () => externalApiCall(),
 *   circuitState,
 *   circuitConfig,
 *   (newState) => { circuitState = newState; }
 * );
 * ```
 */
export declare function executeWithCircuitBreaker<T>(operation: () => Promise<T>, state: CircuitBreakerState, config: CircuitBreakerConfig, onStateChange: (state: CircuitBreakerState) => void): Promise<T>;
/**
 * 40. Creates circuit breaker configuration for microservices.
 *
 * @param {number} [failureThreshold=5] - Failures before opening
 * @param {number} [successThreshold=2] - Successes before closing
 * @param {number} [timeout=10000] - Operation timeout (ms)
 * @param {number} [resetTimeout=60000] - Reset timeout (ms)
 * @returns {CircuitBreakerConfig} Circuit breaker configuration
 *
 * @example
 * ```typescript
 * const config = createCircuitBreakerConfig(5, 2, 10000, 60000);
 * // Opens after 5 failures, closes after 2 successes in HALF_OPEN
 * ```
 */
export declare function createCircuitBreakerConfig(failureThreshold?: number, successThreshold?: number, timeout?: number, resetTimeout?: number): CircuitBreakerConfig;
/**
 * 41. Registers service instance for service discovery.
 *
 * @param {ServiceRegistration} registration - Service registration details
 * @returns {Promise<string>} Registration ID
 *
 * @example
 * ```typescript
 * const registrationId = await registerServiceInstance({
 *   serviceId: 'patient-service-1',
 *   serviceName: 'patient-service',
 *   version: '1.0.0',
 *   host: 'localhost',
 *   port: 3001,
 *   protocol: 'tcp',
 *   healthCheckUrl: '/health',
 *   tags: ['healthcare', 'primary']
 * });
 * ```
 */
export declare function registerServiceInstance(registration: ServiceRegistration): Promise<string>;
/**
 * 42. Creates comprehensive health check status for microservice.
 *
 * @param {string} serviceId - Service identifier
 * @param {string} [version] - Service version
 * @param {number} [startTime=Date.now()] - Service start time
 * @returns {HealthCheckStatus} Health check status
 *
 * @example
 * ```typescript
 * const healthStatus = createHealthCheckStatus('patient-service', '1.0.0', startTime);
 * // Add component checks:
 * healthStatus = addComponentHealthCheck(healthStatus, 'database', dbHealth);
 * healthStatus = addComponentHealthCheck(healthStatus, 'message-broker', mqHealth);
 * ```
 */
export declare function createHealthCheckStatus(serviceId: string, version?: string, startTime?: number): HealthCheckStatus;
/**
 * 43. Adds component health check to overall health status.
 *
 * @param {HealthCheckStatus} status - Overall health status
 * @param {string} componentName - Component name
 * @param {ComponentHealth} componentHealth - Component health details
 * @returns {HealthCheckStatus} Updated health status
 *
 * @example
 * ```typescript
 * const dbHealth: ComponentHealth = {
 *   status: 'pass',
 *   componentType: 'datastore',
 *   observedValue: 15,
 *   observedUnit: 'ms',
 *   time: new Date().toISOString()
 * };
 * const updatedStatus = addComponentHealthCheck(status, 'postgresql', dbHealth);
 * ```
 */
export declare function addComponentHealthCheck(status: HealthCheckStatus, componentName: string, componentHealth: ComponentHealth): HealthCheckStatus;
/**
 * 44. Checks database connectivity for health monitoring.
 *
 * @param {any} connection - Database connection
 * @param {string} [componentId] - Component identifier
 * @returns {Promise<ComponentHealth>} Database health status
 *
 * @example
 * ```typescript
 * const dbHealth = await checkDatabaseHealth(sequelize, 'primary-db');
 * const status = addComponentHealthCheck(healthStatus, 'database', dbHealth);
 * ```
 */
export declare function checkDatabaseHealth(connection: any, componentId?: string): Promise<ComponentHealth>;
/**
 * 45. Checks message broker connectivity (RabbitMQ, Kafka, NATS, Redis).
 *
 * @param {any} client - Message broker client
 * @param {'rabbitmq' | 'kafka' | 'nats' | 'redis'} brokerType - Broker type
 * @param {string} [componentId] - Component identifier
 * @returns {Promise<ComponentHealth>} Broker health status
 *
 * @example
 * ```typescript
 * const kafkaHealth = await checkMessageBrokerHealth(kafkaClient, 'kafka', 'primary-kafka');
 * const status = addComponentHealthCheck(healthStatus, 'message-broker', kafkaHealth);
 * ```
 */
export declare function checkMessageBrokerHealth(client: any, brokerType: 'rabbitmq' | 'kafka' | 'nats' | 'redis', componentId?: string): Promise<ComponentHealth>;
/**
 * 46. Creates idempotency record for exactly-once message processing.
 *
 * @param {string} messageId - Message identifier
 * @param {number} [ttlSeconds=3600] - Time to live in seconds
 * @param {any} [result] - Processing result
 * @returns {IdempotencyRecord} Idempotency record
 *
 * @example
 * ```typescript
 * const record = createIdempotencyRecord('msg_123', 3600);
 * await idempotencyStore.set(messageId, record);
 * ```
 */
export declare function createIdempotencyRecord(messageId: string, ttlSeconds?: number, result?: any): IdempotencyRecord;
/**
 * 47. Checks if message has already been processed (idempotency check).
 *
 * @param {string} messageId - Message identifier
 * @param {Map<string, IdempotencyRecord> | any} store - Idempotency store
 * @returns {Promise<{ processed: boolean; record?: IdempotencyRecord }>} Check result
 *
 * @example
 * ```typescript
 * const { processed, record } = await checkMessageIdempotency(messageId, store);
 * if (processed) {
 *   console.log('Message already processed, returning cached result');
 *   return record.result;
 * }
 * ```
 */
export declare function checkMessageIdempotency(messageId: string, store: Map<string, IdempotencyRecord> | any): Promise<{
    processed: boolean;
    record?: IdempotencyRecord;
}>;
/**
 * 48. Marks message as processed with result caching.
 *
 * @param {string} messageId - Message identifier
 * @param {Map<string, IdempotencyRecord> | any} store - Idempotency store
 * @param {any} result - Processing result
 * @param {number} [ttlSeconds=3600] - Time to live
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markMessageAsProcessed(messageId, store, { patientId: '123', status: 'created' });
 * ```
 */
export declare function markMessageAsProcessed(messageId: string, store: Map<string, IdempotencyRecord> | any, result: any, ttlSeconds?: number): Promise<void>;
/**
 * 49. Creates saga context for distributed transaction orchestration.
 *
 * @param {string} [sagaId] - Saga identifier (auto-generated if not provided)
 * @param {Record<string, any>} [initialData] - Initial saga data
 * @returns {SagaContext} Saga context
 *
 * @example
 * ```typescript
 * const sagaContext = createSagaContext('create-patient-saga', {
 *   patientData: { name: 'John Doe', age: 35 }
 * });
 * ```
 */
export declare function createSagaContext(sagaId?: string, initialData?: Record<string, any>): SagaContext;
/**
 * 50. Executes saga with automatic compensation on failure.
 *
 * @param {SagaStep[]} steps - Saga steps to execute
 * @param {SagaContext} context - Saga context
 * @returns {Promise<SagaContext>} Final saga context
 *
 * @example
 * ```typescript
 * const steps: SagaStep[] = [
 *   {
 *     stepId: 'create-patient',
 *     stepName: 'Create Patient Record',
 *     action: async (ctx) => await createPatient(ctx.data.patientData),
 *     compensation: async (ctx) => await deletePatient(ctx.stepResults['create-patient'].id),
 *     timeout: 5000
 *   },
 *   {
 *     stepId: 'send-notification',
 *     stepName: 'Send Welcome Email',
 *     action: async (ctx) => await sendEmail(ctx.stepResults['create-patient'].email),
 *     compensation: async (ctx) => console.log('Email sent, no compensation needed'),
 *     timeout: 3000
 *   }
 * ];
 *
 * const result = await executeSaga(steps, sagaContext);
 * ```
 */
export declare function executeSaga(steps: SagaStep[], context: SagaContext): Promise<SagaContext>;
/**
 * 51. Compensates saga by rolling back completed steps.
 *
 * @param {SagaStep[]} steps - Saga steps
 * @param {SagaContext} context - Saga context
 * @param {number} failedStepIndex - Index of failed step
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Called automatically by executeSaga on failure
 * await compensateSaga(steps, context, failedStepIndex);
 * ```
 */
export declare function compensateSaga(steps: SagaStep[], context: SagaContext, failedStepIndex: number): Promise<void>;
/**
 * 52. Creates message routing rule for dynamic routing.
 *
 * @param {string | RegExp} pattern - Message pattern to match
 * @param {string} destination - Destination queue/topic
 * @param {number} [priority=0] - Routing priority
 * @param {(message: any) => boolean} [condition] - Additional routing condition
 * @returns {MessageRoutingRule} Routing rule
 *
 * @example
 * ```typescript
 * const rule = createMessageRoutingRule(
 *   /^patient\./,
 *   'patient-queue',
 *   10,
 *   (msg) => msg.priority === 'high'
 * );
 * ```
 */
export declare function createMessageRoutingRule(pattern: string | RegExp, destination: string, priority?: number, condition?: (message: any) => boolean): MessageRoutingRule;
/**
 * 53. Routes message based on routing rules.
 *
 * @param {any} message - Message to route
 * @param {MessageRoutingRule[]} rules - Routing rules
 * @returns {string | null} Destination queue/topic or null
 *
 * @example
 * ```typescript
 * const rules = [
 *   createMessageRoutingRule(/^patient\./, 'patient-queue', 10),
 *   createMessageRoutingRule(/^appointment\./, 'appointment-queue', 5)
 * ];
 *
 * const destination = routeMessage({ event: 'patient.created' }, rules);
 * // Returns: 'patient-queue'
 * ```
 */
export declare function routeMessage(message: any, rules: MessageRoutingRule[]): string | null;
/**
 * 54. Creates priority queue message wrapper.
 *
 * @param {T} payload - Message payload
 * @param {number} priority - Message priority (higher = more important)
 * @returns {PriorityQueueMessage<T>} Priority queue message
 *
 * @example
 * ```typescript
 * const urgentMessage = createPriorityQueueMessage(
 *   { patientId: '123', alert: 'Critical vitals' },
 *   100 // High priority
 * );
 * ```
 */
export declare function createPriorityQueueMessage<T = any>(payload: T, priority: number): PriorityQueueMessage<T>;
/**
 * 55. Creates distributed transaction context for 2PC protocol.
 *
 * @param {string[]} participants - Service participants
 * @param {number} [timeout=30000] - Transaction timeout
 * @returns {DistributedTransactionContext} Transaction context
 *
 * @example
 * ```typescript
 * const txContext = createDistributedTransaction(
 *   ['patient-service', 'billing-service', 'notification-service'],
 *   30000
 * );
 * ```
 */
export declare function createDistributedTransaction(participants: string[], timeout?: number): DistributedTransactionContext;
/**
 * 56. Prepares distributed transaction (Phase 1 of 2PC).
 *
 * @param {DistributedTransactionContext} context - Transaction context
 * @param {(participant: string) => Promise<boolean>} prepareFunc - Prepare function
 * @returns {Promise<boolean>} True if all participants prepared successfully
 *
 * @example
 * ```typescript
 * const allPrepared = await prepareDistributedTransaction(
 *   txContext,
 *   async (participant) => {
 *     const response = await sendPrepareRequest(participant);
 *     return response.canCommit;
 *   }
 * );
 * ```
 */
export declare function prepareDistributedTransaction(context: DistributedTransactionContext, prepareFunc: (participant: string) => Promise<boolean>): Promise<boolean>;
/**
 * 57. Commits or aborts distributed transaction (Phase 2 of 2PC).
 *
 * @param {DistributedTransactionContext} context - Transaction context
 * @param {boolean} commit - True to commit, false to abort
 * @param {(participant: string, commit: boolean) => Promise<void>} commitFunc - Commit/abort function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await commitDistributedTransaction(
 *   txContext,
 *   allPrepared,
 *   async (participant, shouldCommit) => {
 *     if (shouldCommit) {
 *       await sendCommitRequest(participant);
 *     } else {
 *       await sendAbortRequest(participant);
 *     }
 *   }
 * );
 * ```
 */
export declare function commitDistributedTransaction(context: DistributedTransactionContext, commit: boolean, commitFunc: (participant: string, commit: boolean) => Promise<void>): Promise<void>;
declare const _default: {
    createMessagePattern: typeof createMessagePattern;
    createEventPattern: typeof createEventPattern;
    wrapMessageWithMetadata: typeof wrapMessageWithMetadata;
    unwrapMessageEnvelope: typeof unwrapMessageEnvelope;
    generateCorrelationId: typeof generateCorrelationId;
    createRabbitMQConfig: typeof createRabbitMQConfig;
    createDeadLetterQueue: typeof createDeadLetterQueue;
    acknowledgeRabbitMQMessage: typeof acknowledgeRabbitMQMessage;
    rejectRabbitMQMessage: typeof rejectRabbitMQMessage;
    publishToRabbitMQ: typeof publishToRabbitMQ;
    createKafkaConfig: typeof createKafkaConfig;
    createKafkaTopic: typeof createKafkaTopic;
    serializeKafkaMessage: typeof serializeKafkaMessage;
    deserializeKafkaMessage: typeof deserializeKafkaMessage;
    createKafkaConsumerGroup: typeof createKafkaConsumerGroup;
    createNatsConfig: typeof createNatsConfig;
    createNatsSubject: typeof createNatsSubject;
    createNatsQueueGroup: typeof createNatsQueueGroup;
    natsRequestReply: typeof natsRequestReply;
    publishToNats: typeof publishToNats;
    createRedisConfig: typeof createRedisConfig;
    createRedisChannel: typeof createRedisChannel;
    publishToRedis: typeof publishToRedis;
    subscribeToRedisPattern: typeof subscribeToRedisPattern;
    publishWithTTL: typeof publishWithTTL;
    validateMessagePayload: typeof validateMessagePayload;
    validateFieldType: typeof validateFieldType;
    sanitizeMessagePayload: typeof sanitizeMessagePayload;
    validateMessageSize: typeof validateMessageSize;
    createHealthcareMessageSchema: typeof createHealthcareMessageSchema;
    createRetryPolicy: typeof createRetryPolicy;
    calculateRetryDelay: typeof calculateRetryDelay;
    executeWithRetry: typeof executeWithRetry;
    executeWithRetryObservable: typeof executeWithRetryObservable;
    createRetryPolicyForErrors: typeof createRetryPolicyForErrors;
    createCircuitBreakerState: typeof createCircuitBreakerState;
    updateCircuitBreakerState: typeof updateCircuitBreakerState;
    canExecuteOperation: typeof canExecuteOperation;
    executeWithCircuitBreaker: typeof executeWithCircuitBreaker;
    createCircuitBreakerConfig: typeof createCircuitBreakerConfig;
    registerServiceInstance: typeof registerServiceInstance;
    createHealthCheckStatus: typeof createHealthCheckStatus;
    addComponentHealthCheck: typeof addComponentHealthCheck;
    checkDatabaseHealth: typeof checkDatabaseHealth;
    checkMessageBrokerHealth: typeof checkMessageBrokerHealth;
    createIdempotencyRecord: typeof createIdempotencyRecord;
    checkMessageIdempotency: typeof checkMessageIdempotency;
    markMessageAsProcessed: typeof markMessageAsProcessed;
    createSagaContext: typeof createSagaContext;
    executeSaga: typeof executeSaga;
    compensateSaga: typeof compensateSaga;
    createMessageRoutingRule: typeof createMessageRoutingRule;
    routeMessage: typeof routeMessage;
    createPriorityQueueMessage: typeof createPriorityQueueMessage;
    createDistributedTransaction: typeof createDistributedTransaction;
    prepareDistributedTransaction: typeof prepareDistributedTransaction;
    commitDistributedTransaction: typeof commitDistributedTransaction;
};
export default _default;
//# sourceMappingURL=microservices-messaging-kit.d.ts.map