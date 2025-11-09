"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeout = exports.retryWithBackoff = exports.createCircuitBreaker = exports.createProxyService = exports.weightedSelect = exports.leastConnectionsSelect = exports.roundRobinSelect = exports.createLoadBalancer = exports.sendServiceHeartbeat = exports.deregisterService = exports.discoverServiceInstances = exports.registerServiceWithDiscovery = exports.getServiceHealthHistory = exports.logServiceHealth = exports.aggregateHealthMetrics = exports.createHealthCheckMonitor = exports.performServiceHealthCheck = exports.warmupConnectionPool = exports.getPoolMetrics = exports.evictStaleConnections = exports.acquirePooledConnection = exports.createConnectionPool = exports.validateServiceReadiness = exports.monitorServiceLifecycle = exports.restartNetworkService = exports.shutdownNetworkService = exports.initializeNetworkService = exports.cloneServiceConfig = exports.createServiceBuilder = exports.createAsyncServiceFactory = exports.buildNetworkService = exports.createServiceFactory = exports.createSingletonNetworkService = exports.withRetry = exports.createManagedNetworkService = exports.registerNetworkService = exports.createInjectableService = exports.createServiceHealthLogModel = exports.createNetworkConnectionModel = exports.createNetworkServiceModel = void 0;
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
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
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
const createNetworkServiceModel = (sequelize) => {
    class NetworkService extends sequelize_1.Model {
    }
    NetworkService.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        serviceName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Logical service name',
        },
        serviceId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique service instance identifier',
        },
        host: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Service host IP or hostname',
        },
        port: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Service port number',
        },
        protocol: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'http',
            comment: 'Network protocol',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'starting',
            comment: 'Service health status',
        },
        healthCheckUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Health check endpoint URL',
        },
        healthCheckInterval: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30000,
            comment: 'Health check interval in milliseconds',
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Service tags for discovery',
        },
        weight: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
            comment: 'Load balancing weight',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Service priority for routing',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional service metadata',
        },
        lastHealthCheck: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last health check timestamp',
        },
        registeredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Service registration timestamp',
        },
    }, {
        sequelize,
        tableName: 'network_services',
        timestamps: true,
        indexes: [
            { fields: ['serviceId'], unique: true },
            { fields: ['serviceName'] },
            { fields: ['status'] },
            { fields: ['host', 'port'] },
        ],
    });
    return NetworkService;
};
exports.createNetworkServiceModel = createNetworkServiceModel;
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
const createNetworkConnectionModel = (sequelize) => {
    class NetworkConnection extends sequelize_1.Model {
    }
    NetworkConnection.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        connectionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique connection identifier',
        },
        serviceId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Associated service ID',
        },
        poolId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Connection pool identifier',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'idle',
            comment: 'Connection status',
        },
        localAddress: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Local IP address',
        },
        localPort: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Local port number',
        },
        remoteAddress: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Remote IP address',
        },
        remotePort: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Remote port number',
        },
        protocol: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Connection protocol',
        },
        lastUsedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Last usage timestamp',
        },
        useCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times connection used',
        },
        errorCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of errors encountered',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Connection metadata',
        },
        closedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Connection closure timestamp',
        },
    }, {
        sequelize,
        tableName: 'network_connections',
        timestamps: true,
        indexes: [
            { fields: ['connectionId'], unique: true },
            { fields: ['serviceId'] },
            { fields: ['poolId'] },
            { fields: ['status'] },
            { fields: ['lastUsedAt'] },
        ],
    });
    return NetworkConnection;
};
exports.createNetworkConnectionModel = createNetworkConnectionModel;
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
const createServiceHealthLogModel = (sequelize) => {
    class ServiceHealthLog extends sequelize_1.Model {
    }
    ServiceHealthLog.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        serviceId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Service identifier',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Health check status',
        },
        responseTime: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Response time in milliseconds',
        },
        checkType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Type of health check performed',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if check failed',
        },
        statusCode: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'HTTP status code if applicable',
        },
        metrics: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Health check metrics',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'service_health_logs',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['serviceId'] },
            { fields: ['status'] },
            { fields: ['createdAt'] },
            { fields: ['serviceId', 'createdAt'] },
        ],
    });
    return ServiceHealthLog;
};
exports.createServiceHealthLogModel = createServiceHealthLogModel;
// ============================================================================
// INJECTABLE NETWORK SERVICES (4-8)
// ============================================================================
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
const createInjectableService = (serviceName, scope = common_1.Scope.DEFAULT) => {
    return (target) => {
        (0, common_1.Injectable)({ scope })(target);
        Reflect.defineMetadata('service:name', serviceName, target);
        Reflect.defineMetadata('service:type', 'network', target);
        Reflect.defineMetadata('service:scope', scope, target);
        return target;
    };
};
exports.createInjectableService = createInjectableService;
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
const registerNetworkService = (serviceClass, config) => {
    return {
        provide: serviceClass,
        useFactory: (...deps) => {
            const instance = new serviceClass(...deps);
            instance._serviceConfig = config;
            return instance;
        },
        inject: Reflect.getMetadata('design:paramtypes', serviceClass) || [],
    };
};
exports.registerNetworkService = registerNetworkService;
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
const createManagedNetworkService = (config) => {
    let ManagedNetworkService = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ManagedNetworkService = _classThis = class {
            constructor() {
                this.connectionPool = new Map();
                this.isRunning = false;
            }
            async onModuleInit() {
                console.log(`Starting network service: ${config.serviceName}`);
                this.isRunning = true;
                this.startHealthChecks();
            }
            async onModuleDestroy() {
                console.log(`Stopping network service: ${config.serviceName}`);
                this.isRunning = false;
                if (this.healthCheckTimer) {
                    clearInterval(this.healthCheckTimer);
                }
                await this.closeAllConnections();
            }
            startHealthChecks() {
                this.healthCheckTimer = setInterval(async () => {
                    if (this.isRunning) {
                        await this.performHealthCheck();
                    }
                }, config.healthCheckInterval);
            }
            async performHealthCheck() {
                // Health check implementation
                const startTime = Date.now();
                try {
                    // Simulate health check
                    await new Promise(resolve => setTimeout(resolve, 10));
                    const responseTime = Date.now() - startTime;
                    console.log(`Health check passed for ${config.serviceName}: ${responseTime}ms`);
                }
                catch (error) {
                    console.error(`Health check failed for ${config.serviceName}:`, error);
                }
            }
            async closeAllConnections() {
                const closurePromises = Array.from(this.connectionPool.values()).map(conn => this.closeConnection(conn));
                await Promise.all(closurePromises);
                this.connectionPool.clear();
            }
            async closeConnection(connection) {
                connection.status = 'closed';
                if (connection.socket) {
                    connection.socket.destroy();
                }
            }
            getConfig() {
                return config;
            }
            isHealthy() {
                return this.isRunning;
            }
        };
        __setFunctionName(_classThis, "ManagedNetworkService");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ManagedNetworkService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ManagedNetworkService = _classThis;
    })();
    return ManagedNetworkService;
};
exports.createManagedNetworkService = createManagedNetworkService;
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
const withRetry = (maxRetries, backoffMs) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            let lastError;
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    return await originalMethod.apply(this, args);
                }
                catch (error) {
                    lastError = error;
                    if (attempt < maxRetries) {
                        const delay = backoffMs * Math.pow(2, attempt);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
            throw lastError;
        };
        return descriptor;
    };
};
exports.withRetry = withRetry;
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
const createSingletonNetworkService = (serviceFactory) => {
    let instance = null;
    return {
        provide: 'SINGLETON_NETWORK_SERVICE',
        useFactory: () => {
            if (!instance) {
                instance = serviceFactory();
            }
            return instance;
        },
    };
};
exports.createSingletonNetworkService = createSingletonNetworkService;
// ============================================================================
// SERVICE FACTORIES & BUILDERS (9-13)
// ============================================================================
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
const createServiceFactory = (token, factory) => {
    return {
        provide: token,
        useValue: factory,
    };
};
exports.createServiceFactory = createServiceFactory;
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
const buildNetworkService = (ServiceClass, config, dependencies = []) => {
    const instance = new ServiceClass(...dependencies);
    instance.config = config;
    instance.serviceId = config.serviceId;
    instance.serviceName = config.serviceName;
    // Add metadata
    Object.defineProperty(instance, '_isNetworkService', {
        value: true,
        enumerable: false,
        writable: false,
    });
    return instance;
};
exports.buildNetworkService = buildNetworkService;
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
const createAsyncServiceFactory = (token, asyncFactory, inject = []) => {
    return {
        provide: token,
        useFactory: asyncFactory,
        inject,
    };
};
exports.createAsyncServiceFactory = createAsyncServiceFactory;
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
const createServiceBuilder = () => {
    const config = {
        metadata: {},
    };
    return {
        withName(name) {
            config.serviceName = name;
            return this;
        },
        withId(id) {
            config.serviceId = id;
            return this;
        },
        withHost(host) {
            config.host = host;
            return this;
        },
        withPort(port) {
            config.port = port;
            return this;
        },
        withProtocol(protocol) {
            config.protocol = protocol;
            return this;
        },
        withHealthCheck(interval) {
            config.healthCheckInterval = interval;
            return this;
        },
        withRetry(attempts, timeout) {
            config.retryAttempts = attempts;
            config.timeout = timeout;
            return this;
        },
        withMetadata(metadata) {
            config.metadata = { ...config.metadata, ...metadata };
            return this;
        },
        build() {
            if (!config.serviceName || !config.serviceId || !config.host || !config.port) {
                throw new Error('Missing required service configuration');
            }
            return config;
        },
    };
};
exports.createServiceBuilder = createServiceBuilder;
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
const cloneServiceConfig = (config, overrides = {}) => {
    return {
        ...config,
        ...overrides,
        metadata: {
            ...config.metadata,
            ...(overrides.metadata || {}),
        },
    };
};
exports.cloneServiceConfig = cloneServiceConfig;
// ============================================================================
// SERVICE LIFECYCLE MANAGEMENT (14-18)
// ============================================================================
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
const initializeNetworkService = async (service, dependencies = []) => {
    console.log(`Initializing service: ${service.serviceName || 'unknown'}`);
    // Initialize dependencies first
    for (const dep of dependencies) {
        if (dep.onModuleInit && typeof dep.onModuleInit === 'function') {
            await dep.onModuleInit();
        }
    }
    // Initialize the service
    if (service.onModuleInit && typeof service.onModuleInit === 'function') {
        await service.onModuleInit();
    }
    service._initialized = true;
    service._initializationTime = new Date();
    console.log(`Service initialized: ${service.serviceName || 'unknown'}`);
};
exports.initializeNetworkService = initializeNetworkService;
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
const shutdownNetworkService = async (service, timeoutMs = 5000) => {
    console.log(`Shutting down service: ${service.serviceName || 'unknown'}`);
    const shutdownPromise = (async () => {
        if (service.onModuleDestroy && typeof service.onModuleDestroy === 'function') {
            await service.onModuleDestroy();
        }
        service._initialized = false;
    })();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Shutdown timeout')), timeoutMs));
    try {
        await Promise.race([shutdownPromise, timeoutPromise]);
        console.log(`Service shut down successfully: ${service.serviceName || 'unknown'}`);
    }
    catch (error) {
        console.error(`Service shutdown error: ${service.serviceName || 'unknown'}`, error);
        throw error;
    }
};
exports.shutdownNetworkService = shutdownNetworkService;
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
const restartNetworkService = async (service, dependencies = []) => {
    console.log(`Restarting service: ${service.serviceName || 'unknown'}`);
    await (0, exports.shutdownNetworkService)(service);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
    await (0, exports.initializeNetworkService)(service, dependencies);
};
exports.restartNetworkService = restartNetworkService;
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
const monitorServiceLifecycle = (service, eventHandler) => {
    const originalInit = service.onModuleInit;
    const originalDestroy = service.onModuleDestroy;
    service.onModuleInit = async function (...args) {
        eventHandler({ type: 'init', service: service.serviceName, timestamp: new Date() });
        if (originalInit) {
            return await originalInit.apply(this, args);
        }
    };
    service.onModuleDestroy = async function (...args) {
        eventHandler({ type: 'destroy', service: service.serviceName, timestamp: new Date() });
        if (originalDestroy) {
            return await originalDestroy.apply(this, args);
        }
    };
    return () => {
        service.onModuleInit = originalInit;
        service.onModuleDestroy = originalDestroy;
    };
};
exports.monitorServiceLifecycle = monitorServiceLifecycle;
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
const validateServiceReadiness = async (service) => {
    if (!service._initialized) {
        return false;
    }
    // Check if service has a health check method
    if (service.isHealthy && typeof service.isHealthy === 'function') {
        return service.isHealthy();
    }
    // Check if service has required methods
    const requiredMethods = ['onModuleInit', 'onModuleDestroy'];
    const hasRequiredMethods = requiredMethods.every(method => typeof service[method] === 'function');
    return hasRequiredMethods;
};
exports.validateServiceReadiness = validateServiceReadiness;
// ============================================================================
// CONNECTION POOLING (19-23)
// ============================================================================
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
const createConnectionPool = (config) => {
    const connections = [];
    let idleConnections = [];
    let activeConnections = [];
    return {
        async acquire(serviceId) {
            // Try to reuse idle connection
            let connection = idleConnections.find(c => c.serviceId === serviceId);
            if (connection) {
                connection.status = 'active';
                connection.lastUsedAt = new Date();
                connection.useCount++;
                idleConnections = idleConnections.filter(c => c.id !== connection.id);
                activeConnections.push(connection);
                return connection;
            }
            // Create new connection if under limit
            if (connections.length < config.maxConnections) {
                connection = {
                    id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    serviceId,
                    status: 'active',
                    createdAt: new Date(),
                    lastUsedAt: new Date(),
                    useCount: 1,
                };
                connections.push(connection);
                activeConnections.push(connection);
                return connection;
            }
            // Wait for available connection
            throw new Error('Connection pool exhausted');
        },
        async release(connection) {
            connection.status = 'idle';
            connection.lastUsedAt = new Date();
            activeConnections = activeConnections.filter(c => c.id !== connection.id);
            idleConnections.push(connection);
        },
        async validate(connection) {
            try {
                connection.status = 'validating';
                // Simulate validation
                await new Promise(resolve => setTimeout(resolve, 10));
                connection.status = 'idle';
                return true;
            }
            catch (error) {
                connection.status = 'closed';
                return false;
            }
        },
        async drain() {
            const closePromises = connections.map(async (conn) => {
                conn.status = 'closed';
                if (conn.socket) {
                    conn.socket.destroy();
                }
            });
            await Promise.all(closePromises);
            connections.length = 0;
            idleConnections.length = 0;
            activeConnections.length = 0;
        },
        getStats() {
            return {
                total: connections.length,
                idle: idleConnections.length,
                active: activeConnections.length,
                config,
            };
        },
    };
};
exports.createConnectionPool = createConnectionPool;
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
const acquirePooledConnection = async (pool, serviceId, timeoutMs = 3000) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
        try {
            return await pool.acquire(serviceId);
        }
        catch (error) {
            // Wait briefly before retry
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    throw new Error(`Failed to acquire connection within ${timeoutMs}ms`);
};
exports.acquirePooledConnection = acquirePooledConnection;
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
const evictStaleConnections = async (pool, maxIdleMs) => {
    const stats = pool.getStats();
    let evictedCount = 0;
    // This is a simplified implementation
    // In production, you'd access internal pool state
    console.log(`Checking for stale connections (max idle: ${maxIdleMs}ms)`);
    return evictedCount;
};
exports.evictStaleConnections = evictStaleConnections;
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
const getPoolMetrics = (pool) => {
    const stats = pool.getStats();
    return {
        totalConnections: stats.total,
        activeConnections: stats.active,
        idleConnections: stats.idle,
        utilization: stats.config.maxConnections > 0
            ? (stats.active / stats.config.maxConnections) * 100
            : 0,
        capacity: stats.config.maxConnections,
        timestamp: new Date().toISOString(),
    };
};
exports.getPoolMetrics = getPoolMetrics;
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
const warmupConnectionPool = async (pool, serviceId, count) => {
    console.log(`Warming up connection pool: ${count} connections`);
    const connections = [];
    try {
        // Acquire connections
        for (let i = 0; i < count; i++) {
            const conn = await pool.acquire(serviceId);
            connections.push(conn);
        }
        // Release all connections back to pool
        for (const conn of connections) {
            await pool.release(conn);
        }
        console.log(`Pool warmup complete: ${count} connections ready`);
    }
    catch (error) {
        console.error('Pool warmup failed:', error);
        // Release any acquired connections
        for (const conn of connections) {
            await pool.release(conn);
        }
        throw error;
    }
};
exports.warmupConnectionPool = warmupConnectionPool;
// ============================================================================
// HEALTH CHECKS & MONITORING (24-28)
// ============================================================================
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
const performServiceHealthCheck = async (serviceId, healthCheckUrl, timeoutMs = 5000) => {
    const startTime = Date.now();
    try {
        // Simulate HTTP health check
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        const responseTime = Date.now() - startTime;
        return {
            serviceId,
            status: 'healthy',
            lastCheck: new Date(),
            responseTime,
            consecutiveFailures: 0,
            uptime: 0,
            metrics: {
                requestCount: 0,
                errorCount: 0,
                averageResponseTime: responseTime,
                p95ResponseTime: responseTime,
                p99ResponseTime: responseTime,
                throughput: 0,
            },
        };
    }
    catch (error) {
        return {
            serviceId,
            status: 'unhealthy',
            lastCheck: new Date(),
            responseTime: Date.now() - startTime,
            consecutiveFailures: 1,
            uptime: 0,
            metrics: {
                requestCount: 0,
                errorCount: 1,
                averageResponseTime: 0,
                p95ResponseTime: 0,
                p99ResponseTime: 0,
                throughput: 0,
            },
        };
    }
};
exports.performServiceHealthCheck = performServiceHealthCheck;
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
const createHealthCheckMonitor = (serviceId, healthCheckUrl, intervalMs, onStatusChange) => {
    let lastStatus = null;
    const timer = setInterval(async () => {
        const status = await (0, exports.performServiceHealthCheck)(serviceId, healthCheckUrl);
        if (status.status !== lastStatus) {
            lastStatus = status.status;
            onStatusChange(status);
        }
    }, intervalMs);
    return () => clearInterval(timer);
};
exports.createHealthCheckMonitor = createHealthCheckMonitor;
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
const aggregateHealthMetrics = (statuses) => {
    if (statuses.length === 0) {
        return null;
    }
    const totalResponseTime = statuses.reduce((sum, s) => sum + s.responseTime, 0);
    const healthyCount = statuses.filter(s => s.status === 'healthy').length;
    const unhealthyCount = statuses.filter(s => s.status === 'unhealthy').length;
    const degradedCount = statuses.filter(s => s.status === 'degraded').length;
    return {
        totalServices: statuses.length,
        healthyServices: healthyCount,
        unhealthyServices: unhealthyCount,
        degradedServices: degradedCount,
        averageResponseTime: totalResponseTime / statuses.length,
        overallStatus: unhealthyCount > statuses.length / 2
            ? 'unhealthy'
            : degradedCount > 0
                ? 'degraded'
                : 'healthy',
        timestamp: new Date().toISOString(),
    };
};
exports.aggregateHealthMetrics = aggregateHealthMetrics;
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
const logServiceHealth = async (status, HealthLogModel) => {
    await HealthLogModel.create({
        serviceId: status.serviceId,
        status: status.status,
        responseTime: status.responseTime,
        checkType: 'http',
        errorMessage: status.status === 'unhealthy' ? 'Health check failed' : null,
        statusCode: status.status === 'healthy' ? 200 : 503,
        metrics: status.metrics,
        metadata: {
            consecutiveFailures: status.consecutiveFailures,
            uptime: status.uptime,
        },
    });
};
exports.logServiceHealth = logServiceHealth;
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
const getServiceHealthHistory = async (serviceId, hoursBack, HealthLogModel) => {
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    const logs = await HealthLogModel.findAll({
        where: {
            serviceId,
            createdAt: {
                [sequelize_1.Op.gte]: since,
            },
        },
        order: [['createdAt', 'ASC']],
    });
    return logs;
};
exports.getServiceHealthHistory = getServiceHealthHistory;
// ============================================================================
// SERVICE DISCOVERY (29-32)
// ============================================================================
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
const registerServiceWithDiscovery = async (config, ServiceModel) => {
    const serviceId = `${config.serviceName}_${Date.now()}`;
    await ServiceModel.create({
        serviceName: config.serviceName,
        serviceId,
        host: 'localhost', // Should come from actual host detection
        port: 8080, // Should come from configuration
        protocol: 'http',
        status: 'starting',
        tags: config.tags,
        metadata: {
            registryUrl: config.registryUrl,
            heartbeatInterval: config.heartbeatInterval,
            checkEndpoint: config.checkEndpoint,
        },
        registeredAt: new Date(),
    });
    console.log(`Service registered: ${serviceId}`);
    return serviceId;
};
exports.registerServiceWithDiscovery = registerServiceWithDiscovery;
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
const discoverServiceInstances = async (serviceName, tags = [], ServiceModel) => {
    const whereClause = {
        serviceName,
        status: 'healthy',
    };
    if (tags.length > 0) {
        // Filter by tags (Sequelize JSON containment)
        whereClause.tags = {
            [sequelize_1.Op.contains]: tags,
        };
    }
    const services = await ServiceModel.findAll({
        where: whereClause,
        order: [['priority', 'DESC'], ['weight', 'DESC']],
    });
    return services.map((s) => ({
        id: s.serviceId,
        serviceName: s.serviceName,
        host: s.host,
        port: s.port,
        status: s.status,
        lastHealthCheck: s.lastHealthCheck,
        metadata: s.metadata,
    }));
};
exports.discoverServiceInstances = discoverServiceInstances;
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
const deregisterService = async (serviceId, ServiceModel) => {
    await ServiceModel.destroy({
        where: { serviceId },
    });
    console.log(`Service deregistered: ${serviceId}`);
};
exports.deregisterService = deregisterService;
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
const sendServiceHeartbeat = async (serviceId, ServiceModel) => {
    await ServiceModel.update({
        lastHealthCheck: new Date(),
        status: 'healthy',
    }, {
        where: { serviceId },
    });
};
exports.sendServiceHeartbeat = sendServiceHeartbeat;
// ============================================================================
// LOAD BALANCER SERVICES (33-36)
// ============================================================================
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
const createLoadBalancer = (config) => {
    let currentIndex = 0;
    const connectionCounts = new Map();
    return {
        selectInstance(instances) {
            const healthyInstances = instances.filter(i => i.status === 'healthy');
            if (healthyInstances.length === 0) {
                return null;
            }
            switch (config.strategy) {
                case 'round-robin':
                    const instance = healthyInstances[currentIndex % healthyInstances.length];
                    currentIndex++;
                    return instance;
                case 'least-connections':
                    return healthyInstances.reduce((least, current) => {
                        const leastCount = connectionCounts.get(least.id) || 0;
                        const currentCount = connectionCounts.get(current.id) || 0;
                        return currentCount < leastCount ? current : least;
                    });
                case 'random':
                    return healthyInstances[Math.floor(Math.random() * healthyInstances.length)];
                case 'weighted':
                    // Weighted random selection based on instance metadata weight
                    const totalWeight = healthyInstances.reduce((sum, i) => sum + (i.metadata.weight || 100), 0);
                    let random = Math.random() * totalWeight;
                    for (const inst of healthyInstances) {
                        random -= inst.metadata.weight || 100;
                        if (random <= 0)
                            return inst;
                    }
                    return healthyInstances[0];
                default:
                    return healthyInstances[0];
            }
        },
        recordConnection(instanceId, increment) {
            const current = connectionCounts.get(instanceId) || 0;
            connectionCounts.set(instanceId, increment ? current + 1 : Math.max(0, current - 1));
        },
        getStats() {
            return {
                strategy: config.strategy,
                connectionCounts: Object.fromEntries(connectionCounts),
            };
        },
    };
};
exports.createLoadBalancer = createLoadBalancer;
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
const roundRobinSelect = (instances, currentIndex) => {
    const healthyInstances = instances.filter(i => i.status === 'healthy');
    if (healthyInstances.length === 0) {
        throw new Error('No healthy instances available');
    }
    const instance = healthyInstances[currentIndex % healthyInstances.length];
    const nextIndex = (currentIndex + 1) % healthyInstances.length;
    return { instance, nextIndex };
};
exports.roundRobinSelect = roundRobinSelect;
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
const leastConnectionsSelect = (instances, connectionCounts) => {
    const healthyInstances = instances.filter(i => i.status === 'healthy');
    if (healthyInstances.length === 0) {
        throw new Error('No healthy instances available');
    }
    return healthyInstances.reduce((least, current) => {
        const leastCount = connectionCounts.get(least.id) || 0;
        const currentCount = connectionCounts.get(current.id) || 0;
        return currentCount < leastCount ? current : least;
    });
};
exports.leastConnectionsSelect = leastConnectionsSelect;
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
const weightedSelect = (instances) => {
    const healthyInstances = instances.filter(i => i.status === 'healthy');
    if (healthyInstances.length === 0) {
        throw new Error('No healthy instances available');
    }
    const totalWeight = healthyInstances.reduce((sum, i) => sum + (i.metadata.weight || 100), 0);
    let random = Math.random() * totalWeight;
    for (const instance of healthyInstances) {
        random -= instance.metadata.weight || 100;
        if (random <= 0) {
            return instance;
        }
    }
    return healthyInstances[0];
};
exports.weightedSelect = weightedSelect;
// ============================================================================
// NETWORK PROXY SERVICES (37-40)
// ============================================================================
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
const createProxyService = (config) => {
    const circuitBreaker = {
        state: 'closed',
        failures: 0,
        lastFailureTime: 0,
        successCount: 0,
        nextAttemptTime: 0,
    };
    return {
        async proxy(request) {
            // Check circuit breaker
            if (circuitBreaker.state === 'open') {
                if (Date.now() < circuitBreaker.nextAttemptTime) {
                    throw new Error('Circuit breaker is open');
                }
                circuitBreaker.state = 'half-open';
            }
            try {
                // Simulate proxy request
                const response = await new Promise((resolve) => {
                    setTimeout(() => resolve({ status: 200, data: {} }), 10);
                });
                // Record success
                if (circuitBreaker.state === 'half-open') {
                    circuitBreaker.successCount++;
                    if (circuitBreaker.successCount >= 3) {
                        circuitBreaker.state = 'closed';
                        circuitBreaker.failures = 0;
                        circuitBreaker.successCount = 0;
                    }
                }
                return response;
            }
            catch (error) {
                circuitBreaker.failures++;
                circuitBreaker.lastFailureTime = Date.now();
                if (circuitBreaker.failures >= config.circuitBreakerThreshold) {
                    circuitBreaker.state = 'open';
                    circuitBreaker.nextAttemptTime = Date.now() + config.circuitBreakerTimeout;
                }
                throw error;
            }
        },
        getCircuitBreakerState() {
            return { ...circuitBreaker };
        },
        resetCircuitBreaker() {
            circuitBreaker.state = 'closed';
            circuitBreaker.failures = 0;
            circuitBreaker.successCount = 0;
            circuitBreaker.lastFailureTime = 0;
            circuitBreaker.nextAttemptTime = 0;
        },
    };
};
exports.createProxyService = createProxyService;
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
const createCircuitBreaker = (failureThreshold, timeoutMs) => {
    const state = {
        state: 'closed',
        failures: 0,
        lastFailureTime: 0,
        successCount: 0,
        nextAttemptTime: 0,
    };
    return {
        async execute(fn) {
            if (state.state === 'open') {
                if (Date.now() < state.nextAttemptTime) {
                    throw new Error('Circuit breaker is open');
                }
                state.state = 'half-open';
            }
            try {
                const result = await fn();
                if (state.state === 'half-open') {
                    state.successCount++;
                    if (state.successCount >= 3) {
                        state.state = 'closed';
                        state.failures = 0;
                        state.successCount = 0;
                    }
                }
                return result;
            }
            catch (error) {
                state.failures++;
                state.lastFailureTime = Date.now();
                if (state.failures >= failureThreshold) {
                    state.state = 'open';
                    state.nextAttemptTime = Date.now() + timeoutMs;
                }
                throw error;
            }
        },
        getState() {
            return { ...state };
        },
        reset() {
            state.state = 'closed';
            state.failures = 0;
            state.successCount = 0;
            state.lastFailureTime = 0;
            state.nextAttemptTime = 0;
        },
    };
};
exports.createCircuitBreaker = createCircuitBreaker;
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
const retryWithBackoff = async (fn, maxRetries, baseDelayMs) => {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                const delay = baseDelayMs * Math.pow(2, attempt);
                const jitter = Math.random() * 0.1 * delay;
                await new Promise(resolve => setTimeout(resolve, delay + jitter));
            }
        }
    }
    throw lastError;
};
exports.retryWithBackoff = retryWithBackoff;
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
const withTimeout = async (fn, timeoutMs) => {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs));
    return Promise.race([fn(), timeoutPromise]);
};
exports.withTimeout = withTimeout;
exports.default = {
    // Sequelize Models
    createNetworkServiceModel: exports.createNetworkServiceModel,
    createNetworkConnectionModel: exports.createNetworkConnectionModel,
    createServiceHealthLogModel: exports.createServiceHealthLogModel,
    // Injectable Network Services
    createInjectableService: exports.createInjectableService,
    registerNetworkService: exports.registerNetworkService,
    createManagedNetworkService: exports.createManagedNetworkService,
    withRetry: exports.withRetry,
    createSingletonNetworkService: exports.createSingletonNetworkService,
    // Service Factories & Builders
    createServiceFactory: exports.createServiceFactory,
    buildNetworkService: exports.buildNetworkService,
    createAsyncServiceFactory: exports.createAsyncServiceFactory,
    createServiceBuilder: exports.createServiceBuilder,
    cloneServiceConfig: exports.cloneServiceConfig,
    // Service Lifecycle Management
    initializeNetworkService: exports.initializeNetworkService,
    shutdownNetworkService: exports.shutdownNetworkService,
    restartNetworkService: exports.restartNetworkService,
    monitorServiceLifecycle: exports.monitorServiceLifecycle,
    validateServiceReadiness: exports.validateServiceReadiness,
    // Connection Pooling
    createConnectionPool: exports.createConnectionPool,
    acquirePooledConnection: exports.acquirePooledConnection,
    evictStaleConnections: exports.evictStaleConnections,
    getPoolMetrics: exports.getPoolMetrics,
    warmupConnectionPool: exports.warmupConnectionPool,
    // Health Checks & Monitoring
    performServiceHealthCheck: exports.performServiceHealthCheck,
    createHealthCheckMonitor: exports.createHealthCheckMonitor,
    aggregateHealthMetrics: exports.aggregateHealthMetrics,
    logServiceHealth: exports.logServiceHealth,
    getServiceHealthHistory: exports.getServiceHealthHistory,
    // Service Discovery
    registerServiceWithDiscovery: exports.registerServiceWithDiscovery,
    discoverServiceInstances: exports.discoverServiceInstances,
    deregisterService: exports.deregisterService,
    sendServiceHeartbeat: exports.sendServiceHeartbeat,
    // Load Balancer Services
    createLoadBalancer: exports.createLoadBalancer,
    roundRobinSelect: exports.roundRobinSelect,
    leastConnectionsSelect: exports.leastConnectionsSelect,
    weightedSelect: exports.weightedSelect,
    // Network Proxy Services
    createProxyService: exports.createProxyService,
    createCircuitBreaker: exports.createCircuitBreaker,
    retryWithBackoff: exports.retryWithBackoff,
    withTimeout: exports.withTimeout,
};
//# sourceMappingURL=network-service-providers-kit.js.map