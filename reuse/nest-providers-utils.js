"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFactoryProvider = createFactoryProvider;
exports.createAsyncFactoryProvider = createAsyncFactoryProvider;
exports.createValueProvider = createValueProvider;
exports.createClassProvider = createClassProvider;
exports.createAliasProvider = createAliasProvider;
exports.createScopedFactoryProvider = createScopedFactoryProvider;
exports.createMultiProvider = createMultiProvider;
exports.createConditionalProvider = createConditionalProvider;
exports.createInjectDecorator = createInjectDecorator;
exports.createOptionalInjectDecorator = createOptionalInjectDecorator;
exports.getProviderInstance = getProviderInstance;
exports.createLazyProvider = createLazyProvider;
exports.createCompositeProvider = createCompositeProvider;
exports.wrapServiceWithDecorator = wrapServiceWithDecorator;
exports.createProviderChain = createProviderChain;
exports.createAsyncProviderWithRetry = createAsyncProviderWithRetry;
exports.createAsyncProviderWithTimeout = createAsyncProviderWithTimeout;
exports.createValidatedAsyncProvider = createValidatedAsyncProvider;
exports.createDynamicModule = createDynamicModule;
exports.createForRootMethod = createForRootMethod;
exports.createForFeatureMethod = createForFeatureMethod;
exports.makeGlobalModule = makeGlobalModule;
exports.createRequestScopedProvider = createRequestScopedProvider;
exports.createTransientProvider = createTransientProvider;
exports.toRequestScope = toRequestScope;
exports.createEnvironmentScopedProvider = createEnvironmentScopedProvider;
exports.createInjectionToken = createInjectionToken;
exports.createSymbolToken = createSymbolToken;
exports.getProviderToken = getProviderToken;
exports.isSymbolToken = isSymbolToken;
exports.createMultiProviderWithFactories = createMultiProviderWithFactories;
exports.aggregateProviders = aggregateProviders;
exports.createProviderWithOptionalDependency = createProviderWithOptionalDependency;
exports.createSafeProvider = createSafeProvider;
exports.createForwardRef = createForwardRef;
exports.createCircularDependencyResolver = createCircularDependencyResolver;
exports.createDelayedCircularProvider = createDelayedCircularProvider;
/**
 * LOC: 9D1E8F2A45
 * File: /reuse/nest-providers-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common, @nestjs/core (NestJS framework)
 *   - reflect-metadata (Metadata reflection)
 *
 * DOWNSTREAM (imported by):
 *   - backend/src/**/ 
    * .module.ts(Dynamic, modules)
    * -backend / src /**/ * .service.ts(Service, providers)
    * -backend / src /**/ * .provider.ts(Custom, providers)
    * /;
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
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
// ============================================================================
// PROVIDER FACTORY FUNCTIONS
// ============================================================================
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
function createFactoryProvider(token, factory, inject = []) {
    return {
        provide: token,
        useFactory: factory,
        inject,
    };
}
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
function createAsyncFactoryProvider(token, asyncFactory, inject = []) {
    return {
        provide: token,
        useFactory: asyncFactory,
        inject,
    };
}
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
function createValueProvider(token, value) {
    return {
        provide: token,
        useValue: value,
    };
}
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
function createClassProvider(classType, token) {
    return {
        provide: token || classType,
        useClass: classType,
    };
}
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
function createAliasProvider(aliasToken, existingToken) {
    return {
        provide: aliasToken,
        useExisting: existingToken,
    };
}
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
function createScopedFactoryProvider(token, factory, scope, inject = []) {
    return {
        provide: token,
        useFactory: factory,
        inject,
        scope,
    };
}
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
function createMultiProvider(token, values) {
    return values.map((value, index) => ({
        provide: token,
        useValue: value,
        multi: index === 0 ? true : undefined,
    }));
}
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
function createConditionalProvider(token, productionClass, developmentClass, env = process.env.NODE_ENV || 'development') {
    const useClass = env === 'production' ? productionClass : developmentClass;
    return {
        provide: token,
        useClass,
    };
}
// ============================================================================
// DEPENDENCY INJECTION HELPERS
// ============================================================================
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
function createInjectDecorator(token) {
    return (0, common_1.Inject)(token);
}
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
function createOptionalInjectDecorator(token) {
    return function (target, propertyKey, parameterIndex) {
        (0, common_1.Inject)(token)(target, propertyKey, parameterIndex);
        // Mark as optional in metadata
        const existingOptional = Reflect.getMetadata('optional:params', target) || [];
        Reflect.defineMetadata('optional:params', [...existingOptional, parameterIndex], target);
    };
}
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
async function getProviderInstance(moduleRef, token, options) {
    try {
        return await moduleRef.resolve(token, undefined, options);
    }
    catch (error) {
        if (!options?.strict) {
            return moduleRef.get(token, { strict: false });
        }
        throw error;
    }
}
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
function createLazyProvider(token, lazyToken) {
    return {
        provide: token,
        useFactory: (moduleRef) => {
            let instance = null;
            return new Proxy({}, {
                get: (target, prop) => {
                    if (!instance) {
                        instance = moduleRef.get(lazyToken, { strict: false });
                    }
                    return instance[prop];
                },
            });
        },
        inject: [core_1.ModuleRef],
    };
}
// ============================================================================
// SERVICE COMPOSITION UTILITIES
// ============================================================================
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
function createCompositeProvider(token, serviceTokens, composer) {
    return {
        provide: token,
        useFactory: (...services) => composer(services),
        inject: serviceTokens,
    };
}
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
function wrapServiceWithDecorator(serviceClass, decorator) {
    return {
        provide: serviceClass,
        useFactory: (originalService) => {
            const decorations = decorator(originalService);
            return new Proxy(originalService, {
                get(target, prop) {
                    return decorations[prop] || target[prop];
                },
            });
        },
        inject: [{ token: serviceClass, optional: false }],
    };
}
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
function createProviderChain(providers) {
    return providers;
}
// ============================================================================
// ASYNC PROVIDER BUILDERS
// ============================================================================
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
function createAsyncProviderWithRetry(token, asyncFactory, options = {}) {
    const { maxRetries = 3, retryDelay = 1000 } = options;
    return {
        provide: token,
        useFactory: async () => {
            let lastError;
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    return await asyncFactory();
                }
                catch (error) {
                    lastError = error;
                    if (attempt < maxRetries) {
                        await new Promise((resolve) => setTimeout(resolve, retryDelay));
                    }
                }
            }
            throw new Error(`Failed to initialize ${String(token)} after ${maxRetries} retries: ${lastError.message}`);
        },
    };
}
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
function createAsyncProviderWithTimeout(token, asyncFactory, timeoutMs) {
    return {
        provide: token,
        useFactory: async () => {
            return Promise.race([
                asyncFactory(),
                new Promise((_, reject) => setTimeout(() => reject(new Error(`Provider ${String(token)} initialization timeout`)), timeoutMs)),
            ]);
        },
    };
}
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
function createValidatedAsyncProvider(token, asyncFactory, validator) {
    return {
        provide: token,
        useFactory: async () => {
            const value = await asyncFactory();
            const isValid = await validator(value);
            if (!isValid) {
                throw new Error(`Provider ${String(token)} validation failed`);
            }
            return value;
        },
    };
}
// ============================================================================
// DYNAMIC MODULE PROVIDERS
// ============================================================================
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
function createDynamicModule(config) {
    return (options) => ({
        module: class DynamicModuleHost {
        },
        providers: config.providers ? config.providers(options) : [],
        imports: config.imports || [],
        exports: config.exports || [],
    });
}
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
function createForRootMethod(moduleClass, providerFactory) {
    return (options) => ({
        module: moduleClass,
        providers: providerFactory(options),
        exports: providerFactory(options),
        global: true,
    });
}
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
function createForFeatureMethod(moduleClass, providerFactory) {
    return (features) => ({
        module: moduleClass,
        providers: providerFactory(features),
        exports: providerFactory(features),
    });
}
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
function makeGlobalModule(dynamicModule) {
    return {
        ...dynamicModule,
        global: true,
    };
}
// ============================================================================
// SCOPED PROVIDER UTILITIES
// ============================================================================
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
function createRequestScopedProvider(token, classType, onDestroy) {
    if (onDestroy) {
        // Add destroy hook via prototype
        const originalOnDestroy = classType.prototype.onModuleDestroy;
        classType.prototype.onModuleDestroy = async function () {
            await onDestroy(this);
            if (originalOnDestroy) {
                await originalOnDestroy.call(this);
            }
        };
    }
    return {
        provide: token,
        useClass: classType,
        scope: common_1.Scope.REQUEST,
    };
}
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
function createTransientProvider(classType) {
    return {
        provide: classType,
        useClass: classType,
        scope: common_1.Scope.TRANSIENT,
    };
}
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
function toRequestScope(provider) {
    return {
        ...provider,
        scope: common_1.Scope.REQUEST,
    };
}
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
function createEnvironmentScopedProvider(provider, options) {
    const env = process.env.NODE_ENV || 'development';
    const scope = (env === 'production' && options.production) ||
        (env === 'development' && options.development) ||
        (env === 'test' && options.test) ||
        common_1.Scope.DEFAULT;
    return {
        ...provider,
        scope,
    };
}
// ============================================================================
// PROVIDER TOKEN HELPERS
// ============================================================================
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
function createInjectionToken(namespace, name) {
    return `${namespace}:${name}`;
}
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
function createSymbolToken(description) {
    return Symbol.for(description);
}
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
function getProviderToken(provider) {
    return provider.provide;
}
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
function isSymbolToken(token) {
    return typeof token === 'symbol';
}
// ============================================================================
// MULTI-PROVIDER UTILITIES
// ============================================================================
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
function createMultiProviderWithFactories(token, factories) {
    return factories.map((factory, index) => ({
        provide: token,
        useFactory: factory,
        multi: index === 0 ? true : undefined,
    }));
}
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
function aggregateProviders(providers) {
    return providers.flat();
}
// ============================================================================
// OPTIONAL DEPENDENCY HANDLERS
// ============================================================================
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
function createProviderWithOptionalDependency(token, classType, optionalDep, fallbackValue) {
    return {
        provide: token,
        useFactory: (optionalService) => {
            return new classType(optionalService || fallbackValue);
        },
        inject: [{ token: optionalDep, optional: true }],
    };
}
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
function createSafeProvider(token, factory, fallback) {
    return {
        provide: token,
        useFactory: async () => {
            try {
                return await factory();
            }
            catch (error) {
                console.error(`Provider ${String(token)} initialization failed:`, error);
                return fallback;
            }
        },
    };
}
// ============================================================================
// CIRCULAR DEPENDENCY RESOLVERS
// ============================================================================
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
function createForwardRef(forwardRef) {
    return { forwardRef };
}
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
function createCircularDependencyResolver(token, circularDepToken) {
    return {
        provide: token,
        useFactory: async (moduleRef) => {
            const circularDep = await moduleRef.resolve(circularDepToken);
            return { circularDep };
        },
        inject: [core_1.ModuleRef],
    };
}
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
function createDelayedCircularProvider(classType, propertyKey) {
    return {
        provide: classType,
        useClass: classType,
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Provider factories
    createFactoryProvider,
    createAsyncFactoryProvider,
    createValueProvider,
    createClassProvider,
    createAliasProvider,
    createScopedFactoryProvider,
    createMultiProvider,
    createConditionalProvider,
    // Dependency injection helpers
    createInjectDecorator,
    createOptionalInjectDecorator,
    getProviderInstance,
    createLazyProvider,
    // Service composition
    createCompositeProvider,
    wrapServiceWithDecorator,
    createProviderChain,
    // Async providers
    createAsyncProviderWithRetry,
    createAsyncProviderWithTimeout,
    createValidatedAsyncProvider,
    // Dynamic modules
    createDynamicModule,
    createForRootMethod,
    createForFeatureMethod,
    makeGlobalModule,
    // Scoped providers
    createRequestScopedProvider,
    createTransientProvider,
    toRequestScope,
    createEnvironmentScopedProvider,
    // Provider tokens
    createInjectionToken,
    createSymbolToken,
    getProviderToken,
    isSymbolToken,
    // Multi-providers
    createMultiProviderWithFactories,
    aggregateProviders,
    // Optional dependencies
    createProviderWithOptionalDependency,
    createSafeProvider,
    // Circular dependencies
    createForwardRef,
    createCircularDependencyResolver,
    createDelayedCircularProvider,
};
//# sourceMappingURL=nest-providers-utils.js.map