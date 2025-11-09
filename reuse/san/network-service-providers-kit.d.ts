/**
 * LOC: NETSVP1234567
 * File: /reuse/san/network-service-providers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network service implementations
 *   - NestJS network modules
 *   - Virtual network controllers
 */
/**
 * File: /reuse/san/network-service-providers-kit.ts
 * Locator: WC-UTL-NETSVP-001
 * Purpose: Comprehensive Network Service Providers Kit - injectable services, factories, lifecycle, pooling, health checks, discovery, load balancing, proxies
 *
 * Upstream: Independent utility module for NestJS network service implementation
 * Downstream: ../backend/*, Network controllers, middleware, service modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ utility functions for network service providers, factories, lifecycle, connection pooling, health checks, discovery, load balancers, proxies
 *
 * LLM Context: Comprehensive network service provider utilities for implementing production-ready software-defined networking patterns.
 * Provides injectable network services, service factories, lifecycle management, connection pooling, health monitoring, service discovery,
 * load balancing, and proxy services. Essential for scalable virtual network infrastructure in healthcare environments.
 */
import { Scope } from '@nestjs/common';
import { Sequelize } from 'sequelize';
interface NetworkServiceConfig {
    serviceName: string;
    serviceId: string;
    host: string;
    port: number;
    protocol: 'tcp' | 'udp' | 'http' | 'https' | 'grpc';
    healthCheckInterval: number;
    retryAttempts: number;
    timeout: number;
    metadata: Record<string, any>;
}
interface ServiceInstance {
    id: string;
    serviceName: string;
    host: string;
    port: number;
    status: 'healthy' | 'unhealthy' | 'starting' | 'stopping';
    lastHealthCheck: Date;
    metadata: Record<string, any>;
}
interface ConnectionPoolConfig {
    minConnections: number;
    maxConnections: number;
    acquireTimeout: number;
    idleTimeout: number;
    validationInterval: number;
    evictionRunInterval: number;
}
interface Connection {
    id: string;
    serviceId: string;
    status: 'idle' | 'active' | 'validating' | 'closed';
    createdAt: Date;
    lastUsedAt: Date;
    useCount: number;
    socket?: any;
}
interface ServiceHealthStatus {
    serviceId: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastCheck: Date;
    responseTime: number;
    consecutiveFailures: number;
    uptime: number;
    metrics: ServiceMetrics;
}
interface ServiceMetrics {
    requestCount: number;
    errorCount: number;
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    throughput: number;
}
interface ServiceDiscoveryConfig {
    registryUrl: string;
    serviceName: string;
    heartbeatInterval: number;
    deregisterOnShutdown: boolean;
    tags: string[];
    checkEndpoint: string;
}
interface LoadBalancerConfig {
    strategy: 'round-robin' | 'least-connections' | 'weighted' | 'ip-hash' | 'random';
    healthCheckEnabled: boolean;
    healthCheckInterval: number;
    maxRetries: number;
    retryBackoff: number;
}
interface ProxyConfig {
    targetService: string;
    timeout: number;
    retries: number;
    circuitBreakerThreshold: number;
    circuitBreakerTimeout: number;
    enableCaching: boolean;
    cacheUrl: number;
}
interface ServiceFactory<T> {
    create(config: any): T;
    destroy(instance: T): Promise<void>;
    validate(instance: T): Promise<boolean>;
}
interface CircuitBreakerState {
    state: 'closed' | 'open' | 'half-open';
    failures: number;
    lastFailureTime: number;
    successCount: number;
    nextAttemptTime: number;
}
/**
 * Sequelize model for Network Service Registry with status tracking and metadata.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkService model
 *
 * @example
 * ```typescript
 * const NetworkService = createNetworkServiceModel(sequelize);
 * const service = await NetworkService.create({
 *   serviceName: 'patient-api',
 *   serviceId: 'svc_abc123',
 *   host: '10.0.1.50',
 *   port: 8080,
 *   protocol: 'https',
 *   status: 'healthy'
 * });
 * ```
 */
export declare const createNetworkServiceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        serviceName: string;
        serviceId: string;
        host: string;
        port: number;
        protocol: string;
        status: string;
        healthCheckUrl: string;
        healthCheckInterval: number;
        tags: string[];
        weight: number;
        priority: number;
        metadata: Record<string, any>;
        lastHealthCheck: Date | null;
        registeredAt: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Network Connection Pool tracking with lifecycle management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkConnection model
 *
 * @example
 * ```typescript
 * const NetworkConnection = createNetworkConnectionModel(sequelize);
 * const connection = await NetworkConnection.create({
 *   connectionId: 'conn_xyz789',
 *   serviceId: 'svc_abc123',
 *   status: 'active',
 *   poolId: 'pool_001'
 * });
 * ```
 */
export declare const createNetworkConnectionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        connectionId: string;
        serviceId: string;
        poolId: string;
        status: string;
        localAddress: string;
        localPort: number;
        remoteAddress: string;
        remotePort: number;
        protocol: string;
        createdAt: Date;
        lastUsedAt: Date;
        useCount: number;
        errorCount: number;
        metadata: Record<string, any>;
        closedAt: Date | null;
    };
};
/**
 * Sequelize model for Service Health Check logs with metrics and status history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ServiceHealthLog model
 *
 * @example
 * ```typescript
 * const ServiceHealthLog = createServiceHealthLogModel(sequelize);
 * const log = await ServiceHealthLog.create({
 *   serviceId: 'svc_abc123',
 *   status: 'healthy',
 *   responseTime: 45,
 *   checkType: 'http'
 * });
 * ```
 */
export declare const createServiceHealthLogModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        serviceId: string;
        status: string;
        responseTime: number;
        checkType: string;
        errorMessage: string | null;
        statusCode: number | null;
        metrics: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Creates injectable NestJS service class decorator with proper metadata.
 *
 * @param {string} serviceName - Service name for identification
 * @param {Scope} [scope=Scope.DEFAULT] - Service injection scope
 * @returns {ClassDecorator} Injectable decorator
 *
 * @example
 * ```typescript
 * @createInjectableService('PatientNetworkService', Scope.DEFAULT)
 * class PatientNetworkService {
 *   constructor(private configService: ConfigService) {}
 * }
 * ```
 */
export declare const createInjectableService: (serviceName: string, scope?: Scope) => ClassDecorator;
/**
 * Registers network service with NestJS dependency injection container.
 *
 * @param {any} serviceClass - Service class to register
 * @param {NetworkServiceConfig} config - Service configuration
 * @returns {any} Provider definition
 *
 * @example
 * ```typescript
 * const provider = registerNetworkService(PatientNetworkService, {
 *   serviceName: 'patient-api',
 *   serviceId: 'svc_123',
 *   host: '10.0.1.50',
 *   port: 8080,
 *   protocol: 'https',
 *   healthCheckInterval: 30000,
 *   retryAttempts: 3,
 *   timeout: 5000,
 *   metadata: {}
 * });
 * ```
 */
export declare const registerNetworkService: (serviceClass: any, config: NetworkServiceConfig) => any;
/**
 * Creates network service with automatic health checking and lifecycle management.
 *
 * @param {NetworkServiceConfig} config - Service configuration
 * @returns {any} Service class with lifecycle hooks
 *
 * @example
 * ```typescript
 * const NetworkServiceClass = createManagedNetworkService({
 *   serviceName: 'medical-records',
 *   serviceId: 'svc_med_001',
 *   host: '192.168.1.100',
 *   port: 9090,
 *   protocol: 'grpc',
 *   healthCheckInterval: 15000,
 *   retryAttempts: 5,
 *   timeout: 3000,
 *   metadata: { region: 'us-east-1' }
 * });
 * ```
 */
export declare const createManagedNetworkService: (config: NetworkServiceConfig) => any;
/**
 * Decorates service method with automatic retry logic for network failures.
 *
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} backoffMs - Backoff delay in milliseconds
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * class PatientService {
 *   @withRetry(3, 1000)
 *   async fetchPatientData(patientId: string) {
 *     return await this.httpClient.get(`/patients/${patientId}`);
 *   }
 * }
 * ```
 */
export declare const withRetry: (maxRetries: number, backoffMs: number) => MethodDecorator;
/**
 * Creates singleton network service instance with lazy initialization.
 *
 * @param {Function} serviceFactory - Factory function for service creation
 * @returns {any} Singleton provider
 *
 * @example
 * ```typescript
 * const provider = createSingletonNetworkService(() => {
 *   return new NetworkMonitoringService(config);
 * });
 * ```
 */
export declare const createSingletonNetworkService: (serviceFactory: () => any) => any;
/**
 * Creates factory provider for dynamic network service instantiation.
 *
 * @param {string} token - Injection token
 * @param {ServiceFactory<T>} factory - Service factory implementation
 * @returns {any} Factory provider
 *
 * @example
 * ```typescript
 * const factory: ServiceFactory<DatabaseConnection> = {
 *   create: (config) => new DatabaseConnection(config),
 *   destroy: async (conn) => await conn.close(),
 *   validate: async (conn) => await conn.ping()
 * };
 * const provider = createServiceFactory('DB_CONNECTION_FACTORY', factory);
 * ```
 */
export declare const createServiceFactory: <T>(token: string, factory: ServiceFactory<T>) => any;
/**
 * Builds network service instance with configuration and dependency injection.
 *
 * @param {any} ServiceClass - Service class constructor
 * @param {NetworkServiceConfig} config - Service configuration
 * @param {any[]} dependencies - Injected dependencies
 * @returns {any} Service instance
 *
 * @example
 * ```typescript
 * const service = buildNetworkService(
 *   PatientNetworkService,
 *   { serviceName: 'patient-api', host: '10.0.1.50', port: 8080, ... },
 *   [configService, loggerService]
 * );
 * ```
 */
export declare const buildNetworkService: (ServiceClass: any, config: NetworkServiceConfig, dependencies?: any[]) => any;
/**
 * Creates async factory provider for services requiring async initialization.
 *
 * @param {string} token - Injection token
 * @param {Function} asyncFactory - Async factory function
 * @param {any[]} inject - Dependencies to inject
 * @returns {any} Async provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncServiceFactory(
 *   'NETWORK_CLIENT',
 *   async (configService) => {
 *     const config = await configService.getNetworkConfig();
 *     return new NetworkClient(config);
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export declare const createAsyncServiceFactory: (token: string, asyncFactory: (...args: any[]) => Promise<any>, inject?: any[]) => any;
/**
 * Creates builder pattern for fluent network service configuration.
 *
 * @returns {ServiceBuilder} Service builder instance
 *
 * @example
 * ```typescript
 * const service = createServiceBuilder()
 *   .withName('patient-gateway')
 *   .withHost('10.0.1.50')
 *   .withPort(8080)
 *   .withProtocol('https')
 *   .withHealthCheck('/health', 30000)
 *   .withRetry(3, 1000)
 *   .build();
 * ```
 */
export declare const createServiceBuilder: () => {
    withName(name: string): /*elided*/ any;
    withId(id: string): /*elided*/ any;
    withHost(host: string): /*elided*/ any;
    withPort(port: number): /*elided*/ any;
    withProtocol(protocol: "tcp" | "udp" | "http" | "https" | "grpc"): /*elided*/ any;
    withHealthCheck(interval: number): /*elided*/ any;
    withRetry(attempts: number, timeout: number): /*elided*/ any;
    withMetadata(metadata: Record<string, any>): /*elided*/ any;
    build(): NetworkServiceConfig;
};
/**
 * Clones existing service configuration with optional overrides.
 *
 * @param {NetworkServiceConfig} config - Original configuration
 * @param {Partial<NetworkServiceConfig>} overrides - Configuration overrides
 * @returns {NetworkServiceConfig} Cloned configuration
 *
 * @example
 * ```typescript
 * const newConfig = cloneServiceConfig(existingConfig, {
 *   serviceId: 'svc_new_001',
 *   port: 8081
 * });
 * ```
 */
export declare const cloneServiceConfig: (config: NetworkServiceConfig, overrides?: Partial<NetworkServiceConfig>) => NetworkServiceConfig;
/**
 * Initializes network service with dependency resolution and startup sequence.
 *
 * @param {any} service - Service instance
 * @param {any[]} dependencies - Service dependencies
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await initializeNetworkService(patientService, [
 *   databaseService,
 *   cacheService,
 *   loggerService
 * ]);
 * ```
 */
export declare const initializeNetworkService: (service: any, dependencies?: any[]) => Promise<void>;
/**
 * Gracefully shuts down network service with cleanup and resource release.
 *
 * @param {any} service - Service instance
 * @param {number} [timeoutMs=5000] - Shutdown timeout
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await shutdownNetworkService(patientService, 10000);
 * ```
 */
export declare const shutdownNetworkService: (service: any, timeoutMs?: number) => Promise<void>;
/**
 * Restarts network service with full lifecycle reset.
 *
 * @param {any} service - Service instance
 * @param {any[]} dependencies - Service dependencies
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restartNetworkService(patientService, [databaseService]);
 * ```
 */
export declare const restartNetworkService: (service: any, dependencies?: any[]) => Promise<void>;
/**
 * Monitors service lifecycle events and emits notifications.
 *
 * @param {any} service - Service instance
 * @param {Function} eventHandler - Event handler callback
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = monitorServiceLifecycle(service, (event) => {
 *   console.log('Lifecycle event:', event);
 * });
 * // Later: cleanup();
 * ```
 */
export declare const monitorServiceLifecycle: (service: any, eventHandler: (event: any) => void) => (() => void);
/**
 * Validates service is ready to handle requests.
 *
 * @param {any} service - Service instance
 * @returns {Promise<boolean>} Readiness status
 *
 * @example
 * ```typescript
 * const ready = await validateServiceReadiness(patientService);
 * if (ready) {
 *   console.log('Service is ready to accept requests');
 * }
 * ```
 */
export declare const validateServiceReadiness: (service: any) => Promise<boolean>;
/**
 * Creates connection pool with configurable size and validation.
 *
 * @param {ConnectionPoolConfig} config - Pool configuration
 * @returns {ConnectionPool} Connection pool instance
 *
 * @example
 * ```typescript
 * const pool = createConnectionPool({
 *   minConnections: 5,
 *   maxConnections: 20,
 *   acquireTimeout: 3000,
 *   idleTimeout: 60000,
 *   validationInterval: 30000,
 *   evictionRunInterval: 10000
 * });
 * ```
 */
export declare const createConnectionPool: (config: ConnectionPoolConfig) => {
    acquire(serviceId: string): Promise<Connection>;
    release(connection: Connection): Promise<void>;
    validate(connection: Connection): Promise<boolean>;
    drain(): Promise<void>;
    getStats(): {
        total: number;
        idle: number;
        active: number;
        config: ConnectionPoolConfig;
    };
};
/**
 * Acquires connection from pool with timeout and retry logic.
 *
 * @param {any} pool - Connection pool
 * @param {string} serviceId - Service identifier
 * @param {number} [timeoutMs=3000] - Acquisition timeout
 * @returns {Promise<Connection>} Acquired connection
 *
 * @example
 * ```typescript
 * const connection = await acquirePooledConnection(pool, 'svc_abc123', 5000);
 * try {
 *   await connection.execute(query);
 * } finally {
 *   await pool.release(connection);
 * }
 * ```
 */
export declare const acquirePooledConnection: (pool: any, serviceId: string, timeoutMs?: number) => Promise<Connection>;
/**
 * Validates and evicts stale connections from pool.
 *
 * @param {any} pool - Connection pool
 * @param {number} maxIdleMs - Maximum idle time in milliseconds
 * @returns {Promise<number>} Number of connections evicted
 *
 * @example
 * ```typescript
 * const evicted = await evictStaleConnections(pool, 300000); // 5 minutes
 * console.log(`Evicted ${evicted} stale connections`);
 * ```
 */
export declare const evictStaleConnections: (pool: any, maxIdleMs: number) => Promise<number>;
/**
 * Monitors connection pool metrics and health.
 *
 * @param {any} pool - Connection pool
 * @returns {any} Pool health metrics
 *
 * @example
 * ```typescript
 * const metrics = getPoolMetrics(pool);
 * console.log(`Pool utilization: ${metrics.utilization}%`);
 * ```
 */
export declare const getPoolMetrics: (pool: any) => any;
/**
 * Implements connection warmup strategy for pool initialization.
 *
 * @param {any} pool - Connection pool
 * @param {string} serviceId - Service identifier
 * @param {number} count - Number of connections to warm up
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await warmupConnectionPool(pool, 'svc_database', 5);
 * ```
 */
export declare const warmupConnectionPool: (pool: any, serviceId: string, count: number) => Promise<void>;
/**
 * Performs HTTP health check on network service endpoint.
 *
 * @param {string} serviceId - Service identifier
 * @param {string} healthCheckUrl - Health check endpoint URL
 * @param {number} [timeoutMs=5000] - Request timeout
 * @returns {Promise<ServiceHealthStatus>} Health status
 *
 * @example
 * ```typescript
 * const status = await performServiceHealthCheck(
 *   'svc_patient_api',
 *   'https://10.0.1.50:8080/health',
 *   3000
 * );
 * ```
 */
export declare const performServiceHealthCheck: (serviceId: string, healthCheckUrl: string, timeoutMs?: number) => Promise<ServiceHealthStatus>;
/**
 * Creates scheduled health check monitor for service.
 *
 * @param {string} serviceId - Service identifier
 * @param {string} healthCheckUrl - Health check endpoint
 * @param {number} intervalMs - Check interval in milliseconds
 * @param {Function} onStatusChange - Status change callback
 * @returns {Function} Stop monitoring function
 *
 * @example
 * ```typescript
 * const stopMonitoring = createHealthCheckMonitor(
 *   'svc_patient_api',
 *   'https://10.0.1.50:8080/health',
 *   30000,
 *   (status) => console.log('Health status changed:', status)
 * );
 * ```
 */
export declare const createHealthCheckMonitor: (serviceId: string, healthCheckUrl: string, intervalMs: number, onStatusChange: (status: ServiceHealthStatus) => void) => (() => void);
/**
 * Aggregates health metrics from multiple service instances.
 *
 * @param {ServiceHealthStatus[]} statuses - Array of service health statuses
 * @returns {any} Aggregated health metrics
 *
 * @example
 * ```typescript
 * const aggregated = aggregateHealthMetrics([
 *   status1, status2, status3
 * ]);
 * console.log(`Average response time: ${aggregated.averageResponseTime}ms`);
 * ```
 */
export declare const aggregateHealthMetrics: (statuses: ServiceHealthStatus[]) => any;
/**
 * Logs service health check results to database.
 *
 * @param {ServiceHealthStatus} status - Health status to log
 * @param {Model} HealthLogModel - Sequelize model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logServiceHealth(healthStatus, ServiceHealthLogModel);
 * ```
 */
export declare const logServiceHealth: (status: ServiceHealthStatus, HealthLogModel: any) => Promise<void>;
/**
 * Retrieves service health history from logs.
 *
 * @param {string} serviceId - Service identifier
 * @param {number} hoursBack - Hours of history to retrieve
 * @param {Model} HealthLogModel - Sequelize model
 * @returns {Promise<any[]>} Health history
 *
 * @example
 * ```typescript
 * const history = await getServiceHealthHistory('svc_patient_api', 24, ServiceHealthLogModel);
 * ```
 */
export declare const getServiceHealthHistory: (serviceId: string, hoursBack: number, HealthLogModel: any) => Promise<any[]>;
/**
 * Registers service with discovery registry.
 *
 * @param {ServiceDiscoveryConfig} config - Discovery configuration
 * @param {Model} ServiceModel - Sequelize model
 * @returns {Promise<string>} Registration ID
 *
 * @example
 * ```typescript
 * const regId = await registerServiceWithDiscovery({
 *   registryUrl: 'http://consul:8500',
 *   serviceName: 'patient-api',
 *   heartbeatInterval: 15000,
 *   deregisterOnShutdown: true,
 *   tags: ['healthcare', 'hipaa'],
 *   checkEndpoint: '/health'
 * }, NetworkServiceModel);
 * ```
 */
export declare const registerServiceWithDiscovery: (config: ServiceDiscoveryConfig, ServiceModel: any) => Promise<string>;
/**
 * Discovers available service instances by name and tags.
 *
 * @param {string} serviceName - Service name to discover
 * @param {string[]} [tags] - Optional tags for filtering
 * @param {Model} ServiceModel - Sequelize model
 * @returns {Promise<ServiceInstance[]>} Available service instances
 *
 * @example
 * ```typescript
 * const instances = await discoverServiceInstances(
 *   'patient-api',
 *   ['healthcare', 'production'],
 *   NetworkServiceModel
 * );
 * ```
 */
export declare const discoverServiceInstances: (serviceName: string, tags: string[] | undefined, ServiceModel: any) => Promise<ServiceInstance[]>;
/**
 * Deregisters service from discovery registry.
 *
 * @param {string} serviceId - Service identifier
 * @param {Model} ServiceModel - Sequelize model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deregisterService('svc_patient_api_123456', NetworkServiceModel);
 * ```
 */
export declare const deregisterService: (serviceId: string, ServiceModel: any) => Promise<void>;
/**
 * Updates service heartbeat to maintain registration.
 *
 * @param {string} serviceId - Service identifier
 * @param {Model} ServiceModel - Sequelize model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * setInterval(async () => {
 *   await sendServiceHeartbeat('svc_patient_api_123456', NetworkServiceModel);
 * }, 15000);
 * ```
 */
export declare const sendServiceHeartbeat: (serviceId: string, ServiceModel: any) => Promise<void>;
/**
 * Creates load balancer with configurable strategy.
 *
 * @param {LoadBalancerConfig} config - Load balancer configuration
 * @returns {any} Load balancer instance
 *
 * @example
 * ```typescript
 * const lb = createLoadBalancer({
 *   strategy: 'round-robin',
 *   healthCheckEnabled: true,
 *   healthCheckInterval: 30000,
 *   maxRetries: 3,
 *   retryBackoff: 1000
 * });
 * ```
 */
export declare const createLoadBalancer: (config: LoadBalancerConfig) => {
    selectInstance(instances: ServiceInstance[]): ServiceInstance | null;
    recordConnection(instanceId: string, increment: boolean): void;
    getStats(): {
        strategy: "round-robin" | "random" | "least-connections" | "weighted" | "ip-hash";
        connectionCounts: {
            [k: string]: number;
        };
    };
};
/**
 * Implements round-robin load balancing algorithm.
 *
 * @param {ServiceInstance[]} instances - Available service instances
 * @param {number} currentIndex - Current round-robin index
 * @returns {{ instance: ServiceInstance; nextIndex: number }} Selected instance and next index
 *
 * @example
 * ```typescript
 * const { instance, nextIndex } = roundRobinSelect(instances, currentIndex);
 * currentIndex = nextIndex;
 * ```
 */
export declare const roundRobinSelect: (instances: ServiceInstance[], currentIndex: number) => {
    instance: ServiceInstance;
    nextIndex: number;
};
/**
 * Implements least-connections load balancing algorithm.
 *
 * @param {ServiceInstance[]} instances - Available service instances
 * @param {Map<string, number>} connectionCounts - Current connection counts
 * @returns {ServiceInstance} Instance with least connections
 *
 * @example
 * ```typescript
 * const instance = leastConnectionsSelect(instances, connectionCountsMap);
 * ```
 */
export declare const leastConnectionsSelect: (instances: ServiceInstance[], connectionCounts: Map<string, number>) => ServiceInstance;
/**
 * Implements weighted load balancing based on instance capacity.
 *
 * @param {ServiceInstance[]} instances - Available service instances
 * @returns {ServiceInstance} Weighted-randomly selected instance
 *
 * @example
 * ```typescript
 * const instance = weightedSelect(instances);
 * ```
 */
export declare const weightedSelect: (instances: ServiceInstance[]) => ServiceInstance;
/**
 * Creates HTTP proxy service with retry and circuit breaker.
 *
 * @param {ProxyConfig} config - Proxy configuration
 * @returns {any} Proxy service instance
 *
 * @example
 * ```typescript
 * const proxy = createProxyService({
 *   targetService: 'patient-api',
 *   timeout: 5000,
 *   retries: 3,
 *   circuitBreakerThreshold: 5,
 *   circuitBreakerTimeout: 30000,
 *   enableCaching: true,
 *   cacheUrl: 300
 * });
 * ```
 */
export declare const createProxyService: (config: ProxyConfig) => {
    proxy(request: any): Promise<any>;
    getCircuitBreakerState(): CircuitBreakerState;
    resetCircuitBreaker(): void;
};
/**
 * Implements circuit breaker pattern for network calls.
 *
 * @param {number} failureThreshold - Failures before opening circuit
 * @param {number} timeoutMs - Time to wait before half-open
 * @returns {any} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker(5, 30000);
 * const result = await breaker.execute(async () => {
 *   return await networkCall();
 * });
 * ```
 */
export declare const createCircuitBreaker: (failureThreshold: number, timeoutMs: number) => {
    execute<T>(fn: () => Promise<T>): Promise<T>;
    getState(): CircuitBreakerState;
    reset(): void;
};
/**
 * Implements request retry logic with exponential backoff.
 *
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelayMs - Base delay in milliseconds
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   async () => await fetchPatientData(patientId),
 *   3,
 *   1000
 * );
 * ```
 */
export declare const retryWithBackoff: <T>(fn: () => Promise<T>, maxRetries: number, baseDelayMs: number) => Promise<T>;
/**
 * Creates request timeout wrapper with cancellation.
 *
 * @param {Function} fn - Function to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<T>} Function result or timeout error
 *
 * @example
 * ```typescript
 * try {
 *   const result = await withTimeout(
 *     async () => await slowNetworkCall(),
 *     5000
 *   );
 * } catch (error) {
 *   console.error('Request timed out');
 * }
 * ```
 */
export declare const withTimeout: <T>(fn: () => Promise<T>, timeoutMs: number) => Promise<T>;
declare const _default: {
    createNetworkServiceModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            serviceName: string;
            serviceId: string;
            host: string;
            port: number;
            protocol: string;
            status: string;
            healthCheckUrl: string;
            healthCheckInterval: number;
            tags: string[];
            weight: number;
            priority: number;
            metadata: Record<string, any>;
            lastHealthCheck: Date | null;
            registeredAt: Date;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkConnectionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            connectionId: string;
            serviceId: string;
            poolId: string;
            status: string;
            localAddress: string;
            localPort: number;
            remoteAddress: string;
            remotePort: number;
            protocol: string;
            createdAt: Date;
            lastUsedAt: Date;
            useCount: number;
            errorCount: number;
            metadata: Record<string, any>;
            closedAt: Date | null;
        };
    };
    createServiceHealthLogModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            serviceId: string;
            status: string;
            responseTime: number;
            checkType: string;
            errorMessage: string | null;
            statusCode: number | null;
            metrics: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createInjectableService: (serviceName: string, scope?: Scope) => ClassDecorator;
    registerNetworkService: (serviceClass: any, config: NetworkServiceConfig) => any;
    createManagedNetworkService: (config: NetworkServiceConfig) => any;
    withRetry: (maxRetries: number, backoffMs: number) => MethodDecorator;
    createSingletonNetworkService: (serviceFactory: () => any) => any;
    createServiceFactory: <T>(token: string, factory: ServiceFactory<T>) => any;
    buildNetworkService: (ServiceClass: any, config: NetworkServiceConfig, dependencies?: any[]) => any;
    createAsyncServiceFactory: (token: string, asyncFactory: (...args: any[]) => Promise<any>, inject?: any[]) => any;
    createServiceBuilder: () => {
        withName(name: string): /*elided*/ any;
        withId(id: string): /*elided*/ any;
        withHost(host: string): /*elided*/ any;
        withPort(port: number): /*elided*/ any;
        withProtocol(protocol: "tcp" | "udp" | "http" | "https" | "grpc"): /*elided*/ any;
        withHealthCheck(interval: number): /*elided*/ any;
        withRetry(attempts: number, timeout: number): /*elided*/ any;
        withMetadata(metadata: Record<string, any>): /*elided*/ any;
        build(): NetworkServiceConfig;
    };
    cloneServiceConfig: (config: NetworkServiceConfig, overrides?: Partial<NetworkServiceConfig>) => NetworkServiceConfig;
    initializeNetworkService: (service: any, dependencies?: any[]) => Promise<void>;
    shutdownNetworkService: (service: any, timeoutMs?: number) => Promise<void>;
    restartNetworkService: (service: any, dependencies?: any[]) => Promise<void>;
    monitorServiceLifecycle: (service: any, eventHandler: (event: any) => void) => (() => void);
    validateServiceReadiness: (service: any) => Promise<boolean>;
    createConnectionPool: (config: ConnectionPoolConfig) => {
        acquire(serviceId: string): Promise<Connection>;
        release(connection: Connection): Promise<void>;
        validate(connection: Connection): Promise<boolean>;
        drain(): Promise<void>;
        getStats(): {
            total: number;
            idle: number;
            active: number;
            config: ConnectionPoolConfig;
        };
    };
    acquirePooledConnection: (pool: any, serviceId: string, timeoutMs?: number) => Promise<Connection>;
    evictStaleConnections: (pool: any, maxIdleMs: number) => Promise<number>;
    getPoolMetrics: (pool: any) => any;
    warmupConnectionPool: (pool: any, serviceId: string, count: number) => Promise<void>;
    performServiceHealthCheck: (serviceId: string, healthCheckUrl: string, timeoutMs?: number) => Promise<ServiceHealthStatus>;
    createHealthCheckMonitor: (serviceId: string, healthCheckUrl: string, intervalMs: number, onStatusChange: (status: ServiceHealthStatus) => void) => (() => void);
    aggregateHealthMetrics: (statuses: ServiceHealthStatus[]) => any;
    logServiceHealth: (status: ServiceHealthStatus, HealthLogModel: any) => Promise<void>;
    getServiceHealthHistory: (serviceId: string, hoursBack: number, HealthLogModel: any) => Promise<any[]>;
    registerServiceWithDiscovery: (config: ServiceDiscoveryConfig, ServiceModel: any) => Promise<string>;
    discoverServiceInstances: (serviceName: string, tags: string[] | undefined, ServiceModel: any) => Promise<ServiceInstance[]>;
    deregisterService: (serviceId: string, ServiceModel: any) => Promise<void>;
    sendServiceHeartbeat: (serviceId: string, ServiceModel: any) => Promise<void>;
    createLoadBalancer: (config: LoadBalancerConfig) => {
        selectInstance(instances: ServiceInstance[]): ServiceInstance | null;
        recordConnection(instanceId: string, increment: boolean): void;
        getStats(): {
            strategy: "round-robin" | "random" | "least-connections" | "weighted" | "ip-hash";
            connectionCounts: {
                [k: string]: number;
            };
        };
    };
    roundRobinSelect: (instances: ServiceInstance[], currentIndex: number) => {
        instance: ServiceInstance;
        nextIndex: number;
    };
    leastConnectionsSelect: (instances: ServiceInstance[], connectionCounts: Map<string, number>) => ServiceInstance;
    weightedSelect: (instances: ServiceInstance[]) => ServiceInstance;
    createProxyService: (config: ProxyConfig) => {
        proxy(request: any): Promise<any>;
        getCircuitBreakerState(): CircuitBreakerState;
        resetCircuitBreaker(): void;
    };
    createCircuitBreaker: (failureThreshold: number, timeoutMs: number) => {
        execute<T>(fn: () => Promise<T>): Promise<T>;
        getState(): CircuitBreakerState;
        reset(): void;
    };
    retryWithBackoff: <T>(fn: () => Promise<T>, maxRetries: number, baseDelayMs: number) => Promise<T>;
    withTimeout: <T>(fn: () => Promise<T>, timeoutMs: number) => Promise<T>;
};
export default _default;
//# sourceMappingURL=network-service-providers-kit.d.ts.map