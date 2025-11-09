/**
 * LOC: NETDIJ1234567
 * File: /reuse/san/network-dependency-injection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network module implementations
 *   - NestJS dynamic modules
 *   - Virtual network dependency injection
 */
/**
 * File: /reuse/san/network-dependency-injection-kit.ts
 * Locator: WC-UTL-NETDIJ-001
 * Purpose: Comprehensive Network Dependency Injection Kit - custom providers, module configuration, dynamic registration, scopes, middleware, interceptors, guards, async providers
 *
 * Upstream: Independent utility module for NestJS network dependency injection
 * Downstream: ../backend/*, Network modules, middleware, interceptors, guards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ utility functions for network DI patterns, custom providers, dynamic modules, scopes, middleware, interceptors, guards, async providers
 *
 * LLM Context: Comprehensive network dependency injection utilities for implementing production-ready software-defined networking DI patterns.
 * Provides custom network providers, module configuration, dynamic module registration, service scopes, middleware providers, interceptor providers,
 * guard providers, and async providers. Essential for scalable virtual network infrastructure with proper dependency injection in healthcare environments.
 */
import { DynamicModule, Provider, Type, Scope, NestInterceptor, ExecutionContext, CanActivate, NestMiddleware, ForwardReference } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Sequelize } from 'sequelize';
interface NetworkModuleOptions {
    isGlobal?: boolean;
    providers?: Provider[];
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    exports?: Array<string | symbol | Provider | Type<any>>;
    controllers?: Type<any>[];
}
interface NetworkModuleAsyncOptions {
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    useFactory?: (...args: any[]) => Promise<NetworkModuleOptions> | NetworkModuleOptions;
    inject?: any[];
    useClass?: Type<NetworkOptionsFactory>;
    useExisting?: Type<NetworkOptionsFactory>;
}
interface NetworkOptionsFactory {
    createNetworkOptions(): Promise<NetworkModuleOptions> | NetworkModuleOptions;
}
interface CustomProviderConfig {
    token: string | symbol;
    scope?: Scope;
    transient?: boolean;
    lazy?: boolean;
    metadata?: Record<string, any>;
}
interface NetworkMiddlewareConfig {
    path: string | string[];
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'ALL';
    excludePaths?: string[];
    order?: number;
}
interface NetworkInterceptorConfig {
    timeout?: number;
    cacheKey?: string;
    cacheTTL?: number;
    logRequests?: boolean;
    transformResponse?: boolean;
}
interface NetworkGuardConfig {
    allowAnonymous?: boolean;
    requiredRoles?: string[];
    requiredPermissions?: string[];
    checkNetworkAccess?: boolean;
}
/**
 * Sequelize model for Network Module Configuration registry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkModuleConfig model
 *
 * @example
 * ```typescript
 * const NetworkModuleConfig = createNetworkModuleConfigModel(sequelize);
 * const config = await NetworkModuleConfig.create({
 *   moduleName: 'PatientNetworkModule',
 *   moduleId: 'mod_patient_001',
 *   isGlobal: true,
 *   providers: ['PatientService', 'PatientRepository'],
 *   exports: ['PatientService']
 * });
 * ```
 */
export declare const createNetworkModuleConfigModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        moduleName: string;
        moduleId: string;
        isGlobal: boolean;
        providers: string[];
        imports: string[];
        exports: string[];
        controllers: string[];
        metadata: Record<string, any>;
        configHash: string;
        version: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Provider Registry with scope and dependency tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProviderRegistry model
 *
 * @example
 * ```typescript
 * const ProviderRegistry = createProviderRegistryModel(sequelize);
 * const provider = await ProviderRegistry.create({
 *   token: 'PatientService',
 *   providerType: 'class',
 *   scope: 'DEFAULT',
 *   moduleId: 'mod_patient_001',
 *   dependencies: ['PatientRepository', 'ConfigService']
 * });
 * ```
 */
export declare const createProviderRegistryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        token: string;
        providerType: string;
        scope: string;
        moduleId: string;
        className: string | null;
        dependencies: string[];
        isExported: boolean;
        isLazy: boolean;
        metadata: Record<string, any>;
        registeredAt: Date;
        lastAccessedAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Dependency Injection Events and audit logging.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DIEvent model
 *
 * @example
 * ```typescript
 * const DIEvent = createDIEventModel(sequelize);
 * const event = await DIEvent.create({
 *   eventType: 'provider_registered',
 *   token: 'PatientService',
 *   moduleId: 'mod_patient_001',
 *   details: { scope: 'DEFAULT', dependencies: ['PatientRepository'] }
 * });
 * ```
 */
export declare const createDIEventModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        eventType: string;
        token: string;
        moduleId: string | null;
        scope: string | null;
        details: Record<string, any>;
        error: string | null;
        duration: number | null;
        readonly createdAt: Date;
    };
};
/**
 * Creates custom class provider with metadata and scope configuration.
 *
 * @param {Type<T>} classType - Provider class
 * @param {CustomProviderConfig} config - Provider configuration
 * @returns {Provider} Class provider
 *
 * @example
 * ```typescript
 * const provider = createCustomClassProvider(PatientNetworkService, {
 *   token: 'PATIENT_NETWORK_SERVICE',
 *   scope: Scope.DEFAULT,
 *   metadata: { region: 'us-east-1' }
 * });
 * ```
 */
export declare const createCustomClassProvider: <T>(classType: Type<T>, config: CustomProviderConfig) => Provider;
/**
 * Creates custom value provider for static configuration or constants.
 *
 * @param {string | symbol} token - Injection token
 * @param {T} value - Provider value
 * @returns {Provider} Value provider
 *
 * @example
 * ```typescript
 * const provider = createCustomValueProvider('NETWORK_CONFIG', {
 *   maxConnections: 100,
 *   timeout: 5000,
 *   retries: 3
 * });
 * ```
 */
export declare const createCustomValueProvider: <T>(token: string | symbol, value: T) => Provider;
/**
 * Creates custom factory provider with dependency injection.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {any[]} inject - Dependencies to inject
 * @param {Scope} [scope=Scope.DEFAULT] - Provider scope
 * @returns {Provider} Factory provider
 *
 * @example
 * ```typescript
 * const provider = createCustomFactoryProvider(
 *   'NETWORK_CLIENT',
 *   (config: ConfigService) => {
 *     return new NetworkClient(config.get('network'));
 *   },
 *   [ConfigService],
 *   Scope.DEFAULT
 * );
 * ```
 */
export declare const createCustomFactoryProvider: (token: string | symbol, factory: (...args: any[]) => any, inject?: any[], scope?: Scope) => Provider;
/**
 * Creates aliased provider that references another provider.
 *
 * @param {string | symbol} token - New injection token
 * @param {string | symbol} existingToken - Existing provider token
 * @returns {Provider} Existing provider alias
 *
 * @example
 * ```typescript
 * const provider = createAliasedProvider('IPatientService', 'PatientService');
 * ```
 */
export declare const createAliasedProvider: (token: string | symbol, existingToken: string | symbol) => Provider;
/**
 * Creates async provider with promise-based initialization.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} asyncFactory - Async factory function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncProvider(
 *   'DATABASE_CONNECTION',
 *   async (config: ConfigService) => {
 *     const conn = new DatabaseConnection(config.get('db'));
 *     await conn.connect();
 *     return conn;
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export declare const createAsyncProvider: (token: string | symbol, asyncFactory: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
/**
 * Creates static network module with providers and exports.
 *
 * @param {string} moduleName - Module name
 * @param {NetworkModuleOptions} options - Module options
 * @returns {Type<any>} Module class
 *
 * @example
 * ```typescript
 * const NetworkModule = createNetworkModule('PatientNetworkModule', {
 *   isGlobal: true,
 *   providers: [PatientService, PatientRepository],
 *   exports: [PatientService]
 * });
 * ```
 */
export declare const createNetworkModule: (moduleName: string, options: NetworkModuleOptions) => Type<any>;
/**
 * Creates dynamic network module with runtime configuration.
 *
 * @param {string} moduleName - Module name
 * @param {NetworkModuleOptions} options - Module options
 * @returns {DynamicModule} Dynamic module
 *
 * @example
 * ```typescript
 * const module = createDynamicNetworkModule('DynamicPatientModule', {
 *   isGlobal: true,
 *   providers: [
 *     {
 *       provide: 'PATIENT_CONFIG',
 *       useValue: { maxPatients: 1000 }
 *     }
 *   ]
 * });
 * ```
 */
export declare const createDynamicNetworkModule: (moduleName: string, options: NetworkModuleOptions) => DynamicModule;
/**
 * Registers network module for root application context.
 *
 * @param {NetworkModuleOptions} options - Module options
 * @returns {DynamicModule} Root module configuration
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     registerNetworkModuleForRoot({
 *       isGlobal: true,
 *       providers: [NetworkConfigService]
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export declare const registerNetworkModuleForRoot: (options: NetworkModuleOptions) => DynamicModule;
/**
 * Registers network module asynchronously with factory configuration.
 *
 * @param {NetworkModuleAsyncOptions} asyncOptions - Async module options
 * @returns {DynamicModule} Async module configuration
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     registerNetworkModuleAsync({
 *       imports: [ConfigModule],
 *       useFactory: async (config: ConfigService) => ({
 *         providers: [
 *           {
 *             provide: 'NETWORK_CONFIG',
 *             useValue: await config.getNetworkConfig()
 *           }
 *         ]
 *       }),
 *       inject: [ConfigService]
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export declare const registerNetworkModuleAsync: (asyncOptions: NetworkModuleAsyncOptions) => DynamicModule;
/**
 * Merges multiple module configurations into a single module.
 *
 * @param {string} moduleName - Merged module name
 * @param {NetworkModuleOptions[]} moduleConfigs - Array of module configurations
 * @returns {DynamicModule} Merged module
 *
 * @example
 * ```typescript
 * const merged = mergeNetworkModuleConfigs('MergedNetworkModule', [
 *   { providers: [ServiceA] },
 *   { providers: [ServiceB], exports: [ServiceB] }
 * ]);
 * ```
 */
export declare const mergeNetworkModuleConfigs: (moduleName: string, moduleConfigs: NetworkModuleOptions[]) => DynamicModule;
/**
 * Registers provider dynamically at runtime.
 *
 * @param {ModuleRef} moduleRef - NestJS module reference
 * @param {Provider} provider - Provider to register
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await registerProviderDynamically(moduleRef, {
 *   provide: 'DYNAMIC_SERVICE',
 *   useClass: DynamicNetworkService
 * });
 * ```
 */
export declare const registerProviderDynamically: (moduleRef: ModuleRef, provider: Provider) => Promise<void>;
/**
 * Creates conditional provider based on runtime conditions.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} condition - Condition function
 * @param {Provider} trueProvider - Provider if condition is true
 * @param {Provider} falseProvider - Provider if condition is false
 * @returns {Provider} Conditional provider
 *
 * @example
 * ```typescript
 * const provider = createConditionalProvider(
 *   'CACHE_SERVICE',
 *   (config) => config.get('cache.enabled'),
 *   { provide: 'CACHE_SERVICE', useClass: RedisCache },
 *   { provide: 'CACHE_SERVICE', useClass: MemoryCache }
 * );
 * ```
 */
export declare const createConditionalProvider: (token: string | symbol, condition: (...args: any[]) => boolean, trueProvider: Provider, falseProvider: Provider) => Provider;
/**
 * Creates lazy provider that initializes on first access.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Lazy factory function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Lazy provider
 *
 * @example
 * ```typescript
 * const provider = createLazyProvider(
 *   'HEAVY_SERVICE',
 *   (config) => {
 *     console.log('Initializing heavy service...');
 *     return new HeavyNetworkService(config);
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export declare const createLazyProvider: (token: string | symbol, factory: (...args: any[]) => any, inject?: any[]) => Provider;
/**
 * Registers module with feature-specific configuration.
 *
 * @param {string} featureName - Feature name
 * @param {NetworkModuleOptions} options - Module options
 * @returns {DynamicModule} Feature module
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     registerFeatureModule('Patients', {
 *       providers: [PatientService, PatientRepository],
 *       exports: [PatientService]
 *     })
 *   ]
 * })
 * export class PatientModule {}
 * ```
 */
export declare const registerFeatureModule: (featureName: string, options: NetworkModuleOptions) => DynamicModule;
/**
 * Creates multi-provider for array-based dependency injection.
 *
 * @param {string | symbol} token - Injection token
 * @param {any[]} providers - Array of provider values
 * @returns {Provider[]} Multi-providers
 *
 * @example
 * ```typescript
 * const providers = createMultiProvider('NETWORK_INTERCEPTORS', [
 *   LoggingInterceptor,
 *   CachingInterceptor,
 *   TimeoutInterceptor
 * ]);
 * ```
 */
export declare const createMultiProvider: (token: string | symbol, providers: any[]) => Provider[];
/**
 * Creates singleton-scoped provider (DEFAULT scope).
 *
 * @param {Type<T>} classType - Provider class
 * @param {string | symbol} [token] - Optional injection token
 * @returns {Provider} Singleton provider
 *
 * @example
 * ```typescript
 * const provider = createSingletonProvider(NetworkConfigService);
 * ```
 */
export declare const createSingletonProvider: <T>(classType: Type<T>, token?: string | symbol) => Provider;
/**
 * Creates request-scoped provider (new instance per request).
 *
 * @param {Type<T>} classType - Provider class
 * @param {string | symbol} [token] - Optional injection token
 * @returns {Provider} Request-scoped provider
 *
 * @example
 * ```typescript
 * const provider = createRequestScopedProvider(RequestContextService, 'REQUEST_CONTEXT');
 * ```
 */
export declare const createRequestScopedProvider: <T>(classType: Type<T>, token?: string | symbol) => Provider;
/**
 * Creates transient-scoped provider (new instance per injection).
 *
 * @param {Type<T>} classType - Provider class
 * @param {string | symbol} [token] - Optional injection token
 * @returns {Provider} Transient provider
 *
 * @example
 * ```typescript
 * const provider = createTransientProvider(UniqueIdGenerator);
 * ```
 */
export declare const createTransientProvider: <T>(classType: Type<T>, token?: string | symbol) => Provider;
/**
 * Creates scope-aware factory provider with custom scope logic.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {Scope} scope - Provider scope
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Scoped factory provider
 *
 * @example
 * ```typescript
 * const provider = createScopedFactoryProvider(
 *   'SCOPED_CACHE',
 *   (request) => new RequestCache(request),
 *   Scope.REQUEST,
 *   [REQUEST]
 * );
 * ```
 */
export declare const createScopedFactoryProvider: (token: string | symbol, factory: (...args: any[]) => any, scope: Scope, inject?: any[]) => Provider;
/**
 * Decorates provider with scope metadata for introspection.
 *
 * @param {Provider} provider - Provider to decorate
 * @param {Scope} scope - Provider scope
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {Provider} Decorated provider
 *
 * @example
 * ```typescript
 * const provider = decorateProviderWithScope(
 *   { provide: 'SERVICE', useClass: MyService },
 *   Scope.REQUEST,
 *   { description: 'Request-scoped service' }
 * );
 * ```
 */
export declare const decorateProviderWithScope: (provider: Provider, scope: Scope, metadata?: Record<string, any>) => Provider;
/**
 * Creates network middleware provider for request/response interception.
 *
 * @param {Type<NestMiddleware>} middlewareClass - Middleware class
 * @param {NetworkMiddlewareConfig} config - Middleware configuration
 * @returns {Provider} Middleware provider
 *
 * @example
 * ```typescript
 * const provider = createNetworkMiddlewareProvider(
 *   NetworkLoggingMiddleware,
 *   {
 *     path: '/api/*',
 *     method: 'ALL',
 *     order: 1
 *   }
 * );
 * ```
 */
export declare const createNetworkMiddlewareProvider: (middlewareClass: Type<NestMiddleware>, config: NetworkMiddlewareConfig) => Provider;
/**
 * Creates authentication middleware provider for network requests.
 *
 * @param {Function} validateToken - Token validation function
 * @returns {Type<NestMiddleware>} Auth middleware class
 *
 * @example
 * ```typescript
 * const AuthMiddleware = createAuthMiddleware(async (token) => {
 *   return await jwtService.verify(token);
 * });
 * ```
 */
export declare const createAuthMiddleware: (validateToken: (token: string) => Promise<any>) => Type<NestMiddleware>;
/**
 * Creates rate limiting middleware provider for network traffic control.
 *
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Type<NestMiddleware>} Rate limit middleware class
 *
 * @example
 * ```typescript
 * const RateLimitMiddleware = createRateLimitMiddleware(100, 60000);
 * ```
 */
export declare const createRateLimitMiddleware: (maxRequests: number, windowMs: number) => Type<NestMiddleware>;
/**
 * Creates logging middleware provider for network request tracking.
 *
 * @param {Function} logger - Logging function
 * @returns {Type<NestMiddleware>} Logging middleware class
 *
 * @example
 * ```typescript
 * const LoggingMiddleware = createLoggingMiddleware((data) => {
 *   console.log('Network request:', data);
 * });
 * ```
 */
export declare const createLoggingMiddleware: (logger: (data: any) => void) => Type<NestMiddleware>;
/**
 * Creates network interceptor provider for request/response transformation.
 *
 * @param {NetworkInterceptorConfig} config - Interceptor configuration
 * @returns {Type<NestInterceptor>} Interceptor class
 *
 * @example
 * ```typescript
 * const interceptor = createNetworkInterceptor({
 *   timeout: 5000,
 *   logRequests: true,
 *   transformResponse: true
 * });
 * ```
 */
export declare const createNetworkInterceptor: (config: NetworkInterceptorConfig) => Type<NestInterceptor>;
/**
 * Creates caching interceptor provider for network response caching.
 *
 * @param {number} ttl - Cache TTL in milliseconds
 * @param {Function} [keyGenerator] - Cache key generator function
 * @returns {Type<NestInterceptor>} Caching interceptor class
 *
 * @example
 * ```typescript
 * const interceptor = createCachingInterceptor(60000, (context) => {
 *   const request = context.switchToHttp().getRequest();
 *   return `${request.method}:${request.url}`;
 * });
 * ```
 */
export declare const createCachingInterceptor: (ttl: number, keyGenerator?: (context: ExecutionContext) => string) => Type<NestInterceptor>;
/**
 * Creates timeout interceptor provider for network request timeouts.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Type<NestInterceptor>} Timeout interceptor class
 *
 * @example
 * ```typescript
 * const interceptor = createTimeoutInterceptor(5000);
 * ```
 */
export declare const createTimeoutInterceptor: (timeoutMs: number) => Type<NestInterceptor>;
/**
 * Creates transformation interceptor provider for response data mapping.
 *
 * @param {Function} transformFn - Transformation function
 * @returns {Type<NestInterceptor>} Transform interceptor class
 *
 * @example
 * ```typescript
 * const interceptor = createTransformInterceptor((data) => ({
 *   success: true,
 *   data,
 *   timestamp: new Date().toISOString()
 * }));
 * ```
 */
export declare const createTransformInterceptor: (transformFn: (data: any) => any) => Type<NestInterceptor>;
/**
 * Creates network guard provider for request authorization.
 *
 * @param {NetworkGuardConfig} config - Guard configuration
 * @returns {Type<CanActivate>} Guard class
 *
 * @example
 * ```typescript
 * const guard = createNetworkGuard({
 *   allowAnonymous: false,
 *   requiredRoles: ['admin', 'network_admin'],
 *   checkNetworkAccess: true
 * });
 * ```
 */
export declare const createNetworkGuard: (config: NetworkGuardConfig) => Type<CanActivate>;
/**
 * Creates role-based guard provider for network access control.
 *
 * @param {string[]} allowedRoles - Allowed user roles
 * @returns {Type<CanActivate>} Role guard class
 *
 * @example
 * ```typescript
 * const guard = createRoleGuard(['admin', 'network_engineer']);
 * ```
 */
export declare const createRoleGuard: (allowedRoles: string[]) => Type<CanActivate>;
/**
 * Creates IP whitelist guard provider for network access restriction.
 *
 * @param {string[]} allowedIPs - Allowed IP addresses or CIDR ranges
 * @returns {Type<CanActivate>} IP guard class
 *
 * @example
 * ```typescript
 * const guard = createIPWhitelistGuard(['10.0.0.0/8', '192.168.1.100']);
 * ```
 */
export declare const createIPWhitelistGuard: (allowedIPs: string[]) => Type<CanActivate>;
/**
 * Creates throttle guard provider for request rate limiting.
 *
 * @param {number} limit - Maximum requests
 * @param {number} ttl - Time window in milliseconds
 * @returns {Type<CanActivate>} Throttle guard class
 *
 * @example
 * ```typescript
 * const guard = createThrottleGuard(10, 60000); // 10 requests per minute
 * ```
 */
export declare const createThrottleGuard: (limit: number, ttl: number) => Type<CanActivate>;
/**
 * Creates async database connection provider with initialization.
 *
 * @param {string} token - Injection token
 * @param {Function} connectionFactory - Async connection factory
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async database provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncDatabaseProvider(
 *   'DATABASE_CONNECTION',
 *   async (config: ConfigService) => {
 *     const conn = new DatabaseConnection(config.get('db'));
 *     await conn.connect();
 *     return conn;
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export declare const createAsyncDatabaseProvider: (token: string | symbol, connectionFactory: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
/**
 * Creates async configuration provider with external config loading.
 *
 * @param {string} token - Injection token
 * @param {Function} configLoader - Async config loader function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async config provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncConfigProvider(
 *   'NETWORK_CONFIG',
 *   async (httpClient) => {
 *     const response = await httpClient.get('http://config-server/network');
 *     return response.data;
 *   },
 *   [HttpClient]
 * );
 * ```
 */
export declare const createAsyncConfigProvider: (token: string | symbol, configLoader: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
/**
 * Creates async service discovery provider with registry integration.
 *
 * @param {string} token - Injection token
 * @param {string} serviceName - Service name to discover
 * @param {Function} discoveryClient - Discovery client factory
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async discovery provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncDiscoveryProvider(
 *   'PATIENT_SERVICE',
 *   'patient-api',
 *   async (registry) => {
 *     const instances = await registry.discover('patient-api');
 *     return instances[0]; // Return first healthy instance
 *   },
 *   [ServiceRegistry]
 * );
 * ```
 */
export declare const createAsyncDiscoveryProvider: (token: string | symbol, serviceName: string, discoveryClient: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
/**
 * Creates async health check provider with dependency validation.
 *
 * @param {string} token - Injection token
 * @param {Function} healthCheckFn - Async health check function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async health check provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncHealthCheckProvider(
 *   'NETWORK_HEALTH',
 *   async (db, cache) => {
 *     await Promise.all([db.ping(), cache.ping()]);
 *     return { status: 'healthy' };
 *   },
 *   [DatabaseConnection, CacheService]
 * );
 * ```
 */
export declare const createAsyncHealthCheckProvider: (token: string | symbol, healthCheckFn: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
/**
 * Creates async migration provider for database schema initialization.
 *
 * @param {string} token - Injection token
 * @param {Function} migrationFn - Async migration function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async migration provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncMigrationProvider(
 *   'DATABASE_MIGRATIONS',
 *   async (sequelize) => {
 *     await sequelize.sync({ alter: true });
 *     console.log('Database migrations complete');
 *     return { migrated: true };
 *   },
 *   [Sequelize]
 * );
 * ```
 */
export declare const createAsyncMigrationProvider: (token: string | symbol, migrationFn: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
declare const _default: {
    createNetworkModuleConfigModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            moduleName: string;
            moduleId: string;
            isGlobal: boolean;
            providers: string[];
            imports: string[];
            exports: string[];
            controllers: string[];
            metadata: Record<string, any>;
            configHash: string;
            version: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createProviderRegistryModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            token: string;
            providerType: string;
            scope: string;
            moduleId: string;
            className: string | null;
            dependencies: string[];
            isExported: boolean;
            isLazy: boolean;
            metadata: Record<string, any>;
            registeredAt: Date;
            lastAccessedAt: Date | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDIEventModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            eventType: string;
            token: string;
            moduleId: string | null;
            scope: string | null;
            details: Record<string, any>;
            error: string | null;
            duration: number | null;
            readonly createdAt: Date;
        };
    };
    createCustomClassProvider: <T>(classType: Type<T>, config: CustomProviderConfig) => Provider;
    createCustomValueProvider: <T>(token: string | symbol, value: T) => Provider;
    createCustomFactoryProvider: (token: string | symbol, factory: (...args: any[]) => any, inject?: any[], scope?: Scope) => Provider;
    createAliasedProvider: (token: string | symbol, existingToken: string | symbol) => Provider;
    createAsyncProvider: (token: string | symbol, asyncFactory: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
    createNetworkModule: (moduleName: string, options: NetworkModuleOptions) => Type<any>;
    createDynamicNetworkModule: (moduleName: string, options: NetworkModuleOptions) => DynamicModule;
    registerNetworkModuleForRoot: (options: NetworkModuleOptions) => DynamicModule;
    registerNetworkModuleAsync: (asyncOptions: NetworkModuleAsyncOptions) => DynamicModule;
    mergeNetworkModuleConfigs: (moduleName: string, moduleConfigs: NetworkModuleOptions[]) => DynamicModule;
    registerProviderDynamically: (moduleRef: ModuleRef, provider: Provider) => Promise<void>;
    createConditionalProvider: (token: string | symbol, condition: (...args: any[]) => boolean, trueProvider: Provider, falseProvider: Provider) => Provider;
    createLazyProvider: (token: string | symbol, factory: (...args: any[]) => any, inject?: any[]) => Provider;
    registerFeatureModule: (featureName: string, options: NetworkModuleOptions) => DynamicModule;
    createMultiProvider: (token: string | symbol, providers: any[]) => Provider[];
    createSingletonProvider: <T>(classType: Type<T>, token?: string | symbol) => Provider;
    createRequestScopedProvider: <T>(classType: Type<T>, token?: string | symbol) => Provider;
    createTransientProvider: <T>(classType: Type<T>, token?: string | symbol) => Provider;
    createScopedFactoryProvider: (token: string | symbol, factory: (...args: any[]) => any, scope: Scope, inject?: any[]) => Provider;
    decorateProviderWithScope: (provider: Provider, scope: Scope, metadata?: Record<string, any>) => Provider;
    createNetworkMiddlewareProvider: (middlewareClass: Type<NestMiddleware>, config: NetworkMiddlewareConfig) => Provider;
    createAuthMiddleware: (validateToken: (token: string) => Promise<any>) => Type<NestMiddleware>;
    createRateLimitMiddleware: (maxRequests: number, windowMs: number) => Type<NestMiddleware>;
    createLoggingMiddleware: (logger: (data: any) => void) => Type<NestMiddleware>;
    createNetworkInterceptor: (config: NetworkInterceptorConfig) => Type<NestInterceptor>;
    createCachingInterceptor: (ttl: number, keyGenerator?: (context: ExecutionContext) => string) => Type<NestInterceptor>;
    createTimeoutInterceptor: (timeoutMs: number) => Type<NestInterceptor>;
    createTransformInterceptor: (transformFn: (data: any) => any) => Type<NestInterceptor>;
    createNetworkGuard: (config: NetworkGuardConfig) => Type<CanActivate>;
    createRoleGuard: (allowedRoles: string[]) => Type<CanActivate>;
    createIPWhitelistGuard: (allowedIPs: string[]) => Type<CanActivate>;
    createThrottleGuard: (limit: number, ttl: number) => Type<CanActivate>;
    createAsyncDatabaseProvider: (token: string | symbol, connectionFactory: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
    createAsyncConfigProvider: (token: string | symbol, configLoader: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
    createAsyncDiscoveryProvider: (token: string | symbol, serviceName: string, discoveryClient: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
    createAsyncHealthCheckProvider: (token: string | symbol, healthCheckFn: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
    createAsyncMigrationProvider: (token: string | symbol, migrationFn: (...args: any[]) => Promise<any>, inject?: any[]) => Provider;
};
export default _default;
//# sourceMappingURL=network-dependency-injection-kit.d.ts.map