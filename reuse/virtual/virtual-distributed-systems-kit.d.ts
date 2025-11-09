/**
 * LOC: VDSYS1234567
 * File: /reuse/virtual/virtual-distributed-systems-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS microservices modules
 *   - Distributed systems orchestration
 *   - VMware vRealize integration
 *   - Service mesh implementations
 */
interface ServiceMeshConfig {
    meshType: 'istio' | 'linkerd' | 'consul-connect' | 'aws-app-mesh';
    serviceName: string;
    namespace: string;
    enableMTLS: boolean;
    enableTracing: boolean;
    enableMetrics: boolean;
    retryPolicy?: {
        attempts: number;
        perTryTimeout: string;
        retryOn: string[];
    };
    circuitBreaker?: {
        consecutiveErrors: number;
        interval: string;
        baseEjectionTime: string;
    };
    loadBalancer?: {
        type: 'round-robin' | 'least-request' | 'ring-hash' | 'random';
        consistentHash?: string;
    };
}
interface EventSourcingConfig {
    eventStore: 'postgresql' | 'mongodb' | 'eventstore' | 'dynamodb';
    aggregateType: string;
    snapshotInterval: number;
    enableSnapshots: boolean;
    enableProjections: boolean;
    eventRetention?: {
        days: number;
        archiveStrategy: 'delete' | 'archive-s3' | 'archive-glacier';
    };
}
interface EventStoreEvent {
    eventId: string;
    aggregateId: string;
    aggregateType: string;
    eventType: string;
    eventVersion: number;
    eventData: any;
    metadata: {
        timestamp: Date;
        userId?: string;
        correlationId: string;
        causationId?: string;
    };
    sequence: number;
}
interface EventSnapshot {
    aggregateId: string;
    aggregateType: string;
    version: number;
    state: any;
    timestamp: Date;
    metadata?: Record<string, any>;
}
interface CQRSCommand {
    commandId: string;
    commandType: string;
    aggregateId: string;
    payload: any;
    metadata: {
        userId?: string;
        timestamp: Date;
        correlationId: string;
    };
    expectedVersion?: number;
}
interface CQRSQuery {
    queryId: string;
    queryType: string;
    parameters: Record<string, any>;
    projection?: string;
    metadata: {
        userId?: string;
        timestamp: Date;
    };
}
interface ReadModel {
    modelId: string;
    modelType: string;
    data: any;
    version: number;
    lastUpdated: Date;
    sourceEvents: string[];
}
interface SagaDefinition {
    sagaId: string;
    sagaType: string;
    steps: SagaStepDefinition[];
    compensationStrategy: 'backward' | 'forward';
    timeout: number;
    retryPolicy?: {
        maxAttempts: number;
        backoff: 'fixed' | 'exponential';
        delay: number;
    };
}
interface SagaStepDefinition {
    stepId: string;
    stepName: string;
    serviceEndpoint: string;
    action: {
        command: string;
        payload: any;
        timeout: number;
    };
    compensation: {
        command: string;
        payload: any;
        timeout: number;
    };
    retriable: boolean;
    critical: boolean;
}
interface SagaExecution {
    executionId: string;
    sagaId: string;
    status: 'pending' | 'running' | 'completed' | 'compensating' | 'failed' | 'cancelled';
    currentStep: number;
    completedSteps: string[];
    compensatedSteps: string[];
    startedAt: Date;
    completedAt?: Date;
    data: Record<string, any>;
    error?: {
        step: string;
        message: string;
        details: any;
    };
}
interface DistributedLockConfig {
    lockType: 'redis' | 'etcd' | 'zookeeper' | 'consul';
    lockName: string;
    ttl: number;
    retryAttempts: number;
    retryDelay: number;
    autoRenew: boolean;
}
interface DistributedLock {
    lockId: string;
    lockName: string;
    ownerId: string;
    acquiredAt: Date;
    expiresAt: Date;
    metadata?: Record<string, any>;
}
interface ServiceEndpoint {
    id: string;
    host: string;
    port: number;
    protocol: 'http' | 'https' | 'grpc' | 'tcp';
    weight: number;
    healthy: boolean;
    metadata?: Record<string, any>;
    metrics?: {
        activeConnections: number;
        totalRequests: number;
        averageResponseTime: number;
        errorRate: number;
    };
}
interface DistributedTracingContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    serviceName: string;
    operationName: string;
    startTime: Date;
    tags: Map<string, string>;
    logs: Array<{
        timestamp: Date;
        fields: Map<string, any>;
    }>;
    baggage: Map<string, string>;
}
interface DistributedCacheConfig {
    cacheType: 'redis' | 'memcached' | 'hazelcast' | 'infinispan';
    nodes: string[];
    replicationFactor: number;
    consistencyLevel: 'one' | 'quorum' | 'all';
    enablePartitioning: boolean;
    partitionStrategy: 'hash' | 'range' | 'consistent-hash';
    evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'ttl';
    maxMemory: string;
}
interface APIGatewayConfig {
    gatewayType: 'kong' | 'nginx' | 'envoy' | 'traefik' | 'zuul';
    routes: APIGatewayRoute[];
    authentication?: {
        type: 'jwt' | 'oauth2' | 'api-key' | 'mtls';
        provider: string;
    };
    rateLimiting?: {
        requestsPerSecond: number;
        burstSize: number;
        strategy: 'fixed-window' | 'sliding-window' | 'token-bucket';
    };
    cors?: {
        allowOrigins: string[];
        allowMethods: string[];
        allowHeaders: string[];
    };
}
interface APIGatewayRoute {
    routeId: string;
    path: string;
    method: string;
    service: string;
    rewritePath?: string;
    timeout: number;
    retries: number;
    circuitBreaker?: boolean;
    cache?: {
        enabled: boolean;
        ttl: number;
        varyBy: string[];
    };
}
interface VRealizeConfig {
    vcoUrl: string;
    apiVersion: string;
    authentication: {
        type: 'basic' | 'sso' | 'token';
        credentials: any;
    };
    tenantId?: string;
    enableHA: boolean;
    enableLoadBalancing: boolean;
}
interface VRealizeWorkflow {
    workflowId: string;
    workflowName: string;
    version: string;
    inputParameters: Map<string, any>;
    outputParameters?: Map<string, any>;
    executionMode: 'sync' | 'async';
    timeout: number;
    retryPolicy?: {
        maxRetries: number;
        retryDelay: number;
    };
}
interface VRealizeOrchestrationResult {
    executionId: string;
    workflowId: string;
    status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
    startTime: Date;
    endTime?: Date;
    outputs?: Map<string, any>;
    logs?: string[];
    error?: {
        message: string;
        details: any;
    };
}
interface ConsensusConfig {
    algorithm: 'raft' | 'paxos' | 'etcd' | 'zookeeper';
    nodeId: string;
    clusterNodes: string[];
    electionTimeout: number;
    heartbeatInterval: number;
    snapshotInterval: number;
}
interface BulkheadConfig {
    maxConcurrentCalls: number;
    maxQueueSize: number;
    queueTimeout: number;
    semaphoreType: 'thread' | 'async';
}
interface RateLimiterConfig {
    algorithm: 'token-bucket' | 'leaky-bucket' | 'fixed-window' | 'sliding-window';
    capacity: number;
    refillRate: number;
    refillInterval: number;
    distributed: boolean;
    keyGenerator: (context: any) => string;
}
/**
 * Creates service mesh configuration for Istio, Linkerd, or Consul Connect.
 *
 * @param {'istio' | 'linkerd' | 'consul-connect' | 'aws-app-mesh'} meshType - Service mesh type
 * @param {string} serviceName - Service name
 * @param {string} namespace - Kubernetes namespace
 * @param {Partial<ServiceMeshConfig>} [options] - Additional options
 * @returns {ServiceMeshConfig} Service mesh configuration
 *
 * @example
 * ```typescript
 * const meshConfig = createServiceMeshConfig('istio', 'patient-service', 'healthcare', {
 *   enableMTLS: true,
 *   enableTracing: true,
 *   retryPolicy: {
 *     attempts: 3,
 *     perTryTimeout: '2s',
 *     retryOn: ['5xx', 'reset', 'connect-failure']
 *   },
 *   circuitBreaker: {
 *     consecutiveErrors: 5,
 *     interval: '30s',
 *     baseEjectionTime: '60s'
 *   }
 * });
 * ```
 */
export declare const createServiceMeshConfig: (meshType: "istio" | "linkerd" | "consul-connect" | "aws-app-mesh", serviceName: string, namespace: string, options?: Partial<ServiceMeshConfig>) => ServiceMeshConfig;
/**
 * Generates Istio VirtualService configuration for traffic management.
 *
 * @param {string} serviceName - Service name
 * @param {string} namespace - Kubernetes namespace
 * @param {string[]} hosts - Host names
 * @param {Record<string, any>[]} routes - Route configurations
 * @returns {Record<string, any>} Istio VirtualService YAML object
 *
 * @example
 * ```typescript
 * const virtualService = generateIstioVirtualService(
 *   'patient-service',
 *   'healthcare',
 *   ['patient-service.healthcare.svc.cluster.local'],
 *   [
 *     {
 *       match: [{ uri: { prefix: '/api/v1/patients' } }],
 *       route: [{ destination: { host: 'patient-service', subset: 'v1' }, weight: 90 }],
 *       retries: { attempts: 3, perTryTimeout: '2s' }
 *     }
 *   ]
 * );
 * ```
 */
export declare const generateIstioVirtualService: (serviceName: string, namespace: string, hosts: string[], routes: Record<string, any>[]) => Record<string, any>;
/**
 * Creates Istio DestinationRule for traffic policy and load balancing.
 *
 * @param {string} serviceName - Service name
 * @param {string} namespace - Kubernetes namespace
 * @param {string} host - Destination host
 * @param {Record<string, any>} trafficPolicy - Traffic policy configuration
 * @returns {Record<string, any>} Istio DestinationRule YAML object
 *
 * @example
 * ```typescript
 * const destRule = createIstioDestinationRule(
 *   'patient-service',
 *   'healthcare',
 *   'patient-service.healthcare.svc.cluster.local',
 *   {
 *     loadBalancer: { simple: 'LEAST_REQUEST' },
 *     connectionPool: {
 *       tcp: { maxConnections: 100 },
 *       http: { http1MaxPendingRequests: 50, http2MaxRequests: 100 }
 *     },
 *     outlierDetection: {
 *       consecutiveErrors: 5,
 *       interval: '30s',
 *       baseEjectionTime: '60s'
 *     }
 *   }
 * );
 * ```
 */
export declare const createIstioDestinationRule: (serviceName: string, namespace: string, host: string, trafficPolicy: Record<string, any>) => Record<string, any>;
/**
 * Enables distributed tracing with service mesh integration.
 *
 * @param {string} serviceName - Service name
 * @param {string} tracingBackend - Tracing backend ('jaeger' | 'zipkin' | 'datadog')
 * @param {string} samplingRate - Sampling rate (0.0 to 1.0)
 * @returns {DistributedTracingContext} Initial tracing context
 *
 * @example
 * ```typescript
 * const traceContext = enableServiceMeshTracing('patient-service', 'jaeger', '0.1');
 * // Propagate trace context in HTTP headers:
 * // x-request-id, x-b3-traceid, x-b3-spanid, x-b3-parentspanid
 * ```
 */
export declare const enableServiceMeshTracing: (serviceName: string, tracingBackend: "jaeger" | "zipkin" | "datadog" | "tempo", samplingRate: string) => DistributedTracingContext;
/**
 * Implements mTLS configuration for service-to-service communication.
 *
 * @param {string} serviceName - Service name
 * @param {string} namespace - Kubernetes namespace
 * @param {'STRICT' | 'PERMISSIVE' | 'DISABLE'} mode - mTLS mode
 * @returns {Record<string, any>} PeerAuthentication configuration
 *
 * @example
 * ```typescript
 * const mtlsConfig = configureMTLS('patient-service', 'healthcare', 'STRICT');
 * // Enforces mutual TLS for all service-to-service communication
 * ```
 */
export declare const configureMTLS: (serviceName: string, namespace: string, mode: "STRICT" | "PERMISSIVE" | "DISABLE") => Record<string, any>;
/**
 * Creates service mesh authorization policy for fine-grained access control.
 *
 * @param {string} policyName - Policy name
 * @param {string} namespace - Kubernetes namespace
 * @param {Record<string, string>} selector - Service selector
 * @param {Record<string, any>[]} rules - Authorization rules
 * @returns {Record<string, any>} AuthorizationPolicy configuration
 *
 * @example
 * ```typescript
 * const authPolicy = createAuthorizationPolicy(
 *   'patient-access',
 *   'healthcare',
 *   { app: 'patient-service' },
 *   [
 *     {
 *       from: [{ source: { principals: ['cluster.local/ns/healthcare/sa/api-gateway'] } }],
 *       to: [{ operation: { methods: ['GET', 'POST'], paths: ['/api/v1/patients/*'] } }]
 *     }
 *   ]
 * );
 * ```
 */
export declare const createAuthorizationPolicy: (policyName: string, namespace: string, selector: Record<string, string>, rules: Record<string, any>[]) => Record<string, any>;
/**
 * Creates event sourcing configuration for aggregate persistence.
 *
 * @param {string} aggregateType - Aggregate type name
 * @param {'postgresql' | 'mongodb' | 'eventstore' | 'dynamodb'} eventStore - Event store type
 * @param {number} [snapshotInterval=100] - Snapshot interval
 * @param {Partial<EventSourcingConfig>} [options] - Additional options
 * @returns {EventSourcingConfig} Event sourcing configuration
 *
 * @example
 * ```typescript
 * const config = createEventSourcingConfig('Patient', 'postgresql', 100, {
 *   enableSnapshots: true,
 *   enableProjections: true,
 *   eventRetention: { days: 365, archiveStrategy: 'archive-s3' }
 * });
 * ```
 */
export declare const createEventSourcingConfig: (aggregateType: string, eventStore: "postgresql" | "mongodb" | "eventstore" | "dynamodb", snapshotInterval?: number, options?: Partial<EventSourcingConfig>) => EventSourcingConfig;
/**
 * Creates an event store event with proper structure and metadata.
 *
 * @param {string} aggregateId - Aggregate identifier
 * @param {string} aggregateType - Aggregate type
 * @param {string} eventType - Event type name
 * @param {any} eventData - Event payload
 * @param {string} correlationId - Correlation ID for tracing
 * @param {number} [sequence=1] - Event sequence number
 * @returns {EventStoreEvent} Structured event
 *
 * @example
 * ```typescript
 * const event = createEventStoreEvent(
 *   'patient-123',
 *   'Patient',
 *   'PatientRegistered',
 *   { firstName: 'John', lastName: 'Doe', dateOfBirth: '1980-01-01' },
 *   'corr-456',
 *   1
 * );
 * await eventStore.append(event);
 * ```
 */
export declare const createEventStoreEvent: (aggregateId: string, aggregateType: string, eventType: string, eventData: any, correlationId: string, sequence?: number) => EventStoreEvent;
/**
 * Reconstructs aggregate state from event stream.
 *
 * @param {EventStoreEvent[]} events - Event stream
 * @param {any} initialState - Initial aggregate state
 * @param {(state: any, event: EventStoreEvent) => any} applyEvent - Event application function
 * @returns {any} Reconstructed aggregate state
 *
 * @example
 * ```typescript
 * const events = await eventStore.getEvents('patient-123');
 * const patient = rehydrateAggregateFromEvents(
 *   events,
 *   { id: 'patient-123', version: 0 },
 *   (state, event) => {
 *     switch (event.eventType) {
 *       case 'PatientRegistered':
 *         return { ...state, ...event.eventData, version: state.version + 1 };
 *       case 'PatientUpdated':
 *         return { ...state, ...event.eventData, version: state.version + 1 };
 *       default:
 *         return state;
 *     }
 *   }
 * );
 * ```
 */
export declare const rehydrateAggregateFromEvents: (events: EventStoreEvent[], initialState: any, applyEvent: (state: any, event: EventStoreEvent) => any) => any;
/**
 * Creates aggregate snapshot for performance optimization.
 *
 * @param {string} aggregateId - Aggregate identifier
 * @param {string} aggregateType - Aggregate type
 * @param {number} version - Aggregate version
 * @param {any} state - Current aggregate state
 * @returns {EventSnapshot} Aggregate snapshot
 *
 * @example
 * ```typescript
 * const snapshot = createAggregateSnapshot(
 *   'patient-123',
 *   'Patient',
 *   100,
 *   { id: 'patient-123', firstName: 'John', lastName: 'Doe', version: 100 }
 * );
 * await snapshotStore.save(snapshot);
 * ```
 */
export declare const createAggregateSnapshot: (aggregateId: string, aggregateType: string, version: number, state: any) => EventSnapshot;
/**
 * Loads aggregate with snapshot optimization.
 *
 * @param {string} aggregateId - Aggregate identifier
 * @param {() => Promise<EventSnapshot | null>} getSnapshot - Snapshot retrieval function
 * @param {(afterVersion: number) => Promise<EventStoreEvent[]>} getEvents - Event retrieval function
 * @param {(state: any, event: EventStoreEvent) => any} applyEvent - Event application function
 * @returns {Promise<any>} Loaded aggregate state
 *
 * @example
 * ```typescript
 * const patient = await loadAggregateWithSnapshot(
 *   'patient-123',
 *   () => snapshotStore.getLatest('patient-123'),
 *   (afterVersion) => eventStore.getEventsAfterVersion('patient-123', afterVersion),
 *   (state, event) => applyEventToPatient(state, event)
 * );
 * ```
 */
export declare const loadAggregateWithSnapshot: (aggregateId: string, getSnapshot: () => Promise<EventSnapshot | null>, getEvents: (afterVersion: number) => Promise<EventStoreEvent[]>, applyEvent: (state: any, event: EventStoreEvent) => any) => Promise<any>;
/**
 * Creates event projection for read model generation.
 *
 * @param {string} projectionName - Projection name
 * @param {string[]} eventTypes - Event types to project
 * @param {(readModel: any, event: EventStoreEvent) => any} project - Projection function
 * @returns {Record<string, any>} Projection configuration
 *
 * @example
 * ```typescript
 * const projection = createEventProjection(
 *   'patient-summary',
 *   ['PatientRegistered', 'PatientUpdated', 'PatientDeactivated'],
 *   (readModel, event) => {
 *     switch (event.eventType) {
 *       case 'PatientRegistered':
 *         return {
 *           patientId: event.aggregateId,
 *           fullName: `${event.eventData.firstName} ${event.eventData.lastName}`,
 *           status: 'active'
 *         };
 *       // ... other cases
 *     }
 *   }
 * );
 * ```
 */
export declare const createEventProjection: (projectionName: string, eventTypes: string[], project: (readModel: any, event: EventStoreEvent) => any) => Record<string, any>;
/**
 * Creates CQRS command with validation and metadata.
 *
 * @param {string} commandType - Command type name
 * @param {string} aggregateId - Target aggregate ID
 * @param {any} payload - Command payload
 * @param {string} correlationId - Correlation ID
 * @param {number} [expectedVersion] - Expected aggregate version for optimistic concurrency
 * @returns {CQRSCommand} CQRS command
 *
 * @example
 * ```typescript
 * const command = createCQRSCommand(
 *   'RegisterPatient',
 *   'patient-123',
 *   { firstName: 'John', lastName: 'Doe', dateOfBirth: '1980-01-01' },
 *   'corr-456',
 *   0 // Expected version for optimistic concurrency
 * );
 * await commandBus.execute(command);
 * ```
 */
export declare const createCQRSCommand: (commandType: string, aggregateId: string, payload: any, correlationId: string, expectedVersion?: number) => CQRSCommand;
/**
 * Creates CQRS query for read model access.
 *
 * @param {string} queryType - Query type name
 * @param {Record<string, any>} parameters - Query parameters
 * @param {string} [projection] - Specific projection to use
 * @returns {CQRSQuery} CQRS query
 *
 * @example
 * ```typescript
 * const query = createCQRSQuery(
 *   'GetPatientById',
 *   { patientId: 'patient-123' },
 *   'patient-summary'
 * );
 * const patient = await queryBus.execute(query);
 * ```
 */
export declare const createCQRSQuery: (queryType: string, parameters: Record<string, any>, projection?: string) => CQRSQuery;
/**
 * Implements command handler with validation and event emission.
 *
 * @param {CQRSCommand} command - Command to handle
 * @param {(command: CQRSCommand) => Promise<any>} validate - Validation function
 * @param {(command: CQRSCommand) => Promise<EventStoreEvent[]>} execute - Execution function
 * @param {(events: EventStoreEvent[]) => Promise<void>} persist - Persistence function
 * @returns {Promise<{ success: boolean; events: EventStoreEvent[] }>} Execution result
 *
 * @example
 * ```typescript
 * const result = await handleCommand(
 *   registerPatientCommand,
 *   async (cmd) => {
 *     // Validate command
 *     if (!cmd.payload.firstName) throw new Error('First name required');
 *   },
 *   async (cmd) => {
 *     // Execute business logic and return events
 *     return [createEventStoreEvent(cmd.aggregateId, 'Patient', 'PatientRegistered', cmd.payload, cmd.metadata.correlationId)];
 *   },
 *   async (events) => {
 *     // Persist events
 *     await eventStore.appendEvents(events);
 *   }
 * );
 * ```
 */
export declare const handleCommand: (command: CQRSCommand, validate: (command: CQRSCommand) => Promise<any>, execute: (command: CQRSCommand) => Promise<EventStoreEvent[]>, persist: (events: EventStoreEvent[]) => Promise<void>) => Promise<{
    success: boolean;
    events: EventStoreEvent[];
}>;
/**
 * Implements query handler with caching and projection.
 *
 * @param {CQRSQuery} query - Query to execute
 * @param {(query: CQRSQuery) => Promise<any>} fetchFromReadModel - Read model fetch function
 * @param {(key: string, data: any, ttl: number) => Promise<void>} [cache] - Optional caching function
 * @returns {Promise<any>} Query result
 *
 * @example
 * ```typescript
 * const patient = await handleQuery(
 *   getPatientQuery,
 *   async (query) => {
 *     return await patientReadModelRepository.findById(query.parameters.patientId);
 *   },
 *   async (key, data, ttl) => {
 *     await redisCache.set(key, JSON.stringify(data), 'EX', ttl);
 *   }
 * );
 * ```
 */
export declare const handleQuery: (query: CQRSQuery, fetchFromReadModel: (query: CQRSQuery) => Promise<any>, cache?: (key: string, data: any, ttl: number) => Promise<void>) => Promise<any>;
/**
 * Creates read model from event projections.
 *
 * @param {string} modelType - Read model type
 * @param {any} data - Model data
 * @param {number} version - Model version
 * @param {string[]} sourceEvents - Source event IDs
 * @returns {ReadModel} Read model
 *
 * @example
 * ```typescript
 * const readModel = createReadModel(
 *   'PatientSummary',
 *   {
 *     patientId: 'patient-123',
 *     fullName: 'John Doe',
 *     age: 44,
 *     status: 'active'
 *   },
 *   15,
 *   ['event-1', 'event-2', 'event-3']
 * );
 * await readModelRepository.save(readModel);
 * ```
 */
export declare const createReadModel: (modelType: string, data: any, version: number, sourceEvents: string[]) => ReadModel;
/**
 * Implements eventual consistency synchronization between write and read models.
 *
 * @param {EventStoreEvent[]} events - New events to process
 * @param {Map<string, (event: EventStoreEvent) => Promise<void>>} projectionHandlers - Projection handlers
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const handlers = new Map([
 *   ['PatientRegistered', async (event) => {
 *     const readModel = createReadModel('PatientSummary', event.eventData, 1, [event.eventId]);
 *     await patientReadModelRepo.save(readModel);
 *   }],
 *   ['PatientUpdated', async (event) => {
 *     await patientReadModelRepo.update(event.aggregateId, event.eventData);
 *   }]
 * ]);
 *
 * await synchronizeReadModels(newEvents, handlers);
 * ```
 */
export declare const synchronizeReadModels: (events: EventStoreEvent[], projectionHandlers: Map<string, (event: EventStoreEvent) => Promise<void>>) => Promise<void>;
/**
 * Creates saga definition with steps and compensation logic.
 *
 * @param {string} sagaType - Saga type name
 * @param {SagaStepDefinition[]} steps - Saga steps
 * @param {'backward' | 'forward'} [compensationStrategy='backward'] - Compensation strategy
 * @param {number} [timeout=300000] - Saga timeout in milliseconds
 * @returns {SagaDefinition} Saga definition
 *
 * @example
 * ```typescript
 * const createAppointmentSaga = createSagaDefinition(
 *   'CreateAppointment',
 *   [
 *     {
 *       stepId: 'reserve-slot',
 *       stepName: 'Reserve Calendar Slot',
 *       serviceEndpoint: 'calendar-service',
 *       action: { command: 'ReserveSlot', payload: {}, timeout: 5000 },
 *       compensation: { command: 'ReleaseSlot', payload: {}, timeout: 5000 },
 *       retriable: true,
 *       critical: true
 *     },
 *     {
 *       stepId: 'send-notification',
 *       stepName: 'Send Appointment Notification',
 *       serviceEndpoint: 'notification-service',
 *       action: { command: 'SendNotification', payload: {}, timeout: 5000 },
 *       compensation: { command: 'CancelNotification', payload: {}, timeout: 5000 },
 *       retriable: false,
 *       critical: false
 *     }
 *   ],
 *   'backward',
 *   300000
 * );
 * ```
 */
export declare const createSagaDefinition: (sagaType: string, steps: SagaStepDefinition[], compensationStrategy?: "backward" | "forward", timeout?: number) => SagaDefinition;
/**
 * Executes saga with orchestration and compensation handling.
 *
 * @param {SagaDefinition} saga - Saga definition
 * @param {any} initialData - Initial saga data
 * @param {(step: SagaStepDefinition, data: any) => Promise<any>} executeStep - Step execution function
 * @param {(step: SagaStepDefinition, data: any) => Promise<void>} compensateStep - Step compensation function
 * @returns {Promise<SagaExecution>} Saga execution result
 *
 * @example
 * ```typescript
 * const execution = await executeSaga(
 *   createAppointmentSaga,
 *   { patientId: 'patient-123', providerId: 'provider-456', datetime: '2024-03-15T10:00:00Z' },
 *   async (step, data) => {
 *     const response = await microserviceClient.send(step.action.command, { ...step.action.payload, ...data });
 *     return response;
 *   },
 *   async (step, data) => {
 *     await microserviceClient.send(step.compensation.command, { ...step.compensation.payload, ...data });
 *   }
 * );
 * ```
 */
export declare const executeSaga: (saga: SagaDefinition, initialData: any, executeStep: (step: SagaStepDefinition, data: any) => Promise<any>, compensateStep: (step: SagaStepDefinition, data: any) => Promise<void>) => Promise<SagaExecution>;
/**
 * Implements saga state persistence for recovery.
 *
 * @param {SagaExecution} execution - Saga execution state
 * @param {(key: string, value: any) => Promise<void>} persist - Persistence function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await persistSagaState(
 *   execution,
 *   async (key, value) => {
 *     await redis.set(key, JSON.stringify(value), 'EX', 3600);
 *   }
 * );
 * ```
 */
export declare const persistSagaState: (execution: SagaExecution, persist: (key: string, value: any) => Promise<void>) => Promise<void>;
/**
 * Recovers saga execution from persisted state.
 *
 * @param {string} executionId - Saga execution ID
 * @param {(key: string) => Promise<SagaExecution | null>} retrieve - Retrieval function
 * @returns {Promise<SagaExecution | null>} Recovered saga state
 *
 * @example
 * ```typescript
 * const execution = await recoverSagaState(
 *   'exec-123',
 *   async (key) => {
 *     const data = await redis.get(key);
 *     return data ? JSON.parse(data) : null;
 *   }
 * );
 *
 * if (execution && execution.status === 'running') {
 *   // Resume saga from last completed step
 *   await resumeSaga(execution, sagaDefinition);
 * }
 * ```
 */
export declare const recoverSagaState: (executionId: string, retrieve: (key: string) => Promise<SagaExecution | null>) => Promise<SagaExecution | null>;
/**
 * Implements saga timeout handling with automatic compensation.
 *
 * @param {SagaExecution} execution - Saga execution
 * @param {SagaDefinition} saga - Saga definition
 * @param {(step: SagaStepDefinition, data: any) => Promise<void>} compensateStep - Compensation function
 * @returns {Promise<SagaExecution>} Updated execution state
 *
 * @example
 * ```typescript
 * setTimeout(async () => {
 *   const timedOutExecution = await handleSagaTimeout(
 *     execution,
 *     sagaDefinition,
 *     async (step, data) => {
 *       await microserviceClient.send(step.compensation.command, data);
 *     }
 *   );
 * }, saga.timeout);
 * ```
 */
export declare const handleSagaTimeout: (execution: SagaExecution, saga: SagaDefinition, compensateStep: (step: SagaStepDefinition, data: any) => Promise<void>) => Promise<SagaExecution>;
/**
 * Creates saga choreography configuration for event-driven sagas.
 *
 * @param {string} sagaType - Saga type
 * @param {Map<string, { produceEvent: string; consumeEvent: string; compensation: string }>} eventMap - Event choreography map
 * @returns {Record<string, any>} Choreography configuration
 *
 * @example
 * ```typescript
 * const choreography = createSagaChoreography(
 *   'OrderProcessing',
 *   new Map([
 *     ['order-created', {
 *       produceEvent: 'PaymentRequested',
 *       consumeEvent: 'PaymentProcessed',
 *       compensation: 'PaymentCancelled'
 *     }],
 *     ['payment-processed', {
 *       produceEvent: 'InventoryReserved',
 *       consumeEvent: 'InventoryConfirmed',
 *       compensation: 'InventoryReleased'
 *     }]
 *   ])
 * );
 * ```
 */
export declare const createSagaChoreography: (sagaType: string, eventMap: Map<string, {
    produceEvent: string;
    consumeEvent: string;
    compensation: string;
}>) => Record<string, any>;
/**
 * Acquires distributed lock with automatic renewal.
 *
 * @param {DistributedLockConfig} config - Lock configuration
 * @param {(lockName: string, ownerId: string, ttl: number) => Promise<boolean>} acquire - Lock acquisition function
 * @returns {Promise<DistributedLock | null>} Acquired lock or null
 *
 * @example
 * ```typescript
 * const lock = await acquireDistributedLock(
 *   {
 *     lockType: 'redis',
 *     lockName: 'patient-appointment-lock',
 *     ttl: 30000,
 *     retryAttempts: 3,
 *     retryDelay: 1000,
 *     autoRenew: true
 *   },
 *   async (lockName, ownerId, ttl) => {
 *     const result = await redisClient.set(lockName, ownerId, 'PX', ttl, 'NX');
 *     return result === 'OK';
 *   }
 * );
 *
 * if (lock) {
 *   try {
 *     // Perform critical section work
 *     await updatePatientAppointment();
 *   } finally {
 *     await releaseDistributedLock(lock, redisClient);
 *   }
 * }
 * ```
 */
export declare const acquireDistributedLock: (config: DistributedLockConfig, acquire: (lockName: string, ownerId: string, ttl: number) => Promise<boolean>) => Promise<DistributedLock | null>;
/**
 * Releases distributed lock safely.
 *
 * @param {DistributedLock} lock - Lock to release
 * @param {(lockName: string, ownerId: string) => Promise<boolean>} release - Lock release function
 * @returns {Promise<boolean>} True if released successfully
 *
 * @example
 * ```typescript
 * const released = await releaseDistributedLock(
 *   lock,
 *   async (lockName, ownerId) => {
 *     // Lua script for atomic release
 *     const script = `
 *       if redis.call("get", KEYS[1]) == ARGV[1] then
 *         return redis.call("del", KEYS[1])
 *       else
 *         return 0
 *       end
 *     `;
 *     const result = await redisClient.eval(script, 1, lockName, ownerId);
 *     return result === 1;
 *   }
 * );
 * ```
 */
export declare const releaseDistributedLock: (lock: DistributedLock, release: (lockName: string, ownerId: string) => Promise<boolean>) => Promise<boolean>;
/**
 * Implements lock auto-renewal to prevent expiration during long operations.
 *
 * @param {DistributedLock} lock - Lock to renew
 * @param {DistributedLockConfig} config - Lock configuration
 * @param {(lockName: string, ownerId: string, ttl: number) => Promise<boolean>} renew - Renewal function
 * @returns {NodeJS.Timer} Renewal timer
 *
 * @example
 * ```typescript
 * const renewalTimer = startLockAutoRenewal(
 *   lock,
 *   config,
 *   async (lockName, ownerId, ttl) => {
 *     const script = `
 *       if redis.call("get", KEYS[1]) == ARGV[1] then
 *         return redis.call("pexpire", KEYS[1], ARGV[2])
 *       else
 *         return 0
 *       end
 *     `;
 *     const result = await redisClient.eval(script, 1, lockName, ownerId, ttl);
 *     return result === 1;
 *   }
 * );
 * ```
 */
export declare const startLockAutoRenewal: (lock: DistributedLock, config: DistributedLockConfig, renew: (lockName: string, ownerId: string, ttl: number) => Promise<boolean>) => NodeJS.Timer;
/**
 * Implements distributed read-write lock for concurrent access control.
 *
 * @param {string} resourceName - Resource name
 * @param {'read' | 'write'} lockType - Lock type
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<DistributedLock | null>} Acquired lock or null
 *
 * @example
 * ```typescript
 * // Multiple readers allowed
 * const readLock = await acquireReadWriteLock('patient-record-123', 'read', 30000);
 *
 * // Exclusive writer
 * const writeLock = await acquireReadWriteLock('patient-record-123', 'write', 30000);
 * ```
 */
export declare const acquireReadWriteLock: (resourceName: string, lockType: "read" | "write", ttl: number) => Promise<DistributedLock | null>;
/**
 * Implements round-robin load balancing for service endpoints.
 *
 * @param {ServiceEndpoint[]} endpoints - Available service endpoints
 * @param {number} [currentIndex=0] - Current round-robin index
 * @returns {{ endpoint: ServiceEndpoint | null; nextIndex: number }} Selected endpoint and next index
 *
 * @example
 * ```typescript
 * let roundRobinIndex = 0;
 *
 * for (let i = 0; i < 10; i++) {
 *   const { endpoint, nextIndex } = loadBalanceRoundRobin(serviceEndpoints, roundRobinIndex);
 *   roundRobinIndex = nextIndex;
 *
 *   if (endpoint) {
 *     await callService(endpoint);
 *   }
 * }
 * ```
 */
export declare const loadBalanceRoundRobin: (endpoints: ServiceEndpoint[], currentIndex?: number) => {
    endpoint: ServiceEndpoint | null;
    nextIndex: number;
};
/**
 * Implements least-connections load balancing algorithm.
 *
 * @param {ServiceEndpoint[]} endpoints - Available service endpoints
 * @returns {ServiceEndpoint | null} Endpoint with least connections
 *
 * @example
 * ```typescript
 * const endpoint = loadBalanceLeastConnections(serviceEndpoints);
 *
 * if (endpoint) {
 *   endpoint.metrics!.activeConnections++;
 *
 *   try {
 *     await callService(endpoint);
 *   } finally {
 *     endpoint.metrics!.activeConnections--;
 *   }
 * }
 * ```
 */
export declare const loadBalanceLeastConnections: (endpoints: ServiceEndpoint[]) => ServiceEndpoint | null;
/**
 * Implements weighted load balancing with health checks.
 *
 * @param {ServiceEndpoint[]} endpoints - Available service endpoints with weights
 * @returns {ServiceEndpoint | null} Selected endpoint based on weight
 *
 * @example
 * ```typescript
 * const endpoints = [
 *   { id: '1', host: 'host1', port: 3001, protocol: 'http', weight: 70, healthy: true },
 *   { id: '2', host: 'host2', port: 3002, protocol: 'http', weight: 30, healthy: true }
 * ];
 *
 * const endpoint = loadBalanceWeighted(endpoints);
 * // 70% chance to select endpoint 1, 30% chance for endpoint 2
 * ```
 */
export declare const loadBalanceWeighted: (endpoints: ServiceEndpoint[]) => ServiceEndpoint | null;
/**
 * Implements consistent hashing for session affinity and cache distribution.
 *
 * @param {string} key - Hashing key (e.g., user ID, session ID)
 * @param {ServiceEndpoint[]} endpoints - Available service endpoints
 * @param {number} [virtualNodes=150] - Number of virtual nodes per endpoint
 * @returns {ServiceEndpoint | null} Selected endpoint
 *
 * @example
 * ```typescript
 * const endpoint = loadBalanceConsistentHash(
 *   `user-${userId}`,
 *   cacheEndpoints,
 *   150
 * );
 *
 * // Same user always routes to same endpoint (session affinity)
 * // Minimal redistribution when endpoints are added/removed
 * ```
 */
export declare const loadBalanceConsistentHash: (key: string, endpoints: ServiceEndpoint[], virtualNodes?: number) => ServiceEndpoint | null;
/**
 * Creates VMware vRealize Orchestrator (vRO) configuration.
 *
 * @param {string} vcoUrl - vRealize Orchestrator URL
 * @param {string} apiVersion - API version
 * @param {any} credentials - Authentication credentials
 * @param {Partial<VRealizeConfig>} [options] - Additional options
 * @returns {VRealizeConfig} vRealize configuration
 *
 * @example
 * ```typescript
 * const vroConfig = createVRealizeConfig(
 *   'https://vro.healthcare.local',
 *   '8.0',
 *   { username: 'admin', password: 'password' },
 *   {
 *     tenantId: 'healthcare-tenant',
 *     enableHA: true,
 *     enableLoadBalancing: true
 *   }
 * );
 * ```
 */
export declare const createVRealizeConfig: (vcoUrl: string, apiVersion: string, credentials: any, options?: Partial<VRealizeConfig>) => VRealizeConfig;
/**
 * Executes vRealize workflow for distributed orchestration.
 *
 * @param {VRealizeConfig} config - vRealize configuration
 * @param {VRealizeWorkflow} workflow - Workflow definition
 * @param {(url: string, data: any) => Promise<any>} httpClient - HTTP client function
 * @returns {Promise<VRealizeOrchestrationResult>} Workflow execution result
 *
 * @example
 * ```typescript
 * const result = await executeVRealizeWorkflow(
 *   vroConfig,
 *   {
 *     workflowId: 'wf-provision-vm',
 *     workflowName: 'Provision Virtual Machine',
 *     version: '1.0',
 *     inputParameters: new Map([
 *       ['vmName', 'patient-db-01'],
 *       ['cpuCount', 4],
 *       ['memoryGB', 16],
 *       ['diskGB', 100]
 *     ]),
 *     executionMode: 'async',
 *     timeout: 300000
 *   },
 *   async (url, data) => {
 *     return await axios.post(url, data, {
 *       auth: { username: 'admin', password: 'password' }
 *     });
 *   }
 * );
 *
 * console.log(`Workflow execution: ${result.status}`);
 * ```
 */
export declare const executeVRealizeWorkflow: (config: VRealizeConfig, workflow: VRealizeWorkflow, httpClient: (url: string, data: any) => Promise<any>) => Promise<VRealizeOrchestrationResult>;
/**
 * Monitors vRealize workflow execution status.
 *
 * @param {VRealizeConfig} config - vRealize configuration
 * @param {string} executionId - Workflow execution ID
 * @param {(url: string) => Promise<any>} httpClient - HTTP client function
 * @returns {Promise<VRealizeOrchestrationResult>} Current execution status
 *
 * @example
 * ```typescript
 * const pollWorkflow = async (executionId: string) => {
 *   let result = await monitorVRealizeWorkflow(vroConfig, executionId, axios.get);
 *
 *   while (result.status === 'running' || result.status === 'pending') {
 *     await new Promise(resolve => setTimeout(resolve, 5000));
 *     result = await monitorVRealizeWorkflow(vroConfig, executionId, axios.get);
 *   }
 *
 *   return result;
 * };
 * ```
 */
export declare const monitorVRealizeWorkflow: (config: VRealizeConfig, executionId: string, httpClient: (url: string) => Promise<any>) => Promise<VRealizeOrchestrationResult>;
/**
 * Integrates vRealize with NestJS microservices for hybrid cloud orchestration.
 *
 * @param {VRealizeConfig} vroConfig - vRealize configuration
 * @param {any} microserviceClient - NestJS microservice client
 * @param {string} orchestrationPattern - Orchestration pattern
 * @returns {Record<string, any>} Integration configuration
 *
 * @example
 * ```typescript
 * const integration = integrateVRealizeWithMicroservices(
 *   vroConfig,
 *   nestMicroserviceClient,
 *   'event-driven'
 * );
 *
 * // vRealize workflow completion triggers microservice events
 * // Microservice events can trigger vRealize workflows
 * // Unified orchestration across on-prem (vRealize) and cloud (microservices)
 * ```
 */
export declare const integrateVRealizeWithMicroservices: (vroConfig: VRealizeConfig, microserviceClient: any, orchestrationPattern: "synchronous" | "event-driven" | "saga") => Record<string, any>;
/**
 * Creates distributed tracing span with context propagation.
 *
 * @param {string} serviceName - Service name
 * @param {string} operationName - Operation name
 * @param {DistributedTracingContext} [parentContext] - Parent span context
 * @returns {DistributedTracingContext} New span context
 *
 * @example
 * ```typescript
 * const span = createDistributedSpan('patient-service', 'getPatient', parentSpan);
 * span.tags.set('patient.id', patientId);
 * span.tags.set('http.method', 'GET');
 *
 * try {
 *   const patient = await patientRepository.findById(patientId);
 *   span.tags.set('http.status_code', '200');
 *   return patient;
 * } catch (error) {
 *   span.tags.set('error', 'true');
 *   span.tags.set('http.status_code', '500');
 *   logSpanError(span, error);
 *   throw error;
 * } finally {
 *   finishDistributedSpan(span);
 * }
 * ```
 */
export declare const createDistributedSpan: (serviceName: string, operationName: string, parentContext?: DistributedTracingContext) => DistributedTracingContext;
/**
 * Propagates trace context across service boundaries via HTTP headers.
 *
 * @param {DistributedTracingContext} context - Trace context
 * @param {'b3' | 'w3c' | 'jaeger'} [format='b3'] - Propagation format
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```typescript
 * const headers = propagateTraceContext(span, 'b3');
 *
 * const response = await axios.get('http://other-service/api/patients', {
 *   headers: {
 *     ...headers,
 *     'Authorization': 'Bearer token'
 *   }
 * });
 *
 * // Headers include: x-b3-traceid, x-b3-spanid, x-b3-parentspanid, x-b3-sampled
 * ```
 */
export declare const propagateTraceContext: (context: DistributedTracingContext, format?: "b3" | "w3c" | "jaeger") => Record<string, string>;
/**
 * Extracts trace context from incoming HTTP headers.
 *
 * @param {Record<string, string>} headers - HTTP headers
 * @param {'b3' | 'w3c' | 'jaeger'} [format='b3'] - Propagation format
 * @returns {Partial<DistributedTracingContext> | null} Extracted context
 *
 * @example
 * ```typescript
 * // In NestJS controller or interceptor
 * @Get('patients/:id')
 * async getPatient(@Param('id') id: string, @Headers() headers: Record<string, string>) {
 *   const parentContext = extractTraceContext(headers, 'b3');
 *   const span = createDistributedSpan('patient-service', 'getPatient', parentContext as DistributedTracingContext);
 *
 *   try {
 *     return await this.patientService.findById(id);
 *   } finally {
 *     finishDistributedSpan(span);
 *   }
 * }
 * ```
 */
export declare const extractTraceContext: (headers: Record<string, string>, format?: "b3" | "w3c" | "jaeger") => Partial<DistributedTracingContext> | null;
/**
 * Logs structured event to distributed span.
 *
 * @param {DistributedTracingContext} span - Span context
 * @param {string} event - Event name
 * @param {Record<string, any>} [fields] - Event fields
 * @returns {void}
 *
 * @example
 * ```typescript
 * logSpanEvent(span, 'database.query', {
 *   'query.statement': 'SELECT * FROM patients WHERE id = $1',
 *   'query.duration_ms': 45
 * });
 *
 * logSpanEvent(span, 'cache.hit', {
 *   'cache.key': 'patient:123',
 *   'cache.type': 'redis'
 * });
 * ```
 */
export declare const logSpanEvent: (span: DistributedTracingContext, event: string, fields?: Record<string, any>) => void;
/**
 * Creates API Gateway configuration with routing and policies.
 *
 * @param {'kong' | 'nginx' | 'envoy' | 'traefik' | 'zuul'} gatewayType - Gateway type
 * @param {APIGatewayRoute[]} routes - Gateway routes
 * @param {Partial<APIGatewayConfig>} [options] - Additional options
 * @returns {APIGatewayConfig} API Gateway configuration
 *
 * @example
 * ```typescript
 * const gatewayConfig = createAPIGatewayConfig(
 *   'kong',
 *   [
 *     {
 *       routeId: 'patient-route',
 *       path: '/api/v1/patients',
 *       method: 'GET',
 *       service: 'patient-service',
 *       timeout: 30000,
 *       retries: 3,
 *       circuitBreaker: true,
 *       cache: { enabled: true, ttl: 300, varyBy: ['userId'] }
 *     }
 *   ],
 *   {
 *     authentication: { type: 'jwt', provider: 'auth0' },
 *     rateLimiting: {
 *       requestsPerSecond: 100,
 *       burstSize: 200,
 *       strategy: 'sliding-window'
 *     }
 *   }
 * );
 * ```
 */
export declare const createAPIGatewayConfig: (gatewayType: "kong" | "nginx" | "envoy" | "traefik" | "zuul", routes: APIGatewayRoute[], options?: Partial<APIGatewayConfig>) => APIGatewayConfig;
/**
 * Implements API Gateway request transformation.
 *
 * @param {any} incomingRequest - Incoming HTTP request
 * @param {APIGatewayRoute} route - Gateway route configuration
 * @returns {any} Transformed request
 *
 * @example
 * ```typescript
 * const transformedRequest = transformAPIGatewayRequest(
 *   {
 *     method: 'GET',
 *     path: '/api/v1/patients/123',
 *     headers: { 'Authorization': 'Bearer token' }
 *   },
 *   {
 *     routeId: 'patient-route',
 *     path: '/api/v1/patients',
 *     method: 'GET',
 *     service: 'patient-service',
 *     rewritePath: '/patients', // Remove /api/v1 prefix
 *     timeout: 30000,
 *     retries: 3
 *   }
 * );
 * // Result: { method: 'GET', path: '/patients/123', headers: {...}, targetService: 'patient-service' }
 * ```
 */
export declare const transformAPIGatewayRequest: (incomingRequest: any, route: APIGatewayRoute) => any;
/**
 * Implements API Gateway response aggregation for microservices composition.
 *
 * @param {Array<{ service: string; response: any }>} responses - Service responses
 * @param {(responses: any[]) => any} aggregationStrategy - Aggregation function
 * @returns {any} Aggregated response
 *
 * @example
 * ```typescript
 * const aggregatedResponse = aggregateAPIGatewayResponses(
 *   [
 *     { service: 'patient-service', response: { id: '123', name: 'John Doe' } },
 *     { service: 'appointment-service', response: { appointments: [...] } },
 *     { service: 'medication-service', response: { medications: [...] } }
 *   ],
 *   (responses) => ({
 *     patient: responses[0],
 *     appointments: responses[1].appointments,
 *     medications: responses[2].medications
 *   })
 * );
 * ```
 */
export declare const aggregateAPIGatewayResponses: (responses: Array<{
    service: string;
    response: any;
}>, aggregationStrategy: (responses: any[]) => any) => any;
/**
 * Implements API Gateway circuit breaker with fallback.
 *
 * @param {() => Promise<any>} serviceCall - Service call function
 * @param {() => Promise<any>} fallback - Fallback function
 * @param {number} [failureThreshold=5] - Failure threshold
 * @returns {Promise<any>} Service response or fallback
 *
 * @example
 * ```typescript
 * const response = await apiGatewayCircuitBreaker(
 *   async () => {
 *     return await patientServiceClient.getPatient('123');
 *   },
 *   async () => {
 *     // Return cached data or default response
 *     return await cacheClient.get('patient:123') || { id: '123', name: 'Unknown' };
 *   },
 *   5
 * );
 * ```
 */
export declare const apiGatewayCircuitBreaker: (serviceCall: () => Promise<any>, fallback: () => Promise<any>, failureThreshold?: number) => Promise<any>;
/**
 * Creates distributed cache configuration with partitioning strategy.
 *
 * @param {'redis' | 'memcached' | 'hazelcast' | 'infinispan'} cacheType - Cache type
 * @param {string[]} nodes - Cache node addresses
 * @param {Partial<DistributedCacheConfig>} [options] - Additional options
 * @returns {DistributedCacheConfig} Distributed cache configuration
 *
 * @example
 * ```typescript
 * const cacheConfig = createDistributedCache(
 *   'redis',
 *   ['redis-1:6379', 'redis-2:6379', 'redis-3:6379'],
 *   {
 *     replicationFactor: 2,
 *     consistencyLevel: 'quorum',
 *     enablePartitioning: true,
 *     partitionStrategy: 'consistent-hash',
 *     evictionPolicy: 'lru',
 *     maxMemory: '2gb'
 *   }
 * );
 * ```
 */
export declare const createDistributedCache: (cacheType: "redis" | "memcached" | "hazelcast" | "infinispan", nodes: string[], options?: Partial<DistributedCacheConfig>) => DistributedCacheConfig;
/**
 * Implements rate limiting with distributed state.
 *
 * @param {RateLimiterConfig} config - Rate limiter configuration
 * @param {string} key - Rate limit key
 * @param {(key: string) => Promise<number>} getCurrentCount - Get current count function
 * @param {(key: string, count: number, ttl: number) => Promise<void>} updateCount - Update count function
 * @returns {Promise<{ allowed: boolean; remaining: number; resetAt: Date }>} Rate limit result
 *
 * @example
 * ```typescript
 * const rateLimitResult = await distributedRateLimiter(
 *   {
 *     algorithm: 'token-bucket',
 *     capacity: 100,
 *     refillRate: 10,
 *     refillInterval: 1000,
 *     distributed: true,
 *     keyGenerator: (ctx) => `user:${ctx.userId}`
 *   },
 *   'user:123',
 *   async (key) => {
 *     const count = await redis.get(key);
 *     return count ? parseInt(count) : 0;
 *   },
 *   async (key, count, ttl) => {
 *     await redis.set(key, count, 'EX', ttl);
 *   }
 * );
 *
 * if (!rateLimitResult.allowed) {
 *   throw new Error(`Rate limit exceeded. Try again at ${rateLimitResult.resetAt}`);
 * }
 * ```
 */
export declare const distributedRateLimiter: (config: RateLimiterConfig, key: string, getCurrentCount: (key: string) => Promise<number>, updateCount: (key: string, count: number, ttl: number) => Promise<void>) => Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: Date;
}>;
/**
 * Implements bulkhead pattern for resource isolation.
 *
 * @param {BulkheadConfig} config - Bulkhead configuration
 * @param {() => Promise<any>} operation - Operation to execute
 * @param {Map<string, number>} [activeCallsMap] - Active calls tracking
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const activeCallsMap = new Map<string, number>();
 *
 * const result = await executeBulkhead(
 *   {
 *     maxConcurrentCalls: 10,
 *     maxQueueSize: 20,
 *     queueTimeout: 5000,
 *     semaphoreType: 'async'
 *   },
 *   async () => {
 *     return await externalServiceClient.call();
 *   },
 *   activeCallsMap
 * );
 * ```
 */
export declare const executeBulkhead: (config: BulkheadConfig, operation: () => Promise<any>, activeCallsMap?: Map<string, number>) => Promise<any>;
/**
 * Creates distributed consensus configuration for leader election and coordination.
 *
 * @param {'raft' | 'paxos' | 'etcd' | 'zookeeper'} algorithm - Consensus algorithm
 * @param {string} nodeId - Current node identifier
 * @param {string[]} clusterNodes - Cluster node addresses
 * @param {Partial<ConsensusConfig>} [options] - Additional options
 * @returns {ConsensusConfig} Consensus configuration
 *
 * @example
 * ```typescript
 * const consensusConfig = createConsensusConfig(
 *   'raft',
 *   'node-1',
 *   ['node-1:5000', 'node-2:5000', 'node-3:5000'],
 *   {
 *     electionTimeout: 5000,
 *     heartbeatInterval: 1000,
 *     snapshotInterval: 10000
 *   }
 * );
 *
 * // Use for leader election, distributed configuration, or service coordination
 * ```
 */
export declare const createConsensusConfig: (algorithm: "raft" | "paxos" | "etcd" | "zookeeper", nodeId: string, clusterNodes: string[], options?: Partial<ConsensusConfig>) => ConsensusConfig;
export {};
//# sourceMappingURL=virtual-distributed-systems-kit.d.ts.map