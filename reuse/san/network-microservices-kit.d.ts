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
import { Sequelize } from 'sequelize';
interface MicroserviceConfig {
    serviceName: string;
    transport: 'TCP' | 'REDIS' | 'NATS' | 'MQTT' | 'RABBITMQ' | 'KAFKA' | 'GRPC';
    host: string;
    port: number;
    options?: Record<string, any>;
    retryAttempts?: number;
    retryDelay?: number;
}
interface MessageQueueConfig {
    broker: 'rabbitmq' | 'redis' | 'kafka' | 'nats';
    url: string;
    queue: string;
    exchange?: string;
    prefetchCount?: number;
    durable?: boolean;
    autoAck?: boolean;
}
interface EventBusConfig {
    broker: 'redis' | 'nats' | 'kafka';
    channels: string[];
    persistEvents?: boolean;
    eventStore?: boolean;
    ttl?: number;
}
interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    halfOpenRetryDelay: number;
    monitoringPeriod: number;
}
interface CircuitBreakerState {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    successCount: number;
    lastFailureTime: number;
    lastStateChange: number;
}
interface RetryConfig {
    maxAttempts: number;
    backoffType: 'exponential' | 'linear' | 'fixed';
    initialDelay: number;
    maxDelay: number;
    multiplier?: number;
    jitter?: boolean;
}
interface ServiceRegistration {
    serviceId: string;
    serviceName: string;
    version: string;
    host: string;
    port: number;
    protocol: string;
    healthCheckUrl?: string;
    metadata?: Record<string, any>;
    tags?: string[];
}
interface ServiceInstance {
    id: string;
    name: string;
    host: string;
    port: number;
    healthy: boolean;
    lastHeartbeat: Date;
    metadata: Record<string, any>;
}
interface ServiceMeshConfig {
    meshId: string;
    services: ServiceRegistration[];
    loadBalancing: 'round-robin' | 'least-connections' | 'random' | 'ip-hash';
    healthCheckInterval: number;
    timeout: number;
}
interface LoadBalancerState {
    currentIndex: number;
    connections: Map<string, number>;
    lastSelected: string;
}
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
export declare const createNetworkMicroserviceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        serviceId: string;
        serviceName: string;
        version: string;
        transport: string;
        host: string;
        port: number;
        status: string;
        healthCheckUrl: string | null;
        lastHeartbeat: Date;
        metadata: Record<string, any>;
        tags: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createNetworkEventModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        eventId: string;
        eventType: string;
        aggregateId: string;
        aggregateType: string;
        payload: Record<string, any>;
        version: number;
        userId: string | null;
        publishedAt: Date;
        processedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createCircuitBreakerLogModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        serviceName: string;
        state: string;
        failureCount: number;
        successCount: number;
        lastFailure: Date | null;
        lastSuccess: Date | null;
        stateChangedAt: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createMicroserviceConfig: (config: MicroserviceConfig) => any;
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
export declare const validateMicroserviceConfig: (config: MicroserviceConfig) => Promise<{
    valid: boolean;
    errors: string[];
}>;
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
export declare const createHybridMicroserviceConfig: (configs: MicroserviceConfig[]) => any[];
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
export declare const generateServiceId: (serviceName: string, version?: string) => string;
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
export declare const createMessageQueueConfig: (config: MessageQueueConfig) => any;
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
export declare const publishToMessageQueue: (client: any, pattern: string, data: any, options?: Record<string, any>) => Promise<void>;
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
export declare const subscribeToMessageQueue: (client: any, pattern: string, handler: (data: any) => Promise<void> | void) => void;
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
export declare const createDeadLetterQueueHandler: (client: any, dlqName: string, handler: (message: any) => Promise<void>) => void;
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
export declare const isDuplicateMessage: (messageId: string, ttl?: number) => Promise<boolean>;
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
export declare const createNetworkEventBus: (config: EventBusConfig) => any;
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
export declare const publishNetworkEvent: (eventBus: any, eventType: string, payload: any, metadata?: Record<string, any>) => Promise<void>;
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
export declare const createEventHandler: (handler: (event: any) => Promise<void>, filter?: (event: any) => boolean, transform?: (event: any) => any) => ((event: any) => Promise<void>);
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
export declare const reconstructStateFromEvents: (events: any[], initialState: any, reducer: (state: any, event: any) => any) => any;
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
export declare const replayEvents: (EventModel: any, aggregateId: string, handler: (event: any) => Promise<void>) => Promise<void>;
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
export declare const createServiceMesh: (config: ServiceMeshConfig) => any;
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
export declare const selectServiceInstance: (instances: ServiceInstance[], strategy: string, state: LoadBalancerState) => ServiceInstance | null;
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
export declare const checkServiceHealth: (instance: ServiceInstance, timeout?: number) => Promise<boolean>;
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
export declare const registerServiceInMesh: (mesh: any, registration: ServiceRegistration) => Promise<void>;
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
export declare const deregisterServiceFromMesh: (mesh: any, serviceId: string) => Promise<void>;
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
export declare const createCircuitBreaker: (config: CircuitBreakerConfig) => any;
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
export declare const executeWithCircuitBreaker: (operation: () => Promise<any>, state: CircuitBreakerState, config: CircuitBreakerConfig) => Promise<any>;
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
export declare const handleCircuitBreakerSuccess: (state: CircuitBreakerState, config: CircuitBreakerConfig) => void;
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
export declare const handleCircuitBreakerFailure: (state: CircuitBreakerState, config: CircuitBreakerConfig) => void;
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
export declare const resetCircuitBreaker: (state: CircuitBreakerState) => void;
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
export declare const executeWithRetry: (operation: () => Promise<any>, config: RetryConfig) => Promise<any>;
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
export declare const calculateRetryDelay: (attempt: number, config: RetryConfig) => number;
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
export declare const createRetryPolicy: (config: RetryConfig) => any;
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
export declare const retryWithDeadline: (operation: () => Promise<any>, deadline: number, config: RetryConfig) => Promise<any>;
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
export declare const conditionalRetry: (operation: () => Promise<any>, shouldRetry: (error: any) => boolean, config: RetryConfig) => Promise<any>;
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
export declare const executeWithFallback: (primary: () => Promise<any>, fallback: () => Promise<any>) => Promise<any>;
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
export declare const cascadingFallback: (operations: Array<() => Promise<any>>) => Promise<any>;
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
export declare const cacheAsideFallback: (key: string, fetchFn: () => Promise<any>, cache: Map<string, any>, ttl?: number) => Promise<any>;
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
export declare const degradedServiceFallback: (fullService: () => Promise<any>, degradedService: () => Promise<any>, healthCheck: () => Promise<boolean>) => Promise<any>;
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
export declare const discoverServices: (MicroserviceModel: any, serviceName?: string, tags?: string[]) => Promise<any[]>;
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
export declare const registerServiceWithHeartbeat: (MicroserviceModel: any, registration: ServiceRegistration) => Promise<any>;
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
export declare const updateServiceHeartbeat: (MicroserviceModel: any, serviceId: string) => Promise<void>;
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
export declare const removeStaleServices: (MicroserviceModel: any, timeoutMs?: number) => Promise<number>;
declare const _default: {
    createNetworkMicroserviceModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            serviceId: string;
            serviceName: string;
            version: string;
            transport: string;
            host: string;
            port: number;
            status: string;
            healthCheckUrl: string | null;
            lastHeartbeat: Date;
            metadata: Record<string, any>;
            tags: string[];
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkEventModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            eventId: string;
            eventType: string;
            aggregateId: string;
            aggregateType: string;
            payload: Record<string, any>;
            version: number;
            userId: string | null;
            publishedAt: Date;
            processedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCircuitBreakerLogModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            serviceName: string;
            state: string;
            failureCount: number;
            successCount: number;
            lastFailure: Date | null;
            lastSuccess: Date | null;
            stateChangedAt: Date;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createMicroserviceConfig: (config: MicroserviceConfig) => any;
    validateMicroserviceConfig: (config: MicroserviceConfig) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    createHybridMicroserviceConfig: (configs: MicroserviceConfig[]) => any[];
    generateServiceId: (serviceName: string, version?: string) => string;
    createMessageQueueConfig: (config: MessageQueueConfig) => any;
    publishToMessageQueue: (client: any, pattern: string, data: any, options?: Record<string, any>) => Promise<void>;
    subscribeToMessageQueue: (client: any, pattern: string, handler: (data: any) => Promise<void> | void) => void;
    createDeadLetterQueueHandler: (client: any, dlqName: string, handler: (message: any) => Promise<void>) => void;
    isDuplicateMessage: (messageId: string, ttl?: number) => Promise<boolean>;
    createNetworkEventBus: (config: EventBusConfig) => any;
    publishNetworkEvent: (eventBus: any, eventType: string, payload: any, metadata?: Record<string, any>) => Promise<void>;
    createEventHandler: (handler: (event: any) => Promise<void>, filter?: (event: any) => boolean, transform?: (event: any) => any) => ((event: any) => Promise<void>);
    reconstructStateFromEvents: (events: any[], initialState: any, reducer: (state: any, event: any) => any) => any;
    replayEvents: (EventModel: any, aggregateId: string, handler: (event: any) => Promise<void>) => Promise<void>;
    createServiceMesh: (config: ServiceMeshConfig) => any;
    selectServiceInstance: (instances: ServiceInstance[], strategy: string, state: LoadBalancerState) => ServiceInstance | null;
    checkServiceHealth: (instance: ServiceInstance, timeout?: number) => Promise<boolean>;
    registerServiceInMesh: (mesh: any, registration: ServiceRegistration) => Promise<void>;
    deregisterServiceFromMesh: (mesh: any, serviceId: string) => Promise<void>;
    createCircuitBreaker: (config: CircuitBreakerConfig) => any;
    executeWithCircuitBreaker: (operation: () => Promise<any>, state: CircuitBreakerState, config: CircuitBreakerConfig) => Promise<any>;
    handleCircuitBreakerSuccess: (state: CircuitBreakerState, config: CircuitBreakerConfig) => void;
    handleCircuitBreakerFailure: (state: CircuitBreakerState, config: CircuitBreakerConfig) => void;
    resetCircuitBreaker: (state: CircuitBreakerState) => void;
    executeWithRetry: (operation: () => Promise<any>, config: RetryConfig) => Promise<any>;
    calculateRetryDelay: (attempt: number, config: RetryConfig) => number;
    createRetryPolicy: (config: RetryConfig) => any;
    retryWithDeadline: (operation: () => Promise<any>, deadline: number, config: RetryConfig) => Promise<any>;
    conditionalRetry: (operation: () => Promise<any>, shouldRetry: (error: any) => boolean, config: RetryConfig) => Promise<any>;
    executeWithFallback: (primary: () => Promise<any>, fallback: () => Promise<any>) => Promise<any>;
    cascadingFallback: (operations: Array<() => Promise<any>>) => Promise<any>;
    cacheAsideFallback: (key: string, fetchFn: () => Promise<any>, cache: Map<string, any>, ttl?: number) => Promise<any>;
    degradedServiceFallback: (fullService: () => Promise<any>, degradedService: () => Promise<any>, healthCheck: () => Promise<boolean>) => Promise<any>;
    discoverServices: (MicroserviceModel: any, serviceName?: string, tags?: string[]) => Promise<any[]>;
    registerServiceWithHeartbeat: (MicroserviceModel: any, registration: ServiceRegistration) => Promise<any>;
    updateServiceHeartbeat: (MicroserviceModel: any, serviceId: string) => Promise<void>;
    removeStaleServices: (MicroserviceModel: any, timeoutMs?: number) => Promise<number>;
};
export default _default;
//# sourceMappingURL=network-microservices-kit.d.ts.map