/**
 * File: /reuse/nest-providers-utils.ts
 * Locator: WC-UTL-PROV-001
 * Purpose: NestJS Provider & Service Utilities - DI, factories, scopes, and dynamic modules
 *
 * Upstream: @nestjs/common, @nestjs/core, reflect-metadata
 * Downstream: All NestJS modules, services, and providers across White Cross platform
 * Dependencies: NestJS v11.x, TypeScript 5.x, Node 18+
 * Exports: 40 provider utilities for DI, factories, async providers, scoped services
 *
 * LLM Context: Type-safe NestJS provider utilities for White Cross healthcare system.
 * Provides factory builders, DI helpers, scope management, circular dependency resolution,
 * dynamic module creation, multi-provider patterns, and async provider configuration.
 * Critical for service architecture, modularity, and dependency injection patterns.
 */
import { Scope, Provider, Type, DynamicModule, ForwardReference, FactoryProvider, ValueProvider, ClassProvider, ExistingProvider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
/**
 * Creates a factory provider with type-safe dependencies.
 *
 * @template T - The type of value the factory produces
 * @param {string | symbol} token - The injection token for this provider
 * @param {(...deps: any[]) => T | Promise<T>} factory - Factory function that creates the value
 * @param {any[]} inject - Array of dependency tokens to inject into factory
 * @returns {FactoryProvider<T>} Configured factory provider
 *
 * @example
 * ```typescript
 * const DATABASE_CONFIG = 'DATABASE_CONFIG';
 * const dbConfigProvider = createFactoryProvider(
 *   DATABASE_CONFIG,
 *   (configService: ConfigService) => ({
 *     host: configService.get('DB_HOST'),
 *     port: configService.get('DB_PORT'),
 *   }),
 *   [ConfigService]
 * );
 * ```
 */
export declare function createFactoryProvider<T>(token: string | symbol, factory: (...deps: any[]) => T | Promise<T>, inject?: any[]): FactoryProvider<T>;
/**
 * Creates an async factory provider for asynchronous initialization.
 *
 * @template T - The type of value the async factory produces
 * @param {string | symbol} token - The injection token
 * @param {(...deps: any[]) => Promise<T>} asyncFactory - Async factory function
 * @param {any[]} inject - Dependency tokens to inject
 * @returns {FactoryProvider<Promise<T>>} Async factory provider
 *
 * @example
 * ```typescript
 * const EXTERNAL_API = 'EXTERNAL_API';
 * const apiProvider = createAsyncFactoryProvider(
 *   EXTERNAL_API,
 *   async (httpService: HttpService, config: ConfigService) => {
 *     const apiUrl = config.get('API_URL');
 *     // Initialize connection
 *     await httpService.get(`${apiUrl}/health`);
 *     return new ExternalApiClient(httpService, apiUrl);
 *   },
 *   [HttpService, ConfigService]
 * );
 * ```
 */
export declare function createAsyncFactoryProvider<T>(token: string | symbol, asyncFactory: (...deps: any[]) => Promise<T>, inject?: any[]): FactoryProvider<Promise<T>>;
/**
 * Creates a value provider for constant values or pre-configured objects.
 *
 * @template T - The type of the provided value
 * @param {string | symbol} token - The injection token
 * @param {T} value - The value to provide
 * @returns {ValueProvider<T>} Value provider configuration
 *
 * @example
 * ```typescript
 * const RATE_LIMIT_CONFIG = 'RATE_LIMIT_CONFIG';
 * const rateLimitProvider = createValueProvider(RATE_LIMIT_CONFIG, {
 *   ttl: 60,
 *   limit: 100,
 *   blockDuration: 300
 * });
 * ```
 */
export declare function createValueProvider<T>(token: string | symbol, value: T): ValueProvider<T>;
/**
 * Creates a class provider with optional custom token.
 *
 * @template T - The class type
 * @param {Type<T>} classType - The class to provide
 * @param {string | symbol} [token] - Optional custom injection token (defaults to classType)
 * @returns {ClassProvider} Class provider configuration
 *
 * @example
 * ```typescript
 * const customProvider = createClassProvider(
 *   CustomEmailService,
 *   'EMAIL_SERVICE'
 * );
 * // Now can inject as @Inject('EMAIL_SERVICE')
 * ```
 */
export declare function createClassProvider<T>(classType: Type<T>, token?: string | symbol): ClassProvider;
/**
 * Creates an alias provider that maps one token to another existing provider.
 *
 * @param {string | symbol} aliasToken - The new token to create
 * @param {string | symbol | Type<any>} existingToken - The existing provider token to alias
 * @returns {ExistingProvider} Existing/alias provider configuration
 *
 * @example
 * ```typescript
 * const aliasProvider = createAliasProvider(
 *   'LOGGER',
 *   LoggerService
 * );
 * // Both @Inject('LOGGER') and @Inject(LoggerService) work
 * ```
 */
export declare function createAliasProvider(aliasToken: string | symbol, existingToken: string | symbol | Type<any>): ExistingProvider;
/**
 * Creates a scoped factory provider (REQUEST or TRANSIENT scope).
 *
 * @template T - The factory return type
 * @param {string | symbol} token - The injection token
 * @param {(...deps: any[]) => T | Promise<T>} factory - Factory function
 * @param {Scope} scope - The provider scope (REQUEST or TRANSIENT)
 * @param {any[]} inject - Dependencies to inject
 * @returns {FactoryProvider<T> & { scope: Scope }} Scoped factory provider
 *
 * @example
 * ```typescript
 * const REQUEST_ID = 'REQUEST_ID';
 * const requestIdProvider = createScopedFactoryProvider(
 *   REQUEST_ID,
 *   () => crypto.randomUUID(),
 *   Scope.REQUEST,
 *   []
 * );
 * ```
 */
export declare function createScopedFactoryProvider<T>(token: string | symbol, factory: (...deps: any[]) => T | Promise<T>, scope: Scope, inject?: any[]): FactoryProvider<T> & {
    scope: Scope;
};
/**
 * Creates multiple providers for the same token (multi-provider pattern).
 *
 * @template T - The provider value type
 * @param {string | symbol} token - The shared injection token
 * @param {T[]} values - Array of values to provide
 * @returns {Provider[]} Array of multi-providers
 *
 * @example
 * ```typescript
 * const VALIDATORS = 'VALIDATORS';
 * const validators = createMultiProvider(VALIDATORS, [
 *   EmailValidator,
 *   PhoneValidator,
 *   SSNValidator
 * ]);
 * // Inject as @Inject(VALIDATORS) validators: Validator[]
 * ```
 */
export declare function createMultiProvider<T>(token: string | symbol, values: T[]): Provider[];
/**
 * Creates a conditional provider that uses different implementations based on environment.
 *
 * @template T - The provider type
 * @param {string | symbol} token - The injection token
 * @param {Type<T>} productionClass - Class for production environment
 * @param {Type<T>} developmentClass - Class for development environment
 * @param {string} [env] - Current environment (defaults to process.env.NODE_ENV)
 * @returns {ClassProvider} Conditional class provider
 *
 * @example
 * ```typescript
 * const emailProvider = createConditionalProvider(
 *   'EMAIL_SERVICE',
 *   SendGridEmailService,
 *   MockEmailService,
 *   process.env.NODE_ENV
 * );
 * ```
 */
export declare function createConditionalProvider<T>(token: string | symbol, productionClass: Type<T>, developmentClass: Type<T>, env?: string): ClassProvider;
/**
 * Creates a custom injection decorator with a specific token.
 *
 * @param {string | symbol} token - The injection token
 * @returns {ParameterDecorator} Custom inject decorator
 *
 * @example
 * ```typescript
 * const InjectDatabase = createInjectDecorator('DATABASE_CONNECTION');
 * class UserService {
 *   constructor(@InjectDatabase() private db: Database) {}
 * }
 * ```
 */
export declare function createInjectDecorator(token: string | symbol): ParameterDecorator;
/**
 * Creates an optional injection decorator that returns undefined if provider not found.
 *
 * @param {string | symbol} token - The injection token
 * @returns {ParameterDecorator} Optional inject decorator
 *
 * @example
 * ```typescript
 * const InjectOptionalCache = createOptionalInjectDecorator('CACHE_SERVICE');
 * class DataService {
 *   constructor(
 *     @InjectOptionalCache() private cache?: CacheService
 *   ) {}
 *
 *   async getData(key: string) {
 *     if (this.cache) return this.cache.get(key);
 *     return this.fetchFromDB(key);
 *   }
 * }
 * ```
 */
export declare function createOptionalInjectDecorator(token: string | symbol): ParameterDecorator;
/**
 * Retrieves a provider instance from module context programmatically.
 *
 * @template T - The provider type
 * @param {ModuleRef} moduleRef - NestJS module reference
 * @param {Type<T> | string | symbol} token - Provider token or class
 * @param {object} [options] - Retrieval options
 * @returns {Promise<T>} Provider instance
 *
 * @example
 * ```typescript
 * @Injectable()
 * class DynamicService {
 *   constructor(private moduleRef: ModuleRef) {}
 *
 *   async performAction() {
 *     const logger = await getProviderInstance(
 *       this.moduleRef,
 *       LoggerService,
 *       { strict: false }
 *     );
 *     logger.log('Action performed');
 *   }
 * }
 * ```
 */
export declare function getProviderInstance<T>(moduleRef: ModuleRef, token: Type<T> | string | symbol, options?: {
    strict?: boolean;
}): Promise<T>;
/**
 * Creates a provider that lazily resolves another provider on first access.
 *
 * @template T - The lazy provider type
 * @param {string | symbol} token - The injection token
 * @param {Type<T> | string | symbol} lazyToken - Token of provider to lazy-load
 * @returns {FactoryProvider} Lazy provider factory
 *
 * @example
 * ```typescript
 * const lazyAnalytics = createLazyProvider(
 *   'ANALYTICS',
 *   AnalyticsService
 * );
 * // AnalyticsService only instantiated when first injected
 * ```
 */
export declare function createLazyProvider<T>(token: string | symbol, lazyToken: Type<T> | string | symbol): FactoryProvider;
/**
 * Creates a composite provider that aggregates multiple services.
 *
 * @template T - The composite service type
 * @param {string | symbol} token - The injection token
 * @param {Type<any>[]} serviceTokens - Array of service classes to compose
 * @param {(services: any[]) => T} composer - Function to compose services
 * @returns {FactoryProvider<T>} Composite provider
 *
 * @example
 * ```typescript
 * const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';
 * const notificationProvider = createCompositeProvider(
 *   NOTIFICATION_SERVICE,
 *   [EmailService, SMSService, PushNotificationService],
 *   (services) => new NotificationAggregator(services)
 * );
 * ```
 */
export declare function createCompositeProvider<T>(token: string | symbol, serviceTokens: (Type<any> | string | symbol)[], composer: (services: any[]) => T): FactoryProvider<T>;
/**
 * Wraps a service with a decorator/proxy pattern.
 *
 * @template T - The service type
 * @param {Type<T>} serviceClass - Service class to wrap
 * @param {(service: T) => Partial<T>} decorator - Decorator function
 * @returns {FactoryProvider} Decorated service provider
 *
 * @example
 * ```typescript
 * const cachedUserService = wrapServiceWithDecorator(
 *   UserService,
 *   (userService) => ({
 *     async findById(id: string) {
 *       // Add caching logic
 *       const cached = await cache.get(id);
 *       if (cached) return cached;
 *       return userService.findById(id);
 *     }
 *   })
 * );
 * ```
 */
export declare function wrapServiceWithDecorator<T extends object>(serviceClass: Type<T>, decorator: (service: T) => Partial<T>): FactoryProvider;
/**
 * Creates a provider chain where services depend on each other sequentially.
 *
 * @param {Provider[]} providers - Array of providers in dependency order
 * @returns {Provider[]} Chained providers
 *
 * @example
 * ```typescript
 * const chain = createProviderChain([
 *   { provide: 'CONFIG', useValue: config },
 *   { provide: 'DATABASE', useFactory: (cfg) => new DB(cfg), inject: ['CONFIG'] },
 *   { provide: 'REPO', useFactory: (db) => new Repo(db), inject: ['DATABASE'] }
 * ]);
 * ```
 */
export declare function createProviderChain(providers: Provider[]): Provider[];
/**
 * Creates an async provider with retry logic for initialization.
 *
 * @template T - The provider type
 * @param {string | symbol} token - The injection token
 * @param {() => Promise<T>} asyncFactory - Async factory with no dependencies
 * @param {object} options - Retry configuration
 * @returns {FactoryProvider<Promise<T>>} Async provider with retry
 *
 * @example
 * ```typescript
 * const DB_CONNECTION = 'DB_CONNECTION';
 * const dbProvider = createAsyncProviderWithRetry(
 *   DB_CONNECTION,
 *   async () => {
 *     const db = new Database();
 *     await db.connect();
 *     return db;
 *   },
 *   { maxRetries: 3, retryDelay: 1000 }
 * );
 * ```
 */
export declare function createAsyncProviderWithRetry<T>(token: string | symbol, asyncFactory: () => Promise<T>, options?: {
    maxRetries?: number;
    retryDelay?: number;
}): FactoryProvider<Promise<T>>;
/**
 * Creates an async provider with timeout protection.
 *
 * @template T - The provider type
 * @param {string | symbol} token - The injection token
 * @param {() => Promise<T>} asyncFactory - Async factory function
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {FactoryProvider<Promise<T>>} Async provider with timeout
 *
 * @example
 * ```typescript
 * const EXTERNAL_API = 'EXTERNAL_API';
 * const apiProvider = createAsyncProviderWithTimeout(
 *   EXTERNAL_API,
 *   async () => {
 *     const api = new ExternalAPI();
 *     await api.authenticate();
 *     return api;
 *   },
 *   5000 // 5 second timeout
 * );
 * ```
 */
export declare function createAsyncProviderWithTimeout<T>(token: string | symbol, asyncFactory: () => Promise<T>, timeoutMs: number): FactoryProvider<Promise<T>>;
/**
 * Creates an async provider that validates the result before providing.
 *
 * @template T - The provider type
 * @param {string | symbol} token - The injection token
 * @param {() => Promise<T>} asyncFactory - Async factory function
 * @param {(value: T) => boolean | Promise<boolean>} validator - Validation function
 * @returns {FactoryProvider<Promise<T>>} Validated async provider
 *
 * @example
 * ```typescript
 * const CONFIG_SERVICE = 'CONFIG_SERVICE';
 * const configProvider = createValidatedAsyncProvider(
 *   CONFIG_SERVICE,
 *   async () => loadConfig(),
 *   (config) => config.apiKey && config.apiUrl
 * );
 * ```
 */
export declare function createValidatedAsyncProvider<T>(token: string | symbol, asyncFactory: () => Promise<T>, validator: (value: T) => boolean | Promise<boolean>): FactoryProvider<Promise<T>>;
/**
 * Creates a dynamic module with configurable providers.
 *
 * @template TOptions - Configuration options type
 * @param {object} config - Dynamic module configuration
 * @returns {DynamicModule} Configured dynamic module
 *
 * @example
 * ```typescript
 * interface CacheOptions {
 *   ttl: number;
 *   max: number;
 * }
 *
 * const CacheModule = createDynamicModule({
 *   name: 'CacheModule',
 *   providers: (options: CacheOptions) => [
 *     { provide: 'CACHE_OPTIONS', useValue: options },
 *     CacheService
 *   ],
 *   exports: [CacheService]
 * });
 * ```
 */
export declare function createDynamicModule<TOptions = any>(config: {
    name: string;
    providers?: (options: TOptions) => Provider[];
    imports?: any[];
    exports?: any[];
}): (options: TOptions) => DynamicModule;
/**
 * Creates a forRoot() static method for a module (singleton configuration).
 *
 * @template TModule - The module class type
 * @template TOptions - Configuration options type
 * @param {Type<TModule>} moduleClass - Module class
 * @param {(options: TOptions) => Provider[]} providerFactory - Provider factory
 * @returns {(options: TOptions) => DynamicModule} forRoot method
 *
 * @example
 * ```typescript
 * @Module({})
 * class DatabaseModule {
 *   static forRoot = createForRootMethod(
 *     DatabaseModule,
 *     (options: DatabaseOptions) => [
 *       { provide: 'DB_OPTIONS', useValue: options },
 *       DatabaseService
 *     ]
 *   );
 * }
 * ```
 */
export declare function createForRootMethod<TModule, TOptions>(moduleClass: Type<TModule>, providerFactory: (options: TOptions) => Provider[]): (options: TOptions) => DynamicModule;
/**
 * Creates a forFeature() static method for a module (feature-specific configuration).
 *
 * @template TModule - The module class type
 * @template TFeatures - Feature configuration type
 * @param {Type<TModule>} moduleClass - Module class
 * @param {(features: TFeatures) => Provider[]} providerFactory - Provider factory
 * @returns {(features: TFeatures) => DynamicModule} forFeature method
 *
 * @example
 * ```typescript
 * @Module({})
 * class RepositoryModule {
 *   static forFeature = createForFeatureMethod(
 *     RepositoryModule,
 *     (entities: Type<any>[]) => entities.map(entity => ({
 *       provide: getRepositoryToken(entity),
 *       useClass: getRepositoryClass(entity)
 *     }))
 *   );
 * }
 * ```
 */
export declare function createForFeatureMethod<TModule, TFeatures>(moduleClass: Type<TModule>, providerFactory: (features: TFeatures) => Provider[]): (features: TFeatures) => DynamicModule;
/**
 * Creates a global dynamic module.
 *
 * @param {DynamicModule} dynamicModule - Dynamic module configuration
 * @returns {DynamicModule} Global dynamic module
 *
 * @example
 * ```typescript
 * const globalConfig = makeGlobalModule({
 *   module: ConfigModule,
 *   providers: [ConfigService],
 *   exports: [ConfigService]
 * });
 * ```
 */
export declare function makeGlobalModule(dynamicModule: DynamicModule): DynamicModule;
/**
 * Creates a request-scoped provider with automatic cleanup.
 *
 * @template T - The provider type
 * @param {string | symbol} token - The injection token
 * @param {Type<T>} classType - Service class
 * @param {(instance: T) => void | Promise<void>} [onDestroy] - Cleanup callback
 * @returns {ClassProvider & { scope: Scope }} Request-scoped provider
 *
 * @example
 * ```typescript
 * const REQUEST_CONTEXT = 'REQUEST_CONTEXT';
 * const contextProvider = createRequestScopedProvider(
 *   REQUEST_CONTEXT,
 *   RequestContextService,
 *   async (ctx) => await ctx.cleanup()
 * );
 * ```
 */
export declare function createRequestScopedProvider<T extends object>(token: string | symbol, classType: Type<T>, onDestroy?: (instance: T) => void | Promise<void>): ClassProvider & {
    scope: Scope;
};
/**
 * Creates a transient provider (new instance per injection).
 *
 * @template T - The provider type
 * @param {Type<T>} classType - Service class
 * @returns {ClassProvider & { scope: Scope }} Transient provider
 *
 * @example
 * ```typescript
 * const taskProcessor = createTransientProvider(TaskProcessorService);
 * // Each injection gets a new instance
 * ```
 */
export declare function createTransientProvider<T>(classType: Type<T>): ClassProvider & {
    scope: Scope;
};
/**
 * Converts a default-scoped provider to request-scoped.
 *
 * @param {Provider} provider - Original provider
 * @returns {Provider & { scope: Scope }} Request-scoped version
 *
 * @example
 * ```typescript
 * const originalProvider = { provide: UserService, useClass: UserService };
 * const scopedProvider = toRequestScope(originalProvider);
 * ```
 */
export declare function toRequestScope(provider: Provider): Provider & {
    scope: Scope;
};
/**
 * Creates a provider that switches scope based on environment.
 *
 * @param {Provider} provider - Base provider
 * @param {object} options - Scope configuration
 * @returns {Provider} Environmentally-scoped provider
 *
 * @example
 * ```typescript
 * const userProvider = createEnvironmentScopedProvider(
 *   { provide: UserService, useClass: UserService },
 *   { production: Scope.DEFAULT, development: Scope.TRANSIENT }
 * );
 * ```
 */
export declare function createEnvironmentScopedProvider(provider: Provider, options: {
    production?: Scope;
    development?: Scope;
    test?: Scope;
}): Provider;
/**
 * Creates a unique injection token with namespace.
 *
 * @param {string} namespace - Token namespace
 * @param {string} name - Token name
 * @returns {string} Namespaced token
 *
 * @example
 * ```typescript
 * const PATIENT_REPO = createInjectionToken('healthcare', 'PatientRepository');
 * // Result: 'healthcare:PatientRepository'
 * ```
 */
export declare function createInjectionToken(namespace: string, name: string): string;
/**
 * Creates a typed symbol token for unique identification.
 *
 * @param {string} description - Token description
 * @returns {symbol} Unique symbol token
 *
 * @example
 * ```typescript
 * const CACHE_SERVICE = createSymbolToken('CacheService');
 * const provider = { provide: CACHE_SERVICE, useClass: RedisCacheService };
 * ```
 */
export declare function createSymbolToken(description: string): symbol;
/**
 * Extracts the token from a provider configuration.
 *
 * @param {Provider} provider - Provider to extract token from
 * @returns {string | symbol | Type<any>} Extracted token
 *
 * @example
 * ```typescript
 * const provider = { provide: 'MY_TOKEN', useValue: 'value' };
 * const token = getProviderToken(provider); // 'MY_TOKEN'
 * ```
 */
export declare function getProviderToken(provider: Provider): string | symbol | Type<any>;
/**
 * Checks if a token is a symbol token.
 *
 * @param {any} token - Token to check
 * @returns {boolean} True if token is a symbol
 *
 * @example
 * ```typescript
 * const symbolToken = Symbol.for('TEST');
 * const stringToken = 'TEST';
 * isSymbolToken(symbolToken); // true
 * isSymbolToken(stringToken); // false
 * ```
 */
export declare function isSymbolToken(token: any): token is symbol;
/**
 * Creates a multi-provider with factory functions.
 *
 * @template T - The provider type
 * @param {string | symbol} token - Shared injection token
 * @param {Array<() => T>} factories - Array of factory functions
 * @returns {Provider[]} Multi-provider array
 *
 * @example
 * ```typescript
 * const HEALTH_CHECKS = 'HEALTH_CHECKS';
 * const healthCheckProviders = createMultiProviderWithFactories(
 *   HEALTH_CHECKS,
 *   [
 *     () => new DatabaseHealthCheck(),
 *     () => new RedisHealthCheck(),
 *     () => new APIHealthCheck()
 *   ]
 * );
 * ```
 */
export declare function createMultiProviderWithFactories<T>(token: string | symbol, factories: Array<() => T>): Provider[];
/**
 * Aggregates multiple providers into a single provider array.
 *
 * @param {Provider[]} providers - Array of providers to aggregate
 * @returns {Provider[]} Aggregated provider array
 *
 * @example
 * ```typescript
 * const allProviders = aggregateProviders([
 *   ...databaseProviders,
 *   ...cacheProviders,
 *   ...authProviders
 * ]);
 * ```
 */
export declare function aggregateProviders(providers: Provider[]): Provider[];
/**
 * Creates a provider with optional dependency fallback.
 *
 * @template T - The provider type
 * @param {string | symbol} token - The injection token
 * @param {Type<T>} classType - Service class
 * @param {string | symbol} optionalDep - Optional dependency token
 * @param {any} fallbackValue - Fallback value if dependency not available
 * @returns {FactoryProvider} Provider with optional dependency
 *
 * @example
 * ```typescript
 * const userServiceProvider = createProviderWithOptionalDependency(
 *   'USER_SERVICE',
 *   UserService,
 *   'CACHE_SERVICE',
 *   null
 * );
 * // UserService will work with or without cache
 * ```
 */
export declare function createProviderWithOptionalDependency<T>(token: string | symbol, classType: Type<T>, optionalDep: string | symbol, fallbackValue: any): FactoryProvider;
/**
 * Creates a safe provider that catches initialization errors.
 *
 * @template T - The provider type
 * @param {string | symbol} token - The injection token
 * @param {() => T | Promise<T>} factory - Factory function
 * @param {T} fallback - Fallback value on error
 * @returns {FactoryProvider} Safe provider with error handling
 *
 * @example
 * ```typescript
 * const analyticsProvider = createSafeProvider(
 *   'ANALYTICS',
 *   async () => {
 *     const analytics = new AnalyticsService();
 *     await analytics.connect();
 *     return analytics;
 *   },
 *   new NoOpAnalyticsService()
 * );
 * ```
 */
export declare function createSafeProvider<T>(token: string | symbol, factory: () => T | Promise<T>, fallback: T): FactoryProvider;
/**
 * Creates a forward reference to break circular dependencies.
 *
 * @template T - The referenced type
 * @param {() => Type<T>} forwardRef - Function returning the referenced class
 * @returns {ForwardReference<T>} Forward reference
 *
 * @example
 * ```typescript
 * @Injectable()
 * class UserService {
 *   constructor(
 *     @Inject(createForwardRef(() => PostService))
 *     private postService: PostService
 *   ) {}
 * }
 * ```
 */
export declare function createForwardRef<T>(forwardRef: () => Type<T>): ForwardReference<T>;
/**
 * Creates a provider that resolves circular dependency via ModuleRef.
 *
 * @template T - The service type
 * @param {string | symbol} token - The injection token
 * @param {Type<T> | string | symbol} circularDepToken - Circular dependency token
 * @returns {FactoryProvider} Provider that resolves circular dependency
 *
 * @example
 * ```typescript
 * const userProvider = createCircularDependencyResolver(
 *   UserService,
 *   PostService
 * );
 * ```
 */
export declare function createCircularDependencyResolver<T>(token: string | symbol | Type<T>, circularDepToken: Type<any> | string | symbol): FactoryProvider;
/**
 * Wraps a provider to delay circular dependency resolution.
 *
 * @template T - The provider type
 * @param {Type<T>} classType - Service class with circular dependency
 * @param {string} propertyKey - Property name of circular dependency
 * @returns {ClassProvider} Provider with delayed resolution
 *
 * @example
 * ```typescript
 * @Injectable()
 * class UserService {
 *   postService: PostService; // Injected later
 * }
 *
 * const userProvider = createDelayedCircularProvider(
 *   UserService,
 *   'postService'
 * );
 * ```
 */
export declare function createDelayedCircularProvider<T extends object>(classType: Type<T>, propertyKey: string): ClassProvider;
declare const _default: {
    createFactoryProvider: typeof createFactoryProvider;
    createAsyncFactoryProvider: typeof createAsyncFactoryProvider;
    createValueProvider: typeof createValueProvider;
    createClassProvider: typeof createClassProvider;
    createAliasProvider: typeof createAliasProvider;
    createScopedFactoryProvider: typeof createScopedFactoryProvider;
    createMultiProvider: typeof createMultiProvider;
    createConditionalProvider: typeof createConditionalProvider;
    createInjectDecorator: typeof createInjectDecorator;
    createOptionalInjectDecorator: typeof createOptionalInjectDecorator;
    getProviderInstance: typeof getProviderInstance;
    createLazyProvider: typeof createLazyProvider;
    createCompositeProvider: typeof createCompositeProvider;
    wrapServiceWithDecorator: typeof wrapServiceWithDecorator;
    createProviderChain: typeof createProviderChain;
    createAsyncProviderWithRetry: typeof createAsyncProviderWithRetry;
    createAsyncProviderWithTimeout: typeof createAsyncProviderWithTimeout;
    createValidatedAsyncProvider: typeof createValidatedAsyncProvider;
    createDynamicModule: typeof createDynamicModule;
    createForRootMethod: typeof createForRootMethod;
    createForFeatureMethod: typeof createForFeatureMethod;
    makeGlobalModule: typeof makeGlobalModule;
    createRequestScopedProvider: typeof createRequestScopedProvider;
    createTransientProvider: typeof createTransientProvider;
    toRequestScope: typeof toRequestScope;
    createEnvironmentScopedProvider: typeof createEnvironmentScopedProvider;
    createInjectionToken: typeof createInjectionToken;
    createSymbolToken: typeof createSymbolToken;
    getProviderToken: typeof getProviderToken;
    isSymbolToken: typeof isSymbolToken;
    createMultiProviderWithFactories: typeof createMultiProviderWithFactories;
    aggregateProviders: typeof aggregateProviders;
    createProviderWithOptionalDependency: typeof createProviderWithOptionalDependency;
    createSafeProvider: typeof createSafeProvider;
    createForwardRef: typeof createForwardRef;
    createCircularDependencyResolver: typeof createCircularDependencyResolver;
    createDelayedCircularProvider: typeof createDelayedCircularProvider;
};
export default _default;
//# sourceMappingURL=nest-providers-utils.d.ts.map