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
import { Observable } from 'rxjs';
interface MessagePattern {
    cmd: string;
    version?: string;
    metadata?: Record<string, any>;
}
interface EventPattern {
    event: string;
    aggregateId?: string;
    version?: number;
    timestamp: Date;
    metadata?: Record<string, any>;
}
interface RabbitMQConfig {
    urls: string[];
    queue: string;
    queueOptions?: {
        durable?: boolean;
        exclusive?: boolean;
        autoDelete?: boolean;
        arguments?: Record<string, any>;
    };
    prefetchCount?: number;
    noAck?: boolean;
    socketOptions?: Record<string, any>;
}
interface KafkaConfig {
    clientId: string;
    brokers: string[];
    groupId: string;
    ssl?: boolean;
    sasl?: {
        mechanism: string;
        username: string;
        password: string;
    };
    retry?: {
        initialRetryTime: number;
        retries: number;
    };
}
interface GrpcConfig {
    package: string;
    protoPath: string;
    url: string;
    maxReceiveMessageLength?: number;
    maxSendMessageLength?: number;
    keepalive?: {
        keepaliveTimeMs: number;
        keepaliveTimeoutMs: number;
        keepalivePermitWithoutCalls: number;
    };
    loader?: Record<string, any>;
}
interface NatsConfig {
    servers: string[];
    user?: string;
    pass?: string;
    token?: string;
    maxReconnectAttempts?: number;
    reconnectTimeWait?: number;
    queue?: string;
}
interface RetryPolicy {
    maxAttempts: number;
    backoffType: 'fixed' | 'exponential' | 'linear';
    initialDelay: number;
    maxDelay?: number;
    multiplier?: number;
    shouldRetry?: (error: any) => boolean;
}
interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    resetTimeout: number;
    monitoringPeriod?: number;
}
interface CircuitBreakerState {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    successCount: number;
    lastFailureTime: number;
    nextAttemptTime: number;
}
interface DeadLetterQueueConfig {
    queueName: string;
    exchange?: string;
    routingKey?: string;
    maxRetries: number;
    retryDelay: number;
    ttl?: number;
}
interface MessageValidationRule {
    field: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'uuid' | 'email';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean | Promise<boolean>;
}
interface ServiceRegistration {
    serviceId: string;
    serviceName: string;
    version: string;
    host: string;
    port: number;
    protocol: 'tcp' | 'http' | 'grpc' | 'nats' | 'rabbitmq' | 'kafka';
    healthCheckUrl?: string;
    metadata?: Record<string, any>;
    tags?: string[];
}
interface ServiceDiscoveryResult {
    instances: ServiceRegistration[];
    strategy: 'round-robin' | 'random' | 'least-connections' | 'weighted';
}
interface HealthCheckStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: Date;
    uptime: number;
    checks: Record<string, ComponentHealth>;
    version?: string;
}
interface ComponentHealth {
    status: 'pass' | 'fail' | 'warn';
    componentType: string;
    observedValue?: any;
    observedUnit?: string;
    time?: string;
    output?: string;
}
interface RequestContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    userId?: string;
    tenantId?: string;
    correlationId: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
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
export declare const createMessagePattern: (cmd: string, version?: string, metadata?: Record<string, any>) => MessagePattern;
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
export declare const createEventPattern: (event: string, aggregateId?: string, version?: number, metadata?: Record<string, any>) => EventPattern;
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
export declare const wrapMessageWithContext: (payload: any, context: RequestContext) => {
    payload: any;
    context: RequestContext;
};
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
export declare const extractMessageContext: (message: any) => {
    payload: any;
    context: RequestContext | null;
};
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
export declare const generateCorrelationId: (prefix?: string) => string;
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
export declare const createRabbitMQConfig: (queue: string, urls: string[], options?: Partial<RabbitMQConfig>) => RabbitMQConfig;
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
export declare const createRabbitMQExchange: (exchange: string, type: "direct" | "topic" | "fanout" | "headers", routingKey?: string) => Record<string, any>;
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
export declare const createDeadLetterQueue: (originalQueue: string, maxRetries?: number, retryDelay?: number) => DeadLetterQueueConfig;
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
export declare const acknowledgeMessage: (channel: any, message: any, requeue?: boolean) => void;
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
export declare const rejectMessage: (channel: any, message: any, requeue?: boolean, reason?: string) => void;
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
export declare const createKafkaConfig: (clientId: string, brokers: string[], groupId: string, options?: Partial<KafkaConfig>) => KafkaConfig;
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
export declare const createKafkaTopic: (topic: string, numPartitions?: number, replicationFactor?: number) => Record<string, any>;
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
export declare const serializeKafkaMessage: (data: any, headers?: Record<string, any>) => {
    value: string;
    headers?: Record<string, any>;
};
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
export declare const deserializeKafkaMessage: (message: any) => {
    data: any;
    headers: Record<string, any> | null;
    error?: string;
};
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
export declare const createKafkaConsumer: (config: KafkaConfig, topics: string[], autoCommit?: boolean) => Record<string, any>;
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
export declare const createGrpcConfig: (packageName: string, protoPath: string, url: string, options?: Partial<GrpcConfig>) => GrpcConfig;
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
export declare const createGrpcMetadata: (metadata: Record<string, string>) => Map<string, string>;
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
export declare const handleGrpcStream: (stream$: Observable<any>, onData: (data: any) => void, onError?: (error: any) => void) => void;
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
export declare const createGrpcError: (code: number, message: string, details?: Record<string, any>) => Error;
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
export declare const validateGrpcService: (serviceDefinition: any, requiredMethods: string[]) => {
    valid: boolean;
    missing?: string[];
};
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
export declare const createNatsConfig: (servers: string[], options?: Partial<NatsConfig>) => NatsConfig;
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
export declare const createNatsSubject: (domain: string, entity: string, action: string, wildcard?: string) => string;
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
export declare const createNatsQueueGroup: (serviceName: string, environment?: string) => string;
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
export declare const natsRequestReply: (client: any, subject: string, data: any, timeoutMs?: number) => Promise<any>;
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
export declare const validateMessagePayload: (payload: any, rules: MessageValidationRule[]) => {
    valid: boolean;
    errors?: string[];
};
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
export declare const validateFieldType: (value: any, type: string) => boolean;
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
export declare const sanitizeMessagePayload: (payload: any, sensitiveFields: string[]) => any;
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
export declare const validateMessageSize: (payload: any, maxSizeBytes: number) => {
    valid: boolean;
    size: number;
    maxSize: number;
};
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
export declare const createHealthcareMessageSchema: (entityType: "patient" | "appointment" | "prescription" | "vital-signs") => MessageValidationRule[];
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
export declare const createRetryPolicy: (maxAttempts: number, backoffType: "fixed" | "exponential" | "linear", initialDelay: number, options?: Partial<RetryPolicy>) => RetryPolicy;
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
export declare const calculateRetryDelay: (policy: RetryPolicy, attempt: number) => number;
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
export declare const executeWithRetry: (operation: () => Observable<any>, policy: RetryPolicy) => Observable<any>;
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
export declare const createCircuitBreakerState: () => CircuitBreakerState;
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
export declare const updateCircuitBreakerState: (state: CircuitBreakerState, config: CircuitBreakerConfig, success: boolean) => CircuitBreakerState;
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
export declare const canExecuteOperation: (state: CircuitBreakerState, config: CircuitBreakerConfig) => {
    allowed: boolean;
    reason?: string;
};
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
export declare const executeWithCircuitBreaker: (operation: () => Promise<any>, state: CircuitBreakerState, config: CircuitBreakerConfig, onStateChange: (state: CircuitBreakerState) => void) => Promise<any>;
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
export declare const registerService: (registration: ServiceRegistration) => Promise<string>;
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
export declare const discoverService: (serviceName: string, version?: string, tags?: string[]) => Promise<ServiceDiscoveryResult>;
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
export declare const selectServiceInstance: (discoveryResult: ServiceDiscoveryResult, strategy?: "round-robin" | "random" | "least-connections") => ServiceRegistration | null;
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
export declare const deregisterService: (serviceId: string) => Promise<void>;
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
export declare const createHealthCheckStatus: (version?: string, startTime?: number) => HealthCheckStatus;
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
export declare const addHealthCheck: (status: HealthCheckStatus, componentName: string, componentHealth: ComponentHealth) => HealthCheckStatus;
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
export declare const checkDatabaseHealth: (connection: any) => Promise<ComponentHealth>;
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
export declare const checkMessageBrokerHealth: (client: any, brokerType: "rabbitmq" | "kafka" | "nats" | "redis") => Promise<ComponentHealth>;
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
export declare const createHealthCheckResponse: (status: HealthCheckStatus, detailed?: boolean) => Record<string, any>;
export {};
//# sourceMappingURL=microservices-kit.d.ts.map