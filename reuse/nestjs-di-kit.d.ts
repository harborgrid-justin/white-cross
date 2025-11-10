/**
 * LOC: NEST-DI-001
 * File: /reuse/nestjs-di-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/core
 *
 * DOWNSTREAM (imported by):
 *   - Backend modules
 *   - Custom provider implementations
 *   - Dynamic module factories
 */
/**
 * File: /reuse/nestjs-di-kit.ts
 * Locator: WC-UTL-NESTDI-001
 * Purpose: NestJS Dependency Injection - Comprehensive DI utilities and provider helpers
 *
 * Upstream: @nestjs/common, @nestjs/core
 * Downstream: ../backend/*, module configurations, provider factories
 * Dependencies: NestJS 10.x, TypeScript 5.x, Reflect-metadata
 * Exports: 45 utility functions for DI patterns, custom providers, dynamic modules, injection tokens
 *
 * LLM Context: Comprehensive NestJS dependency injection utilities for White Cross healthcare system.
 * Provides injection token generators, custom provider factories, dynamic module builders,
 * circular dependency resolvers, optional dependency handlers, multi-provider patterns, and
 * scope management. Essential for maintainable and testable application architecture.
 */
interface ProviderConfig<T = unknown> {
    provide: string | symbol | Function;
    useClass?: new (...args: unknown[]) => T;
    useValue?: T;
    useFactory?: (...args: unknown[]) => T | Promise<T>;
    useExisting?: string | symbol | Function;
    inject?: Array<string | symbol | Function>;
    scope?: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
}
interface DynamicModuleConfig {
    module: Function;
    providers?: Array<ProviderConfig | Function>;
    imports?: Array<Function | DynamicModuleConfig>;
    exports?: Array<string | symbol | Function>;
    controllers?: Function[];
    global?: boolean;
}
interface ModuleOptions {
    isGlobal?: boolean;
    providers?: Array<ProviderConfig | Function>;
    imports?: Array<Function | DynamicModuleConfig>;
    exports?: Array<string | symbol | Function>;
    controllers?: Function[];
}
interface OptionalDependencyConfig<T = unknown> {
    token: string | symbol;
    defaultValue?: T;
    required?: boolean;
}
interface MultiProviderConfig<T = unknown> {
    provide: string | symbol;
    useClass?: new (...args: unknown[]) => T;
    useValue?: T;
    useFactory?: (...args: unknown[]) => T | Promise<T>;
    multi?: boolean;
    inject?: Array<string | symbol | Function>;
}
interface ScopedProviderConfig<T = unknown> {
    provide: string | symbol;
    scope: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
    useClass?: new (...args: unknown[]) => T;
    useFactory?: (...args: unknown[]) => T | Promise<T>;
}
/**
 * Creates a unique injection token with optional namespace.
 *
 * @param {string} name - Token name
 * @param {string} [namespace] - Optional namespace for organization
 * @returns {symbol} Unique injection token
 *
 * @example
 * ```typescript
 * const DB_CONNECTION = createInjectionToken('DATABASE_CONNECTION', 'database');
 * const CACHE_SERVICE = createInjectionToken('CACHE_SERVICE', 'cache');
 * ```
 */
export declare const createInjectionToken: (name: string, namespace?: string) => symbol;
/**
 * Creates a string-based injection token for external configuration.
 *
 * @param {string} name - Token name
 * @returns {string} String injection token
 *
 * @example
 * ```typescript
 * const API_KEY = createStringToken('API_KEY');
 * const DB_HOST = createStringToken('DATABASE_HOST');
 * ```
 */
export declare const createStringToken: (name: string) => string;
/**
 * Creates a typed injection token for better type safety.
 *
 * @param {string} name - Token name
 * @returns {Object} Typed token with metadata
 *
 * @example
 * ```typescript
 * const LOGGER_TOKEN = createTypedToken<Logger>('LOGGER');
 * @Inject(LOGGER_TOKEN.token) private logger: Logger
 * ```
 */
export declare const createTypedToken: <T>(name: string) => {
    token: symbol;
    type: T;
};
/**
 * Creates a namespaced token family for related services.
 *
 * @param {string} namespace - Namespace for token family
 * @param {string[]} names - Array of token names
 * @returns {Record<string, symbol>} Map of token names to symbols
 *
 * @example
 * ```typescript
 * const DATABASE_TOKENS = createTokenFamily('database', [
 *   'CONNECTION',
 *   'TRANSACTION_MANAGER',
 *   'QUERY_RUNNER'
 * ]);
 * // DATABASE_TOKENS.CONNECTION, DATABASE_TOKENS.TRANSACTION_MANAGER
 * ```
 */
export declare const createTokenFamily: (namespace: string, names: string[]) => Record<string, symbol>;
/**
 * Generates a unique token for each request in request-scoped providers.
 *
 * @param {string} baseName - Base token name
 * @returns {Function} Token generator function
 *
 * @example
 * ```typescript
 * const getRequestToken = createRequestToken('REQUEST_CONTEXT');
 * const token = getRequestToken(); // Unique per request
 * ```
 */
export declare const createRequestToken: (baseName: string) => (() => symbol);
/**
 * Creates a class provider with optional scope configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} useClass - Class to instantiate
 * @param {string} [scope='DEFAULT'] - Provider scope
 * @returns {ProviderConfig} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createClassProvider(
 *   'LOGGER',
 *   WinstonLogger,
 *   'TRANSIENT'
 * );
 * ```
 */
export declare const createClassProvider: <T>(token: string | symbol, useClass: new (...args: unknown[]) => T, scope?: "DEFAULT" | "REQUEST" | "TRANSIENT") => ProviderConfig<T>;
/**
 * Creates a value provider for constants and configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {T} value - Value to provide
 * @returns {ProviderConfig} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createValueProvider('API_VERSION', 'v2');
 * const dbConfig = createValueProvider('DB_CONFIG', {
 *   host: 'localhost',
 *   port: 5432
 * });
 * ```
 */
export declare const createValueProvider: <T>(token: string | symbol, value: T) => ProviderConfig<T>;
/**
 * Creates a factory provider with dependency injection.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {any[]} [inject] - Dependencies to inject
 * @param {string} [scope='DEFAULT'] - Provider scope
 * @returns {ProviderConfig} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createFactoryProvider(
 *   'DATABASE',
 *   (config) => new Database(config.get('db')),
 *   [ConfigService]
 * );
 * ```
 */
export declare const createFactoryProvider: (token: string | symbol, factory: (...args: any[]) => any, inject?: any[], scope?: "DEFAULT" | "REQUEST" | "TRANSIENT") => ProviderConfig;
/**
 * Creates an alias provider to reuse existing providers.
 *
 * @param {string | symbol} token - New token
 * @param {string | symbol} existingToken - Existing provider token
 * @returns {ProviderConfig} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createAliasProvider(
 *   'LEGACY_LOGGER',
 *   'LOGGER'
 * );
 * // Both tokens will inject the same instance
 * ```
 */
export declare const createAliasProvider: (token: string | symbol, existingToken: string | symbol) => ProviderConfig;
/**
 * Creates an async factory provider for asynchronous initialization.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} asyncFactory - Async factory function
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {ProviderConfig} Async provider configuration
 *
 * @example
 * ```typescript
 * const provider = createAsyncFactoryProvider(
 *   'DATABASE',
 *   async (config) => {
 *     const db = new Database();
 *     await db.connect(config.get('db'));
 *     return db;
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export declare const createAsyncFactoryProvider: (token: string | symbol, asyncFactory: (...args: any[]) => Promise<any>, inject?: any[]) => ProviderConfig;
/**
 * Creates a conditional provider based on environment or configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {Function} condition - Condition function
 * @param {any} [fallback] - Fallback value if condition fails
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {ProviderConfig} Conditional provider configuration
 *
 * @example
 * ```typescript
 * const provider = createConditionalProvider(
 *   'CACHE',
 *   (config) => new RedisCache(config),
 *   (config) => config.get('env') === 'production',
 *   new MemoryCache(),
 *   [ConfigService]
 * );
 * ```
 */
export declare const createConditionalProvider: (token: string | symbol, factory: (...args: any[]) => any, condition: (...args: any[]) => boolean, fallback?: any, inject?: any[]) => ProviderConfig;
/**
 * Creates a multi-provider for collections of services.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to add to collection
 * @returns {MultiProviderConfig} Multi-provider configuration
 *
 * @example
 * ```typescript
 * const validators = [
 *   createMultiProvider('VALIDATORS', EmailValidator),
 *   createMultiProvider('VALIDATORS', PhoneValidator),
 *   createMultiProvider('VALIDATORS', AgeValidator)
 * ];
 * // @Inject('VALIDATORS') validators: Validator[]
 * ```
 */
export declare const createMultiProvider: (token: string | symbol, useClass: any) => MultiProviderConfig;
/**
 * Creates a multi-value provider for constants collection.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} value - Value to add to collection
 * @returns {MultiProviderConfig} Multi-provider configuration
 *
 * @example
 * ```typescript
 * const plugins = [
 *   createMultiValueProvider('PLUGINS', loggingPlugin),
 *   createMultiValueProvider('PLUGINS', metricsPlugin),
 *   createMultiValueProvider('PLUGINS', tracingPlugin)
 * ];
 * ```
 */
export declare const createMultiValueProvider: (token: string | symbol, value: any) => MultiProviderConfig;
/**
 * Creates a multi-factory provider for dynamic collections.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {MultiProviderConfig} Multi-provider configuration
 *
 * @example
 * ```typescript
 * const handlers = [
 *   createMultiFactoryProvider('HANDLERS', () => new HttpHandler()),
 *   createMultiFactoryProvider('HANDLERS', () => new WsHandler())
 * ];
 * ```
 */
export declare const createMultiFactoryProvider: (token: string | symbol, factory: (...args: any[]) => any, inject?: any[]) => MultiProviderConfig;
/**
 * Aggregates multiple providers into a collection provider.
 *
 * @param {string | symbol} collectionToken - Token for the collection
 * @param {any[]} providers - Individual provider classes
 * @returns {MultiProviderConfig[]} Array of multi-provider configurations
 *
 * @example
 * ```typescript
 * const guardProviders = aggregateProviders('GUARDS', [
 *   AuthGuard,
 *   RoleGuard,
 *   ThrottleGuard
 * ]);
 * ```
 */
export declare const aggregateProviders: (collectionToken: string | symbol, providers: any[]) => MultiProviderConfig[];
/**
 * Creates a dynamic module with configuration support.
 *
 * @param {any} module - Module class
 * @param {Object} options - Module options
 * @returns {DynamicModuleConfig} Dynamic module configuration
 *
 * @example
 * ```typescript
 * const dynamicModule = createDynamicModule(DatabaseModule, {
 *   providers: [DatabaseService],
 *   exports: [DatabaseService],
 *   isGlobal: true
 * });
 * ```
 */
export declare const createDynamicModule: (module: any, options?: ModuleOptions) => DynamicModuleConfig;
/**
 * Creates a module builder with fluent API.
 *
 * @param {any} moduleClass - Module class
 * @returns {Object} Module builder
 *
 * @example
 * ```typescript
 * const module = createModuleBuilder(AppModule)
 *   .withProviders([ServiceA, ServiceB])
 *   .withExports([ServiceA])
 *   .asGlobal()
 *   .build();
 * ```
 */
export declare const createModuleBuilder: (moduleClass: any) => {
    withProviders(providers: any[]): /*elided*/ any;
    withImports(imports: any[]): /*elided*/ any;
    withExports(exports: any[]): /*elided*/ any;
    withControllers(controllers: any[]): /*elided*/ any;
    asGlobal(): /*elided*/ any;
    build(): DynamicModuleConfig;
};
/**
 * Creates a configurable dynamic module with async configuration.
 *
 * @param {any} moduleClass - Module class
 * @param {Function} configFactory - Async configuration factory
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {DynamicModuleConfig} Dynamic module with async config
 *
 * @example
 * ```typescript
 * const module = createConfigurableDynamicModule(
 *   DatabaseModule,
 *   async (config) => ({
 *     host: config.get('db.host'),
 *     port: config.get('db.port')
 *   }),
 *   [ConfigService]
 * );
 * ```
 */
export declare const createConfigurableDynamicModule: (moduleClass: any, configFactory: (...args: any[]) => Promise<any>, inject?: any[]) => DynamicModuleConfig;
/**
 * Creates a feature module factory for lazy loading.
 *
 * @param {string} featureName - Feature name
 * @param {Function} moduleFactory - Module factory function
 * @returns {Function} Feature module loader
 *
 * @example
 * ```typescript
 * const loadUserModule = createFeatureModule(
 *   'users',
 *   () => import('./users/users.module').then(m => m.UsersModule)
 * );
 * ```
 */
export declare const createFeatureModule: (featureName: string, moduleFactory: () => Promise<any>) => () => Promise<DynamicModuleConfig>;
/**
 * Creates a module with optional imports based on configuration.
 *
 * @param {any} moduleClass - Module class
 * @param {any[]} baseImports - Always imported modules
 * @param {Function} conditionalImports - Function returning conditional imports
 * @returns {DynamicModuleConfig} Module with conditional imports
 *
 * @example
 * ```typescript
 * const module = createConditionalModule(
 *   AppModule,
 *   [CoreModule, CommonModule],
 *   (config) => config.get('enableAuth') ? [AuthModule] : []
 * );
 * ```
 */
export declare const createConditionalModule: (moduleClass: any, baseImports: any[], conditionalImports: (...args: any[]) => any[]) => DynamicModuleConfig;
/**
 * Creates a forward reference for circular dependencies.
 *
 * @param {Function} typeFactory - Function returning the type
 * @returns {Object} Forward reference object
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
export declare const createForwardRef: (typeFactory: () => any) => {
    forwardRef: () => any;
};
/**
 * Creates a lazy injection for breaking circular dependencies.
 *
 * @param {string | symbol} token - Injection token
 * @returns {Function} Lazy getter function
 *
 * @example
 * ```typescript
 * class ServiceA {
 *   private getServiceB = createLazyInjection('SERVICE_B');
 *
 *   useServiceB() {
 *     const serviceB = this.getServiceB();
 *     return serviceB.doSomething();
 *   }
 * }
 * ```
 */
export declare const createLazyInjection: (token: string | symbol) => (injector?: any) => any;
/**
 * Creates a circular dependency resolver using ModuleRef.
 *
 * @param {any} moduleRef - NestJS ModuleRef instance
 * @param {string | symbol} token - Token to resolve
 * @returns {Function} Resolver function
 *
 * @example
 * ```typescript
 * const getCircularService = createCircularResolver(
 *   moduleRef,
 *   'CIRCULAR_SERVICE'
 * );
 * const service = await getCircularService();
 * ```
 */
export declare const createCircularResolver: (moduleRef: any, token: string | symbol) => () => Promise<any>;
/**
 * Creates a proxy for lazy circular dependency resolution.
 *
 * @param {Function} resolver - Function that resolves the dependency
 * @returns {Proxy} Proxy object
 *
 * @example
 * ```typescript
 * const serviceProxy = createCircularProxy(
 *   () => injector.get(ServiceClass)
 * );
 * serviceProxy.method(); // Resolves on first call
 * ```
 */
export declare const createCircularProxy: (resolver: () => any) => any;
/**
 * Creates a delayed injection wrapper for circular dependencies.
 *
 * @param {any} injector - Dependency injector
 * @param {string | symbol} token - Injection token
 * @returns {Object} Wrapper with delayed resolution
 *
 * @example
 * ```typescript
 * class ServiceA {
 *   private serviceBWrapper = createDelayedInjection(injector, 'SERVICE_B');
 *
 *   useServiceB() {
 *     return this.serviceBWrapper.get().doSomething();
 *   }
 * }
 * ```
 */
export declare const createDelayedInjection: (injector: any, token: string | symbol) => {
    get(): any;
    reset(): void;
};
/**
 * Creates an optional dependency with fallback value.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} [defaultValue] - Default value if not available
 * @returns {ProviderConfig} Optional provider configuration
 *
 * @example
 * ```typescript
 * const provider = createOptionalProvider('CACHE', new MemoryCache());
 * // Will use MemoryCache if CACHE provider not found
 * ```
 */
export declare const createOptionalProvider: (token: string | symbol, defaultValue?: any) => ProviderConfig;
/**
 * Creates a conditional optional dependency based on availability.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} callback - Callback if dependency available
 * @param {Function} [fallback] - Fallback if not available
 * @returns {Function} Conditional executor
 *
 * @example
 * ```typescript
 * const useCache = createConditionalOptional(
 *   'CACHE',
 *   (cache) => cache.get(key),
 *   () => fetchFromDatabase(key)
 * );
 * ```
 */
export declare const createConditionalOptional: (token: string | symbol, callback: (dependency: any) => any, fallback?: () => any) => (injector: any) => any;
/**
 * Creates a provider with optional dependencies in factory.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory with optional dependencies
 * @param {OptionalDependencyConfig[]} optionalDeps - Optional dependency configs
 * @returns {ProviderConfig} Provider with optional dependencies
 *
 * @example
 * ```typescript
 * const provider = createProviderWithOptionalDeps(
 *   'SERVICE',
 *   (logger, cache) => new Service(logger, cache),
 *   [
 *     { token: 'LOGGER', defaultValue: console },
 *     { token: 'CACHE', defaultValue: null }
 *   ]
 * );
 * ```
 */
export declare const createProviderWithOptionalDeps: (token: string | symbol, factory: (...args: any[]) => any, optionalDeps: OptionalDependencyConfig[]) => ProviderConfig;
/**
 * Creates a null-safe injection wrapper.
 *
 * @param {any} injector - Dependency injector
 * @param {string | symbol} token - Injection token
 * @returns {Object} Null-safe wrapper
 *
 * @example
 * ```typescript
 * const safeDep = createNullSafeInjection(injector, 'OPTIONAL_SERVICE');
 * safeDep.ifPresent((service) => service.doSomething());
 * ```
 */
export declare const createNullSafeInjection: (injector: any, token: string | symbol) => {
    get(): any | null;
    ifPresent(callback: (dependency: any) => void): void;
    orElse(fallback: any): any;
    orElseGet(fallbackFn: () => any): any;
};
/**
 * Creates a request-scoped provider.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate per request
 * @returns {ScopedProviderConfig} Request-scoped provider
 *
 * @example
 * ```typescript
 * const provider = createRequestScopedProvider(
 *   'REQUEST_CONTEXT',
 *   RequestContextService
 * );
 * ```
 */
export declare const createRequestScopedProvider: (token: string | symbol, useClass: any) => ScopedProviderConfig;
/**
 * Creates a transient provider (new instance per injection).
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate per injection
 * @returns {ScopedProviderConfig} Transient provider
 *
 * @example
 * ```typescript
 * const provider = createTransientProvider(
 *   'TASK_PROCESSOR',
 *   TaskProcessor
 * );
 * ```
 */
export declare const createTransientProvider: (token: string | symbol, useClass: any) => ScopedProviderConfig;
/**
 * Creates a singleton provider (default behavior made explicit).
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate once
 * @returns {ScopedProviderConfig} Singleton provider
 *
 * @example
 * ```typescript
 * const provider = createSingletonProvider(
 *   'DATABASE',
 *   DatabaseService
 * );
 * ```
 */
export declare const createSingletonProvider: (token: string | symbol, useClass: any) => ScopedProviderConfig;
/**
 * Creates a scoped factory provider.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {string} scope - Provider scope
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {ScopedProviderConfig} Scoped factory provider
 *
 * @example
 * ```typescript
 * const provider = createScopedFactoryProvider(
 *   'LOGGER',
 *   (request) => new RequestLogger(request.id),
 *   'REQUEST',
 *   [REQUEST]
 * );
 * ```
 */
export declare const createScopedFactoryProvider: (token: string | symbol, factory: (...args: any[]) => any, scope: "DEFAULT" | "REQUEST" | "TRANSIENT", inject?: any[]) => ScopedProviderConfig;
/**
 * Converts a singleton provider to request-scoped.
 *
 * @param {ProviderConfig} provider - Original provider
 * @returns {ScopedProviderConfig} Request-scoped version
 *
 * @example
 * ```typescript
 * const singletonProvider = { provide: 'SERVICE', useClass: Service };
 * const requestProvider = convertToRequestScoped(singletonProvider);
 * ```
 */
export declare const convertToRequestScoped: (provider: ProviderConfig) => ScopedProviderConfig;
/**
 * Composes multiple providers into a provider array.
 *
 * @param {...ProviderConfig[]} providers - Provider configurations
 * @returns {ProviderConfig[]} Array of providers
 *
 * @example
 * ```typescript
 * const providers = composeProviders(
 *   createClassProvider('SERVICE_A', ServiceA),
 *   createFactoryProvider('SERVICE_B', () => new ServiceB()),
 *   createValueProvider('CONFIG', { key: 'value' })
 * );
 * ```
 */
export declare const composeProviders: (...providers: ProviderConfig[]) => ProviderConfig[];
/**
 * Creates a provider decorator that wraps another provider.
 *
 * @param {ProviderConfig} provider - Base provider
 * @param {Function} decorator - Decorator function
 * @returns {ProviderConfig} Decorated provider
 *
 * @example
 * ```typescript
 * const loggingProvider = decorateProvider(
 *   serviceProvider,
 *   (instance) => new Proxy(instance, {
 *     get: (target, prop) => {
 *       console.log(`Accessing ${String(prop)}`);
 *       return target[prop];
 *     }
 *   })
 * );
 * ```
 */
export declare const decorateProvider: (provider: ProviderConfig, decorator: (instance: any) => any) => ProviderConfig;
/**
 * Creates a provider interceptor for logging/metrics.
 *
 * @param {ProviderConfig} provider - Base provider
 * @param {Function} interceptor - Interceptor function
 * @returns {ProviderConfig} Intercepted provider
 *
 * @example
 * ```typescript
 * const monitoredProvider = interceptProvider(
 *   serviceProvider,
 *   async (method, args, next) => {
 *     const start = Date.now();
 *     const result = await next();
 *     console.log(`${method} took ${Date.now() - start}ms`);
 *     return result;
 *   }
 * );
 * ```
 */
export declare const interceptProvider: (provider: ProviderConfig, interceptor: (method: string, args: any[], next: () => any) => any) => ProviderConfig;
/**
 * Creates a provider mixin combining multiple behaviors.
 *
 * @param {ProviderConfig} baseProvider - Base provider
 * @param {any[]} mixins - Mixin classes
 * @returns {ProviderConfig} Mixed provider
 *
 * @example
 * ```typescript
 * const enhancedProvider = mixinProvider(
 *   serviceProvider,
 *   [LoggingMixin, CachingMixin, ValidationMixin]
 * );
 * ```
 */
export declare const mixinProvider: (baseProvider: ProviderConfig, mixins: any[]) => ProviderConfig;
/**
 * Creates a mock provider for testing.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} mockImplementation - Mock implementation
 * @returns {ProviderConfig} Mock provider
 *
 * @example
 * ```typescript
 * const mockProvider = createMockProvider('USER_SERVICE', {
 *   findById: jest.fn().mockResolvedValue({ id: '123' }),
 *   create: jest.fn().mockResolvedValue({ id: '456' })
 * });
 * ```
 */
export declare const createMockProvider: (token: string | symbol, mockImplementation: any) => ProviderConfig;
/**
 * Creates a spy provider for testing with original implementation.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} originalProvider - Original provider
 * @param {Function} spyFn - Spy function
 * @returns {ProviderConfig} Spy provider
 *
 * @example
 * ```typescript
 * const spyProvider = createSpyProvider(
 *   'SERVICE',
 *   originalService,
 *   (method, args, result) => console.log(method, args, result)
 * );
 * ```
 */
export declare const createSpyProvider: (token: string | symbol, originalProvider: any, spyFn: (method: string, args: any[], result: any) => void) => ProviderConfig;
/**
 * Creates a stub provider for testing with predefined responses.
 *
 * @param {string | symbol} token - Injection token
 * @param {Record<string, any>} stubs - Method stubs
 * @returns {ProviderConfig} Stub provider
 *
 * @example
 * ```typescript
 * const stubProvider = createStubProvider('API_CLIENT', {
 *   get: Promise.resolve({ data: 'test' }),
 *   post: Promise.resolve({ success: true })
 * });
 * ```
 */
export declare const createStubProvider: (token: string | symbol, stubs: Record<string, any>) => ProviderConfig;
/**
 * Creates a provider override for testing modules.
 *
 * @param {string | symbol} originalToken - Original token to override
 * @param {any} testImplementation - Test implementation
 * @returns {Object} Override configuration
 *
 * @example
 * ```typescript
 * const override = createProviderOverride(
 *   'DATABASE',
 *   mockDatabase
 * );
 * const module = await Test.createTestingModule({
 *   providers: [override]
 * });
 * ```
 */
export declare const createProviderOverride: (originalToken: string | symbol, testImplementation: any) => {
    token: string | symbol;
    provider: {
        provide: string | symbol;
        useValue: any;
    };
};
/**
 * Creates a provider registry for managing dynamic providers.
 *
 * @returns {Object} Provider registry
 *
 * @example
 * ```typescript
 * const registry = createProviderRegistry();
 * registry.register('SERVICE_A', ServiceA);
 * const provider = registry.get('SERVICE_A');
 * ```
 */
export declare const createProviderRegistry: () => {
    register(token: string | symbol, provider: ProviderConfig | any): void;
    get(token: string | symbol): ProviderConfig | undefined;
    has(token: string | symbol): boolean;
    remove(token: string | symbol): boolean;
    getAll(): ProviderConfig[];
    clear(): void;
    size(): number;
};
/**
 * Creates a provider factory registry for plugin systems.
 *
 * @returns {Object} Factory registry
 *
 * @example
 * ```typescript
 * const factoryRegistry = createProviderFactoryRegistry();
 * factoryRegistry.registerFactory('logger', (config) => new Logger(config));
 * const logger = factoryRegistry.create('logger', { level: 'debug' });
 * ```
 */
export declare const createProviderFactoryRegistry: () => {
    registerFactory(name: string, factory: (...args: any[]) => any): void;
    create(name: string, ...args: any[]): any;
    has(name: string): boolean;
    remove(name: string): boolean;
    listFactories(): string[];
};
/**
 * Creates a hierarchical provider registry with parent-child relationships.
 *
 * @param {any} [parent] - Parent registry
 * @returns {Object} Hierarchical registry
 *
 * @example
 * ```typescript
 * const globalRegistry = createHierarchicalRegistry();
 * const moduleRegistry = createHierarchicalRegistry(globalRegistry);
 * moduleRegistry.register('LOCAL', LocalService);
 * // Falls back to parent if not found locally
 * ```
 */
export declare const createHierarchicalRegistry: (parent?: any) => {
    register(token: string | symbol, provider: ProviderConfig): void;
    get(token: string | symbol): ProviderConfig | undefined;
    has(token: string | symbol): boolean;
    getLocal(token: string | symbol): ProviderConfig | undefined;
    getAllLocal(): ProviderConfig[];
    getParent(): any;
};
export {};
//# sourceMappingURL=nestjs-di-kit.d.ts.map