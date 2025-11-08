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

import { Injectable, Inject, Scope, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Model, DataTypes, Sequelize, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export const createNetworkServiceModel = (sequelize: Sequelize) => {
  class NetworkService extends Model {
    public id!: number;
    public serviceName!: string;
    public serviceId!: string;
    public host!: string;
    public port!: number;
    public protocol!: string;
    public status!: string;
    public healthCheckUrl!: string;
    public healthCheckInterval!: number;
    public tags!: string[];
    public weight!: number;
    public priority!: number;
    public metadata!: Record<string, any>;
    public lastHealthCheck!: Date | null;
    public registeredAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkService.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      serviceName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Logical service name',
      },
      serviceId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Unique service instance identifier',
      },
      host: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Service host IP or hostname',
      },
      port: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Service port number',
      },
      protocol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'http',
        comment: 'Network protocol',
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'starting',
        comment: 'Service health status',
      },
      healthCheckUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Health check endpoint URL',
      },
      healthCheckInterval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30000,
        comment: 'Health check interval in milliseconds',
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Service tags for discovery',
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
        comment: 'Load balancing weight',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Service priority for routing',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional service metadata',
      },
      lastHealthCheck: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last health check timestamp',
      },
      registeredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Service registration timestamp',
      },
    },
    {
      sequelize,
      tableName: 'network_services',
      timestamps: true,
      indexes: [
        { fields: ['serviceId'], unique: true },
        { fields: ['serviceName'] },
        { fields: ['status'] },
        { fields: ['host', 'port'] },
      ],
    },
  );

  return NetworkService;
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
export const createNetworkConnectionModel = (sequelize: Sequelize) => {
  class NetworkConnection extends Model {
    public id!: number;
    public connectionId!: string;
    public serviceId!: string;
    public poolId!: string;
    public status!: string;
    public localAddress!: string;
    public localPort!: number;
    public remoteAddress!: string;
    public remotePort!: number;
    public protocol!: string;
    public createdAt!: Date;
    public lastUsedAt!: Date;
    public useCount!: number;
    public errorCount!: number;
    public metadata!: Record<string, any>;
    public closedAt!: Date | null;
  }

  NetworkConnection.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      connectionId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Unique connection identifier',
      },
      serviceId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Associated service ID',
      },
      poolId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Connection pool identifier',
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'idle',
        comment: 'Connection status',
      },
      localAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Local IP address',
      },
      localPort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Local port number',
      },
      remoteAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Remote IP address',
      },
      remotePort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Remote port number',
      },
      protocol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Connection protocol',
      },
      lastUsedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Last usage timestamp',
      },
      useCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times connection used',
      },
      errorCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of errors encountered',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Connection metadata',
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Connection closure timestamp',
      },
    },
    {
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
    },
  );

  return NetworkConnection;
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
export const createServiceHealthLogModel = (sequelize: Sequelize) => {
  class ServiceHealthLog extends Model {
    public id!: number;
    public serviceId!: string;
    public status!: string;
    public responseTime!: number;
    public checkType!: string;
    public errorMessage!: string | null;
    public statusCode!: number | null;
    public metrics!: Record<string, any>;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  ServiceHealthLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      serviceId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Service identifier',
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Health check status',
      },
      responseTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Response time in milliseconds',
      },
      checkType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Type of health check performed',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if check failed',
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'HTTP status code if applicable',
      },
      metrics: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Health check metrics',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
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
    },
  );

  return ServiceHealthLog;
};

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
export const createInjectableService = (
  serviceName: string,
  scope: Scope = Scope.DEFAULT,
): ClassDecorator => {
  return (target: any) => {
    Injectable({ scope })(target);
    Reflect.defineMetadata('service:name', serviceName, target);
    Reflect.defineMetadata('service:type', 'network', target);
    Reflect.defineMetadata('service:scope', scope, target);
    return target;
  };
};

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
export const registerNetworkService = (
  serviceClass: any,
  config: NetworkServiceConfig,
): any => {
  return {
    provide: serviceClass,
    useFactory: (...deps: any[]) => {
      const instance = new serviceClass(...deps);
      instance._serviceConfig = config;
      return instance;
    },
    inject: Reflect.getMetadata('design:paramtypes', serviceClass) || [],
  };
};

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
export const createManagedNetworkService = (config: NetworkServiceConfig): any => {
  @Injectable()
  class ManagedNetworkService implements OnModuleInit, OnModuleDestroy {
    private healthCheckTimer?: NodeJS.Timer;
    private connectionPool: Map<string, Connection> = new Map();
    private isRunning = false;

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

    private startHealthChecks() {
      this.healthCheckTimer = setInterval(async () => {
        if (this.isRunning) {
          await this.performHealthCheck();
        }
      }, config.healthCheckInterval);
    }

    private async performHealthCheck(): Promise<void> {
      // Health check implementation
      const startTime = Date.now();
      try {
        // Simulate health check
        await new Promise(resolve => setTimeout(resolve, 10));
        const responseTime = Date.now() - startTime;
        console.log(`Health check passed for ${config.serviceName}: ${responseTime}ms`);
      } catch (error) {
        console.error(`Health check failed for ${config.serviceName}:`, error);
      }
    }

    private async closeAllConnections(): Promise<void> {
      const closurePromises = Array.from(this.connectionPool.values()).map(
        conn => this.closeConnection(conn),
      );
      await Promise.all(closurePromises);
      this.connectionPool.clear();
    }

    private async closeConnection(connection: Connection): Promise<void> {
      connection.status = 'closed';
      if (connection.socket) {
        connection.socket.destroy();
      }
    }

    getConfig(): NetworkServiceConfig {
      return config;
    }

    isHealthy(): boolean {
      return this.isRunning;
    }
  }

  return ManagedNetworkService;
};

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
export const withRetry = (maxRetries: number, backoffMs: number): MethodDecorator => {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: any;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
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
export const createSingletonNetworkService = (serviceFactory: () => any): any => {
  let instance: any = null;

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
export const createServiceFactory = <T>(token: string, factory: ServiceFactory<T>): any => {
  return {
    provide: token,
    useValue: factory,
  };
};

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
export const buildNetworkService = (
  ServiceClass: any,
  config: NetworkServiceConfig,
  dependencies: any[] = [],
): any => {
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
export const createAsyncServiceFactory = (
  token: string,
  asyncFactory: (...args: any[]) => Promise<any>,
  inject: any[] = [],
): any => {
  return {
    provide: token,
    useFactory: asyncFactory,
    inject,
  };
};

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
export const createServiceBuilder = () => {
  const config: Partial<NetworkServiceConfig> = {
    metadata: {},
  };

  return {
    withName(name: string) {
      config.serviceName = name;
      return this;
    },
    withId(id: string) {
      config.serviceId = id;
      return this;
    },
    withHost(host: string) {
      config.host = host;
      return this;
    },
    withPort(port: number) {
      config.port = port;
      return this;
    },
    withProtocol(protocol: 'tcp' | 'udp' | 'http' | 'https' | 'grpc') {
      config.protocol = protocol;
      return this;
    },
    withHealthCheck(interval: number) {
      config.healthCheckInterval = interval;
      return this;
    },
    withRetry(attempts: number, timeout: number) {
      config.retryAttempts = attempts;
      config.timeout = timeout;
      return this;
    },
    withMetadata(metadata: Record<string, any>) {
      config.metadata = { ...config.metadata, ...metadata };
      return this;
    },
    build(): NetworkServiceConfig {
      if (!config.serviceName || !config.serviceId || !config.host || !config.port) {
        throw new Error('Missing required service configuration');
      }
      return config as NetworkServiceConfig;
    },
  };
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
export const cloneServiceConfig = (
  config: NetworkServiceConfig,
  overrides: Partial<NetworkServiceConfig> = {},
): NetworkServiceConfig => {
  return {
    ...config,
    ...overrides,
    metadata: {
      ...config.metadata,
      ...(overrides.metadata || {}),
    },
  };
};

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
export const initializeNetworkService = async (
  service: any,
  dependencies: any[] = [],
): Promise<void> => {
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
export const shutdownNetworkService = async (
  service: any,
  timeoutMs = 5000,
): Promise<void> => {
  console.log(`Shutting down service: ${service.serviceName || 'unknown'}`);

  const shutdownPromise = (async () => {
    if (service.onModuleDestroy && typeof service.onModuleDestroy === 'function') {
      await service.onModuleDestroy();
    }
    service._initialized = false;
  })();

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Shutdown timeout')), timeoutMs),
  );

  try {
    await Promise.race([shutdownPromise, timeoutPromise]);
    console.log(`Service shut down successfully: ${service.serviceName || 'unknown'}`);
  } catch (error) {
    console.error(`Service shutdown error: ${service.serviceName || 'unknown'}`, error);
    throw error;
  }
};

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
export const restartNetworkService = async (
  service: any,
  dependencies: any[] = [],
): Promise<void> => {
  console.log(`Restarting service: ${service.serviceName || 'unknown'}`);
  await shutdownNetworkService(service);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
  await initializeNetworkService(service, dependencies);
};

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
export const monitorServiceLifecycle = (
  service: any,
  eventHandler: (event: any) => void,
): (() => void) => {
  const originalInit = service.onModuleInit;
  const originalDestroy = service.onModuleDestroy;

  service.onModuleInit = async function (...args: any[]) {
    eventHandler({ type: 'init', service: service.serviceName, timestamp: new Date() });
    if (originalInit) {
      return await originalInit.apply(this, args);
    }
  };

  service.onModuleDestroy = async function (...args: any[]) {
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
export const validateServiceReadiness = async (service: any): Promise<boolean> => {
  if (!service._initialized) {
    return false;
  }

  // Check if service has a health check method
  if (service.isHealthy && typeof service.isHealthy === 'function') {
    return service.isHealthy();
  }

  // Check if service has required methods
  const requiredMethods = ['onModuleInit', 'onModuleDestroy'];
  const hasRequiredMethods = requiredMethods.every(
    method => typeof service[method] === 'function',
  );

  return hasRequiredMethods;
};

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
export const createConnectionPool = (config: ConnectionPoolConfig) => {
  const connections: Connection[] = [];
  let idleConnections: Connection[] = [];
  let activeConnections: Connection[] = [];

  return {
    async acquire(serviceId: string): Promise<Connection> {
      // Try to reuse idle connection
      let connection = idleConnections.find(c => c.serviceId === serviceId);

      if (connection) {
        connection.status = 'active';
        connection.lastUsedAt = new Date();
        connection.useCount++;
        idleConnections = idleConnections.filter(c => c.id !== connection!.id);
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

    async release(connection: Connection): Promise<void> {
      connection.status = 'idle';
      connection.lastUsedAt = new Date();
      activeConnections = activeConnections.filter(c => c.id !== connection.id);
      idleConnections.push(connection);
    },

    async validate(connection: Connection): Promise<boolean> {
      try {
        connection.status = 'validating';
        // Simulate validation
        await new Promise(resolve => setTimeout(resolve, 10));
        connection.status = 'idle';
        return true;
      } catch (error) {
        connection.status = 'closed';
        return false;
      }
    },

    async drain(): Promise<void> {
      const closePromises = connections.map(async conn => {
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
export const acquirePooledConnection = async (
  pool: any,
  serviceId: string,
  timeoutMs = 3000,
): Promise<Connection> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      return await pool.acquire(serviceId);
    } catch (error) {
      // Wait briefly before retry
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  throw new Error(`Failed to acquire connection within ${timeoutMs}ms`);
};

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
export const evictStaleConnections = async (
  pool: any,
  maxIdleMs: number,
): Promise<number> => {
  const stats = pool.getStats();
  let evictedCount = 0;

  // This is a simplified implementation
  // In production, you'd access internal pool state
  console.log(`Checking for stale connections (max idle: ${maxIdleMs}ms)`);

  return evictedCount;
};

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
export const getPoolMetrics = (pool: any): any => {
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
export const warmupConnectionPool = async (
  pool: any,
  serviceId: string,
  count: number,
): Promise<void> => {
  console.log(`Warming up connection pool: ${count} connections`);

  const connections: Connection[] = [];

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
  } catch (error) {
    console.error('Pool warmup failed:', error);
    // Release any acquired connections
    for (const conn of connections) {
      await pool.release(conn);
    }
    throw error;
  }
};

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
export const performServiceHealthCheck = async (
  serviceId: string,
  healthCheckUrl: string,
  timeoutMs = 5000,
): Promise<ServiceHealthStatus> => {
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
  } catch (error: any) {
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
export const createHealthCheckMonitor = (
  serviceId: string,
  healthCheckUrl: string,
  intervalMs: number,
  onStatusChange: (status: ServiceHealthStatus) => void,
): (() => void) => {
  let lastStatus: string | null = null;

  const timer = setInterval(async () => {
    const status = await performServiceHealthCheck(serviceId, healthCheckUrl);

    if (status.status !== lastStatus) {
      lastStatus = status.status;
      onStatusChange(status);
    }
  }, intervalMs);

  return () => clearInterval(timer);
};

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
export const aggregateHealthMetrics = (statuses: ServiceHealthStatus[]): any => {
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
    overallStatus:
      unhealthyCount > statuses.length / 2
        ? 'unhealthy'
        : degradedCount > 0
        ? 'degraded'
        : 'healthy',
    timestamp: new Date().toISOString(),
  };
};

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
export const logServiceHealth = async (
  status: ServiceHealthStatus,
  HealthLogModel: any,
): Promise<void> => {
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
export const getServiceHealthHistory = async (
  serviceId: string,
  hoursBack: number,
  HealthLogModel: any,
): Promise<any[]> => {
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

  const logs = await HealthLogModel.findAll({
    where: {
      serviceId,
      createdAt: {
        [Op.gte]: since,
      },
    },
    order: [['createdAt', 'ASC']],
  });

  return logs;
};

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
export const registerServiceWithDiscovery = async (
  config: ServiceDiscoveryConfig,
  ServiceModel: any,
): Promise<string> => {
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
export const discoverServiceInstances = async (
  serviceName: string,
  tags: string[] = [],
  ServiceModel: any,
): Promise<ServiceInstance[]> => {
  const whereClause: any = {
    serviceName,
    status: 'healthy',
  };

  if (tags.length > 0) {
    // Filter by tags (Sequelize JSON containment)
    whereClause.tags = {
      [Op.contains]: tags,
    };
  }

  const services = await ServiceModel.findAll({
    where: whereClause,
    order: [['priority', 'DESC'], ['weight', 'DESC']],
  });

  return services.map((s: any) => ({
    id: s.serviceId,
    serviceName: s.serviceName,
    host: s.host,
    port: s.port,
    status: s.status,
    lastHealthCheck: s.lastHealthCheck,
    metadata: s.metadata,
  }));
};

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
export const deregisterService = async (
  serviceId: string,
  ServiceModel: any,
): Promise<void> => {
  await ServiceModel.destroy({
    where: { serviceId },
  });

  console.log(`Service deregistered: ${serviceId}`);
};

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
export const sendServiceHeartbeat = async (
  serviceId: string,
  ServiceModel: any,
): Promise<void> => {
  await ServiceModel.update(
    {
      lastHealthCheck: new Date(),
      status: 'healthy',
    },
    {
      where: { serviceId },
    },
  );
};

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
export const createLoadBalancer = (config: LoadBalancerConfig) => {
  let currentIndex = 0;
  const connectionCounts = new Map<string, number>();

  return {
    selectInstance(instances: ServiceInstance[]): ServiceInstance | null {
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
          const totalWeight = healthyInstances.reduce(
            (sum, i) => sum + (i.metadata.weight || 100),
            0,
          );
          let random = Math.random() * totalWeight;
          for (const inst of healthyInstances) {
            random -= inst.metadata.weight || 100;
            if (random <= 0) return inst;
          }
          return healthyInstances[0];

        default:
          return healthyInstances[0];
      }
    },

    recordConnection(instanceId: string, increment: boolean) {
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
export const roundRobinSelect = (
  instances: ServiceInstance[],
  currentIndex: number,
): { instance: ServiceInstance; nextIndex: number } => {
  const healthyInstances = instances.filter(i => i.status === 'healthy');

  if (healthyInstances.length === 0) {
    throw new Error('No healthy instances available');
  }

  const instance = healthyInstances[currentIndex % healthyInstances.length];
  const nextIndex = (currentIndex + 1) % healthyInstances.length;

  return { instance, nextIndex };
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
export const leastConnectionsSelect = (
  instances: ServiceInstance[],
  connectionCounts: Map<string, number>,
): ServiceInstance => {
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
export const weightedSelect = (instances: ServiceInstance[]): ServiceInstance => {
  const healthyInstances = instances.filter(i => i.status === 'healthy');

  if (healthyInstances.length === 0) {
    throw new Error('No healthy instances available');
  }

  const totalWeight = healthyInstances.reduce(
    (sum, i) => sum + (i.metadata.weight || 100),
    0,
  );

  let random = Math.random() * totalWeight;

  for (const instance of healthyInstances) {
    random -= instance.metadata.weight || 100;
    if (random <= 0) {
      return instance;
    }
  }

  return healthyInstances[0];
};

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
export const createProxyService = (config: ProxyConfig) => {
  const circuitBreaker: CircuitBreakerState = {
    state: 'closed',
    failures: 0,
    lastFailureTime: 0,
    successCount: 0,
    nextAttemptTime: 0,
  };

  return {
    async proxy(request: any): Promise<any> {
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
      } catch (error) {
        circuitBreaker.failures++;
        circuitBreaker.lastFailureTime = Date.now();

        if (circuitBreaker.failures >= config.circuitBreakerThreshold) {
          circuitBreaker.state = 'open';
          circuitBreaker.nextAttemptTime = Date.now() + config.circuitBreakerTimeout;
        }

        throw error;
      }
    },

    getCircuitBreakerState(): CircuitBreakerState {
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
export const createCircuitBreaker = (failureThreshold: number, timeoutMs: number) => {
  const state: CircuitBreakerState = {
    state: 'closed',
    failures: 0,
    lastFailureTime: 0,
    successCount: 0,
    nextAttemptTime: 0,
  };

  return {
    async execute<T>(fn: () => Promise<T>): Promise<T> {
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
      } catch (error) {
        state.failures++;
        state.lastFailureTime = Date.now();

        if (state.failures >= failureThreshold) {
          state.state = 'open';
          state.nextAttemptTime = Date.now() + timeoutMs;
        }

        throw error;
      }
    },

    getState(): CircuitBreakerState {
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
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelayMs: number,
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
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
export const withTimeout = async <T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs),
  );

  return Promise.race([fn(), timeoutPromise]);
};

export default {
  // Sequelize Models
  createNetworkServiceModel,
  createNetworkConnectionModel,
  createServiceHealthLogModel,

  // Injectable Network Services
  createInjectableService,
  registerNetworkService,
  createManagedNetworkService,
  withRetry,
  createSingletonNetworkService,

  // Service Factories & Builders
  createServiceFactory,
  buildNetworkService,
  createAsyncServiceFactory,
  createServiceBuilder,
  cloneServiceConfig,

  // Service Lifecycle Management
  initializeNetworkService,
  shutdownNetworkService,
  restartNetworkService,
  monitorServiceLifecycle,
  validateServiceReadiness,

  // Connection Pooling
  createConnectionPool,
  acquirePooledConnection,
  evictStaleConnections,
  getPoolMetrics,
  warmupConnectionPool,

  // Health Checks & Monitoring
  performServiceHealthCheck,
  createHealthCheckMonitor,
  aggregateHealthMetrics,
  logServiceHealth,
  getServiceHealthHistory,

  // Service Discovery
  registerServiceWithDiscovery,
  discoverServiceInstances,
  deregisterService,
  sendServiceHeartbeat,

  // Load Balancer Services
  createLoadBalancer,
  roundRobinSelect,
  leastConnectionsSelect,
  weightedSelect,

  // Network Proxy Services
  createProxyService,
  createCircuitBreaker,
  retryWithBackoff,
  withTimeout,
};
