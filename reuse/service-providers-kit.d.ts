/**
 * LOC: SVCPROV1234567
 * File: /reuse/service-providers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS service implementations
 *   - Dynamic module factories
 *   - Provider configurations
 *   - Custom decorators
 *   - Health check services
 *   - Multi-tenant modules
 */
interface ServiceFactoryConfig {
    token: string | symbol;
    useFactory: (...args: any[]) => any | Promise<any>;
    inject?: any[];
    scope?: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
    multi?: boolean;
}
interface AsyncProviderConfig {
    token: string | symbol;
    useFactory: (...args: any[]) => Promise<any>;
    inject?: any[];
    scope?: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
    timeoutMs?: number;
    retryConfig?: RetryConfig;
}
interface DynamicModuleConfig {
    moduleName: string;
    providers: any[];
    exports?: any[];
    imports?: any[];
    controllers?: any[];
    global?: boolean;
}
interface ProviderMetadata {
    token: string | symbol;
    scope: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
    createdAt?: Date;
    lastAccessedAt?: Date;
    accessCount?: number;
    metadata?: Record<string, any>;
}
interface LifecycleHookConfig {
    onInit?: () => void | Promise<void>;
    onDestroy?: () => void | Promise<void>;
    onModuleInit?: () => void | Promise<void>;
    onModuleDestroy?: () => void | Promise<void>;
    onApplicationBootstrap?: () => void | Promise<void>;
    onApplicationShutdown?: (signal?: string) => void | Promise<void>;
}
interface TenantContext {
    tenantId: string;
    tenantName?: string;
    schema?: string;
    database?: string;
    config?: Record<string, any>;
    metadata?: Record<string, any>;
}
interface TenantProviderConfig {
    token: string | symbol;
    useFactory: (tenant: TenantContext) => any | Promise<any>;
    inject?: any[];
    scope?: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
}
interface FeatureToggle {
    name: string;
    enabled: boolean;
    strategy?: 'simple' | 'percentage' | 'user' | 'tenant' | 'conditional';
    percentage?: number;
    users?: string[];
    tenants?: string[];
    condition?: (context: any) => boolean;
    metadata?: Record<string, any>;
}
interface FeatureToggleConfig {
    toggles: FeatureToggle[];
    defaultEnabled?: boolean;
    cacheEnabled?: boolean;
    cacheTTL?: number;
}
interface HealthCheckConfig {
    name: string;
    check: () => Promise<HealthCheckResult>;
    timeout?: number;
    critical?: boolean;
    tags?: string[];
}
interface HealthCheckResult {
    status: 'healthy' | 'degraded' | 'unhealthy';
    message?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
    responseTime?: number;
}
interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    resetTimeout: number;
    halfOpenMax?: number;
    onStateChange?: (state: CircuitState) => void;
}
interface CircuitState {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    successCount: number;
    lastFailureTime?: Date;
    lastSuccessTime?: Date;
    nextAttemptTime?: Date;
}
interface RetryConfig {
    maxAttempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
    retryableErrors?: string[];
    onRetry?: (attempt: number, error: any) => void;
}
interface ProviderScope {
    scope: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
    durable?: boolean;
}
/**
 * Creates a factory provider with comprehensive configuration.
 *
 * @param {ServiceFactoryConfig} config - Factory provider configuration
 * @returns {object} NestJS provider object
 *
 * @example
 * ```typescript
 * const databaseProvider = createFactoryProvider({
 *   token: 'DATABASE_CONNECTION',
 *   useFactory: async (configService: ConfigService) => {
 *     const config = configService.get('database');
 *     return await createConnection(config);
 *   },
 *   inject: [ConfigService],
 *   scope: 'DEFAULT'
 * });
 * ```
 */
export declare const createFactoryProvider: (config: ServiceFactoryConfig) => any;
/**
 * Creates an async provider with initialization logic.
 *
 * @param {AsyncProviderConfig} config - Async provider configuration
 * @returns {object} NestJS async provider object
 *
 * @example
 * ```typescript
 * const apiClientProvider = createAsyncProvider({
 *   token: 'EXTERNAL_API_CLIENT',
 *   useFactory: async (httpService: HttpService, config: ConfigService) => {
 *     const apiUrl = config.get('api.url');
 *     const client = new ApiClient(apiUrl, httpService);
 *     await client.initialize();
 *     return client;
 *   },
 *   inject: [HttpService, ConfigService],
 *   timeoutMs: 10000
 * });
 * ```
 */
export declare const createAsyncProvider: (config: AsyncProviderConfig) => any;
/**
 * Creates a value provider with optional lazy initialization.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} value - Provider value
 * @param {object} options - Optional configuration
 * @returns {object} NestJS value provider object
 *
 * @example
 * ```typescript
 * const configProvider = createValueProvider('APP_CONFIG', {
 *   apiUrl: 'https://api.whitecross.com',
 *   timeout: 5000,
 *   retries: 3
 * });
 * ```
 */
export declare const createValueProvider: (token: string | symbol, value: any, options?: {
    scope?: "DEFAULT" | "REQUEST" | "TRANSIENT";
}) => any;
/**
 * Creates a class provider with optional scope configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate
 * @param {object} options - Optional configuration
 * @returns {object} NestJS class provider object
 *
 * @example
 * ```typescript
 * const serviceProvider = createClassProvider('IUserService', UserService, {
 *   scope: 'DEFAULT'
 * });
 * ```
 */
export declare const createClassProvider: (token: string | symbol, useClass: any, options?: {
    scope?: "DEFAULT" | "REQUEST" | "TRANSIENT";
}) => any;
/**
 * Creates an existing provider (alias) for dependency injection.
 *
 * @param {string | symbol} token - New injection token
 * @param {string | symbol} useExisting - Existing token to alias
 * @returns {object} NestJS existing provider object
 *
 * @example
 * ```typescript
 * const aliasProvider = createExistingProvider('ILogger', 'WinstonLogger');
 * ```
 */
export declare const createExistingProvider: (token: string | symbol, useExisting: string | symbol) => any;
/**
 * Creates a multi-provider for arrays of services.
 *
 * @param {string | symbol} token - Injection token
 * @param {any[]} providers - Array of provider configurations
 * @returns {any[]} Array of NestJS multi-providers
 *
 * @example
 * ```typescript
 * const validators = createMultiProvider('VALIDATORS', [
 *   { useClass: EmailValidator },
 *   { useClass: PhoneValidator },
 *   { useClass: AddressValidator }
 * ]);
 * ```
 */
export declare const createMultiProvider: (token: string | symbol, providers: any[]) => any[];
/**
 * Creates a conditional provider based on environment or configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} condition - Condition function
 * @param {object} trueProvider - Provider if condition is true
 * @param {object} falseProvider - Provider if condition is false
 * @returns {object} NestJS conditional provider
 *
 * @example
 * ```typescript
 * const cacheProvider = createConditionalProvider(
 *   'CACHE_SERVICE',
 *   () => process.env.NODE_ENV === 'production',
 *   { useClass: RedisCache },
 *   { useClass: MemoryCache }
 * );
 * ```
 */
export declare const createConditionalProvider: (token: string | symbol, condition: () => boolean, trueProvider: any, falseProvider: any) => any;
/**
 * Creates a dynamic module configuration object.
 *
 * @param {DynamicModuleConfig} config - Module configuration
 * @returns {object} NestJS dynamic module
 *
 * @example
 * ```typescript
 * const dynamicModule = createDynamicModule({
 *   moduleName: 'DatabaseModule',
 *   providers: [databaseProvider, repositoryProvider],
 *   exports: ['DATABASE_CONNECTION'],
 *   global: true
 * });
 * ```
 */
export declare const createDynamicModule: (config: DynamicModuleConfig) => any;
/**
 * Creates a configurable dynamic module with options pattern.
 *
 * @param {string} moduleName - Module name
 * @param {Function} optionsFactory - Factory to create providers from options
 * @returns {Function} Module factory function
 *
 * @example
 * ```typescript
 * const DatabaseModule = createConfigurableModule('DatabaseModule', (options) => {
 *   return [
 *     {
 *       provide: 'DATABASE_OPTIONS',
 *       useValue: options
 *     },
 *     DatabaseService
 *   ];
 * });
 *
 * // Usage: DatabaseModule.forRoot({ host: 'localhost', port: 5432 })
 * ```
 */
export declare const createConfigurableModule: (moduleName: string, optionsFactory: (options: any) => any[]) => any;
/**
 * Creates a feature module with lazy loading support.
 *
 * @param {string} featureName - Feature name
 * @param {any[]} providers - Feature providers
 * @param {any[]} exports - Exported providers
 * @returns {object} NestJS feature module
 *
 * @example
 * ```typescript
 * const PatientFeatureModule = createFeatureModule(
 *   'PatientFeature',
 *   [PatientService, PatientRepository],
 *   [PatientService]
 * );
 * ```
 */
export declare const createFeatureModule: (featureName: string, providers: any[], exports?: any[]) => any;
/**
 * Creates a custom injection token with metadata.
 *
 * @param {string} description - Token description
 * @param {object} metadata - Optional metadata
 * @returns {symbol} Injection token
 *
 * @example
 * ```typescript
 * const DATABASE_CONNECTION = createInjectionToken('DatabaseConnection', {
 *   scope: 'DEFAULT',
 *   type: 'database'
 * });
 * ```
 */
export declare const createInjectionToken: (description: string, metadata?: Record<string, any>) => symbol;
/**
 * Resolves provider dependencies in correct order.
 *
 * @param {any[]} providers - Array of providers
 * @returns {any[]} Ordered providers array
 *
 * @example
 * ```typescript
 * const orderedProviders = resolveProviderDependencies([
 *   ConfigService,
 *   DatabaseService, // depends on ConfigService
 *   UserService // depends on DatabaseService
 * ]);
 * ```
 */
export declare const resolveProviderDependencies: (providers: any[]) => any[];
/**
 * Detects circular dependencies in provider tree.
 *
 * @param {any[]} providers - Array of providers to check
 * @returns {object} Circular dependency report
 *
 * @example
 * ```typescript
 * const report = detectCircularDependencies([ServiceA, ServiceB, ServiceC]);
 * if (report.hasCircular) {
 *   console.error('Circular dependencies detected:', report.cycles);
 * }
 * ```
 */
export declare const detectCircularDependencies: (providers: any[]) => {
    hasCircular: boolean;
    cycles: string[][];
};
/**
 * Creates an optional injection decorator.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} defaultValue - Default value if not found
 * @returns {ParameterDecorator} Decorator function
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(
 *     @OptionalInject('LOGGER', console) private logger: any
 *   ) {}
 * }
 * ```
 */
export declare const createOptionalInject: (token: string | symbol, defaultValue?: any) => ParameterDecorator;
/**
 * Creates a lazy injection decorator for circular dependencies.
 *
 * @param {string | symbol} token - Injection token
 * @returns {ParameterDecorator} Decorator function
 *
 * @example
 * ```typescript
 * class ServiceA {
 *   constructor(
 *     @LazyInject('ServiceB') private serviceBFactory: () => ServiceB
 *   ) {}
 *
 *   someMethod() {
 *     const serviceB = this.serviceBFactory();
 *   }
 * }
 * ```
 */
export declare const createLazyInject: (token: string | symbol) => ParameterDecorator;
/**
 * Creates a request-scoped provider configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} provider - Provider class or factory
 * @returns {object} Request-scoped provider
 *
 * @example
 * ```typescript
 * const requestContextProvider = createRequestScopedProvider(
 *   'REQUEST_CONTEXT',
 *   RequestContextService
 * );
 * ```
 */
export declare const createRequestScopedProvider: (token: string | symbol, provider: any) => any;
/**
 * Creates a transient provider that creates new instance each time.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} provider - Provider class or factory
 * @returns {object} Transient provider
 *
 * @example
 * ```typescript
 * const taskProcessorProvider = createTransientProvider(
 *   'TASK_PROCESSOR',
 *   TaskProcessor
 * );
 * ```
 */
export declare const createTransientProvider: (token: string | symbol, provider: any) => any;
/**
 * Creates a provider scope analyzer to inspect provider lifecycles.
 *
 * @param {any[]} providers - Providers to analyze
 * @returns {Map<any, ProviderScope>} Provider scope map
 *
 * @example
 * ```typescript
 * const scopeMap = analyzeProviderScopes([
 *   ConfigService,
 *   RequestContextService,
 *   TaskProcessor
 * ]);
 * scopeMap.forEach((scope, provider) => {
 *   console.log(`${provider.name}: ${scope.scope}`);
 * });
 * ```
 */
export declare const analyzeProviderScopes: (providers: any[]) => Map<any, ProviderScope>;
/**
 * Converts a default-scoped provider to request-scoped.
 *
 * @param {object} provider - Original provider
 * @returns {object} Request-scoped provider
 *
 * @example
 * ```typescript
 * const requestScoped = convertToRequestScope(defaultProvider);
 * ```
 */
export declare const convertToRequestScope: (provider: any) => any;
/**
 * Creates a provider with lifecycle hooks.
 *
 * @param {any} provider - Provider class
 * @param {LifecycleHookConfig} hooks - Lifecycle hook configuration
 * @returns {any} Provider with hooks
 *
 * @example
 * ```typescript
 * const serviceWithHooks = createProviderWithLifecycle(DatabaseService, {
 *   onModuleInit: async () => console.log('Database initializing...'),
 *   onModuleDestroy: async () => console.log('Database closing...')
 * });
 * ```
 */
export declare const createProviderWithLifecycle: (provider: any, hooks: LifecycleHookConfig) => any;
/**
 * Wraps a provider with initialization and cleanup logic.
 *
 * @param {any} provider - Provider class
 * @param {Function} init - Initialization function
 * @param {Function} cleanup - Cleanup function
 * @returns {any} Wrapped provider
 *
 * @example
 * ```typescript
 * const wrappedService = wrapProviderWithHooks(
 *   CacheService,
 *   async (instance) => await instance.connect(),
 *   async (instance) => await instance.disconnect()
 * );
 * ```
 */
export declare const wrapProviderWithHooks: (provider: any, init?: Function, cleanup?: Function) => any;
/**
 * Creates a tenant-aware provider factory.
 *
 * @param {TenantProviderConfig} config - Tenant provider configuration
 * @returns {object} Tenant-aware provider
 *
 * @example
 * ```typescript
 * const tenantDbProvider = createTenantProvider({
 *   token: 'TENANT_DATABASE',
 *   useFactory: async (tenant: TenantContext) => {
 *     return createConnection({
 *       database: tenant.database,
 *       schema: tenant.schema
 *     });
 *   },
 *   scope: 'REQUEST'
 * });
 * ```
 */
export declare const createTenantProvider: (config: TenantProviderConfig) => any;
/**
 * Creates a tenant context resolver for multi-tenant applications.
 *
 * @param {Function} resolverFn - Function to resolve tenant from request
 * @returns {object} Tenant context provider
 *
 * @example
 * ```typescript
 * const tenantContextProvider = createTenantContextResolver((request) => {
 *   const tenantId = request.headers['x-tenant-id'];
 *   return {
 *     tenantId,
 *     schema: `tenant_${tenantId}`,
 *     database: `whitecross_${tenantId}`
 *   };
 * });
 * ```
 */
export declare const createTenantContextResolver: (resolverFn: (request: any) => TenantContext) => any;
/**
 * Creates a tenant-isolated service provider.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} serviceClass - Service class
 * @returns {object} Tenant-isolated provider
 *
 * @example
 * ```typescript
 * const tenantPatientService = createTenantIsolatedProvider(
 *   'PATIENT_SERVICE',
 *   PatientService
 * );
 * ```
 */
export declare const createTenantIsolatedProvider: (token: string | symbol, serviceClass: any) => any;
/**
 * Validates tenant access and permissions.
 *
 * @param {TenantContext} tenant - Tenant context
 * @param {string} userId - User ID
 * @param {string[]} requiredPermissions - Required permissions
 * @returns {boolean} True if user has access
 *
 * @example
 * ```typescript
 * const hasAccess = validateTenantAccess(
 *   tenantContext,
 *   'user123',
 *   ['read:patients', 'write:prescriptions']
 * );
 * ```
 */
export declare const validateTenantAccess: (tenant: TenantContext, userId: string, requiredPermissions: string[]) => boolean;
/**
 * Creates a feature toggle provider.
 *
 * @param {FeatureToggleConfig} config - Feature toggle configuration
 * @returns {object} Feature toggle provider
 *
 * @example
 * ```typescript
 * const featureToggleProvider = createFeatureToggleProvider({
 *   toggles: [
 *     { name: 'advanced-reporting', enabled: true },
 *     { name: 'beta-features', enabled: false, strategy: 'percentage', percentage: 10 }
 *   ],
 *   defaultEnabled: false,
 *   cacheEnabled: true,
 *   cacheTTL: 300
 * });
 * ```
 */
export declare const createFeatureToggleProvider: (config: FeatureToggleConfig) => any;
/**
 * Evaluates a feature toggle based on strategy.
 *
 * @param {FeatureToggle | undefined} toggle - Feature toggle
 * @param {any} context - Evaluation context
 * @param {boolean} defaultValue - Default value if toggle not found
 * @returns {boolean} True if feature is enabled
 *
 * @example
 * ```typescript
 * const enabled = evaluateFeatureToggle(
 *   { name: 'new-ui', enabled: true, strategy: 'user', users: ['user123'] },
 *   { userId: 'user123' },
 *   false
 * );
 * ```
 */
export declare const evaluateFeatureToggle: (toggle: FeatureToggle | undefined, context: any, defaultValue?: boolean) => boolean;
/**
 * Creates a feature-gated provider that only registers if feature is enabled.
 *
 * @param {string} featureName - Feature toggle name
 * @param {any} provider - Provider to gate
 * @param {any} fallbackProvider - Fallback provider if feature is disabled
 * @returns {object} Feature-gated provider
 *
 * @example
 * ```typescript
 * const reportingProvider = createFeatureGatedProvider(
 *   'advanced-reporting',
 *   AdvancedReportingService,
 *   BasicReportingService
 * );
 * ```
 */
export declare const createFeatureGatedProvider: (featureName: string, provider: any, fallbackProvider?: any) => any;
/**
 * Creates a health check provider for service monitoring.
 *
 * @param {HealthCheckConfig[]} checks - Array of health checks
 * @returns {object} Health check provider
 *
 * @example
 * ```typescript
 * const healthCheckProvider = createHealthCheckProvider([
 *   {
 *     name: 'database',
 *     check: async () => {
 *       await databaseService.ping();
 *       return { status: 'healthy', timestamp: new Date() };
 *     },
 *     timeout: 5000,
 *     critical: true
 *   },
 *   {
 *     name: 'cache',
 *     check: async () => {
 *       await cacheService.ping();
 *       return { status: 'healthy', timestamp: new Date() };
 *     },
 *     timeout: 3000
 *   }
 * ]);
 * ```
 */
export declare const createHealthCheckProvider: (checks: HealthCheckConfig[]) => any;
/**
 * Creates a service health metrics collector.
 *
 * @param {string} serviceName - Service name
 * @returns {object} Health metrics collector
 *
 * @example
 * ```typescript
 * const metricsCollector = createServiceHealthMetrics('PatientService');
 * metricsCollector.recordRequest();
 * metricsCollector.recordError();
 * const metrics = metricsCollector.getMetrics();
 * ```
 */
export declare const createServiceHealthMetrics: (serviceName: string) => any;
/**
 * Creates a dependency health checker.
 *
 * @param {Record<string, () => Promise<HealthCheckResult>>} dependencies - Service dependencies
 * @returns {Function} Dependency health check function
 *
 * @example
 * ```typescript
 * const checkDependencies = createDependencyHealthChecker({
 *   database: async () => ({ status: 'healthy', timestamp: new Date() }),
 *   cache: async () => ({ status: 'healthy', timestamp: new Date() }),
 *   externalApi: async () => ({ status: 'degraded', timestamp: new Date() })
 * });
 *
 * const health = await checkDependencies();
 * ```
 */
export declare const createDependencyHealthChecker: (dependencies: Record<string, () => Promise<HealthCheckResult>>) => (() => Promise<Record<string, HealthCheckResult>>);
/**
 * Creates a circuit breaker for service resilience.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const circuitBreaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 10000,
 *   resetTimeout: 60000,
 *   onStateChange: (state) => console.log('Circuit state:', state)
 * });
 *
 * const result = await circuitBreaker.execute(async () => {
 *   return await externalApiCall();
 * });
 * ```
 */
export declare const createCircuitBreaker: (config: CircuitBreakerConfig) => any;
/**
 * Creates a circuit breaker provider wrapper.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} service - Service to wrap
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker provider
 *
 * @example
 * ```typescript
 * const protectedApiProvider = createCircuitBreakerProvider(
 *   'EXTERNAL_API',
 *   ExternalApiService,
 *   { failureThreshold: 5, timeout: 10000, resetTimeout: 60000 }
 * );
 * ```
 */
export declare const createCircuitBreakerProvider: (token: string | symbol, service: any, config: CircuitBreakerConfig) => any;
/**
 * Creates a retry configuration with exponential backoff.
 *
 * @param {RetryConfig} config - Retry configuration
 * @returns {object} Retry handler
 *
 * @example
 * ```typescript
 * const retryHandler = createRetryHandler({
 *   maxAttempts: 3,
 *   initialDelayMs: 1000,
 *   maxDelayMs: 10000,
 *   backoffMultiplier: 2,
 *   retryableErrors: ['ECONNREFUSED', 'ETIMEDOUT'],
 *   onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error.message)
 * });
 *
 * const result = await retryHandler.execute(async () => {
 *   return await unreliableOperation();
 * });
 * ```
 */
export declare const createRetryHandler: (config: RetryConfig) => any;
/**
 * Creates a retry provider wrapper.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} service - Service to wrap
 * @param {RetryConfig} config - Retry configuration
 * @returns {object} Retry provider
 *
 * @example
 * ```typescript
 * const retryableApiProvider = createRetryProvider(
 *   'EXTERNAL_API',
 *   ExternalApiService,
 *   { maxAttempts: 3, initialDelayMs: 1000, backoffMultiplier: 2 }
 * );
 * ```
 */
export declare const createRetryProvider: (token: string | symbol, service: any, config: RetryConfig) => any;
/**
 * Executes a function with retry logic.
 *
 * @param {Function} fn - Function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Result of the function
 *
 * @example
 * ```typescript
 * const data = await executeWithRetry(
 *   async () => await fetchPatientData(patientId),
 *   { maxAttempts: 3, initialDelayMs: 500, backoffMultiplier: 2 }
 * );
 * ```
 */
export declare const executeWithRetry: <T>(fn: () => Promise<T>, config: RetryConfig) => Promise<T>;
/**
 * Delays execution for specified milliseconds.
 *
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after delay
 *
 * @example
 * ```typescript
 * await delay(1000); // Wait 1 second
 * ```
 */
export declare const delay: (ms: number) => Promise<void>;
/**
 * Creates a timeout promise that rejects after specified time.
 *
 * @param {number} ms - Timeout in milliseconds
 * @param {string} message - Error message
 * @returns {Promise<never>} Promise that rejects after timeout
 *
 * @example
 * ```typescript
 * await Promise.race([
 *   longRunningOperation(),
 *   createTimeout(5000, 'Operation timed out')
 * ]);
 * ```
 */
export declare const createTimeout: (ms: number, message?: string) => Promise<never>;
/**
 * Wraps a promise with timeout.
 *
 * @param {Promise<T>} promise - Promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<T>} Promise with timeout
 *
 * @example
 * ```typescript
 * const result = await withTimeout(fetchData(), 5000);
 * ```
 */
export declare const withTimeout: <T>(promise: Promise<T>, timeoutMs: number) => Promise<T>;
/**
 * Generates a unique provider instance ID.
 *
 * @returns {string} Unique instance ID
 *
 * @example
 * ```typescript
 * const instanceId = generateProviderInstanceId();
 * console.log('Provider instance:', instanceId);
 * ```
 */
export declare const generateProviderInstanceId: () => string;
/**
 * Creates provider metadata for tracking and debugging.
 *
 * @param {string | symbol} token - Provider token
 * @param {string} scope - Provider scope
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {ProviderMetadata} Provider metadata object
 *
 * @example
 * ```typescript
 * const metadata = createProviderMetadata('DATABASE_SERVICE', 'DEFAULT', {
 *   version: '1.0.0',
 *   initialized: true
 * });
 * ```
 */
export declare const createProviderMetadata: (token: string | symbol, scope: "DEFAULT" | "REQUEST" | "TRANSIENT", metadata?: Record<string, any>) => ProviderMetadata;
export {};
//# sourceMappingURL=service-providers-kit.d.ts.map