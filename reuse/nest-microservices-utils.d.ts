/**
 * LOC: 9F1E847C3D
 * File: /reuse/nest-microservices-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/microservices
 *   - @nestjs/common
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Microservice implementations
 *   - Service orchestrators
 *   - Message handlers
 */
/**
 * File: /reuse/nest-microservices-utils.ts
 * Locator: WC-UTL-MICRO-001
 * Purpose: NestJS Microservices Architecture Utilities - Transport, messaging, and distributed patterns
 *
 * Upstream: @nestjs/microservices, rxjs, @nestjs/common
 * Downstream: Healthcare microservices, event-driven architecture, service orchestration
 * Dependencies: NestJS v11.x, TypeScript 5.x, Node 18+
 * Exports: 45+ microservices utilities for transport layers, message patterns, circuit breakers, sagas
 *
 * LLM Context: Comprehensive NestJS microservices utilities for White Cross healthcare platform.
 * Provides transport layer helpers (TCP, Redis, NATS, RabbitMQ, Kafka, gRPC), message patterns,
 * circuit breakers, service discovery, load balancing, health checks, distributed tracing,
 * retry/timeout strategies, dead letter queues, and saga pattern implementations.
 * Critical for building scalable, resilient HIPAA-compliant microservices architecture.
 */
import { Transport, ClientProxy, MicroserviceOptions } from '@nestjs/microservices';
import { Observable } from 'rxjs';
/**
 * Transport configuration types for different message brokers
 */
export interface TcpTransportConfig {
    host: string;
    port: number;
    retryAttempts?: number;
    retryDelay?: number;
}
export interface RedisTransportConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
    retryAttempts?: number;
    retryDelay?: number;
    wildcards?: boolean;
}
export interface NatsTransportConfig {
    servers: string[];
    user?: string;
    pass?: string;
    token?: string;
    maxReconnectAttempts?: number;
    reconnectTimeWait?: number;
    queue?: string;
}
export interface RabbitMQTransportConfig {
    urls: string[];
    queue: string;
    queueOptions?: {
        durable?: boolean;
        arguments?: Record<string, any>;
    };
    prefetchCount?: number;
    noAck?: boolean;
    persistent?: boolean;
}
export interface KafkaTransportConfig {
    clientId: string;
    brokers: string[];
    groupId: string;
    ssl?: boolean;
    sasl?: {
        mechanism: string;
        username: string;
        password: string;
    };
    allowAutoTopicCreation?: boolean;
}
export interface GrpcTransportConfig {
    package: string;
    protoPath: string;
    url: string;
    maxReceiveMessageLength?: number;
    maxSendMessageLength?: number;
    keepalive?: {
        keepaliveTimeMs?: number;
        keepaliveTimeoutMs?: number;
        keepalivePermitWithoutCalls?: number;
    };
    loader?: {
        keepCase?: boolean;
        longs?: any;
        enums?: any;
        defaults?: boolean;
        oneofs?: boolean;
    };
}
export interface MqttTransportConfig {
    url: string;
    username?: string;
    password?: string;
    clientId?: string;
    clean?: boolean;
    keepalive?: number;
    reconnectPeriod?: number;
}
/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
    failureThreshold?: number;
    successThreshold?: number;
    timeout?: number;
    resetTimeout?: number;
}
/**
 * Circuit breaker states
 */
export declare enum CircuitState {
    CLOSED = "CLOSED",
    OPEN = "OPEN",
    HALF_OPEN = "HALF_OPEN"
}
/**
 * Retry configuration for message patterns
 */
export interface RetryConfig {
    maxAttempts?: number;
    delay?: number;
    backoff?: 'linear' | 'exponential';
    maxDelay?: number;
}
/**
 * Timeout configuration
 */
export interface TimeoutConfig {
    duration: number;
    fallbackValue?: any;
}
/**
 * Service discovery entry
 */
export interface ServiceInstance {
    id: string;
    name: string;
    host: string;
    port: number;
    transport: Transport;
    metadata?: Record<string, any>;
    healthCheckUrl?: string;
    lastHeartbeat?: Date;
}
/**
 * Health check response
 */
export interface HealthCheckResponse {
    status: 'up' | 'down' | 'degraded';
    timestamp: Date;
    service: string;
    details?: Record<string, any>;
}
/**
 * Saga step definition
 */
export interface SagaStep {
    name: string;
    execute: () => Promise<any>;
    compensate: (error?: any) => Promise<void>;
}
/**
 * Dead letter queue message
 */
export interface DLQMessage {
    originalMessage: any;
    error: string;
    timestamp: Date;
    retryCount: number;
    pattern?: string;
}
/**
 * Message metadata for distributed tracing
 */
export interface MessageMetadata {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    timestamp: Date;
    service: string;
    pattern?: string;
    correlationId?: string;
}
/**
 * Creates a TCP transport configuration for NestJS microservices.
 *
 * @param {TcpTransportConfig} config - TCP transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for TCP transport
 *
 * @example
 * ```typescript
 * const tcpConfig = createTcpTransport({
 *   host: '0.0.0.0',
 *   port: 3001,
 *   retryAttempts: 5,
 *   retryDelay: 3000,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, tcpConfig);
 * ```
 */
export declare function createTcpTransport(config: TcpTransportConfig): MicroserviceOptions;
/**
 * Creates a Redis pub/sub transport configuration for NestJS microservices.
 *
 * @param {RedisTransportConfig} config - Redis transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for Redis transport
 *
 * @example
 * ```typescript
 * const redisConfig = createRedisTransport({
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'secret',
 *   wildcards: true,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, redisConfig);
 * ```
 */
export declare function createRedisTransport(config: RedisTransportConfig): MicroserviceOptions;
/**
 * Creates a NATS transport configuration for NestJS microservices.
 *
 * @param {NatsTransportConfig} config - NATS transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for NATS transport
 *
 * @example
 * ```typescript
 * const natsConfig = createNatsTransport({
 *   servers: ['nats://localhost:4222'],
 *   queue: 'healthcare-queue',
 *   maxReconnectAttempts: 10,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, natsConfig);
 * ```
 */
export declare function createNatsTransport(config: NatsTransportConfig): MicroserviceOptions;
/**
 * Creates a RabbitMQ transport configuration for NestJS microservices.
 *
 * @param {RabbitMQTransportConfig} config - RabbitMQ transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for RabbitMQ transport
 *
 * @example
 * ```typescript
 * const rabbitConfig = createRabbitMQTransport({
 *   urls: ['amqp://localhost:5672'],
 *   queue: 'orders_queue',
 *   queueOptions: { durable: true },
 *   prefetchCount: 10,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, rabbitConfig);
 * ```
 */
export declare function createRabbitMQTransport(config: RabbitMQTransportConfig): MicroserviceOptions;
/**
 * Creates a Kafka transport configuration for NestJS microservices.
 *
 * @param {KafkaTransportConfig} config - Kafka transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for Kafka transport
 *
 * @example
 * ```typescript
 * const kafkaConfig = createKafkaTransport({
 *   clientId: 'healthcare-service',
 *   brokers: ['localhost:9092'],
 *   groupId: 'healthcare-consumer-group',
 *   allowAutoTopicCreation: true,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, kafkaConfig);
 * ```
 */
export declare function createKafkaTransport(config: KafkaTransportConfig): MicroserviceOptions;
/**
 * Creates a gRPC transport configuration for NestJS microservices.
 *
 * @param {GrpcTransportConfig} config - gRPC transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for gRPC transport
 *
 * @example
 * ```typescript
 * const grpcConfig = createGrpcTransport({
 *   package: 'healthcare',
 *   protoPath: join(__dirname, '../proto/healthcare.proto'),
 *   url: '0.0.0.0:5000',
 * });
 * const app = await NestFactory.createMicroservice(AppModule, grpcConfig);
 * ```
 */
export declare function createGrpcTransport(config: GrpcTransportConfig): MicroserviceOptions;
/**
 * Creates an MQTT transport configuration for NestJS microservices.
 *
 * @param {MqttTransportConfig} config - MQTT transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for MQTT transport
 *
 * @example
 * ```typescript
 * const mqttConfig = createMqttTransport({
 *   url: 'mqtt://localhost:1883',
 *   clientId: 'healthcare-iot',
 *   clean: true,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, mqttConfig);
 * ```
 */
export declare function createMqttTransport(config: MqttTransportConfig): MicroserviceOptions;
/**
 * Creates a TCP client proxy for communicating with microservices.
 *
 * @param {TcpTransportConfig} config - TCP client configuration
 * @returns {ClientProxy} NestJS client proxy for TCP communication
 *
 * @example
 * ```typescript
 * const client = createTcpClient({ host: 'localhost', port: 3001 });
 * await client.connect();
 * const result = await firstValueFrom(client.send('get_user', { id: '123' }));
 * ```
 */
export declare function createTcpClient(config: TcpTransportConfig): ClientProxy;
/**
 * Creates a Redis client proxy for pub/sub communication.
 *
 * @param {RedisTransportConfig} config - Redis client configuration
 * @returns {ClientProxy} NestJS client proxy for Redis communication
 *
 * @example
 * ```typescript
 * const client = createRedisClient({ host: 'localhost', port: 6379 });
 * await client.connect();
 * client.emit('user_created', { id: '123', name: 'John' });
 * ```
 */
export declare function createRedisClient(config: RedisTransportConfig): ClientProxy;
/**
 * Creates a NATS client proxy for messaging.
 *
 * @param {NatsTransportConfig} config - NATS client configuration
 * @returns {ClientProxy} NestJS client proxy for NATS communication
 *
 * @example
 * ```typescript
 * const client = createNatsClient({ servers: ['nats://localhost:4222'] });
 * await client.connect();
 * const result = await firstValueFrom(client.send('process_order', orderData));
 * ```
 */
export declare function createNatsClient(config: NatsTransportConfig): ClientProxy;
/**
 * Creates a RabbitMQ client proxy for AMQP messaging.
 *
 * @param {RabbitMQTransportConfig} config - RabbitMQ client configuration
 * @returns {ClientProxy} NestJS client proxy for RabbitMQ communication
 *
 * @example
 * ```typescript
 * const client = createRabbitMQClient({
 *   urls: ['amqp://localhost:5672'],
 *   queue: 'tasks_queue',
 * });
 * await client.connect();
 * ```
 */
export declare function createRabbitMQClient(config: RabbitMQTransportConfig): ClientProxy;
/**
 * Creates a Kafka client proxy for event streaming.
 *
 * @param {KafkaTransportConfig} config - Kafka client configuration
 * @returns {ClientProxy} NestJS client proxy for Kafka communication
 *
 * @example
 * ```typescript
 * const client = createKafkaClient({
 *   clientId: 'notification-service',
 *   brokers: ['localhost:9092'],
 *   groupId: 'notification-group',
 * });
 * await client.connect();
 * ```
 */
export declare function createKafkaClient(config: KafkaTransportConfig): ClientProxy;
/**
 * Sends a request-response message with timeout and error handling.
 *
 * @template T - Expected response type
 * @param {ClientProxy} client - NestJS client proxy
 * @param {string} pattern - Message pattern identifier
 * @param {any} data - Request payload
 * @param {TimeoutConfig} [timeoutConfig] - Optional timeout configuration
 * @returns {Promise<T>} Response from microservice
 *
 * @example
 * ```typescript
 * const user = await sendWithTimeout<User>(
 *   client,
 *   'get_user',
 *   { id: '123' },
 *   { duration: 5000 }
 * );
 * ```
 */
export declare function sendWithTimeout<T>(client: ClientProxy, pattern: string, data: any, timeoutConfig?: TimeoutConfig): Promise<T>;
/**
 * Sends a request with automatic retry logic on failure.
 *
 * @template T - Expected response type
 * @param {ClientProxy} client - NestJS client proxy
 * @param {string} pattern - Message pattern identifier
 * @param {any} data - Request payload
 * @param {RetryConfig} [retryConfig] - Retry configuration
 * @returns {Promise<T>} Response from microservice
 *
 * @example
 * ```typescript
 * const order = await sendWithRetry<Order>(
 *   client,
 *   'process_order',
 *   orderData,
 *   { maxAttempts: 3, delay: 1000, backoff: 'exponential' }
 * );
 * ```
 */
export declare function sendWithRetry<T>(client: ClientProxy, pattern: string, data: any, retryConfig?: RetryConfig): Promise<T>;
/**
 * Emits an event to all subscribed microservices (fire and forget).
 *
 * @param {ClientProxy} client - NestJS client proxy
 * @param {string} pattern - Event pattern identifier
 * @param {any} data - Event payload
 * @param {MessageMetadata} [metadata] - Optional tracing metadata
 *
 * @example
 * ```typescript
 * emitEvent(client, 'patient_admitted', {
 *   patientId: '123',
 *   admissionDate: new Date(),
 * });
 * ```
 */
export declare function emitEvent(client: ClientProxy, pattern: string, data: any, metadata?: MessageMetadata): void;
/**
 * Sends a batch of messages in parallel.
 *
 * @template T - Expected response type
 * @param {ClientProxy} client - NestJS client proxy
 * @param {Array<{ pattern: string; data: any }>} messages - Array of messages to send
 * @returns {Promise<T[]>} Array of responses
 *
 * @example
 * ```typescript
 * const results = await sendBatch<User>(client, [
 *   { pattern: 'get_user', data: { id: '1' } },
 *   { pattern: 'get_user', data: { id: '2' } },
 *   { pattern: 'get_user', data: { id: '3' } },
 * ]);
 * ```
 */
export declare function sendBatch<T>(client: ClientProxy, messages: Array<{
    pattern: string;
    data: any;
}>): Promise<T[]>;
/**
 * Creates an observable stream for real-time data from microservice.
 *
 * @template T - Expected stream item type
 * @param {ClientProxy} client - NestJS client proxy
 * @param {string} pattern - Stream pattern identifier
 * @param {any} data - Stream request parameters
 * @returns {Observable<T>} Observable stream of data
 *
 * @example
 * ```typescript
 * const vitals$ = streamData<VitalSign>(client, 'stream_vitals', { patientId: '123' });
 * vitals$.subscribe(vital => console.log('Vital sign:', vital));
 * ```
 */
export declare function streamData<T>(client: ClientProxy, pattern: string, data: any): Observable<T>;
/**
 * Circuit breaker class for preventing cascading failures in microservices.
 * Implements the circuit breaker pattern with CLOSED, OPEN, and HALF_OPEN states.
 *
 * @example
 * ```typescript
 * const breaker = new CircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000,
 * });
 *
 * const result = await breaker.execute(async () => {
 *   return await someRiskyOperation();
 * });
 * ```
 */
export declare class CircuitBreaker {
    private state;
    private failureCount;
    private successCount;
    private lastFailureTime;
    private readonly logger;
    private readonly failureThreshold;
    private readonly successThreshold;
    private readonly timeout;
    private readonly resetTimeout;
    constructor(config?: CircuitBreakerConfig);
    /**
     * Executes an operation with circuit breaker protection.
     *
     * @template T - Return type of the operation
     * @param {() => Promise<T>} operation - Async operation to execute
     * @returns {Promise<T>} Result of the operation
     * @throws {Error} If circuit is OPEN or operation fails
     */
    execute<T>(operation: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    /**
     * Gets the current circuit breaker state.
     *
     * @returns {CircuitState} Current state (CLOSED, OPEN, or HALF_OPEN)
     */
    getState(): CircuitState;
    /**
     * Manually resets the circuit breaker to CLOSED state.
     */
    reset(): void;
}
/**
 * Creates a circuit breaker wrapper for a client proxy.
 *
 * @param {ClientProxy} client - NestJS client proxy to wrap
 * @param {CircuitBreakerConfig} [config] - Circuit breaker configuration
 * @returns {Object} Wrapped client with circuit breaker protection
 *
 * @example
 * ```typescript
 * const protectedClient = wrapWithCircuitBreaker(client, {
 *   failureThreshold: 3,
 *   timeout: 5000,
 * });
 *
 * const result = await protectedClient.send('get_data', { id: '123' });
 * ```
 */
export declare function wrapWithCircuitBreaker(client: ClientProxy, config?: CircuitBreakerConfig): {
    send: <T>(pattern: string, data: any) => Promise<T>;
    emit: (pattern: string, data: any) => void;
    getState: () => CircuitState;
};
/**
 * Simple service registry for microservice discovery.
 */
export declare class ServiceRegistry {
    private services;
    private readonly logger;
    /**
     * Registers a service instance in the registry.
     *
     * @param {ServiceInstance} instance - Service instance to register
     */
    register(instance: ServiceInstance): void;
    /**
     * Deregisters a service instance from the registry.
     *
     * @param {string} serviceName - Name of the service
     * @param {string} instanceId - Instance ID to deregister
     */
    deregister(serviceName: string, instanceId: string): void;
    /**
     * Gets all instances of a service.
     *
     * @param {string} serviceName - Name of the service
     * @returns {ServiceInstance[]} Array of service instances
     */
    getInstances(serviceName: string): ServiceInstance[];
    /**
     * Updates heartbeat for a service instance.
     *
     * @param {string} serviceName - Name of the service
     * @param {string} instanceId - Instance ID
     */
    heartbeat(serviceName: string, instanceId: string): void;
    /**
     * Removes stale instances that haven't sent heartbeat.
     *
     * @param {number} [maxAge=30000] - Maximum age in milliseconds (default 30s)
     */
    cleanupStaleInstances(maxAge?: number): void;
}
/**
 * Round-robin load balancer for microservice instances.
 *
 * @example
 * ```typescript
 * const loadBalancer = new RoundRobinLoadBalancer();
 * const instance = loadBalancer.selectInstance('user-service', instances);
 * ```
 */
export declare class RoundRobinLoadBalancer {
    private currentIndex;
    /**
     * Selects next instance using round-robin strategy.
     *
     * @param {string} serviceName - Name of the service
     * @param {ServiceInstance[]} instances - Available service instances
     * @returns {ServiceInstance | null} Selected instance or null if none available
     */
    selectInstance(serviceName: string, instances: ServiceInstance[]): ServiceInstance | null;
    /**
     * Resets the load balancer index for a service.
     *
     * @param {string} serviceName - Name of the service to reset
     */
    reset(serviceName: string): void;
}
/**
 * Random load balancer for microservice instances.
 *
 * @example
 * ```typescript
 * const loadBalancer = new RandomLoadBalancer();
 * const instance = loadBalancer.selectInstance(instances);
 * ```
 */
export declare class RandomLoadBalancer {
    /**
     * Selects a random instance.
     *
     * @param {ServiceInstance[]} instances - Available service instances
     * @returns {ServiceInstance | null} Randomly selected instance or null if none available
     */
    selectInstance(instances: ServiceInstance[]): ServiceInstance | null;
}
/**
 * Creates a standardized health check response.
 *
 * @param {string} serviceName - Name of the service
 * @param {'up' | 'down' | 'degraded'} status - Health status
 * @param {Record<string, any>} [details] - Additional health details
 * @returns {HealthCheckResponse} Health check response object
 *
 * @example
 * ```typescript
 * const health = createHealthCheckResponse('user-service', 'up', {
 *   database: 'connected',
 *   redis: 'connected',
 *   uptime: process.uptime(),
 * });
 * ```
 */
export declare function createHealthCheckResponse(serviceName: string, status: 'up' | 'down' | 'degraded', details?: Record<string, any>): HealthCheckResponse;
/**
 * Performs health check on a microservice instance.
 *
 * @param {ServiceInstance} instance - Service instance to check
 * @param {number} [timeout=5000] - Health check timeout in milliseconds
 * @returns {Promise<HealthCheckResponse>} Health check response
 *
 * @example
 * ```typescript
 * const health = await performHealthCheck(serviceInstance, 3000);
 * if (health.status === 'up') {
 *   // Service is healthy
 * }
 * ```
 */
export declare function performHealthCheck(instance: ServiceInstance, timeout?: number): Promise<HealthCheckResponse>;
/**
 * Generates a unique trace ID for distributed tracing.
 *
 * @returns {string} Unique trace ID
 *
 * @example
 * ```typescript
 * const traceId = generateTraceId();
 * // Returns: '1a2b3c4d5e6f7g8h'
 * ```
 */
export declare function generateTraceId(): string;
/**
 * Generates a unique span ID for distributed tracing.
 *
 * @returns {string} Unique span ID
 *
 * @example
 * ```typescript
 * const spanId = generateSpanId();
 * // Returns: 'abc123def456'
 * ```
 */
export declare function generateSpanId(): string;
/**
 * Creates message metadata for distributed tracing.
 *
 * @param {string} serviceName - Name of the current service
 * @param {string} [pattern] - Message pattern
 * @param {string} [parentTraceId] - Parent trace ID for nested calls
 * @param {string} [parentSpanId] - Parent span ID for nested calls
 * @returns {MessageMetadata} Message metadata with tracing information
 *
 * @example
 * ```typescript
 * const metadata = createMessageMetadata('user-service', 'get_user');
 * client.emit('user_fetched', { userId: '123', _metadata: metadata });
 * ```
 */
export declare function createMessageMetadata(serviceName: string, pattern?: string, parentTraceId?: string, parentSpanId?: string): MessageMetadata;
/**
 * Extracts metadata from a message payload.
 *
 * @param {any} payload - Message payload
 * @returns {MessageMetadata | null} Extracted metadata or null if not found
 *
 * @example
 * ```typescript
 * @EventPattern('user_created')
 * async handleUserCreated(data: any) {
 *   const metadata = extractMessageMetadata(data);
 *   if (metadata) {
 *     console.log('Trace ID:', metadata.traceId);
 *   }
 * }
 * ```
 */
export declare function extractMessageMetadata(payload: any): MessageMetadata | null;
/**
 * Logs a distributed trace event.
 *
 * @param {MessageMetadata} metadata - Message metadata
 * @param {string} event - Event name
 * @param {any} [data] - Additional event data
 *
 * @example
 * ```typescript
 * const metadata = createMessageMetadata('order-service', 'create_order');
 * logTraceEvent(metadata, 'order_created', { orderId: '123' });
 * ```
 */
export declare function logTraceEvent(metadata: MessageMetadata, event: string, data?: any): void;
/**
 * Dead Letter Queue (DLQ) handler for failed messages.
 */
export declare class DeadLetterQueue {
    private messages;
    private readonly logger;
    private readonly maxSize;
    constructor(maxSize?: number);
    /**
     * Adds a failed message to the DLQ.
     *
     * @param {any} message - Original message that failed
     * @param {Error} error - Error that caused the failure
     * @param {string} [pattern] - Message pattern
     * @param {number} [retryCount=0] - Number of retry attempts
     */
    add(message: any, error: Error, pattern?: string, retryCount?: number): void;
    /**
     * Gets all messages in the DLQ.
     *
     * @returns {DLQMessage[]} Array of failed messages
     */
    getMessages(): DLQMessage[];
    /**
     * Gets messages by pattern.
     *
     * @param {string} pattern - Message pattern to filter by
     * @returns {DLQMessage[]} Filtered messages
     */
    getMessagesByPattern(pattern: string): DLQMessage[];
    /**
     * Removes a message from the DLQ.
     *
     * @param {number} index - Index of the message to remove
     */
    remove(index: number): void;
    /**
     * Clears all messages from the DLQ.
     */
    clear(): void;
    /**
     * Gets the current size of the DLQ.
     *
     * @returns {number} Number of messages in DLQ
     */
    size(): number;
}
/**
 * Processes a message with automatic DLQ handling on failure.
 *
 * @template T - Expected return type
 * @param {() => Promise<T>} operation - Operation to execute
 * @param {DeadLetterQueue} dlq - Dead letter queue instance
 * @param {any} message - Original message
 * @param {string} [pattern] - Message pattern
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const dlq = new DeadLetterQueue();
 * const result = await processWithDLQ(
 *   async () => await processOrder(orderData),
 *   dlq,
 *   orderData,
 *   'process_order',
 *   3
 * );
 * ```
 */
export declare function processWithDLQ<T>(operation: () => Promise<T>, dlq: DeadLetterQueue, message: any, pattern?: string, maxRetries?: number): Promise<T>;
/**
 * Saga orchestrator for managing distributed transactions.
 *
 * @example
 * ```typescript
 * const saga = new SagaOrchestrator('create-appointment');
 *
 * saga.addStep({
 *   name: 'reserve-slot',
 *   execute: async () => await slotService.reserve(slotId),
 *   compensate: async () => await slotService.release(slotId),
 * });
 *
 * await saga.execute();
 * ```
 */
export declare class SagaOrchestrator {
    private readonly sagaId;
    private steps;
    private executedSteps;
    private readonly logger;
    constructor(sagaId: string);
    /**
     * Adds a step to the saga.
     *
     * @param {SagaStep} step - Saga step definition
     */
    addStep(step: SagaStep): void;
    /**
     * Executes the saga with all its steps.
     * Automatically compensates on failure.
     *
     * @returns {Promise<void>}
     * @throws {Error} If saga execution fails
     */
    execute(): Promise<void>;
    /**
     * Compensates executed steps in reverse order.
     *
     * @param {any} [error] - Error that triggered compensation
     */
    private compensate;
    /**
     * Gets the saga ID.
     *
     * @returns {string} Saga identifier
     */
    getSagaId(): string;
    /**
     * Gets the number of executed steps.
     *
     * @returns {number} Count of executed steps
     */
    getExecutedStepsCount(): number;
    /**
     * Resets the saga to initial state.
     */
    reset(): void;
}
/**
 * Generates a unique saga ID.
 *
 * @param {string} [prefix='saga'] - Optional prefix for the saga ID
 * @returns {string} Unique saga identifier
 *
 * @example
 * ```typescript
 * const sagaId = generateSagaId('order');
 * // Returns: 'order_1699564800000_abc123'
 * ```
 */
export declare function generateSagaId(prefix?: string): string;
/**
 * Creates a saga step with execute and compensate functions.
 *
 * @param {string} name - Step name
 * @param {() => Promise<any>} execute - Execute function
 * @param {(error?: any) => Promise<void>} compensate - Compensation function
 * @returns {SagaStep} Saga step definition
 *
 * @example
 * ```typescript
 * const step = createSagaStep(
 *   'charge-payment',
 *   async () => await paymentService.charge(amount),
 *   async () => await paymentService.refund(amount)
 * );
 * ```
 */
export declare function createSagaStep(name: string, execute: () => Promise<any>, compensate: (error?: any) => Promise<void>): SagaStep;
/**
 * Serializes a message to JSON string.
 *
 * @param {any} message - Message to serialize
 * @returns {string} Serialized JSON string
 *
 * @example
 * ```typescript
 * const serialized = serializeMessage({ id: '123', name: 'John' });
 * // Returns: '{"id":"123","name":"John"}'
 * ```
 */
export declare function serializeMessage(message: any): string;
/**
 * Deserializes a JSON string to object.
 *
 * @template T - Expected return type
 * @param {string} message - JSON string to deserialize
 * @returns {T} Deserialized object
 *
 * @example
 * ```typescript
 * const user = deserializeMessage<User>('{"id":"123","name":"John"}');
 * ```
 */
export declare function deserializeMessage<T>(message: string): T;
/**
 * Validates message structure against a schema.
 *
 * @template T - Expected message type
 * @param {any} message - Message to validate
 * @param {(msg: any) => msg is T} validator - Type guard function
 * @returns {T} Validated message
 * @throws {RpcException} If validation fails
 *
 * @example
 * ```typescript
 * function isUser(msg: any): msg is User {
 *   return msg && typeof msg.id === 'string' && typeof msg.name === 'string';
 * }
 *
 * const user = validateMessage(data, isUser);
 * ```
 */
export declare function validateMessage<T>(message: any, validator: (msg: any) => msg is T): T;
/**
 * Compresses a message payload using basic compression (placeholder).
 *
 * @param {any} message - Message to compress
 * @returns {string} Compressed message
 *
 * @example
 * ```typescript
 * const compressed = compressMessage(largePayload);
 * ```
 */
export declare function compressMessage(message: any): string;
/**
 * Decompresses a message payload (placeholder).
 *
 * @template T - Expected return type
 * @param {string} compressed - Compressed message
 * @returns {T} Decompressed message
 *
 * @example
 * ```typescript
 * const original = decompressMessage<PayloadType>(compressed);
 * ```
 */
export declare function decompressMessage<T>(compressed: string): T;
/**
 * Creates a retry strategy with exponential backoff.
 *
 * @param {number} [maxAttempts=3] - Maximum retry attempts
 * @param {number} [initialDelay=1000] - Initial delay in milliseconds
 * @param {number} [maxDelay=30000] - Maximum delay in milliseconds
 * @returns {RetryConfig} Retry configuration
 *
 * @example
 * ```typescript
 * const retryConfig = createExponentialRetry(5, 1000, 60000);
 * await sendWithRetry(client, 'process', data, retryConfig);
 * ```
 */
export declare function createExponentialRetry(maxAttempts?: number, initialDelay?: number, maxDelay?: number): RetryConfig;
/**
 * Creates a retry strategy with linear backoff.
 *
 * @param {number} [maxAttempts=3] - Maximum retry attempts
 * @param {number} [delay=1000] - Delay between retries in milliseconds
 * @returns {RetryConfig} Retry configuration
 *
 * @example
 * ```typescript
 * const retryConfig = createLinearRetry(3, 2000);
 * await sendWithRetry(client, 'process', data, retryConfig);
 * ```
 */
export declare function createLinearRetry(maxAttempts?: number, delay?: number): RetryConfig;
/**
 * Creates a timeout configuration with optional fallback value.
 *
 * @template T - Fallback value type
 * @param {number} duration - Timeout duration in milliseconds
 * @param {T} [fallbackValue] - Optional fallback value to return on timeout
 * @returns {TimeoutConfig} Timeout configuration
 *
 * @example
 * ```typescript
 * const timeoutConfig = createTimeoutConfig(5000, { id: 'default', name: 'Unknown' });
 * const user = await sendWithTimeout(client, 'get_user', { id: '123' }, timeoutConfig);
 * ```
 */
export declare function createTimeoutConfig<T>(duration: number, fallbackValue?: T): TimeoutConfig;
/**
 * Executes an async operation with timeout.
 *
 * @template T - Expected return type
 * @param {Promise<T>} promise - Promise to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} [errorMessage] - Custom error message
 * @returns {Promise<T>} Promise result or timeout error
 *
 * @example
 * ```typescript
 * const result = await withTimeout(
 *   fetchUserData('123'),
 *   5000,
 *   'User fetch timeout'
 * );
 * ```
 */
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T>;
//# sourceMappingURL=nest-microservices-utils.d.ts.map