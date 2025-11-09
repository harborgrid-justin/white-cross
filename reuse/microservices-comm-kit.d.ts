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
import { Model, Sequelize } from 'sequelize';
interface ServiceRegistryEntry {
    serviceId: string;
    serviceName: string;
    version: string;
    host: string;
    port: number;
    protocol: 'http' | 'grpc' | 'tcp' | 'amqp' | 'kafka';
    status: 'healthy' | 'unhealthy' | 'degraded' | 'starting' | 'stopping';
    metadata?: Record<string, any>;
    healthCheckUrl?: string;
    lastHeartbeat?: Date;
    tags?: string[];
}
interface ServiceInstance {
    id: string;
    name: string;
    host: string;
    port: number;
    weight: number;
    connections?: number;
    status: 'active' | 'inactive' | 'draining';
    metadata?: Record<string, any>;
}
interface GrpcServiceConfig {
    packageName: string;
    serviceName: string;
    protoPath: string;
    host: string;
    port: number;
    options?: Record<string, any>;
}
interface SagaStep {
    stepId: string;
    stepName: string;
    serviceName: string;
    action: string;
    execute: (context: any) => Promise<any>;
    compensate: (context: any) => Promise<void>;
    timeout?: number;
    retryPolicy?: RetryPolicy;
}
interface SagaContext {
    sagaId: string;
    sagaType: string;
    currentStep: number;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'compensating' | 'compensated';
    data: any;
    executedSteps: Array<{
        stepId: string;
        result: any;
        timestamp: Date;
    }>;
    compensatedSteps: string[];
    error?: Error;
    startTime: Date;
    endTime?: Date;
}
interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    resetTimeout: number;
    halfOpenRequests?: number;
    monitoringPeriod?: number;
}
interface CircuitBreakerState {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failures: number;
    successes: number;
    consecutiveSuccesses: number;
    lastFailureTime?: Date;
    nextAttemptTime?: Date;
    halfOpenAttempts?: number;
}
interface RetryPolicy {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryableErrors?: string[];
}
interface TimeoutPolicy {
    timeout: number;
    fallback?: () => Promise<any>;
}
interface HealthCheckResult {
    serviceName: string;
    serviceId: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: Date;
    responseTime: number;
    checks: Array<{
        name: string;
        status: 'pass' | 'fail' | 'warn';
        message?: string;
    }>;
    dependencies?: HealthCheckResult[];
}
interface CorrelationContext {
    correlationId: string;
    causationId?: string;
    conversationId?: string;
    userId?: string;
    tenantId?: string;
    traceId?: string;
    spanId?: string;
    timestamp: Date;
}
interface TraceSpan {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    serviceName: string;
    operationName: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    tags?: Record<string, any>;
    logs?: Array<{
        timestamp: Date;
        message: string;
        fields?: Record<string, any>;
    }>;
    status?: 'ok' | 'error';
}
interface ServiceVersion {
    serviceName: string;
    version: string;
    apiVersion: string;
    compatibleVersions: string[];
    deprecatedVersions: string[];
    migrationGuide?: string;
}
interface ServiceAuthToken {
    serviceId: string;
    token: string;
    expiresAt: Date;
    scopes: string[];
    algorithm: 'HS256' | 'RS256' | 'ES256';
}
interface LoadBalancerStrategy {
    type: 'round-robin' | 'random' | 'least-connections' | 'weighted' | 'ip-hash' | 'consistent-hash';
    options?: Record<string, any>;
}
interface EventMessage {
    eventId: string;
    eventType: string;
    source: string;
    aggregateId: string;
    version: number;
    data: any;
    metadata?: Record<string, any>;
    timestamp: Date;
}
/**
 * 1. Service Registry Sequelize Model
 * Stores registered microservices with their metadata and health status
 */
export declare class ServiceRegistry extends Model {
    id: string;
    serviceId: string;
    serviceName: string;
    version: string;
    host: string;
    port: number;
    protocol: string;
    status: string;
    metadata: Record<string, any>;
    healthCheckUrl: string;
    lastHeartbeat: Date;
    tags: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare const initServiceRegistryModel: (sequelize: Sequelize) => typeof ServiceRegistry;
/**
 * 2. Service Events Sequelize Model
 * Stores all events published by microservices for event sourcing and audit
 */
export declare class ServiceEvent extends Model {
    id: string;
    eventId: string;
    eventType: string;
    source: string;
    aggregateId: string;
    aggregateType: string;
    version: number;
    data: Record<string, any>;
    metadata: Record<string, any>;
    correlationId: string;
    causationId: string;
    readonly createdAt: Date;
}
export declare const initServiceEventModel: (sequelize: Sequelize) => typeof ServiceEvent;
/**
 * 3. Message Queue Sequelize Model
 * Persistent message queue for reliable message delivery between services
 */
export declare class MessageQueue extends Model {
    id: string;
    messageId: string;
    queueName: string;
    pattern: string;
    data: any;
    status: string;
    priority: number;
    attempts: number;
    maxAttempts: number;
    scheduledAt: Date;
    processedAt: Date;
    error: string;
    correlationId: string;
    replyTo: string;
    headers: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare const initMessageQueueModel: (sequelize: Sequelize) => typeof MessageQueue;
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
export declare const registerService: (serviceInfo: ServiceRegistryEntry) => Promise<ServiceRegistry>;
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
export declare const discoverService: (serviceName: string, version?: string) => Promise<ServiceRegistry[]>;
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
export declare const updateServiceHeartbeat: (serviceId: string, status?: string) => Promise<boolean>;
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
export declare const deregisterService: (serviceId: string) => Promise<boolean>;
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
export declare const findServicesByTags: (tags: string[], matchAll?: boolean) => Promise<ServiceRegistry[]>;
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
export declare const createGrpcClient: (config: GrpcServiceConfig) => any;
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
export declare const createGrpcServer: (port: number, serviceImplementation: any) => any;
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
export declare const createGrpcMetadata: (headers: Record<string, string>) => any;
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
export declare const createGrpcStream: (client: any, method: string, onData: (data: any) => void) => any;
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
export declare const createRabbitMQConnection: (connectionString: string) => Promise<{
    connection: any;
    channel: any;
}>;
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
export declare const publishToRabbitMQ: (channel: any, exchange: string, routingKey: string, message: any, options?: Record<string, any>) => Promise<boolean>;
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
export declare const subscribeToRabbitMQ: (channel: any, queue: string, handler: (msg: any) => Promise<void>, options?: Record<string, any>) => Promise<void>;
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
export declare const createKafkaProducer: (brokers: string[], options?: Record<string, any>) => Promise<any>;
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
export declare const publishToKafka: (producer: any, topic: string, message: any, key?: string) => Promise<any>;
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
export declare const createKafkaConsumer: (brokers: string[], groupId: string, topics: string[], handler: (payload: any) => Promise<void>) => Promise<any>;
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
export declare const publishDomainEvent: (event: EventMessage) => Promise<ServiceEvent>;
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
export declare const subscribeToEvents: (eventTypes: string[], handler: (event: ServiceEvent) => Promise<void>, pollInterval?: number) => (() => void);
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
export declare const getEventStream: (aggregateId: string, fromVersion?: number) => Promise<ServiceEvent[]>;
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
export declare const replayEvents: (aggregateId: string, applyEvent: (state: any, event: ServiceEvent) => any) => Promise<any>;
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
export declare const executeSaga: (steps: SagaStep[], initialData: any) => Promise<SagaContext>;
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
export declare const compensateSaga: (context: SagaContext, steps: SagaStep[]) => Promise<void>;
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
export declare const createSagaStep: (stepId: string, stepName: string) => {
    withService(serviceName: string): /*elided*/ any;
    withAction(action: string): /*elided*/ any;
    withExecute(execute: (data: any) => Promise<any>): /*elided*/ any;
    withCompensate(compensate: (data: any) => Promise<void>): /*elided*/ any;
    withTimeout(timeout: number): /*elided*/ any;
    withRetryPolicy(policy: RetryPolicy): /*elided*/ any;
    build(): SagaStep;
};
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
export declare const executeWithCircuitBreaker: <T>(name: string, operation: () => Promise<T>, config: CircuitBreakerConfig) => Promise<T>;
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
export declare const getCircuitBreakerState: (name: string) => CircuitBreakerState | undefined;
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
export declare const resetCircuitBreaker: (name: string) => void;
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
export declare const executeWithRetry: <T>(operation: () => Promise<T>, policy: RetryPolicy) => Promise<T>;
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
export declare const executeWithTimeout: <T>(operation: () => Promise<T>, policy: TimeoutPolicy) => Promise<T>;
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
export declare const executeWithRetryAndTimeout: <T>(operation: () => Promise<T>, retryPolicy: RetryPolicy, timeoutPolicy: TimeoutPolicy) => Promise<T>;
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
export declare const performHealthCheck: (serviceId: string) => Promise<HealthCheckResult>;
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
export declare const monitorServiceHealth: (serviceIds: string[], interval: number, callback: (result: HealthCheckResult) => Promise<void>) => (() => void);
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
export declare const generateCorrelationContext: (context?: Partial<CorrelationContext>) => CorrelationContext;
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
export declare const extractCorrelationContext: (headers: Record<string, string>) => CorrelationContext;
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
export declare const injectCorrelationContext: (context: CorrelationContext) => Record<string, string>;
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
export declare const createTraceSpan: (serviceName: string, operationName: string, spanData?: Partial<TraceSpan>) => TraceSpan;
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
export declare const finishTraceSpan: (span: TraceSpan, status: "ok" | "error", tags?: Record<string, any>) => void;
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
export declare const addTraceLog: (span: TraceSpan, message: string, fields?: Record<string, any>) => void;
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
export declare const checkVersionCompatibility: (serviceVersion: ServiceVersion, requestedVersion: string) => boolean;
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
export declare const generateServiceToken: (serviceId: string, scopes: string[], expiresIn?: number) => ServiceAuthToken;
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
export declare const validateServiceToken: (token: string, requiredScopes?: string[]) => ServiceAuthToken | null;
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
export declare const selectServiceInstance: (serviceName: string, strategy: LoadBalancerStrategy) => Promise<ServiceInstance | null>;
declare const _default: {
    initServiceRegistryModel: (sequelize: Sequelize) => typeof ServiceRegistry;
    initServiceEventModel: (sequelize: Sequelize) => typeof ServiceEvent;
    initMessageQueueModel: (sequelize: Sequelize) => typeof MessageQueue;
    registerService: (serviceInfo: ServiceRegistryEntry) => Promise<ServiceRegistry>;
    discoverService: (serviceName: string, version?: string) => Promise<ServiceRegistry[]>;
    updateServiceHeartbeat: (serviceId: string, status?: string) => Promise<boolean>;
    deregisterService: (serviceId: string) => Promise<boolean>;
    findServicesByTags: (tags: string[], matchAll?: boolean) => Promise<ServiceRegistry[]>;
    createGrpcClient: (config: GrpcServiceConfig) => any;
    createGrpcServer: (port: number, serviceImplementation: any) => any;
    createGrpcMetadata: (headers: Record<string, string>) => any;
    createGrpcStream: (client: any, method: string, onData: (data: any) => void) => any;
    createRabbitMQConnection: (connectionString: string) => Promise<{
        connection: any;
        channel: any;
    }>;
    publishToRabbitMQ: (channel: any, exchange: string, routingKey: string, message: any, options?: Record<string, any>) => Promise<boolean>;
    subscribeToRabbitMQ: (channel: any, queue: string, handler: (msg: any) => Promise<void>, options?: Record<string, any>) => Promise<void>;
    createKafkaProducer: (brokers: string[], options?: Record<string, any>) => Promise<any>;
    publishToKafka: (producer: any, topic: string, message: any, key?: string) => Promise<any>;
    createKafkaConsumer: (brokers: string[], groupId: string, topics: string[], handler: (payload: any) => Promise<void>) => Promise<any>;
    publishDomainEvent: (event: EventMessage) => Promise<ServiceEvent>;
    subscribeToEvents: (eventTypes: string[], handler: (event: ServiceEvent) => Promise<void>, pollInterval?: number) => (() => void);
    getEventStream: (aggregateId: string, fromVersion?: number) => Promise<ServiceEvent[]>;
    replayEvents: (aggregateId: string, applyEvent: (state: any, event: ServiceEvent) => any) => Promise<any>;
    executeSaga: (steps: SagaStep[], initialData: any) => Promise<SagaContext>;
    compensateSaga: (context: SagaContext, steps: SagaStep[]) => Promise<void>;
    createSagaStep: (stepId: string, stepName: string) => {
        withService(serviceName: string): /*elided*/ any;
        withAction(action: string): /*elided*/ any;
        withExecute(execute: (data: any) => Promise<any>): /*elided*/ any;
        withCompensate(compensate: (data: any) => Promise<void>): /*elided*/ any;
        withTimeout(timeout: number): /*elided*/ any;
        withRetryPolicy(policy: RetryPolicy): /*elided*/ any;
        build(): SagaStep;
    };
    executeWithCircuitBreaker: <T>(name: string, operation: () => Promise<T>, config: CircuitBreakerConfig) => Promise<T>;
    getCircuitBreakerState: (name: string) => CircuitBreakerState | undefined;
    resetCircuitBreaker: (name: string) => void;
    executeWithRetry: <T>(operation: () => Promise<T>, policy: RetryPolicy) => Promise<T>;
    executeWithTimeout: <T>(operation: () => Promise<T>, policy: TimeoutPolicy) => Promise<T>;
    executeWithRetryAndTimeout: <T>(operation: () => Promise<T>, retryPolicy: RetryPolicy, timeoutPolicy: TimeoutPolicy) => Promise<T>;
    performHealthCheck: (serviceId: string) => Promise<HealthCheckResult>;
    monitorServiceHealth: (serviceIds: string[], interval: number, callback: (result: HealthCheckResult) => Promise<void>) => (() => void);
    generateCorrelationContext: (context?: Partial<CorrelationContext>) => CorrelationContext;
    extractCorrelationContext: (headers: Record<string, string>) => CorrelationContext;
    injectCorrelationContext: (context: CorrelationContext) => Record<string, string>;
    createTraceSpan: (serviceName: string, operationName: string, spanData?: Partial<TraceSpan>) => TraceSpan;
    finishTraceSpan: (span: TraceSpan, status: "ok" | "error", tags?: Record<string, any>) => void;
    addTraceLog: (span: TraceSpan, message: string, fields?: Record<string, any>) => void;
    checkVersionCompatibility: (serviceVersion: ServiceVersion, requestedVersion: string) => boolean;
    generateServiceToken: (serviceId: string, scopes: string[], expiresIn?: number) => ServiceAuthToken;
    validateServiceToken: (token: string, requiredScopes?: string[]) => ServiceAuthToken | null;
    selectServiceInstance: (serviceName: string, strategy: LoadBalancerStrategy) => Promise<ServiceInstance | null>;
};
export default _default;
//# sourceMappingURL=microservices-comm-kit.d.ts.map